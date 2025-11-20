import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axiosConfig';
import DashboardLayout from '../components/DashboardLayout';

export default function NewDiscussion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    subject: 'General',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  const subjects = ['General', 'Math', 'Science', 'English', 'History', 'Art', 'Music', 'Physical Education', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    setLoading(true);
    try {
      const res = await api.post('/discussions', {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      navigate(`/discussions/${res.data._id}`);
    } catch (err) {
      console.error('Error creating discussion:', err);
      alert('Error creating discussion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role={user.role}>
      <div>
        <button
          onClick={() => navigate('/discussions')}
          className="mb-4 text-primary hover:underline"
        >
          ← Back to Discussions
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h1 className="text-2xl font-bold mb-6">Start a New Discussion</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Enter discussion title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              >
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                rows={8}
                placeholder="Write your question or discussion topic..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="e.g., algebra, homework, help"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/discussions')}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Discussion'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

