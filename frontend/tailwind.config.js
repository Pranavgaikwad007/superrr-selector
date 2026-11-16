/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        royals: {
          pink: '#E5008A',
          pinkHover: '#C90079',
          pinkLight: '#FFF1F8',
          pinkSubtle: '#FDF2F8',
          pinkAccent: '#FF4FAF',
          purple: '#650D73',
          purpleHover: '#520A5E',
          purpleDark: '#260C35',
          purpleCard: '#3A174A',
          purpleCardSec: '#2C0F3C',
          purpleBorder: '#673A70',
          text: '#23142E',
          textMuted: '#71677B',
          border: '#F1DCE9',
          gold: '#F59E0B',
          goldLight: '#FEF3C7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'royals-sm': '0 2px 10px 0 rgba(101, 13, 115, 0.05)',
        'royals-md': '0 6px 20px -2px rgba(101, 13, 115, 0.08)',
        'royals-lg': '0 12px 32px -4px rgba(229, 0, 138, 0.12)',
        'royals-pink': '0 8px 24px -4px rgba(229, 0, 138, 0.35)',
      }
    },
  },
  plugins: [],
}
