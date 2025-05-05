
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useNeuroML } from '@/hooks/use-neuro-ml';
import { useUserBehavior } from '@/hooks/use-user-behavior';
import CreativeEconomy from './economy/CreativeEconomy';
import ProgressionSystem from './progression/ProgressionSystem';
import ImmersiveExperience from './immersive/ImmersiveExperience';
import AdaptiveMoodLighting from './neuro-aesthetic/AdaptiveMoodLighting';
import CognitiveProfilePanel from './settings/CognitiveProfilePanel';
import { Brain, Coins, Trophy, ArrowUpRight, Sparkles, LineChart, Layers, ScrollText } from 'lucide-react';

// Mock data for the demos
const mockCreators = [
  {
    id: '1',
    name: 'Emma Creativia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
    growth: 15,
    supporters: 127,
    returnsHistory: [2, 3, 3.5, 4, 5, 4.5, 5.5, 6],
    returnsRate: 12,
    popularity: 4.7,
    tags: ['Art', 'Digital', 'Design'],
    isRising: true
  },
  {
    id: '2',
    name: 'Tech Innovate',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
    growth: 8,
    supporters: 84,
    returnsHistory: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
    returnsRate: 8,
    popularity: 3.8,
    tags: ['Tech', 'Programming', 'AI'],
    isRising: false
  },
  {
    id: '3',
    name: 'Fitness Pro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
    growth: 22,
    supporters: 215,
    returnsHistory: [3, 4, 5, 5.5, 7, 6.5, 7.5, 9],
    returnsRate: 15,
    popularity: 4.2,
    tags: ['Fitness', 'Health', 'Coaching'],
    isRising: true
  }
];

const mockInvestments = [
  {
    id: '1',
    creatorId: '1',
    creatorName: 'Emma Creativia',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
    amount: 50,
    tokensInvested: 50,
    date: '2023-12-01',
    returns: 6,
    growth: 12,
    status: 'active'
  },
  {
    id: '2',
    creatorId: '3',
    creatorName: 'Fitness Pro',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
    amount: 30,
    tokensInvested: 30,
    date: '2023-11-15',
    returns: 4.5,
    growth: 15,
    status: 'active'
  },
  {
    id: '3',
    creatorId: '2',
    creatorName: 'Tech Innovate',
    creatorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
    amount: 20,
    tokensInvested: 20,
    date: '2023-10-20',
    returns: 1.6,
    growth: 8,
    status: 'active'
  },
  {
    id: '4',
    creatorId: '4',
    creatorName: 'Music Producer',
    creatorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
    amount: 25,
    tokensInvested: 25,
    date: '2023-09-10',
    returns: 1.25,
    growth: 5,
    status: 'completed'
  }
];

const mockProgressionPaths = [
  {
    id: 'creator',
    name: 'Créateur',
    description: 'Développez vos talents créatifs et partagez vos créations avec la communauté',
    icon: 'creator',
    level: 3,
    maxLevel: 10,
    experience: 750,
    experienceToNextLevel: 1000,
    primaryColor: 'amber',
    unlocked: true,
    badges: [
      {
        id: '1',
        name: 'Premier Post',
        description: 'Publiez votre premier contenu',
        icon: '📝',
        rarity: 'common',
        unlocked: true,
        unlockedAt: '2023-10-15'
      },
      {
        id: '2',
        name: 'Populaire',
        description: 'Atteignez 100 likes sur un contenu',
        icon: '❤️',
        rarity: 'uncommon',
        unlocked: true,
        unlockedAt: '2023-11-02'
      },
      {
        id: '3',
        name: 'Tendance',
        description: 'Apparaissez dans les tendances',
        icon: '📈',
        rarity: 'rare',
        unlocked: false
      }
    ],
    achievements: [
      {
        id: '1',
        name: 'Créateur Prolifique',
        description: 'Publiez 10 contenus',
        progress: 7,
        total: 10,
        completed: false,
        reward: {
          type: 'badge',
          itemId: 'prolific',
          itemName: 'Créateur Prolifique'
        }
      },
      {
        id: '2',
        name: 'Engagement Fort',
        description: 'Recevez 50 commentaires sur vos publications',
        progress: 32,
        total: 50,
        completed: false,
        reward: {
          type: 'experience',
          amount: 200
        }
      }
    ],
    tasks: [
      {
        id: '1',
        name: 'Publier du contenu',
        description: 'Publier un nouveau contenu aujourd\'hui',
        progress: 0,
        total: 1,
        completed: false,
        difficulty: 'medium',
        reward: {
          type: 'token',
          amount: 5
        }
      },
      {
        id: '2',
        name: 'Répondre aux commentaires',
        description: 'Répondre à 5 commentaires',
        progress: 3,
        total: 5,
        completed: false,
        difficulty: 'easy',
        reward: {
          type: 'experience',
          amount: 50
        }
      }
    ]
  },
  {
    id: 'explorer',
    name: 'Explorateur',
    description: 'Découvrez et interagissez avec du contenu varié pour élargir vos horizons',
    icon: 'explorer',
    level: 5,
    maxLevel: 10,
    experience: 450,
    experienceToNextLevel: 500,
    primaryColor: 'blue',
    unlocked: true,
    badges: [
      {
        id: '1',
        name: 'Curieux',
        description: 'Consultez 50 contenus différents',
        icon: '🔍',
        rarity: 'common',
        unlocked: true,
        unlockedAt: '2023-09-20'
      },
      {
        id: '2',
        name: 'Éclectique',
        description: 'Suivez des créateurs de 5 catégories différentes',
        icon: '🌈',
        rarity: 'uncommon',
        unlocked: true,
        unlockedAt: '2023-10-10'
      }
    ],
    achievements: [
      {
        id: '1',
        name: 'Grand Voyageur',
        description: 'Consultez 100 contenus',
        progress: 100,
        total: 100,
        completed: true,
        reward: {
          type: 'token',
          amount: 20
        }
      }
    ],
    tasks: [
      {
        id: '1',
        name: 'Découverte quotidienne',
        description: 'Découvrir 3 nouveaux créateurs',
        progress: 2,
        total: 3,
        completed: false,
        difficulty: 'easy',
        reward: {
          type: 'experience',
          amount: 30
        }
      }
    ]
  },
  {
    id: 'supporter',
    name: 'Supporter',
    description: 'Soutenez la communauté en investissant et en faisant des donations',
    icon: 'supporter',
    level: 2,
    maxLevel: 10,
    experience: 220,
    experienceToNextLevel: 300,
    primaryColor: 'green',
    unlocked: true,
    badges: [
      {
        id: '1',
        name: 'Premier Soutien',
        description: 'Faites votre premier investissement',
        icon: '💰',
        rarity: 'common',
        unlocked: true,
        unlockedAt: '2023-11-15'
      }
    ],
    achievements: [
      {
        id: '1',
        name: 'Mécène',
        description: 'Investissez dans 5 créateurs différents',
        progress: 3,
        total: 5,
        completed: false,
        reward: {
          type: 'badge',
          itemId: 'patron',
          itemName: 'Mécène'
        }
      }
    ],
    tasks: [
      {
        id: '1',
        name: 'Don quotidien',
        description: 'Envoyer des tokens à un créateur',
        progress: 0,
        total: 1,
        completed: false,
        difficulty: 'medium',
        reward: {
          type: 'token',
          amount: 2
        }
      }
    ]
  }
];

interface XvushAdvancedFeaturesProps {
  className?: string;
}

const XvushAdvancedFeatures: React.FC<XvushAdvancedFeaturesProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('ml');
  const [userTokens, setUserTokens] = useState(150);
  const [articleMood, setArticleMood] = useState<'energetic' | 'calm' | 'creative' | 'focused'>('calm');
  const { toast } = useToast();
  const { triggerMicroReward, config, updateConfig } = useNeuroAesthetic();
  const { modelState, runAnalysis, isAnalyzing, analysisProgress, applyLatestPrediction } = useNeuroML();
  const { getCognitiveProfile } = useUserBehavior();
  
  const userProfile = getCognitiveProfile();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    triggerMicroReward('tab');
  };
  
  // Handle investment in creator
  const handleInvest = async (creatorId: string, amount: number) => {
    setUserTokens(prev => prev - amount);
    toast({
      title: "Investissement réussi",
      description: `Vous avez investi ${amount} tokens.`,
    });
    return true;
  };
  
  // Handle withdrawal from investment
  const handleWithdraw = async (investmentId: string) => {
    const investment = mockInvestments.find(inv => inv.id === investmentId);
    if (investment) {
      setUserTokens(prev => prev + investment.tokensInvested + investment.returns);
      toast({
        title: "Retrait réussi",
        description: `Vous avez retiré ${investment.tokensInvested + investment.returns} tokens.`,
      });
    }
    return true;
  };
  
  // Handle task completion
  const handleCompleteTask = async (pathId: string, taskId: string) => {
    toast({
      title: "Tâche complétée !",
      description: "Vous avez gagné des récompenses.",
    });
    return true;
  };
  
  // Handle reward claiming
  const handleClaimReward = async (achievementId: string) => {
    toast({
      title: "Récompense réclamée !",
      description: "Votre récompense a été ajoutée à votre compte.",
    });
    return true;
  };
  
  // Toggle article mood for demo
  const cycleArticleMood = () => {
    const moods: Array<'energetic' | 'calm' | 'creative' | 'focused'> = ['energetic', 'calm', 'creative', 'focused'];
    const currentIndex = moods.indexOf(articleMood);
    const nextIndex = (currentIndex + 1) % moods.length;
    setArticleMood(moods[nextIndex]);
    triggerMicroReward('select');
  };
  
  // Run ML analysis with user confirmation
  const handleRunAnalysis = () => {
    toast({
      title: "Analyse NeuroML démarrée",
      description: "Analyse de vos préférences cognitives en cours...",
    });
    runAnalysis();
  };
  
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Fonctionnalités Avancées XDose</CardTitle>
          <CardDescription>
            Explorez les nouvelles fonctionnalités avancées de la plateforme
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="ml" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="ml" className="flex items-center gap-1">
                <Brain className="h-4 w-4" /> 
                <span className="hidden sm:inline">NeuroML</span>
              </TabsTrigger>
              <TabsTrigger value="economy" className="flex items-center gap-1">
                <Coins className="h-4 w-4" />
                <span className="hidden sm:inline">Économie</span>
              </TabsTrigger>
              <TabsTrigger value="progression" className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Progression</span>
              </TabsTrigger>
              <TabsTrigger value="immersive" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Immersif</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ml" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Machine Learning Cognitif
                </h3>
                <Button onClick={handleRunAnalysis} disabled={isAnalyzing}>
                  {isAnalyzing ? `Analyse ${analysisProgress}%` : "Analyser"}
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-blue-500" />
                    Analyse des Comportements
                  </h4>
                  
                  <div className="space-y-3">
                    <p className="text-sm">
                      Notre système de Machine Learning analyse vos interactions pour affiner votre profil cognitif et personnaliser votre expérience.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Engagement</div>
                        <div className="font-medium capitalize">{userProfile.engagementLevel || 'Moyen'}</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Focus</div>
                        <div className="font-medium">{userProfile.focusLevel}/100</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Période active</div>
                        <div className="font-medium capitalize">{userProfile.preferredTimeOfDay || 'Indéterminée'}</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Sessions</div>
                        <div className="font-medium">{Math.round(userProfile.averageSessionDuration || 0)} min</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-500" />
                    Prédictions et Adaptations
                  </h4>
                  
                  {modelState.initialized ? (
                    <div className="space-y-3">
                      <div className="text-sm">
                        Dernière analyse: {new Date(modelState.lastTrainingDate || '').toLocaleString()}
                      </div>
                      
                      {modelState.predictions.length > 0 && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">Profil recommandé</div>
                              <div className="text-sm">
                                <span className="capitalize">{modelState.predictions[0].cognitiveProfile}</span> 
                                <span className="text-muted-foreground ml-1">
                                  ({Math.round(modelState.predictions[0].confidence * 100)}% confiance)
                                </span>
                              </div>
                              <div className="text-sm mt-1">
                                <span className="text-muted-foreground">Ambiance:</span> 
                                <span className="capitalize ml-1">{modelState.predictions[0].suggestedMood}</span>
                              </div>
                            </div>
                            
                            <Button 
                              size="sm" 
                              onClick={applyLatestPrediction}
                              variant="outline"
                            >
                              Appliquer
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Notre système ML a identifié vos préférences cognitives. Appliquez-les pour une expérience personnalisée ou continuez d'affiner avec plus d'interactions.
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <p>Pas encore assez de données pour générer des prédictions.</p>
                      <p className="mt-2">Continuez à utiliser la plateforme ou lancez une analyse manuelle avec vos données actuelles.</p>
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <CognitiveProfilePanel className="border-none shadow-none" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="economy">
              <CreativeEconomy 
                userTokens={userTokens}
                userInvestments={mockInvestments}
                recommendedCreators={mockCreators}
                onInvest={handleInvest}
                onWithdraw={handleWithdraw}
              />
            </TabsContent>
            
            <TabsContent value="progression">
              <ProgressionSystem 
                userPaths={mockProgressionPaths}
                onCompleteTask={handleCompleteTask}
                onClaimReward={handleClaimReward}
              />
            </TabsContent>
            
            <TabsContent value="immersive">
              <Card className="border shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    Expériences Immersives Contextuelles
                  </CardTitle>
                  <CardDescription>
                    L'interface s'adapte automatiquement au contenu que vous consultez
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Exemple d'article</h3>
                    <Button variant="outline" size="sm" onClick={cycleArticleMood}>
                      <span className="capitalize mr-1">{articleMood}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <ImmersiveExperience 
                    contentType="article"
                    contentMood={articleMood}
                    contentTags={['information', 'technology', articleMood]}
                    contentFormat="landscape"
                    contentImportance="medium"
                  >
                    <div className="max-w-3xl mx-auto">
                      <h1 className="text-2xl font-bold mb-4">
                        L'avenir de l'expérience utilisateur adaptative
                      </h1>
                      
                      <div className="flex items-center mb-6 text-sm">
                        <div className="mr-4">Par Marie Innovatrice</div>
                        <div className="text-muted-foreground">12 Mai 2025 · 7 min de lecture</div>
                      </div>
                      
                      <p className="mb-4">
                        L'interface utilisateur adaptative représente la prochaine grande évolution dans la conception d'expériences numériques. Contrairement aux interfaces statiques traditionnelles, les interfaces adaptatives s'ajustent dynamiquement en fonction du contexte, des préférences et des comportements de l'utilisateur.
                      </p>
                      
                      <h2 className="text-xl font-semibold mt-6 mb-3">
                        Personnalisation cognitive
                      </h2>
                      
                      <p className="mb-4">
                        Les interfaces de nouvelle génération analysent la façon dont vous interagissez avec le contenu pour déterminer votre profil cognitif. Êtes-vous un penseur visuel qui préfère les images et les diagrammes ? Ou êtes-vous analytique, préférant des textes détaillés et des données structurées ?
                      </p>
                      
                      <p className="mb-4">
                        En comprenant ces préférences, les systèmes peuvent réorganiser le contenu et ajuster la densité d'information pour maximiser la compréhension et l'engagement.
                      </p>
                      
                      <h2 className="text-xl font-semibold mt-6 mb-3">
                        Adaptation contextuelle
                      </h2>
                      
                      <p className="mb-4">
                        Le contexte joue un rôle crucial dans l'expérience utilisateur. L'heure de la journée, la localisation, la tâche en cours, et même le niveau d'énergie de l'utilisateur influencent la façon dont les informations doivent être présentées.
                      </p>
                      
                      <p className="mb-4">
                        Les interfaces intelligentes peuvent maintenant détecter ces facteurs contextuels et modifier leur apparence, leur ton et leur comportement en conséquence. Par exemple, une interface peut adopter des tons bleus apaisants le soir, tout en réduisant la densité d'information pour faciliter la lecture avant le coucher.
                      </p>
                      
                      <div className="bg-muted/30 p-4 rounded-lg my-6">
                        <h3 className="font-medium mb-2">Points clés</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Les interfaces adaptatives personnalisent l'expérience en fonction du profil cognitif de l'utilisateur</li>
                          <li>L'adaptation contextuelle prend en compte l'environnement et la situation de l'utilisateur</li>
                          <li>L'intelligence artificielle et le machine learning sont essentiels pour analyser les comportements</li>
                          <li>Les micro-ajustements continus améliorent progressivement l'expérience</li>
                        </ul>
                      </div>
                      
                      <p className="mb-4">
                        À mesure que ces technologies se développent, nous pouvons nous attendre à des expériences numériques qui s'adaptent de manière si fluide et naturelle qu'elles sembleront presque lire dans nos pensées, anticipant nos besoins avant même que nous les exprimions.
                      </p>
                      
                      <p className="mb-4">
                        L'avenir des interfaces n'est pas seulement intelligent - il est profondément personnalisé, contextuel et empathique.
                      </p>
                      
                      <div className="flex justify-between mt-8">
                        <Button>Partager</Button>
                        <Button variant="outline">En savoir plus</Button>
                      </div>
                    </div>
                  </ImmersiveExperience>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      <span className="font-medium">Comment ça fonctionne :</span> L'expérience immersive adapte l'interface en fonction du contenu et de vos préférences cognitives.
                    </p>
                    
                    <p>
                      Essayez de changer l'ambiance de l'article avec le bouton en haut à droite, ou activez le mode immersif avec l'icône dans le coin supérieur droit de l'article.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              toast({
                title: "Fonctionnalités en développement",
                description: "De nouvelles fonctionnalités sont en cours de développement et seront bientôt disponibles !",
              });
              triggerMicroReward('opportunity');
            }}
          >
            Nouveautés à venir
          </Button>
          <Button 
            onClick={() => {
              toast({
                title: "Documentation",
                description: "Documentation complète des fonctionnalités avancées ouverte dans un nouvel onglet.",
              });
              triggerMicroReward('navigate');
            }}
          >
            <ScrollText className="h-4 w-4 mr-2" />
            Documentation
          </Button>
        </CardFooter>
      </Card>
      
      {/* Adaptive mood lighting that responds to tab changes */}
      <AdaptiveMoodLighting
        currentMood={
          activeTab === 'ml' ? 'focused' :
          activeTab === 'economy' ? 'energetic' :
          activeTab === 'progression' ? 'creative' : 'calm'
        }
        intensity={40}
        autoAdapt={true}
        className="z-0"
      />
    </div>
  );
};

export default XvushAdvancedFeatures;
