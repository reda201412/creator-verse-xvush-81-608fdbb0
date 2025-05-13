
import React, { useEffect } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VideoFormValues } from './useVideoUpload';
import { UseFormReturn, useWatch } from 'react-hook-form';

interface PremiumVideoOptionsProps {
  form: UseFormReturn<VideoFormValues>;
}

const PremiumVideoOptions: React.FC<PremiumVideoOptionsProps> = ({ form }) => {
  const videoType = useWatch({
    control: form.control,
    name: 'type',
  });
  
  const isPremiumOrVip = videoType === 'premium' || videoType === 'vip';
  
  // Reset token price when changing to standard/teaser
  useEffect(() => {
    if (!isPremiumOrVip) {
      form.setValue('tokenPrice', 0);
    }
  }, [isPremiumOrVip, form]);
  
  if (!isPremiumOrVip) return null;
  
  return (
    <div className="bg-muted/40 p-4 rounded-md space-y-4 border border-muted">
      <h3 className="font-medium text-sm">Options de contenu premium</h3>
      
      {videoType === 'vip' && (
        <FormField
          control={form.control}
          name="tokenPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix (tokens)</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    value={[field.value || 5]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={field.value || 5}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-16"
                    min={1}
                    max={100}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Le prix en tokens pour accéder à cette vidéo.
              </FormDescription>
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="isPremium"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Contenu exclusif</FormLabel>
              <FormDescription>
                Marquer comme contenu premium exclusif.
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
  );
};

export default PremiumVideoOptions;
