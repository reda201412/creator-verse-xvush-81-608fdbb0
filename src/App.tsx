import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import Sidebar from '@/components/navigation/Sidebar';
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
import NetworkTest from '@/pages/NetworkTest';
import TestAuth from '@/pages/TestAuth';
import './App.css';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

// Add future flags for React Router v7 compatibility
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
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

const CreatorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isCreator, profile } = useAuth();
  
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
  
  return (
    <AuthProvider>
      <TooltipProvider>
        <Router {...router}>
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
                    <Route path="/stories" element={<ProtectedRoute><Index /></ProtectedRoute>} />

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
                    
                    {/* Pages de diagnostic réseau et test */}
                    <Route path="/network-test" element={<NetworkTest />} />
                    <Route path="/test-auth" element={<TestAuth />} />
                    
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
