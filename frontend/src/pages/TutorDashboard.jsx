import React, { useEffect, useState } from 'react'
import api from '../utils/axiosConfig'
import DashboardLayout from '../components/DashboardLayout'
import ProgressCard from '../components/ProgressCard'
import TaskButton from '../components/TaskButton'
import Modal from '../components/Modal'
import LiveSessionModal from '../components/LiveSessionModal'
import UploadResourceForm from '../components/UploadResourceForm'

export default function TutorDashboard() {
   const [students, setStudents] = useState([])
   const [assignments, setAssignments] = useState([])
   const [resources, setResources] = useState([])
   const [selectedStudent, setSelectedStudent] = useState(null)
   const [selectedAssignment, setSelectedAssignment] = useState(null)
   const [assignOpen, setAssignOpen] = useState(false)
   const [gradeOpen, setGradeOpen] = useState(false)
   const [scheduleOpen, setScheduleOpen] = useState(false)
   const [liveOpen, setLiveOpen] = useState(false)
   const [uploadOpen, setUploadOpen] = useState(false)
   const [activeTab, setActiveTab] = useState('students')
   const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', studentId: '' })
   const [gradeData, setGradeData] = useState({ score: '', feedback: '' })
   const [newSession, setNewSession] = useState({ title: '', description: '', studentId: '', scheduledAt: '', duration: 60 })

  useEffect(() => {
    const fetch = async () => {
      try {
        const [studentsRes, assignmentsRes, resourcesRes] = await Promise.all([
          api.get('/users/tutor/students'),
          api.get('/assignments'),
          api.get('/learning/resources/my-uploads')
        ])
        setStudents(studentsRes.data || [])
        setAssignments(assignmentsRes.data || [])
        setResources(resourcesRes.data || [])
      } catch (e) {
        console.error('Error fetching data:', e)
        setStudents([])
        setAssignments([])
        setResources([])
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

  const handleResourceUpload = async (newResource) => {
    setResources(prev => [newResource, ...prev])
    alert('Resource uploaded successfully! It will be reviewed by an admin before being published.')
  }

  const refreshResources = async () => {
    try {
      const res = await api.get('/learning/resources/my-uploads')
      setResources(res.data || [])
    } catch (e) {
      console.error('Error refreshing resources:', e)
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
            <TaskButton onClick={() => setScheduleOpen(true)}>Schedule Session</TaskButton>
            <TaskButton onClick={() => setLiveOpen(true)}>Go Live</TaskButton>
            <TaskButton onClick={() => setUploadOpen(true)}>Upload Resource</TaskButton>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 font-medium ${activeTab === 'students' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Students
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 font-medium ${activeTab === 'assignments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 font-medium ${activeTab === 'resources' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Resources
          </button>
        </div>

        {activeTab === 'students' && (
          <>
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
          </>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Assignments to Grade</h3>
            <div className="grid gap-4">
              {assignments.filter(a => a.status === 'completed' && !a.score).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No assignments to grade.</p>
                </div>
              )}
              {assignments.filter(a => a.status === 'completed' && !a.score).map(a => (
                <div key={a._id} className="p-4 border rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="font-medium text-gray-800">{a.title}</div>
                    <div className="text-sm text-gray-500">Student: {a.student?.username || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">Submitted: {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : 'N/A'}</div>
                    {a.submission && <div className="text-sm text-gray-600 mt-1">Has text submission</div>}
                    {a.submissionFile && <div className="text-sm text-blue-600 mt-1">Has file submission</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <TaskButton variant="ghost" onClick={() => setSelectedAssignment(a)}>View Submission</TaskButton>
                    <TaskButton onClick={() => {
                      setSelectedAssignment(a)
                      setGradeData({ score: '', feedback: '' })
                      setGradeOpen(true)
                    }}>Grade</TaskButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">My Resources</h3>
              <TaskButton onClick={() => setUploadOpen(true)}>Upload New Resource</TaskButton>
            </div>
            <div className="grid gap-4">
              {resources.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No resources uploaded yet. Click "Upload New Resource" to get started.</p>
                </div>
              )}
              {resources.map(r => (
                <div key={r._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-lg">{r.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{r.description}</div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Subject: {r.subject}</span>
                        <span>Grade: {r.gradeLevel}</span>
                        <span>Type: {r.resourceType}</span>
                        <span>Views: {r.views || 0}</span>
                        <span>Downloads: {r.downloadCount || 0}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Uploaded: {new Date(r.uploadDate).toLocaleDateString()}
                      </div>
                      {r.tags && r.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {r.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        r.status === 'approved' ? 'bg-green-100 text-green-800' :
                        r.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {r.status}
                      </span>
                      {r.status === 'pending' && (
                        <TaskButton variant="ghost" size="sm">Edit</TaskButton>
                      )}
                      <TaskButton variant="ghost" size="sm" onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this resource?')) {
                          try {
                            await api.delete(`/learning/resources/${r._id}`)
                            refreshResources()
                            alert('Resource deleted successfully')
                          } catch (e) {
                            console.error('Error deleting resource:', e)
                            alert('Error deleting resource')
                          }
                        }
                      }}>Delete</TaskButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Assignment Submission Viewer */}
        <Modal open={!!selectedAssignment && !gradeOpen} title="Assignment Submission" onClose={() => setSelectedAssignment(null)}>
          {selectedAssignment && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{selectedAssignment.title}</h4>
                <p className="text-sm text-gray-600">Student: {selectedAssignment.student?.username || 'Unknown'}</p>
                <p className="text-sm text-gray-600">Submitted: {selectedAssignment.completedAt ? new Date(selectedAssignment.completedAt).toLocaleString() : 'N/A'}</p>
              </div>

              {selectedAssignment.submission && (
                <div>
                  <h5 className="font-medium mb-2">Text Submission:</h5>
                  <div className="bg-gray-50 p-3 rounded border max-h-60 overflow-y-auto">
                    {selectedAssignment.submission}
                  </div>
                </div>
              )}

              {selectedAssignment.submissionFile && (
                <div>
                  <h5 className="font-medium mb-2">File Submission:</h5>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{selectedAssignment.submissionFile.originalName}</span>
                    <a
                      href={`/uploads/submissions/${selectedAssignment.submissionFile.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Download File
                    </a>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <TaskButton variant="ghost" onClick={() => setSelectedAssignment(null)}>Close</TaskButton>
                <TaskButton onClick={() => {
                  setGradeData({ score: '', feedback: '' })
                  setGradeOpen(true)
                }}>Grade Assignment</TaskButton>
              </div>
            </div>
          )}
        </Modal>

        {/* Grading Modal */}
        <Modal open={gradeOpen} title="Grade Assignment" onClose={() => setGradeOpen(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full border p-2 rounded"
                value={gradeData.score}
                onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                placeholder="Enter score"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Feedback</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={4}
                value={gradeData.feedback}
                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                placeholder="Provide feedback for the student"
              />
            </div>
            <div className="flex justify-end gap-2">
              <TaskButton variant="ghost" onClick={() => setGradeOpen(false)}>Cancel</TaskButton>
              <TaskButton onClick={async () => {
                try {
                  await api.patch(`/assignments/${selectedAssignment._id}/grade`, {
                    score: parseInt(gradeData.score),
                    feedback: gradeData.feedback
                  });
                  alert('Assignment graded successfully!');
                  setGradeOpen(false);
                  setSelectedAssignment(null);
                  // Refresh assignments
                  const res = await api.get('/assignments');
                  setAssignments(res.data || []);
                } catch (e) {
                  console.error('Error grading assignment:', e);
                  alert('Error grading assignment');
                }
              }} disabled={!gradeData.score || gradeData.score < 0 || gradeData.score > 100}>
                Submit Grade
              </TaskButton>
            </div>
          </div>
        </Modal>

        {/* Session Scheduling Modal */}
        <Modal open={scheduleOpen} title="Schedule Tutoring Session" onClose={() => {
          setScheduleOpen(false)
          setNewSession({ title: '', description: '', studentId: '', scheduledAt: '', duration: 60 })
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                className="w-full border p-2 rounded"
                value={newSession.studentId}
                onChange={(e) => setNewSession({ ...newSession, studentId: e.target.value })}
              >
                <option value="">Select student</option>
                {students.map(s => (
                  <option key={s._id || s.id} value={s._id || s.id}>{s.username || s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Session Title</label>
              <input
                className="w-full border p-2 rounded"
                placeholder="e.g., Math Review Session"
                value={newSession.title}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={3}
                placeholder="Session details and topics to cover"
                value={newSession.description}
                onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border p-2 rounded"
                  value={newSession.scheduledAt}
                  onChange={(e) => setNewSession({ ...newSession, scheduledAt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  className="w-full border p-2 rounded"
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) || 60 })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <TaskButton variant="ghost" onClick={() => {
                setScheduleOpen(false)
                setNewSession({ title: '', description: '', studentId: '', scheduledAt: '', duration: 60 })
              }}>Cancel</TaskButton>
              <TaskButton onClick={async () => {
                try {
                  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
                  await api.post('/sessions/create', {
                    ...newSession,
                    tutorId: user.id || user._id,
                    scheduledAt: newSession.scheduledAt ? new Date(newSession.scheduledAt).toISOString() : null
                  });
                  alert('Session scheduled successfully!');
                  setScheduleOpen(false);
                  setNewSession({ title: '', description: '', studentId: '', scheduledAt: '', duration: 60 });
                } catch (e) {
                  console.error('Error scheduling session:', e);
                  alert('Error scheduling session');
                }
              }} disabled={!newSession.title || !newSession.studentId || !newSession.scheduledAt}>
                Schedule Session
              </TaskButton>
            </div>
          </div>
        </Modal>

        <LiveSessionModal open={liveOpen} onClose={() => setLiveOpen(false)} user={JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')} role="tutor" />

        {/* Upload Resource Modal */}
        <Modal open={uploadOpen} title="Upload Resource" onClose={() => setUploadOpen(false)} maxWidth="4xl">
          <UploadResourceForm onSuccess={handleResourceUpload} onClose={() => setUploadOpen(false)} />
        </Modal>
      </div>
    </DashboardLayout>
  )
}
