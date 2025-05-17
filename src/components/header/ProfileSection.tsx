
import { cn } from '@/lib/utils';
import ProfileAvatar from '@/components/ProfileAvatar';
import CreatorPulse from '@/components/CreatorPulse';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

interface ProfileSectionProps {
  avatar: string;
  isOnline?: boolean;
  pulseStatus?: 'online' | 'creating' | 'scheduled' | 'offline';
  scheduledTime?: string;
  className?: string;
}

const ProfileSection = ({
  avatar,
  isOnline = false,
  pulseStatus = 'offline',
  scheduledTime,
  className
}) => {
  const { triggerMicroReward } = useNeuroAesthetic();

  return (
    <div 
      className={cn("flex flex-col items-center gap-2", className)}
      onClick={() => triggerMicroReward('like')}
    >
      <div className="relative">
        <ProfileAvatar 
          src={avatar} 
          size="xl" 
          hasStory={true} 
          status={isOnline ? 'online' : 'offline'}
        />
        
        {/* Animated background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-xvush-purple/30 rounded-full blur-md -z-10 animate-pulse"></div>
        
        {/* Pulse indicator under avatar */}
        <div className="mt-2">
          <CreatorPulse 
            status={pulseStatus} 
            scheduledTime={scheduledTime} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
