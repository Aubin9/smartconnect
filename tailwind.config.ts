import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1a2a6c',
          blue: '#0066FF',
          teal: '#00B4D8',
          orange: '#FF8C00',
          success: '#00C853',
          warning: '#FFD600',
          danger: '#FF1744'
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(26,42,108,0.10)',
        card: '0 10px 25px rgba(15,23,42,0.08)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '80%,100%': { transform: 'scale(1.8)', opacity: '0' }
        },
        scan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        pulseRing: 'pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
        scan: 'scan 2s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
