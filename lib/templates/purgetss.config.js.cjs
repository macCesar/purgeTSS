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
    logos: {
      // Optional overrides. If omitted, PurgeTSS auto-discovers files from purgetss/brand/:
      // primary: './docs/logo.svg',
      // androidLauncher: './docs/app-icon.svg',
      // androidSplash: './docs/splash.svg',
      // monochrome: './docs/logo-mono.svg',
      // iosDark: './docs/logo-dark.svg',
      // iosTinted: './docs/logo-tinted.svg'
    },
    padding: {
      ios: '4%',             // iOS aesthetic. Range: 2% bold — 8% conservative. No launcher mask.
      androidLegacy: '10%',  // legacy ic_launcher.png padding
      androidAdaptive: '19%' // adaptive foreground padding near the Android safe-zone
    },
    android: {
      splash: false,         // also generate splash_icon.png × 5
      notification: false    // also generate ic_stat_notify.png × 5
    },
    colors: {
      background: '#FFFFFF'  // Android adaptive bg + iOS/marketplace flatten
    },
    // Optional iOS overrides:
    // ios: {
    //   dark: false,
    //   tinted: false,
    //   darkBackground: '#111111'
    // },
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
