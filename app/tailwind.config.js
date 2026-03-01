/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./context/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: "#0F1C2E",
        surface: "#1A2D42",
        tabBar: "#0A1520",
        input: "#243447",
        // Accent
        copper: "#C4622D",
        cream: "#F2E8DC",
        "cream-muted": "#C4B8A8",
        gold: "#B8973A",
        // Status
        success: "#3DAB7A",
        warning: "#E8920A",
        error: "#D94F4F",
      },
      borderRadius: {
        card: "14px",
      },
      fontFamily: {
        heading: ["CormorantGaramond_400Regular", "serif"],
        "heading-semibold": ["CormorantGaramond_600SemiBold", "serif"],
        body: ["DMSans_400Regular", "sans-serif"],
        "body-medium": ["DMSans_500Medium", "sans-serif"],
        "body-semibold": ["DMSans_600SemiBold", "sans-serif"],
        urdu: ["NotoNastaliqUrdu_400Regular", "serif"],
        "urdu-medium": ["NotoNastaliqUrdu_500Medium", "serif"],
        "urdu-semibold": ["NotoNastaliqUrdu_600SemiBold", "serif"],
        "urdu-bold": ["NotoNastaliqUrdu_700Bold", "serif"],
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0, 0, 0, 0.25)",
        DEFAULT: "0 4px 20px rgba(0, 0, 0, 0.3)",
        lg: "0 8px 40px rgba(0, 0, 0, 0.35)",
        glow: "0 0 20px rgba(196, 98, 45, 0.2)",
        "inner-glow": "inset 0 0 0 1px rgba(196, 98, 45, 0.25)",
      },
    },
  },
  plugins: [],
};
