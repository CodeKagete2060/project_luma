import React from 'react';
import NotificationBell from './NotificationBell';
import { Link } from 'react-router-dom';

export default function LearningLayout({ children, title = 'Learning' }) {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="bg-[#2C139E] text-white p-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{title}</h1>
            <nav className="hidden md:flex gap-3">
              <Link to="/learning/resources" className="text-white/90 hover:underline">Resources</Link>
              <Link to="/learning/sessions" className="text-white/90 hover:underline">Sessions</Link>
              <Link to="/learning/assistant" className="text-white/90 hover:underline">Assistant</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell userId={null} />
            <div className="w-8 h-8 bg-white rounded-full text-[#2C139E] flex items-center justify-center font-bold">U</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
