import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../components/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { QrCode, Search, CheckCircle2, Users, Utensils, Bed, Car, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import QRScanner from '../components/nifgashim/QRScanner';
import DailyChoicesForm from '../components/nifgashim/DailyChoicesForm';

export default function NifgashimCheckIn() {
  const { language, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const translations = {
    he: {
      title: "צ'ק-אין למסע",
      scanQR: "סרוק QR",
      manualSearch: "חיפוש ידני",
      selectDate: "בחר תאריך",
      search: "חיפוש לפי שם/אימייל/טלפון",
      todayStats: "נתונים להיום",
      checkedIn: "נרשמו",
      meals: "ארוחות",
      accommodation: "לינות",
      drivers: "נהגים",
      participants: "משתתפים",
      notCheckedIn: "לא נרשם",
      checkInNow: "צ'ק-אין",
      checkedInAt: "נרשם בשעה",
      adminOnly: "דף זה מיועד למנהלים בלבד",
      noParticipants: "אין משתתפים רשומים ליום זה",
      checkInSuccess: "צ'ק-אין בוצע בהצלחה",
      lunch: "צהריים",
      dinner: "ערב",
      breakfast: "בוקר"
    },
    en: {
      title: "Trek Check-In",
      scanQR: "Scan QR",
      manualSearch: "Manual Search",
      selectDate: "Select Date",
      search: "Search by name/email/phone",
      todayStats: "Today's Stats",
      checkedIn: "Checked In",
      meals: "Meals",
      accommodation: "Accommodations",
      drivers: "Drivers",
      participants: "Participants",
      notCheckedIn: "Not Checked In",
      checkInNow: "Check In",
      checkedInAt: "Checked in at",
      adminOnly: "This page is for administrators only",
      noParticipants: "No participants registered for this date",
      checkInSuccess: "Check-in successful",
      lunch: "Lunch",
      dinner: "Dinner",
      breakfast: "Breakfast"
    }
  };

  const trans = translations[language] || translations.en;

  const { data: registrations = [] } = useQuery({
    queryKey: ['nifgashimRegistrations', selectedDate],
    queryFn: () => base44.entities.NifgashimRegistration.filter({
      registration_status: 'confirmed'
    }),
    refetchInterval: 5000
  });

  const participantsForDate = registrations.filter(reg => 
    reg.selected_days?.includes(selectedDate)
  );

  const checkInMutation = useMutation({
    mutationFn: async ({ registrationId, checkInData }) => {
      const reg = registrations.find(r => r.id === registrationId);
      const updatedCheckIns = [...(reg.check_ins || []), checkInData];
      return base44.entities.NifgashimRegistration.update(registrationId, {
        check_ins: updatedCheckIns
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['nifgashimRegistrations']);
      toast.success(trans.checkInSuccess);
      setSelectedParticipant(null);
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        if (userData?.role !== 'admin') {
          base44.auth.redirectToLogin();
          return;
        }
        setUser(userData);
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    fetchUser();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{trans.adminOnly}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const checkedInToday = participantsForDate.filter(p => 
    p.check_ins?.some(c => c.date === selectedDate)
  );

  const todayMeals = checkedInToday.reduce((acc, p) => {
    const checkIn = p.check_ins.find(c => c.date === selectedDate);
    if (checkIn?.meals) {
      acc.lunch += checkIn.meals.lunch ? 1 : 0;
      acc.dinner += checkIn.meals.dinner ? 1 : 0;
      acc.breakfast += checkIn.meals.breakfast_next_day ? 1 : 0;
    }
    return acc;
  }, { lunch: 0, dinner: 0, breakfast: 0 });

  const todayAccommodation = checkedInToday.filter(p => 
    p.check_ins?.find(c => c.date === selectedDate)?.accommodation
  ).length;

  const todayDrivers = checkedInToday.filter(p => 
    p.check_ins?.find(c => c.date === selectedDate)?.is_driver
  ).length;

  const filteredParticipants = participantsForDate.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return p.user_email?.toLowerCase().includes(query) ||
           p.emergency_contact_name?.toLowerCase().includes(query);
  });

  const handleCheckIn = (participant) => {
    setSelectedParticipant(participant);
  };

  const handleSaveCheckIn = (choices) => {
    checkInMutation.mutate({
      registrationId: selectedParticipant.id,
      checkInData: {
        date: selectedDate,
        checked_in_at: new Date().toISOString(),
        checked_in_by: user.email,
        ...choices
      }
    });
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-6 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{trans.title}</h1>

          {/* Date Selector */}
          <div className="mb-4">
            <Label>{trans.selectDate}</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-green-600">{checkedInToday.length}</div>
                <div className="text-xs text-gray-600">{trans.checkedIn}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{todayMeals.lunch}</div>
                <div className="text-xs text-gray-600">{trans.lunch}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{todayMeals.dinner}</div>
                <div className="text-xs text-gray-600">{trans.dinner}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{todayAccommodation}</div>
                <div className="text-xs text-gray-600"><Bed className="w-4 h-4 mx-auto" /></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-teal-600">{todayDrivers}</div>
                <div className="text-xs text-gray-600"><Car className="w-4 h-4 mx-auto" /></div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="manual" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr">{trans.scanQR}</TabsTrigger>
            <TabsTrigger value="manual">{trans.manualSearch}</TabsTrigger>
          </TabsList>

          <TabsContent value="qr">
            <QRScanner 
              onScan={(email) => {
                const participant = participantsForDate.find(p => p.user_email === email);
                if (participant) {
                  handleCheckIn(participant);
                } else {
                  toast.error(language === 'he' ? 'משתתף לא נמצא' : 'Participant not found');
                }
              }}
            />
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder={trans.search}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Badge variant="outline">
                    {filteredParticipants.length} {trans.participants}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredParticipants.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">{trans.noParticipants}</p>
                  ) : (
                    filteredParticipants.map((participant) => {
                      const isCheckedIn = participant.check_ins?.some(c => c.date === selectedDate);
                      const checkInData = participant.check_ins?.find(c => c.date === selectedDate);

                      return (
                        <Card key={participant.id} className={`${isCheckedIn ? 'bg-green-50 border-green-300' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="font-semibold">{participant.user_email}</div>
                                <div className="text-sm text-gray-600">
                                  {participant.emergency_contact_name}
                                </div>
                                {isCheckedIn && checkInData && (
                                  <div className="text-xs text-green-700 mt-1">
                                    {trans.checkedInAt} {new Date(checkInData.checked_in_at).toLocaleTimeString(language === 'he' ? 'he-IL' : 'en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                )}
                              </div>
                              {isCheckedIn ? (
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                              ) : (
                                <Button
                                  onClick={() => handleCheckIn(participant)}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {trans.checkInNow}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Check-in Dialog */}
        {selectedParticipant && (
          <DailyChoicesForm
            participant={selectedParticipant}
            date={selectedDate}
            onSave={handleSaveCheckIn}
            onCancel={() => setSelectedParticipant(null)}
          />
        )}
      </div>
    </div>
  );
}