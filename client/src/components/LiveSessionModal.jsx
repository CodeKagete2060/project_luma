import React, { useState, useEffect } from 'react'
import api from '../utils/axiosConfig'
import TaskButton from './TaskButton'

// Simple live session modal: POST /api/live to create session, display link. If socket.io is available, connection can be added later.
export default function LiveSessionModal({ open, onClose, user, role }) {
  const [creating, setCreating] = useState(false)
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) {
      setSession(null)
      setError(null)
    }
  }, [open])

  const startLive = async (mode = 'video') => {
    setCreating(true)
    setError(null)
    try {
      // try backend endpoint
      const res = await api.post('/live', { hostId: user?.id || user?._id, role, mode })
      setSession(res.data.session || res.data)
    } catch (err) {
      // fallback: create a mock session locally
      const mock = { id: `mock-${Date.now()}`, hostId: user?.id || user?._id, mode, link: `${window.location.origin}/join/${encodeURIComponent(`mock-${Date.now()}`)}`, status: 'waiting' }
      setSession(mock)
    } finally {
      setCreating(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="relative bg-white rounded shadow p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Go Live</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {!session && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">Start a live session. Choose mode and click start.</div>
            <div className="flex gap-2">
              <TaskButton onClick={() => startLive('video')}>🎥 Start Video</TaskButton>
              <TaskButton variant="ghost" onClick={() => startLive('audio')}>🎧 Start Audio</TaskButton>
              <TaskButton variant="neutral" onClick={() => startLive('chat')}>💬 Start Chat</TaskButton>
            </div>
          </div>
        )}

        {session && (
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">Session created</div>
            <div className="bg-gray-50 p-3 rounded break-words">{session.link || `${window.location.origin}/join/${session.id}`}</div>
            <div className="mt-3 flex gap-2">
              <TaskButton onClick={() => { navigator.clipboard?.writeText(session.link || `${window.location.origin}/join/${session.id}`) }}>Copy Link</TaskButton>
              <TaskButton variant="ghost" onClick={() => window.open(session.link || `${window.location.origin}/join/${session.id}`, '_blank')}>Open</TaskButton>
              <TaskButton variant="neutral" onClick={onClose}>Done</TaskButton>
            </div>
          </div>
        )}

        {error && <div className="mt-3 text-sm text-red-600">{String(error)}</div>}
      </div>
    </div>
  )
}
