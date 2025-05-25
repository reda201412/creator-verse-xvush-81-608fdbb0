
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Users, Star, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl?: string;
  isPremium: boolean;
  isOnline: boolean;
  metrics: {
    followers: number;
    likes: number;
    rating: number;
  };
}

const Creators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockCreators: Creator[] = [
          {
            id: "c1",
            username: "sophia_creative",
            displayName: "Sophia Creative",
            bio: "Artiste numérique explorant les frontières entre réalité et imagination.",
            avatarUrl: "https://i.pravatar.cc/300?img=1",
            coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
            isPremium: true,
            isOnline: true,
            metrics: {
              followers: 12400,
              likes: 85600,
              rating: 4.8
            }
          },
          {
            id: "c2",
            username: "mark_the_mentor",
            displayName: "Mark The Mentor",
            bio: "Guide la nouvelle génération de développeurs avec des conseils pratiques.",
            avatarUrl: "https://i.pravatar.cc/300?img=2",
            isPremium: false,
            isOnline: false,
            metrics: {
              followers: 8900,
              likes: 52300,
              rating: 4.5
            }
          },
          {
            id: "c3",
            username: "lisa_the_linguist",
            displayName: "Lisa The Linguist",
            bio: "Partage la beauté des langues et cultures du monde entier.",
            avatarUrl: "https://i.pravatar.cc/300?img=3",
            isPremium: true,
            isOnline: true,
            metrics: {
              followers: 15600,
              likes: 91200,
              rating: 4.9
            }
          },
          {
            id: "c4",
            username: "eco_activist_emma",
            displayName: "Eco Activist Emma",
            bio: "Passionnée de durabilité et d'inspiration pour un mode de vie écologique.",
            avatarUrl: "https://i.pravatar.cc/300?img=4",
            isPremium: false,
            isOnline: false,
            metrics: {
              followers: 7200,
              likes: 41800,
              rating: 4.3
            }
          },
          {
            id: "c5",
            username: "fitness_with_frank",
            displayName: "Fitness With Frank",
            bio: "Vous aide à atteindre vos objectifs fitness avec des routines amusantes.",
            avatarUrl: "https://i.pravatar.cc/300?img=5",
            isPremium: true,
            isOnline: true,
            metrics: {
              followers: 11100,
              likes: 68900,
              rating: 4.7
            }
          }
        ];
        
        setCreators(mockCreators);
      } catch (error) {
        console.error("Error fetching creators:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les créateurs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCreators();
  }, [toast]);

  const filteredCreators = creators.filter(creator =>
    creator.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 70 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Découvrez les Créateurs
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explorez et connectez-vous avec des créateurs talentueux qui partagent leur passion et leur créativité.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher des créateurs par nom, username ou bio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg border-0 bg-white/50 dark:bg-gray-800/50"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="text-center backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-0 shadow-xl">
            <CardContent className="p-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="text-2xl font-bold">{creators.length}</h3>
              <p className="text-muted-foreground">Créateurs actifs</p>
            </CardContent>
          </Card>
          <Card className="text-center backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-0 shadow-xl">
            <CardContent className="p-6">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <h3 className="text-2xl font-bold">{creators.filter(c => c.isPremium).length}</h3>
              <p className="text-muted-foreground">Créateurs Premium</p>
            </CardContent>
          </Card>
          <Card className="text-center backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-0 shadow-xl">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="text-2xl font-bold">{creators.filter(c => c.isOnline).length}</h3>
              <p className="text-muted-foreground">En ligne maintenant</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Creators Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCreators.map((creator) => (
              <motion.div key={creator.id} variants={itemVariants}>
                <Link to={`/creator-profile?id=${creator.id}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-0 shadow-xl hover:scale-105">
                    {/* Cover Image */}
                    <div className="relative h-32 bg-gradient-to-r from-purple-400 to-blue-400 overflow-hidden">
                      {creator.coverImageUrl && (
                        <img 
                          src={creator.coverImageUrl} 
                          alt="Cover" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Status indicators */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {creator.isPremium && (
                          <Badge className="bg-yellow-500 text-black">
                            <Star className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {creator.isOnline && (
                          <Badge className="bg-green-500">
                            En ligne
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-6 relative">
                      {/* Avatar */}
                      <div className="absolute -top-8 left-6">
                        <Avatar className="h-16 w-16 border-4 border-white dark:border-gray-800 shadow-lg">
                          <AvatarImage src={creator.avatarUrl} alt={creator.displayName} />
                          <AvatarFallback>{creator.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="mt-10">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{creator.displayName}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {creator.metrics.rating}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-2">@{creator.username}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {creator.bio}
                        </p>

                        {/* Metrics */}
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {creator.metrics.followers.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {creator.metrics.likes.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredCreators.length === 0 && !loading && searchTerm && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-muted-foreground">
              Aucun créateur trouvé pour "{searchTerm}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Creators;
