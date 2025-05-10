
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { DesktopSidebar as Sidebar } from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import CreatorProfile from '@/pages/CreatorProfile';
import CreatorsFeed from '@/pages/CreatorsFeed';
import Dashboard from '@/pages/Dashboard';
import Messages from '@/pages/Messages';
import CreatorVideos from '@/pages/CreatorVideos';
import ExclusiveContent from '@/pages/ExclusiveContent';
import TokensPage from '@/pages/TokensPage';
import CreatorRevenueDashboard from '@/pages/CreatorRevenueDashboard';
import SubscribersManagement from '@/pages/SubscribersManagement';
import CalendarView from '@/pages/CalendarView';
import ProfileSettings from '@/pages/ProfileSettings';
import NotFound from '@/pages/NotFound';
import TrendingContent from '@/pages/TrendingContent';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import XvushDesignSystem from '@/components/XvushDesignSystem';
import SecureMessagingPage from '@/pages/SecureMessaging';
import './App.css';
import { Spinner } from '@/components/ui/spinner'; // S'assurer que Spinner est importé

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, profile } = useAuth(); // Utiliser user, isLoading, profile
  console.log("ProtectedRoute: Checking access. isLoading:", isLoading, "User UID:", user?.uid, "Profile role:", profile?.role);

  if (isLoading) {
    console.log("ProtectedRoute: Still loading authentication state...");
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <Spinner size="lg" />
        <p className="ml-4 text-lg">Chargement de votre session...</p>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute: No user found, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  // Optionnel: Si le profil est absolument nécessaire pour toutes les routes protégées (même non-créateur)
  // if (!profile) {
  //   console.log("ProtectedRoute: Profile not loaded, redirecting...");
  //   return <Navigate to="/auth" replace />; // ou vers une page de création de profil
  // }

  console.log("ProtectedRoute: Access granted. User UID:", user.uid);
  return <>{children}</>;
};

const CreatorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, isLoading, isCreator } = useAuth(); // Utiliser user, profile, isLoading, isCreator
  console.log("CreatorRoute: Checking access. isLoading:", isLoading, "User UID:", user?.uid, "Profile role:", profile?.role, "isCreator flag:", isCreator);

  if (isLoading) {
    console.log("CreatorRoute: Still loading authentication state...");
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <Spinner size="lg" />
        <p className="ml-4 text-lg">Chargement de votre session créateur...</p>
      </div>
    );
  }

  if (!user) {
    console.log("CreatorRoute: No user found, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    // Si le profil n'est pas encore chargé, il est difficile de déterminer isCreator.
    // On pourrait afficher un chargement plus long ou rediriger vers / si le profil est essentiel.
    console.log("CreatorRoute: Profile not yet loaded. Cannot definitively determine creator status.");
    // Rediriger vers la page d'accueil pour éviter l'accès si le rôle n'est pas confirmable.
    // Ou attendre que `isLoading` gère le cas où le profil est encore en cours de chargement.
    // La logique actuelle de `isLoading` dans `AuthContext` devrait déjà couvrir cela.
    // Si on arrive ici et que `isLoading` est false mais `profile` est null, c'est un problème de chargement de profil.
    return <Navigate to="/" replace />;
  }
  
  if (!isCreator) {
    console.log(`CreatorRoute: User is not a creator (isCreator: ${isCreator}, profile role: ${profile?.role}). Redirecting to /.`);
    return <Navigate to="/" replace />;
  }
  
  console.log("CreatorRoute: User is a creator, access granted. User UID:", user.uid);
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Router>
          <XvushDesignSystem>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 pb-24 md:pb-4 main-content md:ml-64 px-2 md:px-4 lg:px-6 pt-2 md:pt-4 transition-all duration-300">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/creators" element={<CreatorsFeed />} />
                    <Route path="/creator/:id?" element={<CreatorProfile />} />
                    <Route path="/trending" element={<TrendingContent />} />
                    {/* Pour Stories, si c'est une page protégée par authentification simple: */}
                    <Route path="/stories" element={<ProtectedRoute><Index /></ProtectedRoute>} /> {/* Exemple, remplacez Index par votre vraie page Stories */}

                    <Route path="/secure-messaging" element={<ProtectedRoute><SecureMessagingPage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<CreatorRoute><Dashboard /></CreatorRoute>} />
                    <Route path="/videos" element={<CreatorRoute><CreatorVideos /></CreatorRoute>} />
                    <Route path="/subscribers" element={<CreatorRoute><SubscribersManagement /></CreatorRoute>} />
                    <Route path="/calendar" element={<CreatorRoute><CalendarView /></CreatorRoute>} />
                    <Route path="/exclusive" element={<CreatorRoute><ExclusiveContent /></CreatorRoute>} />
                    <Route path="/revenue" element={<CreatorRoute><CreatorRevenueDashboard /></CreatorRoute>} />
                    <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                    <Route path="/tokens" element={<ProtectedRoute><TokensPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <BottomNavigation />
              </div>
            </div>
            <Toaster />
          </XvushDesignSystem>
        </Router>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
