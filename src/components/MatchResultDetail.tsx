import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Users, TrendingUp, Activity, Target, Navigation,
  Footprints, Clock, Award, AlertCircle, Trophy
} from "lucide-react";
import { MatchResult, PlayerMatchPerformance } from "@/utils/mockData";
import { HeatmapVisualization } from "./HeatmapVisualization";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { computeInMatchWinProbability, computePreMatchWinProbability } from "@/lib/models/winProbability";

interface MatchResultDetailProps {
  match: MatchResult;
}

export const MatchResultDetail = ({ match }: MatchResultDetailProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return "text-green-500";
    if (rating >= 8.0) return "text-green-400";
    if (rating >= 7.5) return "text-blue-500";
    if (rating >= 7.0) return "text-yellow-500";
    return "text-orange-500";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 8.5) return "bg-green-500/20 text-green-500 border-green-500/50";
    if (rating >= 8.0) return "bg-green-400/20 text-green-400 border-green-400/50";
    if (rating >= 7.5) return "bg-blue-500/20 text-blue-500 border-blue-500/50";
    if (rating >= 7.0) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    return "bg-orange-500/20 text-orange-500 border-orange-500/50";
  };

  const topPerformers = [...match.playerPerformances]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const prematch = computePreMatchWinProbability({
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeElo: 1550,
    awayElo: 1520,
    homeForm: { lastFiveResults: ['W','W','D','W','W'], avgXgFor: 1.8, avgXgAgainst: 0.9 },
    awayForm: { lastFiveResults: ['D','W','L','W','D'], avgXgFor: 1.3, avgXgAgainst: 1.2 },
    isHomeAdvantageEnabled: true,
  });
  const live = computeInMatchWinProbability({
    minute: 90,
    homeGoals: match.homeScore,
    awayGoals: match.awayScore,
    preMatch: prematch,
  });

  const renderPlayerCard = (player: PlayerMatchPerformance) => (
    <Card key={player.playerId} className="p-4 bg-card/50 border-border hover:border-primary/50 transition-all">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
              <span className="text-lg font-bold text-primary">{player.number}</span>
            </div>
            <div>
              <h4 className="font-bold text-foreground">{player.playerName}</h4>
              <p className="text-sm text-muted-foreground">{player.position}</p>
            </div>
          </div>
          <Badge className={getRatingBadge(player.rating)}>
            <Award className="w-3 h-3 mr-1" />
            {player.rating.toFixed(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Minutes</p>
              <p className="text-sm font-semibold">{player.minutesPlayed}'</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
            <Target className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">G/A</p>
              <p className="text-sm font-semibold">{player.goals}/{player.assists}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Shots</p>
              <p className="text-sm font-semibold">{player.shotsOnTarget}/{player.shotsTotal}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
            <Navigation className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Passes</p>
              <p className="text-sm font-semibold">{player.passAccuracy}%</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
            <TabsTrigger value="heatmap" className="text-xs">Heatmap</TabsTrigger>
            <TabsTrigger value="detailed" className="text-xs">Detailed</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-2 mt-3">
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Pass Accuracy</span>
                  <span className="text-xs font-semibold">{player.passAccuracy}%</span>
                </div>
                <Progress value={player.passAccuracy} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Dribbles Success</span>
                  <span className="text-xs font-semibold">
                    {player.dribblesAttempted > 0
                      ? Math.round((player.dribblesCompleted / player.dribblesAttempted) * 100)
                      : 0}%
                  </span>
                </div>
                <Progress
                  value={player.dribblesAttempted > 0
                    ? (player.dribblesCompleted / player.dribblesAttempted) * 100
                    : 0
                  }
                  className="h-1.5"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Duels Won</span>
                  <span className="text-xs font-semibold">
                    {player.duelsTotal > 0
                      ? Math.round((player.duelsWon / player.duelsTotal) * 100)
                      : 0}%
                  </span>
                </div>
                <Progress
                  value={player.duelsTotal > 0
                    ? (player.duelsWon / player.duelsTotal) * 100
                    : 0
                  }
                  className="h-1.5"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="mt-3">
            <div className="bg-background/30 rounded-lg p-2">
              <HeatmapVisualization
                playerName={player.playerName}
                data={player.heatmapData}
                height={300}
                showLegend={false}
              />
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-2 mt-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-background/50 rounded">
                <p className="text-muted-foreground">Distance</p>
                <p className="font-semibold">{player.distanceCovered.toFixed(1)} km</p>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <p className="text-muted-foreground">Sprints</p>
                <p className="font-semibold">{player.sprints}</p>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <p className="text-muted-foreground">Top Speed</p>
                <p className="font-semibold">{player.topSpeed.toFixed(1)} km/h</p>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <p className="text-muted-foreground">Touches</p>
                <p className="font-semibold">{player.touchesInBox} (box)</p>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <p className="text-muted-foreground">Key Passes</p>
                <p className="font-semibold">{player.keyPasses}</p>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <p className="text-muted-foreground">Tackles</p>
                <p className="font-semibold">{player.tackles}</p>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <p className="text-muted-foreground">Interceptions</p>
                <p className="font-semibold">{player.interceptions}</p>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <p className="text-muted-foreground">Aerials Won</p>
                <p className="font-semibold">{player.aerialDuelsWon}/{player.aerialDuelsTotal}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              <Trophy className="w-3 h-3 mr-1" />
              {match.competition}
            </Badge>
            <span className="text-xs text-muted-foreground">{format(match.date, 'PPP')}</span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div className="text-right">
              <h2 className="text-2xl font-bold text-foreground">{match.homeTeam}</h2>
              <p className="text-sm text-muted-foreground">(Home)</p>
            </div>

            <div className="flex flex-col items-center gap-2 px-6">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-bold text-foreground">{match.homeScore}</span>
                <span className="text-3xl text-muted-foreground">-</span>
                <span className="text-5xl font-bold text-foreground">{match.awayScore}</span>
              </div>
              <Badge variant="outline" className="text-xs">Full Time</Badge>
              <div className="text-xs text-muted-foreground">
                Live win prob: {match.homeTeam} {live.homeWinPct.toFixed(0)}% • Draw {live.drawPct.toFixed(0)}% • {match.awayTeam} {live.awayWinPct.toFixed(0)}%
              </div>
            </div>

            <div className="text-left">
              <h2 className="text-2xl font-bold text-foreground">{match.awayTeam}</h2>
              <p className="text-sm text-muted-foreground">(Away)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border">
            <div className="text-center p-2 bg-background/30 rounded">
              <p className="text-xs text-muted-foreground">Venue</p>
              <p className="text-sm font-semibold">{match.venue}</p>
            </div>
            <div className="text-center p-2 bg-background/30 rounded">
              <p className="text-xs text-muted-foreground">Attendance</p>
              <p className="text-sm font-semibold">{match.attendance.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-background/30 rounded">
              <p className="text-xs text-muted-foreground">Weather</p>
              <p className="text-sm font-semibold">{match.weather.temperature}°C, {match.weather.condition}</p>
            </div>
            <div className="text-center p-2 bg-background/30 rounded">
              <p className="text-xs text-muted-foreground">Referee</p>
              <p className="text-sm font-semibold">{match.referee}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 bg-card/50 border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((player, index) => (
              <div key={player.playerId} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <span className="text-xl font-bold text-primary">#{index + 1}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{player.playerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {player.goals}G {player.assists}A • {player.passAccuracy}% passes
                  </p>
                </div>
                <Badge className={getRatingBadge(player.rating)}>
                  {player.rating.toFixed(1)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-card/50 border-border lg:col-span-2">
          <h3 className="text-lg font-bold text-foreground mb-4">Match Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Possession</span>
                <span className="text-sm font-semibold">{match.teamStats.possession[0]}% - {match.teamStats.possession[1]}%</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden">
                <div className="bg-primary" style={{ width: `${match.teamStats.possession[0]}%` }} />
                <div className="bg-muted" style={{ width: `${match.teamStats.possession[1]}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{match.teamStats.shots[0]}</p>
                <p className="text-xs text-muted-foreground">Shots</p>
                <p className="text-xs text-muted-foreground">{match.teamStats.shots[1]}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{match.teamStats.shotsOnTarget[0]}</p>
                <p className="text-xs text-muted-foreground">On Target</p>
                <p className="text-xs text-muted-foreground">{match.teamStats.shotsOnTarget[1]}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{match.teamStats.corners[0]}</p>
                <p className="text-xs text-muted-foreground">Corners</p>
                <p className="text-xs text-muted-foreground">{match.teamStats.corners[1]}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center pt-2 border-t border-border">
              <div>
                <p className="text-lg font-bold text-foreground">{match.teamStats.fouls[0]}</p>
                <p className="text-xs text-muted-foreground">Fouls</p>
                <p className="text-xs text-muted-foreground">{match.teamStats.fouls[1]}</p>
              </div>
              <div>
                <p className="text-lg font-bold text-warning">{match.teamStats.yellowCards[0]}</p>
                <p className="text-xs text-muted-foreground">Yellow Cards</p>
                <p className="text-xs text-muted-foreground">{match.teamStats.yellowCards[1]}</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{match.teamStats.passAccuracy[0]}%</p>
                <p className="text-xs text-muted-foreground">Pass Accuracy</p>
                <p className="text-xs text-muted-foreground">{match.teamStats.passAccuracy[1]}%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-card/50 border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Match Timeline</h3>
        <div className="space-y-2">
          {match.events.map((event, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors">
              <span className="text-sm font-bold text-primary min-w-[40px]">{event.minute}'</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {event.type === 'goal' && <Target className="w-4 h-4 text-success" />}
                  {event.type === 'yellow_card' && <AlertCircle className="w-4 h-4 text-warning" />}
                  {event.type === 'substitution' && <Users className="w-4 h-4 text-blue-500" />}
                  <span className="font-semibold text-foreground">{event.player}</span>
                  <Badge variant="outline" className="text-xs">{event.team === 'home' ? match.homeTeam : match.awayTeam}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Player Performances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {match.playerPerformances.map(renderPlayerCard)}
        </div>
      </div>
    </div>
  );
};
