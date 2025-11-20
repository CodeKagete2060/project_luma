import React, { useEffect, useState } from 'react'
import api from '../utils/axiosConfig'
import DashboardLayout from '../components/DashboardLayout'
import TaskButton from '../components/TaskButton'
import ProgressCard from '../components/ProgressCard'
import ProgressChart from '../components/ProgressChart'
import Modal from '../components/Modal'
import LiveSessionModal from '../components/LiveSessionModal'
import AssignmentCard from '../components/AssignmentCard'

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([])
  const [progress, setProgress] = useState({})
  const [selected, setSelected] = useState(null)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [liveOpen, setLiveOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const a = await api.get('/assignments')
        setAssignments(a.data || [])
      } catch (e) {
        console.error('Error fetching assignments:', e)
        setAssignments([])
      }
      try {
        const p = await api.get('/progress')
        setProgress(p.data || {})
      } catch (e) {
        console.error('Error fetching progress:', e)
        setProgress({ completed: 0, pending: 0, score: 0 })
      }
    }
    fetch()
  }, [])

  const openAssignment = (a) => setSelected(a)
  const openSubmit = (a) => { setSelected(a); setSubmitOpen(true) }

  return (
    <DashboardLayout role="student">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Student Dashboard</h1>
          <div className="flex items-center gap-3">
            <TaskButton onClick={() => window.location.href = '/learning/assistant'}>Ask AI Assistant</TaskButton>
            <TaskButton onClick={() => setLiveOpen(true)}>🎥 Go Live</TaskButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ProgressCard title="Completed" value={progress.completed || 0} change="+5%">Tasks finished</ProgressCard>
          <ProgressCard title="Pending" value={progress.pending || 0} change="-2%">Upcoming deadlines</ProgressCard>
          <ProgressCard title="Overall Score" value={progress.score ? `${Math.round(progress.score)}%` : 'N/A'} change="0%">Cumulative score</ProgressCard>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ProgressChart
            title="Score Trends"
            type="line"
            data={[
              { name: 'Week 1', value: 75 },
              { name: 'Week 2', value: 82 },
              { name: 'Week 3', value: 78 },
              { name: 'Week 4', value: progress.score || 85 }
            ]}
          />
          <ProgressChart
            title="Weekly Learning Time"
            type="bar"
            data={[
              { name: 'Mon', value: 45 },
              { name: 'Tue', value: 60 },
              { name: 'Wed', value: 30 },
              { name: 'Thu', value: 75 },
              { name: 'Fri', value: 50 },
              { name: 'Sat', value: 90 },
              { name: 'Sun', value: 40 }
            ]}
          />
        </div>

        <div className="mb-6">
          <ProgressChart
            title="Assignment Completion Timeline"
            type="bar"
            height={250}
            data={assignments.slice(0, 5).map((a, i) => ({
              name: a.title.substring(0, 15) + (a.title.length > 15 ? '...' : ''),
              value: a.status === 'completed' ? 100 : a.status === 'in_progress' ? 50 : 0
            }))}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">My Assignments</h3>
            <TaskButton variant="ghost" onClick={() => window.location.href = '/learning/resources'}>Browse Resources</TaskButton>
          </div>

          <div className="grid gap-4">
            {assignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No assignments yet. Check back soon!</p>
              </div>
            )}
            {assignments.map(a => (
              <AssignmentCard key={a._id || a.id} assignment={a} onView={() => openAssignment(a)} onSubmit={() => openSubmit(a)} />
            ))}
          </div>
        </div>

        <Modal open={!!selected && !submitOpen} title={selected?.title || 'Assignment'} onClose={() => setSelected(null)}>
          <div className="text-sm text-gray-700 whitespace-pre-wrap">{selected?.description || 'No description'}</div>
          {selected?.dueDate && (
            <div className="mt-4 text-sm text-gray-500">
              Due: {new Date(selected.dueDate).toLocaleString()}
            </div>
          )}
        </Modal>

        <Modal open={submitOpen} title="Submit Assignment" onClose={() => setSubmitOpen(false)}>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">Upload a file or paste text below.</div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload File</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                className="border rounded p-2 w-full"
                id="file-upload"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Or Text Submission</label>
              <textarea
                className="w-full border rounded p-2"
                rows={6}
                placeholder="Paste your submission here..."
                id="text-submission"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Spent (minutes)</label>
              <input
                type="number"
                className="border rounded p-2 w-full"
                placeholder="Enter time spent in minutes"
                id="time-spent"
                min="0"
              />
            </div>
            <div className="flex justify-end gap-2">
              <TaskButton variant="ghost" onClick={() => setSubmitOpen(false)}>Cancel</TaskButton>
              <TaskButton onClick={async () => {
                try {
                  const fileInput = document.getElementById('file-upload');
                  const textInput = document.getElementById('text-submission');
                  const timeInput = document.getElementById('time-spent');

                  const formData = new FormData();
                  if (fileInput.files[0]) {
                    formData.append('file', fileInput.files[0]);
                  }
                  if (textInput.value.trim()) {
                    formData.append('submission', textInput.value.trim());
                  }
                  if (timeInput.value) {
                    formData.append('timeSpent', parseInt(timeInput.value));
                  }

                  await api.post(`/assignments/${selected?._id}/submit`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });

                  alert('Assignment submitted successfully!');
                  setSubmitOpen(false);
                  window.location.reload();
                } catch (e) {
                  console.error('Submission error:', e);
                  alert('Error submitting assignment: ' + (e.response?.data?.message || e.message));
                }
              }}>Submit</TaskButton>
            </div>
          </div>
        </Modal>

        <LiveSessionModal open={liveOpen} onClose={() => setLiveOpen(false)} user={JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')} role="student" />
      </div>
    </DashboardLayout>
  )
}

