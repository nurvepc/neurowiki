/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Refined Neuro Blue (deeper, more sophisticated)
        neuro: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#0F5EA3',  // PRIMARY - deeper blue
          700: '#0C4A82',
          800: '#0A3D6B',
          900: '#072F54',
          950: '#041E36',
        },
        // Warm backgrounds instead of pure white/gray
        surface: {
          50: '#FAFBFC',   // Page background
          100: '#F5F7F9',  // Card hover
          200: '#EEF1F4',  // Borders
        },
      }
    },
  },
  plugins: [],
}
