import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth } from '@/integrations/firebase/firebase';
import { Spinner } from '@/components/ui/spinner';

const ProfileSettings: React.FC = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Use Firebase auth instead of context 
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Sign out failed",
        variant: "destructive",
        description: "There was a problem signing you out."
      });
    }
  };

  const handleUpdateProfile = async (data: any) => {
    // Implementation will depend on your Firebase setup
  };

  const handleBecomeCreator = async () => {
    // Implementation will depend on your Firebase setup
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={profile?.avatarUrl} alt={profile?.username} />
              <AvatarFallback>{profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{profile?.username}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" defaultValue={profile?.displayName} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input type="text" id="username" defaultValue={profile?.username} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" defaultValue={profile?.email} disabled />
          </div>
          <Button onClick={handleUpdateProfile}>Update Profile</Button>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
          {isLoading && <Spinner size="lg" />}
        </CardContent>
      </Card>
      <Card className="max-w-lg mx-auto mt-6">
        <CardHeader>
          <CardTitle>Creator Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Become a creator to start sharing your content and earning money.
          </p>
          <Button onClick={handleBecomeCreator}>
            {isLoading ? <Spinner size="sm" /> : "Become a Creator"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
