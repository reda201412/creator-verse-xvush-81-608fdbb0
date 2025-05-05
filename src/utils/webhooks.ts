
import { VideoMetadata } from '@/components/creator/VideoUploader';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const XVUSH_WEBHOOK_URL = 'https://xvush.com/api/webhooks/new-content';

/**
 * Notifies XVush about new shareable content
 * @param contentItem The content item to notify about
 * @returns Promise that resolves when notification is complete
 */
export const notifyXvush = async (contentItem: VideoMetadata): Promise<boolean> => {
  // Only notify if the content is free (standard type) or teaser and shareable
  if ((contentItem.type === 'standard' || contentItem.type === 'teaser') && contentItem.shareable) {
    try {
      console.log(`Notifying XVush about new ${contentItem.type} content: ${contentItem.title}`);
      
      // In a real implementation, we would use axios to post to the webhook
      // For demo purposes, we'll log and simulate success
      /*
      await axios.post(XVUSH_WEBHOOK_URL, {
        id: contentItem.id,
        title: contentItem.title,
        description: contentItem.description,
        contentType: contentItem.type,
        thumbnailUrl: contentItem.thumbnailUrl,
        createdAt: new Date().toISOString(),
        creatorId: '1', // This would come from the authenticated user
      });
      */
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Successfully notified XVush');
      return true;
    } catch (error) {
      console.error('Failed to notify XVush:', error);
      return false;
    }
  }
  
  // If content not eligible for sharing, just return true
  return true;
};

/**
 * React hook for using the XVush notification system
 */
export const useXvushNotifications = () => {
  const { toast } = useToast();
  
  const notifyAboutContent = async (contentItem: VideoMetadata) => {
    if ((contentItem.type === 'standard' || contentItem.type === 'teaser') && contentItem.shareable) {
      try {
        const success = await notifyXvush(contentItem);
        
        if (success) {
          toast({
            title: 'Contenu partagé',
            description: 'XVush a été notifié de votre nouveau contenu.',
          });
        } else {
          toast({
            title: 'Erreur de partage',
            description: 'Impossible de partager le contenu avec XVush.',
            variant: 'destructive',
          });
        }
        
        return success;
      } catch (error) {
        toast({
          title: 'Erreur de partage',
          description: 'Une erreur est survenue lors du partage avec XVush.',
          variant: 'destructive',
        });
        return false;
      }
    }
    return true;
  };
  
  return { notifyAboutContent };
};
