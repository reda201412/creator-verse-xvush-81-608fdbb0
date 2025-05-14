import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CreatorProfileData, VideoSupabaseData, getCreatorVideos } from '@/services/creatorService'; // Assuming VideoSupabaseData is the correct type
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
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [creatorData, setCreatorData] = useState<CreatorProfileData | null>(null);
  const [videos, setVideos] = useState<VideoSupabaseData[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<VideoSupabaseData | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);


  useEffect(() => {
    if (authLoading) return;
    if (user && creatorId === user.id) { // Check against user.id
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [creatorId, user, authLoading]);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!creatorId) return;
      setLoadingProfile(true);
      try {
        // Fetch creator profile data from 'creators' table or 'user_profiles'
        // Assuming 'creators' table has a 'user_id' that matches auth.users.id
        // And 'user_profiles' table has 'id' that matches auth.users.id
        // The creatorId from params should be the user_id (UUID) of the creator
        
        // Try fetching from 'user_profiles' first for general info
        let profileResponse = await supabase
          .from('user_profiles')
          .select(`
            id, 
            username, 
            display_name, 
            avatar_url, 
            bio,
            role
          `)
          .eq('id', creatorId)
          .single();

        if (profileResponse.error && profileResponse.error.code === 'PGRST116') { // Not found in user_profiles
            toast.error("Profil créateur non trouvé.");
            setLoadingProfile(false);
            return;
        } else if (profileResponse.error) {
            throw profileResponse.error;
        }
        
        let fetchedCreatorData: Partial<CreatorProfileData> = {
            id: profileResponse.data.id, // Changed from uid
            username: profileResponse.data.username,
            displayName: profileResponse.data.display_name,
            avatarUrl: profileResponse.data.avatar_url,
            bio: profileResponse.data.bio,
            // role: profileResponse.data.role, // If needed
        };

        // Optionally, fetch additional creator-specific details from 'creators' table if it exists and is structured differently
        // For example, if 'creators' table has specific fields not in 'user_profiles'
        // const { data: specificCreatorData, error: specificCreatorError } = await supabase
        //   .from('creators')
        //   .select('*') // select specific fields
        //   .eq('user_id', creatorId) // Assuming 'creators' table links via 'user_id'
        //   .single();
        // if (specificCreatorData) {
        //   fetchedCreatorData = { ...fetchedCreatorData, ...specificCreatorData };
        // }


        setCreatorData(fetchedCreatorData as CreatorProfileData);

        // Fetch follower count
        const { count, error: countError } = await supabase
          .from('user_follows')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', creatorId);

        if (countError) console.error("Error fetching follower count:", countError);
        else setFollowerCount(count || 0);

        // Check if current user is following this creator
        if (user && user.id) {
          const { data: followData, error: followError } = await supabase
            .from('user_follows')
            .select('*')
            .eq('follower_id', user.id)
            .eq('creator_id', creatorId)
            .maybeSingle();
          if (followError) console.error("Error checking follow status:", followError);
          else setIsFollowing(!!followData);
        }

      } catch (error: any) {
        console.error('Error fetching creator data:', error);
        toast.error("Erreur de chargement du profil: " + error.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchVideosForCreator = async () => {
      if (!creatorId) return;
      setLoadingVideos(true);
      try {
        const creatorVideos = await getCreatorVideos(creatorId);
        setVideos(creatorVideos || []);
      } catch (error: any) {
        console.error('Error fetching videos:', error);
        toast.error("Erreur de chargement des vidéos: " + error.message);
        setVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchCreatorData();
    fetchVideosForCreator();
  }, [creatorId, user]);

  const handleFollow = async () => {
    if (!user || !user.id || !creatorData || !creatorData.id) { // Ensure creatorData.id
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
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('creator_id', creatorData.id); // Ensure creatorData.id
        if (error) throw error;
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
        toast.success(`Vous ne suivez plus ${creatorData.displayName || creatorData.username}.`);
      } else {
        // Follow
        const { error } = await supabase
          .from('user_follows')
          .insert({ follower_id: user.id, creator_id: creatorData.id }); // Ensure creatorData.id
        if (error) throw error;
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast.success(`Vous suivez maintenant ${creatorData.displayName || creatorData.username}!`);
      }
    } catch (error: any) {
      console.error("Error following/unfollowing:", error);
      toast.error("Une erreur s'est produite: " + error.message);
    }
  };
  
  const handleContentClick = (content: VideoSupabaseData) => {
    // Mux Playback ID check
    if (content.mux_playback_id && content.status === 'ready') {
      setSelectedVideo(content);
      setIsPlayerOpen(true);
    } else {
      toast.info("Cette vidéo n'est pas encore prête pour la lecture ou est en cours de traitement.");
    }
  };


  if (loadingProfile || authLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  if (!creatorData) {
    return <div className="container mx-auto p-4 text-center">Profil créateur non trouvé.</div>;
  }
  
  const profileActions = isOwnProfile ? (
    <>
      <Button variant="outline" onClick={() => navigate('/settings')}><Settings className="mr-2 h-4 w-4" />Gérer le Profil</Button>
      <Button onClick={() => navigate('/creator/dashboard')}><BarChart2 className="mr-2 h-4 w-4" />Tableau de Bord</Button>
    </>
  ) : (
    <>
      <Button onClick={handleFollow} variant={isFollowing ? "secondary" : "default"}>
        <UserPlus className="mr-2 h-4 w-4" /> {isFollowing ? 'Suivi' : 'Suivre'}
      </Button>
      <Button variant="outline" onClick={() => navigate(`/secure-messaging`, { state: { recipientId: creatorData.id, recipientName: creatorData.displayName || creatorData.username, recipientAvatar: creatorData.avatarUrl } })}>
        <MessageCircle className="mr-2 h-4 w-4" /> Message
      </Button>
      <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
    </>
  );


  // Adapt ContentGrid items to match expected structure if necessary
  const contentGridItems = videos.map(video => ({
    id: video.id?.toString() || Math.random().toString(), // Ensure ID is string for ContentGrid
    title: video.title || "Vidéo sans titre",
    type: video.type === "teaser" ? "teaser" : video.is_premium ? "premium" : "standard", // Example mapping
    format: video.format as '16:9' | '9:16' | '1:1' || '16:9',
    thumbnailUrl: video.thumbnail_url || undefined,
    // videoUrl: video.mux_playback_id ? `https://stream.mux.com/${video.mux_playback_id}.m3u8` : undefined, // This will be handled by handleContentClick
    data: video, // Pass the original video data for the click handler
    // Removed duration as it's not on VideoSupabaseData
  }));


  return (
    <div className="min-h-screen bg-background text-foreground">
      <CreatorHeader
        avatarUrl={creatorData.avatarUrl || `https://avatar.vercel.sh/${creatorData.username}.png`}
        displayName={creatorData.displayName || creatorData.username || "Créateur"}
        username={creatorData.username || ""}
        bio={creatorData.bio || "Bienvenue sur mon profil !"}
        followerCount={followerCount}
        isFollowing={isFollowing}
        onFollowToggle={handleFollow}
        isOwnProfile={isOwnProfile}
        profileActions={profileActions}
        coverImageUrl={creatorData.coverImageUrl} // Assuming this field exists or is added
      />

      <main className="container mx-auto px-2 sm:px-4 py-6">
        <ProfileNav isOwnProfile={isOwnProfile} creatorId={creatorId!} />

        <Tabs defaultValue="videos" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="videos"><VideoIcon className="mr-2 h-4 w-4"/>Vidéos ({videos.length})</TabsTrigger>
            <TabsTrigger value="photos"><ImageIcon className="mr-2 h-4 w-4"/>Photos</TabsTrigger>
            <TabsTrigger value="audio"><Music2 className="mr-2 h-4 w-4"/>Audio</TabsTrigger>
            <TabsTrigger value="about">À Propos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-6">
            {loadingVideos ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-lg" />)}
              </div>
            ) : videos.length > 0 ? (
              <ContentGrid contents={contentGridItems} layout="masonry" onItemClick={(item) => handleContentClick(item.data as VideoSupabaseData)} />
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

      {selectedVideo && selectedVideo.mux_playback_id && (
        <XteasePlayerModal
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          videoSrc={`https://stream.mux.com/${selectedVideo.mux_playback_id}.m3u8`}
          thumbnailUrl={selectedVideo.thumbnail_url || undefined}
          title={selectedVideo.title || "Vidéo"}
        />
      )}
    </div>
  );
};

export default CreatorProfile;
