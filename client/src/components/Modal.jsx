import React from 'react'

export default function Modal({ open, title, onClose, children, size = 'md' }) {
  if (!open) return null
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-3xl',
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className={`relative bg-white rounded shadow p-4 w-full ${sizes[size]}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
