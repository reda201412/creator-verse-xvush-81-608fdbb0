
import React from 'react';
import ProfileAvatar from '../ProfileAvatar';
import CreatorPulse from '../CreatorPulse';

interface ProfileSectionProps {
  avatar: string;
  isOnline?: boolean;
}

const ProfileSection = ({ avatar, isOnline = false }: ProfileSectionProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProfileAvatar 
        src={avatar} 
        size="xl" 
        hasStory={true} 
        status={isOnline ? 'online' : undefined}
      />
      
      <CreatorPulse 
        status={isOnline ? 'online' : 'creating'} 
        className="mt-1"
      />
    </div>
  );
};

export default ProfileSection;
