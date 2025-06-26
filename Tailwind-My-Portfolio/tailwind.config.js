/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'gray-900': '#111827',
        'gray-800': '#1F2937',
        'gray-700': '#374151',
        'gray-600': '#4B5563',
        'gray-500': '#6B7280',
        'gray-400': '#9CA3AF',
        'gray-300': '#D1D5DB',
        'gray-200': '#E5E7EB',
        'gray-100': '#F3F4F6',
        'blue-600': '#2563EB',
        'blue-500': '#3B82F6',
        'blue-400': '#60A5FA',
        'blue-300': '#93C5FD',
        'blue-200': '#BFDBFE',
        'blue-100': '#DBEAFE',
        'green-600': '#059669',
        'green-500': '#10B981',
        'green-400': '#34D399',
        'purple-600': '#7C3AED',
        'purple-500': '#8B5CF6',
        'red-500': '#EF4444',
        'yellow-500': '#F59E0B',
        'cyan-500': '#06B6D4',
        'orange-500': '#F97316',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
        '1500': '1500ms',
      },
      transitionTimingFunction: {
        'bounce-in-out': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
      transform: {
        'scale-105': 'scale(1.05)',
        'scale-110': 'scale(1.10)',
      },
      backdropBlur: {
        'sm': '4px',
        'md': '10px',
        'lg': '16px',
      },
      zIndex: {
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fadeIn': 'fadeIn 0.8s ease-in-out forwards',
        'fadeOut': 'fadeOut 0.5s ease-out forwards',
        'slideUp': 'slideUp 0.5s ease-out forwards',
        'slideDown': 'slideDown 0.5s ease-out forwards',
        'slideLeft': 'slideLeft 0.5s ease-out forwards',
        'slideRight': 'slideRight 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'sharp': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'button': '0 4px 10px rgba(37, 99, 235, 0.4)',
        'card': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'rgb(55, 65, 81)',
            a: {
              color: '#2563EB',
              '&:hover': {
                color: '#1D4ED8',
              },
            },
          },
        },
      },
      backgroundImage: theme => ({
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      }),
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
    },
  },
  plugins: [
    function({ addBase, addComponents, theme }) {
      addBase({
        '.dark': {
          '--bg-primary': theme('colors.gray.900'),
          '--bg-secondary': theme('colors.gray.800'),
          '--text-primary': theme('colors.gray.100'),
          '--text-secondary': theme('colors.gray.300'),
        },
        ':root': {
          '--bg-primary': theme('colors.white'),
          '--bg-secondary': theme('colors.gray.100'),
          '--text-primary': theme('colors.gray.900'),
          '--text-secondary': theme('colors.gray.600'),
        },
      });
    },
  ],
};