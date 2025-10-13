import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Target, Award, Calendar, Users } from "lucide-react";
import { mockCompetitions, mockUCLStandings, mockSuperLeagueStandings } from "@/utils/advancedMockData";

const Competitions = () => {
  const getQualificationBadge = (status?: string) => {
    if (!status) return null;

    const badges: Record<string, { color: string; text: string }> = {
      'Round of 16': { color: 'bg-success/20 text-success border-success/50', text: 'Round of 16' },
      'Playoff Round': { color: 'bg-primary/20 text-primary border-primary/50', text: 'Playoff' },
      'Europa League': { color: 'bg-warning/20 text-warning border-warning/50', text: 'UEL' },
      'Eliminated': { color: 'bg-destructive/20 text-destructive border-destructive/50', text: 'Out' }
    };

    const badge = badges[status] || { color: 'bg-muted', text: status };
    return <Badge className={badge.color}>{badge.text}</Badge>;
  };

  const renderStandingsTable = (standings: typeof mockUCLStandings, showQualification = false) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-xs font-semibold text-muted-foreground">#</th>
            <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Team</th>
            <th className="text-center p-3 text-xs font-semibold text-muted-foreground">P</th>
            <th className="text-center p-3 text-xs font-semibold text-muted-foreground">W</th>
            <th className="text-center p-3 text-xs font-semibold text-muted-foreground">D</th>
            <th className="text-center p-3 text-xs font-semibold text-muted-foreground">L</th>
            <th className="text-center p-3 text-xs font-semibold text-muted-foreground">GF</th>
            <th className="text-center p-3 text-xs font-semibold text-muted-foreground">GA</th>
            <th className="text-center p-3 text-xs font-semibold text-muted-foreground">GD</th>
            <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Pts</th>
            <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Form</th>
            {showQualification && <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Status</th>}
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr
              key={team.id}
              className={`border-b border-border hover:bg-muted/50 transition-colors ${
                team.teamName === 'Panathinaikos' ? 'bg-primary/5' : ''
              }`}
            >
              <td className="p-3 text-sm font-semibold">{team.position}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${team.teamName === 'Panathinaikos' ? 'text-primary' : ''}`}>
                    {team.teamName}
                  </span>
                </div>
              </td>
              <td className="p-3 text-center text-sm">{team.played}</td>
              <td className="p-3 text-center text-sm">{team.won}</td>
              <td className="p-3 text-center text-sm">{team.drawn}</td>
              <td className="p-3 text-center text-sm">{team.lost}</td>
              <td className="p-3 text-center text-sm">{team.goalsFor}</td>
              <td className="p-3 text-center text-sm">{team.goalsAgainst}</td>
              <td className={`p-3 text-center text-sm font-semibold ${
                team.goalDifference > 0 ? 'text-success' : team.goalDifference < 0 ? 'text-destructive' : ''
              }`}>
                {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
              </td>
              <td className="p-3 text-center text-sm font-bold">{team.points}</td>
              <td className="p-3 text-center">
                <div className="flex gap-1 justify-center">
                  {team.form.split('').map((result, idx) => (
                    <span
                      key={idx}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        result === 'W' ? 'bg-success/20 text-success' :
                        result === 'D' ? 'bg-warning/20 text-warning' :
                        'bg-destructive/20 text-destructive'
                      }`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </td>
              {showQualification && (
                <td className="p-3 text-center">
                  {getQualificationBadge(team.qualificationStatus)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const uclComp = mockCompetitions.find(c => c.id === 'ucl-2024');
  const superLeagueComp = mockCompetitions.find(c => c.id === 'super-league-gr');

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              Competition Overview
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Track performance across all competitions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockCompetitions.map((comp) => (
            <Card key={comp.id} className="p-4 bg-card/50 border-border hover:border-primary/50 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {comp.competitionType === 'uefa' ? 'UEFA' : comp.competitionType === 'domestic_league' ? 'League' : 'Cup'}
                </Badge>
              </div>
              <h3 className="font-bold text-foreground mb-1">{comp.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{comp.currentSeason}</p>

              <div className="space-y-2">
                {comp.id === 'ucl-2024' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Position</span>
                      <span className="font-semibold text-success">1st</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-semibold text-primary">Qualified</span>
                    </div>
                  </>
                )}
                {comp.id === 'super-league-gr' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Position</span>
                      <span className="font-semibold text-success">1st</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Points</span>
                      <span className="font-semibold">33</span>
                    </div>
                  </>
                )}
                {comp.id === 'uel-2024' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-semibold text-muted-foreground">Not Entered</span>
                    </div>
                  </>
                )}
                {comp.id === 'greek-cup' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Round</span>
                      <span className="font-semibold">Quarter Finals</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="ucl" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="ucl">Champions League</TabsTrigger>
            <TabsTrigger value="league">Super League</TabsTrigger>
            <TabsTrigger value="cup">Greek Cup</TabsTrigger>
            <TabsTrigger value="stats">Season Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="ucl" className="space-y-6 mt-6">
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{uclComp?.name}</h2>
                    <p className="text-sm text-muted-foreground">League Phase - {uclComp?.currentSeason}</p>
                  </div>
                </div>
                <Badge className="bg-success/20 text-success border-success/50 text-lg px-4 py-2">
                  1st Place
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-background/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Matches</p>
                  <p className="text-2xl font-bold text-foreground">4</p>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg border border-success/30">
                  <p className="text-xs text-muted-foreground mb-1">Points</p>
                  <p className="text-2xl font-bold text-success">10</p>
                </div>
                <div className="text-center p-3 bg-background/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Goal Diff</p>
                  <p className="text-2xl font-bold text-foreground">+6</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-xs text-muted-foreground mb-1">Form</p>
                  <div className="flex gap-1 justify-center mt-1">
                    {['W', 'W', 'D', 'W'].map((result, idx) => (
                      <span
                        key={idx}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          result === 'W' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-background/50 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Qualification Status
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Currently qualified for Round of 16. Top 8 positions guarantee direct qualification.
                </p>
                <div className="w-full bg-background rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-success to-primary h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Qualification Probability</span>
                  <span className="font-semibold text-success">95%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                League Phase Standings
              </h3>
              {renderStandingsTable(mockUCLStandings, true)}
            </Card>

            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Remaining Fixtures</h3>
              <div className="space-y-3">
                {[
                  { opponent: 'Real Madrid', home: true, date: 'Dec 10', difficulty: 'high' },
                  { opponent: 'Bayern Munich', home: false, date: 'Dec 18', difficulty: 'high' },
                  { opponent: 'PSG', home: true, date: 'Jan 22', difficulty: 'high' },
                  { opponent: 'Benfica', home: false, date: 'Jan 29', difficulty: 'medium' }
                ].map((fixture, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {fixture.home ? 'vs' : '@'} {fixture.opponent}
                        </p>
                        <p className="text-xs text-muted-foreground">{fixture.date}</p>
                      </div>
                    </div>
                    <Badge className={
                      fixture.difficulty === 'high' ? 'bg-destructive/20 text-destructive border-destructive/50' :
                      'bg-warning/20 text-warning border-warning/50'
                    }>
                      {fixture.difficulty === 'high' ? 'Difficult' : 'Moderate'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="league" className="space-y-6 mt-6">
            <Card className="p-6 bg-gradient-to-r from-success/10 to-success/5 border-success/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-success/20 rounded-lg">
                    <Award className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{superLeagueComp?.name}</h2>
                    <p className="text-sm text-muted-foreground">{superLeagueComp?.currentSeason}</p>
                  </div>
                </div>
                <Badge className="bg-success/20 text-success border-success/50 text-lg px-4 py-2">
                  Leaders
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-background/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Played</p>
                  <p className="text-2xl font-bold text-foreground">15</p>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg border border-success/30">
                  <p className="text-xs text-muted-foreground mb-1">Points</p>
                  <p className="text-2xl font-bold text-success">33</p>
                </div>
                <div className="text-center p-3 bg-background/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Goal Diff</p>
                  <p className="text-2xl font-bold text-foreground">+17</p>
                </div>
                <div className="text-center p-3 bg-background/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Wins</p>
                  <p className="text-2xl font-bold text-foreground">10</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    Title Race
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lead over 2nd</span>
                      <span className="font-semibold text-success">+2 pts</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Games remaining</span>
                      <span className="font-semibold">19</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Title probability</span>
                      <span className="font-semibold text-success">68%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">Key Stats</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Win rate</span>
                      <span className="font-semibold">66.7%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Home record</span>
                      <span className="font-semibold text-success">7W-1D-0L</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Away record</span>
                      <span className="font-semibold">3W-2D-2L</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">League Table</h3>
              {renderStandingsTable(mockSuperLeagueStandings, false)}
            </Card>
          </TabsContent>

          <TabsContent value="cup" className="space-y-6 mt-6">
            <Card className="p-6 bg-card/50 border-border">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                Greek Cup - Quarter Finals
              </h3>

              <div className="p-4 bg-background/50 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground">
                  Qualified for the Quarter Finals after defeating lower league opposition. Draw for the next round will take place on December 15th.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Cup Run So Far</h4>
                {[
                  { round: 'Round of 32', opponent: 'Levadiakos', score: '4-0', home: true },
                  { round: 'Round of 16', opponent: 'Volos NFC', score: '3-1', home: false },
                  { round: 'Quarter Finals', opponent: 'TBD', score: '-', home: true }
                ].map((match, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">{match.round}</p>
                      <p className="text-sm text-muted-foreground">
                        {match.home ? 'vs' : '@'} {match.opponent}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{match.score}</p>
                      {match.score !== '-' && (
                        <Badge className="bg-success/20 text-success border-success/50">Win</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 bg-card/50 border-border">
                <h3 className="font-semibold text-foreground mb-4">Overall Season</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Matches</span>
                    <span className="text-lg font-bold text-foreground">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wins</span>
                    <span className="text-lg font-bold text-success">16</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Draws</span>
                    <span className="text-lg font-bold text-warning">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Losses</span>
                    <span className="text-lg font-bold text-destructive">2</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                    <span className="text-lg font-bold text-primary">69.6%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 border-border">
                <h3 className="font-semibold text-foreground mb-4">Goals</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Goals Scored</span>
                    <span className="text-lg font-bold text-success">54</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Goals Conceded</span>
                    <span className="text-lg font-bold text-destructive">21</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Goal Difference</span>
                    <span className="text-lg font-bold text-success">+33</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Goals/Game</span>
                    <span className="text-lg font-bold text-foreground">2.35</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Clean Sheets</span>
                    <span className="text-lg font-bold text-foreground">11</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 border-border">
                <h3 className="font-semibold text-foreground mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Possession</span>
                    <span className="text-lg font-bold text-foreground">58%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pass Accuracy</span>
                    <span className="text-lg font-bold text-foreground">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Shots/Game</span>
                    <span className="text-lg font-bold text-foreground">16.2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">xG</span>
                    <span className="text-lg font-bold text-foreground">48.5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">xG Difference</span>
                    <span className="text-lg font-bold text-success">+5.5</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Competitions;
