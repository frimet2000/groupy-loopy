import { format as dateFnsFormat } from 'date-fns';
import { he, enUS, fr, es, de, it } from 'date-fns/locale';

const locales = {
  he: he,
  en: enUS,
  fr: fr,
  es: es,
  de: de,
  it: it
};

export function formatDate(date, formatStr, language = 'en') {
  const locale = locales[language] || enUS;
  return dateFnsFormat(date, formatStr, { locale });
}