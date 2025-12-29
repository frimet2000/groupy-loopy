import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { GoogleMapsProvider } from './components/maps/GoogleMapsProvider';
import LanguageSwitcher from './components/ui/LanguageSwitcher';
import PermissionsRequest from './components/notifications/PermissionsRequest';
import NotificationBell from './components/notifications/NotificationBell';
import NotificationPermissionRequest from './components/notifications/NotificationPermissionRequest';
import MessageListener from './components/notifications/MessageListener';
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
} from "@/dropdown-menu"; // וודא נתיב נכון ל-UI שלך
import { 
  Home, Map, Plus, Sparkles, User, LogOut, Menu, Share2, 
  Mail, MessageSquare, Settings as SettingsIcon, BookOpen, CloudSun, BarChart3, Users
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

function LayoutContent({ children, currentPageName }) {
  const { t, isRTL, setLanguage, language } = useLanguage();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const navigate = useNavigate();

  // --- כל ה-Hooks חייבים להיות כאן, לפני כל return ---

  const { data: unreadMessages = [] } = useQuery({
    queryKey: ['unreadMessagesCount', user?.email],
    queryFn: () => base44.entities.Message.filter({ recipient_email: user.email, read: false }),
    enabled: !!user?.email,
    refetchInterval: 5000,
  });
  const unreadCount = unreadMessages.length;

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

  useEffect(() => {
    const languageSelected = localStorage.getItem('language_selected');
    if (!languageSelected) setShowLanguageSelection(true);
  }, []);

  // --- סוף ה-Hooks ---

  const handleLogout = async () => { await base44.auth.logout(); };

  const allNavItems = [
    { name: 'Home', icon: Home, label: t('home'), color: 'text-emerald-600' },
    { name: 'Dashboard', icon: BarChart3, label: 'לוח מחוונים', color: 'text-cyan-600' },
    { name: 'MyTrips', icon: Map, label: t('myTrips'), color: 'text-blue-600' },
    { name: 'CreateTrip', icon: Plus, label: t('createTrip'), color: 'text-purple-600' },
    { name: 'Weather', icon: CloudSun, label: 'מזג אוויר', color: 'text-sky-500' },
    { name: 'TravelJournal', icon: BookOpen, label: 'יומן מסע', color: 'text-rose-600' },
    { name: 'AIRecommendations', icon: Sparkles, label: t('aiRecommendations'), color: 'text-indigo-600' },
    { name: 'Inbox', icon: Mail, label: 'הודעות', color: 'text-amber-600' },
    { name: 'Feedback', icon: MessageSquare, label: 'משוב', color: 'text-indigo-600' },
    { name: 'Settings', icon: SettingsIcon, label: 'הגדרות', color: 'text-gray-600' },
  ];

  const navItems = user?.role === 'admin' ? allNavItems : allNavItems.filter(item => item.name !== 'Community');
  const isActive = (pageName) => currentPageName === pageName;

  // ה-return הזה חייב לבוא אחרי כל ה-useQuery/useEffect
  if (showLanguageSelection) {
    return <LanguageSelection onLanguageSelect={(lang) => { setLanguage(lang); setShowLanguageSelection(false); }} />;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <header className="bg-white/90 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* צד שמאל: לוגו הטרול - מתוקן נגד "ספגטי" */}
            <div className="flex-shrink-0 flex items-center">
              <Link to={createPageUrl('Home')}>
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693c3ab4048a1e3a31fffd66/532a53f9c_.png" 
                  alt="Groupy Loopy"
                  className="h-12 w-auto object-contain transition-transform hover:scale-105"
                  style={{ maxHeight: '48px', width: 'auto' }}
                />
              </Link>
            </div>

            {/* מרכז: ניווט דסקטופ */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.slice(0, 5).map(item => (
                <Link key={item.name} to={createPageUrl(item.name)}>
                  <Button
                    variant={isActive(item.name) ? "secondary" : "ghost"}
                    className={`gap-2 ${isActive(item.name) ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            {/* צד ימין: אייקונים בסדר שביקשת */}
            <div className="flex items-center gap-3">
              
              {/* 1. שיתוף */}
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const shareUrl = window.location.origin;
                  if (navigator.share) {
                    await navigator.share({ title: 'Groupy Loopy', url: shareUrl });
                  } else {
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success('הקישור הועתק');
                  }
                }}
              >
                <Share2 className="w-5 h-5 text-emerald-600" />
              </Button>

              {/* 2. פעמון התראות */}
              {user && <NotificationBell userEmail={user.email} />}

              {/* 3. שפה */}
              <LanguageSwitcher />

              {/* 4. נגישות */}
              <AccessibilityButton />

              {/* 5. פרופיל */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border border-emerald-200">
                        <AvatarFallback className="bg-emerald-600 text-white">
                          {(user.first_name?.[0] || 'U').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(createPageUrl('Profile'))}>
                      <User className="w-4 h-4 mr-2" /> פרופיל
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" /> התנתק
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => base44.auth.redirectToLogin()} className="bg-emerald-600 text-white">
                  התחבר
                </Button>
              )}

              {/* תפריט מובייל */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
                </SheetTrigger>
                <SheetContent side={isRTL ? "right" : "left"}>
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

      {/* רכיבי מערכת */}
      <MessageListener />
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