import React, { useState } from 'react';
import api from '../utils/axiosConfig';

const StartLiveSessionModal = ({ isOpen, onClose, children, user }) => {
  const [selectedChild, setSelectedChild] = useState('');
  const [sessionType, setSessionType] = useState('video');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartSession = async () => {
    if (!selectedChild) {
      setError('Please select a child to start the session with.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/live-sessions/create', {
        studentId: selectedChild,
        sessionType,
        aiEnabled
      });

      // Redirect to the live session page
      window.location.href = `/live-session/${response.data.session.id}`;
    } catch (error) {
      console.error('Error starting session:', error);
      setError(error.response?.data?.message || 'Failed to start session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Live Study Session</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Child Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Child
              </label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a child...</option>
                {children.map((child) => (
                  <option key={child._id || child.id} value={child._id || child.id}>
                    {child.username || child.name} (Grade {child.grade || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="video"
                    checked={sessionType === 'video'}
                    onChange={(e) => setSessionType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Video Call (recommended)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="audio"
                    checked={sessionType === 'audio'}
                    onChange={(e) => setSessionType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Audio Only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="chat"
                    checked={sessionType === 'chat'}
                    onChange={(e) => setSessionType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Text Chat Only</span>
                </label>
              </div>
            </div>

            {/* AI Assistant */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) => setAiEnabled(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Enable AI Learning Assistant</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                AI can help answer questions and provide educational support during the session.
              </p>
            </div>
          </div>

          {/* Session Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• An invitation will be sent to your child</li>
              <li>• Your child can accept or decline the invitation</li>
              <li>• Once accepted, you'll enter a live session together</li>
              {aiEnabled && <li>• AI assistant will be available to help with questions</li>}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleStartSession}
              disabled={loading || !selectedChild}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Starting...' : 'Start Session'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartLiveSessionModal;