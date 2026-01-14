Deno.serve(async (req) => {
  try {
    const { amount } = await req.json();
    const pageCode = Deno.env.get('GROW_PAGE_CODE');
    const userId = Deno.env.get('GROW_USER_ID');

    console.log('Creating Grow payment:', { pageCode, userId, amount });

    if (!pageCode || !userId) {
      return Response.json({ error: 'Grow credentials not configured' }, { status: 500 });
    }

    // Call Grow API to create payment
    const response = await fetch('https://api.meshulam.co.il/api/GrowPage/CreatePayment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageCode,
        userId,
        sum: Math.round(amount)
      })
    });

    console.log('Grow API response status:', response.status);
    const responseText = await response.text();
    console.log('Grow API response body:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Grow response:', e);
      return Response.json({ error: 'Invalid response from Grow', details: responseText }, { status: 500 });
    }
    
    if (data.url) {
      console.log('Payment URL created:', data.url);
      return Response.json({ url: data.url });
    } else {
      console.error('Grow API error:', data);
      return Response.json({ error: data.errorMessage || 'Failed to create payment', details: data }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});