
import React from 'react';
import { Film } from 'lucide-react';
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
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VideoFileUpload } from './VideoFileUpload';
import { ThumbnailUpload } from './ThumbnailUpload';
import { PremiumVideoOptions } from './PremiumVideoOptions';
import { videoSchema, VideoFormValues } from './useVideoUpload';

interface VideoUploadFormProps {
  videoFile: File | null;
  thumbnailFile: File | null;
  videoPreviewUrl: string | null;
  thumbnailPreviewUrl: string | null;
  videoFormat: '16:9' | '9:16' | '1:1' | 'other';
  isUploading: boolean;
  uploadProgress: number;
  handleVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  generateThumbnail: () => void;
  resetForm: () => void;
  onClose: () => void;
  onSubmit: (values: VideoFormValues) => Promise<void>;
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  videoFile,
  thumbnailFile,
  videoPreviewUrl,
  thumbnailPreviewUrl,
  videoFormat,
  isUploading,
  uploadProgress,
  handleVideoChange,
  handleThumbnailChange,
  generateThumbnail,
  resetForm,
  onClose,
  onSubmit
}) => {
  const form = useForm<VideoFormValues>({
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

  const videoType = form.watch('type');
  const isPremiumVideo = videoType === 'premium' || videoType === 'vip';

  // Create refs for video and thumbnail inputs
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const thumbnailInputRef = React.useRef<HTMLInputElement>(null);

  const handleRemoveVideo = () => {
    if (videoInputRef.current) videoInputRef.current.value = '';
    resetForm();
  };

  const handleRemoveThumbnail = () => {
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
        {/* Video Upload Section */}
        <VideoFileUpload
          ref={videoInputRef}
          videoPreviewUrl={videoPreviewUrl}
          onVideoChange={handleVideoChange}
          onRemoveVideo={handleRemoveVideo}
        />
        
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
          <ThumbnailUpload
            ref={thumbnailInputRef}
            thumbnailPreviewUrl={thumbnailPreviewUrl}
            onThumbnailChange={handleThumbnailChange}
            onRemoveThumbnail={handleRemoveThumbnail}
            onGenerateThumbnail={generateThumbnail}
            showGenerateButton={!!videoPreviewUrl}
          />
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
          {isPremiumVideo && <PremiumVideoOptions form={form} />}
        </div>
      
        <DialogFooter>
          <Button 
            variant="outline" 
            type="button"
            onClick={onClose}
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
  );
};
