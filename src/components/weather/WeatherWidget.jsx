import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, CloudSun } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  partly_cloudy: CloudSun,
  rainy: CloudRain,
  snowy: CloudSnow,
};

export default function WeatherWidget({ location, date }) {
  const { t, isRTL, language } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if date is within 1 day from now
  const isWithinOneDay = () => {
    if (!date) return false;
    const tripDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Reset time to midnight for comparison
    tripDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    
    return tripDate.getTime() <= tomorrow.getTime();
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: language === 'he' 
            ? `חפש ב-Google תחזית מזג אוויר אמיתית עבור ${location}, ישראל בתאריך ${date}. היום הוא ${today}. חפש במיוחד באתרי תחזית מזג אוויר ישראליים כמו ims.gov.il או ynet מזג אוויר. ספק נתונים מדויקים של טמפרטורה, לחות, רוח ומצב השמיים ספציפית ל-${location}. התשובה חייבת להיות בעברית.`
            : `Search Google for real weather forecast for ${location}, Israel on ${date}. Today is ${today}. Look specifically at Israeli weather sites like ims.gov.il or ynet weather. Provide accurate data for temperature, humidity, wind and sky conditions specifically for ${location}.`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              temperature_high: { type: "number" },
              temperature_low: { type: "number" },
              humidity: { type: "number" },
              wind_speed: { type: "number" },
              condition: { type: "string", enum: ["sunny", "cloudy", "partly_cloudy", "rainy", "snowy"] },
              description: { type: "string" }
            }
          }
        });
        setWeather(result);
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeather(null);
      }
      setLoading(false);
    };

    if (location && date && isWithinOneDay()) {
      fetchWeather();
    } else {
      setLoading(false);
    }
  }, [location, date, language]);

  // Don't show if date is more than 1 day away
  if (!isWithinOneDay()) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-gray-600" dir={isRTL ? 'rtl' : 'ltr'}>
            <CloudSun className="w-5 h-5 text-blue-500" />
            <span>
              {language === 'he' ? 'תחזית מזג אויר תהיה זמינה יום לפני הטיול' 
                : language === 'ru' ? 'Прогноз погоды будет доступен за день до поездки'
                : language === 'es' ? 'El pronóstico del tiempo estará disponible un día antes del viaje'
                : language === 'fr' ? 'Les prévisions météo seront disponibles un jour avant le voyage'
                : language === 'de' ? 'Wettervorhersage ist einen Tag vor der Reise verfügbar'
                : language === 'it' ? 'Le previsioni meteo saranno disponibili un giorno prima del viaggio'
                : 'Weather forecast will be available one day before the trip'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 bg-white/20 rounded-full" />
            <Skeleton className="h-6 flex-1 bg-white/20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const WeatherIcon = weatherIcons[weather.condition] || Sun;

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
      <CardContent className="p-3" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between gap-3">
          <WeatherIcon className="w-10 h-10 text-white/90 flex-shrink-0" />
          <div className="flex items-center gap-4 flex-1">
            <div className="text-center">
              <div className="text-2xl font-bold">{weather.temperature_high}°</div>
              <div className="text-xs text-white/70">{weather.temperature_low}°</div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-white/70" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-4 h-4 text-white/70" />
                <span>{weather.wind_speed} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}