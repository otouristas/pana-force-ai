import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, LineChart } from "lucide-react";

interface PreMatchDossierProps {
  homeTeam: string;
  awayTeam: string;
}

export function PreMatchDossier({ homeTeam, awayTeam }: PreMatchDossierProps) {
  const enabled = import.meta.env.VITE_FEATURE_INTEL_ALERTS === "true";
  if (!enabled) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Likely Opponent XI & Formation</h3>
        </div>
        <div className="text-sm text-muted-foreground">Predicted 4-2-3-1 with emphasis on wide overloads. (Placeholder)</div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-success" />
          <h3 className="font-semibold text-foreground">Weaknesses & Opportunities</h3>
        </div>
        <ul className="text-sm list-disc ml-5 space-y-1">
          <li>Right flank vulnerable to switches</li>
          <li>Set-piece near-post weakness</li>
          <li>Midfield transition gaps</li>
        </ul>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <LineChart className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-foreground">Predicted Outcome</h3>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Badge className="bg-primary/20 text-primary">Win 48%</Badge>
          <Badge variant="outline">Draw 25%</Badge>
          <Badge className="bg-destructive/20 text-destructive">Loss 27%</Badge>
        </div>
      </Card>
    </div>
  );
}


