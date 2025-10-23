import React, { useState } from 'react';
import { Upload, ImageIcon, Trash2, Eye, EyeOff } from 'lucide-react';

const CoverPhotoManager = ({ coverPhoto, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState(coverPhoto?.url || null);

  const sizeOptions = [
    { id: 'tall', name: 'Tall', height: '400px', description: 'Full height banner' },
    { id: 'medium', name: 'Medium', height: '300px', description: 'Balanced height' },
    { id: 'short', name: 'Short', height: '200px', description: 'Compact header' }
  ];

  const positionOptions = [
    { id: 'top', name: 'Top', description: 'Focus on top of image' },
    { id: 'center', name: 'Center', description: 'Center the image' },
    { id: 'bottom', name: 'Bottom', description: 'Focus on bottom of image' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onChange({
          url: reader.result,
          size: coverPhoto?.size || 'medium',
          position: coverPhoto?.position || 'center',
          showGradient: coverPhoto?.showGradient !== false
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCover = () => {
    setPreviewUrl(null);
    onChange(null);
  };

  const handleSizeChange = (sizeId) => {
    onChange({
      ...coverPhoto,
      url: previewUrl,
      size: sizeId
    });
  };

  const handlePositionChange = (positionId) => {
    onChange({
      ...coverPhoto,
      url: previewUrl,
      position: positionId
    });
  };

  const handleGradientToggle = () => {
    onChange({
      ...coverPhoto,
      url: previewUrl,
      showGradient: !coverPhoto?.showGradient
    });
  };

  const getPositionClass = (position) => {
    const map = {
      'top': 'object-top',
      'center': 'object-center',
      'bottom': 'object-bottom'
    };
    return map[position] || 'object-center';
  };

  const currentSize = coverPhoto?.size || 'medium';
  const currentPosition = coverPhoto?.position || 'center';
  const showGradient = coverPhoto?.showGradient !== false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-gray-700 font-semibold">
          Cover Photo / Banner
        </label>
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemoveCover}
            className="text-red-600 hover:text-red-700 text-sm flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove Cover
          </button>
        )}
      </div>

      {/* Upload/Preview Section */}
      {!previewUrl ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
          <label className="cursor-pointer">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Upload a cover photo</p>
            <p className="text-sm text-gray-500 mb-4">
              Recommended: 1920×400px or larger
            </p>
            <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </span>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative rounded-lg overflow-hidden border-4 border-gray-200 shadow-lg">
            <div 
              className="relative w-full"
              style={{ 
                height: sizeOptions.find(s => s.id === currentSize)?.height || '300px' 
              }}
            >
              <img
                src={previewUrl}
                alt="Cover preview"
                className={`w-full h-full object-cover ${getPositionClass(currentPosition)}`}
              />
              {showGradient && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-60"></div>
              )}
              <div className="absolute bottom-4 left-4 text-white z-10">
                <h3 className="text-2xl font-bold drop-shadow-lg">Sample Name</h3>
                <p className="text-sm drop-shadow-lg">Preview of cover photo</p>
              </div>
            </div>
          </div>

          {/* Change Photo Button */}
          <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Upload className="w-4 h-4 mr-2" />
            Change Cover Photo
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </label>

          {/* Size Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {sizeOptions.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => handleSizeChange(size.id)}
                  className={`p-3 rounded-lg border-2 text-center transition ${
                    currentSize === size.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-400 text-gray-700'
                  }`}
                >
                  <div className="font-semibold text-sm">{size.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{size.height}</div>
                  <div className="text-xs text-gray-500 mt-1">{size.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Position Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Position
            </label>
            <div className="grid grid-cols-3 gap-3">
              {positionOptions.map((position) => (
                <button
                  key={position.id}
                  type="button"
                  onClick={() => handlePositionChange(position.id)}
                  className={`p-3 rounded-lg border-2 text-center transition ${
                    currentPosition === position.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-400 text-gray-700'
                  }`}
                >
                  <div className="font-semibold text-sm">{position.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{position.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Overlay Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {showGradient ? (
                <Eye className="w-5 h-5 text-gray-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dark Gradient Overlay
                </label>
                <p className="text-xs text-gray-500">
                  Improves text readability on the cover photo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGradientToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                showGradient ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  showGradient ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Tip:</span> Use a high-quality landscape image 
              that represents the person's life, hobbies, or favorite places.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverPhotoManager;