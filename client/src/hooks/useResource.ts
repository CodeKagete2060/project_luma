import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Resource {
  _id: string;
  title: string;
  description: string;
  subject: string;
  type: 'video' | 'document' | 'quiz' | 'interactive';
  url: string;
  thumbnailUrl?: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  likedBy: string[];
  views: number;
  ratings: Array<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    rating: number;
    review?: string;
    createdAt: string;
  }>;
  averageRating: number;
  learningOutcomes?: string[];
  prerequisites?: string[];
}

export function useResource(resourceId: string) {
  const queryClient = useQueryClient();

  const resourceQuery = useQuery<Resource | null>({
    queryKey: ['resource', resourceId],
    queryFn: async () => {
      if (!resourceId) return null;
      const { data } = await axios.get<Resource>(`/api/resources/${resourceId}`);
      return data;
    },
    enabled: !!resourceId,
    staleTime: 1000 * 60 * 2,
  });

  const toggleLikeMutation = useMutation<Resource, Error>({
    mutationFn: async () => {
      const { data } = await axios.post<Resource>(`/api/resources/${resourceId}/toggle-like`);
      return data;
    },
    onSuccess: (updatedResource) => {
      queryClient.setQueryData(['resource', resourceId], updatedResource);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });

  const addRatingMutation = useMutation<Resource, Error, { rating: number; review?: string }>({
    mutationFn: async (payload) => {
      const { data } = await axios.post<Resource>(`/api/resources/${resourceId}/rate`, payload);
      return data;
    },
    onSuccess: (updatedResource) => {
      queryClient.setQueryData(['resource', resourceId], updatedResource);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });

  const incrementViewMutation = useMutation<Resource, Error>({
    mutationFn: async () => {
      const { data } = await axios.post<Resource>(`/api/resources/${resourceId}/increment-view`);
      return data;
    },
    onSuccess: (updatedResource) => {
      queryClient.setQueryData(['resource', resourceId], updatedResource);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });

  return {
    resource: resourceQuery.data,
    isLoading: resourceQuery.isLoading,
    error: resourceQuery.error,
    toggleLike: toggleLikeMutation.mutate,
    toggleLikeStatus: toggleLikeMutation,
    addRating: addRatingMutation.mutate,
    addRatingStatus: addRatingMutation,
    incrementView: incrementViewMutation.mutate,
  };
}
