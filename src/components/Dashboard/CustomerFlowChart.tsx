import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomerFlow } from '../../types';
import { api } from '../../api';

interface CustomerFlowChartProps {
  // Không cần truyền data từ ngoài nữa
}

const TIME_OPTIONS = [
  { label: 'Hôm nay', value: 'today' },
  { label: 'Hôm qua', value: 'yesterday' },
  { label: '7 ngày qua', value: '7days' },
];

const CustomerFlowChart: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<'today' | 'yesterday' | '7days'>('today');
  const [data, setData] = useState<CustomerFlow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let result: CustomerFlow[] = [];
      try {
        result = await api.getCustomerFlow(selectedTime);
      } catch (e) {
        result = [];
      }
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [selectedTime]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lưu lượng khách hàng theo giờ</h3>
          <p className="text-sm text-gray-500">Số lượng khách theo giờ trong ngày</p>
        </div>
        <div className="flex space-x-2">
          <select
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value as 'today' | 'yesterday' | '7days')}
          >
            {TIME_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="timestamp"
                stroke="#64748b"
                fontSize={12}
                tickFormatter={value => value.slice(0, 5)}
                interval={4}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip
                labelFormatter={value => `Thời gian: ${value}`}
                formatter={value => [`${value} khách`, 'Số lượng']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CustomerFlowChart;