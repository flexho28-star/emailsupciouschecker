/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#080b11",      // Deep dark blue-black
          card: "#0f172a",    // Dark slate card bg
          border: "#1e293b",  // Border color
          blue: "#00f2fe",    // Neon Blue
          green: "#05ffc4",   // Neon Green
          red: "#ff3838",     // Neon Red
          yellow: "#f59e0b",  // Amber/Yellow for warnings
          text: "#f8fafc",    // Off-white text
          muted: "#64748b"    // Slate muted text
        }
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(0, 242, 254, 0.15)',
        'neon-green': '0 0 15px rgba(5, 255, 196, 0.15)',
        'neon-red': '0 0 15px rgba(255, 56, 56, 0.15)',
        'glow-blue': '0 0 30px rgba(0, 242, 254, 0.3)',
        'glow-green': '0 0 30px rgba(5, 255, 196, 0.3)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 242, 254, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 242, 254, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}
