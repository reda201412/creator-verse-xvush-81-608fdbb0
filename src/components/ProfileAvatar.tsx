
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
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-full object-cover", 
        hasStory ? "" : "border-2 border-white dark:border-gray-800",
        sizeMap[size]
      )}
    />
  );

  return (
    <div 
      className={cn("relative inline-block cursor-pointer", className)}
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
    </div>
  );
};

export default ProfileAvatar;
