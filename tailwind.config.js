/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#FF5C28',
          600: '#E64D1C',
        },
      },
    },
  },
  plugins: [],
};