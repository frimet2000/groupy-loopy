import React, { useState, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route, MapPin, Mountain, TrendingUp, TrendingDown, Cloud, Backpack, Droplets, CheckCircle2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import WeatherWidget from '../weather/WeatherWidget';
import EnhancedMapView from '../maps/EnhancedMapView';

export default function TrekDaysDisplay({ trip, selectedDay: externalSelectedDay, onDayChange }) {
  const { language, isRTL } = useLanguage();
  const [internalSelectedDay, setInternalSelectedDay] = useState(0);
  
  const selectedDay = externalSelectedDay !== undefined ? externalSelectedDay : internalSelectedDay;
  const setSelectedDay = onDayChange || setInternalSelectedDay;

  if (!trip.trek_days || trip.trek_days.length === 0) {
    return null;
  }

  const sortedDays = [...trip.trek_days].sort((a, b) => a.day_number - b.day_number);
  const currentDay = sortedDays[selectedDay];

  // Calculate calendar data
  const calendarData = useMemo(() => {
    if (!sortedDays.length || !trip.date) return { months: [], daysByDate: {} };

    const daysByDate = {};
    const monthsSet = new Set();

    sortedDays.forEach(day => {
      const dayDate = day.date 
        ? new Date(day.date) 
        : new Date(new Date(trip.date).setDate(new Date(trip.date).getDate() + (day.day_number - 1)));
      
      const dateKey = dayDate.toISOString().split('T')[0];
      daysByDate[dateKey] = day;
      monthsSet.add(`${dayDate.getFullYear()}-${dayDate.getMonth()}`);
    });

    const months = Array.from(monthsSet).sort().map(monthKey => {
      const [year, month] = monthKey.split('-').map(Number);
      return { year, month };
    });

    return { months, daysByDate };
  }, [sortedDays, trip.date]);

  const getCategoryColor = (categoryId) => {
    if (!trip.trek_categories) return '#10B981';
    const category = trip.trek_categories.find(c => c.id === categoryId);
    return category?.color || '#10B981';
  };

  const renderCalendar = ({ year, month }) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const weeks = [];
    let week = new Array(7).fill(null);
    let currentDay = 1;

    // Fill first week
    for (let i = startDayOfWeek; i < 7 && currentDay <= daysInMonth; i++) {
      week[i] = currentDay++;
    }
    weeks.push(week);

    // Fill remaining weeks
    while (currentDay <= daysInMonth) {
      week = new Array(7).fill(null);
      for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
        week[i] = currentDay++;
      }
      weeks.push(week);
    }

    const monthNames = {
      he: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
    };

    const dayNames = {
      he: ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
    };

    return (
      <div className="bg-white rounded-xl border-2 border-indigo-200 p-3 shadow-lg">
        <h3 className="text-center font-bold text-indigo-900 mb-3">
          {monthNames[language]?.[month] || monthNames.en[month]} {year}
        </h3>
        
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames[language]?.map((day, i) => (
            <div key={i} className="text-center text-xs font-semibold text-gray-600 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIdx) => {
                if (!day) return <div key={dayIdx} className="aspect-square" />;

                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const trekDay = calendarData.daysByDate[dateKey];
                const categoryColor = trekDay ? getCategoryColor(trekDay.category_id) : null;

                return (
                  <button
                    key={dayIdx}
                    onClick={() => {
                      if (trekDay) {
                        const idx = sortedDays.findIndex(d => d.id === trekDay.id);
                        if (idx >= 0) setSelectedDay(idx);
                      }
                    }}
                    disabled={!trekDay}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-xs font-medium
                      transition-all duration-200
                      ${trekDay 
                        ? 'cursor-pointer hover:scale-110 hover:shadow-lg text-white font-bold' 
                        : 'text-gray-400 cursor-default'
                      }
                      ${trekDay && currentDay?.id === trekDay.id ? 'ring-4 ring-white scale-110 shadow-xl' : ''}
                    `}
                    style={trekDay ? { 
                      backgroundColor: categoryColor,
                      boxShadow: trekDay ? `0 2px 8px ${categoryColor}40` : undefined
                    } : undefined}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-2 border-indigo-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <Route className="w-5 h-5 text-indigo-600" />
          {language === 'he' ? 'מסלול הטראק' : language === 'ru' ? 'Маршрут трека' : language === 'es' ? 'Ruta del trekking' : language === 'fr' ? 'Itinéraire du trekking' : language === 'de' ? 'Trekking-Route' : language === 'it' ? 'Percorso del trekking' : 'Trek Route'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-8 space-y-4 lg:space-y-6">
        {/* Calendar View */}
        {calendarData.months.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {language === 'he' ? 'לוח שנה' : language === 'ru' ? 'Календарь' : language === 'es' ? 'Calendario' : language === 'fr' ? 'Calendrier' : language === 'de' ? 'Kalender' : language === 'it' ? 'Calendario' : 'Calendar'}
            </h3>
            <div className={`grid gap-4 ${calendarData.months.length > 1 ? 'md:grid-cols-2' : 'max-w-md'}`}>
              {calendarData.months.map((monthData, idx) => (
                <div key={idx}>
                  {renderCalendar(monthData)}
                </div>
              ))}
            </div>
            
            {/* Category Legend */}
            {trip.trek_categories && trip.trek_categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {trip.trek_categories.map(cat => (
                  <Badge 
                    key={cat.id} 
                    className="gap-2 px-3 py-1 text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    <div className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Overall Trek Stats */}
        {(trip.trek_total_distance_km || trip.trek_overall_highest_point_m) &&
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-6 p-4 lg:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
            {trip.trek_total_distance_km &&
          <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">
                  {language === 'he' ? 'סה״כ מרחק' : language === 'ru' ? 'Общее расстояние' : language === 'es' ? 'Distancia total' : language === 'fr' ? 'Distance totale' : language === 'de' ? 'Gesamtdistanz' : language === 'it' ? 'Distanza totale' : 'Total Distance'}
                </p>
                <p className="text-2xl font-bold text-indigo-900">{trip.trek_total_distance_km.toFixed(1)} {language === 'he' ? 'ק״מ' : 'km'}</p>
              </div>
          }
            {trip.trek_overall_highest_point_m &&
          <div className="text-center">
                <p className="text-xs text-gray-600 mb-1 flex items-center justify-center gap-1">
                  <Mountain className="w-3 h-3" />
                  {language === 'he' ? 'נק׳ גבוהה ביותר' : language === 'ru' ? 'Макс. высота' : language === 'es' ? 'Punto más alto' : language === 'fr' ? 'Point le plus haut' : language === 'de' ? 'Höchster Punkt' : language === 'it' ? 'Punto più alto' : 'Highest Point'}
                </p>
                <p className="text-2xl font-bold text-purple-900">{trip.trek_overall_highest_point_m.toFixed(0)} {language === 'he' ? 'מ׳' : 'm'}</p>
              </div>
          }
            {trip.trek_overall_lowest_point_m &&
          <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">
                  {language === 'he' ? 'נק׳ נמוכה ביותר' : language === 'ru' ? 'Мин. высота' : language === 'es' ? 'Punto más bajo' : language === 'fr' ? 'Point le plus bas' : language === 'de' ? 'Tiefster Punkt' : language === 'it' ? 'Punto più basso' : 'Lowest Point'}
                </p>
                <p className="text-2xl font-bold text-teal-900">{trip.trek_overall_lowest_point_m.toFixed(0)} {language === 'he' ? 'מ׳' : 'm'}</p>
              </div>
          }
          </div>
        }

        {/* Day Tabs */}
        <Tabs value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))}>
          <TabsList className="flex flex-wrap w-full gap-2 lg:gap-3 h-auto p-2 lg:p-4" dir={isRTL ? 'rtl' : 'ltr'}>
            {sortedDays.map((day, index) => {
              const getDayDate = () => {
                if (day.date) return new Date(day.date);
                if (trip.date && day.day_number) {
                  const date = new Date(trip.date);
                  date.setDate(date.getDate() + (day.day_number - 1));
                  return date;
                }
                return null;
              };

              const dayDate = getDayDate();
              const prevDayDate = index > 0 ? (() => {
                const prevDay = sortedDays[index - 1];
                if (prevDay.date) return new Date(prevDay.date);
                if (trip.date && prevDay.day_number) {
                  const date = new Date(trip.date);
                  date.setDate(date.getDate() + (prevDay.day_number - 1));
                  return date;
                }
                return null;
              })() : null;

              const isNewWeek = dayDate && prevDayDate && dayDate.getDay() < prevDayDate.getDay();

              return (
                <React.Fragment key={day.id || index}>
                  {isNewWeek && <div className="w-full h-0" />}
                  <TabsTrigger
                    value={index.toString()}
                    className={`relative overflow-hidden flex flex-col items-center justify-center py-2 min-h-[90px] min-w-[100px] transition-all ${
                    day.image_url ?
                    'data-[state=active]:ring-4 data-[state=active]:ring-white data-[state=active]:scale-105' :
                    'data-[state=active]:bg-indigo-100'}`
                    }
                    dir={isRTL ? 'rtl' : 'ltr'}
                    style={day.image_url ? {
                      backgroundImage: `url(${day.image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    } : undefined}>

                    {day.image_url &&
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
                    }
                    <span className={`font-semibold z-10 relative ${day.image_url ? 'text-white drop-shadow-lg' : ''}`}>
                      {language === 'he' ? `יום ${day.day_number}` : `Day ${day.day_number}`}
                    </span>
                    {dayDate && (
                      <>
                        <span className={`text-xs z-10 relative ${day.image_url ? 'text-white/90 drop-shadow' : 'text-gray-600'}`}>
                          {dayDate.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', { weekday: 'short' })}
                        </span>
                        <span className={`text-xs z-10 relative ${day.image_url ? 'text-white/90 drop-shadow' : 'text-gray-600'}`}>
                          {dayDate.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
                            day: 'numeric',
                            month: 'numeric'
                          })}
                        </span>
                      </>
                    )}
                  </TabsTrigger>
                </React.Fragment>
              );
            })}
          </TabsList>

          {sortedDays.map((day, index) =>
          <TabsContent key={day.id || index} value={index.toString()} className="mt-4 pt-12 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
              {/* Day Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                  disabled={selectedDay === 0}
                  className="gap-1"
                >
                  {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  {language === 'he' ? 'יום קודם' : language === 'ru' ? 'Предыдущий' : language === 'es' ? 'Anterior' : language === 'fr' ? 'Précédent' : language === 'de' ? 'Zurück' : language === 'it' ? 'Precedente' : 'Previous'}
                </Button>
                <span className="text-sm text-gray-600">
                  {language === 'he' ? `יום ${day.day_number} מתוך ${sortedDays.length}` : `Day ${day.day_number} of ${sortedDays.length}`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDay(Math.min(sortedDays.length - 1, selectedDay + 1))}
                  disabled={selectedDay === sortedDays.length - 1}
                  className="gap-1"
                >
                  {language === 'he' ? 'יום הבא' : language === 'ru' ? 'Следующий' : language === 'es' ? 'Siguiente' : language === 'fr' ? 'Suivant' : language === 'de' ? 'Weiter' : language === 'it' ? 'Successivo' : 'Next'}
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>

              {/* Day Header */}
              <div>
                {day.image_url &&
              <img
                src={day.image_url}
                alt={day.daily_title}
                className="w-full h-64 object-cover rounded-xl mb-4 shadow-lg" />

              }
                <h3 className="text-2xl font-bold text-indigo-900 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                  {day.daily_title}
                </h3>
                {day.daily_description &&
              <p className="text-gray-700 leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
                    {day.daily_description}
                  </p>
              }
              </div>

              {/* Day Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {day.daily_distance_km &&
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-600 mb-1 flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {language === 'he' ? 'מרחק' : language === 'ru' ? 'Расстояние' : language === 'es' ? 'Distancia' : language === 'fr' ? 'Distance' : language === 'de' ? 'Distanz' : language === 'it' ? 'Distanza' : 'Distance'}
                    </p>
                    <p className="text-lg font-bold text-blue-900">{day.daily_distance_km.toFixed(1)} {language === 'he' ? 'ק״מ' : 'km'}</p>
                  </div>
              }
                {day.elevation_gain_m &&
              <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-600 mb-1 flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {language === 'he' ? 'עליה' : language === 'ru' ? 'Подъем' : language === 'es' ? 'Ascenso' : language === 'fr' ? 'Montée' : language === 'de' ? 'Aufstieg' : language === 'it' ? 'Salita' : 'Climb'}
                    </p>
                    <p className="text-lg font-bold text-green-900">+{day.elevation_gain_m.toFixed(0)} {language === 'he' ? 'מ׳' : 'm'}</p>
                  </div>
              }
                {day.elevation_loss_m &&
              <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-600 mb-1 flex items-center justify-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      {language === 'he' ? 'ירידה' : language === 'ru' ? 'Спуск' : language === 'es' ? 'Descenso' : language === 'fr' ? 'Descente' : language === 'de' ? 'Abstieg' : language === 'it' ? 'Discesa' : 'Descent'}
                    </p>
                    <p className="text-lg font-bold text-red-900">-{day.elevation_loss_m.toFixed(0)} {language === 'he' ? 'מ׳' : 'm'}</p>
                  </div>
              }
                {day.highest_point_m &&
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-600 mb-1 flex items-center justify-center gap-1">
                      <Mountain className="w-3 h-3" />
                      {language === 'he' ? 'נק׳ גבוהה' : language === 'ru' ? 'Макс.' : language === 'es' ? 'Punto alto' : language === 'fr' ? 'Point haut' : language === 'de' ? 'Höchster' : language === 'it' ? 'Più alto' : 'Highest'}
                    </p>
                    <p className="text-lg font-bold text-purple-900">{day.highest_point_m.toFixed(0)} {language === 'he' ? 'מ׳' : 'm'}</p>
                  </div>
              }
              </div>

              {/* Weather */}
              <div className="mt-4">
                <WeatherWidget
                location={trip.location}
                date={day.date || (trip.date ? new Date(new Date(trip.date).setDate(new Date(trip.date).getDate() + (day.day_number - 1))).toISOString().split('T')[0] : null)} />

              </div>

              {/* Day Equipment */}
              {day.equipment && day.equipment.length > 0 && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200" dir={isRTL ? 'rtl' : 'ltr'}>
                  <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                    <Backpack className="w-4 h-4" />
                    {language === 'he' ? 'ציוד ליום זה' : language === 'ru' ? 'Снаряжение на день' : language === 'es' ? 'Equipo del día' : language === 'fr' ? 'Équipement du jour' : language === 'de' ? 'Ausrüstung des Tages' : language === 'it' ? 'Attrezzatura del giorno' : 'Equipment for this day'}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {day.equipment.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white rounded-lg p-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-gray-700">{item.item}</span>
                      </div>
                    ))}
                  </div>
                  {day.recommended_water_liters && (
                    <div className="mt-3 flex items-center gap-2 text-blue-700 bg-blue-50 rounded-lg p-2">
                      <Droplets className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'he' ? `מים מומלצים: ${day.recommended_water_liters} ליטר` : `Recommended water: ${day.recommended_water_liters}L`}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Map */}
              {day.waypoints && day.waypoints.length > 0 && (
                <EnhancedMapView
                  center={[
                    day.waypoints.reduce((sum, wp) => sum + wp.latitude, 0) / day.waypoints.length,
                    day.waypoints.reduce((sum, wp) => sum + wp.longitude, 0) / day.waypoints.length
                  ]}
                  zoom={13}
                  waypoints={day.waypoints}
                  polylineColor="#4f46e5"
                  height="400px"
                  showNavigationButtons={true}
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>);

}