/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-in': 'slideIn 1s ease-out forwards',
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale': 'scale 0.5s ease-out forwards',
        'rotate-180': 'rotate180 0.3s ease-out forwards',
        'slide-up-fade': 'slideUpFade 0.3s ease-out forwards',
        'slide-down-fade': 'slideDownFade 0.3s ease-out forwards',
        'bounce-soft': 'bounceSoft 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        scale: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        rotate180: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        slideUpFade: {
          '0%': { 
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        slideDownFade: {
          '0%': { 
            transform: 'translateY(-10px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        bounceSoft: {
          '0%, 100%': { 
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': { 
            transform: 'translateY(-10px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))',
      },
      backdropBlur: {
        'xs': '2px',
        'md': '6px',
        'lg': '12px',
      },
      colors: {
        'green-500/20': 'rgba(34, 197, 94, 0.2)',
        'green-500/30': 'rgba(34, 197, 94, 0.3)',
        'blue-500/20': 'rgba(59, 130, 246, 0.2)',
        'blue-500/30': 'rgba(59, 130, 246, 0.3)',
        'red-500/20': 'rgba(239, 68, 68, 0.2)',
        'red-500/30': 'rgba(239, 68, 68, 0.3)',
        'white/5': 'rgba(255, 255, 255, 0.05)',
        'white/10': 'rgba(255, 255, 255, 0.1)',
        'white/20': 'rgba(255, 255, 255, 0.2)',
        'black/20': 'rgba(0, 0, 0, 0.2)',
        'black/40': 'rgba(0, 0, 0, 0.4)',
        'black/60': 'rgba(0, 0, 0, 0.6)',
        'black/80': 'rgba(0, 0, 0, 0.8)',
        'gray-700/50': 'rgba(55, 65, 81, 0.5)',
        'gray-800/50': 'rgba(31, 41, 55, 0.5)',
        'gray-800/60': 'rgba(31, 41, 55, 0.6)',
        'gray-900/90': 'rgba(17, 24, 39, 0.9)',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 255, 255, 0.3)',
        'glow-strong': '0 0 20px rgba(255, 255, 255, 0.5)',
        'inner-glow': 'inset 0 0 15px rgba(255, 255, 255, 0.3)',
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
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [
    require('@headlessui/tailwindcss'),
  ],
}