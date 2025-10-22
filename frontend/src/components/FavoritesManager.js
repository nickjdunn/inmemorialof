import React, { useState } from 'react';
import { Plus, X, Music, Book, Heart, Coffee, Plane, Camera, Palette, Trophy, Star, Sparkles } from 'lucide-react';

const FavoritesManager = ({ favorites, showFavorites, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFavorite, setNewFavorite] = useState({
    category: '',
    icon: '',
    content: ''
  });

  const items = favorites || [];

  // Preset categories with icons
  const presetCategories = [
    { name: 'Music', icon: 'Music', component: Music, placeholder: 'e.g., Classical, Jazz, The Beatles' },
    { name: 'Books', icon: 'Book', component: Book, placeholder: 'e.g., To Kill a Mockingbird, Harry Potter' },
    { name: 'Movies', icon: 'Camera', component: Camera, placeholder: 'e.g., The Godfather, Casablanca' },
    { name: 'Hobbies', icon: 'Heart', component: Heart, placeholder: 'e.g., Gardening, Photography, Cooking' },
    { name: 'Food', icon: 'Coffee', component: Coffee, placeholder: 'e.g., Italian cuisine, Chocolate cake' },
    { name: 'Travel', icon: 'Plane', component: Plane, placeholder: 'e.g., Paris, Hawaii, Italy' },
    { name: 'Art', icon: 'Palette', component: Palette, placeholder: 'e.g., Impressionism, Watercolor painting' },
    { name: 'Sports', icon: 'Trophy', component: Trophy, placeholder: 'e.g., Baseball, Golf, Swimming' },
    { name: 'Quotes', icon: 'Sparkles', component: Sparkles, placeholder: 'e.g., "Live, laugh, love" - their favorite quote' },
    { name: 'Other', icon: 'Star', component: Star, placeholder: 'Anything else they loved' }
  ];

  const getIconComponent = (iconName) => {
    const category = presetCategories.find(cat => cat.icon === iconName);
    return category ? category.component : Star;
  };

  const handleAddFavorite = () => {
    if (!newFavorite.category || !newFavorite.content) {
      alert('Please select a category and add content');
      return;
    }

    onChange({
      favorites: [
        ...items,
        {
          ...newFavorite,
          order: items.length
        }
      ],
      showFavorites
    });

    setNewFavorite({ category: '', icon: '', content: '' });
    setShowAddForm(false);
  };

  const handleRemoveFavorite = (index) => {
    const updatedFavorites = items.filter((_, i) => i !== index);
    onChange({ favorites: updatedFavorites, showFavorites });
  };

  const handleToggleFavorites = () => {
    onChange({ favorites: items, showFavorites: !showFavorites });
  };

  const handleCategoryChange = (categoryName) => {
    const category = presetCategories.find(cat => cat.name === categoryName);
    setNewFavorite({
      ...newFavorite,
      category: categoryName,
      icon: category ? category.icon : 'Star'
    });
  };

  return (
    <div className="space-y-6">
      {/* Toggle Favorites Display */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showFavorites !== false}
            onChange={handleToggleFavorites}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-700">Show favorites section on memorial page</span>
        </label>
        <span className="text-sm text-gray-600">{items.length} favorites</span>
      </div>

      {/* Favorites List */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((favorite, index) => {
            const IconComponent = getIconComponent(favorite.icon);
            return (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{favorite.category}</h4>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{favorite.content}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Favorite
        </button>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
          <h4 className="font-semibold text-gray-900 mb-4">Add New Favorite</h4>
          
          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {presetCategories.map((category) => {
                const IconComponent = category.component;
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => handleCategoryChange(category.name)}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center space-y-1 transition ${
                      newFavorite.category === category.name
                        ? 'border-blue-600 bg-blue-100 text-blue-700'
                        : 'border-gray-300 hover:border-blue-400 text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newFavorite.content}
              onChange={(e) => setNewFavorite({ ...newFavorite, content: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                newFavorite.category
                  ? presetCategories.find(cat => cat.name === newFavorite.category)?.placeholder
                  : 'Select a category first...'
              }
            />
            <p className="text-sm text-gray-600 mt-1">
              You can list multiple items separated by commas or write a descriptive paragraph
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleAddFavorite}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Add Favorite
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewFavorite({ category: '', icon: '', content: '' });
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      {items.length === 0 && !showAddForm && (
        <div className="text-center py-6 text-gray-500">
          <p className="mb-2">No favorites added yet</p>
          <p className="text-sm">Add their favorite music, hobbies, quotes, and more to make the memorial more personal</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesManager;