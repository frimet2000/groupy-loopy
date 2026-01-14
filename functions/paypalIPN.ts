import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get raw body for verification
    const rawBody = await req.text();
    
    // Verify with PayPal
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

    // Parse IPN data
    const params = new URLSearchParams(rawBody);
    const paymentStatus = params.get('payment_status');
    const customEmail = params.get('custom');
    const receiverEmail = params.get('receiver_email');
    const amount = params.get('mc_gross');
    const currency = params.get('mc_currency');
    const txnId = params.get('txn_id');

    console.log('IPN Verified - Payment Status:', paymentStatus, 'Email:', customEmail);

    // Only process completed payments
    if (paymentStatus !== 'Completed' || !customEmail) {
      console.log('Skipping IPN - Status:', paymentStatus, 'Email:', customEmail);
      return new Response('OK', { status: 200 });
    }

    // Find registration and update payment status
    const trips = await base44.asServiceRole.entities.Trip.filter({});
    
    for (const trip of trips) {
      if (!trip.participants) continue;
      
      const participant = trip.participants.find(p => p.email === customEmail);
      if (participant) {
        participant.payment_status = 'completed';
        participant.payment_transaction_id = txnId;
        participant.payment_timestamp = new Date().toISOString();
        
        await base44.asServiceRole.entities.Trip.update(trip.id, {
          participants: trip.participants
        });

        console.log('Payment confirmed for:', customEmail, 'TxnID:', txnId);

        // Send confirmation email
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: customEmail,
            subject: 'אישור תשלום - נפגשים בשביל ישראל / Payment Confirmed - Nifgashim',
            body: `שלום,\n\nתשלומך בוצע בהצלחה!\nTransaction ID: ${txnId}\nAmount: ${amount} ${currency}\n\nתודה!\n\n---\n\nHello,\n\nYour payment has been completed successfully!\nTransaction ID: ${txnId}\nAmount: ${amount} ${currency}\n\nThank you!`
          });
        } catch (emailErr) {
          console.error('Failed to send confirmation email:', emailErr);
        }

        return new Response('OK', { status: 200 });
      }
    }

    console.log('No matching participant found for:', customEmail);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('IPN handler error:', error.message);
    return new Response('ERROR', { status: 500 });
  }
});