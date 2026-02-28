/**
 * Darzi design system — use for non-Tailwind styling (e.g. StyleSheet, dynamic values).
 * For className usage, use Tailwind utilities: bg-navy, text-gold, etc.
 */
export const colors = {
  // Primary / Brand
  navy: "#1B2B4B",
  navyLight: "#243660",
  // Accent / Luxury
  gold: "#C9A84C",
  goldLight: "#D4B86A",
  goldPale: "#F0E6C8",
  // Backgrounds
  canvas: "#F8F6F2",
  surface: "#EDEAE4",
  // Typography
  charcoal: "#2D2D2D",
  muted: "#7A7570",
  // Status
  success: "#5A8A6A",
  warning: "#E8A020",
  error: "#C0514A",
} as const;

export const shadows = {
  sm: "0 2px 8px rgba(27, 43, 75, 0.08)",
  md: "0 4px 20px rgba(27, 43, 75, 0.12)",
  lg: "0 8px 40px rgba(27, 43, 75, 0.16)",
} as const;
