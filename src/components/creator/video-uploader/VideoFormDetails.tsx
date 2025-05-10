
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
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { VideoFormValues } from './useVideoUpload';
import { PremiumVideoOptions } from './PremiumVideoOptions';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface VideoFormDetailsProps {
  form: UseFormReturn<VideoFormValues>;
}

const VideoFormDetails: React.FC<VideoFormDetailsProps> = ({ form }) => {
  const videoType = form.watch('type');
  const isPremiumVideo = videoType === 'premium' || videoType === 'vip';
  const ephemeralMode = form.watch('ephemeralMode');

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

      {/* Mode éphémère */}
      <Collapsible>
        <div className="flex items-center space-x-2 pb-2">
          <FormField
            control={form.control}
            name="ephemeralMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                <div className="space-y-0.5">
                  <FormLabel>Mode Éphémère</FormLabel>
                  <FormDescription>
                    Activez le contenu éphémère pour le contenu sensible
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {ephemeralMode && (
          <CollapsibleContent className="space-y-4 mt-2 border rounded-lg p-4 bg-background/50">
            <FormField
              control={form.control}
              name="expiresAfter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée de disponibilité (heures)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field} 
                      value={field.value || ''} 
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    La vidéo sera supprimée après cette durée (en heures)
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxViews"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre maximum de vues</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field} 
                      value={field.value || ''} 
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    La vidéo sera supprimée après ce nombre de vues
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notifyOnScreenshot"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Notification de capture d'écran</FormLabel>
                    <FormDescription>
                      Être notifié quand quelqu'un prend une capture d'écran
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CollapsibleContent>
        )}
      </Collapsible>

      {/* Premium/VIP Options */}
      {isPremiumVideo && <PremiumVideoOptions form={form} />}
    </div>
  );
};

export default VideoFormDetails;
