import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useStories from '@/hooks/use-stories';
import { Skeleton } from '@/components/ui/skeleton';

const Stories = () => {
  const { user } = useAuth();
  const { stories, loadingStories, uploadStory, markStoryAsViewed, toggleHighlight, fetchStories } = useStories();
  const [activeTab, setActiveTab] = useState('following');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setUploading(true);
    const result = await uploadStory(selectedFile, caption);
    setUploading(false);

    if (result.success) {
      setSelectedFile(null);
      setCaption('');
    }
  };

  const handleView = async (storyId: string) => {
    await markStoryAsViewed(storyId);
  };

  const handleHighlight = async (storyId: string) => {
    await toggleHighlight(storyId);
  };

  const visibleStories = stories.filter(story => {
    if (activeTab === 'following') {
      return true; // Show all stories for now
    } else if (activeTab === 'popular') {
      return story.view_count > 50; // Example popularity filter
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Stories</h1>
      
      <Tabs defaultValue="following" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
      </Tabs>

      {user && (
        <div className="mb-4">
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="mb-2" />
          <input
            type="text"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <Button onClick={handleUpload} disabled={uploading || !selectedFile} className="w-full">
            {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload Story"}
          </Button>
        </div>
      )}

      {loadingStories ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <Skeleton className="h-48 w-full" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {visibleStories.map(story => (
            <div key={story.id} className="border rounded-lg p-4">
              <img src={story.media_url} alt={story.caption} className="h-48 w-full object-cover rounded mb-2" />
              <h3 className="font-semibold">{story.caption}</h3>
              <p className="text-sm text-muted-foreground">Views: {story.view_count}</p>
              <div className="flex justify-between mt-2">
                <Button variant="outline" size="sm" onClick={() => handleView(story.id)}>View</Button>
                <Button variant="secondary" size="sm" onClick={() => handleHighlight(story.id)}>
                  {story.is_highlighted ? 'Unhighlight' : 'Highlight'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stories;
