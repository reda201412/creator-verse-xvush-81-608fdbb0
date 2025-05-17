import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronRight, MessageCircle, Tag, UserRound } from 'lucide-react';

interface CreatorCardProps {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  tags: string[];
  isVerified: boolean;
  isOnline: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  followers: number;
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  id,
  name,
  username,
  avatar,
  bio,
  tags,
  isVerified,
  isOnline,
  tier,
  followers
}) => {
  const { toast } = useToast();
  
  const handleContactClick = () => {
    toast({
      title: "Fonctionnalité non implémentée",
      description: "Cette fonctionnalité sera bientôt disponible.",
    })
  };

  return (
    <Card className="bg-background shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={avatar}
              alt={`Avatar de ${name}`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <CardTitle className="text-lg font-semibold">{name}</CardTitle>
              <CardDescription className="text-gray-500">
                @{username} {isVerified && <Badge variant="secondary">Verifié</Badge>}
              </CardDescription>
            </div>
          </div>
          {isOnline && <Badge variant="outline">En ligne</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center space-x-2">
          <UserRound className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{followers} abonnés</span>
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Tier {tier}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline">
          Voir le profil
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        <Button onClick={handleContactClick}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Contacter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatorCard;
