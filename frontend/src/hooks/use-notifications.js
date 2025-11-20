import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from './use-socket';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export function useNotifications() {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { user } = useAuth();

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    error
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data;
    },
    enabled: !!user
  });

  // Get unread count
  const {
    data: unreadCount = 0,
    isLoading: isLoadingCount
  } = useQuery({
    queryKey: ['notifications', 'unread', 'count'],
    queryFn: async () => {
      const response = await api.get('/notifications/unread/count');
      return response.data.count;
    },
    enabled: !!user
  });

  // Mark as read mutation
  const markAsRead = useMutation({
    mutationFn: async (id) => {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications', 'unread', 'count']);
    }
  });

  // Mark all as read mutation
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const response = await api.patch('/notifications/read/all');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications', 'unread', 'count']);
    }
  });

  // Delete notification mutation
  const deleteNotification = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications', 'unread', 'count']);
    }
  });

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket.connected || !user) return;

    const handleNewNotification = (notification) => {
      // Add the new notification to the cache
      queryClient.setQueryData(['notifications'], (old) => {
        if (!old) return { notifications: [notification] };
        return {
          ...old,
          notifications: [notification, ...old.notifications]
        };
      });

      // Update unread count
      queryClient.setQueryData(['notifications', 'unread', 'count'], (old) => (old || 0) + 1);

      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png'
        });
      }
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket.connected, user]);

  // Request notification permissions if not already granted
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    notifications: notifications?.notifications || [],
    unreadCount,
    isLoading: isLoading || isLoadingCount,
    error,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteNotification: deleteNotification.mutate
  };
}