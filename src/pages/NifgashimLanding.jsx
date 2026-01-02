import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Heart, Mountain, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NifgashimLanding() {
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const translations = {
    he: {
      title: "נפגשים בשביל ישראל",
      subtitle: "מסע הנצחה והכרות ברחבי הארץ",
      description: "הצטרפו למסע משמעותי של הכרות והנצחה ברחבי ישראל. נפגש בשבילים, נכיר אנשים חדשים ונזכור את אלו שנפלו למען המדינה.",
      howItWorks: "איך זה עובד?",
      step1Title: "בחרו ימים",
      step1Desc: "עד 8 ימים בנגב, 30 ימים סך הכל",
      step2Title: "הירשמו",
      step2Desc: "מילוי פרטים ותשלום - 85₪ ליום",
      step3Title: "הגיעו",
      step3Desc: "צ'ק-אין ביום הטיול והצטרפות לקבוצה",
      features: "מה כולל המסע?",
      feature1: "מסלולים מודרכים בכל הארץ",
      feature2: "הנצחה יומית של חללים",
      feature3: "הכרויות ומפגשים משמעותיים",
      feature4: "ארוחות ולינה (לפי בחירה)",
      pricing: "מחירים",
      pricePerDay: "85₪ ליום",
      priceIncludes: "כולל הדרכה, ביטוח ותוכן הנצחה",
      register: "הרשמה למסע",
      login: "כבר רשומים? התחברו",
      memorial: "בקשת הנצחה",
      memorialDesc: "רוצים להנציח חלל/ה יקר/ה? שלחו בקשת הנצחה",
      rules: "חוקים חשובים",
      rule1: "מקסימום 8 ימים באזור הנגב",
      rule2: "מקסימום 30 ימים בסך הכל לאדם",
      rule3: "רישום מראש חובה - אין אפשרות להצטרף באמצע היום",
      contactUs: "צרו קשר"
    },
    en: {
      title: "Nifgashim for Israel",
      subtitle: "A Journey of Memorial and Connection Across Israel",
      description: "Join a meaningful journey of connection and memorial across Israel. Meet on trails, make new friends, and remember those who fell for our country.",
      howItWorks: "How It Works?",
      step1Title: "Choose Days",
      step1Desc: "Up to 8 days in Negev, 30 days total",
      step2Title: "Register",
      step2Desc: "Fill details and payment - 85₪ per day",
      step3Title: "Arrive",
      step3Desc: "Check-in on trip day and join the group",
      features: "What's Included?",
      feature1: "Guided routes nationwide",
      feature2: "Daily memorial of fallen soldiers",
      feature3: "Meaningful connections and meetings",
      feature4: "Meals and accommodation (optional)",
      pricing: "Pricing",
      pricePerDay: "85₪ per day",
      priceIncludes: "Includes guidance, insurance, and memorial content",
      register: "Register for Trek",
      login: "Already registered? Login",
      memorial: "Memorial Request",
      memorialDesc: "Want to memorialize a loved one? Submit a memorial request",
      rules: "Important Rules",
      rule1: "Maximum 8 days in Negev region",
      rule2: "Maximum 30 days total per person",
      rule3: "Pre-registration required - no mid-day joining",
      contactUs: "Contact Us"
    }
  };

  const trans = translations[language] || translations.en;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        console.log('Not logged in');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleRegister = () => {
    if (user) {
      navigate(createPageUrl('NifgashimRegistration'));
    } else {
      base44.auth.redirectToLogin(createPageUrl('NifgashimRegistration'));
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 via-white to-emerald-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 text-white"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              {trans.title}
            </h1>
            <p className="text-xl sm:text-2xl mb-4 opacity-90">
              {trans.subtitle}
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto opacity-80">
              {trans.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleRegister}
                size="lg"
                className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-8 py-6 w-full sm:w-auto"
              >
                <Users className="w-5 h-5 mr-2" />
                {trans.register}
              </Button>
              <Button
                onClick={() => navigate(createPageUrl('MemorialRequest'))}
                variant="outline"
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 text-lg px-8 py-6 w-full sm:w-auto"
              >
                <Heart className="w-5 h-5 mr-2" />
                {trans.memorial}
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
          {trans.howItWorks}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Calendar, title: trans.step1Title, desc: trans.step1Desc },
            { icon: MapPin, title: trans.step2Title, desc: trans.step2Desc },
            { icon: Mountain, title: trans.step3Title, desc: trans.step3Desc }
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
            {trans.features}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[trans.feature1, trans.feature2, trans.feature3, trans.feature4].map((feature, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <p className="text-center font-medium text-gray-700">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Info className="w-6 h-6 text-blue-600" />
              {trans.rules}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{trans.rule1}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{trans.rule2}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{trans.rule3}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pricing */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            {trans.pricing}
          </h2>
          <Card className="shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="text-4xl font-bold">85₪</CardTitle>
              <CardDescription className="text-white text-lg opacity-90">
                {trans.pricePerDay}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">{trans.priceIncludes}</p>
              <Button
                onClick={handleRegister}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
              >
                {trans.register}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}