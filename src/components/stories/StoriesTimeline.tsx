
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import useStories from '@/hooks/use-stories';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

const StoriesTimeline = () => {
  const { stories, loadingStories } = useStories();
  const { user } = useAuth();
  const [isShowingAll, setIsShowingAll] = useState(false);
  
  // Group stories by creator
  const groupedStories = React.useMemo(() => {
    const grouped = new Map();
    
    stories.forEach(story => {
      if (grouped.has(story.creator_id)) {
        grouped.get(story.creator_id).stories.push(story);
      } else {
        grouped.set(story.creator_id, {
          creator_id: story.creator_id,
          creator_name: story.creator_name || 'Creator',
          creator_avatar: story.creator_avatar || `https://i.pravatar.cc/150?u=${story.creator_id}`,
          stories: [story]
        });
      }
      
      // Sort stories by date (newest first)
      const creatorData = grouped.get(story.creator_id);
      creatorData.stories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });
    
    // Convert map to array and sort by date of latest story
    return Array.from(grouped.values()).sort((a, b) => {
      const latestA = a.stories[0].created_at;
      const latestB = b.stories[0].created_at;
      return new Date(latestB).getTime() - new Date(latestA).getTime();
    });
  }, [stories]);

  // Determine which stories to show
  const visibleCreators = isShowingAll ? groupedStories : groupedStories.slice(0, 6);
  
  const [openStory, setOpenStory] = useState<string | null>(null);

  // Open a story when clicked
  const handleStoryClick = (creatorId: string) => {
    setOpenStory(creatorId);
    // In a real app, this would navigate to a story viewer or open a modal
    console.log(`Opening stories for creator ${creatorId}`);
  };
  
  // Handle creating a story (mock)
  const handleCreateStory = () => {
    if (!user) {
      return;
    }
    
    // In a real app, this would open a story creation UI
    console.log(`Creating story for user ${user.uid || user.id || ''}`);
  };

  if (groupedStories.length === 0 && !loadingStories) {
    return null; // Don't show the component if there are no stories
  }

  return (
    <div className="mb-6">
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {/* Add Story Button (only for logged in users) */}
          {user && (
            <div className="flex flex-col items-center">
              <Button 
                size="icon" 
                variant="outline" 
                className="w-16 h-16 rounded-full relative border-dashed"
                onClick={handleCreateStory}
              >
                <Plus className="w-6 h-6" />
              </Button>
              <span className="text-xs mt-1 text-muted-foreground">Add Story</span>
            </div>
          )}
          
          {/* Story Avatars */}
          {loadingStories ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-12 h-3 mt-1" />
              </div>
            ))
          ) : (
            visibleCreators.map(creator => (
              <div key={creator.creator_id} className="flex flex-col items-center">
                <button 
                  className={cn(
                    "w-16 h-16 rounded-full overflow-hidden border-2",
                    "border-primary hover:scale-105 transition-transform",
                    "focus:outline-none focus:ring-2 focus:ring-primary-50"
                  )}
                  onClick={() => handleStoryClick(creator.creator_id)}
                >
                  <img 
                    src={creator.creator_avatar} 
                    alt={creator.creator_name} 
                    className="w-full h-full object-cover"
                  />
                </button>
                <span className="text-xs mt-1 truncate w-16 text-center">{creator.creator_name}</span>
              </div>
            ))
          )}
          
          {/* Show More/Less Button */}
          {!loadingStories && groupedStories.length > 6 && (
            <div className="flex flex-col items-center">
              <Button
                size="icon"
                variant="outline"
                className="w-16 h-16 rounded-full"
                onClick={() => setIsShowingAll(!isShowingAll)}
              >
                {isShowingAll ? '−' : '+'}
              </Button>
              <span className="text-xs mt-1 text-center">
                {isShowingAll ? 'Show Less' : 'Show More'}
              </span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StoriesTimeline;
