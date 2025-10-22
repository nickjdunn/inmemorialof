import React from 'react';
import { Music, Book, Heart, Coffee, Plane, Camera, Palette, Trophy, Star, Sparkles } from 'lucide-react';

const FavoritesDisplay = ({ favorites, showFavorites }) => {
  // Don't render if disabled or no favorites
  if (!showFavorites || !favorites || favorites.length === 0) {
    return null;
  }

  // Icon mapping
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Music': Music,
      'Book': Book,
      'Heart': Heart,
      'Coffee': Coffee,
      'Plane': Plane,
      'Camera': Camera,
      'Palette': Palette,
      'Trophy': Trophy,
      'Sparkles': Sparkles,
      'Star': Star
    };
    return iconMap[iconName] || Star;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorites & Interests</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {favorites.map((favorite, index) => {
          const IconComponent = getIconComponent(favorite.icon);
          return (
            <div key={index} className="border-l-4 border-blue-600 pl-4">
              <div className="flex items-start space-x-3 mb-2">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {favorite.category}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {favorite.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesDisplay;