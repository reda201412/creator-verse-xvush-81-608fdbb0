import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useStories } from '@/hooks/use-stories';
import StoriesTimeline from '@/components/stories/StoriesTimeline';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, EyeIcon, Heart, MessageCircle, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

const Stories: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { storyGroups, loading, loadStories, deleteStory } = useStories();
  const { toast } = useToast();
  const { triggerMicroReward } = useNeuroAesthetic();
  
  useEffect(() => {
    loadStories();
    
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(() => {
      loadStories();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [loadStories]);
  
  const handleDeleteStory = async (storyId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette story?')) {
      const success = await deleteStory(storyId);
      if (success) {
        toast({
          title: "Story supprimée",
          description: "Votre story a été supprimée avec succès"
        });
        
        triggerMicroReward('action', { type: 'story_deleted' });
      }
    }
  };
  
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse h-8 w-1/4 bg-gray-300 rounded mb-8" />
        <div className="animate-pulse h-16 bg-gray-300 rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse h-64 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Consultez les Stories</h1>
        <p className="text-muted-foreground mb-8">
          Connectez-vous pour découvrir et partager des stories éphémères
        </p>
        <Button asChild>
          <a href="/auth">Se connecter</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Stories</h1>
      <p className="text-muted-foreground mb-6">
        Explorez les stories éphémères de vos créateurs préférés
      </p>
      
      <StoriesTimeline />
      
      <Tabs defaultValue="explore" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="explore">Explorer</TabsTrigger>
          <TabsTrigger value="mybadge">Mes Stories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-gray-300 rounded" />
              ))
            ) : storyGroups.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  Aucune story disponible pour le moment
                </p>
              </div>
            ) : (
              storyGroups.flatMap(group => group.stories)
                .filter(story => story.creator_id !== user?.id)
                .map(story => (
                  <Card key={story.id} className="overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      {story.thumbnail_url ? (
                        <img 
                          src={story.thumbnail_url} 
                          alt={story.caption || "Story thumbnail"} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <EyeIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2 bg-black/70">
                        {story.format}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{story.view_count} vues</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(story.created_at), { 
                              addSuffix: true,
                              locale: fr
                            })}
                          </span>
                        </div>
                      </div>
                      {story.caption && (
                        <p className="text-sm line-clamp-2 mb-2">{story.caption}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mybadge">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-gray-300 rounded" />
              ))
            ) : storyGroups.flatMap(group => group.stories)
                .filter(story => story.creator_id === user?.id).length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas encore publié de stories
                </p>
                <Button>Créer une story</Button>
              </div>
            ) : (
              storyGroups.flatMap(group => group.stories)
                .filter(story => story.creator_id === user?.id)
                .map(story => (
                  <Card key={story.id} className="overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      {story.thumbnail_url ? (
                        <img 
                          src={story.thumbnail_url} 
                          alt={story.caption || "Story thumbnail"} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <EyeIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2 bg-black/70">
                        {story.format}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{story.view_count} vues</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(story.created_at), { 
                              addSuffix: true,
                              locale: fr
                            })}
                          </span>
                        </div>
                      </div>
                      {story.caption && (
                        <p className="text-sm line-clamp-2 mb-2">{story.caption}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteStory(story.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Stories;
