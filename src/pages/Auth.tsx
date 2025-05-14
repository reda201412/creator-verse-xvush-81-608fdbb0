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

// Fonction de diagnostic pour tester les étapes d'inscription séparément
const diagnoseSignUp = async (email: string, password: string, username: string, userRole: 'fan' | 'creator') => {
  console.log("=== DIAGNOSTIC DU PROCESSUS D'INSCRIPTION ===");
  let results = {
    emailCheck: false,
    usernameCheck: false,
    authCreation: false,
    metadataUpdate: false,
    profileCreation: false,
    errors: [] as string[]
  };

  try {
    // Étape 1: Vérifier si l'email existe déjà
    const { data: existingEmail, error: emailError } = await supabase.auth.signInWithPassword({
      email, password: 'diagnostic_test_1234567890'
    });
    
    results.emailCheck = !existingEmail.session;
    if (emailError && !emailError.message.includes('Invalid login credentials')) {
      results.errors.push(`Email check error: ${emailError.message}`);
    }

    // Étape 2: Vérifier si le nom d'utilisateur existe déjà
    const { data: existingUser, error: usernameError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();
      
    results.usernameCheck = !existingUser;
    if (usernameError) {
      results.errors.push(`Username check error: ${usernameError.message}`);
    }

    // Étape 3: Test de création d'un utilisateur sans métadonnées (dans un bloc try séparé)
    try {
      const randomEmail = `test_${Date.now()}@test.com`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: randomEmail,
        password: 'Test123456'
      });
      
      results.authCreation = !!authData.user;
      if (authError) {
        results.errors.push(`Auth creation error: ${authError.message}`);
      }
      
      // Si l'utilisateur est créé, nettoyer en le supprimant
      if (authData.user) {
        // ... ici nous pourrions supprimer l'utilisateur de test, mais Supabase ne fournit pas d'API pour cela
      }
    } catch (authTestError: any) {
      results.errors.push(`Auth test error: ${authTestError.message}`);
    }

    // Étape 4: Test l'API de mise à jour des métadonnées
    try {
      // Cette opération nécessite un utilisateur connecté, alors utilisons l'API interne
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const testResult = await fetch(`${supabaseUrl}/rest/v1/user_profiles`, {
        method: 'GET', // Opération sûre pour tester l'accès à l'API
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey as string
        }
      });
      
      results.metadataUpdate = testResult.ok;
      if (!testResult.ok) {
        results.errors.push(`Metadata API error: ${testResult.statusText}`);
      }
    } catch (metadataError: any) {
      results.errors.push(`Metadata test error: ${metadataError.message}`);
    }

    // Étape 5: Test d'insertion dans la table user_profiles
    try {
      const testId = `test_${Date.now()}`;
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: testId,
          username: `test_${Date.now()}`,
          display_name: 'Test User',
          role: 'fan',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      results.profileCreation = !profileError;
      if (profileError) {
        results.errors.push(`Profile creation error: ${profileError.message}`);
      }
      
      // Nettoyer en supprimant le profil de test
      await supabase.from('user_profiles').delete().eq('id', testId);
    } catch (profileError: any) {
      results.errors.push(`Profile test error: ${profileError.message}`);
    }
  } catch (error: any) {
    results.errors.push(`General diagnostic error: ${error.message}`);
  }

  console.log("=== RÉSULTATS DU DIAGNOSTIC ===", results);
  return results;
};

// Fonction alternative d'inscription en cas d'erreur 500
const fallbackSignUp = async (email: string, password: string, username: string, userRole: 'fan' | 'creator') => {
  try {
    // 1. Vérifier si le nom d'utilisateur est déjà pris
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();
      
    if (existingUser) {
      return { error: new Error("Ce nom d'utilisateur est déjà utilisé.") };
    }
    
    // 2. Essayer l'inscription avec un minimum absolu d'options
    const { data, error } = await fetch('https://ryuczcsiiyghdnxanofq.supabase.co/auth/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => res.json());
    
    if (error) return { error };
    
    // 3. Si l'inscription réussit, stocker les infos pour plus tard
    if (data?.user) {
      localStorage.setItem('pendingProfile', JSON.stringify({
        userId: data.user.id,
        username,
        displayName: username,
        role: userRole
      }));
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error in fallbackSignUp:", error);
    return { error: error as Error };
  }
};

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'fan' | 'creator'>('fan');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const { user, signUp, signIn } = useAuth();

  useEffect(() => {
    // Redirection si l'utilisateur est déjà connecté
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !username) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    console.log("Starting signup with role:", userRole);
    setLoading(true);
    try {
      const { error } = await signUp(email, password, username, userRole);
      
      if (error) {
        // Traitement des erreurs
        let errorMessage = "Une erreur est survenue lors de l'inscription.";
        
        // Personnaliser les messages d'erreur en fonction du type d'erreur
        if (error.message?.includes('email-already-in-use')) {
          errorMessage = "Cette adresse e-mail est déjà utilisée.";
        } else if (error.message?.includes('weak-password')) {
          errorMessage = "Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.";
        } else if (error.message?.includes('déjà utilisé')) {
          errorMessage = error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setActiveTab('login');
    } catch (error: any) {
      console.error("Erreur inattendue lors de l'inscription:", error);
      toast.error(error.message || "Une erreur inattendue est survenue lors de l'inscription.");
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
      const { error } = await signIn(email, password);

      if (error) {
        let errorMessage = "Identifiants incorrects ou erreur de connexion.";
        
        // Personnaliser les messages d'erreur en fonction du type d'erreur
        if (error.message?.includes('auth/user-not-found') || error.message?.includes('auth/wrong-password')) {
          errorMessage = "Email ou mot de passe incorrect.";
        } else if (error.message?.includes('auth/network-request-failed') || error.message?.includes('internet')) {
          errorMessage = "Problème de connexion internet. Vérifiez votre connexion et réessayez.";
          // Ajouter un bouton de diagnostic
          toast.error(errorMessage, {
            description: "Le service est inaccessible. Vérifiez votre connexion internet ou utilisez notre outil de diagnostic.",
            action: {
              label: "Diagnostiquer",
              onClick: () => navigate('/network-test')
            },
            duration: 10000
          });
          setLoading(false);
          return;
        } else if (error.message?.includes('auth/too-many-requests')) {
          errorMessage = "Trop de tentatives. Veuillez réessayer plus tard ou réinitialiser votre mot de passe.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      // Connexion réussie
      toast.success("Connexion réussie !");
      navigate('/');
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      
      // Si l'erreur est liée au réseau, proposer le diagnostic
      if (error.message?.includes('network') || error.message?.includes('internet') || 
          error.name === 'TypeError' && error.message.includes('NetworkError')) {
        toast.error("Problème de connexion détecté", {
          description: "Le service est inaccessible. Vérifiez votre connexion internet ou utilisez notre outil de diagnostic.",
          action: {
            label: "Diagnostiquer",
            onClick: () => navigate('/network-test')
          },
          duration: 10000
        });
      } else {
        toast.error(error.message || "Une erreur inattendue est survenue lors de la connexion.");
      }
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
