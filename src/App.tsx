import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import Squad from "./pages/Squad";
import Competitions from "./pages/Competitions";
import TacticalIntelligence from "./pages/TacticalIntelligence";
import Intel from "./pages/Intel";
import Dossier from "./pages/Dossier";
import NotFound from "./pages/NotFound";
import { MobileNav, DesktopNav } from "./components/MobileNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DesktopNav />
        <MobileNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:matchId" element={<MatchDetail />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/intel" element={<Intel />} />
          <Route path="/dossier" element={<Dossier />} />
          {/* Recruitment temporarily disabled */}
          <Route path="/tactical-intelligence" element={<TacticalIntelligence />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      
<footer aria-label="Development and copyright">
      <p data-asg-copyright="notice" style={{ maxWidth: "80rem", margin: "1rem auto 0", padding: "0 1rem 1rem", fontSize: "0.75rem", lineHeight: 1.6 }}>
        <a href="/intellectual-property.html" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "0.2em" }}>Code &amp; development: AnotherSEOGuru, a company of Touristas Technologies. Copyright &amp; permitted use.</a>
      </p>
    </footer>
</BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
