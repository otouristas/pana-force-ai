import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, Target, Search, Star, DollarSign, Award, AlertTriangle } from "lucide-react";
import { mockRecruitmentTargets, mockPlayerValuations, mockTransferHistory } from "@/utils/advancedMockData";
import { Progress } from "@/components/ui/progress";

const Recruitment = () => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/20 text-destructive border-destructive/50';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/50';
      case 'low':
        return 'bg-success/20 text-success border-success/50';
      default:
        return 'bg-muted';
    }
  };

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case 'easy':
        return 'text-success';
      case 'moderate':
        return 'text-warning';
      case 'difficult':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'declining':
        return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />;
      default:
        return <TrendingUp className="w-4 h-4 text-muted-foreground rotate-90" />;
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    return `€${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              Recruitment & Transfer Intelligence
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              AI-powered player scouting and market valuation analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/50 border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Active Targets</p>
            <p className="text-3xl font-bold text-foreground">{mockRecruitmentTargets.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {mockRecruitmentTargets.filter(t => t.priorityLevel === 'high').length} high priority
            </p>
          </Card>

          <Card className="p-4 bg-card/50 border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Squad Value</p>
            <p className="text-3xl font-bold text-foreground">€145M</p>
            <p className="text-xs text-success mt-1">+12% this season</p>
          </Card>

          <Card className="p-4 bg-card/50 border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Transfer Budget</p>
            <p className="text-3xl font-bold text-foreground">€35M</p>
            <p className="text-xs text-muted-foreground mt-1">Winter window</p>
          </Card>

          <Card className="p-4 bg-card/50 border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Avg Squad Age</p>
            <p className="text-3xl font-bold text-foreground">26.3</p>
            <p className="text-xs text-success mt-1">Optimal balance</p>
          </Card>
        </div>

        <Tabs defaultValue="targets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="targets">Scout Targets</TabsTrigger>
            <TabsTrigger value="valuations">Player Values</TabsTrigger>
            <TabsTrigger value="history">Transfer History</TabsTrigger>
          </TabsList>

          <TabsContent value="targets" className="space-y-6 mt-6">
            <Card className="p-6 bg-card/50 border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Recruitment Watchlist
                </h3>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Add Target
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {mockRecruitmentTargets.map((target) => (
                  <Card
                    key={target.id}
                    className={`p-4 bg-background/50 border-border hover:border-primary/50 transition-all cursor-pointer ${
                      selectedTarget === target.id ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedTarget(selectedTarget === target.id ? null : target.id)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-foreground">{target.playerName}</h4>
                            <Badge className={getPriorityColor(target.priorityLevel)}>
                              {target.priorityLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {target.currentTeam}
                            </span>
                            <span>•</span>
                            <span>{target.position}</span>
                            <span>•</span>
                            <span>{target.age} years</span>
                            <span>•</span>
                            <span>{target.nationality}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground mb-1">
                            {formatCurrency(target.estimatedValue)}
                          </div>
                          <Badge className="bg-primary/20 text-primary border-primary/50">
                            Fit: {target.fitScore}/10
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center p-2 bg-background rounded">
                          <p className="text-xs text-muted-foreground mb-1">Tactical Fit</p>
                          <Progress value={target.fitScore * 10} className="h-2 mb-1" />
                          <p className="text-sm font-semibold">{target.fitScore}/10</p>
                        </div>
                        <div className="text-center p-2 bg-background rounded">
                          <p className="text-xs text-muted-foreground mb-1">Feasibility</p>
                          <p className={`text-sm font-semibold capitalize ${getFeasibilityColor(target.acquisitionFeasibility)}`}>
                            {target.acquisitionFeasibility}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-background rounded">
                          <p className="text-xs text-muted-foreground mb-1">Offer</p>
                          <p className="text-sm font-semibold">{formatCurrency(target.recommendedOffer)}</p>
                        </div>
                        <div className="text-center p-2 bg-background rounded">
                          <p className="text-xs text-muted-foreground mb-1">Status</p>
                          <Badge variant="outline" className="text-xs">Monitoring</Badge>
                        </div>
                      </div>

                      {selectedTarget === target.id && (
                        <div className="space-y-4 pt-4 border-t border-border animate-fade-in">
                          <div>
                            <h5 className="font-semibold text-foreground mb-2">Tactical Fit Analysis</h5>
                            <p className="text-sm text-muted-foreground">{target.tacticalFitAnalysis}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Star className="w-4 h-4 text-success" />
                                Strengths
                              </h5>
                              <div className="space-y-1">
                                {target.strengths.map((strength, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                                    <span className="text-muted-foreground">{strength}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-warning" />
                                Weaknesses
                              </h5>
                              <div className="space-y-1">
                                {target.weaknesses.map((weakness, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>
                                    <span className="text-muted-foreground">{weakness}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <h5 className="font-semibold text-foreground mb-2">Scouting Notes</h5>
                            <p className="text-sm text-muted-foreground">{target.scoutingNotes}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1">Request Full Report</Button>
                            <Button variant="outline" className="flex-1">Schedule Scout Visit</Button>
                            <Button variant="outline">Contact Agent</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="valuations" className="space-y-6 mt-6">
            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                AI Player Valuations
              </h3>

              <div className="space-y-4">
                {mockPlayerValuations.map((valuation) => (
                  <Card key={valuation.playerId} className="p-4 bg-background/50 border-border">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-foreground mb-2">{valuation.playerName}</h4>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(valuation.valueTrend)}
                            <span className="text-sm font-medium capitalize">{valuation.valueTrend}</span>
                          </div>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-primary/50">
                          Confidence: {(valuation.confidenceScore * 100).toFixed(0)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-background rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                          <p className="text-xl font-bold text-foreground">{formatCurrency(valuation.currentValue)}</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                          <p className="text-xs text-muted-foreground mb-1">AI Predicted</p>
                          <p className="text-xl font-bold text-primary">{formatCurrency(valuation.aiPredictedValue)}</p>
                        </div>
                        <div className="p-3 bg-background rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Peak Value</p>
                          <p className="text-xl font-bold text-foreground">{formatCurrency(valuation.peakValue)}</p>
                        </div>
                        <div className="p-3 bg-success/10 rounded-lg border border-success/30">
                          <p className="text-xs text-muted-foreground mb-1">Potential Gain</p>
                          <p className="text-xl font-bold text-success">
                            +{formatCurrency(valuation.aiPredictedValue - valuation.currentValue)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-foreground mb-3">Valuation Factors</h5>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {Object.entries(valuation.valuationFactors).map(([factor, score]) => (
                            <div key={factor} className="text-center">
                              <div className="mb-2">
                                <Progress value={score * 100} className="h-2" />
                              </div>
                              <p className="text-xs text-muted-foreground capitalize">
                                {factor.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-sm font-semibold">{(score * 100).toFixed(0)}%</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Recent Transfer Activity</h3>

              <div className="space-y-3">
                {mockTransferHistory.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-foreground">{transfer.playerName}</h4>
                        <Badge variant="outline" className="text-xs">{transfer.position}</Badge>
                        <Badge className={
                          transfer.transferType === 'permanent' ? 'bg-success/20 text-success border-success/50' :
                          transfer.transferType === 'loan' ? 'bg-warning/20 text-warning border-warning/50' :
                          'bg-muted'
                        }>
                          {transfer.transferType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{transfer.fromTeam}</span>
                        <span>→</span>
                        <span className="text-primary font-medium">{transfer.toTeam}</span>
                        <span>•</span>
                        <span>{transfer.transferDate.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground mb-1">
                        {formatCurrency(transfer.feeEur)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transfer.contractLength} year contract
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-destructive">€7.0M</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Received</p>
                    <p className="text-2xl font-bold text-success">€3.5M</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Net Spend</p>
                    <p className="text-2xl font-bold text-foreground">€3.5M</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Transfers</p>
                    <p className="text-2xl font-bold text-foreground">8</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Recruitment;
