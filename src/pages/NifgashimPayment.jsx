import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { CreditCard, Calendar, DollarSign, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NifgashimPayment() {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [processing, setProcessing] = useState(false);

  const translations = {
    he: {
      title: "תשלום - נפגשים בשביל ישראל",
      summary: "סיכום תשלום",
      totalDays: "סה\"כ ימים",
      negevDays: "ימי נגב",
      totalAmount: "סה\"כ לתשלום",
      amountPaid: "שולם",
      remaining: "נותר לתשלום",
      payNow: "שלם עכשיו",
      paymentMethods: "אמצעי תשלום",
      creditCard: "כרטיס אשראי",
      paypal: "PayPal",
      bankTransfer: "העברה בנקאית",
      processing: "מעבד...",
      success: "התשלום בוצע בהצלחה",
      error: "שגיאה בתשלום",
      cancelled: "התשלום בוטל",
      noRegistration: "לא נמצאה הרשמה",
      loginRequired: "נדרש להתחבר",
      paymentStatus: "סטטוס תשלום",
      pending: "ממתין",
      partial: "חלקי",
      completed: "שולם",
      perDay: "ליום",
      breakdown: "פירוט",
      hypInfo: "התשלום מאובטח באמצעות מערכת HYP",
      backToMyTrek: "חזור למסע שלי"
    },
    en: {
      title: "Payment - Nifgashim for Israel",
      summary: "Payment Summary",
      totalDays: "Total Days",
      negevDays: "Negev Days",
      totalAmount: "Total Amount",
      amountPaid: "Paid",
      remaining: "Remaining",
      payNow: "Pay Now",
      paymentMethods: "Payment Methods",
      creditCard: "Credit Card",
      paypal: "PayPal",
      bankTransfer: "Bank Transfer",
      processing: "Processing...",
      success: "Payment successful",
      error: "Payment error",
      cancelled: "Payment cancelled",
      noRegistration: "No registration found",
      loginRequired: "Login required",
      paymentStatus: "Payment Status",
      pending: "Pending",
      partial: "Partial",
      completed: "Completed",
      perDay: "per day",
      breakdown: "Breakdown",
      hypInfo: "Payment secured by HYP system",
      backToMyTrek: "Back to My Trek"
    },
    ru: {
      title: "Оплата - Nifgashim for Israel",
      summary: "Итого к оплате",
      totalDays: "Всего дней",
      negevDays: "Дни Негев",
      totalAmount: "Сумма",
      amountPaid: "Оплачено",
      remaining: "Осталось",
      payNow: "Оплатить",
      paymentMethods: "Способы оплаты",
      creditCard: "Карта",
      paypal: "PayPal",
      bankTransfer: "Перевод",
      processing: "Обработка...",
      success: "Оплачено",
      error: "Ошибка",
      cancelled: "Отменено",
      noRegistration: "Нет регистрации",
      loginRequired: "Требуется вход",
      paymentStatus: "Статус",
      pending: "Ожидание",
      partial: "Частично",
      completed: "Оплачено",
      perDay: "в день",
      breakdown: "Детали",
      hypInfo: "Защищенная оплата HYP",
      backToMyTrek: "К моему треку"
    },
    es: {
      title: "Pago - Nifgashim for Israel",
      summary: "Resumen",
      totalDays: "Días totales",
      negevDays: "Días Negev",
      totalAmount: "Total",
      amountPaid: "Pagado",
      remaining: "Pendiente",
      payNow: "Pagar",
      paymentMethods: "Métodos",
      creditCard: "Tarjeta",
      paypal: "PayPal",
      bankTransfer: "Transferencia",
      processing: "Procesando...",
      success: "Pagado",
      error: "Error",
      cancelled: "Cancelado",
      noRegistration: "Sin registro",
      loginRequired: "Requiere login",
      paymentStatus: "Estado",
      pending: "Pendiente",
      partial: "Parcial",
      completed: "Completo",
      perDay: "por día",
      breakdown: "Desglose",
      hypInfo: "Pago seguro HYP",
      backToMyTrek: "A mi trek"
    },
    fr: {
      title: "Paiement - Nifgashim for Israel",
      summary: "Résumé",
      totalDays: "Jours totaux",
      negevDays: "Jours Negev",
      totalAmount: "Total",
      amountPaid: "Payé",
      remaining: "Restant",
      payNow: "Payer",
      paymentMethods: "Méthodes",
      creditCard: "Carte",
      paypal: "PayPal",
      bankTransfer: "Virement",
      processing: "Traitement...",
      success: "Payé",
      error: "Erreur",
      cancelled: "Annulé",
      noRegistration: "Pas d'inscription",
      loginRequired: "Connexion requise",
      paymentStatus: "Statut",
      pending: "En attente",
      partial: "Partiel",
      completed: "Complété",
      perDay: "par jour",
      breakdown: "Détails",
      hypInfo: "Paiement sécurisé HYP",
      backToMyTrek: "À mon trek"
    },
    de: {
      title: "Zahlung - Nifgashim for Israel",
      summary: "Zusammenfassung",
      totalDays: "Tage gesamt",
      negevDays: "Negev Tage",
      totalAmount: "Gesamt",
      amountPaid: "Bezahlt",
      remaining: "Verbleibend",
      payNow: "Zahlen",
      paymentMethods: "Methoden",
      creditCard: "Karte",
      paypal: "PayPal",
      bankTransfer: "Überweisung",
      processing: "Verarbeitung...",
      success: "Bezahlt",
      error: "Fehler",
      cancelled: "Abgebrochen",
      noRegistration: "Keine Anmeldung",
      loginRequired: "Anmeldung erforderlich",
      paymentStatus: "Status",
      pending: "Ausstehend",
      partial: "Teilweise",
      completed: "Abgeschlossen",
      perDay: "pro Tag",
      breakdown: "Aufschlüsselung",
      hypInfo: "HYP sichere Zahlung",
      backToMyTrek: "Zu meinem Trek"
    },
    it: {
      title: "Pagamento - Nifgashim for Israel",
      summary: "Riepilogo",
      totalDays: "Giorni totali",
      negevDays: "Giorni Negev",
      totalAmount: "Totale",
      amountPaid: "Pagato",
      remaining: "Rimanente",
      payNow: "Paga",
      paymentMethods: "Metodi",
      creditCard: "Carta",
      paypal: "PayPal",
      bankTransfer: "Bonifico",
      processing: "Elaborazione...",
      success: "Pagato",
      error: "Errore",
      cancelled: "Annullato",
      noRegistration: "Nessuna iscrizione",
      loginRequired: "Accesso richiesto",
      paymentStatus: "Stato",
      pending: "In attesa",
      partial: "Parziale",
      completed: "Completato",
      perDay: "al giorno",
      breakdown: "Dettagli",
      hypInfo: "Pagamento sicuro HYP",
      backToMyTrek: "Al mio trek"
    }
  };

  const trans = translations[language] || translations.he;

  const { data: registrations = [] } = useQuery({
    queryKey: ['myNifgashimRegistration', user?.email],
    queryFn: () => base44.entities.NifgashimRegistration.filter({
      user_email: user.email,
      year: new Date().getFullYear()
    }),
    enabled: !!user?.email
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        toast.error(trans.loginRequired);
        base44.auth.redirectToLogin();
      }
    };
    fetchUser();
  }, []);

  const myRegistration = registrations[0];
  const remaining = myRegistration ? (myRegistration.total_amount - (myRegistration.amount_paid || 0)) : 0;

  const handlePayment = async (method) => {
    if (!myRegistration) return;

    setProcessing(true);
    try {
      // TODO: Integrate with HYP API when available
      // For now, simulate payment processing
      
      const result = await base44.functions.invoke('processNifgashimPayment', {
        registrationId: myRegistration.id,
        amount: remaining,
        method,
        language
      });

      if (result.data.success) {
        toast.success(trans.success);
        queryClient.invalidateQueries(['myNifgashimRegistration']);
        setTimeout(() => navigate(createPageUrl('MyNifgashim')), 2000);
      } else {
        toast.error(trans.error);
      }
    } catch (error) {
      console.error(error);
      toast.error(trans.error);
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!myRegistration) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{trans.noRegistration}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-6 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{trans.title}</h1>
          <Badge className={
            myRegistration.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
            myRegistration.payment_status === 'partial' ? 'bg-orange-100 text-orange-800' :
            'bg-yellow-100 text-yellow-800'
          }>
            {trans[myRegistration.payment_status]}
          </Badge>
        </motion.div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {trans.summary}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{trans.totalDays}</div>
                <div className="text-2xl font-bold text-blue-600">{myRegistration.total_days_count}</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{trans.negevDays}</div>
                <div className="text-2xl font-bold text-emerald-600">{myRegistration.negev_days_count}</div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{trans.breakdown}:</span>
                <span>{myRegistration.total_days_count} × 85₪ {trans.perDay}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>{trans.totalAmount}:</span>
                <span className="text-blue-600">{myRegistration.total_amount}₪</span>
              </div>
              {myRegistration.amount_paid > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{trans.amountPaid}:</span>
                  <span>-{myRegistration.amount_paid}₪</span>
                </div>
              )}
              {remaining > 0 && (
                <div className="flex justify-between font-bold text-xl pt-2 border-t">
                  <span>{trans.remaining}:</span>
                  <span className="text-orange-600">{remaining}₪</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {remaining > 0 ? (
          <>
            {/* Payment Methods */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{trans.paymentMethods}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handlePayment('credit_card')}
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-base"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {processing ? trans.processing : trans.creditCard}
                </Button>

                <Button
                  onClick={() => handlePayment('paypal')}
                  disabled={processing}
                  variant="outline"
                  className="w-full h-14 text-base"
                >
                  {trans.paypal}
                </Button>

                <Button
                  onClick={() => handlePayment('bank_transfer')}
                  disabled={processing}
                  variant="outline"
                  className="w-full h-14 text-base"
                >
                  {trans.bankTransfer}
                </Button>
              </CardContent>
            </Card>

            {/* HYP Info */}
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm">{trans.hypInfo}</AlertDescription>
            </Alert>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <div className="text-xl font-bold text-gray-900 mb-2">
                {trans.completed}
              </div>
              <Button onClick={() => navigate(createPageUrl('MyNifgashim'))} className="mt-4">
                {trans.backToMyTrek}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}