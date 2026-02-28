/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary / Brand
        navy: "#1B2B4B",
        "navy-light": "#243660",
        // Accent / Luxury
        gold: "#C9A84C",
        "gold-light": "#D4B86A",
        "gold-pale": "#F0E6C8",
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
      },
      fontFamily: {
        heading: ["CormorantGaramond_400Regular", "serif"],
        "heading-semibold": ["CormorantGaramond_600SemiBold", "serif"],
        body: ["DMSans_400Regular", "sans-serif"],
        "body-medium": ["DMSans_500Medium", "sans-serif"],
        "body-semibold": ["DMSans_600SemiBold", "sans-serif"],
        // Urdu — Noto Nastaliq Urdu
        urdu: ["NotoNastaliqUrdu_400Regular", "serif"],
        "urdu-medium": ["NotoNastaliqUrdu_500Medium", "serif"],
        "urdu-semibold": ["NotoNastaliqUrdu_600SemiBold", "serif"],
        "urdu-bold": ["NotoNastaliqUrdu_700Bold", "serif"],
      },
      boxShadow: {
        sm: "0 2px 8px rgba(27, 43, 75, 0.08)",
        DEFAULT: "0 4px 20px rgba(27, 43, 75, 0.12)",
        lg: "0 8px 40px rgba(27, 43, 75, 0.16)",
      },
    },
  },
  plugins: [],
};
