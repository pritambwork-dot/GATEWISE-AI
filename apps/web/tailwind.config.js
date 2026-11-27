/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2F5BFF',
          cobalt: '#2F5BFF',
          teal: '#12B5A6',
          amber: '#FFB547',
          midnight: '#070B1A',
          permitted: '#1FB36B',
          denied: '#C93338',
          selected: '#E6ECFF',
          surface: '#FFFFFF',
        },
        cobalt: '#2F5BFF',
        teal: '#12B5A6',
        amber: '#FFB547',
        midnight: '#070B1A',
        permitted: '#1FB36B',
        denied: '#C93338',
        selected: '#E6ECFF',
        background: {
          DEFAULT: '#FAF9F6',
          surface: '#FFFFFF',
          secondary: '#EEF2FF',
        },
        gatewise: {
          primary: '#2F5BFF',
          cobalt: '#2F5BFF',
          teal: '#0D9488',
          amber: '#D97706',
          midnight: '#0A0E1A',
          permitted: '#15803D',
          denied: '#C93338',
          deep: '#10266B',
          light: '#EEF2FF',
          text: '#0A0E1A',
          secondary: '#475569',
          border: '#DCE1EC',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Barlow Condensed', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        shiny: 'shiny 6s linear infinite',
      },
      keyframes: {
        shiny: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
};
