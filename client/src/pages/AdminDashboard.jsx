import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/axiosConfig';
import DashboardLayout from '../components/DashboardLayout';
import ProgressCard from '../components/ProgressCard';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [resources, setResources] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [resourcesQuery, setResourcesQuery] = useState('');
  const [discussionsQuery, setDiscussionsQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('analytics');
  const [moderationLoading, setModerationLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (tab === 'resources') {
      fetchResources();
    } else if (tab === 'discussions') {
      fetchDiscussions();
    }
  }, [tab]);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    setModerationLoading(true);
    try {
      const res = await api.get(`/admin/resources?search=${encodeURIComponent(resourcesQuery)}`);
      setResources(res.data.resources || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setModerationLoading(false);
    }
  };

  const fetchDiscussions = async () => {
    setModerationLoading(true);
    try {
      const res = await api.get(`/admin/discussions?search=${encodeURIComponent(discussionsQuery)}`);
      setDiscussions(res.data.discussions || []);
    } catch (err) {
      console.error('Error fetching discussions:', err);
    } finally {
      setModerationLoading(false);
    }
  };

  const deleteResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await api.delete(`/admin/resources/${id}`);
      fetchResources();
    } catch (err) {
      console.error('Delete resource error:', err);
    }
  };

  const deleteDiscussion = async (id) => {
    if (!window.confirm('Delete this discussion?')) return;
    try {
      await api.delete(`/admin/discussions/${id}`);
      fetchDiscussions();
    } catch (err) {
      console.error('Delete discussion error:', err);
    }
  };

  const toggleResolved = async (id) => {
    try {
      await api.patch(`/discussions/${id}/resolve`);
      fetchDiscussions();
    } catch (err) {
      console.error('Resolve discussion error:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="text-center py-8">Loading analytics...</div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout role="admin">
        <div className="text-center py-8">Error loading analytics</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>

        <div className="flex gap-3 mb-6">
          {['analytics', 'resources', 'discussions'].map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg ${tab === key ? 'bg-primary text-white' : 'bg-white text-gray-700 border'}`}
            >
              {key === 'analytics' ? 'Analytics' : key === 'resources' ? 'Resource Moderation' : 'Discussion Moderation'}
            </button>
          ))}
        </div>

        {tab === 'analytics' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <ProgressCard title="Total Users" value={analytics.overview?.totalUsers || 0} />
              <ProgressCard title="Students" value={analytics.overview?.totalStudents || 0} />
              <ProgressCard title="Tutors" value={analytics.overview?.totalTutors || 0} />
              <ProgressCard title="Parents" value={analytics.overview?.totalParents || 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <ProgressCard title="Resources" value={analytics.overview?.totalResources || 0} />
              <ProgressCard title="Discussions" value={analytics.overview?.totalDiscussions || 0} />
              <ProgressCard title="Assignments" value={analytics.overview?.totalAssignments || 0} />
              <ProgressCard title="Sessions" value={analytics.overview?.totalSessions || 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Most Active Students</h2>
                <div className="space-y-2">
                  {analytics.activeStudents?.length > 0 ? (
                    analytics.activeStudents.map((student, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-light rounded">
                        <span>{student.username || student.email}</span>
                        <span className="font-semibold">{student.completedCount} completed</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Common Subjects</h2>
                <div className="space-y-2">
                  {analytics.commonSubjects?.length > 0 ? (
                    analytics.commonSubjects.map((subject, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-light rounded">
                        <span>{subject._id || 'Unknown'}</span>
                        <span className="font-semibold">{subject.count} assignments</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 mt-6"
            >
              <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Username</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentUsers?.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="p-2">{user.username}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.role}</td>
                        <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {tab === 'resources' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <input
                value={resourcesQuery}
                onChange={(e) => setResourcesQuery(e.target.value)}
                placeholder="Search resources..."
                className="flex-1 border px-4 py-2 rounded-lg"
              />
              <button onClick={fetchResources} className="px-4 py-2 bg-primary text-white rounded-lg">
                Search
              </button>
            </div>
            {moderationLoading ? (
              <p>Loading resources...</p>
            ) : (
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div key={resource._id} className="border rounded-lg p-4 flex justify-between gap-4">
                    <div>
                      <div className="font-semibold text-gray-800">{resource.title}</div>
                      <div className="text-sm text-gray-500">Subject: {resource.subject || 'N/A'}</div>
                      <div className="text-xs text-gray-500">
                        Uploaded by: {resource.uploadedBy?.username || resource.uploadedBy?.email || 'Unknown'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded"
                        onClick={() => deleteResource(resource._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {resources.length === 0 && <p className="text-gray-500 text-sm">No resources found.</p>}
              </div>
            )}
          </div>
        )}

        {tab === 'discussions' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <input
                value={discussionsQuery}
                onChange={(e) => setDiscussionsQuery(e.target.value)}
                placeholder="Search discussions..."
                className="flex-1 border px-4 py-2 rounded-lg"
              />
              <button onClick={fetchDiscussions} className="px-4 py-2 bg-primary text-white rounded-lg">
                Search
              </button>
            </div>
            {moderationLoading ? (
              <p>Loading discussions...</p>
            ) : (
              <div className="space-y-3">
                {discussions.map((discussion) => (
                  <div key={discussion._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-800">{discussion.title}</div>
                        <div className="text-sm text-gray-500">
                          Author: {discussion.author?.username || discussion.author?.email || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Status: {discussion.isResolved ? 'Resolved' : 'Open'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded"
                          onClick={() => toggleResolved(discussion._id)}
                        >
                          {discussion.isResolved ? 'Reopen' : 'Resolve'}
                        </button>
                        <button
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded"
                          onClick={() => deleteDiscussion(discussion._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {discussions.length === 0 && <p className="text-gray-500 text-sm">No discussions found.</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

