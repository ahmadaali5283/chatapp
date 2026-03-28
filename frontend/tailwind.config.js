/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f0f2f5',
          100: '#e9edef',
          200: '#d1d7db',
          300: '#aebac1',
          400: '#8696a0',
          500: '#667781',
          600: '#54656f',
          700: '#2a3942',
          800: '#202c33',
          900: '#111b21',
          950: '#0b141a',
        },
        indigo: {
          50: '#d9fdd3',
          100: '#ccfcd4',
          200: '#abf7b1',
          300: '#75e985',
          400: '#46c65e',
          500: '#00a884',
          600: '#005c4b',
          700: '#004d40',
          800: '#00332a',
          900: '#00221c',
          950: '#00110e',
        }
      },
      backgroundImage: {
        'wa-pattern': "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/r_QMeFtkwE1.png')"
      }
    },
  },
  plugins: [],
}

