/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,js}'],
  theme: {
    colors: {
      main: '#b96060',
      'main-light': 'rgba(185,96,96,.667)',
      'main-bg': '#faebd7',
      'font-color': '#2c2929',
      'border-color': '#464242'
    },
    extend: {
      boxShadow: {
        'grey': '4px 4px 0 0 rgba(98, 85, 85, 1), 1px 1px 0 0.5px rgba(98, 85, 85, 1), 2px 2px 0 0.5px rgba(98, 85, 85, 1)',
        'grey-btn': '3px 3px 0 0px rgba(98, 85, 85, 1), 2px 2px 0 0.5px rgba(98, 85, 85, 1)',
        'grey-btn-small': '2px 2px 0 0 rgba(98, 85, 85, 1)',
        'grey-small': '2px 2px 0 0 rgba(98, 85, 85, 1)',
        'white': '2px 2px 0 0 rgb(217, 213, 213, 1)',
      },
      translate: {
        'btn': '1px'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
