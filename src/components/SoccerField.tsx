import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

interface PlayerPosition {
  id: string;
  name: string;
  number: number;
  x: number;
  y: number;
  isActive?: boolean;
}

interface SoccerFieldProps {
  players?: PlayerPosition[];
  formation?: string;
  showHeatmap?: boolean;
  heatmapData?: Array<{ x: number; y: number; intensity: number }>;
  passNetwork?: Array<{ from: string; to: string; count: number }>;
  height?: number;
  interactive?: boolean;
  title?: string;
}

export const SoccerField = ({
  players = [],
  formation,
  showHeatmap = false,
  heatmapData = [],
  passNetwork = [],
  height = 600,
  interactive = true,
  title
}: SoccerFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    drawField(ctx, width, height);

    if (showHeatmap && heatmapData.length > 0) {
      drawHeatmap(ctx, width, height, heatmapData);
    }

    if (passNetwork.length > 0) {
      drawPassingNetwork(ctx, width, height, players, passNetwork);
    }

    drawPlayers(ctx, width, height, players, selectedPlayer, hoveredPlayer);

  }, [players, showHeatmap, heatmapData, passNetwork, selectedPlayer, hoveredPlayer]);

  const drawField = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const fieldColor = '#1a5f3e';
    const lineColor = '#ffffff';
    const lineWidth = 2;

    ctx.fillStyle = fieldColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.beginPath();
    ctx.moveTo(width / 2, 20);
    ctx.lineTo(width / 2, height - 20);
    ctx.stroke();

    const centerX = width / 2;
    const centerY = height / 2;
    const centerCircleRadius = 60;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerCircleRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

    const penaltyBoxWidth = (width - 40) * 0.35;
    const penaltyBoxHeight = 120;

    ctx.strokeRect(20, height / 2 - penaltyBoxHeight / 2, penaltyBoxWidth, penaltyBoxHeight);
    ctx.strokeRect(width - 20 - penaltyBoxWidth, height / 2 - penaltyBoxHeight / 2, penaltyBoxWidth, penaltyBoxHeight);

    const goalBoxWidth = (width - 40) * 0.15;
    const goalBoxHeight = 60;

    ctx.strokeRect(20, height / 2 - goalBoxHeight / 2, goalBoxWidth, goalBoxHeight);
    ctx.strokeRect(width - 20 - goalBoxWidth, height / 2 - goalBoxHeight / 2, goalBoxWidth, goalBoxHeight);

    const penaltySpotDistance = (width - 40) * 0.15;
    ctx.beginPath();
    ctx.arc(20 + penaltySpotDistance, height / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width - 20 - penaltySpotDistance, height / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    const cornerRadius = 8;
    [
      { x: 20, y: 20 },
      { x: width - 20, y: 20 },
      { x: 20, y: height - 20 },
      { x: width - 20, y: height - 20 }
    ].forEach(corner => {
      ctx.beginPath();
      if (corner.x === 20 && corner.y === 20) {
        ctx.arc(corner.x, corner.y, cornerRadius, 0, Math.PI / 2);
      } else if (corner.x === width - 20 && corner.y === 20) {
        ctx.arc(corner.x, corner.y, cornerRadius, Math.PI / 2, Math.PI);
      } else if (corner.x === 20 && corner.y === height - 20) {
        ctx.arc(corner.x, corner.y, cornerRadius, -Math.PI / 2, 0);
      } else {
        ctx.arc(corner.x, corner.y, cornerRadius, Math.PI, -Math.PI / 2);
      }
      ctx.stroke();
    });
  };

  const drawHeatmap = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: Array<{ x: number; y: number; intensity: number }>
  ) => {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);

    data.forEach(point => {
      const x = 20 + (point.x / 100) * (width - 40);
      const y = 20 + (point.y / 100) * (height - 40);

      gradient.addColorStop(0, `rgba(255, 0, 0, ${point.intensity * 0.6})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 0, ${point.intensity * 0.3})`);
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  const drawPassingNetwork = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    players: PlayerPosition[],
    network: Array<{ from: string; to: string; count: number }>
  ) => {
    const playerMap = new Map(players.map(p => [p.id, p]));
    const maxPasses = Math.max(...network.map(n => n.count), 1);

    network.forEach(({ from, to, count }) => {
      const fromPlayer = playerMap.get(from);
      const toPlayer = playerMap.get(to);

      if (!fromPlayer || !toPlayer) return;

      const x1 = 20 + (fromPlayer.x / 100) * (width - 40);
      const y1 = 20 + (fromPlayer.y / 100) * (height - 40);
      const x2 = 20 + (toPlayer.x / 100) * (width - 40);
      const y2 = 20 + (toPlayer.y / 100) * (height - 40);

      const opacity = 0.3 + (count / maxPasses) * 0.5;
      const lineWidth = 1 + (count / maxPasses) * 4;

      ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLength = 10;
      const arrowAngle = Math.PI / 6;

      ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - arrowLength * Math.cos(angle - arrowAngle),
        y2 - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.lineTo(
        x2 - arrowLength * Math.cos(angle + arrowAngle),
        y2 - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.closePath();
      ctx.fill();
    });
  };

  const drawPlayers = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    players: PlayerPosition[],
    selected: string | null,
    hovered: string | null
  ) => {
    players.forEach(player => {
      const x = 20 + (player.x / 100) * (width - 40);
      const y = 20 + (player.y / 100) * (height - 40);

      const isSelected = selected === player.id;
      const isHovered = hovered === player.id;
      const radius = isSelected || isHovered ? 20 : 16;

      ctx.fillStyle = isSelected ? '#10b981' : player.isActive !== false ? '#3b82f6' : '#6b7280';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = isHovered || isSelected ? 3 : 2;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(player.number.toString(), x, y);

      if (isSelected || isHovered) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(player.name, x, y + radius + 14);
      }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;

    let clicked: string | null = null;

    players.forEach(player => {
      const px = 20 + (player.x / 100) * (width - 40);
      const py = 20 + (player.y / 100) * (height - 40);
      const distance = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));

      if (distance <= 20) {
        clicked = player.id;
      }
    });

    setSelectedPlayer(clicked);
  };

  const handleCanvasHover = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;

    let hovered: string | null = null;

    players.forEach(player => {
      const px = 20 + (player.x / 100) * (width - 40);
      const py = 20 + (player.y / 100) * (height - 40);
      const distance = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));

      if (distance <= 20) {
        hovered = player.id;
      }
    });

    setHoveredPlayer(hovered);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  };

  return (
    <Card className="p-4 sm:p-6 bg-card/50 border-border backdrop-blur-sm overflow-hidden">
      {(title || formation) && (
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          {title && <h3 className="text-lg font-bold text-foreground">{title}</h3>}
          {formation && (
            <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-primary/10 rounded-full">
              Formation: {formation}
            </span>
          )}
        </div>
      )}

      <div className="relative w-full overflow-x-auto">
        <canvas
          ref={canvasRef}
          width={800}
          height={height}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasHover}
          onMouseLeave={() => setHoveredPlayer(null)}
          className="w-full h-auto max-w-full rounded-lg shadow-lg"
          style={{ minWidth: '300px' }}
        />
      </div>

      {selectedPlayer && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
          <p className="text-sm font-medium text-foreground">
            Selected: {players.find(p => p.id === selectedPlayer)?.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click anywhere on the field to deselect
          </p>
        </div>
      )}
    </Card>
  );
};
