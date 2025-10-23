import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, Heart, Share2, ArrowLeft } from 'lucide-react';

const MemorialView = () => {
  const { url } = useParams();
  const [memorial, setMemorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMemorial();
  }, [url]);

  const fetchMemorial = async () => {
    try {
      const response = await api.get(`/memorials/${url}`);
      setMemorial(response.data.memorial);
    } catch (err) {
      setError(err.response?.data?.error || 'Memorial not found');
    } finally {
      setLoading(false);
    }
  };

  const getPhotoShapeClass = (shape) => {
    const shapeMap = {
      'circle': 'rounded-full',
      'square': 'rounded-none',
      'rounded-square': 'rounded-2xl',
      'heart': 'heart-shape',
      'oval': 'oval-shape'
    };
    return shapeMap[shape] || 'rounded-full';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center">
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-48"></div>
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {memorial.fullName}
              </h1>
              {memorial.showDates && (birthYear || deathYear) && (
                <div className="flex items-center justify-center text-gray-600 text-lg">
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
              <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share Memorial
              </button>
            </div>

            {/* Biography */}
            {memorial.biography?.content && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-red-500" />
                  Life Story
                </h2>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {memorial.biography.content}
                </div>
              </div>
            )}

            {/* View Count */}
            <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
              This memorial has been viewed {memorial.viewCount} {memorial.viewCount === 1 ? 'time' : 'times'}
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        {memorial.favorites?.length > 0 && memorial.showFavorites && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorites & Interests</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {memorial.favorites.map((favorite, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{favorite.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{favorite.category}</h3>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">{favorite.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {memorial.gallery?.photos?.length > 0 && memorial.gallery.showGallery && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
            
            {memorial.gallery.displayStyle === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {memorial.gallery.photos.map((photo, index) => (
                  <div key={index} className="group cursor-pointer">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Gallery photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow hover:shadow-xl transition"
                      onClick={() => {
                        window.open(photo.url, '_blank');
                      }}
                    />
                    {photo.caption && (
                      <p className="text-sm text-gray-600 mt-2 text-center">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {memorial.gallery.photos.map((photo, index) => (
                    <div key={index} className="flex-shrink-0 w-80">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Gallery photo ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                      {photo.caption && (
                        <p className="text-sm text-gray-600 mt-2 text-center">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline Section */}
        {memorial.timeline?.events?.length > 0 && memorial.timeline.showTimeline && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Life Timeline</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              
              <div className="space-y-6">
                {memorial.timeline.events
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((event, index) => (
                    <div key={index} className="relative pl-12">
                      {/* Timeline dot */}
                      <div className="absolute left-2.5 top-2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow"></div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            {event.yearOnly 
                              ? new Date(event.date).getFullYear() 
                              : new Date(event.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                        {event.description && (
                          <p className="text-gray-600 text-sm">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Family Section */}
        {memorial.familyMembers?.length > 0 && memorial.showFamily && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Family & Loved Ones</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {memorial.familyMembers.map((member, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-blue-600">{member.relationship}</p>
                      {member.description && (
                        <p className="text-sm text-gray-600 mt-1">{member.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tributes Placeholder */}
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          <p>Tributes & Messages</p>
          <p className="text-sm mt-2">Coming soon in Phase 4</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Created with love on{' '}
            <Link to="/" className="text-blue-400 hover:text-blue-300">
              InMemorialOf
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MemorialView;