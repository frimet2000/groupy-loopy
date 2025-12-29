// Send push notification to a specific user
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import webpush from 'npm:web-push@3.6.7';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get authenticated user (sender)
    const sender = await base44.auth.me();
    if (!sender) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request data
    const { 
      recipientEmail, 
      title, 
      body, 
      icon, 
      url, 
      tag,
      requireInteraction,
      actions 
    } = await req.json();

    if (!recipientEmail || !title || !body) {
      return Response.json({ 
        error: 'Missing required fields: recipientEmail, title, body' 
      }, { status: 400 });
    }

    // Get VAPID keys from environment
    const publicKey = Deno.env.get('WEB_PUSH_PUBLIC_KEY');
    const privateKey = Deno.env.get('WEB_PUSH_PRIVATE_KEY');

    if (!publicKey || !privateKey) {
      return Response.json({ 
        error: 'VAPID keys not configured. Please set WEB_PUSH_PUBLIC_KEY and WEB_PUSH_PRIVATE_KEY secrets.' 
      }, { status: 500 });
    }

    // Configure web-push
    webpush.setVapidDetails(
      'mailto:support@groupyloopy.com',
      publicKey,
      privateKey
    );

    // Get recipient's push subscriptions using service role
    const recipients = await base44.asServiceRole.entities.User.filter({ 
      email: recipientEmail 
    });

    if (recipients.length === 0) {
      return Response.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const recipient = recipients[0];
    const subscriptions = recipient.push_subscriptions || [];

    if (subscriptions.length === 0) {
      return Response.json({ 
        error: 'Recipient has no push subscriptions' 
      }, { status: 404 });
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: tag || 'notification',
      data: {
        url: url || '/',
        dateOfArrival: Date.now(),
        senderEmail: sender.email,
        senderName: sender.full_name || sender.first_name
      },
      requireInteraction: requireInteraction || false,
      actions: actions || []
    });

    // Send to all user's subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(subscription, payload);
          return { success: true, endpoint: subscription.endpoint };
        } catch (error) {
          console.error('Error sending to subscription:', error);
          
          // If subscription is no longer valid (410 Gone), remove it
          if (error.statusCode === 410) {
            const updatedSubscriptions = subscriptions.filter(
              (sub) => sub.endpoint !== subscription.endpoint
            );
            await base44.asServiceRole.entities.User.update(recipient.id, {
              push_subscriptions: updatedSubscriptions
            });
          }
          
          return { success: false, endpoint: subscription.endpoint, error: error.message };
        }
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    return Response.json({
      success: true,
      message: `Sent to ${successful} subscription(s), ${failed} failed`,
      results: results.map((r) => r.status === 'fulfilled' ? r.value : { success: false, error: r.reason })
    });

  } catch (error) {
    console.error('Error sending push notification:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});