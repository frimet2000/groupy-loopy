// @ts-nocheck
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { registrationId, token } = await req.json();

    if (!registrationId || !token) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get registration
    const registration = await base44.asServiceRole.entities.NifgashimRegistration.get(registrationId);
    
    if (!registration) {
      return Response.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Verify token
    if (registration.edit_token !== token) {
      return Response.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Get trip details for day selection
    const trip = await base44.asServiceRole.entities.Trip.get(registration.trip_id);
    
    if (!trip) {
      return Response.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Return registration and trip data (without sensitive info)
    return Response.json({
      success: true,
      registration: {
        id: registration.id,
        trip_id: registration.trip_id,
        user_email: registration.user_email,
        customer_name: registration.customer_name,
        participants: registration.participants,
        selectedDays: registration.selectedDays,
        selected_days: registration.selected_days,
        amount: registration.amount,
        total_amount: registration.total_amount,
        amount_paid: registration.amount_paid,
        payment_status: registration.payment_status
      },
      trip: {
        id: trip.id,
        title: trip.title,
        trek_days: trip.trek_days,
        trek_categories: trip.trek_categories,
        linked_days_pairs: trip.linked_days_pairs,
        payment_settings: trip.payment_settings
      }
    });
  } catch (error) {
    console.error('Error verifying edit token:', error);
    return Response.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
});