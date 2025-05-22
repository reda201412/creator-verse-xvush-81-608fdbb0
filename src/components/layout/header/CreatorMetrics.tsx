
import React from 'react';
import { User, Video, Heart, Eye } from 'lucide-react';

interface CreatorMetricsProps {
  followers?: number;
  videos?: number;
  likes?: number;
  views?: number;
}

const CreatorMetrics = ({
  followers = 0,
  videos = 0,
  likes = 0,
  views = 0
}: CreatorMetricsProps) => {
  // Format large numbers with k, M suffixes
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="flex flex-wrap gap-4 sm:gap-6">
      <div className="flex items-center">
        <User className="h-4 w-4 mr-2 text-primary" />
        <div>
          <div className="font-semibold">{formatNumber(followers)}</div>
          <div className="text-xs text-muted-foreground">Abonnés</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <Video className="h-4 w-4 mr-2 text-primary" />
        <div>
          <div className="font-semibold">{formatNumber(videos)}</div>
          <div className="text-xs text-muted-foreground">Vidéos</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <Heart className="h-4 w-4 mr-2 text-primary" />
        <div>
          <div className="font-semibold">{formatNumber(likes)}</div>
          <div className="text-xs text-muted-foreground">J'aime</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <Eye className="h-4 w-4 mr-2 text-primary" />
        <div>
          <div className="font-semibold">{formatNumber(views)}</div>
          <div className="text-xs text-muted-foreground">Vues</div>
        </div>
      </div>
    </div>
  );
};

export default CreatorMetrics;
