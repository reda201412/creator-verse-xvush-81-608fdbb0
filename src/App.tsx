
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DesktopSidebar } from "./components/navigation/Sidebar";
import { useIsMobile } from "./hooks/use-mobile";
import Header from "./components/navigation/Header";
import MicroRewards from "./components/monetization/MicroRewards";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const CreatorProfile = lazy(() => import("./pages/CreatorProfile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CalendarView = lazy(() => import("./pages/CalendarView"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SubscribersManagement = lazy(() => import("./pages/SubscribersManagement"));
const Messages = lazy(() => import("./pages/Messages"));
const CreatorsFeed = lazy(() => import("./pages/CreatorsFeed"));
const XvushDesignSystem = lazy(() => import("./components/XvushDesignSystem"));
const TokensPage = lazy(() => import("./pages/TokensPage"));
const ExclusiveContent = lazy(() => import("./pages/ExclusiveContent"));

// Create QueryClient with better caching settings to improve navigation fluidity
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: false, // Prevent unnecessary refetches on focus
      retry: 1, // Only retry once to avoid notification spam
      // Remove the suspense property as it's causing a TypeScript error
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse bg-primary/20 p-4 rounded-full">
      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
    </div>
  </div>
);

const AppContent = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full">
      {!isMobile && <DesktopSidebar />}
      <main className="flex-1 w-full overflow-x-hidden">
        <Header />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/creator" element={<CreatorProfile />} />
            <Route path="/creators" element={<CreatorsFeed />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/subscribers" element={<SubscribersManagement />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/tokens" element={<TokensPage />} />
            <Route path="/exclusive" element={<ExclusiveContent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <XvushDesignSystem>
        <Toaster />
        <Sonner position="top-right" closeButton={true} />
        <MicroRewards enabled={true} intensity={75} />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </XvushDesignSystem>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
