import { PreMatchDossier } from "@/components/PreMatchDossier";
import { IntelAlerts } from "@/components/IntelAlerts";
import { Card } from "@/components/ui/card";
import { OpponentLineup } from "@/components/OpponentLineup";

const Dossier = () => {
  const homeTeam = "Panathinaikos";
  const awayTeam = "Olympiacos";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pre‑match Dossier</h1>
        </div>

        <PreMatchDossier homeTeam={homeTeam} awayTeam={awayTeam} />

        <OpponentLineup opponent={awayTeam} />

        <Card className="p-4">
          <h2 className="text-lg font-bold text-foreground mb-3">Latest Opponent Intel</h2>
          <IntelAlerts limit={8} />
        </Card>
      </div>
    </div>
  );
};

export default Dossier;


