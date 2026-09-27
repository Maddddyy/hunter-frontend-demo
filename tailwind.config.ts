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
          void: '#08080B',
          plane: '#0C0C11',
          black: '#0B0B0E',
          'black-alt': '#101014',
          surface: '#111117',
          'surface-2': '#16161E',
          'surface-3': '#1E1E28',
          charcoal: '#2c2c36',
          hair: '#22222C',
          'hair-2': '#31313D',
          ink: '#F6F7F8',
          metal: '#b7babd',
          gray: '#b7babd',
          mute: '#767A84',
          faint: '#4E525C',
          signal: '#FF5C5C',
          'signal-soft': 'rgba(255,92,92,0.12)',
          'signal-line': 'rgba(255,92,92,0.34)',
          watch: '#E8A33D',
          'watch-soft': 'rgba(232,163,61,0.12)',
          'watch-line': 'rgba(232,163,61,0.30)',
          verified: '#5BC08D',
          'verified-soft': 'rgba(91,192,141,0.12)',
          'verified-line': 'rgba(91,192,141,0.30)',
          focus: '#7FB0FF',
          red: '#FF5C5C',
          green: '#5BC08D',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        disp: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'editorial': '-0.012em',
      },
    },
  },
  plugins: [],
};
export default config;
