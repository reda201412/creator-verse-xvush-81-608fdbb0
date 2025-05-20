
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUploader } from './UploaderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const metadataSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  type: z.enum(['standard', 'teaser', 'premium', 'vip']),
  isPremium: z.boolean().default(false),
  tokenPrice: z.number().min(0, 'Le prix doit être positif').optional(),
  tags: z.string().optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
  schedulePublish: z.string().optional(),
});

type MetadataFormValues = z.infer<typeof metadataSchema>;

export const MetadataForm: React.FC<{
  onComplete: (metadata: any) => void;
  onBack: () => void;
}> = ({ onComplete, onBack }) => {
  const { metadata, setMetadata, file, thumbnail } = useUploader();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MetadataFormValues>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      title: metadata.title,
      description: metadata.description,
      type: metadata.type,
      isPremium: metadata.isPremium,
      tokenPrice: metadata.tokenPrice,
      visibility: metadata.visibility || 'public',
    },
  });

  // Update form when metadata changes
  useEffect(() => {
    if (metadata) {
      form.reset({
        title: metadata.title,
        description: metadata.description,
        type: metadata.type,
        isPremium: metadata.isPremium,
        tokenPrice: metadata.tokenPrice,
        visibility: metadata.visibility || 'public',
      });
    }
  }, [metadata, form]);

  const handleSubmit = async (data: MetadataFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Update global metadata state
      const formData = new FormData();
      
      if (file) {
        formData.append('video', file);
      }
      
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
      
      // Add metadata to form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Convert tags from string to array if present
      const processedMetadata = {
        ...data,
        // Convert tags string to array (splitting by comma)
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        tokenPrice: data.isPremium ? data.tokenPrice || 0 : 0,
      };
      
      // Update global metadata state
      setMetadata(processedMetadata);
      
      // Call the complete handler with the form data
      onComplete(formData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la soumission du formulaire.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const videoType = form.watch('type');
  const isPremium = form.watch('isPremium');

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre de la vidéo</Label>
          <Input
            id="title"
            placeholder="Donnez un titre à votre vidéo"
            {...form.register('title')}
            className="mt-1"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="description">Description (optionnel)</Label>
          <Textarea
            id="description"
            placeholder="Décrivez votre vidéo..."
            {...form.register('description')}
            className="mt-1 min-h-[100px]"
          />
        </div>
        
        <div>
          <Label>Type de contenu</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {['standard', 'teaser', 'premium', 'vip'].map((type) => (
              <div 
                key={type}
                className={`border rounded-md p-4 cursor-pointer transition-colors ${
                  videoType === type ? 'border-primary bg-primary/10' : 'border-muted hover:bg-muted/50'
                }`}
                onClick={() => form.setValue('type', type as any)}
              >
                <div className="font-medium capitalize">
                  {type === 'teaser' ? 'Extrait' : 
                   type === 'premium' ? 'Contenu Premium' : 
                   type === 'vip' ? 'VIP Exclusif' : 'Standard'}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {type === 'teaser' ? 'Un aperçu gratuit de votre contenu' :
                   type === 'premium' ? 'Contenu payant pour vos abonnés' :
                   type === 'vip' ? 'Contenu exclusif pour les abonnés VIP' :
                   'Contenu standard visible par tous'}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {(videoType === 'premium' || videoType === 'vip') && (
          <div className="space-y-4 border border-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPremium">Contenu Premium</Label>
                <p className="text-sm text-muted-foreground">
                  Définissez un prix pour accéder à cette vidéo
                </p>
              </div>
              <Switch
                id="isPremium"
                checked={isPremium}
                onCheckedChange={(checked) => {
                  form.setValue('isPremium', checked);
                  if (!checked) {
                    form.setValue('tokenPrice', 0);
                  }
                }}
              />
            </div>
            
            {isPremium && (
              <div>
                <Label htmlFor="tokenPrice">Prix en tokens</Label>
                <Input
                  id="tokenPrice"
                  type="number"
                  min="0"
                  step="1"
                  {...form.register('tokenPrice', { valueAsNumber: true })}
                  className="mt-1 w-32"
                />
                {form.formState.errors.tokenPrice && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.tokenPrice.message}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        <div>
          <Label>Visibilité</Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {[
              { value: 'public', label: 'Public', desc: 'Visible par tous' },
              { value: 'unlisted', label: 'Non listé', desc: 'Seulement avec le lien' },
              { value: 'private', label: 'Privé', desc: 'Seulement vous' },
            ].map((item) => (
              <div 
                key={item.value}
                className={`border rounded-md p-4 cursor-pointer transition-colors ${
                  form.watch('visibility') === item.value 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted hover:bg-muted/50'
                }`}
                onClick={() => form.setValue('visibility', item.value as any)}
              >
                <div className="font-medium">{item.label}</div>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="schedulePublish">Planifier la publication (optionnel)</Label>
          <Input
            id="schedulePublish"
            type="datetime-local"
            {...form.register('schedulePublish')}
            className="mt-1 w-64"
          />
        </div>
        
        <div>
          <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
          <Input
            id="tags"
            placeholder="ex: tutoriel, éducation, technologie"
            {...form.register('tags')}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Aidez les utilisateurs à découvrir votre contenu
          </p>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          Retour
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publication en cours...' : 'Publier la vidéo'}
        </Button>
      </div>
    </form>
  );
};
