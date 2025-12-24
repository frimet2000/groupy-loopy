import React, { useState, useEffect } from 'react';
import { Marker } from 'react-leaflet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from '../LanguageContext';
import EnhancedMapView from './EnhancedMapView';
import 'leaflet/dist/leaflet.css';

export default function LocationPicker({ isOpen, onClose, initialLat, initialLng, locationName, onConfirm }) {
  const { language } = useLanguage();
  const [position, setPosition] = useState(
    initialLat && initialLng ? [initialLat, initialLng] : [31.5, 34.9] // Default to center of Israel
  );

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition([initialLat, initialLng]);
    }
  }, [initialLat, initialLng]);

  const handleConfirm = () => {
    if (!position) return;
    const [exactLat, exactLng] = position;
    console.log('LocationPicker sending coordinates:', exactLat, exactLng);
    if (typeof onConfirm === 'function') onConfirm(exactLat, exactLng);
    if (typeof onClose === 'function') onClose();
  };

  const handleMapClick = (lat, lng) => {
    setPosition([lat, lng]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {language === 'he' ? 'בחר את מיקום ההתחלה' : 'Select Starting Point'}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            {language === 'he' 
              ? `לחץ על המפה כדי לסמן את נקודת ההתחלה של הטיול ב${locationName || 'מיקום זה'}`
              : `Click on the map to mark the starting point of the trip at ${locationName || 'this location'}`}
          </p>
        </DialogHeader>

        <div className="flex-1 h-[calc(80vh-180px)]">
          <EnhancedMapView
            center={position}
            zoom={13}
            height="100%"
            showNavigationButtons={false}
            onMapClick={handleMapClick}
          >
            {position && <Marker position={position} />}
          </EnhancedMapView>
        </div>

        <div className="text-sm text-gray-600 font-mono">
          {language === 'he' ? 'קואורדינטות:' : 'Coordinates:'} {position[0].toFixed(8)}, {position[1].toFixed(8)}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {language === 'he' ? 'ביטול' : 'Cancel'}
          </Button>
          <Button type="button" onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700">
            {language === 'he' ? 'אישור מיקום' : 'Confirm Location'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}