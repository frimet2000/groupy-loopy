import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Baby, User, Dog, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ParticipantStats({ trip, userProfiles, calculateAge, language, isRTL }) {
  
  // Calculate detailed statistics
  const stats = {
    totalFamilies: 0,
    totalAdults: 0,
    totalChildren: 0,
    totalPets: 0,
    totalOthers: 0,
    childrenByAge: {},
    adultsByType: { single: 0, couples: 0 },
    parentsByAge: {}
  };

  const participants = Array.isArray(trip.participants) ? trip.participants : [];

  participants.forEach(participant => {
    stats.totalFamilies++;
    
    // Adults
    let adultsInFamily = 1;
    if (participant.family_members?.spouse) {
      adultsInFamily++;
      stats.adultsByType.couples++;
    } else {
      stats.adultsByType.single++;
    }
    stats.totalAdults += adultsInFamily;

    // Children
    const childrenCount = participant.selected_children?.length || 0;
    stats.totalChildren += childrenCount;
    
    // Group children by age - try participant first, fallback to profile
    if (childrenCount > 0) {
      if (participant.children_details?.length > 0) {
        participant.children_details.forEach(cd => {
          if (cd.age_range) {
            stats.childrenByAge[cd.age_range] = (stats.childrenByAge[cd.age_range] || 0) + 1;
          }
        });
      } else if (participant.selected_children?.length > 0 && userProfiles[participant.email]?.children_age_ranges?.length > 0) {
        participant.selected_children.forEach(childId => {
          const child = userProfiles[participant.email].children_age_ranges.find(c => c.id === childId);
          if (child?.age_range) {
            stats.childrenByAge[child.age_range] = (stats.childrenByAge[child.age_range] || 0) + 1;
          }
        });
      }
    }

    // Pets
    if (participant.family_members?.pets) stats.totalPets++;

    // Others
    if (participant.family_members?.other && participant.other_member_name) stats.totalOthers++;

    // Parent age range - try participant first, fallback to profile
    let parentAge = participant.parent_age_range || userProfiles[participant.email]?.parent_age_range;

    // Handle both string and object formats
    if (parentAge && typeof parentAge === 'object') {
      parentAge = parentAge.age_range || parentAge.value || parentAge.range || null;
    }
    
    if (parentAge && typeof parentAge === 'string') {
      stats.parentsByAge[parentAge] = (stats.parentsByAge[parentAge] || 0) + 1;
    }

    // Add spouse age if exists
    const spouseAge = userProfiles[participant.email]?.spouse_age_range;
    if (spouseAge && typeof spouseAge === 'string') {
      stats.parentsByAge[spouseAge] = (stats.parentsByAge[spouseAge] || 0) + 1;
    }
  });

  const totalPeople = stats.totalAdults + stats.totalChildren + stats.totalOthers;
  
  return (
    <Card className="border-2 border-emerald-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          {language === 'he' ? 'סטטיסטיקת משתתפים' : 'Participant Statistics'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6" dir="rtl">
        {/* Compact Stats */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 shadow-lg">
          <div className="grid grid-cols-5 gap-3 text-center text-white">
            <div>
              <p className="text-2xl font-bold">{totalPeople}</p>
              <p className="text-[10px] opacity-90">{language === 'he' ? 'סה״כ' : 'Total'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalAdults}</p>
              <p className="text-[10px] opacity-90">{language === 'he' ? 'מבוגרים' : 'Adults'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalChildren}</p>
              <p className="text-[10px] opacity-90">{language === 'he' ? 'ילדים' : 'Kids'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalPets}</p>
              <p className="text-[10px] opacity-90">{language === 'he' ? 'חיות' : 'Pets'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalOthers}</p>
              <p className="text-[10px] opacity-90">{language === 'he' ? 'נוספים' : 'Other'}</p>
            </div>
          </div>
        </div>

        {/* Children Age Distribution - Prominent */}
        {stats.totalChildren > 0 && Object.keys(stats.childrenByAge).length > 0 && (
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border-2 border-pink-200 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Baby className="w-5 h-5 text-pink-600" />
              <p className="font-bold text-pink-900 text-base">
                {language === 'he' ? 'התפלגות גילאי ילדים' : 'Children Age Distribution'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(stats.childrenByAge).map(([range, count]) => (
                <motion.div
                  key={range}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg p-3 text-center border-2 border-pink-300 shadow-sm"
                >
                  <p className="text-2xl font-bold text-pink-700">{count}</p>
                  <p className="text-xs text-pink-600 font-semibold mt-1">{range}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Parent Age Distribution - Always show */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border-2 border-indigo-200 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-indigo-600" />
            <p className="font-bold text-indigo-900 text-base">
              {language === 'he' ? 'התפלגות גילאי הורים' : 'Parent Age Distribution'}
            </p>
          </div>
          {Object.keys(stats.parentsByAge).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(stats.parentsByAge).map(([range, count]) => (
                <motion.div
                  key={range}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg p-3 text-center border-2 border-indigo-300 shadow-sm"
                >
                  <p className="text-2xl font-bold text-indigo-700">{count}</p>
                  <p className="text-xs text-indigo-600 font-semibold mt-1">{range}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 text-center border border-indigo-200">
              <p className="text-sm text-indigo-600">
                {language === 'he' 
                  ? 'אין נתונים זמינים - המשתתפים לא מילאו את תאריך הלידה בפרופיל שלהם'
                  : 'No data available - participants haven\'t filled their birth date in their profile'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}