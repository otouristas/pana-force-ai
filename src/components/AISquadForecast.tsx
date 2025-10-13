import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Users, AlertTriangle, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AIFormattedText } from "./AIFormattedText";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  position: string;
  fitness: number;
  form: number;
  fatigue: number;
  injuryRisk: number;
}

interface AISquadForecastProps {
  opponent?: string;
  matchDate?: Date;
  formation?: string;
}

export const AISquadForecast = ({
  opponent = "Olympiacos",
  matchDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  formation = "4-2-3-1"
}: AISquadForecastProps) => {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<string | null>(null);
  const [recommendedLineup, setRecommendedLineup] = useState<Player[]>([]);

  const mockSquad: Player[] = [
    { id: '1', name: 'D. Dioudis', position: 'GK', fitness: 95, form: 7.2, fatigue: 15, injuryRisk: 5 },
    { id: '2', name: 'T. Jedvaj', position: 'CB', fitness: 92, form: 7.8, fatigue: 25, injuryRisk: 12 },
    { id: '3', name: 'B. Schenkeveld', position: 'CB', fitness: 90, form: 7.6, fatigue: 30, injuryRisk: 15 },
    { id: '4', name: 'G. Kotsiras', position: 'RB', fitness: 88, form: 7.5, fatigue: 35, injuryRisk: 18 },
    { id: '5', name: 'Juankar', position: 'LB', fitness: 85, form: 7.4, fatigue: 40, injuryRisk: 22 },
    { id: '6', name: 'A. Ioannidis', position: 'CM', fitness: 93, form: 8.3, fatigue: 28, injuryRisk: 10 },
    { id: '7', name: 'Zeca', position: 'CM', fitness: 87, form: 7.6, fatigue: 38, injuryRisk: 20 },
    { id: '8', name: 'F. Djuricic', position: 'CAM', fitness: 89, form: 8.0, fatigue: 32, injuryRisk: 16 },
    { id: '9', name: 'F. Pellistri', position: 'RW', fitness: 91, form: 7.8, fatigue: 30, injuryRisk: 14 },
    { id: '10', name: 'B. Verbic', position: 'LW', fitness: 86, form: 7.3, fatigue: 42, injuryRisk: 25 },
    { id: '11', name: 'A. Sporar', position: 'ST', fitness: 94, form: 8.5, fatigue: 20, injuryRisk: 8 },
    { id: '12', name: 'A. Jeremejeff', position: 'ST', fitness: 96, form: 7.2, fatigue: 10, injuryRisk: 5 },
    { id: '13', name: 'T. Bakasetas', position: 'CAM', fitness: 82, form: 7.9, fatigue: 45, injuryRisk: 28 },
    { id: '14', name: 'D. Kourbelis', position: 'CDM', fitness: 90, form: 7.5, fatigue: 25, injuryRisk: 12 },
  ];

  const generateSquadForecast = async () => {
    setLoading(true);
    setForecast(null);

    try {
      const squadData = mockSquad.map(p => ({
        name: p.name,
        position: p.position,
        fitness: p.fitness,
        form: p.form,
        fatigue: p.fatigue,
        injuryRisk: p.injuryRisk
      }));

      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        body: {
          playerData: {
            squad: squadData,
            opponent,
            formation,
            matchDate: matchDate.toISOString(),
            daysUntilMatch: Math.ceil((matchDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          },
          analysisType: 'squad_forecast'
        }
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("AI rate limit reached. Please wait a moment.");
        } else if (error.message?.includes("402")) {
          toast.error("AI credits exhausted. Please add credits.");
        } else {
          toast.error("Failed to generate forecast.");
        }
        console.error("Forecast error:", error);
        return;
      }

      setForecast(data.analysis);

      const topPlayers = [...mockSquad]
        .sort((a, b) => {
          const scoreA = (a.fitness * 0.3 + a.form * 10 + (100 - a.fatigue) * 0.3 + (100 - a.injuryRisk) * 0.2);
          const scoreB = (b.fitness * 0.3 + b.form * 10 + (100 - b.fatigue) * 0.3 + (100 - b.injuryRisk) * 0.2);
          return scoreB - scoreA;
        })
        .slice(0, 11);

      setRecommendedLineup(topPlayers);
      toast.success("AI Squad Forecast Generated!");
    } catch (err) {
      console.error("Error generating forecast:", err);
      toast.error("Failed to generate squad forecast");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number, inverse = false) => {
    if (inverse) {
      if (value >= 70) return "text-destructive";
      if (value >= 40) return "text-warning";
      return "text-success";
    }
    if (value >= 85) return "text-success";
    if (value >= 70) return "text-warning";
    return "text-destructive";
  };

  const getStatusBadge = (value: number, inverse = false) => {
    if (inverse) {
      if (value >= 70) return "bg-destructive/20 text-destructive border-destructive/50";
      if (value >= 40) return "bg-warning/20 text-warning border-warning/50";
      return "bg-success/20 text-success border-success/50";
    }
    if (value >= 85) return "bg-success/20 text-success border-success/50";
    if (value >= 70) return "bg-warning/20 text-warning border-warning/50";
    return "bg-destructive/20 text-destructive border-destructive/50";
  };

  return (
    <Card className="p-6 bg-card/50 border-primary/30 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-xl font-bold text-foreground">AI Squad Forecast</h3>
              <p className="text-sm text-muted-foreground">
                Optimal lineup for {opponent} • {formation}
              </p>
            </div>
          </div>
          <Button
            onClick={generateSquadForecast}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Generate Forecast
          </Button>
        </div>

        {recommendedLineup.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Recommended Starting XI</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendedLineup.map((player) => (
                <Card key={player.id} className="p-3 bg-background/50 border-border hover:border-primary/50 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-semibold text-foreground">{player.name}</h5>
                        <p className="text-xs text-muted-foreground">{player.position}</p>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/50">
                        {player.form.toFixed(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Fitness</p>
                        <p className={`font-semibold ${getStatusColor(player.fitness)}`}>
                          {player.fitness}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fatigue</p>
                        <p className={`font-semibold ${getStatusColor(player.fatigue, true)}`}>
                          {player.fatigue}%
                        </p>
                      </div>
                    </div>

                    {player.injuryRisk > 20 && (
                      <div className="flex items-center gap-1 text-xs text-warning">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Elevated injury risk: {player.injuryRisk}%</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {forecast && (
          <div className="mt-6 p-4 bg-background/50 rounded-lg border border-primary/20 animate-fade-in">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              AI Analysis & Recommendations
            </h4>
            <AIFormattedText text={forecast} />
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            Full Squad Status
          </h4>

          <div className="grid grid-cols-1 gap-2">
            {mockSquad
              .sort((a, b) => a.position.localeCompare(b.position))
              .map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-muted-foreground">{player.position}</p>
                      <p className="text-sm font-semibold text-foreground">{player.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[50px]">
                      <p className="text-xs text-muted-foreground">Fitness</p>
                      <p className={`text-sm font-semibold ${getStatusColor(player.fitness)}`}>
                        {player.fitness}%
                      </p>
                    </div>
                    <div className="text-center min-w-[50px]">
                      <p className="text-xs text-muted-foreground">Form</p>
                      <p className="text-sm font-semibold text-foreground">{player.form.toFixed(1)}</p>
                    </div>
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-muted-foreground">Fatigue</p>
                      <p className={`text-sm font-semibold ${getStatusColor(player.fatigue, true)}`}>
                        {player.fatigue}%
                      </p>
                    </div>
                    <div className="text-center min-w-[70px]">
                      <p className="text-xs text-muted-foreground">Risk</p>
                      <Badge className={getStatusBadge(player.injuryRisk, true)} variant="outline">
                        {player.injuryRisk}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
