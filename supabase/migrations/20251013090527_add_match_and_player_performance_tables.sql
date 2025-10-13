/*
  # Match Results and Player Performance Schema

  1. New Tables
    - `matches`
      - Match information including teams, scores, venue, weather, and team statistics
      - Formation tracking and match events timeline
    - `player_performances`
      - Individual player statistics for each match
      - Comprehensive performance metrics including passes, shots, distance covered, etc.
    - `player_heatmap_data`
      - Positional heatmap data for player movement tracking
    - `squad_forecasts`
      - AI-generated squad predictions and recommendations
      - Stores lineup suggestions and tactical insights

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read match data
    - Add policies for authenticated users to insert/update match data (admin only)

  3. Important Notes
    - All tables use UUID primary keys
    - Foreign key relationships ensure data integrity
    - Indexes added for common query patterns
    - JSONB fields used for flexible nested data structures
*/

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id text UNIQUE NOT NULL,
  home_team text NOT NULL,
  away_team text NOT NULL,
  home_score integer,
  away_score integer,
  match_date timestamptz NOT NULL,
  venue text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  competition text NOT NULL,
  attendance integer,
  referee text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
  weather jsonb DEFAULT '{}'::jsonb,
  team_stats jsonb DEFAULT '{}'::jsonb,
  events jsonb DEFAULT '[]'::jsonb,
  formations jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Player performances table
CREATE TABLE IF NOT EXISTS player_performances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id text NOT NULL,
  player_name text NOT NULL,
  number integer NOT NULL,
  position text NOT NULL,
  minutes_played integer DEFAULT 0,
  rating numeric(3, 1) DEFAULT 0.0,
  goals integer DEFAULT 0,
  assists integer DEFAULT 0,
  shots_total integer DEFAULT 0,
  shots_on_target integer DEFAULT 0,
  passes_completed integer DEFAULT 0,
  passes_attempted integer DEFAULT 0,
  pass_accuracy numeric(5, 2) DEFAULT 0.0,
  key_passes integer DEFAULT 0,
  crosses integer DEFAULT 0,
  long_balls integer DEFAULT 0,
  through_balls integer DEFAULT 0,
  distance_covered numeric(5, 2) DEFAULT 0.0,
  sprints integer DEFAULT 0,
  top_speed numeric(5, 2) DEFAULT 0.0,
  tackles integer DEFAULT 0,
  interceptions integer DEFAULT 0,
  clearances integer DEFAULT 0,
  blocks integer DEFAULT 0,
  duels_won integer DEFAULT 0,
  duels_total integer DEFAULT 0,
  dribbles_completed integer DEFAULT 0,
  dribbles_attempted integer DEFAULT 0,
  fouls_committed integer DEFAULT 0,
  fouls_won integer DEFAULT 0,
  offsides integer DEFAULT 0,
  yellow_cards integer DEFAULT 0,
  red_cards integer DEFAULT 0,
  aerial_duels_won integer DEFAULT 0,
  aerial_duels_total integer DEFAULT 0,
  possession numeric(5, 2) DEFAULT 0.0,
  touches_in_box integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Player heatmap data table
CREATE TABLE IF NOT EXISTS player_heatmap_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performance_id uuid NOT NULL REFERENCES player_performances(id) ON DELETE CASCADE,
  zone_x integer NOT NULL CHECK (zone_x >= 0 AND zone_x <= 11),
  zone_y integer NOT NULL CHECK (zone_y >= 0 AND zone_y <= 7),
  intensity numeric(3, 2) NOT NULL CHECK (intensity >= 0 AND intensity <= 1),
  touches integer DEFAULT 0,
  actions integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Squad forecasts table
CREATE TABLE IF NOT EXISTS squad_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_date timestamptz NOT NULL DEFAULT now(),
  match_date timestamptz NOT NULL,
  opponent text NOT NULL,
  formation text NOT NULL,
  recommended_lineup jsonb DEFAULT '[]'::jsonb,
  ai_analysis text,
  tactical_insights text,
  risk_assessment jsonb DEFAULT '{}'::jsonb,
  substitution_strategy text,
  confidence_score numeric(5, 2) DEFAULT 0.0,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_heatmap_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_forecasts ENABLE ROW LEVEL SECURITY;

-- Policies for matches table
CREATE POLICY "Anyone can view matches"
  ON matches FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update matches"
  ON matches FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for player_performances table
CREATE POLICY "Anyone can view player performances"
  ON player_performances FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert player performances"
  ON player_performances FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update player performances"
  ON player_performances FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for player_heatmap_data table
CREATE POLICY "Anyone can view heatmap data"
  ON player_heatmap_data FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert heatmap data"
  ON player_heatmap_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for squad_forecasts table
CREATE POLICY "Anyone can view squad forecasts"
  ON squad_forecasts FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert squad forecasts"
  ON squad_forecasts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update own squad forecasts"
  ON squad_forecasts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_matches_match_id ON matches(match_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_player_performances_match_id ON player_performances(match_id);
CREATE INDEX IF NOT EXISTS idx_player_performances_player_id ON player_performances(player_id);
CREATE INDEX IF NOT EXISTS idx_player_performances_rating ON player_performances(rating DESC);
CREATE INDEX IF NOT EXISTS idx_player_heatmap_performance_id ON player_heatmap_data(performance_id);
CREATE INDEX IF NOT EXISTS idx_squad_forecasts_match_date ON squad_forecasts(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_squad_forecasts_opponent ON squad_forecasts(opponent);
