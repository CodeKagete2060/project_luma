/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#121057',
        secondary: '#4b4b54',
        light: '#e8e8e8',
        accent: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        background: {
          DEFAULT: '#ffffff',
          light: '#e8e8e8',
          dark: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}