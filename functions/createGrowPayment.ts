import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { amount } = await req.json();

    const pageCode = Deno.env.get('GROW_PAGE_CODE');
    const userId = Deno.env.get('GROW_USER_ID');

    if (!pageCode || !userId) {
      return Response.json({ error: 'Grow credentials not configured' }, { status: 500 });
    }

    const originUrl = req.headers.get('X-Origin-URL') || 'https://groupyloopy.app';
    const baseUrl = originUrl.split('?')[0].split('#')[0];

    // Use Grow CreatePayment API to create payment with fixed amount
    const growPayload = {
      pageCode,
      userId,
      sum: Math.round(amount),
      description: 'Nifgashim Registration',
      successUrl: `${baseUrl}?payment_success=true`,
      cancelUrl: baseUrl,
      maxPayments: 1,
      currency: 'ILS'
    };

    const response = await fetch('https://api.meshulam.co.il/api/GrowPage/CreatePayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(growPayload)
    });

    const result = await response.json();

    if (result.url) {
      return Response.json({ url: result.url, processId: result.processId });
    } else {
      return Response.json({ 
        error: result.errorMessage || 'Failed to create payment',
        details: result
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating payment:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});