module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'card-bg': 'var(--card-bg)',
        'border-color': 'var(--border-color)',
        'shadow': 'var(--shadow)',
        'background': 'var(--background)',
        'text': 'var(--text)',
        'primary': 'var(--primary)',
        'secondary-bg': 'var(--secondary-bg)',
        'navbar-bg': 'var(--navbar-bg)',
        'button-hover': 'var(--button-hover)',
        blue: {
          100: '#E6F0FF',
          500: '#3B82F6',
          600: '#2563EB',
        },
      },
    },
  },
  plugins: [],
}