import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/axiosConfig';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ resources: [], discussions: [] });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  const runSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(query)}&limit=8`);
      setResults(res.data || { resources: [], discussions: [] });
    } catch (err) {
      console.error('smart search err', err);
      setResults({ resources: [], discussions: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role={user.role}>
      <div>
        <h1 className="text-3xl font-bold text-primary mb-4">Smart Search</h1>
        <p className="text-gray-600 mb-6">Find discussions and learning resources instantly.</p>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, subjects, resources..."
            className="flex-1 border rounded-lg px-4 py-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') runSearch();
            }}
          />
          <button
            onClick={runSearch}
            className="px-6 py-2 bg-primary text-white rounded-lg"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-3">Resources</h2>
            {results.resources.length === 0 && <p className="text-gray-500 text-sm">No resources yet.</p>}
            <div className="space-y-3">
              {results.resources.map((resource) => (
                <div key={resource._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {resource.subject || 'General'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{resource.summary || 'No summary provided.'}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    Tags: {resource.tags?.length ? resource.tags.join(', ') : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-3">Discussions</h2>
            {results.discussions.length === 0 && <p className="text-gray-500 text-sm">No discussions yet.</p>}
            <div className="space-y-3">
              {results.discussions.map((discussion) => (
                <div key={discussion._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{discussion.title}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {discussion.subject || 'General'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Tags: {discussion.tags?.length ? discussion.tags.join(', ') : '—'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Status: {discussion.isResolved ? 'Resolved' : 'Open'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

