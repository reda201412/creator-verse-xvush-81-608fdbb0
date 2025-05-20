import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreatorProfileData } from '@/types/video';
import { TrendingContentItem } from '@/vite-env';

const TrendingContent = () => {
  // Mock trending videos data
  const mockTrendingVideos: TrendingContentItem[] = [
    {
      id: "1",
      title: "Latest Dance Choreography",
      thumbnail_url: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0",
      video_url: "https://example.com/videos/dance",
      type: "standard",
      format: "16:9",
      is_premium: false
    },
    {
      id: "2",
      title: "Top 10 Travel Destinations",
      thumbnail_url: "https://images.unsplash.com/photo-1476514524891-c428ca493ead",
      video_url: "https://example.com/videos/travel",
      type: "standard",
      format: "16:9",
      is_premium: false
    },
    {
      id: "3",
      title: "Beginner's Guide to Cooking",
      thumbnail_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
      video_url: "https://example.com/videos/cooking",
      type: "standard",
      format: "16:9",
      is_premium: false
    },
    {
      id: "4",
      title: "Advanced JavaScript Tutorial",
      thumbnail_url: "https://images.unsplash.com/photo-1519389950473-47a0277814d1",
      video_url: "https://example.com/videos/javascript",
      type: "standard",
      format: "16:9",
      is_premium: true
    },
    {
      id: "5",
      title: "DIY Home Decor Ideas",
      thumbnail_url: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
      video_url: "https://example.com/videos/homedecor",
      type: "standard",
      format: "16:9",
      is_premium: false
    }
  ];
  
  // Mock creator profiles data
  const mockCreatorProfiles: CreatorProfileData[] = [
    {
      id: "creator1",
      uid: "user1",
      username: "sophia_creative",
      displayName: "Sophia Creative",
      bio: "Digital artist exploring the boundaries between reality and imagination.",
      avatarUrl: "https://i.pravatar.cc/300?img=1",
      profileImageUrl: "https://i.pravatar.cc/300?img=1",
      isPremium: true,
      isOnline: true,
      metrics: {
        followers: 12400,
        likes: 85600,
        rating: 4.8
      }
    },
    {
      id: "creator2",
      uid: "user2",
      username: "mark_the_mentor",
      displayName: "Mark The Mentor",
      bio: "Guiding the next generation of developers with practical advice and tutorials.",
      avatarUrl: "https://i.pravatar.cc/300?img=2",
      profileImageUrl: "https://i.pravatar.cc/300?img=2",
      isPremium: false,
      isOnline: false,
      metrics: {
        followers: 8900,
        likes: 52300,
        rating: 4.5
      }
    }
  ];
  
  const trendingContent = mockTrendingVideos;
  const creatorProfiles = mockCreatorProfiles;
  
  return (
    <div className="container py-8">
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Contenu Tendance</CardTitle>
            <CardDescription>
              Découvrez les vidéos les plus populaires du moment.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingContent.map((item) => (
              <div key={item.id} className="p-2">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={item.thumbnail_url || "https://via.placeholder.com/480x270"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-3 text-white">
                      <div className="flex items-center gap-2">
                        {item.is_premium && (
                          <Badge variant="secondary" className="text-xs">Premium</Badge>
                        )}
                      </div>
                      <h3 className="font-medium line-clamp-1 mt-1">{item.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Créateurs Populaires</CardTitle>
            <CardDescription>
              Explorez les profils des créateurs les plus en vogue.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {creatorProfiles.map((creator) => (
              <div key={creator.id} className="p-2">
                <Link to={`/creator/${creator.id}`} className="block">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={creator.profileImageUrl || "https://via.placeholder.com/300"} alt={creator.displayName || creator.username} />
                      <AvatarFallback>{creator.displayName?.charAt(0) || creator.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {creator.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="font-medium">{creator.displayName || creator.username}</h3>
                    <p className="text-sm text-gray-500">{creator.bio}</p>
                  </div>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TrendingContent;
