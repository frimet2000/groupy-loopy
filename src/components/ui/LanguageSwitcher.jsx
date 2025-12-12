import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
      className="flex items-center gap-2 font-medium"
    >
      <Globe className="w-4 h-4" />
      {language === 'en' ? 'עברית' : 'English'}
    </Button>
  );
}