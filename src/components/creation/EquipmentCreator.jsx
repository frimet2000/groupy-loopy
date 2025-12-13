import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Backpack, Plus, Trash2, Check, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";

export default function EquipmentCreator({ equipment, setEquipment, waterRecommendation, setWaterRecommendation }) {
  const { language } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [newItem, setNewItem] = useState('');

  const popularItems = [
    { id: 'hat', he: 'כובע', en: 'Hat' },
    { id: 'sunscreen', he: 'קרם הגנה', en: 'Sunscreen' },
    { id: 'shoes', he: 'נעלי הליכה', en: 'Hiking Shoes' },
    { id: 'snacks', he: 'חטיפים', en: 'Snacks' },
    { id: 'firstaid', he: 'עזרה ראשונה', en: 'First Aid' },
    { id: 'flashlight', he: 'פנס', en: 'Flashlight' },
    { id: 'jacket', he: 'מעיל', en: 'Jacket' },
  ];

  const handleAddPopular = (item) => {
    const itemName = language === 'he' ? item.he : item.en;
    if (equipment.some(e => e.item === itemName)) {
      toast.error(language === 'he' ? 'הפריט כבר קיים' : 'Already added');
      return;
    }
    setEquipment([...equipment, { id: Date.now().toString(), item: itemName, checked: false }]);
  };

  const handleAddCustom = () => {
    if (!newItem.trim()) return;
    setEquipment([...equipment, { id: Date.now().toString(), item: newItem, checked: false }]);
    setNewItem('');
    setShowDialog(false);
  };

  const handleDelete = (id) => {
    setEquipment(equipment.filter(e => e.id !== id));
  };

  const handleToggle = (id) => {
    setEquipment(equipment.map(e => e.id === id ? { ...e, checked: !e.checked } : e));
  };

  return (
    <>
      <Card className="border-2 border-indigo-100 shadow-xl bg-white/80">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Backpack className="w-5 h-5" />
            {language === 'he' ? 'רשימת ציוד' : 'Equipment Checklist'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Water Recommendation */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              💧 {language === 'he' ? 'כמות מים מומלצת' : 'Recommended Water'}
            </p>
            <div className="flex flex-wrap gap-2">
              {[1, 1.5, 2, 3, 4].map(liters => {
                const isSelected = waterRecommendation === liters;
                return (
                  <button
                    key={liters}
                    type="button"
                    onClick={() => setWaterRecommendation(liters)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    {liters}L
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularItems.map(item => {
              const itemName = language === 'he' ? item.he : item.en;
              const added = equipment.some(e => e.item === itemName);
              return (
                <Button
                  key={item.id}
                  size="sm"
                  variant={added ? "secondary" : "outline"}
                  onClick={() => !added && handleAddPopular(item)}
                  disabled={added}
                  className={`gap-1 relative ${item.critical ? 'border-red-400 hover:border-red-500' : ''}`}
                >
                  {item.critical && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      <AlertTriangle className="w-2.5 h-2.5" />
                    </div>
                  )}
                  {added && <Check className="w-3 h-3" />}
                  {itemName}
                </Button>
              );
            })}
          </div>

          <Button type="button" onClick={() => setShowDialog(true)} className="w-full bg-indigo-600 hover:bg-indigo-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {language === 'he' ? 'פריט מותאם' : 'Custom Item'}
          </Button>

          <ScrollArea className="h-[200px]">
            {equipment.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">
                {language === 'he' ? 'אין פריטים עדיין' : 'No items yet'}
              </p>
            ) : (
              <div className="space-y-2">
                {equipment.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-indigo-50 rounded-lg">
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.checked ? 'bg-indigo-600 border-indigo-600' : 'border-indigo-300'
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-500' : ''}`}>
                      {item.item}
                    </span>
                    <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-red-600" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'he' ? 'פריט חדש' : 'New Item'}</DialogTitle>
          </DialogHeader>
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={language === 'he' ? 'שם הפריט...' : 'Item name...'}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>{language === 'he' ? 'ביטול' : 'Cancel'}</Button>
            <Button type="button" onClick={handleAddCustom} className="bg-indigo-600">{language === 'he' ? 'הוסף' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}