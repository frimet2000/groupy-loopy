import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { amount, customerEmail, customerName, registrationId } = await req.json();
    
    if (!amount || amount <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const pageCode = Deno.env.get('GROW_PAGE_CODE') || '30f1b9975952';
    const userId = Deno.env.get('GROW_USER_ID') || '5c04d711acb29250';
    
    // Use the PaymentSuccess page as success URL
    const baseUrl = req.headers.get('origin') || 'https://groupyloopy.app';
    const successUrl = `${baseUrl}/PaymentSuccess?registration_id=${registrationId || ''}`;
    
    const form = new FormData();
    form.append('pageCode', pageCode);
    form.append('userId', userId);
    form.append('sum', amount.toString());
    form.append('successUrl', successUrl);
    form.append('cancelUrl', `${baseUrl}/NifgashimPortal`);
    form.append('description', `הרשמה למסע נפגשים - ${customerName || ''}`);
    form.append('paymentNum', '1');
    form.append('maxPaymentNum', '12');
    
    if (customerEmail) {
      form.append('cField1', customerEmail);
    }
    if (customerName) {
      form.append('cField2', customerName);
    }
    if (registrationId) {
      form.append('cField3', registrationId);
    }

    // Use sandbox for testing, production for live
    const apiUrl = 'https://sandbox.meshulam.co.il/api/light/server/1.0/createPaymentProcess';
    // For production: 'https://secure.meshulam.co.il/api/light/server/1.0/createPaymentProcess'

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: form,
      headers: {
        'accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Grow API response:', data);

    if (data.status === 1 && data.data?.url) {
      return Response.json({
        success: true,
        paymentUrl: data.data.url,
        processId: data.data.processId
      });
    } else {
      console.error('Grow API error:', data);
      return Response.json({
        success: false,
        error: data.err?.message || 'Payment creation failed',
        details: data
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating Grow payment:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});