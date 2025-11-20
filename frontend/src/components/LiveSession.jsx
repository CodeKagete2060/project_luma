import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import VideoCall from './VideoCall';
import AICoAttendee from './AICoAttendee';
import api from '../utils/axiosConfig';

const LiveSession = ({ sessionId, user, onEndSession }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchSessionDetails();
    initSocketConnection();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      const response = await api.get(`/live-sessions/${sessionId}/status`);
      setSession(response.data.session);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching session:', error);
      setError('Failed to load session details');
      setLoading(false);
    }
  };

  const initSocketConnection = () => {
    socketRef.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

    // Join the live session room
    socketRef.current.emit('join-live-session', {
      sessionId,
      userId: user.id,
      userRole: user.role.toLowerCase()
    });

    // Listen for session events
    socketRef.current.on('session:started', handleSessionStarted);
    socketRef.current.on('session:ended', handleSessionEnded);
    socketRef.current.on('user-joined', handleUserJoined);
    socketRef.current.on('user-left', handleUserLeft);
    socketRef.current.on('ai:response', handleAIResponse);
    socketRef.current.on('live-session-message', handleMessage);
  };

  const handleSessionStarted = (data) => {
    console.log('Session started:', data);
    setSession(prev => ({ ...prev, status: 'active', startTime: data.startTime }));
  };

  const handleSessionEnded = (data) => {
    console.log('Session ended:', data);
    if (onEndSession) {
      onEndSession(data);
    }
  };

  const handleUserJoined = (data) => {
    console.log('User joined:', data);
    setParticipants(prev => [...prev.filter(p => p.userId !== data.userId), {
      userId: data.userId,
      userRole: data.userRole,
      joinedAt: data.timestamp
    }]);
  };

  const handleUserLeft = (data) => {
    console.log('User left:', data);
    setParticipants(prev => prev.filter(p => p.userId !== data.userId));
  };

  const handleAIResponse = (data) => {
    console.log('AI response:', data);
    // AI responses are handled by the AICoAttendee component
  };

  const handleMessage = (data) => {
    console.log('Message received:', data);
    setMessages(prev => [...prev, {
      id: Date.now(),
      ...data,
      timestamp: new Date(data.timestamp)
    }]);
  };

  const handleEndCall = async () => {
    try {
      await api.put(`/live-sessions/${sessionId}/end`);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const handleAICalled = (question, response) => {
    // Add to messages for display
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'ai-call',
      question,
      response,
      timestamp: new Date()
    }]);
  };

  const sendMessage = (message) => {
    if (socketRef.current && message.trim()) {
      socketRef.current.emit('live-session-message', {
        sessionId,
        message: message.trim(),
        user: {
          id: user.id,
          name: user.username || user.name,
          role: user.role
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Not Found</h2>
          <p className="text-gray-600">The session you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isParent = user.role === 'Parent';
  const otherParticipant = participants.find(p => p.userId !== user.id);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isParent ? 'Study Session with Your Child' : 'Study Session with Parent'}
            </h1>
            <p className="text-gray-600">
              {session.status === 'active' ? 'Session in progress' : 'Waiting to start...'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                session.status === 'active' ? 'bg-green-500' :
                session.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              <span className="text-sm font-medium capitalize">{session.status}</span>
            </div>
            {session.aiEnabled && (
              <button
                onClick={() => setAiOpen(!aiOpen)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  aiOpen
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🤖 AI Assistant
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {session.status === 'active' ? (
            <VideoCall
              sessionId={sessionId}
              userId={user.id}
              userRole={user.role.toLowerCase()}
              onEndCall={handleEndCall}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Waiting for Session to Start</h2>
              <p className="text-gray-600 mb-4">
                {isParent
                  ? 'Your child will join the session shortly.'
                  : 'Your parent will start the session soon.'
                }
              </p>
              <div className="flex justify-center gap-4">
                <div className="text-sm text-gray-500">
                  Participants: {participants.length + 1}/2
                </div>
              </div>
            </div>
          )}

          {/* Session Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Session Type</h3>
              <p className="text-gray-600 capitalize">{session.sessionType}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-2">AI Assistant</h3>
              <p className="text-gray-600">{session.aiEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Duration</h3>
              <p className="text-gray-600">
                {session.startTime
                  ? `${Math.floor((Date.now() - new Date(session.startTime)) / 60000)} min`
                  : 'Not started'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Co-Attendee */}
      <AICoAttendee
        sessionId={sessionId}
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onAICalled={handleAICalled}
      />
    </div>
  );
};

export default LiveSession;