
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseAuthProvider, useAuth } from "@/contexts/SupabaseAuthContext";
import { SupabaseAuthForm } from "@/components/auth/SupabaseAuthForm";
import Index from "./pages/Index";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorVideos from "./pages/CreatorVideos";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import Creators from "./pages/Creators";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

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
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/creators" element={<Creators />} />
      <Route path="/creator-profile" element={<CreatorProfile />} />
      <Route path="/creator-profile/:username" element={<CreatorProfile />} />
      <Route path="/creator-videos" element={<CreatorVideos />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
