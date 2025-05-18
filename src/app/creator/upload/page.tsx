'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedVideoUploader } from '@/components/creator/EnhancedUploader';
import { toast } from 'sonner';

export default function UploadPage() {
  const { user } = useAuth();
  const [isCreator, setIsCreator] = useState(true);

  const handleUploadComplete = (metadata?: any) => {
    console.log('Upload complete with metadata:', metadata);
    
    toast.success('Vidéo téléversée avec succès', {
      description: 'Votre vidéo est en cours de traitement et sera bientôt disponible.'
    });
    
    // Rediriger vers la page de la vidéo ou mettre à jour l'état de l'application
  };

  // Vérifier si l'utilisateur est un créateur
  // Cela pourrait être une vérification côté serveur ou une propriété de l'utilisateur
  // Ici, nous utilisons un état simple pour l'exemple
  // Dans une application réelle, vous voudriez probablement vérifier cela côté serveur
  
  if (!isCreator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Accès réservé aux créateurs</h1>
          <p className="text-muted-foreground">
            Vous devez être un créateur vérifié pour téléverser des vidéos.
          </p>
          <button
            onClick={() => setIsCreator(true)} // Dans une vraie app, cela serait géré par un système d'autorisation
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Devenir créateur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Téléverser une vidéo</h1>
            <p className="text-muted-foreground">
              Partagez votre contenu avec la communauté XDose
            </p>
          </div>
          
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <EnhancedVideoUploader 
              onUploadComplete={handleUploadComplete} 
              isCreator={isCreator} 
            />
          </div>
          
          <div className="bg-muted/50 rounded-lg p-6 text-sm text-muted-foreground">
            <h3 className="font-medium mb-2">Conseils pour un téléversement réussi :</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Utilisez des formats MP4, WebM ou MOV pour une meilleure compatibilité</li>
              <li>La taille maximale des fichiers est de 500 Mo</li>
              <li>Ajoutez un titre descriptif et des balises pertinentes</li>
              <li>Vérifiez que votre vidéo respecte nos directives communautaires</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
