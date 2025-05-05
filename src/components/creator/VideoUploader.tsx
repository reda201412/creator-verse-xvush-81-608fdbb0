
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, Film, Play, X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { ContentType } from '@/types/content';

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  videoFile: File;
  thumbnailFile?: File;
  thumbnailUrl?: string;
  format: '16:9' | '9:16' | '1:1' | 'other';
  isProcessing?: boolean;
  isPremium: boolean;
  tokenPrice?: number;
  restrictions?: {
    tier?: 'free' | 'fan' | 'superfan' | 'vip' | 'exclusive';
    sharingAllowed?: boolean;
    downloadsAllowed?: boolean;
    expiresAt?: Date;
  };
}

interface VideoUploaderProps {
  onUploadComplete: (metadata: VideoMetadata) => void;
  isCreator: boolean;
  className?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ 
  onUploadComplete, 
  isCreator,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<ContentType>('standard');
  const [videoFormat, setVideoFormat] = useState<'16:9' | '9:16' | '1:1' | 'other'>('16:9');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tokenPrice, setTokenPrice] = useState<number | undefined>(undefined);
  const [tier, setTier] = useState<'free' | 'fan' | 'superfan' | 'vip' | 'exclusive'>('free');
  const [sharingAllowed, setSharingAllowed] = useState(false);
  const [downloadsAllowed, setDownloadsAllowed] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { triggerMicroReward } = useNeuroAesthetic();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);

      // Detect aspect ratio
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const ratio = video.videoWidth / video.videoHeight;
        if (ratio > 0.95 && ratio < 1.05) {
          setVideoFormat('1:1');
        } else if (ratio > 1.7) {
          setVideoFormat('16:9');
        } else if (ratio < 0.6) {
          setVideoFormat('9:16');
        } else {
          setVideoFormat('other');
        }
      };
      video.src = url;
    } else {
      toast({
        title: "Format non supporté",
        description: "Seuls les fichiers vidéo sont acceptés.",
        variant: "destructive",
      });
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    } else {
      toast({
        title: "Format non supporté",
        description: "Seules les images sont acceptées pour la miniature.",
        variant: "destructive",
      });
    }
  };

  const generateThumbnail = () => {
    if (!videoPreviewUrl) return;

    const video = document.createElement('video');
    video.src = videoPreviewUrl;
    video.currentTime = 1; // Capture thumbnail at 1 second
    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
          setThumbnailFile(file);
          setThumbnailPreviewUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.7);
    });
  };

  const resetForm = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoType('standard');
    setVideoFormat('16:9');
    setTitle('');
    setDescription('');
    setTokenPrice(undefined);
    setTier('free');
    setSharingAllowed(false);
    setDownloadsAllowed(false);
    setUploadProgress(0);
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!videoFile || !title) {
      toast({
        title: "Information manquante",
        description: "Veuillez fournir une vidéo et un titre.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Simulate upload with progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);

      // This would be replaced with actual upload logic
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      const metadata: VideoMetadata = {
        id: `video-${Date.now()}`,
        title,
        description,
        type: videoType,
        videoFile,
        thumbnailFile: thumbnailFile || undefined,
        thumbnailUrl: thumbnailPreviewUrl || undefined,
        format: videoFormat,
        isPremium: videoType !== 'standard',
        tokenPrice: videoType !== 'standard' ? tokenPrice : undefined,
        restrictions: {
          tier: videoType !== 'standard' ? tier : 'free',
          sharingAllowed,
          downloadsAllowed,
          expiresAt: undefined
        }
      };
      
      onUploadComplete(metadata);
      triggerMicroReward('success');
      
      toast({
        title: "Vidéo téléchargée avec succès",
        description: "Votre vidéo a été mise en ligne et est maintenant visible.",
      });
      
      setTimeout(() => {
        setIsUploading(false);
        setIsOpen(false);
        resetForm();
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur s'est produite lors du téléchargement de votre vidéo.",
        variant: "destructive",
      });
    }
  };

  const isPremiumVideo = videoType === 'premium' || videoType === 'vip';

  return (
    <>
      {isCreator && (
        <Button 
          onClick={() => setIsOpen(true)} 
          className={className}
          size="sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          Uploader une vidéo
        </Button>
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Uploader une vidéo</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Video Upload Section */}
            <div>
              <Label htmlFor="video">Fichier vidéo</Label>
              
              {!videoPreviewUrl ? (
                <div 
                  className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Video className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Cliquez pour sélectionner une vidéo</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    MP4, MOV ou WebM. 1080p ou supérieur recommandé.
                  </p>
                </div>
              ) : (
                <div className="mt-2 relative rounded-lg overflow-hidden bg-black aspect-video">
                  <video 
                    src={videoPreviewUrl} 
                    className="w-full h-full object-contain"
                    controls
                  />
                  <Button 
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setVideoPreviewUrl(null);
                      setVideoFile(null);
                      if (videoInputRef.current) videoInputRef.current.value = '';
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <Input 
                id="video" 
                ref={videoInputRef}
                type="file" 
                accept="video/*" 
                className="hidden"
                onChange={handleVideoChange} 
              />
            </div>
            
            {/* Video Format Information */}
            {videoPreviewUrl && (
              <div className="flex items-center gap-2 text-sm">
                <Film className="h-4 w-4 text-muted-foreground" />
                <span>Format détecté: {videoFormat}</span>
                {videoFormat === '9:16' && (
                  <span className="text-primary font-semibold">
                    (Format idéal pour Xtease)
                  </span>
                )}
              </div>
            )}
            
            {/* Thumbnail Upload Section */}
            {videoPreviewUrl && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="thumbnail">Miniature</Label>
                  {videoPreviewUrl && !thumbnailPreviewUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={generateThumbnail}
                    >
                      Générer automatiquement
                    </Button>
                  )}
                </div>
                
                {!thumbnailPreviewUrl ? (
                  <div 
                    className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-4 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    <p className="text-sm">Sélectionner une image de miniature</p>
                  </div>
                ) : (
                  <div className="mt-2 relative rounded-lg overflow-hidden aspect-video">
                    <img 
                      src={thumbnailPreviewUrl} 
                      className="w-full h-full object-cover"
                      alt="Thumbnail preview"
                    />
                    <Button 
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => {
                        setThumbnailPreviewUrl(null);
                        setThumbnailFile(null);
                        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <Input 
                  id="thumbnail" 
                  ref={thumbnailInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleThumbnailChange} 
                />
              </div>
            )}
            
            {/* Video Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="mt-1 resize-none" 
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type de vidéo</Label>
                <Select value={videoType} onValueChange={(value: ContentType) => setVideoType(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Gratuite</SelectItem>
                    <SelectItem value="teaser">Xtease (format 9:16)</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Premium/VIP Options */}
              {isPremiumVideo && (
                <div className="space-y-4 pt-2 border-t border-border">
                  <div>
                    <Label htmlFor="tokenPrice">Prix en tokens</Label>
                    <Input 
                      id="tokenPrice" 
                      type="number"
                      min={1}
                      value={tokenPrice || ''} 
                      onChange={(e) => setTokenPrice(parseInt(e.target.value))} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tier">Niveau d'abonnement minimum</Label>
                    <Select value={tier} onValueChange={(value: any) => setTier(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Aucun (libre)</SelectItem>
                        <SelectItem value="fan">Fan</SelectItem>
                        <SelectItem value="superfan">Super Fan</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="exclusive">Exclusif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="sharingAllowed"
                      checked={sharingAllowed}
                      onChange={(e) => setSharingAllowed(e.target.checked)} 
                      className="h-4 w-4"
                    />
                    <Label htmlFor="sharingAllowed" className="text-sm">Autoriser le partage</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="downloadsAllowed"
                      checked={downloadsAllowed}
                      onChange={(e) => setDownloadsAllowed(e.target.checked)} 
                      className="h-4 w-4"
                    />
                    <Label htmlFor="downloadsAllowed" className="text-sm">Autoriser le téléchargement</Label>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsOpen(false);
              resetForm();
            }}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!videoFile || !title || isUploading}
            >
              {isUploading ? (
                <div className="flex items-center">
                  <span className="mr-2">{Math.round(uploadProgress)}%</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>Publier</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoUploader;
