/*
  # Comprehensive Soccer Analytics Platform Schema

  ## Overview
  This migration creates a complete database structure for a professional soccer analytics platform 
  with features inspired by Hudl IQ, Wyscout, and Instat, including player tracking, match analysis, 
  weather data integration, and tactical insights.

  ## New Tables

  ### Core Entities
  1. `teams`
    - Team information including club details, formation preferences, and tactical style
    - Used for both own team and opponent analysis
  
  2. `players`
    - Player profiles with position, physical attributes, and contract data
    - Links to team and includes performance metrics
  
  3. `matches`
    - Match records with date, location, competition, and result
    - Supports pre-match, live, and post-match states
  
  4. `seasons`
    - Season and competition tracking
  
  ### Weather and Conditions
  5. `weather_data`
    - Weather conditions for each match (temperature, humidity, wind, precipitation)
    - Used for performance correlation analysis
  
  ### Performance Tracking
  6. `player_match_stats`
    - Individual player statistics per match (distance, sprints, passes, shots, etc.)
    - Core performance metrics for analysis
  
  7. `player_tracking_data`
    - GPS tracking coordinates and timestamps for player positioning
    - Used for heatmaps and movement analysis
  
  8. `player_physical_metrics`
    - Physiological data (heart rate, workload, fatigue, recovery)
    - Used for injury prevention and load management
  
  ### Tactical Analysis
  9. `formations`
    - Team formations used in matches or training
    - Includes player positions in formation
  
  10. `match_events`
    - All tagged match events (passes, shots, tackles, etc.)
    - Includes coordinates, timestamps, and outcome
  
  11. `heatmap_data`
    - Pre-aggregated heatmap data for efficient visualization
    - Stores player activity density by pitch zone
  
  12. `tactical_analysis`
    - Automated tactical insights and patterns detected
    - Formation analysis, pressing patterns, build-up play styles
  
  ### Advanced Analytics
  13. `passing_networks`
    - Passing connections between players
    - Used for network visualizations
  
  14. `shot_maps`
    - Shot locations with xG (expected goals) values
    - Quality of scoring chances analysis
  
  15. `opponent_scouting`
    - Scouting reports on opponents
    - Tactical tendencies, key players, weaknesses
  
  16. `performance_predictions`
    - AI-generated predictions for upcoming matches
    - Incorporates weather, form, and tactical matchups
  
  ## Security
  - All tables have RLS enabled
  - Policies restrict access to authenticated users only
  - Data is protected by user authentication and authorization

  ## Indexes
  - Created on foreign keys and frequently queried columns
  - Optimized for dashboard loading and real-time queries
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  competition text NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  logo_url text,
  country text,
  league text,
  preferred_formation text,
  tactical_style text,
  is_own_team boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  jersey_number integer,
  position text NOT NULL,
  date_of_birth date,
  nationality text,
  height_cm integer,
  weight_kg integer,
  preferred_foot text,
  contract_until date,
  market_value_eur integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES seasons(id),
  home_team_id uuid REFERENCES teams(id),
  away_team_id uuid REFERENCES teams(id),
  match_date timestamptz NOT NULL,
  venue text,
  venue_city text,
  venue_country text,
  competition text,
  match_week integer,
  home_score integer,
  away_score integer,
  match_status text DEFAULT 'scheduled',
  possession_home integer,
  possession_away integer,
  attendance integer,
  referee text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  temperature_celsius numeric(5,2),
  feels_like_celsius numeric(5,2),
  humidity_percent integer,
  wind_speed_kmh numeric(5,2),
  wind_direction text,
  precipitation_mm numeric(5,2),
  weather_condition text,
  pressure_hpa integer,
  visibility_km numeric(5,2),
  uv_index integer,
  is_forecast boolean DEFAULT false,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create player_match_stats table
CREATE TABLE IF NOT EXISTS player_match_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  minutes_played integer DEFAULT 0,
  distance_km numeric(5,2),
  sprints integer,
  high_intensity_runs integer,
  passes_completed integer,
  passes_attempted integer,
  pass_accuracy_percent numeric(5,2),
  key_passes integer,
  assists integer,
  shots integer,
  shots_on_target integer,
  goals integer,
  xg numeric(5,3),
  tackles integer,
  interceptions integer,
  clearances integer,
  blocks integer,
  duels_won integer,
  duels_total integer,
  aerial_duels_won integer,
  aerial_duels_total integer,
  dribbles_successful integer,
  dribbles_attempted integer,
  fouls_committed integer,
  fouls_suffered integer,
  yellow_cards integer DEFAULT 0,
  red_cards integer DEFAULT 0,
  offsides integer,
  rating numeric(3,1),
  created_at timestamptz DEFAULT now()
);

-- Create player_tracking_data table
CREATE TABLE IF NOT EXISTS player_tracking_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  timestamp_ms bigint NOT NULL,
  match_minute integer,
  x_coordinate numeric(6,3),
  y_coordinate numeric(6,3),
  speed_kmh numeric(5,2),
  acceleration numeric(5,2),
  has_ball boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create player_physical_metrics table
CREATE TABLE IF NOT EXISTS player_physical_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  session_date date NOT NULL,
  session_type text,
  avg_heart_rate integer,
  max_heart_rate integer,
  heart_rate_variability integer,
  player_load integer,
  acute_load numeric(8,2),
  chronic_load numeric(8,2),
  acwr numeric(5,3),
  fatigue_score integer,
  recovery_score integer,
  readiness_score integer,
  sleep_hours numeric(4,2),
  sleep_quality integer,
  muscle_soreness integer,
  wellness_score integer,
  created_at timestamptz DEFAULT now()
);

-- Create formations table
CREATE TABLE IF NOT EXISTS formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id),
  formation_name text NOT NULL,
  formation_period text,
  start_minute integer,
  end_minute integer,
  player_positions jsonb,
  effectiveness_rating numeric(3,1),
  created_at timestamptz DEFAULT now()
);

-- Create match_events table
CREATE TABLE IF NOT EXISTS match_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id),
  player_id uuid REFERENCES players(id),
  event_type text NOT NULL,
  event_subtype text,
  match_minute integer,
  match_second integer,
  period text,
  x_coordinate numeric(6,3),
  y_coordinate numeric(6,3),
  end_x_coordinate numeric(6,3),
  end_y_coordinate numeric(6,3),
  outcome text,
  body_part text,
  assist_player_id uuid REFERENCES players(id),
  xg_value numeric(5,3),
  tags jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create heatmap_data table
CREATE TABLE IF NOT EXISTS heatmap_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id),
  zone_x integer NOT NULL,
  zone_y integer NOT NULL,
  activity_count integer DEFAULT 0,
  time_spent_seconds integer DEFAULT 0,
  touches integer DEFAULT 0,
  passes integer DEFAULT 0,
  defensive_actions integer DEFAULT 0,
  offensive_actions integer DEFAULT 0,
  intensity_score numeric(5,2),
  created_at timestamptz DEFAULT now(),
  UNIQUE(match_id, player_id, zone_x, zone_y)
);

-- Create tactical_analysis table
CREATE TABLE IF NOT EXISTS tactical_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id),
  analysis_type text NOT NULL,
  phase text,
  description text,
  metrics jsonb,
  insights text[],
  strengths text[],
  weaknesses text[],
  recommendations text[],
  confidence_score numeric(3,2),
  created_at timestamptz DEFAULT now()
);

-- Create passing_networks table
CREATE TABLE IF NOT EXISTS passing_networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id),
  passer_id uuid REFERENCES players(id),
  receiver_id uuid REFERENCES players(id),
  pass_count integer DEFAULT 0,
  successful_passes integer DEFAULT 0,
  avg_pass_length numeric(6,2),
  pass_types jsonb,
  zones jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create shot_maps table
CREATE TABLE IF NOT EXISTS shot_maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id),
  team_id uuid REFERENCES teams(id),
  match_minute integer,
  x_coordinate numeric(6,3),
  y_coordinate numeric(6,3),
  shot_type text,
  body_part text,
  outcome text,
  xg numeric(5,3),
  shot_power text,
  assist_type text,
  situation text,
  created_at timestamptz DEFAULT now()
);

-- Create opponent_scouting table
CREATE TABLE IF NOT EXISTS opponent_scouting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opponent_team_id uuid REFERENCES teams(id),
  match_id uuid REFERENCES matches(id),
  scout_date date DEFAULT CURRENT_DATE,
  tactical_setup text,
  defensive_style text,
  offensive_style text,
  set_piece_patterns jsonb,
  key_players jsonb,
  strengths text[],
  weaknesses text[],
  vulnerabilities jsonb,
  recommended_tactics text[],
  match_strategy text,
  notes text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create performance_predictions table
CREATE TABLE IF NOT EXISTS performance_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id),
  player_id uuid REFERENCES players(id),
  team_id uuid REFERENCES teams(id),
  prediction_type text NOT NULL,
  predicted_value numeric(8,2),
  confidence_score numeric(3,2),
  factors jsonb,
  weather_impact numeric(5,2),
  form_impact numeric(5,2),
  tactical_impact numeric(5,2),
  fatigue_impact numeric(5,2),
  prediction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for optimized queries
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_teams ON matches(home_team_id, away_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_season ON matches(season_id);
CREATE INDEX IF NOT EXISTS idx_weather_match ON weather_data(match_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_match ON player_match_stats(match_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_player ON player_match_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_tracking_match_player ON player_tracking_data(match_id, player_id);
CREATE INDEX IF NOT EXISTS idx_physical_player_date ON player_physical_metrics(player_id, session_date);
CREATE INDEX IF NOT EXISTS idx_match_events_match ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_match_events_type ON match_events(event_type);
CREATE INDEX IF NOT EXISTS idx_heatmap_match_player ON heatmap_data(match_id, player_id);
CREATE INDEX IF NOT EXISTS idx_formations_match ON formations(match_id);
CREATE INDEX IF NOT EXISTS idx_tactical_analysis_match ON tactical_analysis(match_id);
CREATE INDEX IF NOT EXISTS idx_passing_networks_match ON passing_networks(match_id);
CREATE INDEX IF NOT EXISTS idx_shot_maps_match ON shot_maps(match_id);
CREATE INDEX IF NOT EXISTS idx_scouting_opponent ON opponent_scouting(opponent_team_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON performance_predictions(match_id);

-- Enable Row Level Security on all tables
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_tracking_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_physical_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tactical_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE passing_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shot_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE opponent_scouting ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_predictions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Authenticated users can read seasons"
  ON seasons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read players"
  ON players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read matches"
  ON matches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read weather data"
  ON weather_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read player match stats"
  ON player_match_stats FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read tracking data"
  ON player_tracking_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read physical metrics"
  ON player_physical_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read formations"
  ON formations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read match events"
  ON match_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read heatmap data"
  ON heatmap_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read tactical analysis"
  ON tactical_analysis FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read passing networks"
  ON passing_networks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read shot maps"
  ON shot_maps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read opponent scouting"
  ON opponent_scouting FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read predictions"
  ON performance_predictions FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for insert/update/delete (restricted to authenticated users)
CREATE POLICY "Authenticated users can insert teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert players"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert weather data"
  ON weather_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert player stats"
  ON player_match_stats FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert scouting reports"
  ON opponent_scouting FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update scouting reports"
  ON opponent_scouting FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
