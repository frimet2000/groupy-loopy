// Legacy notification function - now enhanced with Web Push
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import webpush from 'npm:web-push@3.6.7';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify authentication
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipient_email, notification_type, title, body, data } = await req.json();

    // Fetch recipient user to check notification preferences
    const users = await base44.asServiceRole.entities.User.filter({ email: recipient_email });
    const recipient = users[0];

    if (!recipient) {
      return Response.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // Check if user wants this type of notification
    const prefs = recipient.notification_preferences || {};
    if (prefs[notification_type] === false) {
      return Response.json({ 
        success: true, 
        message: 'User has disabled this notification type',
        skipped: true 
      });
    }

    // Try to send Web Push notification if available
    const publicKey = Deno.env.get('WEB_PUSH_PUBLIC_KEY');
    const privateKey = Deno.env.get('WEB_PUSH_PRIVATE_KEY');
    const subscriptions = recipient.push_subscriptions || [];

    let pushSent = false;
    if (publicKey && privateKey && subscriptions.length > 0) {
      webpush.setVapidDetails(
        'mailto:support@groupyloopy.com',
        publicKey,
        privateKey
      );

      const payload = JSON.stringify({
        title,
        body,
        icon: '/icon-192x192.png',
        data: data || {},
        tag: notification_type
      });

      await Promise.allSettled(
        subscriptions.map(async (subscription) => {
          try {
            await webpush.sendNotification(subscription, payload);
            pushSent = true;
          } catch (error) {
            console.error('Push notification error:', error);
            if (error.statusCode === 410) {
              // Remove invalid subscription
              const updatedSubscriptions = subscriptions.filter(
                (sub) => sub.endpoint !== subscription.endpoint
              );
              await base44.asServiceRole.entities.User.update(recipient.id, {
                push_subscriptions: updatedSubscriptions
              });
            }
          }
        })
      );
    }

    // Fallback to email notification if push not sent
    if (!pushSent) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: recipient_email,
        subject: title,
        body: body
      });
    }

    return Response.json({ 
      success: true, 
      message: pushSent ? 'Push notification sent' : 'Email notification sent',
      method: pushSent ? 'push' : 'email'
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return Response.json({ 
      error: error.message || 'Failed to send notification' 
    }, { status: 500 });
  }
});