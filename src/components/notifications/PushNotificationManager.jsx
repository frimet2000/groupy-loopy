import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, BellOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PushNotificationManager() {
  const { language, isRTL } = useLanguage();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState('default');

  const translations = {
    he: {
      title: 'התראות Push',
      description: 'קבל התראות בזמן אמת על טיולים חדשים, הודעות ועדכונים',
      enable: 'הפעל התראות',
      disable: 'כבה התראות',
      permissionDenied: 'ההרשאה נדחתה',
      permissionDeniedDesc: 'יש לאפשר התראות בהגדרות הדפדפן',
      notSupported: 'לא נתמך',
      notSupportedDesc: 'הדפדפן שלך אינו תומך בהתראות Push',
      enabled: 'התראות מופעלות',
      disabled: 'התראות מכובות',
      subscribing: 'מפעיל...',
      unsubscribing: 'מכבה...',
      subscribeSuccess: 'התראות הופעלו בהצלחה!',
      unsubscribeSuccess: 'התראות כובו בהצלחה',
      subscribeError: 'שגיאה בהפעלת התראות',
      unsubscribeError: 'שגיאה בכיבוי התראות',
      testNotification: 'שלח התראת ניסיון',
      testing: 'שולח...',
      testSuccess: 'התראת ניסיון נשלחה!',
      testError: 'שגיאה בשליחת התראת ניסיון'
    },
    en: {
      title: 'Push Notifications',
      description: 'Get real-time notifications about new trips, messages, and updates',
      enable: 'Enable Notifications',
      disable: 'Disable Notifications',
      permissionDenied: 'Permission Denied',
      permissionDeniedDesc: 'Please enable notifications in your browser settings',
      notSupported: 'Not Supported',
      notSupportedDesc: 'Your browser does not support Push notifications',
      enabled: 'Notifications Enabled',
      disabled: 'Notifications Disabled',
      subscribing: 'Enabling...',
      unsubscribing: 'Disabling...',
      subscribeSuccess: 'Notifications enabled successfully!',
      unsubscribeSuccess: 'Notifications disabled successfully',
      subscribeError: 'Error enabling notifications',
      unsubscribeError: 'Error disabling notifications',
      testNotification: 'Send Test Notification',
      testing: 'Sending...',
      testSuccess: 'Test notification sent!',
      testError: 'Error sending test notification'
    },
    ru: {
      title: 'Push-уведомления',
      description: 'Получайте уведомления о новых поездках, сообщениях и обновлениях',
      enable: 'Включить уведомления',
      disable: 'Отключить уведомления',
      permissionDenied: 'Доступ запрещен',
      permissionDeniedDesc: 'Разрешите уведомления в настройках браузера',
      notSupported: 'Не поддерживается',
      notSupportedDesc: 'Ваш браузер не поддерживает Push-уведомления',
      enabled: 'Уведомления включены',
      disabled: 'Уведомления отключены',
      subscribing: 'Включение...',
      unsubscribing: 'Отключение...',
      subscribeSuccess: 'Уведомления включены!',
      unsubscribeSuccess: 'Уведомления отключены',
      subscribeError: 'Ошибка включения уведомлений',
      unsubscribeError: 'Ошибка отключения уведомлений',
      testNotification: 'Отправить тестовое уведомление',
      testing: 'Отправка...',
      testSuccess: 'Тестовое уведомление отправлено!',
      testError: 'Ошибка отправки тестового уведомления'
    },
    es: {
      title: 'Notificaciones Push',
      description: 'Recibe notificaciones en tiempo real sobre viajes, mensajes y actualizaciones',
      enable: 'Activar notificaciones',
      disable: 'Desactivar notificaciones',
      permissionDenied: 'Permiso denegado',
      permissionDeniedDesc: 'Habilita las notificaciones en la configuración del navegador',
      notSupported: 'No compatible',
      notSupportedDesc: 'Tu navegador no admite notificaciones Push',
      enabled: 'Notificaciones activadas',
      disabled: 'Notificaciones desactivadas',
      subscribing: 'Activando...',
      unsubscribing: 'Desactivando...',
      subscribeSuccess: '¡Notificaciones activadas!',
      unsubscribeSuccess: 'Notificaciones desactivadas',
      subscribeError: 'Error al activar notificaciones',
      unsubscribeError: 'Error al desactivar notificaciones',
      testNotification: 'Enviar notificación de prueba',
      testing: 'Enviando...',
      testSuccess: '¡Notificación de prueba enviada!',
      testError: 'Error al enviar notificación de prueba'
    },
    fr: {
      title: 'Notifications Push',
      description: 'Recevez des notifications en temps réel sur les voyages, messages et mises à jour',
      enable: 'Activer les notifications',
      disable: 'Désactiver les notifications',
      permissionDenied: 'Permission refusée',
      permissionDeniedDesc: 'Veuillez activer les notifications dans les paramètres du navigateur',
      notSupported: 'Non pris en charge',
      notSupportedDesc: 'Votre navigateur ne prend pas en charge les notifications Push',
      enabled: 'Notifications activées',
      disabled: 'Notifications désactivées',
      subscribing: 'Activation...',
      unsubscribing: 'Désactivation...',
      subscribeSuccess: 'Notifications activées avec succès!',
      unsubscribeSuccess: 'Notifications désactivées avec succès',
      subscribeError: 'Erreur lors de l\'activation des notifications',
      unsubscribeError: 'Erreur lors de la désactivation des notifications',
      testNotification: 'Envoyer une notification de test',
      testing: 'Envoi...',
      testSuccess: 'Notification de test envoyée!',
      testError: 'Erreur lors de l\'envoi de la notification de test'
    },
    de: {
      title: 'Push-Benachrichtigungen',
      description: 'Erhalten Sie Echtzeitbenachrichtigungen über Reisen, Nachrichten und Updates',
      enable: 'Benachrichtigungen aktivieren',
      disable: 'Benachrichtigungen deaktivieren',
      permissionDenied: 'Berechtigung verweigert',
      permissionDeniedDesc: 'Bitte aktivieren Sie Benachrichtigungen in den Browsereinstellungen',
      notSupported: 'Nicht unterstützt',
      notSupportedDesc: 'Ihr Browser unterstützt keine Push-Benachrichtigungen',
      enabled: 'Benachrichtigungen aktiviert',
      disabled: 'Benachrichtigungen deaktiviert',
      subscribing: 'Aktivierung...',
      unsubscribing: 'Deaktivierung...',
      subscribeSuccess: 'Benachrichtigungen erfolgreich aktiviert!',
      unsubscribeSuccess: 'Benachrichtigungen erfolgreich deaktiviert',
      subscribeError: 'Fehler beim Aktivieren der Benachrichtigungen',
      unsubscribeError: 'Fehler beim Deaktivieren der Benachrichtigungen',
      testNotification: 'Testbenachrichtigung senden',
      testing: 'Wird gesendet...',
      testSuccess: 'Testbenachrichtigung gesendet!',
      testError: 'Fehler beim Senden der Testbenachrichtigung'
    },
    it: {
      title: 'Notifiche Push',
      description: 'Ricevi notifiche in tempo reale su viaggi, messaggi e aggiornamenti',
      enable: 'Attiva notifiche',
      disable: 'Disattiva notifiche',
      permissionDenied: 'Autorizzazione negata',
      permissionDeniedDesc: 'Abilita le notifiche nelle impostazioni del browser',
      notSupported: 'Non supportato',
      notSupportedDesc: 'Il tuo browser non supporta le notifiche Push',
      enabled: 'Notifiche attivate',
      disabled: 'Notifiche disattivate',
      subscribing: 'Attivazione...',
      unsubscribing: 'Disattivazione...',
      subscribeSuccess: 'Notifiche attivate con successo!',
      unsubscribeSuccess: 'Notifiche disattivate con successo',
      subscribeError: 'Errore nell\'attivazione delle notifiche',
      unsubscribeError: 'Errore nella disattivazione delle notifiche',
      testNotification: 'Invia notifica di prova',
      testing: 'Invio...',
      testSuccess: 'Notifica di prova inviata!',
      testError: 'Errore nell\'invio della notifica di prova'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    // Check if Service Worker and Push Manager are supported
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);

      // Check if already subscribed
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    setIsLoading(true);
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        toast.error(t.permissionDeniedDesc);
        setIsLoading(false);
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      await navigator.serviceWorker.ready;

      // Get VAPID public key (you'll need to set this)
      const publicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE'; // Replace with actual key

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send subscription to backend
      const response = await base44.functions.invoke('savePushSubscription', {
        subscription: subscription.toJSON()
      });

      if (response.data.success) {
        setIsSubscribed(true);
        toast.success(t.subscribeSuccess);
      } else {
        throw new Error(response.data.error || 'Failed to save subscription');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast.error(t.subscribeError + ': ' + error.message);
    }
    setIsLoading(false);
  };

  const unsubscribe = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        toast.success(t.unsubscribeSuccess);
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast.error(t.unsubscribeError + ': ' + error.message);
    }
    setIsLoading(false);
  };

  const sendTestNotification = async () => {
    setIsLoading(true);
    try {
      const user = await base44.auth.me();
      const response = await base44.functions.invoke('sendPushNotificationToUser', {
        recipientEmail: user.email,
        title: 'Test Notification',
        body: 'This is a test notification from Groupy Loopy!',
        url: '/'
      });

      if (response.data.success) {
        toast.success(t.testSuccess);
      } else {
        throw new Error(response.data.error || 'Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error(t.testError + ': ' + error.message);
    }
    setIsLoading(false);
  };

  if (!isSupported) {
    return (
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <BellOff className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <CardTitle>{t.notSupported}</CardTitle>
              <CardDescription>{t.notSupportedDesc}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card className="border-2 border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <CardTitle>{t.permissionDenied}</CardTitle>
              <CardDescription>{t.permissionDeniedDesc}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${isSubscribed ? 'border-green-200' : 'border-gray-200'}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSubscribed ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {isSubscribed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Bell className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          isSubscribed ? 'bg-green-50' : 'bg-gray-50'
        }`}>
          <span className="text-sm font-medium">
            {isSubscribed ? t.enabled : t.disabled}
          </span>
          <Button
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={isLoading}
            variant={isSubscribed ? "outline" : "default"}
            className={!isSubscribed ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isSubscribed ? t.unsubscribing : t.subscribing}
              </>
            ) : (
              <>
                {isSubscribed ? <BellOff className="w-4 h-4 mr-2" /> : <Bell className="w-4 h-4 mr-2" />}
                {isSubscribed ? t.disable : t.enable}
              </>
            )}
          </Button>
        </div>

        {isSubscribed && (
          <Button
            onClick={sendTestNotification}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.testing}
              </>
            ) : (
              t.testNotification
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}