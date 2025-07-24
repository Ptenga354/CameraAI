/*
  # Create cameras and zones tables

  1. New Tables
    - `zones`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `coordinates` (jsonb) - for heatmap positioning
    - `cameras`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key)
      - `zone_id` (uuid, foreign key)
      - `name` (text)
      - `location` (text)
      - `status` (enum)
      - `stream_url` (text)
      - `settings` (jsonb)
      - `capabilities` (jsonb)

  2. Security
    - Enable RLS on both tables
    - Add policies for store-based access
*/

-- Create camera status enum
CREATE TYPE camera_status AS ENUM ('online', 'offline', 'maintenance');

-- Create zones table
CREATE TABLE IF NOT EXISTS zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  coordinates jsonb DEFAULT '{}', -- {x, y, width, height} for heatmap
  max_capacity integer DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cameras table
CREATE TABLE IF NOT EXISTS cameras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  zone_id uuid REFERENCES zones(id) ON DELETE SET NULL,
  name text NOT NULL,
  location text NOT NULL,
  status camera_status DEFAULT 'offline',
  stream_url text,
  resolution text DEFAULT '1920x1080',
  fps integer DEFAULT 30,
  settings jsonb DEFAULT '{
    "motionSensitivity": 0.7,
    "recordingEnabled": true,
    "alertsEnabled": true,
    "nightVision": false
  }',
  capabilities jsonb DEFAULT '["motion_detection", "object_tracking"]',
  last_seen timestamptz,
  uptime_percentage decimal(5,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;

-- Create policies for zones
CREATE POLICY "Users can read zones in their store"
  ON zones
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM store_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Create policies for cameras
CREATE POLICY "Users can read cameras in their store"
  ON cameras
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM store_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Managers can update cameras in their store"
  ON cameras
  FOR UPDATE
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM store_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND role IN ('admin', 'manager')
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_zones_store_id ON zones(store_id);
CREATE INDEX IF NOT EXISTS idx_cameras_store_id ON cameras(store_id);
CREATE INDEX IF NOT EXISTS idx_cameras_zone_id ON cameras(zone_id);
CREATE INDEX IF NOT EXISTS idx_cameras_status ON cameras(status);