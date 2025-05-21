import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toast } from 'sonner';
import { Book, Eye, Heart, MessageSquare, Star, Award, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CreatorHeader from '@/components/CreatorHeader';
import TabNav from '@/components/TabNav';
import ContentGrid from '@/components/ContentGrid';
import { cn } from '@/lib/utils';
import ProfileNav from '@/components/ProfileNav';
import MicroRewards from '@/components/monetization/MicroRewards';
import CreatorDNA from '@/components/creator/CreatorDNA';
import CreatorJourney from '@/components/creator/CreatorJourney';

interface CreatorSkill {
  name: string;
  level: number;
}

interface JourneyMilestone {
  id: string;
  year: number;
  date: string;
  title: string;
  description: string;
}

const CreatorProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // State for interaction tracking
  const [interactions, setInteractions] = useState(0);
  const [visibleSections, setVisibleSections] = useState({
    header: true,
    dna: false,
    bio: false,
    journey: false,
    videos: false
  });
  
  // Phase of the visit determines what content is shown
  const [visitPhase, setVisitPhase] = useState<'discovery' | 'immersion'>('discovery');
  
  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Creator Data (mock)
  const creatorData = {
    id: "c1",
    name: "Laura Dubois",
    username: username || "lauradubois",
    profession: "Artiste Visuelle & Créatrice de Contenu",
    location: "Paris, France",
    avatar: "https://i.pravatar.cc/300?img=5",
    coverImage: "https://picsum.photos/1920/1080?random=1",
    bio: "Artiste visuelle et créatrice de contenu spécialisée dans l'art numérique et la photographie créative.",
    premiumContent: true,
    tier: "gold" as const,
    metrics: {
      followers: 24580,
      following: 342,
      superfans: 1250,
      retentionRate: 94,
      watchMinutes: 45720
    },
    isOnline: true
  };
  
  // Animation controls for scroll-driven effects
  const opacityHeader = useTransform(scrollY, [0, 300], [1, 0.2]);
  const scaleIntro = useTransform(scrollY, [0, 300], [1, 0.9]);
  
  // Interaction points to trigger rewards
  const [interactionPoints, setInteractionPoints] = useState([
    { id: 'header', seen: false, reward: 'pulse' },
    { id: 'dna', seen: false, reward: 'like' },
    { id: 'bio', seen: false, reward: 'star' },
    { id: 'journey', seen: false, reward: 'message' },
    { id: 'videos', seen: false, reward: 'like' }
  ]);
  
  // Creator attributes for DNA component
  const creatorSkills: CreatorSkill[] = [
    { name: "Photographie", level: 95 },
    { name: "Direction artistique", level: 88 },
    { name: "Édition vidéo", level: 75 },
    { name: "Narration visuelle", level: 92 }
  ];
  
  const creatorStyle = [
    "Minimaliste",
    "Contemporain",
    "Artistique",
    "Immersif"
  ];
  
  const creatorAchievements = [
    "Prix d'excellence artistique 2022",
    "Exposition internationale à New York",
    "Collaboration avec National Geographic"
  ];
  
  // Journey milestones for timeline
  const journeyMilestones: JourneyMilestone[] = [
    {
      id: "m1",
      year: 2018,
      date: "2018-05-15",
      title: "Débuts artistiques",
      description: "Premières expositions et création de contenu digital"
    },
    {
      id: "m2",
      year: 2020,
      date: "2020-02-20",
      title: "Reconnaissance internationale",
      description: "Participation à des festivals d'art prestigieux"
    },
    {
      id: "m3",
      year: 2022,
      date: "2022-07-10",
      title: "Expansion multimédia",
      description: "Lancement de séries vidéo immersives"
    },
    {
      id: "m4",
      year: 2023,
      date: "2023-12-05",
      title: "Masterclass & mentorat",
      description: "Partage d'expertise avec la communauté créative"
    }
  ];
  
  // Videos for content display
  const videos = [
    {
      id: "v1",
      title: "L'art de la composition minimaliste - Techniques avancées",
      thumbnailUrl: "https://picsum.photos/640/360?random=10",
      viewCount: 24150,
      likeCount: 1872,
      commentCount: 143,
      isPremium: true
    },
    {
      id: "v2",
      title: "Narration visuelle à travers la photographie urbaine",
      thumbnailUrl: "https://picsum.photos/640/360?random=11",
      viewCount: 18720,
      likeCount: 1435,
      commentCount: 87,
      isPremium: false
    },
    {
      id: "v3",
      title: "Couleurs et émotions - Comment évoquer des sentiments",
      thumbnailUrl: "https://picsum.photos/640/360?random=12",
      viewCount: 31205,
      likeCount: 2541,
      commentCount: 204,
      isPremium: false
    },
    {
      id: "v4",
      title: "Secrets de post-production pour photos atmosphériques",
      thumbnailUrl: "https://picsum.photos/640/360?random=13",
      viewCount: 12840,
      likeCount: 943,
      commentCount: 68,
      isPremium: true
    }
  ];
  
  // Simulate phase change based on interactions
  useEffect(() => {
    if (interactions >= 4) {
      setVisitPhase('immersion');
    }
  }, [interactions]);
  
  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };
  
  // Simulated function to trigger micro-rewards
  const triggerMicroReward = (type: 'like' | 'star' | 'message' | 'pulse') => {
    console.log(`Triggered micro-reward: ${type}`);
    // This would connect to the MicroRewards component
  };

  // Track interaction points to reward exploration
  const trackInteraction = (section: string) => {
    const updatedInteractions = interactions + 1;
    setInteractions(updatedInteractions);
    
    // Update visible sections
    setVisibleSections(prev => ({
      ...prev,
      [section]: true
    }));
    
    // Trigger rewards based on section
    const interactionPoint = interactionPoints.find(point => point.id === section && !point.seen);
    if (interactionPoint) {
      // Mark this section as seen
      const updatedPoints = interactionPoints.map(point => 
        point.id === section ? { ...point, seen: true } : point
      );
      setInteractionPoints(updatedPoints);
      
      // Trigger appropriate reward
      if (interactionPoint.reward === 'like') {
        triggerMicroReward('like');
      } else if (interactionPoint.reward === 'star') {
        triggerMicroReward('star');
      } else if (interactionPoint.reward === 'message') {
        triggerMicroReward('message');
      } else {
        triggerMicroReward('pulse');
      }
    }
    
    // If enough interactions, unlock more content
    if (updatedInteractions === 3 && visitPhase === 'discovery') {
      toast("Vous explorez activement", {
        description: "Continuez pour découvrir plus de contenu exclusif"
      });
    }
    
    if (updatedInteractions >= 5 && visitPhase === 'immersion') {
      toast("Accès VIP débloqué", {
        description: "Vous avez maintenant accès au contenu réservé aux visiteurs engagés"
      });
    }
  };
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      triggerMicroReward('like');
      toast.success(`Vous suivez maintenant ${creatorData.name}`);
    } else {
      toast(`Vous ne suivez plus ${creatorData.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90">
      {/* Enable micro-rewards for this page */}
      <MicroRewards 
        enabled={true} 
        intensity={70} 
      />
      
      {/* Hero section with parallax effect */}
      <motion.div 
        className="relative h-[50vh] overflow-hidden"
        style={{ 
          opacity: opacityHeader,
          scale: scaleIntro 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        onViewportEnter={() => trackInteraction('header')}
      >
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={creatorData.coverImage} 
          alt={creatorData.name} 
          className="w-full h-full object-cover object-center"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-gradient-primary">
              {creatorData.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              {creatorData.profession}
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="outline" className="bg-white/10 text-white">
                {creatorData.location}
              </Badge>
              {creatorData.premiumContent && (
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-300 text-white">
                  Contenu Premium
                </Badge>
              )}
              <Badge variant="outline" className="bg-white/10 text-white">
                {creatorData.tier.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <Button 
                variant={isFollowing ? "outline" : "default"} 
                onClick={handleFollow}
                className={isFollowing ? "border-white/40 text-white" : ""}
              >
                {isFollowing ? "Abonné" : "S'abonner"}
              </Button>
              <Button variant="outline" className="border-white/40 text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Creator header with metrics */}
      <div className="container max-w-6xl mx-auto px-4 py-6 -mt-8 relative z-20">
        <CreatorHeader
          name={creatorData.name}
          username={creatorData.username}
          avatar={creatorData.avatar}
          bio={creatorData.bio}
          tier={creatorData.tier}
          metrics={creatorData.metrics}
          isCreator={false}
          isOwner={false}
          isOnline={creatorData.isOnline}
          className="shadow-lg"
        />
      </div>
      
      {/* Main content section */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="md:col-span-1 space-y-8">
            {/* Creator DNA section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => trackInteraction('dna')}
            >
              <CreatorDNA 
                creatorName={creatorData.name}
                creatorSkills={creatorSkills}
                creatorStyle={creatorStyle}
                creatorAchievements={creatorAchievements}
              />
            </motion.div>
            
            {/* Creator Journey section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => trackInteraction('journey')}
            >
              <CreatorJourney milestones={journeyMilestones} />
            </motion.div>
          </div>
          
          {/* Right column */}
          <div className="md:col-span-2 space-y-8">
            {/* Bio expanded section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => trackInteraction('bio')}
              className="bg-card rounded-xl p-6 shadow-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <Book className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">À propos de moi</h2>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">
                  Bienvenue dans mon univers créatif ! Je suis {creatorData.name}, une passionnée d'art visuel et de narration.
                  Mon parcours a débuté dans le design graphique traditionnel avant de s'étendre à la création de contenu
                  digital immersif qui raconte des histoires visuellement captivantes.
                </p>
                
                {visitPhase === 'discovery' && (
                  <p className="mb-4">
                    Ma philosophie créative repose sur l'authenticité et l'expérimentation constante. Je crois fermement
                    que l'art devrait à la fois provoquer des émotions et susciter des réflexions. C'est pourquoi chacune
                    de mes créations cherche à établir une connexion profonde avec son audience.
                  </p>
                )}
                
                {visitPhase === 'immersion' && (
                  <>
                    <p className="mb-4">
                      Au fil des années, j'ai développé une approche unique qui fusionne esthétique minimaliste et narration
                      riche. Mon travail a été présenté dans plusieurs expositions et a reçu des reconnaissances dans
                      le domaine du design contemporain et de l'art digital.
                    </p>
                    <p>
                      Je suis ravie de partager mon univers avec vous sur Xdose et d'explorer ensemble les possibilités
                      infinies de l'expression créative. N'hésitez pas à me contacter pour des collaborations ou
                      simplement pour échanger sur nos passions communes !
                    </p>
                  </>
                )}
              </div>
              
              {visitPhase !== 'immersion' && (
                <div className="mt-4 text-center">
                  <Badge variant="outline" className="text-muted-foreground animate-pulse">
                    Continuez votre exploration pour découvrir plus...
                  </Badge>
                </div>
              )}
            </motion.div>
            
            {/* Videos section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => trackInteraction('videos')}
              className="bg-card rounded-xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Contenu récent</h2>
                </div>
                
                <Button variant="outline" size="sm">
                  Voir tout
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    
                    <img 
                      src={video.thumbnailUrl || `https://picsum.photos/seed/${video.id}/640/360`} 
                      alt={video.title} 
                      className="w-full aspect-video object-cover transition duration-300 group-hover:scale-105"
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                      <h3 className="text-white font-medium text-sm line-clamp-2">{video.title}</h3>
                      
                      <div className="flex items-center text-white/80 text-xs mt-2">
                        <div className="flex items-center mr-3">
                          <Eye className="h-3 w-3 mr-1" />
                          {video.viewCount?.toLocaleString()}
                        </div>
                        <div className="flex items-center mr-3">
                          <Heart className="h-3 w-3 mr-1" />
                          {video.likeCount?.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {video.commentCount?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    {video.isPremium && (
                      <div className="absolute top-2 right-2 z-20">
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-300 text-white text-xs">
                          PREMIUM
                        </Badge>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {visitPhase === 'immersion' && (
                <div className="mt-6 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Contenu exclusif débloqué</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Merci pour votre intérêt envers mon travail ! Voici un aperçu exclusif de mon prochain projet.
                  </p>
                  <Button size="sm" className="w-full">Accéder au contenu exclusif</Button>
                </div>
              )}
            </motion.div>
            
            {/* Testimonials - only shown in immersion phase */}
            {visitPhase === 'immersion' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="bg-card rounded-xl p-6 shadow-md"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Star className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Ce que dit la communauté</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Sophie M.</p>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Le contenu de Laura est véritablement inspirant. Son approche du design visuel m'a aidé à 
                      repenser complètement ma propre démarche créative. Un must à suivre !"
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Thomas R.</p>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={cn("h-3 w-3", star <= 4 ? "fill-amber-500 text-amber-500" : "text-muted")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Je suis abonné premium depuis plusieurs mois et chaque nouvelle vidéo est une pépite. 
                      La qualité et l'authenticité sont au rendez-vous à chaque fois."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* CTA section at bottom */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 py-12 mt-12">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez l'aventure créative</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Abonnez-vous pour découvrir en avant-première mes nouvelles créations et 
            accéder à du contenu exclusif réservé à ma communauté.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8">
              Devenir abonné premium
            </Button>
            <Button variant="outline" size="lg">
              Explorer plus de contenu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
