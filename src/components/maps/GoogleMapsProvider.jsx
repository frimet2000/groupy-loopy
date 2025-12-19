import React, { createContext, useContext, useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { base44 } from '@/api/base44Client';

const GoogleMapsContext = createContext();

const libraries = ['places'];

function GoogleMapsLoader({ apiKey, children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, apiKey }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function GoogleMapsProvider({ children }) {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await base44.functions.invoke('getGoogleMapsKey');
        console.log('Google Maps API response:', response);
        if (response?.data?.apiKey) {
          setApiKey(response.data.apiKey);
        } else if (response?.apiKey) {
          setApiKey(response.apiKey);
        } else {
          console.error('No API key in response:', response);
          setError('No API key returned');
        }
      } catch (err) {
        console.error('Failed to load Google Maps API key:', err);
        setError(err.message);
      }
      setLoading(false);
    };
    fetchApiKey();
  }, []);

  if (loading || !apiKey) {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false, loadError: error, apiKey: null }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <GoogleMapsLoader apiKey={apiKey}>
      {children}
    </GoogleMapsLoader>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider');
  }
  return context;
}