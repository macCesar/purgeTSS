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
    background: '#FFFFFF',   // inherited by every piece that doesn't set its own
    confirmOverwrites: true, // prompt before overwriting files (set false to skip)
    optimize: false,         // true = quantize the generated PNGs to a palette (lossy, ~74% smaller)

    // One block per piece. Artwork comes from purgetss/brand/logo-<piece>.{svg,png};
    // these keys are for numbers, colors and activation. Padding is never inherited.
    icon:             { padding: '4%' },    // DefaultIcon.png + DefaultIcon-ios.png
    dark:             { background: null }, // DefaultIcon-Dark.png
    tinted:           {},                   // DefaultIcon-Tinted.png
    iosSplash:        { padding: '26%' },   // assets/iphone/Default*.png × 16
    launchLogo:       { padding: '12%' },   // LaunchLogo.png (1024×1024)
    marketplace:      {},                   // iTunesConnect.png + MarketplaceArtwork.png
    featureGraphic:   { padding: '12%' },   // MarketplaceArtworkFeature.png (1024×500)
    adaptive:         { padding: '18%' },   // ic_launcher_{foreground,background,monochrome}.png × 5 + ic_launcher.xml
    legacyIcon:       { padding: '10%' },   // ic_launcher.png × 5
    appicon:          {},                   // appicon.png (128×128)
    androidSplash:    { padding: '26%' },   // assets/android/default.png + images/res-*/default.png × 11

    // Opt-in: inert until you edit the Android theme / FCM meta-data by hand.
    splashIcon:       { enabled: false },   // drawable-*/splash_icon.png × 5
    notificationIcon: { enabled: false },   // drawable-*/ic_stat_notify.png × 5
    ninePatch:        { enabled: false }    // background.9.png (not implemented yet)
  },
  images: {
    quality: 85,             // JPEG/WebP/AVIF quality (0-100)
    format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' to convert every image
    autoSync: true,          // false = SVG pipeline computes dims but doesn't write to images.files
    confirmOverwrites: true, // prompt before overwriting files (set false to skip)
    files: [
      { filename: 'images/logos/sample.svg', width: 800 }
    ]                // per-file overrides: [{ filename: 'images/<sub>/<name>.<ext>', width, height? }]
  },
  theme: {
    extend: {}
  }
}
