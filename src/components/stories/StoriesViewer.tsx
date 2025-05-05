
import React, { useState, useEffect, useRef } from 'react';
import { Story } from '@/types/stories';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, MessageCircle, Heart, Share } from 'lucide-react';
import { useStories } from '@/hooks/use-stories';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useAuth } from '@/contexts/AuthContext';

interface StoriesViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialGroupIndex?: number;
}

const StoriesViewer: React.FC<StoriesViewerProps> = ({
  isOpen,
  onClose,
  initialGroupIndex = 0
}) => {
  const {
    storyGroups,
    activeStoryIndex,
    activeGroupIndex,
    loadStories,
    nextStory,
    prevStory,
    markStoryAsViewed,
    setActiveGroupIndex,
    setActiveStoryIndex
  } = useStories();
  
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const viewStartTimeRef = useRef<number>(Date.now());
  
  const { triggerMicroReward } = useNeuroAesthetic();
  const { user } = useAuth();
  
  // Initialiser avec le groupe initial si fourni
  useEffect(() => {
    if (isOpen && initialGroupIndex !== undefined && storyGroups.length > 0) {
      const validIndex = Math.min(initialGroupIndex, storyGroups.length - 1);
      setActiveGroupIndex(validIndex);
      setActiveStoryIndex(0);
    }
  }, [isOpen, initialGroupIndex, storyGroups.length, setActiveGroupIndex, setActiveStoryIndex]);
  
  // Story actuelle
  const currentGroup = storyGroups[activeGroupIndex] || null;
  const currentStory = currentGroup?.stories[activeStoryIndex] || null;
  
  // Gérer le timer pour passer à la story suivante
  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) return;
    
    const duration = currentStory.duration * 1000; // Convertir en millisecondes
    
    // Réinitialiser le progrès
    setProgress(0);
    
    // Enregistrer le moment où l'utilisateur a commencé à voir la story
    viewStartTimeRef.current = Date.now();
    
    // Marquer la story comme vue
    markStoryAsViewed(currentStory.id);
    
    // Animation de progression
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressValue = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressValue);
      
      if (progressValue < 100) {
        timerRef.current = window.requestAnimationFrame(updateProgress);
      } else {
        // Passer à la story suivante
        nextStory();
      }
    };
    
    timerRef.current = window.requestAnimationFrame(updateProgress);
    
    return () => {
      if (timerRef.current !== null) {
        window.cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isOpen, currentStory, isPaused, nextStory, markStoryAsViewed]);
  
  // Nettoyer en fermant
  const handleClose = () => {
    if (timerRef.current !== null) {
      window.cancelAnimationFrame(timerRef.current);
    }
    
    // Enregistrer la durée de visionnage si une story est active
    if (currentStory) {
      const viewDuration = Math.round((Date.now() - viewStartTimeRef.current) / 1000);
      markStoryAsViewed(currentStory.id, viewDuration);
    }
    
    onClose();
  };
  
  // Naviguer entre les stories
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextStory();
  };
  
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    prevStory();
  };
  
  // Gérer les interactions tactiles
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    
    // Enregistrer la position initiale du toucher
    const touchX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;
    
    // Toucher sur le côté gauche (1/3) -> story précédente
    if (touchX < screenWidth / 3) {
      prevStory();
    }
    // Toucher sur le côté droit (1/3) -> story suivante
    else if (touchX > (screenWidth * 2) / 3) {
      nextStory();
    }
  };
  
  const handleTouchEnd = () => {
    setIsPaused(false);
  };
  
  // Gérer les interactions avec le contenu
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Déterminer si le clic est à gauche ou à droite
    const clickX = e.clientX;
    const elementWidth = (e.currentTarget as HTMLElement).offsetWidth;
    
    if (clickX < elementWidth / 2) {
      prevStory();
    } else {
      nextStory();
    }
  };
  
  const handleInteraction = (type: 'like' | 'comment' | 'share') => {
    switch (type) {
      case 'like':
        triggerMicroReward('like', { type: 'story_liked' });
        break;
      case 'comment':
        triggerMicroReward('message', { type: 'story_comment' });
        break;
      case 'share':
        triggerMicroReward('share', { type: 'story_shared' });
        break;
    }
  };
  
  // Charger les stories lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      loadStories();
    }
  }, [isOpen, loadStories]);
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="p-0 max-w-md h-[90vh] max-h-[90vh] bg-black relative overflow-hidden">
        {currentStory ? (
          <>
            {/* Barre de progression */}
            <div className="absolute top-0 left-0 right-0 z-10 flex space-x-1 p-2 bg-gradient-to-b from-black/80 to-transparent">
              {currentGroup?.stories.map((_, index) => (
                <Progress 
                  key={index} 
                  value={index === activeStoryIndex ? progress : (index < activeStoryIndex ? 100 : 0)} 
                  className="h-1 flex-1"
                />
              ))}
            </div>
            
            {/* Info du créateur */}
            <div className="absolute top-6 left-0 right-0 z-10 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 border border-white">
                  <AvatarImage src={currentGroup?.creator.avatar_url || undefined} />
                  <AvatarFallback>
                    {currentGroup?.creator.display_name?.charAt(0) || currentGroup?.creator.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-medium">
                    {currentGroup?.creator.display_name || currentGroup?.creator.username}
                  </p>
                  <p className="text-gray-300 text-xs">
                    {currentStory.created_at && formatDistanceToNow(new Date(currentStory.created_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Contenu principal */}
            <div 
              className="h-full w-full flex items-center justify-center bg-gray-900"
              onClick={handleContentClick}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {currentStory.media_url.includes('.mp4') || 
               currentStory.media_url.includes('.webm') ? (
                <video 
                  src={currentStory.media_url}
                  autoPlay
                  playsInline
                  muted
                  loop
                  className={`max-h-full max-w-full object-contain ${
                    currentStory.filter_used && currentStory.filter_used !== 'none' 
                      ? `filter-${currentStory.filter_used}` 
                      : ''
                  }`}
                />
              ) : (
                <img 
                  src={currentStory.media_url}
                  alt="Story"
                  className={`max-h-full max-w-full object-contain ${
                    currentStory.filter_used && currentStory.filter_used !== 'none' 
                      ? `filter-${currentStory.filter_used}` 
                      : ''
                  }`}
                />
              )}
            </div>
            
            {/* Légende et tags */}
            {(currentStory.caption || currentStory.tags?.length) && (
              <div className="absolute bottom-16 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
                {currentStory.caption && (
                  <p className="text-white text-sm mb-2">{currentStory.caption}</p>
                )}
                
                {currentStory.tags && currentStory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {currentStory.tags.map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant="secondary" 
                        className="bg-white/20 hover:bg-white/30"
                      >
                        #{tag.tag_name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Boutons d'interaction */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={() => handleInteraction('like')}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={() => handleInteraction('comment')}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={() => handleInteraction('share')}
                >
                  <Share className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Boutons de navigation */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:bg-black/30 z-20"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:bg-black/30 z-20"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <p className="text-white text-center p-8">
              {storyGroups.length === 0
                ? "Aucune story disponible. Soyez le premier à partager une story !"
                : "Chargement..."}
            </p>
            <Button variant="outline" onClick={handleClose}>
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoriesViewer;
