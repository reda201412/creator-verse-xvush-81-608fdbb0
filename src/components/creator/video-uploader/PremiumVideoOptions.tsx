
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { VideoFormValues } from './useVideoUpload';

interface PremiumVideoOptionsProps {
  form: UseFormReturn<VideoFormValues>;
}

const PremiumVideoOptions: React.FC<PremiumVideoOptionsProps> = ({ form }) => {
  return (
    <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
      <h3 className="text-sm font-semibold">Options Premium</h3>
      
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
                step={1}
                {...field}
                value={field.value || 5}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>Coût pour débloquer cette vidéo</FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="subscriptionLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Niveau d'abonnement requis</FormLabel>
            <Select 
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="exclusive">Exclusive</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>Niveau d'abonnement minimum pour voir cette vidéo</FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="allowSharing"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Autoriser le partage</FormLabel>
              <FormDescription>Les utilisateurs peuvent partager cette vidéo</FormDescription>
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
      
      <FormField
        control={form.control}
        name="allowDownload"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Autoriser le téléchargement</FormLabel>
              <FormDescription>Les utilisateurs peuvent télécharger cette vidéo</FormDescription>
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
