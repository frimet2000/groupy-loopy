import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { amount } = await req.json();

    const pageCode = Deno.env.get('GROW_PAGE_CODE');

    if (!pageCode) {
      return Response.json({ error: 'Grow page code not configured' }, { status: 500 });
    }

    // Generate Grow payment URL with amount in query parameter
    // The amount is passed in the URL so Grow receives it
    const paymentUrl = `https://meshulam.co.il/s/${pageCode}?sum=${Math.round(amount)}`;

    return Response.json({ url: paymentUrl });
  } catch (error) {
    console.error('Error creating payment URL:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});