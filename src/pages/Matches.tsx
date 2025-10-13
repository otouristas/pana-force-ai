import { Card } from "@/components/ui/card";
import { MatchSchedule } from "@/components/MatchSchedule";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Calendar } from "lucide-react";

const Matches = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              Match Schedule
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              View upcoming fixtures, live matches, and recent results
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MatchSchedule showWeather={true} />
          </div>

          <div className="space-y-6">
            <WeatherWidget city="Athens" country="Greece" showImpactAnalysis={true} />

            <Card className="p-4 sm:p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Season Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Matches Played</span>
                  <span className="text-lg font-bold text-foreground">15</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/50">
                  <span className="text-sm text-muted-foreground">Wins</span>
                  <span className="text-lg font-bold text-success">10</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/50">
                  <span className="text-sm text-muted-foreground">Draws</span>
                  <span className="text-lg font-bold text-warning">3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/50">
                  <span className="text-sm text-muted-foreground">Losses</span>
                  <span className="text-lg font-bold text-destructive">2</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/50">
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                  <span className="text-lg font-bold text-primary">66.7%</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Competition Standings</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gradient-primary text-white rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Super League</p>
                      <p className="text-sm text-white/80">1st Place</p>
                    </div>
                    <p className="text-2xl font-bold">33 pts</p>
                  </div>
                </div>
                <div className="p-3 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Greek Cup</p>
                      <p className="text-sm text-muted-foreground">Quarter Finals</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Europa League</p>
                      <p className="text-sm text-muted-foreground">Knockout Phase</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
