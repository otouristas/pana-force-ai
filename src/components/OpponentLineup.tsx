import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OpponentLineupProps {
  opponent: string;
  formation?: string;
  players?: ReadonlyArray<string>;
  confidence?: number;
}

export function OpponentLineup({ opponent, formation = "4-2-3-1", players = [], confidence = 0.6 }: OpponentLineupProps) {
  return (
    <Card className="p-6 bg-card/50 border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground">Opponent Likely XI — {opponent}</h3>
        <Badge variant="outline">Conf {Math.round(confidence * 100)}%</Badge>
      </div>
      <div className="text-sm text-muted-foreground mb-3">Formation: {formation}</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {(players.length ? players : ["GK","RB","CB","CB","LB","DM","CM","AM","RW","LW","ST"]).map((p, i) => (
          <div key={i} className="p-2 bg-background/50 rounded border border-border text-sm">{p}</div>
        ))}
      </div>
    </Card>
  );
}


