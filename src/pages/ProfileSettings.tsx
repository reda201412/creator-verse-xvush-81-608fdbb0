
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
import ProfileSettingsModal from '@/components/modals/ProfileSettingsModal';

const ProfileSettings = () => {
  const { user, profile, isCreator, signOut, updateProfile, becomeCreator } = useAuth();
  const { triggerMicroReward } = useNeuroAesthetic();
  const { openModals, openModal, closeModal } = useModals();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBecomingCreator, setIsBecomingCreator] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      toast.error("Le nom d'utilisateur est requis");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      await updateProfile({
        username,
        display_name: displayName,
        bio,
        avatar_url: avatarUrl
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
    await signOut();
    navigate('/auth');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valider le fichier
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
      
      // Créer une URL temporaire pour prévisualiser l'image immédiatement
      const tempUrl = URL.createObjectURL(file);
      setAvatarUrl(tempUrl);
      
      // Simuler l'upload
      const result = await fileUploadService.uploadFile(file, 'avatars');
      
      if (result.success) {
        // Dans une implémentation réelle, nous utiliserions l'URL retournée par le service
        // Pour l'instant, nous gardons l'URL temporaire
        triggerMicroReward('creative');
        toast.success("Photo de profil mise à jour");
      } else {
        toast.error(result.error || "Erreur lors de l'upload");
        // Restaurer l'avatar précédent en cas d'erreur
        setAvatarUrl(profile?.avatar_url || '');
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload");
      setAvatarUrl(profile?.avatar_url || '');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSectionClick = (section: string) => {
    switch (section) {
      case 'payment':
        openModal('wallet');
        break;
      case 'security':
        toast.info('Fonctionnalité de sécurité en cours de développement');
        break;
      case 'subscriptions':
        navigate('/tokens');
        break;
      default:
        toast.info('Cette section est en cours de développement');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar and role section */}
          <div className="w-full md:w-1/3 space-y-4">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <ProfileAvatar 
                    src={avatarUrl || '/placeholder.svg'} 
                    size="xl" 
                    status="online" 
                    onClick={triggerFileInput}
                  />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={triggerFileInput}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                
                <h3 className="text-lg font-medium">{displayName || username}</h3>
                
                <div className="mt-2">
                  {isCreator ? (
                    <Badge variant="outline" className="gap-1 border-pink-500 text-pink-500">
                      <Crown className="h-3 w-3" />
                      Créateur
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <User className="h-3 w-3" />
                      Fan
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  {bio || "Pas de bio..."}
                </p>
                
                {!isCreator && (
                  <Button
                    onClick={handleBecomeCreator}
                    className="mt-6 w-full bg-xvush-pink hover:bg-xvush-pink-dark gap-2"
                    disabled={isBecomingCreator}
                  >
                    <Crown className="h-4 w-4" />
                    {isBecomingCreator ? "En cours..." : "Devenir créateur"}
                  </Button>
                )}
                
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="mt-4 w-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Settings tabs */}
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et vos préférences
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="profile">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="profile" className="flex-1">Profil</TabsTrigger>
                    <TabsTrigger value="account" className="flex-1">Compte</TabsTrigger>
                    <TabsTrigger value="preferences" className="flex-1">Préférences</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="space-y-4">
                    <div>
                      <Label htmlFor="username">Nom d'utilisateur</Label>
                      <Input 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="votrepseudo"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="displayName">Nom d'affichage</Label>
                      <Input 
                        id="displayName" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Votre nom public"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Parlez-nous de vous..."
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="avatarUrl">URL de l'avatar</Label>
                      <Input 
                        id="avatarUrl" 
                        value={avatarUrl || ''} 
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Mise à jour..." : "Enregistrer les modifications"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="account">
                    <div className="space-y-4">
                      <div 
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSectionClick('payment')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Méthodes de paiement</h4>
                            <p className="text-sm text-muted-foreground">Gérer vos cartes et méthodes de paiement</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Gérer</Button>
                      </div>
                      
                      <div 
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSectionClick('security')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Shield className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Sécurité</h4>
                            <p className="text-sm text-muted-foreground">Mot de passe et authentification</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </div>
                      
                      <div 
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSectionClick('subscriptions')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Abonnements</h4>
                            <p className="text-sm text-muted-foreground">Gérer vos abonnements actifs</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Voir</Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preferences">
                    <p className="text-muted-foreground text-center py-6">
                      Les préférences seront disponibles prochainement
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <WalletModal 
        open={openModals.wallet}
        onOpenChange={(open) => open ? openModal('wallet') : closeModal('wallet')}
      />
    </div>
  );
};

export default ProfileSettings;
