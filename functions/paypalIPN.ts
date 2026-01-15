import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const rawBody = await req.text();
    const verifyData = new URLSearchParams(rawBody);
    verifyData.set('cmd', '_notify-validate');

    const verifyResponse = await fetch('https://ipnpb.paypal.com/cgi-bin/webscr', {
      method: 'POST',
      body: verifyData.toString()
    });

    const verifyText = await verifyResponse.text();
    
    if (verifyText !== 'VERIFIED') {
      console.error('PayPal IPN verification failed:', verifyText);
      return new Response('INVALID', { status: 200 });
    }

    const params = new URLSearchParams(rawBody);
    const paymentStatus = params.get('payment_status');
    const customField = params.get('custom');
    const payerEmail = params.get('payer_email') || params.get('custom_email') || '';
    const receiverEmail = params.get('receiver_email');
    const amount = params.get('mc_gross');
    const currency = params.get('mc_currency');
    const txnId = params.get('txn_id');

    console.log('IPN Verified - Payment Status:', paymentStatus, 'Custom:', customField);

    if (paymentStatus !== 'Completed') {
      console.log('Skipping IPN - Status:', paymentStatus);
      return new Response('OK', { status: 200 });
    }

    let registrationHandled = false;

    if (customField) {
      try {
        const registrations = await base44.asServiceRole.entities.NifgashimRegistration.filter({
          id: customField
        });

        if (registrations && registrations.length > 0) {
          const registration = registrations[0];

          await base44.asServiceRole.entities.NifgashimRegistration.update(customField, {
            status: 'completed',
            payment_status: 'completed',
            amount_paid: parseFloat(amount || '0') || registration.amount_paid || 0,
            transaction_id: txnId,
            completed_at: new Date().toISOString()
          });

          const trips = await base44.asServiceRole.entities.Trip.filter({
            id: registration.trip_id
          });

          if (trips && trips.length > 0) {
            const trip = trips[0];

            const participantsData = registration.participants.map((p: any) => ({
              email: p.email || payerEmail,
              name: p.name,
              id_number: p.id_number,
              phone: p.phone,
              joined_at: new Date().toISOString(),
              selected_days: registration.selectedDays?.map((d: any) => d.day_number) || [],
              waiver_accepted: true,
              waiver_timestamp: new Date().toISOString(),
              is_organized_group: registration.userType === 'group',
              group_type: registration.userType === 'group' ? 'other' : null,
              group_name: registration.userType === 'group' ? registration.groupInfo?.name : null,
              vehicle_number: registration.vehicleInfo?.hasVehicle ? registration.vehicleInfo?.number : null,
              has_vehicle: registration.vehicleInfo?.hasVehicle || false,
              payment_status: 'completed',
              payment_amount: registration.amount,
              payment_transaction_id: txnId
            }));

            const currentParticipants = trip.participants || [];
            await base44.asServiceRole.entities.Trip.update(trip.id, {
              participants: [...currentParticipants, ...participantsData]
            });

            if (registration.memorialData?.memorial?.fallen_name) {
              await base44.asServiceRole.entities.Memorial.create({
                trip_id: trip.id,
                ...registration.memorialData.memorial,
                status: 'pending'
              });
            }

            const payerEmailToUse =
              registration.userType === 'group'
                ? registration.groupInfo?.leaderEmail
                : registration.participants[0]?.email || payerEmail;

            const payerName =
              registration.userType === 'group'
                ? registration.groupInfo?.leaderName
                : registration.participants[0]?.name;

            if (payerEmailToUse) {
              try {
                await base44.asServiceRole.integrations.Core.SendEmail({
                  to: payerEmailToUse,
                  subject: 'אישור תשלום והרשמה - נפגשים בשביל ישראל / Payment Confirmation - Nifgashim',
                  body: `שלום ${payerName},\n\nהתשלום בוצע בהצלחה!\n\nפרטי ההרשמה:\n• מספר משתתפים: ${registration.participants.length}\n• סכום ששולם: ${registration.amount}₪\n• קוד עסקה: ${txnId}\n\nנתראה במסע!\nצוות נפגשים\n\n---\n\nHello ${payerName},\n\nPayment successful!\n\nRegistration details:\n• Participants: ${registration.participants.length}\n• Amount paid: ${registration.amount}₪\n• Transaction ID: ${txnId}\n\nSee you on the trek!\nNifgashim Team`
                });
              } catch (emailErr) {
                console.error('Failed to send confirmation email:', emailErr);
              }
            }

            try {
              const adminEmail = trip.organizer_email;
              if (adminEmail) {
                await base44.asServiceRole.integrations.Core.SendEmail({
                  to: adminEmail,
                  subject: `New Paid Registration: ${payerName}`,
                  body: `New registration completed with payment.\n\nUser: ${payerName} (${payerEmailToUse})\nParticipants: ${registration.participants.length}\nAmount: ${registration.amount}₪\nTransaction: ${txnId}\nType: ${registration.userType}`
                });
              }
            } catch (adminEmailError) {
              console.error('Failed to send admin email:', adminEmailError);
            }
          }

          registrationHandled = true;
        }
      } catch (regErr) {
        console.error('Failed to process registration from IPN:', regErr);
      }
    }

    if (registrationHandled) {
      return new Response('OK', { status: 200 });
    }

    if (!payerEmail) {
      console.log('No payer email, nothing to update');
      return new Response('OK', { status: 200 });
    }

    const trips = await base44.asServiceRole.entities.Trip.filter({});

    for (const trip of trips) {
      if (!trip.participants) continue;

      const participant = trip.participants.find((p: any) => p.email === payerEmail);
      if (participant) {
        participant.payment_status = 'completed';
        participant.payment_transaction_id = txnId;
        participant.payment_timestamp = new Date().toISOString();

        await base44.asServiceRole.entities.Trip.update(trip.id, {
          participants: trip.participants
        });

        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: payerEmail,
            subject: 'אישור תשלום - נפגשים בשביל ישראל / Payment Confirmed - Nifgashim',
            body: `שלום,\n\nתשלומך בוצע בהצלחה!\nTransaction ID: ${txnId}\nAmount: ${amount} ${currency}\n\nתודה!\n\n---\n\nHello,\n\nYour payment has been completed successfully!\nTransaction ID: ${txnId}\nAmount: ${amount} ${currency}\n\nThank you!`
          });
        } catch (emailErr) {
          console.error('Failed to send confirmation email:', emailErr);
        }

        return new Response('OK', { status: 200 });
      }
    }

    console.log('No matching participant found for:', payerEmail);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('IPN handler error:', error.message);
    return new Response('ERROR', { status: 500 });
  }
});
