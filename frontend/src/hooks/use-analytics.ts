import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useAnalytics(userId) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await axios.get(`/api/analytics/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  return {
    performance: data?.performance || {},
    activity: data?.activity || {},
    subjectBreakdown: data?.subjectBreakdown || {},
    streak: data?.streak || {},
    aiStats: data?.aiStats || {},
    recentAssignments: data?.recentAssignments || {},
    isLoading,
    error,
  };
}