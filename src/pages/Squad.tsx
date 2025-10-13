import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Activity, Award } from "lucide-react";
import { SoccerField } from "@/components/SoccerField";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import { PassingNetwork } from "@/components/PassingNetwork";
import { ShotMap } from "@/components/ShotMap";
import { AISquadForecast } from "@/components/AISquadForecast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Squad = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const mockFormation = [
    { id: '1', name: 'Dioudis', number: 1, x: 10, y: 50 },
    { id: '2', name: 'Kotsiras', number: 23, x: 25, y: 75 },
    { id: '3', name: 'Jedvaj', number: 5, x: 20, y: 60 },
    { id: '4', name: 'Schenkeveld', number: 21, x: 20, y: 40 },
    { id: '5', name: 'Juankar', number: 19, x: 25, y: 25 },
    { id: '6', name: 'Ioannidis', number: 8, x: 50, y: 55 },
    { id: '7', name: 'Zeca', number: 7, x: 45, y: 40 },
    { id: '8', name: 'Djuricic', number: 10, x: 65, y: 50 },
    { id: '9', name: 'Verbic', number: 11, x: 75, y: 30 },
    { id: '10', name: 'Pellistri', number: 14, x: 75, y: 70 },
    { id: '11', name: 'Sporar', number: 9, x: 85, y: 50 },
  ];

  const squadStats = [
    { position: 'Goalkeeper', players: 3, avgAge: 28, avgRating: 7.2 },
    { position: 'Defender', players: 8, avgAge: 26, avgRating: 7.4 },
    { position: 'Midfielder', players: 9, avgAge: 25, avgRating: 7.6 },
    { position: 'Forward', players: 5, avgAge: 24, avgRating: 7.8 },
  ];

  const topPerformers = [
    { name: 'A. Ioannidis', position: 'MF', rating: 8.2, goals: 5, assists: 8 },
    { name: 'A. Sporar', position: 'FW', rating: 8.0, goals: 12, assists: 3 },
    { name: 'F. Djuricic', position: 'MF', rating: 7.9, goals: 4, assists: 6 },
    { name: 'T. Jedvaj', position: 'DF', rating: 7.7, goals: 2, assists: 1 },
    { name: 'F. Pellistri', position: 'FW', rating: 7.5, goals: 6, assists: 5 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              Squad Analysis
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Team formation, player performance, and tactical insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/50 border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total Squad</p>
            <p className="text-3xl font-bold text-foreground">25</p>
            <p className="text-xs text-muted-foreground mt-1">Players registered</p>
          </Card>

          <Card className="p-4 bg-card/50 border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
            <p className="text-3xl font-bold text-foreground">7.6</p>
            <p className="text-xs text-success mt-1">+0.3 vs last month</p>
          </Card>

          <Card className="p-4 bg-card/50 border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Activity className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Avg Age</p>
            <p className="text-3xl font-bold text-foreground">26.3</p>
            <p className="text-xs text-muted-foreground mt-1">Years old</p>
          </Card>

          <Card className="p-4 bg-card/50 border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Market Value</p>
            <p className="text-3xl font-bold text-foreground">€45M</p>
            <p className="text-xs text-success mt-1">+8% this season</p>
          </Card>
        </div>

        <Tabs defaultValue="forecast" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="forecast">AI Forecast</TabsTrigger>
            <TabsTrigger value="formation">Formation</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="passing">Passing</TabsTrigger>
            <TabsTrigger value="shots">Shots</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="mt-6">
            <AISquadForecast
              opponent="Olympiacos"
              matchDate={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)}
              formation="4-2-3-1"
            />
          </TabsContent>

          <TabsContent value="formation" className="space-y-6 mt-6">
            <SoccerField
              players={mockFormation}
              formation="4-2-3-1"
              title="Starting XI - Current Formation"
              interactive={true}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4 sm:p-6 bg-card/50 border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">Position Breakdown</h3>
                <div className="space-y-3">
                  {squadStats.map((stat, index) => (
                    <div key={index} className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{stat.position}</span>
                        <span className="text-sm text-muted-foreground">{stat.players} players</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Age</p>
                          <p className="font-semibold text-foreground">{stat.avgAge} years</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Rating</p>
                          <p className="font-semibold text-foreground">{stat.avgRating}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 sm:p-6 bg-card/50 border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">Top Performers</h3>
                <div className="space-y-2">
                  {topPerformers.map((player, index) => (
                    <div key={index} className="p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                          <div>
                            <p className="font-semibold text-foreground">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{player.position}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-primary">{player.rating}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{player.goals} goals</span>
                        <span>{player.assists} assists</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="mt-6">
            <HeatmapVisualization
              playerName="A. Ioannidis"
              data={[]}
              matchPeriod="full"
              dataType="all"
              showLegend={true}
            />
          </TabsContent>

          <TabsContent value="passing" className="mt-6">
            <PassingNetwork
              players={[]}
              connections={[]}
              formation="4-2-3-1"
              title="Team Passing Network"
            />
          </TabsContent>

          <TabsContent value="shots" className="mt-6">
            <ShotMap
              shots={[]}
              title="Team Shot Map"
              teamName="Panathinaikos"
              showStats={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Squad;
