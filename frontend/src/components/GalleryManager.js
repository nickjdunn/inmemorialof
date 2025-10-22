import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const GalleryManager = ({ gallery, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    setUploading(true);

    const newPhotos = [];
    let processed = 0;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create an image to compress
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try WebP first, fallback to JPEG if not supported
          let compressedDataUrl;
          try {
            compressedDataUrl = canvas.toDataURL('image/webp', 0.8);
            // Check if WebP is actually supported (some browsers return PNG if not supported)
            if (!compressedDataUrl.startsWith('data:image/webp')) {
              compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            }
          } catch (e) {
            // Fallback to JPEG
            compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          }
          
          newPhotos.push({
            url: compressedDataUrl,
            thumbnail: compressedDataUrl,
            caption: '',
            order: (gallery.photos?.length || 0) + index,
            uploadedAt: new Date().toISOString()
          });

          processed++;
          
          if (processed === files.length) {
            onChange({
              ...gallery,
              photos: [...(gallery.photos || []), ...newPhotos]
            });
            setUploading(false);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = (gallery.photos || []).filter((_, i) => i !== index);
    onChange({
      ...gallery,
      photos: updatedPhotos
    });
  };

  const handleCaptionChange = (index, caption) => {
    const updatedPhotos = (gallery.photos || []).map((photo, i) => 
      i === index ? { ...photo, caption } : photo
    );
    onChange({
      ...gallery,
      photos: updatedPhotos
    });
  };

  const handleDisplayStyleChange = (style) => {
    onChange({
      ...gallery,
      displayStyle: style
    });
  };

  const photos = gallery.photos || [];
  const displayStyle = gallery.displayStyle || 'grid';

  return (
    <div className="space-y-6">
      {/* Display Style Toggle */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Gallery Display Style
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleDisplayStyleChange('grid')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${
              displayStyle === 'grid'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            Grid Layout
          </button>
          <button
            type="button"
            onClick={() => handleDisplayStyleChange('carousel')}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${
              displayStyle === 'carousel'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            Carousel
          </button>
        </div>
      </div>

      {/* Upload Button */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Gallery Photos ({photos.length} photos)
        </label>
        <input
          type="file"
          id="galleryUpload"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="hidden"
          disabled={uploading}
        />
        <label
          htmlFor="galleryUpload"
          className={`flex items-center justify-center w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload className="w-5 h-5 mr-2 text-gray-600" />
          <span className="text-gray-600">
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </span>
        </label>
        <p className="text-sm text-gray-500 mt-2">
          You can upload multiple photos at once. Images will be compressed to WebP format.
        </p>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo.url}
                alt={photo.caption || `Gallery photo ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Caption Input */}
              <input
                type="text"
                value={photo.caption || ''}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                placeholder="Add caption..."
                className="w-full mt-2 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No photos yet</p>
          <p className="text-sm text-gray-500">Upload photos to start building your gallery</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;