// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Heart, MapPin, User, Check, X, GripVertical, Clock, Map, List, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function MemorialSchedule({ trip, participants, onUpdateParticipant, onRefresh }) {
  // Local state for memorials to handle drag and drop immediately
  const [memorials, setMemorials] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentDayNumber, setCurrentDayNumber] = useState(1); // Determine current day based on date

  useEffect(() => {
    // Extract memorials from participants
    const extractedMemorials = participants
      .filter(p => p.memorial)
      .map(p => ({
        ...p.memorial,
        participantId: p.id,
        participantName: p.name,
        // Default status if not present
        status: p.memorial.status || 'pending', // pending, approved, rejected
        assigned_day: p.memorial.assigned_day || null
      }));
    setMemorials(extractedMemorials);
  }, [participants]);

  // Determine current day of the trip
  useEffect(() => {
    if (trip?.date) {
      const startDate = new Date(trip.date);
      const today = new Date();
      // Calculate difference in days
      const diffTime = Math.abs(today - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (today >= startDate && diffDays <= (trip.duration_value || 5)) {
        setCurrentDayNumber(diffDays);
      }
    }
  }, [trip]);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      handleManualRefresh();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [onRefresh]);

  const handleManualRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        toast.success('הנתונים רועננו בהצלחה');
      } catch (error) {
        toast.error('שגיאה ברענון הנתונים');
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updatedMemorials = [...memorials];
    const movedMemorialIndex = updatedMemorials.findIndex(m => m.participantId.toString() === draggableId);
    
    if (movedMemorialIndex === -1) return;

    const movedMemorial = updatedMemorials[movedMemorialIndex];

    // Identify target container
    if (destination.droppableId === 'approved-bank') {
      movedMemorial.assigned_day = null;
    } else if (destination.droppableId.startsWith('day-')) {
      const dayNum = parseInt(destination.droppableId.replace('day-', ''));
      movedMemorial.assigned_day = dayNum;
    }

    setMemorials(updatedMemorials);
    
    // Propagate update to parent/backend
    onUpdateParticipant(movedMemorial.participantId, {
      memorial: {
        ...movedMemorial,
        assigned_day: movedMemorial.assigned_day
      }
    });
    
    toast.success('השיבוץ עודכן בהצלחה');
  };

  const handleApprove = (memorial) => {
    const updatedMemorials = memorials.map(m => 
      m.participantId === memorial.participantId 
        ? { ...m, status: 'approved' } 
        : m
    );
    setMemorials(updatedMemorials);
    
    onUpdateParticipant(memorial.participantId, {
      memorial: {
        ...memorial,
        status: 'approved'
      }
    });
    
    toast.success(`ההנצחה של ${memorial.fallen_name} אושרה`);
  };

  const handleReject = (memorial) => {
    const updatedMemorials = memorials.map(m => 
        m.participantId === memorial.participantId 
          ? { ...m, status: 'rejected', assigned_day: null } 
          : m
      );
      setMemorials(updatedMemorials);
      
      onUpdateParticipant(memorial.participantId, {
        memorial: {
          ...memorial,
          status: 'rejected',
          assigned_day: null
        }
      });
      toast.info(`ההנצחה של ${memorial.fallen_name} נדחתה`);
  };

  // Group memorials
  const pendingMemorials = memorials.filter(m => m.status === 'pending');
  const approvedUnassigned = memorials.filter(m => m.status === 'approved' && !m.assigned_day);
  
  // Generate days array based on trip duration and merge with trek_days info
  const daysCount = trip?.duration_value || 5;
  const trekDaysInfo = trip?.trek_days || [];
  
  const tripDays = Array.from({ length: daysCount }, (_, i) => {
    const dayNum = i + 1;
    const trekDay = trekDaysInfo.find(d => d.day_number === dayNum) || {};
    
    // Calculate date
    const tripStartDate = new Date(trip?.date || new Date());
    const currentDayDate = new Date(tripStartDate);
    currentDayDate.setDate(tripStartDate.getDate() + (dayNum - 1));
    
    return {
      dayNum,
      date: currentDayDate,
      destinations: trekDay.destinations || [],
      attractions: trekDay.attractions || [], // Should be array of { type, count/name }
      startTime: trekDay.start_time || '08:00',
      endTime: trekDay.end_time || '17:00',
      isCurrent: dayNum === currentDayDate
    };
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-8 p-4 relative">
        
        {/* Refresh Button */}
        <div className="absolute top-0 left-4 z-10">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="bg-white/80 backdrop-blur"
            >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'מרענן...' : 'רענן נתונים'}
            </Button>
        </div>

        {/* Pending Requests Section */}
        {pendingMemorials.length > 0 && (
          <Card className="border-orange-200 bg-orange-50/30">
            <CardHeader>
              <CardTitle className="text-orange-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                בקשות הנצחה ממתינות לאישור ({pendingMemorials.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingMemorials.map((memorial) => (
                  <Card key={memorial.participantId} className="bg-white border-orange-100 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{memorial.fallen_name}</h4>
                          <p className="text-xs text-gray-500">
                            מבקש/ת: {memorial.participantName}
                          </p>
                        </div>
                        <Heart className="w-4 h-4 text-orange-400" />
                      </div>
                      
                      {memorial.story && (
                        <p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
                          "{memorial.story}"
                        </p>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(memorial)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          אשר
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                          onClick={() => handleReject(memorial)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          דחה
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Approved Bank (Draggable Source) - Sticky Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-purple-600" />
                מאגר הנצחות מאושרות
                <Badge variant="secondary" className="ml-auto">{approvedUnassigned.length}</Badge>
              </h3>
              
              <Droppable droppableId="approved-bank">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 min-h-[100px] rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-purple-50' : 'bg-gray-50/50'
                    } p-2`}
                  >
                    {approvedUnassigned.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                        אין הנצחות זמינות לשיבוץ
                      </div>
                    )}
                    
                    {approvedUnassigned.map((memorial, index) => (
                      <Draggable 
                        key={memorial.participantId.toString()} 
                        draggableId={memorial.participantId.toString()} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              bg-white p-3 rounded-lg border shadow-sm group hover:border-purple-300 transition-all cursor-grab active:cursor-grabbing
                              ${snapshot.isDragging ? 'shadow-xl ring-2 ring-purple-400 rotate-2' : ''}
                            `}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                              <span className="font-bold text-gray-800">{memorial.fallen_name}</span>
                            </div>
                            <div className="text-xs text-gray-500 pr-6">
                              {memorial.participantName}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Days List (Droppable Targets) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
                תוכנית המסע ושיבוץ הנצחות
                </h3>
            </div>
            
            <div className="space-y-4">
              {tripDays.map((day) => {
                const dayMemorials = memorials.filter(m => m.assigned_day === day.dayNum && m.status === 'approved');
                const isToday = day.dayNum === currentDayNumber;

                return (
                  <Droppable key={day.dayNum} droppableId={`day-${day.dayNum}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                          relative overflow-hidden rounded-xl border-2 transition-all
                          ${isToday ? 'border-blue-400 shadow-md ring-1 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}
                          ${snapshot.isDraggingOver ? 'border-purple-500 bg-purple-50/50' : 'bg-white'}
                        `}
                      >
                        {isToday && (
                          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                            היום הנוכחי
                          </div>
                        )}

                        <div className="p-5 flex flex-col md:flex-row gap-6">
                            {/* Day Info Column */}
                            <div className="md:w-1/3 space-y-4 border-l pl-6">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-gray-900">יום {day.dayNum}</span>
                                        <span className="text-gray-500 font-medium">
                                            {day.date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 mt-2 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>{day.startTime} - {day.endTime}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="font-semibold block mb-1">יעדים:</span>
                                            {day.destinations && day.destinations.length > 0 ? (
                                                <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                                                    {day.destinations.map((dest, i) => (
                                                        <li key={i}>{dest}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-gray-400 italic">לא עודכנו יעדים</span>
                                            )}
                                        </div>
                                    </div>

                                    {day.attractions && day.attractions.length > 0 && (
                                        <div className="flex items-start gap-2 text-sm mt-3">
                                            <Map className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                            <div>
                                                <span className="font-semibold block mb-1">אטרקציות ({day.attractions.length}):</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {day.attractions.map((attr, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                                                            {typeof attr === 'string' ? attr : attr.type || 'אטרקציה'}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Memorials Column */}
                            <div className="flex-1 bg-gray-50/50 rounded-lg p-4 min-h-[120px]">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                                    <Heart className="w-4 h-4 text-purple-500" />
                                    הנצחות משובצות ({dayMemorials.length})
                                </h4>
                                
                                <div className="space-y-2">
                                    {dayMemorials.length === 0 && !snapshot.isDraggingOver && (
                                        <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                                            גרור לכאן הנצחות מהמאגר
                                        </div>
                                    )}

                                    {dayMemorials.map((memorial, index) => (
                                        <Draggable 
                                            key={memorial.participantId.toString()} 
                                            draggableId={memorial.participantId.toString()} 
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`
                                                        bg-white p-3 rounded-lg border border-purple-100 shadow-sm flex items-center justify-between group
                                                        ${snapshot.isDragging ? 'shadow-lg ring-2 ring-purple-400' : 'hover:border-purple-300'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{memorial.fallen_name}</div>
                                                            <div className="text-xs text-gray-500">ע"י {memorial.participantName}</div>
                                                        </div>
                                                    </div>
                                                    <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
