
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: React.ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  fallback,
  status,
  className,
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="bg-muted text-muted-foreground">
          {fallback || <User className={cn('h-1/2 w-1/2')} />}
        </AvatarFallback>
      </Avatar>
      
      {status && (
        <span 
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-background',
            sizeClasses.xs,
            statusClasses[status],
            size === 'xs' ? 'h-2 w-2 border-[1px]' : size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'
          )}
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
