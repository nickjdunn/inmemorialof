import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Share2 } from 'lucide-react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">InMemorialOf</h1>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Honor Their Memory
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create beautiful, lasting tributes for your loved ones. Share memories,
          celebrate their life, and keep their legacy alive forever.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 inline-block"
          >
            Create a Memorial
          </Link>
          <Link
            to="/demo"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg border-2 border-blue-600 hover:bg-blue-50 inline-block"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Beautiful Tributes</h3>
            <p className="text-gray-600">
              Create stunning memorial pages with photos, stories, and cherished memories.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
            <p className="text-gray-600">
              Control who sees the memorial with password protection and privacy settings.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
            <p className="text-gray-600">
              Share memorials with family and friends via link, QR code, or social media.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 InMemorialOf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;