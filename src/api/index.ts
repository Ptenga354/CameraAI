import { 
  mockCameras, 
  mockAlerts, 
  mockCustomerFlow, 
  mockDemographics, 
  mockQueueStatus, 
  mockHeatmapData,
  mockDashboardStats,
  mockWeeklyFlow
} from '../data/mockData';
import { supabaseApi } from './supabaseApi';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Toggle between mock data and Supabase data
const USE_SUPABASE = true;

export const api = {
  // Dashboard APIs
  async getDashboardStats() {
    if (USE_SUPABASE) {
      return supabaseApi.getDashboardStats();
    } else {
      await delay(500);
      return mockDashboardStats;
    }
  },

  async getCustomerFlow(timeRange?: 'today' | 'yesterday' | '7days') {
    if (USE_SUPABASE) {
      return supabaseApi.getCustomerFlow(timeRange);
    } else {
      await delay(300);
      return mockCustomerFlow;
    }
  },

  async getWeeklyFlow() {
    if (USE_SUPABASE) {
      return supabaseApi.getWeeklyFlow();
    } else {
      await delay(300);
      return mockWeeklyFlow;
    }
  },

  async getHeatmapData() {
    if (USE_SUPABASE) {
      return supabaseApi.getHeatmapData();
    } else {
      await delay(400);
      return mockHeatmapData;
    }
  },

  async getQueueStatus() {
    if (USE_SUPABASE) {
      return supabaseApi.getQueueStatus();
    } else {
      await delay(200);
      return mockQueueStatus;
    }
  },

  // Camera APIs
  async getCameras() {
    if (USE_SUPABASE) {
      return supabaseApi.getCameras();
    } else {
      await delay(300);
      return mockCameras;
    }
  },

  async getCameraById(id: string) {
    await delay(200);
    return mockCameras.find(camera => camera.id === id);
  },

  // Alert APIs
  async getAlerts(filters?: { status?: string; type?: string; limit?: number }) {
    if (USE_SUPABASE) {
      return supabaseApi.getAlerts(filters);
    }
    
    // Mock data fallback
    await delay(400);
    let filteredAlerts = [...mockAlerts];
    
    if (filters?.status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === filters.status);
    }
    
    if (filters?.type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === filters.type);
    }
    
    if (filters?.limit) {
      filteredAlerts = filteredAlerts.slice(0, filters.limit);
    }
    
    return filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  async updateAlertStatus(alertId: string, status: 'new' | 'viewed' | 'resolved') {
    if (USE_SUPABASE) {
      return supabaseApi.updateAlertStatus(alertId, status);
    } else {
      await delay(200);
      const alertIndex = mockAlerts.findIndex(alert => alert.id === alertId);
      if (alertIndex !== -1) {
        mockAlerts[alertIndex].status = status;
        return mockAlerts[alertIndex];
      }
      throw new Error('Alert not found');
    }
  },

  // Analytics APIs
  async getDemographics() {
    if (USE_SUPABASE) {
      return supabaseApi.getDemographics();
    } else {
      await delay(350);
      return mockDemographics;
    }
  },

  async getAnalyticsData() {
    await delay(500);
    return {
      demographics: USE_SUPABASE ? await supabaseApi.getDemographics() : mockDemographics,
      weeklyFlow: USE_SUPABASE ? await supabaseApi.getWeeklyFlow() : mockWeeklyFlow,
      averageStayTime: 18.5,
      averageInteractionTime: 3.2
    };
  }
};