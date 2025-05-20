import React, { useState, useEffect } from 'react';
import { useStories } from '@/hooks/use-stories';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import StoriesTimeline from '@/components/stories/StoriesTimeline';
import StoryPublisher from '@/components/stories/StoryPublisher';
import { useAuth } from '@/contexts/AuthContext';
import { Story } from '@/types/stories';

const Stories = () => {
  const [showStoryPublisher, setShowStoryPublisher] = useState(false);
  const { stories, loadingStories } = useStories();
  const { user } = useAuth();
  const [storyGroups, setStoryGroups] = useState<any[]>([]);
  
  useEffect(() => {
    if (stories && stories.length > 0) {
      // Group stories by creator
      const groupedStories = stories.reduce((acc: any, story: Story) => {
        const creatorId = story.creator_id;
        if (!acc[creatorId]) {
          acc[creatorId] = {
            creator: {
              id: creatorId,
              username: story.creator_name || `User_${creatorId.substring(0, 5)}`,
              display_name: story.creator_name || null,
              avatar_url: story.creator_avatar || `https://i.pravatar.cc/150?u=${creatorId}`,
              bio: null,
              role: 'creator'
            },
            stories: [],
            lastUpdated: '',
            hasUnviewed: false
          };
        }
        
        acc[creatorId].stories.push(story);
        
        // Update lastUpdated if this story is more recent
        if (!acc[creatorId].lastUpdated || new Date(story.created_at) > new Date(acc[creatorId].lastUpdated)) {
          acc[creatorId].lastUpdated = story.created_at;
        }
        
        // Check if there are any unviewed stories
        if (!story.viewed) {
          acc[creatorId].hasUnviewed = true;
        }
        
        return acc;
      }, {});
      
      // Convert to array and sort by lastUpdated
      const groupsArray = Object.values(groupedStories);
      groupsArray.sort((a: any, b: any) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
      
      setStoryGroups(groupsArray);
    }
  }, [stories]);
  
  const handleCreateStory = () => {
    setShowStoryPublisher(true);
  };
  
  const handleClosePublisher = () => {
    setShowStoryPublisher(false);
  };
  
  return (
    <div className="container py-4 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stories</h1>
        {user && (
          <Button onClick={handleCreateStory} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Story
          </Button>
        )}
      </div>
      
      <div className="mb-8">
        <StoriesTimeline storyGroups={storyGroups} />
      </div>
      
      {showStoryPublisher && (
        <StoryPublisher onCancel={handleClosePublisher} />
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Highlighted Stories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loadingStories ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-[9/16] bg-gray-200 animate-pulse rounded-lg"></div>
            ))
          ) : (
            stories
              .filter(story => story.is_highlighted)
              .map(story => (
                <div 
                  key={story.id} 
                  className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative"
                  onClick={() => {/* Handle story click */}}
                >
                  <img 
                    src={story.thumbnail_url || story.media_url} 
                    alt={story.caption || "Story"} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="flex items-center">
                      <img 
                        src={story.creator_avatar || `https://i.pravatar.cc/40?u=${story.creator_id}`} 
                        alt="Creator" 
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-white text-sm truncate">
                        {story.creator_name || `User_${story.creator_id.substring(0, 5)}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Stories;
