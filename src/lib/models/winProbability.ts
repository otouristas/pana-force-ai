export interface TeamForm {
  lastFiveResults: ReadonlyArray<'W' | 'D' | 'L'>;
  avgXgFor: number;
  avgXgAgainst: number;
}

export interface WinProbabilityInput {
  homeTeam: string;
  awayTeam: string;
  homeElo: number;
  awayElo: number;
  homeForm: TeamForm;
  awayForm: TeamForm;
  isHomeAdvantageEnabled?: boolean;
  injuriesImpactHome?: number; // -0.2 .. 0.2
  injuriesImpactAway?: number; // -0.2 .. 0.2
  oddsHome?: number; // decimal odds
  oddsDraw?: number;
  oddsAway?: number;
}

export interface WinProbabilityResult {
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  factors: ReadonlyArray<string>;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function normalizeToPercentages(values: ReadonlyArray<number>): ReadonlyArray<number> {
  const sum = values.reduce((acc, v) => acc + v, 0) || 1;
  return values.map((v) => (v / sum) * 100);
}

function formRating(form: TeamForm): number {
  const points = form.lastFiveResults.reduce((acc, r) => acc + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
  const xgDiff = form.avgXgFor - form.avgXgAgainst; // typically -1..+1
  return points * 0.02 + xgDiff * 0.5; // scale to ~ -1..+1
}

function oddsToImplied(odds?: number): number | null {
  if (!odds || odds <= 1.0) return null;
  return 1 / odds;
}

export function computePreMatchWinProbability(input: WinProbabilityInput): WinProbabilityResult {
  const factors: string[] = [];

  const eloDiff = input.homeElo - input.awayElo; // positive benefits home
  const eloTerm = clamp(0.5 + eloDiff / 800, 0.15, 0.85); // 800 elo ≈ swing to 85/15
  factors.push(`Elo diff (${Math.round(eloDiff)})`);

  const homeFormScore = formRating(input.homeForm);
  const awayFormScore = formRating(input.awayForm);
  const formTerm = clamp(0.5 + (homeFormScore - awayFormScore) / 10, 0.2, 0.8);
  factors.push(`Form (+${(homeFormScore - awayFormScore).toFixed(2)})`);

  const homeAdvantage = input.isHomeAdvantageEnabled === false ? 0 : 0.07; // ~7% baseline home edge
  const injuriesHome = clamp(input.injuriesImpactHome ?? 0, -0.2, 0.2);
  const injuriesAway = clamp(input.injuriesImpactAway ?? 0, -0.2, 0.2);

  let homeScore = eloTerm * 0.5 + formTerm * 0.35 + 0.5 * 0.15; // mix-in neutral baseline
  homeScore += homeAdvantage;
  homeScore += -injuriesHome * 0.5; // negative impact reduces chance
  homeScore += injuriesAway * 0.4; // opponent injuries help home

  // Convert to provisional trio with draw mass
  const drawBase = 0.27; // typical league draw frequency

  // Odds anchoring if provided
  const impHome = oddsToImplied(input.oddsHome);
  const impDraw = oddsToImplied(input.oddsDraw);
  const impAway = oddsToImplied(input.oddsAway);
  if (impHome && impDraw && impAway) {
    const k = 0.35; // anchoring strength
    const norm = impHome + impDraw + impAway;
    const aH = (impHome / norm) * 100;
    const aD = (impDraw / norm) * 100;
    const aA = (impAway / norm) * 100;
    const prelim = normalizeToPercentages([homeScore, drawBase, 1 - homeScore - drawBase]);
    const mixed = [
      prelim[0] * (1 - k) + aH * k,
      prelim[1] * (1 - k) + aD * k,
      prelim[2] * (1 - k) + aA * k,
    ];
    const [h, d, a] = normalizeToPercentages(mixed);
    factors.push('Odds anchored');
    return { homeWinPct: h, drawPct: d, awayWinPct: a, factors };
  }

  const [h, d, a] = normalizeToPercentages([homeScore, drawBase, 1 - homeScore - drawBase]);
  return { homeWinPct: h, drawPct: d, awayWinPct: a, factors };
}

export interface InMatchInput {
  minute: number; // 0..90
  homeGoals: number;
  awayGoals: number;
  preMatch: WinProbabilityResult;
}

export function computeInMatchWinProbability(input: InMatchInput): WinProbabilityResult {
  const timeFactor = clamp(input.minute / 90, 0, 1);
  const goalDiff = input.homeGoals - input.awayGoals;
  // Logistic tilt by goal difference and time elapsed
  const tilt = clamp(0.5 + goalDiff * (0.18 + 0.22 * timeFactor), 0.05, 0.95);
  const drawShrink = clamp(0.27 * (1 - timeFactor * 0.9), 0.03, 0.27);
  const [h, d, a] = normalizeToPercentages([tilt, drawShrink, 1 - tilt - drawShrink]);
  return { homeWinPct: h, drawPct: d, awayWinPct: a, factors: ['Live model: goals/time'] };
}


