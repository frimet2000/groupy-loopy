import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { amount, customerName, customerEmail, customerPhone, description } = await req.json();

    const pageCode = Deno.env.get('GROW_PAGE_CODE');
    const userId = Deno.env.get('GROW_USER_ID');

    if (!pageCode || !userId) {
      console.error('Missing Grow credentials');
      return Response.json({ error: 'Grow credentials not configured' }, { status: 500 });
    }

    const originUrl = req.headers.get('X-Origin-URL') || 'https://groupyloopy.app';
    const baseUrl = originUrl.split('?')[0].split('#')[0];

    const growPayload = {
      pageCode,
      userId,
      sum: Math.round(amount),
      description: description || 'Payment',
      successUrl: `${baseUrl}?payment_success=true`,
      cancelUrl: baseUrl,
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      maxPayments: 1,
      currency: 'ILS'
    };

    console.log('Creating Grow payment with amount:', amount);
    console.log('Payload:', JSON.stringify(growPayload, null, 2));

    const response = await fetch('https://api.meshulam.co.il/api/GrowPage/CreatePayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(growPayload)
    });

    const result = await response.json();
    console.log('Grow API response:', result);

    if (result.url) {
      return Response.json({ url: result.url, processId: result.processId });
    } else {
      console.error('Failed to create payment:', result);
      throw new Error(result.errorMessage || 'Failed to create payment');
    }
  } catch (error) {
    console.error('Error creating payment:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});