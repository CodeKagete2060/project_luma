/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
    },
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#2563eb', // blue-600 like
        },
        lumaGray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
        }
      }
    },
  },
  plugins: [],
}
