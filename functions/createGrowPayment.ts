import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  console.log('=== CREATE GROW PAYMENT STARTED ===');
  
  try {
    const base44 = createClientFromRequest(req);
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { amount, customerName, customerEmail, customerPhone, description } = body;

    const pageCode = Deno.env.get('GROW_PAGE_CODE');
    const userId = Deno.env.get('GROW_USER_ID');

    console.log('PageCode exists:', !!pageCode);
    console.log('UserId exists:', !!userId);

    if (!pageCode || !userId) {
      console.error('Missing Grow credentials - pageCode:', !!pageCode, 'userId:', !!userId);
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

    console.log('Grow payload (amount):', growPayload.sum);
    console.log('Grow payload (full):', JSON.stringify(growPayload, null, 2));

    const response = await fetch('https://api.meshulam.co.il/api/GrowPage/CreatePayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(growPayload)
    });

    console.log('Grow API status:', response.status);
    
    const result = await response.json();
    console.log('Grow API response:', JSON.stringify(result, null, 2));

    if (result.url) {
      console.log('SUCCESS - Payment URL:', result.url);
      return Response.json({ url: result.url, processId: result.processId });
    } else {
      console.error('NO URL IN RESPONSE:', result);
      return Response.json({ 
        error: result.errorMessage || result.error || 'Failed to create payment',
        details: result
      }, { status: 400 });
    }
  } catch (error) {
    console.error('EXCEPTION in createGrowPayment:', error);
    console.error('Error stack:', error.stack);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});