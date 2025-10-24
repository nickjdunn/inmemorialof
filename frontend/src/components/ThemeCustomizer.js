import React, { useState } from 'react';
import { Palette, Type, Layout } from 'lucide-react';

const ThemeCustomizer = ({ theme, onChange }) => {
  const [localTheme, setLocalTheme] = useState(theme || {
    accentColor: '#2563EB',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    backgroundStyle: 'gradient'
  });

  // Predefined color options
  const colorOptions = [
    { name: 'Blue', value: '#2563EB' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Pink', value: '#DB2777' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Orange', value: '#EA580C' },
    { name: 'Green', value: '#059669' },
    { name: 'Teal', value: '#0D9488' },
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Gray', value: '#4B5563' },
    { name: 'Black', value: '#1F2937' }
  ];

  // Font options
  const headingFonts = [
    { name: 'Inter (Default)', value: 'Inter' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Lora', value: 'Lora' },
    { name: 'Montserrat', value: 'Montserrat' }
  ];

  const bodyFonts = [
    { name: 'Inter (Default)', value: 'Inter' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro' }
  ];

  // Background style options with actual CSS
  const backgroundStyles = [
    { 
      name: 'Gradient', 
      value: 'gradient', 
      style: { background: 'linear-gradient(to bottom, #EFF6FF, #FFFFFF)' }
    },
    { 
      name: 'Solid White', 
      value: 'white', 
      style: { background: '#FFFFFF' }
    },
    { 
      name: 'Light Gray', 
      value: 'gray', 
      style: { background: '#F9FAFB' }
    },
    { 
      name: 'Warm', 
      value: 'warm', 
      style: { background: 'linear-gradient(to bottom, #FFF7ED, #FFFFFF)' }
    },
    { 
      name: 'Cool', 
      value: 'cool', 
      style: { background: 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)' }
    }
  ];

  const handleColorChange = (color) => {
    const updated = { ...localTheme, accentColor: color };
    setLocalTheme(updated);
    onChange(updated);
  };

  const handleFontChange = (type, font) => {
    const updated = { ...localTheme, [type]: font };
    setLocalTheme(updated);
    onChange(updated);
  };

  const handleBackgroundChange = (style) => {
    const updated = { ...localTheme, backgroundStyle: style };
    setLocalTheme(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-8">
      {/* Accent Color */}
      <div>
        <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
          <Palette className="w-5 h-5 mr-2 text-blue-600" />
          Accent Color
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Choose a color for buttons, links, and highlights
        </p>
        
        {/* Color Grid */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => handleColorChange(color.value)}
              className={`relative h-16 rounded-lg border-2 transition ${
                localTheme.accentColor === color.value
                  ? 'border-gray-800 scale-105'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {localTheme.accentColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Picker */}
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Custom color:</label>
          <input
            type="color"
            value={localTheme.accentColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-10 w-20 rounded cursor-pointer border border-gray-300"
          />
          <span className="text-sm text-gray-600">{localTheme.accentColor}</span>
        </div>
      </div>

      {/* Heading Font */}
      <div>
        <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
          <Type className="w-5 h-5 mr-2 text-blue-600" />
          Heading Font
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Font for name, section titles, and headings
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          {headingFonts.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => handleFontChange('headingFont', font.value)}
              className={`p-4 rounded-lg border-2 text-left transition ${
                localTheme.headingFont === font.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div style={{ fontFamily: font.value }} className="text-xl font-bold">
                {font.name}
              </div>
              <div style={{ fontFamily: font.value }} className="text-sm text-gray-600 mt-1">
                The quick brown fox jumps over the lazy dog
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Body Font */}
      <div>
        <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
          <Type className="w-5 h-5 mr-2 text-blue-600" />
          Body Font
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Font for biography, timeline, and other content
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          {bodyFonts.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => handleFontChange('bodyFont', font.value)}
              className={`p-4 rounded-lg border-2 text-left transition ${
                localTheme.bodyFont === font.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div style={{ fontFamily: font.value }} className="font-semibold">
                {font.name}
              </div>
              <div style={{ fontFamily: font.value }} className="text-sm text-gray-600 mt-1">
                The quick brown fox jumps over the lazy dog. 0123456789
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Background Style */}
      <div>
        <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
          <Layout className="w-5 h-5 mr-2 text-blue-600" />
          Background Style
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Choose the overall page background appearance
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {backgroundStyles.map((bgStyle) => (
            <button
              key={bgStyle.value}
              type="button"
              onClick={() => handleBackgroundChange(bgStyle.value)}
              className={`relative p-4 rounded-lg border-2 transition ${
                localTheme.backgroundStyle === bgStyle.value
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div 
                className="h-24 rounded mb-2 border border-gray-200" 
                style={bgStyle.style}
              ></div>
              <div className="text-sm font-medium text-center">{bgStyle.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Theme Preview</h4>
        <div className="p-6 rounded-lg border-2 border-gray-200 space-y-4">
          {/* Heading Preview */}
          <h2 
            style={{ 
              fontFamily: localTheme.headingFont,
              color: localTheme.accentColor 
            }} 
            className="text-2xl font-bold"
          >
            Sample Heading Text
          </h2>
          
          {/* Body Text Preview */}
          <p style={{ fontFamily: localTheme.bodyFont }} className="text-gray-700">
            This is how body text will appear on the memorial page. The quick brown fox jumps over the lazy dog.
          </p>
          
          {/* Button Preview */}
          <button
            style={{ backgroundColor: localTheme.accentColor }}
            className="px-6 py-2 text-white rounded-lg font-medium"
          >
            Sample Button
          </button>
          
          {/* Link Preview */}
          <div>
            <a 
              href="#" 
              style={{ color: localTheme.accentColor }}
              className="font-medium hover:underline"
            >
              Sample Link Text
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;