import React, { useState } from 'react';
import { Camera } from '../../types';
import { Plus, Edit, Trash2, Wifi, WifiOff, Settings } from 'lucide-react';
import { supabaseApi } from '../../api/supabaseApi';

interface CameraManagementProps {
  cameras: Camera[];
}

const CameraManagement: React.FC<CameraManagementProps> = ({ cameras }) => {
  const [editingCamera, setEditingCamera] = useState<string | null>(null);
  const [newCamera, setNewCamera] = useState<{ name: string; location: string; status: 'online' | 'offline' | 'maintenance' }>({ name: '', location: '', status: 'online' });
  const [showAdd, setShowAdd] = useState(false);
  const [cameraList, setCameraList] = useState<Camera[]>(cameras);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'maintenance':
        return <Settings className="w-4 h-4 text-yellow-600" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Trực tuyến';
      case 'offline':
        return 'Ngoại tuyến';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return 'Không xác định';
    }
  };

  const handleAddCamera = async () => {
    const added = await supabaseApi.addCamera(newCamera);
    if (added) {
      setCameraList([...cameraList, added]);
      setShowAdd(false);
      setNewCamera({ name: '', location: '', status: 'online' });
    }
  };

  const handleUpdateCamera = async (id: string, updated: Partial<Camera>) => {
    const result = await supabaseApi.updateCamera(id, updated);
    if (result) {
      setCameraList(cameraList.map(cam => cam.id === id ? result : cam));
      setEditingCamera(null);
    }
  };

  const handleDeleteCamera = async (id: string) => {
    const ok = await supabaseApi.deleteCamera(id);
    if (ok) setCameraList(cameraList.filter(cam => cam.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quản lý Camera</h3>
            <p className="text-sm text-gray-500">Cấu hình và giám sát các camera trong hệ thống</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Thêm camera</span>
          </button>
        </div>

        {showAdd && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
            <input
              type="text"
              value={newCamera.name}
              onChange={e => setNewCamera({ ...newCamera, name: e.target.value })}
              placeholder="Tên camera"
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={newCamera.location}
              onChange={e => setNewCamera({ ...newCamera, location: e.target.value })}
              placeholder="Vị trí"
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <select
              value={newCamera.status}
              onChange={e => setNewCamera({ ...newCamera, status: e.target.value as 'online' | 'offline' | 'maintenance' })}
              className="mb-2 w-full px-3 py-2 border rounded"
            >
              <option value="online">Trực tuyến</option>
              <option value="offline">Ngoại tuyến</option>
              <option value="maintenance">Bảo trì</option>
            </select>
            <button onClick={handleAddCamera} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Lưu</button>
            <button onClick={() => setShowAdd(false)} className="bg-gray-200 px-4 py-2 rounded">Hủy</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameraList.map((camera) => (
            <div key={camera.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(camera.status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(camera.status)}`}>
                    {getStatusText(camera.status)}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setEditingCamera(camera.id)}
                    className="p-1 text-gray-600 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-600 hover:text-red-600" onClick={() => handleDeleteCamera(camera.id)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">{camera.name}</h4>
                <p className="text-sm text-gray-600">{camera.location}</p>
                <p className="text-xs text-gray-500">ID: {camera.id}</p>
                <p className="text-xs text-gray-500">Khu vực: {camera.zone}</p>
              </div>

              {editingCamera === camera.id && (
                <CameraEditForm
                  camera={camera}
                  onSave={async (updated) => {
                    await handleUpdateCamera(camera.id, updated);
                  }}
                  onCancel={() => setEditingCamera(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function CameraEditForm({ camera, onSave, onCancel }: {
  camera: Camera;
  onSave: (updated: Partial<Camera>) => void;
  onCancel: () => void;
}) {
  const [editName, setEditName] = useState(camera.name);
  const [editLocation, setEditLocation] = useState(camera.location);
  const [editStatus, setEditStatus] = useState(camera.status);

  return (
    <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
      <input
        type="text"
        value={editName}
        onChange={e => setEditName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tên camera"
      />
      <input
        type="text"
        value={editLocation}
        onChange={e => setEditLocation(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Vị trí"
      />
      <select
        value={editStatus}
        onChange={e => setEditStatus(e.target.value as 'online' | 'offline' | 'maintenance')}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="online">Trực tuyến</option>
        <option value="offline">Ngoại tuyến</option>
        <option value="maintenance">Bảo trì</option>
      </select>
      <div className="flex space-x-2">
        <button
          onClick={() => onSave({
            name: editName,
            location: editLocation,
            status: editStatus
          })}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Lưu
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}

export default CameraManagement;