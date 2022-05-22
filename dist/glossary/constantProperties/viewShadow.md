```scss
// Component(s): Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.View
// Property(ies): elevation - Box Shadow Effect in Tailwind - Android Only
'.shadow-xs[platform=android]': { elevation: 4 }
'.shadow-sm[platform=android]': { elevation: 8 }
'.shadow[platform=android]': { elevation: 16 }
'.shadow-md[platform=android]': { elevation: 24 }
'.shadow-lg[platform=android]': { elevation: 26 }
'.shadow-xl[platform=android]': { elevation: 34 }
'.shadow-2xl[platform=android]': { elevation: 38 }
'.shadow-inner[platform=android]': { elevation: 0 }
'.shadow-outline[platform=android]': { elevation: 16 }
'.shadow-none[platform=android]': { elevation: 0 }

// Component(s): Ti.UI.View
// Property(ies): viewShadowOffset, viewShadowRadius, viewShadowColor - Box Shadow Effect in Tailwind - iOS Only
'.shadow-xs[platform=ios]': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: '#80000000' }
'.shadow-sm[platform=ios]': { viewShadowOffset: { x: 0, y: 1 }, viewShadowRadius: 2, viewShadowColor: '#80000000' }
'.shadow[platform=ios]': { viewShadowOffset: { x: 0, y: 2 }, viewShadowRadius: 4, viewShadowColor: '#80000000' }
'.shadow-md[platform=ios]': { viewShadowOffset: { x: 0, y: 3 }, viewShadowRadius: 6, viewShadowColor: '#80000000' }
'.shadow-lg[platform=ios]': { viewShadowOffset: { x: 0, y: 4 }, viewShadowRadius: 8, viewShadowColor: '#80000000' }
'.shadow-xl[platform=ios]': { viewShadowOffset: { x: 0, y: 6 }, viewShadowRadius: 12, viewShadowColor: '#80000000' }
'.shadow-2xl[platform=ios]': { viewShadowOffset: { x: 0, y: 8 }, viewShadowRadius: 14, viewShadowColor: '#80000000' }
'.shadow-inner[platform=ios]': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }
'.shadow-outline[platform=ios]': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 4, viewShadowColor: '#80000000' }
'.shadow-none[platform=ios]': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }
```