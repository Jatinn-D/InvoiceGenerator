/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1a',
        soft: '#6b6b6b',
        line: '#e6e3dd',
        paper: '#ffffff',
        bg: '#f4f2ed',
        accent: '#2d4a43',
        accentSoft: '#eef1ef',
        // status colors (kept for any future use)
        success: '#27AE60',
        danger: '#C0392B',
        dangerL: '#FDECEA',
        info: '#2471A3',
        warning: '#D68910',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Newsreader"', 'Georgia', 'serif'],
      },
      boxShadow: {
        sheet: '0 1px 2px rgba(0,0,0,.04), 0 24px 60px -20px rgba(0,0,0,.12)',
      },
    },
  },
  plugins: [],
}
