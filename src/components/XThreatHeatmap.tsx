import { Card } from "@/components/ui/card";
import { computeXThreatGrid, PitchEvent } from "@/lib/models/xThreat";

interface XThreatHeatmapProps {
  events: ReadonlyArray<PitchEvent>;
}

export function XThreatHeatmap({ events }: XThreatHeatmapProps) {
  const cells = computeXThreatGrid(events, { rows: 12, cols: 8 });
  return (
    <Card className="p-4 bg-card/50 border-border">
      <h3 className="text-lg font-bold text-foreground mb-3">xThreat Heatmap</h3>
      <div className="relative w-full" style={{ aspectRatio: '2 / 1' }}>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
          <rect x="0" y="0" width="100" height="50" fill="transparent" stroke="hsl(var(--border))" />
          {cells.map((cell) => {
            const w = 100 / 12;
            const h = 50 / 8;
            const x = cell.row * w;
            const y = cell.col * h;
            const val = Math.max(0, Math.min(1, cell.xThreat));
            const alpha = 0.1 + val * 0.7;
            return (
              <rect key={`${cell.row}-${cell.col}`} x={x} y={y} width={w} height={h} fill={`hsl(var(--primary) / ${alpha})`} />
            );
          })}
        </svg>
      </div>
    </Card>
  );
}


