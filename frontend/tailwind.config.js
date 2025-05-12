/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        alert: {
          emergency: '#ef4444', // Red for critical alerts
          warning: '#f97316',   // Orange for warnings
          info: '#3b82f6',      // Blue for informational
          safe: '#22c55e',      // Green for safe/resolved
        }
      },
    },
  },
  plugins: [],
}

