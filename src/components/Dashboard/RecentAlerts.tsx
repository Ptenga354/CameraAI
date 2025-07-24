import React from 'react';
import { Alert } from '../../types';
import { AlertTriangle, Users, ShoppingBag, MapPin, Shield } from 'lucide-react';

interface RecentAlertsProps {
  alerts: Alert[];
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'suspicious_behavior':
        return <Shield className="w-4 h-4" />;
      case 'crowding':
        return <Users className="w-4 h-4" />;
      case 'queue_length':
        return <Users className="w-4 h-4" />;
      case 'abandoned_item':
        return <ShoppingBag className="w-4 h-4" />;
      case 'unauthorized_area':
        return <MapPin className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'viewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.RelativeTimeFormat('vi', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cảnh báo gần đây</h3>
          <p className="text-sm text-gray-500">Các sự kiện AI phát hiện</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Xem tất cả
        </button>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 5).map((alert) => (
          <div 
            key={alert.id} 
            className={`border rounded-lg p-4 ${getAlertColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getAlertColor(alert.severity)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{alert.camera}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                {alert.status === 'new' ? 'Mới' : 
                 alert.status === 'viewed' ? 'Đã xem' : 'Đã xử lý'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlerts;