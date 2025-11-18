import React, { useEffect, useState } from 'react'
import api from '../utils/axiosConfig'
import DashboardLayout from '../components/DashboardLayout'
import ProgressCard from '../components/ProgressCard'
import TaskButton from '../components/TaskButton'
import Modal from '../components/Modal'
import LiveSessionModal from '../components/LiveSessionModal'

export default function TutorDashboard() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [assignOpen, setAssignOpen] = useState(false)
  const [liveOpen, setLiveOpen] = useState(false)
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', studentId: '' })

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/users/tutor/students')
        setStudents(res.data || [])
      } catch (e) {
        console.error('Error fetching students:', e)
        setStudents([])
      }
    }
    fetch()
  }, [])

  const handleCreateAssignment = async () => {
    try {
      await api.post('/assignments', {
        ...newAssignment,
        dueDate: new Date(newAssignment.dueDate).toISOString()
      })
      alert('Assignment created successfully!')
      setAssignOpen(false)
      setNewAssignment({ title: '', description: '', dueDate: '', studentId: '' })
    } catch (e) {
      console.error('Error creating assignment:', e)
      alert('Error creating assignment')
    }
  }

  const avgProgress = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + (s.progress?.averageScore || 0), 0) / students.length)
    : 0

  return (
    <DashboardLayout role="tutor">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Tutor Dashboard</h1>
          <div className="flex items-center gap-3">
            <TaskButton onClick={() => setAssignOpen(true)}>Assign Task</TaskButton>
            <TaskButton onClick={() => setLiveOpen(true)}>Go Live</TaskButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ProgressCard title="Students" value={students.length} change="">Assigned students</ProgressCard>
          <ProgressCard title="Avg Progress" value={avgProgress ? `${avgProgress}%` : '—'} change="0%">Overview</ProgressCard>
          <ProgressCard title="Active Sessions" value="0" change="">Live sessions</ProgressCard>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">My Students</h3>
          <div className="grid gap-4">
            {students.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No students assigned yet. Contact admin to get students assigned to you.</p>
              </div>
            )}
            {students.map(s => (
              <div key={s._id || s.id} className="p-4 border rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="font-medium text-gray-800 text-lg">{s.username || s.name}</div>
                  <div className="text-sm text-gray-500 mt-1">Grade: {s.grade || 'N/A'}</div>
                  <div className="text-sm text-gray-500">Completed: {s.progress?.completed || 0} assignments</div>
                  <div className="text-sm text-gray-500">Average Score: {s.progress?.averageScore ? `${Math.round(s.progress.averageScore)}%` : 'N/A'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <TaskButton variant="ghost" onClick={() => setSelectedStudent(s)}>View Progress</TaskButton>
                  <TaskButton onClick={() => {
                    setNewAssignment({ ...newAssignment, studentId: s._id || s.id })
                    setAssignOpen(true)
                  }}>Assign Task</TaskButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal open={assignOpen} title="Assign Task" onClose={() => {
          setAssignOpen(false)
          setNewAssignment({ title: '', description: '', dueDate: '', studentId: '' })
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                className="w-full border p-2 rounded"
                value={newAssignment.studentId}
                onChange={(e) => setNewAssignment({ ...newAssignment, studentId: e.target.value })}
              >
                <option value="">Select student</option>
                {students.map(s => (
                  <option key={s._id || s.id} value={s._id || s.id}>{s.username || s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                className="w-full border p-2 rounded"
                placeholder="Assignment title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={4}
                placeholder="Assignment details"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="datetime-local"
                className="w-full border p-2 rounded"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <TaskButton variant="ghost" onClick={() => {
                setAssignOpen(false)
                setNewAssignment({ title: '', description: '', dueDate: '', studentId: '' })
              }}>Cancel</TaskButton>
              <TaskButton onClick={handleCreateAssignment} disabled={!newAssignment.title || !newAssignment.description || !newAssignment.studentId || !newAssignment.dueDate}>
                Create Assignment
              </TaskButton>
            </div>
          </div>
        </Modal>

        <Modal open={!!selectedStudent} title={`${selectedStudent?.username || selectedStudent?.name || 'Student'} Progress`} onClose={() => setSelectedStudent(null)}>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Assignments Completed</div>
                  <div className="text-2xl font-bold text-primary">{selectedStudent.progress?.completed || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Average Score</div>
                  <div className="text-2xl font-bold text-primary">{selectedStudent.progress?.averageScore ? `${Math.round(selectedStudent.progress.averageScore)}%` : 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <LiveSessionModal open={liveOpen} onClose={() => setLiveOpen(false)} user={JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')} role="tutor" />
      </div>
    </DashboardLayout>
  )
}
