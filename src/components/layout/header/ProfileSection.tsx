
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileSectionProps {
  avatarUrl?: string;
  displayName?: string;
  username?: string;
}

const ProfileSection = ({ 
  avatarUrl, 
  displayName, 
  username 
}: ProfileSectionProps) => {
  const { user } = useAuth();

  // Use provided props or fall back to user data
  const avatar = avatarUrl || user?.profileImageUrl || '/placeholder.svg';
  const name = displayName || user?.displayName || 'Creator';
  const handle = username || user?.username || '@creator';

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary shadow-lg">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div>
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-muted-foreground text-sm">{handle}</p>
      </div>
    </div>
  );
};

export default ProfileSection;
