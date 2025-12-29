import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { GoogleMapsProvider } from './components/maps/GoogleMapsProvider';
import LanguageSwitcher from './components/ui/LanguageSwitcher';
import PermissionsRequest from './components/notifications/PermissionsRequest';
import NotificationBell from './components/notifications/NotificationBell';
import NotificationPermissionRequest from './components/notifications/NotificationPermissionRequest';
import LanguageSelection from './components/LanguageSelection';
import CookieConsent from './components/legal/CookieConsent';
import AccessibilityButton from './components/accessibility/AccessibilityButton';
import InstallPrompt from './components/pwa/InstallPrompt';
import ServiceWorkerRegistration from './components/pwa/ServiceWorkerRegistration';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  Map, 
  Plus, 
  Sparkles, 
  User, 
  LogOut, 
  Menu,
  Share2,
  Mail,
  MessageSquare,
  Settings as SettingsIcon,
  BookOpen,
  CloudSun,
  BarChart3
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

function LayoutContent({ children, currentPageName }) {
  const { t, isRTL, setLanguage, language } = useLanguage();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const navigate = useNavigate();

  // SEO & Meta tags
  useEffect(() => {
    const metaTag = document.createElement('meta');
    metaTag.name = 'facebook-domain-verification';
    metaTag.content = 'u7wujwd6860x2d554lgdr2kycajfrs';
    document.head.appendChild(metaTag);
    return () => { document.head.removeChild(metaTag); };
  }, []);

  // Auth check
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        if (userData && (!userData.terms_accepted || !userData.profile_completed) && currentPageName !== 'Onboarding') {
          navigate(createPageUrl('Onboarding'));
        }
      } catch (e) { console.log('Not logged in'); }
    };
    fetchUser();
  }, [currentPageName, navigate]);

  const handleLogout = async () => { await base44.auth.logout(); };

  const navItems = [
    { name: 'Home', icon: Home, label: t('home'), color: 'text-emerald-600' },
    { name: 'Dashboard', icon: BarChart3, label: language === 'he' ? 'לוח מחוונים' : 'Dashboard', color: 'text-cyan-600' },
    { name: 'MyTrips', icon: Map, label: t('myTrips'), color: 'text-blue-600' },
    { name: 'CreateTrip', icon: Plus, label: t('createTrip'), color: 'text-purple-600' },
    { name: 'Weather', icon: CloudSun, label: language === 'he' ? 'מזג אוויר' : 'Weather', color: 'text-sky-500' },
  ];

  const isActive = (pageName) => currentPageName === pageName;

  if (showLanguageSelection) return <LanguageSelection onLanguageSelect={(lang) => { setLanguage(lang); setShowLanguageSelection(false); }} />;

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <header className="bg-white/80 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* צד שמאל: לוגו הטרול עם תיקון פרופורציות */}
            <div className="flex-shrink-0 flex items-center">
              <Link to={createPageUrl('Home')}>
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693c3ab4048a1e3a31fffd66/413fc3893_Gemini_Generated_Image_me8dl1me8dl1me8d.png" 
                  alt="Groupy Loopy"
                  className="h-12 w-auto object-contain"
                  style={{ maxHeight: '48px', width: 'auto' }}
                />
              </Link>
            </div>

            {/* מרכז: ניווט דסקטופ */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map(item => (
                <Link key={item.name} to={createPageUrl(item.name)}>
                  <Button
                    variant={isActive(item.name) ? "secondary" : "ghost"}
                    className={`gap-2 ${isActive(item.name) ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            {/* צד ימין: אייקונים בסדר החדש */}
            <div className="flex items-center gap-2 md:gap-3">
              
              {/* 1. שיתוף */}
              <Button
                variant="ghost"
                size="icon"
                className="text-emerald-600 hover:bg-emerald-50"
                onClick={async () => {
                  const shareUrl = window.location.origin;
                  try {
                    if (navigator.share) {
                      await navigator.share({ title: 'Groupy Loopy', url: shareUrl });
                    } else {
                      await navigator.clipboard.writeText(shareUrl);
                      toast.success(language === 'he' ? 'הקישור הועתק' : 'Link copied');
                    }
                  } catch (err) { /* ignore abort */ }
                }}
              >
                <Share2 className="w-5 h-5" />
              </Button>

              {/* 2. פעמון התראות */}
              {user && <NotificationBell userEmail={user.email} />}

              {/* 3. בורר שפה */}
              <LanguageSwitcher />

              {/* 4. נגישות */}
              <AccessibilityButton />

              {/* 5. פרופיל משתמש (Dropdown) */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-9 w-9 border border-emerald-200">
                        <AvatarFallback className="bg-emerald-600 text-white text-xs">
                          {(user.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-500">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(createPageUrl('Profile'))}>
                      <User className="w-4 h-4 mr-2" /> {t('profile')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" /> {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => base44.auth.redirectToLogin()} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {language === 'he' ? 'התחבר' : 'Login'}
                </Button>
              )}

              {/* המבורגר למובייל */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRTL ? "right" : "left"} className="w-72">
                  <nav className="flex flex-col gap-2 mt-8">
                    {navItems.map(item => (
                      <Link key={item.name} to={createPageUrl(item.name)} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-64px)]">{children}</main>

      {/* Footer (דף הבית בלבד) */}
      {currentPageName === 'Home' && (
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            © 2025 Groupy Loopy • {language === 'he' ? 'מטיילים ביחד' : 'Hiking Together'}
          </div>
        </footer>
      )}

      {/* PWA & System Components */}
      {user && <PermissionsRequest />}
      <NotificationPermissionRequest />
      <CookieConsent />
      <InstallPrompt />
      <ServiceWorkerRegistration />
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <GoogleMapsProvider>
        <LayoutContent currentPageName={currentPageName}>
          {children}
        </LayoutContent>
      </GoogleMapsProvider>
    </LanguageProvider>
  );
}