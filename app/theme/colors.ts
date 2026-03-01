/**
 * Darzi — premium dark tailor app color system.
 * Deep navy backgrounds, copper accent, cream typography, strong contrast.
 */
export const colors = {
  // Backgrounds
  background: "#0F1C2E", // primary — deep dark navy (main screens)
  surface: "#1A2D42", // secondary — cards, bottom sheets
  tabBar: "#0A1520", // deepest navy — bottom tab bar
  input: "#243447", // dark steel — input fields

  // Primary accent — buttons, CTAs, active states
  copper: "#C4622D",

  // Typography & icons on dark
  cream: "#F2E8DC", // primary text, labels, icons
  creamMuted: "#C4B8A8", // secondary text, placeholders
  mutedGray: "#7A8FA6", // taglines, step text
  border: "#2E4560", // input/card border

  // Highlight / badge only (Pro, Basic, premium icons, dividers)
  gold: "#B8973A",

  // Status
  success: "#3DAB7A", // mint green
  warning: "#E8920A", // warm amber — pending
  error: "#D94F4F", // soft red — cancelled / error
} as const;

/** 14px — cards, modals */
export const borderRadius = {
  card: 14,
  button: 12,
  input: 12,
} as const;

/** Shadows for dark theme — subtle glow on active elements */
export const shadows = {
  sm: "0 2px 8px rgba(0, 0, 0, 0.25)",
  md: "0 4px 20px rgba(0, 0, 0, 0.3)",
  lg: "0 8px 40px rgba(0, 0, 0, 0.35)",
  glow: "0 0 20px rgba(196, 98, 45, 0.2)",
  innerGlow: "inset 0 0 0 1px rgba(196, 98, 45, 0.25)",
} as const;
