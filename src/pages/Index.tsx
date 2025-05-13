
import React, { useEffect } from 'react';
import { useStories, StoriesProvider } from '@/hooks/use-stories';
import StoriesViewer from '@/components/stories/StoriesViewer';
import StoriesTimeline from '@/components/stories/StoriesTimeline';

const Index = () => {
  return (
    <StoriesProvider>
      <IndexContent />
    </StoriesProvider>
  );
};

const IndexContent = () => {
  const { storyGroups, openViewer, loadStories, isLoading } = useStories();
  
  useEffect(() => {
    loadStories().catch(error => {
      console.error('Error loading stories:', error);
    });
  }, [loadStories]);
  
  const handleStoryClick = (groupIndex: number) => {
    openViewer(groupIndex);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Stories</h1>
      
      <div className="mb-8">
        <StoriesTimeline 
          onStoryClick={handleStoryClick} 
          storyGroups={storyGroups}
        />
      </div>
      
      <StoriesViewer />
      
      {isLoading && (
        <div className="text-center py-8">
          <p>Loading stories...</p>
        </div>
      )}
      
      {!isLoading && storyGroups.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No stories available. Create your first story!</p>
        </div>
      )}
    </div>
  );
};

export default Index;
