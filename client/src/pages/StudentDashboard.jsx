import React, { useEffect, useState } from 'react'
import api from '../utils/axiosConfig'
import DashboardLayout from '../components/DashboardLayout'
import TaskButton from '../components/TaskButton'
import ProgressCard from '../components/ProgressCard'
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
            <div className="text-sm text-gray-600">Upload PDF or paste text below.</div>
            <input type="file" accept=".pdf,.doc,.docx" className="border rounded p-2 w-full" />
            <textarea className="w-full border rounded p-2" rows={6} placeholder="Or paste your submission here..."></textarea>
            <div className="flex justify-end gap-2">
              <TaskButton variant="ghost" onClick={() => setSubmitOpen(false)}>Cancel</TaskButton>
              <TaskButton onClick={async () => {
                try {
                  await api.patch(`/assignments/${selected?._id}`, { status: 'completed' });
                  alert('Assignment submitted successfully!');
                  setSubmitOpen(false);
                  window.location.reload();
                } catch (e) {
                  alert('Error submitting assignment');
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

