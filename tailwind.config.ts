import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          DEFAULT: "#D8D1C6",
          soft: "#E4DED4",
          deep: "#C9C0B3",
        },
        ivory: "#F5F1E9",
        ink: "#171717",
        wine: {
          DEFAULT: "#6B2638",
          soft: "#8A3A4E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1400px",
      },
      transitionDuration: {
        feel: "200ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
