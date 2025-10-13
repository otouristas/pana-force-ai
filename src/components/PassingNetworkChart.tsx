import { Card } from "@/components/ui/card";

interface PlayerNode {
  id: string;
  name: string;
  x: number; // 0..100 pitch % width
  y: number; // 0..100 pitch % height
  usage: number; // 0..1
}

interface PassEdge {
  from: string;
  to: string;
  volume: number; // 0..1
  xThreatGain?: number; // 0..1
}

interface PassingNetworkChartProps {
  players: ReadonlyArray<PlayerNode>;
  passes: ReadonlyArray<PassEdge>;
}

export function PassingNetworkChart({ players, passes }: PassingNetworkChartProps) {
  return (
    <Card className="p-4 bg-card/50 border-border">
      <h3 className="text-lg font-bold text-foreground mb-3">Passing Network</h3>
      <div className="relative w-full" style={{ aspectRatio: '2 / 1' }}>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
          {/* Pitch */}
          <rect x="0" y="0" width="100" height="50" fill="transparent" stroke="hsl(var(--border))" />
          <line x1="50" y1="0" x2="50" y2="50" stroke="hsl(var(--border))" strokeDasharray="2 2" />

          {/* Edges */}
          {passes.map((e, idx) => {
            const from = players.find(p => p.id === e.from);
            const to = players.find(p => p.id === e.to);
            if (!from || !to) return null;
            const stroke = e.xThreatGain && e.xThreatGain > 0.5 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
            const width = 0.5 + (e.volume || 0) * 4;
            return (
              <line key={idx} x1={from.x} y1={from.y / 2} x2={to.x} y2={to.y / 2} stroke={stroke} strokeWidth={width} opacity={0.8} />
            );
          })}

          {/* Nodes */}
          {players.map((p) => (
            <g key={p.id} transform={`translate(${p.x},${p.y / 2})`}>
              <circle r={3 + p.usage * 6} fill="hsl(var(--primary))" fillOpacity={0.4} stroke="hsl(var(--primary))" />
              <text x={0} y={-6 - p.usage * 6} textAnchor="middle" fontSize={3} fill="hsl(var(--foreground))">{p.name}</text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}


