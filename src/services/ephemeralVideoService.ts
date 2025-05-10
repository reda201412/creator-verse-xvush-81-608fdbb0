
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Vérifie si une vidéo est accessible en fonction des contraintes éphémères
 * @param videoId L'identifiant de la vidéo
 * @returns Un objet indiquant si la vidéo est accessible et pourquoi
 */
export const checkEphemeralAccess = async (videoId: string | number) => {
  try {
    // Convertir l'ID en nombre si nécessaire
    const numericId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
    
    // Récupérer les informations de la vidéo
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', numericId)
      .single();
    
    if (error || !video) {
      console.error('Erreur lors de la récupération des informations de la vidéo:', error);
      return { canAccess: false, reason: 'not_found' };
    }
    
    // Vérifier les contraintes éphémères
    if (video.ephemeral_options) {
      const { ephemeral_mode, expires_after, max_views, current_views } = video.ephemeral_options;
      
      // Si le mode éphémère est activé
      if (ephemeral_mode) {
        // Vérifier la date d'expiration
        if (expires_after) {
          const uploadDate = new Date(video.uploadedat);
          const expirationDate = new Date(uploadDate.getTime() + expires_after * 60 * 60 * 1000);
          
          if (new Date() > expirationDate) {
            return { canAccess: false, reason: 'expired' };
          }
        }
        
        // Vérifier le nombre de vues
        if (max_views && current_views >= max_views) {
          return { canAccess: false, reason: 'max_views_reached' };
        }
      }
    }
    
    // La vidéo est accessible
    return { canAccess: true };
  } catch (error) {
    console.error('Erreur lors de la vérification des contraintes éphémères:', error);
    return { canAccess: false, reason: 'error' };
  }
};

/**
 * Incrémente le compteur de vues pour une vidéo éphémère
 * @param videoId L'identifiant de la vidéo
 */
export const incrementEphemeralView = async (videoId: string | number) => {
  try {
    // Convertir l'ID en nombre si nécessaire
    const numericId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
    
    // Récupérer les informations de la vidéo
    const { data: video, error } = await supabase
      .from('videos')
      .select('ephemeral_options')
      .eq('id', numericId)
      .single();
    
    if (error || !video || !video.ephemeral_options) {
      console.error('Erreur lors de la récupération des informations éphémères:', error);
      return;
    }
    
    // Mettre à jour le compteur de vues
    const updatedOptions = {
      ...video.ephemeral_options,
      current_views: (video.ephemeral_options.current_views || 0) + 1
    };
    
    await supabase
      .from('videos')
      .update({ 
        ephemeral_options: updatedOptions 
      })
      .eq('id', numericId);
      
    // Vérifier si le nombre maximum de vues est atteint
    if (updatedOptions.max_views && updatedOptions.current_views >= updatedOptions.max_views) {
      // Notifier le créateur que sa vidéo a atteint le nombre maximum de vues
      notifyCreator(numericId, 'max_views_reached');
    }
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des vues éphémères:', error);
  }
};

/**
 * Enregistre une capture d'écran détectée
 * @param videoId L'identifiant de la vidéo
 * @param userId L'identifiant de l'utilisateur qui a pris la capture
 */
export const recordScreenshot = async (videoId: string | number, userId: string) => {
  try {
    // Convertir l'ID en nombre si nécessaire
    const numericId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
    
    // Récupérer les informations de la vidéo
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', numericId)
      .single();
    
    if (error || !video) {
      console.error('Erreur lors de la récupération des informations de la vidéo:', error);
      return;
    }
    
    // Vérifier si la notification de capture d'écran est activée
    if (video.ephemeral_options?.notify_on_screenshot) {
      // Enregistrer la capture d'écran
      await supabase
        .from('video_screenshots')
        .insert({
          video_id: numericId,
          user_id: userId,
          timestamp: new Date().toISOString()
        });
      
      // Notifier le créateur
      notifyCreator(numericId, 'screenshot_taken', userId);
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la capture d\'écran:', error);
  }
};

/**
 * Envoie une notification au créateur d'une vidéo
 * @param videoId L'identifiant de la vidéo
 * @param type Le type de notification
 * @param triggerUserId L'identifiant de l'utilisateur qui a déclenché la notification (optionnel)
 */
const notifyCreator = async (videoId: number, type: 'max_views_reached' | 'screenshot_taken' | 'expiration_soon', triggerUserId?: string) => {
  try {
    // Récupérer les informations de la vidéo et du créateur
    const { data: video, error } = await supabase
      .from('videos')
      .select('*, user_profiles:user_id(*)')
      .eq('id', videoId)
      .single();
    
    if (error || !video) {
      console.error('Erreur lors de la récupération des informations du créateur:', error);
      return;
    }
    
    let message = '';
    let title = '';
    
    switch (type) {
      case 'max_views_reached':
        title = 'Limite de vues atteinte';
        message = `Votre vidéo "${video.title}" a atteint son nombre maximum de vues et n'est plus accessible.`;
        break;
      case 'screenshot_taken':
        title = 'Capture d\'écran détectée';
        message = `Un utilisateur a pris une capture d'écran de votre vidéo "${video.title}".`;
        break;
      case 'expiration_soon':
        title = 'Expiration imminente';
        message = `Votre vidéo "${video.title}" expirera bientôt.`;
        break;
    }
    
    // Enregistrer la notification dans la base de données
    await supabase
      .from('creator_notifications')
      .insert({
        creator_id: video.user_id,
        video_id: videoId,
        title,
        message,
        type: 'ephemeral_alert',
        metadata: {
          alert_type: type,
          trigger_user_id: triggerUserId
        },
        is_read: false
      });
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification au créateur:', error);
  }
};

/**
 * Détecte les captures d'écran depuis le navigateur
 * @param videoId L'identifiant de la vidéo
 * @param userId L'identifiant de l'utilisateur
 * @returns Une fonction pour arrêter la détection
 */
export const detectScreenshots = (videoId: string | number, userId: string): () => void => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Détecter les combinaisons de touches communes pour les captures d'écran
    if (
      (e.key === 'PrintScreen') ||
      (e.ctrlKey && e.key === 'PrintScreen') ||
      (e.metaKey && e.key === '3') || // macOS screenshot
      (e.metaKey && e.key === '4') || // macOS area screenshot
      (e.metaKey && e.shiftKey && e.key === '3') || // macOS to clipboard
      (e.metaKey && e.shiftKey && e.key === '4') // macOS area to clipboard
    ) {
      handleScreenshotDetected();
    }
  };
  
  const handleScreenshotDetected = () => {
    // Notifier l'utilisateur
    toast.warning("Capture d'écran détectée", {
      description: "Les captures d'écran de ce contenu sont enregistrées et le créateur en est informé."
    });
    
    // Enregistrer la capture d'écran
    recordScreenshot(videoId, userId);
  };
  
  // Activer la détection de visibilité
  let hidden: string;
  let visibilityChange: string;
  
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof (document as any).msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof (document as any).webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }
  
  const handleVisibilityChange = () => {
    // Si l'utilisateur change de fenêtre, cela peut indiquer une tentative de capture d'écran
    if (document[hidden as keyof Document] === true) {
      setTimeout(() => {
        // Vérifier si l'utilisateur revient rapidement (possible capture d'écran)
        if (document[hidden as keyof Document] === false) {
          handleScreenshotDetected();
        }
      }, 300);
    }
  };
  
  // Ajouter les écouteurs d'événement
  window.addEventListener('keydown', handleKeyDown);
  document.addEventListener(visibilityChange, handleVisibilityChange);
  
  // Retourner une fonction pour nettoyer
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener(visibilityChange, handleVisibilityChange);
  };
};
