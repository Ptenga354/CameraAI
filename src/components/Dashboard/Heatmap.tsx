import React from 'react';
import { HeatmapData } from '../../types';

interface HeatmapProps {
  data: HeatmapData[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const getIntensityColor = (intensity: number) => {
    if (intensity >= 0.8) return 'rgba(239, 68, 68, 0.8)'; // Red
    if (intensity >= 0.6) return 'rgba(251, 146, 60, 0.8)'; // Orange
    if (intensity >= 0.4) return 'rgba(250, 204, 21, 0.8)'; // Yellow
    if (intensity >= 0.2) return 'rgba(34, 197, 94, 0.8)'; // Green
    return 'rgba(59, 130, 246, 0.8)'; // Blue
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bản đồ nhiệt cửa hàng</h3>
          <p className="text-sm text-gray-500">Phân bố hoạt động khách hàng trong cửa hàng</p>
        </div>
      </div>

      <div className="relative">
        {/* Store Layout Background */}
        <div className="w-full h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden">
          {/* Store sections */}
          <div className="absolute top-4 left-4 w-20 h-12 bg-blue-100 rounded flex items-center justify-center text-xs font-medium text-blue-800">
            Lối vào
          </div>
          <div className="absolute top-20 left-8 w-24 h-16 bg-purple-100 rounded flex items-center justify-center text-xs font-medium text-purple-800">
            Thời trang
          </div>
          <div className="absolute top-12 right-8 w-24 h-16 bg-green-100 rounded flex items-center justify-center text-xs font-medium text-green-800">
            Điện tử
          </div>
          <div className="absolute bottom-4 right-8 w-20 h-12 bg-orange-100 rounded flex items-center justify-center text-xs font-medium text-orange-800">
            Thanh toán
          </div>
          <div className="absolute bottom-20 left-8 w-20 h-12 bg-yellow-100 rounded flex items-center justify-center text-xs font-medium text-yellow-800">
            Thực phẩm
          </div>

          {/* Heatmap Points */}
          {data.map((point, index) => (
            <div
              key={index}
              className="absolute rounded-full blur-sm"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${10 + point.intensity * 20}px`,
                height: `${10 + point.intensity * 20}px`,
                backgroundColor: getIntensityColor(point.intensity),
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Cường độ:</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Thấp</span>
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.8)' }}></div>
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}></div>
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(250, 204, 21, 0.8)' }}></div>
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(251, 146, 60, 0.8)' }}></div>
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}></div>
            <span className="text-xs text-gray-500">Cao</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;