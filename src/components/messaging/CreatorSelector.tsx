
import React from 'react';
import { CreatorProfileData } from '@/types/video';

// Update the component to accept and use the correct props
interface CreatorSelectorProps {
  onSelectCreator?: (creator: CreatorProfileData) => Promise<void> | void;
  onCancel?: () => void;
}

const CreatorSelector: React.FC<CreatorSelectorProps> = ({ onSelectCreator, onCancel }) => {
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
  
  const handleCreatorSelect = async (creator: CreatorProfileData) => {
    if (onSelectCreator) {
      await onSelectCreator(creator);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <div className="creator-selector">
      <h2>Select a Creator</h2>
      <ul>
        {creators.map(creator => (
          <li key={creator.id} onClick={() => handleCreatorSelect(creator)}>
            <img src={creator.avatarUrl} alt={creator.displayName} />
            <span>{creator.displayName}</span>
          </li>
        ))}
      </ul>
      {onCancel && (
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      )}
    </div>
  );
};

export default CreatorSelector;
