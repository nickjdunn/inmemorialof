import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const VideoModal = ({ video, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!video) return null;

  // Build embed URL with autoplay
  const getEmbedUrl = () => {
    if (video.platform === 'youtube') {
      return `${video.url}?autoplay=1&rel=0`;
    } else if (video.platform === 'vimeo') {
      return `${video.url}?autoplay=1`;
    }
    return video.url;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
          aria-label="Close video"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Video Container */}
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={getEmbedUrl()}
            title={video.caption || 'Video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Caption */}
        {video.caption && (
          <div className="mt-4 text-center text-white">
            <p className="text-lg">{video.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoModal;