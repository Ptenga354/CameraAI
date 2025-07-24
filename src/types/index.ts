export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  streamUrl: string;
  zone: string;
}

export interface Alert {
  id: string;
  type: 'suspicious_behavior' | 'crowding' | 'queue_length' | 'abandoned_item' | 'unauthorized_area';
  message: string;
  timestamp: Date;
  camera: string;
  zone: string;
  status: 'new' | 'viewed' | 'resolved';
  severity: 'low' | 'medium' | 'high';
}

export interface CustomerFlow {
  timestamp: string;
  count: number;
  hour: number;
}

export interface Demographics {
  age_group: string;
  gender: string;
  count: number;
  percentage: number;
}

export interface QueueStatus {
  zone: string;
  currentLength: number;
  averageWaitTime: number;
  maxCapacity: number;
}

export interface HeatmapData {
  x: number;
  y: number;
  intensity: number;
}

export interface DashboardStats {
  todayVisitors: number;
  currentVisitors: number;
  averageStayTime: number;
  conversionRate: number;
}

export interface CustomerVisit {
  id: number;
  gender: string;
  age: string;
  time: string; // HH:mm:ss
  date: string; // YYYY-MM-DD
  action: string; // 'in' | 'out'
}