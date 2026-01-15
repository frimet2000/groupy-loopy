// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '../../LanguageContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GroupHealthDeclaration({ accepted, onAccept, leaderName }) {
  const { language, isRTL } = useLanguage();

  const declarations = {
    he: {
      title: "הצהרת בריאות ואחריות מדריך הקבוצה - משפטי וחייב",
      section1Title: "אחריות בלעדית של ראש הקבוצה",
      section1Text: `אני, ${leaderName}, מצהיר/ה בזה בחתימתי כי:

א) אני אחראי/ת בשלמות, באופן בלעדי וחד משמעי על כל משתתפי קבוצתי ללא יוצא מן הכלל.
ב) אני אחראי/ת על בריאותם הגופנית, ההתנהגות שלהם, ובטיחותם בכל נסיבה.
ג) אני מצהיר/ה שכל משתתפי הקבוצה שלי בריאים, כשירים פיזית ואינם סובלים מכל מצב רפואי הנוגע להשתתפות בטיול זה.
ד) אני מאשר/ת שביצעתי בדיקה רפואית דקדקנית של כל משתתף וודאתי כי אינם בסיכון.
ה) אנו כקבוצה מקבלים על עצמנו את כל הסיכונים המפורטים בהצהרת בריאות של משתתף יחיד.`,
      
      section2Title: "שליטה וניהול הקבוצה",
      section2Text: `ברור לי כי:

א) אני אודה ישירה למארגן הטיול בכל נושא הנוגע לקבוצתי.
ב) אני אשלוט מלא על חברי הקבוצה וילך מאחוריהם בכל הזמן.
ג) אני אדווח מיידית על כל בעיה בריאותית, בטיחותית או התנהגותית שתיווצר.
ד) אני הבעל אחריות הבלעדית אם חלה משתתף בקבוצה או יהיה תאונה.
ה) אני משחרר/ת מחויבות מהמארגן וכל צדדים שלישיים מכל תביעה או דרישה בעטיה חבר בקבוצתי.`,
      
      section3Title: "ניהול בריאות וחירום",
      section3Text: `אני מודע/ת וחותם על כך כי:

א) אני אודווח מיידית על כל בעיית בריאות, חום, כאבים או סימנים חריגים בקבוצתי.
ב) אני אדרוש עזרה רפואית מנוסחת עבור כל משתתף זקוק.
ג) אני מאשר/ת שיש למארגן כל הסמכות לעצור או להוציא כל משתתף בקבוצה אם הוא מהווה סכנה.
ד) אין לי שום טענה אם משתתף מקבוצתי לא יוכל להמשיך את הטיול.`,
      
      section4Title: "שחרור אחריות",
      section4Text: `אני, ראש הקבוצה, משחרור מחייבויות את:
- מארגן הטיול וכל צוותו
- Groupy Loopy וכל בעלי זכויותיה
- מדריכים וצוות טיפול
- שכל צדדים שלישיים
מכל תביעה, דרישה, או הוצאה בעטיה משתתף מקבוצתי יפגע, יחלה, או יחוויה כל מקרה אחר במהלך הטיול.`,
      
      agreement: "אני מאשר/ת כי קראתי את הצהרת אחריות ראש הקבוצה, הבנתי את כל התוכן, וההסכמה שלי היא ברצוני החופשי",
      warning: "חובה לאשר הצהרה זו כדי להמשיך"
    },
    en: {
      title: "Group Leader Health Declaration & Full Legal Responsibility",
      section1Title: "Exclusive Responsibility of Group Leader",
      section1Text: `I, ${leaderName}, hereby declare and certify that:

a) I am fully, exclusively, and unequivocally responsible for all members of my group without exception.
b) I am responsible for their physical health, behavior, and safety in all circumstances.
c) I declare that all members of my group are healthy, physically fit, and do not suffer from any medical condition that would affect their ability to participate in this trek.
d) I confirm that I have conducted a thorough medical examination of each participant and have verified they are not at risk.
e) We as a group accept all risks detailed in the individual participant health declaration.`,
      
      section2Title: "Group Control and Management",
      section2Text: `I understand and affirm that:

a) I am directly accountable to the trek organizer for all matters relating to my group.
b) I maintain full control over group members and supervise them at all times.
c) I will immediately report any health, safety, or behavioral issue that arises.
d) I am solely responsible if any member of my group becomes ill or has an accident.
e) I release the organizer and all third parties from any claims or demands arising from any issue with any member of my group.`,
      
      section3Title: "Health Management and Emergency Response",
      section3Text: `I am aware and sign affirming that:

a) I will immediately report any health issue, fever, pain, or abnormal signs in my group.
b) I will seek medical help immediately for any member in need.
c) I confirm that the organizer has full authority to stop or remove any participant if they pose a danger.
d) I have no claim if any member of my group cannot continue the trek.`,
      
      section4Title: "Release of Liability",
      section4Text: `I, as group leader, release from all liability:
- The trek organizer and all its staff
- Groupy Loopy and all its owners
- All guides and medical personnel
- All third parties
From any claim, demand, or expense arising from any member of my group suffering injury, illness, or any other occurrence during the trek.`,
      
      agreement: "I confirm that I have read the group leader responsibility declaration, fully understand its contents, and my agreement is given of my own free will",
      warning: "You must confirm this declaration to continue"
    },
    ru: {
      title: "Заявление о здоровье руководителя группы и полная правовая ответственность",
      section1Title: "Исключительная ответственность руководителя группы",
      section1Text: `Я, ${leaderName}, заявляю и подтверждаю, что:

а) Я полностью, исключительно и однозначно ответствен за всех членов моей группы без исключения.
б) Я ответствен за их физическое здоровье, поведение и безопасность во всех обстоятельствах.
в) Я заявляю, что все члены моей группы здоровы, физически подготовлены и не страдают медицинским состоянием, которое влияет на их участие.
г) Я подтверждаю, что провел тщательное медицинское обследование каждого участника и проверил, что они не в опасности.
д) Мы как группа принимаем все риски, указанные в индивидуальной декларации здоровья участника.`,
      
      section2Title: "Контроль и управление группой",
      section2Text: `Я понимаю и утверждаю, что:

а) Я напрямую ответствен перед организатором похода по всем вопросам, касающимся моей группы.
б) Я полностью контролирую членов группы и наблюдаю за ними в любое время.
в) Я немедленно сообщу о любой проблеме со здоровьем, безопасностью или поведением.
г) Я несу полную ответственность, если любой член моей группы заболеет или получит травму.
д) Я освобождаю организатора и все третьи стороны от любых претензий в связи с проблемой любого члена моей группы.`,
      
      section3Title: "Управление здоровьем и реагирование на чрезвычайные ситуации",
      section3Text: `Я осведомлен и подписываю, утверждая, что:

а) Я немедленно сообщу о любой проблеме со здоровьем, лихорадке, боли или необычных признаках в моей группе.
б) Я немедленно обращусь за медицинской помощью для любого члена, который в ней нуждается.
в) Я подтверждаю, что организатор имеет полное право остановить или удалить любого участника, если он представляет угрозу.
г) Я не имею претензий, если любой член моей группы не может продолжить поход.`,
      
      section4Title: "Отказ от ответственности",
      section4Text: `Я, как руководитель группы, освобождаю от всей ответственности:
- Организатора похода и всех его сотрудников
- Groupy Loopy и всех его владельцев
- Всех гидов и медицинский персонал
- Все третьи стороны
От любых претензий, требований или расходов, возникающих в результате любого ущерба, болезни или события с любым членом моей группы во время похода.`,
      
      agreement: "Я подтверждаю, что прочитал декларацию об ответственности руководителя группы, полностью понимаю ее содержание, и мое согласие дано добровольно",
      warning: "Вы должны подтвердить эту декларацию, чтобы продолжить"
    },
    es: {
      title: "Declaración de Salud del Líder de Grupo y Responsabilidad Legal Completa",
      section1Title: "Responsabilidad Exclusiva del Líder de Grupo",
      section1Text: `Yo, ${leaderName}, por este medio declaro y certifico que:

a) Soy total, exclusiva e inequívocamente responsable de todos los miembros de mi grupo sin excepción.
b) Soy responsable de su salud física, comportamiento y seguridad en todas las circunstancias.
c) Declaro que todos los miembros de mi grupo están sanos, en buen estado físico y no padecen ninguna condición médica que afecte su participación.
d) Confirmo que he realizado un examen médico exhaustivo de cada participante y he verificado que no están en riesgo.
e) Como grupo aceptamos todos los riesgos detallados en la declaración de salud del participante individual.`,
      
      section2Title: "Control y Gestión del Grupo",
      section2Text: `Entiendo y afirmo que:

a) Soy directamente responsable ante el organizador del trekking de todos los asuntos relacionados con mi grupo.
b) Mantengo control total sobre los miembros del grupo y los superviso en todo momento.
c) Reportaré inmediatamente cualquier problema de salud, seguridad o comportamiento que surja.
d) Soy el único responsable si algún miembro de mi grupo enferma o sufre un accidente.
e) Exonero al organizador y a todos los terceros de cualquier reclamo o demanda relacionada con cualquier problema de cualquier miembro de mi grupo.`,
      
      section3Title: "Gestión de la Salud y Respuesta a Emergencias",
      section3Text: `Estoy consciente y firmando afirmando que:

a) Reportaré inmediatamente cualquier problema de salud, fiebre, dolor o signos anormales en mi grupo.
b) Buscaré ayuda médica inmediatamente para cualquier miembro que la necesite.
c) Confirmo que el organizador tiene plena autoridad para detener o remover a cualquier participante si representa un peligro.
d) No tengo reclamo si algún miembro de mi grupo no puede continuar el trekking.`,
      
      section4Title: "Renuncia de Responsabilidad",
      section4Text: `Yo, como líder de grupo, renuncio a toda responsabilidad:
- Del organizador del trekking y todo su personal
- De Groupy Loopy y todos sus propietarios
- De todos los guías y personal médico
- De todos los terceros
De cualquier reclamo, demanda o gasto que surja de cualquier lesión, enfermedad u otro evento con cualquier miembro de mi grupo durante el trekking.`,
      
      agreement: "Confirmo que he leído la declaración de responsabilidad del líder de grupo, entiendo completamente su contenido, y mi acuerdo se da por mi propia voluntad",
      warning: "Debe confirmar esta declaración para continuar"
    },
    fr: {
      title: "Déclaration de Santé du Chef de Groupe et Responsabilité Juridique Complète",
      section1Title: "Responsabilité Exclusive du Chef de Groupe",
      section1Text: `Moi, ${leaderName}, par la présente je déclare et certifie que:

a) Je suis entièrement, exclusivement et sans équivoque responsable de tous les membres de mon groupe sans exception.
b) Je suis responsable de leur santé physique, de leur comportement et de leur sécurité dans toutes les circonstances.
c) Je déclare que tous les membres de mon groupe sont en bonne santé, physiquement aptes et ne souffrent d\'aucune condition médicale affectant leur participation.
d) Je confirme que j\'ai mené un examen médical approfondi de chaque participant et vérifié qu\'ils ne sont pas à risque.
e) En tant que groupe, nous acceptons tous les risques détaillés dans la déclaration de santé du participant individuel.`,
      
      section2Title: "Contrôle et Gestion du Groupe",
      section2Text: `Je comprends et j\'affirme que:

a) Je suis directement responsable devant l\'organisateur de la randonnée de tous les domaines relatifs à mon groupe.
b) Je maintiens un contrôle total sur les membres du groupe et les supervise à tout moment.
c) Je signalerai immédiatement tout problème de santé, de sécurité ou de comportement qui survient.
d) Je suis le seul responsable si un membre de mon groupe tombe malade ou a un accident.
e) Je libère l\'organisateur et tous les tiers de toute réclamation ou demande découlant de tout problème de tout membre de mon groupe.`,
      
      section3Title: "Gestion de la Santé et Réponse aux Urgences",
      section3Text: `Je suis conscient et je signe confirmant que:

a) Je signalerai immédiatement tout problème de santé, fièvre, douleur ou signe anormal dans mon groupe.
b) Je chercherai une aide médicale immédiatement pour tout membre qui en a besoin.
c) Je confirme que l\'organisateur a toute autorité pour arrêter ou retirer tout participant s\'il présente un danger.
d) Je n\'ai aucune réclamation si un membre de mon groupe ne peut pas continuer la randonnée.`,
      
      section4Title: "Renonciation de Responsabilité",
      section4Text: `Moi, en tant que chef de groupe, je renonce à toute responsabilité:
- De l\'organisateur de la randonnée et de tout son personnel
- De Groupy Loopy et de tous ses propriétaires
- De tous les guides et du personnel médical
- De tous les tiers
De toute réclamation, demande ou dépense résultant de toute blessure, maladie ou événement avec un quelconque membre de mon groupe pendant la randonnée.`,
      
      agreement: "Je confirme que j\'ai lu la déclaration de responsabilité du chef de groupe, que j\'en comprends pleinement le contenu, et que mon consentement est donné librement",
      warning: "Vous devez confirmer cette déclaration pour continuer"
    },
    de: {
      title: "Gesundheitserklärung des Gruppenleiters und vollständige rechtliche Verantwortung",
      section1Title: "Ausschließliche Verantwortung des Gruppenleiters",
      section1Text: `Ich, ${leaderName}, erkläre und bestätige hiermit, dass:

a) Ich vollständig, ausschließlich und eindeutig verantwortlich für alle Mitglieder meiner Gruppe ohne Ausnahme bin.
b) Ich bin verantwortlich für ihre körperliche Gesundheit, ihr Verhalten und ihre Sicherheit unter allen Umständen.
c) Ich erkläre, dass alle Mitglieder meiner Gruppe gesund, physisch fit sind und nicht unter einer medizinischen Erkrankung leiden, die ihre Teilnahme beeinträchtigt.
d) Ich bestätige, dass ich eine gründliche medizinische Untersuchung jedes Teilnehmers durchgeführt habe und überprüft habe, dass sie nicht gefährdet sind.
e) Wir als Gruppe akzeptieren alle in der individuellen Gesundheitserklärung des Teilnehmers aufgeführten Risiken.`,
      
      section2Title: "Kontrolle und Verwaltung der Gruppe",
      section2Text: `Ich verstehe und bekräftige, dass:

a) Ich dem Wanderungsorganisator direkt für alle Angelegenheiten meine Gruppe verantwortlich bin.
b) Ich behalte die volle Kontrolle über die Gruppenmitglieder und beaufsichtige sie jederzeit.
c) Ich werde sofort jedes Gesundheits-, Sicherheits- oder Verhaltensproblem melden.
d) Ich bin allein verantwortlich, wenn ein Mitglied meiner Gruppe krank wird oder einen Unfall hat.
e) Ich entlasse den Organisator und alle Dritten von allen Ansprüchen oder Forderungen bezüglich eines Problems eines Gruppenmitglieds.`,
      
      section3Title: "Gesundheitsmanagement und Notfallreaktion",
      section3Text: `Ich bin mir bewusst und unterzeichne und bestätige, dass:

a) Ich sofort jedes Gesundheitsproblem, Fieber, Schmerz oder abnormale Zeichen in meiner Gruppe melde.
b) Ich sofort ärztliche Hilfe für jedes Mitglied suche, das sie benötigt.
c) Ich bestätige, dass der Organisator die volle Autorität hat, jeden Teilnehmer zu stoppen oder zu entfernen, wenn er eine Gefahr darstellt.
d) Ich habe keinen Anspruch, wenn ein Mitglied meiner Gruppe die Wanderung nicht fortsetzen kann.`,
      
      section4Title: "Haftungsausschluss",
      section4Text: `Ich als Gruppenleiter entlasse von aller Haftung:
- Den Wanderungsorganisator und sein gesamtes Personal
- Groupy Loopy und alle seine Eigentümer
- Alle Führer und medizinisches Personal
- Alle Dritten
Von allen Ansprüchen, Forderungen oder Ausgaben, die sich aus einer Verletzung, Krankheit oder einem Ereignis mit einem beliebigen Gruppenmitglied während der Wanderung ergeben.`,
      
      agreement: "Ich bestätige, dass ich die Erklärung der Verantwortung des Gruppenleiters gelesen habe, ihren Inhalt vollständig verstehe, und mein Einverständnis freiwillig gegeben wird",
      warning: "Sie müssen diese Erklärung bestätigen, um fortzufahren"
    },
    it: {
      title: "Dichiarazione di Salute del Capo Gruppo e Responsabilità Legale Completa",
      section1Title: "Responsabilità Esclusiva del Capo Gruppo",
      section1Text: `Io, ${leaderName}, dichiaro e certifico con la presente che:

a) Sono pienamente, esclusivamente e inequivocabilmente responsabile di tutti i membri del mio gruppo senza eccezione.
b) Sono responsabile della loro salute fisica, del loro comportamento e della loro sicurezza in tutte le circostanze.
c) Dichiaro che tutti i membri del mio gruppo sono sani, fisicamente in forma e non soffrono di alcuna condizione medica che influisca sulla loro partecipazione.
d) Confermo che ho condotto un esame medico approfondito di ogni partecipante e verificato che non sono a rischio.
e) Come gruppo accettiamo tutti i rischi dettagliati nella dichiarazione di salute del singolo partecipante.`,
      
      section2Title: "Controllo e Gestione del Gruppo",
      section2Text: `Intendo e affermo che:

a) Sono direttamente responsabile di fronte all\'organizzatore dell\'escursione per tutti i problemi riguardanti il mio gruppo.
b) Mantengo il pieno controllo dei membri del gruppo e li superviso in ogni momento.
c) Segnaleró immediatamente qualsiasi problema di salute, sicurezza o comportamento che sorga.
d) Sono l\'unico responsabile se un membro del mio gruppo si ammala o ha un incidente.
e) Esonero l\'organizzatore e tutti i terzi da qualsiasi reclamo o richiesta derivante da qualsiasi problema di qualsiasi membro del mio gruppo.`,
      
      section3Title: "Gestione della Salute e Risposta alle Emergenze",
      section3Text: `Sono consapevole e sottoscrivo affermando che:

a) Segnaleró immediatamente qualsiasi problema di salute, febbre, dolore o segno anormale nel mio gruppo.
b) Cercarò aiuto medico immediato per qualsiasi membro che ne ha bisogno.
c) Confermo che l\'organizzatore ha piena autorità di fermare o rimuovere qualsiasi partecipante se rappresenta un pericolo.
d) Non ho alcun reclamo se un membro del mio gruppo non può continuare l\'escursione.`,
      
      section4Title: "Esonero di Responsabilità",
      section4Text: `Io, come capo gruppo, esonero da ogni responsabilità:
- L\'organizzatore dell\'escursione e tutto il suo personale
- Groupy Loopy e tutti i suoi proprietari
- Tutte le guide e il personale medico
- Tutti i terzi
Da qualsiasi reclamo, richiesta o spesa derivante da qualsiasi lesione, malattia o evento con un membro del mio gruppo durante l\'escursione.`,
      
      agreement: "Confermo di aver letto la dichiarazione di responsabilità del capo gruppo, di comprendere pienamente il suo contenuto, e che il mio accordo è dato di mia libera volontà",
      warning: "Devi confermare questa dichiarazione per continuare"
    }
  };

  const trans = declarations[language] || declarations.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden border-2 border-red-300 max-h-[70vh] flex flex-col">
        <CardHeader className="bg-gradient-to-r from-red-700 to-red-900 text-white shrink-0">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            <AlertCircle className="w-7 h-7" />
            {trans.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Section 1 */}
          <div className="space-y-3 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <h3 className="font-bold text-lg text-blue-900">{trans.section1Title}</h3>
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{trans.section1Text}</p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
            <h3 className="font-bold text-lg text-orange-900">{trans.section2Title}</h3>
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{trans.section2Text}</p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
            <h3 className="font-bold text-lg text-yellow-900">{trans.section3Title}</h3>
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{trans.section3Text}</p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 bg-red-50 p-4 rounded-lg border-2 border-red-200">
            <h3 className="font-bold text-lg text-red-900">{trans.section4Title}</h3>
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{trans.section4Text}</p>
          </div>

          {/* Warning Alert */}
          {!accepted && (
            <Alert className="border-2 border-red-300 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-900 font-semibold">
                {trans.warning}
              </AlertDescription>
            </Alert>
          )}

          {/* Acceptance Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-red-300 transition-colors sticky bottom-0">
            <Checkbox
              id="groupHealthDeclaration"
              checked={accepted}
              onCheckedChange={onAccept}
              className="mt-1 shrink-0"
            />
            <Label 
              htmlFor="groupHealthDeclaration" 
              className="cursor-pointer font-semibold text-gray-900 pt-0.5"
            >
              {trans.agreement}
            </Label>
          </div>

          {/* Success Message */}
          {accepted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <p className="text-green-800 font-semibold">
                {language === 'he' ? 'אושרה הצהרת ראש הקבוצה' : language === 'ru' ? 'Заявление руководителя группы подтверждено' : language === 'es' ? 'Declaración del líder del grupo confirmada' : language === 'fr' ? 'Déclaration du chef de groupe confirmée' : language === 'de' ? 'Erklärung des Gruppenleiters bestätigt' : language === 'it' ? 'Dichiarazione del capo gruppo confermata' : 'Group leader declaration confirmed'}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}