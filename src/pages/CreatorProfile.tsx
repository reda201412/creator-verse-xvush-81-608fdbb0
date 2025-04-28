
import React, { useState, useEffect } from 'react';
import ProfileNav from '@/components/ProfileNav';
import CreatorHeader from '@/components/CreatorHeader';
import TabNav from '@/components/TabNav';
import ContentGrid from '@/components/ContentGrid';
import SubscriptionPanel from '@/components/SubscriptionPanel';
import { useToast } from '@/components/ui/use-toast';

// Mock content for our demo - Ensuring type is strictly "premium", "vip", or "standard"
const mockContents = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    title: 'Sunset Dance',
    type: 'premium' as const,
    metrics: {
      views: 12000,
      likes: 3200,
      comments: 215,
      revenue: 342,
    },
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
    title: 'Ocean Breeze',
    type: 'standard' as const,
    metrics: {
      views: 8500,
      likes: 2100,
      comments: 142,
    },
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151',
    title: 'Desert Dreams',
    type: 'standard' as const,
    metrics: {
      views: 7200,
      likes: 1800,
      comments: 95,
    },
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    title: 'Night Sky',
    type: 'vip' as const,
    metrics: {
      views: 15000,
      likes: 4300,
      comments: 320,
      revenue: 580,
    },
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    title: 'Mountain Mist',
    type: 'premium' as const,
    metrics: {
      views: 9700,
      likes: 2800,
      comments: 185,
      revenue: 210,
    },
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    title: 'Forest Whispers',
    type: 'standard' as const,
    metrics: {
      views: 6800,
      likes: 1500,
      comments: 88,
    },
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    title: 'Dawn Light',
    type: 'premium' as const,
    metrics: {
      views: 11200,
      likes: 3500,
      comments: 230,
      revenue: 290,
    },
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    title: 'Digital Dreams',
    type: 'vip' as const,
    metrics: {
      views: 18500,
      likes: 5200,
      comments: 410,
      revenue: 640,
    },
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    title: 'Urban Sunset',
    type: 'standard' as const,
    metrics: {
      views: 7900,
      likes: 1850,
      comments: 112,
    },
  },
];

const CreatorProfile = () => {
  const [activeTab, setActiveTab] = useState('grid');
  const [filteredContents, setFilteredContents] = useState(mockContents);
  const [isCreatorView, setIsCreatorView] = useState(false);
  const { toast } = useToast();

  // Filter content based on active tab
  useEffect(() => {
    if (activeTab === 'grid') {
      setFilteredContents(mockContents);
    } else if (activeTab === 'videos') {
      setFilteredContents(mockContents.filter(content => 
        content.type === 'standard'
      ));
    } else if (activeTab === 'premium') {
      setFilteredContents(mockContents.filter(content => 
        content.type === 'premium'
      ));
    } else if (activeTab === 'vip') {
      setFilteredContents(mockContents.filter(content => 
        content.type === 'vip'
      ));
    }
  }, [activeTab]);

  const handleSubscribe = (tier: string) => {
    toast({
      title: "Félicitations !",
      description: `Vous êtes maintenant abonné(e) au niveau ${tier}. Profitez du contenu exclusif !`,
      duration: 5000,
    });
  };

  const toggleCreatorView = () => {
    setIsCreatorView(!isCreatorView);
    toast({
      title: isCreatorView ? "Mode visiteur activé" : "Mode créateur activé",
      description: isCreatorView ? "Vous voyez maintenant votre profil comme les visiteurs." : "Vous pouvez maintenant voir les revenus et statistiques.",
      duration: 3000,
    });
  };

  const handleEventReminder = () => {
    toast({
      title: "Rappel programmé",
      description: "Vous recevrez une notification avant le début de l'événement.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ProfileNav username="juliesky" onBack={() => console.log('Back clicked')} />
      
      <div className="max-w-5xl mx-auto px-4 pb-20 space-y-6">
        <CreatorHeader 
          name="Julie Sky"
          username="juliesky"
          avatar="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200"
          bio="Passionnée et créative, Julie aime partager des moments intimes et authentiques. Elle se spécialise dans les vidéos solo et les danses sensuelles."
          tier="gold"
          metrics={{
            followers: 64400,
            following: 68,
            revenue: isCreatorView ? 4752 : undefined,
            growthRate: isCreatorView ? 12 : undefined,
            nextTierProgress: 73,
            retentionRate: 87,
            superfans: 3200,
            watchMinutes: 237000,
          }}
          isCreator={isCreatorView}
          isOnline={true}
        />
        
        <div className="flex justify-end">
          <button 
            onClick={toggleCreatorView}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {isCreatorView ? "Voir comme visiteur" : "Voir comme créateur"}
          </button>
        </div>
        
        <TabNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isCreator={isCreatorView}
        />
        
        {activeTab === 'grid' && (
          <ContentGrid 
            contents={filteredContents} 
            layout="masonry" 
            isCreator={isCreatorView}
          />
        )}
        
        {(activeTab === 'videos' || activeTab === 'premium' || activeTab === 'vip') && (
          <ContentGrid 
            contents={filteredContents} 
            layout="grid"
            isCreator={isCreatorView} 
          />
        )}
        
        {activeTab === 'grid' && !isCreatorView && (
          <SubscriptionPanel onSubscribe={handleSubscribe} />
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
