// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const translations = {
  he: {
    title: 'הוראות בטיחות',
    subtitle: 'נפגשים בשביל ישראל',
    instructions: [
      'בבקשה להישמע להוראות ולתיאומים, כפי שמעודכנים בכל בוקר',
      'אנחנו צועדים בנעלי הליכה בלבד',
      'בבקשה לקחת לפחות שניים - שלושה ליטר מים לדרך, לפי תנאי היום. לעשות מאמץ לשתות הרבה',
      'אנחנו הולכים על השביל המסומן בלבד',
      'המדריך הולך ראשון והמאסף שלנו תמיד אחרון. אין לסטות ממסגרת זו',
      'בכל סטייה מהשביל (שירותים למשל) יש להשאיר את התיק על השביל ולעדכן חבר/ה שעצרתם לרגע',
      'איבדת את הקבוצה, בבקשה להמתין במקומך! אנחנו נגיע אליך',
      'בכל מקרה כדאי מאד להצטייד במספרי טלפון של עוד אנשים שהולכים איתנו',
      'את כל האשפה אנחנו אוספים בשקית אישית ולוקחים איתנו',
      'רוב הדרך אנחנו הולכים בשמורות טבע. חל איסור על קטיף ואיסוף של צמחים, מאובנים ובעלי חיים',
      'בהיעדר קליטה (עמוק בנחל אולי) אנחנו ממשיכים לפי המסלול ולוח הזמנים'
    ],
    agreeConfirm: 'אני מצהיר/ה שקראתי את הוראות הבטיחות ואת פרטי המסלולים אליהם נרשמתי כפי שמופיעים באתר',
    warning: 'חובה לאשר את הוראות הבטיחות כדי להמשיך',
    confirmed: 'הוראות הבטיחות אושרו'
  },
  en: {
    title: 'Safety Instructions',
    subtitle: 'Nifgashim for Israel Trek',
    instructions: [
      'Please follow instructions and coordination as updated each morning',
      'We walk in hiking shoes only',
      'Please bring at least 2-3 liters of water, depending on weather conditions. Make an effort to drink plenty',
      'We walk on marked trails only',
      'The guide leads and the sweeper is always last. Do not deviate from this framework',
      'When leaving the trail (for bathroom breaks, for example), leave your backpack on the trail and notify a friend',
      'Lost the group? Please wait where you are! We will come to you',
      'It\'s highly recommended to have phone numbers of other participants',
      'We collect all our trash in a personal bag and take it with us',
      'Most of the route goes through nature reserves. Picking or collecting plants, fossils, and animals is prohibited',
      'In case of no reception (deep in a stream perhaps), we continue according to the route and schedule'
    ],
    agreeConfirm: 'I confirm that I have read the safety instructions and the route details for which I registered as they appear on the website',
    warning: 'You must confirm the safety instructions to continue',
    confirmed: 'Safety instructions confirmed'
  },
  ru: {
    title: 'Инструкции по безопасности',
    subtitle: 'Встречи на тропе Израиля',
    instructions: [
      'Пожалуйста, следуйте инструкциям и координации, обновляемым каждое утро',
      'Мы ходим только в походной обуви',
      'Пожалуйста, возьмите не менее 2-3 литров воды, в зависимости от погодных условий. Старайтесь пить больше',
      'Мы ходим только по обозначенным тропам',
      'Проводник идет первым, замыкающий всегда последним. Не отклоняйтесь от этих рамок',
      'При отклонении от тропы (например, для туалета), оставьте рюкзак на тропе и сообщите другу',
      'Потеряли группу? Пожалуйста, ждите на месте! Мы придем к вам',
      'Настоятельно рекомендуется иметь номера телефонов других участников',
      'Мы собираем весь мусор в личный пакет и берем с собой',
      'Большая часть маршрута проходит через природные заповедники. Сбор растений, окаменелостей и животных запрещен',
      'При отсутствии связи (в глубине русла) мы продолжаем согласно маршруту и расписанию'
    ],
    agreeConfirm: 'Я подтверждаю, что прочитал инструкции по безопасности и детали маршрутов, на которые зарегистрировался',
    warning: 'Необходимо подтвердить инструкции по безопасности',
    confirmed: 'Инструкции по безопасности подтверждены'
  },
  es: {
    title: 'Instrucciones de Seguridad',
    subtitle: 'Encuentros en el Sendero de Israel',
    instructions: [
      'Por favor, siga las instrucciones y coordinación actualizadas cada mañana',
      'Caminamos solo con zapatos de senderismo',
      'Por favor, traiga al menos 2-3 litros de agua, según las condiciones climáticas. Esfuércese por beber mucho',
      'Caminamos solo por senderos marcados',
      'El guía va primero y el último siempre es el recolector. No se desvíe de este marco',
      'Al salir del sendero (para ir al baño, por ejemplo), deje su mochila en el sendero e informe a un amigo',
      '¿Perdió el grupo? ¡Espere donde está! Vendremos a usted',
      'Es muy recomendable tener números de teléfono de otros participantes',
      'Recogemos toda nuestra basura en una bolsa personal y la llevamos con nosotros',
      'La mayor parte de la ruta atraviesa reservas naturales. Está prohibido recoger plantas, fósiles y animales',
      'En caso de no tener recepción (en lo profundo de un arroyo), continuamos según la ruta y el horario'
    ],
    agreeConfirm: 'Confirmo que he leído las instrucciones de seguridad y los detalles de la ruta para la que me registré',
    warning: 'Debe confirmar las instrucciones de seguridad para continuar',
    confirmed: 'Instrucciones de seguridad confirmadas'
  },
  fr: {
    title: 'Instructions de Sécurité',
    subtitle: 'Rencontres sur le Sentier d\'Israël',
    instructions: [
      'Veuillez suivre les instructions et la coordination mises à jour chaque matin',
      'Nous marchons uniquement avec des chaussures de randonnée',
      'Veuillez apporter au moins 2-3 litres d\'eau, selon les conditions météorologiques. Faites un effort pour boire beaucoup',
      'Nous marchons uniquement sur les sentiers balisés',
      'Le guide marche en premier et le balayeur est toujours dernier. Ne déviez pas de ce cadre',
      'En quittant le sentier (pour aller aux toilettes, par exemple), laissez votre sac à dos sur le sentier et informez un ami',
      'Perdu le groupe? Attendez où vous êtes! Nous viendrons à vous',
      'Il est fortement recommandé d\'avoir les numéros de téléphone d\'autres participants',
      'Nous collectons tous nos déchets dans un sac personnel et les emportons',
      'La plupart de l\'itinéraire traverse des réserves naturelles. La cueillette de plantes, fossiles et animaux est interdite',
      'En cas d\'absence de réception (au fond d\'un cours d\'eau), nous continuons selon l\'itinéraire et l\'horaire'
    ],
    agreeConfirm: 'Je confirme avoir lu les instructions de sécurité et les détails des itinéraires pour lesquels je me suis inscrit',
    warning: 'Vous devez confirmer les instructions de sécurité pour continuer',
    confirmed: 'Instructions de sécurité confirmées'
  },
  de: {
    title: 'Sicherheitsanweisungen',
    subtitle: 'Treffen auf dem Israel-Trail',
    instructions: [
      'Bitte folgen Sie den Anweisungen und der Koordination, die jeden Morgen aktualisiert werden',
      'Wir wandern nur in Wanderschuhen',
      'Bitte bringen Sie mindestens 2-3 Liter Wasser mit, je nach Wetterbedingungen. Bemühen Sie sich, viel zu trinken',
      'Wir gehen nur auf markierten Wegen',
      'Der Führer geht voraus und der Nachhut ist immer zuletzt. Weichen Sie nicht von diesem Rahmen ab',
      'Beim Verlassen des Weges (zum Beispiel für Toiletten) lassen Sie Ihren Rucksack auf dem Weg und informieren Sie einen Freund',
      'Gruppe verloren? Bitte warten Sie, wo Sie sind! Wir kommen zu Ihnen',
      'Es wird dringend empfohlen, Telefonnummern anderer Teilnehmer zu haben',
      'Wir sammeln all unseren Müll in einer persönlichen Tasche und nehmen ihn mit',
      'Der größte Teil der Route führt durch Naturschutzgebiete. Das Pflücken von Pflanzen, Fossilien und Tieren ist verboten',
      'Bei fehlendem Empfang (tief in einem Bach) folgen wir der Route und dem Zeitplan'
    ],
    agreeConfirm: 'Ich bestätige, dass ich die Sicherheitsanweisungen und die Routendetails gelesen habe',
    warning: 'Sie müssen die Sicherheitsanweisungen bestätigen',
    confirmed: 'Sicherheitsanweisungen bestätigt'
  },
  it: {
    title: 'Istruzioni di Sicurezza',
    subtitle: 'Incontri sul Sentiero d\'Israele',
    instructions: [
      'Si prega di seguire le istruzioni e il coordinamento aggiornati ogni mattina',
      'Camminiamo solo con scarpe da trekking',
      'Si prega di portare almeno 2-3 litri d\'acqua, a seconda delle condizioni meteorologiche. Sforzatevi di bere molto',
      'Camminiamo solo su sentieri segnalati',
      'La guida va per prima e lo spazzino è sempre ultimo. Non deviare da questo schema',
      'Quando si lascia il sentiero (per andare in bagno, ad esempio), lasciare lo zaino sul sentiero e informare un amico',
      'Perso il gruppo? Attendi dove sei! Verremo da te',
      'È altamente raccomandato avere i numeri di telefono di altri partecipanti',
      'Raccogliamo tutti i nostri rifiuti in un sacchetto personale e li portiamo con noi',
      'La maggior parte del percorso attraversa riserve naturali. È vietato raccogliere piante, fossili e animali',
      'In caso di assenza di ricezione (in fondo a un torrente), continuiamo secondo il percorso e l\'orario'
    ],
    agreeConfirm: 'Confermo di aver letto le istruzioni di sicurezza e i dettagli dei percorsi per cui mi sono registrato',
    warning: 'Devi confermare le istruzioni di sicurezza per continuare',
    confirmed: 'Istruzioni di sicurezza confermate'
  }
};

export default function SafetyInstructions({ accepted, onAccept, language = 'he' }) {
  const t = translations[language] || translations.he;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden max-h-[75vh] flex flex-col">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <CardTitle className="text-xl md:text-2xl">{t.title}</CardTitle>
              <p className="text-emerald-50 mt-1 text-sm font-medium">{t.subtitle}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* Instructions List */}
          <div className="space-y-3">
            {t.instructions.map((instruction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed flex-1">
                  {instruction}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Warning Alert */}
          {!accepted && (
            <Alert className="border-2 border-amber-300 bg-amber-50">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-900 font-semibold">
                {t.warning}
              </AlertDescription>
            </Alert>
          )}

          {/* Acceptance Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg hover:border-emerald-300 transition-colors sticky bottom-0">
            <Checkbox
              id="safetyInstructions"
              checked={accepted}
              onCheckedChange={onAccept}
              className="mt-1 shrink-0"
            />
            <Label 
              htmlFor="safetyInstructions" 
              className="cursor-pointer font-semibold text-gray-900 text-sm sm:text-base pt-0.5 leading-relaxed"
            >
              {t.agreeConfirm}
            </Label>
          </div>

          {/* Success Message */}
          {accepted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg flex items-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-800 font-semibold text-sm sm:text-base">
                {t.confirmed}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}