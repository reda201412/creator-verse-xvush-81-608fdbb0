
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Eye, 
  Heart, 
  MessageSquare, 
  Search, 
  Filter,
  Star,
  Crown,
  Zap,
  Users,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentCreatorCard from '@/components/viewer/ContentCreatorCard';
import ContentGrid from '@/components/shared/ContentGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '@/hooks/use-responsive';

interface TrendingVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  type: 'premium' | 'vip' | 'standard';
  format: 'video' | 'image';
  duration?: number;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  metrics: {
    views: number;
    likes: number;
    comments: number;
    trendingScore: number;
    growthRate: number;
  };
  tags: string[];
  isLive?: boolean;
  isPremium: boolean;
}

interface TrendingCreator {
  id: string;
  userId: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  isPremium: boolean;
  isVerified: boolean;
  metrics: {
    followers: number;
    likes: number;
    rating: number;
    growthRate: number;
  };
  specialties: string[];
}

const TrendingContent = () => {
  const { isMobile, isTablet } = useResponsive();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');

  // Mock data for trending videos
  const [trendingVideos] = useState<TrendingVideo[]>([
    {
      id: '1',
      title: 'Expérience VIP Exclusive',
      thumbnailUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400',
      videoUrl: '#',
      type: 'vip',
      format: 'video',
      duration: 180,
      creator: {
        id: '1',
        name: 'Luna Star',
        username: 'luna_star',
        avatar: 'https://i.pravatar.cc/100?u=luna',
        isVerified: true
      },
      metrics: {
        views: 125000,
        likes: 8900,
        comments: 234,
        trendingScore: 95,
        growthRate: 340
      },
      tags: ['vip', 'exclusive', 'trending'],
      isPremium: true
    },
    {
      id: '2',
      title: 'Session Premium Intime',
      thumbnailUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
      videoUrl: '#',
      type: 'premium',
      format: 'video',
      duration: 240,
      creator: {
        id: '2',
        name: 'Aria Divine',
        username: 'aria_divine',
        avatar: 'https://i.pravatar.cc/100?u=aria',
        isVerified: true
      },
      metrics: {
        views: 89000,
        likes: 5600,
        comments: 189,
        trendingScore: 88,
        growthRate: 220
      },
      tags: ['premium', 'intimate', 'popular'],
      isLive: true,
      isPremium: true
    }
  ]);

  // Mock data for trending creators
  const [trendingCreators] = useState<TrendingCreator[]>([
    {
      id: '1',
      userId: 'creator-1',
      username: 'luna_star',
      name: 'Luna Star',
      avatar: 'https://i.pravatar.cc/150?u=luna',
      bio: 'Créatrice de contenu premium et expériences VIP exclusives',
      isPremium: true,
      isVerified: true,
      metrics: {
        followers: 45000,
        likes: 230000,
        rating: 4.9,
        growthRate: 340
      },
      specialties: ['VIP', 'Premium', 'Live']
    },
    {
      id: '2',
      userId: 'creator-2',
      username: 'aria_divine',
      name: 'Aria Divine',
      avatar: 'https://i.pravatar.cc/150?u=aria',
      bio: 'Sessions intimes et contenu personnalisé',
      isPremium: true,
      isVerified: true,
      metrics: {
        followers: 32000,
        likes: 180000,
        rating: 4.8,
        growthRate: 220
      },
      specialties: ['Premium', 'Personnalisé', 'Chat']
    }
  ]);

  const categories = [
    { id: 'all', label: 'Tout', icon: Flame },
    { id: 'vip', label: 'VIP', icon: Crown },
    { id: 'premium', label: 'Premium', icon: Star },
    { id: 'live', label: 'En Direct', icon: Zap },
    { id: 'rising', label: 'Émergent', icon: TrendingUp }
  ];

  const timeFilters = [
    { id: '1h', label: '1h' },
    { id: '24h', label: '24h' },
    { id: '7d', label: '7j' },
    { id: '30d', label: '30j' }
  ];

  const filteredVideos = trendingVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           video.type === selectedCategory || 
                           (selectedCategory === 'live' && video.isLive) ||
                           (selectedCategory === 'rising' && video.metrics.growthRate > 200);
    return matchesSearch && matchesCategory;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header Section - Mobile First */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent mb-2 sm:mb-4">
                Tendances
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl lg:max-w-2xl mx-auto px-4">
                Découvrez le contenu le plus populaire et les créateurs qui font sensation
              </p>
            </motion.div>
          </div>

          {/* Search and Filters - Mobile First */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 backdrop-blur-sm border-white/20 text-sm"
              />
            </div>
            
            {/* Time Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {timeFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={timeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeFilter(filter.id)}
                  className="whitespace-nowrap text-xs px-3 py-1.5 h-auto"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap bg-background/50 backdrop-blur-sm border-white/20 text-xs px-3 py-1.5 h-auto"
                  >
                    <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className={cn(isMobile ? "text-xs" : "text-sm")}>{category.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile First */}
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6 md:space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-sm h-9 sm:h-10">
            <TabsTrigger value="all" className="text-xs sm:text-sm">Tout</TabsTrigger>
            <TabsTrigger value="videos" className="text-xs sm:text-sm">Vidéos</TabsTrigger>
            <TabsTrigger value="creators" className="text-xs sm:text-sm">Créateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 sm:space-y-8">
            {/* Hot Content Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Contenu Brûlant</h2>
                <Badge variant="destructive" className="animate-pulse text-xs">
                  LIVE
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredVideos.slice(0, 4).map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm border-white/20">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {video.isLive && (
                          <Badge className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-red-500 animate-pulse text-xs">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1"></div>
                            LIVE
                          </Badge>
                        )}
                        
                        {video.type !== 'standard' && (
                          <Badge className={cn(
                            "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-xs",
                            video.type === 'vip' ? "bg-gradient-to-r from-purple-600 to-indigo-400" : 
                            video.type === 'premium' ? "bg-gradient-to-r from-amber-500 to-amber-300" : ""
                          )}>
                            {video.type === 'vip' ? 'VIP' : 'Premium'}
                          </Badge>
                        )}
                        
                        <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                          {Math.floor(video.duration! / 60)}:{(video.duration! % 60).toString().padStart(2, '0')}
                        </div>
                        
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
                        </div>
                      </div>
                      
                      <CardContent className="p-3 sm:p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{video.title}</h3>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <img
                            src={video.creator.avatar}
                            alt={video.creator.name}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                          />
                          <span className="text-xs sm:text-sm text-muted-foreground truncate">{video.creator.name}</span>
                          {video.creator.isVerified && (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {formatNumber(video.metrics.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {formatNumber(video.metrics.likes)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-green-500">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-xs">+{video.metrics.growthRate}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Top Creators Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Créateurs Tendance</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {trendingCreators.map((creator) => (
                  <ContentCreatorCard
                    key={creator.id}
                    creator={creator}
                    className="hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4 sm:space-y-6">
            <ContentGrid
              contents={filteredVideos.map(video => ({
                id: video.id,
                imageUrl: video.thumbnailUrl,
                title: video.title,
                type: video.type,
                format: video.format,
                duration: video.duration,
                metrics: video.metrics,
                isTrending: video.metrics.trendingScore > 90
              }))}
              layout="masonry"
              showAnimations={true}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          </TabsContent>

          <TabsContent value="creators" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {trendingCreators.map((creator) => (
                <ContentCreatorCard
                  key={creator.id}
                  creator={creator}
                  className="hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrendingContent;
