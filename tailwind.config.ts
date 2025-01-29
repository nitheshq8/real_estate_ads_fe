import type { Config } from "tailwindcss";
import { rose, fuchsia, green } from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable dark mode support
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF", // Default White Background
        foreground: "#1A202C", // Dark Gray for readability
        primary: "#6B46C1", // Purple
        secondary: "#D69E2E", // Gold
        border: "#E2E8F0",
        darkGreen: "#006400",
        brandPrimary: "#027B71", // Primary brand color
        brandSecondary: "#FFD700", // Secondary color for highlights
        gray50: "#F9FAFB", // Light gray background
        gray900: "#1A202C", // Dark gray for dark mode
        red600: "#E53E3E", // Red for badges
        yellow400: "#F6E05E", // Yellow for highlights
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
