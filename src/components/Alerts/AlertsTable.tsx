import React, { useState } from 'react';
import { Alert } from '../../types';
import { AlertTriangle, Users, ShoppingBag, MapPin, Shield, Filter, Search } from 'lucide-react';

interface AlertsTableProps {
  alerts: Alert[];
  onUpdateStatus: (alertId: string, status: 'new' | 'viewed' | 'resolved') => void;
}

const AlertsTable: React.FC<AlertsTableProps> = ({ alerts, onUpdateStatus }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'suspicious_behavior':
        return 'Hành vi đáng ngờ';
      case 'crowding':
        return 'Đông người';
      case 'queue_length':
        return 'Hàng đợi dài';
      case 'abandoned_item':
        return 'Đồ vật bỏ quên';
      case 'unauthorized_area':
        return 'Vào vùng cấm';
      default:
        return 'Khác';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Mới';
      case 'viewed':
        return 'Đã xem';
      case 'resolved':
        return 'Đã xử lý';
      default:
        return 'Không xác định';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesSearch = searchTerm === '' || 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.zone.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Danh sách cảnh báo</h2>
            <p className="text-sm text-gray-500">{filteredAlerts.length} cảnh báo</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm cảnh báo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Mới</option>
              <option value="viewed">Đã xem</option>
              <option value="resolved">Đã xử lý</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả loại</option>
              <option value="suspicious_behavior">Hành vi đáng ngờ</option>
              <option value="crowding">Đông người</option>
              <option value="queue_length">Hàng đợi dài</option>
              <option value="abandoned_item">Đồ vật bỏ quên</option>
              <option value="unauthorized_area">Vào vùng cấm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại & Thông tin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khu vực
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mức độ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getAlertTypeText(alert.type)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {alert.message}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{alert.zone}</div>
                  <div className="text-sm text-gray-500">{alert.camera}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {alert.timestamp.toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {alert.timestamp.toLocaleTimeString('vi-VN')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                    {alert.severity === 'high' ? 'Cao' : 
                     alert.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                    {getStatusText(alert.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-1">
                    {alert.status === 'new' && (
                      <button
                        onClick={() => onUpdateStatus(alert.id, 'viewed')}
                        className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                      >
                        Đánh dấu đã xem
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => onUpdateStatus(alert.id, 'resolved')}
                        className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                      >
                        Xử lý xong
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có cảnh báo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Không tìm thấy cảnh báo nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsTable;