import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";
import { Target, TrendingUp } from "lucide-react";

interface Shot {
  id: string;
  x: number;
  y: number;
  outcome: 'goal' | 'on-target' | 'off-target' | 'blocked';
  xg: number;
  minute: number;
  player?: string;
  bodyPart?: 'left-foot' | 'right-foot' | 'header';
}

interface ShotMapProps {
  shots: Shot[];
  title?: string;
  teamName?: string;
  height?: number;
  showStats?: boolean;
}

export const ShotMap = ({
  shots,
  title = "Shot Map",
  teamName,
  height = 450,
  showStats = true
}: ShotMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    drawHalfField(ctx, width, height);
    drawShots(ctx, width, height, shots.length > 0 ? shots : mockShots);

  }, [shots]);

  const drawHalfField = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const fieldColor = '#1a5f3e';
    const lineColor = '#ffffff';

    ctx.fillStyle = fieldColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;

    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.beginPath();
    ctx.moveTo(width / 2, 20);
    ctx.lineTo(width / 2, height - 20);
    ctx.stroke();

    const centerX = width / 2;
    const centerY = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI);
    ctx.stroke();

    const penaltyBoxWidth = (width - 40) * 0.6;
    const penaltyBoxHeight = 120;
    const penaltyBoxX = (width - penaltyBoxWidth) / 2;

    ctx.strokeRect(penaltyBoxX, 20, penaltyBoxWidth, penaltyBoxHeight);

    const goalBoxWidth = (width - 40) * 0.3;
    const goalBoxHeight = 50;
    const goalBoxX = (width - goalBoxWidth) / 2;

    ctx.strokeRect(goalBoxX, 20, goalBoxWidth, goalBoxHeight);

    const goalWidth = (width - 40) * 0.15;
    const goalX = (width - goalWidth) / 2;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.strokeRect(goalX, 15, goalWidth, 10);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;

    const penaltySpotY = 20 + penaltyBoxHeight * 0.3;
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(centerX, penaltySpotY, 3, 0, Math.PI * 2);
    ctx.fill();

    const arcRadius = 60;
    const arcY = 20 + penaltyBoxHeight;
    ctx.beginPath();
    ctx.arc(centerX, penaltySpotY, arcRadius, 0.3, Math.PI - 0.3);
    ctx.stroke();
  };

  const drawShots = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    shotList: Shot[]
  ) => {
    shotList.forEach(shot => {
      const x = 20 + (shot.x / 100) * (width - 40);
      const y = 20 + (shot.y / 100) * (height - 40);

      const radius = 8 + (shot.xg * 12);

      let fillColor: string;
      let strokeColor: string;
      let strokeWidth: number = 2;

      switch (shot.outcome) {
        case 'goal':
          fillColor = '#22c55e';
          strokeColor = '#16a34a';
          strokeWidth = 3;
          break;
        case 'on-target':
          fillColor = '#eab308';
          strokeColor = '#ca8a04';
          break;
        case 'off-target':
          fillColor = '#64748b';
          strokeColor = '#475569';
          break;
        case 'blocked':
          fillColor = '#ef4444';
          strokeColor = '#dc2626';
          break;
        default:
          fillColor = '#94a3b8';
          strokeColor = '#64748b';
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (shot.outcome === 'goal') {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚽', x, y);
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(width / 2, 20);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  };

  const mockShots: Shot[] = shots.length > 0 ? shots : [
    { id: '1', x: 50, y: 15, outcome: 'goal', xg: 0.85, minute: 12, player: 'Sporar', bodyPart: 'right-foot' },
    { id: '2', x: 45, y: 20, outcome: 'on-target', xg: 0.42, minute: 23, player: 'Djuricic', bodyPart: 'left-foot' },
    { id: '3', x: 60, y: 18, outcome: 'goal', xg: 0.72, minute: 34, player: 'Sporar', bodyPart: 'header' },
    { id: '4', x: 48, y: 35, outcome: 'off-target', xg: 0.18, minute: 41, player: 'Verbic', bodyPart: 'left-foot' },
    { id: '5', x: 65, y: 25, outcome: 'blocked', xg: 0.28, minute: 56, player: 'Pellistri', bodyPart: 'right-foot' },
    { id: '6', x: 52, y: 30, outcome: 'on-target', xg: 0.35, minute: 62, player: 'Ioannidis', bodyPart: 'right-foot' },
    { id: '7', x: 40, y: 22, outcome: 'off-target', xg: 0.25, minute: 68, player: 'Djuricic', bodyPart: 'left-foot' },
    { id: '8', x: 55, y: 42, outcome: 'blocked', xg: 0.12, minute: 73, player: 'Verbic', bodyPart: 'right-foot' },
    { id: '9', x: 48, y: 16, outcome: 'goal', xg: 0.68, minute: 81, player: 'Sporar', bodyPart: 'right-foot' },
    { id: '10', x: 70, y: 28, outcome: 'on-target', xg: 0.22, minute: 87, player: 'Pellistri', bodyPart: 'left-foot' },
  ];

  const goals = mockShots.filter(s => s.outcome === 'goal').length;
  const onTarget = mockShots.filter(s => s.outcome === 'on-target' || s.outcome === 'goal').length;
  const totalXg = mockShots.reduce((sum, s) => sum + s.xg, 0);
  const avgXg = totalXg / mockShots.length;

  return (
    <Card className="p-4 sm:p-6 bg-card/50 border-border backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            {teamName && (
              <p className="text-sm text-muted-foreground">{teamName}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-success/20 text-success border-success/50">Goal</Badge>
            <Badge className="bg-warning/20 text-warning border-warning/50">On Target</Badge>
            <Badge className="bg-muted text-muted-foreground">Off Target</Badge>
            <Badge className="bg-destructive/20 text-destructive border-destructive/50">Blocked</Badge>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={700}
            height={height}
            className="w-full h-auto max-w-full rounded-lg shadow-lg"
            style={{ minWidth: '300px' }}
          />
        </div>

        <div className="text-xs text-center text-muted-foreground">
          Circle size represents xG (expected goals) value • Lines show shot angle to goal
        </div>

        {showStats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Total Shots</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{mockShots.length}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg border border-success/50">
                <p className="text-xs text-muted-foreground mb-1">Goals</p>
                <p className="text-2xl font-bold text-success">{goals}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/50">
                <p className="text-xs text-muted-foreground mb-1">On Target</p>
                <p className="text-2xl font-bold text-warning">{onTarget}</p>
                <p className="text-xs text-muted-foreground">({((onTarget / mockShots.length) * 100).toFixed(0)}%)</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/50">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Total xG</p>
                </div>
                <p className="text-2xl font-bold text-primary">{totalXg.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Avg: {avgXg.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">Shot Analysis</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">Shooting Efficiency</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Conversion rate: {((goals / mockShots.length) * 100).toFixed(0)}%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>xG performance: {goals > totalXg ? '+' : ''}{(goals - totalXg).toFixed(2)} vs expected</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Shot accuracy: {((onTarget / mockShots.length) * 100).toFixed(0)}%</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Shot Quality</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>High quality chances (xG &gt; 0.5): {mockShots.filter(s => s.xg > 0.5).length}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Inside box: {mockShots.filter(s => s.y < 30).length} shots</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Central positions: {mockShots.filter(s => s.x > 40 && s.x < 60).length} shots</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
