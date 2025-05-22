import React from 'react';
import { CreatorProfileData } from '@/types/video';

export interface TrendingContentItem {
  id?: string;
  title?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  videoUrl?: string;
  video_url?: string;
  type?: string;
  format?: string;
  isPremium?: boolean;
  is_premium?: boolean;
  userId?: string; // Added to fix missing property error
}

const TrendingContent = () => {
  const [trendingItems, setTrendingItems] = React.useState<TrendingContentItem[]>([
    {
      id: '1',
      title: 'Top Music Video',
      thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'music',
      format: '16:9',
      isPremium: false,
      userId: 'user-1'
    },
    {
      id: '2',
      title: 'Best Cooking Recipe',
      thumbnailUrl: 'https://img.buzzfeed.com/video-api-prod/assets/b4749959444943398ca190e28c36a44c/BFV13333_Square1.jpg',
      videoUrl: 'https://www.buzzfeed.com/video/alisonroman/one-pot-pasta',
      type: 'cooking',
      format: '1:1',
      isPremium: true,
      userId: 'user-2'
    }
  ]);

  const [creators, setCreators] = React.useState<CreatorProfileData[]>([
    {
      id: '1',
      uid: 'creator-1',
      username: 'john_doe',
      displayName: 'John Doe',
      bio: 'Making awesome videos',
      avatarUrl: 'https://i.pravatar.cc/150?u=john',
      isPremium: true,
      isOnline: true,
      metrics: {
        followers: 12000,
        likes: 30000,
        rating: 4.5
      }
    },
    {
      id: '2',
      uid: 'creator-2',
      username: 'jane_smith',
      displayName: 'Jane Smith',
      bio: 'Sharing my life with you',
      avatarUrl: 'https://i.pravatar.cc/150?u=jane',
      isPremium: false,
      isOnline: false,
      metrics: {
        followers: 8000,
        likes: 20000,
        rating: 4.2
      }
    }
  ]);
  
  // Fix property access for TrendingContentItem
  const renderItem = (item: TrendingContentItem) => {
    return (
      <div className="trending-item">
        <img 
          src={item.thumbnail_url || item.thumbnailUrl || 'https://via.placeholder.com/300x169'} 
          alt={item.title} 
        />
        <div className="item-info">
          <h3>{item.title}</h3>
          <span>{item.is_premium || item.isPremium ? 'Premium' : 'Free'}</span>
        </div>
      </div>
    );
  };
  
  // Fix creator profile access
  const renderCreator = (creator: CreatorProfileData) => {
    return (
      <div className="creator-card">
        <img 
          src={creator.avatarUrl || creator.profileImageUrl || 'https://via.placeholder.com/40'} 
          alt={creator.displayName} 
        />
        <h4>{creator.displayName}</h4>
      </div>
    );
  };
  
  return (
    <div className="trending-content">
      <h2>Trending Videos</h2>
      <div className="trending-list">
        {trendingItems.map(item => (
          <div key={item.id}>{renderItem(item)}</div>
        ))}
      </div>
      <h2>Top Creators</h2>
      <div className="creators-list">
        {creators.map(creator => (
          <div key={creator.id}>{renderCreator(creator)}</div>
        ))}
      </div>
    </div>
  );
};

export default TrendingContent;
