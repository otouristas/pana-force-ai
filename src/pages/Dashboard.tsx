import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { AIInsights } from "@/components/AIInsights";
import { PerformanceChart } from "@/components/PerformanceChart";
import { PlayerComparison } from "@/components/PlayerComparison";
import { AdvancedMetrics } from "@/components/AdvancedMetrics";
import { SoccerField } from "@/components/SoccerField";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import { WeatherWidget } from "@/components/WeatherWidget";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const mockFormation = [
    { id: '6', name: 'Ioannidis', number: 8, x: 50, y: 55, isActive: true },
    { id: '7', name: 'Zeca', number: 7, x: 45, y: 40 },
    { id: '8', name: 'Djuricic', number: 10, x: 65, y: 50 },
    { id: '9', name: 'Verbic', number: 11, x: 75, y: 30 },
    { id: '10', name: 'Pellistri', number: 14, x: 75, y: 70 },
    { id: '11', name: 'Sporar', number: 9, x: 85, y: 50 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Player Selection & Quick Stats */}
        <Card className="p-4 sm:p-6 bg-gradient-primary text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Analyzing: {selectedPlayer.name}</h2>
              <p className="text-white/80">Midfielder • Session: Today's Training</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 sm:flex-none bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Share2 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="flex-1 sm:flex-none bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Insights Section */}
            <AIInsights
              playerName={selectedPlayer.name}
              playerData={selectedPlayer.data}
            />

            {/* Charts & Metrics Grid */}
            <div className="grid grid-cols-1 gap-6">
              <PerformanceChart />
              <PlayerComparison />
            </div>
          </div>

          <div className="space-y-6">
            <WeatherWidget city="Athens" country="Greece" showImpactAnalysis={true} />

            <Card className="p-4 sm:p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Session Load</span>
                  <span className="text-lg font-bold text-foreground">{selectedPlayer.data.playerLoad}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Distance (km)</span>
                  <span className="text-lg font-bold text-foreground">{selectedPlayer.data.distance}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Sprints</span>
                  <span className="text-lg font-bold text-foreground">{selectedPlayer.data.sprints}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/50">
                  <span className="text-sm text-muted-foreground">Recovery</span>
                  <span className="text-lg font-bold text-success">{selectedPlayer.data.recovery}%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Advanced Visualizations */}
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="field">Field Position</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="mt-6">
            <AdvancedMetrics />
          </TabsContent>

          <TabsContent value="field" className="mt-6">
            <SoccerField
              players={mockFormation}
              formation="4-2-3-1"
              title="Current Player Positions"
              interactive={true}
            />
          </TabsContent>

          <TabsContent value="heatmap" className="mt-6">
            <HeatmapVisualization
              playerName={selectedPlayer.name}
              data={[]}
              matchPeriod="full"
              dataType="all"
              showLegend={true}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
