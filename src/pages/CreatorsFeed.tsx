
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // TabsContent n'est pas utilisé ici directement
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CreatorCard from '@/components/creator/CreatorCard';
import StoriesTimeline from '@/components/stories/StoriesTimeline';
import StoryPublisher from '@/components/stories/StoryPublisher';
import { getAllCreators, CreatorProfileData } from '@/services/creatorService'; // Modifié pour Firebase
import { Skeleton } from '@/components/ui/skeleton';

const CreatorsFeed: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [creators, setCreators] = useState<CreatorProfileData[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<CreatorProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedCreators = await getAllCreators(); // Utilise le service Firebase
        setCreators(fetchedCreators);
        // setFilteredCreators(fetchedCreators); // Le filtrage se fera dans le prochain useEffect
      } catch (err: any) {
        console.error('Failed to fetch creators:', err);
        setError('Impossible de charger les créateurs. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

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
          (creator.displayName && creator.displayName.toLowerCase().includes(query)) ||
          (creator.bio && creator.bio.toLowerCase().includes(query))
      );
    }

    // Filtrer par onglet (isOnline est simulé pour l'instant dans le service)
    if (activeTab === 'online') {
      // Note: la propriété `isOnline` est simulée dans le service actuel.
      // Une vraie gestion du statut en ligne nécessiterait une solution de présence (ex: Firestore + Functions, ou Realtime Database).
      processedCreators = processedCreators.filter(creator => creator.isOnline);
    } else if (activeTab === 'popular') {
      // Note: les métriques de popularité (followers) ne sont pas chargées par `getAllCreators` pour la performance.
      // Pour un tri par popularité réel, ces données devraient être sur l'objet créateur ou chargées différemment.
      // Pour l'instant, on ne trie pas ou on pourrait trier par un autre critère si disponible (ex: date de création).
      // processedCreators = processedCreators.sort((a, b) => 
      //   (b.metrics?.followers || 0) - (a.metrics?.followers || 0)
      // );
      // Pour l'exemple, trions par nom d'utilisateur si aucune métrique n'est disponible pour le tri
      processedCreators.sort((a, b) => a.username.localeCompare(b.username));
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
    getAllCreators()
      .then(fetchedCreators => {
        setCreators(fetchedCreators);
      })
      .catch(err => {
        console.error('Failed to refetch creators:', err);
        setError('Impossible de charger les créateurs. Veuillez réessayer.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Créateurs</h1>
        <StoryPublisher /> {/* Ce composant pourrait avoir besoin d'être adapté pour Firebase */}
      </div>
      
      <StoriesTimeline /> {/* Ce composant pourrait avoir besoin d'être adapté pour Firebase */}
      
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
        {/* Pas de TabsContent explicite ici, le contenu est rendu directement ci-dessous */}
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
              key={creator.uid} // Utiliser uid comme clé unique
              id={creator.uid} // Passer l'uid
              username={creator.username}
              displayName={creator.displayName || creator.username}
              avatarUrl={creator.avatarUrl || 'https://via.placeholder.com/150'} // Utiliser avatarUrl
              bio={creator.bio || 'Aucune bio disponible'}
              // Les métriques comme followersCount ne sont pas chargées par getAllCreators pour le moment
              // followersCount={creator.metrics?.followers || 0} 
              isOnline={creator.isOnline || false} // isOnline est simulé
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
