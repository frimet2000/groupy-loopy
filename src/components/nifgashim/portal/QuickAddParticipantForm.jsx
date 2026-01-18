// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const translations = {
  he: {
    name: 'שם מלא',
    idNumber: 'תעודת זהות (9 ספרות)',
    ageRange: 'טווח גילאים',
    selectAge: 'בחר טווח גילאים',
    phone: 'טלפון נייד',
    email: 'אימייל',
    add: 'הוסף',
    cancel: 'ביטול',
    parentAge: 'הורה (18+)',
    childAge: 'ילד/ה (עד 18)',
    phoneOptional: 'טלפון (אופציונלי)',
    emailOptional: 'אימייל (אופציונלי)',
    invalidId: 'תעודת זהות חייבת להכיל 9 ספרות בדיוק',
    invalidPhone: 'טלפון חייב להכיל 10 ספרות בדיוק',
    requiredFields: 'יש למלא את כל השדות החובה'
  },
  en: {
    name: 'Full Name',
    idNumber: 'ID Number (9 digits)',
    ageRange: 'Age Range',
    selectAge: 'Select Age Range',
    phone: 'Mobile Phone',
    email: 'Email',
    add: 'Add',
    cancel: 'Cancel',
    parentAge: 'Parent (18+)',
    childAge: 'Child (under 18)',
    phoneOptional: 'Phone (optional)',
    emailOptional: 'Email (optional)',
    invalidId: 'ID must be exactly 9 digits',
    invalidPhone: 'Phone must be exactly 10 digits',
    requiredFields: 'Please fill in all required fields'
  },
  ru: {
    name: 'Полное имя',
    idNumber: 'ID номер (9 цифр)',
    ageRange: 'Возрастная группа',
    selectAge: 'Выберите возраст',
    phone: 'Телефон',
    email: 'Email',
    add: 'Добавить',
    cancel: 'Отмена',
    parentAge: 'Родитель (18+)',
    childAge: 'Ребенок (до 18)',
    phoneOptional: 'Телефон (необязательно)',
    emailOptional: 'Email (необязательно)',
    invalidId: 'ID должен содержать ровно 9 цифр',
    invalidPhone: 'Телефон должен содержать ровно 10 цифр',
    requiredFields: 'Пожалуйста заполните все обязательные поля'
  },
  es: {
    name: 'Nombre completo',
    idNumber: 'Número de ID (9 dígitos)',
    ageRange: 'Rango de edad',
    selectAge: 'Seleccionar rango de edad',
    phone: 'Teléfono móvil',
    email: 'Correo electrónico',
    add: 'Añadir',
    cancel: 'Cancelar',
    parentAge: 'Padre (18+)',
    childAge: 'Niño/a (menor de 18)',
    phoneOptional: 'Teléfono (opcional)',
    emailOptional: 'Correo (opcional)',
    invalidId: 'El ID debe tener exactamente 9 dígitos',
    invalidPhone: 'El teléfono debe tener exactamente 10 dígitos',
    requiredFields: 'Por favor rellene todos los campos requeridos'
  },
  fr: {
    name: 'Nom complet',
    idNumber: 'Numéro ID (9 chiffres)',
    ageRange: 'Tranche d\'âge',
    selectAge: 'Sélectionner la tranche d\'âge',
    phone: 'Téléphone',
    email: 'Email',
    add: 'Ajouter',
    cancel: 'Annuler',
    parentAge: 'Parent (18+)',
    childAge: 'Enfant (moins de 18)',
    phoneOptional: 'Téléphone (facultatif)',
    emailOptional: 'Email (facultatif)',
    invalidId: 'L\'ID doit contenir exactement 9 chiffres',
    invalidPhone: 'Le téléphone doit contenir exactement 10 chiffres',
    requiredFields: 'Veuillez remplir tous les champs obligatoires'
  },
  de: {
    name: 'Vollständiger Name',
    idNumber: 'ID-Nummer (9 Ziffern)',
    ageRange: 'Altersbereich',
    selectAge: 'Altersbereich wählen',
    phone: 'Telefon',
    email: 'Email',
    add: 'Hinzufügen',
    cancel: 'Abbrechen',
    parentAge: 'Eltern (18+)',
    childAge: 'Kind (unter 18)',
    phoneOptional: 'Telefon (optional)',
    emailOptional: 'Email (optional)',
    invalidId: 'ID muss genau 9 Ziffern enthalten',
    invalidPhone: 'Telefon muss genau 10 Ziffern enthalten',
    requiredFields: 'Bitte füllen Sie alle erforderlichen Felder aus'
  },
  it: {
    name: 'Nome completo',
    idNumber: 'Numero ID (9 cifre)',
    ageRange: 'Fascia d\'età',
    selectAge: 'Seleziona fascia d\'età',
    phone: 'Telefono',
    email: 'Email',
    add: 'Aggiungi',
    cancel: 'Annulla',
    parentAge: 'Genitore (18+)',
    childAge: 'Bambino/a (sotto 18)',
    phoneOptional: 'Telefono (facoltativo)',
    emailOptional: 'Email (facoltativo)',
    invalidId: 'L\'ID deve contenere esattamente 9 cifre',
    invalidPhone: 'Il telefono deve contenere esattamente 10 cifre',
    requiredFields: 'Si prega di riempire tutti i campi obbligatori'
  }
};

const ageRanges = ['0-9', '10-18', '19-25', '26-35', '36-50', '51-65', '65+'];

export default function QuickAddParticipantForm({ isOpen, onClose, onAdd, language, isRTL }) {
  const trans = translations[language] || translations.en;
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const isChild = ageRange === '0-9' || ageRange === '10-18';

  const handleAdd = () => {
    // Validation
    if (!name || !idNumber || !ageRange) {
      toast.error(trans.requiredFields);
      return;
    }

    if (!/^\d{9}$/.test(idNumber)) {
      toast.error(trans.invalidId);
      return;
    }

    if (!isChild && !phone) {
      toast.error(trans.requiredFields);
      return;
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      toast.error(trans.invalidPhone);
      return;
    }

    const newParticipant = {
      id: Date.now(),
      name,
      id_number: idNumber,
      age_range: ageRange,
      phone,
      email
    };

    onAdd(newParticipant);
    
    // Reset form
    setName('');
    setIdNumber('');
    setAgeRange('');
    setPhone('');
    setEmail('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-4 bg-white rounded-lg border-2 border-purple-200 space-y-4"
        >
          <div>
            <Label className="text-sm font-semibold">{trans.name} *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={trans.name}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-semibold">{trans.idNumber} *</Label>
              <Input
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="123456789"
                maxLength="9"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{trans.ageRange} *</Label>
              <Select value={ageRange} onValueChange={setAgeRange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={trans.selectAge} />
                </SelectTrigger>
                <SelectContent>
                  {ageRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range.includes('0-') || range.includes('10-') ? trans.childAge : trans.parentAge}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Phone & Email - show based on age */}
          {!isChild && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-semibold">{trans.phone} *</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="0501234567"
                  maxLength="10"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">{trans.email}</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {isChild && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-semibold">{trans.phoneOptional}</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="0501234567"
                  maxLength="10"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">{trans.emailOptional}</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 flex-col sm:flex-row">
            <Button
              onClick={handleAdd}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm"
            >
              {trans.add}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-sm"
            >
              {trans.cancel}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}