
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { 
  Trophy, Star, Compass, Lightbulb, Heart, 
  BookOpen, CheckCircle2, PlusCircle, Sparkles, 
  Zap, Layers, ArrowUpRight, Award
} from 'lucide-react';

// Types for the progression system
export interface PathProgress {
  id: string;
  name: string;
  description: string;
  icon: 'creator' | 'explorer' | 'curator' | 'supporter' | 'analyst';
  level: number;
  maxLevel: number;
  experience: number;
  experienceToNextLevel: number;
  badges: Badge[];
  achievements: Achievement[];
  tasks: Task[];
  primaryColor: string;
  unlocked: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  reward?: Reward;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  reward?: Reward;
  expiresAt?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Reward {
  type: 'token' | 'badge' | 'experience' | 'unlock';
  amount?: number;
  itemId?: string;
  itemName?: string;
}

// Primary component props
interface ProgressionSystemProps {
  userPaths: PathProgress[];
  onCompleteTask: (pathId: string, taskId: string) => Promise<boolean>;
  onClaimReward: (achievementId: string) => Promise<boolean>;
  onSelectPath?: (pathId: string) => void;
  className?: string;
}

const ProgressionSystem: React.FC<ProgressionSystemProps> = ({
  userPaths,
  onCompleteTask,
  onClaimReward,
  onSelectPath,
  className
}) => {
  const [activeTab, setActiveTab] = useState<string>('paths');
  const [selectedPath, setSelectedPath] = useState<PathProgress | null>(null);
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const { toast } = useToast();
  const { triggerMicroReward } = useNeuroAesthetic();
  
  useEffect(() => {
    // Set the first path as the selected path if none is selected
    if (userPaths.length > 0 && !selectedPath) {
      setSelectedPath(userPaths[0]);
    }
  }, [userPaths, selectedPath]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    triggerMicroReward('tab');
  };
  
  const handlePathSelect = (path: PathProgress) => {
    setSelectedPath(path);
    if (onSelectPath) {
      onSelectPath(path.id);
    }
    triggerMicroReward('select');
  };
  
  const handleClaimReward = async (achievementId: string) => {
    setClaimingReward(achievementId);
    try {
      const success = await onClaimReward(achievementId);
      if (success) {
        toast({
          title: "Récompense obtenue !",
          description: "Votre récompense a été ajoutée à votre compte.",
        });
        triggerMicroReward('goal');
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de réclamer la récompense. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réclamation.",
        variant: "destructive",
      });
    } finally {
      setClaimingReward(null);
    }
  };
  
  const handleCompleteTask = async (pathId: string, taskId: string) => {
    setCompletingTask(taskId);
    try {
      const success = await onCompleteTask(pathId, taskId);
      if (success) {
        toast({
          title: "Tâche complétée !",
          description: "Félicitations pour votre progression !",
        });
        triggerMicroReward('goal');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la completion de la tâche.",
        variant: "destructive",
      });
    } finally {
      setCompletingTask(null);
    }
  };
  
  // Get path icon
  const getPathIcon = (iconName: string) => {
    switch (iconName) {
      case 'creator': return <Star className="h-full w-full" />;
      case 'explorer': return <Compass className="h-full w-full" />;
      case 'curator': return <BookOpen className="h-full w-full" />;
      case 'supporter': return <Heart className="h-full w-full" />;
      case 'analyst': return <Lightbulb className="h-full w-full" />;
      default: return <Star className="h-full w-full" />;
    }
  };
  
  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-200 text-slate-800';
      case 'uncommon': return 'bg-green-200 text-green-800';
      case 'rare': return 'bg-blue-200 text-blue-800';
      case 'epic': return 'bg-purple-200 text-purple-800';
      case 'legendary': return 'bg-amber-200 text-amber-800';
      default: return 'bg-slate-200 text-slate-800';
    }
  };
  
  // Count total badges across all paths
  const totalBadges = userPaths.reduce((sum, path) => sum + path.badges.filter(b => b.unlocked).length, 0);
  const totalUnlockedBadges = userPaths.reduce((sum, path) => sum + path.badges.length, 0);
  
  // Count total achievements completed
  const totalCompletedAchievements = userPaths.reduce(
    (sum, path) => sum + path.achievements.filter(a => a.completed).length, 
    0
  );
  const totalAchievements = userPaths.reduce((sum, path) => sum + path.achievements.length, 0);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Système de Progression
        </CardTitle>
        <CardDescription>
          Explorez différents chemins et déverrouillez des récompenses
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="paths" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="paths">Chemins</TabsTrigger>
            <TabsTrigger value="achievements">Réalisations</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="paths" className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {userPaths.map(path => (
                    <div 
                      key={path.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedPath?.id === path.id 
                          ? `bg-${path.primaryColor}-100 border border-${path.primaryColor}-300` 
                          : 'bg-muted/30'
                      }`}
                      onClick={() => handlePathSelect(path)}
                    >
                      <div className="flex items-center">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white bg-${path.primaryColor}-500`}
                        >
                          {getPathIcon(path.icon)}
                        </div>
                        <div>
                          <div className="font-medium">{path.name}</div>
                          <div className="text-xs text-muted-foreground">Niveau {path.level}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedPath && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end mb-1">
                      <div>
                        <h3 className="text-lg font-medium">{selectedPath.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedPath.description}</p>
                      </div>
                      <Badge className={`bg-${selectedPath.primaryColor}-100 text-${selectedPath.primaryColor}-800 border-${selectedPath.primaryColor}-200`}>
                        Niveau {selectedPath.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>
                          {selectedPath.experience}/{selectedPath.experienceToNextLevel} XP
                        </span>
                      </div>
                      <Progress 
                        value={(selectedPath.experience / selectedPath.experienceToNextLevel) * 100} 
                        className={`h-2 bg-muted [&>div]:bg-${selectedPath.primaryColor}-500`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-muted/30 p-3 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">Badges</div>
                        <div className="text-lg font-medium">
                          {selectedPath.badges.filter(b => b.unlocked).length}/{selectedPath.badges.length}
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">Réalisations</div>
                        <div className="text-lg font-medium">
                          {selectedPath.achievements.filter(a => a.completed).length}/{selectedPath.achievements.length}
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">Tâches</div>
                        <div className="text-lg font-medium">
                          {selectedPath.tasks.filter(t => t.completed).length}/{selectedPath.tasks.length}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Prochaines réalisations</h4>
                      {selectedPath.achievements
                        .filter(a => !a.completed)
                        .slice(0, 3)
                        .map(achievement => (
                          <div key={achievement.id} className="bg-muted/30 p-3 rounded-lg">
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">{achievement.name}</div>
                              <div className="text-sm">{achievement.progress}/{achievement.total}</div>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.total) * 100} 
                              className="h-1.5 bg-muted [&>div]:bg-blue-500"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {achievement.description}
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Tâches actives</h4>
                      {selectedPath.tasks
                        .filter(t => !t.completed)
                        .slice(0, 3)
                        .map(task => (
                          <div key={task.id} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-1">
                                <div className="text-sm font-medium">{task.name}</div>
                                {task.difficulty === 'easy' && <Badge variant="outline" className="text-xs">Facile</Badge>}
                                {task.difficulty === 'medium' && <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200">Moyen</Badge>}
                                {task.difficulty === 'hard' && <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">Difficile</Badge>}
                              </div>
                              <Progress 
                                value={(task.progress / task.total) * 100} 
                                className="h-1.5 mt-1 mb-1 bg-muted [&>div]:bg-green-500"
                              />
                              <div className="text-xs text-muted-foreground">{task.progress}/{task.total} complété</div>
                            </div>
                            {task.progress >= task.total && !task.completed && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="ml-2"
                                disabled={!!completingTask}
                                onClick={() => handleCompleteTask(selectedPath.id, task.id)}
                              >
                                {completingTask === task.id ? "..." : "Compléter"}
                              </Button>
                            )}
                          </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        className={`text-${selectedPath.primaryColor}-500 border-${selectedPath.primaryColor}-500/50`}
                        onClick={() => {
                          setActiveTab('tasks');
                          triggerMicroReward('navigate');
                        }}
                      >
                        Voir toutes les tâches
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="achievements" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Réalisations
                  </h3>
                  <Badge variant="outline" className="bg-blue-50">
                    {totalCompletedAchievements}/{totalAchievements} Complétées
                  </Badge>
                </div>
                
                {userPaths.map(path => (
                  <div key={path.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white bg-${path.primaryColor}-500`}
                      >
                        {getPathIcon(path.icon)}
                      </div>
                      <h4 className="font-medium">{path.name}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      {path.achievements.map(achievement => (
                        <div 
                          key={achievement.id} 
                          className={`p-3 rounded-lg ${
                            achievement.completed 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-muted/30'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{achievement.name}</span>
                                {achievement.completed && (
                                  <CheckCircle2 className="h-4 w-4 ml-1 text-green-500" />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {achievement.description}
                              </div>
                            </div>
                            
                            {achievement.completed && achievement.reward && (
                              <Button 
                                size="sm" 
                                disabled={!!claimingReward}
                                onClick={() => handleClaimReward(achievement.id)}
                              >
                                {claimingReward === achievement.id ? "..." : "Réclamer"}
                              </Button>
                            )}
                          </div>
                          
                          {!achievement.completed && (
                            <>
                              <div className="flex justify-between text-xs mt-2 mb-1">
                                <span>Progression</span>
                                <span>{achievement.progress}/{achievement.total}</span>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.total) * 100} 
                                className="h-1.5 bg-muted [&>div]:bg-blue-500"
                              />
                            </>
                          )}
                          
                          {achievement.reward && (
                            <div className="flex items-center mt-2 text-xs">
                              <span className="text-muted-foreground mr-1">Récompense:</span>
                              {achievement.reward.type === 'token' && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                                  {achievement.reward.amount} tokens
                                </Badge>
                              )}
                              {achievement.reward.type === 'badge' && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                                  Badge: {achievement.reward.itemName}
                                </Badge>
                              )}
                              {achievement.reward.type === 'experience' && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                  {achievement.reward.amount} XP
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-3" />
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="badges" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Badges
                  </h3>
                  <Badge variant="outline" className="bg-blue-50">
                    {totalBadges}/{totalUnlockedBadges} Débloqués
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                  {userPaths.flatMap(path => 
                    path.badges.map(badge => (
                      <div 
                        key={badge.id} 
                        className={`p-3 rounded-lg text-center flex flex-col items-center ${
                          badge.unlocked 
                            ? getRarityColor(badge.rarity) 
                            : 'bg-muted/30 opacity-60'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center mb-2">
                          {badge.unlocked ? (
                            <span className="text-2xl">{badge.icon}</span>
                          ) : (
                            <Layers className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="text-sm font-medium line-clamp-1">{badge.name}</div>
                        <div className="text-xs mt-1 line-clamp-2">{badge.description}</div>
                        <Badge 
                          variant="outline" 
                          className={`mt-2 text-xs capitalize ${
                            badge.unlocked 
                              ? getRarityColor(badge.rarity) 
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {badge.rarity}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Tâches quotidiennes
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Défis personnalisés",
                        description: "Bientôt disponible : créez vos propres défis pour progresser !",
                      });
                      triggerMicroReward('opportunity');
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Créer un défi
                  </Button>
                </div>
                
                {selectedPath ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white bg-${selectedPath.primaryColor}-500`}
                      >
                        {getPathIcon(selectedPath.icon)}
                      </div>
                      <h4 className="font-medium">{selectedPath.name}</h4>
                    </div>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto p-1">
                      {selectedPath.tasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`p-3 rounded-lg ${
                            task.completed 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-muted/30'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{task.name}</span>
                                {task.difficulty === 'easy' && <Badge variant="outline" className="text-xs">Facile</Badge>}
                                {task.difficulty === 'medium' && <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200">Moyen</Badge>}
                                {task.difficulty === 'hard' && <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">Difficile</Badge>}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {task.description}
                              </div>
                            </div>
                            
                            {task.progress >= task.total && !task.completed && (
                              <Button 
                                size="sm" 
                                disabled={!!completingTask}
                                onClick={() => handleCompleteTask(selectedPath.id, task.id)}
                              >
                                {completingTask === task.id ? "..." : "Compléter"}
                              </Button>
                            )}
                            
                            {task.completed && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          
                          {!task.completed && (
                            <>
                              <div className="flex justify-between text-xs mt-2 mb-1">
                                <span>Progression</span>
                                <span>{task.progress}/{task.total}</span>
                              </div>
                              <Progress 
                                value={(task.progress / task.total) * 100} 
                                className={`h-1.5 bg-muted [&>div]:bg-${
                                  task.difficulty === 'easy' 
                                    ? 'green' 
                                    : task.difficulty === 'medium' 
                                      ? 'amber' 
                                      : 'red'
                                }-500`}
                              />
                            </>
                          )}
                          
                          {task.expiresAt && !task.completed && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Expire le: {new Date(task.expiresAt).toLocaleDateString()}
                            </div>
                          )}
                          
                          {task.reward && (
                            <div className="flex items-center mt-2 text-xs">
                              <span className="text-muted-foreground mr-1">Récompense:</span>
                              {task.reward.type === 'token' && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                                  {task.reward.amount} tokens
                                </Badge>
                              )}
                              {task.reward.type === 'experience' && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                  {task.reward.amount} XP
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <Compass className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Sélectionnez un chemin</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choisissez un chemin de progression pour voir ses tâches associées.
                    </p>
                    <Button onClick={() => handleTabChange('paths')}>
                      Voir les chemins
                    </Button>
                  </div>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            // Switch to paths tab
            setActiveTab('paths');
          }}
        >
          <Compass className="h-4 w-4 mr-1" />
          Chemins
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            toast({
              title: "Conseil de progression",
              description: "Concentrez-vous sur un chemin à la fois pour progresser plus rapidement !",
            });
            triggerMicroReward('insight');
          }}
        >
          <Lightbulb className="h-4 w-4 mr-1" />
          Conseils
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgressionSystem;
