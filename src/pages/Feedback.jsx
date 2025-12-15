import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Settings,
  ThumbsUp,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Filter,
  Plus
} from 'lucide-react';

export default function Feedback() {
  const { t, language, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showNewFeedback, setShowNewFeedback] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [newFeedback, setNewFeedback] = useState({
    type: 'suggestion',
    title: '',
    description: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        base44.auth.redirectToLogin(window.location.href);
      }
    };
    fetchUser();
  }, []);

  // Fetch all feedback
  const { data: allFeedback = [], isLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: () => base44.entities.Feedback.list('-created_date'),
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData) => {
      const userName = (user.first_name && user.last_name) 
        ? `${user.first_name} ${user.last_name}` 
        : user.full_name;

      return base44.entities.Feedback.create({
        user_email: user.email,
        user_name: userName,
        type: feedbackData.type,
        title: feedbackData.title,
        description: feedbackData.description,
        status: 'new',
        priority: 'medium',
        votes: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['feedback']);
      setShowNewFeedback(false);
      setNewFeedback({ type: 'suggestion', title: '', description: '' });
      toast.success(language === 'he' ? 'הפידבק נשלח בהצלחה!' : language === 'ru' ? 'Отзыв отправлен!' : language === 'es' ? '¡Comentario enviado!' : language === 'fr' ? 'Commentaire envoyé!' : language === 'de' ? 'Feedback gesendet!' : language === 'it' ? 'Feedback inviato!' : 'Feedback submitted successfully!');
    },
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (feedbackId) => {
      const feedback = allFeedback.find(f => f.id === feedbackId);
      const hasVoted = feedback.votes?.some(v => v.email === user.email);
      
      const newVotes = hasVoted
        ? feedback.votes.filter(v => v.email !== user.email)
        : [...(feedback.votes || []), { email: user.email, timestamp: new Date().toISOString() }];

      return base44.entities.Feedback.update(feedbackId, { votes: newVotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['feedback']);
    },
  });

  // Update status mutation (admin only)
  const updateStatusMutation = useMutation({
    mutationFn: ({ feedbackId, status, priority, adminResponse }) => {
      return base44.entities.Feedback.update(feedbackId, {
        status,
        priority,
        admin_response: adminResponse,
        admin_email: user.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['feedback']);
      setSelectedFeedback(null);
      toast.success(language === 'he' ? 'הפידבק עודכן' : language === 'ru' ? 'Отзыв обновлен' : language === 'es' ? 'Comentario actualizado' : language === 'fr' ? 'Commentaire mis à jour' : language === 'de' ? 'Feedback aktualisiert' : language === 'it' ? 'Feedback aggiornato' : 'Feedback updated');
    },
  });

  // Filter and sort feedback
  const filteredFeedback = allFeedback
    .filter(f => {
      if (filter === 'all') return true;
      if (filter === 'my') return f.user_email === user?.email;
      return f.type === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_date) - new Date(a.created_date);
      if (sortBy === 'oldest') return new Date(a.created_date) - new Date(b.created_date);
      if (sortBy === 'votes') return (b.votes?.length || 0) - (a.votes?.length || 0);
      return 0;
    });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature_request': return <Lightbulb className="w-4 h-4" />;
      case 'suggestion': return <MessageSquare className="w-4 h-4" />;
      case 'improvement': return <TrendingUp className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-700 border-red-200';
      case 'feature_request': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'suggestion': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'improvement': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-3 h-3" />;
      case 'in_progress': return <Clock className="w-3 h-3" />;
      case 'resolved': return <CheckCircle2 className="w-3 h-3" />;
      default: return <CheckCircle2 className="w-3 h-3" />;
    }
  };

  const typeLabels = {
    bug: language === 'he' ? 'באג' : language === 'ru' ? 'Ошибка' : language === 'es' ? 'Error' : language === 'fr' ? 'Erreur' : language === 'de' ? 'Fehler' : language === 'it' ? 'Bug' : 'Bug',
    feature_request: language === 'he' ? 'בקשת פיצ׳ר' : language === 'ru' ? 'Запрос функции' : language === 'es' ? 'Solicitud de función' : language === 'fr' ? 'Demande de fonctionnalité' : language === 'de' ? 'Feature-Anfrage' : language === 'it' ? 'Richiesta funzionalità' : 'Feature Request',
    suggestion: language === 'he' ? 'הצעה' : language === 'ru' ? 'Предложение' : language === 'es' ? 'Sugerencia' : language === 'fr' ? 'Suggestion' : language === 'de' ? 'Vorschlag' : language === 'it' ? 'Suggerimento' : 'Suggestion',
    improvement: language === 'he' ? 'שיפור' : language === 'ru' ? 'Улучшение' : language === 'es' ? 'Mejora' : language === 'fr' ? 'Amélioration' : language === 'de' ? 'Verbesserung' : language === 'it' ? 'Miglioramento' : 'Improvement',
    other: language === 'he' ? 'אחר' : language === 'ru' ? 'Другое' : language === 'es' ? 'Otro' : language === 'fr' ? 'Autre' : language === 'de' ? 'Andere' : language === 'it' ? 'Altro' : 'Other'
  };

  const statusLabels = {
    new: language === 'he' ? 'חדש' : language === 'ru' ? 'Новый' : language === 'es' ? 'Nuevo' : language === 'fr' ? 'Nouveau' : language === 'de' ? 'Neu' : language === 'it' ? 'Nuovo' : 'New',
    in_progress: language === 'he' ? 'בטיפול' : language === 'ru' ? 'В работе' : language === 'es' ? 'En progreso' : language === 'fr' ? 'En cours' : language === 'de' ? 'In Bearbeitung' : language === 'it' ? 'In corso' : 'In Progress',
    resolved: language === 'he' ? 'טופל' : language === 'ru' ? 'Решено' : language === 'es' ? 'Resuelto' : language === 'fr' ? 'Résolu' : language === 'de' ? 'Gelöst' : language === 'it' ? 'Risolto' : 'Resolved',
    closed: language === 'he' ? 'סגור' : language === 'ru' ? 'Закрыто' : language === 'es' ? 'Cerrado' : language === 'fr' ? 'Fermé' : language === 'de' ? 'Geschlossen' : language === 'it' ? 'Chiuso' : 'Closed'
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-emerald-600" />
            {language === 'he' ? 'משוב ובקשות' : language === 'ru' ? 'Отзывы и запросы' : language === 'es' ? 'Comentarios y solicitudes' : language === 'fr' ? 'Commentaires et demandes' : language === 'de' ? 'Feedback & Anfragen' : language === 'it' ? 'Feedback e richieste' : 'Feedback & Requests'}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === 'he' 
              ? 'שתפו אותנו ברעיונות, דווחו על באגים והציעו שיפורים'
              : language === 'ru'
              ? 'Поделитесь идеями, сообщите об ошибках и предложите улучшения'
              : language === 'es'
              ? 'Comparte ideas, reporta errores y sugiere mejoras'
              : language === 'fr'
              ? 'Partagez des idées, signalez des bugs et suggérez des améliorations'
              : language === 'de'
              ? 'Teilen Sie Ideen, melden Sie Fehler und schlagen Sie Verbesserungen vor'
              : language === 'it'
              ? 'Condividi idee, segnala bug e suggerisci miglioramenti'
              : 'Share ideas, report bugs, and suggest improvements'}
          </p>
        </div>
        <Button
          onClick={() => setShowNewFeedback(true)}
          className="bg-emerald-600 hover:bg-emerald-700 gap-2"
        >
          <Plus className="w-5 h-5" />
          {language === 'he' ? 'שלח משוב' : language === 'ru' ? 'Отправить отзыв' : language === 'es' ? 'Enviar comentario' : language === 'fr' ? 'Envoyer commentaire' : language === 'de' ? 'Feedback senden' : language === 'it' ? 'Invia feedback' : 'Send Feedback'}
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'he' ? 'הכל' : language === 'ru' ? 'Все' : language === 'es' ? 'Todo' : language === 'fr' ? 'Tout' : language === 'de' ? 'Alle' : language === 'it' ? 'Tutto' : 'All'}</SelectItem>
                  <SelectItem value="my">{language === 'he' ? 'שלי' : language === 'ru' ? 'Мои' : language === 'es' ? 'Mis comentarios' : language === 'fr' ? 'Mes commentaires' : language === 'de' ? 'Mein Feedback' : language === 'it' ? 'I miei feedback' : 'My Feedback'}</SelectItem>
                  <SelectItem value="bug">{typeLabels.bug}</SelectItem>
                  <SelectItem value="feature_request">{typeLabels.feature_request}</SelectItem>
                  <SelectItem value="suggestion">{typeLabels.suggestion}</SelectItem>
                  <SelectItem value="improvement">{typeLabels.improvement}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{language === 'he' ? 'החדשים ביותר' : language === 'ru' ? 'Новейшие' : language === 'es' ? 'Más recientes' : language === 'fr' ? 'Plus récent' : language === 'de' ? 'Neueste' : language === 'it' ? 'Più recenti' : 'Newest'}</SelectItem>
                <SelectItem value="oldest">{language === 'he' ? 'הישנים ביותר' : language === 'ru' ? 'Старейшие' : language === 'es' ? 'Más antiguos' : language === 'fr' ? 'Plus ancien' : language === 'de' ? 'Älteste' : language === 'it' ? 'Più vecchi' : 'Oldest'}</SelectItem>
                <SelectItem value="votes">{language === 'he' ? 'הכי מצביעים' : language === 'ru' ? 'Больше голосов' : language === 'es' ? 'Más votados' : language === 'fr' ? 'Plus voté' : language === 'de' ? 'Meist gewählt' : language === 'it' ? 'Più votati' : 'Most Voted'}</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-gray-600">
              {filteredFeedback.length} {language === 'he' ? 'פריטים' : language === 'ru' ? 'элементов' : language === 'es' ? 'elementos' : language === 'fr' ? 'éléments' : language === 'de' ? 'Elemente' : language === 'it' ? 'elementi' : 'items'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredFeedback.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              {language === 'he' ? 'אין פידבקים עדיין' : language === 'ru' ? 'Отзывов пока нет' : language === 'es' ? 'Aún no hay comentarios' : language === 'fr' ? 'Pas encore de commentaires' : language === 'de' ? 'Noch kein Feedback' : language === 'it' ? 'Nessun feedback ancora' : 'No feedback yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredFeedback.map((feedback) => {
              const hasVoted = feedback.votes?.some(v => v.email === user.email);
              const voteCount = feedback.votes?.length || 0;

              return (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedFeedback(feedback)}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Vote Button */}
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              voteMutation.mutate(feedback.id);
                            }}
                            className={`flex flex-col h-auto py-2 ${hasVoted ? 'text-emerald-600' : 'text-gray-400'}`}
                          >
                            <ThumbsUp className={`w-5 h-5 ${hasVoted ? 'fill-emerald-600' : ''}`} />
                            <span className="text-xs font-semibold mt-1">{voteCount}</span>
                          </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge className={`${getTypeColor(feedback.type)} border`}>
                                  <span className="flex items-center gap-1">
                                    {getTypeIcon(feedback.type)}
                                    {typeLabels[feedback.type]}
                                  </span>
                                </Badge>
                                <Badge className={getStatusColor(feedback.status)}>
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(feedback.status)}
                                    {statusLabels[feedback.status]}
                                  </span>
                                </Badge>
                                {feedback.priority === 'high' && (
                                  <Badge className="bg-orange-100 text-orange-700">
                                   {language === 'he' ? 'עדיפות גבוהה' : language === 'ru' ? 'Высокий приоритет' : language === 'es' ? 'Alta prioridad' : language === 'fr' ? 'Haute priorité' : language === 'de' ? 'Hohe Priorität' : language === 'it' ? 'Alta priorità' : 'High Priority'}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{feedback.title}</h3>
                              <p className="text-gray-600 text-sm line-clamp-2">{feedback.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                            <span>{feedback.user_name}</span>
                            <span>•</span>
                            <span>{new Date(feedback.created_date).toLocaleDateString(language === 'he' ? 'he-IL' : language === 'ru' ? 'ru-RU' : 'en-US')}</span>
                            {feedback.admin_response && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-600 font-medium">
                                  {language === 'he' ? 'יש תגובה' : language === 'ru' ? 'Есть ответ' : language === 'es' ? 'Tiene respuesta' : language === 'fr' ? 'A une réponse' : language === 'de' ? 'Hat Antwort' : language === 'it' ? 'Ha risposta' : 'Has Response'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* New Feedback Dialog */}
      <Dialog open={showNewFeedback} onOpenChange={setShowNewFeedback}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              {language === 'he' ? 'שליחת משוב' : language === 'ru' ? 'Отправить отзыв' : language === 'es' ? 'Enviar comentario' : language === 'fr' ? 'Envoyer commentaire' : language === 'de' ? 'Feedback senden' : language === 'it' ? 'Invia feedback' : 'Send Feedback'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'he' ? 'סוג' : language === 'ru' ? 'Тип' : language === 'es' ? 'Tipo' : language === 'fr' ? 'Type' : language === 'de' ? 'Typ' : language === 'it' ? 'Tipo' : 'Type'}
              </label>
              <Select value={newFeedback.type} onValueChange={(value) => setNewFeedback({ ...newFeedback, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">{typeLabels.bug}</SelectItem>
                  <SelectItem value="feature_request">{typeLabels.feature_request}</SelectItem>
                  <SelectItem value="suggestion">{typeLabels.suggestion}</SelectItem>
                  <SelectItem value="improvement">{typeLabels.improvement}</SelectItem>
                  <SelectItem value="other">{typeLabels.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'he' ? 'כותרת' : language === 'ru' ? 'Заголовок' : language === 'es' ? 'Título' : language === 'fr' ? 'Titre' : language === 'de' ? 'Titel' : language === 'it' ? 'Titolo' : 'Title'}
              </label>
              <Input
                value={newFeedback.title}
                onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
                placeholder={language === 'he' ? 'תאר בקצרה...' : language === 'ru' ? 'Кратко опишите...' : language === 'es' ? 'Descripción breve...' : language === 'fr' ? 'Brève description...' : language === 'de' ? 'Kurze Beschreibung...' : language === 'it' ? 'Breve descrizione...' : 'Brief description...'}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'he' ? 'פרטים' : language === 'ru' ? 'Детали' : language === 'es' ? 'Detalles' : language === 'fr' ? 'Détails' : language === 'de' ? 'Details' : language === 'it' ? 'Dettagli' : 'Details'}
              </label>
              <Textarea
                value={newFeedback.description}
                onChange={(e) => setNewFeedback({ ...newFeedback, description: e.target.value })}
                placeholder={language === 'he' ? 'פרט את המשוב שלך...' : language === 'ru' ? 'Подробно опишите...' : language === 'es' ? 'Descripción detallada...' : language === 'fr' ? 'Description détaillée...' : language === 'de' ? 'Detaillierte Beschreibung...' : language === 'it' ? 'Descrizione dettagliata...' : 'Detailed description...'}
                rows={6}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFeedback(false)}>
              {language === 'he' ? 'ביטול' : language === 'ru' ? 'Отмена' : language === 'es' ? 'Cancelar' : language === 'fr' ? 'Annuler' : language === 'de' ? 'Abbrechen' : language === 'it' ? 'Annulla' : 'Cancel'}
            </Button>
            <Button
              onClick={() => submitFeedbackMutation.mutate(newFeedback)}
              disabled={!newFeedback.title || !newFeedback.description || submitFeedbackMutation.isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              {submitFeedbackMutation.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {language === 'he' ? 'שלח' : language === 'ru' ? 'Отправить' : language === 'es' ? 'Enviar' : language === 'fr' ? 'Envoyer' : language === 'de' ? 'Senden' : language === 'it' ? 'Invia' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Feedback Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${getTypeColor(selectedFeedback.type)} border`}>
                    {typeLabels[selectedFeedback.type]}
                  </Badge>
                  <Badge className={getStatusColor(selectedFeedback.status)}>
                    {statusLabels[selectedFeedback.status]}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedFeedback.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedFeedback.description}</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{selectedFeedback.user_name}</span>
                    <span>{new Date(selectedFeedback.created_date).toLocaleDateString(language === 'he' ? 'he-IL' : language === 'ru' ? 'ru-RU' : 'en-US')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{selectedFeedback.votes?.length || 0} {language === 'he' ? 'הצבעות' : language === 'ru' ? 'голосов' : language === 'es' ? 'votos' : language === 'fr' ? 'votes' : language === 'de' ? 'Stimmen' : language === 'it' ? 'voti' : 'votes'}</span>
                  </div>
                </div>

                {selectedFeedback.admin_response && (
                  <>
                    <Separator />
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold text-emerald-900">
                          {language === 'he' ? 'תגובת הצוות' : language === 'ru' ? 'Ответ команды' : language === 'es' ? 'Respuesta del equipo' : language === 'fr' ? 'Réponse de l\'équipe' : language === 'de' ? 'Team-Antwort' : language === 'it' ? 'Risposta del team' : 'Team Response'}
                        </span>
                      </div>
                      <p className="text-gray-700">{selectedFeedback.admin_response}</p>
                    </div>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-semibold">
                        {language === 'he' ? 'ניהול (אדמין)' : language === 'ru' ? 'Управление (админ)' : language === 'es' ? 'Controles de administrador' : language === 'fr' ? 'Contrôles admin' : language === 'de' ? 'Admin-Kontrollen' : language === 'it' ? 'Controlli admin' : 'Admin Controls'}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {language === 'he' ? 'סטטוס' : language === 'ru' ? 'Статус' : language === 'es' ? 'Estado' : language === 'fr' ? 'Statut' : language === 'de' ? 'Status' : language === 'it' ? 'Stato' : 'Status'}
                          </label>
                          <Select
                            value={selectedFeedback.status}
                            onValueChange={(value) => setSelectedFeedback({ ...selectedFeedback, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(statusLabels).map(key => (
                                <SelectItem key={key} value={key}>{statusLabels[key]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {language === 'he' ? 'עדיפות' : language === 'ru' ? 'Приоритет' : language === 'es' ? 'Prioridad' : language === 'fr' ? 'Priorité' : language === 'de' ? 'Priorität' : language === 'it' ? 'Priorità' : 'Priority'}
                          </label>
                          <Select
                            value={selectedFeedback.priority}
                            onValueChange={(value) => setSelectedFeedback({ ...selectedFeedback, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">{language === 'he' ? 'נמוכה' : language === 'ru' ? 'Низкий' : language === 'es' ? 'Baja' : language === 'fr' ? 'Faible' : language === 'de' ? 'Niedrig' : language === 'it' ? 'Bassa' : 'Low'}</SelectItem>
                              <SelectItem value="medium">{language === 'he' ? 'בינונית' : language === 'ru' ? 'Средний' : language === 'es' ? 'Media' : language === 'fr' ? 'Moyen' : language === 'de' ? 'Mittel' : language === 'it' ? 'Media' : 'Medium'}</SelectItem>
                              <SelectItem value="high">{language === 'he' ? 'גבוהה' : language === 'ru' ? 'Высокий' : language === 'es' ? 'Alta' : language === 'fr' ? 'Haute' : language === 'de' ? 'Hoch' : language === 'it' ? 'Alta' : 'High'}</SelectItem>
                              <SelectItem value="critical">{language === 'he' ? 'קריטית' : language === 'ru' ? 'Критический' : language === 'es' ? 'Crítica' : language === 'fr' ? 'Critique' : language === 'de' ? 'Kritisch' : language === 'it' ? 'Critica' : 'Critical'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {language === 'he' ? 'תגובה' : language === 'ru' ? 'Ответ' : language === 'es' ? 'Respuesta' : language === 'fr' ? 'Réponse' : language === 'de' ? 'Antwort' : language === 'it' ? 'Risposta' : 'Response'}
                        </label>
                        <Textarea
                          value={selectedFeedback.admin_response || ''}
                          onChange={(e) => setSelectedFeedback({ ...selectedFeedback, admin_response: e.target.value })}
                          placeholder={language === 'he' ? 'כתוב תגובה...' : language === 'ru' ? 'Напишите ответ...' : language === 'es' ? 'Escriba una respuesta...' : language === 'fr' ? 'Écrivez une réponse...' : language === 'de' ? 'Schreiben Sie eine Antwort...' : language === 'it' ? 'Scrivi una risposta...' : 'Write a response...'}
                          rows={4}
                        />
                      </div>
                      <Button
                        onClick={() => updateStatusMutation.mutate({
                          feedbackId: selectedFeedback.id,
                          status: selectedFeedback.status,
                          priority: selectedFeedback.priority,
                          adminResponse: selectedFeedback.admin_response
                        })}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        {language === 'he' ? 'שמור שינויים' : language === 'ru' ? 'Сохранить изменения' : language === 'es' ? 'Guardar cambios' : language === 'fr' ? 'Enregistrer les modifications' : language === 'de' ? 'Änderungen speichern' : language === 'it' ? 'Salva modifiche' : 'Save Changes'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}