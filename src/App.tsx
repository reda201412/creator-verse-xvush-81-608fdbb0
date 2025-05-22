
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme/theme-provider';

// Lazily loaded pages
const Home = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CreatorProfile = lazy(() => import('@/pages/CreatorProfile'));
const CreatorRevenueDashboard = lazy(() => import('@/pages/CreatorRevenueDashboard'));
const Feed = lazy(() => import('@/pages/Feed'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Toaster />
        <Router>
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Chargement...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/creator/:id" element={<CreatorProfile />} />
              <Route path="/creator/profile" element={<CreatorProfile />} />
              <Route path="/creator/revenue" element={<CreatorRevenueDashboard />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
