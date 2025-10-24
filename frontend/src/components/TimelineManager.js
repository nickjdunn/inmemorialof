import React, { useState } from 'react';
import { Plus, X, Calendar, GripVertical, ArrowRight, ArrowDown } from 'lucide-react';

const TimelineManager = ({ timeline, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: '',
    yearOnly: false,
    title: '',
    description: '',
    photoRef: ''
  });

  const events = timeline.events || [];
  const orientation = timeline.orientation || 'vertical';

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      alert('Please fill in at least the title and date');
      return;
    }

    const updatedEvents = [
      ...events,
      {
        ...newEvent,
        order: events.length
      }
    ];

    // Sort by date
    updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    onChange({
      ...timeline,
      events: updatedEvents
    });

    setNewEvent({
      date: '',
      yearOnly: false,
      title: '',
      description: '',
      photoRef: ''
    });
    setShowAddForm(false);
  };

  const handleRemoveEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    onChange({
      ...timeline,
      events: updatedEvents
    });
  };

  const handleToggleTimeline = () => {
    onChange({
      ...timeline,
      showTimeline: !timeline.showTimeline
    });
  };

  const handleOrientationChange = (newOrientation) => {
    onChange({
      ...timeline,
      orientation: newOrientation
    });
  };

  return (
    <div className="space-y-6">
      {/* Toggle Timeline Display & Orientation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={timeline.showTimeline !== false}
              onChange={handleToggleTimeline}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Show timeline on memorial page</span>
          </label>
          <span className="text-sm text-gray-600">{events.length} events</span>
        </div>

        {/* Timeline Orientation Selector */}
        {timeline.showTimeline !== false && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline Orientation
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleOrientationChange('vertical')}
                className={`flex-1 px-4 py-3 border-2 rounded-lg transition ${
                  orientation === 'vertical'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ArrowDown className="w-4 h-4" />
                  <span className="font-medium">Vertical</span>
                </div>
                <p className="text-xs mt-1 opacity-75">Events stack vertically</p>
              </button>

              <button
                type="button"
                onClick={() => handleOrientationChange('horizontal')}
                className={`flex-1 px-4 py-3 border-2 rounded-lg transition ${
                  orientation === 'horizontal'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium">Horizontal</span>
                </div>
                <p className="text-xs mt-1 opacity-75">Events flow left to right</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Events List */}
      {events.length > 0 && (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start space-x-3 flex-1">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
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
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEvent(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Remove event"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Event Button */}
      {!showAddForm && (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600"
        >
          <Plus className="w-5 h-5" />
          <span>Add Timeline Event</span>
        </button>
      )}

      {/* Add Event Form */}
      {showAddForm && (
        <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
          <h4 className="font-semibold text-gray-900 mb-4">New Timeline Event</h4>
          
          <div className="space-y-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Year Only Checkbox */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newEvent.yearOnly}
                  onChange={(e) => setNewEvent({ ...newEvent, yearOnly: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show year only</span>
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Graduated from College"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Add more details about this event..."
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleAddEvent}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Event
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewEvent({ date: '', yearOnly: false, title: '', description: '', photoRef: '' });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {events.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p>No timeline events yet</p>
        </div>
      )}
    </div>
  );
};

export default TimelineManager;