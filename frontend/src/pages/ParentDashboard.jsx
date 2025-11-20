import React, { useEffect, useState } from 'react'
import api from '../utils/axiosConfig'
import DashboardLayout from '../components/DashboardLayout'
import ProgressCard from '../components/ProgressCard'
import TaskButton from '../components/TaskButton'
import Modal from '../components/Modal'
import NotificationPanel from '../components/NotificationPanel'
import StartLiveSessionModal from '../components/StartLiveSessionModal'
import ProgressChart from '../components/ProgressChart'

export default function ParentDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')
  const [children, setChildren] = useState([])
  const [notifications, setNotifications] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState(null)
  const [liveOpen, setLiveOpen] = useState(false)
  const [childProgress, setChildProgress] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/users/children')
        setChildren(res.data || [])
      } catch (e) {
        console.error('Error fetching children:', e)
        setChildren([])
      }
      try {
        const n = await api.get(`/notifications/${user.id || user._id}`)
        setNotifications(n.data || [])
      } catch (e) {
        console.error('Error fetching notifications:', e)
        setNotifications([])
      }
    }
    fetch()
  }, [user.id, user._id])

  const fetchChildProgress = async (childId) => {
    try {
      const res = await api.get(`/progress/${childId}`)
      setChildProgress(res.data)
    } catch (e) {
      console.error('Error fetching child progress:', e)
    }
  }

  const avgProgress = children.length > 0
    ? Math.round(children.reduce((sum, c) => sum + (c.progress?.averageScore || 0), 0) / children.length)
    : 0

  return (
    <DashboardLayout role="parent">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Parent Dashboard</h1>
          <div className="flex items-center gap-3">
            <TaskButton onClick={() => setLiveOpen(true)}>Start Live Session</TaskButton>
            <TaskButton onClick={() => setNotifOpen(true)}>Notifications ({notifications.filter(n => !n.read).length})</TaskButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ProgressCard title="Children" value={children.length} change="">Managed accounts</ProgressCard>
          <ProgressCard title="Unread Notifications" value={notifications.filter(n => !n.read).length} change="">Recent notices</ProgressCard>
          <ProgressCard title="Average Score" value={avgProgress ? `${avgProgress}%` : '—'} change="0%">Avg progress</ProgressCard>
        </div>

        {/* Comparison Charts */}
        {children.length > 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ProgressChart
              title="Children Performance Comparison"
              type="bar"
              data={children.map(child => ({
                name: child.username || child.name || 'Child',
                value: child.progress?.averageScore || 0
              }))}
            />
            <ProgressChart
              title="Assignments Completed by Child"
              type="bar"
              data={children.map(child => ({
                name: child.username || child.name || 'Child',
                value: child.progress?.completed || 0
              }))}
            />
          </div>
        )}

        {children.length > 0 && (
          <div className="mb-6">
            <ProgressChart
              title="Overall Family Progress Distribution"
              type="pie"
              data={[
                { name: 'Excellent (90-100%)', value: children.filter(c => (c.progress?.averageScore || 0) >= 90).length },
                { name: 'Good (80-89%)', value: children.filter(c => (c.progress?.averageScore || 0) >= 80 && (c.progress?.averageScore || 0) < 90).length },
                { name: 'Average (70-79%)', value: children.filter(c => (c.progress?.averageScore || 0) >= 70 && (c.progress?.averageScore || 0) < 80).length },
                { name: 'Needs Improvement (<70%)', value: children.filter(c => (c.progress?.averageScore || 0) < 70).length }
              ].filter(item => item.value > 0)}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">My Children</h3>
          <div className="grid gap-4">
            {children.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No children linked yet. Contact support to link your child's account.</p>
              </div>
            )}
            {children.map(c => (
              <div key={c._id || c.id} className="p-4 border rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="font-medium text-gray-800 text-lg">{c.username || c.name}</div>
                  <div className="text-sm text-gray-500 mt-1">Grade: {c.grade || 'N/A'}</div>
                  <div className="text-sm text-gray-500">Completed: {c.progress?.completed || 0} assignments</div>
                  <div className="text-sm text-gray-500">Average Score: {c.progress?.averageScore ? `${Math.round(c.progress.averageScore)}%` : 'N/A'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <TaskButton variant="ghost" onClick={() => {
                    setSelectedChild(c)
                    fetchChildProgress(c._id || c.id)
                  }}>View Progress</TaskButton>
                  <TaskButton variant="outline" onClick={() => {
                    window.open(`/api/progress/${c._id || c.id}/report?format=pdf`, '_blank');
                  }}>Download Report</TaskButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {notifOpen && (
          <div className="fixed right-6 top-20 z-50">
            <NotificationPanel notifications={notifications} onClose={() => setNotifOpen(false)} />
          </div>
        )}

        <Modal open={!!selectedChild} title={`${selectedChild?.username || selectedChild?.name || 'Child'} Progress`} onClose={() => {
          setSelectedChild(null)
          setChildProgress(null)
        }}>
          {childProgress ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Assignments Completed</div>
                  <div className="text-2xl font-bold text-primary">{childProgress.metrics?.assignmentsCompleted || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Average Score</div>
                  <div className="text-2xl font-bold text-primary">{childProgress.metrics?.averageScore ? `${Math.round(childProgress.metrics.averageScore)}%` : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Time Spent</div>
                  <div className="text-2xl font-bold text-primary">{childProgress.metrics?.totalTimeSpent || 0} min</div>
                </div>
              </div>
              {childProgress.milestones && childProgress.milestones.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Recent Milestones</div>
                  <div className="space-y-2">
                    {childProgress.milestones.slice(-5).map((m, i) => (
                      <div key={i} className="p-2 bg-light rounded">
                        <div className="font-medium">{m.title}</div>
                        <div className="text-sm text-gray-500">{new Date(m.achievedAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">Loading progress data...</div>
          )}
        </Modal>

        <StartLiveSessionModal
          isOpen={liveOpen}
          onClose={() => setLiveOpen(false)}
          children={children}
          user={user}
        />
      </div>
    </DashboardLayout>
  )
}

