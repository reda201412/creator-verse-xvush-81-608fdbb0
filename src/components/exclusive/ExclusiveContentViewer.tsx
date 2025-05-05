
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Unlock, Shield, Eye, Download, Share, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentType } from '@/types/content';
import { encryptMessage, decryptMessage, EncryptedContent } from '@/utils/encryption';
import { useToast } from '@/hooks/use-toast';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

export interface ExclusiveContent {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  mediaUrl: string;
  thumbnailUrl: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  stats: {
    likes: number;
    views: number;
    shares: number;
    comments: number;
  };
  encryption?: {
    isEncrypted: boolean;
    accessKey?: string;
    encryptedData?: EncryptedContent;
  };
  restrictions: {
    tier: 'free' | 'fan' | 'superfan' | 'vip' | 'exclusive';
    tokenPrice?: number;
    expiresAt?: string;
    viewLimit?: number;
    downloadsAllowed: boolean;
    sharingAllowed: boolean;
  };
}

interface ExclusiveContentViewerProps {
  content: ExclusiveContent;
  userTier: string;
  userTokenBalance: number;
  sessionKey?: string;
  onUnlock: () => void;
  onLike: () => void;
  onComment: () => void;
  className?: string;
}

const ExclusiveContentViewer: React.FC<ExclusiveContentViewerProps> = ({
  content,
  userTier,
  userTokenBalance,
  sessionKey,
  onUnlock,
  onLike,
  onComment,
  className
}) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { triggerMicroReward } = useNeuroAesthetic();
  
  // Vérifier si l'utilisateur a accès au contenu
  const canAccess = () => {
    const tierLevels = {
      'free': 0,
      'fan': 1,
      'superfan': 2,
      'vip': 3,
      'exclusive': 4
    };
    
    return tierLevels[userTier as keyof typeof tierLevels] >= 
           tierLevels[content.restrictions.tier as keyof typeof tierLevels];
  };
  
  const hasEnoughTokens = () => {
    return content.restrictions.tokenPrice ? userTokenBalance >= content.restrictions.tokenPrice : true;
  };
  
  const isAccessible = canAccess() || hasEnoughTokens();
  
  // Simuler le chargement et déverrouillage du contenu
  const handleUnlock = async () => {
    if (!isAccessible) return;
    
    setIsUnlocking(true);
    
    // Simuler une progression de chargement
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Si le contenu est chiffré et nous avons une clé de session
        if (content.encryption?.isEncrypted && sessionKey && content.encryption.encryptedData) {
          try {
            const decryptedContent = await decryptMessage(
              content.encryption.encryptedData,
              sessionKey
            );
            setDecryptedUrl(decryptedContent);
          } catch (error) {
            console.error('Erreur de déchiffrement:', error);
            toast({
              title: "Erreur de déchiffrement",
              description: "Impossible de déchiffrer ce contenu.",
              variant: "destructive",
            });
          }
        }
        
        setIsUnlocked(true);
        setIsUnlocking(false);
        onUnlock();
        triggerMicroReward('success');
        
        toast({
          title: "Contenu déverrouillé",
          description: "Profitez de ce contenu exclusif!",
        });
      }
    }, 50);
  };
  
  const handleLike = () => {
    setHasLiked(!hasLiked);
    if (!hasLiked) {
      onLike();
      triggerMicroReward('like');
      toast({
        title: "Vous aimez ce contenu",
        description: "Merci pour votre appréciation!",
      });
    }
  };
  
  // Type de contenu et icône associée
  const getContentTypeDetails = () => {
    switch (content.type) {
      case 'premium':
        return { label: 'Premium', color: 'bg-amber-500', textColor: 'text-amber-500' };
      case 'vip':
        return { label: 'VIP', color: 'bg-purple-500', textColor: 'text-purple-500' };
      default:
        return { label: 'Standard', color: 'bg-primary', textColor: 'text-primary' };
    }
  };
  
  // Format de date relative
  const getRelativeTimeString = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'moins d\'une minute';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`;
    return `${Math.floor(diffInSeconds / 86400)} j`;
  };
  
  const typeDetails = getContentTypeDetails();
  
  return (
    <Card className={className}>
      <CardHeader className="relative px-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <img 
              src={content.creator.avatar} 
              alt={content.creator.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <h3 className="text-sm font-medium">{content.creator.name}</h3>
              <p className="text-xs text-muted-foreground">
                {content.restrictions.expiresAt && 
                  `Expire dans ${getRelativeTimeString(content.restrictions.expiresAt)}`
                }
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className={`flex items-center gap-1 ${typeDetails.textColor}`}>
            <Shield size={12} />
            {typeDetails.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pt-3">
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden aspect-video bg-muted/50">
            {isUnlocked ? (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {content.type === 'standard' || content.type === 'premium' ? (
                    <img 
                      src={decryptedUrl || content.mediaUrl} 
                      alt={content.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video 
                      src={decryptedUrl || content.mediaUrl}
                      poster={content.thumbnailUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img 
                  src={content.thumbnailUrl} 
                  alt={content.title}
                  className="w-full h-full object-cover blur-sm"
                />
                
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
                  {isUnlocking ? (
                    <div className="space-y-2 w-2/3">
                      <p className="text-center text-white text-sm mb-4">Déverrouillage en cours...</p>
                      <Progress value={progress} className="w-full" />
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="bg-black/30 rounded-full p-4 backdrop-blur-sm">
                        <Lock size={32} className="text-white" />
                      </div>
                      <h3 className="text-white font-medium">{content.title}</h3>
                      <p className="text-white/80 text-sm">{content.description}</p>
                      
                      {content.restrictions.tokenPrice ? (
                        <Button
                          onClick={handleUnlock}
                          disabled={!hasEnoughTokens() || isUnlocking}
                          className="mt-2 w-full md:w-auto"
                        >
                          Déverrouiller ({content.restrictions.tokenPrice} tokens)
                        </Button>
                      ) : (
                        <Button
                          onClick={handleUnlock}
                          disabled={!canAccess() || isUnlocking}
                          className="mt-2 w-full md:w-auto"
                        >
                          {canAccess() ? 'Déverrouiller' : 'Abonnement requis'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {isUnlocked && (
            <div className="space-y-2">
              <h3 className="font-medium">{content.title}</h3>
              <p className="text-sm text-muted-foreground">{content.description}</p>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "flex items-center gap-1 px-2",
                      hasLiked && "text-red-500"
                    )}
                    onClick={handleLike}
                  >
                    <Heart size={18} fill={hasLiked ? "currentColor" : "none"} />
                    <span>{hasLiked ? content.stats.likes + 1 : content.stats.likes}</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1 px-2"
                    onClick={onComment}
                  >
                    <Eye size={18} />
                    <span>{content.stats.views}</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-1">
                  {content.restrictions.downloadsAllowed && (
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Download size={18} />
                    </Button>
                  )}
                  
                  {content.restrictions.sharingAllowed && (
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                      <Share size={18} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExclusiveContentViewer;
