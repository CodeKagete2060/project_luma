import { useMemo } from 'react';
import { createApiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

export function useApi() {
  const { toast } = useToast();
  const api = useMemo(() => createApiClient(), []);

  const handleApiError = (error) => {
    console.error('API Error:', error);
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  };

  return {
    // Auth endpoints
    auth: {
      login: (credentials) =>
        api.post('/auth/login', credentials).catch(handleApiError),
      register: (userData) =>
        api.post('/auth/register', userData).catch(handleApiError),
      logout: () =>
        api.post('/auth/logout').catch(handleApiError),
      getProfile: () =>
        api.get('/auth/me').catch(handleApiError),
      updateProfile: (data) =>
        api.patch('/auth/profile', data).catch(handleApiError),
      updatePreferences: (preferences) =>
        api.patch('/auth/preferences', preferences).catch(handleApiError),
      changePassword: (data) =>
        api.post('/auth/change-password', data).catch(handleApiError),
      uploadAvatar: (formData) =>
        api.post('/auth/avatar', formData).catch(handleApiError),
    },

    // Resources endpoints
    resources: {
      getAll: () =>
        api.get('/resources').catch(handleApiError),
      getOne: (id) =>
        api.get(`/resources/${id}`).catch(handleApiError),
      create: (data) =>
        api.post('/resources', data).catch(handleApiError),
    },

    // Discussions endpoints
    discussions: {
      getAll: () =>
        api.get('/discussions').catch(handleApiError),
      create: (data) =>
        api.post('/discussions', data).catch(handleApiError),
      reply: (id, data) =>
        api.post(`/discussions/${id}/reply`, data).catch(handleApiError),
      like: (id) =>
        api.post(`/discussions/${id}/like`).catch(handleApiError),
    },

    // Assignments endpoints
    assignments: {
      getAll: () =>
        api.get('/assignments').catch(handleApiError),
      create: (data) =>
        api.post('/assignments', data).catch(handleApiError),
      update: (id, data) =>
        api.patch(`/assignments/${id}`, data).catch(handleApiError),
      getStats: () =>
        api.get('/students/stats').catch(handleApiError),
    },

    // AI Helper endpoints
    ai: {
      chat: (message) =>
        api.post('/ai/chat', { message }).catch(handleApiError),
    },

    // Notifications endpoints
    notifications: {
      getAll: () =>
        api.get('/notifications').catch(handleApiError),
      markAsRead: (id) =>
        api.patch(`/notifications/${id}/read`).catch(handleApiError),
      markAllAsRead: () =>
        api.post('/notifications/read-all').catch(handleApiError),
    },
  };
}