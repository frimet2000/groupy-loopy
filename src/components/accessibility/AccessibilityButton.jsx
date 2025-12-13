import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Accessibility, ZoomIn, ZoomOut, Contrast, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccessibilityButton() {
  const { language } = useLanguage();
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedFontSize = localStorage.getItem('accessibility_font_size');
    const savedContrast = localStorage.getItem('accessibility_high_contrast');
    
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
      document.documentElement.style.fontSize = `${savedFontSize}%`;
    }
    if (savedContrast === 'true') {
      setHighContrast(true);
      document.body.classList.add('high-contrast');
    }
  }, []);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem('accessibility_font_size', newSize.toString());
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem('accessibility_font_size', newSize.toString());
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    if (newValue) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('accessibility_high_contrast', newValue.toString());
  };

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    document.documentElement.style.fontSize = '100%';
    document.body.classList.remove('high-contrast');
    localStorage.removeItem('accessibility_font_size');
    localStorage.removeItem('accessibility_high_contrast');
  };

  const content = language === 'he' ? {
    title: 'הגדרות נגישות',
    increaseFontSize: 'הגדל גופן',
    decreaseFontSize: 'הקטן גופן',
    highContrast: 'ניגודיות גבוהה',
    resetSettings: 'אפס הגדרות',
    currentSize: `גודל גופן: ${fontSize}%`
  } : {
    title: 'Accessibility Settings',
    increaseFontSize: 'Increase Font Size',
    decreaseFontSize: 'Decrease Font Size',
    highContrast: 'High Contrast',
    resetSettings: 'Reset Settings',
    currentSize: `Font Size: ${fontSize}%`
  };

  return (
    <>
      <style>{`
        .high-contrast {
          filter: contrast(1.5);
        }
        .high-contrast * {
          font-weight: 600 !important;
        }
      `}</style>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-50"
          >
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
              aria-label={language === 'he' ? 'הגדרות נגישות' : 'Accessibility Settings'}
            >
              <Accessibility className="h-6 w-6" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64" side="top">
          <DropdownMenuLabel>{content.title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="px-2 py-2">
            <p className="text-xs text-gray-500 mb-2">{content.currentSize}</p>
          </div>
          
          <DropdownMenuItem onClick={increaseFontSize}>
            <ZoomIn className="w-4 h-4 mr-2" />
            {content.increaseFontSize}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={decreaseFontSize}>
            <ZoomOut className="w-4 h-4 mr-2" />
            {content.decreaseFontSize}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={toggleHighContrast}>
            <Contrast className="w-4 h-4 mr-2" />
            {content.highContrast}
            {highContrast && <span className="ml-auto text-blue-600">✓</span>}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={resetSettings} className="text-red-600">
            <RotateCcw className="w-4 h-4 mr-2" />
            {content.resetSettings}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}