import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f4ffe0',
          100: '#e5ffad',
          200: '#d0ff70',
          300: '#c0ff40',
          400: '#b0ff00',
          500: '#8fcc00',
          600: '#6fa000',
          700: '#527500',
          800: '#394f00',
          900: '#253300',
          950: '#131c00',
        },
        neutral: {
          50:  '#f5f5f5',
          100: '#ebebeb',
          200: '#d6d6d6',
          300: '#b5b5b5',
          400: '#898989',
          500: '#636363',
          600: '#4a4a4a',
          700: '#3a3a42',
          800: '#2a2a30',
          900: '#1e1e24',
          950: '#141418',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [typography],
}

export default config
