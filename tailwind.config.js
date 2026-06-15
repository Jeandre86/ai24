
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        base: '#121212',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        primary: '#f5f5f5',
        secondary: '#a3a3a3',
        muted: '#6b6b6b',
        accent: '#6366f1',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
