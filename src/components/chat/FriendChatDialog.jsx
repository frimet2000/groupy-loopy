import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Send, Video, X, Loader2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../utils/dateFormatter';

export default function FriendChatDialog({ open, onOpenChange, friend, currentUser }) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const friendName = (friend?.first_name && friend?.last_name) 
    ? `${friend.first_name} ${friend.last_name}` 
    : friend?.full_name || friend?.email || '';

  if (!friend) return null;

  // Fetch or create chat
  const { data: chat } = useQuery({
    queryKey: ['friendChat', friend?.email, currentUser?.email],
    queryFn: async () => {
      if (!friend?.email || !currentUser?.email) return null;
      
      const participants = [currentUser.email, friend.email].sort();
      
      // Try to find existing chat
      const chats = await base44.entities.FriendChat.list();
      const existingChat = chats.find(c => {
        const chatParticipants = [...c.participants].sort();
        return JSON.stringify(chatParticipants) === JSON.stringify(participants);
      });

      if (existingChat) {
        return existingChat;
      }

      // Create new chat
      return base44.entities.FriendChat.create({
        participants,
        messages: []
      });
    },
    enabled: !!friend?.email && !!currentUser?.email && open,
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  // Mark messages as read when opening chat
  useEffect(() => {
    if (!chat || !currentUser?.email) return;
    
    const unreadMessages = chat.messages?.filter(m => 
      m.sender_email !== currentUser.email && !m.read
    );

    if (unreadMessages && unreadMessages.length > 0) {
      const updatedMessages = chat.messages.map(m => ({
        ...m,
        read: m.sender_email === currentUser.email ? m.read : true
      }));

      base44.entities.FriendChat.update(chat.id, { messages: updatedMessages })
        .catch(err => console.log('Error marking messages as read:', err));
    }
  }, [chat?.id, currentUser?.email, open]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      const userName = (currentUser.first_name && currentUser.last_name) 
        ? `${currentUser.first_name} ${currentUser.last_name}` 
        : currentUser.full_name;

      const newMessage = {
        id: Date.now().toString(),
        sender_email: currentUser.email,
        sender_name: userName,
        content,
        timestamp: new Date().toISOString(),
        read: false
      };

      const updatedMessages = [...(chat.messages || []), newMessage];
      await base44.entities.FriendChat.update(chat.id, { messages: updatedMessages });

      // Send notification
      try {
        await base44.functions.invoke('sendPushNotification', {
          recipient_email: friend.email,
          notification_type: 'new_messages',
          title: language === 'he' ? 'הודעה חדשה' : 'New Message',
          body: language === 'he' 
            ? `${userName}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
            : `${userName}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
        });
      } catch (error) {
        console.log('Notification error:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['friendChat']);
      setMessage('');
      setSending(false);
    },
    onError: () => {
      setSending(false);
      toast.error(language === 'he' ? 'שגיאה בשליחת ההודעה' : 'Error sending message');
    }
  });

  const startVideoCallMutation = useMutation({
    mutationFn: async () => {
      const userName = (currentUser.first_name && currentUser.last_name) 
        ? `${currentUser.first_name} ${currentUser.last_name}` 
        : currentUser.full_name;

      const videoCallInvite = {
        id: Date.now().toString(),
        creator_email: currentUser.email,
        creator_name: userName,
        created_at: new Date().toISOString(),
        active: true
      };

      const updatedInvites = [...(chat.video_call_invites || []), videoCallInvite];
      await base44.entities.FriendChat.update(chat.id, { video_call_invites: updatedInvites });

      // Send notification
      try {
        await base44.functions.invoke('sendPushNotification', {
          recipient_email: friend.email,
          notification_type: 'new_messages',
          title: language === 'he' ? 'שיחת וידאו נכנסת' : 'Incoming Video Call',
          body: language === 'he' 
            ? `${userName} מתקשר אליך`
            : `${userName} is calling you`
        });
      } catch (error) {
        console.log('Notification error:', error);
      }

      // Open video call window
      const roomId = [currentUser.email, friend.email].sort().join('_').replace(/[@.]/g, '_');
      window.open(`https://meet.jit.si/${roomId}`, '_blank');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['friendChat']);
      toast.success(language === 'he' ? 'שיחת וידאו התחילה' : 'Video call started');
    }
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    
    setSending(true);
    sendMessageMutation.mutate(message);
  };

  const handleVideoCall = () => {
    startVideoCallMutation.mutate();
  };

  // Check for active video call invites
  const activeVideoInvite = chat?.video_call_invites?.find(invite => 
    invite.active && invite.creator_email === friend.email
  );

  const handleJoinVideoCall = async () => {
    if (!activeVideoInvite) return;

    // Mark invite as inactive
    const updatedInvites = chat.video_call_invites.map(invite => ({
      ...invite,
      active: invite.id === activeVideoInvite.id ? false : invite.active
    }));
    await base44.entities.FriendChat.update(chat.id, { video_call_invites: updatedInvites });

    // Open video call
    const roomId = [currentUser.email, friend.email].sort().join('_').replace(/[@.]/g, '_');
    window.open(`https://meet.jit.si/${roomId}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                  {typeof friendName === 'string' && friendName ? friendName.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <DialogTitle>{friendName}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleVideoCall}
                disabled={startVideoCallMutation.isLoading}
                className="gap-2"
              >
                <Video className="w-4 h-4" />
                {language === 'he' ? 'שיחת וידאו' : 'Video Call'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Active Video Call Invite */}
        <AnimatePresence>
          {activeVideoInvite && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 mx-4 mt-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 animate-pulse" />
                  <div>
                    <p className="font-semibold">
                      {language === 'he' ? 'שיחת וידאו נכנסת' : 'Incoming Video Call'}
                    </p>
                    <p className="text-sm opacity-90">
                      {activeVideoInvite.creator_name}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleJoinVideoCall}
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  <Video className="w-4 h-4 mr-2" />
                  {language === 'he' ? 'הצטרף' : 'Join'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!chat ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : chat.messages?.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              {language === 'he' ? 'אין הודעות עדיין' : 'No messages yet'}
            </div>
          ) : (
            chat.messages.map((msg) => {
              const isMe = msg.sender_email === currentUser?.email;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                    <Card className={`p-3 ${
                      isMe 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-100 border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <div className={`flex items-center gap-2 mt-1 text-xs ${
                        isMe ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{formatDate(new Date(msg.timestamp), 'HH:mm', language)}</span>
                        {isMe && (
                          <span>{msg.read ? '✓✓' : '✓'}</span>
                        )}
                      </div>
                    </Card>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={language === 'he' ? 'כתוב הודעה...' : 'Type a message...'}
              disabled={sending || !chat}
              dir={language === 'he' ? 'rtl' : 'ltr'}
            />
            <Button 
              type="submit" 
              disabled={!message.trim() || sending || !chat}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}