
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { SupabaseAuthForm } from "@/components/auth/SupabaseAuthForm";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/navigation/AppSidebar";
import Header from "@/components/navigation/Header";
import Index from "./pages/Index";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorVideos from "./pages/CreatorVideos";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import Creators from "./pages/Creators";
import TrendingContent from "./pages/TrendingContent";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const queryClient = new QueryClient();

// App Routes component
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <SupabaseAuthForm />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/trending" element={<TrendingContent />} />
              <Route path="/creators" element={<Creators />} />
              <Route path="/creator/:username" element={<CreatorProfile />} />
              <Route path="/creator-profile" element={<CreatorProfile />} />
              <Route path="/creator-videos" element={<CreatorVideos />} />
              <Route path="/videos" element={<CreatorVideos />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<SupabaseAuthForm />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppSidebar />
          <AppRoutes />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
