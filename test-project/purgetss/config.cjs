// ./purgetss/config.cjs
module.exports = {
  purge: {
    mode: 'all',
    method: 'sync', // set how to execute auto-purging: sync or async

    // These options are passed directly to PurgeTSS
    options: {
      missing: true, // Reports missing classes
      widgets: false, // Purges widgets too
      safelist: [], // Array of classes to keep
      plugins: [] // Array of properties to ignore
    }
  },
  brand: {
    padding: {
      ios: '4%',
      androidLegacy: '10%',
      androidAdaptive: '19%'
    },
    android: {
      splash: false,
      notification: false
    },
    colors: {
      background: '#FFFFFF'
    },
    confirmOverwrites: true  // prompt before overwriting files (set false to skip)
  },
  images: {
    quality: 85,             // JPEG/WebP/AVIF quality (0-100)
    format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' to convert every image
    confirmOverwrites: true  // prompt before overwriting files (set false to skip)
  },
  theme: {
    extend: {}
  }
}
