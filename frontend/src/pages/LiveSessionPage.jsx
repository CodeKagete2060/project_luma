import React from 'react';
import { useParams } from 'react-router-dom';
import LiveSession from '../components/LiveSession';

const LiveSessionPage = () => {
  const { sessionId } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  const handleSessionEnd = (sessionData) => {
    // Redirect back to dashboard
    const dashboardPath = user.role === 'Parent' ? '/parent-dashboard' : '/student-dashboard';
    window.location.href = dashboardPath;
  };

  return (
    <LiveSession
      sessionId={sessionId}
      user={user}
      onEndSession={handleSessionEnd}
    />
  );
};

export default LiveSessionPage;