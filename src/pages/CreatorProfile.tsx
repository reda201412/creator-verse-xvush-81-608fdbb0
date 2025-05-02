import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileNav from '@/components/ProfileNav';
import CreatorHeader from '@/components/CreatorHeader';
import TabNav from '@/components/TabNav';
import ContentGrid from '@/components/ContentGrid';
import SubscriptionPanel from '@/components/SubscriptionPanel';
import ProfileSettingsModal from '@/components/modals/ProfileSettingsModal';
import EngagementDashboard from '@/components/dashboards/EngagementDashboard';
import RadialMenu from '@/components/navigation/RadialMenu';
import ContentFilters from '@/components/navigation/ContentFilters';
import ZoomControls from '@/components/navigation/ZoomControls';
import ImmersiveView from '@/components/navigation/ImmersiveView';
import GestureHandler from '@/components/navigation/GestureHandler';
import NavigationOverlay from '@/components/navigation/NavigationOverlay';
import CreatorDNA from '@/components/creator/CreatorDNA';
import ValueVault from '@/components/creator/ValueVault';
import CreatorJourney from '@/components/creator/CreatorJourney';
import FeedbackLoop from '@/components/creator/FeedbackLoop';
import MessageCenter from '@/components/messaging/MessageCenter';
import { Settings, Users, MessageSquare, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import Header from "@/components/navigation/Header";

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
  const isMobile = useIsMobile();
  
  const [activeTab, setActiveTab] = useState('grid');
  const [activeLayout, setActiveLayout] = useState('featured');
  const [filteredContents, setFilteredContents] = useState(mockContents);
  const [isCreatorView, setIsCreatorView] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false);
  const [radialMenuPosition, setRadialMenuPosition] = useState({ x: 0, y: 0 });
  const [intelligentFilter, setIntelligentFilter] = useState('trending');
  const [zoomLevel, setZoomLevel] = useState(50); // 0-100
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [immersiveContentIndex, setImmersiveContentIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const { toast } = useToast();
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: "Julie Sky",
    username: "juliesky",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200",
    coverImage: "/lovable-uploads/0038954d-233c-440e-91b6-639b6b22bd82.png", // Added cover image
    bio: "Passionnée et créative, Julie aime partager des moments intimes et authentiques. Elle se spécialise dans les vidéos solo et les danses sensuelles.",
    tier: "gold" as const,
  });

  // Nouvelles données pour les fonctionnalités exclusives
  const creatorSkills = ["Danse", "Photographie", "Mise en scène", "Écriture", "Maquillage"];
  const creatorStyle = ["Sensuel", "Authentique", "Créatif", "Élégant", "Personnel"];
  const creatorAchievements = ["Top 1% Créateurs", "Prix d'Excellence 2023", "10K Abonnés", "100 Vidéos"];
  
  const premiumContent = mockContents
    .filter(content => content.type === 'premium' || content.type === 'vip')
    .map(content => ({
      id: content.id,
      title: content.title,
      type: content.type,
      category: content.collection || 'Non classé',
      views: content.metrics?.views || 0,
      thumbnail: content.imageUrl
    }));
  
  const journeyMilestones = [
    {
      id: '1',
      date: 'Jan 2023',
      title: 'Début sur la plateforme',
      description: 'Premier post et création du profil',
      metricBefore: 0,
      metricAfter: 100,
      metricLabel: 'Abonnés'
    },
    {
      id: '2',
      date: 'Mars 2023',
      title: 'Premier contenu Premium',
      description: 'Lancement de la série "Danses sensuelles"',
      metricBefore: 350,
      metricAfter: 1200,
      metricLabel: 'Abonnés'
    },
    {
      id: '3',
      date: 'Juin 2023',
      title: 'Collaboration exclusive',
      description: 'Partenariat avec Danse Magazine',
      metricBefore: 2500,
      metricAfter: 5000,
      metricLabel: 'Abonnés'
    },
    {
      id: '4',
      date: 'Oct 2023',
      title: 'Lancement Collection VIP',
      description: 'Accès exclusif aux archives privées',
      metricBefore: 8000,
      metricAfter: 15000,
      metricLabel: 'Abonnés'
    },
    {
      id: '5',
      date: 'Jan 2024',
      title: 'Award Top Créateur',
      description: 'Reconnaissance pour qualité de contenu',
      metricBefore: 20000,
      metricAfter: 35000,
      metricLabel: 'Abonnés'
    },
    {
      id: '6',
      date: 'Mars 2024',
      title: 'Nouveau format interactif',
      description: 'Lancement des sessions live exclusives',
      metricBefore: 40000,
      metricAfter: 64400,
      metricLabel: 'Abonnés'
    }
  ];
  
  const feedbackMessages = [
    {
      id: '1',
      username: 'michel45',
      message: 'Superbe vidéo de danse ! J\'adore l\'éclairage.',
      timestamp: 'Il y a 2h',
      type: 'comment' as const
    },
    {
      id: '2',
      username: 'sophie22',
      message: 'Est-ce que tu pourrais faire une vidéo sur ta routine d\'échauffement ?',
      timestamp: 'Il y a 1j',
      type: 'request' as const
    },
    {
      id: '3',
      username: 'thomas78',
      message: 'Tu es incroyablement talentueuse !',
      timestamp: 'Il y a 3j',
      type: 'appreciation' as const
    },
    {
      id: '4',
      username: 'laura_dance',
      message: 'La dernière collection est magnifique, j\'ai tout regardé en une soirée !',
      timestamp: 'Il y a 5j',
      type: 'appreciation' as const
    },
    {
      id: '5',
      username: 'robert01',
      message: 'Peux-tu faire une session spéciale sur la musique classique ?',
      timestamp: 'Il y a 1sem',
      type: 'request' as const
    }
  ];
  
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

  // Apply intelligent filter to content
  useEffect(() => {
    let newFilteredContents = [...filteredContents];
    
    // Apply intelligent filtering based on the selected filter
    switch (intelligentFilter) {
      case 'trending':
        // Sort by growth rate descending
        newFilteredContents.sort((a, b) => 
          (b.metrics?.growth || 0) - (a.metrics?.growth || 0)
        );
        break;
      case 'recent':
        // In a real app, you would sort by date
        // Here we're just shuffling for demo purposes
        newFilteredContents = newFilteredContents
          .sort(() => Math.random() - 0.5);
        break;
      case 'popular':
        // Sort by likes descending
        newFilteredContents.sort((a, b) => 
          (b.metrics?.likes || 0) - (a.metrics?.likes || 0)
        );
        break;
      case 'mostWatched':
        // Sort by views descending
        newFilteredContents.sort((a, b) => 
          (b.metrics?.views || 0) - (a.metrics?.views || 0)
        );
        break;
      case 'mostCommented':
        // Sort by comments descending
        newFilteredContents.sort((a, b) => 
          (b.metrics?.comments || 0) - (a.metrics?.comments || 0)
        );
        break;
      case 'highestRated':
        // In a real app, you would sort by rating
        // Here we're using likes as a proxy
        newFilteredContents.sort((a, b) => {
          const aRatio = a.metrics ? (a.metrics.likes || 0) / (a.metrics.views || 1) : 0;
          const bRatio = b.metrics ? (b.metrics.likes || 0) / (b.metrics.views || 1) : 0;
          return bRatio - aRatio;
        });
        break;
      case 'fastestGrowing':
        // Sort by growth rate descending
        newFilteredContents.sort((a, b) => 
          (b.metrics?.growth || 0) - (a.metrics?.growth || 0)
        );
        break;
      case 'forYou':
        // In a real app, you would use an algorithm to recommend content
        // Here we're just shuffling for demo purposes
        newFilteredContents = newFilteredContents
          .sort(() => Math.random() - 0.5);
        break;
      default:
        // No additional filtering
        break;
    }
    
    setFilteredContents(newFilteredContents);
  }, [intelligentFilter, activeTab]);

  // Apply zoom level to content with more subtle transformation
  useEffect(() => {
    if (contentRef.current) {
      // Calculate scale factor from 0.9 to 1.1 based on zoom level 25-75
      const scaleFactor = 0.9 + (zoomLevel - 25) / 50 * 0.2;
      
      // Apply to the content element with smoother transformation
      contentRef.current.style.transform = `scale(${scaleFactor})`;
      contentRef.current.style.transformOrigin = 'center top';
      contentRef.current.style.transition = 'transform 0.3s ease-out';
      
      // Use fixed spacing regardless of zoom level to maintain layout stability
      contentRef.current.style.gap = '0.75rem';
    }
  }, [zoomLevel]);

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

  // Gestionnaires de gestes manquants
  const handleLongPress = (position: { x: number; y: number }) => {
    setRadialMenuPosition(position);
    setIsRadialMenuOpen(true);
    
    toast({
      title: "Menu contextuel ouvert",
      description: "Sélectionnez une option dans le menu radial",
      duration: 2000,
    });
  };
  
  const handleDoubleTap = (position: { x: number; y: number }) => {
    // Bascule entre le mode immersif et normal
    if (!isImmersiveMode) {
      // Trouver l'élément de contenu le plus proche du tap
      const index = Math.floor(Math.random() * filteredContents.length);
      setImmersiveContentIndex(index);
      setIsImmersiveMode(true);
    } else {
      setIsImmersiveMode(false);
    }
  };
  
  const handleSwipeUp = () => {
    // Gentler zoom increase
    const newZoom = Math.min(75, zoomLevel + 5);
    setZoomLevel(newZoom);
  };
  
  const handleSwipeDown = () => {
    // Gentler zoom decrease
    const newZoom = Math.max(25, zoomLevel - 5);
    setZoomLevel(newZoom);
  };
  
  const handlePinch = (scale: number) => {
    // More subtle zoom adjustment with pinch
    const zoomChange = (scale - 1) * 15; // Reduced amplification factor
    const newZoom = Math.max(25, Math.min(75, zoomLevel + zoomChange));
    setZoomLevel(newZoom);
  };

  const toggleMessaging = () => {
    setShowMessaging(!showMessaging);
    
    if (!showMessaging) {
      toast({
        title: "Messagerie activée",
        description: "Communiquez directement avec le créateur pour du contenu exclusif.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Cover Image */}
      <div className="relative h-40 md:h-64 w-full overflow-hidden">
        {profileData.coverImage ? (
          <img 
            src={profileData.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/30 to-secondary/30 flex items-center justify-center">
            {isCreatorView && (
              <Button variant="secondary" className="bg-background/80 backdrop-blur-sm">
                Ajouter une photo de couverture
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="max-w-5xl mx-auto px-4 pb-20 space-y-6 relative">
        {/* Profile Information */}
        <div className="flex flex-col items-center -mt-20">
          <div className="story-ring">
            <img 
              src={profileData.avatar || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200"}
              alt={profileData.name || "Creator"}
              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-900"
            />
          </div>
          
          <div className="flex items-center mt-2">
            {/* Online status */}
            <div className="flex items-center text-sm text-green-500 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span>En ligne</span>
              <span className="ml-1 text-md">○</span>
            </div>
          </div>
          
          {/* Message button */}
          <button 
            onClick={toggleMessaging}
            className="mt-4 flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full text-gray-800 font-medium hover:bg-gray-50 transition-colors"
          >
            <MessageSquare size={18} />
            Message
          </button>
          
          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold">
              {profileData.name} 
              <span className="ml-2 text-sm bg-yellow-400 text-black px-2 py-0.5 rounded-md">Gold</span>
            </h1>
            <h2 className="text-gray-500 mt-1">@{profileData.username}</h2>
          </div>
          
          <p className="mt-3 text-center max-w-lg">
            {profileData.bio}
          </p>
          
          {/* Additional actions */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="rounded-full gap-2">
              <MessageSquare size={16} />
              Message
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Bell size={16} />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              ...
            </Button>
          </div>
        </div>
        
        {/* Message Button and Actions */}
        <div className="flex flex-wrap justify-between gap-3 mb-6">
          <button 
            onClick={toggleCreatorView}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {isCreatorView ? "Voir comme visiteur" : "Voir comme créateur"}
          </button>
          
          {isCreatorView && (
            <div className="flex gap-2 flex-wrap">
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
              
              <Link to="/messages">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex gap-1 items-center"
                >
                  <MessageSquare size={16} />
                  Messagerie
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
          
          {!isCreatorView && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMessaging}
                className="flex gap-1 items-center"
              >
                <MessageSquare size={16} />
                Message
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex gap-1 items-center"
              >
                <Bell size={16} />
                Suivre
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex gap-1 items-center"
                onClick={() => {
                  toast({
                    title: "Options",
                    description: "Fonctionnalité à venir",
                  });
                }}
              >
                <span>...</span>
              </Button>
            </div>
          )}
        </div>
        
        {/* Messaging overlay for fans */}
        {showMessaging && !isCreatorView && (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80"
                onClick={() => setShowMessaging(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <MessageCenter 
              userId="user_visitor"
              userName="Visiteur"
              userAvatar="https://i.pravatar.cc/300?img=50"
              className="w-full"
            />
          </div>
        )}
        
        {/* Content Tab Navigation */}
        {!showMessaging && (
          <>
            <TabNav 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              isCreator={isCreatorView}
              tabs={tabs}
            />
            
            {/* Navigation overlay */}
            <NavigationOverlay
              isRadialMenuOpen={isRadialMenuOpen}
              onRadialMenuClose={() => setIsRadialMenuOpen(false)}
              radialMenuPosition={radialMenuPosition}
              activeFilter={intelligentFilter}
              onFilterChange={setIntelligentFilter}
              zoomLevel={zoomLevel}
              onZoomChange={setZoomLevel}
              onEnterImmersiveMode={() => setIsImmersiveMode(true)}
            />
            
            {/* Featured Content */}
            {activeTab !== 'stats' && (
              <GestureHandler
                onLongPress={handleLongPress}
                onDoubleTap={handleDoubleTap}
                onSwipeUp={handleSwipeUp}
                onSwipeDown={handleSwipeDown}
                onPinch={handlePinch}
              >
                <motion.div 
                  ref={contentRef}
                  className="transition-all duration-300"
                >
                  <ContentGrid 
                    contents={filteredContents}
                    layout={activeLayout as 'grid' | 'masonry' | 'featured' | 'vertical' | 'collections'}
                    isCreator={isCreatorView}
                    collections={activeTab === 'collections' ? mockCollections : []}
                  />
                </motion.div>
              </GestureHandler>
            )}
            
            {/* Engagement Dashboard (only for creator view and stats tab) */}
            {activeTab === 'stats' && isCreatorView && (
              <EngagementDashboard />
            )}
            
            {/* Value Vault and Feedback Loop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <ValueVault 
                premiumContent={premiumContent}
              />
              
              <FeedbackLoop 
                feedbackMessages={feedbackMessages}
                isCreator={isCreatorView}
              />
            </div>

            {/* Creator DNA and Creator Journey */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <CreatorDNA 
                creatorName={profileData.name}
                creatorSkills={creatorSkills}
                creatorStyle={creatorStyle}
                creatorAchievements={creatorAchievements}
              />
              
              <CreatorJourney 
                milestones={journeyMilestones}
              />
            </div>

            {/* Subscription Panel */}
            {activeTab === 'grid' && !isCreatorView && (
              <div className="glass-card rounded-2xl p-6 mt-8">
                <h2 className="text-2xl font-bold mb-4">Rejoignez l'univers exclusif de {profileData.name}</h2>
                <SubscriptionPanel onSubscribe={handleSubscribe} />
              </div>
            )}
          </>
        )}
      </div>
      
      <ProfileSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        initialData={profileData}
        onSave={handleProfileUpdate}
      />
      
      {/* Mode immersif */}
      <ImmersiveView 
        isOpen={isImmersiveMode}
        onClose={() => setIsImmersiveMode(false)}
        content={filteredContents}
        initialIndex={immersiveContentIndex}
      />
      
      {/* Fixed messaging button for mobile */}
      {isMobile && !showMessaging && !isCreatorView && (
        <Button 
          className="fixed bottom-4 right-4 z-10 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground"
          aria-label="Messages"
          onClick={toggleMessaging}
        >
          <MessageSquare size={24} />
        </Button>
      )}
    </div>
  );
};

export default CreatorProfile;
