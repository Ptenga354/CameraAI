import React from 'react';
import { QueueStatus as QueueStatusType } from '../../types';
import { Clock, Users } from 'lucide-react';

interface QueueStatusProps {
  data: QueueStatusType[];
}

const QueueStatus: React.FC<QueueStatusProps> = ({ data }) => {
  const getQueueColor = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio >= 0.8) return 'text-red-600 bg-red-50';
    if (ratio >= 0.6) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tình trạng hàng đợi</h3>
          <p className="text-sm text-gray-500">Thời gian thực tại các quầy thanh toán</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((queue, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{queue.zone}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                getQueueColor(queue.currentLength, queue.maxCapacity)
              }`}>
                {queue.currentLength}/{queue.maxCapacity}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{queue.currentLength} người đang chờ</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{queue.averageWaitTime} phút</span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  queue.currentLength / queue.maxCapacity >= 0.8 ? 'bg-red-500' :
                  queue.currentLength / queue.maxCapacity >= 0.6 ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${(queue.currentLength / queue.maxCapacity) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueStatus;