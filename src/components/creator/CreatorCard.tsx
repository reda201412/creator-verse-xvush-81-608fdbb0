import { useState } from 'react';
// Remove unused import
// import { useNavigate } from 'react-router-dom';
// Remove unused import
// import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CreatorCardProps {
  name: string;
  username: string;
  bio: string;
  avatarSrc: string;
  coverSrc: string;
  stats: {
    followers: number;
    videos: number;
    likes: number;
  };
  socialLinks: {
    website?: string;
    twitter?: string;
    instagram?: string;
  };
  // Remove unused id param
  // id: string;
  isFeatured?: boolean;
  category?: string;
}

const CreatorCard = ({ 
  name, 
  username,
  bio,
  avatarSrc,
  coverSrc,
  stats,
  socialLinks,
  // Remove unused id param
  // id,
  isFeatured,
  category
}: CreatorCardProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-lg">
      <div className="relative">
        <img 
          src={coverSrc} 
          alt={`${name} Cover`} 
          className="w-full h-48 object-cover" 
        />
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center mb-3">
          <img 
            src={avatarSrc} 
            alt={`${name} Avatar`} 
            className="w-16 h-16 rounded-full object-cover mr-3" 
          />
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">@{username}</p>
            {category && (
              <p className="text-xs text-muted-foreground mt-1">Category: {category}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{bio}</p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-medium">{stats.followers}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-sm font-medium">{stats.videos}</p>
            <p className="text-xs text-muted-foreground">Videos</p>
          </div>
          <div>
            <p className="text-sm font-medium">{stats.likes}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {socialLinks.website && (
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Website
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Twitter
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Instagram
              </a>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={toggleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
