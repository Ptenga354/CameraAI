import { Camera, Alert, CustomerFlow, Demographics, QueueStatus, HeatmapData, DashboardStats } from '../types';

export const mockCameras: Camera[] = [
  {
    id: 'cam-001',
    name: 'Camera Lối vào chính',
    location: 'Entrance',
    status: 'online',
    streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    zone: 'entrance'
  },
  {
    id: 'cam-002',
    name: 'Camera Khu thời trang',
    location: 'Fashion Section',
    status: 'online',
    streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    zone: 'fashion'
  },
  {
    id: 'cam-003',
    name: 'Camera Quầy thanh toán',
    location: 'Checkout Counter',
    status: 'online',
    streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    zone: 'checkout'
  },
  {
    id: 'cam-004',
    name: 'Camera Khu điện tử',
    location: 'Electronics Section',
    status: 'maintenance',
    streamUrl: '',
    zone: 'electronics'
  },
  {
    id: 'cam-005',
    name: 'Camera Kho hàng',
    location: 'Storage Area',
    status: 'offline',
    streamUrl: '',
    zone: 'storage'
  },
  {
    id: 'cam-006',
    name: 'Camera Khu thực phẩm',
    location: 'Food Section',
    status: 'online',
    streamUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    zone: 'food'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'suspicious_behavior',
    message: 'Phát hiện hành vi đáng ngờ tại khu thời trang',
    timestamp: new Date(Date.now() - 300000),
    camera: 'cam-002',
    zone: 'fashion',
    status: 'new',
    severity: 'high'
  },
  {
    id: 'alert-002',
    type: 'queue_length',
    message: 'Hàng đợi quá dài tại quầy thanh toán (8 người)',
    timestamp: new Date(Date.now() - 600000),
    camera: 'cam-003',
    zone: 'checkout',
    status: 'viewed',
    severity: 'medium'
  },
  {
    id: 'alert-003',
    type: 'crowding',
    message: 'Quá đông người tại khu điện tử',
    timestamp: new Date(Date.now() - 900000),
    camera: 'cam-004',
    zone: 'electronics',
    status: 'resolved',
    severity: 'low'
  },
  {
    id: 'alert-004',
    type: 'abandoned_item',
    message: 'Phát hiện đồ vật bỏ quên tại lối vào',
    timestamp: new Date(Date.now() - 1800000),
    camera: 'cam-001',
    zone: 'entrance',
    status: 'new',
    severity: 'medium'
  },
  {
    id: 'alert-005',
    type: 'unauthorized_area',
    message: 'Có người vào khu vực không được phép',
    timestamp: new Date(Date.now() - 3600000),
    camera: 'cam-005',
    zone: 'storage',
    status: 'resolved',
    severity: 'high'
  }
];

export const mockCustomerFlow: CustomerFlow[] = [
  { timestamp: '00:00', count: 0, hour: 0 },
  { timestamp: '01:00', count: 0, hour: 1 },
  { timestamp: '02:00', count: 0, hour: 2 },
  { timestamp: '03:00', count: 0, hour: 3 },
  { timestamp: '04:00', count: 0, hour: 4 },
  { timestamp: '05:00', count: 0, hour: 5 },
  { timestamp: '06:00', count: 0, hour: 6 },
  { timestamp: '07:00', count: 0, hour: 7 },
  { timestamp: '08:00', count: 12, hour: 8 },
  { timestamp: '09:00', count: 25, hour: 9 },
  { timestamp: '10:00', count: 45, hour: 10 },
  { timestamp: '11:00', count: 67, hour: 11 },
  { timestamp: '12:00', count: 89, hour: 12 },
  { timestamp: '13:00', count: 92, hour: 13 },
  { timestamp: '14:00', count: 78, hour: 14 },
  { timestamp: '15:00', count: 85, hour: 15 },
  { timestamp: '16:00', count: 95, hour: 16 },
  { timestamp: '17:00', count: 102, hour: 17 },
  { timestamp: '18:00', count: 87, hour: 18 },
  { timestamp: '19:00', count: 65, hour: 19 },
  { timestamp: '20:00', count: 43, hour: 20 },
  { timestamp: '21:00', count: 28, hour: 21 },
  { timestamp: '22:00', count: 15, hour: 22 },
  { timestamp: '23:00', count: 5, hour: 23 }
];

export const mockWeeklyFlow = [
  { day: 'Thứ 2', visitors: 245 },
  { day: 'Thứ 3', visitors: 278 },
  { day: 'Thứ 4', visitors: 312 },
  { day: 'Thứ 5', visitors: 289 },
  { day: 'Thứ 6', visitors: 356 },
  { day: 'Thứ 7', visitors: 423 },
  { day: 'Chủ nhật', visitors: 398 }
];

export const mockDemographics: Demographics[] = [
  { age_group: '18-25', gender: 'Nam', count: 45, percentage: 25 },
  { age_group: '18-25', gender: 'Nữ', count: 52, percentage: 29 },
  { age_group: '26-35', gender: 'Nam', count: 38, percentage: 21 },
  { age_group: '26-35', gender: 'Nữ', count: 41, percentage: 23 },
  { age_group: '36-50', gender: 'Nam', count: 28, percentage: 15 },
  { age_group: '36-50', gender: 'Nữ', count: 31, percentage: 17 },
  { age_group: '50+', gender: 'Nam', count: 15, percentage: 8 },
  { age_group: '50+', gender: 'Nữ', count: 18, percentage: 10 }
];

export const mockQueueStatus: QueueStatus[] = [
  {
    zone: 'Quầy thanh toán 1',
    currentLength: 3,
    averageWaitTime: 2.5,
    maxCapacity: 10
  },
  {
    zone: 'Quầy thanh toán 2',
    currentLength: 5,
    averageWaitTime: 4.2,
    maxCapacity: 10
  },
  {
    zone: 'Quầy thanh toán 3',
    currentLength: 2,
    averageWaitTime: 1.8,
    maxCapacity: 10
  }
];

export const mockHeatmapData: HeatmapData[] = [
  // Entrance area - high traffic
  { x: 10, y: 90, intensity: 0.9 },
  { x: 15, y: 90, intensity: 0.8 },
  { x: 20, y: 90, intensity: 0.7 },
  
  // Fashion section - medium-high traffic
  { x: 30, y: 70, intensity: 0.6 },
  { x: 35, y: 70, intensity: 0.7 },
  { x: 40, y: 70, intensity: 0.5 },
  
  // Electronics section - medium traffic
  { x: 60, y: 50, intensity: 0.4 },
  { x: 65, y: 50, intensity: 0.5 },
  { x: 70, y: 50, intensity: 0.3 },
  
  // Checkout area - high traffic
  { x: 80, y: 20, intensity: 0.8 },
  { x: 85, y: 20, intensity: 0.9 },
  { x: 90, y: 20, intensity: 0.7 },
  
  // Food section - medium traffic
  { x: 20, y: 30, intensity: 0.4 },
  { x: 25, y: 30, intensity: 0.3 },
  { x: 30, y: 30, intensity: 0.5 }
];

export const mockDashboardStats: DashboardStats = {
  todayVisitors: 847,
  currentVisitors: 23,
  averageStayTime: 18.5,
  conversionRate: 12.8
};