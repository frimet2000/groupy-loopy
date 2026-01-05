import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);

    const {
      amount,
      tripId,
      participants,
      userType,
      groupInfo,
      selectedDays,
      memorialData,
      vehicleInfo,
      customerName,
      customerEmail,
      customerPhone,
      customerIdNumber,
      description
    } = await req.json();

    const pageCode = Deno.env.get('MESHULAM_PAGE_CODE');
    if (!pageCode) {
      return Response.json({ error: 'Meshulam not configured' }, { status: 500 });
    }

    // Create registration record
    const registration = await base44.asServiceRole.entities.NifgashimRegistration.create({
      trip_id: tripId,
      participants,
      userType,
      groupInfo,
      vehicleInfo,
      memorialData,
      selectedDays,
      amount,
      status: 'pending_payment',
      customer_email: customerEmail
    });

    // Create success/cancel URLs
    const baseUrl = req.headers.get('origin') || 'https://groupyloopy.app';
    const successUrl = `${baseUrl}/NifgashimPortal?id=${tripId}&payment_success=true&registration_id=${registration.id}`;
    const cancelUrl = `${baseUrl}/NifgashimPortal?id=${tripId}&payment_cancel=true`;

    // Create Meshulam payment page
    const meshulamResponse = await fetch('https://secure.meshulam.co.il/api/light/server/1.0/createPaymentProcess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageCode,
        amount: amount.toFixed(2),
        description,
        fullName: customerName,
        email: customerEmail,
        phone: customerPhone,
        customer_id: customerIdNumber,
        successUrl,
        cancelUrl,
        maxPayments: 1,
        sum: amount.toFixed(2),
        currency: 'ILS',
        sendEmail: true,
        customFields: {
          registration_id: registration.id,
          trip_id: tripId,
          participants_count: participants.length
        }
      })
    });

    const meshulamData = await meshulamResponse.json();

    if (meshulamData.status === '1' && meshulamData.data?.url) {
      return Response.json({
        success: true,
        paymentUrl: meshulamData.data.url,
        registrationId: registration.id
      });
    } else {
      console.error('Meshulam error:', meshulamData);
      return Response.json({ 
        error: 'Failed to create payment', 
        details: meshulamData 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});