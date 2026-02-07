module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: {
          950: '#04040a',
          900: '#0a0a0f',
          800: '#0f1019',
          700: '#161722',
          600: '#1e1f2e',
          500: '#2a2b3d',
        },
        glow: {
          DEFAULT: '#10b981',
          dim: '#059669',
          bright: '#34d399',
          cyan: '#06b6d4',
          amber: '#f59e0b',
        },
        cream: {
          50: '#fefdfb',
          100: '#faf8f4',
          200: '#f0ede5',
          300: '#e2ddd2',
          400: '#c4bfb3',
          500: '#9c9789',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'grid-fade': 'grid-fade 3s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
        'grid-fade': {
          '0%, 100%': { opacity: 0.03 },
          '50%': { opacity: 0.08 },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
