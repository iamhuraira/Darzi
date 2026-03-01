import { create } from "zustand";
import { getItem, setItem } from "../lib/storage";
import type { Locale } from "../lib/i18n";
import i18n from "../lib/i18n";

const LOCALE_KEY = "@darzi/locale";

export interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  hydrateLocale: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  locale: "en",

  setLocale: (locale) => {
    i18n.changeLanguage(locale);
    setItem(LOCALE_KEY, locale).catch(() => {});
    set({ locale });
  },

  hydrateLocale: async () => {
    try {
      const stored = await getItem<Locale>(LOCALE_KEY);
      if (stored && (stored === "en" || stored === "ur")) {
        i18n.changeLanguage(stored);
        set({ locale: stored });
      }
    } catch {
      // keep default
    }
  },
}));
