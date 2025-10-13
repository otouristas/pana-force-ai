export interface PlayerMatchPerformance {
  playerId: string;
  playerName: string;
  number: number;
  position: string;
  minutesPlayed: number;
  rating: number;
  goals: number;
  assists: number;
  shotsTotal: number;
  shotsOnTarget: number;
  passesCompleted: number;
  passesAttempted: number;
  passAccuracy: number;
  keyPasses: number;
  crosses: number;
  longBalls: number;
  throughBalls: number;
  distanceCovered: number;
  sprints: number;
  topSpeed: number;
  tackles: number;
  interceptions: number;
  clearances: number;
  blocks: number;
  duelsWon: number;
  duelsTotal: number;
  dribblesCompleted: number;
  dribblesAttempted: number;
  foulsCommitted: number;
  foulsWon: number;
  offsides: number;
  yellowCards: number;
  redCards: number;
  aerialDuelsWon: number;
  aerialDuelsTotal: number;
  possession: number;
  touchesInBox: number;
  heatmapData: Array<{ zoneX: number; zoneY: number; intensity: number; touches: number; actions: number }>;
}

export interface MatchResult {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: Date;
  venue: string;
  competition: string;
  attendance: number;
  referee: string;
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  teamStats: {
    possession: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
    corners: [number, number];
    fouls: [number, number];
    yellowCards: [number, number];
    redCards: [number, number];
    offsides: [number, number];
    passAccuracy: [number, number];
  };
  events: Array<{
    minute: number;
    type: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution' | 'injury';
    player: string;
    team: 'home' | 'away';
    description: string;
  }>;
  formations: {
    home: string;
    away: string;
    changes: Array<{ minute: number; team: 'home' | 'away'; from: string; to: string }>;
  };
  playerPerformances: PlayerMatchPerformance[];
}

export const generatePlayerHeatmap = (position: string): PlayerMatchPerformance['heatmapData'] => {
  const heatmapData: PlayerMatchPerformance['heatmapData'] = [];

  const positionZones = {
    GK: { centerX: 1, centerY: 4, spread: 1 },
    CB: { centerX: 3, centerY: 4, spread: 2 },
    LB: { centerX: 3, centerY: 1, spread: 2 },
    RB: { centerX: 3, centerY: 7, spread: 2 },
    CDM: { centerX: 5, centerY: 4, spread: 2 },
    CM: { centerX: 6, centerY: 4, spread: 3 },
    LM: { centerX: 6, centerY: 2, spread: 2 },
    RM: { centerX: 6, centerY: 6, spread: 2 },
    CAM: { centerX: 7, centerY: 4, spread: 2 },
    LW: { centerX: 8, centerY: 2, spread: 2 },
    RW: { centerX: 8, centerY: 6, spread: 2 },
    ST: { centerX: 9, centerY: 4, spread: 2 }
  };

  const zone = positionZones[position as keyof typeof positionZones] || positionZones.CM;

  for (let i = 0; i < 15; i++) {
    const offsetX = Math.floor(Math.random() * zone.spread * 2) - zone.spread;
    const offsetY = Math.floor(Math.random() * zone.spread * 2) - zone.spread;
    const zoneX = Math.max(0, Math.min(11, zone.centerX + offsetX));
    const zoneY = Math.max(0, Math.min(7, zone.centerY + offsetY));

    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    const intensity = Math.max(0.2, 1 - (distance / (zone.spread * 2)));
    const touches = Math.floor(50 * intensity + Math.random() * 20);
    const actions = Math.floor(touches * (0.4 + Math.random() * 0.3));

    heatmapData.push({ zoneX, zoneY, intensity, touches, actions });
  }

  return heatmapData;
};

export const generateMockMatchResult = (matchId: string): MatchResult => {
  const players: PlayerMatchPerformance[] = [
    {
      playerId: '1', playerName: 'D. Dioudis', number: 1, position: 'GK', minutesPlayed: 90, rating: 7.2,
      goals: 0, assists: 0, shotsTotal: 0, shotsOnTarget: 0, passesCompleted: 28, passesAttempted: 35,
      passAccuracy: 80, keyPasses: 0, crosses: 0, longBalls: 12, throughBalls: 0, distanceCovered: 4.2,
      sprints: 2, topSpeed: 24.5, tackles: 0, interceptions: 0, clearances: 0, blocks: 0, duelsWon: 0,
      duelsTotal: 0, dribblesCompleted: 0, dribblesAttempted: 0, foulsCommitted: 0, foulsWon: 0,
      offsides: 0, yellowCards: 0, redCards: 0, aerialDuelsWon: 2, aerialDuelsTotal: 2, possession: 2.8,
      touchesInBox: 0, heatmapData: generatePlayerHeatmap('GK')
    },
    {
      playerId: '2', playerName: 'G. Kotsiras', number: 23, position: 'RB', minutesPlayed: 90, rating: 7.5,
      goals: 0, assists: 1, shotsTotal: 1, shotsOnTarget: 0, passesCompleted: 45, passesAttempted: 52,
      passAccuracy: 87, keyPasses: 2, crosses: 4, longBalls: 3, throughBalls: 1, distanceCovered: 10.8,
      sprints: 18, topSpeed: 32.1, tackles: 3, interceptions: 2, clearances: 4, blocks: 1, duelsWon: 6,
      duelsTotal: 9, dribblesCompleted: 2, dribblesAttempted: 3, foulsCommitted: 1, foulsWon: 2,
      offsides: 0, yellowCards: 0, redCards: 0, aerialDuelsWon: 3, aerialDuelsTotal: 5, possession: 4.2,
      touchesInBox: 2, heatmapData: generatePlayerHeatmap('RB')
    },
    {
      playerId: '3', playerName: 'T. Jedvaj', number: 5, position: 'CB', minutesPlayed: 90, rating: 7.8,
      goals: 0, assists: 0, shotsTotal: 0, shotsOnTarget: 0, passesCompleted: 62, passesAttempted: 68,
      passAccuracy: 91, keyPasses: 1, crosses: 0, longBalls: 8, throughBalls: 0, distanceCovered: 9.5,
      sprints: 12, topSpeed: 29.3, tackles: 5, interceptions: 4, clearances: 8, blocks: 2, duelsWon: 8,
      duelsTotal: 10, dribblesCompleted: 0, dribblesAttempted: 0, foulsCommitted: 2, foulsWon: 1,
      offsides: 0, yellowCards: 1, redCards: 0, aerialDuelsWon: 6, aerialDuelsTotal: 7, possession: 5.1,
      touchesInBox: 0, heatmapData: generatePlayerHeatmap('CB')
    },
    {
      playerId: '4', playerName: 'B. Schenkeveld', number: 21, position: 'CB', minutesPlayed: 90, rating: 7.6,
      goals: 1, assists: 0, shotsTotal: 2, shotsOnTarget: 1, passesCompleted: 58, passesAttempted: 64,
      passAccuracy: 91, keyPasses: 0, crosses: 0, longBalls: 6, throughBalls: 0, distanceCovered: 9.2,
      sprints: 10, topSpeed: 28.7, tackles: 4, interceptions: 3, clearances: 7, blocks: 3, duelsWon: 7,
      duelsTotal: 9, dribblesCompleted: 0, dribblesAttempted: 0, foulsCommitted: 1, foulsWon: 2,
      offsides: 0, yellowCards: 0, redCards: 0, aerialDuelsWon: 5, aerialDuelsTotal: 6, possession: 4.8,
      touchesInBox: 3, heatmapData: generatePlayerHeatmap('CB')
    },
    {
      playerId: '5', playerName: 'Juankar', number: 19, position: 'LB', minutesPlayed: 90, rating: 7.4,
      goals: 0, assists: 0, shotsTotal: 0, shotsOnTarget: 0, passesCompleted: 42, passesAttempted: 49,
      passAccuracy: 86, keyPasses: 1, crosses: 3, longBalls: 2, throughBalls: 0, distanceCovered: 10.5,
      sprints: 16, topSpeed: 31.2, tackles: 4, interceptions: 3, clearances: 5, blocks: 0, duelsWon: 5,
      duelsTotal: 8, dribblesCompleted: 3, dribblesAttempted: 4, foulsCommitted: 2, foulsWon: 1,
      offsides: 0, yellowCards: 0, redCards: 0, aerialDuelsWon: 2, aerialDuelsTotal: 4, possession: 3.9,
      touchesInBox: 1, heatmapData: generatePlayerHeatmap('LB')
    },
    {
      playerId: '6', playerName: 'A. Ioannidis', number: 8, position: 'CM', minutesPlayed: 90, rating: 8.3,
      goals: 1, assists: 2, shotsTotal: 3, shotsOnTarget: 2, passesCompleted: 68, passesAttempted: 76,
      passAccuracy: 89, keyPasses: 4, crosses: 2, longBalls: 4, throughBalls: 3, distanceCovered: 11.8,
      sprints: 24, topSpeed: 32.8, tackles: 2, interceptions: 2, clearances: 1, blocks: 0, duelsWon: 8,
      duelsTotal: 12, dribblesCompleted: 5, dribblesAttempted: 7, foulsCommitted: 1, foulsWon: 3,
      offsides: 0, yellowCards: 0, redCards: 0, aerialDuelsWon: 3, aerialDuelsTotal: 5, possession: 6.8,
      touchesInBox: 5, heatmapData: generatePlayerHeatmap('CM')
    },
    {
      playerId: '7', playerName: 'Zeca', number: 7, position: 'CM', minutesPlayed: 75, rating: 7.6,
      goals: 0, assists: 0, shotsTotal: 1, shotsOnTarget: 0, passesCompleted: 54, passesAttempted: 61,
      passAccuracy: 89, keyPasses: 2, crosses: 1, longBalls: 3, throughBalls: 1, distanceCovered: 9.8,
      sprints: 18, topSpeed: 31.5, tackles: 3, interceptions: 3, clearances: 2, blocks: 1, duelsWon: 6,
      duelsTotal: 9, dribblesCompleted: 2, dribblesAttempted: 3, foulsCommitted: 2, foulsWon: 2,
      offsides: 0, yellowCards: 0, redCards: 0, aerialDuelsWon: 2, aerialDuelsTotal: 4, possession: 5.5,
      touchesInBox: 2, heatmapData: generatePlayerHeatmap('CM')
    },
    {
      playerId: '8', playerName: 'F. Djuricic', number: 10, position: 'CAM', minutesPlayed: 82, rating: 8.0,
      goals: 1, assists: 1, shotsTotal: 4, shotsOnTarget: 2, passesCompleted: 48, passesAttempted: 58,
      passAccuracy: 83, keyPasses: 5, crosses: 2, longBalls: 2, throughBalls: 4, distanceCovered: 10.2,
      sprints: 22, topSpeed: 32.4, tackles: 1, interceptions: 1, clearances: 0, blocks: 0, duelsWon: 5,
      duelsTotal: 9, dribblesCompleted: 6, dribblesAttempted: 9, foulsCommitted: 1, foulsWon: 4,
      offsides: 1, yellowCards: 0, redCards: 0, aerialDuelsWon: 1, aerialDuelsTotal: 3, possession: 5.8,
      touchesInBox: 8, heatmapData: generatePlayerHeatmap('CAM')
    },
    {
      playerId: '9', playerName: 'B. Verbic', number: 11, position: 'LW', minutesPlayed: 90, rating: 7.3,
      goals: 0, assists: 1, shotsTotal: 3, shotsOnTarget: 1, passesCompleted: 32, passesAttempted: 42,
      passAccuracy: 76, keyPasses: 3, crosses: 5, longBalls: 1, throughBalls: 1, distanceCovered: 10.5,
      sprints: 28, topSpeed: 33.5, tackles: 1, interceptions: 0, clearances: 0, blocks: 0, duelsWon: 4,
      duelsTotal: 10, dribblesCompleted: 7, dribblesAttempted: 12, foulsCommitted: 2, foulsWon: 3,
      offsides: 2, yellowCards: 1, redCards: 0, aerialDuelsWon: 1, aerialDuelsTotal: 2, possession: 4.2,
      touchesInBox: 6, heatmapData: generatePlayerHeatmap('LW')
    },
    {
      playerId: '10', playerName: 'F. Pellistri', number: 14, position: 'RW', minutesPlayed: 90, rating: 7.8,
      goals: 1, assists: 0, shotsTotal: 5, shotsOnTarget: 3, passesCompleted: 28, passesAttempted: 38,
      passAccuracy: 74, keyPasses: 2, crosses: 6, longBalls: 0, throughBalls: 1, distanceCovered: 11.2,
      sprints: 32, topSpeed: 34.2, tackles: 0, interceptions: 1, clearances: 0, blocks: 0, duelsWon: 6,
      duelsTotal: 11, dribblesCompleted: 8, dribblesAttempted: 13, foulsCommitted: 1, foulsWon: 5,
      offsides: 1, yellowCards: 0, redCards: 0, aerialDuelsWon: 0, aerialDuelsTotal: 1, possession: 4.5,
      touchesInBox: 9, heatmapData: generatePlayerHeatmap('RW')
    },
    {
      playerId: '11', playerName: 'A. Sporar', number: 9, position: 'ST', minutesPlayed: 90, rating: 8.5,
      goals: 2, assists: 0, shotsTotal: 6, shotsOnTarget: 4, passesCompleted: 18, passesAttempted: 28,
      passAccuracy: 64, keyPasses: 1, crosses: 0, longBalls: 0, throughBalls: 0, distanceCovered: 9.8,
      sprints: 26, topSpeed: 32.9, tackles: 1, interceptions: 0, clearances: 0, blocks: 0, duelsWon: 7,
      duelsTotal: 14, dribblesCompleted: 3, dribblesAttempted: 6, foulsCommitted: 3, foulsWon: 4,
      offsides: 3, yellowCards: 0, redCards: 0, aerialDuelsWon: 5, aerialDuelsTotal: 9, possession: 3.2,
      touchesInBox: 12, heatmapData: generatePlayerHeatmap('ST')
    }
  ];

  return {
    matchId,
    homeTeam: 'Panathinaikos',
    awayTeam: 'AEK Athens',
    homeScore: 3,
    awayScore: 1,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    venue: 'OPAP Arena',
    competition: 'Super League',
    attendance: 38500,
    referee: 'A. Sidiropoulos',
    weather: {
      temperature: 18,
      condition: 'Clear',
      humidity: 65,
      windSpeed: 12
    },
    teamStats: {
      possession: [58, 42],
      shots: [18, 12],
      shotsOnTarget: [10, 5],
      corners: [7, 3],
      fouls: [11, 14],
      yellowCards: [2, 3],
      redCards: [0, 0],
      offsides: [4, 2],
      passAccuracy: [85, 78]
    },
    events: [
      { minute: 12, type: 'goal', player: 'A. Sporar', team: 'home', description: 'Right-footed shot from the center of the box to the bottom right corner. Assisted by A. Ioannidis.' },
      { minute: 23, type: 'yellow_card', player: 'T. Jedvaj', team: 'home', description: 'Tactical foul stopping a counter-attack.' },
      { minute: 34, type: 'goal', player: 'B. Schenkeveld', team: 'home', description: 'Header from the center of the box to the top left corner. Assisted by F. Djuricic with a cross following a corner.' },
      { minute: 45, type: 'yellow_card', player: 'B. Verbic', team: 'home', description: 'Dissent towards the referee.' },
      { minute: 52, type: 'goal', player: 'Silva', team: 'away', description: 'Left-footed shot from outside the box to the top right corner.' },
      { minute: 68, type: 'substitution', player: 'F. Djuricic → T. Bakasetas', team: 'home', description: 'Tactical substitution.' },
      { minute: 75, type: 'substitution', player: 'Zeca → D. Kourbelis', team: 'home', description: 'Fresh legs in midfield.' },
      { minute: 81, type: 'goal', player: 'A. Sporar', team: 'home', description: 'Clinical finish from inside the box after a through ball from A. Ioannidis.' },
      { minute: 85, type: 'substitution', player: 'A. Sporar → A. Jeremejeff', team: 'home', description: 'Protecting the lead.' }
    ],
    formations: {
      home: '4-2-3-1',
      away: '4-3-3',
      changes: [
        { minute: 68, team: 'home', from: '4-2-3-1', to: '4-3-3' }
      ]
    },
    playerPerformances: players
  };
};

export const mockMatchResults: MatchResult[] = [
  generateMockMatchResult('match-1'),
  {
    ...generateMockMatchResult('match-2'),
    homeTeam: 'Panathinaikos',
    awayTeam: 'PAOK',
    homeScore: 2,
    awayScore: 2,
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    competition: 'Greek Cup'
  },
  {
    ...generateMockMatchResult('match-3'),
    homeTeam: 'Olympiacos',
    awayTeam: 'Panathinaikos',
    homeScore: 1,
    awayScore: 3,
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    competition: 'Super League'
  }
];
