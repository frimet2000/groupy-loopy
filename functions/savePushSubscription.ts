// Save push notification subscription to database
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get authenticated user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get subscription data from request
    const { subscription } = await req.json();
    
    if (!subscription || !subscription.endpoint) {
      return Response.json({ error: 'Invalid subscription data' }, { status: 400 });
    }

    // Check if user already has this subscription
    const existingUser = await base44.entities.User.filter({ 
      email: user.email 
    });

    if (existingUser.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = existingUser[0];
    const existingSubscriptions = userData.push_subscriptions || [];

    // Check if this endpoint already exists
    const subscriptionExists = existingSubscriptions.some(
      (sub) => sub.endpoint === subscription.endpoint
    );

    if (!subscriptionExists) {
      // Add new subscription
      const updatedSubscriptions = [
        ...existingSubscriptions,
        {
          ...subscription,
          created_at: new Date().toISOString(),
          user_agent: req.headers.get('user-agent') || 'unknown'
        }
      ];

      // Update user with new subscription
      await base44.entities.User.update(userData.id, {
        push_subscriptions: updatedSubscriptions,
        push_enabled: true
      });

      return Response.json({ 
        success: true, 
        message: 'Subscription saved successfully' 
      });
    }

    return Response.json({ 
      success: true, 
      message: 'Subscription already exists' 
    });

  } catch (error) {
    console.error('Error saving subscription:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});