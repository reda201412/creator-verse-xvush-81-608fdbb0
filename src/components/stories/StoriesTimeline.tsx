import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStories } from '@/hooks/use-stories';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { StoryGroup } from '@/types/stories';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StoriesTimeline: React.FC = () => {
  const { user } = useAuth();
  const { storyGroups, loading, openViewer, openPublisher } = useStories();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const timeline = document.querySelector('.timeline-scroll');
    if (timeline) {
      timeline.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  const handleStoryClick = (groupIndex: number, storyIndex: number) => {
    openViewer(groupIndex, storyIndex);
  };

  const handleScroll = () => {
    const timeline = document.querySelector('.timeline-scroll');
    if (timeline) {
      setScrollPosition(timeline.scrollLeft);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Stories</h2>
        <Button variant="outline" size="icon" onClick={openPublisher}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="w-full">
        <div className="timeline-scroll flex space-x-4 py-2" onScroll={handleScroll}>
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center w-20">
                <Skeleton className="h-16 w-16 rounded-full mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          ) : storyGroups.length === 0 ? (
            <p className="text-muted-foreground">Aucune story à afficher pour le moment.</p>
          ) : (
            storyGroups.map((group, groupIndex) => (
              <div
                key={group.creator.id}
                className="flex flex-col items-center justify-center w-20 cursor-pointer"
                onClick={() => handleStoryClick(groupIndex, 0)}
              >
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={group.creator.avatar_url} alt={group.creator.display_name} />
                  <AvatarFallback>{group.creator.display_name}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-nowrap text-muted-foreground">{group.creator.display_name}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StoriesTimeline;
