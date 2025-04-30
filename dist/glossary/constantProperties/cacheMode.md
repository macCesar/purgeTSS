```css
// Property: cacheMode
// Description: Determines how a cache is used in this web view.
// Component(s): Ti.UI.WebView
'.cache-mode-webview-load[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_DEFAULT }
'.cache-mode-webview-load-no[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_NO_CACHE }
'.cache-mode-webview-load-only[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_CACHE_ONLY }
'.cache-mode-webview-load-else-network[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_CACHE_ELSE_NETWORK }
```
