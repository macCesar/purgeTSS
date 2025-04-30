```css
// Property(ies): width, height
// Component(s): Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View
// Description: width and height properties using Ti.Platform.displayCaps platformWidth and platformHeight values
'.platform-w': { width: Ti.Platform.displayCaps.platformWidth }
'.platform-h': { height: Ti.Platform.displayCaps.platformHeight }
'.inverted-platform-w[platform=ios]': { width: Ti.Platform.displayCaps.platformHeight }
'.inverted-platform-h[platform=ios]': { height: Ti.Platform.displayCaps.platformWidth }
'.inverted-platform-w[platform=android]': { width: Ti.Platform.displayCaps.platformWidth }
'.inverted-platform-h[platform=android]': { height: Ti.Platform.displayCaps.platformHeight }
'.platform-wh': { width: Ti.Platform.displayCaps.platformWidth, height: Ti.Platform.displayCaps.platformHeight }
'.platform-w-inverted[platform=ios]': { width: Ti.Platform.displayCaps.platformHeight }
'.platform-h-inverted[platform=ios]': { height: Ti.Platform.displayCaps.platformWidth }
'.platform-wh-inverted[platform=ios]': { width: Ti.Platform.displayCaps.platformHeight, height: Ti.Platform.displayCaps.platformWidth }
'.platform-w-inverted[platform=android]': { width: Ti.Platform.displayCaps.platformWidth }
'.platform-h-inverted[platform=android]': { height: Ti.Platform.displayCaps.platformHeight }
'.platform-wh-inverted[platform=android]': { width: Ti.Platform.displayCaps.platformWidth, height: Ti.Platform.displayCaps.platformHeight }
```
