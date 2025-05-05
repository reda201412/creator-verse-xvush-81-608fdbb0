
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { DesktopSidebar as Sidebar } from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import CreatorProfile from '@/pages/CreatorProfile';
import CreatorsFeed from '@/pages/CreatorsFeed';
import Dashboard from '@/pages/Dashboard';
import Messages from '@/pages/Messages';
import CreatorVideos from '@/pages/CreatorVideos';
import ExclusiveContent from '@/pages/ExclusiveContent';
import TokensPage from '@/pages/TokensPage';
import SubscribersManagement from '@/pages/SubscribersManagement';
import CalendarView from '@/pages/CalendarView';
import ProfileSettings from '@/pages/ProfileSettings';
import NotFound from '@/pages/NotFound';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import './App.css';

// Protected route wrapper that only checks authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if the user is authenticated
  const hasSession = localStorage.getItem('supabase.auth.token') !== null;
  
  if (!hasSession) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Creator route wrapper that checks both authentication and creator role
const CreatorRoute = ({ children }: { children: React.ReactNode }) => {
  const { isCreator } = useAuth();
  // Check if the user is authenticated
  const hasSession = localStorage.getItem('supabase.auth.token') !== null;
  
  if (!hasSession) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isCreator) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Router>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/creators" element={<CreatorsFeed />} />
                  <Route path="/creator" element={<CreatorProfile />} />
                  
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
            </div>
          </div>
          <Toaster />
        </Router>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
