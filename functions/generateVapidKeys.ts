// Generate VAPID keys for Web Push
// Run this once to generate keys, then save them as secrets

import webpush from 'npm:web-push@3.6.7';

Deno.serve(async (req) => {
  try {
    // Check if user is authenticated and is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate VAPID keys
    const vapidKeys = webpush.generateVAPIDKeys();

    return Response.json({
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey,
      instructions: {
        en: 'Save these keys as secrets: WEB_PUSH_PUBLIC_KEY and WEB_PUSH_PRIVATE_KEY',
        he: 'שמור מפתחות אלה כסודות: WEB_PUSH_PUBLIC_KEY ו-WEB_PUSH_PRIVATE_KEY'
      }
    });
  } catch (error) {
    console.error('Error generating VAPID keys:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});