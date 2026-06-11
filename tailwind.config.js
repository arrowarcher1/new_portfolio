/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Sora', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        void: {
          950: '#050210',
          900: '#0a0518',
          800: '#120826',
          700: '#1d0f3a',
          600: '#2d1657',
        },
        aurora: {
          fuchsia: '#d946ef',
          violet: '#8b5cf6',
          cyan: '#22d3ee',
          mint: '#34d399',
          amber: '#fbbf24',
          rose: '#fb7185',
        },
        mist: {
          50: '#f5f1ff',
          100: '#e9e1fc',
          200: '#cfc2ef',
          300: '#a795d4',
          400: '#7c6aa8',
          500: '#544a78',
        },
      },
    },
  },
  plugins: [],
}
