
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown, Users, CreditCard, Award, ChevronRight, LineChart, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  growth: number;
  supporters: number;
  returnsHistory: number[];
  returnsRate: number;
  popularity: number;
  tags: string[];
  isRising: boolean;
}

export interface Investment {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  amount: number;
  tokensInvested: number;
  date: string;
  returns: number;
  growth: number;
  status: 'active' | 'completed' | 'pending';
}

interface CreativeEconomyProps {
  userTokens: number;
  userInvestments: Investment[];
  recommendedCreators: Creator[];
  onInvest: (creatorId: string, amount: number) => Promise<boolean>;
  onWithdraw: (investmentId: string) => Promise<boolean>;
  className?: string;
}

const CreativeEconomy: React.FC<CreativeEconomyProps> = ({
  userTokens,
  userInvestments,
  recommendedCreators,
  onInvest,
  onWithdraw,
  className
}) => {
  const [activeTab, setActiveTab] = useState<string>('portfolio');
  const [investAmount, setInvestAmount] = useState<number>(10);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isInvesting, setIsInvesting] = useState<boolean>(false);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const { toast } = useToast();
  const { triggerMicroReward } = useNeuroAesthetic();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    triggerMicroReward('tab');
  };
  
  const handleInvest = async () => {
    if (!selectedCreator) return;
    
    setIsInvesting(true);
    try {
      const success = await onInvest(selectedCreator.id, investAmount);
      if (success) {
        toast({
          title: "Investissement réussi !",
          description: `Vous avez investi ${investAmount} tokens dans ${selectedCreator.name}.`,
          variant: "default",
        });
        triggerMicroReward('opportunity');
        setSelectedCreator(null);
      } else {
        toast({
          title: "Erreur",
          description: "L'investissement n'a pas pu être complété. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'investissement.",
        variant: "destructive",
      });
    } finally {
      setIsInvesting(false);
    }
  };
  
  const handleWithdraw = async (investmentId: string) => {
    setIsWithdrawing(true);
    try {
      const success = await onWithdraw(investmentId);
      if (success) {
        toast({
          title: "Retrait réussi",
          description: "Vos tokens ont été retournés à votre portefeuille.",
          variant: "default",
        });
        triggerMicroReward('goal');
      } else {
        toast({
          title: "Erreur",
          description: "Le retrait n'a pas pu être complété. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du retrait.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };
  
  // Calculate total portfolio value and returns
  const portfolioStats = userInvestments.reduce((stats, investment) => {
    return {
      totalInvested: stats.totalInvested + investment.tokensInvested,
      totalValue: stats.totalValue + investment.tokensInvested + investment.returns,
      totalReturns: stats.totalReturns + investment.returns
    };
  }, { totalInvested: 0, totalValue: 0, totalReturns: 0 });
  
  const portfolioGrowth = portfolioStats.totalInvested > 0 
    ? (portfolioStats.totalReturns / portfolioStats.totalInvested) * 100 
    : 0;
    
  // Filter active investments
  const activeInvestments = userInvestments.filter(inv => inv.status === 'active');
  const completedInvestments = userInvestments.filter(inv => inv.status === 'completed');
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Économie Créative
            </CardTitle>
            <CardDescription>
              Investissez dans les créateurs et partagez leur succès
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Votre solde</div>
            <div className="text-xl font-bold">{userTokens} tokens</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="portfolio" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="discover">Découvrir</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="portfolio" className="space-y-4">
                {activeInvestments.length === 0 ? (
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Aucun investissement actif</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Commencez à investir dans les créateurs pour construire votre portfolio.
                    </p>
                    <Button onClick={() => handleTabChange('discover')}>
                      Découvrir des créateurs
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-muted-foreground text-xs">Total investi</div>
                        <div className="text-xl font-bold">{portfolioStats.totalInvested} tokens</div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-muted-foreground text-xs">Valeur actuelle</div>
                        <div className="text-xl font-bold">{portfolioStats.totalValue.toFixed(1)} tokens</div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-muted-foreground text-xs">Rendement total</div>
                        <div className="flex items-center">
                          {portfolioGrowth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={portfolioGrowth > 0 ? "text-green-500" : "text-red-500"}>
                            {portfolioGrowth.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="text-muted-foreground text-xs">Créateurs soutenus</div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{activeInvestments.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-medium mb-2">Investissements actifs</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {activeInvestments.map(investment => (
                        <div key={investment.id} className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={investment.creatorAvatar} alt={investment.creatorName} />
                                <AvatarFallback>{investment.creatorName.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{investment.creatorName}</div>
                                <div className="text-xs text-muted-foreground">
                                  Investi le {new Date(investment.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={isWithdrawing}
                              onClick={() => handleWithdraw(investment.id)}
                            >
                              Retirer
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Investi:</span>{' '}
                              <span className="font-medium">{investment.tokensInvested} tokens</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Retours:</span>{' '}
                              <span className={investment.returns > 0 ? "text-green-500 font-medium" : "font-medium"}>
                                +{investment.returns.toFixed(1)} tokens
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Croissance:</span>{' '}
                              <span className={investment.growth > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                                {investment.growth > 0 ? '+' : ''}{investment.growth.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {completedInvestments.length > 0 && (
                      <>
                        <h3 className="text-sm font-medium mt-4 mb-2">Investissements terminés</h3>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {completedInvestments.map(investment => (
                            <div key={investment.id} className="bg-muted/20 p-2 rounded-lg text-sm">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={investment.creatorAvatar} alt={investment.creatorName} />
                                    <AvatarFallback>{investment.creatorName.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <span>{investment.creatorName}</span>
                                </div>
                                <div className={investment.returns > 0 ? "text-green-500" : "text-red-500"}>
                                  {investment.returns > 0 ? '+' : ''}{investment.returns.toFixed(1)} tokens
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="discover" className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-1">Découvrez des créateurs talentueux</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Investissez dans les créateurs pour soutenir leur travail et partager leurs revenus futurs.
                  </p>
                </div>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {recommendedCreators.map(creator => (
                    <div key={creator.id} className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={creator.avatar} alt={creator.name} />
                            <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center">
                              {creator.name}
                              {creator.isRising && (
                                <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  En croissance
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {creator.tags.map(tag => (
                                <span key={tag} className="text-xs bg-muted rounded px-1.5 py-0.5">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedCreator(creator);
                            triggerMicroReward('select');
                          }}
                        >
                          Investir
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-muted/30 p-2 rounded-lg">
                          <div className="text-xs text-muted-foreground">Retours</div>
                          <div className="font-medium text-green-500">+{creator.returnsRate}%</div>
                        </div>
                        <div className="bg-muted/30 p-2 rounded-lg">
                          <div className="text-xs text-muted-foreground">Supporters</div>
                          <div className="font-medium">{creator.supporters}</div>
                        </div>
                        <div className="bg-muted/30 p-2 rounded-lg">
                          <div className="text-xs text-muted-foreground">Popularité</div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Award 
                                key={star} 
                                className={`h-3 w-3 ${star <= Math.round(creator.popularity) ? 'text-amber-500' : 'text-muted'}`} 
                                fill={star <= Math.round(creator.popularity) ? 'currentColor' : 'none'} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <LineChart className="h-4 w-4 mr-2" />
                    Performance de vos investissements
                  </h3>
                  
                  {/* Simple mockup of a chart - in real implementation, use recharts */}
                  <div className="h-40 bg-muted/50 rounded-lg flex items-end justify-between p-3 gap-1">
                    {[15, 25, 20, 35, 45, 40, 60, 75, 65, 80].map((height, i) => (
                      <div 
                        key={i} 
                        className="w-full bg-gradient-to-t from-blue-500 to-violet-500 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 mois</span>
                    <span>6 mois</span>
                    <span>1 an</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Meilleur rendement</div>
                    <div className="text-xl font-bold text-green-500">+{Math.max(...userInvestments.map(i => i.growth)).toFixed(1)}%</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Rendement moyen</div>
                    <div className="text-xl font-bold">{portfolioGrowth.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Conseils d'investissement</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span>Diversifiez vos investissements entre plusieurs créateurs.</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span>Les créateurs "En croissance" ont un potentiel de rendement plus élevé.</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span>Réinvestissez régulièrement vos gains pour maximiser vos retours.</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => setActiveTab('portfolio')}>
          Mon portfolio
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            // Show investment guide or tutorial
            toast({
              title: "Guide d'investissement",
              description: "Un guide complet pour comprendre le système d'investissements dans les créateurs.",
            });
            triggerMicroReward('opportunity');
          }}
        >
          Guide d'investissement
        </Button>
      </CardFooter>
      
      {/* Investment modal */}
      <AnimatePresence>
        {selectedCreator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCreator(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card max-w-md w-full rounded-lg shadow-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Investir dans {selectedCreator.name}</h3>
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedCreator.avatar} alt={selectedCreator.name} />
                    <AvatarFallback>{selectedCreator.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-green-500 text-sm font-medium">
                      Rendement moyen: +{selectedCreator.returnsRate}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedCreator.supporters} supporters
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Montant à investir</label>
                      <span className="text-sm">{investAmount} tokens</span>
                    </div>
                    <Slider
                      value={[investAmount]}
                      min={5}
                      max={Math.min(200, userTokens)}
                      step={5}
                      onValueChange={(values) => setInvestAmount(values[0])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5</span>
                      <span>100</span>
                      <span>200</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-sm mb-2">Estimation des retours</div>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Annuel estimé</div>
                        <div className="font-medium text-green-500">
                          +{((investAmount * selectedCreator.returnsRate) / 100).toFixed(1)} tokens
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Taux</div>
                        <div className="font-medium text-green-500">
                          +{selectedCreator.returnsRate}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedCreator(null)}>
                    Annuler
                  </Button>
                  <Button 
                    className="flex-1"
                    disabled={isInvesting || investAmount > userTokens} 
                    onClick={handleInvest}
                  >
                    {isInvesting ? "Traitement..." : "Investir"} 
                  </Button>
                </div>
                
                {investAmount > userTokens && (
                  <div className="text-red-500 text-sm mt-2">
                    Solde insuffisant. Achetez plus de tokens pour investir ce montant.
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground mt-4">
                  Les retours sont estimés et peuvent varier en fonction des performances du créateur. Votre investissement aide directement le créateur et vous donne droit à une part de ses revenus futurs.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CreativeEconomy;
