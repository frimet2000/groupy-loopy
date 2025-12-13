import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Plus, Check, List as ListIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function AddToListButton({ tripId }) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const { data: lists = [] } = useQuery({
    queryKey: ['tripLists', user?.email],
    queryFn: () => base44.entities.TripList.filter({ user_email: user.email }),
    enabled: !!user?.email,
  });

  const updateMutation = useMutation({
    mutationFn: ({ listId, tripIds }) => 
      base44.entities.TripList.update(listId, { trip_ids: tripIds }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tripLists']);
      toast.success(language === 'he' ? 'נוסף לרשימה' : 'Added to list');
      setOpen(false);
    },
  });

  const handleToggleTrip = (list) => {
    const isInList = list.trip_ids?.includes(tripId);
    const updatedTripIds = isInList
      ? list.trip_ids.filter(id => id !== tripId)
      : [...(list.trip_ids || []), tripId];
    
    updateMutation.mutate({ listId: list.id, tripIds: updatedTripIds });
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ListIcon className="w-4 h-4" />
          {language === 'he' ? 'הוסף לרשימה' : 'Add to List'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder={language === 'he' ? 'חפש רשימה...' : 'Search list...'} />
          <CommandEmpty>
            {language === 'he' ? 'לא נמצאו רשימות' : 'No lists found'}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {lists.map(list => {
              const isInList = list.trip_ids?.includes(tripId);
              return (
                <CommandItem
                  key={list.id}
                  onSelect={() => handleToggleTrip(list)}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {isInList && <Check className="w-4 h-4 text-emerald-600" />}
                    <span>{list.name}</span>
                  </div>
                  {list.is_public ? (
                    <Unlock className="w-3 h-3 text-gray-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}