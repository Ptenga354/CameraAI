import React, { useState } from 'react';
import { Camera } from '../../types';
import { Play, Pause, Maximize2, RotateCcw, Settings } from 'lucide-react';

interface CameraGridProps {
  cameras: Camera[];
}

const CameraGrid: React.FC<CameraGridProps> = ({ cameras }) => {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [playingCameras, setPlayingCameras] = useState<Set<string>>(new Set());

  const togglePlayback = (cameraId: string) => {
    const newPlayingCameras = new Set(playingCameras);
    if (newPlayingCameras.has(cameraId)) {
      newPlayingCameras.delete(cameraId);
    } else {
      newPlayingCameras.add(cameraId);
    }
    setPlayingCameras(newPlayingCameras);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
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

  // Tìm camera đang được phóng to
  const fullscreenCamera = cameras.find(c => c.id === selectedCamera);

  const onlineCameras = cameras.filter(c => c.status === 'online');
  const otherCameras = cameras.filter(c => c.status !== 'online');

  return (
    <div className="space-y-10">
      {/* Cameras đang hoạt động */}
      <div>
        <h2 className="text-lg font-semibold text-blue-700 mb-4">Camera đang hoạt động</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onlineCameras.map((camera) => (
            <div
              key={camera.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${
                selectedCamera === camera.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Camera Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{camera.name}</h3>
                    <p className="text-sm text-gray-500">{camera.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${getStatusColor(camera.status)} rounded-full`}></div>
                    <span className="text-xs text-gray-500">{getStatusText(camera.status)}</span>
                  </div>
                </div>
              </div>

              {/* Video Feed */}
              <div className="relative aspect-video bg-gray-900">
                {camera.streamUrl ? (
                  <img
                    src={camera.streamUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white text-sm">Không có luồng video</p>
                      <p className="text-gray-300 text-xs">1920x1080 • 30fps</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePlayback(camera.id)}
                      disabled={camera.status !== 'online'}
                      className={`p-2 rounded-lg ${
                        camera.status === 'online'
                          ? 'text-blue-600 hover:bg-blue-50'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {playingCameras.has(camera.id) ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      disabled={camera.status !== 'online'}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedCamera(camera.id)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    disabled={camera.status !== 'online'}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cameras loại khác */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Camera không hoạt động/Bảo trì</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherCameras.map((camera) => (
            <div
              key={camera.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden opacity-70"
            >
              {/* Camera Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{camera.name}</h3>
                    <p className="text-sm text-gray-500">{camera.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${getStatusColor(camera.status)} rounded-full`}></div>
                    <span className="text-xs text-gray-500">{getStatusText(camera.status)}</span>
                  </div>
                </div>
              </div>
              {/* Video Feed */}
              <div className="relative aspect-video bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <Pause className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-300 text-sm">Camera không khả dụng</p>
                  <p className="text-gray-400 text-xs">{getStatusText(camera.status)}</p>
                </div>
              </div>
              {/* Không có controls cho camera không online */}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal giữ nguyên */}
      {fullscreenCamera && fullscreenCamera.status === 'online' && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative bg-black rounded-lg shadow-lg">
            <button
              onClick={() => setSelectedCamera(null)}
              className="absolute top-4 right-4 bg-white text-black rounded-full p-2 shadow hover:bg-gray-200 z-10"
              aria-label="Đóng"
            >
              Đóng
            </button>
            {fullscreenCamera.streamUrl ? (
              <img
                src={fullscreenCamera.streamUrl}
                className="block"
                style={{ maxWidth: '100vw', maxHeight: '100vh' }}
                alt={fullscreenCamera.name}
              />
            ) : (
              <div className="w-[1280px] h-[720px] flex items-center justify-center text-white">
                Không có luồng video
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
              {fullscreenCamera.name} - {fullscreenCamera.location}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraGrid;