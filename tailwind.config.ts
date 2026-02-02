import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5fbff",
          100: "#e0f4ff",
          200: "#b3e4ff",
          300: "#80d1ff",
          400: "#4abcff",
          500: "#189ef6",
          600: "#0f7bd4",
          700: "#0b5fad",
          800: "#084a86",
          900: "#053059"
        }
      }
    }
  },
  plugins: []
};

export default config;
