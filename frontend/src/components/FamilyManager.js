import React, { useState } from 'react';
import { Plus, X, Users } from 'lucide-react';

const FamilyManager = ({ familyMembers, showFamily, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    description: ''
  });

  const members = familyMembers || [];

  const commonRelationships = [
    'Spouse',
    'Partner',
    'Child',
    'Parent',
    'Sibling',
    'Grandchild',
    'Grandparent',
    'Aunt',
    'Uncle',
    'Niece',
    'Nephew',
    'Cousin',
    'Friend'
  ];

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relationship) {
      alert('Please fill in name and relationship');
      return;
    }

    onChange({
      familyMembers: [
        ...members,
        {
          ...newMember,
          order: members.length
        }
      ],
      showFamily
    });

    setNewMember({ name: '', relationship: '', description: '' });
    setShowAddForm(false);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    onChange({ familyMembers: updatedMembers, showFamily });
  };

  const handleToggleFamily = () => {
    onChange({ familyMembers: members, showFamily: !showFamily });
  };

  return (
    <div className="space-y-6">
      {/* Toggle Family Display */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showFamily !== false}
            onChange={handleToggleFamily}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-700">Show family section on memorial page</span>
        </label>
        <span className="text-sm text-gray-600">{members.length} members</span>
      </div>

      {/* Family Members List */}
      {members.length > 0 && (
        <div className="space-y-3">
          {members.map((member, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                    <span className="text-sm text-gray-600">• {member.relationship}</span>
                  </div>
                  {member.description && (
                    <p className="text-sm text-gray-600">{member.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Button */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Family Member
        </button>
      ) : (
        <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
          <h4 className="font-semibold text-gray-900 mb-4">New Family Member</h4>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Full name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship *
              </label>
              <div className="flex space-x-2">
                <select
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select relationship</option>
                  {commonRelationships.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                  <option value="custom">Custom...</option>
                </select>
              </div>
              {newMember.relationship === 'custom' && (
                <input
                  type="text"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                  placeholder="Enter custom relationship"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newMember.description}
                onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
                placeholder="Add a brief description..."
                rows="2"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleAddMember}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Member
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewMember({ name: '', relationship: '', description: '' });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {members.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p>No family members added yet</p>
        </div>
      )}
    </div>
  );
};

export default FamilyManager;