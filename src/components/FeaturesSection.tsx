import { Card } from "@/components/ui/card";
import { Brain, Activity, Shield, BarChart3, Users, Target } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Fatigue Prediction",
    description: "Machine learning models detect early signs of player fatigue before it impacts performance",
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Live GPS and heart rate data from training sessions and matches",
  },
  {
    icon: Shield,
    title: "Injury Prevention",
    description: "Predictive analytics identify soft-tissue injury risks up to 72 hours in advance",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Comprehensive KPIs: distance, sprints, player load, and recovery metrics",
  },
  {
    icon: Users,
    title: "Team Intelligence",
    description: "Aggregate insights to optimize tactical decisions and squad rotation",
  },
  {
    icon: Target,
    title: "Personalized Thresholds",
    description: "Individual baselines based on age, position, and historical performance data",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Built for Modern Football
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Data-verified performance intelligence for every aspect of the game
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-6 bg-card/50 border-border backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-glow group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
