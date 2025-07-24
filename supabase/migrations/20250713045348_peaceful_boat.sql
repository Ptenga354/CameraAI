/*
  # Create users and stores tables

  1. New Tables
    - `stores`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `timezone` (text)
      - `created_at` (timestamp)
    - `store_users`
      - `id` (uuid, primary key)
      - `store_id` (uuid, foreign key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (enum)
      - `permissions` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  timezone text DEFAULT 'Asia/Ho_Chi_Minh',
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'viewer');

-- Create store users table
CREATE TABLE IF NOT EXISTS store_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role DEFAULT 'viewer',
  permissions jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;

-- Create policies for stores
CREATE POLICY "Users can read stores they belong to"
  ON stores
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT store_id FROM store_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Create policies for store_users
CREATE POLICY "Users can read store users in their store"
  ON store_users
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT store_id FROM store_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_store_users_store_id ON store_users(store_id);
CREATE INDEX IF NOT EXISTS idx_store_users_email ON store_users(email);