import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; 
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CreatorCard from '@/components/creator/CreatorCard';
import StoriesTimeline from '@/components/stories/StoriesTimeline';
import StoryPublisher from '@/components/stories/StoryPublisher';
import { getCreators, CreatorProfile } from '@/services/creatorService'; 
import { Skeleton } from '@/components/ui/skeleton';
import { adaptCreatorProfile, StandardizedCreatorProfile } from '@/utils/creator-profile-adapter';
import { useStories } from '@/hooks/use-stories';
import { Story } from '@/types/stories'; // Import Story type

const CreatorsFeed: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<StandardizedCreatorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublisherOpen, setIsPublisherOpen] = useState(false);
  const { publishStory } = useStories();

  useEffect(() => {
    const fetchCreators = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const creatorsData = await getCreators();
        setCreators(creatorsData);
      } catch (error) {
        console.error('Error fetching creators:', error);
        toast({
          title: "Error",
          description: "Failed to load creators",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }, []);

    fetchCreators();
  }, []);

  useEffect(() => {
    // Ce useEffect gère le filtrage et la recherche quand `creators`, `searchQuery` ou `activeTab` changent
    if (!creators) return;

    let processedCreators = [...creators];
    const query = searchQuery.toLowerCase().trim();

    // Filtrer par recherche
    if (query) {
      processedCreators = processedCreators.filter(
        creator => 
          creator.username.toLowerCase().includes(query) || 
          creator.displayName.toLowerCase().includes(query) ||
          (creator.bio && creator.bio.toLowerCase().includes(query))
      );
    }

    // Filtrer par onglet (isOnline est simulé pour l'instant dans le service)
    if (activeTab === 'online') {
      processedCreators = processedCreators.filter(creator => creator.isOnline);
    } else if (activeTab === 'popular') {
      processedCreators = processedCreators.sort((a, b) => 
        (b.followersCount || 0) - (a.followersCount || 0)
      );
    }

    setFilteredCreators(processedCreators);
  }, [searchQuery, activeTab, creators]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Bouton pour recharger les créateurs en cas d'erreur
  const handleRetryFetch = () => {
    setIsLoading(true);
    setError(null);
    getCreators()
      .then(creatorsData => {
        setCreators(creatorsData);
      })
      .catch(err => {
        console.error('Failed to refetch creators:', err);
        setError('Impossible de charger les créateurs. Veuillez réessayer.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle story publication
  const handlePublishStory = async (formData: FormData): Promise<Story | null> => {
    try {
      const mediaFile = formData.get('mediaFile') as File;
      const thumbnailFile = formData.get('thumbnailFile') as File || null;
      const caption = formData.get('caption') as string;
      const filter = formData.get('filter') as string;
      
      // Create a story upload object
      const result = await publishStory({
        mediaFile,
        thumbnailFile, 
        caption,
        filter
      });
      
      setIsPublisherOpen(false);
      return result;
    } catch (error) {
      console.error('Error publishing story:', error);
      return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Créateurs</h1>
        <StoryPublisher
          isOpen={isPublisherOpen}
          onClose={() => setIsPublisherOpen(false)}
          onPublish={handlePublishStory}
        />
      </div>
      
      <StoriesTimeline 
        storyGroups={[]} 
        onStoryClick={(index) => storiesContext.openViewer(index)}
      />
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un créateur..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="online">En ligne</TabsTrigger>
          <TabsTrigger value="popular">Populaires</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mt-4" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-lg text-red-500">{error}</p>
          <button 
            onClick={handleRetryFetch}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      ) : filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id} // Utiliser uid comme clé unique
              id={creator.id} // Passer l'uid
              username={creator.username}
              displayName={creator.displayName || creator.username}
              avatarUrl={creator.avatarUrl || 'https://via.placeholder.com/150'}
              bio={creator.bio || 'Aucune bio disponible'}
              followersCount={creator.followersCount || 0}
              isOnline={creator.isOnline || false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Aucun créateur trouvé correspondant à vos critères.</p>
        </div>
      )}
    </div>
  );
};

export default CreatorsFeed;
