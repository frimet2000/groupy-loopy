import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '../components/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemorialRequest() {
  const { t, isRTL, language } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fallen_name: '',
    date_of_fall: '',
    place_of_fall: '',
    family_relation: '',
    requester_name: '',
    requester_email: '',
    requester_phone: '',
    story: ''
  });

  const translations = {
    he: {
      title: "בקשת הנצחה",
      subtitle: "שתפו אותנו בסיפור של יקירכם שנפל/ה למען המדינה",
      fallenName: "שם החלל/ה",
      fallenNamePlaceholder: "שם מלא",
      dateOfFall: "תאריך הנפילה",
      placeOfFall: "מקום הנפילה",
      placeOfFallPlaceholder: "לבנון, עזה, יהודה ושומרון...",
      familyRelation: "קרבה משפחתית",
      selectRelation: "בחר/י קרבה",
      parent: "הורה",
      sibling: "אח/אחות",
      spouse: "בן/בת זוג",
      child: "ילד/ה",
      grandparent: "סבא/סבתא",
      friend: "חבר/ה",
      other: "אחר",
      requesterInfo: "פרטי המבקש/ת",
      requesterName: "שם מלא",
      requesterEmail: "אימייל",
      requesterPhone: "טלפון",
      story: "סיפור ההנצחה",
      storyPlaceholder: "ספרו לנו על החלל/ה, מה אהב/ה, זיכרונות, ערכים...",
      submit: "שליחת בקשה",
      submitting: "שולח...",
      success: "הבקשה נשלחה בהצלחה! נציג ייצור עמכם קשר בקרוב",
      error: "שגיאה בשליחת הבקשה",
      requiredFields: "נא למלא את כל השדות החובה"
    },
    en: {
      title: "Memorial Request",
      subtitle: "Share with us the story of your loved one who fell for our country",
      fallenName: "Name of Fallen",
      fallenNamePlaceholder: "Full name",
      dateOfFall: "Date of Fall",
      placeOfFall: "Place of Fall",
      placeOfFallPlaceholder: "Lebanon, Gaza, Judea and Samaria...",
      familyRelation: "Family Relation",
      selectRelation: "Select relation",
      parent: "Parent",
      sibling: "Sibling",
      spouse: "Spouse",
      child: "Child",
      grandparent: "Grandparent",
      friend: "Friend",
      other: "Other",
      requesterInfo: "Requester Information",
      requesterName: "Full Name",
      requesterEmail: "Email",
      requesterPhone: "Phone",
      story: "Memorial Story",
      storyPlaceholder: "Tell us about the fallen, what they loved, memories, values...",
      submit: "Submit Request",
      submitting: "Submitting...",
      success: "Request submitted successfully! A representative will contact you soon",
      error: "Error submitting request",
      requiredFields: "Please fill all required fields"
    }
  };

  const trans = translations[language] || translations.en;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          requester_name: userData.full_name || '',
          requester_email: userData.email || ''
        }));
      } catch (e) {
        console.log('Not logged in');
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fallen_name || !formData.requester_name || !formData.requester_email || !formData.family_relation) {
      toast.error(trans.requiredFields);
      return;
    }

    setLoading(true);
    try {
      await base44.entities.Memorial.create({
        ...formData,
        status: 'pending'
      });

      toast.success(trans.success);
      setFormData({
        fallen_name: '',
        date_of_fall: '',
        place_of_fall: '',
        family_relation: '',
        requester_name: user?.full_name || '',
        requester_email: user?.email || '',
        requester_phone: '',
        story: ''
      });
    } catch (error) {
      console.error(error);
      toast.error(trans.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl sm:text-3xl">{trans.title}</CardTitle>
                <CardDescription className="text-white opacity-90 mt-2">
                  {trans.subtitle}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fallen Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fallen_name">{trans.fallenName} *</Label>
                  <Input
                    id="fallen_name"
                    value={formData.fallen_name}
                    onChange={(e) => setFormData({...formData, fallen_name: e.target.value})}
                    placeholder={trans.fallenNamePlaceholder}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_fall">{trans.dateOfFall}</Label>
                    <Input
                      id="date_of_fall"
                      type="date"
                      value={formData.date_of_fall}
                      onChange={(e) => setFormData({...formData, date_of_fall: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="place_of_fall">{trans.placeOfFall}</Label>
                    <Input
                      id="place_of_fall"
                      value={formData.place_of_fall}
                      onChange={(e) => setFormData({...formData, place_of_fall: e.target.value})}
                      placeholder={trans.placeOfFallPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="family_relation">{trans.familyRelation} *</Label>
                  <Select value={formData.family_relation} onValueChange={(value) => setFormData({...formData, family_relation: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={trans.selectRelation} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">{trans.parent}</SelectItem>
                      <SelectItem value="sibling">{trans.sibling}</SelectItem>
                      <SelectItem value="spouse">{trans.spouse}</SelectItem>
                      <SelectItem value="child">{trans.child}</SelectItem>
                      <SelectItem value="grandparent">{trans.grandparent}</SelectItem>
                      <SelectItem value="friend">{trans.friend}</SelectItem>
                      <SelectItem value="other">{trans.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Requester Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{trans.requesterInfo}</h3>
                
                <div>
                  <Label htmlFor="requester_name">{trans.requesterName} *</Label>
                  <Input
                    id="requester_name"
                    value={formData.requester_name}
                    onChange={(e) => setFormData({...formData, requester_name: e.target.value})}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="requester_email">{trans.requesterEmail} *</Label>
                    <Input
                      id="requester_email"
                      type="email"
                      value={formData.requester_email}
                      onChange={(e) => setFormData({...formData, requester_email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="requester_phone">{trans.requesterPhone}</Label>
                    <Input
                      id="requester_phone"
                      value={formData.requester_phone}
                      onChange={(e) => setFormData({...formData, requester_phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Story */}
              <div>
                <Label htmlFor="story">{trans.story}</Label>
                <Textarea
                  id="story"
                  value={formData.story}
                  onChange={(e) => setFormData({...formData, story: e.target.value})}
                  placeholder={trans.storyPlaceholder}
                  rows={6}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                {loading ? trans.submitting : trans.submit}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}