/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'background':                '#fbf9f4',
        'on-background':             '#1b1c19',
        'on-surface':                '#1b1c19',
        'on-surface-variant':        '#434842',
        'primary':                   '#516051',
        'primary-container':         '#6a7869',
        'secondary-container':       '#fdb292',
        'on-secondary-container':    '#78422a',
        'tertiary-fixed':            '#ffdcc5',
        'on-tertiary-fixed-variant': '#673c1a',
        'surface-container-high':    '#eae8e3',
        'outline':                   '#747872',
        'outline-variant':           '#c4c8c0',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

