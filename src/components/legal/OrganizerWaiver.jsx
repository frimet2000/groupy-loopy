import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';

export default function OrganizerWaiver({ open, onAccept, onDecline }) {
  const { language, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const contentMap = {
    he: {
      title: 'כתב ויתור למארגן טיול',
      subtitle: 'אנא קרא בעיון לפני יצירת הטיול',
      sections: [
        {
          title: 'הצהרת אחריות מלאה',
          text: `בתור מארגן הטיול, אני מצהיר ומתחייב כי:

• אני נושא באחריות מלאה ובלעדית לכל היבטי הטיול
• אני בעל הידע, הניסיון והכישורים הנדרשים לארגון והנהלת הטיול
• אני אבחר מסלול מתאים ובטיחותי לרמת הכושר והניסיון של המשתתפים
• אני אתריע למשתתפים על כל סיכון ידוע או צפוי במסלול
• אני אוודא שתנאי מזג האוויר והשטח בטוחים לפני תחילת הטיול`
        },
        {
          title: 'חובות זהירות',
          text: `אני מתחייב:

• לבדוק את המסלול מראש ולזהות סיכונים
• לספק למשתתפים מידע מדויק על רמת הקושי, משך הזמן והציוד הנדרש
• לשאת עמי ציוד עזרה ראשונה ואמצעי תקשורת
• לפעול בזהירות מירבית ובאחריות לשמירה על בטיחות המשתתפים
• לבטל את הטיול אם התנאים אינם בטיחותיים`
        },
        {
          title: 'ויתור על תביעות כלפי הפלטפורמה',
          text: `אני מבין ומסכים כי:

• הפלטפורמה משמשת אך ורק כמתווכת טכנולוגית
• הפלטפורמה אינה נושאת בכל אחריות לטיול
• אני מוותר באופן סופי ובלתי חוזר על כל תביעה כלפי הפלטפורמה
• אני מתחייב לשפות את הפלטפורמה מכל תביעה שתוגש על ידי משתתף`
        },
        {
          title: 'הצהרה על עמידה בחוק',
          text: `אני מצהיר כי:

• הטיול יתקיים במקום המותר על פי חוק
• אני אציית לכל החוקים והתקנות הרלוונטיים
• אין מניעה חוקית לארגון הטיול
• קיבלתי את כל האישורים הנדרשים (במידה ונדרשים)`
        }
      ],
      confirmation: 'אני מאשר שקראתי, הבנתי ומסכים לכל האמור לעיל',
      accept: 'אני מקבל את האחריות ומאשר',
      decline: 'ביטול',
      next: 'הבא',
      back: 'חזור'
    },
    ru: {
      title: 'Отказ от ответственности организатора',
      subtitle: 'Внимательно прочитайте перед созданием поездки',
      sections: [
        {
          title: 'Заявление о полной ответственности',
          text: `Как организатор поездки, я заявляю и обязуюсь:

• Я несу полную и исключительную ответственность за все аспекты поездки
• Я обладаю знаниями, опытом и навыками, необходимыми для организации и проведения поездки
• Я выберу подходящий и безопасный маршрут для уровня физической подготовки и опыта участников
• Я предупрежу участников о любых известных или предвидимых рисках на маршруте
• Я обеспечу безопасность погодных и территориальных условий перед началом поездки`
        },
        {
          title: 'Обязанность заботы',
          text: `Я обязуюсь:

• Проверить маршрут заранее и выявить риски
• Предоставить участникам точную информацию об уровне сложности, продолжительности и необходимом снаряжении
• Нести с собой аптечку первой помощи и средства связи
• Действовать с максимальной осторожностью и ответственностью за безопасность участников
• Отменить поездку, если условия небезопасны`
        },
        {
          title: 'Отказ от претензий к платформе',
          text: `Я понимаю и соглашаюсь с тем, что:

• Платформа служит исключительно в качестве технологического посредника
• Платформа не несет никакой ответственности за поездку
• Я окончательно и безвозвратно отказываюсь от любых претензий к платформе
• Я обязуюсь возместить платформе ущерб от любых претензий участников`
        },
        {
          title: 'Заявление о соблюдении законов',
          text: `Я заявляю, что:

• Поездка состоится в законно разрешенном месте
• Я буду соблюдать все соответствующие законы и правила
• Нет юридических препятствий для организации поездки
• Я получил все необходимые разрешения (если применимо)`
        }
      ],
      confirmation: 'Я подтверждаю, что прочитал, понял и согласен со всем вышеизложенным',
      accept: 'Я принимаю ответственность и подтверждаю',
      decline: 'Отмена',
      next: 'Далее',
      back: 'Назад'
    },
    es: {
      title: 'Exención de responsabilidad del organizador',
      subtitle: 'Por favor lea cuidadosamente antes de crear el viaje',
      sections: [
        {
          title: 'Declaración de responsabilidad total',
          text: `Como organizador del viaje, declaro y me comprometo a que:

• Asumo responsabilidad total y exclusiva por todos los aspectos del viaje
• Poseo el conocimiento, experiencia y habilidades necesarias para organizar y dirigir el viaje
• Seleccionaré una ruta adecuada y segura para los niveles de condición física y experiencia de los participantes
• Advertiré a los participantes sobre cualquier riesgo conocido o previsible en la ruta
• Me aseguraré de que las condiciones climáticas y del terreno sean seguras antes del inicio del viaje`
        },
        {
          title: 'Deber de cuidado',
          text: `Me comprometo a:

• Verificar la ruta con anticipación e identificar riesgos
• Proporcionar a los participantes información precisa sobre el nivel de dificultad, duración y equipo necesario
• Llevar equipo de primeros auxilios y dispositivos de comunicación
• Actuar con el máximo cuidado y responsabilidad por la seguridad de los participantes
• Cancelar el viaje si las condiciones no son seguras`
        },
        {
          title: 'Renuncia de reclamaciones contra la plataforma',
          text: `Entiendo y acepto que:

• La plataforma sirve únicamente como intermediario tecnológico
• La plataforma no asume responsabilidad alguna por el viaje
• Renuncio final e irrevocablemente a cualquier reclamación contra la plataforma
• Me comprometo a indemnizar a la plataforma de cualquier reclamación presentada por un participante`
        },
        {
          title: 'Declaración de cumplimiento legal',
          text: `Declaro que:

• El viaje tendrá lugar en un lugar legalmente permitido
• Cumpliré con todas las leyes y regulaciones pertinentes
• No existe impedimento legal para organizar el viaje
• He obtenido todos los permisos necesarios (si corresponde)`
        }
      ],
      confirmation: 'Confirmo que he leído, entendido y acepto todo lo anterior',
      accept: 'Acepto la responsabilidad y confirmo',
      decline: 'Cancelar',
      next: 'Siguiente',
      back: 'Atrás'
    },
    fr: {
      title: 'Décharge de responsabilité de l\'organisateur',
      subtitle: 'Veuillez lire attentivement avant de créer le voyage',
      sections: [
        {
          title: 'Déclaration de responsabilité totale',
          text: `En tant qu'organisateur du voyage, je déclare et m'engage à ce que:

• J'assume l'entière et exclusive responsabilité de tous les aspects du voyage
• Je possède les connaissances, l'expérience et les compétences nécessaires pour organiser et diriger le voyage
• Je sélectionnerai un itinéraire approprié et sûr pour les niveaux de condition physique et d'expérience des participants
• J'avertirai les participants de tout risque connu ou prévisible sur l'itinéraire
• Je m'assurerai que les conditions météorologiques et du terrain sont sûres avant le début du voyage`
        },
        {
          title: 'Devoir de diligence',
          text: `Je m'engage à:

• Vérifier l'itinéraire à l'avance et identifier les risques
• Fournir aux participants des informations précises sur le niveau de difficulté, la durée et l'équipement nécessaire
• Emporter du matériel de premiers secours et des appareils de communication
• Agir avec le maximum de prudence et de responsabilité pour la sécurité des participants
• Annuler le voyage si les conditions ne sont pas sûres`
        },
        {
          title: 'Renonciation aux réclamations contre la plateforme',
          text: `Je comprends et accepte que:

• La plateforme sert uniquement d'intermédiaire technologique
• La plateforme n'assume aucune responsabilité pour le voyage
• Je renonce définitivement et irrévocablement à toute réclamation contre la plateforme
• Je m'engage à indemniser la plateforme de toute réclamation déposée par un participant`
        },
        {
          title: 'Déclaration de conformité légale',
          text: `Je déclare que:

• Le voyage aura lieu dans un endroit légalement autorisé
• Je respecterai toutes les lois et réglementations pertinentes
• Il n'y a aucun empêchement légal à l'organisation du voyage
• J'ai obtenu tous les permis nécessaires (le cas échéant)`
        }
      ],
      confirmation: 'Je confirme avoir lu, compris et accepté tout ce qui précède',
      accept: 'J\'accepte la responsabilité et confirme',
      decline: 'Annuler',
      next: 'Suivant',
      back: 'Retour'
    },
    de: {
      title: 'Haftungsausschluss für Organisator',
      subtitle: 'Bitte sorgfältig lesen bevor Sie die Reise erstellen',
      sections: [
        {
          title: 'Vollständige Haftungserklärung',
          text: `Als Organisator der Reise erkläre und verpflichte ich mich:

• Ich trage die volle und ausschließliche Verantwortung für alle Aspekte der Reise
• Ich verfüge über das Wissen, die Erfahrung und die Fähigkeiten, die zur Organisation und Leitung der Reise erforderlich sind
• Ich werde eine geeignete und sichere Route für die Fitness- und Erfahrungsstufen der Teilnehmer auswählen
• Ich werde die Teilnehmer vor allen bekannten oder vorhersehbaren Risiken auf der Route warnen
• Ich stelle sicher, dass Wetter- und Geländebedingungen vor Beginn der Reise sicher sind`
        },
        {
          title: 'Sorgfaltspflicht',
          text: `Ich verpflichte mich:

• Die Route im Voraus zu überprüfen und Risiken zu identifizieren
• Den Teilnehmern genaue Informationen über Schwierigkeitsgrad, Dauer und erforderliche Ausrüstung zu geben
• Erste-Hilfe-Ausrüstung und Kommunikationsgeräte mitzuführen
• Mit größter Sorgfalt und Verantwortung für die Sicherheit der Teilnehmer zu handeln
• Die Reise abzusagen, wenn die Bedingungen nicht sicher sind`
        },
        {
          title: 'Verzicht auf Ansprüche gegen die Plattform',
          text: `Ich verstehe und akzeptiere, dass:

• Die Plattform ausschließlich als technologischer Vermittler dient
• Die Plattform keine Verantwortung für die Reise trägt
• Ich endgültig und unwiderruflich auf alle Ansprüche gegen die Plattform verzichte
• Ich mich verpflichte, die Plattform von allen Ansprüchen eines Teilnehmers freizustellen`
        },
        {
          title: 'Erklärung zur Rechtskonformität',
          text: `Ich erkläre, dass:

• Die Reise an einem gesetzlich erlaubten Ort stattfinden wird
• Ich alle relevanten Gesetze und Vorschriften einhalten werde
• Es kein rechtliches Hindernis für die Organisation der Reise gibt
• Ich alle erforderlichen Genehmigungen erhalten habe (falls zutreffend)`
        }
      ],
      confirmation: 'Ich bestätige, dass ich alles oben Genannte gelesen, verstanden und akzeptiert habe',
      accept: 'Ich übernehme die Verantwortung und bestätige',
      decline: 'Abbrechen',
      next: 'Weiter',
      back: 'Zurück'
    },
    it: {
      title: 'Esonero di responsabilità per l\'organizzatore',
      subtitle: 'Si prega di leggere attentamente prima di creare il viaggio',
      sections: [
        {
          title: 'Dichiarazione di responsabilità totale',
          text: `Come organizzatore del viaggio, dichiaro e mi impegno a:

• Assumo la piena ed esclusiva responsabilità per tutti gli aspetti del viaggio
• Possiedo le conoscenze, l'esperienza e le competenze necessarie per organizzare e guidare il viaggio
• Selezionerò un percorso adatto e sicuro per i livelli di forma fisica ed esperienza dei partecipanti
• Avviserò i partecipanti di qualsiasi rischio noto o prevedibile sul percorso
• Mi assicurerò che le condizioni meteorologiche e del terreno siano sicure prima dell'inizio del viaggio`
        },
        {
          title: 'Dovere di diligenza',
          text: `Mi impegno a:

• Controllare il percorso in anticipo e identificare i rischi
• Fornire ai partecipanti informazioni accurate sul livello di difficoltà, durata e attrezzatura necessaria
• Portare attrezzature di primo soccorso e dispositivi di comunicazione
• Agire con la massima cura e responsabilità per la sicurezza dei partecipanti
• Annullare il viaggio se le condizioni non sono sicure`
        },
        {
          title: 'Rinuncia a reclami contro la piattaforma',
          text: `Comprendo e accetto che:

• La piattaforma funge esclusivamente da intermediario tecnologico
• La piattaforma non si assume alcuna responsabilità per il viaggio
• Rinuncio definitivamente e irrevocabilmente a qualsiasi reclamo contro la piattaforma
• Mi impegno a indennizzare la piattaforma da qualsiasi reclamo presentato da un partecipante`
        },
        {
          title: 'Dichiarazione di conformità legale',
          text: `Dichiaro che:

• Il viaggio si svolgerà in un luogo legalmente consentito
• Rispetterò tutte le leggi e i regolamenti pertinenti
• Non esiste alcun impedimento legale all'organizzazione del viaggio
• Ho ottenuto tutti i permessi necessari (se applicabile)`
        }
      ],
      confirmation: 'Confermo di aver letto, compreso e accettato tutto quanto sopra',
      accept: 'Accetto la responsabilità e confermo',
      decline: 'Annulla',
      next: 'Avanti',
      back: 'Indietro'
    }
  };

  const content = contentMap[language] || contentMap['en'] || {
    title: 'Trip Organizer Liability Waiver',
    subtitle: 'Please read carefully before creating the trip',
    sections: [
      {
        title: 'Full Liability Declaration',
        text: `As the trip organizer, I declare and undertake that:

• I bear full and exclusive responsibility for all aspects of the trip
• I possess the knowledge, experience, and skills required to organize and lead the trip
• I will select a suitable and safe route for participants' fitness and experience levels
• I will warn participants about any known or foreseeable risks on the route
• I will ensure weather and terrain conditions are safe before trip commencement`
      },
      {
        title: 'Duty of Care',
        text: `I undertake to:

• Check the route in advance and identify risks
• Provide participants with accurate information about difficulty level, duration, and required equipment
• Carry first aid equipment and communication devices
• Act with maximum care and responsibility for participants' safety
• Cancel the trip if conditions are unsafe`
      },
      {
        title: 'Waiver of Claims Against Platform',
        text: `I understand and agree that:

• The Platform serves solely as a technological intermediary
• The Platform bears no responsibility for the trip
• I finally and irrevocably waive any claim against the Platform
• I undertake to indemnify the Platform from any claim filed by a participant`
      },
      {
        title: 'Legal Compliance Declaration',
        text: `I declare that:

• The trip will take place in a legally permitted location
• I will comply with all relevant laws and regulations
• There is no legal impediment to organizing the trip
• I have obtained all required permits (if applicable)`
      }
    ],
    confirmation: 'I confirm that I have read, understood, and agree to all of the above',
    accept: 'I Accept Responsibility and Confirm',
    decline: 'Cancel',
    next: 'Next',
    back: 'Back'
  };

  const totalSteps = content.sections.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAccept = () => {
    if (!agreed) return;
    onAccept();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent 
        className="max-w-3xl h-[90vh] flex flex-col overflow-hidden" 
        dir={isRTL ? 'rtl' : 'ltr'}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{content.title}</DialogTitle>
              <p className="text-sm text-gray-500">{content.subtitle}</p>
            </div>
          </div>

          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              {language === 'he' 
                ? 'מסמך משפטי מחייב - קריאה מלאה והבנה נדרשת'
                : 'Binding legal document - full reading and understanding required'}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{language === 'he' ? `שלב ${currentStep + 1} מתוך ${totalSteps}` : `Step ${currentStep + 1} of ${totalSteps}`}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto px-1"
          >
            <div className="bg-white border rounded-lg p-6 h-full">
              <h3 className="font-bold text-xl text-gray-900 mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {content.sections[currentStep].title}
              </h3>
              
              <p className="text-gray-700 whitespace-pre-line leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
                {content.sections[currentStep].text}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {currentStep === totalSteps - 1 && (
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg flex-shrink-0">
            <Checkbox 
              id="agree" 
              checked={agreed}
              onCheckedChange={setAgreed}
              className="mt-0.5 flex-shrink-0"
            />
            <label 
              htmlFor="agree" 
              className="text-sm font-medium leading-snug text-gray-900 cursor-pointer"
            >
              {content.confirmation}
            </label>
          </div>
        )}

        <div className="flex justify-between gap-2 pt-4 border-t flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={currentStep === 0 ? onDecline : handleBack}
            className="gap-2"
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {currentStep === 0 ? content.decline : content.back}
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button 
              onClick={handleNext}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              {content.next}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          ) : (
            <Button 
              onClick={handleAccept}
              disabled={!agreed || processing}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {content.accept}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}