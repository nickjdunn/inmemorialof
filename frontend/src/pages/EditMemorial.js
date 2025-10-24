import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ArrowLeft, Upload, Calendar, Trash2, Crop } from 'lucide-react';
import GalleryManager from '../components/GalleryManager';
import TimelineManager from '../components/TimelineManager';
import FamilyManager from '../components/FamilyManager';
import FavoritesManager from '../components/FavoritesManager';
import PhotoShapeSelector from '../components/PhotoShapeSelector';
import CoverPhotoManager from '../components/CoverPhotoManager';
import PhotoCropper from '../components/PhotoCropper';
import ThemeCustomizer from '../components/ThemeCustomizer';

const EditMemorial = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    deathDate: '',
    biography: '',
    showDates: true,
    status: 'unpublished'
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [photoShape, setPhotoShape] = useState('circle');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropData, setCropData] = useState(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState(null);
  
  const [gallery, setGallery] = useState({
    photos: [],
    videos: [],
    displayStyle: 'grid',
    showGallery: true
  });

  const [timeline, setTimeline] = useState({
    events: [],
    showTimeline: true,
    orientation: 'vertical'
  });

  const [family, setFamily] = useState({
    familyMembers: [],
    showFamily: true
  });

  const [favorites, setFavorites] = useState({
    favorites: [],
    showFavorites: true
  });

  const [theme, setTheme] = useState({
    accentColor: '#2563EB',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    backgroundStyle: 'gradient'
  });

  useEffect(() => {
    fetchMemorial();
  }, [id]);

  const fetchMemorial = async () => {
    try {
      const response = await api.get(`/memorials/edit/${id}`);
      const memorial = response.data.memorial;
      
      setFormData({
        fullName: memorial.fullName,
        birthDate: memorial.birthDate ? memorial.birthDate.split('T')[0] : '',
        deathDate: memorial.deathDate ? memorial.deathDate.split('T')[0] : '',
        biography: memorial.biography?.content || '',
        showDates: memorial.showDates,
        status: memorial.status
      });

      if (memorial.profilePhoto?.url) {
        setProfilePhotoPreview(memorial.profilePhoto.url);
        setPhotoShape(memorial.profilePhoto.shape || 'circle');
        setCropData(memorial.profilePhoto.croppedData || null);
      }

      if (memorial.coverPhoto) {
        setCoverPhoto(memorial.coverPhoto);
      }

      if (memorial.gallery) {
        setGallery(memorial.gallery);
      }

      if (memorial.timeline) {
        setTimeline(memorial.timeline);
      }

      setFamily({
        familyMembers: memorial.familyMembers || [],
        showFamily: memorial.showFamily !== false
      });

      setFavorites({
        favorites: memorial.favorites || [],
        showFavorites: memorial.showFavorites !== false
      });

      if (memorial.theme) {
        setTheme({
          accentColor: memorial.theme.accentColor || '#2563EB',
          headingFont: memorial.theme.headingFont || 'Inter',
          bodyFont: memorial.theme.bodyFont || 'Inter',
          backgroundStyle: memorial.theme.backgroundStyle || 'gradient'
        });
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load memorial');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhotoUrl(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (cropInfo) => {
    setCropData(cropInfo);
    setProfilePhotoPreview(tempPhotoUrl);
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempPhotoUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        ...formData,
        profilePhoto: profilePhotoPreview ? {
          url: profilePhotoPreview,
          shape: photoShape,
          croppedData: cropData
        } : null,
        coverPhoto: coverPhoto,
        gallery: gallery,
        timeline: timeline,
        familyMembers: family.familyMembers,
        showFamily: family.showFamily,
        favorites: favorites.favorites,
        showFavorites: favorites.showFavorites,
        theme: theme
      };

      console.log('Sending update data:', updateData);

      const response = await api.put(`/memorials/${id}`, updateData);
      
      setSuccess('Memorial updated successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update memorial';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmation = window.prompt('Type DELETE to confirm deletion:');
    if (confirmation !== 'DELETE') {
      alert('Deletion cancelled - you must type DELETE exactly');
      return;
    }

    try {
      await api.delete(`/memorials/${id}`);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete memorial';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Photo Cropper Modal */}
      {showCropper && tempPhotoUrl && (
        <PhotoCropper
          imageUrl={tempPhotoUrl}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          shape={photoShape}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Edit Memorial</h1>
          <p className="text-gray-600 mb-8">
            Update the memorial information below
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {typeof error === 'string' ? error : 'An error occurred'}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Profile Photo Section - ENHANCED WITH CROPPER */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Profile Photo</h3>
              
              {/* Upload Button */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Photo Upload
                </label>
                <div className="flex items-center space-x-4">
                  {profilePhotoPreview && (
                    <img
                      src={profilePhotoPreview}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                  )}
                  <div className="space-y-2">
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center w-fit">
                      <Upload className="w-4 h-4 mr-2" />
                      {profilePhotoPreview ? 'Change Photo' : 'Upload Photo'}
                      <input
                        type="file"
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    {profilePhotoPreview && cropData && (
                      <button
                        type="button"
                        onClick={() => {
                          setTempPhotoUrl(profilePhotoPreview);
                          setShowCropper(true);
                        }}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                      >
                        <Crop className="w-4 h-4 mr-2" />
                        Re-crop Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Shape Selector */}
              {profilePhotoPreview && (
                <PhotoShapeSelector
                  currentShape={photoShape}
                  photoUrl={profilePhotoPreview}
                  onChange={setPhotoShape}
                />
              )}
            </div>

            {/* Cover Photo Section */}
            <div className="mb-8">
              <CoverPhotoManager 
                coverPhoto={coverPhoto} 
                onChange={setCoverPhoto} 
              />
            </div>

            {/* Basic Info */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
              
              {/* Full Name */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Birth Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Death Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="deathDate"
                      value={formData.deathDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Show Dates Toggle */}
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="showDates"
                  name="showDates"
                  checked={formData.showDates}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="showDates" className="ml-2 text-gray-700">
                  Display dates publicly
                </label>
              </div>

              {/* Biography */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Biography / Life Story
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  rows="8"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share the story of their life, their passions, achievements, and the impact they had on others..."
                ></textarea>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Memorial Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unpublished">Unpublished (Draft)</option>
                  <option value="public">Public</option>
                  <option value="private">Private (Password Protected)</option>
                </select>
              </div>
            </div>

            {/* Theme Customization - NEW */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Theme & Appearance</h3>
              <ThemeCustomizer theme={theme} onChange={setTheme} />
            </div>

            {/* Gallery */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Photo & Video Gallery</h3>
              <GalleryManager gallery={gallery} onChange={setGallery} />
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Life Timeline</h3>
              <TimelineManager timeline={timeline} onChange={setTimeline} />
            </div>

            {/* Family */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Family Members</h3>
              <FamilyManager family={family} onChange={setFamily} />
            </div>

            {/* Favorites */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Favorites & Interests</h3>
              <FavoritesManager favorites={favorites} onChange={setFavorites} />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Memorial
              </button>
              
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditMemorial;