import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Camera, AlertCircle } from 'lucide-react';

export default function QRScanner({ onScan }) {
  const { language, isRTL } = useLanguage();
  const [manualCode, setManualCode] = useState('');

  const translations = {
    he: {
      title: "סריקת QR",
      manualEntry: "הזנה ידנית",
      enterCode: "הכנס קוד",
      scan: "סרוק",
      cameraNotSupported: "המצלמה אינה נתמכת בדפדפן זה",
      instruction: "בקש מהמשתתף להציג את ה-QR מהאפליקציה"
    },
    en: {
      title: "QR Scanner",
      manualEntry: "Manual Entry",
      enterCode: "Enter code",
      scan: "Scan",
      cameraNotSupported: "Camera not supported in this browser",
      instruction: "Ask participant to show their QR code from the app"
    }
  };

  const trans = translations[language] || translations.en;

  const handleManualScan = () => {
    if (manualCode) {
      onScan(manualCode);
      setManualCode('');
    }
  };

  return (
    <Card className={isRTL ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-6 h-6" />
          {trans.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Camera className="h-4 w-4" />
          <AlertDescription>{trans.instruction}</AlertDescription>
        </Alert>

        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
          <QrCode className="w-24 h-24 text-gray-400" />
        </div>

        <div className="space-y-2">
          <Label>{trans.manualEntry}</Label>
          <div className="flex gap-2">
            <Input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder={trans.enterCode}
            />
            <Button onClick={handleManualScan} className="bg-blue-600 hover:bg-blue-700">
              {trans.scan}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}