
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BadgeDollarSign, Coins } from 'lucide-react';

const VideoFormDetails = () => {
  const form = useFormContext();
  const isPremium = useWatch({
    control: form.control,
    name: "isPremium",
    defaultValue: false
  });
  
  const videoType = useWatch({
    control: form.control,
    name: "type",
    defaultValue: "standard"
  });
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre de la vidéo</FormLabel>
            <FormControl>
              <Input placeholder="Entrez le titre de votre vidéo" {...field} />
            </FormControl>
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
                placeholder="Ajoutez une description à votre vidéo..." 
                className="min-h-[100px]" 
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de contenu</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                if (value === "premium" || value === "vip") {
                  form.setValue("isPremium", true);
                } else {
                  form.setValue("isPremium", false);
                  form.setValue("tokenPrice", 0);
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de vidéo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="standard">Standard (gratuit)</SelectItem>
                <SelectItem value="teaser">Teaser / Aperçu</SelectItem>
                <SelectItem value="premium">Premium (payant)</SelectItem>
                <SelectItem value="vip">VIP (exclusif)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium">Contenu premium</h4>
            <p className="text-xs text-muted-foreground">
              Monétisez votre contenu en le rendant payant
            </p>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="isPremium"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (!checked) {
                      form.setValue("tokenPrice", 0);
                      if (videoType === "premium" || videoType === "vip") {
                        form.setValue("type", "standard");
                      }
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {isPremium && (
        <FormField
          control={form.control}
          name="tokenPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Prix en tokens
                <Badge variant="outline" className="ml-2">Premium</Badge>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  placeholder="Prix en tokens" 
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default VideoFormDetails;
