import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, signIn, user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [intensityLevel, setIntensityLevel] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      const redirectUrl = searchParams.get('redirect') || '/';
      navigate(redirectUrl, { replace: true });
    }
  }, [user, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        const newUser = await signUp(email, password);
        if (newUser && newUser.user) {
          await updateProfile(newUser.user, {
            displayName: displayName,
            username: username,
            avatarUrl: avatarUrl,
          });
          toast({
            title: 'Inscription réussie !',
            description: 'Bienvenue à bord !',
          });
        } else {
          toast({
            title: 'Erreur d\'inscription',
            description: 'Impossible de créer le compte.',
            variant: 'destructive',
          });
        }
      } else {
        await signIn(email, password);
        toast({
          title: 'Connexion réussie !',
          description: 'Heureux de vous revoir !',
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: isSignUp ? 'Erreur d\'inscription' : 'Erreur de connexion',
        description: error.message || 'Une erreur est survenue.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentIntensityLevel = intensityLevel !== null ? intensityLevel : profile?.intensityLevel || 5;
  const adaptiveIntensity = currentIntensityLevel > 6 ? 'high' as const : currentIntensityLevel > 3 ? 'medium' as const : 'low' as const;

  if (user) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">
            {isSignUp ? 'Créer un compte' : 'Se connecter'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? 'Rejoignez notre communauté !' : 'Entrez vos identifiants pour accéder à votre compte.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {isSignUp && (
                <>
                  <div className="grid gap-1">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="displayName">Nom affiché</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Nom affiché"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="avatarUrl">URL de l'avatar</Label>
                    <Input
                      id="avatarUrl"
                      type="url"
                      placeholder="URL de l'avatar"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                  </div>
                </>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                {isSignUp ? 'Créer un compte' : 'Se connecter'}
              </Button>
            </div>
          </form>
          <div className="text-center">
            <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Vous avez déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
