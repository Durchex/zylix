import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FBF7ED",
          100: "#F5EAD1",
          200: "#EBD5A3",
          300: "#DFBC74",
          400: "#D3A752",
          500: "#C9A24B",
          600: "#B08535",
          700: "#8C6929",
          800: "#6B4F20",
          900: "#4A3717",
          950: "#2E220E",
        },
        ink: {
          950: "#08080A",
          900: "#0A0A0C",
          800: "#161618",
          700: "#232326",
          600: "#333338",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F2F2F3",
          200: "#E5E5E7",
          300: "#D1D1D6",
          400: "#A8A8AE",
          500: "#7C7C85",
          600: "#5B5B63",
          700: "#45454B",
          800: "#2C2C30",
          900: "#1A1A1C",
        },
        success: { DEFAULT: "#1E9E62", subtle: "#E6F6ED" },
        warning: { DEFAULT: "#D9992A", subtle: "#FBF1DF" },
        error: { DEFAULT: "#DC3545", subtle: "#FBE7E9" },
        info: { DEFAULT: "#2B7FD9", subtle: "#E8F1FC" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(10, 10, 12, 0.06)",
        elevated: "0 8px 24px rgba(10, 10, 12, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
