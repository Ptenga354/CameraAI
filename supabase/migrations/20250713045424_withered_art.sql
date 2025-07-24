/*
  # Create analytics and tracking tables

  1. New Tables
    - `customer_visits`
      - Track individual customer visits and demographics
    - `customer_flow`
      - Hourly customer flow data
    - `zone_activity`
      - Activity tracking per zone
    - `heatmap_data`
      - Heatmap coordinates and intensity
    - `queue_logs`
      - Queue length tracking over time
    - `system_metrics`
      - System performance and uptime metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for store-based access
*/

-- Create gender enum
CREATE TYPE gender_type AS ENUM ('male', 'female', 'unknown');

-- Create age group enum
CREATE TYPE age_group_type AS ENUM ('0-12', '13-17', '18-25', '26-35', '36-50', '51-65', '65+', 'unknown');

-- Create customer visits table
CREATE TABLE IF NOT EXISTS customer_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  camera_id uuid REFERENCES cameras(id) ON DELETE SET NULL,
  zone_id uuid REFERENCES zones(id) ON DELETE SET NULL,
  entry_time timestamptz NOT NULL,
  exit_time timestamptz,
  duration_minutes integer,
  estimated_age_group age_group_type DEFAULT 'unknown',
  estimated_gender gender_type DEFAULT 'unknown',
  confidence_score decimal(3,2) DEFAULT 0.0,
  path_data jsonb DEFAULT '[]', -- Array of zone visits
  created_at timestamptz DEFAULT now()
);

-- Create customer flow table (aggregated hourly data)
CREATE TABLE IF NOT EXISTS customer_flow (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  date_hour timestamptz NOT NULL, -- Rounded to hour
  total_visitors integer DEFAULT 0,
  peak_concurrent integer DEFAULT 0,
  average_stay_minutes decimal(5,2) DEFAULT 0.0,
  conversion_rate decimal(5,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, date_hour)
);

-- Create zone activity table
CREATE TABLE IF NOT EXISTS zone_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  zone_id uuid REFERENCES zones(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL,
  visitor_count integer DEFAULT 0,
  dwell_time_minutes decimal(5,2) DEFAULT 0.0,
  interaction_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create heatmap data table
CREATE TABLE IF NOT EXISTS heatmap_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  zone_id uuid REFERENCES zones(id) ON DELETE CASCADE,
  date date NOT NULL,
  x_coordinate decimal(5,2) NOT NULL, -- Percentage 0-100
  y_coordinate decimal(5,2) NOT NULL, -- Percentage 0-100
  intensity decimal(3,2) NOT NULL, -- 0.00 to 1.00
  visit_count integer DEFAULT 0,
  total_duration_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, zone_id, date, x_coordinate, y_coordinate)
);

-- Create queue logs table
CREATE TABLE IF NOT EXISTS queue_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  zone_id uuid REFERENCES zones(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL,
  queue_length integer DEFAULT 0,
  estimated_wait_time_minutes decimal(5,2) DEFAULT 0.0,
  service_rate decimal(5,2) DEFAULT 0.0, -- customers per minute
  created_at timestamptz DEFAULT now()
);

-- Create system metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  camera_id uuid REFERENCES cameras(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL,
  cpu_usage decimal(5,2) DEFAULT 0.0,
  memory_usage decimal(5,2) DEFAULT 0.0,
  disk_usage decimal(5,2) DEFAULT 0.0,
  network_bandwidth decimal(10,2) DEFAULT 0.0, -- Mbps
  frame_rate decimal(5,2) DEFAULT 0.0,
  detection_latency_ms integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customer_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for all analytics tables
CREATE POLICY "Users can read customer visits in their store"
  ON customer_visits FOR SELECT TO authenticated
  USING (store_id IN (SELECT store_id FROM store_users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can read customer flow in their store"
  ON customer_flow FOR SELECT TO authenticated
  USING (store_id IN (SELECT store_id FROM store_users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can read zone activity in their store"
  ON zone_activity FOR SELECT TO authenticated
  USING (store_id IN (SELECT store_id FROM store_users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can read heatmap data in their store"
  ON heatmap_data FOR SELECT TO authenticated
  USING (store_id IN (SELECT store_id FROM store_users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can read queue logs in their store"
  ON queue_logs FOR SELECT TO authenticated
  USING (store_id IN (SELECT store_id FROM store_users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can read system metrics in their store"
  ON system_metrics FOR SELECT TO authenticated
  USING (store_id IN (SELECT store_id FROM store_users WHERE email = auth.jwt() ->> 'email'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_visits_store_entry ON customer_visits(store_id, entry_time DESC);
CREATE INDEX IF NOT EXISTS idx_customer_flow_store_date ON customer_flow(store_id, date_hour DESC);
CREATE INDEX IF NOT EXISTS idx_zone_activity_zone_timestamp ON zone_activity(zone_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_heatmap_data_store_date ON heatmap_data(store_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_queue_logs_zone_timestamp ON queue_logs(zone_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_metrics_camera_timestamp ON system_metrics(camera_id, timestamp DESC);