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
        ink: "#1f2a37",
        muted: "#667085",
        line: "#d8dee8",
        surface: "#f7f9fc"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 42, 55, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
