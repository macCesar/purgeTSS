```scss
// Property(ies): width, height
// Component(s): Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View
// Description: width and height properties using Ti.Platform.displayCaps platformWidth and platformHeight values
'.platform-w': { width: Ti.Platform.displayCaps.platformWidth }
'.platform-h': { height: Ti.Platform.displayCaps.platformHeight }
'.inverted-platform-w[platform=ios]': { width: Ti.Platform.displayCaps.platformHeight }
'.inverted-platform-h[platform=ios]': { height: Ti.Platform.displayCaps.platformWidth }
'.inverted-platform-w[platform=android]': { width: Ti.Platform.displayCaps.platformWidth }
'.inverted-platform-h[platform=android]': { height: Ti.Platform.displayCaps.platformHeight }
```