
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileSection from '@/components/layout/header/ProfileSection';
import HeaderInfo from '@/components/layout/header/HeaderInfo';
import CreatorMetrics from '@/components/layout/header/CreatorMetrics';
import TierProgressBar from '@/components/layout/header/TierProgressBar';
import RevenueSection from '@/components/layout/header/RevenueSection';

interface CreatorHeaderProps {
  creator: {
    id: string;
    username?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    coverImageUrl?: string;
    joinDate?: string;
    location?: string;
    tags?: string[];
    isCurrentUser?: boolean;
    metrics?: {
      followers?: number;
      videos?: number;
      likes?: number;
      views?: number;
    };
    revenue?: {
      total?: number;
      tokens?: number;
      percentChange?: number;
    };
    tier?: {
      current: string;
      next: string;
      currentPoints: number;
      nextTierPoints: number;
    };
  };
}

const CreatorHeader: React.FC<CreatorHeaderProps> = ({ creator }) => {
  const {
    username,
    displayName,
    avatarUrl,
    coverImageUrl,
    bio,
    joinDate,
    location,
    tags,
    isCurrentUser,
    metrics,
    revenue,
    tier
  } = creator;
  
  return (
    <div className="w-full space-y-4">
      {/* Cover Image */}
      <div 
        className="h-40 md:h-60 w-full rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 relative"
        style={coverImageUrl ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Profile Information */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Top Section: Avatar and Name */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <ProfileSection 
                  avatarUrl={avatarUrl} 
                  displayName={displayName} 
                  username={username}
                />
                
                {isCurrentUser ? (
                  <Button variant="outline" size="sm">
                    Modifier le profil
                  </Button>
                ) : (
                  <Button variant="default" size="sm">
                    S'abonner
                  </Button>
                )}
              </div>
              
              {/* Bio */}
              {bio && (
                <p className="text-sm text-muted-foreground">{bio}</p>
              )}
              
              {/* Info & Tags */}
              <HeaderInfo 
                joinDate={joinDate} 
                location={location} 
                tags={tags}
              />
              
              {/* Creator Metrics */}
              <div className="pt-2">
                <CreatorMetrics 
                  followers={metrics?.followers} 
                  videos={metrics?.videos}
                  likes={metrics?.likes} 
                  views={metrics?.views}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Only visible for current user */}
        {isCurrentUser && (
          <div className="w-full md:w-80 space-y-4">
            <RevenueSection 
              totalRevenue={revenue?.total}
              tokenBalance={revenue?.tokens}
              percentChange={revenue?.percentChange}
            />
            
            {tier && (
              <Card>
                <CardContent className="p-4">
                  <TierProgressBar 
                    currentPoints={tier.currentPoints}
                    nextTierPoints={tier.nextTierPoints}
                    currentTier={tier.current}
                    nextTier={tier.next}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorHeader;
