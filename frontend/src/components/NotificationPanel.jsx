import React from 'react'

export default function NotificationPanel({ notifications = [], onClose }) {
  return (
    <div className="w-96 bg-white shadow rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Notifications</h4>
        <button className="text-sm text-gray-500" onClick={onClose}>Close</button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 && <div className="text-gray-500 text-sm">No notifications</div>}
        {notifications.map((n, i) => (
          <div key={i} className="border-b py-2 text-sm">
            <div className="font-medium text-gray-800">{n.title}</div>
            <div className="text-gray-500">{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
