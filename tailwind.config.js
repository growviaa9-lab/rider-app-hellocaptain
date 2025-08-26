/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#FFD700',
        accent: '#4A90E2',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        surface: '#F5F5DC',
        onSurface: '#212121',
        background: '#FFFFFF',
        onBackground: '#000000',
      },
    },
  },
  plugins: [],
}
