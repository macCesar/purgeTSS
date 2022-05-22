```scss
// Component(s): Ti.UI.WebView
// Property(ies): cacheMode - Android Only
'.cache-mode[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_DEFAULT }
'.cache-mode-no-cache[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_NO_CACHE }
'.cache-mode-cache-only[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_CACHE_ONLY }
'.cache-mode-cache-else-network[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_CACHE_ELSE_NETWORK }
'.webview-load[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_DEFAULT }
'.webview-load-no-cache[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_NO_CACHE }
'.webview-load-cache-only[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_CACHE_ONLY }
'.webview-load-cache-else-network[platform=android]': { cacheMode: Ti.UI.Android.WEBVIEW_LOAD_CACHE_ELSE_NETWORK }
```