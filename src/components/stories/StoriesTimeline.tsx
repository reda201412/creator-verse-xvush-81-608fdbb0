
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserWithStories {
  id?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  stories?: any[];
}

interface Story {
  id: string;
  imageUrl: string;
  duration: number;
}

interface StoriesTimelineProps {
  userWithStories?: UserWithStories[];
  onStorySelect: (stories: Story[], creatorName: string, creatorAvatar: string, startIndex: number) => void;
}

const generateRandomStories = (min: number, max: number): Story[] => {
  const numberOfStories = Math.floor(Math.random() * (max - min + 1)) + min;
  const stories: Story[] = [];
  for (let i = 0; i < numberOfStories; i++) {
    stories.push({
      id: crypto.randomUUID(),
      imageUrl: `https://source.unsplash.com/random/360x640?sig=${i}`,
      duration: 5000
    });
  }
  return stories;
};

const StoriesTimeline: React.FC<StoriesTimelineProps> = ({ userWithStories, onStorySelect }) => {
  const [activeStory, setActiveStory] = useState<string | null>(null);

  // Adjust the id access by adding a '?' to safely access the id property or provide a fallback
  const creatorStories = userWithStories?.map(user => ({
    id: crypto.randomUUID(),
    name: user.name || user.username || 'Unknown Creator',
    username: user.username || 'creator',
    avatar: user.avatarUrl || `https://i.pravatar.cc/150?u=${user?.id || 'unknown'}`,
    stories: generateRandomStories(3, 7)
  }));

  const handleStoryClick = (stories: Story[], creatorName: string, creatorAvatar: string) => {
    onStorySelect(stories, creatorName, creatorAvatar, 0); // Passing startIndex as 0
  };

  return (
    <div className="w-full">
      <ScrollArea className="w-full whitespace-nowrap py-4">
        <div className="inline-flex items-center pl-2">
          {creatorStories?.map((creator) => (
            <div
              key={creator.id}
              className={cn(
                "relative flex flex-col items-center justify-center px-2 last:pr-2 cursor-pointer transition-all hover:scale-105",
                activeStory === creator.id && "ring-2 ring-primary"
              )}
              onClick={() => {
                setActiveStory(creator.id || null);
                handleStoryClick(creator.stories, creator.name || 'Unknown', creator.avatar || '');
              }}
            >
              <Avatar className="h-14 w-14">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <p className="text-sm mt-1 truncate w-20 text-center">{creator.name}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StoriesTimeline;
