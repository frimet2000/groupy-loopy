// Helper function to detect user's region based on coordinates
export function getRegionFromCoordinates(lat, lon) {
  // Israel approximate region boundaries
  const regions = {
    eilat: { minLat: 29.0, maxLat: 30.0, minLon: 34.5, maxLon: 35.5 },
    negev: { minLat: 30.0, maxLat: 31.3, minLon: 34.3, maxLon: 35.5 },
    south: { minLat: 31.3, maxLat: 31.8, minLon: 34.5, maxLon: 35.0 },
    jerusalem: { minLat: 31.6, maxLat: 32.0, minLon: 34.9, maxLon: 35.4 },
    center: { minLat: 31.8, maxLat: 32.5, minLon: 34.7, maxLon: 35.2 },
    north: { minLat: 32.5, maxLat: 33.5, minLon: 35.0, maxLon: 36.0 },
  };

  for (const [region, bounds] of Object.entries(regions)) {
    if (
      lat >= bounds.minLat &&
      lat <= bounds.maxLat &&
      lon >= bounds.minLon &&
      lon <= bounds.maxLon
    ) {
      return region;
    }
  }

  return 'center'; // default fallback
}

export function detectUserLocation(onSuccess, onError) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const region = getRegionFromCoordinates(latitude, longitude);
        onSuccess(region, latitude, longitude);
      },
      (error) => {
        console.log('Geolocation error:', error);
        if (onError) onError(error);
      },
      { timeout: 5000, maximumAge: 300000 }
    );
  } else {
    console.log('Geolocation not supported');
    if (onError) onError(new Error('Geolocation not supported'));
  }
}