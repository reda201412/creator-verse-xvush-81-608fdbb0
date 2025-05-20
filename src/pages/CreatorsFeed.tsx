import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search } from 'lucide-react';
import CreatorCard from '@/components/creator/CreatorCard';
import { CreatorProfileData } from '@/vite-env';
import StoryPublisher from '@/components/stories/StoryPublisher';

const CreatorsFeed = () => {
  const [creators, setCreators] = useState<CreatorProfileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStoryPublisher, setShowStoryPublisher] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulating API fetch with timeout
    const fetchCreators = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - in a real app this would come from an API
        const mockCreators = [
          {
            id: "c1",
            uid: "u1",
            username: "sophia_creative",
            displayName: "Sophia Creative",
            bio: "Digital artist exploring the boundaries between reality and imagination.",
            avatarUrl: "https://i.pravatar.cc/300?img=1",
            isPremium: true,
            isOnline: true,
            metrics: {
              followers: 12400,
              likes: 85600,
              rating: 4.8 // Changed to number from string
            }
          },
          {
            id: "c2",
            uid: "u2",
            username: "mark_the_mentor",
            displayName: "Mark The Mentor",
            bio: "Guiding the next generation of developers with practical advice and tutorials.",
            avatarUrl: "https://i.pravatar.cc/300?img=2",
            isPremium: false,
            isOnline: false,
            metrics: {
              followers: 8900,
              likes: 52300,
              rating: 4.5 // Changed to number from string
            }
          },
          {
            id: "c3",
            uid: "u3",
            username: "lisa_the_linguist",
            displayName: "Lisa The Linguist",
            bio: "Sharing the beauty of languages and cultures from around the world.",
            avatarUrl: "https://i.pravatar.cc/300?img=3",
            isPremium: true,
            isOnline: true,
            metrics: {
              followers: 15600,
              likes: 91200,
              rating: 4.9 // Changed to number from string
            }
          },
          {
            id: "c4",
            uid: "u4",
            username: "eco_activist_emma",
            displayName: "Eco Activist Emma",
            bio: "Passionate about sustainability and inspiring others to live an eco-friendly lifestyle.",
            avatarUrl: "https://i.pravatar.cc/300?img=4",
            isPremium: false,
            isOnline: false,
            metrics: {
              followers: 7200,
              likes: 41800,
              rating: 4.3 // Changed to number from string
            }
          },
          {
            id: "c5",
            uid: "u5",
            username: "fitness_with_frank",
            displayName: "Fitness With Frank",
            bio: "Helping you achieve your fitness goals with fun and effective workout routines.",
            avatarUrl: "https://i.pravatar.cc/300?img=5",
            isPremium: true,
            isOnline: true,
            metrics: {
              followers: 11100,
              likes: 68900,
              rating: 4.7 // Changed to number from string
            }
          }
        ];
        
        setCreators(mockCreators as CreatorProfileData[]);
      } catch (error) {
        console.error("Error fetching creators:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les créateurs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCreators();
  }, []);
  
  const filterCreators = useCallback((creators: CreatorProfileData[]) => {
    if (!searchTerm) return creators;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return creators.filter(creator =>
      creator.displayName.toLowerCase().includes(lowerSearchTerm) ||
      creator.username.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm]);
  
  const recommendedCreators = () => {
    const onlineCreators = creators.filter(creator => creator.isOnline);
    const premiumCreators = creators.filter(creator => creator.isPremium);
    
    return {
      online: filterCreators(onlineCreators),
      premium: filterCreators(premiumCreators)
    };
  };
  
  const searchCreators = async () => {
    if (!searchTerm) {
      toast({
        title: "Information",
        description: "Veuillez saisir un terme de recherche",
      });
      return;
    }
    
    try {
      // Simulate API call
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSearchResults = [
        {
          id: "s1",
          uid: "su1",
          username: "search_sophia",
          displayName: "Search Sophia",
          bio: "Search result for Sophia.",
          avatarUrl: "https://i.pravatar.cc/300?img=6",
          isPremium: true,
          isOnline: true,
          metrics: {
            followers: 5000,
            likes: 25000,
            rating: 4.6 // Changed to number from string
          }
        },
        {
          id: "s2",
          uid: "su2",
          username: "search_mark",
          displayName: "Search Mark",
          bio: "Search result for Mark.",
          avatarUrl: "https://i.pravatar.cc/300?img=7",
          isPremium: false,
          isOnline: false,
          metrics: {
            followers: 3000,
            likes: 15000,
            rating: 4.2 // Changed to number from string
          }
        }
      ];
      
      setCreators(mockSearchResults as CreatorProfileData[]);
    } catch (error) {
      console.error("Error searching creators:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les créateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Découvrez de nouveaux créateurs</CardTitle>
          <CardDescription>
            Explorez et connectez-vous avec des créateurs talentueux.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Rechercher des créateurs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={searchCreators}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {searchTerm && creators.length === 0 && !loading && (
            <p className="text-muted-foreground">Aucun créateur trouvé pour "{searchTerm}"</p>
          )}
        </CardContent>
      </Card>
      
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Créateurs recommandés
        </h2>
        
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterCreators(creators).map((creator) => (
              <CreatorCard
                key={creator.id}
                id={creator.id}
                username={creator.username}
                displayName={creator.displayName}
                avatarUrl={creator.avatarUrl}
                bio={creator.bio}
                followersCount={creator.metrics?.followers || 0}
                isOnline={creator.isOnline}
              />
            ))}
          </div>
        )}
      </section>
      
      {showStoryPublisher && (
        <StoryPublisher onCancel={() => setShowStoryPublisher(false)} />
      )}
    </div>
  );
};

export default CreatorsFeed;
