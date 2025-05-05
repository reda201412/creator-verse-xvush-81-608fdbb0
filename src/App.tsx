
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
import './App.css';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if the user is authenticated
  const hasSession = localStorage.getItem('supabase.auth.token') !== null;
  
  if (!hasSession) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
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
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/messages" 
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/videos" 
                  element={
                    <ProtectedRoute>
                      <CreatorVideos />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/exclusive" 
                  element={
                    <ProtectedRoute>
                      <ExclusiveContent />
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
                  path="/subscribers" 
                  element={
                    <ProtectedRoute>
                      <SubscribersManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/calendar" 
                  element={
                    <ProtectedRoute>
                      <CalendarView />
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
    </AuthProvider>
  );
}

export default App;
