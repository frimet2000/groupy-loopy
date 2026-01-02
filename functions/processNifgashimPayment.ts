import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { registrationId, amount, method, language = 'he' } = await req.json();

    // Get registration
    const registration = await base44.entities.NifgashimRegistration.get(registrationId);
    
    if (!registration) {
      return Response.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (registration.user_email !== user.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // TODO: Integrate with HYP API when available
    // For now, simulate payment processing
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success (90% success rate for demo)
    const success = Math.random() > 0.1;

    if (success) {
      const newAmountPaid = (registration.amount_paid || 0) + amount;
      const newPaymentStatus = newAmountPaid >= registration.total_amount ? 'completed' : 'partial';

      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Update registration
      await base44.entities.NifgashimRegistration.update(registrationId, {
        amount_paid: newAmountPaid,
        payment_status: newPaymentStatus,
        payment_transactions: [
          ...(registration.payment_transactions || []),
          {
            transaction_id: transactionId,
            amount,
            timestamp: new Date().toISOString(),
            method
          }
        ]
      });

      // Send confirmation email
      try {
        const translations = {
          he: {
            subject: 'אישור תשלום - נפגשים בשביל ישראל',
            greeting: 'שלום,',
            paymentReceived: 'התשלום שלך התקבל בהצלחה!',
            details: 'פרטי התשלום:',
            amount: 'סכום',
            method: 'אמצעי תשלום',
            transactionId: 'מספר עסקה',
            newStatus: 'סטטוס חדש',
            thanksForPayment: 'תודה על התשלום!',
            team: 'צוות נפגשים בשביל ישראל'
          },
          en: {
            subject: 'Payment Confirmation - Nifgashim for Israel',
            greeting: 'Hello,',
            paymentReceived: 'Your payment has been received successfully!',
            details: 'Payment Details:',
            amount: 'Amount',
            method: 'Payment Method',
            transactionId: 'Transaction ID',
            newStatus: 'New Status',
            thanksForPayment: 'Thank you for your payment!',
            team: 'Nifgashim for Israel Team'
          }
        };

        const t = translations[language] || translations.he;

        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: ${language === 'he' ? 'rtl' : 'ltr'};">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">✅ ${t.paymentReceived}</h1>
            </div>
            
            <div style="padding: 30px; background: white;">
              <p style="font-size: 16px; color: #374151;">${t.greeting}</p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1f2937;">${t.details}</h3>
                <p><strong>${t.amount}:</strong> ${amount}₪</p>
                <p><strong>${t.method}:</strong> ${method}</p>
                <p><strong>${t.transactionId}:</strong> ${transactionId}</p>
                <p><strong>${t.newStatus}:</strong> ${newPaymentStatus}</p>
              </div>

              <p style="margin-top: 30px; font-size: 18px; color: #10b981; font-weight: bold;">${t.thanksForPayment}</p>
              <p style="color: #6b7280;">${t.team}</p>
            </div>
          </div>
        `;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: registration.user_email,
          subject: t.subject,
          body: emailBody
        });
      } catch (e) {
        console.error('Failed to send payment confirmation email:', e);
      }

      return Response.json({ 
        success: true, 
        transactionId,
        newPaymentStatus 
      });
    } else {
      return Response.json({ 
        success: false, 
        error: 'Payment failed' 
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});