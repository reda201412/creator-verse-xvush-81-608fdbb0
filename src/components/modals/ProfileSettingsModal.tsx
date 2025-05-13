import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
  username: z.string().min(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
  }).regex(/^[a-z0-9_]+$/, {
    message: "Le nom d'utilisateur ne peut contenir que des lettres minuscules, des chiffres et des _",
  }),
  bio: z.string().max(500, {
    message: "La bio ne peut pas dépasser 500 caractères",
  }),
  avatar: z.string().url({
    message: "Veuillez entrer une URL valide",
  }).optional(),
  coverImage: z.string().url({
    message: "Veuillez entrer une URL valide",
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    name: string;
    username: string;
    bio: string;
    avatar: string;
    coverImage?: string;
  };
  onSave: (data: ProfileFormValues) => void;
}

const ProfileSettingsModal = ({ 
  open, 
  onOpenChange, 
  initialData,
  onSave
}: ProfileSettingsModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(data);
      
      toast("Profil mis à jour", {
        description: "Vos modifications ont été enregistrées avec succès."
      });
      
      onOpenChange(false);
    } catch (error) {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Paramètres du profil</DialogTitle>
          <DialogDescription>
            Personnalisez votre profil et vos préférences
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">@</span>
                        <Input placeholder="username" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo de profil (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Parlez de vous en quelques mots..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
              >
                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsModal;
