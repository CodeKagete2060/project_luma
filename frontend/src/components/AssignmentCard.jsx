import { useState } from 'react';

export default function AssignmentCard({ 
  assignment,
  onStatusChange,
  onFeedbackSubmit,
  isStudent = false,
  isTutor = false
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState(assignment.feedback || '');
  const [loading, setLoading] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await onStatusChange(assignment._id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
    setLoading(false);
  };

  const handleFeedbackSubmit = async () => {
    setLoading(true);
    try {
      await onFeedbackSubmit(assignment._id, feedback);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{assignment.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[assignment.status]}`}>
          {assignment.status.replace('_', ' ')}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Due: {new Date(assignment.dueDate).toLocaleDateString()}
        </div>

        {assignment.score !== undefined && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Score: {assignment.score}/100
          </div>
        )}

        {assignment.timeSpent > 0 && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time spent: {Math.round(assignment.timeSpent / 60)} hours
          </div>
        )}
      </div>

      {/* Feedback section */}
      {(assignment.feedback || isTutor) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
          
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
                placeholder="Enter feedback..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Feedback'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm">{assignment.feedback || 'No feedback yet'}</p>
              {isTutor && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 text-sm text-primary hover:text-opacity-80"
                >
                  {assignment.feedback ? 'Edit Feedback' : 'Add Feedback'}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Action buttons */}
      {(isStudent || isTutor) && !isEditing && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
          {isStudent && assignment.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 text-sm"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Mark as Completed'}
            </button>
          )}
          
          {isTutor && (
            <>
              <button
                onClick={() => handleStatusChange('in_progress')}
                className="px-4 py-2 bg-[#2C139E]/10 text-[#2C139E] rounded-lg hover:bg-[#2C139E]/20 text-sm"
                disabled={loading || assignment.status === 'in_progress'}
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm"
                disabled={loading || assignment.status === 'completed'}
              >
                Mark Completed
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}