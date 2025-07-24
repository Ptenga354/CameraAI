import { supabase } from '../lib/supabase'
import { 
  Camera, 
  Alert, 
  CustomerFlow, 
  Demographics, 
  QueueStatus, 
  HeatmapData,
  DashboardStats,
  CustomerVisit
} from '../types'

// Default store ID for demo purposes
const DEFAULT_STORE_ID = '71e58afd-4006-4c58-9b75-1243a9d883fc'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function getTodayDateUTC7() {
  const now = new Date();
  // UTC+7 = UTC + 7*60*60*1000
  const utc7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return utc7.toISOString().split('T')[0];
}

export const supabaseApi = {
  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300)
    try {
      const today = getTodayDateUTC7();
      const { data, error } = await supabase
        .from('customer_visit')
        .select('id, time, action')
        .eq('date', today);

      if (error || !data) throw error;

      // Số khách vào trong ngày
      const inRecords = data.filter(v => v.action === 'in');
      const outRecords = data.filter(v => v.action === 'out');
      const todayVisitors = inRecords.length;

      // Số khách hiện có trong cửa hàng
      const currentVisitors = inRecords.length - outRecords.length;

      // Tính thời gian lưu trú trung bình
      // Ghép từng lượt in với lượt out tiếp theo (giả sử dữ liệu theo thứ tự thời gian)
      let totalStayMinutes = 0;
      let paired = 0;
      const outs = [...outRecords];
      inRecords.forEach(inVisit => {
        // Tìm lượt out gần nhất sau lượt in
        const outVisitIdx = outs.findIndex(o => o.id > inVisit.id);
        if (outVisitIdx !== -1) {
          const outVisit = outs[outVisitIdx];
          // Tính phút giữa in và out
          const inTime = inVisit.time.split(':').map(Number);
          const outTime = outVisit.time.split(':').map(Number);
          const minutes = (outTime[0] * 60 + outTime[1]) - (inTime[0] * 60 + inTime[1]);
          if (minutes > 0) {
            totalStayMinutes += minutes;
            paired++;
          }
          outs.splice(outVisitIdx, 1); // Đã ghép thì bỏ khỏi mảng
        }
      });
      const averageStayTime = paired > 0 ? Math.round((totalStayMinutes / paired) * 10) / 10 : 0;

      return {
        todayVisitors,
        currentVisitors,
        averageStayTime,
        conversionRate: 0 // Tạm thời chưa tính
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        todayVisitors: 0,
        currentVisitors: 0,
        averageStayTime: 0,
        conversionRate: 0
      }
    }
  },

  async getCustomerFlow(timeRange: 'today' | 'yesterday' | '7days' = 'today'): Promise<CustomerFlow[]> {
    await delay(200)

    try {
      const flowMap: { [hour: number]: number } = {}
      for (let h = 0; h < 24; h++) flowMap[h] = 0

      let startDate: Date, endDate: Date

      const today = new Date()
      if (timeRange === 'today') {
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      } else if (timeRange === 'yesterday') {
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      } else {
        // Last 7 days
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      }

      // Truy vấn lượt vào/ra theo thời gian
      const { data, error } = await supabase
        .from('customer_visit')
        .select('time, date, action')
        .gte('date', startDate.toISOString().split('T')[0])
        .lt('date', endDate.toISOString().split('T')[0])
        .order('time', { ascending: true })

      if (error) throw error

      // Tạo danh sách khách đang có mặt (theo lượt "in" -> "out")
      const stack: { time: string; hour: number }[] = []

      for (const record of data || []) {
        const visitHour = new Date(`1970-01-01T${record.time}`).getHours()

        if (record.action === 'in') {
          stack.push({ time: record.time, hour: visitHour })
        } else if (record.action === 'out' && stack.length > 0) {
          const inRecord = stack.shift()
          if (!inRecord) continue

          const inHour = inRecord.hour
          const outHour = visitHour

          // Tính số khách hiện diện trong từng giờ giữa vào và ra
          for (let h = inHour; h <= outHour && h < 24; h++) {
            flowMap[h] += 1
          }
        }
      }

      // Format kết quả
      const result: CustomerFlow[] = []
      for (let hour = 0; hour < 24; hour++) {
        result.push({
          timestamp: `${hour.toString().padStart(2, '0')}:00`,
          count: flowMap[hour],
          hour
        })
      }

      return result
    } catch (error) {
      console.error('Error calculating customer flow from visits:', error)

      // Dữ liệu giả nếu lỗi
      return Array.from({ length: 24 }, (_, hour) => ({
        timestamp: `${hour.toString().padStart(2, '0')}:00`,
        count: hour >= 8 && hour <= 22 ? Math.floor(Math.random() * 50) + 5 : 0,
        hour
      }))
    }
  },

  async getWeeklyFlow() {
    await delay(250)
    
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const { data, error } = await supabase
        .from('customer_flow')
        .select('date_hour, total_visitors')
        .eq('store_id', DEFAULT_STORE_ID)
        .gte('date_hour', oneWeekAgo.toISOString())
        .order('date_hour')

      if (error) throw error

      // Group by day of week
      const weeklyData = [
        { day: 'Thứ 2', visitors: 0 },
        { day: 'Thứ 3', visitors: 0 },
        { day: 'Thứ 4', visitors: 0 },
        { day: 'Thứ 5', visitors: 0 },
        { day: 'Thứ 6', visitors: 0 },
        { day: 'Thứ 7', visitors: 0 },
        { day: 'Chủ nhật', visitors: 0 }
      ]

      data?.forEach(record => {
        const date = new Date(record.date_hour)
        const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
        const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to Monday = 0
        weeklyData[dayIndex].visitors += record.total_visitors
      })

      return weeklyData
    } catch (error) {
      console.error('Error fetching weekly flow:', error)
      return [
        { day: 'Thứ 2', visitors: 245 },
        { day: 'Thứ 3', visitors: 278 },
        { day: 'Thứ 4', visitors: 312 },
        { day: 'Thứ 5', visitors: 289 },
        { day: 'Thứ 6', visitors: 356 },
        { day: 'Thứ 7', visitors: 423 },
        { day: 'Chủ nhật', visitors: 398 }
      ]
    }
  },

  async getHeatmapData(): Promise<HeatmapData[]> {
    await delay(300)
    
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('heatmap_data')
        .select('x_coordinate, y_coordinate, intensity')
        .eq('store_id', DEFAULT_STORE_ID)
        .eq('date', today)
        .limit(50)

      if (error) throw error

      return data?.map(record => ({
        x: record.x_coordinate,
        y: record.y_coordinate,
        intensity: record.intensity
      })) || []
    } catch (error) {
      console.error('Error fetching heatmap data:', error)
      // Return fallback data
      return [
        { x: 10, y: 90, intensity: 0.9 },
        { x: 15, y: 90, intensity: 0.8 },
        { x: 30, y: 70, intensity: 0.6 },
        { x: 60, y: 50, intensity: 0.4 },
        { x: 80, y: 20, intensity: 0.8 }
      ]
    }
  },

  async getQueueStatus(): Promise<QueueStatus[]> {
    await delay(200)
    
    try {
      // Get latest queue data for checkout zones
      const { data, error } = await supabase
        .from('queue_logs')
        .select(`
          queue_length,
          estimated_wait_time_minutes,
          zones!inner(name)
        `)
        .eq('store_id', DEFAULT_STORE_ID)
        .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .order('timestamp', { ascending: false })
        .limit(10)

      if (error) throw error

      // Group by zone and get latest data
      const queueMap = new Map()
      data?.forEach(record => {
        const zoneName = (record.zones as any)?.name
        if (zoneName && !queueMap.has(zoneName)) {
          queueMap.set(zoneName, {
            zone: zoneName,
            currentLength: record.queue_length,
            averageWaitTime: record.estimated_wait_time_minutes,
            maxCapacity: 10
          })
        }
      })

      const queueData = Array.from(queueMap.values())
      
      // Add default checkout queues if no data
      if (queueData.length === 0) {
        return [
          { zone: 'Quầy thanh toán 1', currentLength: 3, averageWaitTime: 2.5, maxCapacity: 10 },
          { zone: 'Quầy thanh toán 2', currentLength: 5, averageWaitTime: 4.2, maxCapacity: 10 },
          { zone: 'Quầy thanh toán 3', currentLength: 2, averageWaitTime: 1.8, maxCapacity: 10 }
        ]
      }

      return queueData
    } catch (error) {
      console.error('Error fetching queue status:', error)
      return [
        { zone: 'Quầy thanh toán 1', currentLength: 3, averageWaitTime: 2.5, maxCapacity: 10 },
        { zone: 'Quầy thanh toán 2', currentLength: 5, averageWaitTime: 4.2, maxCapacity: 10 }
      ]
    }
  },

  // Camera APIs
  async getCameras(): Promise<Camera[]> {
    await delay(200)
    
    try {
      const { data, error } = await supabase
        .from('cameras')
        .select('*')
        // .eq('store_id', DEFAULT_STORE_ID)
        // .order('name')
      
      console.log('Fetched cameras:', data)
      if (error) throw error

      return data?.map(camera => ({
        id: camera.id,
        name: camera.name,
        location: camera.location,
        status: camera.status as 'online' | 'offline' | 'maintenance',
        streamUrl: camera.stream_url || '',
        zone: (camera.zones as any)?.name || 'unknown'
      })) || []
    } catch (error) {
      console.error('Error fetching cameras:', error)
      return []
    }
  },

  async addCamera(camera: Partial<Camera>): Promise<Camera | null> {
    const { data, error } = await supabase
      .from('cameras')
      .insert([camera])
      .select('*')
      .single();
    if (error) return null;
    return data;
  },

  async updateCamera(id: string, camera: Partial<Camera>): Promise<Camera | null> {
    const { data, error } = await supabase
      .from('cameras')
      .update(camera)
      .eq('id', id)
      .select('*')
      .single();
    if (error) return null;
    return data;
  },

  async deleteCamera(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('cameras')
      .delete()
      .eq('id', id);
    return !error;
  },

  // Alert APIs
  async getAlerts(filters?: { status?: string; type?: string; limit?: number }): Promise<Alert[]> {
    await delay(300)
    
    try {
      let query = supabase
        .from('alerts')
        .select(`
          id,
          message,
          status,
          severity,
          confidence,
          created_at,
          cameras!inner(name),
          zones!inner(name),
          alert_types!inner(name)
        `)
        .eq('store_id', DEFAULT_STORE_ID)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      } else {
        query = query.limit(50)
      }

      const { data, error } = await query

      if (error) throw error

      return data?.map(alert => ({
        id: alert.id,
        type: (alert.alert_types as any)?.name || 'unknown',
        message: alert.message,
        timestamp: new Date(alert.created_at),
        camera: (alert.cameras as any)?.name || 'unknown',
        zone: (alert.zones as any)?.name || 'unknown',
        status: alert.status as 'new' | 'viewed' | 'resolved',
        severity: alert.severity as 'low' | 'medium' | 'high'
      })) || []
    } catch (error) {
      console.error('Error fetching alerts:', error)
      return []
    }
  },

  async updateAlertStatus(alertId: string, status: 'new' | 'viewed' | 'resolved'): Promise<Alert> {
    await delay(200)
    
    try {
      const { data, error } = await supabase
        .from('alerts')
        .update({ 
          status,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select(`
          id,
          message,
          status,
          severity,
          created_at,
          cameras!inner(name),
          zones!inner(name),
          alert_types!inner(name)
        `)
        .single()

      if (error) throw error

      return {
        id: data.id,
        type: (data.alert_types as any)?.name || 'unknown',
        message: data.message,
        timestamp: new Date(data.created_at),
        camera: (data.cameras as any)?.name || 'unknown',
        zone: (data.zones as any)?.name || 'unknown',
        status: data.status as 'new' | 'viewed' | 'resolved',
        severity: data.severity as 'low' | 'medium' | 'high'
      }
    } catch (error) {
      console.error('Error updating alert status:', error)
      throw error
    }
  },

  // Analytics APIs
  async getDemographics(): Promise<Demographics[]> {
    await delay(250)
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const { data, error } = await supabase
        .from('customer_visit')
        .select('gender, age')
        .gte('date', oneWeekAgo.toISOString().split('T')[0]);

      if (error) throw error;

      // Gom nhóm và đếm
      const demoMap = new Map();
      const total = data?.length || 0;
      data?.forEach(v => {
        const age_group = v.age || 'unknown';
        const gender = v.gender === 'male' ? 'Nam' : v.gender === 'female' ? 'Nữ' : v.gender;
        const key = `${age_group}-${gender}`;
        const current = demoMap.get(key) || { age_group, gender, count: 0 };
        current.count++;
        demoMap.set(key, current);
      });

      return Array.from(demoMap.values()).map(demo => ({
        ...demo,
        percentage: total > 0 ? Math.round((demo.count / total) * 100) : 0
      }));
    } catch (error) {
      return [];
    }
  },

  async getCurrentVisitorsToday(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('customer_visit')
      .select('action')
      .eq('date', today);

    if (error || !data) return 0;

    const inCount = data.filter(v => v.action === 'in').length;
    const outCount = data.filter(v => v.action === 'out').length;

    return inCount - outCount;
  }
}

// Lấy tất cả lượt vào/ra trong ngày
export async function getTodayVisits(): Promise<CustomerVisit[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('customer_visit')
    .select('*')
    .eq('date', today);

  if (error || !data) return [];
  return data;
}

// Tính số người hiện tại trong cửa hàng
export async function getCurrentVisitors(): Promise<number> {
  const visits = await getTodayVisits();
  const inCount = visits.filter(v => v.action === 'in').length;
  const outCount = visits.filter(v => v.action === 'out').length;
  return inCount - outCount;
}

// Lấy lưu lượng khách từng giờ trong ngày
export async function getCustomerFlowByHour(): Promise<{ hour: number, count: number }[]> {
  const visits = await getTodayVisits();
  // Sắp xếp theo thời gian tăng dần
  visits.sort((a, b) => a.time.localeCompare(b.time));

  // Tính số khách có mặt tại từng giờ
  const flow: { [hour: number]: number } = {};
  let currentCount = 0;
  let visitIdx = 0;

  for (let h = 0; h < 24; h++) {
    // Tính đến cuối giờ h
    while (
      visitIdx < visits.length &&
      parseInt(visits[visitIdx].time.slice(0, 2), 10) <= h
    ) {
      if (visits[visitIdx].action === 'in') currentCount++;
      if (visits[visitIdx].action === 'out') currentCount--;
      visitIdx++;
    }
    flow[h] = currentCount;
  }

  return Object.keys(flow).map(h => ({
    hour: Number(h),
    count: flow[Number(h)]
  }));
}