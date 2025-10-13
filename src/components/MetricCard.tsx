import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  riskLevel?: "safe" | "warning" | "danger";
}

export const MetricCard = ({ title, value, unit, icon: Icon, trend, riskLevel }: MetricCardProps) => {
  const getRiskColor = () => {
    if (!riskLevel) return "";
    switch (riskLevel) {
      case "safe": return "border-success/50 shadow-[0_0_20px_hsl(var(--success)/0.2)]";
      case "warning": return "border-warning/50 shadow-[0_0_20px_hsl(var(--warning)/0.2)]";
      case "danger": return "border-destructive/50 shadow-[0_0_20px_hsl(var(--destructive)/0.2)]";
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    switch (trend) {
      case "up": return "text-success";
      case "down": return "text-destructive";
      case "neutral": return "text-muted-foreground";
    }
  };

  return (
    <Card className={`relative overflow-hidden border-2 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getRiskColor()}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 blur-3xl" />
      <div className="relative p-6 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-foreground">
            {value}
            {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
          </p>
          {trend && (
            <p className={`text-xs font-medium ${getTrendColor()}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} vs last session
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
