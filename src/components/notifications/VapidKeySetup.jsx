// Component to generate and display VAPID keys for admin setup
import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Key, Copy, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function VapidKeySetup() {
  const { language } = useLanguage();
  const [keys, setKeys] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState({ public: false, private: false });

  const translations = {
    he: {
      title: 'הגדרת מפתחות VAPID',
      description: 'צור מפתחות VAPID להתראות Push',
      generate: 'צור מפתחות',
      generating: 'מייצר...',
      publicKey: 'מפתח ציבורי',
      privateKey: 'מפתח פרטי',
      copy: 'העתק',
      copied: 'הועתק!',
      instructions: 'שמור מפתחות אלה כסודות:',
      step1: '1. העתק את המפתח הציבורי',
      step2: '2. שמור כסוד: WEB_PUSH_PUBLIC_KEY',
      step3: '3. העתק את המפתח הפרטי',
      step4: '4. שמור כסוד: WEB_PUSH_PRIVATE_KEY',
      warning: 'שמור את המפתחות במקום בטוח!',
      error: 'שגיאה ביצירת מפתחות'
    },
    en: {
      title: 'VAPID Keys Setup',
      description: 'Generate VAPID keys for Push Notifications',
      generate: 'Generate Keys',
      generating: 'Generating...',
      publicKey: 'Public Key',
      privateKey: 'Private Key',
      copy: 'Copy',
      copied: 'Copied!',
      instructions: 'Save these keys as secrets:',
      step1: '1. Copy the public key',
      step2: '2. Save as secret: WEB_PUSH_PUBLIC_KEY',
      step3: '3. Copy the private key',
      step4: '4. Save as secret: WEB_PUSH_PRIVATE_KEY',
      warning: 'Keep these keys secure!',
      error: 'Error generating keys'
    },
    ru: {
      title: 'Настройка ключей VAPID',
      description: 'Создайте ключи VAPID для Push-уведомлений',
      generate: 'Создать ключи',
      generating: 'Создание...',
      publicKey: 'Публичный ключ',
      privateKey: 'Приватный ключ',
      copy: 'Копировать',
      copied: 'Скопировано!',
      instructions: 'Сохраните эти ключи как секреты:',
      step1: '1. Скопируйте публичный ключ',
      step2: '2. Сохраните как секрет: WEB_PUSH_PUBLIC_KEY',
      step3: '3. Скопируйте приватный ключ',
      step4: '4. Сохраните как секрет: WEB_PUSH_PRIVATE_KEY',
      warning: 'Храните эти ключи в безопасности!',
      error: 'Ошибка создания ключей'
    },
    es: {
      title: 'Configuración de claves VAPID',
      description: 'Genere claves VAPID para notificaciones Push',
      generate: 'Generar claves',
      generating: 'Generando...',
      publicKey: 'Clave pública',
      privateKey: 'Clave privada',
      copy: 'Copiar',
      copied: '¡Copiado!',
      instructions: 'Guarde estas claves como secretos:',
      step1: '1. Copie la clave pública',
      step2: '2. Guarde como secreto: WEB_PUSH_PUBLIC_KEY',
      step3: '3. Copie la clave privada',
      step4: '4. Guarde como secreto: WEB_PUSH_PRIVATE_KEY',
      warning: '¡Mantenga estas claves seguras!',
      error: 'Error al generar claves'
    },
    fr: {
      title: 'Configuration des clés VAPID',
      description: 'Générez des clés VAPID pour les notifications Push',
      generate: 'Générer les clés',
      generating: 'Génération...',
      publicKey: 'Clé publique',
      privateKey: 'Clé privée',
      copy: 'Copier',
      copied: 'Copié!',
      instructions: 'Enregistrez ces clés en tant que secrets:',
      step1: '1. Copiez la clé publique',
      step2: '2. Enregistrez comme secret: WEB_PUSH_PUBLIC_KEY',
      step3: '3. Copiez la clé privée',
      step4: '4. Enregistrez comme secret: WEB_PUSH_PRIVATE_KEY',
      warning: 'Gardez ces clés en sécurité!',
      error: 'Erreur lors de la génération des clés'
    },
    de: {
      title: 'VAPID-Schlüssel-Setup',
      description: 'VAPID-Schlüssel für Push-Benachrichtigungen generieren',
      generate: 'Schlüssel generieren',
      generating: 'Wird generiert...',
      publicKey: 'Öffentlicher Schlüssel',
      privateKey: 'Privater Schlüssel',
      copy: 'Kopieren',
      copied: 'Kopiert!',
      instructions: 'Speichern Sie diese Schlüssel als Geheimnisse:',
      step1: '1. Kopieren Sie den öffentlichen Schlüssel',
      step2: '2. Speichern als Geheimnis: WEB_PUSH_PUBLIC_KEY',
      step3: '3. Kopieren Sie den privaten Schlüssel',
      step4: '4. Speichern als Geheimnis: WEB_PUSH_PRIVATE_KEY',
      warning: 'Bewahren Sie diese Schlüssel sicher auf!',
      error: 'Fehler beim Generieren der Schlüssel'
    },
    it: {
      title: 'Configurazione chiavi VAPID',
      description: 'Genera chiavi VAPID per le notifiche Push',
      generate: 'Genera chiavi',
      generating: 'Generazione...',
      publicKey: 'Chiave pubblica',
      privateKey: 'Chiave privata',
      copy: 'Copia',
      copied: 'Copiato!',
      instructions: 'Salva queste chiavi come segreti:',
      step1: '1. Copia la chiave pubblica',
      step2: '2. Salva come segreto: WEB_PUSH_PUBLIC_KEY',
      step3: '3. Copia la chiave privata',
      step4: '4. Salva come segreto: WEB_PUSH_PRIVATE_KEY',
      warning: 'Mantieni queste chiavi al sicuro!',
      error: 'Errore durante la generazione delle chiavi'
    }
  };

  const t = translations[language] || translations.en;

  const generateKeys = async () => {
    setIsLoading(true);
    try {
      const response = await base44.functions.invoke('generateVapidKeys', {});
      if (response.data.publicKey && response.data.privateKey) {
        setKeys({
          publicKey: response.data.publicKey,
          privateKey: response.data.privateKey
        });
        toast.success('Keys generated successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating keys:', error);
      toast.error(t.error + ': ' + error.message);
    }
    setIsLoading(false);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [type]: true });
      toast.success(t.copied);
      setTimeout(() => {
        setCopied({ ...copied, [type]: false });
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Key className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!keys ? (
          <Button
            onClick={generateKeys}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.generating}
              </>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" />
                {t.generate}
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">{t.warning}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t.publicKey}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keys.publicKey}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border rounded-lg bg-gray-50 font-mono"
                />
                <Button
                  onClick={() => copyToClipboard(keys.publicKey, 'public')}
                  variant="outline"
                  size="icon"
                >
                  {copied.public ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t.privateKey}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keys.privateKey}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border rounded-lg bg-gray-50 font-mono"
                />
                <Button
                  onClick={() => copyToClipboard(keys.privateKey, 'private')}
                  variant="outline"
                  size="icon"
                >
                  {copied.private ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <p className="font-semibold text-sm">{t.instructions}</p>
              <ol className="text-sm space-y-1 text-gray-700">
                <li>{t.step1}</li>
                <li>{t.step2}</li>
                <li>{t.step3}</li>
                <li>{t.step4}</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}