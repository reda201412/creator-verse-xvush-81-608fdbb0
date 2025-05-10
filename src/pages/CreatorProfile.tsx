import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreatorHeader from '@/components/CreatorHeader';
import ContentGrid from '@/components/ContentGrid';
import TabNav from '@/components/TabNav';
import SubscriptionPanel from '@/components/SubscriptionPanel';
import ProfileNav from '@/components/ProfileNav';
import CreatorDNA from '@/components/creator/CreatorDNA';
import CreatorJourney from '@/components/creator/CreatorJourney';
import FeedbackLoop from '@/components/creator/FeedbackLoop';
import ValueVault from '@/components/creator/ValueVault';
import MonetizedContentSection from '@/components/creator/MonetizedContentSection';
import { ContentType, RestrictedContentType, ContentItem, FeedbackType, FeedbackMessage } from '@/types/content';
import { useAuth } from '@/contexts/AuthContext';
import { getCreatorById, getCreatorVideos } from '@/services/creatorService';

const CreatorProfile: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [creatorData, setCreatorData] = useState<any>(null);
  const [creatorContent, setCreatorContent] = useState<any[]>([]);
  const { user, profile, isCreator } = useAuth();

  // Fetch creator profile data
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!creatorId) {
        toast.error("ID du créateur manquant");
        navigate('/');
        return;
      }
      
      setIsLoading(true);
      
      try {
        const creator = await getCreatorById(creatorId);
        
        if (!creator) {
          toast.error("Créateur introuvable");
          navigate('/');
          return;
        }
        
        // Transform creator data to match the expected format
        setCreatorData({
          name: creator.display_name || creator.username,
          username: creator.username,
          avatar: creator.avatar_url || "https://avatars.githubusercontent.com/u/124599?v=4",
          bio: creator.bio || "Aucune biographie disponible",
          tier: "diamond" as const,
          metrics: {
            followers: creator.metrics?.followers || 0,
            following: creator.metrics?.following || 0,
            revenue: 0,
            growthRate: 0,
            nextTierProgress: 0,
            retentionRate: 0,
            superfans: 0,
            watchMinutes: 0,
          },
          isCreator: true,
          isOnline: Math.random() > 0.5 // For demonstration purposes
        });
        
        // Fetch creator videos
        const videos = await getCreatorVideos(creatorId);
        
        // Transform videos to match the expected content format
        const transformedVideos = videos.map(video => ({
          id: video.id.toString(),
          imageUrl: video.thumbnail_url || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
          title: video.title || "Sans titre",
          type: (video.type as any) || "standard",
          format: video.format === '9:16' ? "video" : "image",
          duration: Math.floor(Math.random() * 600) + 60, // Random duration for now
          metrics: {
            likes: Math.floor(Math.random() * 2000) + 100,
            comments: Math.floor(Math.random() * 200) + 10,
            views: Math.floor(Math.random() * 10000) + 500,
            revenue: video.is_premium ? Math.floor(Math.random() * 500) + 100 : undefined,
            growth: Math.floor(Math.random() * 20)
          },
          videoUrl: video.video_url
        }));
        
        setCreatorContent(transformedVideos);
        
      } catch (error) {
        console.error("Error fetching creator data:", error);
        toast.error("Erreur lors du chargement des données du créateur");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreatorData();
  }, [creatorId, navigate]);

  // Check if the current user is the owner of this profile
  const isProfileOwner = isCreator && creatorData && profile?.username === creatorData.username;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubscribe = (tier: string) => {
    // Fix: Using the correct toast format
    toast(`Abonnement ${tier} sélectionné`, {
      description: "Vous allez être redirigé vers la page de paiement"
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

  // Mock data for DNA, Journey, and Feedback
  const creatorDNA = {
    skills: ['Photographie', 'Narration visuelle', 'Editing photo', 'Direction artistique', 'Stylisme'],
    style: ['Minimaliste', 'Poétique', 'Lumineux', 'Architectural', 'Émotionnel'],
    achievements: ['100K abonnés en 2023', 'Collaboration Vogue', 'Exposition Paris Photo', 'Award Creator Impact']
  };

  const creatorJourney = [
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
      date: "Août 2022",
      title: "Première collaboration",
      description: "Première marque partenaire: shooting pour collection été",
      metricBefore: 3500,
      metricAfter: 7800,
      metricLabel: "Abonnés"
    },
    {
      id: "j3",
      date: "Décembre 2022",
      title: "Publication magazine",
      description: "Série photo publiée dans magazine Inspiration",
      metricBefore: 9200,
      metricAfter: 12500,
      metricLabel: "Abonnés"
    },
    {
      id: "j4",
      date: "Mars 2023",
      title: "Lancement cours en ligne",
      description: "Premier cours de photographie lifestyle disponible",
      metricBefore: 14700,
      metricAfter: 18300,
      metricLabel: "Abonnés"
    },
    {
      id: "j5",
      date: "Septembre 2023",
      title: "Exposition à Paris",
      description: "Première exposition dans galerie parisienne",
      metricBefore: 19800,
      metricAfter: 21500,
      metricLabel: "Abonnés"
    }
  ];

  const feedbackMessages: FeedbackMessage[] = [
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
    },
    {
      id: "f3",
      username: "julie_creative",
      avatar: "https://i.pravatar.cc/150?img=3",
      message: "Ta dernière série m'a tellement inspirée !",
      timestamp: "Il y a 1 jour",
      type: "appreciation" as FeedbackType
    },
    {
      id: "f4",
      username: "maxime22",
      avatar: "https://i.pravatar.cc/150?img=4",
      message: "Quel appareil photo utilises-tu pour les vidéos ?",
      timestamp: "Il y a 2 jours",
      type: "comment" as FeedbackType
    },
    {
      id: "f5",
      username: "sophie.b",
      avatar: "https://i.pravatar.cc/150?img=5",
      message: "Pourrais-tu faire un jour dans ma vie en hiver ?",
      timestamp: "Il y a 3 jours",
      type: "request" as FeedbackType
    }
  ];

  const premiumContent: ContentItem[] = [
    {
      id: "p1",
      title: "Portrait Photography Masterclass",
      type: "premium" as RestrictedContentType,
      category: "cours",
      views: 2800,
      thumbnail: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&auto=format&fit=crop"
    },
    {
      id: "p2",
      title: "Lightroom Presets Collection",
      type: "premium" as RestrictedContentType,
      category: "ressources",
      views: 4100,
      thumbnail: "https://images.unsplash.com/photo-1542395765-761f1b5f9a55?w=800&auto=format&fit=crop"
    },
    {
      id: "p3",
      title: "Behind the Scenes: Magazine Shoot",
      type: "vip" as RestrictedContentType,
      category: "backstage",
      views: 1850,
      thumbnail: "https://images.unsplash.com/photo-1554668048-a2c814e56977?w=800&auto=format&fit=crop"
    },
    {
      id: "p4",
      title: "City Photography Guide: Paris",
      type: "premium" as RestrictedContentType,
      category: "guides",
      views: 3200,
      thumbnail: "https://images.unsplash.com/photo-1568684333877-4d89c7aedf0a?w=800&auto=format&fit=crop"
    },
    {
      id: "p5",
      title: "1:1 Portfolio Review Session",
      type: "vip" as RestrictedContentType,
      category: "coaching",
      views: 980,
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop"
    },
    {
      id: "p6",
      title: "Color Theory for Visual Artists",
      type: "premium" as RestrictedContentType,
      category: "cours",
      views: 2450,
      thumbnail: "https://images.unsplash.com/photo-1655635949211-ff246747a421?w=800&auto=format&fit=crop"
    }
  ];

  if (isLoading || !creatorData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
            tier={creatorData.tier as any}
            metrics={creatorData.metrics}
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
                milestones={creatorJourney}
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
