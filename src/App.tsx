
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreatorProfile from "./pages/CreatorProfile";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./pages/CalendarView";
import NotFound from "./pages/NotFound";
import SubscribersManagement from "./pages/SubscribersManagement";
import Messages from "./pages/Messages";
import XvushDesignSystem from "./components/XvushDesignSystem";
import { DesktopSidebar } from "./components/navigation/Sidebar";
import { useIsMobile } from "./hooks/use-mobile";
import Header from "./components/navigation/Header";

// Create QueryClient with better caching settings to improve navigation fluidity
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: false, // Prevent unnecessary refetches on focus
      retry: 1, // Only retry once to avoid notification spam
    },
  },
});

const AppContent = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full">
      {!isMobile && <DesktopSidebar />}
      <main className="flex-1 w-full overflow-x-hidden">
        {isMobile && <Header />}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/creator" element={<CreatorProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/subscribers" element={<SubscribersManagement />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </XvushDesignSystem>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
