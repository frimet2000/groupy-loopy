import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Search, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GroupChatManager({ trip, onGroupCreated }) {
  const { language } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const translations = {
    he: {
      createGroup: 'צור קבוצת צ׳אט',
      groupName: 'שם הקבוצה',
      searchMembers: 'חפש משתתפים...',
      selectMembers: 'בחר חברים לקבוצה',
      create: 'צור קבוצה',
      cancel: 'ביטול',
      creating: 'יוצר...',
      noParticipants: 'אין משתתפים',
      selectAtLeast: 'בחר לפחות 2 משתתפים',
      groupCreated: 'קבוצה נוצרה בהצלחה'
    },
    en: {
      createGroup: 'Create Chat Group',
      groupName: 'Group Name',
      searchMembers: 'Search participants...',
      selectMembers: 'Select group members',
      create: 'Create Group',
      cancel: 'Cancel',
      creating: 'Creating...',
      noParticipants: 'No participants',
      selectAtLeast: 'Select at least 2 participants',
      groupCreated: 'Group created successfully'
    },
    ru: {
      createGroup: 'Создать группу',
      groupName: 'Название группы',
      searchMembers: 'Поиск участников...',
      selectMembers: 'Выберите участников',
      create: 'Создать',
      cancel: 'Отмена',
      creating: 'Создание...',
      noParticipants: 'Нет участников',
      selectAtLeast: 'Выберите минимум 2 участника',
      groupCreated: 'Группа создана'
    },
    es: {
      createGroup: 'Crear grupo',
      groupName: 'Nombre del grupo',
      searchMembers: 'Buscar participantes...',
      selectMembers: 'Seleccionar miembros',
      create: 'Crear',
      cancel: 'Cancelar',
      creating: 'Creando...',
      noParticipants: 'Sin participantes',
      selectAtLeast: 'Seleccione al menos 2 participantes',
      groupCreated: 'Grupo creado'
    },
    fr: {
      createGroup: 'Créer un groupe',
      groupName: 'Nom du groupe',
      searchMembers: 'Rechercher participants...',
      selectMembers: 'Sélectionner membres',
      create: 'Créer',
      cancel: 'Annuler',
      creating: 'Création...',
      noParticipants: 'Aucun participant',
      selectAtLeast: 'Sélectionnez au moins 2 participants',
      groupCreated: 'Groupe créé'
    },
    de: {
      createGroup: 'Gruppe erstellen',
      groupName: 'Gruppenname',
      searchMembers: 'Teilnehmer suchen...',
      selectMembers: 'Mitglieder auswählen',
      create: 'Erstellen',
      cancel: 'Abbrechen',
      creating: 'Erstellt...',
      noParticipants: 'Keine Teilnehmer',
      selectAtLeast: 'Mindestens 2 Teilnehmer auswählen',
      groupCreated: 'Gruppe erstellt'
    },
    it: {
      createGroup: 'Crea gruppo',
      groupName: 'Nome gruppo',
      searchMembers: 'Cerca partecipanti...',
      selectMembers: 'Seleziona membri',
      create: 'Crea',
      cancel: 'Annulla',
      creating: 'Creazione...',
      noParticipants: 'Nessun partecipante',
      selectAtLeast: 'Seleziona almeno 2 partecipanti',
      groupCreated: 'Gruppo creato'
    }
  };

  const t = translations[language] || translations.en;

  const participants = trip?.participants || [];
  
  const filteredParticipants = participants.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query) ||
      p.phone?.toLowerCase().includes(query)
    );
  });

  const toggleMember = (email) => {
    setSelectedMembers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleCreateGroup = async () => {
    if (selectedMembers.length < 2) {
      toast.error(t.selectAtLeast);
      return;
    }

    if (!groupName.trim()) {
      toast.error(language === 'he' ? 'הזן שם קבוצה' : 'Enter group name');
      return;
    }

    setIsCreating(true);
    try {
      const group = {
        id: Date.now().toString(),
        name: groupName,
        members: selectedMembers,
        created_at: new Date().toISOString()
      };

      onGroupCreated(group);
      toast.success(t.groupCreated);
      setShowDialog(false);
      setGroupName('');
      setSelectedMembers([]);
      setSearchQuery('');
    } catch (error) {
      toast.error(error.message);
    }
    setIsCreating(false);
  };

  return (
    <>
      <Button onClick={() => setShowDialog(true)} variant="outline" size="sm">
        <Users className="w-4 h-4 mr-2" />
        {t.createGroup}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.createGroup}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder={t.groupName}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t.searchMembers}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <p className="text-sm font-semibold">{t.selectMembers}</p>
              {filteredParticipants.length === 0 ? (
                <p className="text-sm text-gray-500">{t.noParticipants}</p>
              ) : (
                filteredParticipants.map((p) => (
                  <div
                    key={p.email}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleMember(p.email)}
                  >
                    <Checkbox checked={selectedMembers.includes(p.email)} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-500 truncate">{p.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                {t.cancel}
              </Button>
              <Button onClick={handleCreateGroup} disabled={isCreating} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                {isCreating ? t.creating : t.create}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}