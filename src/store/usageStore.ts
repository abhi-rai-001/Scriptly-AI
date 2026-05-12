import { create } from "zustand";

interface UsageState {
  scripts_count: number;
  thumbnails_count: number;
  scripts_limit: number;
  thumbnails_limit: number;
  loading: boolean;

  setUsage: (usage: Partial<UsageState>) => void;
  fetchUsage: () => Promise<void>;
  incrementScripts: () => void;
  incrementThumbnails: () => void;
}

export const useUsageStore = create<UsageState>((set, get) => ({
  scripts_count: 0,
  thumbnails_count: 0,
  scripts_limit: 100,
  thumbnails_limit: 100,
  loading: false,

  setUsage: (usage) => set((state) => ({ ...state, ...usage })),

  fetchUsage: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/user/usage");
      if (res.ok) {
        const data = await res.json();
        set({
          scripts_count: data.scripts_count,
          thumbnails_count: data.thumbnails_count,
          scripts_limit: data.scripts_limit || 100,
          thumbnails_limit: data.thumbnails_limit || 100,
        });
      }
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    } finally {
      set({ loading: false });
    }
  },

  incrementScripts: () => set((state) => ({ scripts_count: state.scripts_count + 1 })),
  incrementThumbnails: () => set((state) => ({ thumbnails_count: state.thumbnails_count + 1 })),
}));
