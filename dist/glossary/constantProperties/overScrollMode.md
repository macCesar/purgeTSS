```scss
// Property(ies): overScrollMode - Android Only
// Component(s): Ti.UI.ScrollableView, Ti.UI.ScrollView, Ti.UI.TableView, Ti.UI.WebView
'.over-scroll-always[platform=android]': { overScrollMode: Ti.UI.Android.OVER_SCROLL_ALWAYS }
'.over-scroll-if-content-scrolls[platform=android]': { overScrollMode: Ti.UI.Android.OVER_SCROLL_IF_CONTENT_SCROLLS }
'.over-scroll-never[platform=android]': { overScrollMode: Ti.UI.Android.OVER_SCROLL_NEVER }
```