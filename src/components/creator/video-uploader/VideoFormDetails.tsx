
import React from 'react';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { videoSchema, VideoFormValues } from './useVideoUpload';
import { UseFormReturn } from 'react-hook-form';
import PremiumVideoOptions from './PremiumVideoOptions';

interface VideoFormDetailsProps {
  form: UseFormReturn<VideoFormValues>;
}

const VideoFormDetails: React.FC<VideoFormDetailsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre</FormLabel>
            <FormControl>
              <Input 
                placeholder="Titre de votre vidéo" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Un titre clair et accrocheur.
            </FormDescription>
            <FormMessage />
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
              <Textarea 
                placeholder="Décrivez votre vidéo..." 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Une description détaillée aide au référencement.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Type de contenu</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard (gratuit)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teaser" id="teaser" />
                  <Label htmlFor="teaser">Xtease (aperçu court vertical)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium">Premium (abonnés payants)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vip" id="vip" />
                  <Label htmlFor="vip">VIP (paiement à l'unité)</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PremiumVideoOptions form={form} />
      
    </div>
  );
};

export default VideoFormDetails;
