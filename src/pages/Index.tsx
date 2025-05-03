import React, { useState } from "react";
import { motion } from "framer-motion";
import ContentGrid from "@/components/ContentGrid";
import { Button } from "@/components/ui/button";
import { useNeuroAesthetic } from "@/hooks/use-neuro-aesthetic";
import { useIsMobile } from "@/hooks/use-mobile";
import FocusMode from "@/components/ambient/FocusMode";
import AmbientSoundscapes from "@/components/ambient/AmbientSoundscapes";
import AdaptiveMoodLighting from "@/components/neuro-aesthetic/AdaptiveMoodLighting";
import GoldenRatioGrid from "@/components/neuro-aesthetic/GoldenRatioGrid";
import MicroRewards from "@/components/effects/MicroRewards";
import { Eye, Heart, ArrowRight } from "lucide-react";

// Sample content data similar to the CreatorProfile page
const trendingContent = [
  {
    id: "trend1",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    title: "Morning Coffee Routine",
    type: "premium" as const,
    format: "image" as const,
    metrics: {
      likes: 1200,
      comments: 89,
      views: 5600,
    }
  },
  {
    id: "trend2",
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
    id: "trend3",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
    title: "Sunset at the Mountain",
    type: "standard" as const,
    format: "video" as const,
    duration: 187,
    metrics: {
      likes: 2300,
      comments: 156,
      views: 12400,
    }
  },
  {
    id: "trend4",
    imageUrl: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=800&auto=format&fit=crop",
    title: "Boulangerie Tour Paris",
    type: "vip" as const,
    format: "video" as const,
    duration: 845,
    metrics: {
      likes: 3200,
      comments: 278,
      views: 15600,
    }
  },
];

const recommendedCreators = [
  {
    id: "creator1",
    name: "Sarah K.",
    username: "sarahk.creative",
    imageUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
    type: "diamond",
    metrics: {
      followers: 21500,
      content: 156
    }
  },
  {
    id: "creator2",
    name: "Thomas R.",
    username: "thomas.photo",
    imageUrl: "https://i.pravatar.cc/150?img=11",
    type: "gold",
    metrics: {
      followers: 14200,
      content: 87
    }
  },
  {
    id: "creator3",
    name: "Camille D.",
    username: "cam.style",
    imageUrl: "https://i.pravatar.cc/150?img=20",
    type: "platinum",
    metrics: {
      followers: 18700,
      content: 212
    }
  },
  {
    id: "creator4",
    name: "Marc L.",
    username: "marc.travels",
    imageUrl: "https://i.pravatar.cc/150?img=33",
    type: "silver",
    metrics: {
      followers: 9800,
      content: 63
    }
  }
];

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const { config, updateConfig, triggerMicroReward } = useNeuroAesthetic({
    moodIntensity: isMobile ? 30 : 50,
    microRewardsIntensity: isMobile ? 20 : 50,
  });

  const [showGoldenRatio, setShowGoldenRatio] = useState(false);

  const toggleGoldenRatio = () => {
    setShowGoldenRatio(!showGoldenRatio);
    updateConfig({
      goldenRatioVisible: !showGoldenRatio
    });
  };

  return (
    <div className="relative z-10">
      {/* Neuro-aesthetic elements */}
      <GoldenRatioGrid visible={config.goldenRatioVisible} opacity={0.05} />
      <AdaptiveMoodLighting currentMood={config.adaptiveMood} intensity={config.moodIntensity} />
      <MicroRewards enable={config.microRewardsEnabled} rewardIntensity={config.microRewardsIntensity} />
      <FocusMode 
        enabled={config.focusModeEnabled}
        onToggle={(isEnabled) => updateConfig({ focusModeEnabled: isEnabled })}
        ambientSoundsEnabled={config.ambientSoundsEnabled}
        onAmbientSoundsToggle={(isEnabled) => updateConfig({ ambientSoundsEnabled: isEnabled })}
      />
      <AmbientSoundscapes
        enabled={config.ambientSoundsEnabled}
        volume={config.ambientVolume}
        onVolumeChange={(volume) => updateConfig({ ambientVolume: volume })}
      />

      {/* Main content */}
      <div className="container px-4 mx-auto py-8 space-y-16">
        {/* Hero section */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-display">
              <span className="text-gradient-primary">CreatorVerse</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Découvrez une nouvelle expérience créateur enrichie par la neuro-esthétique et l'immersion visuelle avancée
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-xvush-pink hover:bg-xvush-pink-dark">
                Explorer les créateurs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={toggleGoldenRatio}>
                {showGoldenRatio ? 'Masquer' : 'Afficher'} la grille d'or
              </Button>
            </div>
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 -left-10 w-72 h-72 bg-xvush-purple/20 rounded-full filter blur-3xl opacity-50 -z-10"></div>
          <div className="absolute bottom-0 -right-10 w-72 h-72 bg-xvush-pink/20 rounded-full filter blur-3xl opacity-50 -z-10"></div>
        </section>
        
        {/* Trending content section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending Content</h2>
            <Button variant="link" className="gap-2">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ContentGrid 
              contents={trendingContent} 
              layout="masonry" 
            />
          </motion.div>
        </section>
        
        {/* Creators section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended Creators</h2>
            <Button variant="link" className="gap-2">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCreators.map(creator => (
              <motion.div
                key={creator.id}
                className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={creator.imageUrl} 
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
                  />
                  <div>
                    <h3 className="font-medium">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">@{creator.username}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-muted-foreground" />
                    <span>{creator.metrics.followers.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Heart size={14} className="text-muted-foreground" />
                    <span>{creator.metrics.content} contenus</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-3 bg-xvush-pink hover:bg-xvush-pink-dark"
                  onClick={() => {
                    toast({
                      title: `Vous suivez maintenant ${creator.name}`,
                      description: "Découvrez son contenu exclusif"
                    });
                    triggerMicroReward('like');
                  }}
                >
                  Suivre
                </Button>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Neuro-aesthetic controls */}
        <section className="bg-muted/30 backdrop-blur-sm p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Neuro-Aesthetic Experience Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Ambiance visuelle</h3>
              <div className="flex gap-2">
                {(['energetic', 'calm', 'creative', 'focused'] as const).map(mood => (
                  <Button
                    key={mood}
                    variant={config.adaptiveMood === mood ? "default" : "outline"}
                    size="sm"
                    className="capitalize"
                    onClick={() => updateConfig({ adaptiveMood: mood })}
                  >
                    {mood}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Change l'ambiance lumineuse de l'interface
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Intensité visuelle</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateConfig({ moodIntensity: Math.max(0, config.moodIntensity - 10) })}
                >
                  -
                </Button>
                <div className="flex-grow text-center">{config.moodIntensity}%</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateConfig({ moodIntensity: Math.min(100, config.moodIntensity + 10) })}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ajuste la densité des effets visuels
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Micro-récompenses</h3>
              <Button
                variant={config.microRewardsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ microRewardsEnabled: !config.microRewardsEnabled })}
              >
                {config.microRewardsEnabled ? "Activées" : "Désactivées"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Animations subtiles pour renforcer l'engagement
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
