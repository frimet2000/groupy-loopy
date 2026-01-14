import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { amount } = await req.json();

    const pageCode = Deno.env.get('GROW_PAGE_CODE');

    if (!pageCode) {
      return Response.json({ error: 'Grow page code not configured' }, { status: 500 });
    }

    const originUrl = req.headers.get('X-Origin-URL') || 'https://groupyloopy.app';
    const baseUrl = originUrl.split('?')[0].split('#')[0];

    // Create Grow payment URL with pre-filled amount (read-only)
    const paymentUrl = `https://meshulam.co.il/s/${pageCode}?sum=${Math.round(amount)}&readonly=true`;

    return Response.json({ url: paymentUrl });
  } catch (error) {
    console.error('Error creating payment URL:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});