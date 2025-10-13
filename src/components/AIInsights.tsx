import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AIFormattedText } from "./AIFormattedText";

interface AIInsightsProps {
  playerName: string;
  playerData: {
    distance: number;
    sprints: number;
    heartRate: number;
    playerLoad: number;
    recovery: number;
    fatigueScore: number;
  };
}

export const AIInsights = ({ playerName, playerData }: AIInsightsProps) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<string>("");

  const analyzePerformance = async (type: "injury_risk" | "performance_prediction" | "training_recommendation") => {
    setLoading(true);
    setAnalysisType(type);
    setInsights(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        body: {
          playerData: {
            name: playerName,
            ...playerData
          },
          analysisType: type
        }
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("AI rate limit reached. Please wait a moment and try again.");
        } else if (error.message?.includes("402")) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          toast.error("Failed to analyze performance. Please try again.");
        }
        console.error("Analysis error:", error);
        return;
      }

      setInsights(data.analysis);
      toast.success("AI analysis complete!");
    } catch (err) {
      console.error("Error calling AI:", err);
      toast.error("Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  const getAnalysisTitle = () => {
    switch (analysisType) {
      case "injury_risk":
        return "🩺 Injury Risk Assessment";
      case "performance_prediction":
        return "📊 Performance Prediction";
      case "training_recommendation":
        return "💪 Training Recommendations";
      default:
        return "🧠 AI Analysis";
    }
  };

  return (
    <Card className="p-6 bg-card/50 border-primary/30 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-foreground">AI Performance Intelligence</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Get AI-powered insights for {playerName} based on current performance data
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => analyzePerformance("injury_risk")}
            disabled={loading}
            variant="outline"
            className="border-destructive/50 hover:bg-destructive/10"
          >
            {loading && analysisType === "injury_risk" ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <AlertCircle className="w-4 h-4 mr-2" />
            )}
            Injury Risk
          </Button>

          <Button
            onClick={() => analyzePerformance("performance_prediction")}
            disabled={loading}
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
          >
            {loading && analysisType === "performance_prediction" ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            Performance Prediction
          </Button>

          <Button
            onClick={() => analyzePerformance("training_recommendation")}
            disabled={loading}
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
          >
            {loading && analysisType === "training_recommendation" ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            Training Plan
          </Button>
        </div>

        {insights && (
          <div className="mt-6 p-4 bg-background/50 rounded-lg border border-primary/20 animate-fade-in">
            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
              {getAnalysisTitle()}
            </h4>
            <AIFormattedText text={insights} />
          </div>
        )}
      </div>
    </Card>
  );
};
