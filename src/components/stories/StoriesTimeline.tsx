
import React from 'react';
import { useStories } from '@/hooks/use-stories';
import { StoryGroup } from '@/utils/story-types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface StoriesTimelineProps {
  onStoryClick: (groupIndex: number) => void;
  storyGroups: StoryGroup[];
}

const StoriesTimeline: React.FC<StoriesTimelineProps> = ({ onStoryClick, storyGroups }) => {
  const { openPublisher } = useStories();
  
  const handleCreate = () => {
    openPublisher();
  };
  
  const handleStoryClick = (index: number) => {
    if (index < 0 || index >= storyGroups.length) {
      toast({
        title: "Story not found",
        variant: "destructive"
      });
      return;
    }
    
    onStoryClick(index);
  };
  
  return (
    <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={handleCreate}
      >
        <div className="relative">
          <Avatar className="w-16 h-16 border-2 border-primary">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>+</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white font-bold text-xs">+</div>
        </div>
        <span className="text-xs mt-2 text-center">Add Story</span>
      </div>
      
      {storyGroups.map((group, index) => (
        <div 
          key={group.id} 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => handleStoryClick(index)}
        >
          <div className={`rounded-full p-1 ${group.hasUnviewed ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500' : 'bg-muted'}`}>
            <Avatar className="w-14 h-14 border-2 border-background">
              <AvatarImage src={group.avatarUrl} />
              <AvatarFallback>{group.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-xs mt-2 text-center truncate w-16">{group.username}</span>
        </div>
      ))}
    </div>
  );
};

export default StoriesTimeline;
