
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Eye, Search } from 'lucide-react';
import ProfileAvatar from '@/components/ProfileAvatar';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { followCreator, unfollowCreator, checkUserFollowStatus } from '@/integrations/supabase/client';

// Données des créateurs pour le feed
const creators = [
  {
    id: "creator1",
    userId: "creator1",
    name: "Sarah K.",
    username: "sarahk.creative",
    imageUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
    type: "diamond",
    bio: "Photographe et créatrice de contenu lifestyle basée à Paris",
    featuredImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    metrics: {
      followers: 21500,
      content: 156
    }
  },
  {
    id: "creator2",
    userId: "creator2",
    name: "Thomas R.",
    username: "thomas.photo",
    imageUrl: "https://i.pravatar.cc/150?img=11",
    type: "gold",
    bio: "Photographe de paysage et aventurier",
    featuredImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
    metrics: {
      followers: 14200,
      content: 87
    }
  },
  {
    id: "creator3",
    userId: "creator3",
    name: "Camille D.",
    username: "cam.style",
    imageUrl: "https://i.pravatar.cc/150?img=20",
    type: "platinum",
    bio: "Mode et style urbain - Paris & London",
    featuredImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    metrics: {
      followers: 18700,
      content: 212
    }
  },
  {
    id: "creator4",
    userId: "creator4",
    name: "Marc L.",
    username: "marc.travels",
    imageUrl: "https://i.pravatar.cc/150?img=33",
    type: "silver",
    bio: "Voyageur et photographe documentaire",
    featuredImage: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=800&auto=format&fit=crop",
    metrics: {
      followers: 9800,
      content: 63
    }
  },
  {
    id: "creator5",
    userId: "creator5",
    name: "Julie P.",
    username: "julie.creates",
    imageUrl: "https://i.pravatar.cc/150?img=5",
    type: "gold",
    bio: "Art digital et illustrations",
    featuredImage: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop",
    metrics: {
      followers: 15600,
      content: 109
    }
  },
  {
    id: "creator6",
    userId: "creator6",
    name: "Antoine B.",
    username: "antoine.films",
    imageUrl: "https://i.pravatar.cc/150?img=8",
    type: "platinum",
    bio: "Réalisateur et monteur vidéo",
    featuredImage: "https://images.unsplash.com/photo-1529651737248-dad5e287768e?w=800&auto=format&fit=crop",
    metrics: {
      followers: 19200,
      content: 78
    }
  }
];

const CreatorsFeed: React.FC = () => {
  const { triggerMicroReward } = useNeuroAesthetic();
  const { user } = useAuth();
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Check follow status on component mount
  React.useEffect(() => {
    const loadFollowStatuses = async () => {
      if (!user) return;
      
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
  }, [user]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Découvrir les créateurs</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher des créateurs" 
            className="pl-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
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
                src={creator.featuredImage} 
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
                <Link to={`/creator?id=${creator.id}`} className="flex items-center gap-3">
                  <ProfileAvatar 
                    src={creator.imageUrl} 
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
                  <span>{creator.metrics.followers.toLocaleString()} abonnés</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Heart size={16} className="text-muted-foreground" />
                  <span>{creator.metrics.content} contenus</span>
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
                  <Link to={`/creator?id=${creator.id}`}>Voir profil</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CreatorsFeed;
