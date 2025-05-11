
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
import { Spinner } from '@/components/ui/spinner';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, profile } = useAuth();
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
  
  console.log("ProtectedRoute: Access granted. User UID:", user.uid);
  return <>{children}</>;
};

const CreatorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, isLoading, isCreator } = useAuth();
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
    console.log("CreatorRoute: Profile not yet loaded. Cannot definitively determine creator status.");
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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
  // Close sidebar on small screens when route changes
  const handleRouteChange = () => {
    if (window.innerWidth < 768) {
      setSidebarExpanded(false);
    }
  };

  return (
    <AuthProvider>
      <TooltipProvider>
        <Router>
          <XvushDesignSystem>
            <div className="flex h-screen w-full overflow-hidden bg-background">
              <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />
              <div className={`flex flex-col flex-1 h-full transition-all duration-300 ${sidebarExpanded ? 'md:ml-64' : ''}`}>
                <Header onMenuClick={() => setSidebarExpanded(!sidebarExpanded)} />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-4 pt-2 md:pt-4 px-2 md:px-4 lg:px-6">
                  <Routes>
                    <Route path="/" element={<Index onRouteChange={handleRouteChange} />} />
                    <Route path="/auth" element={<Auth onRouteChange={handleRouteChange} />} />
                    <Route path="/creators" element={<CreatorsFeed onRouteChange={handleRouteChange} />} />
                    <Route path="/creator/:id?" element={<CreatorProfile onRouteChange={handleRouteChange} />} />
                    <Route path="/trending" element={<TrendingContent onRouteChange={handleRouteChange} />} />
                    <Route path="/stories" element={<ProtectedRoute><Index onRouteChange={handleRouteChange} /></ProtectedRoute>} />

                    <Route path="/secure-messaging" element={<ProtectedRoute><SecureMessagingPage onRouteChange={handleRouteChange} /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<CreatorRoute><Dashboard onRouteChange={handleRouteChange} /></CreatorRoute>} />
                    <Route path="/videos" element={<CreatorRoute><CreatorVideos onRouteChange={handleRouteChange} /></CreatorRoute>} />
                    <Route path="/subscribers" element={<CreatorRoute><SubscribersManagement onRouteChange={handleRouteChange} /></CreatorRoute>} />
                    <Route path="/calendar" element={<CreatorRoute><CalendarView onRouteChange={handleRouteChange} /></CreatorRoute>} />
                    <Route path="/exclusive" element={<CreatorRoute><ExclusiveContent onRouteChange={handleRouteChange} /></CreatorRoute>} />
                    <Route path="/revenue" element={<CreatorRoute><CreatorRevenueDashboard onRouteChange={handleRouteChange} /></CreatorRoute>} />
                    <Route path="/messages" element={<ProtectedRoute><Messages onRouteChange={handleRouteChange} /></ProtectedRoute>} />
                    <Route path="/tokens" element={<ProtectedRoute><TokensPage onRouteChange={handleRouteChange} /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><ProfileSettings onRouteChange={handleRouteChange} /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound onRouteChange={handleRouteChange} />} />
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
