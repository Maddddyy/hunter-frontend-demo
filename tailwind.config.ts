import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        piloteer: {
          black: '#0B0B0E',
          'black-alt': '#101014',
          gray: '#b7babd',
          'surface': '#2c2c36',
          'surface-hover': '#373742',
          red: '#ef4444',
          green: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
