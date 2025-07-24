import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import StatsCard from './components/Dashboard/StatsCard';
import CustomerFlowChart from './components/Dashboard/CustomerFlowChart';
import Heatmap from './components/Dashboard/Heatmap';
import QueueStatus from './components/Dashboard/QueueStatus';
import RecentAlerts from './components/Dashboard/RecentAlerts';
import CameraGrid from './components/LiveView/CameraGrid';
import DemographicsChart from './components/Analytics/DemographicsChart';
import WeeklyFlowChart from './components/Analytics/WeeklyFlowChart';
import AlertsTable from './components/Alerts/AlertsTable';
import CameraManagement from './components/Settings/CameraManagement';
import { api } from './api';
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp,
  Camera,
  BarChart3
} from 'lucide-react';
import { 
  Camera as CameraType, 
  Alert, 
  CustomerFlow, 
  Demographics, 
  QueueStatus as QueueStatusType, 
  HeatmapData,
  DashboardStats 
} from './types';

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [customerFlow, setCustomerFlow] = useState<CustomerFlow[]>([]);
  const [weeklyFlow, setWeeklyFlow] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatusType[]>([]);
  const [cameras, setCameras] = useState<CameraType[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [demographics, setDemographics] = useState<Demographics[]>([]);
  const location = useLocation();

  useEffect(() => {
    loadData();
  }, [location.pathname]); // Mỗi lần chuyển trang sẽ load lại dữ liệu

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        statsData,
        flowData,
        weeklyData,
        heatData,
        queueData,
        camerasData,
        alertsData,
        demographicsData
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getCustomerFlow(),
        api.getWeeklyFlow(),
        api.getHeatmapData(),
        api.getQueueStatus(),
        api.getCameras(),
        api.getAlerts({ limit: 10 }),
        api.getDemographics()
      ]);

      setDashboardStats(statsData);
      setCustomerFlow(flowData);
      setWeeklyFlow(weeklyData);
      setHeatmapData(heatData);
      setQueueStatus(queueData);
      setCameras(camerasData);
      setAlerts(alertsData);
      setDemographics(demographicsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAlertStatus = async (alertId: string, status: 'new' | 'viewed' | 'resolved') => {
    try {
      await api.updateAlertStatus(alertId, status);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status } : alert
      ));
    } catch (error) {
      console.error('Error updating alert status:', error);
    }
  };

  const renderLiveView = () => (
    <div className="space-y-6">
      {/* Stats Cards chuyển sang Live View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Khách hôm nay"
          value={dashboardStats?.todayVisitors || 0}
          icon={Users}
        />
        <StatsCard
          title="Đang trong cửa hàng"
          value={dashboardStats?.currentVisitors || 0}
          icon={UserCheck}
          subtitle="người"
        />
        <StatsCard
          title="Camera hoạt động"
          value={cameras.filter(c => c.status === 'online').length}
          icon={Camera}
          subtitle={`/${cameras.length} camera`}
        />
      </div>
      {/* Camera Grid giữ nguyên */}
      <CameraGrid cameras={cameras} />

    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Thời gian lưu trú TB"
          value="18.5 phút"
          icon={Clock}
        />  
        <StatsCard  
          title="Thời gian tương tác TB"  
          value="3.2 phút"  
          icon={BarChart3}
          subtitle="trên sản phẩm"
        />
      </div>

      {/* Weekly Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerFlowChart />
        <WeeklyFlowChart data={weeklyFlow} />
      </div>
     
      
      {/* Demographics Charts */}
      <DemographicsChart data={demographics} />
    </div>
  );

  const renderAlerts = () => (
    <AlertsTable alerts={alerts} onUpdateStatus={handleUpdateAlertStatus} />
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <CameraManagement cameras={cameras} />
      
      {/* Alert Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Cài đặt cảnh báo</h3>
          <p className="text-sm text-gray-500">Cấu hình ngưỡng và điều kiện cảnh báo</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cảnh báo hàng đợi (số người)
              </label>
              <input
                type="number"
                defaultValue={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cảnh báo đông người (số người/m²)
              </label>
              <input
                type="number"
                defaultValue={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian cảnh báo đồ vật bỏ quên (phút)
              </label>
              <input
                type="number"
                defaultValue={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableAlerts"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enableAlerts" className="text-sm text-gray-700">
                Bật thông báo âm thanh
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    switch (activeTab) {
      case 'dashboard':
        return renderLiveView();
      case 'analytics':
        return renderAnalytics();
      case 'alerts':
        return renderAlerts();
      case 'settings':
        return renderSettings();
      default:
        return renderLiveView();
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Routes>
        <Route path="/" element={loading ? <Loading /> : renderLiveView()} />
        <Route path="/analytics" element={loading ? <Loading /> : renderAnalytics()} />
        <Route path="/alerts" element={loading ? <Loading /> : renderAlerts()} />
        <Route path="/settings" element={loading ? <Loading /> : renderSettings()} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </main>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AppContent />
      </div>
    </Router>
  );
}

export default App;