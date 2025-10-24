import React, { useState } from 'react';
import { Plus, X, Video } from 'lucide-react';

const VideoEmbedManager = ({ videos, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [autoplay, setAutoplay] = useState(false);
  const [error, setError] = useState('');

  // Extract video ID and platform from URL
  const parseVideoUrl = (url) => {
    setError('');
    
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
      /youtube\.com\/watch\?.*v=([^&]+)/
    ];
    
    // Vimeo pattern
    const vimeoPattern = /vimeo\.com\/(\d+)/;
    
    // Check YouTube
    for (let pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return {
          platform: 'youtube',
          videoId: match[1],
          embedUrl: `https://www.youtube.com/embed/${match[1]}`,
          thumbnail: `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
        };
      }
    }
    
    // Check Vimeo
    const vimeoMatch = url.match(vimeoPattern);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        platform: 'vimeo',
        videoId: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
        thumbnail: `https://vumbnail.com/${vimeoMatch[1]}.jpg`
      };
    }
    
    return null;
  };

  const handleAddVideo = () => {
    if (!videoUrl.trim()) {
      setError('Please enter a video URL');
      return;
    }

    const videoData = parseVideoUrl(videoUrl);
    
    if (!videoData) {
      setError('Invalid video URL. Please use YouTube or Vimeo links.');
      return;
    }

    const newVideo = {
      url: videoData.embedUrl,
      platform: videoData.platform,
      thumbnail: videoData.thumbnail,
      caption: caption.trim(),
      autoplay: autoplay,
      order: videos.length,
      addedAt: new Date().toISOString()
    };

    onChange([...videos, newVideo]);
    
    // Reset form
    setVideoUrl('');
    setCaption('');
    setAutoplay(false);
    setShowAddForm(false);
    setError('');
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    onChange(updatedVideos);
  };

  const handleCaptionChange = (index, newCaption) => {
    const updatedVideos = videos.map((video, i) => 
      i === index ? { ...video, caption: newCaption } : video
    );
    onChange(updatedVideos);
  };

  const handleAutoplayChange = (index, value) => {
    const updatedVideos = videos.map((video, i) => 
      i === index ? { ...video, autoplay: value } : video
    );
    onChange(updatedVideos);
  };

  return (
    <div className="space-y-4">
      {/* Add Video Button */}
      {!showAddForm && (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Video
        </button>
      )}

      {/* Add Video Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Add Video from YouTube or Vimeo</h4>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setVideoUrl('');
                setCaption('');
                setAutoplay(false);
                setError('');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL *
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste a YouTube or Vimeo video URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption (optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption for this video..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Autoplay in carousel mode
                </span>
              </label>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleAddVideo}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Video
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setVideoUrl('');
                  setCaption('');
                  setAutoplay(false);
                  setError('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video List */}
      {videos.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Added Videos ({videos.length})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="relative group bg-white border rounded-lg overflow-hidden">
                {/* Video Thumbnail */}
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.caption || 'Video thumbnail'}
                    className="w-full h-32 object-cover"
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  {/* Platform Badge */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.platform === 'youtube' ? 'YouTube' : 'Vimeo'}
                  </div>
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Video Info */}
                <div className="p-3 space-y-2">
                  <input
                    type="text"
                    value={video.caption || ''}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    placeholder="Add caption..."
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={video.autoplay || false}
                      onChange={(e) => handleAutoplayChange(index, e.target.checked)}
                      className="w-3 h-3 text-blue-600 rounded focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="ml-1.5 text-gray-600">Autoplay</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showAddForm && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">No videos yet</p>
            <p className="text-sm text-gray-500">Add YouTube or Vimeo videos to your gallery</p>
          </div>
        )
      )}
    </div>
  );
};

export default VideoEmbedManager;