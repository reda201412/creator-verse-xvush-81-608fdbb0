
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Crown, User, LogOut, Camera, CreditCard, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useModals } from '@/hooks/use-modals';
import { fileUploadService } from '@/services/file-upload.service';
import ProfileAvatar from '@/components/ProfileAvatar';
import WalletModal from '@/components/modals/WalletModal';
// import ProfileSettingsModal from '@/components/modals/ProfileSettingsModal'; // Pas utilisé ici

const ProfileSettings = () => {
  const { user, profile, isCreator, firebaseSignOut, updateProfile, becomeCreator } = useAuth(); // Corrigé ici
  const { triggerMicroReward } = useNeuroAesthetic();
  const { openModals, openModal, closeModal } = useModals();
  const navigate = useNavigate();
  
  // Initialiser avec les valeurs de profile si elles existent, sinon chaînes vides ou valeurs par défaut
  const [displayName, setDisplayName] = useState(profile?.displayName || profile?.username || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || ''); // Utiliser avatarUrl
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBecomingCreator, setIsBecomingCreator] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effet pour mettre à jour les champs du formulaire si le profil change (par exemple, après connexion)
  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || profile.username || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatarUrl || '');
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      toast.error("Le nom d'utilisateur est requis");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      await updateProfile({
        username,
        displayName: displayName, // Utiliser displayName du state local
        bio,
        avatarUrl: avatarUrl // Utiliser avatarUrl du state local
      });
      
      triggerMicroReward('like');
      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleBecomeCreator = async () => {
    try {
      setIsBecomingCreator(true);
      await becomeCreator();
      triggerMicroReward('navigate');
      toast.success("Vous êtes maintenant un créateur !");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du passage en mode créateur");
    } finally {
      setIsBecomingCreator(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await firebaseSignOut(); // Corrigé ici
      navigate('/auth');
    } catch (error) {
        toast.error("Erreur lors de la déconnexion.")
        console.error("Sign out error:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = fileUploadService.validateFile(file, {
      maxSizeMB: 5,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
    
    if (!validation.valid) {
      toast.error(validation.error || 'Fichier invalide');
      return;
    }

    try {
      setIsUploading(true);
      const tempUrl = URL.createObjectURL(file);
      setAvatarUrl(tempUrl); // Afficher la preview immédiatement
      
      // TODO: Intégrer le vrai upload vers Firebase Storage ici
      // Exemple:
      // const uploadedUrl = await fileUploadService.uploadAvatarToFirebaseStorage(file, user.uid);
      // await updateProfile({ avatarUrl: uploadedUrl }); // Mettre à jour le profil avec la nouvelle URL
      // setAvatarUrl(uploadedUrl); // Mettre à jour l'état local avec l'URL finale
      
      // Simulation pour l'instant (comme avant, mais avec commentaire)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler délai d'upload
      // Supposons que `fileUploadService.uploadFile` est adapté ou sera remplacé par une logique Firebase Storage
      // const result = await fileUploadService.uploadFile(file, 'avatars');
      // if (result.success) { 
      //   triggerMicroReward('creative');
      //   toast.success("Photo de profil mise à jour (simulation)");
      // } else { /* ... */ }
      toast.success("Photo de profil mise à jour (simulation). Intégrez Firebase Storage.");
      triggerMicroReward('creative');

    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload");
      setAvatarUrl(profile?.avatarUrl || ''); // Revenir à l'URL précédente en cas d'erreur
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSectionClick = (section: string) => {
    switch (section) {
      case 'payment': openModal('wallet'); break;
      case 'security': toast.info('Fonctionnalité de sécurité en cours de développement'); break;
      case 'subscriptions': navigate('/tokens'); break;
      default: toast.info('Cette section est en cours de développement');
    }
  };

  if (!profile && !user) { // Si ni profil ni utilisateur ne sont chargés (initialisation)
    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[300px]">
            <Spinner size="lg" />
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar and role section */}
          <div className="w-full md:w-1/3 space-y-4">
            <Card><CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <ProfileAvatar src={avatarUrl || '/placeholder.svg'} size="xl" status="online" onClick={triggerFileInput} />
                  <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8" onClick={triggerFileInput} disabled={isUploading}>
                    {isUploading ? <Spinner size="sm" /> : <Camera className="h-4 w-4" />}
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </div>
                <h3 className="text-lg font-medium">{displayName || username || 'Utilisateur'}</h3>
                <div className="mt-2">
                  {isCreator ? <Badge variant="outline" className="gap-1 border-pink-500 text-pink-500"><Crown className="h-3 w-3" />Créateur</Badge>
                             : <Badge variant="outline" className="gap-1"><User className="h-3 w-3" />Fan</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-4">{bio || "Pas de bio..."}</p>
                {!isCreator && profile && (
                  <Button onClick={handleBecomeCreator} className="mt-6 w-full bg-xvush-pink hover:bg-xvush-pink-dark gap-2" disabled={isBecomingCreator}>
                    <Crown className="h-4 w-4" />{isBecomingCreator ? "En cours..." : "Devenir créateur"}
                  </Button>
                )}
                <Button onClick={handleSignOut} variant="outline" className="mt-4 w-full gap-2"><LogOut className="h-4 w-4" />Déconnexion</Button>
            </CardContent></Card>
          </div>
          
          {/* Settings tabs */}
          <div className="w-full md:w-2/3">
            <Card><CardHeader><CardTitle>Paramètres du profil</CardTitle><CardDescription>Gérez vos informations personnelles et vos préférences</CardDescription></CardHeader>
              <CardContent>
                <Tabs defaultValue="profile">
                  <TabsList className="w-full mb-6"><TabsTrigger value="profile" className="flex-1">Profil</TabsTrigger><TabsTrigger value="account" className="flex-1">Compte</TabsTrigger><TabsTrigger value="preferences" className="flex-1">Préférences</TabsTrigger></TabsList>
                  <TabsContent value="profile" className="space-y-4">
                    <div><Label htmlFor="username">Nom d'utilisateur</Label><Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="votrepseudo"/></div>
                    <div><Label htmlFor="displayName">Nom d'affichage</Label><Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Votre nom public"/></div>
                    <div><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Parlez-nous de vous..." rows={4}/></div>
                    <div><Label htmlFor="avatarUrl">URL de l'avatar (ou uploadez ci-dessus)</Label><Input id="avatarUrl" value={avatarUrl || ''} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg"/></div>
                    <Button onClick={handleUpdateProfile} disabled={isUpdating}>{isUpdating ? "Mise à jour..." : "Enregistrer"}</Button>
                  </TabsContent>
                  <TabsContent value="account" className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => handleSectionClick('payment')}><div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded-full"><CreditCard className="h-5 w-5 text-primary"/></div><div><h4 className="font-medium">Paiements</h4><p className="text-sm text-muted-foreground">Gérer vos méthodes</p></div></div><Button variant="outline" size="sm">Gérer</Button></div>
                    <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => handleSectionClick('security')}><div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded-full"><Shield className="h-5 w-5 text-primary"/></div><div><h4 className="font-medium">Sécurité</h4><p className="text-sm text-muted-foreground">Mot de passe</p></div></div><Button variant="outline" size="sm">Modifier</Button></div>
                    <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => handleSectionClick('subscriptions')}><div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded-full"><Zap className="h-5 w-5 text-primary"/></div><div><h4 className="font-medium">Abonnements</h4><p className="text-sm text-muted-foreground">Gérer vos abonnements</p></div></div><Button variant="outline" size="sm">Voir</Button></div>
                  </TabsContent>
                  <TabsContent value="preferences"><p className="text-muted-foreground text-center py-6">Préférences bientôt disponibles</p></TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
      <WalletModal open={openModals.wallet} onOpenChange={(open) => open ? openModal('wallet') : closeModal('wallet')} />
    </div>
  );
};

export default ProfileSettings;
