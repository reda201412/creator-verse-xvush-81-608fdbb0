import React from 'react';
import { CreatorProfileData } from '@/types/video';

const CreatorSelector = () => {
  // Now CreatorProfileData is properly imported
  const [creators, setCreators] = React.useState<CreatorProfileData[]>([]);
  
  // Mock data for creators
  React.useEffect(() => {
    const mockCreators: CreatorProfileData[] = [
      {
        id: '1',
        uid: 'creator-1',
        username: 'amelia_creator',
        displayName: 'Amelia Creator',
        bio: 'Creating amazing content daily',
        avatarUrl: 'https://i.pravatar.cc/150?u=amelia',
        isPremium: true,
        isOnline: true,
        metrics: {
          followers: 15000,
          likes: 45000,
          rating: 4.7
        }
      },
      {
        id: '2',
        uid: 'creator-2',
        username: 'ben_artist',
        displayName: 'Ben Artist',
        bio: 'Sharing my art with the world',
        avatarUrl: 'https://i.pravatar.cc/150?u=ben',
        isPremium: false,
        isOnline: false,
        metrics: {
          followers: 8000,
          likes: 22000,
          rating: 4.5
        }
      }
    ];
    setCreators(mockCreators);
  }, []);
  
  return (
    <div className="creator-selector">
      <h2>Select a Creator</h2>
      <ul>
        {creators.map(creator => (
          <li key={creator.id}>
            <img src={creator.avatarUrl} alt={creator.displayName} />
            <span>{creator.displayName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreatorSelector;
