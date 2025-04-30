
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Flame,
  Clock,
  Heart,
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface ContentFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface ContentFiltersProps {
  onFilterChange: (filterId: string) => void;
  activeFilter: string;
}

const ContentFilters = ({ onFilterChange, activeFilter }: ContentFiltersProps) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const filters: ContentFilter[] = [
    { 
      id: 'trending', 
      label: 'Trending', 
      icon: <Flame size={14} />, 
      description: 'Contenu le plus populaire du moment' 
    },
    { 
      id: 'recent', 
      label: 'Recent', 
      icon: <Clock size={14} />, 
      description: 'Contenu le plus récent' 
    },
    { 
      id: 'popular', 
      label: 'Popular', 
      icon: <Heart size={14} />,
      description: 'Contenu le plus aimé de tous les temps' 
    },
    { 
      id: 'mostWatched', 
      label: 'Most Watched', 
      icon: <Eye size={14} />, 
      description: 'Contenu avec le plus de vues' 
    },
    { 
      id: 'mostCommented', 
      label: 'Most Commented', 
      icon: <MessageSquare size={14} />, 
      description: 'Contenu avec le plus de commentaires' 
    },
    { 
      id: 'highestRated', 
      label: 'Highest Rated', 
      icon: <Star size={14} />, 
      description: 'Contenu avec les meilleures notes' 
    },
    { 
      id: 'fastestGrowing', 
      label: 'Fast Growing', 
      icon: <TrendingUp size={14} />, 
      description: 'Contenu avec la croissance la plus rapide' 
    },
    { 
      id: 'forYou', 
      label: 'For You', 
      icon: <Sparkles size={14} />, 
      description: 'Recommandations personnalisées pour vous' 
    },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide mb-4">
      <div className="flex gap-2 p-1 min-w-max">
        {filters.map((filter) => (
          <div key={filter.id} className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setShowTooltip(filter.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Badge 
                variant={activeFilter === filter.id ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-3 py-2 h-auto flex items-center gap-1 text-xs rounded-full",
                  activeFilter === filter.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background hover:bg-secondary",
                  "transition-all duration-300"
                )}
                onClick={() => onFilterChange(filter.id)}
              >
                {filter.icon}
                {filter.label}
              </Badge>
            </motion.div>
            
            {showTooltip === filter.id && (
              <motion.div 
                className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-xs rounded px-2 py-1 whitespace-nowrap">
                  {filter.description}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentFilters;
