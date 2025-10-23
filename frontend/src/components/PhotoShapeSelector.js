import React from 'react';
import { Circle, Square, Heart } from 'lucide-react';

// Custom Oval Icon Component
const OvalIcon = ({ className }) => (
  <svg 
    className={className}
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="12" rx="6" ry="9" />
  </svg>
);

const PhotoShapeSelector = ({ currentShape, photoUrl, onChange }) => {
  const shapes = [
    {
      id: 'circle',
      name: 'Circle',
      icon: Circle,
      description: 'Classic circular photo',
      className: 'rounded-full'
    },
    {
      id: 'square',
      name: 'Square',
      icon: Square,
      description: 'Sharp corners',
      className: 'rounded-none'
    },
    {
      id: 'rounded-square',
      name: 'Rounded Square',
      icon: Square,
      description: 'Soft rounded corners',
      className: 'rounded-2xl'
    },
    {
      id: 'heart',
      name: 'Heart',
      icon: Heart,
      description: 'Heart-shaped photo',
      className: 'heart-shape'
    },
    {
      id: 'oval',
      name: 'Oval',
      icon: OvalIcon,
      description: 'Vertical oval shape',
      className: 'oval-shape'
    }
  ];

  const getShapeClassName = (shapeId) => {
    const shape = shapes.find(s => s.id === shapeId);
    return shape ? shape.className : 'rounded-full';
  };

  return (
    <div className="space-y-4">
      <label className="block text-gray-700 font-semibold mb-2">
        Photo Shape
      </label>

      {/* Preview */}
      {photoUrl && (
        <div className="flex justify-center mb-6 p-6 bg-gray-50 rounded-lg">
          <div className="relative">
            {currentShape === 'oval' ? (
              <div className={`w-32 h-40 border-4 border-gray-200 shadow-lg overflow-hidden ${getShapeClassName(currentShape)}`}>
                <img
                  src={photoUrl}
                  alt="Shape preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : currentShape === 'heart' ? (
              <div className={`w-32 h-32 border-4 border-gray-200 shadow-lg overflow-hidden ${getShapeClassName(currentShape)}`}>
                <img
                  src={photoUrl}
                  alt="Shape preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <img
                src={photoUrl}
                alt="Shape preview"
                className={`w-32 h-32 object-cover border-4 border-gray-200 shadow-lg ${getShapeClassName(currentShape)}`}
              />
            )}
            <div className="text-center mt-3">
              <span className="text-sm font-medium text-gray-600">
                Current: {shapes.find(s => s.id === currentShape)?.name || 'Circle'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Shape Options */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {shapes.map((shape) => {
          const IconComponent = shape.icon;
          const isSelected = currentShape === shape.id;

          return (
            <button
              key={shape.id}
              type="button"
              onClick={() => onChange(shape.id)}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-start space-y-2 min-h-[180px] ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {/* Icon */}
              <IconComponent className="w-8 h-8 flex-shrink-0" />
              
              {/* Name */}
              <span className="text-xs font-semibold text-center">
                {shape.name}
              </span>

              {/* Preview Thumbnail */}
              {photoUrl && (
                <div className="mt-2 flex-grow flex items-center justify-center">
                  {shape.id === 'oval' ? (
                    <div className={`w-12 bg-gray-300 ${shape.className} overflow-hidden`} style={{ height: '60px' }}>
                      <div 
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${photoUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    </div>
                  ) : shape.id === 'heart' ? (
                    <div className={`w-12 h-12 bg-gray-300 ${shape.className} overflow-hidden`}>
                      <div 
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${photoUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 bg-gray-300 ${shape.className}`} 
                         style={{
                           backgroundImage: `url(${photoUrl})`,
                           backgroundSize: 'cover',
                           backgroundPosition: 'center'
                         }}
                    />
                  )}
                </div>
              )}

              {/* Selected Indicator - Always reserve space */}
              <div className="text-xs font-medium mt-auto h-5 flex items-center justify-center">
                {isSelected && (
                  <span className="text-blue-600">
                    ✓ Selected
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Shape Description */}
      {currentShape && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">
              {shapes.find(s => s.id === currentShape)?.name}:
            </span>{' '}
            {shapes.find(s => s.id === currentShape)?.description}
          </p>
        </div>
      )}

      {/* Help Text */}
      <p className="text-sm text-gray-600">
        Choose a shape for the profile photo. The shape will be displayed on the memorial page.
      </p>
    </div>
  );
};

export default PhotoShapeSelector;