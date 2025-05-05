
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useStories } from '@/hooks/use-stories';
import StoriesViewer from './StoriesViewer';
import StoryPublisher from './StoryPublisher';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBehavior } from '@/hooks/use-user-behavior';

const StoriesTimeline: React.FC = () => {
  const { storyGroups, loading } = useStories();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const { user, isCreator } = useAuth();
  const { trackInteraction } = useUserBehavior();
  
  const handleStoryClick = (index: number) => {
    setSelectedGroupIndex(index);
    setViewerOpen(true);
    trackInteraction('click', { feature: 'open_story', index });
  };
  
  if (loading) {
    return (
      <div className="w-full overflow-x-auto py-4">
        <div className="flex space-x-4 px-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-1 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-gray-300" />
              <div className="w-14 h-3 rounded bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (storyGroups.length === 0 && !isCreator) {
    return null;
  }
  
  return (
    <>
      <div className="w-full overflow-x-auto py-4 no-scrollbar">
        <div className="flex space-x-4 px-4">
          {isCreator && (
            <div className="flex flex-col items-center space-y-1">
              <StoryPublisher />
              <span className="text-xs text-muted-foreground">Nouveau</span>
            </div>
          )}
          
          {storyGroups.map((group, index) => (
            <motion.div 
              key={group.creator.id} 
              className="flex flex-col items-center space-y-1 cursor-pointer"
              onClick={() => handleStoryClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`rounded-full p-[2px] ${
                group.hasUnviewed 
                  ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500' 
                  : 'bg-muted'
              }`}>
                <Avatar className="w-16 h-16 border-2 border-background">
                  <AvatarImage src={group.creator.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {group.creator.display_name?.charAt(0) || group.creator.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs truncate w-16 text-center">
                {group.creator.id === user?.id
                  ? 'Votre story'
                  : group.creator.display_name || group.creator.username}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      
      <StoriesViewer 
        isOpen={viewerOpen} 
        onClose={() => setViewerOpen(false)} 
        initialGroupIndex={selectedGroupIndex}
      />
    </>
  );
};

export default StoriesTimeline;
