
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DesktopSidebar as Sidebar } from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import XvushDesignSystem from '@/components/XvushDesignSystem';
import SecureMessagingPage from '@/pages/SecureMessaging';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import CreatorsFeed from '@/pages/CreatorsFeed';
import CreatorProfile from '@/pages/CreatorProfile';
import TrendingContent from '@/pages/TrendingContent';
import Dashboard from '@/pages/Dashboard';
import CreatorVideos from '@/pages/CreatorVideos';
import SubscribersManagement from '@/pages/SubscribersManagement';
import CalendarView from '@/pages/CalendarView';
import ExclusiveContent from '@/pages/ExclusiveContent';
import CreatorRevenueDashboard from '@/pages/CreatorRevenueDashboard';
import Messages from '@/pages/Messages';
import TokensPage from '@/pages/TokensPage';
import ProfileSettings from '@/pages/ProfileSettings';
import NotFound from '@/pages/NotFound';
import './App.css';
import { Spinner } from '@/components/ui/spinner';
import { RouteChangeProps } from '@/types/navigation';

const ProtectedRoute = ({ children, onRouteChange }: RouteChangeProps & { children: React.ReactNode }) => {
  const { user, isLoading, profile } = useAuth();
  
  useEffect(() => {
    if (onRouteChange) {
      onRouteChange();
    }
  }, [onRouteChange]);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <Spinner size="lg" />
        <p className="ml-4 text-lg">Chargement de votre session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const CreatorRoute = ({ children, onRouteChange }: RouteChangeProps & { children: React.ReactNode }) => {
  const { user, profile, isLoading, isCreator } = useAuth();
  
  useEffect(() => {
    if (onRouteChange) {
      onRouteChange();
    }
  }, [onRouteChange]);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <Spinner size="lg" />
        <p className="ml-4 text-lg">Chargement de votre session créateur...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return <Navigate to="/" replace />;
  }
  
  if (!isCreator) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const location = useLocation();
  
  // Close sidebar on small screens when route changes
  const handleRouteChange = useCallback(() => {
    if (window.innerWidth < 768) {
      setSidebarExpanded(false);
    }
  }, []);

  // Listen for route changes
  useEffect(() => {
    handleRouteChange();
  }, [location, handleRouteChange]);

  return (
    <AuthProvider>
      <TooltipProvider>
          <XvushDesignSystem>
            <div className="flex h-screen w-full overflow-hidden bg-background">
              <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />
              <div className={`flex flex-col flex-1 h-full transition-all duration-300 ${sidebarExpanded ? 'md:ml-64' : ''}`}>
                <Header onMenuClick={() => setSidebarExpanded(!sidebarExpanded)} />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-4 pt-2 md:pt-4 px-2 md:px-4 lg:px-6">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/creators" element={<CreatorsFeed />} />
                    <Route path="/creator/:id?" element={<CreatorProfile />} />
                    <Route path="/trending" element={<TrendingContent />} />
                    <Route path="/stories" element={<ProtectedRoute onRouteChange={handleRouteChange}><Index /></ProtectedRoute>} />

                    <Route path="/secure-messaging" element={<ProtectedRoute onRouteChange={handleRouteChange}><SecureMessagingPage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<CreatorRoute onRouteChange={handleRouteChange}><Dashboard /></CreatorRoute>} />
                    <Route path="/videos" element={<CreatorRoute onRouteChange={handleRouteChange}><CreatorVideos /></CreatorRoute>} />
                    <Route path="/subscribers" element={<CreatorRoute onRouteChange={handleRouteChange}><SubscribersManagement /></CreatorRoute>} />
                    <Route path="/calendar" element={<CreatorRoute onRouteChange={handleRouteChange}><CalendarView /></CreatorRoute>} />
                    <Route path="/exclusive" element={<CreatorRoute onRouteChange={handleRouteChange}><ExclusiveContent /></CreatorRoute>} />
                    <Route path="/revenue" element={<CreatorRoute onRouteChange={handleRouteChange}><CreatorRevenueDashboard /></CreatorRoute>} />
                    <Route path="/messages" element={<ProtectedRoute onRouteChange={handleRouteChange}><Messages /></ProtectedRoute>} />
                    <Route path="/tokens" element={<ProtectedRoute onRouteChange={handleRouteChange}><TokensPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute onRouteChange={handleRouteChange}><ProfileSettings /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <BottomNavigation />
              </div>
            </div>
            <Toaster />
          </XvushDesignSystem>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
