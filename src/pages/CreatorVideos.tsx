
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCreatorVideos, VideoData } from '@/services/creatorService';
import { toast } from 'sonner';
import VideoHeader from '@/components/creator/videos/VideoHeader';
import VideoAnalyticsModal from '@/components/creator/videos/VideoAnalyticsModal';

const CreatorVideos: React.FC = () => {
  console.log('CreatorVideos rendu');
  const { user } = useAuth();
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const fetchVideos = async () => {
    if (!creatorId) return;
    try {
      const fetchedVideos = await getCreatorVideos(creatorId);
      console.log("Vidéos récupérées:", fetchedVideos);
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Erreur lors de la récupération des vidéos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [creatorId]);

  const handleUploadComplete = (newVideoData?: VideoData | null) => {
    console.log("Upload terminé, nouvelle vidéo:", newVideoData);
    if (newVideoData) {
      setVideos(prev => [newVideoData, ...prev]);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    // TODO: Implémenter la suppression via une fonction backend
    console.warn("La suppression de vidéo nécessite une fonction backend pour supprimer de MUX.");
    toast.error('La suppression de vidéo n\'est pas encore implémentée');
  };

  const handleAnalyticsClick = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsAnalyticsOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <VideoHeader onUploadComplete={handleUploadComplete} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {video.thumbnailUrl && (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-sm text-gray-600 mb-4">{video.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {video.isPremium ? 'Premium' : 'Gratuit'}
                </span>
                <div className="space-x-2">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleAnalyticsClick(video.id)}
                  >
                    Analytics
                  </button>
                  <button
                    className="btn btn-destructive btn-sm"
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedVideoId && (
        <VideoAnalyticsModal
          isOpen={isAnalyticsOpen}
          onClose={() => {
            setIsAnalyticsOpen(false);
            setSelectedVideoId(null);
          }}
          videoId={selectedVideoId}
        />
      )}
    </div>
  );
};

export default CreatorVideos;
