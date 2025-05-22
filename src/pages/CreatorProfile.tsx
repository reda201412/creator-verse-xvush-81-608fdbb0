
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VideoData } from '@/types/video';
import { useAuth } from '@/contexts/AuthContext';
import { getVideosByUserId } from '@/services/videoService';
import { FiUser, FiClock, FiHeart, FiMessageSquare, FiEye, FiBarChart2, FiCalendar, FiAward } from 'react-icons/fi';
import VideoUploader from '@/components/creator/VideoUploader';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CreatorJourney from '@/components/creator/CreatorJourney';
import CreatorDNA from '@/components/creator/CreatorDNA';

// Types for our enhanced creator data
interface CreatorMetrics {
  followers: number;
  following: number;
  totalViews: number;
  totalLikes: number;
  totalVideos: number;
  engagementRate: number;
  joinDate: string;
  categories: string[];
}

// Interface for Creator Skills used in CreatorDNA
export interface CreatorSkill {
  name: string;
  level: number;
}

// Interface for Journey Milestones
export interface JourneyMilestone {
  id: number;
  date: string;
  year: number;
  title: string;
  description: string;
}

const CreatorProfile = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [activeCategory, setActiveCategory] = useState('all');
  const [creatorVideos, setCreatorVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isCreator, profile } = useAuth();
  const { id } = useParams<{ id: string }>();
  
  // Determine if viewing own profile
  const isOwnProfile = user && (!id || id === user.uid);
  const creatorId = id || user?.uid;

  useEffect(() => {
    const loadVideos = async () => {
      if (!creatorId) return;
      
      try {
        setIsLoading(true);
        const videos = await getVideosByUserId(creatorId);
        setCreatorVideos(videos);
      } catch (error) {
        console.error('Error loading videos:', error);
        toast.error("Impossible de charger les vidéos");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVideos();
  }, [creatorId]);

  // Enhanced creator data - hardcoded for now, should be fetched from database
  const creatorData = {
    name: profile?.displayName || 'Creator Name',
    username: profile?.username || '@creator',
    bio: profile?.bio || 'Digital creator passionate about creating engaging content. Join me on this creative journey!',
    avatar: profile?.avatarUrl || 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/1200x400',
    metrics: {
      followers: 12453,
      following: 342,
      totalViews: creatorVideos.reduce((sum, video) => sum + (video.viewCount || 0), 0),
      totalLikes: creatorVideos.reduce((sum, video) => sum + (video.likeCount || 0), 0),
      totalVideos: creatorVideos.length,
      engagementRate: 4.8,
      joinDate: profile?.createdAt ? new Date(profile.createdAt).toISOString() : '2022-01-15',
      categories: ['Tutorials', 'Vlogs', 'Reviews', 'Gaming']
    } as CreatorMetrics
  };

  // Group videos by categories
  const videoCategories = [
    {
      id: 'all',
      name: 'Toutes les vidéos',
      videos: creatorVideos
    },
    ...creatorData.metrics.categories.map(category => ({
      id: category.toLowerCase(),
      name: category,
      videos: creatorVideos.filter(video => video.category?.toLowerCase() === category.toLowerCase())
    }))
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Sample creator skills for CreatorDNA component
  const creatorSkills: CreatorSkill[] = [
    { name: 'Vidéo', level: 85 },
    { name: 'Édition', level: 92 },
    { name: 'Storytelling', level: 78 },
    { name: 'Musique', level: 65 },
    { name: 'Animation', level: 72 }
  ];

  // Sample journey milestones for CreatorJourney component
  const journeyMilestones: JourneyMilestone[] = [
    {
      id: 1,
      date: '2020-03-15',
      year: 2020,
      title: 'Première vidéo',
      description: 'Publication de ma première vidéo sur la plateforme'
    },
    {
      id: 2,
      date: '2021-06-20',
      year: 2021,
      title: '1000 abonnés',
      description: 'Une étape importante dans ma carrière de créateur'
    },
    {
      id: 3,
      date: '2022-01-10',
      year: 2022,
      title: 'Partenariat',
      description: 'Premier partenariat avec une marque importante'
    },
    {
      id: 4,
      date: '2023-04-05',
      year: 2023,
      title: 'Communauté',
      description: 'Création de ma communauté de fans dédiée'
    }
  ];

  const renderVideoCard = (video: VideoData) => (
    <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={video.thumbnailUrl || video.thumbnail_url || 'https://via.placeholder.com/300x169'}
          alt={video.title}
          className="w-full h-40 object-cover"
        />
        {video.isPremium || video.is_premium ? (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            Premium
          </div>
        ) : null}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {video.duration || '0:00'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="flex items-center mr-3">
            <FiEye className="mr-1" /> {formatNumber(video.viewCount || 0)}
          </span>
          <span className="flex items-center">
            <FiHeart className="mr-1" /> {formatNumber(video.likeCount || 0)}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {new Date(video.uploadDate || video.createdAt || '').toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-indigo-600">{formatNumber(creatorData.metrics.followers)}</div>
        <div className="text-gray-600">Abonnés</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-indigo-600">{formatNumber(creatorData.metrics.totalViews)}</div>
        <div className="text-gray-600">Vues totales</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-indigo-600">{creatorData.metrics.engagementRate}%</div>
        <div className="text-gray-600">Taux d'engagement</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-indigo-600">{formatNumber(creatorData.metrics.totalVideos)}</div>
        <div className="text-gray-600">Vidéos</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gray-200">
        <img 
          src={creatorData.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-12 left-4 md:left-8">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-white overflow-hidden">
            <img 
              src={creatorData.avatar} 
              alt={creatorData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 md:px-8 pt-16 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{creatorData.name}</h1>
            <p className="text-gray-600">{creatorData.username}</p>
          </div>
          {isOwnProfile && isCreator ? (
            <VideoUploader 
              onUploadComplete={() => {
                // Refresh videos after upload
                getVideosByUserId(user.uid).then(setCreatorVideos);
              }} 
              isCreator={isCreator}
            />
          ) : (
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              S'abonner
            </Button>
          )}
        </div>
        
        <p className="mt-3 text-gray-700">{creatorData.bio}</p>
        
        <div className="flex items-center mt-3 text-sm text-gray-600">
          <span className="flex items-center mr-4">
            <FiCalendar className="mr-1" />
            Inscrit {new Date(creatorData.metrics.joinDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <span className="flex items-center">
            <FiUser className="mr-1" />
            {formatNumber(creatorData.metrics.following)} Abonnements
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {creatorData.metrics.categories.map(category => (
            <span 
              key={category} 
              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mx-4 md:mx-8 -mb-px">
            <TabsTrigger value="videos">Vidéos</TabsTrigger>
            <TabsTrigger value="about">À propos</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="px-4 md:px-8 py-6">
        <TabsContent value="videos">
          <div>
            {/* Video Categories */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {videoCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Videos Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : creatorVideos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucune vidéo disponible pour le moment.</p>
                {isOwnProfile && isCreator && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Upload video"]')?.click()}
                  >
                    Télécharger votre première vidéo
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videoCategories
                  .find(cat => cat.id === activeCategory)?.videos
                  .map(video => renderVideoCard(video))
                }
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="about">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">À propos de {creatorData.name}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Bio</h3>
                  <p className="mt-1 text-gray-600">{creatorData.bio}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Statistiques</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FiAward className="text-indigo-500 mr-2" />
                      <span className="text-gray-600">Top 5%</span>
                    </div>
                    <div className="flex items-center">
                      <FiBarChart2 className="text-indigo-500 mr-2" />
                      <span className="text-gray-600">4.8/5 Note</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-indigo-500 mr-2" />
                      <span className="text-gray-600">2+ ans de création</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <CreatorDNA skills={creatorSkills} />
              <CreatorJourney milestones={journeyMilestones} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Statistiques de chaîne</h2>
            {renderMetrics()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Vidéos les plus performantes</h3>
                <div className="space-y-3">
                  {creatorVideos
                    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                    .slice(0, 3)
                    .map(video => (
                      <div key={video.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                        <img 
                          src={video.thumbnail_url || video.thumbnailUrl || 'https://via.placeholder.com/80x45'} 
                          alt={video.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                          <p className="text-xs text-gray-500">{formatNumber(video.viewCount || 0)} vues</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Démographie de l'audience</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">18-24 ans</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">25-34 ans</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">35-44 ans</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </div>
  );
};

export default CreatorProfile;
