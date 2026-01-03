import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Mountain, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';
import { cn } from '@/lib/utils';

export default function NifgashimDayCardsSelector({ 
  trekDays = [], 
  linkedDaysPairs = [], 
  selectedDays = [], 
  onDaysChange,
  maxDays = 8 
}) {
  const { language, isRTL } = useLanguage();

  const translations = {
    he: {
      selectDays: "בחר את ימי המסע שלך",
      selected: "נבחרו",
      days: "ימים",
      maxReached: `ניתן לבחור עד ${maxDays} ימים`,
      difficulty: {
        easy: "קל",
        moderate: "בינוני",
        hard: "קשה"
      },
      km: "ק״מ",
      meters: "מ׳ טיפוס"
    },
    en: {
      selectDays: "Select Your Trek Days",
      selected: "Selected",
      days: "days",
      maxReached: `You can select up to ${maxDays} days`,
      difficulty: {
        easy: "Easy",
        moderate: "Moderate",
        hard: "Hard"
      },
      km: "km",
      meters: "m climb"
    }
  };

  const trans = translations[language] || translations.en;

  const isSelected = (dayId) => {
    return selectedDays.some(d => d.id === dayId);
  };

  const handleDayToggle = (day) => {
    const currentlySelected = isSelected(day.id);
    let newSelected = [...selectedDays];

    // Find if this day is part of any linked pair
    const relevantPairs = linkedDaysPairs.filter(pair => {
      if (Array.isArray(pair)) {
        return pair.includes(day.id);
      }
      return pair?.day_id_1 === day.id || pair?.day_id_2 === day.id;
    });

    const getLinkedIds = (id) => {
      const ids = new Set();
      relevantPairs.forEach(pair => {
        if (Array.isArray(pair)) {
          pair.forEach(pId => ids.add(pId));
        } else {
          ids.add(pair.day_id_1);
          ids.add(pair.day_id_2);
        }
      });
      return Array.from(ids);
    };

    const linkedIds = getLinkedIds(day.id);

    if (currentlySelected) {
      // Deselect logic
      // If we deselect a day, we must deselect all linked days
      if (linkedIds.length > 0) {
        newSelected = newSelected.filter(d => !linkedIds.includes(d.id));
      } else {
        newSelected = newSelected.filter(d => d.id !== day.id);
      }
    } else {
      // Select logic
      // Check if we can add the days (considering maxDays)
      const daysToAdd = [];
      
      // Always add the clicked day
      daysToAdd.push(day);

      // Add linked days if not already selected
      if (linkedIds.length > 0) {
        linkedIds.forEach(id => {
          if (id !== day.id && !newSelected.some(d => d.id === id)) {
            const dayObj = trekDays.find(td => td.id === id);
            if (dayObj) daysToAdd.push(dayObj);
          }
        });
      }

      if (newSelected.length + daysToAdd.length > maxDays) {
        // Cannot select - would exceed limit
        // Optionally show toast or error
        return; 
      }

      newSelected = [...newSelected, ...daysToAdd];
    }

    onDaysChange(newSelected);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{trans.selectDays}</h2>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
          {selectedDays.length} / {maxDays} {trans.selected}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trekDays.map((day) => {
          const selected = isSelected(day.id);
          const isLinked = linkedDaysPairs.some(pair => 
            Array.isArray(pair) ? pair.includes(day.id) : (pair.day_id_1 === day.id || pair.day_id_2 === day.id)
          );

          return (
            <motion.div
              key={day.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleDayToggle(day)}
              className={cn(
                "relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden",
                selected 
                  ? "border-blue-600 bg-blue-50 shadow-md" 
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
              )}
            >
              {selected && (
                <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} text-blue-600`}>
                  <CheckCircle2 className="w-6 h-6 fill-blue-100" />
                </div>
              )}
              
              {isLinked && (
                <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full`}>
                  {language === 'he' ? 'יום מוצמד' : 'Linked Day'}
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(day.date)}</span>
                </div>
                
                <h3 className="font-bold text-lg mb-3">{day.daily_title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mountain className="w-4 h-4" />
                    <span>{day.difficulty ? (trans.difficulty[day.difficulty] || day.difficulty) : '-'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{day.daily_distance_km} {trans.km}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
