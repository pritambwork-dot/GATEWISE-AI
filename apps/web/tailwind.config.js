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
        background: {
          DEFAULT: '#F4F8F5',
          surface: '#FFFFFF',
          secondary: '#EDF4EF',
        },
        gatewise: {
          primary: '#23865D',
          deep: '#176346',
          light: '#DDF0E2',
          mint: '#C7E7D8',
          teal: '#3A9B8B',
          softBlue: '#A8CBE0',
          text: '#1E2D26',
          secondary: '#65756C',
          muted: '#95A39A',
          border: '#E2EBE4',
          borderMedium: '#C8D9CD',
          success: '#26865E',
          warning: '#CF983E',
          error: '#C85B57',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
