import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cookie } from 'lucide-react';

export default function CookiePolicy() {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const content = language === 'he' ? {
    title: 'מדיניות עוגיות',
    backButton: 'חזרה',
    intro: 'מדיניות זו מסבירה כיצד Groupy Loopy משתמשת בעוגיות ובטכנולוגיות דומות.',
    lastUpdated: 'עדכון אחרון: 15 בדצמבר 2025',
    sections: [
      {
        title: 'מהן עוגיות?',
        content: 'עוגיות הן קבצי טקסט קטנים שנשמרים במכשיר שלך כאשר אתה מבקר באתר. הן עוזרות לנו לזכור את העדפותיך ולשפר את החוויה שלך.'
      },
      {
        title: 'איך אנחנו משתמשים בעוגיות?',
        content: 'אנחנו משתמשים בעוגיות למטרות הבאות:\n\n• לשמור על הגדרות השפה והממשק שלך\n• לזכור אם אתה מחובר לחשבון\n• לנתח דפוסי שימוש כדי לשפר את השירות\n• לספק תכונות מותאמות אישית\n• לאבטח את החשבון שלך'
      },
      {
        title: 'סוגי העוגיות שאנחנו משתמשים בהן',
        content: '• עוגיות הכרחיות - נדרשות לתפקוד בסיסי של האתר\n• עוגיות תפקודיות - משפרות את החוויה והביצועים\n• עוגיות אנליטיות - עוזרות לנו להבין כיצד משתמשים באתר\n• עוגיות שיווקיות - מאפשרות להציג תוכן רלוונטי יותר'
      },
      {
        title: 'ניהול עוגיות',
        content: 'אתה יכול לשלוט בעוגיות דרך הגדרות הדפדפן שלך. שים לב שחסימת עוגיות מסוימות עשויה להשפיע על הפונקציונליות של האתר.'
      },
      {
        title: 'צד שלישי',
        content: 'אנחנו משתמשים בשירותי צד שלישי כמו Google Analytics לצורך ניתוח. שירותים אלה עשויים להגדיר עוגיות משלהם.'
      },
      {
        title: 'עדכונים למדיניות',
        content: 'אנחנו עשויים לעדכן מדיניות זו מעת לעת. השינויים ייכנסו לתוקף מיד עם פרסומם באתר.'
      },
      {
        title: 'יצירת קשר',
        content: 'אם יש לך שאלות לגבי מדיניות העוגיות שלנו, אנא צור איתנו קשר דרך דף "אודותינו".'
      }
    ]
  } : language === 'ru' ? {
    title: 'Политика использования файлов cookie',
    backButton: 'Назад',
    intro: 'Эта политика объясняет, как Groupy Loopy использует файлы cookie и аналогичные технологии.',
    lastUpdated: 'Последнее обновление: 15 декабря 2025 г.',
    sections: [
      {
        title: 'Что такое файлы cookie?',
        content: 'Файлы cookie - это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении сайта. Они помогают нам запоминать ваши предпочтения и улучшать ваш опыт.'
      },
      {
        title: 'Как мы используем файлы cookie?',
        content: 'Мы используем файлы cookie для следующих целей:\n\n• Сохранение языковых настроек и настроек интерфейса\n• Запоминание вашего входа в систему\n• Анализ моделей использования для улучшения сервиса\n• Предоставление персонализированных функций\n• Защита вашей учетной записи'
      },
      {
        title: 'Типы используемых файлов cookie',
        content: '• Необходимые файлы cookie - требуются для базовой работы сайта\n• Функциональные файлы cookie - улучшают опыт и производительность\n• Аналитические файлы cookie - помогают понять, как используется сайт\n• Маркетинговые файлы cookie - позволяют показывать более релевантный контент'
      },
      {
        title: 'Управление файлами cookie',
        content: 'Вы можете управлять файлами cookie через настройки браузера. Обратите внимание, что блокировка некоторых файлов cookie может повлиять на функциональность сайта.'
      },
      {
        title: 'Сторонние сервисы',
        content: 'Мы используем сторонние сервисы, такие как Google Analytics, для аналитики. Эти сервисы могут устанавливать свои собственные файлы cookie.'
      },
      {
        title: 'Обновления политики',
        content: 'Мы можем обновлять эту политику время от времени. Изменения вступают в силу сразу после публикации на сайте.'
      },
      {
        title: 'Контакты',
        content: 'Если у вас есть вопросы о нашей политике использования файлов cookie, свяжитесь с нами через страницу "О нас".'
      }
    ]
  } : {
    title: 'Cookie Policy',
    backButton: 'Back',
    intro: 'This policy explains how Groupy Loopy uses cookies and similar technologies.',
    lastUpdated: 'Last updated: December 15, 2025',
    sections: [
      {
        title: 'What are cookies?',
        content: 'Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences and improve your experience.'
      },
      {
        title: 'How we use cookies',
        content: 'We use cookies for the following purposes:\n\n• Save your language and interface settings\n• Remember if you are logged into your account\n• Analyze usage patterns to improve our service\n• Provide personalized features\n• Secure your account'
      },
      {
        title: 'Types of cookies we use',
        content: '• Essential cookies - required for basic site functionality\n• Functional cookies - improve experience and performance\n• Analytics cookies - help us understand how the site is used\n• Marketing cookies - enable more relevant content'
      },
      {
        title: 'Managing cookies',
        content: 'You can control cookies through your browser settings. Note that blocking certain cookies may affect site functionality.'
      },
      {
        title: 'Third parties',
        content: 'We use third-party services like Google Analytics for analytics purposes. These services may set their own cookies.'
      },
      {
        title: 'Policy updates',
        content: 'We may update this policy from time to time. Changes take effect immediately upon posting on the site.'
      },
      {
        title: 'Contact',
        content: 'If you have questions about our cookie policy, please contact us through the "About Us" page.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {content.backButton}
        </Button>

        <Card className="shadow-xl border-2 border-amber-100">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">{content.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{content.lastUpdated}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
              {content.intro}
            </p>

            {content.sections.map((section, index) => (
              <div key={index} className="space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 text-sm font-bold">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line pl-10">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="mt-12 p-6 bg-amber-50 rounded-lg border-2 border-amber-200" dir={isRTL ? 'rtl' : 'ltr'}>
              <p className="text-sm text-amber-900 leading-relaxed">
                {language === 'he' 
                  ? 'על ידי המשך השימוש באתר שלנו, אתה מסכים למדיניות העוגיות שלנו.'
                  : language === 'ru'
                  ? 'Продолжая использовать наш сайт, вы соглашаетесь с нашей политикой использования файлов cookie.'
                  : 'By continuing to use our site, you agree to our cookie policy.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}