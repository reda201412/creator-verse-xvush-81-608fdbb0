import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart, MessageSquare, Eye, Flame, Clock, TrendingUp } from 'lucide-react';

interface ContentCardProps {
  imageUrl: string;
  title?: string;
  type: 'premium' | 'vip' | 'standard';
  format?: 'image' | 'video' | 'audio' | 'text';
  duration?: number; // in seconds for video/audio
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    revenue?: number;
    growth?: number; // percentage of growth in views
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isCreator?: boolean;
  isTrending?: boolean;
  collectionName?: string;
}

const ContentCard = ({ 
  imageUrl, 
  title, 
  type = 'standard', 
  format = 'image',
  duration,
  metrics, 
  className,
  size = 'md',
  isCreator = false,
  isTrending = false,
  collectionName
}: ContentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClasses = {
    sm: 'h-40',
    md: 'h-56',
    lg: 'h-72',
    xl: 'h-96',
  };
  
  const getBadge = () => {
    switch (type) {
      case 'premium':
        return <span className="premium-badge px-3 py-1 rounded-full text-xs bg-gradient-to-r from-amber-500 to-amber-300 text-white">Premium</span>;
      case 'vip':
        return <span className="vip-badge px-3 py-1 rounded-full text-xs bg-gradient-to-r from-purple-600 to-indigo-400 text-white">VIP</span>;
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
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const renderFormatIndicator = () => {
    if (format === 'video') {
      return (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md flex items-center">
          <Clock size={12} className="mr-1" />
          {duration && formatDuration(duration)}
        </div>
      );
    }
    return null;
  };
  
  const renderCollectionBadge = () => {
    if (collectionName) {
      return (
        <div className="absolute top-2 left-2 z-20 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
          {collectionName}
        </div>
      );
    }
    return null;
  };
  
  const renderTrendingIndicator = () => {
    if (isTrending) {
      return (
        <div className="absolute top-2 right-2 z-20 bg-red-500/90 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
          <Flame size={12} className="mr-1" />
          Trending
        </div>
      );
    }
    
    if (metrics?.growth && metrics.growth > 10) {
      return (
        <div className="absolute top-2 right-2 z-20 bg-green-500/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
          <TrendingUp size={12} className="mr-1" />
          +{metrics.growth}%
        </div>
      );
    }
    
    return null;
  };

  return (
    <div 
      className={cn(
        "content-card relative overflow-hidden rounded-lg group transition-all duration-300 hover:shadow-lg",
        sizeClasses[size],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview with hover animation */}
      <div className="w-full h-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title || "Content"} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            isHovered && "scale-105"
          )}
        />
        
        {/* Preview overlay for videos - show animated play button on hover */}
        {format === 'video' && isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Collection badge */}
      {renderCollectionBadge()}
      
      {/* Trending indicator */}
      {renderTrendingIndicator()}
      
      {/* Content type badge */}
      {type !== 'standard' && (
        <div className="absolute top-2 left-2">
          {getBadge()}
        </div>
      )}
      
      {/* Format indicator (duration for videos) */}
      {renderFormatIndicator()}
      
      {/* Revenue indicator (creator only) */}
      {isCreator && metrics?.revenue && (
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center">
          <span className="font-medium">${metrics.revenue}</span>
          {metrics.growth && metrics.growth > 0 && (
            <span className="ml-1 text-green-400">↑</span>
          )}
        </div>
      )}
      
      {/* Info overlay on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end",
        isHovered ? "opacity-100" : "opacity-0",
        "transition-opacity duration-300"
      )}>
        {title && (
          <h3 className="font-medium text-white mb-2">{title}</h3>
        )}
        
        {metrics && (
          <div className="flex items-center justify-between text-xs text-white/90">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
