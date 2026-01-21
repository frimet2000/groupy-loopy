// @ts-nocheck
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Loader2, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import NifgashimDayCardsSelector from './portal/DayCardsSelector';

export default function EditDaysDialog({ 
  registration, 
  trip, 
  open, 
  onOpenChange,
  onSuccess,
  language = 'he',
  isRTL = false
}) {
  const [selectedDays, setSelectedDays] = useState(() => {
    // Initialize from registration
    const trekDays = trip?.trek_days || [];
    const regSelectedDayNumbers = registration?.selected_days || [];
    const regSelectedDays = registration?.selectedDays || [];
    
    let initial = [];
    
    if (regSelectedDays.length > 0 && typeof regSelectedDays[0] === 'object') {
      initial = regSelectedDays.map(regDay => {
        const matchingTrekDay = trekDays.find(td => td.day_number === regDay.day_number);
        return matchingTrekDay || regDay;
      });
    } else if (regSelectedDayNumbers.length > 0) {
      initial = regSelectedDayNumbers
        .map(dayNum => trekDays.find(td => td.day_number === dayNum))
        .filter(Boolean);
    }
    
    return initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    he: {
      title: 'עריכת ימי מסע',
      description: 'שנה את הימים הנבחרים עבור משתתף זה. המחיר המקורי לא ישתנה.',
      currentDays: 'ימים נוכחיים',
      newDays: 'ימים חדשים',
      saveChanges: 'שמור שינויים',
      saving: 'שומר...',
      cancel: 'ביטול',
      noChanges: 'לא בוצעו שינויים',
      success: 'הימים עודכנו בהצלחה!',
      priceNote: '💡 שים לב: המחיר המקורי נשמר ולא השתנה'
    },
    en: {
      title: 'Edit Trek Days',
      description: 'Change the selected days for this participant. The original price will not change.',
      currentDays: 'Current Days',
      newDays: 'New Days',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      cancel: 'Cancel',
      noChanges: 'No changes made',
      success: 'Days updated successfully!',
      priceNote: '💡 Note: Original price remains unchanged'
    },
    ru: {
      title: 'Редактировать дни',
      description: 'Измените выбранные дни. Оригинальная цена не изменится.',
      currentDays: 'Текущие дни',
      newDays: 'Новые дни',
      saveChanges: 'Сохранить',
      saving: 'Сохранение...',
      cancel: 'Отмена',
      noChanges: 'Нет изменений',
      success: 'Дни обновлены!',
      priceNote: '💡 Примечание: Оригинальная цена не изменилась'
    },
    es: {
      title: 'Editar Días',
      description: 'Cambia los días seleccionados. El precio original no cambiará.',
      currentDays: 'Días actuales',
      newDays: 'Nuevos días',
      saveChanges: 'Guardar',
      saving: 'Guardando...',
      cancel: 'Cancelar',
      noChanges: 'Sin cambios',
      success: '¡Días actualizados!',
      priceNote: '💡 Nota: El precio original no cambia'
    },
    fr: {
      title: 'Modifier les Jours',
      description: 'Changez les jours sélectionnés. Le prix original ne changera pas.',
      currentDays: 'Jours actuels',
      newDays: 'Nouveaux jours',
      saveChanges: 'Enregistrer',
      saving: 'Enregistrement...',
      cancel: 'Annuler',
      noChanges: 'Pas de changements',
      success: 'Jours mis à jour!',
      priceNote: '💡 Note: Le prix original reste inchangé'
    },
    de: {
      title: 'Tage Bearbeiten',
      description: 'Ändern Sie die ausgewählten Tage. Der ursprüngliche Preis ändert sich nicht.',
      currentDays: 'Aktuelle Tage',
      newDays: 'Neue Tage',
      saveChanges: 'Speichern',
      saving: 'Speichern...',
      cancel: 'Abbrechen',
      noChanges: 'Keine Änderungen',
      success: 'Tage aktualisiert!',
      priceNote: '💡 Hinweis: Der ursprüngliche Preis bleibt unverändert'
    },
    it: {
      title: 'Modifica Giorni',
      description: 'Cambia i giorni selezionati. Il prezzo originale non cambierà.',
      currentDays: 'Giorni attuali',
      newDays: 'Nuovi giorni',
      saveChanges: 'Salva',
      saving: 'Salvataggio...',
      cancel: 'Annulla',
      noChanges: 'Nessuna modifica',
      success: 'Giorni aggiornati!',
      priceNote: '💡 Nota: Il prezzo originale rimane invariato'
    }
  };

  const t = translations[language] || translations.en;

  const handleSave = async () => {
    // Check if days actually changed
    const currentDayNumbers = (registration.selected_days || []).sort().join(',');
    const newDayNumbers = selectedDays.map(d => d.day_number).sort().join(',');
    
    if (currentDayNumbers === newDayNumbers) {
      toast.info(t.noChanges);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await base44.functions.invoke('updateNifgashimDaysAdmin', {
        registrationId: registration.id,
        newSelectedDays: selectedDays,
        language: language
      });

      if (response.data?.success) {
        toast.success(t.success);
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(response.data?.error || 'Error updating days');
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6 text-purple-600" />
            {t.title}
          </DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>

        {/* Price Note Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800 font-medium">
            {t.priceNote}
          </p>
        </div>

        {/* Current Days */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <p className="text-sm font-semibold text-gray-700 mb-2">{t.currentDays}:</p>
          <div className="flex flex-wrap gap-2">
            {(registration?.selected_days || []).map((dayNum, i) => (
              <div key={i} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {language === 'he' ? `יום ${dayNum}` : `Day ${dayNum}`}
              </div>
            ))}
          </div>
        </div>

        {/* Day Selector */}
        <div className="border rounded-lg p-4 bg-white">
          <NifgashimDayCardsSelector
            trekDays={trip?.trek_days || []}
            linkedDaysPairs={trip?.linked_days_pairs || []}
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            maxDays={trip?.payment_settings?.overall_max_selectable_days || 8}
            trekCategories={trip?.trek_categories || []}
            mapUrl={null}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting || selectedDays.length === 0}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.saving}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {t.saveChanges}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}