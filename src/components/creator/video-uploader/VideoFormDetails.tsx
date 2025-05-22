
import React from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BadgeDollarSign, Coins } from 'lucide-react';

const VideoFormDetails = () => {
  // Get the form context directly
  const formContext = useFormContext();
  
  const isPremium = useWatch({
    name: "isPremium",
    defaultValue: false
  });
  
  const videoType = useWatch({
    name: "type",
    defaultValue: "standard"
  });
  
  return (
    <div className="space-y-4">
      <FormField
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
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de contenu</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                if (value === "premium" || value === "vip") {
                  // Use formContext instead of accessing field.form
                  formContext.setValue("isPremium", true);
                } else {
                  formContext.setValue("isPremium", false);
                  formContext.setValue("tokenPrice", 0);
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
          name="isPremium"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (!checked) {
                      // Use formContext instead of accessing field.form
                      formContext.setValue("tokenPrice", 0);
                      if (videoType === "premium" || videoType === "vip") {
                        formContext.setValue("type", "standard");
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
