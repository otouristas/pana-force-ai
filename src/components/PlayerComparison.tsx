import { Card } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown } from "lucide-react";

const playerStats = [
  {
    name: "A. Ioannidis",
    position: "MF",
    distance: 10.8,
    sprints: 38,
    avgHR: 152,
    efficiency: 92,
    trend: "up"
  },
  {
    name: "T. Sporar",
    position: "FW",
    distance: 9.2,
    sprints: 42,
    avgHR: 158,
    efficiency: 78,
    trend: "down"
  },
  {
    name: "F. Djuricic",
    position: "MF",
    distance: 11.5,
    sprints: 35,
    avgHR: 148,
    efficiency: 95,
    trend: "up"
  },
  {
    name: "B. Verbič",
    position: "FW",
    distance: 8.9,
    sprints: 45,
    avgHR: 165,
    efficiency: 65,
    trend: "down"
  },
];

export const PlayerComparison = () => {
  return (
    <Card className="p-6 bg-card/50 border-border backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Squad Performance Comparison</h3>
      </div>

      <div className="space-y-4">
        {playerStats.map((player, index) => (
          <div 
            key={index}
            className="p-4 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {player.name.split(' ')[0][0]}{player.name.split(' ')[1][0]}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{player.name}</h4>
                  <p className="text-xs text-muted-foreground">{player.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{player.efficiency}%</span>
                {player.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Distance</p>
                <p className="font-semibold text-foreground">{player.distance} km</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Sprints</p>
                <p className="font-semibold text-foreground">{player.sprints}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Avg HR</p>
                <p className="font-semibold text-foreground">{player.avgHR} bpm</p>
              </div>
            </div>

            {/* Performance bar */}
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  player.efficiency >= 90 ? 'bg-success' : 
                  player.efficiency >= 75 ? 'bg-warning' : 'bg-destructive'
                }`}
                style={{ width: `${player.efficiency}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
