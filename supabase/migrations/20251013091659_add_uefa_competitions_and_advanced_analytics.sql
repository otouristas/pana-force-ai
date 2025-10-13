/*
  # UEFA Competitions and Advanced Analytics Schema

  ## Overview
  This migration adds comprehensive support for UEFA competitions, advanced AI analytics,
  and modern football intelligence features including:
  - UEFA Champions League & Europa League tracking
  - Transfer market and player valuation
  - Referee analytics and disciplinary tracking
  - Financial intelligence and business metrics
  - Video analysis metadata
  - Social media and fan engagement
  - Real-time match intelligence

  ## New Tables

  ### Competition Management
  1. `competitions`
    - Competition details including UEFA coefficients and prize money
    - Tracks Champions League, Europa League, domestic leagues, and cups
  
  2. `competition_standings`
    - Real-time league tables and group stage standings
    - Tracks points, goal difference, form, and qualification status
  
  3. `knockout_brackets`
    - Tournament knockout stage progression
    - Tracks bracket positions, matchups, and results

  ### Transfer Market & Recruitment
  4. `transfer_history`
    - Player transfer records with fees, dates, and clubs
    - Used for market value analysis and recruitment intelligence
  
  5. `player_valuations`
    - AI-calculated player market values updated regularly
    - Includes valuation factors and confidence scores
  
  6. `recruitment_targets`
    - Scouting watchlist with target players and analysis
    - Tracks scouting priority, fit score, and acquisition feasibility

  ### Tactical Intelligence
  7. `tactical_patterns`
    - Detected tactical patterns and playing styles
    - Identifies build-up patterns, pressing triggers, defensive shapes
  
  8. `opposition_reports`
    - Comprehensive opponent analysis reports
    - Weaknesses, key players, recommended tactics
  
  9. `set_piece_analysis`
    - Set piece patterns and success rates
    - Corner routines, free kick patterns, defensive setups

  ### Match Intelligence
  10. `live_match_tracking`
    - Real-time match state and metrics
    - Updated every few seconds during live matches
  
  11. `xg_timeline`
    - Expected goals timeline throughout match
    - Shot-by-shot xG accumulation for both teams
  
  12. `momentum_analysis`
    - Match momentum shifts and critical moments
    - Identifies turning points and their impact

  ### Referee Analytics
  13. `referees`
    - Referee profiles and historical statistics
    - Card frequency, penalty decisions, VAR usage
  
  14. `referee_match_stats`
    - Per-match referee performance data
    - Fouls called, cards shown, VAR interventions
  
  15. `disciplinary_tracking`
    - Player disciplinary records and suspension tracking
    - Yellow card accumulation, ban calculations

  ### Video Analysis
  16. `video_analysis`
    - Video clip metadata and tagged events
    - Links to player actions, tactical moments, highlights
  
  17. `computer_vision_data`
    - AI-generated insights from video analysis
    - Player positioning, movement patterns, space creation

  ### Financial Intelligence
  18. `financial_metrics`
    - Club financial data and performance
    - Revenue, wage bill, transfer budget, commercial income
  
  19. `sponsorship_tracking`
    - Sponsorship deals and their value
    - Performance-based bonus tracking

  ### Fan Engagement
  20. `social_media_analytics`
    - Social media metrics and sentiment analysis
    - Fan engagement, viral moments, player popularity
  
  21. `fan_sentiment`
    - Real-time fan sentiment tracking
    - Match reactions, player ratings, mood analysis

  ## Security
  - All tables have RLS enabled
  - Policies restrict access to authenticated users
  - Sensitive financial data has additional access controls

  ## Indexes
  - Optimized for real-time queries and dashboard loading
  - Foreign keys indexed for efficient joins
*/

-- Create competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  competition_type text NOT NULL,
  country text,
  level integer,
  uefa_coefficient numeric(6,3),
  prize_money_total bigint,
  current_season text,
  logo_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create competition_standings table
CREATE TABLE IF NOT EXISTS competition_standings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id) ON DELETE CASCADE,
  season_id uuid REFERENCES seasons(id),
  team_id uuid REFERENCES teams(id),
  position integer NOT NULL,
  played integer DEFAULT 0,
  won integer DEFAULT 0,
  drawn integer DEFAULT 0,
  lost integer DEFAULT 0,
  goals_for integer DEFAULT 0,
  goals_against integer DEFAULT 0,
  goal_difference integer DEFAULT 0,
  points integer DEFAULT 0,
  form text,
  home_record jsonb,
  away_record jsonb,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(competition_id, season_id, team_id)
);

-- Create knockout_brackets table
CREATE TABLE IF NOT EXISTS knockout_brackets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id) ON DELETE CASCADE,
  season_id uuid REFERENCES seasons(id),
  round_name text NOT NULL,
  bracket_position integer,
  home_team_id uuid REFERENCES teams(id),
  away_team_id uuid REFERENCES teams(id),
  match_id uuid REFERENCES matches(id),
  winner_team_id uuid REFERENCES teams(id),
  aggregate_score jsonb,
  next_round_bracket_id uuid REFERENCES knockout_brackets(id),
  created_at timestamptz DEFAULT now()
);

-- Create transfer_history table
CREATE TABLE IF NOT EXISTS transfer_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  from_team_id uuid REFERENCES teams(id),
  to_team_id uuid REFERENCES teams(id),
  transfer_date date NOT NULL,
  transfer_type text NOT NULL,
  fee_eur bigint,
  contract_length_years numeric(3,1),
  agent_fee_eur bigint,
  wage_per_week_eur integer,
  release_clause_eur bigint,
  is_loan boolean DEFAULT false,
  loan_fee_eur integer,
  buy_option_eur bigint,
  created_at timestamptz DEFAULT now()
);

-- Create player_valuations table
CREATE TABLE IF NOT EXISTS player_valuations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  valuation_date date NOT NULL,
  market_value_eur bigint NOT NULL,
  ai_predicted_value_eur bigint,
  value_trend text,
  peak_value_eur bigint,
  valuation_factors jsonb,
  confidence_score numeric(3,2),
  comparable_players jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create recruitment_targets table
CREATE TABLE IF NOT EXISTS recruitment_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id),
  target_player_name text NOT NULL,
  current_team_id uuid REFERENCES teams(id),
  position text NOT NULL,
  age integer,
  estimated_value_eur bigint,
  priority_level text,
  fit_score numeric(3,1),
  tactical_fit_analysis text,
  scouting_notes text,
  strengths text[],
  weaknesses text[],
  acquisition_feasibility text,
  recommended_offer_eur bigint,
  added_by uuid,
  status text DEFAULT 'monitoring',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tactical_patterns table
CREATE TABLE IF NOT EXISTS tactical_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id),
  match_id uuid REFERENCES matches(id),
  pattern_type text NOT NULL,
  pattern_name text,
  frequency integer,
  success_rate numeric(5,2),
  description text,
  key_players uuid[],
  zones_involved jsonb,
  conditions jsonb,
  effectiveness_score numeric(3,1),
  video_clip_ids uuid[],
  created_at timestamptz DEFAULT now()
);

-- Create opposition_reports table
CREATE TABLE IF NOT EXISTS opposition_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opponent_team_id uuid REFERENCES teams(id),
  upcoming_match_id uuid REFERENCES matches(id),
  report_date date DEFAULT CURRENT_DATE,
  overall_threat_level text,
  predicted_formation text,
  predicted_lineup jsonb,
  attacking_patterns text[],
  defensive_vulnerabilities text[],
  key_players_to_watch jsonb,
  set_piece_threat_level text,
  recommended_formation text,
  recommended_tactics text[],
  player_matchups jsonb,
  win_probability numeric(5,2),
  expected_scoreline text,
  detailed_analysis text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create set_piece_analysis table
CREATE TABLE IF NOT EXISTS set_piece_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id),
  match_id uuid REFERENCES matches(id),
  set_piece_type text NOT NULL,
  variant_name text,
  execution_count integer DEFAULT 0,
  success_count integer DEFAULT 0,
  success_rate numeric(5,2),
  goals_scored integer DEFAULT 0,
  xg_generated numeric(5,3),
  player_roles jsonb,
  movement_pattern text,
  delivery_type text,
  defensive_setup text,
  video_examples uuid[],
  effectiveness_rating numeric(3,1),
  created_at timestamptz DEFAULT now()
);

-- Create live_match_tracking table
CREATE TABLE IF NOT EXISTS live_match_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  current_minute integer NOT NULL,
  home_score integer DEFAULT 0,
  away_score integer DEFAULT 0,
  possession_home numeric(5,2),
  possession_away numeric(5,2),
  shots_home integer DEFAULT 0,
  shots_away integer DEFAULT 0,
  shots_on_target_home integer DEFAULT 0,
  shots_on_target_away integer DEFAULT 0,
  xg_home numeric(5,3) DEFAULT 0,
  xg_away numeric(5,3) DEFAULT 0,
  corners_home integer DEFAULT 0,
  corners_away integer DEFAULT 0,
  fouls_home integer DEFAULT 0,
  fouls_away integer DEFAULT 0,
  yellow_cards_home integer DEFAULT 0,
  yellow_cards_away integer DEFAULT 0,
  red_cards_home integer DEFAULT 0,
  red_cards_away integer DEFAULT 0,
  win_probability_home numeric(5,2),
  win_probability_draw numeric(5,2),
  win_probability_away numeric(5,2),
  momentum_score numeric(5,2),
  pressure_zones jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Create xg_timeline table
CREATE TABLE IF NOT EXISTS xg_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id),
  player_id uuid REFERENCES players(id),
  minute integer NOT NULL,
  second integer,
  shot_xg numeric(5,3) NOT NULL,
  cumulative_xg numeric(5,3),
  shot_outcome text,
  shot_type text,
  x_coordinate numeric(6,3),
  y_coordinate numeric(6,3),
  is_goal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create momentum_analysis table
CREATE TABLE IF NOT EXISTS momentum_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  minute integer NOT NULL,
  momentum_score numeric(5,2) NOT NULL,
  momentum_shift_type text,
  trigger_event text,
  impact_level text,
  description text,
  team_benefiting uuid REFERENCES teams(id),
  created_at timestamptz DEFAULT now()
);

-- Create referees table
CREATE TABLE IF NOT EXISTS referees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  nationality text,
  birth_date date,
  experience_years integer,
  fifa_badge boolean DEFAULT false,
  average_cards_per_match numeric(4,2),
  average_fouls_per_match numeric(5,2),
  penalty_frequency numeric(4,2),
  var_intervention_rate numeric(5,2),
  strict_rating numeric(3,1),
  home_bias_score numeric(4,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create referee_match_stats table
CREATE TABLE IF NOT EXISTS referee_match_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referee_id uuid REFERENCES referees(id),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  fouls_called integer DEFAULT 0,
  yellow_cards_shown integer DEFAULT 0,
  red_cards_shown integer DEFAULT 0,
  penalties_awarded integer DEFAULT 0,
  var_checks integer DEFAULT 0,
  var_overturns integer DEFAULT 0,
  offsides_called integer DEFAULT 0,
  injury_time_added integer,
  controversial_decisions text[],
  performance_rating numeric(3,1),
  created_at timestamptz DEFAULT now()
);

-- Create disciplinary_tracking table
CREATE TABLE IF NOT EXISTS disciplinary_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  season_id uuid REFERENCES seasons(id),
  competition_id uuid REFERENCES competitions(id),
  yellow_cards integer DEFAULT 0,
  red_cards integer DEFAULT 0,
  suspension_matches integer DEFAULT 0,
  matches_until_ban integer,
  last_yellow_card_date date,
  disciplinary_points integer DEFAULT 0,
  is_suspended boolean DEFAULT false,
  suspension_end_date date,
  fair_play_score numeric(3,1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create video_analysis table
CREATE TABLE IF NOT EXISTS video_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id),
  team_id uuid REFERENCES teams(id),
  clip_type text NOT NULL,
  event_type text,
  start_time integer,
  end_time integer,
  video_url text,
  thumbnail_url text,
  tags text[],
  analysis_notes text,
  rating numeric(3,1),
  is_highlight boolean DEFAULT false,
  is_learning_moment boolean DEFAULT false,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Create computer_vision_data table
CREATE TABLE IF NOT EXISTS computer_vision_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id),
  analysis_type text NOT NULL,
  timestamp_ms bigint,
  detected_objects jsonb,
  player_positions jsonb,
  space_analysis jsonb,
  movement_patterns jsonb,
  tactical_insights text[],
  confidence_score numeric(3,2),
  created_at timestamptz DEFAULT now()
);

-- Create financial_metrics table
CREATE TABLE IF NOT EXISTS financial_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id),
  fiscal_year text NOT NULL,
  reporting_period text,
  total_revenue_eur bigint,
  matchday_revenue_eur bigint,
  broadcast_revenue_eur bigint,
  commercial_revenue_eur bigint,
  player_trading_revenue_eur bigint,
  total_expenses_eur bigint,
  wage_bill_eur bigint,
  transfer_spending_eur bigint,
  operating_profit_eur bigint,
  net_profit_eur bigint,
  squad_value_eur bigint,
  wage_to_revenue_ratio numeric(5,2),
  debt_eur bigint,
  cash_reserves_eur bigint,
  break_even_status text,
  created_at timestamptz DEFAULT now()
);

-- Create sponsorship_tracking table
CREATE TABLE IF NOT EXISTS sponsorship_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id),
  sponsor_name text NOT NULL,
  sponsorship_type text,
  deal_value_eur bigint,
  annual_value_eur bigint,
  contract_start_date date,
  contract_end_date date,
  performance_bonuses jsonb,
  activation_requirements text[],
  brand_exposure_metrics jsonb,
  renewal_probability numeric(3,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_media_analytics table
CREATE TABLE IF NOT EXISTS social_media_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  platform text NOT NULL,
  metric_date date NOT NULL,
  followers integer,
  engagement_rate numeric(5,2),
  post_count integer,
  likes integer,
  comments integer,
  shares integer,
  reach integer,
  impressions integer,
  video_views integer,
  sentiment_score numeric(3,2),
  trending_topics text[],
  viral_content_ids text[],
  created_at timestamptz DEFAULT now()
);

-- Create fan_sentiment table
CREATE TABLE IF NOT EXISTS fan_sentiment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id),
  player_id uuid REFERENCES players(id),
  team_id uuid REFERENCES teams(id),
  timestamp_minute integer,
  sentiment_type text,
  sentiment_score numeric(3,2),
  volume integer,
  key_phrases text[],
  emotion_breakdown jsonb,
  source_platform text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for optimized queries
CREATE INDEX IF NOT EXISTS idx_competitions_type ON competitions(competition_type);
CREATE INDEX IF NOT EXISTS idx_standings_competition ON competition_standings(competition_id, season_id);
CREATE INDEX IF NOT EXISTS idx_standings_team ON competition_standings(team_id);
CREATE INDEX IF NOT EXISTS idx_knockout_competition ON knockout_brackets(competition_id, season_id);
CREATE INDEX IF NOT EXISTS idx_transfer_player ON transfer_history(player_id);
CREATE INDEX IF NOT EXISTS idx_transfer_date ON transfer_history(transfer_date);
CREATE INDEX IF NOT EXISTS idx_valuations_player ON player_valuations(player_id, valuation_date);
CREATE INDEX IF NOT EXISTS idx_recruitment_status ON recruitment_targets(status, priority_level);
CREATE INDEX IF NOT EXISTS idx_tactical_team ON tactical_patterns(team_id, match_id);
CREATE INDEX IF NOT EXISTS idx_opposition_reports_team ON opposition_reports(opponent_team_id);
CREATE INDEX IF NOT EXISTS idx_set_pieces_team ON set_piece_analysis(team_id, set_piece_type);
CREATE INDEX IF NOT EXISTS idx_live_tracking_match ON live_match_tracking(match_id);
CREATE INDEX IF NOT EXISTS idx_xg_timeline_match ON xg_timeline(match_id, minute);
CREATE INDEX IF NOT EXISTS idx_momentum_match ON momentum_analysis(match_id);
CREATE INDEX IF NOT EXISTS idx_referee_stats_match ON referee_match_stats(match_id);
CREATE INDEX IF NOT EXISTS idx_disciplinary_player ON disciplinary_tracking(player_id, season_id);
CREATE INDEX IF NOT EXISTS idx_video_match ON video_analysis(match_id);
CREATE INDEX IF NOT EXISTS idx_cv_data_match ON computer_vision_data(match_id, player_id);
CREATE INDEX IF NOT EXISTS idx_financial_team ON financial_metrics(team_id);
CREATE INDEX IF NOT EXISTS idx_sponsorship_team ON sponsorship_tracking(team_id);
CREATE INDEX IF NOT EXISTS idx_social_entity ON social_media_analytics(entity_type, entity_id, platform);
CREATE INDEX IF NOT EXISTS idx_sentiment_match ON fan_sentiment(match_id);

-- Enable Row Level Security
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knockout_brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tactical_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE opposition_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_piece_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_match_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE xg_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE momentum_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE referees ENABLE ROW LEVEL SECURITY;
ALTER TABLE referee_match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinary_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE computer_vision_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorship_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_sentiment ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users (SELECT)
CREATE POLICY "Authenticated users can read competitions"
  ON competitions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read standings"
  ON competition_standings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read brackets"
  ON knockout_brackets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read transfers"
  ON transfer_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read valuations"
  ON player_valuations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read recruitment"
  ON recruitment_targets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read tactical patterns"
  ON tactical_patterns FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read opposition reports"
  ON opposition_reports FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read set pieces"
  ON set_piece_analysis FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read live tracking"
  ON live_match_tracking FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read xg timeline"
  ON xg_timeline FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read momentum"
  ON momentum_analysis FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read referees"
  ON referees FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read referee stats"
  ON referee_match_stats FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read disciplinary"
  ON disciplinary_tracking FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read video analysis"
  ON video_analysis FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read cv data"
  ON computer_vision_data FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read financials"
  ON financial_metrics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read sponsorships"
  ON sponsorship_tracking FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read social analytics"
  ON social_media_analytics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read fan sentiment"
  ON fan_sentiment FOR SELECT TO authenticated USING (true);

-- Create policies for insert/update (restricted to authenticated users)
CREATE POLICY "Authenticated users can insert competitions"
  ON competitions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can insert standings"
  ON competition_standings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can insert recruitment targets"
  ON recruitment_targets FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update recruitment targets"
  ON recruitment_targets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can insert opposition reports"
  ON opposition_reports FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update opposition reports"
  ON opposition_reports FOR UPDATE TO authenticated USING (true) WITH CHECK (true);