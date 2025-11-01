import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/use-api';

const SESSION_CHECK_INTERVAL = 1000 * 60 * 5; // Check every 5 minutes

export function usePersistentSession() {
  const { user, logout, refreshToken } = useAuth();
  const api = useApi();

  useEffect(() => {
    if (!user) return;

    let sessionCheckInterval;

    const checkSession = async () => {
      try {
        // Verify the current session
        await api.auth.getProfile();
      } catch (error) {
        if (error.status === 401) {
          try {
            // Try to refresh the token
            await refreshToken();
          } catch (refreshError) {
            // If refresh fails, log the user out
            logout();
          }
        }
      }
    };

    // Initial check
    checkSession();

    // Set up periodic checks
    sessionCheckInterval = setInterval(checkSession, SESSION_CHECK_INTERVAL);

    // Add event listeners for visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up
    return () => {
      clearInterval(sessionCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, logout, refreshToken, api.auth]);
}