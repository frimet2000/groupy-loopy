import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

export default function ParticipantQRCode({ userEmail, registrationId }) {
  const { language, isRTL } = useLanguage();

  const translations = {
    he: {
      title: "הצג ל-QR צוות",
      instruction: "הצג קוד זה לצוות הקבלה בנקודת המפגש"
    },
    en: {
      title: "Show QR to Staff",
      instruction: "Show this code to reception staff at meeting point"
    }
  };

  const trans = translations[language] || translations.en;

  // Generate QR code URL (using a QR service or library)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(userEmail)}`;

  return (
    <Card className={`${isRTL ? 'rtl' : 'ltr'} text-center`}>
      <CardHeader>
        <CardTitle className="text-lg">{trans.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white p-4 rounded-lg inline-block shadow-inner">
          <img 
            src={qrCodeUrl} 
            alt="QR Code" 
            className="w-48 h-48 sm:w-64 sm:h-64 mx-auto"
          />
        </div>
        <p className="text-sm text-gray-600 mt-4">{trans.instruction}</p>
        <div className="text-xs text-gray-500 mt-2 font-mono">{userEmail}</div>
      </CardContent>
    </Card>
  );
}