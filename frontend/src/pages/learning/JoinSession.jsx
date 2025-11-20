import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import DashboardLayout from '../../components/DashboardLayout';

export default function JoinSession() {
  const { id } = useParams();
  const [sessionId, setSessionId] = useState(id || '');
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const socketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const socketUrl =
    import.meta.env.VITE_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

  const ensureSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io(socketUrl, {
        transports: ['websocket'],
      });
      socketRef.current.on('session-message', (payload) => {
        if (payload.sessionId === sessionId) {
          setMessages((prev) => [...prev, payload]);
        }
      });
    }
  };

  const join = () => {
    if (!sessionId) return;
    ensureSocket();
    socketRef.current.emit('join-session-room', {
      sessionId,
      user: { name: user.name || user.username || 'Participant' },
    });
    setConnected(true);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    ensureSocket();
    socketRef.current.emit('session-message', {
      sessionId,
      message: chatInput,
      user: { name: user.name || user.username || 'Participant', role: user.role },
    });
    setChatInput('');
  };

  return (
    <DashboardLayout role={user.role}>
      <div>
        <h1 className="text-3xl font-bold text-primary mb-6">Join Tutoring Session</h1>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Session ID</label>
              <input
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Enter session ID"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <button
              onClick={join}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
              disabled={!sessionId}
            >
              {connected ? 'Reconnect' : 'Join Session'}
            </button>
          </div>

          {connected && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Live Session Chat</h2>
                <div className="border rounded-lg h-64 overflow-y-auto p-3 bg-gray-50">
                  {messages.length === 0 && <p className="text-sm text-gray-500">No messages yet.</p>}
                  {messages.map((msg, idx) => (
                    <div key={idx} className="mb-2 text-sm">
                      {msg.system ? (
                        <span className="text-gray-500 italic">{msg.message}</span>
                      ) : (
                        <>
                          <span className="font-semibold text-primary">{msg.user?.name || 'Participant'}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                          </span>
                          <div>{msg.message}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Share meeting links, notes..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendMessage();
                    }}
                  />
                  <button className="px-4 py-2 bg-primary text-white rounded-lg" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Connect Video/Audio</h2>
                <p className="text-sm text-gray-600 mb-3">
                  Use your preferred video service (Daily, Zoom, Google Meet) and share the link in the session chat. The
                  team can connect instantly and keep collaborating using this workspace.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Share documents/resources using the Upload Resource tool.</li>
                  <li>Use the chat to capture decisions and quick notes.</li>
                  <li>Switch to the AI Assistant for instant help mid-session.</li>
                </ul>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>
              Note: Full WebRTC integration (video/audio streaming, screen share) requires connecting to a signaling
              service such as Daily, Twilio, or custom WebRTC infrastructure. This chat and coordination space keeps
              everything in one place until the full stack is ready.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
