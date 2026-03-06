/**
 * Translations from app/locales (en.json, ur.json).
 * Use t(key, language) with dot keys e.g. t("auth.login", language).
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const en = require("../locales/en.json") as Record<string, unknown>;
const ur = require("../locales/ur.json") as Record<string, unknown>;

export type AppLanguage = "english" | "urdu";

const locales: Record<AppLanguage, Record<string, unknown>> = {
  english: en,
  urdu: ur,
};

function getByPath(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[p];
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Translate key (dot notation, e.g. "auth.login"). Optionally replace {{var}} in the string.
 */
export function t(
  key: string,
  language: AppLanguage,
  vars?: Record<string, string>
): string {
  const strings = locales[language];
  let value = getByPath(strings, key);
  if (value === undefined) value = getByPath(en, key); // fallback to English
  let out = (value ?? key) as string;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
    });
  }
  return out;
}

/** For form labels: primary (current language), secondary (English when Urdu, else empty). */
export function tLabel(
  key: string,
  language: AppLanguage
): { primary: string; secondary: string } {
  const enVal = getByPath(en, key) ?? key;
  const urVal = getByPath(ur, key) ?? key;
  if (language === "english") {
    return { primary: enVal, secondary: "" };
  }
  return { primary: urVal, secondary: enVal };
}
