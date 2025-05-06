/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6f7ef',
          100: '#c3ebd8',
          200: '#9ddfc0',
          300: '#76d2a7',
          400: '#50c58f',
          500: '#2ab977', 
          600: '#0a8a5f', // Main brand color
          700: '#097652',
          800: '#076244',
          900: '#054e37',
        },
        secondary: {
          50: '#f2f9e8',
          100: '#e4f3d0',
          200: '#cbe9aa',
          300: '#b2df84',
          400: '#9ed06f', // Secondary brand color
          500: '#85c255',
          600: '#6bab3e',
          700: '#5a8f34',
          800: '#48732a',
          900: '#375720',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#eaecef',
          200: '#dde0e4',
          300: '#c1c7ce',
          400: '#979faa',
          500: '#7a838f',
          600: '#5b636e',
          700: '#434a53',
          800: '#2f343a',
          900: '#1c2025',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
        'count-up': 'countUp 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        countUp: {
          '0%': { content: '"0"' },
          '100%': { content: 'attr(data-value)' },
        },
      },
    },
  },
  plugins: [],
};