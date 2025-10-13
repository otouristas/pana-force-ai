import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, Shield, Zap, AlertTriangle, TrendingUp, Users, Award } from "lucide-react";
import { mockOppositionReport } from "@/utils/advancedMockData";
import { Progress } from "@/components/ui/progress";

const TacticalIntelligence = () => {
  const report = mockOppositionReport;

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-destructive/20 text-destructive border-destructive/50';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/50';
      case 'low':
        return 'bg-success/20 text-success border-success/50';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              Tactical Intelligence
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              AI-powered opposition analysis and tactical recommendations
            </p>
          </div>
        </div>

        <Card className="p-6 bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Opposition Report: {report.opponentName}</h2>
              <p className="text-sm text-muted-foreground">
                Match Date: {report.matchDate.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={getThreatColor(report.overallThreatLevel)} variant="outline">
                Threat Level: {report.overallThreatLevel.toUpperCase()}
              </Badge>
              <Badge className={getThreatColor(report.setPieceThreatLevel)} variant="outline">
                Set Piece: {report.setPieceThreatLevel.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Win Probability</p>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-3xl font-bold text-success">{report.winProbability}%</p>
                <TrendingUp className="w-5 h-5 text-success mb-1" />
              </div>
              <Progress value={report.winProbability} className="h-2" />
            </div>

            <div className="p-4 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Expected Scoreline</p>
              <p className="text-3xl font-bold text-foreground">{report.expectedScoreline}</p>
              <p className="text-xs text-muted-foreground mt-1">Based on form & tactics</p>
            </div>

            <div className="p-4 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Predicted Formation</p>
              <p className="text-3xl font-bold text-foreground">{report.predictedFormation}</p>
              <p className="text-xs text-muted-foreground mt-1">85% confidence</p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="lineup">Predicted Lineup</TabsTrigger>
            <TabsTrigger value="tactics">Tactics</TabsTrigger>
            <TabsTrigger value="players">Key Players</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6 mt-6">
            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                AI Tactical Analysis
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">{report.detailedAnalysis}</p>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 border-border">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-destructive" />
                  Attacking Patterns
                </h3>
                <div className="space-y-3">
                  {report.attackingPatterns.map((pattern, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-destructive">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{pattern}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card/50 border-border">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-success" />
                  Defensive Vulnerabilities
                </h3>
                <div className="space-y-3">
                  {report.defensiveVulnerabilities.map((vulnerability, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Target className="w-3 h-3 text-success" />
                      </div>
                      <p className="text-sm text-muted-foreground">{vulnerability}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lineup" className="space-y-6 mt-6">
            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Predicted Starting XI - {report.predictedFormation}
              </h3>

              <div className="relative bg-gradient-to-b from-green-900/20 to-green-950/20 rounded-lg p-8 border border-green-900/30">
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: `
                      linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent),
                      linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)
                    `,
                    backgroundSize: '50px 50px'
                  }}></div>
                </div>

                <div className="relative grid grid-cols-3 gap-y-16 min-h-[500px]">
                  {report.predictedLineup.map((player, idx) => {
                    let colSpan = "col-span-3";
                    let justify = "justify-center";

                    if (player.position === 'GK') {
                      colSpan = "col-span-3";
                      justify = "justify-center";
                    } else if (['RB', 'CB', 'LB'].includes(player.position)) {
                      if (player.position === 'RB') {
                        colSpan = "col-span-1";
                        justify = "justify-end";
                      } else if (player.position === 'LB') {
                        colSpan = "col-span-1 col-start-3";
                        justify = "justify-start";
                      } else {
                        colSpan = "col-span-1 col-start-2";
                        justify = "justify-center";
                      }
                    } else if (['CDM', 'CM', 'CAM'].includes(player.position)) {
                      if (report.predictedLineup.filter(p => p.position === player.position).length > 1) {
                        const samePositionPlayers = report.predictedLineup.filter(p => p.position === player.position);
                        const playerIndex = samePositionPlayers.indexOf(player);
                        if (playerIndex === 0) {
                          colSpan = "col-span-1";
                          justify = "justify-center";
                        } else {
                          colSpan = "col-span-1 col-start-3";
                          justify = "justify-center";
                        }
                      } else {
                        colSpan = "col-span-3";
                        justify = "justify-center";
                      }
                    } else if (['RW', 'LW', 'ST'].includes(player.position)) {
                      if (player.position === 'RW') {
                        colSpan = "col-span-1";
                        justify = "justify-end";
                      } else if (player.position === 'LW') {
                        colSpan = "col-span-1 col-start-3";
                        justify = "justify-start";
                      } else {
                        colSpan = "col-span-3";
                        justify = "justify-center";
                      }
                    }

                    return (
                      <div key={idx} className={`${colSpan} flex ${justify}`}>
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center mb-2">
                            <span className="text-sm font-bold text-destructive">{player.position}</span>
                          </div>
                          <span className="text-xs font-medium text-foreground text-center">{player.player}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This lineup prediction is based on recent form, injury reports, and tactical preferences.
                  Final lineup may vary. Confidence level: 85%
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tactics" className="space-y-6 mt-6">
            <Card className="p-6 bg-success/10 border-success/30">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-success" />
                Recommended Tactical Setup
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-background/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Formation
                  </h4>
                  <p className="text-3xl font-bold text-primary mb-2">{report.recommendedFormation}</p>
                  <p className="text-sm text-muted-foreground">
                    Best suited to exploit opponent weaknesses while maintaining defensive solidity
                  </p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">Match Strategy</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Aggressive pressing in first 20 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Control possession to tire opponent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Target their weak left flank</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">Tactical Instructions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.recommendedTactics.map((tactic, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-success">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tactic}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Player Matchups & Instructions</h3>
              <div className="space-y-3">
                {[
                  { ourPlayer: 'A. Ioannidis', vs: 'Willian', instruction: 'Press aggressively, limit time on ball', priority: 'high' },
                  { ourPlayer: 'T. Jedvaj', vs: 'El Kaabi', instruction: 'Physical marking, win aerial duels', priority: 'high' },
                  { ourPlayer: 'B. Verbic', vs: 'Rodinei', instruction: 'Track back defensively, exploit space behind', priority: 'medium' },
                  { ourPlayer: 'F. Pellistri', vs: 'Ortega', instruction: 'Isolate 1v1, exploit pace advantage', priority: 'high' },
                  { ourPlayer: 'A. Sporar', vs: 'Retsos', instruction: 'Hold up play, drag defenders out of position', priority: 'medium' }
                ].map((matchup, idx) => (
                  <div key={idx} className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">{matchup.ourPlayer}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="font-semibold text-destructive">{matchup.vs}</span>
                      </div>
                      <Badge className={matchup.priority === 'high' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}>
                        {matchup.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{matchup.instruction}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="space-y-6 mt-6">
            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Key Players to Watch
              </h3>

              <div className="space-y-4">
                {report.keyPlayersToWatch.map((player, idx) => (
                  <Card key={idx} className="p-4 bg-background/50 border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-foreground mb-1">{player.name}</h4>
                        <Badge variant="outline">Primary Threat</Badge>
                      </div>
                      <Badge className="bg-destructive/20 text-destructive border-destructive/50">
                        HIGH PRIORITY
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                        <p className="text-xs text-muted-foreground mb-1">Threat Assessment</p>
                        <p className="text-sm text-foreground">{player.threat}</p>
                      </div>

                      <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                        <p className="text-xs text-muted-foreground mb-1">How to Neutralize</p>
                        <p className="text-sm text-foreground">{player.howToNeutralize}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Statistical Comparison</h3>
              <div className="space-y-4">
                {[
                  { stat: 'Goals/Game', us: 2.4, them: 1.9 },
                  { stat: 'Possession %', us: 58, them: 52 },
                  { stat: 'Pass Accuracy', us: 85, them: 81 },
                  { stat: 'Shots/Game', us: 16, them: 14 },
                  { stat: 'Clean Sheets', us: 11, them: 8 }
                ].map((comparison, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{comparison.stat}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-primary">{comparison.us}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="font-semibold text-destructive">{comparison.them}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(comparison.us / (comparison.us + comparison.them)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 h-2 bg-destructive/20 rounded-full overflow-hidden flex justify-end">
                        <div
                          className="h-full bg-destructive"
                          style={{ width: `${(comparison.them / (comparison.us + comparison.them)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6 bg-primary/5 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground mb-2">AI Recommendation Summary</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Based on comprehensive analysis of recent form, tactical patterns, and player capabilities,
                the AI recommends an aggressive approach targeting their defensive vulnerabilities on the left side.
                Early pressure and quick transitions should yield goal-scoring opportunities.
              </p>
              <Button>Download Full Report (PDF)</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TacticalIntelligence;
