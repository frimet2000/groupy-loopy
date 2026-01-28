// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import TripCard from '../components/trips/TripCard';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2, ArrowLeft, ArrowRight, History, Calendar, Search, Filter, ChevronDown, Sparkles, MapPin } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Archive() {
  const { language, t, isRTL } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(12);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [filterYear, setFilterYear] = useState('all');

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        console.log('Not logged in');
      }
    };
    fetchUser();
  }, []);

  const { data: allTrips = [], isLoading } = useQuery({
    queryKey: ['trips-archive'],
    queryFn: () => base44.entities.Trip.list('-date'),
    staleTime: 60 * 1000
  });

  const archiveTrips = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = allTrips.filter(trip => {
      const tripDate = new Date(trip.date);
      tripDate.setHours(0, 0, 0, 0);
      
      if (tripDate >= today) return false;
      
      if (trip.privacy === 'private') {
        if (!user) return false;
        const isOrganizerOrParticipant = trip.organizer_email === user.email || 
          trip.participants?.some(p => p.email === user.email);
        return isOrganizerOrParticipant;
      }

      if (trip.privacy === 'invite_only') {
        if (!user) return false;
        const isInvitedOrParticipant = trip.invited_emails?.includes(user.email) ||
          trip.organizer_email === user.email ||
          trip.participants?.some(p => p.email === user.email);
        return isInvitedOrParticipant;
      }

      return true;
    });

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trip => {
        const title = (trip.title || trip.title_he || trip.title_en || '').toLowerCase();
        const location = (trip.location || '').toLowerCase();
        return title.includes(query) || location.includes(query);
      });
    }

    // Year filter
    if (filterYear !== 'all') {
      filtered = filtered.filter(trip => {
        const year = new Date(trip.date).getFullYear().toString();
        return year === filterYear;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.date) - new Date(b.date);
        case 'participants':
          return (b.current_participants || 0) - (a.current_participants || 0);
        case 'likes':
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;
  }, [allTrips, user, searchQuery, sortBy, filterYear]);

  // Get unique years for filter
  const availableYears = useMemo(() => {
    const years = new Set();
    allTrips.forEach(trip => {
      const year = new Date(trip.date).getFullYear();
      if (year < new Date().getFullYear() || (year === new Date().getFullYear() && new Date(trip.date) < new Date())) {
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [allTrips]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 pb-12">
      <SEO 
        title={language === 'he' ? 'ארכיון טיולים - Groupy Loopy' : 'Trip Archive - Groupy Loopy'} 
        description={language === 'he' ? 'צפה בטיולים שכבר התקיימו' : 'View past trips'} 
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <History className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-100">
                {language === 'he' ? 'זיכרונות מטיולים' : 'Trip Memories'}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                {language === 'he' ? 'ארכיון טיולים' : 'Trip Archive'}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              {language === 'he' 
                ? 'טיולים שכבר התקיימו - זיכרונות, תמונות וחוויות'
                : 'Past trips - memories, photos and experiences'}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-emerald-400">{archiveTrips.length}</div>
                <div className="text-sm text-gray-400">{language === 'he' ? 'טיולים' : 'Trips'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-teal-400">{availableYears.length}</div>
                <div className="text-sm text-gray-400">{language === 'he' ? 'שנים' : 'Years'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400">
                  {archiveTrips.reduce((acc, trip) => acc + (trip.current_participants || 1), 0)}
                </div>
                <div className="text-sm text-gray-400">{language === 'he' ? 'משתתפים' : 'Participants'}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="gap-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl">
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              {language === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={language === 'he' ? 'חיפוש טיולים...' : 'Search trips...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>

            {/* Year Filter */}
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-[130px] rounded-xl border-gray-200">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder={language === 'he' ? 'שנה' : 'Year'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'he' ? 'כל השנים' : 'All Years'}</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] rounded-xl border-gray-200">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">{language === 'he' ? 'הכי חדש' : 'Newest'}</SelectItem>
                <SelectItem value="date_asc">{language === 'he' ? 'הכי ישן' : 'Oldest'}</SelectItem>
                <SelectItem value="participants">{language === 'he' ? 'משתתפים' : 'Participants'}</SelectItem>
                <SelectItem value="likes">{language === 'he' ? 'לייקים' : 'Likes'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
              {archiveTrips.length} {language === 'he' ? 'טיולים' : 'trips'}
            </Badge>
            {searchQuery && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                "{searchQuery}"
              </Badge>
            )}
            {filterYear !== 'all' && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
                {filterYear}
              </Badge>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-gray-500">{language === 'he' ? 'טוען טיולים...' : 'Loading trips...'}</p>
          </div>
        ) : archiveTrips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'he' ? 'לא נמצאו טיולים' : 'No trips found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? (language === 'he' ? 'נסה חיפוש אחר' : 'Try a different search')
                : (language === 'he' ? 'עדיין אין טיולים בארכיון' : 'No archived trips yet')}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
                className="rounded-xl"
              >
                {language === 'he' ? 'נקה חיפוש' : 'Clear search'}
              </Button>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {archiveTrips.slice(0, visibleCount).map((trip) => (
                <motion.div key={trip.id} variants={itemVariants}>
                  <TripCard trip={trip} currentUser={user} isArchive={true} />
                </motion.div>
              ))}
            </motion.div>

            {archiveTrips.length > visibleCount && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center"
              >
                <Button
                  size="lg"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="min-w-[220px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-xl hover:shadow-2xl rounded-2xl h-14 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    {language === 'he' ? 'טען עוד טיולים' : 'Load More Trips'}
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </Button>
                <p className="mt-3 text-sm text-gray-500">
                  {language === 'he' 
                    ? `מציג ${Math.min(visibleCount, archiveTrips.length)} מתוך ${archiveTrips.length}`
                    : `Showing ${Math.min(visibleCount, archiveTrips.length)} of ${archiveTrips.length}`}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}