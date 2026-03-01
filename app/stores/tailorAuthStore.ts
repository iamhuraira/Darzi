import { create } from "zustand";
import type { TailorAuth } from "../utils/tailorStorage";
import { clearTailorAuth, getTailorAuth, seedDefaultDataIfEmpty, setTailorAuth } from "../utils/tailorStorage";

interface TailorAuthState {
  auth: TailorAuth | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setAuth: (auth: TailorAuth) => Promise<void>;
  logout: () => Promise<void>;
}

export const useTailorAuthStore = create<TailorAuthState>((set, get) => ({
  auth: null,
  hydrated: false,

  hydrate: async () => {
    await seedDefaultDataIfEmpty();
    const auth = await getTailorAuth();
    set({ auth, hydrated: true });
  },

  setAuth: async (auth) => {
    await setTailorAuth(auth);
    set({ auth });
  },

  logout: async () => {
    await clearTailorAuth();
    set({ auth: null });
  },
}));
