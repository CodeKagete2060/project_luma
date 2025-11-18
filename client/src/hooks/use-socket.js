import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { socketManager, useSocketStore } from '@/lib/socketManager';
import { useToast } from './use-toast';

export function useSocket() {
  const { user } = useAuth();
  const { toast } = useToast();
  const connected = useSocketStore((state) => state.connected);
  const error = useSocketStore((state) => state.error);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      socketManager.connect(token);
    }

    return () => {
      socketManager.disconnect();
    };
  }, [user]);

  // Handle connection error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Connection Error',
        description: 'Lost connection to server. Please check your internet connection.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Emit wrapper with connection check
  const emit = useCallback((event, data) => {
    if (!connected) {
      console.warn('Socket not connected. Event not emitted:', event);
      return false;
    }
    socketManager.emit(event, data);
    return true;
  }, [connected]);

  // Subscribe to events
  const subscribe = useCallback((event, callback) => {
    socketManager.on(event, callback);
    return () => socketManager.off(event, callback);
  }, []);

  return {
    connected,
    error,
    emit,
    subscribe
  };
}