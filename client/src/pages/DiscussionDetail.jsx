import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axiosConfig';
import DashboardLayout from '../components/DashboardLayout';

export default function DiscussionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/discussions/${id}`);
      setDiscussion(res.data);
    } catch (err) {
      console.error('Error fetching discussion:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      await api.post(`/discussions/${id}/replies`, { content: replyContent });
      setReplyContent('');
      fetchDiscussion();
    } catch (err) {
      console.error('Error posting reply:', err);
    }
  };

  const handleUpvote = async () => {
    try {
      const res = await api.post(`/discussions/${id}/upvote`);
      setDiscussion({ ...discussion, upvoteCount: res.data.upvoteCount, isUpvoted: res.data.isUpvoted });
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const handleReplyUpvote = async (replyId) => {
    try {
      const res = await api.post(`/discussions/${id}/replies/${replyId}/upvote`);
      setDiscussion({
        ...discussion,
        replies: discussion.replies.map(r =>
          r._id === replyId
            ? { ...r, upvotes: res.data.upvoteCount, isUpvoted: res.data.isUpvoted }
            : r
        )
      });
    } catch (err) {
      console.error('Error upvoting reply:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role={user.role}>
        <div className="text-center py-8">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!discussion) {
    return (
      <DashboardLayout role={user.role}>
        <div className="text-center py-8">Discussion not found</div>
      </DashboardLayout>
    );
  }

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
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{discussion.title}</h1>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  {discussion.subject}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{discussion.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>By {discussion.author?.username || 'Unknown'}</span>
                <span>{new Date(discussion.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleUpvote}
              className={`ml-4 px-4 py-2 rounded-lg flex flex-col items-center transition-colors ${
                discussion.isUpvoted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>▲</span>
              <span className="text-xs">{discussion.upvoteCount || 0}</span>
            </button>
          </div>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Replies ({discussion.replies?.length || 0})</h2>
          <div className="space-y-4 mb-6">
            {discussion.replies?.map((reply) => (
              <div key={reply._id} className="border-l-4 border-primary pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span>By {reply.author?.username || 'Unknown'}</span>
                      <span>{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReplyUpvote(reply._id)}
                    className={`ml-4 px-2 py-1 rounded text-sm transition-colors ${
                      reply.isUpvoted ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    ▲ {reply.upvoteCount ?? reply.upvotes?.length ?? 0}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Add a Reply</h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full border rounded-lg p-3 mb-2"
              rows={4}
              placeholder="Write your reply..."
            />
            <button
              onClick={handleReply}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Post Reply
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

