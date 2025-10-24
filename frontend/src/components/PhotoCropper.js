import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, RotateCw, ZoomIn, ZoomOut, Check } from 'lucide-react';

const PhotoCropper = ({ imageUrl, onSave, onCancel, shape = 'circle' }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Get crop shape based on photo shape
  const getCropShape = () => {
    if (shape === 'circle' || shape === 'oval') return 'round';
    return 'rect';
  };

  // Get aspect ratio based on shape
  const getAspectRatio = () => {
    if (shape === 'oval') return 4 / 5; // Width / Height for oval
    if (shape === 'square' || shape === 'rounded-square' || shape === 'circle') return 1;
    if (shape === 'heart') return 1; // Hearts are square-ish
    return 1; // Default to square
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = () => {
    onSave({
      crop,
      zoom,
      rotation,
      croppedAreaPixels,
      shape
    });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">Crop & Adjust Photo</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative h-96 bg-gray-900 flex-shrink-0">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={getAspectRatio()}
            cropShape={getCropShape()}
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          {/* Shape Preview */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Preview as {shape}</p>
            <div className="flex justify-center">
              <div className={`w-32 h-32 bg-gray-200 ${
                shape === 'circle' ? 'rounded-full' :
                shape === 'square' ? 'rounded-none' :
                shape === 'rounded-square' ? 'rounded-lg' :
                shape === 'heart' ? 'heart-shape' :
                shape === 'oval' ? 'oval-shape' : 'rounded-full'
              }`}>
                {/* Preview placeholder */}
              </div>
            </div>
          </div>

          {/* Zoom Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <ZoomIn className="w-4 h-4 mr-2" />
                Zoom
              </label>
              <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Rotation Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <RotateCw className="w-4 h-4 mr-2" />
                Rotation
              </label>
              <button
                onClick={handleRotate}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Rotate 90°
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCropper;