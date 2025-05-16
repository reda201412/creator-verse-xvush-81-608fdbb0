
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { VideoFormValues } from './useVideoUpload';
import { PremiumVideoOptions } from './PremiumVideoOptions';

interface VideoFormDetailsProps {
  form: UseFormReturn<VideoFormValues>;
}

const VideoFormDetails: React.FC<VideoFormDetailsProps> = ({ form }) => {
  // Use videoType property from our schema
  const videoType = form.watch('videoType');
  const isPremiumVideo = videoType === 'premium' || videoType === 'vip';

  return (
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
        name="videoType"
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
  );
};

export default VideoFormDetails;
