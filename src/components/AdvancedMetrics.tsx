import { Card } from "@/components/ui/card";
import { Activity, Zap, Heart, TrendingUp, Clock, Target } from "lucide-react";

const advancedMetrics = [
  {
    title: "Sprint Intensity",
    value: "87%",
    icon: Zap,
    trend: "+5% vs avg",
    color: "text-warning",
    bgColor: "bg-warning/10"
  },
  {
    title: "Acceleration Events",
    value: "124",
    icon: Activity,
    trend: "+12 vs last session",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "HR Variability",
    value: "45ms",
    icon: Heart,
    trend: "Optimal range",
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    title: "Power Output",
    value: "8.2 W/kg",
    icon: TrendingUp,
    trend: "+0.3 vs baseline",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Time in Zone 4+",
    value: "28 min",
    icon: Clock,
    trend: "High intensity",
    color: "text-warning",
    bgColor: "bg-warning/10"
  },
  {
    title: "Movement Efficiency",
    value: "91%",
    icon: Target,
    trend: "Excellent",
    color: "text-success",
    bgColor: "bg-success/10"
  },
];

export const AdvancedMetrics = () => {
  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Advanced Performance Metrics</h2>
          <p className="text-muted-foreground">Deep dive into biomechanics and physiological data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card/50 border-border backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded">
                    Live
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  <p className={`text-xs ${metric.color} font-medium`}>{metric.trend}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
