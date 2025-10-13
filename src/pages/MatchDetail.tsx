import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MatchResultDetail } from "@/components/MatchResultDetail";
import { mockMatchResults } from "@/utils/mockData";

const MatchDetail = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const match = mockMatchResults.find(m => m.matchId === matchId) || mockMatchResults[0];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/matches')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Matches
        </Button>

        <MatchResultDetail match={match} />
      </div>
    </div>
  );
};

export default MatchDetail;
