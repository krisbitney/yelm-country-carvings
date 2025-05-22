/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary-1)',
          light: 'var(--color-primary-2)',
          dark: '#5a4235', // Darker shade of primary-1
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: '#5b7362', // Lighter shade of secondary
          dark: '#3a4c40', // Darker shade of secondary
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: '#c98b6a', // Lighter shade of accent
          dark: '#a66547', // Darker shade of accent
        },
        neutral: {
          light: 'var(--color-neutral-1)',
          dark: 'var(--color-neutral-2)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        decorative: ['var(--font-decorative)'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
}