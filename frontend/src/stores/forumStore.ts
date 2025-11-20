import { create } from 'zustand';

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  category: string;
  tags: string[];
  isAnnouncement: boolean;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  likes: string[];
  replies: Array<{
    _id: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    content: string;
    createdAt: string;
    updatedAt?: string;
    isEdited: boolean;
    likes: string[];
  }>;
  reports: Array<{
    user: string;
    reason: string;
    createdAt: string;
  }>;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

interface ThreadState {
  threads: Thread[];
  selectedThread: Thread | null;
  filters: {
    category?: string;
    tag?: string;
    onlyAnnouncements?: boolean;
    onlyPinned?: boolean;
    search?: string;
  };
  sort: string;
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
  fetchThreads: () => Promise<void>;
  fetchThread: (id: string) => Promise<void>;
  createThread: (data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    isAnnouncement?: boolean;
  }) => Promise<void>;
  addReply: (threadId: string, content: string) => Promise<void>;
  reportThread: (threadId: string, reason: string) => Promise<void>;
  moderateThread: (threadId: string, action: string, reason?: string) => Promise<void>;
  setFilters: (filters: Partial<ThreadState['filters']>) => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  clearSelectedThread: () => void;
}

export const useForumStore = create<ThreadState>((set, get) => ({
  threads: [],
  selectedThread: null,
  filters: {},
  sort: '-lastActivityAt',
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
  error: null,

  fetchThreads: async () => {
    const { filters, sort, page, limit } = get();
    set({ loading: true, error: null });

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        ...filters
      });

      const response = await fetch(`/api/forum/threads?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch threads');
      }

      set({
        threads: data.threads,
        total: data.total,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false
      });
    }
  },

  fetchThread: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`/api/forum/threads/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch thread');
      }

      set({
        selectedThread: data,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false
      });
    }
  },

  createThread: async (data) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create thread');
      }

      const newThread = await response.json();
      set((state) => ({
        threads: [newThread, ...state.threads],
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create thread',
        loading: false
      });
    }
  },

  addReply: async (threadId, content) => {
    try {
      const response = await fetch(`/api/forum/threads/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add reply');
      }

      const updatedThread = await response.json();
      set((state) => ({
        selectedThread: updatedThread,
        threads: state.threads.map(thread =>
          thread._id === threadId ? updatedThread : thread
        )
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add reply'
      });
    }
  },

  reportThread: async (threadId, reason) => {
    try {
      const response = await fetch(`/api/forum/threads/${threadId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to report thread');
      }

      // Show success message through UI
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to report thread'
      });
    }
  },

  moderateThread: async (threadId, action, reason) => {
    try {
      const response = await fetch(`/api/forum/threads/${threadId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to moderate thread');
      }

      if (action === 'delete') {
        set((state) => ({
          threads: state.threads.filter(thread => thread._id !== threadId),
          selectedThread: null
        }));
      } else {
        const updatedThread = await response.json();
        set((state) => ({
          selectedThread: updatedThread,
          threads: state.threads.map(thread =>
            thread._id === threadId ? updatedThread : thread
          )
        }));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to moderate thread'
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1 // Reset page when filters change
    }));
    get().fetchThreads();
  },

  setSort: (sort) => {
    set({ sort });
    get().fetchThreads();
  },

  setPage: (page) => {
    set({ page });
    get().fetchThreads();
  },

  clearSelectedThread: () => {
    set({ selectedThread: null });
  }
}));