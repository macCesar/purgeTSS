```scss
// Property: scrollbars
// Description: Enable or disable horizontal/vertical scrollbars in a WebView.
// Component(s): Ti.UI.WebView
'.scrollbars-webview[platform=android]': { scrollbars: Ti.UI.Android.WEBVIEW_SCROLLBARS_DEFAULT }
'.scrollbars-webview-hide-vertical[platform=android]': { scrollbars: Ti.UI.Android.WEBVIEW_SCROLLBARS_HIDE_VERTICAL }
'.scrollbars-webview-hide-horizontal[platform=android]': { scrollbars: Ti.UI.Android.WEBVIEW_SCROLLBARS_HIDE_HORIZONTAL }
'.scrollbars-webview-hide-all[platform=android]': { scrollbars: Ti.UI.Android.WEBVIEW_SCROLLBARS_HIDE_ALL }
```