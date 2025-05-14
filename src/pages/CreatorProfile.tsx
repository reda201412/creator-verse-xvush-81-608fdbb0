
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import CreatorHeader from '@/components/CreatorHeader';
import ContentGrid from '@/components/ContentGrid';
import TabNav from '@/components/TabNav';
import SubscriptionPanel from '@/components/SubscriptionPanel';
import ProfileNav from '@/components/ProfileNav';
import { useToast } from '@/hooks/use-toast';
import CreatorDNA from '@/components/creator/CreatorDNA';
import CreatorJourney from '@/components/creator/CreatorJourney';
import FeedbackLoop from '@/components/creator/FeedbackLoop';
import ValueVault from '@/components/creator/ValueVault';
import MonetizedContentSection from '@/components/creator/MonetizedContentSection';
import { ContentType, RestrictedContentType, ContentItem, FeedbackType, FeedbackMessage } from '@/types/content';
import { useAuth } from '@/contexts/AuthContext';
import { getCreatorById, getCreatorVideos } from '@/services/creatorService';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { CreatorProfileRouteProps } from '@/types/navigation';

const CreatorProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('grid');
  const { toast } = useToast();
  const { user, profile, isCreator } = useAuth();
  const params = useParams<{ id: string }>();
  const creatorId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatorData, setCreatorData] = useState<any>(null);
  const [creatorContent, setCreatorContent] = useState<any[]>([]);
  const [creatorMetrics, setCreatorMetrics] = useState<any>({
    followers: 0,
    following: 0,
    revenue: 0,
    growthRate: 0,
    nextTierProgress: 0,
    retentionRate: 0,
    superfans: 0,
    watchMinutes: 0
  });
  
  // Using these for now, but they should be fetched from the database in a real implementation
  const [creatorDNA, setCreatorDNA] = useState({
    skills: ['Photographie', 'Narration visuelle', 'Editing photo', 'Direction artistique', 'Stylisme'],
    style: ['Minimaliste', 'Poétique', 'Lumineux', 'Architectural', 'Émotionnel'],
    achievements: ['100K abonnés en 2023', 'Collaboration Vogue', 'Exposition Paris Photo', 'Award Creator Impact']
  });
  
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  const [premiumContent, setPremiumContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    const loadCreatorData = async () => {
      if (!creatorId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch creator profile
        const creator = await getCreatorById(creatorId);
        if (!creator) {
          setError("Créateur non trouvé");
          setLoading(false);
          return;
        }
        
        // Set creator data
        setCreatorData({
          name: creator.displayName || creator.username,
          username: creator.username,
          avatar: creator.avatarUrl || `https://i.pravatar.cc/300?u=${creator.uid}`,
          bio: creator.bio || "Aucune bio disponible",
          tier: 'silver',  // This should come from the database in a real implementation
          isCreator: creator.role === 'creator',
          isOnline: creator.isOnline || false
        });
        
        // Fetch creator metrics
        const metrics = creator.metrics || {};
        
        // Get additional metrics from Supabase
        const { count: videoCount, error: videoCountError } = await supabase
          .from('videos')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', creatorId);
          
        const { data: revenueData, error: revenueError } = await supabase
          .from('transactions')
          .select('amount_usdt')
          .eq('user_id', creatorId);
        
        let totalRevenue = 0;
        if (!revenueError && revenueData) {
          totalRevenue = revenueData.reduce((sum, item) => sum + (Number(item.amount_usdt) || 0), 0);
        }
        
        setCreatorMetrics({
          ...metrics,
          revenue: totalRevenue,
          growthRate: 12, // These should be calculated in a real implementation
          nextTierProgress: 92,
          retentionRate: 87,
          superfans: Math.floor(metrics.followers * 0.02) || 0,
          watchMinutes: videoCount ? videoCount * 1000 : 0
        });
        
        // Fetch creator content/videos
        const videos = await getCreatorVideos(creatorId);
        
        if (videos && videos.length > 0) {
          const processedVideos = videos.map(video => ({
            id: video.id,
            imageUrl: video.thumbnail_url || "https://via.placeholder.com/800",
            title: video.title || "Sans titre",
            type: video.type || "standard",
            format: video.format || "image",
            duration: video.duration || 0,
            metrics: {
              likes: Math.floor(Math.random() * 1000) + 100,
              comments: Math.floor(Math.random() * 100),
              views: Math.floor(Math.random() * 10000),
              revenue: video.type === 'premium' || video.type === 'vip' ? Math.floor(Math.random() * 500) : 0,
              growth: Math.floor(Math.random() * 20)
            }
          }));
          
          setCreatorContent(processedVideos);
          
          // Set premium content
          const premiumVids = processedVideos
            .filter(v => v.type === 'premium' || v.type === 'vip')
            .map(v => ({
              id: v.id.toString(),
              title: v.title,
              type: v.type as RestrictedContentType,
              category: "vidéo",
              views: v.metrics?.views || 0,
              thumbnail: v.imageUrl
            }));
            
          setPremiumContent(premiumVids);
        }
        
        // Fetch feedback messages (comments)
        // In a real implementation, these would come from the database
        setFeedbackMessages([
          {
            id: "f1",
            username: "marie_p",
            avatar: "https://i.pravatar.cc/150?img=1",
            message: "Tes photos me donnent toujours envie de redécorer mon appartement !",
            timestamp: "Il y a 2 heures",
            type: "comment" as FeedbackType
          },
          {
            id: "f2",
            username: "thomas453",
            avatar: "https://i.pravatar.cc/150?img=2",
            message: "Est-ce que tu pourrais faire un tuto sur la composition des photos lifestyle ?",
            timestamp: "Il y a 5 heures",
            type: "request" as FeedbackType
          }
        ]);
        
      } catch (err) {
        console.error("Error loading creator data:", err);
        setError("Une erreur s'est produite lors du chargement des données du créateur");
      } finally {
        setLoading(false);
      }
    };
    
    loadCreatorData();
  }, [creatorId]);

  // Check if the current user is the owner of this profile
  const isProfileOwner = isCreator && user && creatorId === user.id;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubscribe = (tier: string) => {
    toast({
      title: `Abonnement ${tier} sélectionné`,
      description: "Vous allez être redirigé vers la page de paiement",
    });
  };

  // Different layouts based on selected tab
  const getContentLayout = () => {
    switch (activeTab) {
      case 'grid':
        return 'grid';
      case 'videos':
        return 'vertical';
      case 'premium':
      case 'vip':
        return 'collections';
      case 'stats':
        return 'featured';
      default:
        return 'grid';
    }
  };

  // Filter content based on active tab
  const getFilteredContent = () => {
    if (activeTab === 'videos') {
      return creatorContent.filter(content => content.format === 'video');
    } else if (activeTab === 'premium') {
      return creatorContent.filter(content => content.type === 'premium');
    } else if (activeTab === 'vip') {
      return creatorContent.filter(content => content.type === 'vip');
    }
    return creatorContent;
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-8">
        <ProfileNav username="Chargement..." onBack={handleGoBack} />
        <Skeleton className="w-full h-64 rounded-xl" />
        <Skeleton className="w-full h-12 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !creatorData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ProfileNav username="Erreur" onBack={handleGoBack} />
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold text-red-500">
            {error || "Créateur non trouvé"}
          </h2>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <ProfileNav 
        username={creatorData.username} 
        onBack={handleGoBack} 
      />
      
      <div className="container mx-auto px-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <CreatorHeader 
            name={creatorData.name}
            username={creatorData.username}
            avatar={creatorData.avatar}
            bio={creatorData.bio}
            tier={creatorData.tier}
            metrics={creatorMetrics}
            isCreator={creatorData.isCreator}
            isOwner={isProfileOwner}
            isOnline={creatorData.isOnline}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TabNav 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            isCreator={creatorData.isCreator}
          />
        </motion.div>
        
        {activeTab === 'stats' && creatorData.isCreator ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <CreatorDNA
                creatorName={creatorData.name}
                creatorSkills={creatorDNA.skills}
                creatorStyle={creatorDNA.style}
                creatorAchievements={creatorDNA.achievements}
              />
              
              <ValueVault
                premiumContent={premiumContent}
              />
            </div>
            
            <div className="space-y-6">
              <CreatorJourney
                milestones={[
                  {
                    id: "j1",
                    date: "Avril 2022",
                    title: "Premiers pas",
                    description: "Ouverture du compte et début du partage quotidien",
                    metricBefore: 0,
                    metricAfter: 1200,
                    metricLabel: "Abonnés"
                  },
                  {
                    id: "j2",
                    date: "Septembre 2023",
                    title: "Exposition à Paris",
                    description: "Première exposition dans galerie parisienne",
                    metricBefore: 19800,
                    metricAfter: 21500,
                    metricLabel: "Abonnés"
                  }
                ]}
              />
              
              <FeedbackLoop
                feedbackMessages={feedbackMessages}
                isCreator={true}
              />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {activeTab === 'premium' && (
              <MonetizedContentSection 
                isCreator={creatorData.isCreator} 
              />
            )}
            
            <ContentGrid 
              contents={getFilteredContent()} 
              layout={getContentLayout()} 
              isCreator={creatorData.isCreator}
            />
            
            {!creatorData.isCreator && (
              <SubscriptionPanel onSubscribe={handleSubscribe} />
            )}
            
            {!creatorData.isCreator && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeedbackLoop
                  feedbackMessages={feedbackMessages}
                  isCreator={false}
                />
                
                <CreatorDNA
                  creatorName={creatorData.name}
                  creatorSkills={creatorDNA.skills}
                  creatorStyle={creatorDNA.style}
                  creatorAchievements={creatorDNA.achievements}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
