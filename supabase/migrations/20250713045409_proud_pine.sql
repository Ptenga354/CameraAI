/*
  # Create alerts system tables

  1. New Tables
    - `alert_types`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `severity_level` (enum)
    - `alerts`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key)
      - `camera_id` (uuid, foreign key)
      - `zone_id` (uuid, foreign key)
      - `alert_type_id` (uuid, foreign key)
      - `message` (text)
      - `status` (enum)
      - `severity` (enum)
      - `confidence` (decimal)
      - `metadata` (jsonb)
      - `resolved_by` (uuid, foreign key)
      - `resolved_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for store-based access
*/

-- Create alert severity enum
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create alert status enum
CREATE TYPE alert_status AS ENUM ('new', 'viewed', 'in_progress', 'resolved', 'false_positive');

-- Create alert types table
CREATE TABLE IF NOT EXISTS alert_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  default_severity alert_severity DEFAULT 'medium',
  icon text,
  color text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  camera_id uuid REFERENCES cameras(id) ON DELETE SET NULL,
  zone_id uuid REFERENCES zones(id) ON DELETE SET NULL,
  alert_type_id uuid REFERENCES alert_types(id),
  message text NOT NULL,
  status alert_status DEFAULT 'new',
  severity alert_severity DEFAULT 'medium',
  confidence decimal(3,2) DEFAULT 0.0, -- 0.00 to 1.00
  metadata jsonb DEFAULT '{}',
  resolved_by uuid REFERENCES store_users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE alert_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for alert_types
CREATE POLICY "Anyone can read alert types"
  ON alert_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for alerts
CREATE POLICY "Users can read alerts in their store"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM store_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Users can update alerts in their store"
  ON alerts
  FOR UPDATE
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM store_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_alerts_store_id ON alerts(store_id);
CREATE INDEX IF NOT EXISTS idx_alerts_camera_id ON alerts(camera_id);
CREATE INDEX IF NOT EXISTS idx_alerts_zone_id ON alerts(zone_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);

-- Insert default alert types
INSERT INTO alert_types (name, description, default_severity, icon, color) VALUES
('suspicious_behavior', 'Hành vi đáng ngờ được phát hiện', 'high', 'shield-alert', '#ef4444'),
('crowding', 'Quá đông người tại một khu vực', 'medium', 'users', '#f59e0b'),
('queue_length', 'Hàng đợi quá dài', 'medium', 'clock', '#f59e0b'),
('abandoned_item', 'Phát hiện đồ vật bỏ quên', 'low', 'package', '#10b981'),
('unauthorized_area', 'Có người vào khu vực không được phép', 'high', 'map-pin', '#ef4444'),
('maintenance_required', 'Camera cần bảo trì', 'low', 'wrench', '#6b7280'),
('motion_detected', 'Phát hiện chuyển động bất thường', 'low', 'activity', '#3b82f6'),
('face_recognition', 'Nhận diện khuôn mặt', 'medium', 'user-check', '#8b5cf6');