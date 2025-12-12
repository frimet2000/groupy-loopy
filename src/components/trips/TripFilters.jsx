import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';

const regions = ['north', 'center', 'south', 'jerusalem', 'negev', 'eilat'];
const difficulties = ['easy', 'moderate', 'challenging', 'hard'];
const durations = ['hours', 'half_day', 'full_day', 'overnight', 'multi_day'];
const trailTypes = ['water', 'full_shade', 'partial_shade', 'desert', 'forest', 'coastal', 'mountain', 'historical', 'urban'];
const interests = ['nature', 'history', 'photography', 'birdwatching', 'archaeology', 'geology', 'botany', 'extreme_sports', 'family_friendly', 'romantic'];

export default function TripFilters({ filters, setFilters, onSearch }) {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange('search', searchTerm);
  };

  const activeFiltersCount = Object.keys(filters).filter(k => 
    filters[k] && (Array.isArray(filters[k]) ? filters[k].length > 0 : true)
  ).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
          <Input
            placeholder={t('search') + '...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 text-base bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500`}
          />
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="h-12 px-4 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">{t('filter')}</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-emerald-600 hover:bg-emerald-600">{activeFiltersCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent side={isRTL ? 'right' : 'left'} className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center justify-between">
                {t('filter')}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  {t('clear')}
                </Button>
              </SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6">
              {/* Region */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t('region')}</Label>
                <Select 
                  value={filters.region || ''} 
                  onValueChange={(v) => handleFilterChange('region', v === 'all' ? '' : v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t('allRegions')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allRegions')}</SelectItem>
                    {regions.map(r => (
                      <SelectItem key={r} value={r}>{t(r)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t('difficulty')}</Label>
                <Select 
                  value={filters.difficulty || ''} 
                  onValueChange={(v) => handleFilterChange('difficulty', v === 'all' ? '' : v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t('allDifficulties')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allDifficulties')}</SelectItem>
                    {difficulties.map(d => (
                      <SelectItem key={d} value={d}>{t(d)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t('duration')}</Label>
                <Select 
                  value={filters.duration_type || ''} 
                  onValueChange={(v) => handleFilterChange('duration_type', v === 'all' ? '' : v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t('allDurations')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allDurations')}</SelectItem>
                    {durations.map(d => (
                      <SelectItem key={d} value={d}>{t(d)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trail Types */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">{t('trailType')}</Label>
                <div className="flex flex-wrap gap-2">
                  {trailTypes.map(type => (
                    <Badge
                      key={type}
                      variant={filters.trail_type?.includes(type) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        filters.trail_type?.includes(type) 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'hover:border-emerald-500 hover:text-emerald-600'
                      }`}
                      onClick={() => {
                        const current = filters.trail_type || [];
                        const updated = current.includes(type) 
                          ? current.filter(t => t !== type)
                          : [...current, type];
                        handleFilterChange('trail_type', updated);
                      }}
                    >
                      {t(type)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">{t('interests')}</Label>
                <div className="flex flex-wrap gap-2">
                  {interests.map(interest => (
                    <Badge
                      key={interest}
                      variant={filters.interests?.includes(interest) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        filters.interests?.includes(interest) 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'hover:border-blue-500 hover:text-blue-600'
                      }`}
                      onClick={() => {
                        const current = filters.interests || [];
                        const updated = current.includes(interest) 
                          ? current.filter(i => i !== interest)
                          : [...current, interest];
                        handleFilterChange('interests', updated);
                      }}
                    >
                      {t(interest)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Boolean Filters */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="pets"
                    checked={filters.pets_allowed || false}
                    onCheckedChange={(checked) => handleFilterChange('pets_allowed', checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                  <Label htmlFor="pets" className="cursor-pointer">{t('petsAllowed')}</Label>
                </div>
                
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="camping"
                    checked={filters.camping_available || false}
                    onCheckedChange={(checked) => handleFilterChange('camping_available', checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                  <Label htmlFor="camping" className="cursor-pointer">{t('campingAvailable')}</Label>
                </div>
              </div>

              <Button 
                onClick={() => setIsOpen(false)} 
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 mt-4"
              >
                {t('apply')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </form>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.region && (
            <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1">
              {t(filters.region)}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleFilterChange('region', '')} 
              />
            </Badge>
          )}
          {filters.difficulty && (
            <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1">
              {t(filters.difficulty)}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleFilterChange('difficulty', '')} 
              />
            </Badge>
          )}
          {filters.trail_type?.map(type => (
            <Badge key={type} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
              {t(type)}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleFilterChange('trail_type', filters.trail_type.filter(t => t !== type))} 
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}