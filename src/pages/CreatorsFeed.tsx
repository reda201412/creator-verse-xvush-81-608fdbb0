
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Eye, Search } from 'lucide-react';
import ProfileAvatar from '@/components/ProfileAvatar';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { followCreator, unfollowCreator, checkUserFollowStatus, getAllCreators } from '@/integrations/supabase/client';

interface Creator {
  id: string;
  userId: string;
  username: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  type?: string;
  followers?: number;
  content?: number;
  featuredImage?: string;
}

const CreatorsFeed: React.FC = () => {
  const { triggerMicroReward } = useNeuroAesthetic();
  const { user } = useAuth();
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch creators from Supabase
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const { data, error } = await getAllCreators();
        
        if (error) throw error;
        
        if (data) {
          const formattedCreators = data.map(creator => ({
            id: creator.id,
            userId: creator.id,
            username: creator.username || 'utilisateur',
            name: creator.display_name || creator.username || 'Créateur',
            avatar_url: creator.avatar_url,
            bio: creator.bio || 'Créateur de contenu',
            type: Math.random() > 0.7 ? 'platinum' : Math.random() > 0.5 ? 'gold' : 'silver',
            followers: Math.floor(Math.random() * 20000),
            content: Math.floor(Math.random() * 200),
            featuredImage: `https://source.unsplash.com/random/800x600?portrait&sig=${creator.id}`
          }));
          
          setCreators(formattedCreators);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des créateurs:', error);
        toast('Erreur lors du chargement des créateurs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreators();
  }, []);

  // Check follow status on component mount
  useEffect(() => {
    const loadFollowStatuses = async () => {
      if (!user || creators.length === 0) return;
      
      const states: Record<string, boolean> = {};
      
      for (const creator of creators) {
        try {
          const { data } = await checkUserFollowStatus(user.id, creator.userId);
          states[creator.userId] = !!data;
        } catch (error) {
          console.error(`Error checking follow status for ${creator.name}:`, error);
        }
      }
      
      setFollowingStates(states);
    };
    
    loadFollowStatuses();
  }, [user, creators]);

  const handleFollow = async (creatorId: string, creatorName: string) => {
    if (!user) {
      toast("Veuillez vous connecter pour suivre un créateur");
      return;
    }
    
    setLoadingStates(prev => ({ ...prev, [creatorId]: true }));
    
    try {
      const isCurrentlyFollowing = followingStates[creatorId];
      
      if (isCurrentlyFollowing) {
        // Unfollow
        await unfollowCreator(user.id, creatorId);
        setFollowingStates(prev => ({ ...prev, [creatorId]: false }));
        toast(`Vous ne suivez plus ${creatorName}`);
      } else {
        // Follow
        await followCreator(user.id, creatorId);
        setFollowingStates(prev => ({ ...prev, [creatorId]: true }));
        toast(`Vous suivez maintenant ${creatorName}`, {
          description: "Découvrez son contenu exclusif"
        });
        triggerMicroReward('like');
      }
    } catch (error) {
      console.error('Error following creator:', error);
      toast('Une erreur est survenue', {
        description: 'Veuillez réessayer plus tard'
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [creatorId]: false }));
    }
  };

  // Filter creators based on search term
  const filteredCreators = searchTerm
    ? creators.filter(creator => 
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : creators;

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Découvrir les créateurs</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher des créateurs" 
            className="pl-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Aucun créateur trouvé</h2>
          <p className="text-muted-foreground">Ajustez votre recherche ou revenez plus tard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <motion.div
              key={creator.id}
              className="rounded-xl overflow-hidden shadow-lg bg-card"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Image principale du créateur */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={creator.featuredImage || 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071'} 
                  alt={`Contenu de ${creator.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{creator.name}</div>
                    <div className="bg-primary/80 px-3 py-1 text-xs rounded-full capitalize">{creator.type}</div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Link to={`/creator/${creator.username}`} className="flex items-center gap-3">
                    <ProfileAvatar 
                      src={creator.avatar_url || `https://i.pravatar.cc/150?u=${creator.id}`} 
                      alt={creator.name}
                      size="md"
                      hasStory={true}
                    />
                    <div>
                      <h3 className="font-medium">{creator.name}</h3>
                      <p className="text-sm text-muted-foreground">@{creator.username}</p>
                    </div>
                  </Link>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{creator.bio}</p>
                
                <div className="flex justify-between items-center text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Eye size={16} className="text-muted-foreground" />
                    <span>{creator.followers?.toLocaleString() || '0'} abonnés</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Heart size={16} className="text-muted-foreground" />
                    <span>{creator.content || '0'} contenus</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleFollow(creator.userId, creator.name)}
                    disabled={loadingStates[creator.userId]}
                  >
                    {loadingStates[creator.userId] ? (
                      <span className="flex items-center justify-center">
                        <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                        {followingStates[creator.userId] ? "Désabonnement..." : "Abonnement..."}
                      </span>
                    ) : (
                      followingStates[creator.userId] ? "Ne plus suivre" : "Suivre"
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/creator/${creator.username}`}>Voir profil</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatorsFeed;
