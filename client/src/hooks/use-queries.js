import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { useAuth } from '@/contexts/AuthContext';

// Query keys
export const queryKeys = {
  profile: ['profile'],
  resources: ['resources'],
  discussions: ['discussions'],
  assignments: ['assignments'],
  notifications: ['notifications'],
  students: (id) => ['students', id],
  resourceDetails: (id) => ['resources', id],
  discussionDetails: (id) => ['discussions', id],
  assignmentDetails: (id) => ['assignments', id],
};

// Custom hooks for data fetching with caching
export function useProfile() {
  const api = useApi();
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => api.auth.getProfile(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}

export function useResources() {
  const api = useApi();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.resources,
    queryFn: () => api.resources.getAll(),
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.resources.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources });
    },
  });

  return {
    ...query,
    createResource: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}

export function useDiscussions() {
  const api = useApi();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.discussions,
    queryFn: () => api.discussions.getAll(),
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.discussions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discussions });
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, data }) => api.discussions.reply(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discussionDetails(id) });
    },
  });

  return {
    ...query,
    createDiscussion: createMutation.mutate,
    replyToDiscussion: replyMutation.mutate,
    isCreating: createMutation.isPending,
    isReplying: replyMutation.isPending,
  };
}

export function useAssignments() {
  const api = useApi();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.assignments,
    queryFn: () => api.assignments.getAll(),
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.assignments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.assignments.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignmentDetails(id) });
    },
  });

  return {
    ...query,
    createAssignment: createMutation.mutate,
    updateAssignment: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}

export function useNotifications() {
  const api = useApi();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => api.notifications.getAll(),
    staleTime: 1000 * 30, // Consider data fresh for 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => api.notifications.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.notifications.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  return {
    ...query,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarking: markAsReadMutation.isPending || markAllAsReadMutation.isPending,
  };
}

// Compatibility wrapper used by some components that expect a single
// `useQueries` factory returning hooks (older code style). Expose
// functions as methods to avoid changing many imports across the codebase.
export function useQueries() {
  return {
    useProfile: () => useProfile(),
    useResources: () => useResources(),
    useDiscussions: () => useDiscussions(),
    useAssignments: () => useAssignments(),
    useNotifications: () => useNotifications(),
  };
}