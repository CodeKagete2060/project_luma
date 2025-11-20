import React from 'react'

export default function TaskButton({ children, variant = 'primary', onClick, className = '', ...props }) {
  const base = 'px-4 py-2 rounded transition-all duration-150 focus:outline-none inline-flex items-center gap-2'
  const variants = {
    primary: 'bg-[#2C139E] text-white hover:scale-105',
    ghost: 'bg-white border text-[#2C139E] hover:bg-gray-50',
    neutral: 'bg-[#6B7280] text-white hover:opacity-90'
  }
  return (
    <button onClick={onClick} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
