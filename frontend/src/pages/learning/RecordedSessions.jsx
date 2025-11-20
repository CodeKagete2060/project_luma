import { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';
import DashboardLayout from '../../components/DashboardLayout';

export default function RecordedSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => { fetchSessions(); }, []);

  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  async function fetchSessions() {
    try {
      const res = await api.get('/sessions/list');
      setSessions(res.data.items || []);
    } catch (err) {
      console.error('fetch sessions err', err);
    }
  }

  return (
    <DashboardLayout role={user.role}>
      <div>
        <h1 className="text-3xl font-bold text-primary mb-6">Recorded Sessions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-500">No recorded sessions available</div>
          ) : (
            sessions.map(s => (
              <div key={s._id} className="bg-white rounded-lg shadow-md p-4">
                <h4 className="font-semibold text-lg mb-2">{s.title}</h4>
                {s.recordingUrl ? (
                  <video className="w-full mt-2 rounded" controls src={s.recordingUrl}></video>
                ) : (
                  <div className="text-sm text-gray-500 mt-2">No recording available</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
