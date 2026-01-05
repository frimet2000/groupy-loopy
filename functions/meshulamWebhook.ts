import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Parse webhook data
    const webhookData = await req.json();
    console.log('Meshulam webhook received:', JSON.stringify(webhookData, null, 2));

    // Extract data based on webhook format (PaymentLinks or regular)
    const transactionId = webhookData.data?.transactionId || webhookData.transactionCode;
    const status = webhookData.data?.status || webhookData.paymentType;
    const customerEmail = webhookData.data?.payerEmail || webhookData.payerEmail;
    const customFields = webhookData.data?.dynamicFields || webhookData.purchaseCustomField || {};

    // Extract registration_id from custom fields
    let registrationId = null;
    if (Array.isArray(customFields)) {
      const regField = customFields.find(f => f.key === 'registration_id' || f.label === 'registration_id');
      registrationId = regField?.field_value;
    } else if (typeof customFields === 'object') {
      registrationId = customFields.registration_id;
    }

    if (!registrationId) {
      console.error('No registration_id in webhook data');
      return Response.json({ error: 'Missing registration_id' }, { status: 400 });
    }

    // Get registration
    const registrations = await base44.asServiceRole.entities.NifgashimRegistration.filter({ 
      id: registrationId 
    });

    if (!registrations || registrations.length === 0) {
      console.error('Registration not found:', registrationId);
      return Response.json({ error: 'Registration not found' }, { status: 404 });
    }

    const registration = registrations[0];

    // Check if payment is successful
    const isSuccessful = 
      status === 'שולם' || 
      status === '2' || 
      webhookData.data?.statusCode === '2' ||
      webhookData.paymentType === 'רגיל';

    if (!isSuccessful) {
      console.log('Payment not successful, status:', status);
      return Response.json({ message: 'Payment not successful' }, { status: 200 });
    }

    // Update registration status
    await base44.asServiceRole.entities.NifgashimRegistration.update(registrationId, {
      status: 'completed',
      transaction_id: transactionId,
      completed_at: new Date().toISOString()
    });

    // Get trip
    const trips = await base44.asServiceRole.entities.Trip.filter({ 
      id: registration.trip_id 
    });

    if (!trips || trips.length === 0) {
      console.error('Trip not found:', registration.trip_id);
      return Response.json({ error: 'Trip not found' }, { status: 404 });
    }

    const trip = trips[0];

    // Add participants to trip
    const participantsData = registration.participants.map(p => ({
      email: p.email || customerEmail,
      name: p.name,
      id_number: p.id_number,
      phone: p.phone,
      joined_at: new Date().toISOString(),
      selected_days: registration.selectedDays?.map(d => d.day_number) || [],
      waiver_accepted: true,
      waiver_timestamp: new Date().toISOString(),
      is_organized_group: registration.userType === 'group',
      group_type: registration.userType === 'group' ? 'other' : null,
      group_name: registration.userType === 'group' ? registration.groupInfo?.name : null,
      vehicle_number: registration.vehicleInfo?.hasVehicle ? registration.vehicleInfo?.number : null,
      has_vehicle: registration.vehicleInfo?.hasVehicle || false,
      payment_status: 'completed',
      payment_amount: registration.amount,
      payment_transaction_id: transactionId
    }));

    const currentParticipants = trip.participants || [];
    await base44.asServiceRole.entities.Trip.update(trip.id, {
      participants: [...currentParticipants, ...participantsData]
    });

    // Handle memorial if exists
    if (registration.memorialData?.memorial?.fallen_name) {
      await base44.asServiceRole.entities.Memorial.create({
        trip_id: trip.id,
        ...registration.memorialData.memorial,
        status: 'pending'
      });
    }

    // Send confirmation email
    const payerEmail = registration.userType === 'group' 
      ? registration.groupInfo?.leaderEmail 
      : registration.participants[0]?.email;
    
    const payerName = registration.userType === 'group' 
      ? registration.groupInfo?.leaderName 
      : registration.participants[0]?.name;

    if (payerEmail) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: payerEmail,
          subject: 'אישור תשלום והרשמה - נפגשים בשביל ישראל / Payment Confirmation - Nifgashim',
          body: `שלום ${payerName},\n\nהתשלום בוצע בהצלחה!\n\nפרטי ההרשמה:\n• מספר משתתפים: ${registration.participants.length}\n• סכום ששולם: ${registration.amount}₪\n• קוד עסקה: ${transactionId}\n\nנתראה במסע!\nצוות נפגשים\n\n---\n\nHello ${payerName},\n\nPayment successful!\n\nRegistration details:\n• Participants: ${registration.participants.length}\n• Amount paid: ${registration.amount}₪\n• Transaction ID: ${transactionId}\n\nSee you on the trek!\nNifgashim Team`
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    // Send admin notification
    try {
      const adminEmail = trip.organizer_email;
      if (adminEmail) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: adminEmail,
          subject: `New Paid Registration: ${payerName}`,
          body: `New registration completed with payment.\n\nUser: ${payerName} (${payerEmail})\nParticipants: ${registration.participants.length}\nAmount: ${registration.amount}₪\nTransaction: ${transactionId}\nType: ${registration.userType}`
        });
      }
    } catch (adminEmailError) {
      console.error('Failed to send admin email:', adminEmailError);
    }

    console.log('Payment processed successfully for registration:', registrationId);
    return Response.json({ 
      success: true,
      message: 'Payment processed successfully' 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});