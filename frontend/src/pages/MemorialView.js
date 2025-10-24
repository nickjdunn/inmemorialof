import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Calendar, Heart, Share2, MapPin, Users, Image as ImageIcon, Clock, Star, Youtube, Play } from 'lucide-react';
import VideoModal from '../components/VideoModal';
import { getCategoryIcon } from '../utils/IconMapper';

const MemorialView = () => {
  const { url } = useParams();
  const [memorial, setMemorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchMemorial();
  }, [url]);

  const fetchMemorial = async () => {
    try {
      const response = await api.get(`/memorials/${url}`);
      setMemorial(response.data.memorial);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Memorial not found');
      setLoading(false);
    }
  };

  // Get photo shape class
  const getPhotoShapeClass = (shape) => {
    const shapes = {
      'circle': 'rounded-full',
      'square': 'rounded-none',
      'rounded-square': 'rounded-lg',
      'heart': 'heart-shape',
      'oval': 'oval-shape'
    };
    return shapes[shape] || 'rounded-full';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Memorial Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Extract theme data
  const theme = memorial.theme || {};
  const accentColor = theme.accentColor || '#2563EB';
  const headingFont = theme.headingFont || 'Inter';
  const bodyFont = theme.bodyFont || 'Inter';
  const backgroundStyle = theme.backgroundStyle || 'gradient';

  // Get background class based on style
  const getBackgroundClass = () => {
    const styles = {
      'gradient': 'bg-gradient-to-b from-blue-50 to-white',
      'white': 'bg-white',
      'gray': 'bg-gray-50',
      'warm': 'bg-gradient-to-b from-orange-50 to-white',
      'cool': 'bg-gradient-to-b from-slate-50 to-white'
    };
    return styles[backgroundStyle] || 'bg-gradient-to-b from-blue-50 to-white';
  };

  const birthYear = memorial.birthDate ? new Date(memorial.birthDate).getFullYear() : null;
  const deathYear = memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : null;
  const photoShape = memorial.profilePhoto?.shape || 'circle';
  const coverPhoto = memorial.coverPhoto;

  // Helper functions for cover photo
  const getCoverHeight = () => {
    const heights = {
      'tall': 'h-[400px]',
      'medium': 'h-[300px]',
      'short': 'h-[200px]'
    };
    return heights[coverPhoto?.size] || 'h-48';
  };

  const getCoverPosition = () => {
    const positions = {
      'top': 'object-top',
      'center': 'object-center',
      'bottom': 'object-bottom'
    };
    return positions[coverPhoto?.position] || 'object-center';
  };

  // Dynamic styles
  const headingStyle = { fontFamily: headingFont };
  const bodyStyle = { fontFamily: bodyFont };
  const accentStyle = { color: accentColor };
  const accentBgStyle = { backgroundColor: accentColor };

  return (
    <div className={`min-h-screen ${getBackgroundClass()}`}>
      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center hover:opacity-80" style={accentStyle}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Memorial Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Cover Photo or Default Gradient */}
          {coverPhoto?.url ? (
            <div className={`relative ${getCoverHeight()}`}>
              <img
                src={coverPhoto.url}
                alt="Cover"
                className={`w-full h-full object-cover ${getCoverPosition()}`}
              />
              {coverPhoto.showGradient !== false && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-60"></div>
              )}
            </div>
          ) : (
            <div className="h-48" style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)` }}></div>
          )}
          
          <div className="relative px-8 pb-8">
            {/* Profile Photo with Selected Shape */}
            {memorial.profilePhoto?.url && (
              <div className="relative -mt-20 mb-6 flex justify-center">
                {photoShape === 'oval' ? (
                  <div className={`w-40 border-4 border-white shadow-lg overflow-hidden ${getPhotoShapeClass(photoShape)}`} style={{ height: '200px' }}>
                    <img
                      src={memorial.profilePhoto.url}
                      alt={memorial.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : photoShape === 'heart' ? (
                  <div className={`w-40 h-40 border-4 border-white shadow-lg overflow-hidden ${getPhotoShapeClass(photoShape)}`}>
                    <img
                      src={memorial.profilePhoto.url}
                      alt={memorial.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <img
                    src={memorial.profilePhoto.url}
                    alt={memorial.fullName}
                    className={`w-40 h-40 border-4 border-white shadow-lg object-cover memorial-profile-photo ${getPhotoShapeClass(photoShape)}`}
                  />
                )}
              </div>
            )}

            {/* Name and Dates */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2" style={headingStyle}>
                {memorial.fullName}
              </h1>
              {memorial.showDates && (birthYear || deathYear) && (
                <div className="flex items-center justify-center text-gray-600 text-lg" style={bodyStyle}>
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    {birthYear && deathYear ? `${birthYear} - ${deathYear}` : 
                     birthYear ? `Born ${birthYear}` : 
                     deathYear ? `Passed ${deathYear}` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Share Button */}
            <div className="flex justify-center mb-8">
              <button className="flex items-center px-6 py-2 text-white rounded-lg hover:opacity-90" style={accentBgStyle}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Memorial
              </button>
            </div>

            {/* Biography */}
            {memorial.biography?.showBiography && memorial.biography?.content && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center" style={headingStyle}>
                  <Heart className="w-6 h-6 mr-2" style={accentStyle} />
                  Life Story
                </h2>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed" style={bodyStyle}>
                  {memorial.biography.content}
                </div>
              </div>
            )}

            {/* View Count */}
            <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm" style={bodyStyle}>
              This memorial has been viewed {memorial.viewCount} {memorial.viewCount === 1 ? 'time' : 'times'}
            </div>
          </div>
        </div>

        {/* Photo & Video Gallery */}
        {memorial.gallery?.showGallery && (memorial.gallery?.photos?.length > 0 || memorial.gallery?.videos?.length > 0) && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center" style={headingStyle}>
              <ImageIcon className="w-6 h-6 mr-2" style={accentStyle} />
              Photos & Videos
            </h2>

            {/* Photos */}
            {memorial.gallery.photos?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4" style={headingStyle}>Photos</h3>
                <div className={memorial.gallery.displayStyle === 'carousel' ? 
                  "flex overflow-x-auto space-x-4 pb-4" : 
                  "grid grid-cols-2 md:grid-cols-3 gap-4"
                }>
                  {memorial.gallery.photos.map((photo, index) => (
                    <div key={index} className="flex-shrink-0">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Gallery photo ${index + 1}`}
                        className={memorial.gallery.displayStyle === 'carousel' ? 
                          "w-64 h-64 object-cover rounded-lg" : 
                          "w-full h-48 object-cover rounded-lg"
                        }
                      />
                      {photo.caption && (
                        <p className="text-sm text-gray-600 mt-2" style={bodyStyle}>{photo.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {memorial.gallery.videos?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4" style={headingStyle}>Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {memorial.gallery.videos.map((video, index) => (
                    <div key={index} className="relative group cursor-pointer" onClick={() => setSelectedVideo(video)}>
                      <img
                        src={video.thumbnail || `https://img.youtube.com/vi/${video.url.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`}
                        alt={video.caption || `Video ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center group-hover:bg-opacity-50 transition">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                      {video.caption && (
                        <p className="text-sm text-gray-600 mt-2" style={bodyStyle}>{video.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {memorial.timeline?.showTimeline && memorial.timeline?.events?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center" style={headingStyle}>
              <Clock className="w-6 h-6 mr-2" style={accentStyle} />
              Life Timeline
            </h2>

            {memorial.timeline.orientation === 'horizontal' ? (
              // Horizontal Timeline
              <div className="relative">
                <div className="absolute top-8 left-0 right-0 h-1" style={accentBgStyle}></div>
                <div className="flex overflow-x-auto pb-4 space-x-8">
                  {memorial.timeline.events
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((event, index) => (
                      <div key={index} className="flex-shrink-0 w-64">
                        <div className="relative pt-12">
                          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white" style={accentBgStyle}></div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="font-semibold mb-1" style={{ ...accentStyle, ...headingStyle }}>
                              {event.yearOnly ? 
                                new Date(event.date).getFullYear() : 
                                new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              }
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2" style={headingStyle}>{event.title}</h4>
                            <p className="text-sm text-gray-600" style={bodyStyle}>{event.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              // Vertical Timeline
              <div className="space-y-6">
                {memorial.timeline.events
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((event, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-4 h-4 rounded-full border-4 border-white" style={accentBgStyle}></div>
                        {index < memorial.timeline.events.length - 1 && (
                          <div className="w-1 h-full min-h-[60px]" style={accentBgStyle}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="font-semibold mb-1" style={{ ...accentStyle, ...headingStyle }}>
                          {event.yearOnly ? 
                            new Date(event.date).getFullYear() : 
                            new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          }
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2" style={headingStyle}>{event.title}</h4>
                        <p className="text-gray-700" style={bodyStyle}>{event.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Family Members */}
        {memorial.showFamily && memorial.familyMembers?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center" style={headingStyle}>
              <Users className="w-6 h-6 mr-2" style={accentStyle} />
              Family
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {memorial.familyMembers.map((member, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                  <h4 className="font-bold text-gray-900" style={headingStyle}>{member.name}</h4>
                  <p className="text-sm mb-2" style={{ ...accentStyle, ...bodyStyle }}>{member.relationship}</p>
                  <p className="text-gray-700" style={bodyStyle}>{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites & Interests */}
        {memorial.showFavorites && memorial.favorites?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center" style={headingStyle}>
              <Star className="w-6 h-6 mr-2" style={accentStyle} />
              Favorites & Interests
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {memorial.favorites.map((favorite, index) => {
                const IconComponent = getCategoryIcon(favorite.category);
                return (
                  <div key={index} className="flex items-start">
                    <div className="rounded-full p-3 mr-4 flex-shrink-0" style={{ backgroundColor: `${accentColor}20` }}>
                      <IconComponent className="w-5 h-5" style={accentStyle} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1" style={headingStyle}>{favorite.category}</h4>
                      <p className="text-gray-700" style={bodyStyle}>{favorite.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MemorialView;