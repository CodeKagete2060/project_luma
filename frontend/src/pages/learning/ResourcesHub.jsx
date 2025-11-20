import { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';
import DashboardLayout from '../../components/DashboardLayout';
import ResourceCard from '../../components/ResourceCard';

export default function ResourcesHub() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchList(); }, [page]);

  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  async function fetchList() {
    try {
      const res = await api.get(`/learning/resources?q=${encodeURIComponent(q)}&page=${page}`);
      setItems(res.data.items || []);
    } catch (err) {
      console.error('fetch resources err', err);
    }
  }

  return (
    <DashboardLayout role={user.role}>
      <div>
        <h1 className="text-3xl font-bold text-primary mb-6">Study Resources</h1>
        <div className="mb-4 flex gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search resources..." className="flex-1 border rounded-lg px-4 py-2" />
          <button onClick={() => { setPage(1); fetchList(); }} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">Search</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">No resources found</div>
          ) : (
            items.map(r => <ResourceCard key={r._id} resource={r} />)
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
