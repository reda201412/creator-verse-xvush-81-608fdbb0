import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from 'sonner';
import { 
  User, Pencil, Eye, EyeOff, Lock, Bell, Cog, 
  UserPlus, LogOut, Check, Info, Loader2
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Add Spinner component to fix errors
import { Spinner } from '@/components/ui/spinner';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, firebaseSignOut, updateProfile, becomeCreator } = useAuth();
  
  // Fix title props by converting to proper React elements
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Cog className="h-4 w-4" /> }
  ];
  
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const isMobile = useIsMobile();
  
  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        displayName,
        username,
        bio,
        isPublicProfile,
        isOnline
      });
      toast({
        title: "Profil mis à jour!",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBecomeCreator = async () => {
    setPending(true);
    try {
      await becomeCreator();
      toast({
        title: "Statut créateur activé!",
        description: "Votre compte a été mis à niveau vers un compte créateur.",
      });
    } catch (error: any) {
      console.error("Error becoming creator:", error);
      toast({
        title: "Erreur",
        description: "Impossible de devenir créateur. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      navigate('/sign-in');
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
    }
  }, [profile]);
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Paramètres du profil</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="displayName">Nom d'affichage</Label>
                <Input 
                  type="text" 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input 
                  type="text" 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  className="resize-none" 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="publicProfile">Profil public</Label>
                <Switch 
                  id="publicProfile" 
                  checked={isPublicProfile} 
                  onCheckedChange={setIsPublicProfile} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="onlineStatus">Statut en ligne</Label>
                <Switch 
                  id="onlineStatus" 
                  checked={isOnline} 
                  onCheckedChange={setIsOnline} 
                />
              </div>
              
              <Button onClick={handleUpdateProfile} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Mettre à jour le profil
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input type="password" id="password" placeholder="••••••••" disabled />
              </div>
              <Button variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Notifications par e-mail</Label>
                <Switch id="emailNotifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications">Notifications push</Label>
                <Switch id="pushNotifications" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardContent className="space-y-4">
              <div>
                <Label>Thème</Label>
                <ToggleGroup type="single" defaultValue="system">
                  <ToggleGroupItem value="light">Clair</ToggleGroupItem>
                  <ToggleGroupItem value="dark">Sombre</ToggleGroupItem>
                  <ToggleGroupItem value="system">Système</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <Label>Langue</Label>
                <Input type="text" value="Français" disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-between items-center">
        <Button variant="destructive" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
        
        {user && !user.isCreator && (
          <Button onClick={handleBecomeCreator} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                En attente...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Devenir créateur
              </>
            )}
          </Button>
        )}
      </div>
      {/* Replace Spinner usage with our custom component */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      )}
      {/* Replace Spinner usage with our custom component */}
      {pending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Spinner size="lg" />
            <p className="mt-4 text-center">Activation du statut créateur en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
