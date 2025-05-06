
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
import SecureMessaging from '@/components/messaging/SecureMessaging';
import './App.css';

// Protected route wrapper that checks authentication using useAuth hook
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Use the session from useAuth hook instead of localStorage
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Creator route wrapper that checks both authentication and creator role using useAuth hook
const CreatorRoute = ({ children }: { children: React.ReactNode }) => {
  // Use session and isCreator from useAuth hook
  const { session, isCreator } = useAuth();
  
  // First check if user is authenticated
  if (!session) {
    console.log("CreatorRoute: No session, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  // Then check if user is a creator
  if (!isCreator) {
    console.log("CreatorRoute: Not a creator, redirecting to /");
    return <Navigate to="/" replace />;
  }
  
  console.log("CreatorRoute: User is a creator, allowing access");
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
                {/* Ajustement des classes pour éviter le chevauchement */}
                <main className="flex-1 pb-16 md:pb-0 main-content md:ml-64 px-4 lg:px-6 pt-4 transition-all duration-300">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/creators" element={<CreatorsFeed />} />
                    <Route path="/creator" element={<CreatorProfile />} />
                    <Route path="/trending" element={<TrendingContent />} />
                    <Route path="/stories" element={<Index />} /> {/* Temporary route for Stories */}
                    
                    {/* Messagerie moderne en plein écran */}
                    <Route path="/secure-messaging" element={<SecureMessaging />} />
                    
                    {/* Creator-only routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <CreatorRoute>
                          <Dashboard />
                        </CreatorRoute>
                      } 
                    />
                    <Route 
                      path="/videos" 
                      element={
                        <CreatorRoute>
                          <CreatorVideos />
                        </CreatorRoute>
                      } 
                    />
                    <Route 
                      path="/subscribers" 
                      element={
                        <CreatorRoute>
                          <SubscribersManagement />
                        </CreatorRoute>
                      } 
                    />
                    <Route 
                      path="/calendar" 
                      element={
                        <CreatorRoute>
                          <CalendarView />
                        </CreatorRoute>
                      } 
                    />
                    <Route 
                      path="/exclusive" 
                      element={
                        <CreatorRoute>
                          <ExclusiveContent />
                        </CreatorRoute>
                      } 
                    />
                    <Route 
                      path="/revenue" 
                      element={
                        <CreatorRoute>
                          <CreatorRevenueDashboard />
                        </CreatorRoute>
                      } 
                    />
                    
                    {/* Protected routes for all authenticated users */}
                    <Route 
                      path="/messages" 
                      element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/tokens" 
                      element={
                        <ProtectedRoute>
                          <TokensPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <ProfileSettings />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch-all route */}
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
