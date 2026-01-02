import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X, Image as ImageIcon, Heart, Download } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function PhotoGallery({ tripId, photos = [], onPhotoAdded, canUpload = false }) {
  const { language, isRTL } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const translations = {
    he: {
      gallery: "גלריית תמונות",
      uploadPhoto: "העלה תמונה",
      noPhotos: "עדיין אין תמונות",
      uploading: "מעלה...",
      uploadSuccess: "התמונה הועלתה בהצלחה",
      uploadError: "שגיאה בהעלאת תמונה",
      photos: "תמונות",
      download: "הורד",
      close: "סגור"
    },
    en: {
      gallery: "Photo Gallery",
      uploadPhoto: "Upload Photo",
      noPhotos: "No photos yet",
      uploading: "Uploading...",
      uploadSuccess: "Photo uploaded successfully",
      uploadError: "Error uploading photo",
      photos: "Photos",
      download: "Download",
      close: "Close"
    },
    ru: {
      gallery: "Галерея",
      uploadPhoto: "Загрузить",
      noPhotos: "Нет фото",
      uploading: "Загрузка...",
      uploadSuccess: "Загружено",
      uploadError: "Ошибка",
      photos: "Фото",
      download: "Скачать",
      close: "Закрыть"
    },
    es: {
      gallery: "Galería",
      uploadPhoto: "Subir",
      noPhotos: "Sin fotos",
      uploading: "Subiendo...",
      uploadSuccess: "Subido",
      uploadError: "Error",
      photos: "Fotos",
      download: "Descargar",
      close: "Cerrar"
    },
    fr: {
      gallery: "Galerie",
      uploadPhoto: "Télécharger",
      noPhotos: "Pas de photos",
      uploading: "Téléchargement...",
      uploadSuccess: "Téléchargé",
      uploadError: "Erreur",
      photos: "Photos",
      download: "Télécharger",
      close: "Fermer"
    },
    de: {
      gallery: "Galerie",
      uploadPhoto: "Hochladen",
      noPhotos: "Keine Fotos",
      uploading: "Hochladen...",
      uploadSuccess: "Hochgeladen",
      uploadError: "Fehler",
      photos: "Fotos",
      download: "Herunterladen",
      close: "Schließen"
    },
    it: {
      gallery: "Galleria",
      uploadPhoto: "Carica",
      noPhotos: "Nessuna foto",
      uploading: "Caricamento...",
      uploadSuccess: "Caricato",
      uploadError: "Errore",
      photos: "Foto",
      download: "Scarica",
      close: "Chiudi"
    }
  };

  const trans = translations[language] || translations.he;

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const user = await base44.auth.me();
      
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      const photoData = {
        id: Date.now().toString(),
        url: file_url,
        uploader_email: user.email,
        uploader_name: user.full_name || user.email,
        timestamp: new Date().toISOString()
      };

      if (onPhotoAdded) {
        await onPhotoAdded(photoData);
      }

      toast.success(trans.uploadSuccess);
    } catch (error) {
      console.error(error);
      toast.error(trans.uploadError);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="w-5 h-5" />
              {trans.gallery}
              {photos.length > 0 && (
                <Badge variant="outline" className="ml-2">{photos.length}</Badge>
              )}
            </CardTitle>
            {canUpload && (
              <label htmlFor="photo-upload">
                <Button size="sm" disabled={uploading} asChild>
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-1" />
                    {uploading ? trans.uploading : trans.uploadPhoto}
                  </span>
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">{trans.noPhotos}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map((photo, idx) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-md hover:shadow-xl"
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-2 sm:p-4">
          {selectedPhoto && (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={selectedPhoto.url}
                  alt=""
                  className="w-full rounded-lg"
                />
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">{selectedPhoto.uploader_name}</div>
                  <div className="text-xs">
                    {new Date(selectedPhoto.timestamp).toLocaleDateString(
                      language === 'he' ? 'he-IL' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(selectedPhoto.url, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {trans.download}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPhoto(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}