import { create } from "zustand";
import { getItem, setItem } from "../lib/storage";
import type { Locale } from "../lib/i18n";
import i18n from "../lib/i18n";
import type { AppLanguage } from "../utils/lang";

const LOCALE_KEY = "@darzi/locale";
const APP_LANGUAGE_KEY = "app_language";
const APP_UNITS_KEY = "app_units";

export type AppUnits = "inches" | "cm";

export interface AppState {
  locale: Locale;
  language: AppLanguage;
  units: AppUnits;
  setLocale: (locale: Locale) => void;
  setLanguage: (language: AppLanguage) => void;
  setUnits: (units: AppUnits) => void;
  hydrateLocale: () => Promise<void>;
  hydrateAppPrefs: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  locale: "en",
  language: "urdu",
  units: "inches",

  setLocale: (locale) => {
    i18n.changeLanguage(locale);
    setItem(LOCALE_KEY, locale).catch(() => {});
    set({ locale });
  },

  setLanguage: (language) => {
    setItem(APP_LANGUAGE_KEY, language).catch(() => {});
    set({ language });
  },

  setUnits: (units) => {
    setItem(APP_UNITS_KEY, units).catch(() => {});
    set({ units });
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

  hydrateAppPrefs: async () => {
    try {
      const [lang, units] = await Promise.all([
        getItem<AppLanguage>(APP_LANGUAGE_KEY),
        getItem<AppUnits>(APP_UNITS_KEY),
      ]);
      if (lang === "english" || lang === "urdu") set((s) => ({ ...s, language: lang }));
      else if (lang === "both") set((s) => ({ ...s, language: "urdu" })); // migrate old "both" to Urdu
      if (units && (units === "inches" || units === "cm")) set((s) => ({ ...s, units }));
    } catch {
      // keep defaults
    }
  },
}));
