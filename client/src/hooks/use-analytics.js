import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAnalytics(studentId) {
  // Get performance data
  const {
    data: performance,
    isLoading: isLoadingPerformance
  } = useQuery({
    queryKey: ['analytics', 'performance', studentId],
    queryFn: async () => {
      const response = await api.get(`/analytics/performance/${studentId}`);
      return response.data;
    },
    enabled: !!studentId
  });

  // Get activity data
  const {
    data: activity,
    isLoading: isLoadingActivity
  } = useQuery({
    queryKey: ['analytics', 'activity', studentId],
    queryFn: async () => {
      const response = await api.get(`/analytics/activity/${studentId}`);
      return response.data;
    },
    enabled: !!studentId
  });

  // Get subject breakdown
  const {
    data: subjectBreakdown,
    isLoading: isLoadingSubjects
  } = useQuery({
    queryKey: ['analytics', 'subjects', studentId],
    queryFn: async () => {
      const response = await api.get(`/analytics/subjects/${studentId}`);
      return response.data;
    },
    enabled: !!studentId
  });

  // Get learning streak
  const {
    data: streak,
    isLoading: isLoadingStreak
  } = useQuery({
    queryKey: ['analytics', 'streak', studentId],
    queryFn: async () => {
      const response = await api.get(`/analytics/streak/${studentId}`);
      return response.data;
    },
    enabled: !!studentId
  });

  // Get AI usage stats
  const {
    data: aiStats,
    isLoading: isLoadingAI
  } = useQuery({
    queryKey: ['analytics', 'ai', studentId],
    queryFn: async () => {
      const response = await api.get(`/analytics/ai-usage/${studentId}`);
      return response.data;
    },
    enabled: !!studentId
  });

  // Get recent assignments
  const {
    data: recentAssignments,
    isLoading: isLoadingAssignments
  } = useQuery({
    queryKey: ['analytics', 'assignments', studentId],
    queryFn: async () => {
      const response = await api.get(`/analytics/recent-assignments/${studentId}`);
      return response.data;
    },
    enabled: !!studentId
  });

  return {
    performance,
    activity,
    subjectBreakdown,
    streak,
    aiStats,
    recentAssignments,
    isLoading: 
      isLoadingPerformance ||
      isLoadingActivity ||
      isLoadingSubjects ||
      isLoadingStreak ||
      isLoadingAI ||
      isLoadingAssignments
  };
}

export function useClassAnalytics(classId) {
  // Get class performance overview
  const {
    data: classPerformance,
    isLoading: isLoadingPerformance
  } = useQuery({
    queryKey: ['analytics', 'class', 'performance', classId],
    queryFn: async () => {
      const response = await api.get(`/analytics/class/${classId}/performance`);
      return response.data;
    },
    enabled: !!classId
  });

  // Get student rankings
  const {
    data: rankings,
    isLoading: isLoadingRankings
  } = useQuery({
    queryKey: ['analytics', 'class', 'rankings', classId],
    queryFn: async () => {
      const response = await api.get(`/analytics/class/${classId}/rankings`);
      return response.data;
    },
    enabled: !!classId
  });

  // Get subject performance breakdown
  const {
    data: subjectBreakdown,
    isLoading: isLoadingSubjects
  } = useQuery({
    queryKey: ['analytics', 'class', 'subjects', classId],
    queryFn: async () => {
      const response = await api.get(`/analytics/class/${classId}/subjects`);
      return response.data;
    },
    enabled: !!classId
  });

  // Get class activity summary
  const {
    data: activitySummary,
    isLoading: isLoadingActivity
  } = useQuery({
    queryKey: ['analytics', 'class', 'activity', classId],
    queryFn: async () => {
      const response = await api.get(`/analytics/class/${classId}/activity`);
      return response.data;
    },
    enabled: !!classId
  });

  return {
    classPerformance,
    rankings,
    subjectBreakdown,
    activitySummary,
    isLoading:
      isLoadingPerformance ||
      isLoadingRankings ||
      isLoadingSubjects ||
      isLoadingActivity
  };
}