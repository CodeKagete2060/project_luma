import { useState } from 'react';
import api from '../../utils/axiosConfig';
import DashboardLayout from '../../components/DashboardLayout';

export default function StartSession() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  const create = async () => {
    setLoading(true);
    try {
      const res = await api.post('/sessions/create', { title, tutorId: user.id || user._id });
      setSessionId(res.data.sessionId);
    } catch (err) {
      console.error('create session err', err);
      alert('Error creating session');
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout role={user.role}>
      <div>
        <h1 className="text-3xl font-bold text-primary mb-6">Start Tutoring Session</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Session Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Enter session title" 
                className="w-full border rounded-lg px-4 py-2" 
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={create} 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90" 
                disabled={loading || !title}
              >
                {loading ? 'Creating...' : 'Create & Start Session'}
              </button>
              {sessionId && (
                <a 
                  className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200" 
                  href={`/learning/sessions/join/${sessionId}`}
                >
                  Open Room
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
