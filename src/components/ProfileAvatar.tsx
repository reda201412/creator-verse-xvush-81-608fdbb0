
import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  src: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

const ProfileAvatar = ({ 
  src, 
  size = 'md', 
  hasStory = false, 
  status,
  className 
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
      <span 
        className={cn(
          'absolute bottom-1 right-1 rounded-full border-2 border-white dark:border-gray-900',
          statusColors[status],
          size === 'sm' ? 'w-2.5 h-2.5' : 'w-4 h-4'
        )}
      />
    );
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {hasStory ? (
        <div className="story-ring animate-pulse-subtle">
          <div className="bg-background p-0.5 rounded-full">
            <img 
              src={src} 
              alt="Profile" 
              className={cn(
                "rounded-full object-cover", 
                sizeMap[size]
              )}
            />
          </div>
        </div>
      ) : (
        <img 
          src={src} 
          alt="Profile" 
          className={cn(
            "rounded-full object-cover border-2 border-white dark:border-gray-800", 
            sizeMap[size]
          )}
        />
      )}
      {renderStatus()}
    </div>
  );
};

export default ProfileAvatar;
