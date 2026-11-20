/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uss: {
          navy: '#002B49',
          'navy-deep': '#001894',
          'navy-alt': '#002855',
          primary: '#001894',
          blue: '#005A9C',
          cyan: '#00A3E0',
          yellow: '#FDB913',
          gold: '#FDB913',
          dark: '#081A2B',
          light: '#F4F7FA'
        }
      }
    },
  },
  plugins: [],
}
