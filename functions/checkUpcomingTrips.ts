import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// This function should be called daily (via a cron job or scheduled task)
// to check for trips happening tomorrow and send reminders

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all trips
    const allTrips = await base44.asServiceRole.entities.Trip.list();
    
    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    // Filter trips happening tomorrow
    const upcomingTrips = allTrips.filter(trip => {
      const tripDate = trip.date?.split('T')[0];
      return tripDate === tomorrowDate && trip.status === 'open';
    });
    
    let notificationsSent = 0;
    
    // Send notifications to all participants
    for (const trip of upcomingTrips) {
      const participants = trip.participants || [];
      const title = trip.title || trip.title_he || trip.title_en || 'Your trip';
      
      for (const participant of participants) {
        try {
          await base44.asServiceRole.functions.invoke('sendPushNotification', {
            recipient_email: participant.email,
            notification_type: 'upcoming_trips',
            title: 'טיול מתקרב מחר! 🎒',
            body: `הטיול "${title}" מתחיל מחר ב-${trip.location}. אל תשכחו את הציוד!`
          });
          notificationsSent++;
        } catch (error) {
          console.error(`Error sending notification to ${participant.email}:`, error);
        }
      }
    }
    
    return Response.json({ 
      success: true,
      trips_checked: allTrips.length,
      upcoming_trips: upcomingTrips.length,
      notifications_sent: notificationsSent
    });
  } catch (error) {
    console.error('Error checking upcoming trips:', error);
    return Response.json({ 
      error: error.message || 'Failed to check upcoming trips' 
    }, { status: 500 });
  }
});