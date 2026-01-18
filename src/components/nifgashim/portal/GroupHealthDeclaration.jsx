// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '../../LanguageContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GroupHealthDeclaration({ accepted, onAccept, leaderName, groupName }) {
  const { language, isRTL } = useLanguage();

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <p className="text-gray-800 text-base">
            אני <span className="font-bold text-blue-600">{leaderName}</span> ראש קבוצת <span className="font-bold text-blue-600">{groupName || '_____'}</span> מצהיר כי:
          </p>
          
          <ol className="list-decimal list-inside space-y-2 pr-2 text-gray-700">
            <li className="leading-relaxed">קראתי את כל הוראות הבטיחות ופרטי המסלולים אליהם נרשמנו.</li>
            <li className="leading-relaxed">וידאתי שכל חברי הקבוצה בריאים וכשירים להשתתף במסלולים אליהם נרשמנו.</li>
            <li className="leading-relaxed">אני אחראי להתנהגות תקינה של חברי קבוצתי בהתאם להוראות הבטיחות ונחיות מארגני המסע.</li>
            <li className="leading-relaxed">אני אדווח למארגני המסע על כל בעיה רפואית או בטיחותית שתיווצר מזמן השתתפותנו במסע, ואפעל בהתאם להוראותיהם.</li>
          </ol>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="groupHealthDeclaration"
            checked={accepted}
            onCheckedChange={onAccept}
          />
          <Label htmlFor="groupHealthDeclaration" className="cursor-pointer">
            אני מאשר/ת את ההצהרה
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}