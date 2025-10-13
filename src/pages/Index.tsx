import { Hero } from "@/components/Hero";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { FatigueMonitor } from "@/components/FatigueMonitor";
import { FeaturesSection } from "@/components/FeaturesSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <DashboardMetrics />
      <FatigueMonitor />
      <FeaturesSection />
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-card/30">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            PanaAI – Performance Intelligence for Panathinaikos FC
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by AI • Built for Excellence
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
