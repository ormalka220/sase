/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // C-Data brand blues
        cdata: {
          50:  '#EEF6FB',
          100: '#D6EBF5',
          200: '#ADD7EB',
          300: '#87BFDA',   // C-Data light blue
          400: '#5B9BB8',
          500: '#2C6A8A',   // C-Data medium blue
          600: '#1F5070',
          700: '#1F3A54',   // C-Data dark navy
          800: '#162D42',
          900: '#0E1F2E',
        },
        // SpotNet brand orange
        spot: {
          300: '#FAB97A',
          400: '#F8A054',
          500: '#F57C20',   // SpotNet primary orange
          600: '#E8671A',
          700: '#C9530E',
        },
        // SpotNet grays
        steel: {
          300: '#C8CDD1',
          400: '#A0A6AB',
          500: '#808080',   // SpotNet gray
          600: '#666B6F',
          700: '#4A4E52',
        },
        // Background navys (shifted to C-Data palette)
        navy: {
          900: '#07111E',
          800: '#0B1929',
          700: '#0F2236',
          600: '#142A43',
          500: '#1A3450',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-blue': 'glowBlue 2s ease-in-out infinite alternate',
        'glow-orange': 'glowOrange 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glowBlue: {
          '0%': { boxShadow: '0 0 5px rgba(44,106,138,0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(44,106,138,0.6), 0 0 50px rgba(44,106,138,0.2)' },
        },
        glowOrange: {
          '0%': { boxShadow: '0 0 5px rgba(245,124,32,0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(245,124,32,0.6), 0 0 50px rgba(245,124,32,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
