import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DayImageUploader({ imageUrl, onImageChange }) {
  const { language } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(language === 'he' ? 'אנא בחר קובץ תמונה' : 'Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      // Using the integration to upload file
      const result = await base44.integrations.Core.UploadFile({ file });
      if (result && result.file_url) {
        onImageChange(result.file_url);
        toast.success(language === 'he' ? 'התמונה הועלתה בהצלחה' : 'Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(language === 'he' ? 'שגיאה בהעלאת התמונה' : 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        {language === 'he' ? 'תמונה יומית' : language === 'ru' ? 'Фото дня' : language === 'es' ? 'Foto del día' : language === 'fr' ? 'Photo du jour' : language === 'de' ? 'Tagesfoto' : language === 'it' ? 'Foto del giorno' : 'Day Photo'}
      </Label>

      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
          <img 
            src={imageUrl} 
            alt="Day preview" 
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-sm"
            onClick={() => onImageChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
          <div className="flex flex-col items-center gap-2 text-center">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            <div className="text-sm text-gray-600">
              {isUploading ? (
                <span>{language === 'he' ? 'מעלה...' : 'Uploading...'}</span>
              ) : (
                <>
                  <label htmlFor="day-image-upload" className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                    {language === 'he' ? 'העלה תמונה' : 'Upload image'}
                  </label>
                  <Input 
                    id="day-image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}