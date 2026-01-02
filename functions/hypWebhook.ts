import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // TODO: Validate HYP webhook signature when API is available
    // const signature = req.headers.get('X-HYP-Signature');
    // validateSignature(signature, body);

    const body = await req.json();
    
    // Expected webhook structure (adjust when HYP API is available):
    // {
    //   transaction_id: string,
    //   registration_id: string,
    //   amount: number,
    //   status: 'success' | 'failed',
    //   payment_method: string,
    //   timestamp: string
    // }

    const { transaction_id, registration_id, amount, status, payment_method } = body;

    if (!registration_id || !transaction_id) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get registration
    const registration = await base44.asServiceRole.entities.NifgashimRegistration.get(registration_id);
    
    if (!registration) {
      return Response.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (status === 'success') {
      const newAmountPaid = (registration.amount_paid || 0) + amount;
      const newPaymentStatus = newAmountPaid >= registration.total_amount ? 'completed' : 'partial';

      // Update registration
      await base44.asServiceRole.entities.NifgashimRegistration.update(registration_id, {
        amount_paid: newAmountPaid,
        payment_status: newPaymentStatus,
        payment_transactions: [
          ...(registration.payment_transactions || []),
          {
            transaction_id,
            amount,
            timestamp: new Date().toISOString(),
            method: payment_method || 'hyp'
          }
        ]
      });

      // Send confirmation email
      try {
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">✅ Payment Received</h1>
            </div>
            
            <div style="padding: 30px; background: white;">
              <p>Your payment of ${amount}₪ has been received successfully.</p>
              <p><strong>Transaction ID:</strong> ${transaction_id}</p>
              <p><strong>New Status:</strong> ${newPaymentStatus}</p>
              <p style="margin-top: 30px; color: #10b981; font-weight: bold;">Thank you!</p>
            </div>
          </div>
        `;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: registration.user_email,
          subject: 'Payment Confirmation - Nifgashim for Israel',
          body: emailBody
        });
      } catch (e) {
        console.error('Failed to send email:', e);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});