import { RiskZoneIndicator } from "./RiskZoneIndicator";

const mockPlayers = [
  { name: "A. Ioannidis", fatigueScore: 35, level: "safe" as const },
  { name: "T. Sporar", fatigueScore: 68, level: "warning" as const },
  { name: "F. Djuricic", fatigueScore: 24, level: "safe" as const },
  { name: "B. Verbič", fatigueScore: 87, level: "danger" as const },
];

export const FatigueMonitor = () => {
  return (
    <section className="py-20 px-6 bg-gradient-dark">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Fatigue & Injury Risk Monitor
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered predictions to prevent overtraining and reduce injury risk
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {mockPlayers.map((player, index) => (
            <RiskZoneIndicator
              key={index}
              level={player.level}
              playerName={player.name}
              fatigueScore={player.fatigueScore}
            />
          ))}
        </div>

        <div className="mt-12 p-6 bg-card/30 border border-border rounded-xl backdrop-blur-sm max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-3">Risk Zone Guidelines</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-success" />
              <span className="text-muted-foreground"><strong className="text-success">Green Zone:</strong> Player is in optimal condition for full training</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-warning" />
              <span className="text-muted-foreground"><strong className="text-warning">Yellow Zone:</strong> Monitor closely, consider reducing intensity</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-destructive" />
              <span className="text-muted-foreground"><strong className="text-destructive">Red Zone:</strong> High injury risk - immediate rest recommended</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
