
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, UserPlus, UserMinus, Bell, Heart, Star } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { followCreator, unfollowCreator, checkUserFollowsCreator } from '@/services/creatorService';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface CreatorCardProps {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  followersCount: number;
  isOnline: boolean;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  id,
  username,
  displayName,
  avatarUrl,
  bio,
  followersCount,
  isOnline,
  tier = 'bronze'
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localFollowersCount, setLocalFollowersCount] = useState(followersCount);
  const [isHovered, setIsHovered] = useState(false);

  // Vérifier le statut d'abonnement lors du chargement
  React.useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) return;
      
      try {
        const status = await checkUserFollowsCreator(user.uid || '', id);
        setIsFollowing(status);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };
    
    checkFollowStatus();
  }, [id, user]);

  const handleFollowToggle = async () => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour suivre un créateur",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFollowing) {
        const success = await unfollowCreator(user.uid || '', id);
        if (success) {
          setIsFollowing(false);
          setLocalFollowersCount(prev => prev - 1);
          toast({
            title: "Désabonnement",
            description: `Vous ne suivez plus ${displayName}`
          });
        }
      } else {
        const success = await followCreator(user.uid || '', id);
        if (success) {
          setIsFollowing(true);
          setLocalFollowersCount(prev => prev + 1);
          toast({
            title: "Abonnement",
            description: `Vous suivez maintenant ${displayName}`
          });
          
          // Trigger haptic feedback if available
          if ('vibrate' in navigator) {
            navigator.vibrate([15, 30, 15]); // Special pattern for follow action
          }
        }
      }
    } catch (error) {
      console.error('Failed to toggle follow status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get tier color based on tier level
  const getTierColor = () => {
    switch(tier) {
      case 'bronze': return 'bg-amber-600/80';
      case 'silver': return 'bg-gray-400/80';
      case 'gold': return 'bg-yellow-500/80';
      case 'platinum': return 'bg-cyan-500/80';
      case 'diamond': return 'bg-violet-500/80';
      default: return 'bg-primary/80';
    }
  };

  // Initiales pour l'avatar fallback
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <motion.div 
      className="border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(var(--primary) / 0.1), 0 10px 10px -5px rgba(var(--primary) / 0.04)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner with tier color */}
      <div className={`relative h-20 w-full ${getTierColor()}`}>
        <div className="absolute inset-0 bg-[url('/patterns/creator-pattern.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      <div className="px-4 pb-4 -mt-10 relative">
        <div className="flex items-start justify-between mb-4">
          <Link to={`/creator/${username}`} className="relative">
            <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </Link>
          
          <div className="mt-10 flex gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Bell size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Star size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-rose-500">
              <Heart size={16} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center">
            <Link to={`/creator/${username}`} className="hover:underline">
              <h3 className="font-medium text-lg">{displayName}</h3>
            </Link>
            <Badge className={`ml-2 ${getTierColor()} text-white`}>
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">@{username}</p>
          
          <p className="text-sm mt-2 line-clamp-2">
            {bio || "Ce créateur n'a pas encore ajouté de bio."}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            <span className="font-medium">{localFollowersCount}</span>
            <span className="text-muted-foreground"> abonnés</span>
          </div>
          
          <div className="text-sm">
            <span className="font-medium">85%</span>
            <span className="text-muted-foreground"> satisfaction</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-2">
          <Button 
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            className={`flex-1 ${isFollowing ? '' : 'bg-gradient-to-r from-primary to-xvush-purple'}`}
            onClick={handleFollowToggle}
            disabled={isLoading}
          >
            {isFollowing ? (
              <>
                <UserMinus className="mr-1 h-4 w-4" />
                Suivi
              </>
            ) : (
              <>
                <UserPlus className="mr-1 h-4 w-4" />
                Suivre
              </>
            )}
          </Button>
          
          <Button variant="outline" size="icon" asChild>
            <Link to={`/secure-messaging?userId=${id}`}>
              <MessageSquare className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatorCard;
