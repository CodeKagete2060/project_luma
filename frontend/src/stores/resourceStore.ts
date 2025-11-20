import { create } from 'zustand';

export interface Resource {
  _id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  isPublic: boolean;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  views: number;
  likedBy: string[];
  ratings: Array<{
    user: string;
    rating: number;
    review?: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ResourceState {
  resources: Resource[];
  filters: {
    subject?: string;
    type?: string;
    difficulty?: string;
    search?: string;
  };
  sort: string;
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
  setFilters: (filters: Partial<ResourceState['filters']>) => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  likeResource: (resourceId: string) => Promise<void>;
  rateResource: (resourceId: string, rating: number, review?: string) => Promise<void>;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: [],
  filters: {},
  sort: '-createdAt',
  page: 1,
  limit: 10,
  total: 0,
  loading: false,
  error: null,

  fetchResources: async () => {
    const { filters, sort, page, limit } = get();
    set({ loading: true, error: null });

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        ...filters
      });

      const response = await fetch(`/api/resources?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch resources');
      }

      set({
        resources: data.resources,
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

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1 // Reset page when filters change
    }));
    get().fetchResources();
  },

  setSort: (sort) => {
    set({ sort });
    get().fetchResources();
  },

  setPage: (page) => {
    set({ page });
    get().fetchResources();
  },

  likeResource: async (resourceId) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/toggle-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to like resource');
      }

      // Update the resource in state
      set((state) => ({
        resources: state.resources.map(resource =>
          resource._id === resourceId
            ? { ...resource, ...await response.json() }
            : resource
        )
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to like resource'
      });
    }
  },

  rateResource: async (resourceId, rating, review) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to rate resource');
      }

      // Update the resource in state
      set((state) => ({
        resources: state.resources.map(resource =>
          resource._id === resourceId
            ? { ...resource, ...await response.json() }
            : resource
        )
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to rate resource'
      });
    }
  }
}));