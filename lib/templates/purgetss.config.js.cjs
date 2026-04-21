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
    splash: false,           // also generate splash_icon.png × 5
    padding: '15%',          // Android safe-zone. Range: 12% tight (mature logos) — 20% conservative. Spec floor 19.44%.
    iosPadding: '4%',        // iOS aesthetic. Range: 2% bold — 8% conservative. No launcher mask.
    darkBgColor: null,       // opaque dark bg for DefaultIcon-Dark.png (null = transparent per Apple HIG)
    bgColor: '#FFFFFF',      // Android adaptive bg + iOS/marketplace flatten
    notification: false,     // also generate ic_stat_notify.png × 5
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
