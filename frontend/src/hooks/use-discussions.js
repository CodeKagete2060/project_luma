import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useDiscussions() {
  const queryClient = useQueryClient();

  // Fetch all discussions
  const {
    data: discussions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['discussions'],
    queryFn: async () => {
      const response = await api.get('/discussions');
      return response.data;
    }
  });

  // Create discussion mutation
  const createDiscussion = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/discussions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions']);
    }
  });

  // Upvote discussion mutation
  const upvoteDiscussion = useMutation({
    mutationFn: async (discussionId) => {
      const response = await api.post(`/discussions/${discussionId}/upvote`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions']);
    }
  });

  // Flag discussion mutation
  const flagDiscussion = useMutation({
    mutationFn: async (discussionId) => {
      const response = await api.post(`/discussions/${discussionId}/flag`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions']);
    }
  });

  return {
    discussions,
    isLoading,
    error,
    createDiscussion,
    upvoteDiscussion,
    flagDiscussion
  };
}

export function useDiscussion(discussionId) {
  const queryClient = useQueryClient();

  // Fetch single discussion
  const {
    data: discussion,
    isLoading,
    error
  } = useQuery({
    queryKey: ['discussions', discussionId],
    queryFn: async () => {
      const response = await api.get(`/discussions/${discussionId}`);
      return response.data;
    },
    enabled: !!discussionId
  });

  // Add reply mutation
  const addReply = useMutation({
    mutationFn: async ({ discussionId, content }) => {
      const response = await api.post(`/discussions/${discussionId}/replies`, {
        content
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions', discussionId]);
    }
  });

  // Upvote discussion mutation
  const upvoteDiscussion = useMutation({
    mutationFn: async (discussionId) => {
      const response = await api.post(`/discussions/${discussionId}/upvote`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions', discussionId]);
    }
  });

  // Upvote reply mutation
  const upvoteReply = useMutation({
    mutationFn: async ({ discussionId, replyId }) => {
      const response = await api.post(
        `/discussions/${discussionId}/replies/${replyId}/upvote`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions', discussionId]);
    }
  });

  // Flag discussion mutation
  const flagDiscussion = useMutation({
    mutationFn: async (discussionId) => {
      const response = await api.post(`/discussions/${discussionId}/flag`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions', discussionId]);
    }
  });

  // Flag reply mutation
  const flagReply = useMutation({
    mutationFn: async ({ discussionId, replyId }) => {
      const response = await api.post(
        `/discussions/${discussionId}/replies/${replyId}/flag`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions', discussionId]);
    }
  });

  // Mark as answer mutation
  const markAsAnswer = useMutation({
    mutationFn: async ({ discussionId, replyId }) => {
      const response = await api.post(
        `/discussions/${discussionId}/replies/${replyId}/mark-answer`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions', discussionId]);
    }
  });

  return {
    discussion,
    isLoading,
    error,
    addReply,
    upvoteDiscussion,
    upvoteReply,
    flagDiscussion,
    flagReply,
    markAsAnswer
  };
}