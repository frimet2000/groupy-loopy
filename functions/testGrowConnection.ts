import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { pageCode, userId } = await req.json();

    if (!pageCode || !userId) {
      return Response.json({ 
        success: false, 
        error: 'Page Code and User ID are required' 
      }, { status: 400 });
    }

    // Test Grow API connection with provided credentials
    const testPayload = {
      PageCode: pageCode,
      UserId: userId,
      Sum: '1.00' // Test with 1 shekel
    };

    const response = await fetch('https://api.meshulam.co.il/api/GrowPage/GetTerminalCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();

    // Check if we got a valid terminal code (indicates successful connection)
    if (data.TerminalCode) {
      return Response.json({ 
        success: true,
        message: 'Connection successful'
      });
    } else {
      return Response.json({ 
        success: false, 
        error: data.ErrorDescription || 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Test connection error:', error);
    return Response.json({ 
      success: false, 
      error: error.message || 'Connection test failed'
    }, { status: 500 });
  }
});