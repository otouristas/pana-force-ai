import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AIInsights } from "@/components/AIInsights";
import { PerformanceChart } from "@/components/PerformanceChart";
import { PlayerComparison } from "@/components/PlayerComparison";
import { AdvancedMetrics } from "@/components/AdvancedMetrics";
import { toast } from "sonner";

const Dashboard = () => {
  const [selectedPlayer] = useState({
    name: "A. Ioannidis",
    data: {
      distance: 10.8,
      sprints: 38,
      heartRate: 152,
      playerLoad: 487,
      recovery: 72,
      fatigueScore: 35
    }
  });

  const handleExport = () => {
    toast.success("Performance report exported successfully!");
  };

  const handleShare = () => {
    toast.success("Dashboard link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Overview
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Performance Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time analytics & AI insights</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Player Selection & Quick Stats */}
        <Card className="p-6 bg-gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Analyzing: {selectedPlayer.name}</h2>
              <p className="text-white/80">Midfielder • Session: Today's Training</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Overall Status</p>
              <p className="text-2xl font-bold">Good Condition</p>
            </div>
          </div>
        </Card>

        {/* AI Insights Section */}
        <AIInsights 
          playerName={selectedPlayer.name}
          playerData={selectedPlayer.data}
        />

        {/* Charts & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart />
          <PlayerComparison />
        </div>

        {/* Advanced Metrics */}
        <AdvancedMetrics />
      </main>
    </div>
  );
};

export default Dashboard;
