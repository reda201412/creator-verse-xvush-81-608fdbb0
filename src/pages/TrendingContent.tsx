
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
import { getAllCreators, CreatorProfileData, getCreatorVideos, VideoFirestoreData } from "@/services/creatorService"; // Services Firebase

// Utiliser VideoFirestoreData pour le contenu aussi, en l'adaptant si besoin
// ou créer un type spécifique pour le contenu "trending"
interface TrendingContentItem extends VideoFirestoreData {
  // Ajouter des champs spécifiques au trending si nécessaire, ex: score de tendance
  // Pour l'instant, on se base sur VideoFirestoreData et on ajoute des données mockées pour l'UI
  metrics?: { // Métriques mockées pour l'UI, car elles ne sont pas sur VideoFirestoreData par défaut
    likes?: number;
    comments?: number;
    views?: number;
  };
}

// Données statiques pour l'UI en attendant une logique de "tendance" plus avancée depuis Firestore
// Ces données pourraient être enrichies ou remplacées par des données de Firestore
const staticTrendingPlaceholders: TrendingContentItem[] = [
  {
    id: "trend1",
    userId: "mockUserId1",
    uploadedAt: new Date(),
    title: "Morning Coffee Routine (Placeholder)",
    type: "premium",
    format: "9:16",
    thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-taking-cold-pictures-33355-large.mp4",
    metrics: { likes: 1200, comments: 89, views: 5600 }
  },
  {
    id: "trend2",
    userId: "mockUserId2",
    uploadedAt: new Date(),
    title: "Spring Fashion Look (Placeholder)",
    type: "vip",
    format: "9:16",
    thumbnailUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-large.mp4",
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
          likes: Math.floor(Math.random() * 5000),
          rating: 4 + Math.random(),
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

  const handleContentClick = (content: TrendingContentItem) => {
    triggerMicroReward('click');
    trackInteraction('click', { contentId: content.id });
    
    if (content.videoUrl) { // Assurez-vous que videoUrl est présent
      setSelectedVideo(content);
      setIsPlayerOpen(true);
    }
  };

  const handleCreatorClick = (creator: CreatorProfileData) => {
    triggerMicroReward('click');
    trackInteraction('click', { creatorId: creator.uid });
    navigate('/secure-messaging', { state: { creatorId: creator.uid } });
  };

  const filteredContentByTab = activeTab === 'all' 
    ? trendingVideos
    : trendingVideos.filter(content => content.type === activeTab);

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
                      onItemClick={handleContentClick} // Passez TrendingContentItem
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
                    {creators.map((creator) => (
                      <ContentCreatorCard
                        key={creator.uid} 
                        creator={{
                          id: creator.uid, // Utiliser uid
                          userId: creator.uid,
                          username: creator.username,
                          name: creator.displayName || creator.username,
                          avatar: creator.avatarUrl || `https://i.pravatar.cc/300?u=${creator.uid}`,
                          bio: creator.bio || undefined,
                          metrics: creator.metrics, // Métriques simulées ajoutées
                          isPremium: creator.isPremium // Simulé
                        }}
                        onClick={() => handleCreatorClick(creator)}
                      />
                    ))}
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
