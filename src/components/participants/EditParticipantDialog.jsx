import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dog } from 'lucide-react';

export default function EditParticipantDialog({ 
  open, 
  onOpenChange, 
  participant, 
  userProfile,
  onSave, 
  language 
}) {
  const [familyMembers, setFamilyMembers] = useState({
    me: true,
    spouse: false,
    pets: false,
    other: false
  });
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [otherMemberName, setOtherMemberName] = useState('');

  useEffect(() => {
    if (participant) {
      setFamilyMembers(participant.family_members || { me: true, spouse: false, pets: false, other: false });
      setSelectedChildren(participant.selected_children || []);
      setOtherMemberName(participant.other_member_name || '');
    }
  }, [participant]);

  const handleSave = () => {
    // Calculate total people
    let totalPeople = 1;
    if (familyMembers.spouse) totalPeople++;
    if (selectedChildren.length > 0) totalPeople += selectedChildren.length;
    if (familyMembers.other && otherMemberName) totalPeople++;

    // Build children details from user profile
    const childrenDetails = [];
    if (userProfile?.children_age_ranges) {
      selectedChildren.forEach(childId => {
        const child = userProfile.children_age_ranges.find(c => c.id === childId);
        if (child) {
          childrenDetails.push({
            id: child.id,
            name: child.name,
            age_range: child.age_range,
            gender: child.gender
          });
        }
      });
    }

    onSave({
      family_members: familyMembers,
      selected_children: selectedChildren,
      other_member_name: otherMemberName,
      total_people: totalPeople,
      children_details: childrenDetails
    });
  };

  // Normalize children data
  const normalizedChildren = userProfile?.children_age_ranges?.map((child, idx) => {
    if (typeof child === 'string') {
      return { id: `idx_${idx}`, name: null, age_range: child, gender: null };
    }
    return { ...child, id: child?.id || `idx_${idx}` };
  }) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>
            {language === 'he' ? 'ערוך פרטי משפחה' : 'Edit Family Details'}
          </DialogTitle>
          <DialogDescription>
            {language === 'he' ? 'עדכן את מספר המשתתפים מהמשפחה שלך' : 'Update the number of family members joining'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2">
          <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-emerald-200">
              <Checkbox
                id="edit-me"
                checked={familyMembers.me}
                disabled
                className="data-[state=checked]:bg-emerald-600"
              />
              <label htmlFor="edit-me" className="flex-1 font-medium cursor-not-allowed opacity-70">
                {language === 'he' ? 'אני' : 'Me'}
              </label>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id="edit-spouse"
                checked={familyMembers.spouse}
                onCheckedChange={(checked) => setFamilyMembers({...familyMembers, spouse: checked})}
                className="data-[state=checked]:bg-emerald-600"
              />
              <label htmlFor="edit-spouse" className="flex-1 font-medium cursor-pointer">
                {language === 'he' ? 'בן/בת זוג' : 'Spouse/Partner'}
              </label>
            </div>

            {normalizedChildren.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {language === 'he' ? 'ילדים' : 'Children'}
                </Label>
                {normalizedChildren.map((child, idx) => {
                  const refId = child.id;
                  return (
                    <div key={refId} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={`edit-child-${refId}`}
                        checked={selectedChildren.includes(refId)}
                        onCheckedChange={(checked) => {
                          setSelectedChildren(prev => 
                            checked 
                              ? [...prev, refId]
                              : prev.filter(id => id !== refId)
                          );
                        }}
                        className="data-[state=checked]:bg-pink-600"
                      />
                      <label htmlFor={`edit-child-${refId}`} className="flex-1 font-medium cursor-pointer">
                        {child.name || `${language === 'he' ? 'ילד' : 'Child'} ${idx + 1}`}
                        {child.age_range && (
                          <Badge variant="outline" className="ml-2 bg-pink-50 text-pink-700">
                            {child.age_range}
                          </Badge>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id="edit-pets"
                checked={familyMembers.pets}
                onCheckedChange={(checked) => setFamilyMembers({...familyMembers, pets: checked})}
                className="data-[state=checked]:bg-amber-600"
              />
              <label htmlFor="edit-pets" className="flex-1 font-medium cursor-pointer flex items-center gap-2">
                <Dog className="w-4 h-4" />
                {language === 'he' ? 'בעלי חיים' : 'Pets'}
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="edit-other"
                  checked={familyMembers.other}
                  onCheckedChange={(checked) => {
                    setFamilyMembers({...familyMembers, other: checked});
                    if (!checked) setOtherMemberName('');
                  }}
                  className="data-[state=checked]:bg-purple-600"
                />
                <label htmlFor="edit-other" className="flex-1 font-medium cursor-pointer">
                  {language === 'he' ? 'נוסף' : 'Other'}
                </label>
              </div>
              
              {familyMembers.other && (
                <Input
                  value={otherMemberName}
                  onChange={(e) => setOtherMemberName(e.target.value)}
                  placeholder={language === 'he' ? 'שם האדם/ים הנוסף/ים' : 'Name of other person(s)'}
                  dir={language === 'he' ? 'rtl' : 'ltr'}
                />
              )}
            </div>
          </div>

          {/* Total Preview */}
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <p className="text-sm font-semibold text-emerald-900">
              {language === 'he' ? 'סה"כ אנשים:' : 'Total people:'} {
                1 + 
                (familyMembers.spouse ? 1 : 0) + 
                selectedChildren.length + 
                (familyMembers.other && otherMemberName ? 1 : 0)
              }
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === 'he' ? 'ביטול' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {language === 'he' ? 'שמור שינויים' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}