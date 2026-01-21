// @ts-nocheck
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '../components/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Loader2, 
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function CancelNifgashimRegistration() {
  const { language } = useLanguage();
  const [mode, setMode] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const translations = {
    he: {
      title: 'ביטול השתתפות במסע',
      subtitle: 'ביטול ההרשמה שלך למסע נפגשים',
      confirmTitle: 'אישור ביטול',
      confirmDesc: 'הזן את פרטיך לביטול ההשתתפות',
      confirmWarning: 'פעולה זו היא בלתי הפיכה. לאחר הביטול לא תוכל להשתתף במסע.',
      reasonLabel: 'סיבת הביטול (אופציונלי)',
      reasonPlaceholder: 'אנא ציין את הסיבה לביטול...',
      cancelButton: 'בטל השתתפות',
      cancelling: 'מבטל...',
      success: 'ההשתתפות בוטלה בהצלחה',
      successDesc: 'אימייל אישור נשלח אליך עם פרטי הביטול.',
      email: 'כתובת מייל',
      emailPlaceholder: 'המייל שנרשמת איתו',
      idNumber: 'תעודת זהות (אופציונלי)',
      idPlaceholder: '123456789',
      required: 'שדה חובה',
      notFound: 'לא נמצאה הרשמה פעילה',
      notFoundDesc: 'ההרשמה כבר בוטלה או שהפרטים שהוזנו שגויים'
    },
    en: {
      title: 'Cancel Trek Registration',
      subtitle: 'Cancel your Nifgashim Trek registration',
      confirmTitle: 'Confirm Cancellation',
      confirmDesc: 'Enter your details to cancel registration',
      confirmWarning: 'This action is irreversible. After cancellation, you will not be able to participate.',
      reasonLabel: 'Cancellation Reason (optional)',
      reasonPlaceholder: 'Please provide a reason for cancellation...',
      cancelButton: 'Cancel Registration',
      cancelling: 'Cancelling...',
      success: 'Registration Cancelled Successfully',
      successDesc: 'A confirmation email has been sent to you with cancellation details.',
      email: 'Email Address',
      emailPlaceholder: 'Email used for registration',
      idNumber: 'ID Number (optional)',
      idPlaceholder: '123456789',
      required: 'Required field',
      notFound: 'No active registration found',
      notFoundDesc: 'Registration already cancelled or details incorrect'
    },
    ru: {
      title: 'Отмена регистрации',
      subtitle: 'Отмена регистрации на trek',
      loading: 'Загрузка...',
      invalidLink: 'Недействительная ссылка',
      invalidLinkDesc: 'Ссылка недействительна или истек срок действия.',
      confirmTitle: 'Подтвердить отмену',
      confirmDesc: 'Вы уверены, что хотите отменить регистрацию?',
      confirmWarning: 'Это действие необратимо. После отмены вы не сможете участвовать.',
      reasonLabel: 'Причина отмены (необязательно)',
      reasonPlaceholder: 'Укажите причину отмены...',
      cancelButton: 'Отменить регистрацию',
      cancelling: 'Отмена...',
      goBack: 'Назад',
      success: 'Регистрация отменена',
      successDesc: 'Письмо с подтверждением отправлено.',
      alreadyCancelled: 'Эта регистрация уже отменена',
      resendLink: 'Отправить ссылку',
      resendTitle: 'Получить ссылку',
      resendDesc: 'Введите email регистрации',
      email: 'Email',
      idNumber: 'ID (необязательно)',
      sendLink: 'Отправить',
      sending: 'Отправка...',
      linkSent: 'Ссылка отправлена!',
      linkSentDesc: 'Если регистрация существует, ссылка отправлена.',
      participantInfo: 'Данные участников',
      selectedDaysInfo: 'Выбранные дни'
    },
    es: {
      title: 'Cancelar Registro',
      subtitle: 'Cancelar tu registro al trek',
      loading: 'Cargando...',
      invalidLink: 'Enlace Inválido',
      invalidLinkDesc: 'El enlace es inválido o ha expirado.',
      confirmTitle: 'Confirmar Cancelación',
      confirmDesc: '¿Estás seguro de cancelar tu registro?',
      confirmWarning: 'Esta acción es irreversible. No podrás participar después.',
      reasonLabel: 'Motivo (opcional)',
      reasonPlaceholder: 'Indica el motivo...',
      cancelButton: 'Cancelar Registro',
      cancelling: 'Cancelando...',
      goBack: 'Volver',
      success: 'Registro Cancelado',
      successDesc: 'Se envió un correo de confirmación.',
      alreadyCancelled: 'Este registro ya fue cancelado',
      resendLink: 'Reenviar Enlace',
      resendTitle: 'Obtener Enlace',
      resendDesc: 'Ingresa tu email',
      email: 'Email',
      idNumber: 'ID (opcional)',
      sendLink: 'Enviar',
      sending: 'Enviando...',
      linkSent: 'Enlace Enviado!',
      linkSentDesc: 'Si existe registro, se envió el enlace.',
      participantInfo: 'Detalles',
      selectedDaysInfo: 'Días Seleccionados'
    },
    fr: {
      title: 'Annuler l\'Inscription',
      subtitle: 'Annuler votre inscription au trek',
      loading: 'Chargement...',
      invalidLink: 'Lien Invalide',
      invalidLinkDesc: 'Le lien est invalide ou expiré.',
      confirmTitle: 'Confirmer l\'Annulation',
      confirmDesc: 'Êtes-vous sûr de vouloir annuler?',
      confirmWarning: 'Action irréversible. Vous ne pourrez pas participer.',
      reasonLabel: 'Raison (optionnel)',
      reasonPlaceholder: 'Indiquez la raison...',
      cancelButton: 'Annuler l\'Inscription',
      cancelling: 'Annulation...',
      goBack: 'Retour',
      success: 'Inscription Annulée',
      successDesc: 'Email de confirmation envoyé.',
      alreadyCancelled: 'Cette inscription est déjà annulée',
      resendLink: 'Renvoyer le Lien',
      resendTitle: 'Obtenir le Lien',
      resendDesc: 'Entrez votre email',
      email: 'Email',
      idNumber: 'ID (optionnel)',
      sendLink: 'Envoyer',
      sending: 'Envoi...',
      linkSent: 'Lien Envoyé!',
      linkSentDesc: 'Si une inscription existe, le lien a été envoyé.',
      participantInfo: 'Détails',
      selectedDaysInfo: 'Jours Sélectionnés'
    },
    de: {
      title: 'Registrierung Stornieren',
      subtitle: 'Trek-Registrierung stornieren',
      loading: 'Laden...',
      invalidLink: 'Ungültiger Link',
      invalidLinkDesc: 'Der Link ist ungültig oder abgelaufen.',
      confirmTitle: 'Stornierung Bestätigen',
      confirmDesc: 'Sind Sie sicher, dass Sie stornieren möchten?',
      confirmWarning: 'Diese Aktion ist unwiderruflich.',
      reasonLabel: 'Grund (optional)',
      reasonPlaceholder: 'Grund angeben...',
      cancelButton: 'Registrierung Stornieren',
      cancelling: 'Stornierung...',
      goBack: 'Zurück',
      success: 'Registrierung Storniert',
      successDesc: 'Bestätigungs-E-Mail gesendet.',
      alreadyCancelled: 'Diese Registrierung wurde bereits storniert',
      resendLink: 'Link Erneut Senden',
      resendTitle: 'Link Erhalten',
      resendDesc: 'Gib deine E-Mail ein',
      email: 'E-Mail',
      idNumber: 'ID (optional)',
      sendLink: 'Senden',
      sending: 'Senden...',
      linkSent: 'Link Gesendet!',
      linkSentDesc: 'Falls eine Registrierung existiert, wurde der Link gesendet.',
      participantInfo: 'Details',
      selectedDaysInfo: 'Ausgewählte Tage'
    },
    it: {
      title: 'Annulla Registrazione',
      subtitle: 'Annulla la tua registrazione al trek',
      loading: 'Caricamento...',
      invalidLink: 'Link Non Valido',
      invalidLinkDesc: 'Il link non è valido o scaduto.',
      confirmTitle: 'Conferma Annullamento',
      confirmDesc: 'Sei sicuro di voler annullare?',
      confirmWarning: 'Azione irreversibile.',
      reasonLabel: 'Motivo (opzionale)',
      reasonPlaceholder: 'Indica il motivo...',
      cancelButton: 'Annulla Registrazione',
      cancelling: 'Annullamento...',
      goBack: 'Indietro',
      success: 'Registrazione Annullata',
      successDesc: 'Email di conferma inviata.',
      alreadyCancelled: 'Questa registrazione è già annullata',
      resendLink: 'Reinvia Link',
      resendTitle: 'Ottieni Link',
      resendDesc: 'Inserisci la tua email',
      email: 'Email',
      idNumber: 'ID (opzionale)',
      sendLink: 'Invia',
      sending: 'Invio...',
      linkSent: 'Link Inviato!',
      linkSentDesc: 'Se esiste una registrazione, il link è stato inviato.',
      participantInfo: 'Dettagli',
      selectedDaysInfo: 'Giorni Selezionati'
    }
  };

  const t = translations[language] || translations.en;

  const handleCancelRegistration = async () => {
    if (!email) {
      toast.error(t.required);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await base44.functions.invoke('cancelNifgashimRegistration', {
        email: email,
        idNumber: idNumber || undefined,
        cancellationReason: cancellationReason || undefined,
        language: language
      });

      if (response.data.success) {
        setMode('success');
        toast.success(t.success);
      } else if (response.data.error === 'not_found') {
        toast.error(t.notFound);
      } else {
        toast.error(response.data.error || 'Error cancelling registration');
      }
    } catch (err) {
      console.error('Error cancelling:', err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.success}</h2>
              <p className="text-gray-600">{t.successDesc}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (mode === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600 mt-2">{t.subtitle}</p>
          </div>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-800 text-lg mb-2">{t.confirmTitle}</h3>
                  <p className="text-red-700 mb-3">{t.confirmDesc}</p>
                  <p className="text-red-600 text-sm font-medium">{t.confirmWarning}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'he' ? 'פרטי ההרשמה' : 'Registration Details'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t.email}</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <Label>{t.idNumber}</Label>
                <Input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={t.idPlaceholder}
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.reasonLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder={t.reasonPlaceholder}
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex justify-center pb-8">
            <Button
              onClick={handleCancelRegistration}
              disabled={isSubmitting || !email}
              className="gap-2 bg-red-600 hover:bg-red-700 px-8"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.cancelling}
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  {t.cancelButton}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.success}</h2>
            <p className="text-gray-600">{t.successDesc}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}