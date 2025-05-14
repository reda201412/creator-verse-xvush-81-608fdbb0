import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { auth, db } from '@/integrations/firebase/firebase'; // Removed Firebase
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // Removed Firebase Auth
// import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Removed Firestore

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import GoldenRatioGrid from '@/components/neuro-aesthetic/GoldenRatioGrid';
import AdaptiveMoodLighting from '@/components/neuro-aesthetic/AdaptiveMoodLighting';
import { useAuth } from '@/contexts/AuthContext'; 
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'fan' | 'creator'>('fan');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // Get current user from context

  useEffect(() => {
    // Redirect if the user is already logged in (via context)
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
      // Use Supabase Auth signUp
      // The database trigger 'handle_new_user' will automatically create the profile.
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // Pass username and role so the DB trigger can use them
          data: { 
             username: username, // Use 'username' key for the trigger
             role: userRole,     // Use 'role' key for the trigger
          }
        },
      });

      if (error) {
        console.error("Erreur d'inscription Supabase:", error);
        // Map Supabase errors to user-friendly messages
        let errorMessage = "Une erreur est survenue lors de l'inscription.";
        if (error.message.includes('already registered')) {
          errorMessage = "Cette adresse e-mail est déjà utilisée.";
        } else if (error.message.includes('Password should be')) {
           errorMessage = "Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.";
        } else if (error.message.includes('User already registered')) { // Supabase might return this
           errorMessage = "Cette adresse e-mail est déjà utilisée.";
        }
         else if (error.message) {
           errorMessage = error.message;
        }
        toast.error(errorMessage);
        setLoading(false);
        return; // Stop execution if there's an auth error
      }

      // Check if email confirmation is required (data.user will be null if so)
       if (data && data.user && data.session) { // User signed up and session created (email confirm might be off or auto-confirmed)
           console.log("Inscription réussie et utilisateur créé:", data.user);
            toast.success("Inscription réussie ! Redirection...");
             // Redirection handled by AuthContext listener
       } else if (data && data.user && !data.session) { // User created, email confirmation needed
            console.log("Inscription réussie. Vérification de l'e-mail requise.");
            toast.success("Inscription réussie ! Veuillez vérifier votre e-mail pour confirmer votre compte.");
            setActiveTab('login'); // Suggest login after confirmation
       }
       else { // Fallback for other cases, possibly older Supabase versions or unexpected responses
           console.log("Inscription initiée. Si la confirmation par e-mail est activée, veuillez vérifier votre e-mail.");
            toast.success("Inscription initiée ! Veuillez vérifier votre e-mail si la confirmation est requise.");
            setActiveTab('login');
       }

      setLoading(false);
      // No need to navigate here, AuthContext listener handles it based on auth state
    } catch (error: any) {
      console.error("Une erreur inattendue est survenue pendant l'inscription:", error);
       let errorMessage = "Une erreur inattendue est survenue lors de l'inscription.";
       if (error.message) errorMessage = error.message;
      toast.error(errorMessage);
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
      // Use Supabase Auth signInWithPassword
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erreur de connexion Supabase:", error);
         // Map Supabase errors to user-friendly messages
        let errorMessage = "Identifiants incorrects ou erreur de connexion.";
         if (error.message.includes('Invalid login credentials')) {
             errorMessage = "Adresse e-mail ou mot de passe incorrect.";
         } else if (error.message) {
             errorMessage = error.message;
         }
        toast.error(errorMessage);
         setLoading(false);
         return; // Stop execution if there's an auth error
      }

      toast.success("Connexion réussie ! Redirection...");
      // No need to navigate here, context listener does it

    } catch (error: any) {
      console.error("Une erreur inattendue est survenue pendant la connexion:", error);
       let errorMessage = "Une erreur inattendue est survenue lors de la connexion.";
        if (error.message) errorMessage = error.message;
      toast.error(errorMessage);
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
                    <Label htmlFor="email-login">Email</Label>
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
