import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Tracking from "@/components/ui/Tracking";
import SocialProofNotifications from "@/components/ui/SocialProofNotifications";

const Index = lazy(() => import("./pages/Index"));
const Diagnostico = lazy(() => import("./pages/Diagnostico"));
const AcessoPremium = lazy(() => import("./pages/AcessoPremium"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EntregaPremium = lazy(() => import("./pages/EntregaPremium"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Tracking />
            <SocialProofNotifications />
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/diagnostico" element={<Diagnostico />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/obrigado" element={<AcessoPremium />} />
                <Route path="/entrega-premium" element={<EntregaPremium />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
