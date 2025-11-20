import React from 'react'

export default function ProgressCard({ title, value, change, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:scale-102 transition-transform duration-150">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
        </div>
        <div className="text-sm text-gray-500">{change}</div>
      </div>
      {children && <div className="mt-3 text-sm text-gray-600">{children}</div>}
    </div>
  )
}
