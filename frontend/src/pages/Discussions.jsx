import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/axiosConfig';
import DashboardLayout from '../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

export default function Discussions() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscussions();
  }, [page, searchQuery, subjectFilter, sortBy]);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sort: sortBy,
      });
      if (searchQuery) params.append('q', searchQuery);
      if (subjectFilter) params.append('subject', subjectFilter);

      const res = await api.get(`/discussions?${params}`);
      setDiscussions(res.data.discussions || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (discussionId, isUpvoted) => {
    try {
      const res = await api.post(`/discussions/${discussionId}/upvote`);
      setDiscussions(discussions.map(d => 
        d._id === discussionId 
          ? { ...d, upvoteCount: res.data.upvoteCount, isUpvoted: res.data.isUpvoted }
          : d
      ));
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const subjects = ['General', 'Math', 'Science', 'English', 'History', 'Art', 'Music', 'Physical Education', 'Other'];

  return (
    <DashboardLayout role={user.role}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Discussion Board</h1>
          <button
            onClick={() => navigate('/discussions/new')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            + New Discussion
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">All Subjects</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="recent">Recent Activity</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading discussions...</div>
        ) : (
          <div className="space-y-4">
            {discussions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No discussions found. Start a new one!</p>
              </div>
            ) : (
              discussions.map((discussion) => (
                <motion.div
                  key={discussion._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/discussions/${discussion._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{discussion.title}</h3>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {discussion.subject}
                        </span>
                        {discussion.isResolved && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{discussion.content.substring(0, 200)}...</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>By {discussion.author?.username || 'Unknown'}</span>
                        <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                        <span>{discussion.replyCount || 0} replies</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(discussion._id, discussion.isUpvoted);
                      }}
                      className={`ml-4 px-3 py-2 rounded-lg flex flex-col items-center transition-colors ${
                        discussion.isUpvoted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>Upvote</span>
                      <span className="text-xs">{discussion.upvoteCount || 0}</span>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

