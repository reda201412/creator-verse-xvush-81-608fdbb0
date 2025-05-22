import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { checkUserFollowsCreator, followCreator, unfollowCreator } from '@/services/creatorService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

interface ContentCreatorCardProps {
  creator: {
    id: string | number;
    userId: string;
    username: string;
    name: string;
    avatar: string;
    bio?: string;
    metrics?: {
      followers?: number;
      likes?: number;
      rating?: number;
    };
    isPremium?: boolean;
  };
  className?: string;
  onClick?: () => void;
}

const ContentCreatorCard = ({ creator, className, onClick }: ContentCreatorCardProps) => {
  const { user } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const { triggerMicroReward } = useNeuroAesthetic();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Veuillez vous connecter pour suivre un créateur.");
      navigate('/auth');
      return;
    }
    if (user?.uid === creator.userId) {
      toast.info("Vous ne pouvez pas vous suivre vous-même.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFollowing) {
        // Unfollow
        const success = await unfollowCreator(user?.uid || '');
        if (success) {
          setIsFollowing(false);
          toast.success(`Vous ne suivez plus ${creator.name}`);
        } else {
          toast.error("Échec du désabonnement.");
        }
      } else {
        // Follow
        const success = await followCreator(user?.uid || '');
        if (success) {
          setIsFollowing(true);
          toast.success(`Vous suivez maintenant ${creator.name}`, {
            description: "Découvrez son contenu exclusif"
          });
          triggerMicroReward('like');
        } else {
          toast.error("Échec de l'abonnement.");
        }
      }
      triggerHaptic('medium');
    } catch (error) {
      console.error('Error following/unfollowing creator:', error);
      toast.error('Une erreur est survenue', {
        description: 'Veuillez réessayer plus tard'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if the user is following this creator on mount
  useEffect(() => {
    const checkFollow = async () => {
      if (!user || !creator.userId) return;
      // Ne pas vérifier si l'utilisateur essaie de se suivre lui-même
      if (user?.uid === creator.userId) return;

      setIsLoading(true);
      try {
        const currentlyFollowing = await checkUserFollowsCreator(user?.uid || '');
        setIsFollowing(currentlyFollowing);
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkFollow();
  }, [user, creator.userId]);

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-black/30 hover:bg-black/40 transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
      
      <img 
        src={creator.avatar || `https://i.pravatar.cc/300?u=${creator.userId}`} 
        alt={creator.name}
        className="w-full aspect-[3/4] object-cover"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/80">
            <img 
              src={creator.avatar || `https://i.pravatar.cc/100?u=${creator.userId}`}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">{creator.name}</h3>
            <p className="text-xs text-white/70">@{creator.username}</p>
          </div>
          
          {creator.isPremium && (
            <div className="bg-amber-500 text-black text-xs font-semibold px-2 py-0.5 rounded">
              PREMIUM
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-white/80 text-xs mb-3">
          {creator.metrics?.followers !== undefined && (
            <div className="flex items-center">
              <Users size={12} className="mr-1" />
              {creator.metrics.followers}
            </div>
          )}
          
          {creator.metrics?.likes !== undefined && (
            <div className="flex items-center">
              <Heart size={12} className="mr-1" />
              {creator.metrics.likes}
            </div>
          )}
          
          {creator.metrics?.rating !== undefined && (
            <div className="flex items-center">
              <Star size={12} className="mr-1" />
              {creator.metrics.rating.toFixed(1)}
            </div>
          )}
          
          <button 
            className="flex items-center hover:text-white transition-colors"
            onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation(); 
                if(!user) {
                  toast.error("Connectez-vous pour contacter un créateur."); 
                  navigate("/auth"); 
                  return;
                }
                if(user?.uid === creator.userId) {
                  toast.info("Vous ne pouvez pas vous contacter vous-même."); 
                  return;
                }
                navigate('/secure-messaging', { 
                  state: { 
                    creatorId: creator.userId, 
                    creatorName: creator.name, 
                    creatorAvatar: creator.avatar 
                  } 
                });
            }}
          >
            <MessageSquare size={12} className="mr-1" />
            Contacter
          </button>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/creator/${creator.username}`}
            className="flex-1 text-center text-xs font-medium bg-white/10 hover:bg-white/20 rounded-full py-2"
            onClick={(e) => e.stopPropagation()}
          >
            Profil
          </Link>
          
          {user && (user?.uid !== creator.userId) && (
            <button 
              className={cn(
                "flex-1 text-center text-xs font-medium rounded-full py-2",
                isFollowing 
                  ? "bg-white/20 hover:bg-white/30" 
                  : "bg-primary/80 hover:bg-primary"
              )}
              onClick={handleFollow}
              disabled={isLoading}
            >
              {isLoading && isFollowing ? "Désabonnement..." : 
               isLoading && !isFollowing ? "Abonnement..." : 
               isFollowing ? "Ne plus suivre" : "Suivre"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCreatorCard;
