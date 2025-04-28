
import React from 'react';
import { cn } from '@/lib/utils';
import { Heart, MessageSquare, Eye } from 'lucide-react';

interface ContentCardProps {
  imageUrl: string;
  title?: string;
  type: 'premium' | 'vip' | 'standard';
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    revenue?: number;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isCreator?: boolean;
}

const ContentCard = ({ 
  imageUrl, 
  title, 
  type = 'standard', 
  metrics, 
  className,
  size = 'md',
  isCreator = false
}: ContentCardProps) => {
  const sizeClasses = {
    sm: 'h-40',
    md: 'h-56',
    lg: 'h-72',
  };
  
  const getBadge = () => {
    switch (type) {
      case 'premium':
        return <span className="premium-badge px-3 py-1 rounded-full text-xs">Premium</span>;
      case 'vip':
        return <span className="vip-badge px-3 py-1 rounded-full text-xs">VIP</span>;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg group transition-all duration-300 hover:shadow-lg",
        sizeClasses[size],
        className
      )}
    >
      <img 
        src={imageUrl} 
        alt={title || "Content"} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        {title && (
          <h3 className="font-medium text-white text-sm">{title}</h3>
        )}
        
        <div className="flex items-center justify-between mt-2 text-xs text-white/90">
          {metrics && (
            <div className="flex items-center space-x-3">
              {metrics.views !== undefined && (
                <span className="flex items-center">
                  <Eye size={12} className="mr-1" />
                  {formatNumber(metrics.views)}
                </span>
              )}
              {metrics.likes !== undefined && (
                <span className="flex items-center">
                  <Heart size={12} className="mr-1" />
                  {formatNumber(metrics.likes)}
                </span>
              )}
              {metrics.comments !== undefined && (
                <span className="flex items-center">
                  <MessageSquare size={12} className="mr-1" />
                  {formatNumber(metrics.comments)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isCreator && metrics?.revenue && (
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
          ${metrics.revenue}
        </div>
      )}
      
      {type !== 'standard' && (
        <div className="absolute top-2 left-2">
          {getBadge()}
        </div>
      )}
    </div>
  );
};

export default ContentCard;
