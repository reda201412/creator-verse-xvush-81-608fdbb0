import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import { ContentType, ContentItem, FeedbackType, FeedbackMessage } from '@/types/content';

// Mock data
const creatorData = {
  name: "Sarah K.",
  username: "sarahk.creative",
  avatar: "https://avatars.githubusercontent.com/u/124599?v=4",
  bio: "Photographe et créatrice de contenu lifestyle. Je partage ma vision artistique du quotidien avec une touche de poésie visuelle. Basée à Paris.",
  tier: "diamond" as const,
  metrics: {
    followers: 21500,
    following: 342,
    revenue: 3750,
    growthRate: 12,
    nextTierProgress: 92,
    retentionRate: 87,
    superfans: 420,
    watchMinutes: 85000,
  },
  isCreator: true,
  isOnline: true
};

// Mock creator content
const creatorContent = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    title: "Morning Coffee Routine",
    type: "premium" as const,
    format: "image" as const,
    metrics: {
      likes: 1200,
      comments: 89,
      views: 5600,
      revenue: 320,
      growth: 18
    }
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    title: "Spring Fashion Look",
    type: "standard" as const,
    format: "image" as const,
    metrics: {
      likes: 950,
      comments: 63,
      views: 4100
    }
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
    title: "Sunset at the Mountain",
    type: "standard" as const,
    format: "video" as const,
    duration: 187,
    metrics: {
      likes: 2300,
      comments: 156,
      views: 12400,
      revenue: 540,
      growth: 23
    }
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=800&auto=format&fit=crop",
    title: "Boulangerie Tour Paris",
    type: "vip" as const,
    format: "video" as const,
    duration: 845,
    metrics: {
      likes: 3200,
      comments: 278,
      views: 15600,
      revenue: 890,
      growth: 15
    }
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop",
    title: "Morning Apartment Tour",
    type: "standard" as const,
    format: "image" as const,
    metrics: {
      likes: 1850,
      comments: 94,
      views: 9200
    }
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop",
    title: "My Workspace Setup 2023",
    type: "premium" as const,
    format: "video" as const,
    duration: 478,
    metrics: {
      likes: 2100,
      comments: 145,
      views: 11300,
      revenue: 450,
      growth: 8
    }
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1529651737248-dad5e287768e?w=800&auto=format&fit=crop",
    title: "Life in Paris",
    type: "standard" as const,
    format: "image" as const,
    metrics: {
      likes: 1560,
      comments: 72,
      views: 8400
    }
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&auto=format&fit=crop",
    title: "Sunrise Timelapse",
    type: "vip" as const,
    format: "video" as const,
    duration: 215,
    metrics: {
      likes: 2680,
      comments: 183,
      views: 14200,
      revenue: 780,
      growth: 19
    }
  }
];

// Mock creator DNA data
const creatorDNA = {
  skills: ['Photographie', 'Narration visuelle', 'Editing photo', 'Direction artistique', 'Stylisme'],
  style: ['Minimaliste', 'Poétique', 'Lumineux', 'Architectural', 'Émotionnel'],
  achievements: ['100K abonnés en 2023', 'Collaboration Vogue', 'Exposition Paris Photo', 'Award Creator Impact']
};

// Mock creator journey data
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

// Mock feedback messages
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

// Mock premium content data - this is where the type error occurs
const premiumContent: ContentItem[] = [
  {
    id: "p1",
    title: "Portrait Photography Masterclass",
    type: "premium" as ContentType, // Fix: Use correct casting
    category: "cours",
    views: 2800,
    thumbnail: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&auto=format&fit=crop"
  },
  {
    id: "p2",
    title: "Lightroom Presets Collection",
    type: "premium" as ContentType, // Fix: Use correct casting
    category: "ressources",
    views: 4100,
    thumbnail: "https://images.unsplash.com/photo-1542395765-761f1b5f9a55?w=800&auto=format&fit=crop"
  },
  {
    id: "p3",
    title: "Behind the Scenes: Magazine Shoot",
    type: "vip" as ContentType, // Fix: Use correct casting
    category: "backstage",
    views: 1850,
    thumbnail: "https://images.unsplash.com/photo-1554668048-a2c814e56977?w=800&auto=format&fit=crop"
  },
  {
    id: "p4",
    title: "City Photography Guide: Paris",
    type: "premium" as ContentType, // Fix: Use correct casting
    category: "guides",
    views: 3200,
    thumbnail: "https://images.unsplash.com/photo-1568684333877-4d89c7aedf0a?w=800&auto=format&fit=crop"
  },
  {
    id: "p5",
    title: "1:1 Portfolio Review Session",
    type: "vip" as ContentType, // Fix: Use correct casting
    category: "coaching",
    views: 980,
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop"
  },
  {
    id: "p6",
    title: "Color Theory for Visual Artists",
    type: "premium" as ContentType, // Fix: Use correct casting
    category: "cours",
    views: 2450,
    thumbnail: "https://images.unsplash.com/photo-1655635949211-ff246747a421?w=800&auto=format&fit=crop"
  }
];

const CreatorProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('grid');
  const { toast } = useToast();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubscribe = (tier: string) => {
    toast({
      title: `Abonnement ${tier} sélectionné`,
      description: "Vous allez être redirigé vers la page de paiement",
    });
    
    // Trigger a custom event for micro rewards
    const event = new Event('xvush:like');
    document.dispatchEvent(event);
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
    // Navigation logic here
    window.history.back();
  };

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
