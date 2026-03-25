/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: "#1a1a18",
        paper: "#f7f6f2",
        muted: "#9a9a94",
        accent: "#c8622a",
        rule: "#e2e0d8",
      },
    },
  },
  plugins: [],
};
