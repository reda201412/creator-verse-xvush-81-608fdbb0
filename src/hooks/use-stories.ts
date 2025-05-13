import { useState, useEffect, useCallback } from 'react';
import { Story, StoryGroup, StoryUploadParams } from '@/types/stories';
import { StoriesService } from '@/services/stories.service';
import { useAuth } from '@/contexts/AuthContext';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useToast } from '@/hooks/use-toast';
import { FirestoreStory, adaptFirestoreStoriesToStories, adaptFirestoreStoryToStory } from '@/utils/story-types';

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const { user, profile } = useAuth();
  const { triggerMicroReward } = useNeuroAesthetic();
  const { toast } = useToast();

  // Charger les stories
  const loadStories = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const activeStories = await StoriesService.getActiveStories();
      setStories(adaptFirestoreStoriesToStories(activeStories as unknown as FirestoreStory[]));
      
      // Grouper les stories par créateur
      const groups: Record<string, StoryGroup> = {};
      
      activeStories.forEach(story => {
        const fsStory = story as unknown as FirestoreStory;
        if (!fsStory.creatorId) return;
        
        const creatorId = fsStory.creatorId;
        if (!groups[creatorId]) {
          groups[creatorId] = {
            creator: story.creator,
            stories: [],
            lastUpdated: story.created_at,
            hasUnviewed: false
          };
        }
        
        groups[creatorId].stories.push(story);
        
        // Mettre à jour lastUpdated si cette story est plus récente
        if (new Date(story.created_at) > new Date(groups[creatorId].lastUpdated)) {
          groups[creatorId].lastUpdated = story.created_at;
        }
        
        // Vérifier si la story n'a pas été vue
        if (!story.viewed) {
          groups[creatorId].hasUnviewed = true;
        }
      });
      
      // Convertir en tableau et trier par dernier mis à jour
      const groupArray = Object.values(groups).sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
      
      setStoryGroups(groupArray);
    } catch (error) {
      console.error('Error loading stories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les stories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, triggerMicroReward]);
  
  // Créer une nouvelle story
  const createStory = useCallback(async (params: StoryUploadParams) => {
    if (!user || !profile) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier une story",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const newStory = await StoriesService.createStory(params, user.id);
      
      // Mettre à jour la liste des stories
      setStories(prev => [adaptFirestoreStoryToStory(newStory as unknown as FirestoreStory), ...prev]);
      
      // Déclencher une micro-récompense
      triggerMicroReward('creative', { type: 'story_created' });
      
      toast({
        title: "Succès",
        description: "Votre story a été publiée",
      });
      
      return newStory;
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre story",
        variant: "destructive"
      });
      return null;
    }
  }, [user, profile, toast, triggerMicroReward]);
  
  // Marquer une story comme vue
  const markStoryAsViewed = useCallback(async (storyId: string, viewDuration: number = 0) => {
    if (!user) return;
    
    try {
      await StoriesService.markStoryAsViewed(storyId as string, viewDuration);
      
      // Mettre à jour l'état local
      setStories(prev => 
        prev.map(story => 
          story.id === storyId ? { ...story, viewed: true } : story
        )
      );
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  }, [user]);
  
  // Supprimer une story
  const deleteStory = useCallback(async (storyId: string) => {
    if (!user) return false;
    
    try {
      await StoriesService.deleteStory(storyId);
      
      // Mettre à jour l'état local
      setStories(prev => prev.filter(story => story.id !== storyId));
      
      toast({
        title: "Succès",
        description: "Story supprimée avec succès",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la story",
        variant: "destructive"
      });
      return false;
    }
  }, [user, toast]);
  
  // Navigation dans les stories
  const nextStory = useCallback(() => {
    if (!storyGroups.length) return;
    
    const currentGroup = storyGroups[activeGroupIndex];
    if (activeStoryIndex < currentGroup.stories.length - 1) {
      // Passer à la story suivante dans le même groupe
      setActiveStoryIndex(prev => prev + 1);
    } else {
      // Passer au groupe suivant
      if (activeGroupIndex < storyGroups.length - 1) {
        setActiveGroupIndex(prev => prev + 1);
        setActiveStoryIndex(0);
      } else {
        // Retour au premier groupe
        setActiveGroupIndex(0);
        setActiveStoryIndex(0);
      }
    }
  }, [storyGroups, activeGroupIndex, activeStoryIndex]);
  
  const prevStory = useCallback(() => {
    if (!storyGroups.length) return;
    
    if (activeStoryIndex > 0) {
      // Passer à la story précédente dans le même groupe
      setActiveStoryIndex(prev => prev - 1);
    } else {
      // Passer au groupe précédent
      if (activeGroupIndex > 0) {
        setActiveGroupIndex(prev => prev - 1);
        const prevGroupLength = storyGroups[activeGroupIndex - 1].stories.length;
        setActiveStoryIndex(prevGroupLength - 1);
      } else {
        // Aller au dernier groupe
        setActiveGroupIndex(storyGroups.length - 1);
        const lastGroupLength = storyGroups[storyGroups.length - 1].stories.length;
        setActiveStoryIndex(lastGroupLength - 1);
      }
    }
  }, [storyGroups, activeGroupIndex, activeStoryIndex]);
  
  // Initialiser les stories au chargement du composant
  useEffect(() => {
    loadStories();
  }, [loadStories]);
  
  // Obtenir la story active actuelle
  const activeStory = storyGroups.length > 0 && activeGroupIndex < storyGroups.length
    ? storyGroups[activeGroupIndex].stories[activeStoryIndex]
    : null;
  
  return {
    stories,
    storyGroups,
    loading,
    activeStory,
    activeStoryIndex,
    activeGroupIndex,
    loadStories,
    createStory,
    markStoryAsViewed,
    deleteStory,
    nextStory,
    prevStory,
    setActiveGroupIndex,
    setActiveStoryIndex
  };
};
