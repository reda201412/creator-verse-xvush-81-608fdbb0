
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase, checkUserFollowStatus, followCreator, unfollowCreator } from '@/integrations/supabase/client';
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
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFollowing) {
        // Unfollow
        await unfollowCreator(user.id, creator.userId);
        setIsFollowing(false);
        toast(`Vous ne suivez plus ${creator.name}`);
      } else {
        // Follow
        await followCreator(user.id, creator.userId);
        setIsFollowing(true);
        toast(`Vous suivez maintenant ${creator.name}`, {
          description: "Découvrez son contenu exclusif"
        });
        triggerMicroReward('like');
      }
      
      triggerHaptic('medium');
    } catch (error) {
      console.error('Error following creator:', error);
      toast('Une erreur est survenue', {
        description: 'Veuillez réessayer plus tard'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if the user is following this creator on mount
  React.useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) return;
      
      try {
        const { data } = await checkUserFollowStatus(user.id, creator.userId);
        setIsFollowing(!!data);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };
    
    checkFollowStatus();
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
          
          <div className="flex items-center">
            <MessageSquare size={12} className="mr-1" />
            Contacter
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/creator/${creator.username}`}
            className="flex-1 text-center text-xs font-medium bg-white/10 hover:bg-white/20 rounded-full py-2"
            onClick={(e) => e.stopPropagation()}
          >
            Profil
          </Link>
          
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
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></span>
                {isFollowing ? "Désabonnement..." : "Abonnement..."}
              </span>
            ) : (
              isFollowing ? "Ne plus suivre" : "Suivre"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCreatorCard;
