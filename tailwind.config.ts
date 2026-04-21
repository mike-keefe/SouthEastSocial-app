import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#fecba8',
          300: '#fda470',
          400: '#fb7236',
          500: '#f95016',
          600: '#ea3410',
          700: '#c22410',
          800: '#9a1f14',
          900: '#7c1d13',
          950: '#430b07',
        },
        secondary: {
          50: '#f0f4fe',
          100: '#dde6fd',
          200: '#c3d3fb',
          300: '#99b5f8',
          400: '#698df3',
          500: '#4666ed',
          600: '#3148e2',
          700: '#2938cf',
          800: '#282fa8',
          900: '#272e85',
          950: '#1b1f52',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        neutral: {
          50: '#faf9f7',
          100: '#f0ede8',
          200: '#e2ddd5',
          300: '#cec6bb',
          400: '#b5a99a',
          500: '#9e8f7e',
          600: '#8a7a6b',
          700: '#726358',
          800: '#5f524a',
          900: '#4e443d',
          950: '#1a1614',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [typography],
}

export default config
