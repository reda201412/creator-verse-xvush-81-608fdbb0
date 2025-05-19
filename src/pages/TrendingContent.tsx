
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ContentGrid from "@/components/ContentGrid";
import ContentCreatorCard from "@/components/ContentCreatorCard";
import { useNeuroAesthetic } from "@/hooks/use-neuro-aesthetic";
import { useUserBehavior } from "@/hooks/use-user-behavior";
import AdaptiveMoodLighting from "@/components/neuro-aesthetic/AdaptiveMoodLighting";
import GoldenRatioGrid from "@/components/neuro-aesthetic/GoldenRatioGrid";
import MicroRewardsEnhanced from "@/components/effects/MicroRewardsEnhanced";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Users, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import XteasePlayerModal from "@/components/video/XteasePlayerModal";
// import { fetchAvailableCreators } from "@/utils/create-conversation-utils"; // Supprimé (Supabase util)
// import { supabase } from '@/integrations/supabase/client'; // Supprimé
import { useToast } from '@/hooks/use-toast';
import { getAllCreators, CreatorProfileData, getCreatorVideos, VideoData } from "@/services/creatorService"; // Services Firebase

// Type pour le contenu tendance
interface TrendingContentItem extends VideoData {
  // Ajouter des champs spécifiques au trending si nécessaire, ex: score de tendance
  // Pour l'instant, on se base sur VideoData et on ajoute des données mockées pour l'UI
  metrics?: { // Métriques mockées pour l'UI
    likes?: number;
    comments?: number;
    views?: number;
  };
}

// Données statiques pour l'UI en attendant une logique de "tendance" plus avancée depuis Firestore
// Ces données pourraient être enrichies ou remplacées par des données de Firestore
const staticTrendingPlaceholders: TrendingContentItem[] = [
  {
    id: 1,
    userId: "mockUserId1",
    title: "Morning Coffee Routine (Placeholder)",
    description: null,
    assetId: null,
    uploadId: null,
    playbackId: "mockPlaybackId1",
    status: 'ready',
    duration: 120,
    aspectRatio: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-taking-cold-pictures-33355-large.mp4",
    isPublished: true,
    isPremium: true,
    price: 5.99,
    viewCount: 1200,
    likeCount: 89,
    commentCount: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: { likes: 1200, comments: 89, views: 5600 }
  },
  {
    id: 2,
    userId: "mockUserId2",
    title: "Spring Fashion Look (Placeholder)",
    description: null,
    assetId: null,
    uploadId: null,
    playbackId: "mockPlaybackId2",
    status: 'ready',
    duration: 180,
    aspectRatio: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-large.mp4",
    isPublished: true,
    isPremium: true,
    price: 7.99,
    viewCount: 950,
    likeCount: 63,
    commentCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: { likes: 950, comments: 63, views: 4100 }
  },
  // ... ajoutez plus de placeholders si nécessaire pour remplir l'UI initialement
];

const TrendingContent = () => {
  const [activeTab, setActiveTab] = useState<string>("all"); // Pour les types de contenu (standard, premium, vip)
  const [pageTab, setPageTab] = useState<string>("content"); // Pour basculer entre Contenu et Créateurs
  const { config } = useNeuroAesthetic();
  const { trackInteraction } = useUserBehavior();
  const { triggerMicroReward } = useNeuroAesthetic();
  const [selectedVideo, setSelectedVideo] = useState<TrendingContentItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  const [creators, setCreators] = useState<CreatorProfileData[]>([]);
  const [isLoadingCreators, setIsLoadingCreators] = useState(false);
  const [creatorsError, setCreatorsError] = useState<string | null>(null);

  const [trendingVideos, setTrendingVideos] = useState<TrendingContentItem[]>(staticTrendingPlaceholders);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [videosError, setVideosError] = useState<string | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Charger les créateurs
  const loadCreators = async () => {
    setIsLoadingCreators(true);
    setCreatorsError(null);
    try {
      // Pourrait être limité ou trié spécifiquement pour les créateurs "tendance"
      const fetchedCreators = await getAllCreators(); 
      // Simuler des métriques pour l'UI pour l'instant, car getAllCreators ne les charge pas en détail
      const creatorsWithMetrics = fetchedCreators.map(c => ({
        ...c,
        metrics: {
          followers: Math.floor(Math.random() * 10000),
          following: Math.floor(Math.random() * 500), // Ajout de la propriété following manquante
          videos: Math.floor(Math.random() * 100),    // Ajout de la propriété videos manquante
        },
        isPremium: Math.random() > 0.5 // Simulé
      }));
      setCreators(creatorsWithMetrics);
    } catch (error) {
      console.error("Erreur lors du chargement des créateurs:", error);
      setCreatorsError("Impossible de charger les créateurs.");
    } finally {
      setIsLoadingCreators(false);
    }
  };
  
  // Charger le contenu "tendance" depuis Firestore
  const loadTrendingVideos = async () => {
    setIsLoadingVideos(true);
    setVideosError(null);
    try {
      // TODO: Implémenter une vraie logique de "trending" dans Firestore.
      // Pour l'instant, chargeons quelques vidéos récentes de n'importe quel créateur à titre d'exemple.
      // Ou chargeons des vidéos d'un créateur spécifique si c'est plus pertinent.
      // Une vraie fonction getTrendingVideos pourrait sélectionner des vidéos basées sur des vues récentes, likes, etc.
      // et nécessiterait probablement une structure de données ou des fonctions backend dédiées.
      
      // Exemple simple: charger les vidéos d'un créateur spécifique (vous devrez choisir un ID)
      // const someCreatorId = "ID_DUN_CREATEUR_SPECIFIQUE"; 
      // const videosFromDb = await getCreatorVideos(someCreatorId); 
      
      // Autre exemple: pour simuler, on peut juste utiliser les placeholders pour l'instant
      // ou si vous avez une collection 'videos' avec un champ comme 'isTrending':
      // const q = query(collection(db, 'videos'), where('isTrending', '==', true), limit(10));
      // const snapshot = await getDocs(q);
      // const videosFromDb = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoFirestoreData));
      
      // Pour cet exemple, je vais laisser les placeholders car la logique de "tendance" est complexe.
      // Vous devrez remplacer ceci par votre propre logique de chargement.
      console.log("Logique de chargement des vidéos tendance à implémenter avec Firestore.");
      // setTrendingVideos(videosFromDb.map(v => ({...v, metrics: {views: Math.floor(Math.random()*1000)}}))); // Adaptez si vous chargez de vraies données
      setTrendingVideos(staticTrendingPlaceholders); // Garder les placeholders pour l'instant

    } catch (error) {
      console.error("Erreur lors du chargement des vidéos tendance:", error);
      setVideosError("Impossible de charger les vidéos tendance.");
    } finally {
      setIsLoadingVideos(false);
    }
  };

  useEffect(() => {
    trackInteraction("view", { page: "trending" });
    loadCreators();
    loadTrendingVideos(); // Charger les vidéos tendance
  }, [trackInteraction]); // Dépendance trackInteraction correcte ? Ou vide [] si chargement unique.

  // Gère le clic sur un créateur pour naviguer vers son profil ou envoyer un message
  const handleCreatorClick = (creator: CreatorProfileData, event?: React.MouseEvent) => {
    if (!creator?.id) {
      console.error("Impossible de naviguer: ID du créateur manquant");
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au profil du créateur.",
        variant: "destructive",
      });
      return;
    }
    
    // Enregistre l'interaction
    triggerMicroReward('click');
    
    // Si l'utilisateur maintient la touche Ctrl ou Cmd (ou clic molette), ouvre dans un nouvel onglet
    const isNewTab = event ? (event.ctrlKey || event.metaKey || event.button === 1) : false;
    
    if (isNewTab) {
      // Ouvre dans un nouvel onglet
      window.open(`/creator/${creator.id}`, '_blank');
    } else if (event?.shiftKey) {
      // Si Shift est maintenu, ouvre la messagerie
      trackInteraction('click', { target: 'creator_message', creatorId: creator.id });
      navigate('/secure-messaging', { state: { creatorId: creator.id } });
    } else {
      // Comportement par défaut : ouvre le profil
      trackInteraction('click', { 
        target: 'creator_profile',
        creatorId: creator.id 
      });
      navigate(`/creator/${creator.id}`);
    }
  };

  const handleContentClick = (content: TrendingContentItem) => {
    triggerMicroReward('click');
    trackInteraction('click', { contentId: content.id });
    
    if (content.videoUrl) { // Assurez-vous que videoUrl est présent
      setSelectedVideo(content);
      setIsPlayerOpen(true);
    }
  };

  // La fonction handleCreatorClick est maintenant définie plus haut avec plus de fonctionnalités

  const filteredContentByTab = activeTab === 'all' 
    ? trendingVideos
    : trendingVideos.filter(content => content.isPremium === (activeTab === 'premium'));

  return (
    <div className="relative z-10">
      <GoldenRatioGrid visible={config.goldenRatioVisible || false} opacity={0.05} />
      <AdaptiveMoodLighting currentMood={config.adaptiveMood} intensity={config.moodIntensity} />
      <MicroRewardsEnhanced 
        enable={config.microRewardsEnabled} 
        rewardIntensity={config.microRewardsIntensity}
        adaptToContext={true}
        reducedMotion={config.animationSpeed === 'reduced'}
      />

      <div className="container px-4 mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Trending</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
            <Button variant="outline" size="icon" onClick={() => { loadCreators(); loadTrendingVideos(); }} title="Actualiser">
                <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="content" value={pageTab} onValueChange={setPageTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="creators" className="flex items-center gap-1">
              <Users size={14} />
              Créateurs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="vip">VIP</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                {isLoadingVideos && <p>Chargement des vidéos...</p>}
                {videosError && <p className="text-red-500">{videosError}</p>}
                {!isLoadingVideos && !videosError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ContentGrid 
                      contents={filteredContentByTab} 
                      layout="masonry"
                      onItemClick={(id) => {
                        const content = filteredContentByTab.find(c => c.id === Number(id));
                        if (content) handleContentClick(content);
                      }}
                    />
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="creators">
            {isLoadingCreators && <p>Chargement des créateurs...</p>}
            {creatorsError && <p className="text-red-500">{creatorsError}</p>}
            {!isLoadingCreators && !creatorsError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {creators.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {creators
                      .filter(creator => creator && creator.id) // Filtre les créateurs sans ID
                      .map((creator) => {
                        const creatorId = creator.id?.toString() || 'unknown';
                        return (
                          <ContentCreatorCard
                            key={creatorId}
                            creator={{
                              id: creatorId,
                              userId: creatorId,
                              username: creator.username || 'Utilisateur inconnu',
                              name: creator.name || creator.username || 'Utilisateur',
                              avatar: creator.profileImageUrl || `https://i.pravatar.cc/300?u=${creatorId}`,
                              bio: creator.bio,
                              metrics: creator.metrics || {},
                              isPremium: creator.isPremium || false,
                            }}
                            onClick={() => handleCreatorClick(creator)}
                          />
                        );
                      })}
                  </div>
                ) : (
                  <p>Aucun créateur trouvé.</p>
                )}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <XteasePlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoSrc={selectedVideo?.videoUrl || ''} // Assurez-vous que videoUrl est le bon champ
        thumbnailUrl={selectedVideo?.thumbnailUrl}
        title={selectedVideo?.title}
      />
    </div>
  );
};

export default TrendingContent;
