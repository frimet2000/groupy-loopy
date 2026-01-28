// @ts-nocheck
import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Calendar, MapPin, Users, Clock, Mountain, Droplets, TreePine, Dog, Tent, 
  Trash2, Heart, MessageCircle, User, ArrowLeft, ArrowRight, Edit, 
  Bike, Truck, Share2, Sparkles, Star, Eye
} from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const difficultyConfig = {
  easy: { color: 'from-green-400 to-emerald-500', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  moderate: { color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  challenging: { color: 'from-orange-400 to-red-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  hard: { color: 'from-red-500 to-rose-600', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  extreme: { color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

const activityConfig = {
  hiking: { icon: Mountain, color: 'from-emerald-500 to-teal-600', emoji: '🥾' },
  cycling: { icon: Bike, color: 'from-blue-500 to-cyan-600', emoji: '🚴' },
  offroad: { icon: Truck, color: 'from-orange-500 to-amber-600', emoji: '🚙' },
  trek: { icon: Mountain, color: 'from-purple-500 to-indigo-600', emoji: '⛰️' },
  running: { icon: User, color: 'from-rose-500 to-pink-600', emoji: '🏃' },
  culinary: { icon: Star, color: 'from-amber-500 to-yellow-600', emoji: '🍽️' },
};

export default function TripCard({ trip, currentUser, isArchive = false }) {
  const { t, language, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(trip.likes?.some(like => like.email === currentUser?.email) || false);
  const [likesCount, setLikesCount] = useState(trip.likes?.length || 0);
  const [isHovered, setIsHovered] = useState(false);
  
  const title = trip.title || trip.title_he || trip.title_en;
  const description = trip.description || trip.description_he || trip.description_en;
  
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const cleanDescription = stripHtml(description);
  const user = currentUser;

  const canDelete = user && (user.email === trip.organizer_email || user.role === 'admin');
  const isManager = user && (
    user.email === trip.organizer_email || 
    user.role === 'admin' ||
    trip.additional_organizers?.some(org => org.email === user.email)
  );
  const hasJoined = user && trip.participants?.some(p => p.email === user.email);
  const difficulty = difficultyConfig[trip.difficulty] || difficultyConfig.moderate;
  const activity = activityConfig[trip.activity_type] || activityConfig.hiking;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error(language === 'he' ? 'יש להתחבר כדי לסמן מועדפים' : 'Please login to like trips');
      return;
    }

    try {
      const now = new Date().toISOString();
      const currentLikes = trip.likes || [];
      const currentSaves = trip.saves || [];

      const newLikes = isLiked
        ? currentLikes.filter(like => like.email !== user.email)
        : [...currentLikes, { email: user.email, timestamp: now }];

      const isSaved = currentSaves.some(s => s.email === user.email);
      const newSaves = isLiked
        ? currentSaves.filter(s => s.email !== user.email)
        : (isSaved ? currentSaves : [...currentSaves, { email: user.email, timestamp: now }]);

      await base44.entities.Trip.update(trip.id, { likes: newLikes, saves: newSaves });
      setIsLiked(!isLiked);
      setLikesCount(newLikes.length);
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
      
      toast.success(isLiked 
        ? (language === 'he' ? 'הוסר מהמועדפים' : 'Removed from favorites')
        : (language === 'he' ? 'נוסף למועדפים' : 'Added to favorites')
      );
    } catch (error) {
      toast.error(language === 'he' ? 'שגיאה בעדכון מועדפים' : 'Error updating favorites');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}${createPageUrl('TripDetails')}?id=${trip.id}`;
    const shareText = language === 'he' 
      ? `הצטרף אליי לטיול: ${title}`
      : `Join me on this trip: ${title}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ title: title, text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success(language === 'he' ? 'הקישור הועתק' : 'Link copied');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(shareUrl);
        toast.success(language === 'he' ? 'הקישור הועתק' : 'Link copied');
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const participants = trip.participants || [];
      const emailPromises = participants
        .filter(p => p.email !== trip.organizer_email)
        .map(participant => 
          base44.integrations.Core.SendEmail({
            to: participant.email,
            subject: language === 'he' ? `הטיול "${title}" בוטל` : `Trip "${title}" has been cancelled`,
            body: language === 'he'
              ? `שלום ${participant.name},\n\nהטיול "${title}" בוטל על ידי המארגן.\n\nבברכה,\nצוות Groupy Loopy`
              : `Hello ${participant.name},\n\nThe trip "${title}" has been cancelled by the organizer.\n\nBest regards,\nGroupy Loopy Team`
          })
        );

      await Promise.all(emailPromises);
      await base44.entities.Trip.delete(trip.id);
      
      toast.success(language === 'he' ? 'הטיול נמחק' : 'Trip deleted');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    } catch (error) {
      toast.error(language === 'he' ? 'שגיאה במחיקת הטיול' : 'Error deleting trip');
    }
    setDeleting(false);
    setShowDeleteDialog(false);
  };

  const spotsLeft = trip.max_participants ? trip.max_participants - (trip.current_participants || 1) : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <Card className={`group h-full overflow-hidden transition-all duration-500 bg-white/80 backdrop-blur-sm touch-manipulation rounded-3xl relative
          ${hasJoined 
            ? 'border-2 border-blue-400 ring-4 ring-blue-100 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)]' 
            : 'border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.25)] hover:border-emerald-200'
          }
          ${isArchive ? 'opacity-80' : ''}
        `}>
          {/* Gradient Overlay on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl z-0`} />
          
          {/* Image Section */}
          <div className="relative h-56 sm:h-52 overflow-hidden">
            <Link to={createPageUrl('TripDetails') + `?id=${trip.id}`} className="block w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={trip.image_url || `https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=85`}
                alt={title}
                className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${isArchive ? 'grayscale-[60%]' : ''}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              
              {/* Floating Activity Badge */}
              <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} z-20`}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r ${activity.color} text-white shadow-lg backdrop-blur-sm`}>
                  <span className="text-lg">{activity.emoji}</span>
                  <span className="font-bold text-sm">{t(trip.activity_type)}</span>
                </div>
              </div>

              {/* Status Badges */}
              <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} flex flex-col gap-2 z-20`}>
                {isArchive && (
                  <Badge className="bg-gray-900/90 text-white border-0 font-bold px-3 py-1.5 backdrop-blur-sm">
                    {language === 'he' ? '✓ הסתיים' : '✓ Ended'}
                  </Badge>
                )}
                {hasJoined && !isArchive && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 font-bold px-3 py-1.5 animate-pulse shadow-lg">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    {language === 'he' ? 'הצטרפת!' : 'Joined!'}
                  </Badge>
                )}
                {isFull && !isArchive && (
                  <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 font-bold px-3 py-1.5">
                    {language === 'he' ? 'מלא' : 'Full'}
                  </Badge>
                )}
                {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 3 && !isArchive && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-bold px-3 py-1.5 animate-pulse">
                    {language === 'he' ? `נותרו ${spotsLeft} מקומות!` : `${spotsLeft} spots left!`}
                  </Badge>
                )}
              </div>

              {/* Bottom Image Info */}
              <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'} ${isRTL ? 'left-4' : 'right-4'} flex items-end justify-between z-20`}>
                <div className="flex gap-2">
                  {trip.pets_allowed && (
                    <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Dog className="w-5 h-5 text-amber-600" />
                    </div>
                  )}
                  {trip.camping_available && (
                    <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Tent className="w-5 h-5 text-emerald-600" />
                    </div>
                  )}
                </div>
                
                {/* Difficulty Badge */}
                <div className={`px-3 py-1.5 rounded-xl ${difficulty.bg} ${difficulty.text} ${difficulty.border} border font-bold text-xs shadow-sm backdrop-blur-sm`}>
                  {t(trip.difficulty)}
                </div>
              </div>
            </Link>

            {/* Action Buttons - Floating */}
            <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-11 h-11 rounded-xl bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-emerald-50 transition-colors border border-white/50"
              >
                <Share2 className="w-5 h-5 text-emerald-600" />
              </motion.button>
              {user && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`w-11 h-11 rounded-xl shadow-xl flex items-center justify-center transition-all border border-white/50 ${
                    isLiked 
                      ? 'bg-gradient-to-br from-rose-500 to-pink-500' 
                      : 'bg-white/95 backdrop-blur-sm hover:bg-rose-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'text-rose-500'}`} />
                </motion.button>
              )}
              {isManager && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(createPageUrl('EditTrip') + `?id=${trip.id}`);
                  }}
                  className="w-11 h-11 rounded-xl bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-blue-50 transition-colors border border-white/50"
                >
                  <Edit className="w-5 h-5 text-blue-600" />
                </motion.button>
              )}
              {canDelete && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeleteDialog(true);
                  }}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-xl flex items-center justify-center hover:from-red-600 hover:to-rose-700 transition-all"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </motion.button>
              )}
            </div>
          </div>
        
          {/* Content Section */}
          <CardContent className="p-5 relative z-10" dir={isRTL ? 'rtl' : 'ltr'}>
            <Link to={createPageUrl('TripDetails') + `?id=${trip.id}`}>
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
                {title}
              </h3>
              
              {cleanDescription && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {cleanDescription}
                </p>
              )}
              
              {/* Info Grid */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4.5 h-4.5 text-emerald-600" />
                    </div>
                    <span className="truncate font-semibold text-sm text-gray-700">{trip.location}</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border-gray-200 text-xs px-2.5 py-1 font-semibold flex-shrink-0">
                    {t(trip.region)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 bg-blue-50/50 rounded-xl px-3 py-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-sm text-blue-700">{formatDate(new Date(trip.date), 'dd/MM/yy', language)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 bg-purple-50/50 rounded-xl px-3 py-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-sm text-purple-700 truncate">
                      {trip.activity_type === 'trek' && trip.trek_days?.length > 0 
                        ? `${trip.trek_days.length} ${language === 'he' ? 'ימים' : 'days'}`
                        : `${trip.duration_value} ${t(trip.duration_type)}`
                      }
                    </span>
                  </div>
                </div>

                {/* Organizer & Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {trip.organizer_name?.charAt(0) || '?'}
                    </div>
                    <span className="text-xs text-gray-500 truncate max-w-[100px]">{trip.organizer_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-bold">{trip.current_participants || 1}</span>
                      {trip.max_participants && <span className="text-xs">/{trip.max_participants}</span>}
                    </div>
                    <div className="flex items-center gap-1 text-rose-500">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-bold">{likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-500">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-bold">{trip.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* CTA Button */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="mt-4"
            >
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(createPageUrl('TripDetails') + `?id=${trip.id}`);
                }}
                className={`w-full font-bold h-12 rounded-2xl shadow-lg transition-all duration-300 ${
                  hasJoined 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                } text-white border-0`}
              >
                <span className="flex items-center justify-center gap-2">
                  {hasJoined 
                    ? (language === 'he' ? 'צפה בטיול שלי' : 'View My Trip')
                    : (language === 'he' ? 'לפרטים נוספים' : 'View Details')
                  }
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {language === 'he' ? '🗑️ מחיקת טיול' : '🗑️ Delete Trip'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'he' 
                ? 'האם אתה בטוח? המשתתפים יקבלו הודעה על הביטול.'
                : 'Are you sure? Participants will be notified about the cancellation.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="rounded-xl">
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl"
            >
              {deleting ? (language === 'he' ? 'מוחק...' : 'Deleting...') : t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}