import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, Copy, Mail, Facebook, Twitter, Linkedin, 
  MessageCircle, Lock, Globe, Users, Eye, Bookmark, X
} from 'lucide-react';
import { toast } from "sonner";

export default function ShareDialog({ trip, open, onOpenChange, isOrganizer }) {
  const { language } = useLanguage();
  const [privacy, setPrivacy] = useState(trip.privacy || 'public');
  const [inviteEmail, setInviteEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const tripUrl = `${window.location.origin}${window.location.pathname}?id=${trip.id}`;
  const title = trip.title || trip.title_he || trip.title_en;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tripUrl);
    toast.success(language === 'he' ? 'הקישור הועתק ללוח' : 'Link copied to clipboard');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(
      `${language === 'he' ? 'בוא נצטרף לטיול:' : 'Join this trip:'} ${title}\n${tripUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareSocial = (platform) => {
    const encoded = encodeURIComponent(tripUrl);
    const text = encodeURIComponent(title);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      whatsapp: `https://wa.me/?text=${text} ${encoded}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleUpdatePrivacy = async () => {
    setSaving(true);
    try {
      await base44.entities.Trip.update(trip.id, { privacy });
      toast.success(language === 'he' ? 'הגדרות הפרטיות עודכנו' : 'Privacy settings updated');
    } catch (error) {
      toast.error(language === 'he' ? 'שגיאה בעדכון' : 'Error updating');
    }
    setSaving(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    
    const invitedEmails = trip.invited_emails || [];
    if (invitedEmails.includes(inviteEmail)) {
      toast.error(language === 'he' ? 'כתובת זו כבר הוזמנה' : 'Email already invited');
      return;
    }

    await base44.entities.Trip.update(trip.id, {
      invited_emails: [...invitedEmails, inviteEmail]
    });

    // Send email
    await base44.integrations.Core.SendEmail({
      to: inviteEmail,
      subject: language === 'he' 
        ? `הוזמנת לטיול: ${title}`
        : `You're invited to: ${title}`,
      body: language === 'he'
        ? `היי!\n\nהוזמנת לצפות בטיול "${title}".\n\nלחץ כאן לצפייה: ${tripUrl}\n\nבהצלחה!`
        : `Hi!\n\nYou've been invited to view the trip "${title}".\n\nClick here to view: ${tripUrl}\n\nEnjoy!`
    });

    setInviteEmail('');
    toast.success(language === 'he' ? 'ההזמנה נשלחה' : 'Invitation sent');
  };

  const handleRemoveInvite = async (email) => {
    const invitedEmails = (trip.invited_emails || []).filter(e => e !== email);
    await base44.entities.Trip.update(trip.id, {
      invited_emails: invitedEmails
    });
    toast.success(language === 'he' ? 'ההזמנה הוסרה' : 'Invitation removed');
  };

  const views = trip.views?.length || 0;
  const saves = trip.saves?.length || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            {language === 'he' ? 'שתף טיול' : 'Share Trip'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">{views}</span>
              <span className="text-gray-500">{language === 'he' ? 'צפיות' : 'views'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bookmark className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">{saves}</span>
              <span className="text-gray-500">{language === 'he' ? 'שמירות' : 'saves'}</span>
            </div>
          </div>

          {/* Privacy Settings */}
          {isOrganizer && (
            <div className="space-y-3">
              <Label>{language === 'he' ? 'הגדרות פרטיות' : 'Privacy Settings'}</Label>
              <RadioGroup value={privacy} onValueChange={setPrivacy}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-medium">{language === 'he' ? 'ציבורי' : 'Public'}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'he' ? 'כולם יכולים לראות' : 'Everyone can see'}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="invite_only" id="invite_only" />
                  <Label htmlFor="invite_only" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium">{language === 'he' ? 'בהזמנה בלבד' : 'Invite Only'}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'he' ? 'רק מוזמנים יכולים לראות' : 'Only invited can see'}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="font-medium">{language === 'he' ? 'פרטי' : 'Private'}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'he' ? 'רק אתה ומשתתפים' : 'Only you and participants'}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              {privacy !== trip.privacy && (
                <Button 
                  onClick={handleUpdatePrivacy} 
                  disabled={saving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {language === 'he' ? 'שמור שינויים' : 'Save Changes'}
                </Button>
              )}
            </div>
          )}

          {/* Invite by Email */}
          {isOrganizer && privacy === 'invite_only' && (
            <div className="space-y-3">
              <Label>{language === 'he' ? 'הזמן באימייל' : 'Invite by Email'}</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder={language === 'he' ? 'הזן כתובת אימייל' : 'Enter email address'}
                />
                <Button onClick={handleInvite} disabled={!inviteEmail}>
                  {language === 'he' ? 'הזמן' : 'Invite'}
                </Button>
              </div>
              {trip.invited_emails?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    {language === 'he' ? 'מוזמנים:' : 'Invited:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trip.invited_emails.map(email => (
                      <Badge key={email} variant="secondary" className="gap-2">
                        {email}
                        <button
                          onClick={() => handleRemoveInvite(email)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Share Link */}
          <div className="space-y-3">
            <Label>{language === 'he' ? 'שתף קישור' : 'Share Link'}</Label>
            <div className="flex gap-2">
              <Input value={tripUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Social Share */}
          {trip.privacy === 'public' && (
            <div className="space-y-3">
              <Label>{language === 'he' ? 'שתף ברשתות' : 'Share on Social'}</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleShareSocial('whatsapp')}
                  className="flex-col h-auto py-3"
                >
                  <MessageCircle className="w-5 h-5 text-green-600 mb-1" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShareSocial('facebook')}
                  className="flex-col h-auto py-3"
                >
                  <Facebook className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShareSocial('twitter')}
                  className="flex-col h-auto py-3"
                >
                  <Twitter className="w-5 h-5 text-sky-500 mb-1" />
                  <span className="text-xs">Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareEmail}
                  className="flex-col h-auto py-3"
                >
                  <Mail className="w-5 h-5 text-gray-600 mb-1" />
                  <span className="text-xs">{language === 'he' ? 'אימייל' : 'Email'}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}