
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

// Schéma de validation pour le formulaire
const videoSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères" }),
  description: z.string().optional(),
  type: z.enum(['standard', 'teaser', 'premium', 'vip']),
  tokenPrice: z.number().optional(),
  tier: z.enum(['free', 'fan', 'superfan', 'vip', 'exclusive']),
  sharingAllowed: z.boolean().default(false),
  downloadsAllowed: z.boolean().default(false),
});

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
  const [videoFormat, setVideoFormat] = useState<'16:9' | '9:16' | '1:1' | 'other'>('16:9');

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { triggerMicroReward } = useNeuroAesthetic();
  const { user } = useAuth();

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'standard',
      tier: 'free',
      sharingAllowed: false,
      downloadsAllowed: false,
    },
  });

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
    setVideoFormat('16:9');
    setUploadProgress(0);
    form.reset();
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  };

  const uploadToSupabase = async (values: z.infer<typeof videoSchema>) => {
    if (!videoFile || !user) {
      toast({
        title: "Erreur",
        description: "Vidéo ou utilisateur non disponible",
        variant: "destructive",
      });
      return null;
    }

    try {
      // 1. Upload de la vidéo
      const userId = user.id;
      const videoFileName = `${Date.now()}_${videoFile.name.replace(/\s+/g, '_')}`;
      const videoPath = `${userId}/${videoFileName}`;
      
      // Mise à jour de la barre de progression
      let uploadProgress = 0;
      const uploadProgressCallback = (progress: number) => {
        setUploadProgress(progress);
      };
      
      // Upload de la vidéo - Fix: Remove onUploadProgress from options
      const { data: videoData, error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoPath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Update progress manually since we can't use onUploadProgress
      uploadProgressCallback(70); // 70% complete after video upload
      
      if (videoError) throw videoError;
      
      // Récupérer l'URL publique de la vidéo
      const { data: videoUrlData } = await supabase.storage
        .from('videos')
        .createSignedUrl(videoPath, 60 * 60 * 24 * 365); // URL valide 1 an
      
      const videoUrl = videoUrlData?.signedUrl;
      
      // 2. Upload de la miniature si disponible
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbnailFileName = `thumbnail_${Date.now()}_${thumbnailFile.name.replace(/\s+/g, '_')}`;
        const thumbnailPath = `${userId}/${thumbnailFileName}`;
        
        // Fix: Remove onUploadProgress from options
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from('videos')
          .upload(thumbnailPath, thumbnailFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        // Update progress manually since we can't use onUploadProgress
        uploadProgressCallback(90); // 90% complete after thumbnail upload
        
        if (thumbnailError) throw thumbnailError;
        
        // Récupérer l'URL publique de la miniature
        const { data: thumbnailUrlData } = await supabase.storage
          .from('videos')
          .createSignedUrl(thumbnailPath, 60 * 60 * 24 * 365); // URL valide 1 an
        
        thumbnailUrl = thumbnailUrlData?.signedUrl;
      }
      
      // 3. Sauvegarder les métadonnées dans la base de données
      const isPremium = values.type !== 'standard';
      const restrictions = {
        tier: values.tier,
        sharingAllowed: values.sharingAllowed,
        downloadsAllowed: values.downloadsAllowed
      };
      
      const { data: videoRecord, error: dbError } = await supabase
        .from('videos')
        .insert({
          title: values.title,
          description: values.description || '',
          type: values.type,
          is_premium: isPremium,
          format: videoFormat,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          user_id: userId,
          token_price: isPremium ? values.tokenPrice : null,
          restrictions: restrictions
        })
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      // Update to 100% when everything is done
      uploadProgressCallback(100);
      
      // Préparer les métadonnées pour le retour
      const metadata: VideoMetadata = {
        id: videoRecord.id.toString(),
        title: values.title,
        description: values.description || '',
        type: values.type as ContentType,
        videoFile: videoFile,
        thumbnailFile: thumbnailFile || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        format: videoFormat,
        isPremium: isPremium,
        tokenPrice: isPremium ? values.tokenPrice : undefined,
        restrictions: restrictions
      };
      
      return metadata;
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof videoSchema>) => {
    if (!videoFile) {
      toast({
        title: "Information manquante",
        description: "Veuillez fournir une vidéo et un titre.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload vers Supabase
      const metadata = await uploadToSupabase(values);
      
      if (metadata) {
        onUploadComplete(metadata);
        triggerMicroReward('interaction');
        
        toast({
          title: "Vidéo téléchargée avec succès",
          description: "Votre vidéo a été mise en ligne et est maintenant visible.",
        });
        
        setTimeout(() => {
          setIsUploading(false);
          setIsOpen(false);
          resetForm();
        }, 1000);
      }
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setIsUploading(false);
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Une erreur s'est produite lors du téléchargement de votre vidéo.",
        variant: "destructive",
      });
    }
  };

  const videoType = form.watch('type');
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
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
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="mt-1 resize-none" rows={3} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de vidéo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Gratuite</SelectItem>
                          <SelectItem value="teaser">Xtease (format 9:16)</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Premium/VIP Options */}
                {isPremiumVideo && (
                  <div className="space-y-4 pt-2 border-t border-border">
                    <FormField
                      control={form.control}
                      name="tokenPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix en tokens</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              value={field.value || ''}
                              className="mt-1"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Niveau d'abonnement minimum</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionner un niveau" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="free">Aucun (libre)</SelectItem>
                              <SelectItem value="fan">Fan</SelectItem>
                              <SelectItem value="superfan">Super Fan</SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                              <SelectItem value="exclusive">Exclusif</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sharingAllowed"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">Autoriser le partage</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="downloadsAllowed"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">Autoriser le téléchargement</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  disabled={!videoFile || isUploading}
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
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoUploader;
