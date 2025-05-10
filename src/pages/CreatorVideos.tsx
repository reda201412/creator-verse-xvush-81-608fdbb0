
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
// import { VideoMetadata } from '@/types/video'; // Remplacé par VideoFirestoreData
import VideoHeader from '@/components/creator/videos/VideoHeader';
import VideoFilterTabs from '@/components/creator/videos/VideoFilterTabs';
import VideoGrid from '@/components/creator/videos/VideoGrid';
import VideoSearch from '@/components/creator/videos/VideoSearch';
// import { supabase } from '@/integrations/supabase/client'; // Supprimé
import { useAuth } from '@/contexts/AuthContext';
import VideoAnalyticsModal from '@/components/creator/videos/VideoAnalyticsModal';
import { getCreatorVideos, VideoFirestoreData } from '@/services/creatorService'; // Import depuis le service Firebase
import { doc, deleteDoc } from 'firebase/firestore'; // Import pour la suppression Firestore
import { db } from '@/integrations/firebase/firebase'; // Import de l'instance db Firestore

const CreatorVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoFirestoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch videos from Firestore when component mounts or user changes
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) {
        setLoading(false);
        setVideos([]); // Vide les vidéos si pas d'utilisateur
        return;
      }
      
      setLoading(true);
      try {
        const fetchedVideos = await getCreatorVideos(user.uid); // Utilise le service avec UID Firebase
        console.log("Vidéos récupérées de Firestore:", fetchedVideos);
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos from Firestore:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos vidéos. Veuillez réessayer.",
          variant: "destructive"
        });
        setVideos([]); // S'assurer que videos est un tableau vide en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user, toast]);

  const handleUploadComplete = (metadata: VideoFirestoreData) => {
    // Cette fonction sera probablement appelée après un upload réussi sur MUX
    // et la création du document correspondant dans Firestore.
    // Pour l'instant, on l'ajoute au début de la liste pour un retour visuel.
    setVideos(prev => [metadata, ...prev]);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!videoId) {
        toast({ title: "Erreur", description: "ID de vidéo invalide.", variant: "destructive" });
        return;
    }
    try {
      // Supprimer les métadonnées de la vidéo de Firestore
      const videoRef = doc(db, 'videos', videoId);
      await deleteDoc(videoRef);
      
      setVideos(prev => prev.filter(video => video.id !== videoId));
      
      toast({
        title: "Métadonnées vidéo supprimées",
        description: "Les informations de la vidéo ont été supprimées de la base de données. N'oubliez pas de supprimer le fichier vidéo de MUX si nécessaire.",
      });
    } catch (error) {
      console.error('Error deleting video metadata from Firestore:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les métadonnées de la vidéo. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleEditVideo = (videoId: string) => {
    // Logique pour éditer les métadonnées de la vidéo (ex: ouvrir un formulaire pré-rempli)
    // Les données de la vidéo à éditer peuvent être trouvées dans l'état `videos` en utilisant `videoId`
    console.log("Edit video metadata for ID:", videoId);
    const videoToEdit = videos.find(v => v.id === videoId);
    if (videoToEdit) {
      // Ouvrir un modal/formulaire avec videoToEdit
      toast({ title: "Fonctionnalité à implémenter", description: `Éditer la vidéo : ${videoToEdit.title}`});
    } else {
      toast({ title: "Erreur", description: "Vidéo non trouvée pour l'édition.", variant: "destructive"});
    }
  };

  const handlePromoteVideo = (videoId: string) => {
    // Logique pour promouvoir une vidéo
    console.log("Promote video ID:", videoId);
    toast({ title: "Fonctionnalité à implémenter", description: `Promouvoir la vidéo ID: ${videoId}`});
  };

  const handleAnalyticsVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsAnalyticsModalOpen(true);
    // Les statistiques viendront de votre source de données (MUX ou Firestore)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* onUploadComplete devra être mis à jour pour gérer le flux avec MUX et Firestore */}
      <VideoHeader onUploadComplete={handleUploadComplete} /> 
      
      <div className="mb-6 space-y-4">
        <VideoSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <VideoFilterTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <VideoGrid
        videos={videos} // Doit être compatible avec VideoFirestoreData
        activeTab={activeTab}
        searchQuery={searchQuery}
        onDeleteVideo={handleDeleteVideo}
        onEditVideo={handleEditVideo}
        onPromoteVideo={handlePromoteVideo}
        onAnalyticsVideo={handleAnalyticsVideo}
        // onUploadComplete={handleUploadComplete} // Déjà sur VideoHeader, à clarifier si besoin ici aussi
        isLoading={loading}
      />

      <VideoAnalyticsModal
        videoId={selectedVideoId} // L'ID du document Firestore
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        // Ce modal devra récupérer les stats depuis MUX ou les stats que vous stockez dans Firestore
      />
    </div>
  );
};

export default CreatorVideos;
