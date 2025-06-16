module.exports = {
  purge: {
    mode: 'all',
    method: 'sync',
    options: {
      legacy: false,
      missing: true,
      widgets: true,
      safelist: [],
      plugins: ['fontWeight']
    }
  },
  theme: {
    extend: {
      colors: {
        primario: {
          50: '#f1f6fd',
          100: '#e0ebf9',
          200: '#c7dbf6',
          300: '#a1c5ef',
          400: '#74a5e6',
          500: '#5486dd',
          600: '#3f6bd1',
          700: '#3658bf',
          800: '#31489c',
          900: '#2c407c',
          950: '#1d2647',
          default: '#1d2647'
        }
      }
    }
  }
}
