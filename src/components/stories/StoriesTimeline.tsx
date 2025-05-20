
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStories } from '@/hooks/use-stories';
import StoriesViewer from './StoriesViewer';
import { Story } from '@/types/stories';
import { useAuth } from '@/contexts/AuthContext';

interface StoriesTimelineProps {
  storyGroups?: any[];
  onViewStory?: (storyId: string) => void;
}

const StoriesTimeline: React.FC<StoriesTimelineProps> = ({ storyGroups = [], onViewStory }) => {
  const { stories, loadingStories } = useStories();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>(undefined);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If we have stories from the prop, use those, otherwise use the ones from the hook
    if (storyGroups && storyGroups.length > 0) {
      // Flatten story groups into a single array of stories
      const allStories: Story[] = [];
      storyGroups.forEach(group => {
        if (group.stories && Array.isArray(group.stories)) {
          allStories.push(...group.stories);
        }
      });
      setFilteredStories(allStories);
    } else if (stories && stories.length > 0) {
      setFilteredStories(stories);
    }
  }, [storyGroups, stories]);
  
  const handleOpenStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setViewerOpen(true);
    if (onViewStory) {
      onViewStory(storyId);
    }
  };
  
  const handleCloseViewer = () => {
    setViewerOpen(false);
    setSelectedStoryId(undefined);
  };
  
  if (loadingStories) {
    return (
      <div className="overflow-x-auto py-4">
        <div className="flex space-x-4 px-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="mt-2 h-3 w-16 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (filteredStories.length === 0) {
    return (
      <div className="overflow-x-auto py-4">
        <div className="flex justify-center items-center h-24">
          <p className="text-muted-foreground">No stories available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="overflow-x-auto py-4">
        <div className="flex space-x-4 px-4">
          {user && (
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => navigate('/stories/create')}
            >
              <div className="h-16 w-16 rounded-full flex items-center justify-center border-2 border-dashed border-primary">
                <span className="text-2xl font-semibold text-primary">+</span>
              </div>
              <span className="mt-1 text-xs text-center">Add Story</span>
            </div>
          )}
          
          {filteredStories.map((story) => (
            <motion.div
              key={story.id}
              className="flex flex-col items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenStory(story.id)}
            >
              <div className={`h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-0.5 ${story.viewed ? 'opacity-50' : ''}`}>
                <img
                  src={story.thumbnail_url || `https://i.pravatar.cc/150?u=${story.creator_id}`}
                  alt="Story thumbnail"
                  className="h-full w-full object-cover rounded-full border-2 border-background"
                />
              </div>
              <span className="mt-1 text-xs text-center truncate w-16">
                {story.creator_name || `User_${story.creator_id?.substring(0, 5)}`}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {viewerOpen && selectedStoryId && (
        <StoriesViewer
          stories={filteredStories}
          initialStoryId={selectedStoryId}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
};

export default StoriesTimeline;
