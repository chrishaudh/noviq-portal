import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        brand: "#0f766e",
        line: "#e5e7eb",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17, 24, 39, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
