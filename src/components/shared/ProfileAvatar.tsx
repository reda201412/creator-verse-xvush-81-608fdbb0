
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProfileAvatarProps {
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
  status?: 'online' | 'offline' | 'busy';
  className?: string;
  onClick?: () => void;
}

const ProfileAvatar = ({ 
  src, 
  alt = "Profile Picture",
  size = 'md', 
  hasStory = false, 
  status,
  className,
  onClick
}: ProfileAvatarProps) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };
  
  const renderStatus = () => {
    if (!status) return null;
    
    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      busy: 'bg-amber-500'
    };
    
    return (
      <motion.span 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'absolute bottom-1 right-1 rounded-full border-2 border-white dark:border-gray-900',
          statusColors[status],
          size === 'sm' ? 'w-2.5 h-2.5' : 'w-4 h-4'
        )}
      />
    );
  };

  const imageComponent = (
    <motion.img 
      src={src} 
      alt={alt}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-full object-cover", 
        hasStory ? "" : "border-2 border-white dark:border-gray-800",
        sizeMap[size],
        onClick ? "cursor-pointer hover:shadow-lg" : ""
      )}
    />
  );

  return (
    <div 
      className={cn("relative inline-block", onClick ? "cursor-pointer" : "", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {hasStory ? (
        <div className="story-ring animate-pulse-subtle">
          <div className="bg-background p-0.5 rounded-full">
            {imageComponent}
          </div>
        </div>
      ) : (
        imageComponent
      )}
      {renderStatus()}
      
      {/* Si onClick est défini, afficher un indicateur visuel au survol */}
      {onClick && (
        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <div className="text-white bg-black/30 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
