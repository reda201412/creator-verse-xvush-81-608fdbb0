import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Heart, Share } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ExclusiveContentViewer from '@/components/exclusive/ExclusiveContentViewer';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateSessionKey } from '@/utils/encryption';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { EncryptedContent } from '@/utils/encryption';
import { ensureRequiredRestrictionProps } from '@/utils/exclusive-content-utils';

// Define type for exclusive content
interface ExclusiveContent {
  id: string;
  title: string;
  description: string;
  type: "premium" | "vip" | "standard";
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
  encryption: {
    isEncrypted: boolean;
    accessKey?: string;
    encryptedData?: EncryptedContent;
  };
  restrictions: {
    tier: "fan" | "superfan" | "vip";
    tokenPrice?: number;
    expiresAt?: string;
    viewLimit?: number;
    downloadsAllowed?: boolean;
    sharingAllowed?: boolean;
  }
}

// Exemple de données de contenu exclusif
const mockExclusiveContent: ExclusiveContent[] = [
  {
    id: "ec1",
    title: "Séance photo privée: Sunset Vibes",
    description: "Collection exclusive de photos prises lors d'une séance au coucher du soleil.",
    type: "premium",
    mediaUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&blur=10",
    creator: {
      id: "creator123",
      name: "Sarah K.",
      avatar: "https://avatars.githubusercontent.com/u/124599?v=4"
    },
    stats: {
      likes: 324,
      views: 1250,
      shares: 47,
      comments: 28
    },
    encryption: {
      isEncrypted: true,
      accessKey: "exclusive-123"
    },
    restrictions: {
      tier: "fan",
      tokenPrice: 50,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      viewLimit: 10,
      downloadsAllowed: true,
      sharingAllowed: false
    }
  },
  {
    id: "ec2",
    title: "Behind the scenes: Fashion Week",
    description: "Accédez aux coulisses exclusives de mon shooting lors de la Paris Fashion Week.",
    type: "vip",
    mediaUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&blur=10",
    creator: {
      id: "creator123",
      name: "Sarah K.",
      avatar: "https://avatars.githubusercontent.com/u/124599?v=4"
    },
    stats: {
      likes: 586,
      views: 2140,
      shares: 112,
      comments: 74
    },
    encryption: {
      isEncrypted: true,
      accessKey: "exclusive-456"
    },
    restrictions: {
      tier: "vip",
      tokenPrice: 150,
      viewLimit: 5,
      downloadsAllowed: false,
      sharingAllowed: false
    }
  },
  {
    id: "ec3",
    title: "Tutoriel retouche avancée",
    description: "Apprenez mes techniques professionnelles de retouche photo et vidéo.",
    type: "premium",
    mediaUrl: "https://images.unsplash.com/photo-1542395765-761f1b5f9a55?w=800&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1542395765-761f1b5f9a55?w=800&auto=format&fit=crop&blur=10",
    creator: {
      id: "creator123",
      name: "Sarah K.",
      avatar: "https://avatars.githubusercontent.com/u/124599?v=4"
    },
    stats: {
      likes: 432,
      views: 1870,
      shares: 92,
      comments: 53
    },
    encryption: {
      isEncrypted: false
    },
    restrictions: {
      tier: "superfan",
      tokenPrice: 75,
      downloadsAllowed: true,
      sharingAllowed: true
    }
  }
];

const ExclusiveContent: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('all');
  const [userTier] = useState('fan');
  const [userTokenBalance] = useState(250);
  const { triggerMicroReward } = useNeuroAesthetic();
  
  // Générer les clés de session pour les contenus chiffrés
  const [sessionKeys] = useState(() => {
    const keys: Record<string, string> = {};
    mockExclusiveContent.forEach(content => {
      if (content.encryption?.isEncrypted) {
        keys[content.id] = generateSessionKey();
      }
    });
    return keys;
  });
  
  // Fix the synchronous generateSessionKey function
  const generateSessionKey = (): string => {
    return Array.from(
      { length: 32 },
      () => Math.floor(Math.random() * 36).toString(36)
    ).join('');
  };

  const handleUnlock = () => {
    toast.success("Contenu déverrouillé");
    triggerMicroReward('action');
  };
  
  const handleLike = () => {
    toast.success("Contenu liké");
    triggerMicroReward('action');
  };
  
  const handleComment = () => {
    toast("Fonctionnalité à venir");
    triggerMicroReward('interaction');
  };
  
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="hover:opacity-80">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Contenu Exclusif</h1>
                <p className="text-sm text-muted-foreground">
                  Accédez à du contenu premium et VIP
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock size={14} />
                {userTier.toUpperCase()}
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield size={14} />
                {userTokenBalance} tokens
              </Badge>
            </div>
          </div>
        </header>
        
        <div className="space-y-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
              <TabsTrigger value="vip">VIP</TabsTrigger>
              <TabsTrigger value="favorites">Favoris</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockExclusiveContent.map((content) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExclusiveContentViewer
                      content={content}
                      userTier={userTier}
                      userTokenBalance={userTokenBalance}
                      sessionKey={content.encryption?.isEncrypted ? sessionKeys[content.id] : undefined}
                      onUnlock={handleUnlock}
                      onLike={handleLike}
                      onComment={handleComment}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="premium" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockExclusiveContent
                  .filter(content => content.type === 'premium')
                  .map((content) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ExclusiveContentViewer
                        content={{
                          ...content,
                          restrictions: ensureRequiredRestrictionProps(content.restrictions)
                        }}
                        userTier={userTier}
                        userTokenBalance={userTokenBalance}
                        onUnlock={handleUnlock}
                        onLike={handleLike}
                        onComment={handleComment}
                      />
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="vip" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockExclusiveContent
                  .filter(content => content.type === 'vip')
                  .map((content) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ExclusiveContentViewer
                        content={{
                          ...content,
                          restrictions: ensureRequiredRestrictionProps(content.restrictions)
                        }}
                        userTier={userTier}
                        userTokenBalance={userTokenBalance}
                        onUnlock={handleUnlock}
                        onLike={handleLike}
                        onComment={handleComment}
                      />
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <Heart size={48} className="text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-medium mb-2">Aucun favori</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Vous n'avez pas encore ajouté de contenu exclusif à vos favoris.
                  Explorez notre catalogue et cliquez sur l'icône de cœur pour en ajouter.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveContent;
