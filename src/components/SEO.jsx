// @ts-nocheck
import { useEffect } from 'react';

export function SEO({ 
  title, 
  description, 
  image, 
  url,
  type = 'website',
  language = 'he',
  keywords = ''
}) {
  useEffect(() => {
    const currentUrl = url || window.location.href;
    const currentImage = image || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693c3ab4048a1e3a31fffd66/413fc3893_Gemini_Generated_Image_me8dl1me8dl1me8d.png';
    
    // Set title
    if (title) document.title = title;
    
    // Helper function to upsert meta tags
    const upsertMeta = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    
    const upsertProperty = (property, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    
    // Basic meta tags
    if (description) upsertMeta('description', description);
    if (keywords) upsertMeta('keywords', keywords);
    upsertMeta('robots', 'index,follow');
    
    // Open Graph
    upsertProperty('og:title', title);
    upsertProperty('og:description', description);
    upsertProperty('og:image', currentImage);
    upsertProperty('og:url', currentUrl);
    upsertProperty('og:type', type);
    upsertProperty('og:site_name', 'Groupy Loopy');
    upsertProperty('og:locale', language === 'he' ? 'he_IL' : language === 'ru' ? 'ru_RU' : language === 'es' ? 'es_ES' : language === 'fr' ? 'fr_FR' : language === 'de' ? 'de_DE' : language === 'it' ? 'it_IT' : 'en_US');
    
    // Twitter Card
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', currentImage);
    
    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', currentUrl);
    
    // Language
    const htmlEl = document.querySelector('html');
    if (htmlEl) {
      htmlEl.setAttribute('lang', language);
    }
  }, [title, description, image, url, type, language, keywords]);
  
  return null;
}

export function TripSEO({ trip, language = 'he' }) {
  if (!trip) return null;
  
  const title = trip.title || trip.title_he || trip.title_en || 'טיול';
  const description = trip.description || trip.description_he || trip.description_en || '';
  const location = trip.location || '';
  const country = trip.country || 'israel';
  const region = trip.region || '';
  const difficulty = trip.difficulty || '';
  const activityType = trip.activity_type || 'hiking';
  
  // Build comprehensive keywords
  const keywords = (() => {
    if (language === 'he') {
      return [
        title,
        location,
        region,
        country === 'israel' ? 'טיולים בישראל' : `טיולים ב${country}`,
        `${activityType === 'hiking' ? 'טיול רגלי' : activityType === 'cycling' ? 'טיול אופניים' : activityType === 'trek' ? 'טראק' : 'טיול'}`,
        `${difficulty === 'easy' ? 'קל' : difficulty === 'moderate' ? 'בינוני' : difficulty === 'hard' ? 'קשה' : ''}`,
        'טיול מאורגן',
        'הצטרף לטיול',
        'טיולי קבוצה',
        'ארגון טיול',
        trip.has_guide ? 'עם מדריך' : '',
        trip.pets_allowed ? 'מתאים לכלבים' : '',
        trip.camping_available ? 'קמפינג' : '',
        ...( trip.trail_type || []),
        ...(trip.interests || [])
      ].filter(Boolean).join(', ');
    } else {
      return [
        title,
        location,
        region,
        `${activityType} trip`,
        `group ${activityType}`,
        `${difficulty} ${activityType}`,
        'organized trip',
        'join trip',
        'group travel',
        country,
        trip.has_guide ? 'guided trip' : '',
        trip.pets_allowed ? 'pet friendly' : '',
        trip.camping_available ? 'camping' : '',
        ...(trip.trail_type || []),
        ...(trip.interests || [])
      ].filter(Boolean).join(', ');
    }
  })();
  
  const seoTitle = language === 'he' 
    ? `${title} - ${location} | Groupy Loopy`
    : `${title} - ${location} | Groupy Loopy`;
    
  const seoDescription = description || (language === 'he'
    ? `הצטרף לטיול ${title} ב${location}. ${difficulty ? `רמת קושי: ${difficulty}.` : ''} ${trip.max_participants ? `עד ${trip.max_participants} משתתפים.` : ''} הרשמה דרך Groupy Loopy.`
    : `Join ${title} trip in ${location}. ${difficulty ? `Difficulty: ${difficulty}.` : ''} ${trip.max_participants ? `Up to ${trip.max_participants} participants.` : ''} Register via Groupy Loopy.`);
  
  useEffect(() => {
    // Build Event Schema for trip
    const eventSchema = {
      "@context": "https://schema.org",
      "@type": trip.activity_type === 'trek' ? "SportsEvent" : "Event",
      "name": title,
      "description": seoDescription,
      "startDate": trip.date,
      "endDate": (() => {
        if (!trip.date) return null;
        const end = new Date(trip.date);
        if (trip.duration_type === 'multi_day' && trip.duration_value) {
          end.setDate(end.getDate() + trip.duration_value);
        } else if (trip.duration_type === 'full_day') {
          end.setDate(end.getDate() + 1);
        } else if (trip.duration_type === 'overnight') {
          end.setDate(end.getDate() + 1);
        } else if (trip.duration_type === 'hours' && trip.duration_value) {
          end.setHours(end.getHours() + trip.duration_value);
        } else {
          end.setHours(end.getHours() + 6);
        }
        return end.toISOString();
      })(),
      "eventStatus": trip.status === 'cancelled' ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location,
          "addressRegion": region,
          "addressCountry": country === 'israel' ? 'IL' : country
        },
        "geo": trip.latitude && trip.longitude ? {
          "@type": "GeoCoordinates",
          "latitude": trip.latitude,
          "longitude": trip.longitude
        } : undefined
      },
      "image": trip.image_url || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693c3ab4048a1e3a31fffd66/413fc3893_Gemini_Generated_Image_me8dl1me8dl1me8d.png',
      "organizer": {
        "@type": "Person",
        "name": trip.organizer_name || 'Groupy Loopy User',
        "email": trip.organizer_email
      },
      "maximumAttendeeCapacity": trip.max_participants,
      "remainingAttendeeCapacity": Math.max(0, (trip.max_participants || 0) - (trip.current_participants || 0)),
      "offers": trip.payment_settings?.enabled ? {
        "@type": "Offer",
        "price": trip.payment_settings.base_registration_fee || 0,
        "priceCurrency": trip.payment_settings.currency || "ILS",
        "url": window.location.href,
        "availability": trip.status === 'full' ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
      } : undefined,
      "performer": trip.has_guide && trip.guide_name ? {
        "@type": "Person",
        "name": trip.guide_name,
        "description": trip.guide_topic
      } : undefined
    };
    
    // Inject schema
    let schemaScript = document.getElementById('trip-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'trip-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(eventSchema);
    
    return () => {
      if (schemaScript && schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, [trip, title, seoDescription, location, region, country, language]);
  
  return (
    <SEO 
      title={seoTitle}
      description={seoDescription}
      image={trip.image_url}
      url={window.location.href}
      type="website"
      language={language}
      keywords={keywords}
    />
  );
}