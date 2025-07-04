
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ContentGrid from "@/components/shared/ContentGrid";
import { Button } from "@/components/ui/button";
import { useNeuroAesthetic } from "@/hooks/use-neuro-aesthetic";
import { useUserBehavior, InteractionType } from "@/hooks/use-user-behavior";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/sonner";
import FocusMode from "@/components/ambient/FocusMode";
import AmbientSoundscapes from "@/components/ambient/AmbientSoundscapes";
import AdaptiveMoodLighting from "@/components/neuro-aesthetic/AdaptiveMoodLighting";
import GoldenRatioGrid from "@/components/neuro-aesthetic/GoldenRatioGrid";
import MicroRewardsEnhanced from "@/components/effects/MicroRewardsEnhanced";
import { Eye, Heart, ArrowRight, Crown, LogIn, UserPlus, Upload, Settings } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import CognitiveProfilePanel from "@/components/settings/CognitiveProfilePanel";
import XDoseLogo from "@/components/ui/XDoseLogo";
import { cn } from "@/lib/utils";
// Using Prisma with Neon Database for user follows
import { 
  followCreator, 
  unfollowCreator, 
  getUserFollowedCreatorIds, 
  checkUserFollowsCreator, // Ajouté au cas où c'est utilisé pour un créateur spécifique
  CreatorProfileData // Pour typer recommendedCreators si besoin
} from '@/services/creatorService'; // Modifié pour Firebase

// Sample content data with more premium and VIP content
const trendingContent = [
  {
    id: "trend1",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    title: "Morning Coffee Routine",
    type: "premium" as const,
    format: "video" as const,
    duration: 345,
    metrics: {
      likes: 1200,
      comments: 89,
      views: 5600
    }
  }, {
    id: "trend2",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    title: "Spring Fashion Look",
    type: "vip" as const,
    format: "video" as const,
    duration: 520,
    metrics: {
      likes: 950,
      comments: 63,
      views: 4100
    }
  }, {
    id: "trend3",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
    title: "Sunset at the Mountain",
    type: "standard" as const,
    format: "video" as const,
    duration: 187,
    metrics: {
      likes: 2300,
      comments: 156,
      views: 12400
    }
  }, {
    id: "trend4",
    imageUrl: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=800&auto=format&fit=crop",
    title: "Boulangerie Tour Paris",
    type: "vip" as const,
    format: "video" as const,
    duration: 845,
    metrics: {
      likes: 3200,
      comments: 278,
      views: 15600
    }
  }, {
    id: "trend5",
    imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&auto=format&fit=crop",
    title: "Backstage Fashion Week",
    type: "premium" as const,
    format: "video" as const,
    duration: 652,
    metrics: {
      likes: 4100,
      comments: 215,
      views: 18900
    }
  }, {
    id: "trend6",
    imageUrl: "https://images.unsplash.com/photo-1605812276723-c31bb1a68285?w=800&auto=format&fit=crop",
    title: "Exclusive Interview",
    type: "vip" as const,
    format: "video" as const,
    duration: 1245,
    metrics: {
      likes: 5800,
      comments: 420,
      views: 23500
    }
  }
];

// Adapter le type des créateurs recommandés pour correspondre à CreatorProfileData ou une version simplifiée
interface RecommendedCreator {
  id: string; // uid du créateur
  userId: string; // uid du créateur (redondant avec id mais présent dans le mock)
  name: string;
  username: string;
  imageUrl: string;
  type?: string; // ex: diamond, gold (peut être partie du profil)
  metrics?: {
    followers?: number;
    content?: number;
  };
}

const recommendedCreators: RecommendedCreator[] = [
  {
    id: "creator1_uid", // Doit être un UID Firebase valide si on veut vérifier le suivi
    userId: "creator1_uid", 
    name: "Sarah K.",
    username: "sarahk.creative",
    imageUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
    type: "diamond",
    metrics: { followers: 21500, content: 156 }
  }, 
  {
    id: "creator2_uid",
    userId: "creator2_uid",
    name: "Thomas R.",
    username: "thomas.photo",
    imageUrl: "https://i.pravatar.cc/150?img=11",
    type: "gold",
    metrics: { followers: 14200, content: 87 }
  }, 
  // ... autres créateurs mockés
];

const Index = () => {
  const isMobile = useIsMobile();
  const {
    config,
    updateConfig,
    triggerMicroReward
  } = useNeuroAesthetic();
  const {
    trackInteraction,
    trackContentPreference
  } = useUserBehavior();
  const [showGoldenRatio, setShowGoldenRatio] = useState(false);
  const [showCognitivePanel, setShowCognitivePanel] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [creatorFollowStates, setCreatorFollowStates] = useState<Record<string, boolean>>({});
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});

  // Determine if user is a creator - since we're using Supabase auth, we'll need to check user metadata or profile
  const isCreator = user?.user_metadata?.role === 'creator' || false;

  useEffect(() => {
    trackInteraction('view', { page: 'index' });
    
    const loadInitialFollowStatus = async () => {
      if (!user || !user.id) return;
      
      try {
        // Utiliser getUserFollowedCreatorIds qui retourne string[]
        const followedCreatorIds = await getUserFollowedCreatorIds(user.id);
        const newFollowStates: Record<string, boolean> = {};
        recommendedCreators.forEach(creator => {
          // `creator.id` ici est l'identifiant du créateur dans la liste mockée.
          // Assurez-vous que `creator.id` ou `creator.userId` correspond bien à l'UID Firebase du créateur.
          newFollowStates[creator.userId] = followedCreatorIds.includes(creator.userId);
        });
        setCreatorFollowStates(newFollowStates);
      } catch (error) {
        console.error('Error loading initial follow statuses:', error);
      }
    };
    
    loadInitialFollowStatus();
  }, [trackInteraction, user]); // Dépendance sur user pour recharger si l'utilisateur change
  
  const toggleGoldenRatio = () => {
    setShowGoldenRatio(!showGoldenRatio);
    updateConfig({ goldenRatioVisible: !showGoldenRatio });
    trackInteraction('toggle' as InteractionType, { feature: 'goldenRatio', state: !showGoldenRatio });
  };

  const handleContentClick = (contentId: string, contentType: string) => {
    triggerMicroReward('click');
    trackInteraction('click', { contentId, contentType });
    trackContentPreference(contentType);
  };
  
  const handleFollowToggle = async (creatorToToggle: RecommendedCreator) => {
    if (!user || !user.id) {
      navigate('/auth');
      trackInteraction('navigate', { to: 'auth', reason: 'follow' });
      return;
    }

    if (user.id === creatorToToggle.userId) {
      toast.info("Vous ne pouvez pas vous suivre vous-même.");
      return;
    }
    
    setFollowLoading(prev => ({ ...prev, [creatorToToggle.userId]: true }));
    
    try {
      const isCurrentlyFollowing = creatorFollowStates[creatorToToggle.userId];
      let success = false;

      if (isCurrentlyFollowing) {
        success = await unfollowCreator(user.id, creatorToToggle.userId);
        if (success) {
          setCreatorFollowStates(prev => ({ ...prev, [creatorToToggle.userId]: false }));
          toast.success(`Vous ne suivez plus ${creatorToToggle.name}`);
        }
      } else {
        success = await followCreator(user.id, creatorToToggle.userId);
        if (success) {
          setCreatorFollowStates(prev => ({ ...prev, [creatorToToggle.userId]: true }));
          toast.success(`Vous suivez maintenant ${creatorToToggle.name}`, {
            description: "Découvrez son contenu exclusif"
          });
          triggerMicroReward('like');
        }
      }
      
      if (success) {
        trackInteraction('follow', { creatorId: creatorToToggle.userId, state: !isCurrentlyFollowing });
      } else {
        toast.error("L'opération de suivi/désabonnement a échoué.");
      }

    } catch (error) {
      console.error('Error toggling follow state:', error);
      toast.error('Une erreur est survenue', { description: 'Veuillez réessayer plus tard' });
    } finally {
      setFollowLoading(prev => ({ ...prev, [creatorToToggle.userId]: false }));
    }
  };

  // Get display name from Supabase user
  const displayName = user?.user_metadata?.display_name || user?.email || "Utilisateur";
  const userRole = isCreator ? "Créateur" : "Fan";

  return (
    <div className="relative z-10">
      {/* Neuro-aesthetic elements */}
      <GoldenRatioGrid visible={config.goldenRatioVisible || false} opacity={0.05} />
      <AdaptiveMoodLighting currentMood={config.adaptiveMood} intensity={config.moodIntensity} />
      <MicroRewardsEnhanced enable={config.microRewardsEnabled} rewardIntensity={config.microRewardsIntensity} adaptToContext={true} reducedMotion={config.animationSpeed === 'reduced'} />
      <FocusMode enabled={config.focusModeEnabled} onToggle={isEnabled => {
        updateConfig({ focusModeEnabled: isEnabled });
        trackInteraction('toggle' as InteractionType, { feature: 'focusMode', state: isEnabled });
      }} ambientSoundsEnabled={config.ambientSoundsEnabled || false} onAmbientSoundsToggle={isEnabled => {
        updateConfig({ ambientSoundsEnabled: isEnabled });
        trackInteraction('toggle' as InteractionType, { feature: 'ambientSounds', state: isEnabled });
      }} />
      <AmbientSoundscapes enabled={config.ambientSoundsEnabled || false} volume={config.ambientVolume || 50} onVolumeChange={volume => updateConfig({ ambientVolume: volume })} />

      {/* Main content */}
      <div className="container px-4 mx-auto py-8 space-y-8">
        {/* Hero section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-6 max-w-3xl mx-auto mb-6">
          <div className="flex justify-center my-0 rounded-none py-0"><XDoseLogo size="xl" animated={true} /></div>
          <div className="flex flex-wrap gap-4 justify-center">
            {!user ? (
              <>
                <Button size="lg" className="bg-xvush-pink hover:bg-xvush-pink-dark gap-2" onClick={() => trackInteraction('navigate', { to: 'login' })}>
                  <Link to="/auth" className="flex items-center"><LogIn className="mr-2 h-4 w-4" /> Se connecter</Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => trackInteraction('navigate', { to: 'signup' })}>
                  <Link to="/auth?tab=signup" className="flex items-center"><UserPlus className="mr-2 h-4 w-4" /> Créer un compte</Link>
                </Button>
              </>
            ) : isCreator ? (
              <>
                <Button size="lg" className="bg-xvush-pink hover:bg-xvush-pink-dark gap-2" onClick={() => { navigate('/dashboard'); trackInteraction('navigate', { to: 'dashboard' }); }}>
                  <Crown className="mr-2 h-4 w-4" /> Tableau de bord créateur
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => { navigate('/videos'); trackInteraction('navigate', { to: 'videos' }); }}>
                  <Upload className="mr-2 h-4 w-4" /> Publier du contenu
                </Button>
              </>
            ) : (
              <Button size="lg" className="bg-xvush-pink hover:bg-xvush-pink-dark" onClick={() => trackInteraction('navigate', { to: 'creators' })}>
                <Link to="/creators">Explorer les créateurs <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            )}
          </div>
        </motion.div>
        
        {/* Trending content section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending Content</h2>
            <Button variant="link" className="gap-2" onClick={() => { navigate('/trending'); trackInteraction('navigate', { to: 'trending' }); }}>
              Voir tout <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <ContentGrid contents={trendingContent} layout="masonry" onItemClick={id => handleContentClick(id, 'trending')} />
          </motion.div>
        </section>
        
        {/* Creators section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended Creators</h2>
            <Button variant="link" className="gap-2" onClick={() => trackInteraction('navigate', { to: 'creators' })}>
              <Link to="/creators">Voir tout <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCreators.map(creator => (
              <motion.div 
                key={creator.id} 
                className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow" 
                whileHover={{ y: -5 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => handleContentClick(creator.id, 'creator')}
              >
                <Link to={`/creator/${creator.username}`} className="flex items-center gap-3 mb-3">
                  <img src={creator.imageUrl} alt={creator.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/50" />
                  <div>
                    <h3 className="font-medium">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">@{creator.username}</p>
                  </div>
                </Link>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-muted-foreground" />
                    <span>{creator.metrics?.followers?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={14} className="text-muted-foreground" />
                    <span>{creator.metrics?.content || 'N/A'} contenus</span>
                  </div>
                </div>
                {user && user.id !== creator.userId && (
                  <Button 
                    className={cn(
                      "w-full mt-3", 
                      creatorFollowStates[creator.userId] 
                        ? "bg-gray-600 hover:bg-gray-700" 
                        : "bg-xvush-pink hover:bg-xvush-pink-dark"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFollowToggle(creator);
                    }}
                    disabled={followLoading[creator.userId]}
                  >
                    {followLoading[creator.userId] ? (
                      <span className="flex items-center justify-center">
                        <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                        {creatorFollowStates[creator.userId] ? "Désabonnement..." : "Abonnement..."}
                      </span>
                    ) : (
                      creatorFollowStates[creator.userId] ? "Ne plus suivre" : "Suivre"
                    )}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Neuro-aesthetic controls */}
        <section className="bg-muted/30 backdrop-blur-sm p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Neuro-Aesthetic Experience Controls</h2>
            <Button variant="outline" size="sm" onClick={() => { setShowCognitivePanel(!showCognitivePanel); trackInteraction('toggle' as InteractionType, { feature: 'cognitivePanel', state: !showCognitivePanel }); }} className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              {showCognitivePanel ? "Masquer avancé" : "Paramètres avancés"}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Ambiance visuelle</h3>
              <div className="flex gap-2">
                {(['energetic', 'calm', 'creative', 'focused'] as const).map(mood => (
                  <Button key={mood} variant={config.adaptiveMood === mood ? "default" : "outline"} size="sm" className="capitalize" onClick={() => { updateConfig({ adaptiveMood: mood }); trackInteraction('select' as InteractionType, { feature: 'mood', value: mood }); triggerMicroReward('select'); }}>
                    {mood}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Change l'ambiance lumineuse de l'interface</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Intensité visuelle</h3>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => { updateConfig({ moodIntensity: Math.max(0, config.moodIntensity - 10) }); trackInteraction('adjust' as InteractionType, { feature: 'moodIntensity', direction: 'decrease' }); }}>-</Button>
                <div className="flex-grow text-center">{config.moodIntensity}%</div>
                <Button variant="outline" size="sm" onClick={() => { updateConfig({ moodIntensity: Math.min(100, config.moodIntensity + 10) }); trackInteraction('adjust' as InteractionType, { feature: 'moodIntensity', direction: 'increase' }); }}>+</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ajuste la densité des effets visuels</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Micro-récompenses</h3>
              <Button variant={config.microRewardsEnabled ? "default" : "outline"} size="sm" onClick={() => { updateConfig({ microRewardsEnabled: !config.microRewardsEnabled }); trackInteraction('toggle' as InteractionType, { feature: 'microRewards', state: !config.microRewardsEnabled }); if (!config.microRewardsEnabled) { triggerMicroReward('click'); } }}>
                {config.microRewardsEnabled ? "Activées" : "Désactivées"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Animations subtiles pour renforcer l'engagement</p>
            </div>
          </div>
          {showCognitivePanel && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 overflow-hidden">
              <CognitiveProfilePanel />
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
