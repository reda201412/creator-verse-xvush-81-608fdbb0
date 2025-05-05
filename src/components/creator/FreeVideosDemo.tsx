
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, Eye, ThumbsUp } from 'lucide-react';
import { getFreeVideos } from '@/api/videoAPI';
import { FreeVideoResponse } from '@/types/content';

const FreeVideosDemo = () => {
  const [videos, setVideos] = useState<FreeVideoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFreeVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFreeVideos();
      setVideos(data);
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError('Impossible de charger les vidéos. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load videos on component mount
    loadFreeVideos();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              API Vidéos Gratuites
            </CardTitle>
            <CardDescription>
              Démonstration de l'endpoint /api/free-videos
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadFreeVideos} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              'Rafraîchir'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm">
            {error}
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground mb-4 bg-muted p-2 rounded-md font-mono overflow-x-auto">
              GET /api/free-videos
            </div>

            {videos.length > 0 ? (
              <div className="grid gap-4">
                {videos.map(video => (
                  <div key={video.id} className="border border-border rounded-md overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-1/3 aspect-video bg-muted">
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            No thumbnail
                          </div>
                        )}
                        <Badge className={`absolute top-2 left-2 ${
                          video.type === 'teaser' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'
                        }`}>
                          {video.type === 'teaser' ? 'Teaser' : 'Gratuit'}
                        </Badge>
                        {video.shareable && (
                          <Badge className="absolute top-2 right-2 bg-purple-500/10 text-purple-600">
                            XVush
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <img 
                            src={video.performerImage || 'https://placehold.co/30x30'} 
                            alt={video.author}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs text-muted-foreground">{video.author}</span>
                        </div>
                        <h3 className="font-medium mb-1">{video.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {video.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{video.publishDate}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {video.metrics.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {video.metrics.likes.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <p>Aucune vidéo disponible.</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="text-sm font-medium mb-2">Structure de la réponse JSON:</h4>
              <pre className="text-xs overflow-x-auto p-2 bg-background rounded border">
{`[
  {
    "id": "video123",
    "performerId": "3",
    "author": "Nom du créateur",
    "performerImage": "https://url-de-image.jpg",
    "thumbnail": "https://url-du-thumbnail.jpg",
    "title": "Titre de la vidéo",
    "description": "Description de la vidéo",
    "publishDate": "01/05/2025",
    "metrics": {
      "likes": 150,
      "views": 2500
    },
    "type": "standard" | "teaser",
    "shareable": true | false
  },
  // ...autres vidéos
]`}
              </pre>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FreeVideosDemo;
