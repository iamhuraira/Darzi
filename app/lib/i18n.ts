import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "../locales/en.json";
import ur from "../locales/ur.json";

export const SUPPORTED_LOCALES = ["en", "ur"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const defaultNS = "common";

const resources = {
  en: { common: en.common, auth: en.auth, home: en.home, language: en.language },
  ur: { common: ur.common, auth: ur.auth, home: ur.home, language: ur.language },
};

const deviceLocale = Localization.getLocales()[0]?.languageCode?.slice(0, 2) ?? "en";
const initialLocale = SUPPORTED_LOCALES.includes(deviceLocale as Locale) ? deviceLocale : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: "en",
  defaultNS,
  ns: ["common", "auth", "home", "language"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
