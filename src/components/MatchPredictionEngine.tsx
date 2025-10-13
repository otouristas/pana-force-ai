import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Target, Zap, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { mockXGTimeline, mockOppositionReport } from "@/utils/advancedMockData";
import { AIFormattedText } from "./AIFormattedText";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MatchPredictionEngineProps {
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  venue?: string;
}

export const MatchPredictionEngine = ({
  homeTeam,
  awayTeam,
  matchDate,
  venue = "OPAP Arena"
}: MatchPredictionEngineProps) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [showXGTimeline, setShowXGTimeline] = useState(false);

  const generatePrediction = async () => {
    setLoading(true);
    setPrediction(null);

    try {
      if (!isSupabaseConfigured) {
        toast.error("Supabase is not configured.");
        return;
      }
      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        body: {
          playerData: {
            homeTeam,
            awayTeam,
            matchDate: matchDate.toISOString(),
            venue,
            form: 'WWDWW',
            headToHead: 'Recent form favors home team'
          },
          analysisType: 'match_prediction'
        }
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("AI rate limit reached. Please wait a moment.");
        } else if (error.message?.includes("402")) {
          toast.error("AI credits exhausted. Please add credits.");
        } else {
          toast.error("Failed to generate prediction.");
        }
        console.error("Prediction error:", error);
        return;
      }

      setPrediction(data.analysis);
      toast.success("Match prediction generated!");
    } catch (err) {
      console.error("Error generating prediction:", err);
      toast.error("Failed to generate match prediction");
    } finally {
      setLoading(false);
    }
  };

  const xgData = (() => {
    const timeline: { minute: number; homeXG: number; awayXG: number }[] = [];
    let homeXGSum = 0;
    let awayXGSum = 0;

    for (let minute = 0; minute <= 90; minute += 5) {
      const homeShots = mockXGTimeline.filter(s => s.team === 'home' && s.minute <= minute);
      const awayShots = mockXGTimeline.filter(s => s.team === 'away' && s.minute <= minute);

      homeXGSum = homeShots.reduce((sum, shot) => sum + shot.shotXG, 0);
      awayXGSum = awayShots.reduce((sum, shot) => sum + shot.shotXG, 0);

      timeline.push({
        minute,
        homeXG: parseFloat(homeXGSum.toFixed(2)),
        awayXG: parseFloat(awayXGSum.toFixed(2))
      });
    }

    return timeline;
  })();

  const winProbability = mockOppositionReport.winProbability;
  const drawProbability = 22;
  const lossProbability = 100 - winProbability - drawProbability;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">AI Match Prediction Engine</h3>
              <p className="text-sm text-muted-foreground">
                Advanced analytics and probability forecasting
              </p>
            </div>
          </div>
          <Button
            onClick={generatePrediction}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Generate AI Prediction
          </Button>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center mb-6">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-primary mb-2">{homeTeam}</h4>
            <Badge className="bg-primary/20 text-primary border-primary/50">Home</Badge>
          </div>

          <div className="text-center px-6">
            <div className="text-sm text-muted-foreground mb-2">Predicted Score</div>
            <div className="text-4xl font-bold text-foreground">
              {mockOppositionReport.expectedScoreline}
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-2xl font-bold text-foreground mb-2">{awayTeam}</h4>
            <Badge variant="outline">Away</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Win Probability</span>
              <span className="text-sm font-bold text-success">{winProbability}%</span>
            </div>
            <Progress value={winProbability} className="h-3" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Draw Probability</span>
              <span className="text-sm font-bold text-warning">{drawProbability}%</span>
            </div>
            <Progress value={drawProbability} className="h-3" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Loss Probability</span>
              <span className="text-sm font-bold text-destructive">{lossProbability}%</span>
            </div>
            <Progress value={lossProbability} className="h-3" />
          </div>
        </div>
      </Card>

      {prediction && (
        <Card className="p-6 bg-card/50 border-border">
          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            AI Match Analysis
          </h4>
          <AIFormattedText text={prediction} />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-card/50 border-border">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            Key Factors
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-background/50 rounded">
              <span className="text-sm text-muted-foreground">Home Advantage</span>
              <Badge className="bg-success/20 text-success border-success/50">+15%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-background/50 rounded">
              <span className="text-sm text-muted-foreground">Recent Form</span>
              <Badge className="bg-success/20 text-success border-success/50">+12%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-background/50 rounded">
              <span className="text-sm text-muted-foreground">Head to Head</span>
              <Badge className="bg-success/20 text-success border-success/50">+8%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-background/50 rounded">
              <span className="text-sm text-muted-foreground">Squad Quality</span>
              <Badge className="bg-success/20 text-success border-success/50">+10%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-background/50 rounded">
              <span className="text-sm text-muted-foreground">Tactical Matchup</span>
              <Badge className="bg-success/20 text-success border-success/50">+13%</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            Match Insights
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <p className="text-muted-foreground">
                Home team has won 7 of last 10 meetings
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <p className="text-muted-foreground">
                Both teams scored in 8 of last 10 encounters
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <p className="text-muted-foreground">
                Average goals per game in derby: 3.2
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-warning rounded-full mt-1.5"></div>
              <p className="text-muted-foreground">
                High card count expected (Avg 5.6 yellows)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-success rounded-full mt-1.5"></div>
              <p className="text-muted-foreground">
                Set pieces likely decisive (30% of goals)
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Risk Factors
          </h4>
          <div className="space-y-3 text-sm">
            <div className="p-2 bg-warning/10 rounded border border-warning/30">
              <p className="font-medium text-warning mb-1">Fatigue Risk</p>
              <p className="text-muted-foreground text-xs">
                3 matches in 7 days - rotation needed
              </p>
            </div>
            <div className="p-2 bg-destructive/10 rounded border border-destructive/30">
              <p className="font-medium text-destructive mb-1">Key Player Injury</p>
              <p className="text-muted-foreground text-xs">
                Zeca doubtful - 60% chance to play
              </p>
            </div>
            <div className="p-2 bg-warning/10 rounded border border-warning/30">
              <p className="font-medium text-warning mb-1">Referee Tendency</p>
              <p className="text-muted-foreground text-xs">
                Strict referee - expect disrupted flow
              </p>
            </div>
            <div className="p-2 bg-warning/10 rounded border border-warning/30">
              <p className="font-medium text-warning mb-1">Weather Impact</p>
              <p className="text-muted-foreground text-xs">
                Rain expected - affects passing game
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card/50 border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Expected Goals (xG) Timeline - Historical Reference
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowXGTimeline(!showXGTimeline)}
          >
            {showXGTimeline ? 'Hide' : 'Show'} Timeline
          </Button>
        </div>

        {showXGTimeline && (
          <div className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xgData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="minute"
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: 'Match Minute', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: 'Cumulative xG', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="homeXG"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    name={homeTeam}
                  />
                  <Area
                    type="monotone"
                    dataKey="awayXG"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.3}
                    name={awayTeam}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                <p className="text-xs text-muted-foreground mb-1">{homeTeam} Final xG</p>
                <p className="text-2xl font-bold text-primary">2.42</p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                <p className="text-xs text-muted-foreground mb-1">{awayTeam} Final xG</p>
                <p className="text-2xl font-bold text-destructive">1.26</p>
              </div>
            </div>

            <div className="p-4 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Key xG Moments</p>
              <div className="space-y-2">
                {mockXGTimeline.filter(s => s.shotXG > 0.3).slice(0, 5).map((shot, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {shot.minute}' - {shot.playerName}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge className={shot.isGoal ? 'bg-success/20 text-success' : 'bg-muted'}>
                        xG: {shot.shotXG.toFixed(2)}
                      </Badge>
                      {shot.isGoal && <span className="text-xs text-success">Goal!</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
