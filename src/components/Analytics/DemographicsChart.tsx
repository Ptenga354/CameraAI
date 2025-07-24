import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Demographics } from '../../types';

interface DemographicsChartProps {
  data: Demographics[];
}

const DemographicsChart: React.FC<DemographicsChartProps> = ({ data }) => {
  // Prepare data for gender pie chart
  const genderData = data.reduce((acc, item) => {
    // Chuyển đổi giá trị giới tính thành chuỗi dễ hiểu
    let genderLabel = item.gender;
    if (genderLabel === 'male' ) genderLabel = 'Nam';
    else if (genderLabel === 'female') genderLabel = 'Nữ';
    else if (genderLabel === 'other') genderLabel = 'Khác';

    const existing = acc.find(a => a.gender === genderLabel);
    if (existing) {
      existing.count += item.count;
    } else {
      acc.push({ gender: genderLabel, count: item.count });
    }
    return acc;
  }, [] as { gender: string; count: number; }[]);

  // Prepare data for age group bar chart
  const ageData = data.reduce((acc, item) => {
    const existing = acc.find(a => a.age_group === item.age_group);
    if (existing) {
      existing.count += item.count;
    } else {
      acc.push({ age_group: item.age_group, count: item.count });
    }
    return acc;
  }, [] as { age_group: string; count: number; }[]);

  // Sắp xếp theo thứ tự tăng dần của age_group (giả sử age_group là số hoặc dạng "18-25", "26-35", ...)
  ageData.sort((a, b) => {
    // Nếu age_group là số
    const numA = parseInt(a.age_group);
    const numB = parseInt(b.age_group);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    // Nếu age_group là dạng "18-25", "26-35", lấy số đầu tiên
    const firstA = parseInt(a.age_group.split('-')[0]);
    const firstB = parseInt(b.age_group.split('-')[0]);
    return firstA - firstB;
  });

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Phân bố giới tính</h3>
          <p className="text-sm text-gray-500">Tỷ lệ khách hàng theo giới tính</p>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} người`, name === 'count' ? 'Số lượng' : name]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center space-x-4 mt-4">
          {genderData.map((entry, index) => (
            <div key={entry.gender} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-sm text-gray-600">{entry.gender}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Phân bố độ tuổi</h3>
          <p className="text-sm text-gray-500">Số lượng khách hàng theo nhóm tuổi</p>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="age_group" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value) => [`${value} người`, 'Số lượng']}
                labelFormatter={(value) => `Nhóm tuổi: ${value}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DemographicsChart;