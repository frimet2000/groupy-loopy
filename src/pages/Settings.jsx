import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { 
  Bell, 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Save,
  Loader2,
  Sparkles,
  Clock,
  AlertCircle,
  UserPlus
} from 'lucide-react';

export default function Settings() {
  const { t, language, isRTL } = useLanguage();
  const [user, setUser] = useState(null);
  const [notificationPrefs, setNotificationPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        
        // Fetch notification preferences
        const prefs = await base44.entities.NotificationPreferences.filter({ 
          user_email: userData.email 
        });
        
        if (prefs.length > 0) {
          setNotificationPrefs(prefs[0]);
        } else {
          // Create default preferences
          const newPrefs = await base44.entities.NotificationPreferences.create({
            user_email: userData.email,
            trip_reminders: true,
            reminder_hours: 24,
            join_requests: true,
            request_responses: true,
            new_messages: true,
            trip_updates: true,
            trip_cancellations: true,
          });
          setNotificationPrefs(newPrefs);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error(language === 'he' ? 'שגיאה בטעינת נתונים' : 'Error loading data');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleToggle = async (key) => {
    const newValue = !notificationPrefs[key];
    setNotificationPrefs(prev => ({ ...prev, [key]: newValue }));
    
    try {
      await base44.entities.NotificationPreferences.update(notificationPrefs.id, { 
        [key]: newValue 
      });
      toast.success(language === 'he' ? 'עודכן' : 'Updated');
    } catch (error) {
      toast.error(language === 'he' ? 'שגיאה בעדכון' : 'Error updating');
    }
  };

  const handleReminderHoursChange = async (hours) => {
    const hoursNum = parseInt(hours);
    setNotificationPrefs(prev => ({ ...prev, reminder_hours: hoursNum }));
    
    try {
      await base44.entities.NotificationPreferences.update(notificationPrefs.id, { 
        reminder_hours: hoursNum 
      });
      toast.success(language === 'he' ? 'עודכן' : 'Updated');
    } catch (error) {
      toast.error(language === 'he' ? 'שגיאה בעדכון' : 'Error updating');
    }
  };

  if (loading || !notificationPrefs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const notificationOptions = [
    {
      key: 'join_requests',
      icon: UserPlus,
      title: language === 'he' ? 'בקשות הצטרפות' : 'Join Requests',
      description: language === 'he' 
        ? 'קבל התראות כאשר מישהו מבקש להצטרף לטיול שארגנת'
        : 'Get notified when someone requests to join your trip',
      color: 'from-purple-500 to-pink-600'
    },
    {
      key: 'request_responses',
      icon: Users,
      title: language === 'he' ? 'תשובות לבקשות' : 'Request Responses',
      description: language === 'he' 
        ? 'קבל התראות כאשר בקשתך להצטרפות אושרה או נדחתה'
        : 'Get notified when your join request is approved or rejected',
      color: 'from-green-500 to-emerald-600'
    },
    {
      key: 'new_messages',
      icon: MessageSquare,
      title: language === 'he' ? 'הודעות חדשות' : 'New Messages',
      description: language === 'he' 
        ? 'קבל התראות על הודעות חדשות בצ\'אט הטיולים'
        : 'Get notified about new messages in trip chats',
      color: 'from-orange-500 to-amber-600'
    },
    {
      key: 'trip_updates',
      icon: TrendingUp,
      title: language === 'he' ? 'עדכוני טיול' : 'Trip Updates',
      description: language === 'he' 
        ? 'קבל התראות כאשר פרטי הטיול משתנים'
        : 'Get notified when trip details are updated',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      key: 'trip_cancellations',
      icon: AlertCircle,
      title: language === 'he' ? 'ביטולי טיול' : 'Trip Cancellations',
      description: language === 'he' 
        ? 'קבל התראות כאשר טיול שהצטרפת אליו מבוטל'
        : 'Get notified when a trip you joined is cancelled',
      color: 'from-red-500 to-rose-600'
    },
    {
      key: 'trip_reminders',
      icon: Calendar,
      title: language === 'he' ? 'תזכורות טיול' : 'Trip Reminders',
      description: language === 'he' 
        ? 'קבל תזכורות אוטומטיות לפני הטיולים שלך'
        : 'Get automatic reminders before your trips',
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {language === 'he' ? 'הגדרות התראות' : 'Notification Settings'}
            </h1>
          </div>
          <p className="text-gray-600">
            {language === 'he' 
              ? 'נהל את העדפות ההתראות שלך ובחר איזה עדכונים תרצה לקבל'
              : 'Manage your notification preferences and choose which updates you want to receive'}
          </p>
        </motion.div>

        <Card className="mb-6 border-2 border-gray-100 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              {language === 'he' ? 'סוגי התראות' : 'Notification Types'}
            </CardTitle>
            <CardDescription>
              {language === 'he'
                ? 'בחר איזה התראות תרצה לקבל'
                : 'Choose which notifications you want to receive'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {notificationOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 bg-gradient-to-br ${option.color} rounded-xl shadow-md group-hover:shadow-lg transition-all`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Label 
                          htmlFor={option.key} 
                          className="text-base font-semibold cursor-pointer block mb-1"
                        >
                          {option.title}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id={option.key}
                      checked={notificationPrefs[option.key]}
                      onCheckedChange={() => handleToggle(option.key)}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-600"
                    />
                  </div>
                  {index < notificationOptions.length - 1 && <Separator className="my-2" />}
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Reminder Timing */}
        {notificationPrefs.trip_reminders && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-blue-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  {language === 'he' ? 'זמן תזכורת' : 'Reminder Timing'}
                </CardTitle>
                <CardDescription>
                  {language === 'he'
                    ? 'בחר מתי תרצה לקבל תזכורת לפני הטיול'
                    : 'Choose when you want to receive trip reminders'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-base">
                    {language === 'he' ? 'שלח תזכורת לפני' : 'Send reminder before'}
                  </Label>
                  <Select 
                    value={String(notificationPrefs.reminder_hours)}
                    onValueChange={handleReminderHoursChange}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{language === 'he' ? 'שעה אחת' : '1 hour'}</SelectItem>
                      <SelectItem value="3">{language === 'he' ? '3 שעות' : '3 hours'}</SelectItem>
                      <SelectItem value="6">{language === 'he' ? '6 שעות' : '6 hours'}</SelectItem>
                      <SelectItem value="12">{language === 'he' ? '12 שעות' : '12 hours'}</SelectItem>
                      <SelectItem value="24">{language === 'he' ? '24 שעות (יום)' : '24 hours (1 day)'}</SelectItem>
                      <SelectItem value="48">{language === 'he' ? '48 שעות (יומיים)' : '48 hours (2 days)'}</SelectItem>
                      <SelectItem value="72">{language === 'he' ? '72 שעות (3 ימים)' : '72 hours (3 days)'}</SelectItem>
                      <SelectItem value="168">{language === 'he' ? 'שבוע' : '1 week'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 p-3 bg-blue-50 rounded-lg">
                    {language === 'he' 
                      ? `תקבל תזכורת ${notificationPrefs.reminder_hours} שעות לפני כל טיול`
                      : `You'll receive a reminder ${notificationPrefs.reminder_hours} hours before each trip`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}