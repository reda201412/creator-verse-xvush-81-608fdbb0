import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from '@/integrations/firebase/firebase'; // Importation de Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import GoldenRatioGrid from '@/components/neuro-aesthetic/GoldenRatioGrid';
import { AdaptiveMoodLighting } from '@/components/neuro-aesthetic/AdaptiveMoodLighting';
import { useAuth } from '@/contexts/AuthContext'; // Pour vérifier l'utilisateur actuel si besoin

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'fan' | 'creator'>('fan');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // Récupérer l'utilisateur du contexte pour la redirection
  const { login } = useAuth(); // Get login function from context

  useEffect(() => {
    // Rediriger si l'utilisateur est déjà connecté (via le contexte)
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !username) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Créer un document utilisateur dans Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: username,
        displayName: username, // Ou un champ séparé si vous le souhaitez
        avatarUrl: null, // Peut être mis à jour plus tard
        bio: null, // Peut être mis à jour plus tard
        role: userRole,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit"
      });
      // La redirection sera gérée par AuthContext et App.tsx suite à la mise à jour de l'utilisateur
      // navigate('/'); // Plus besoin de naviguer ici, AuthContext s'en chargera
      setActiveTab('login'); // Optionnel: revenir à l'onglet de connexion
    } catch (error: any) {
      console.error("Erreur d'inscription Firebase:", error);
      const errorCode = error.code;
      let errorMessage = "Une erreur est survenue lors de l'inscription.";
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage = "Cette adresse e-mail est déjà utilisée.";
      } else if (errorCode === 'auth/weak-password') {
        errorMessage = "Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });
        // Update the user state in AuthContext
        login();
      // La redirection sera gérée par AuthContext et App.tsx suite à la mise à jour de l'utilisateur
      // navigate('/'); // Plus besoin de naviguer ici
    } catch (error: any) {
      console.error("Erreur de connexion Firebase:", error);
      const errorCode = error.code;
      let errorMessage = "Identifiants incorrects ou erreur de connexion.";
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        errorMessage = "Adresse e-mail ou mot de passe incorrect.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <GoldenRatioGrid visible={true} opacity={0.05} />
      <AdaptiveMoodLighting currentMood="calm" intensity={50} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-xvush-purple/20 to-xvush-pink/20 z-0" />
      <div className="absolute inset-0 backdrop-blur-3xl z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="backdrop-blur-md bg-background/80 border-muted/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              <span className="text-gradient-primary">XDose</span>
            </CardTitle>
            <CardDescription>
              Rejoignez la communauté créative ou découvrez du contenu exclusif
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="login" className="flex-1">Connexion</TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email-login"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Mot de passe</Label>
                    <Input 
                      id="password-login"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-xvush-pink hover:bg-xvush-pink-dark"
                    disabled={loading}
                  >
                    {loading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input 
                      id="email-signup"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input 
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="votrepseudo"
                      required
                      autoComplete="username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Mot de passe</Label>
                    <Input 
                      id="password-signup"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Choisissez votre rôle</Label>
                    <RadioGroup 
                      defaultValue="fan" 
                      value={userRole}
                      onValueChange={(value) => setUserRole(value as 'fan' | 'creator')}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fan" id="fan" />
                        <Label htmlFor="fan" className="cursor-pointer">Fan / Spectateur</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="creator" id="creator" />
                        <Label htmlFor="creator" className="cursor-pointer">Créateur</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-xvush-pink hover:bg-xvush-pink-dark"
                    disabled={loading}
                  >
                    {loading ? "Inscription en cours..." : "S'inscrire"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <span>
              {activeTab === 'login' 
                ? "Pas encore de compte ? " 
                : "Déjà inscrit ? "
              }
              <button 
                type="button"
                className="text-primary hover:underline"
                onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
              >
                {activeTab === 'login' ? "S'inscrire" : "Se connecter"}
              </button>
            </span>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
