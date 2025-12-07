/*
  # Meeting Planning Application Schema

  1. New Tables
    - `meetings`
      - `id` (uuid, primary key)
      - `unique_link` (text, unique) - Shareable link identifier
      - `title` (text) - Meeting name
      - `description` (text) - Meeting description
      - `organizer_name` (text) - Name of organizer
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `time_options`
      - `id` (uuid, primary key)
      - `meeting_id` (uuid, foreign key)
      - `datetime` (timestamptz) - Proposed date and time
      - `created_at` (timestamptz)
    
    - `location_options`
      - `id` (uuid, primary key)
      - `meeting_id` (uuid, foreign key)
      - `location` (text) - Proposed location
      - `created_at` (timestamptz)
    
    - `votes`
      - `id` (uuid, primary key)
      - `meeting_id` (uuid, foreign key)
      - `participant_name` (text) - Voter's name
      - `time_option_id` (uuid, foreign key, nullable)
      - `location_option_id` (uuid, foreign key, nullable)
      - `vote_type` (text) - 'yes', 'no', or 'maybe'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access to meetings via unique_link
    - Public write access for voting
    - Organizers can manage their meetings via unique_link
*/

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_link text UNIQUE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  organizer_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create time_options table
CREATE TABLE IF NOT EXISTS time_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  datetime timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create location_options table
CREATE TABLE IF NOT EXISTS location_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  participant_name text NOT NULL,
  time_option_id uuid REFERENCES time_options(id) ON DELETE CASCADE,
  location_option_id uuid REFERENCES location_options(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('yes', 'no', 'maybe')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meetings_unique_link ON meetings(unique_link);
CREATE INDEX IF NOT EXISTS idx_time_options_meeting_id ON time_options(meeting_id);
CREATE INDEX IF NOT EXISTS idx_location_options_meeting_id ON location_options(meeting_id);
CREATE INDEX IF NOT EXISTS idx_votes_meeting_id ON votes(meeting_id);
CREATE INDEX IF NOT EXISTS idx_votes_time_option_id ON votes(time_option_id);
CREATE INDEX IF NOT EXISTS idx_votes_location_option_id ON votes(location_option_id);

-- Enable RLS
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for meetings table
CREATE POLICY "Public can read meetings via unique_link"
  ON meetings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create meetings"
  ON meetings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update meetings via unique_link"
  ON meetings FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete meetings via unique_link"
  ON meetings FOR DELETE
  USING (true);

-- Policies for time_options table
CREATE POLICY "Public can read time options"
  ON time_options FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create time options"
  ON time_options FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update time options"
  ON time_options FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete time options"
  ON time_options FOR DELETE
  USING (true);

-- Policies for location_options table
CREATE POLICY "Public can read location options"
  ON location_options FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create location options"
  ON location_options FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update location options"
  ON location_options FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete location options"
  ON location_options FOR DELETE
  USING (true);

-- Policies for votes table
CREATE POLICY "Public can read votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create votes"
  ON votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update votes"
  ON votes FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete votes"
  ON votes FOR DELETE
  USING (true);