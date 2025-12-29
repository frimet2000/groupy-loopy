import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, Code, FileCode, Settings } from 'lucide-react';

export default function PWASetupInstructions() {
  const { language } = useLanguage();

  const translations = {
    he: {
      title: 'הוראות הגדרת PWA',
      step1Title: 'שלב 1: יצירת קבצים',
      step1Desc: 'צור קובץ service-worker.js בתיקיית public/',
      step2Title: 'שלב 2: קובץ Manifest',
      step2Desc: 'צור קובץ manifest.json בתיקיית public/',
      step3Title: 'שלב 3: HTML Meta Tags',
      step3Desc: 'הוסף meta tags ל-index.html',
      step4Title: 'שלב 4: יצירת אייקונים',
      step4Desc: 'צור אייקונים בגדלים: 72, 96, 128, 144, 152, 192, 384, 512',
      step5Title: 'שלב 5: הגדרת VAPID',
      step5Desc: 'הרץ את הפונקציה generateVapidKeys ושמור את המפתחות',
      iosNote: 'הערה: עבור iOS 16.4+, המשתמש חייב להוסיף לבית מהדפדפן',
      serviceWorkerCode: 'קוד Service Worker זמין בקומפוננט ServiceWorkerRegistration'
    },
    en: {
      title: 'PWA Setup Instructions',
      step1Title: 'Step 1: Create Files',
      step1Desc: 'Create service-worker.js in public/ directory',
      step2Title: 'Step 2: Manifest File',
      step2Desc: 'Create manifest.json in public/ directory',
      step3Title: 'Step 3: HTML Meta Tags',
      step3Desc: 'Add meta tags to index.html',
      step4Title: 'Step 4: Create Icons',
      step4Desc: 'Create icons in sizes: 72, 96, 128, 144, 152, 192, 384, 512',
      step5Title: 'Step 5: VAPID Setup',
      step5Desc: 'Run generateVapidKeys function and save the keys',
      iosNote: 'Note: For iOS 16.4+, user must Add to Home Screen from browser',
      serviceWorkerCode: 'Service Worker code available in ServiceWorkerRegistration component'
    },
    ru: {
      title: 'Инструкции по настройке PWA',
      step1Title: 'Шаг 1: Создание файлов',
      step1Desc: 'Создайте service-worker.js в папке public/',
      step2Title: 'Шаг 2: Файл манифеста',
      step2Desc: 'Создайте manifest.json в папке public/',
      step3Title: 'Шаг 3: HTML Meta Tags',
      step3Desc: 'Добавьте meta теги в index.html',
      step4Title: 'Шаг 4: Создание иконок',
      step4Desc: 'Создайте иконки размеров: 72, 96, 128, 144, 152, 192, 384, 512',
      step5Title: 'Шаг 5: Настройка VAPID',
      step5Desc: 'Запустите функцию generateVapidKeys и сохраните ключи',
      iosNote: 'Примечание: Для iOS 16.4+, пользователь должен добавить на главный экран из браузера',
      serviceWorkerCode: 'Код Service Worker доступен в компоненте ServiceWorkerRegistration'
    },
    es: {
      title: 'Instrucciones de configuración PWA',
      step1Title: 'Paso 1: Crear archivos',
      step1Desc: 'Crea service-worker.js en el directorio public/',
      step2Title: 'Paso 2: Archivo Manifest',
      step2Desc: 'Crea manifest.json en el directorio public/',
      step3Title: 'Paso 3: HTML Meta Tags',
      step3Desc: 'Agrega meta tags a index.html',
      step4Title: 'Paso 4: Crear iconos',
      step4Desc: 'Crea iconos en tamaños: 72, 96, 128, 144, 152, 192, 384, 512',
      step5Title: 'Paso 5: Configuración VAPID',
      step5Desc: 'Ejecuta la función generateVapidKeys y guarda las claves',
      iosNote: 'Nota: Para iOS 16.4+, el usuario debe agregar a pantalla de inicio desde el navegador',
      serviceWorkerCode: 'Código del Service Worker disponible en componente ServiceWorkerRegistration'
    },
    fr: {
      title: 'Instructions de configuration PWA',
      step1Title: 'Étape 1 : Créer des fichiers',
      step1Desc: 'Créez service-worker.js dans le répertoire public/',
      step2Title: 'Étape 2 : Fichier manifeste',
      step2Desc: 'Créez manifest.json dans le répertoire public/',
      step3Title: 'Étape 3 : HTML Meta Tags',
      step3Desc: 'Ajoutez des balises meta à index.html',
      step4Title: 'Étape 4 : Créer des icônes',
      step4Desc: 'Créez des icônes aux tailles : 72, 96, 128, 144, 152, 192, 384, 512',
      step5Title: 'Étape 5 : Configuration VAPID',
      step5Desc: 'Exécutez la fonction generateVapidKeys et enregistrez les clés',
      iosNote: 'Remarque : Pour iOS 16.4+, l\'utilisateur doit ajouter à l\'écran d\'accueil depuis le navigateur',
      serviceWorkerCode: 'Code du Service Worker disponible dans le composant ServiceWorkerRegistration'
    },
    de: {
      title: 'PWA-Einrichtungsanleitung',
      step1Title: 'Schritt 1: Dateien erstellen',
      step1Desc: 'Erstellen Sie service-worker.js im Verzeichnis public/',
      step2Title: 'Schritt 2: Manifest-Datei',
      step2Desc: 'Erstellen Sie manifest.json im Verzeichnis public/',
      step3Title: 'Schritt 3: HTML Meta Tags',
      step3Desc: 'Fügen Sie Meta-Tags zu index.html hinzu',
      step4Title: 'Schritt 4: Icons erstellen',
      step4Desc: 'Erstellen Sie Icons in Größen: 72, 96, 128, 144, 152, 192, 384, 512',
      step5Title: 'Schritt 5: VAPID-Konfiguration',
      step5Desc: 'Führen Sie die Funktion generateVapidKeys aus und speichern Sie die Schlüssel',
      iosNote: 'Hinweis: Für iOS 16.4+ muss der Benutzer vom Browser aus zum Startbildschirm hinzufügen',
      serviceWorkerCode: 'Service Worker-Code verfügbar in ServiceWorkerRegistration-Komponente'
    },
    it: {
      title: 'Istruzioni configurazione PWA',
      step1Title: 'Passo 1: Creare file',
      step1Desc: 'Crea service-worker.js nella directory public/',
      step2Title: 'Passo 2: File Manifest',
      step2Desc: 'Crea manifest.json nella directory public/',
      step3Title: 'Passo 3: HTML Meta Tags',
      step3Desc: 'Aggiungi meta tag a index.html',
      step4Title: 'Passo 4: Creare icone',
      step4Desc: 'Crea icone nelle dimensioni: 72, 96, 128, 144, 152, 192, 384, 512',
      step5Title: 'Passo 5: Configurazione VAPID',
      step5Desc: 'Esegui la funzione generateVapidKeys e salva le chiavi',
      iosNote: 'Nota: Per iOS 16.4+, l\'utente deve aggiungere alla schermata Home dal browser',
      serviceWorkerCode: 'Codice Service Worker disponibile nel componente ServiceWorkerRegistration'
    }
  };

  const t = translations[language] || translations.en;

  const serviceWorkerCode = `// Service Worker code available in:
// components/pwa/ServiceWorkerRegistration.jsx
// Export SERVICE_WORKER_SCRIPT constant

// Copy and save as: public/service-worker.js`;

  const manifestCode = `// Manifest code available in:
// components/pwa/PWAManifest.jsx
// Export PWA_MANIFEST constant

// Copy and save as: public/manifest.json`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Code className="w-4 h-4" />
          <AlertDescription className="text-sm">
            {t.iosNote}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <FileCode className="w-4 h-4" />
              {t.step1Title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{t.step1Desc}</p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {serviceWorkerCode}
            </pre>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <FileCode className="w-4 h-4" />
              {t.step2Title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{t.step2Desc}</p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {manifestCode}
            </pre>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Code className="w-4 h-4" />
              {t.step3Title}
            </h3>
            <p className="text-sm text-gray-600">{t.step3Desc}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4" />
              {t.step4Title}
            </h3>
            <p className="text-sm text-gray-600">{t.step4Desc}</p>
          </div>

          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-blue-600" />
              {t.step5Title}
            </h3>
            <p className="text-sm text-gray-600">{t.step5Desc}</p>
          </div>
        </div>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-sm">
            {t.serviceWorkerCode}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}