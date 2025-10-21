import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, LogOut, User, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemorials();
  }, []);

  const fetchMemorials = async () => {
    try {
      // This endpoint doesn't exist yet, so we'll handle the error gracefully
      const response = await api.get('/memorials/my-memorials');
      setMemorials(response.data.memorials || []);
    } catch (error) {
      console.log('Memorials not loaded yet - this is normal for Phase 2');
      setMemorials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              InMemorialOf
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user?.name}</span>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-600 hover:text-blue-600"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Memorial Slots</p>
              <p className="text-3xl font-bold text-blue-600">
                {user?.memorialSlots || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Memorials Created</p>
              <p className="text-3xl font-bold text-gray-900">
                {memorials.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Available Slots</p>
              <p className="text-3xl font-bold text-green-600">
                {(user?.memorialSlots || 0) - memorials.length}
              </p>
            </div>
          </div>
        </div>

        {/* No Memorials State */}
        {!loading && memorials.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Create Your First Memorial</h2>
              
              {user?.memorialSlots > 0 ? (
                <>
                  <p className="text-gray-600 mb-6">
                    You have {user.memorialSlots} memorial {user.memorialSlots === 1 ? 'slot' : 'slots'} available. 
                    Start honoring your loved ones by creating a beautiful memorial page.
                  </p>
                  <button
                    onClick={() => navigate('/create-memorial')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Memorial
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    You don't have any memorial slots yet. Purchase memorial slots to start creating beautiful tributes.
                  </p>
                  <button
                    onClick={() => navigate('/purchase')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Purchase Memorial Slots
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Memorials List */}
        {!loading && memorials.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Memorials</h2>
              {(user?.memorialSlots || 0) > memorials.length && (
                <button
                  onClick={() => navigate('/create-memorial')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Memorial
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memorials.map((memorial) => (
                <div key={memorial._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                  <h3 className="text-xl font-semibold mb-2">{memorial.fullName}</h3>
                  <p className="text-gray-600 mb-4">
                    {memorial.birthDate && memorial.deathDate
                      ? `${new Date(memorial.birthDate).getFullYear()} - ${new Date(memorial.deathDate).getFullYear()}`
                      : 'Dates not set'}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/memorial/${memorial.url}`)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/edit-memorial/${memorial._id}`)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;