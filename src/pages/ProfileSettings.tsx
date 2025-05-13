
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { updateProfile } from '@/services/userService';
import { UserProfile } from '@/types/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Check, User } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

const ProfileSettings: React.FC = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [isPublicProfile, setIsPublicProfile] = useState(true);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
      });
      setAvatarUrl(profile.avatarUrl || null);
      // Default to true if not defined
      setIsPublicProfile(true);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAvatar(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user) {
        toast("Vous devez être connecté pour enregistrer les modifications.");
        return;
      }

      const updateData: Partial<UserProfile> = {
        displayName: formData.displayName,
        bio: formData.bio,
      };

      if (newAvatar) {
        updateData.avatarUrl = avatarUrl || undefined;
      }

      await updateProfile(user.uid, updateData, newAvatar);

      toast({
        title: "Profil mis à jour avec succès!"
      });
      setIsEditMode(false);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        title: "Erreur lors de la mise à jour du profil",
        description: error.message || "Erreur inconnue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Paramètres du profil</h1>
          <p className="text-muted-foreground">Vous devez être connecté pour voir cette page.</p>
          <Button onClick={() => navigate('/auth')}>Se connecter</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-bold">Paramètres du profil</CardTitle>
          {isEditMode ? (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditMode(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier le profil
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={profile?.displayName || "Avatar"} />
              ) : (
                <AvatarFallback><User/></AvatarFallback>
              )}
            </Avatar>
            {isEditMode && (
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  Changer l'avatar
                </Label>
                <Input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            )}
          </div>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="displayName">Nom d'affichage</Label>
              <Input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                disabled={!isEditMode}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditMode}
              />
            </div>
            {(profile?.role === 'creator' || profile?.role === 'admin') && (
              <div>
                <Label className="text-sm text-muted-foreground">
                  Fonctionnalités de créateur à venir...
                </Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
