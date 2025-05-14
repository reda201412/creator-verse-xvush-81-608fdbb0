
import React from 'react';
import { Input } from '@/components/ui/input';
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

interface PremiumVideoOptionsProps {
  form: UseFormReturn<VideoFormValues>;
}

export const PremiumVideoOptions: React.FC<PremiumVideoOptionsProps> = ({ form }) => {
  return (
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
        name="type"
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
        name="isPremium"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value ? true : false}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4"
              />
            </FormControl>
            <FormLabel className="text-sm">Autoriser le partage</FormLabel>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="isPremium"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value ? true : false}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4"
              />
            </FormControl>
            <FormLabel className="text-sm">Autoriser le téléchargement</FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
};
