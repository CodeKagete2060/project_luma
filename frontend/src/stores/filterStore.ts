import { create } from 'zustand';

interface FilterState {
  filters: {
    subjects: string[];
    types: string[];
    difficulties: string[];
    sortOptions: Array<{
      value: string;
      label: string;
    }>;
  };
  selectedFilters: {
    subject?: string;
    type?: string;
    difficulty?: string;
    sort?: string;
    search?: string;
  };
  loading: boolean;
  error: string | null;
  fetchFilters: () => Promise<void>;
  setFilter: (key: string, value: string | undefined) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {
    subjects: [],
    types: [],
    difficulties: ['beginner', 'intermediate', 'advanced'],
    sortOptions: [
      { value: '-createdAt', label: 'Newest First' },
      { value: 'createdAt', label: 'Oldest First' },
      { value: '-views', label: 'Most Viewed' },
      { value: '-ratings.average', label: 'Highest Rated' },
      { value: '-likedBy', label: 'Most Liked' },
    ],
  },
  selectedFilters: {},
  loading: false,
  error: null,

  fetchFilters: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/resources/filters');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch filters');
      }

      set((state) => ({
        filters: {
          ...state.filters,
          subjects: data.subjects,
          types: data.types,
        },
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        [key]: value,
      },
    }));
  },

  clearFilters: () => {
    set({ selectedFilters: {} });
  },
}));