import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { WeatherWidget } from "./WeatherWidget";
import { useState } from "react";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: Date;
  venue: string;
  city: string;
  country: string;
  competition: string;
  status: 'scheduled' | 'live' | 'finished';
  isHomeMatch: boolean;
}

interface MatchScheduleProps {
  matches?: Match[];
  showWeather?: boolean;
}

const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'Panathinaikos',
    awayTeam: 'Olympiacos',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    venue: 'OPAP Arena',
    city: 'Athens',
    country: 'Greece',
    competition: 'Super League',
    status: 'scheduled',
    isHomeMatch: true,
  },
  {
    id: '2',
    homeTeam: 'AEK Athens',
    awayTeam: 'Panathinaikos',
    homeScore: 1,
    awayScore: 2,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    venue: 'OPAP Arena',
    city: 'Athens',
    country: 'Greece',
    competition: 'Super League',
    status: 'finished',
    isHomeMatch: false,
  },
  {
    id: '3',
    homeTeam: 'Panathinaikos',
    awayTeam: 'PAOK',
    homeScore: 3,
    awayScore: 1,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    venue: 'OPAP Arena',
    city: 'Athens',
    country: 'Greece',
    competition: 'Greek Cup',
    status: 'finished',
    isHomeMatch: true,
  },
  {
    id: '4',
    homeTeam: 'Ajax',
    awayTeam: 'Panathinaikos',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    venue: 'Johan Cruijff Arena',
    city: 'Amsterdam',
    country: 'Netherlands',
    competition: 'Europa League',
    status: 'scheduled',
    isHomeMatch: false,
  },
  {
    id: '5',
    homeTeam: 'Panathinaikos',
    awayTeam: 'Aris',
    date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    venue: 'OPAP Arena',
    city: 'Athens',
    country: 'Greece',
    competition: 'Super League',
    status: 'scheduled',
    isHomeMatch: true,
  },
];

export const MatchSchedule = ({ matches = mockMatches, showWeather = true }: MatchScheduleProps) => {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const upcomingMatches = matches.filter(m => m.status === 'scheduled').sort((a, b) => a.date.getTime() - b.date.getTime());
  const pastMatches = matches.filter(m => m.status === 'finished').sort((a, b) => b.date.getTime() - a.date.getTime());
  const liveMatches = matches.filter(m => m.status === 'live');

  const getResultBadge = (match: Match) => {
    if (match.status !== 'finished' || match.homeScore === undefined || match.awayScore === undefined) {
      return null;
    }

    const isWin = match.isHomeMatch
      ? match.homeScore > match.awayScore
      : match.awayScore > match.homeScore;

    const isDraw = match.homeScore === match.awayScore;

    if (isWin) {
      return <Badge className="bg-success/20 text-success border-success/50">W</Badge>;
    } else if (isDraw) {
      return <Badge className="bg-warning/20 text-warning border-warning/50">D</Badge>;
    } else {
      return <Badge className="bg-destructive/20 text-destructive border-destructive/50">L</Badge>;
    }
  };

  const renderMatch = (match: Match) => (
    <Card
      key={match.id}
      className={`p-4 bg-card/50 border-border hover:border-primary/50 transition-all cursor-pointer ${
        selectedMatch === match.id ? 'border-primary' : ''
      }`}
      onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">{match.competition}</span>
          </div>
          <div className="flex items-center gap-2">
            {match.status === 'live' && (
              <Badge className="bg-destructive animate-pulse">LIVE</Badge>
            )}
            {match.status === 'finished' && getResultBadge(match)}
            {match.status === 'scheduled' && (
              <Badge variant="outline">{format(match.date, 'MMM dd')}</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div className="text-right">
            <p className={`font-bold text-foreground ${match.isHomeMatch ? 'text-primary' : ''}`}>
              {match.homeTeam}
            </p>
            {match.isHomeMatch && (
              <span className="text-xs text-muted-foreground">(Home)</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            {match.status === 'finished' && match.homeScore !== undefined && match.awayScore !== undefined ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">{match.homeScore}</span>
                <span className="text-lg text-muted-foreground">-</span>
                <span className="text-2xl font-bold text-foreground">{match.awayScore}</span>
              </div>
            ) : match.status === 'live' ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">1</span>
                <span className="text-lg text-muted-foreground">-</span>
                <span className="text-2xl font-bold text-foreground">0</span>
              </div>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {format(match.date, 'HH:mm')}
              </span>
            )}
          </div>

          <div className="text-left">
            <p className={`font-bold text-foreground ${!match.isHomeMatch ? 'text-primary' : ''}`}>
              {match.awayTeam}
            </p>
            {!match.isHomeMatch && (
              <span className="text-xs text-muted-foreground">(Away)</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{match.venue}, {match.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{format(match.date, 'PPP')}</span>
          </div>
        </div>

        {selectedMatch === match.id && showWeather && match.status === 'scheduled' && (
          <div className="mt-4 pt-4 border-t border-border">
            <WeatherWidget city={match.city} country={match.country} compact />
          </div>
        )}

        {selectedMatch === match.id && match.status === 'finished' && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.location.href = `/matches/${match.id}`}
            >
              View Full Match Analysis
            </Button>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-background/50 rounded">
                <p className="text-xs text-muted-foreground">Possession</p>
                <p className="text-sm font-bold text-foreground">58%</p>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <p className="text-xs text-muted-foreground">Shots</p>
                <p className="text-sm font-bold text-foreground">14</p>
              </div>
              <div className="p-2 bg-background/50 rounded">
                <p className="text-xs text-muted-foreground">Passes</p>
                <p className="text-sm font-bold text-foreground">482</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming {upcomingMatches.length > 0 && `(${upcomingMatches.length})`}
          </TabsTrigger>
          <TabsTrigger value="live">
            Live {liveMatches.length > 0 && `(${liveMatches.length})`}
          </TabsTrigger>
          <TabsTrigger value="results">
            Results {pastMatches.length > 0 && `(${pastMatches.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map(renderMatch)
          ) : (
            <Card className="p-8 text-center bg-card/50">
              <p className="text-muted-foreground">No upcoming matches scheduled</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="live" className="space-y-4 mt-4">
          {liveMatches.length > 0 ? (
            liveMatches.map(renderMatch)
          ) : (
            <Card className="p-8 text-center bg-card/50">
              <p className="text-muted-foreground">No live matches at the moment</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4 mt-4">
          {pastMatches.length > 0 ? (
            pastMatches.map(renderMatch)
          ) : (
            <Card className="p-8 text-center bg-card/50">
              <p className="text-muted-foreground">No past matches available</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
