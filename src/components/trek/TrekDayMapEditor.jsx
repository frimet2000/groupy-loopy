import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Route, Mountain, TrendingUp, TrendingDown } from 'lucide-react';

export default function TrekDayMapEditor({ day, setDay }) {
  const { language } = useLanguage();

  const updateField = (field, value) => {
    const numValue = value === '' ? null : parseFloat(value);
    setDay({ ...day, [field]: numValue });
  };

  return (
    <Card className="border-indigo-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Route className="w-4 h-4 text-indigo-600" />
          {language === 'he' ? 'נתוני מסלול יומי' : 'Daily Route Data'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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