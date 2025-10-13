import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface RiskZoneIndicatorProps {
  level: "safe" | "warning" | "danger";
  playerName: string;
  fatigueScore: number;
}

export const RiskZoneIndicator = ({ level, playerName, fatigueScore }: RiskZoneIndicatorProps) => {
  const getZoneConfig = () => {
    switch (level) {
      case "safe":
        return {
          color: "success",
          label: "Green Zone",
          icon: CheckCircle,
          description: "Optimal performance condition",
          bgGlow: "bg-success/10",
        };
      case "warning":
        return {
          color: "warning",
          label: "Yellow Zone",
          icon: AlertTriangle,
          description: "Monitor closely, reduce load",
          bgGlow: "bg-warning/10",
        };
      case "danger":
        return {
          color: "destructive",
          label: "Red Zone",
          icon: AlertCircle,
          description: "High risk - immediate rest required",
          bgGlow: "bg-destructive/10",
        };
    }
  };

  const config = getZoneConfig();
  const Icon = config.icon;

  return (
    <Card className="relative overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
      <div className={`absolute inset-0 ${config.bgGlow} opacity-20`} />
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">{playerName}</h3>
            <p className="text-sm text-muted-foreground">Fatigue Score: {fatigueScore}</p>
          </div>
          <Icon className={`w-8 h-8 text-${config.color}`} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold text-${config.color}`}>{config.label}</span>
            <span className="text-xs text-muted-foreground">{config.description}</span>
          </div>
          
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full bg-${config.color} transition-all duration-500`}
              style={{ width: `${fatigueScore}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
