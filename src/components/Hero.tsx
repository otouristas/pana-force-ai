import { Button } from "@/components/ui/button";
import { Activity, Brain, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="PanaAI Performance Analytics" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      {/* Gradient Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-glow opacity-50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center space-y-8">
        {/* Logo/Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Performance Intelligence</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
          PanaAI
          <span className="block mt-2 bg-gradient-primary bg-clip-text text-transparent">
            Performance Intelligence
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Transform raw match and training data into actionable insights. 
          <span className="block mt-2 text-foreground font-semibold">
            Predict fatigue. Prevent injuries. Optimize performance.
          </span>
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Real-time Monitoring</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">ML Predictions</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Performance Optimization</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8"
          >
            View Dashboard
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary/30 hover:bg-primary/10 text-lg px-8"
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};
