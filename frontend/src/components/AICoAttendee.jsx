import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/axiosConfig';

const AICoAttendee = ({ sessionId, isOpen, onClose, onAICalled }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const userQuestion = question.trim();
    setQuestion('');

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userQuestion,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await api.post(`/live-sessions/${sessionId}/ai/ask`, {
        question: userQuestion
      });

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Notify parent component
      if (onAICalled) {
        onAICalled(userQuestion, response.data.response);
      }
    } catch (error) {
      console.error('AI request failed:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const rateResponse = async (messageId, helpful) => {
    try {
      // Find the message index
      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1) return;

      // Find the corresponding AI interaction index
      const aiMessages = messages.filter(msg => msg.type === 'ai');
      const aiMessageIndex = aiMessages.findIndex(msg => msg.id === messageId);

      if (aiMessageIndex !== -1) {
        await api.post(`/live-sessions/${sessionId}/ai/feedback`, {
          interactionIndex: aiMessageIndex,
          helpful
        });

        // Update local state
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, rated: true, helpful } : msg
        ));
      }
    } catch (error) {
      console.error('Rating failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-12' : 'w-96 h-96'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-blue-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium text-gray-800">AI Learning Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 h-64">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-2xl mb-2">🤖</div>
                <p>Hi! I'm here to help with your learning session.</p>
                <p className="text-sm">Ask me anything about your homework or studies!</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.error
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {message.type === 'ai' && !message.error && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Was this helpful?</span>
                      {!message.rated ? (
                        <>
                          <button
                            onClick={() => rateResponse(message.id, true)}
                            className="text-xs text-green-600 hover:text-green-800"
                          >
                            👍
                          </button>
                          <button
                            onClick={() => rateResponse(message.id, false)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            👎
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {message.helpful ? '👍' : '👎'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask the AI for help..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={askAI}
                disabled={loading || !question.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ask
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AICoAttendee;