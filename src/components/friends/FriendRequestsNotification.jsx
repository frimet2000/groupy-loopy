import React from 'react';
import { useLanguage } from '../LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { UserPlus, Check, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FriendRequestsNotification({ user, onAccept, onReject }) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
    enabled: !!user,
  });

  const friendRequests = user?.friend_requests || [];

  if (friendRequests.length === 0) return null;

  const currentRequest = friendRequests[0];
  const requester = users.find(u => u.email === currentRequest.email);
  if (!requester) return null;

  const name = (requester.first_name && requester.last_name) 
    ? `${requester.first_name} ${requester.last_name}` 
    : requester.full_name || requester.email || '';

  if (!name) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-20 left-0 right-0 z-[9999] px-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md pointer-events-auto"
      >
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-2xl">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white mb-1">
                  {language === 'he' ? 'בקשת חברות חדשה' : 'New Friend Request'}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/30 text-white text-sm">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-white/90 truncate">{name}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onAccept(currentRequest.email)}
                    className="bg-white text-blue-600 hover:bg-gray-100 flex-1"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {language === 'he' ? 'אשר' : 'Accept'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReject(currentRequest.email)}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Link to={createPageUrl('Profile') + '?email=' + currentRequest.email}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                {friendRequests.length > 1 && (
                  <p className="text-xs text-white/70 mt-2">
                    +{friendRequests.length - 1} {language === 'he' ? 'בקשות נוספות' : 'more requests'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}