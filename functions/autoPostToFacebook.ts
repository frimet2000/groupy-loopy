import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Check if triggered manually with params
    let { facebook_page_id, facebook_access_token, custom_message, trip_id } = await req.json().catch(() => ({}));

    // If not provided in body, try to fetch from SystemConfig
    if (!facebook_page_id || !facebook_access_token) {
        try {
            // We use filter because get might throw if not found depending on SDK version
            const configs = await base44.asServiceRole.entities.SystemConfig.filter({ id: 'marketing_settings' });
            if (configs.length > 0) {
                facebook_page_id = facebook_page_id || configs[0].facebook_page_id;
                facebook_access_token = facebook_access_token || configs[0].facebook_access_token;
            }
        } catch (e) {
            console.log("SystemConfig not found or error fetching", e);
        }
    }
    
    // Fallback to env vars
    if (!facebook_page_id) facebook_page_id = Deno.env.get('FACEBOOK_PAGE_ID');
    if (!facebook_access_token) facebook_access_token = Deno.env.get('FACEBOOK_ACCESS_TOKEN');

    if (!facebook_access_token) {
        return Response.json({ success: false, error: 'Facebook access token missing' });
    }

    // Auto-discover Page ID if missing
    if (!facebook_page_id) {
        try {
            console.log('Fetching Facebook Page ID automatically...');
            const accountsRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${facebook_access_token}`);
            const accountsData = await accountsRes.json();
            
            if (accountsData.data && accountsData.data.length > 0) {
                facebook_page_id = accountsData.data[0].id;
                console.log(`Auto-discovered Page ID: ${facebook_page_id} (${accountsData.data[0].name})`);
            } else {
                console.error('No pages found for this token:', accountsData);
                return Response.json({ success: false, error: 'Could not automatically find a Facebook Page ID. Please provide one manually.' });
            }
        } catch (e) {
            console.error('Error fetching accounts:', e);
            return Response.json({ success: false, error: 'Failed to auto-discover Page ID' });
        }
    }

    if (!facebook_page_id) {
         return Response.json({ success: false, error: 'Facebook Page ID missing' });
    }

    // List trips (fetch last 50)
    // If trip_id is provided, fetch only that trip
    let trips = [];
    if (trip_id) {
        trips = await base44.asServiceRole.entities.Trip.filter({ id: trip_id });
    } else {
        trips = await base44.asServiceRole.entities.Trip.list('-created_date', 50);
    }
    
    // Filter trips created in the last 7 days that haven't been posted
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const tripsToPost = trips.filter(trip => {
      // If manually triggered for a specific trip, ignore "posted_to_facebook" and date checks
      if (trip_id) return true;

      const created = new Date(trip.created_date || trip.date);
      const isRecent = created > oneWeekAgo;
      const notPosted = !trip.posted_to_facebook;
      const isOpen = trip.status === 'open';
      const isPublic = trip.privacy === 'public';
      
      return notPosted && isOpen && isPublic && isRecent;
    });

    const results = [];
    
    for (const trip of tripsToPost) {
        const title = trip.title || trip.title_he || trip.title_en || 'Trip';
        const description = trip.description || trip.description_he || trip.description_en || '';
        const appUrl = Deno.env.get('BASE44_APP_URL') || 'https://groupyloopy.app';
        const tripUrl = `${appUrl}/TripDetails?id=${trip.id}`;
        
        const message = custom_message || `🌿 טיול חדש ב-Groupy Loopy! 🌿\n\n` +
                        `📍 ${title}\n` +
                        `📅 מתי? ${new Date(trip.date).toLocaleDateString('he-IL')}\n` +
                        `🗺️ איפה? ${trip.location || 'פרטים בקישור'}\n\n` +
                        `${description.substring(0, 150)}${description.length > 150 ? '...' : ''}\n\n` +
                        `להרשמה ופרטים נוספים 👇\n${tripUrl}`;

        let endpoint = `https://graph.facebook.com/v19.0/${facebook_page_id}/feed`;
        let body: any = {
            message: message,
            link: tripUrl,
            access_token: facebook_access_token,
            published: true
        };

        // If there is an image, use /photos endpoint for better engagement
        if (trip.image_url) {
            endpoint = `https://graph.facebook.com/v19.0/${facebook_page_id}/photos`;
            body = {
                url: trip.image_url,
                caption: message,
                access_token: facebook_access_token,
                published: true
            };
        }

        try {
            const fbRes = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const fbData = await fbRes.json();

            if (fbData.id) {
                // Update trip with post details
                await base44.asServiceRole.entities.Trip.update(trip.id, {
                    posted_to_facebook: true,
                    facebook_post_id: fbData.id || fbData.post_id,
                    facebook_post_date: new Date().toISOString()
                });
                results.push({ tripId: trip.id, success: true, postId: fbData.id });
            } else {
                results.push({ tripId: trip.id, success: false, error: fbData });
            }
        } catch (e) {
            results.push({ tripId: trip.id, success: false, error: e.message });
        }
    }

    return Response.json({ success: true, processed: tripsToPost.length, results });

  } catch (e) {
      return Response.json({ success: false, error: e.message }, { status: 500 });
  }
});
