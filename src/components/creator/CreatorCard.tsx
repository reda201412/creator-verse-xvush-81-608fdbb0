
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, UserPlus, UserMinus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { followCreator, unfollowCreator, checkUserFollowsCreator } from '@/services/creatorService';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CreatorCardProps {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  followersCount: number;
  isOnline: boolean;
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  id,
  username,
  displayName,
  avatarUrl,
  bio,
  followersCount,
  isOnline
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localFollowersCount, setLocalFollowersCount] = useState(followersCount);

  // Vérifier le statut d'abonnement lors du chargement
  React.useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) return;
      
      try {
        const status = await checkUserFollowsCreator(user?.uid || user?.id || '', id);
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
        const success = await unfollowCreator(user?.uid || user?.id || '', id);
        if (success) {
          setIsFollowing(false);
          setLocalFollowersCount(prev => prev - 1);
          toast({
            title: "Désabonnement",
            description: `Vous ne suivez plus ${displayName}`
          });
        }
      } else {
        const success = await followCreator(user?.uid || user?.id || '', id);
        if (success) {
          setIsFollowing(true);
          setLocalFollowersCount(prev => prev + 1);
          toast({
            title: "Abonnement",
            description: `Vous suivez maintenant ${displayName}`
          });
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

  // Initiales pour l'avatar fallback
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="border rounded-lg p-4 transition hover:shadow-md flex flex-col">
      <div className="flex items-center space-x-4">
        <Link to={`/creator/${id}`} className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link to={`/creator/${id}`} className="hover:underline">
            <h3 className="font-medium truncate">{displayName}</h3>
          </Link>
          <p className="text-sm text-muted-foreground truncate">@{username}</p>
        </div>
        
        {isOnline && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            En ligne
          </Badge>
        )}
      </div>
      
      <p className="text-sm mt-3 line-clamp-2 flex-1">
        {bio || "Ce créateur n'a pas encore ajouté de bio."}
      </p>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <span>{localFollowersCount} abonné{localFollowersCount !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <Button 
          variant={isFollowing ? "outline" : "default"} 
          size="sm"
          className="flex-1"
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
  );
};

export default CreatorCard;
