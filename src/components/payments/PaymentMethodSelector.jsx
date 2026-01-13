import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Settings2, Check } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { motion } from 'framer-motion';

const translations = {
  he: {
    title: 'שיטות תשלום',
    subtitle: 'בחר שיטת תשלום לטריפים שלך',
    noMethods: 'אין שיטות תשלום מחוברות',
    configure: 'הגדר שיטות תשלום',
    selectMethod: 'בחר שיטה',
    selected: 'נבחר',
    grow: 'Grow by Meshulam',
    stripe: 'Stripe',
    disabled: 'מנוטרל',
    enable: 'הפעל'
  },
  en: {
    title: 'Payment Methods',
    subtitle: 'Select payment methods for your trips',
    noMethods: 'No payment methods connected',
    configure: 'Configure payment methods',
    selectMethod: 'Select Method',
    selected: 'Selected',
    grow: 'Grow by Meshulam',
    stripe: 'Stripe',
    disabled: 'Disabled',
    enable: 'Enable'
  },
  ru: {
    title: 'Способы оплаты',
    subtitle: 'Выберите способы оплаты для ваших поездок',
    noMethods: 'Нет подключенных способов оплаты',
    configure: 'Настроить способы оплаты',
    selectMethod: 'Выбрать метод',
    selected: 'Выбрано',
    grow: 'Grow by Meshulam',
    stripe: 'Stripe',
    disabled: 'Отключено',
    enable: 'Включить'
  },
  es: {
    title: 'Métodos de Pago',
    subtitle: 'Selecciona métodos de pago para tus viajes',
    noMethods: 'Sin métodos de pago conectados',
    configure: 'Configurar métodos de pago',
    selectMethod: 'Seleccionar Método',
    selected: 'Seleccionado',
    grow: 'Grow by Meshulam',
    stripe: 'Stripe',
    disabled: 'Deshabilitado',
    enable: 'Habilitar'
  },
  fr: {
    title: 'Méthodes de Paiement',
    subtitle: 'Sélectionnez les méthodes de paiement pour vos voyages',
    noMethods: 'Aucune méthode de paiement connectée',
    configure: 'Configurer les méthodes de paiement',
    selectMethod: 'Sélectionner la Méthode',
    selected: 'Sélectionné',
    grow: 'Grow by Meshulam',
    stripe: 'Stripe',
    disabled: 'Désactivé',
    enable: 'Activer'
  },
  de: {
    title: 'Zahlungsmethoden',
    subtitle: 'Wählen Sie Zahlungsmethoden für Ihre Reisen',
    noMethods: 'Keine Zahlungsmethoden verbunden',
    configure: 'Zahlungsmethoden konfigurieren',
    selectMethod: 'Methode Wählen',
    selected: 'Ausgewählt',
    grow: 'Grow by Meshulam',
    stripe: 'Stripe',
    disabled: 'Deaktiviert',
    enable: 'Aktivieren'
  },
  it: {
    title: 'Metodi di Pagamento',
    subtitle: 'Seleziona i metodi di pagamento per i tuoi viaggi',
    noMethods: 'Nessun metodo di pagamento collegato',
    configure: 'Configurare i metodi di pagamento',
    selectMethod: 'Seleziona Metodo',
    selected: 'Selezionato',
    grow: 'Grow by Meshulam',
    stripe: 'Stripe',
    disabled: 'Disabilitato',
    enable: 'Abilita'
  }
};

export default function PaymentMethodSelector({ 
  availableMethods = ['grow'],
  selectedMethod = 'grow',
  onSelectMethod,
  growConnected = false,
  stripeConnected = false
}) {
  const { language, isRTL } = useLanguage();
  const t = translations[language] || translations.en;
  
  const methods = [
    {
      id: 'grow',
      name: t.grow,
      icon: CreditCard,
      connected: growConnected,
      color: 'emerald'
    },
    {
      id: 'stripe',
      name: t.stripe,
      icon: CreditCard,
      connected: stripeConnected,
      color: 'blue'
    }
  ];

  const activeMethod = selectedMethod && methods.find(m => m.id === selectedMethod);

  if (!availableMethods.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">{t.noMethods}</p>
            <Button variant="outline">
              <Settings2 className="w-4 h-4 mr-2" />
              {t.configure}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-gray-500 mt-2">{t.subtitle}</p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods.map((method) => {
            if (!availableMethods.includes(method.id)) return null;
            
            const isSelected = selectedMethod === method.id;
            const isActive = method.connected;
            
            return (
              <motion.button
                key={method.id}
                onClick={() => isActive && onSelectMethod?.(method.id)}
                disabled={!isActive}
                whileHover={isActive ? { scale: 1.02 } : {}}
                whileTap={isActive ? { scale: 0.98 } : {}}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isSelected && isActive
                    ? `border-${method.color}-500 bg-${method.color}-50 shadow-lg shadow-${method.color}-200/50`
                    : isActive
                    ? `border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50`
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected
                        ? `bg-${method.color}-100`
                        : 'bg-gray-100'
                    }`}>
                      <method.icon className={`w-5 h-5 ${
                        isSelected
                          ? `text-${method.color}-600`
                          : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-500">
                        {isActive ? (
                          <span className="text-green-600 font-medium">✓ Connected</span>
                        ) : (
                          <span>{t.disabled}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {isSelected && isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <Check className={`w-5 h-5 text-${method.color}-600`} />
                    </motion.div>
                  )}
                </div>

                {isSelected && isActive && (
                  <motion.div
                    layoutId="activeMethod"
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${method.color}-400 to-${method.color}-600 rounded-b-lg`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {activeMethod && activeMethod.connected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700`}
          >
            {language === 'he' 
              ? `${activeMethod.name} נבחר לטיפול בתשלומים`
              : `${activeMethod.name} selected for payment processing`}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}