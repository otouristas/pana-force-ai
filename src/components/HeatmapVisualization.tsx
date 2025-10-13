import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";

interface HeatmapData {
  zoneX: number;
  zoneY: number;
  intensity: number;
  touches?: number;
  actions?: number;
}

interface HeatmapVisualizationProps {
  playerName: string;
  data: HeatmapData[];
  matchPeriod?: 'full' | 'first-half' | 'second-half';
  dataType?: 'all' | 'defensive' | 'offensive' | 'touches';
  height?: number;
  showLegend?: boolean;
}

export const HeatmapVisualization = ({
  playerName,
  data,
  matchPeriod = 'full',
  dataType = 'all',
  height = 500,
  showLegend = true
}: HeatmapVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(matchPeriod);
  const [selectedDataType, setSelectedDataType] = useState(dataType);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    drawField(ctx, width, height);
    drawHeatmapGrid(ctx, width, height, data);

  }, [data, selectedPeriod, selectedDataType]);

  const drawField = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const fieldColor = '#1a5f3e';
    const lineColor = 'rgba(255, 255, 255, 0.3)';
    const lineWidth = 1.5;

    ctx.fillStyle = fieldColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    ctx.strokeRect(15, 15, width - 30, height - 30);

    ctx.beginPath();
    ctx.moveTo(width / 2, 15);
    ctx.lineTo(width / 2, height - 15);
    ctx.stroke();

    const centerX = width / 2;
    const centerY = height / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.stroke();

    const penaltyBoxWidth = (width - 30) * 0.35;
    const penaltyBoxHeight = 100;
    ctx.strokeRect(15, height / 2 - penaltyBoxHeight / 2, penaltyBoxWidth, penaltyBoxHeight);
    ctx.strokeRect(width - 15 - penaltyBoxWidth, height / 2 - penaltyBoxHeight / 2, penaltyBoxWidth, penaltyBoxHeight);
  };

  const drawHeatmapGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    heatmapData: HeatmapData[]
  ) => {
    const fieldWidth = width - 30;
    const fieldHeight = height - 30;
    const gridCols = 12;
    const gridRows = 8;
    const cellWidth = fieldWidth / gridCols;
    const cellHeight = fieldHeight / gridRows;

    const maxIntensity = Math.max(...heatmapData.map(d => d.intensity), 1);

    heatmapData.forEach(cell => {
      const x = 15 + (cell.zoneX * cellWidth);
      const y = 15 + (cell.zoneY * cellHeight);
      const normalizedIntensity = cell.intensity / maxIntensity;

      const color = getHeatmapColor(normalizedIntensity);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellWidth, cellHeight);

      if (normalizedIntensity > 0.3) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    });
  };

  const getHeatmapColor = (intensity: number): string => {
    if (intensity < 0.2) return `rgba(0, 100, 255, ${0.1 + intensity * 0.2})`;
    if (intensity < 0.4) return `rgba(0, 200, 100, ${0.2 + intensity * 0.3})`;
    if (intensity < 0.6) return `rgba(255, 255, 0, ${0.3 + intensity * 0.3})`;
    if (intensity < 0.8) return `rgba(255, 150, 0, ${0.4 + intensity * 0.3})`;
    return `rgba(255, 0, 0, ${0.5 + intensity * 0.4})`;
  };

  const mockData: HeatmapData[] = data.length > 0 ? data : [
    { zoneX: 6, zoneY: 3, intensity: 0.9, touches: 45, actions: 28 },
    { zoneX: 7, zoneY: 3, intensity: 0.85, touches: 38, actions: 22 },
    { zoneX: 6, zoneY: 4, intensity: 0.8, touches: 35, actions: 20 },
    { zoneX: 5, zoneY: 3, intensity: 0.75, touches: 32, actions: 18 },
    { zoneX: 7, zoneY: 4, intensity: 0.7, touches: 28, actions: 16 },
    { zoneX: 8, zoneY: 3, intensity: 0.65, touches: 25, actions: 15 },
    { zoneX: 5, zoneY: 4, intensity: 0.6, touches: 22, actions: 12 },
    { zoneX: 6, zoneY: 2, intensity: 0.55, touches: 20, actions: 10 },
    { zoneX: 8, zoneY: 4, intensity: 0.5, touches: 18, actions: 9 },
    { zoneX: 4, zoneY: 3, intensity: 0.45, touches: 15, actions: 8 },
    { zoneX: 7, zoneY: 2, intensity: 0.4, touches: 12, actions: 6 },
    { zoneX: 5, zoneY: 2, intensity: 0.35, touches: 10, actions: 5 },
    { zoneX: 9, zoneY: 3, intensity: 0.3, touches: 8, actions: 4 },
    { zoneX: 4, zoneY: 4, intensity: 0.25, touches: 6, actions: 3 },
    { zoneX: 8, zoneY: 2, intensity: 0.2, touches: 5, actions: 2 },
  ];

  return (
    <Card className="p-4 sm:p-6 bg-card/50 border-border backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Player Heatmap</h3>
            <p className="text-sm text-muted-foreground">{playerName}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Match</SelectItem>
                <SelectItem value="first-half">First Half</SelectItem>
                <SelectItem value="second-half">Second Half</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDataType} onValueChange={(value) => setSelectedDataType(value as any)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="offensive">Offensive</SelectItem>
                <SelectItem value="defensive">Defensive</SelectItem>
                <SelectItem value="touches">Touches</SelectItem>
              </SelectContent>
            </Select>
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

        {showLegend && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 rounded" style={{ background: 'rgba(0, 100, 255, 0.3)' }} />
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 rounded" style={{ background: 'rgba(0, 200, 100, 0.5)' }} />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 rounded" style={{ background: 'rgba(255, 255, 0, 0.6)' }} />
              <span className="text-xs text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 rounded" style={{ background: 'rgba(255, 0, 0, 0.7)' }} />
              <span className="text-xs text-muted-foreground">Very High</span>
            </div>
          </div>
        )}

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
            <TabsTrigger value="summary" className="text-xs sm:text-sm">Summary</TabsTrigger>
            <TabsTrigger value="zones" className="text-xs sm:text-sm">Top Zones</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Touches</p>
                <p className="text-lg font-bold text-foreground">
                  {mockData.reduce((sum, d) => sum + (d.touches || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Active Zones</p>
                <p className="text-lg font-bold text-foreground">{mockData.length}</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg col-span-2 sm:col-span-1">
                <p className="text-xs text-muted-foreground">Avg Zone Intensity</p>
                <p className="text-lg font-bold text-foreground">
                  {(mockData.reduce((sum, d) => sum + d.intensity, 0) / mockData.length * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="zones" className="space-y-2 mt-4">
            {mockData
              .sort((a, b) => b.intensity - a.intensity)
              .slice(0, 5)
              .map((zone, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Zone ({zone.zoneX}, {zone.zoneY})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {zone.touches} touches • {zone.actions} actions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      {(zone.intensity * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="insights" className="space-y-2 mt-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <h4 className="text-sm font-semibold text-foreground mb-2">Positional Analysis</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Primary operating zone: Central midfield (60% of activity)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Strong right-side preference with 45% more touches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Advanced positioning compared to role average</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Limited defensive third presence (12% of activity)</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
