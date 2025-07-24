import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          name: string
          address: string
          timezone: string
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          timezone?: string
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          timezone?: string
          settings?: any
          updated_at?: string
        }
      }
      cameras: {
        Row: {
          id: string
          store_id: string
          zone_id: string | null
          name: string
          location: string
          status: 'online' | 'offline' | 'maintenance'
          stream_url: string | null
          resolution: string
          fps: number
          settings: any
          capabilities: any
          last_seen: string | null
          uptime_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          zone_id?: string | null
          name: string
          location: string
          status?: 'online' | 'offline' | 'maintenance'
          stream_url?: string | null
          resolution?: string
          fps?: number
          settings?: any
          capabilities?: any
          last_seen?: string | null
          uptime_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          zone_id?: string | null
          name?: string
          location?: string
          status?: 'online' | 'offline' | 'maintenance'
          stream_url?: string | null
          resolution?: string
          fps?: number
          settings?: any
          capabilities?: any
          last_seen?: string | null
          uptime_percentage?: number
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          store_id: string
          camera_id: string | null
          zone_id: string | null
          alert_type_id: string
          message: string
          status: 'new' | 'viewed' | 'in_progress' | 'resolved' | 'false_positive'
          severity: 'low' | 'medium' | 'high' | 'critical'
          confidence: number
          metadata: any
          resolved_by: string | null
          resolved_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          camera_id?: string | null
          zone_id?: string | null
          alert_type_id: string
          message: string
          status?: 'new' | 'viewed' | 'in_progress' | 'resolved' | 'false_positive'
          severity?: 'low' | 'medium' | 'high' | 'critical'
          confidence?: number
          metadata?: any
          resolved_by?: string | null
          resolved_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          status?: 'new' | 'viewed' | 'in_progress' | 'resolved' | 'false_positive'
          resolved_by?: string | null
          resolved_at?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      customer_flow: {
        Row: {
          id: string
          store_id: string
          date_hour: string
          total_visitors: number
          peak_concurrent: number
          average_stay_minutes: number
          conversion_rate: number
          created_at: string
        }
      }
      customer_visits: {
        Row: {
          id: string
          store_id: string
          camera_id: string | null
          zone_id: string | null
          entry_time: string
          exit_time: string | null
          duration_minutes: number | null
          estimated_age_group: string
          estimated_gender: string
          confidence_score: number
          path_data: any
          created_at: string
        }
      }
      heatmap_data: {
        Row: {
          id: string
          store_id: string
          zone_id: string
          date: string
          x_coordinate: number
          y_coordinate: number
          intensity: number
          visit_count: number
          total_duration_minutes: number
          created_at: string
        }
      }
      queue_logs: {
        Row: {
          id: string
          store_id: string
          zone_id: string
          timestamp: string
          queue_length: number
          estimated_wait_time_minutes: number
          service_rate: number
          created_at: string
        }
      }
      zones: {
        Row: {
          id: string
          store_id: string
          name: string
          description: string | null
          coordinates: any
          max_capacity: number
          created_at: string
          updated_at: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'manager' | 'operator' | 'viewer'
      camera_status: 'online' | 'offline' | 'maintenance'
      alert_severity: 'low' | 'medium' | 'high' | 'critical'
      alert_status: 'new' | 'viewed' | 'in_progress' | 'resolved' | 'false_positive'
      gender_type: 'male' | 'female' | 'unknown'
      age_group_type: '0-12' | '13-17' | '18-25' | '26-35' | '36-50' | '51-65' | '65+' | 'unknown'
    }
  }
}