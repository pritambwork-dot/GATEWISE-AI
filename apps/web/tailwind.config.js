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
          DEFAULT: '#070B1A',
          surface: '#FFFFFF',
          secondary: '#E6ECFF',
        },
        gatewise: {
          primary: '#2F5BFF',
          cobalt: '#2F5BFF',
          teal: '#12B5A6',
          amber: '#FFB547',
          midnight: '#070B1A',
          permitted: '#1FB36B',
          denied: '#C93338',
          deep: '#0F2060',
          light: '#E6ECFF',
          text: '#FFFFFF',
          border: '#E6ECFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
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
