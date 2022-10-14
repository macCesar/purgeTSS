```scss
// Property: lockscreenVisibility
// Description: Whether or not notifications posted to this channel are shown on the lockscreen in full or redacted form.
// Component(s): Ti.Android.NotificationChannel
'.lockscreen-visibility-private[platform=android]': { lockscreenVisibility: Ti.Android.VISIBILITY_PRIVATE }
'.lockscreen-visibility-public[platform=android]': { lockscreenVisibility: Ti.Android.VISIBILITY_PUBLIC }
'.lockscreen-visibility-secret[platform=android]': { lockscreenVisibility: Ti.Android.VISIBILITY_SECRET }
```