import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Settings, CreditCard } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import GrowConnector from '@/components/payments/GrowConnector';
import PaymentMethodSelector from '@/components/payments/PaymentMethodSelector';
import { toast } from 'sonner';

const translations = {
  he: {
    title: 'הגדרות תשלום',
    subtitle: 'ניהול שיטות התשלום שלך',
    connectors: 'חיבורים',
    methods: 'שיטות',
    connected: 'מחובר',
    notConnected: 'לא מחובר',
    selectDefault: 'בחר שיטת תשלום ברירת מחדל',
    saveSettings: 'שמור הגדרות',
    settingsSaved: 'הגדרות נשמרו בהצלחה'
  },
  en: {
    title: 'Payment Settings',
    subtitle: 'Manage your payment methods',
    connectors: 'Connectors',
    methods: 'Methods',
    connected: 'Connected',
    notConnected: 'Not Connected',
    selectDefault: 'Select default payment method',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully'
  },
  ru: {
    title: 'Настройки платежей',
    subtitle: 'Управляйте своими способами оплаты',
    connectors: 'Соединения',
    methods: 'Методы',
    connected: 'Подключено',
    notConnected: 'Не подключено',
    selectDefault: 'Выберите способ оплаты по умолчанию',
    saveSettings: 'Сохранить настройки',
    settingsSaved: 'Настройки сохранены успешно'
  },
  es: {
    title: 'Configuración de Pagos',
    subtitle: 'Administra tus métodos de pago',
    connectors: 'Conectores',
    methods: 'Métodos',
    connected: 'Conectado',
    notConnected: 'No Conectado',
    selectDefault: 'Selecciona método de pago predeterminado',
    saveSettings: 'Guardar configuración',
    settingsSaved: 'Configuración guardada exitosamente'
  },
  fr: {
    title: 'Paramètres de Paiement',
    subtitle: 'Gérez vos méthodes de paiement',
    connectors: 'Connecteurs',
    methods: 'Méthodes',
    connected: 'Connecté',
    notConnected: 'Non Connecté',
    selectDefault: 'Sélectionnez la méthode de paiement par défaut',
    saveSettings: 'Enregistrer les paramètres',
    settingsSaved: 'Paramètres enregistrés avec succès'
  },
  de: {
    title: 'Zahlungseinstellungen',
    subtitle: 'Verwalten Sie Ihre Zahlungsmethoden',
    connectors: 'Konnektoren',
    methods: 'Methoden',
    connected: 'Verbunden',
    notConnected: 'Nicht verbunden',
    selectDefault: 'Wählen Sie die Standard-Zahlungsmethode',
    saveSettings: 'Einstellungen speichern',
    settingsSaved: 'Einstellungen erfolgreich gespeichert'
  },
  it: {
    title: 'Impostazioni Pagamento',
    subtitle: 'Gestisci i tuoi metodi di pagamento',
    connectors: 'Connettori',
    methods: 'Metodi',
    connected: 'Collegato',
    notConnected: 'Non collegato',
    selectDefault: 'Seleziona metodo di pagamento predefinito',
    saveSettings: 'Salva impostazioni',
    settingsSaved: 'Impostazioni salvate con successo'
  }
};

export default function PaymentSettings() {
  const { language, isRTL } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [selectedMethod, setSelectedMethod] = useState('grow');
  const [growConnected, setGrowConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (user?.grow_connected) {
      setGrowConnected(true);
      setSelectedMethod('grow');
    }
  }, [user]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await base44.auth.updateMe({
        default_payment_method: selectedMethod
      });
      toast.success(t.settingsSaved);
    } catch (error) {
      toast.error(language === 'he' ? 'שגיאה בשמירה' : 'Error saving');
    } finally {
      setLoading(false);
    }
  };

  const handleGrowConnectChange = (connected) => {
    setGrowConnected(connected);
    if (!connected) {
      if (selectedMethod === 'grow') {
        setSelectedMethod('');
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-emerald-600" />
            {t.title}
          </h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="connectors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="connectors" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              {t.connectors}
            </TabsTrigger>
            <TabsTrigger value="methods" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t.methods}
            </TabsTrigger>
          </TabsList>

          {/* Connectors Tab */}
          <TabsContent value="connectors" className="space-y-6">
            <div className="grid gap-6">
              <GrowConnector 
                isConnected={growConnected}
                onConnectChange={handleGrowConnectChange}
              />
            </div>
          </TabsContent>

          {/* Methods Tab */}
          <TabsContent value="methods" className="space-y-6">
            {growConnected ? (
              <div className="space-y-6">
                <PaymentMethodSelector
                  availableMethods={['grow']}
                  selectedMethod={selectedMethod}
                  onSelectMethod={setSelectedMethod}
                  growConnected={growConnected}
                />

                <Button 
                  onClick={handleSaveSettings}
                  disabled={loading || !selectedMethod}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      {language === 'he' ? 'שומר...' : 'Saving...'}
                    </>
                  ) : (
                    t.saveSettings
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">
                    {language === 'he' ? 'אין שיטות תשלום מחוברות' : 'No payment methods connected'}
                  </h3>
                  <p className="text-sm text-amber-700 mb-4">
                    {language === 'he' 
                      ? 'חבר לפחות שיטת תשלום אחת בטאב "חיבורים" כדי להציג אפשרויות'
                      : 'Connect at least one payment method in the "Connectors" tab to see options'}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}