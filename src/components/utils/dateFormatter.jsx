import { format as dateFnsFormat } from 'date-fns';
import { he, enUS, fr, es, de, it, ru } from 'date-fns/locale';

const locales = {
  he: he,
  en: enUS,
  fr: fr,
  es: es,
  de: de,
  it: it,
  ru: ru
};

export function formatDate(date, language = 'en') {
  const locale = locales[language] || enUS;
  
  // Default format string based on language
  const formatString = language === 'he' ? 'd בMMM' : 'MMM d';
  
  return dateFnsFormat(new Date(date), formatString, { locale });
}