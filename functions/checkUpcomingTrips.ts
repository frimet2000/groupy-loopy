// @ts-nocheck
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
    let registrationRemindersSent = 0;
    
    // Check for trips where registration is opening now
    const now = new Date();
    const tripsWithOpeningRegistration = allTrips.filter(trip => {
      if (!trip.registration_start_date) return false;
      
      const registrationOpens = new Date(trip.registration_start_date);
      const timeDiff = now.getTime() - registrationOpens.getTime();
      
      // If registration opened in the last 10 minutes, send reminders
      return timeDiff >= 0 && timeDiff <= 10 * 60 * 1000 && trip.registration_reminders?.length > 0;
    });
    
    // Send registration reminders
    for (const trip of tripsWithOpeningRegistration) {
      const title = trip.title || trip.title_he || trip.title_en || 'Trip';
      const reminders = trip.registration_reminders || [];
      
      for (const reminder of reminders) {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: reminder.email,
            subject: `ההרשמה לטיול "${title}" נפתחה! 🎉`,
            body: `שלום ${reminder.name},\n\nההרשמה לטיול "${title}" זה עתה נפתחה!\n\nמיקום: ${trip.location}\nתאריך: ${new Date(trip.date).toLocaleDateString('he-IL')}\n\nלחץ על הקישור להצטרפות:\n${Deno.env.get('BASE44_APP_URL') || 'https://groupyloopy.app'}/TripDetails?id=${trip.id}\n\nבהצלחה!\nצוות Groupy Loopy`
          });
          
          await base44.asServiceRole.functions.invoke('sendPushNotification', {
            recipient_email: reminder.email,
            notification_type: 'trip_updates',
            title: 'ההרשמה נפתחה! 🎉',
            body: `ההרשמה לטיול "${title}" נפתחה`
          });
          
          registrationRemindersSent++;
        } catch (error) {
          console.error(`Error sending registration reminder to ${reminder.email}:`, error);
        }
      }
      
      // Clear reminders after sending
      if (reminders.length > 0) {
        await base44.asServiceRole.entities.Trip.update(trip.id, {
          registration_reminders: []
        });
      }
    }
    
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
    
    // Run Facebook Auto-Poster Bot
    try {
      console.log('Running Facebook Auto-Poster...');
      await base44.asServiceRole.functions.invoke('autoPostToFacebook', {});
    } catch (e) {
      console.error('Error running Facebook bot:', e);
    }

    return Response.json({ 
      success: true,
      trips_checked: allTrips.length,
      upcoming_trips: upcomingTrips.length,
      notifications_sent: notificationsSent,
      registration_reminders_sent: registrationRemindersSent
    });
  } catch (error) {
    console.error('Error checking upcoming trips:', error);
    return Response.json({ 
      error: error.message || 'Failed to check upcoming trips' 
    }, { status: 500 });
  }
});