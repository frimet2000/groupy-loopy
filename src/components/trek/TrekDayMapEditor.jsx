import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Route, Mountain, TrendingUp, TrendingDown, MapPin, Trash2, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TrekDayMapEditor({ day, setDay }) {
  const { language } = useLanguage();
  const [apiKey, setApiKey] = useState(null);
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const response = await base44.functions.invoke('getGoogleMapsKey');
        if (response?.data?.apiKey) {
          setApiKey(response.data.apiKey);
        }
      } catch (err) {
        console.error('Failed to get API key:', err);
      }
    };
    fetchKey();
  }, []);

  const updateField = (field, value) => {
    const numValue = value === '' ? null : parseFloat(value);
    setDay({ ...day, [field]: numValue });
  };

  const addWaypoint = () => {
    const lat = parseFloat(newLat);
    const lng = parseFloat(newLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      const newWaypoint = { latitude: lat, longitude: lng };
      setDay({ ...day, waypoints: [...(day.waypoints || []), newWaypoint] });
      setNewLat('');
      setNewLng('');
    }
  };

  const removeWaypoint = (index) => {
    const updated = day.waypoints.filter((_, i) => i !== index);
    setDay({ ...day, waypoints: updated });
  };

  // Build embed URL with markers and path
  const getMapUrl = () => {
    if (!apiKey) return null;
    
    const waypoints = day.waypoints || [];
    if (waypoints.length === 0) {
      // Default center on Israel
      return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=31.7683,35.2137&zoom=8`;
    }
    
    if (waypoints.length === 1) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${waypoints[0].latitude},${waypoints[0].longitude}&zoom=12`;
    }
    
    // Multiple waypoints - show directions
    const origin = `${waypoints[0].latitude},${waypoints[0].longitude}`;
    const destination = `${waypoints[waypoints.length - 1].latitude},${waypoints[waypoints.length - 1].longitude}`;
    const waypointsParam = waypoints.slice(1, -1).map(wp => `${wp.latitude},${wp.longitude}`).join('|');
    
    let url = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}&mode=walking`;
    if (waypointsParam) {
      url += `&waypoints=${waypointsParam}`;
    }
    return url;
  };

  const mapUrl = getMapUrl();

  return (
    <Card className="border-indigo-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Route className="w-4 h-4 text-indigo-600" />
          {language === 'he' ? 'מסלול ונתוני יום' : 'Route & Day Data'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Section */}
        <div className="space-y-3">
          {mapUrl ? (
            <iframe
              src={mapUrl}
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
              {language === 'he' ? 'טוען מפה...' : 'Loading map...'}
            </div>
          )}

          {/* Add Waypoint */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label className="text-xs">{language === 'he' ? 'קו רוחב' : 'Latitude'}</Label>
              <Input
                type="number"
                step="any"
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                placeholder="31.7683"
                className="h-9"
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs">{language === 'he' ? 'קו אורך' : 'Longitude'}</Label>
              <Input
                type="number"
                step="any"
                value={newLng}
                onChange={(e) => setNewLng(e.target.value)}
                placeholder="35.2137"
                className="h-9"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addWaypoint}
              disabled={!newLat || !newLng}
              className="bg-indigo-600 hover:bg-indigo-700 h-9"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Waypoints List */}
          {day.waypoints?.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">
                {language === 'he' ? `${day.waypoints.length} נקודות במסלול` : `${day.waypoints.length} waypoints`}
              </Label>
              <div className="flex flex-wrap gap-2">
                {day.waypoints.map((wp, index) => (
                  <div key={index} className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg text-xs">
                    <MapPin className="w-3 h-3 text-indigo-600" />
                    <span>{index + 1}: {wp.latitude.toFixed(4)}, {wp.longitude.toFixed(4)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => removeWaypoint(index)}
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Fields */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm">
              <Route className="w-3 h-3" />
              {language === 'he' ? 'מרחק (ק״מ)' : 'Distance (km)'}
            </Label>
            <Input
              type="number"
              step="0.1"
              value={day.daily_distance_km || ''}
              onChange={(e) => updateField('daily_distance_km', e.target.value)}
              placeholder="15.5"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm">
              <Mountain className="w-3 h-3" />
              {language === 'he' ? 'נקודה גבוהה (מ\')' : 'Highest Point (m)'}
            </Label>
            <Input
              type="number"
              value={day.highest_point_m || ''}
              onChange={(e) => updateField('highest_point_m', e.target.value)}
              placeholder="1200"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-green-600" />
              {language === 'he' ? 'עלייה (מ\')' : 'Elevation Gain (m)'}
            </Label>
            <Input
              type="number"
              value={day.elevation_gain_m || ''}
              onChange={(e) => updateField('elevation_gain_m', e.target.value)}
              placeholder="800"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm">
              <TrendingDown className="w-3 h-3 text-red-600" />
              {language === 'he' ? 'ירידה (מ\')' : 'Elevation Loss (m)'}
            </Label>
            <Input
              type="number"
              value={day.elevation_loss_m || ''}
              onChange={(e) => updateField('elevation_loss_m', e.target.value)}
              placeholder="600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}