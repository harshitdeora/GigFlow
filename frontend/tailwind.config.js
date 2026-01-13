/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          surface: '#151520',
          card: '#1a1a2e',
          border: '#2a2a3e',
          text: '#e0e0e0',
          'text-muted': '#a0a0a0',
        },
        glow: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#ec4899',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(99, 102, 241, 0.3)',
        'glow-md': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 30px rgba(99, 102, 241, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
      }
    },
  },
  plugins: [],
}


