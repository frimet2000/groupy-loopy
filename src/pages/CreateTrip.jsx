import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

export default function CreateTrip() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [title_he, setTitleHe] = useState('');
  const [title_en, setTitleEn] = useState('');
  const [description_he, setDescriptionHe] = useState('');
  const [description_en, setDescriptionEn] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        toast.error(language === 'he' ? 'יש להתחבר' : 'Please login');
        navigate(createPageUrl('Home'));
      }
    };
    fetchUser();
  }, [language, navigate]);

  const saveTrip = async (e) => {
    e.preventDefault();
    
    if (!title_he || !title_en || !location || !date) {
      toast.error(language === 'he' ? 'נא למלא את כל השדות' : 'Please fill all fields');
      return;
    }

    setSaving(true);
    try {
      const tripData = {
        title_he,
        title_en,
        description_he,
        description_en,
        location,
        date,
        region: 'center',
        duration_type: 'full_day',
        difficulty: 'moderate',
        trail_type: [],
        interests: [],
        parent_age_min: 18,
        parent_age_max: 65,
        children_age_min: 0,
        children_age_max: 18,
        pets_allowed: false,
        camping_available: false,
        max_participants: 10,
        current_participants: 1,
        status: 'open',
        organizer_name: user?.full_name || user?.email || '',
        organizer_email: user?.email || '',
        participants: [{
          email: user?.email || '',
          name: user?.full_name || user?.email || '',
          joined_at: new Date().toISOString()
        }]
      };

      await base44.entities.Trip.create(tripData);
      toast.success(language === 'he' ? 'הטיול נשמר בהצלחה!' : 'Trip created successfully!');
      navigate(createPageUrl('MyTrips'));
    } catch (error) {
      console.error('Error:', error);
      toast.error(language === 'he' ? 'שגיאה בשמירה' : 'Error saving trip');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t('createTrip')}
        </h1>

        <form onSubmit={saveTrip}>
          <Card>
            <CardHeader>
              <CardTitle>{language === 'he' ? 'פרטי הטיול' : 'Trip Details'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('titleHe')}</Label>
                <Input
                  value={title_he}
                  onChange={(e) => setTitleHe(e.target.value)}
                  placeholder="כותרת בעברית"
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{t('titleEn')}</Label>
                <Input
                  value={title_en}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Title in English"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{t('descriptionHe')}</Label>
                <Textarea
                  value={description_he}
                  onChange={(e) => setDescriptionHe(e.target.value)}
                  placeholder="תיאור בעברית"
                  dir="rtl"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('descriptionEn')}</Label>
                <Textarea
                  value={description_en}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Description in English"
                  dir="ltr"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('location')}</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={language === 'he' ? 'נחל דוד, עין גדי' : 'Nahal David, Ein Gedi'}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{t('date')}</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(createPageUrl('Home'))}
                  disabled={saving}
                >
                  {t('cancel')}
                </Button>
                <Button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {language === 'he' ? 'שומר...' : 'Saving...'}
                    </>
                  ) : (
                    t('save')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}