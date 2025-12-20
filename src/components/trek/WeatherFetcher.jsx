import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudSun, Loader2, Thermometer, Wind, Droplets, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function WeatherFetcher({ day, setDay, tripDate, tripLocation }) {
  const { language, isRTL } = useLanguage();
  const [isFetching, setIsFetching] = useState(false);

  const fetchWeather = async () => {
    // Get location from waypoints or trip location
    let location = tripLocation;
    if (day.waypoints?.length > 0) {
      location = `${day.waypoints[0].latitude}, ${day.waypoints[0].longitude}`;
    }

    if (!location) {
      toast.error(language === 'he' ? 'נא להוסיף נקודות מסלול או מיקום' : 'Please add waypoints or location first');
      return;
    }

    setIsFetching(true);
    const dateToUse = day.date || tripDate;
    const dateStr = dateToUse ? new Date(dateToUse).toLocaleDateString() : '';

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: language === 'he'
          ? `מה תחזית מזג האוויר עבור המיקום ${location}${dateStr ? ` בתאריך ${dateStr}` : ''}? 
    תן לי תחזית קצרה וברורה בעברית הכוללת:
- טמפרטורה צפויה (בצלזיוס)
- מצב השמיים (שמש/עננות/גשם)
- רוח (חזקה/בינונית/קלה)
- לחות
- המלצות לטיול

תן תשובה קצרה בסגנון: "שמש חלקית, 22-28°C, רוח קלה, לחות נמוכה. מומלץ להביא כובע ומים"`
          : `What is the weather forecast for location ${location}${dateStr ? ` on ${dateStr}` : ''}?
          Give me a brief and clear forecast including:
- Expected temperature (Celsius)
- Sky conditions (sunny/cloudy/rain)
- Wind (strong/moderate/light)
- Humidity
- Hiking recommendations

Give a short answer like: "Partly sunny, 22-28°C, light wind, low humidity. Recommended to bring hat and water"`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            weather_summary: { type: "string" },
            temperature_min: { type: "number" },
            temperature_max: { type: "number" },
            conditions: { type: "string" },
            wind: { type: "string" },
            humidity: { type: "string" },
            recommendation: { type: "string" }
          }
        }
      });

      // Format the weather string
      const weatherText = result.weather_summary || 
        `${result.conditions || ''}, ${result.temperature_min || '?'}-${result.temperature_max || '?'}°C, ${language === 'he' ? 'רוח' : 'wind'}: ${result.wind || ''}, ${language === 'he' ? 'לחות' : 'humidity'}: ${result.humidity || ''}`;

      setDay(prev => ({
        ...prev,
        estimated_weather: weatherText
      }));

      toast.success(language === 'he' ? 'תחזית מזג האוויר נטענה!' : 'Weather forecast loaded!');
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast.error(language === 'he' ? 'שגיאה בטעינת מזג האוויר' : 'Error fetching weather');
    }
    setIsFetching(false);
  };

  return (
    <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-semibold text-sky-800">
            <CloudSun className="w-4 h-4" />
            {language === 'he' ? 'תחזית מזג אוויר' : language === 'ru' ? 'Прогноз погоды' : language === 'es' ? 'Pronóstico del tiempo' : language === 'fr' ? 'Prévisions météo' : language === 'de' ? 'Wettervorhersage' : language === 'it' ? 'Previsioni meteo' : 'Weather Forecast'}
          </Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={fetchWeather}
            disabled={isFetching}
            className="gap-1 bg-white hover:bg-sky-100 border-sky-300"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {language === 'he' ? 'משוך מהרשת' : 'Fetch'}
          </Button>
        </div>

        <Input
          value={day.estimated_weather || ''}
          onChange={(e) => setDay({ ...day, estimated_weather: e.target.value })}
          placeholder={language === 'he' ? 'למשל: שמש, 25 מעלות, רוח קלה' : 'e.g., Sunny, 25°C, light wind'}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="bg-white"
        />

        {day.estimated_weather && (
          <div className="flex flex-wrap gap-2 text-xs">
            {day.estimated_weather.includes('°') && (
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-amber-700">
                <Thermometer className="w-3 h-3" />
                <span>{day.estimated_weather.match(/\d+-?\d*°C?/)?.[0] || ''}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}