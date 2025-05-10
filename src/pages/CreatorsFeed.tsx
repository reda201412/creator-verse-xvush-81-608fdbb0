
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CreatorCard from '@/components/creator/CreatorCard';
import StoriesTimeline from '@/components/stories/StoriesTimeline';
import StoryPublisher from '@/components/stories/StoryPublisher';
import { getAllCreators, CreatorProfile } from '@/services/creatorService';
import { Skeleton } from '@/components/ui/skeleton';

const CreatorsFeed: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<CreatorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        const fetchedCreators = await getAllCreators();
        setCreators(fetchedCreators);
        setFilteredCreators(fetchedCreators);
      } catch (error) {
        console.error('Failed to fetch creators:', error);
        setError('Impossible de charger les créateurs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, []);

  useEffect(() => {
    if (!creators.length) return;

    const query = searchQuery.toLowerCase().trim();
    let filtered = [...creators];

    // Filtrer par recherche
    if (query) {
      filtered = filtered.filter(
        creator => 
          creator.username.toLowerCase().includes(query) || 
          creator.display_name?.toLowerCase().includes(query) ||
          creator.bio?.toLowerCase().includes(query)
      );
    }

    // Filtrer par onglet
    if (activeTab === 'online') {
      filtered = filtered.filter(creator => creator.isOnline);
    } else if (activeTab === 'popular') {
      filtered = filtered.sort((a, b) => 
        (b.metrics?.followers || 0) - (a.metrics?.followers || 0)
      );
    }

    setFilteredCreators(filtered);
  }, [searchQuery, activeTab, creators]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Créateurs</h1>
        <StoryPublisher />
      </div>
      
      <StoriesTimeline />
      
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
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
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
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Réessayer
          </button>
        </div>
      ) : filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              id={creator.id}
              username={creator.username}
              displayName={creator.display_name || creator.username}
              avatarUrl={creator.avatar_url || 'https://via.placeholder.com/150'}
              bio={creator.bio || 'Aucune bio disponible'}
              followersCount={creator.metrics?.followers || 0}
              isOnline={creator.isOnline || false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Aucun créateur trouvé</p>
        </div>
      )}
    </div>
  );
};

export default CreatorsFeed;
