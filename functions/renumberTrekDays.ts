import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { trip_id } = await req.json();

    if (!trip_id) {
      return Response.json({ error: 'trip_id is required' }, { status: 400 });
    }

    // Get the trip
    const trip = await base44.asServiceRole.entities.Trip.get(trip_id);
    if (!trip) {
      return Response.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Get all trek days for this trip, sorted by current day_number
    const trekDays = (trip.trek_days || []).sort((a, b) => a.day_number - b.day_number);

    if (trekDays.length === 0) {
      return Response.json({ error: 'No trek days found' }, { status: 400 });
    }

    // Renumber: First day becomes 1, second becomes 2, etc.
    const updatedDays = trekDays.map((day, index) => ({
      ...day,
      day_number: index + 1
    }));

    // Update the trip
    await base44.asServiceRole.entities.Trip.update(trip_id, {
      trek_days: updatedDays
    });

    return Response.json({ 
      success: true, 
      message: 'Trek days renumbered successfully',
      updated_count: updatedDays.length
    });

  } catch (error) {
    console.error('Error renumbering trek days:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});