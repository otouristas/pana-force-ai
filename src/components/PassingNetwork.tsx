import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  x: number;
  y: number;
  passes: number;
  passAccuracy: number;
}

interface PassConnection {
  from: string;
  to: string;
  count: number;
  successRate: number;
}

interface PassingNetworkProps {
  players: Player[];
  connections: PassConnection[];
  formation?: string;
  title?: string;
  height?: number;
}

export const PassingNetwork = ({
  players,
  connections,
  formation,
  title = "Passing Network",
  height = 550
}: PassingNetworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    drawField(ctx, width, height);
    drawConnections(ctx, width, height, players, connections);
    drawPlayers(ctx, width, height, players);

  }, [players, connections]);

  const drawField = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const fieldColor = '#1a5f3e';
    const lineColor = 'rgba(255, 255, 255, 0.2)';

    ctx.fillStyle = fieldColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(15, 15, width - 30, height - 30);

    ctx.beginPath();
    ctx.moveTo(width / 2, 15);
    ctx.lineTo(width / 2, height - 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawConnections = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    playerList: Player[],
    connectionList: PassConnection[]
  ) => {
    const playerMap = new Map(playerList.map(p => [p.id, p]));
    const maxPasses = Math.max(...connectionList.map(c => c.count), 1);

    connectionList.forEach(conn => {
      const fromPlayer = playerMap.get(conn.from);
      const toPlayer = playerMap.get(conn.to);

      if (!fromPlayer || !toPlayer) return;

      const x1 = 15 + (fromPlayer.x / 100) * (width - 30);
      const y1 = 15 + (fromPlayer.y / 100) * (height - 30);
      const x2 = 15 + (toPlayer.x / 100) * (width - 30);
      const y2 = 15 + (toPlayer.y / 100) * (height - 30);

      const intensity = conn.count / maxPasses;
      const lineWidth = 2 + (intensity * 8);
      const opacity = 0.3 + (intensity * 0.5);

      const color = conn.successRate >= 0.8 ? '34, 197, 94' :
                    conn.successRate >= 0.6 ? '234, 179, 8' :
                    '239, 68, 68';

      ctx.strokeStyle = `rgba(${color}, ${opacity})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLength = 12;
      const arrowWidth = Math.PI / 6;

      ctx.fillStyle = `rgba(${color}, ${opacity + 0.2})`;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - arrowLength * Math.cos(angle - arrowWidth),
        y2 - arrowLength * Math.sin(angle - arrowWidth)
      );
      ctx.lineTo(
        x2 - arrowLength * Math.cos(angle + arrowWidth),
        y2 - arrowLength * Math.sin(angle + arrowWidth)
      );
      ctx.closePath();
      ctx.fill();
    });
  };

  const drawPlayers = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    playerList: Player[]
  ) => {
    const maxPasses = Math.max(...playerList.map(p => p.passes), 1);

    playerList.forEach(player => {
      const x = 15 + (player.x / 100) * (width - 30);
      const y = 15 + (player.y / 100) * (height - 30);

      const intensity = player.passes / maxPasses;
      const baseRadius = 18;
      const radius = baseRadius + (intensity * 8);

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1e40af');

      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(player.number.toString(), x, y);

      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(player.name, x, y + radius + 16);
      ctx.shadowBlur = 0;

      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = player.passAccuracy >= 80 ? '#22c55e' :
                     player.passAccuracy >= 70 ? '#eab308' : '#ef4444';
      ctx.fillText(`${player.passes} passes (${player.passAccuracy}%)`, x, y + radius + 30);
    });
  };

  const mockPlayers: Player[] = players.length > 0 ? players : [
    { id: '1', name: 'Dioudis', number: 1, position: 'GK', x: 10, y: 50, passes: 32, passAccuracy: 81 },
    { id: '2', name: 'Kotsiras', number: 23, position: 'RB', x: 25, y: 75, passes: 48, passAccuracy: 85 },
    { id: '3', name: 'Jedvaj', number: 5, position: 'CB', x: 20, y: 60, passes: 65, passAccuracy: 92 },
    { id: '4', name: 'Schenkeveld', number: 21, position: 'CB', x: 20, y: 40, passes: 58, passAccuracy: 89 },
    { id: '5', name: 'Juankar', number: 19, position: 'LB', x: 25, y: 25, passes: 44, passAccuracy: 82 },
    { id: '6', name: 'Ioannidis', number: 8, position: 'CM', x: 50, y: 55, passes: 72, passAccuracy: 88 },
    { id: '7', name: 'Zeca', number: 7, position: 'CM', x: 45, y: 40, passes: 68, passAccuracy: 86 },
    { id: '8', name: 'Djuricic', number: 10, position: 'AM', x: 65, y: 50, passes: 55, passAccuracy: 83 },
    { id: '9', name: 'Verbic', number: 11, position: 'LW', x: 75, y: 30, passes: 38, passAccuracy: 76 },
    { id: '10', name: 'Pellistri', number: 14, position: 'RW', x: 75, y: 70, passes: 35, passAccuracy: 74 },
    { id: '11', name: 'Sporar', number: 9, position: 'ST', x: 85, y: 50, passes: 28, passAccuracy: 72 },
  ];

  const mockConnections: PassConnection[] = connections.length > 0 ? connections : [
    { from: '3', to: '4', count: 18, successRate: 0.94 },
    { from: '4', to: '3', count: 16, successRate: 0.92 },
    { from: '3', to: '6', count: 22, successRate: 0.88 },
    { from: '4', to: '7', count: 20, successRate: 0.86 },
    { from: '6', to: '8', count: 24, successRate: 0.85 },
    { from: '7', to: '8', count: 20, successRate: 0.82 },
    { from: '6', to: '7', count: 15, successRate: 0.90 },
    { from: '8', to: '11', count: 18, successRate: 0.78 },
    { from: '8', to: '9', count: 14, successRate: 0.75 },
    { from: '8', to: '10', count: 12, successRate: 0.76 },
    { from: '2', to: '6', count: 16, successRate: 0.84 },
    { from: '5', to: '7', count: 14, successRate: 0.83 },
    { from: '9', to: '11', count: 10, successRate: 0.71 },
    { from: '10', to: '11', count: 9, successRate: 0.69 },
  ];

  const totalPasses = mockPlayers.reduce((sum, p) => sum + p.passes, 0);
  const avgAccuracy = mockPlayers.reduce((sum, p) => sum + p.passAccuracy, 0) / mockPlayers.length;

  return (
    <Card className="p-4 sm:p-6 bg-card/50 border-border backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            {formation && (
              <p className="text-sm text-muted-foreground">Formation: {formation}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-success/10 border-success/50">
              High Success (&gt;80%)
            </Badge>
            <Badge variant="outline" className="bg-warning/10 border-warning/50">
              Medium (60-80%)
            </Badge>
            <Badge variant="outline" className="bg-destructive/10 border-destructive/50">
              Low (&lt;60%)
            </Badge>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={800}
            height={height}
            className="w-full h-auto max-w-full rounded-lg shadow-lg"
            style={{ minWidth: '300px' }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-background/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Passes</p>
            <p className="text-lg font-bold text-foreground">{totalPasses}</p>
          </div>
          <div className="p-3 bg-background/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Avg Accuracy</p>
            <p className="text-lg font-bold text-foreground">{avgAccuracy.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-background/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Key Passes</p>
            <p className="text-lg font-bold text-foreground">18</p>
          </div>
          <div className="p-3 bg-background/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Pass Network</p>
            <p className="text-lg font-bold text-foreground">{mockConnections.length}</p>
          </div>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
          <h4 className="text-sm font-semibold text-foreground mb-2">Key Insights</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Strong central partnership between Jedvaj and Schenkeveld (92% accuracy)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Ioannidis acts as primary playmaker with 72 passes distributed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>High success rate in midfield build-up play (88% average)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Final third connections need improvement (72% accuracy to forward)</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
