import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Utensils, Bed, Car, Save, X } from 'lucide-react';

export default function DailyChoicesForm({ participant, date, onSave, onCancel }) {
  const { language, isRTL } = useLanguage();
  const [choices, setChoices] = useState({
    meals: {
      lunch: false,
      dinner: false,
      breakfast_next_day: false
    },
    accommodation: false,
    is_driver: false
  });

  const translations = {
    he: {
      title: "בחירות יומיות",
      meals: "ארוחות",
      lunch: "ארוחת צהריים היום",
      dinner: "ארוחת ערב היום",
      breakfast: "ארוחת בוקר מחר",
      accommodation: "לינה הלילה",
      driver: "האם אתה נהג?",
      save: "שמור",
      cancel: "ביטול",
      for: "עבור"
    },
    en: {
      title: "Daily Choices",
      meals: "Meals",
      lunch: "Lunch Today",
      dinner: "Dinner Today",
      breakfast: "Breakfast Tomorrow",
      accommodation: "Accommodation Tonight",
      driver: "Are you a driver?",
      save: "Save",
      cancel: "Cancel",
      for: "for"
    }
  };

  const trans = translations[language] || translations.en;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(choices);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className={`${isRTL ? 'rtl' : 'ltr'} max-w-md`}>
        <DialogHeader>
          <DialogTitle>{trans.title}</DialogTitle>
          <p className="text-sm text-gray-600">
            {trans.for}: {participant.user_email}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meals */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <Utensils className="w-5 h-5 text-orange-600" />
              {trans.meals}
            </div>
            
            <div className="space-y-3 pr-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="lunch" className="cursor-pointer">{trans.lunch}</Label>
                <Switch
                  id="lunch"
                  checked={choices.meals.lunch}
                  onCheckedChange={(checked) => setChoices({
                    ...choices,
                    meals: { ...choices.meals, lunch: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dinner" className="cursor-pointer">{trans.dinner}</Label>
                <Switch
                  id="dinner"
                  checked={choices.meals.dinner}
                  onCheckedChange={(checked) => setChoices({
                    ...choices,
                    meals: { ...choices.meals, dinner: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="breakfast" className="cursor-pointer">{trans.breakfast}</Label>
                <Switch
                  id="breakfast"
                  checked={choices.meals.breakfast_next_day}
                  onCheckedChange={(checked) => setChoices({
                    ...choices,
                    meals: { ...choices.meals, breakfast_next_day: checked }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Accommodation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-blue-600" />
              <Label htmlFor="accommodation" className="cursor-pointer">{trans.accommodation}</Label>
            </div>
            <Switch
              id="accommodation"
              checked={choices.accommodation}
              onCheckedChange={(checked) => setChoices({ ...choices, accommodation: checked })}
            />
          </div>

          {/* Driver */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-teal-600" />
              <Label htmlFor="driver" className="cursor-pointer">{trans.driver}</Label>
            </div>
            <Switch
              id="driver"
              checked={choices.is_driver}
              onCheckedChange={(checked) => setChoices({ ...choices, is_driver: checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              {trans.save}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              {trans.cancel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}