import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify user is authenticated
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tripId } = await req.json();
    
    if (!tripId) {
      return Response.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    // Fetch trip details
    const trips = await base44.entities.Trip.filter({ id: tripId });
    const trip = trips[0];
    
    if (!trip) {
      return Response.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Get Google Calendar access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

    const title = trip.title || trip.title_he || trip.title_en;
    const description = trip.description || trip.description_he || trip.description_en;
    
    // Calculate event times
    const eventDate = new Date(trip.date);
    const meetingTime = trip.meeting_time || '09:00';
    const [hours, minutes] = meetingTime.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0);
    
    // Calculate duration
    let durationHours = 4; // default
    if (trip.duration_type === 'hours' && trip.duration_value) {
      durationHours = trip.duration_value;
    } else if (trip.duration_type === 'half_day') {
      durationHours = 4;
    } else if (trip.duration_type === 'full_day') {
      durationHours = 8;
    } else if (trip.duration_type === 'overnight') {
      durationHours = 24;
    } else if (trip.duration_type === 'multi_day' && trip.duration_value) {
      durationHours = trip.duration_value * 24;
    }
    
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + durationHours);

    // Create Google Calendar event
    const event = {
      summary: title,
      description: `${description}\n\nמיקום: ${trip.location}\nמארגן: ${trip.organizer_name}\n\nראה פרטים נוספים: https://groupyloopy.app/TripDetails?id=${tripId}`,
      location: trip.location,
      start: {
        dateTime: eventDate.toISOString(),
        timeZone: 'Asia/Jerusalem'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Asia/Jerusalem'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }        // 1 hour before
        ]
      }
    };

    // Add to Google Calendar
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Calendar API error:', error);
      return Response.json({ 
        error: 'Failed to add event to calendar',
        details: error 
      }, { status: response.status });
    }

    const result = await response.json();
    
    return Response.json({ 
      success: true, 
      eventId: result.id,
      eventLink: result.htmlLink 
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
});