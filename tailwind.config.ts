import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201a",
        court: "#2f7d57",
        clay: "#c85d38",
        line: "#edf1ed"
      },
      boxShadow: {
        soft: "0 16px 44px rgba(23, 32, 26, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
