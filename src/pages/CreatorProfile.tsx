import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/integrations/firebase/firebase';
import { doc, getDoc, collection, query, where, getDocs, getCountFromServer, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { VideoFirestoreData, getCreatorVideos } from '@/services/creatorService';

interface CreatorProfileData {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  role?: string;
}
import CreatorHeader from '@/components/CreatorHeader';
import ProfileNav from '@/components/ProfileNav';
import ContentGrid from '@/components/ContentGrid';
import { Button } from '@/components/ui/button';
import { MessageCircle, UserPlus, Bell, Settings, Edit3, DollarSign, BarChart2, ShieldCheck, Video as VideoIcon, Image as ImageIcon, Music2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import XteasePlayerModal from '@/components/video/XteaseVideoPlayer';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const CreatorProfile: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const { user } = useAuth();
  const authLoading = !user;
  const navigate = useNavigate();

  const [creatorData, setCreatorData] = useState<CreatorProfileData | null>(null);
  const [videos, setVideos] = useState<VideoFirestoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoFirestoreData | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    if (!creatorId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingProfile(true);
        
        // Vérifier si l'utilisateur est connecté
        if (user?.uid) {
          // Vérifier si l'utilisateur visite son propre profil
          if (user.uid === creatorId) {
            setIsOwnProfile(true);
          }
          
          // Vérifier si l'utilisateur suit déjà ce créateur
          const followCheck = query(
            collection(db, 'user_follows'),
            where('follower_id', '==', user.uid),
            where('creator_id', '==', creatorId)
          );
          const followSnapshot = await getDocs(followCheck);
          setIsFollowing(!followSnapshot.empty);
        }
        
        // Charger les données du créateur
        const creatorDoc = await getDoc(doc(db, 'users', creatorId));
        if (creatorDoc.exists()) {
          setCreatorData({ ...creatorDoc.data(), id: creatorDoc.id } as CreatorProfileData);
        } else {
          throw new Error("Créateur non trouvé");
        }
        
        // Charger le nombre d'abonnés
        const followersQuery = query(
          collection(db, 'user_follows'),
          where('creator_id', '==', creatorId)
        );
        const snapshot = await getCountFromServer(followersQuery);
        setFollowerCount(snapshot.data().count);
        
        // Charger les vidéos du créateur
        const creatorVideos = await getCreatorVideos(creatorId);
        setVideos(creatorVideos);
        
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
        setLoadingProfile(false);
      }
    };
    
    fetchData();
  }, [creatorId, user]);

  const handleFollow = async () => {
    if (!user || !user.uid || !creatorData || !creatorData.id) {
      toast.error("Vous devez être connecté pour suivre un créateur.");
      return;
    }
    if (isOwnProfile) {
      toast.info("Vous ne pouvez pas vous suivre vous-même.");
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        const followQuery = query(
          collection(db, 'user_follows'),
          where('follower_id', '==', user.uid),
          where('creator_id', '==', creatorData.id)
        );
        const querySnapshot = await getDocs(followQuery);
        if (!querySnapshot.empty) {
          const batch = writeBatch(db);
          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
        }
        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
        toast.success(`Vous ne suivez plus ${creatorData.displayName || creatorData.username}.`);
      } else {
        // Follow
        const followRef = doc(collection(db, 'user_follows'));
        await setDoc(followRef, {
          id: followRef.id,
          follower_id: user.uid,
          creator_id: creatorData.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast.success(`Vous suivez maintenant ${creatorData.displayName || creatorData.username}!`);
      }
    } catch (error: any) {
      console.error("Error following/unfollowing:", error);
      toast.error("Une erreur s'est produite: " + (error.message || 'Erreur inconnue'));
    }
  };
  
  const handleContentClick = (content: VideoFirestoreData) => {
    // Mux Playback ID check
    if (content.mux_playback_id && content.status === 'ready') {
      setSelectedVideo(content);
      setIsPlayerOpen(true);
    } else {
      toast.info("Cette vidéo n'est pas encore prête pour la lecture ou est en cours de traitement.");
    }
  };


  if (loadingProfile || authLoading) {
  }

  if (!creatorData) {
    return <div className="flex items-center justify-center min-h-screen">Profil non trouvé</div>;
  }
  
  const profileActions = !isOwnProfile ? (
    <button
      onClick={handleFollow}
      className={`px-4 py-2 rounded-full font-medium ${
        isFollowing 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isFollowing ? 'Se désabonner' : "S'abonner"}
    </button>
  ) : null;

  // Adapt ContentGrid items to match expected structure if necessary
  const contentGridItems = videos.map(video => ({
    id: video.id,
    title: video.title || 'Sans titre',
    type: video.type === "teaser" ? "teaser" : video.is_premium ? "premium" : "standard",
    format: (video.format as '16:9' | '9:16' | '1:1') || '16:9',
    thumbnailUrl: video.thumbnail_url || undefined,
    videoData: video, // Store video data in a properly typed property
  }));

  const handleVideoClick = (item: any) => {
    if (item.videoData) {
      handleContentClick(item.videoData);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mb-8">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${creatorData.coverImageUrl || '/default-cover.jpg'})` }}
        ></div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 -mt-12 rounded-full overflow-hidden border-4 border-white dark:border-gray-900">
              <img 
                src={creatorData.avatarUrl || '/default-avatar.png'} 
                alt={creatorData.displayName || creatorData.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{creatorData.displayName || creatorData.username}</h1>
                  <p className="text-gray-600 dark:text-gray-400">@{creatorData.username}</p>
                </div>
                <div className="flex gap-2">
                  {profileActions}
                </div>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {creatorData.bio || 'Aucune biographie disponible'}
              </p>
              <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{followerCount}</span>
                  <span className="text-gray-600 dark:text-gray-400">abonnés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-2 sm:px-4 py-6">
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
        <nav className="flex space-x-8">
          <button 
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              true 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Vidéos
          </button>
          {isOwnProfile && (
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                false 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Statistiques
            </button>
          )}
        </nav>
      </div>

        <Tabs defaultValue="videos" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="videos"><VideoIcon className="mr-2 h-4 w-4"/>Vidéos ({videos.length})</TabsTrigger>
            <TabsTrigger value="photos"><ImageIcon className="mr-2 h-4 w-4"/>Photos</TabsTrigger>
            <TabsTrigger value="audio"><Music2 className="mr-2 h-4 w-4"/>Audio</TabsTrigger>
            <TabsTrigger value="about">À Propos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-6">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : videos.length > 0 ? (
              <ContentGrid 
                contents={contentGridItems} 
                layout="masonry" 
                onItemClick={handleVideoClick} 
              />
            ) : (
              <p className="text-center text-muted-foreground py-8">Ce créateur n'a pas encore publié de vidéos.</p>
            )}
          </TabsContent>
          <TabsContent value="photos" className="mt-6">
            <p className="text-center text-muted-foreground py-8">La section photos arrive bientôt !</p>
          </TabsContent>
          <TabsContent value="audio" className="mt-6">
            <p className="text-center text-muted-foreground py-8">La section audio arrive bientôt !</p>
          </TabsContent>
          <TabsContent value="about" className="mt-6 prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3">À propos de {creatorData.displayName || creatorData.username}</h2>
            <p>{creatorData.bio || "Aucune biographie disponible."}</p>
            {/* Add more sections like stats, links, etc. */}
          </TabsContent>
        </Tabs>
      </main>

      {selectedVideo && (
        <div className={`fixed inset-0 z-50 ${isPlayerOpen ? 'block' : 'hidden'}`}>
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <button 
              onClick={() => setIsPlayerOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              &times;
            </button>
            <div className="w-full max-w-4xl aspect-video">
              <video
                className="w-full h-full"
                controls
                autoPlay
                src={`https://stream.mux.com/${selectedVideo.mux_playback_id}.m3u8`}
                poster={selectedVideo.thumbnail_url}
              >
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProfile;
