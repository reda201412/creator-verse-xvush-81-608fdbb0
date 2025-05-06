
import { Story } from '@/types/stories';
import { MediaCacheService } from '@/services/media-cache.service';

export const StoryCacheService = {
  // Précharger les médias des stories pour de meilleures performances
  async preCacheStoryMedia(stories: Story[]): Promise<void> {
    if (!stories || stories.length === 0 || !MediaCacheService.isCacheAvailable()) {
      return;
    }
    
    // Optimisation: traiter en lots et en priorité décroissante
    
    // 1. Extraire toutes les URLs des thumbnails (haute priorité)
    const thumbnailUrls = stories
      .filter(s => s.thumbnail_url)
      .map(s => s.thumbnail_url as string);
    
    // 2. Identifier les vidéos des premières stories (priorité moyenne)
    const priorityVideoUrls = stories
      .slice(0, 3)  // Les 3 premières stories seulement
      .filter(s => s.media_url.includes('.mp4') || s.media_url.includes('.webm'))
      .map(s => s.media_url);
    
    // 3. Autres médias (priorité faible)
    const otherMediaUrls = stories
      .slice(3)  // Le reste des stories
      .filter(s => s.media_url.includes('.mp4') || s.media_url.includes('.webm'))
      .map(s => s.media_url);
    
    // Préchargement asynchrone pour ne pas bloquer l'UI
    try {
      // Précharger en parallèle (mais avec des timeouts différés pour la priorité)
      Promise.all([
        // Haute priorité: immédiat
        thumbnailUrls.length > 0 ? 
          MediaCacheService.preCacheVideos(thumbnailUrls).catch(console.warn) : 
          Promise.resolve([]),
        
        // Priorité moyenne: court délai
        new Promise(resolve => {
          if (priorityVideoUrls.length > 0) {
            setTimeout(() => {
              // Préchargement HEAD pour les vidéos prioritaires
              Promise.all(
                priorityVideoUrls.map(url => 
                  fetch(url, { method: 'HEAD' })
                    .then(() => url)
                    .catch(() => '')
                )
              ).then(resolve).catch(console.warn);
            }, 100);
          } else {
            resolve([]);
          }
        }),
        
        // Priorité faible: délai plus long
        new Promise(resolve => {
          if (otherMediaUrls.length > 0) {
            setTimeout(() => {
              // Juste méta-données pour les autres médias
              Promise.all(
                otherMediaUrls.slice(0, 5).map(url => 
                  fetch(url, { 
                    method: 'HEAD',
                    priority: 'low' // Pour les navigateurs supportant cette option
                  })
                    .then(() => url)
                    .catch(() => '')
                )
              ).then(resolve).catch(console.warn);
            }, 2000);
          } else {
            resolve([]);
          }
        })
      ]);
    } catch (err) {
      console.warn('Failed to pre-cache some media:', err);
    }
  }
};
