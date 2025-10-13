export interface Competition {
  id: string;
  name: string;
  shortName: string;
  competitionType: 'uefa' | 'domestic_league' | 'domestic_cup';
  country: string;
  level: number;
  uefaCoefficient: number;
  prizeMoney: number;
  currentSeason: string;
  logoUrl: string;
}

export interface CompetitionStanding {
  id: string;
  competitionId: string;
  teamId: string;
  teamName: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
  qualificationStatus?: string;
}

export interface TransferRecord {
  id: string;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  transferDate: Date;
  transferType: 'permanent' | 'loan' | 'free';
  feeEur: number;
  contractLength: number;
  position: string;
}

export interface PlayerValuation {
  playerId: string;
  playerName: string;
  currentValue: number;
  aiPredictedValue: number;
  valueTrend: 'rising' | 'stable' | 'declining';
  peakValue: number;
  valuationFactors: {
    performance: number;
    age: number;
    marketDemand: number;
    contractSituation: number;
    injuryHistory: number;
  };
  confidenceScore: number;
}

export interface RecruitmentTarget {
  id: string;
  playerName: string;
  currentTeam: string;
  position: string;
  age: number;
  nationality: string;
  estimatedValue: number;
  priorityLevel: 'high' | 'medium' | 'low';
  fitScore: number;
  tacticalFitAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  acquisitionFeasibility: 'easy' | 'moderate' | 'difficult';
  recommendedOffer: number;
  scoutingNotes: string;
}

export interface OppositionReport {
  id: string;
  opponentName: string;
  matchDate: Date;
  overallThreatLevel: 'high' | 'medium' | 'low';
  predictedFormation: string;
  predictedLineup: { position: string; player: string }[];
  attackingPatterns: string[];
  defensiveVulnerabilities: string[];
  keyPlayersToWatch: { name: string; threat: string; howToNeutralize: string }[];
  setPieceThreatLevel: 'high' | 'medium' | 'low';
  recommendedFormation: string;
  recommendedTactics: string[];
  winProbability: number;
  expectedScoreline: string;
  detailedAnalysis: string;
}

export interface XGTimelinePoint {
  minute: number;
  team: 'home' | 'away';
  playerName: string;
  shotXG: number;
  cumulativeXG: number;
  shotOutcome: 'goal' | 'saved' | 'missed' | 'blocked';
  shotType: string;
}

export interface MomentumPoint {
  minute: number;
  momentumScore: number;
  shiftType: 'positive' | 'negative' | 'neutral';
  triggerEvent: string;
  description: string;
}

export interface RefereeProfile {
  id: string;
  name: string;
  nationality: string;
  experienceYears: number;
  fifaBadge: boolean;
  avgCardsPerMatch: number;
  avgFoulsPerMatch: number;
  penaltyFrequency: number;
  varInterventionRate: number;
  strictRating: number;
  homeBiasScore: number;
}

export interface SocialMediaMetrics {
  platform: string;
  followers: number;
  engagementRate: number;
  postCount: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  sentimentScore: number;
  trendingTopics: string[];
}

export const mockCompetitions: Competition[] = [
  {
    id: 'ucl-2024',
    name: 'UEFA Champions League',
    shortName: 'UCL',
    competitionType: 'uefa',
    country: 'Europe',
    level: 1,
    uefaCoefficient: 2.0,
    prizeMoney: 2000000000,
    currentSeason: '2024/25',
    logoUrl: '/competitions/ucl.svg'
  },
  {
    id: 'uel-2024',
    name: 'UEFA Europa League',
    shortName: 'UEL',
    competitionType: 'uefa',
    country: 'Europe',
    level: 2,
    uefaCoefficient: 1.0,
    prizeMoney: 560000000,
    currentSeason: '2024/25',
    logoUrl: '/competitions/uel.svg'
  },
  {
    id: 'super-league-gr',
    name: 'Greek Super League',
    shortName: 'Super League',
    competitionType: 'domestic_league',
    country: 'Greece',
    level: 1,
    uefaCoefficient: 0.0,
    prizeMoney: 15000000,
    currentSeason: '2024/25',
    logoUrl: '/competitions/greek-league.svg'
  },
  {
    id: 'greek-cup',
    name: 'Greek Cup',
    shortName: 'Greek Cup',
    competitionType: 'domestic_cup',
    country: 'Greece',
    level: 1,
    uefaCoefficient: 0.0,
    prizeMoney: 3000000,
    currentSeason: '2024/25',
    logoUrl: '/competitions/greek-cup.svg'
  }
];

export const mockUCLStandings: CompetitionStanding[] = [
  { id: '1', competitionId: 'ucl-2024', teamId: 't1', teamName: 'Panathinaikos', position: 1, played: 4, won: 3, drawn: 1, lost: 0, goalsFor: 9, goalsAgainst: 3, goalDifference: 6, points: 10, form: 'WWDW', qualificationStatus: 'Round of 16' },
  { id: '2', competitionId: 'ucl-2024', teamId: 't2', teamName: 'Ajax', position: 2, played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 8, goalsAgainst: 4, goalDifference: 4, points: 9, form: 'WWLW', qualificationStatus: 'Round of 16' },
  { id: '3', competitionId: 'ucl-2024', teamId: 't3', teamName: 'Brighton', position: 3, played: 4, won: 2, drawn: 1, lost: 1, goalsFor: 7, goalsAgainst: 5, goalDifference: 2, points: 7, form: 'WDLW', qualificationStatus: 'Playoff Round' },
  { id: '4', competitionId: 'ucl-2024', teamId: 't4', teamName: 'AEK Athens', position: 4, played: 4, won: 2, drawn: 0, lost: 2, goalsFor: 6, goalsAgainst: 6, goalDifference: 0, points: 6, form: 'LWWL', qualificationStatus: 'Playoff Round' },
  { id: '5', competitionId: 'ucl-2024', teamId: 't5', teamName: 'Marseille', position: 5, played: 4, won: 1, drawn: 1, lost: 2, goalsFor: 4, goalsAgainst: 7, goalDifference: -3, points: 4, form: 'LDLW', qualificationStatus: 'Europa League' },
  { id: '6', competitionId: 'ucl-2024', teamId: 't6', teamName: 'Sporting CP', position: 6, played: 4, won: 0, drawn: 1, lost: 3, goalsFor: 2, goalsAgainst: 9, goalDifference: -7, points: 1, form: 'LLDL', qualificationStatus: 'Eliminated' }
];

export const mockSuperLeagueStandings: CompetitionStanding[] = [
  { id: 'sl1', competitionId: 'super-league-gr', teamId: 't1', teamName: 'Panathinaikos', position: 1, played: 15, won: 10, drawn: 3, lost: 2, goalsFor: 32, goalsAgainst: 15, goalDifference: 17, points: 33, form: 'WWDWW' },
  { id: 'sl2', competitionId: 'super-league-gr', teamId: 't7', teamName: 'Olympiacos', position: 2, played: 15, won: 9, drawn: 4, lost: 2, goalsFor: 28, goalsAgainst: 12, goalDifference: 16, points: 31, form: 'WDWDW' },
  { id: 'sl3', competitionId: 'super-league-gr', teamId: 't8', teamName: 'PAOK', position: 3, played: 15, won: 9, drawn: 3, lost: 3, goalsFor: 26, goalsAgainst: 14, goalDifference: 12, points: 30, form: 'LWWWW' },
  { id: 'sl4', competitionId: 'super-league-gr', teamId: 't4', teamName: 'AEK Athens', position: 4, played: 15, won: 8, drawn: 3, lost: 4, goalsFor: 24, goalsAgainst: 18, goalDifference: 6, points: 27, form: 'WLDWL' },
  { id: 'sl5', competitionId: 'super-league-gr', teamId: 't9', teamName: 'Aris', position: 5, played: 15, won: 6, drawn: 4, lost: 5, goalsFor: 19, goalsAgainst: 19, goalDifference: 0, points: 22, form: 'DLWDD' }
];

export const mockTransferHistory: TransferRecord[] = [
  {
    id: 'tf1',
    playerName: 'A. Ioannidis',
    fromTeam: 'Asteras Tripolis',
    toTeam: 'Panathinaikos',
    transferDate: new Date('2023-07-15'),
    transferType: 'permanent',
    feeEur: 2500000,
    contractLength: 4,
    position: 'CM'
  },
  {
    id: 'tf2',
    playerName: 'F. Pellistri',
    fromTeam: 'Manchester United',
    toTeam: 'Panathinaikos',
    transferDate: new Date('2024-08-20'),
    transferType: 'loan',
    feeEur: 500000,
    contractLength: 1,
    position: 'RW'
  },
  {
    id: 'tf3',
    playerName: 'A. Sporar',
    fromTeam: 'Sporting CP',
    toTeam: 'Panathinaikos',
    transferDate: new Date('2023-01-10'),
    transferType: 'permanent',
    feeEur: 4000000,
    contractLength: 3.5,
    position: 'ST'
  }
];

export const mockPlayerValuations: PlayerValuation[] = [
  {
    playerId: '6',
    playerName: 'A. Ioannidis',
    currentValue: 8500000,
    aiPredictedValue: 12000000,
    valueTrend: 'rising',
    peakValue: 15000000,
    valuationFactors: {
      performance: 0.92,
      age: 0.88,
      marketDemand: 0.85,
      contractSituation: 0.90,
      injuryHistory: 0.95
    },
    confidenceScore: 0.89
  },
  {
    playerId: '11',
    playerName: 'A. Sporar',
    currentValue: 5500000,
    aiPredictedValue: 5200000,
    valueTrend: 'stable',
    peakValue: 8000000,
    valuationFactors: {
      performance: 0.87,
      age: 0.72,
      marketDemand: 0.75,
      contractSituation: 0.68,
      injuryHistory: 0.88
    },
    confidenceScore: 0.85
  },
  {
    playerId: '10',
    playerName: 'F. Pellistri',
    currentValue: 12000000,
    aiPredictedValue: 18000000,
    valueTrend: 'rising',
    peakValue: 25000000,
    valuationFactors: {
      performance: 0.88,
      age: 0.95,
      marketDemand: 0.92,
      contractSituation: 0.45,
      injuryHistory: 0.90
    },
    confidenceScore: 0.82
  }
];

export const mockRecruitmentTargets: RecruitmentTarget[] = [
  {
    id: 'rt1',
    playerName: 'Viktor Gyökeres',
    currentTeam: 'Sporting CP',
    position: 'ST',
    age: 26,
    nationality: 'Sweden',
    estimatedValue: 75000000,
    priorityLevel: 'high',
    fitScore: 9.2,
    tacticalFitAnalysis: 'Perfect fit for counter-attacking system. Strong hold-up play, clinical finishing, and excellent work rate.',
    strengths: ['Clinical finishing', 'Physical presence', 'Pressing intensity', 'Link-up play', 'Aerial ability'],
    weaknesses: ['Injury history', 'Adaptation to new league', 'High wage demands'],
    acquisitionFeasibility: 'difficult',
    recommendedOffer: 60000000,
    scoutingNotes: 'Top priority target. Has Champions League experience and proven goal-scoring record. May require breaking transfer record.'
  },
  {
    id: 'rt2',
    playerName: 'Khvicha Kvaratskhelia',
    currentTeam: 'Napoli',
    position: 'LW',
    age: 23,
    nationality: 'Georgia',
    estimatedValue: 85000000,
    priorityLevel: 'high',
    fitScore: 9.5,
    tacticalFitAnalysis: 'Elite dribbling and creativity on the left wing. Would add significant attacking threat and unpredictability.',
    strengths: ['Dribbling', 'Creativity', 'Speed', 'Goals & assists', 'Big game mentality'],
    weaknesses: ['Very expensive', 'Competition from bigger clubs', 'Adaptation period'],
    acquisitionFeasibility: 'difficult',
    recommendedOffer: 75000000,
    scoutingNotes: 'World-class talent. Multiple top clubs interested. Would transform our attack but requires significant investment.'
  },
  {
    id: 'rt3',
    playerName: 'Morten Hjulmand',
    currentTeam: 'Sporting CP',
    position: 'CDM',
    age: 25,
    nationality: 'Denmark',
    estimatedValue: 25000000,
    priorityLevel: 'medium',
    fitScore: 8.7,
    tacticalFitAnalysis: 'Strong defensive midfielder with excellent passing range. Would provide defensive stability and ball progression.',
    strengths: ['Defensive positioning', 'Passing range', 'Tactical discipline', 'Physical presence', 'Leadership'],
    weaknesses: ['Pace limitations', 'Dribbling ability', 'High pressing adaptability'],
    acquisitionFeasibility: 'moderate',
    recommendedOffer: 22000000,
    scoutingNotes: 'Solid upgrade for defensive midfield. Good age profile and reasonable price. Strong candidate for summer window.'
  },
  {
    id: 'rt4',
    playerName: 'Orkun Kökçü',
    currentTeam: 'Benfica',
    position: 'CM',
    age: 23,
    nationality: 'Turkey',
    estimatedValue: 30000000,
    priorityLevel: 'medium',
    fitScore: 8.4,
    tacticalFitAnalysis: 'Creative midfielder with excellent set-piece delivery. Good technical ability and vision.',
    strengths: ['Set pieces', 'Vision', 'Technical ability', 'Versatility', 'Youth'],
    weaknesses: ['Defensive contribution', 'Physicality', 'Consistency'],
    acquisitionFeasibility: 'moderate',
    recommendedOffer: 28000000,
    scoutingNotes: 'Quality playmaker option. Could rotate with existing midfielders. Monitor performance in Champions League.'
  },
  {
    id: 'rt5',
    playerName: 'Maxence Lacroix',
    currentTeam: 'Wolfsburg',
    position: 'CB',
    age: 24,
    nationality: 'France',
    estimatedValue: 20000000,
    priorityLevel: 'low',
    fitScore: 7.8,
    tacticalFitAnalysis: 'Quick, athletic center-back with good ball-playing ability. Suitable for high defensive line.',
    strengths: ['Pace', 'Athleticism', 'Ball playing', 'Recovery speed', 'Age profile'],
    weaknesses: ['Aerial duels', 'Concentration', 'Big match experience'],
    acquisitionFeasibility: 'easy',
    recommendedOffer: 18000000,
    scoutingNotes: 'Depth option for center-back position. Could develop into starter. Contract expires in 2026.'
  }
];

export const mockOppositionReport: OppositionReport = {
  id: 'or1',
  opponentName: 'Olympiacos',
  matchDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  overallThreatLevel: 'high',
  predictedFormation: '4-2-3-1',
  predictedLineup: [
    { position: 'GK', player: 'Paschalakis' },
    { position: 'RB', player: 'Rodinei' },
    { position: 'CB', player: 'Retsos' },
    { position: 'CB', player: 'Carmo' },
    { position: 'LB', player: 'Ortega' },
    { position: 'CDM', player: 'Hezze' },
    { position: 'CDM', player: 'Chiquinho' },
    { position: 'CAM', player: 'Willian' },
    { position: 'RW', player: 'Podence' },
    { position: 'LW', player: 'Masouras' },
    { position: 'ST', player: 'El Kaabi' }
  ],
  attackingPatterns: [
    'Heavy reliance on wing play, especially down the right through Rodinei-Podence combination',
    'Quick transitions from defense to attack through Willian passing',
    'El Kaabi drops deep to link play, creating space for late runs from midfielders',
    'Effective use of set pieces with multiple players attacking crosses',
    'Overloads on flanks to create 2v1 situations'
  ],
  defensiveVulnerabilities: [
    'Susceptible to counter-attacks when full-backs push high',
    'Struggles against quick, direct play through the middle',
    'Weak side (left) can be exploited - Ortega less reliable defensively',
    'High defensive line vulnerable to balls in behind',
    'Central midfield can be bypassed with quick passing combinations',
    'Set piece defending has been inconsistent this season'
  ],
  keyPlayersToWatch: [
    {
      name: 'Willian',
      threat: 'Primary creative outlet - dictates tempo and creates chances',
      howToNeutralize: 'Press aggressively when receiving, limit space to turn. Assign Ioannidis to track him.'
    },
    {
      name: 'El Kaabi',
      threat: 'Prolific goal scorer - 18 goals this season. Excellent in the air.',
      howToNeutralize: 'Do not allow space in the box. Mark tightly on set pieces. Jedvaj to handle physical battle.'
    },
    {
      name: 'Rodinei',
      threat: 'Provides width and crossing threat from right-back position',
      howToNeutralize: 'Verbic to track back and double team with Juankar when possible.'
    }
  ],
  setPieceThreatLevel: 'high',
  recommendedFormation: '4-2-3-1',
  recommendedTactics: [
    'Press high when they build from the back - force long balls',
    'Exploit space behind Rodinei when he pushes forward',
    'Quick transitions targeting Ortega weak side',
    'Compact defensive shape, limit space between lines',
    'Target set pieces - they concede frequently from corners',
    'Use Pellistri pace to stretch their high line',
    'Keep the ball and tire them out - they struggle in latter stages'
  ],
  winProbability: 58,
  expectedScoreline: '2-1',
  detailedAnalysis: 'Olympiacos presents a significant challenge with their attacking quality, particularly through Willian and El Kaabi. However, they have defensive vulnerabilities that can be exploited. Their high defensive line and aggressive full-backs leave space in behind. Focus on quick transitions and targeting their weaker left side. Winning the midfield battle will be crucial - if we can neutralize Willian, their creativity drops significantly. Set pieces at both ends will be important. Maintaining discipline and not allowing them to settle into rhythm in the first 20 minutes is key. Second half substitutions should target their tiring legs.'
};

export const mockXGTimeline: XGTimelinePoint[] = [
  { minute: 8, team: 'home', playerName: 'A. Sporar', shotXG: 0.15, cumulativeXG: 0.15, shotOutcome: 'saved', shotType: 'header' },
  { minute: 12, team: 'home', playerName: 'A. Sporar', shotXG: 0.42, cumulativeXG: 0.57, shotOutcome: 'goal', shotType: 'right_foot' },
  { minute: 18, team: 'away', playerName: 'Silva', shotXG: 0.08, cumulativeXG: 0.08, shotOutcome: 'missed', shotType: 'left_foot' },
  { minute: 23, team: 'home', playerName: 'F. Pellistri', shotXG: 0.12, cumulativeXG: 0.69, shotOutcome: 'blocked', shotType: 'right_foot' },
  { minute: 28, team: 'away', playerName: 'Garcia', shotXG: 0.18, cumulativeXG: 0.26, shotOutcome: 'saved', shotType: 'header' },
  { minute: 34, team: 'home', playerName: 'B. Schenkeveld', shotXG: 0.35, cumulativeXG: 1.04, shotOutcome: 'goal', shotType: 'header' },
  { minute: 41, team: 'home', playerName: 'A. Ioannidis', shotXG: 0.22, cumulativeXG: 1.26, shotOutcome: 'saved', shotType: 'right_foot' },
  { minute: 45, team: 'away', playerName: 'Silva', shotXG: 0.11, cumulativeXG: 0.37, shotOutcome: 'missed', shotType: 'right_foot' },
  { minute: 52, team: 'away', playerName: 'Silva', shotXG: 0.51, cumulativeXG: 0.88, shotOutcome: 'goal', shotType: 'left_foot' },
  { minute: 58, team: 'home', playerName: 'F. Djuricic', shotXG: 0.28, cumulativeXG: 1.54, shotOutcome: 'saved', shotType: 'right_foot' },
  { minute: 64, team: 'home', playerName: 'B. Verbic', shotXG: 0.09, cumulativeXG: 1.63, shotOutcome: 'missed', shotType: 'left_foot' },
  { minute: 71, team: 'away', playerName: 'Martinez', shotXG: 0.31, cumulativeXG: 1.19, shotOutcome: 'saved', shotType: 'right_foot' },
  { minute: 76, team: 'home', playerName: 'F. Pellistri', shotXG: 0.14, cumulativeXG: 1.77, shotOutcome: 'blocked', shotType: 'right_foot' },
  { minute: 81, team: 'home', playerName: 'A. Sporar', shotXG: 0.65, cumulativeXG: 2.42, shotOutcome: 'goal', shotType: 'right_foot' },
  { minute: 87, team: 'away', playerName: 'Lopez', shotXG: 0.07, cumulativeXG: 1.26, shotOutcome: 'missed', shotType: 'header' }
];

export const mockMomentumTimeline: MomentumPoint[] = [
  { minute: 0, momentumScore: 0, shiftType: 'neutral', triggerEvent: 'Kickoff', description: 'Match begins with neutral momentum' },
  { minute: 12, momentumScore: 25, shiftType: 'positive', triggerEvent: 'Goal', description: 'Sporar goal gives home team momentum boost' },
  { minute: 23, momentumScore: 15, shiftType: 'negative', triggerEvent: 'Yellow Card', description: 'Jedvaj yellow card reduces momentum slightly' },
  { minute: 34, momentumScore: 42, shiftType: 'positive', triggerEvent: 'Goal', description: 'Second goal significantly boosts home momentum' },
  { minute: 45, momentumScore: 38, shiftType: 'neutral', triggerEvent: 'Half Time', description: 'Momentum maintained at half time' },
  { minute: 52, momentumScore: 12, shiftType: 'negative', triggerEvent: 'Goal Conceded', description: 'Away team goal shifts momentum significantly' },
  { minute: 58, momentumScore: 8, shiftType: 'negative', triggerEvent: 'Missed Chance', description: 'Clear chance missed dampens home momentum' },
  { minute: 68, momentumScore: 22, shiftType: 'positive', triggerEvent: 'Substitution', description: 'Fresh legs from substitution improves momentum' },
  { minute: 81, momentumScore: 48, shiftType: 'positive', triggerEvent: 'Goal', description: 'Third goal restores dominant momentum' },
  { minute: 90, momentumScore: 45, shiftType: 'neutral', triggerEvent: 'Final Whistle', description: 'Match ends with strong home momentum' }
];

export const mockReferees: RefereeProfile[] = [
  {
    id: 'ref1',
    name: 'A. Sidiropoulos',
    nationality: 'Greece',
    experienceYears: 12,
    fifaBadge: true,
    avgCardsPerMatch: 4.2,
    avgFoulsPerMatch: 23.5,
    penaltyFrequency: 0.18,
    varInterventionRate: 0.12,
    strictRating: 7.5,
    homeBiasScore: 0.03
  },
  {
    id: 'ref2',
    name: 'T. Kominis',
    nationality: 'Greece',
    experienceYears: 8,
    fifaBadge: false,
    avgCardsPerMatch: 5.8,
    avgFoulsPerMatch: 28.2,
    penaltyFrequency: 0.24,
    varInterventionRate: 0.18,
    strictRating: 8.8,
    homeBiasScore: -0.05
  },
  {
    id: 'ref3',
    name: 'K. Spathas',
    nationality: 'Greece',
    experienceYears: 15,
    fifaBadge: true,
    avgCardsPerMatch: 3.5,
    avgFoulsPerMatch: 21.8,
    penaltyFrequency: 0.15,
    varInterventionRate: 0.09,
    strictRating: 6.2,
    homeBiasScore: 0.08
  }
];

export const mockSocialMediaMetrics: SocialMediaMetrics[] = [
  {
    platform: 'Instagram',
    followers: 1250000,
    engagementRate: 4.8,
    postCount: 248,
    likes: 18500000,
    comments: 425000,
    shares: 85000,
    reach: 8500000,
    sentimentScore: 0.82,
    trendingTopics: ['#Panathinaikos', '#UCL', '#Champions', '#SuperLeague', '#PAO']
  },
  {
    platform: 'X (Twitter)',
    followers: 985000,
    engagementRate: 3.2,
    postCount: 1842,
    likes: 5200000,
    comments: 780000,
    shares: 320000,
    reach: 12000000,
    sentimentScore: 0.76,
    trendingTopics: ['#Panathinaikos', '#PAOFamily', '#UCL', '#Derby', '#GreenWhite']
  },
  {
    platform: 'Facebook',
    followers: 2100000,
    engagementRate: 2.9,
    postCount: 186,
    likes: 8900000,
    comments: 560000,
    shares: 185000,
    reach: 6200000,
    sentimentScore: 0.79,
    trendingTopics: ['Panathinaikos FC', 'Champions League', 'Greek Football', 'Match Highlights']
  },
  {
    platform: 'TikTok',
    followers: 425000,
    engagementRate: 8.5,
    postCount: 124,
    likes: 15200000,
    comments: 1850000,
    shares: 620000,
    reach: 18500000,
    sentimentScore: 0.88,
    trendingTopics: ['#PAO', '#FootballSkills', '#GoalCelebration', '#BehindTheScenes', '#TrainingDay']
  },
  {
    platform: 'YouTube',
    followers: 560000,
    engagementRate: 6.2,
    postCount: 452,
    likes: 3200000,
    comments: 185000,
    shares: 95000,
    reach: 28000000,
    sentimentScore: 0.85,
    trendingTopics: ['Match Highlights', 'Player Interviews', 'Training Sessions', 'Goals Compilation', 'UCL Journey']
  }
];

export const generateLiveMatchTracking = (minute: number) => {
  const progress = minute / 90;
  return {
    currentMinute: minute,
    homeScore: minute >= 12 ? (minute >= 34 ? (minute >= 81 ? 3 : 2) : 1) : 0,
    awayScore: minute >= 52 ? 1 : 0,
    possessionHome: 55 + Math.sin(progress * Math.PI) * 5,
    possessionAway: 45 - Math.sin(progress * Math.PI) * 5,
    shotsHome: Math.floor(minute / 6),
    shotsAway: Math.floor(minute / 8),
    shotsOnTargetHome: Math.floor(minute / 10),
    shotsOnTargetAway: Math.floor(minute / 15),
    xgHome: 2.42 * progress,
    xgAway: 1.26 * progress,
    cornersHome: Math.floor(minute / 13),
    cornersAway: Math.floor(minute / 20),
    foulsHome: Math.floor(minute / 8),
    foulsAway: Math.floor(minute / 6),
    yellowCardsHome: minute >= 23 ? (minute >= 45 ? 2 : 1) : 0,
    yellowCardsAway: minute >= 67 ? (minute >= 89 ? 3 : 2) : 1,
    redCardsHome: 0,
    redCardsAway: 0,
    winProbabilityHome: Math.min(85, 45 + (progress * 40)),
    winProbabilityDraw: Math.max(8, 25 - (progress * 17)),
    winProbabilityAway: Math.max(7, 30 - (progress * 23)),
    momentumScore: mockMomentumTimeline.find(m => m.minute <= minute)?.momentumScore || 0
  };
};
