
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileNav from '@/components/ProfileNav';
import CreatorHeader from '@/components/CreatorHeader';
import TabNav from '@/components/TabNav';
import ContentGrid from '@/components/ContentGrid';
import SubscriptionPanel from '@/components/SubscriptionPanel';
import ProfileSettingsModal from '@/components/modals/ProfileSettingsModal';
import EngagementDashboard from '@/components/dashboards/EngagementDashboard';
import { Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Contenus améliorés avec formats et collections
const mockContents = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    title: 'Sunset Dance',
    type: 'premium' as const,
    format: 'video' as const,
    duration: 1044, // 17:24 min
    collection: 'Danses sensuelles',
    metrics: {
      views: 12000,
      likes: 3200,
      comments: 215,
      revenue: 342,
      growth: 18,
    },
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
    title: 'Ocean Breeze',
    type: 'standard' as const,
    format: 'image' as const,
    collection: 'Moments intimes',
    metrics: {
      views: 8500,
      likes: 2100,
      comments: 142,
      growth: 5,
    },
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151',
    title: 'Desert Dreams',
    type: 'standard' as const,
    format: 'image' as const,
    collection: 'Moments intimes',
    metrics: {
      views: 7200,
      likes: 1800,
      comments: 95,
      growth: 3,
    },
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    title: 'Night Sky',
    type: 'vip' as const,
    format: 'video' as const,
    duration: 1560, // 26:00 min
    collection: 'Archives VIP',
    metrics: {
      views: 15000,
      likes: 4300,
      comments: 320,
      revenue: 580,
      growth: 22,
    },
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    title: 'Mountain Mist',
    type: 'premium' as const,
    format: 'video' as const,
    duration: 480, // 8:00 min
    collection: 'Danses sensuelles',
    metrics: {
      views: 9700,
      likes: 2800,
      comments: 185,
      revenue: 210,
      growth: 8,
    },
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    title: 'Forest Whispers',
    type: 'standard' as const,
    format: 'image' as const,
    collection: 'Behind the scenes',
    metrics: {
      views: 6800,
      likes: 1500,
      comments: 88,
      growth: 2,
    },
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    title: 'Dawn Light',
    type: 'premium' as const,
    format: 'video' as const,
    duration: 720, // 12:00 min
    collection: 'Danses sensuelles',
    metrics: {
      views: 11200,
      likes: 3500,
      comments: 230,
      revenue: 290,
      growth: 14,
    },
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    title: 'Digital Dreams',
    type: 'vip' as const,
    format: 'video' as const,
    duration: 900, // 15:00 min
    collection: 'Archives VIP',
    metrics: {
      views: 18500,
      likes: 5200,
      comments: 410,
      revenue: 640,
      growth: 25,
    },
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    title: 'Urban Sunset',
    type: 'standard' as const,
    format: 'image' as const,
    collection: 'Behind the scenes',
    metrics: {
      views: 7900,
      likes: 1850,
      comments: 112,
      growth: 4,
    },
  },
];

// Collections pré-définies
const mockCollections = [
  {
    name: 'Danses sensuelles',
    contents: mockContents.filter(content => content.collection === 'Danses sensuelles')
  },
  {
    name: 'Moments intimes',
    contents: mockContents.filter(content => content.collection === 'Moments intimes')
  },
  {
    name: 'Behind the scenes',
    contents: mockContents.filter(content => content.collection === 'Behind the scenes')
  },
  {
    name: 'Archives VIP',
    contents: mockContents.filter(content => content.collection === 'Archives VIP')
  }
];

const CreatorProfile = () => {
  const [activeTab, setActiveTab] = useState('grid');
  const [activeLayout, setActiveLayout] = useState('featured');
  const [filteredContents, setFilteredContents] = useState(mockContents);
  const [isCreatorView, setIsCreatorView] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: "Julie Sky",
    username: "juliesky",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200",
    bio: "Passionnée et créative, Julie aime partager des moments intimes et authentiques. Elle se spécialise dans les vidéos solo et les danses sensuelles.",
    tier: "gold" as const,
  });

  // Filter content based on active tab and set appropriate layout
  useEffect(() => {
    if (activeTab === 'grid') {
      setFilteredContents(mockContents);
      setActiveLayout('featured'); // Utilisons le layout featured par défaut pour l'onglet grid
    } else if (activeTab === 'videos') {
      setFilteredContents(mockContents.filter(content => 
        content.format === 'video'
      ));
      setActiveLayout('vertical'); // Flux vertical pour les vidéos
    } else if (activeTab === 'premium') {
      setFilteredContents(mockContents.filter(content => 
        content.type === 'premium'
      ));
      setActiveLayout('grid'); // Grid standard pour premium
    } else if (activeTab === 'vip') {
      setFilteredContents(mockContents.filter(content => 
        content.type === 'vip'
      ));
      setActiveLayout('grid'); // Grid standard pour VIP
    } else if (activeTab === 'collections') {
      setFilteredContents(mockContents);
      setActiveLayout('collections'); // Layout collections
    }
    // L'onglet 'stats' n'affiche pas de contenu, mais le tableau de bord
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

  const handleProfileUpdate = (updatedData: any) => {
    setProfileData(prev => ({
      ...prev,
      ...updatedData
    }));
    
    toast({
      title: "Profil mis à jour",
      description: "Les modifications de votre profil ont été enregistrées.",
      duration: 3000,
    });
  };

  // Mise à jour de TabNav pour inclure l'onglet collections
  const tabs = [
    { value: 'grid', label: 'Tous', icon: 'layout-grid' },
    { value: 'videos', label: 'Vidéos', icon: 'film' },
    { value: 'premium', label: 'Premium', icon: 'crown' },
    { value: 'vip', label: 'VIP', icon: 'star' },
    { value: 'collections', label: 'Collections', icon: 'folder' },
  ];
  
  if (isCreatorView) {
    tabs.push({ value: 'stats', label: 'Statistiques', icon: 'bar-chart-3' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <ProfileNav username={profileData.username} onBack={() => console.log('Back clicked')} />
      
      <div className="max-w-5xl mx-auto px-4 pb-20 space-y-6">
        <CreatorHeader 
          name={profileData.name}
          username={profileData.username}
          avatar={profileData.avatar}
          bio={profileData.bio}
          tier={profileData.tier}
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
        
        <div className="flex justify-between">
          <button 
            onClick={toggleCreatorView}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {isCreatorView ? "Voir comme visiteur" : "Voir comme créateur"}
          </button>
          
          {isCreatorView && (
            <div className="flex gap-2">
              <Link to="/subscribers">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex gap-1 items-center"
                >
                  <Users size={16} />
                  Gérer les abonnés
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="flex gap-1 items-center"
              >
                <Settings size={16} />
                Paramètres du profil
              </Button>
            </div>
          )}
        </div>
        
        <TabNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isCreator={isCreatorView}
          tabs={tabs}
        />
        
        {/* Contenu du tableau de bord d'engagement */}
        {activeTab === 'stats' && isCreatorView && (
          <EngagementDashboard />
        )}
        
        {/* Contenu filtré selon le layout approprié */}
        {activeTab !== 'stats' && (
          <ContentGrid 
            contents={filteredContents}
            layout={activeLayout as 'grid' | 'masonry' | 'featured' | 'vertical' | 'collections'}
            isCreator={isCreatorView}
            collections={activeTab === 'collections' ? mockCollections : []}
          />
        )}
        
        {activeTab === 'grid' && !isCreatorView && (
          <SubscriptionPanel onSubscribe={handleSubscribe} />
        )}
      </div>
      
      <ProfileSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        initialData={profileData}
        onSave={handleProfileUpdate}
      />
    </div>
  );
};

export default CreatorProfile;
