import { create } from "zustand";

/**
 * Auth UI state only. User data comes from React Query (useCurrentUserQuery).
 * Use this for transient error/loading that you want to clear on navigation.
 */
export interface AuthState {
  authError: string | null;
  setAuthError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authError: null,
  setAuthError: (error) => set({ authError: error }),
}));
