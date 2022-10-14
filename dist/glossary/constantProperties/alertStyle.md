```scss
// Property: alertStyle
// Description: The current alert style used to display notifications.
// Component(s): GetUserNotificationSettings
'.alert-style-app-none[platform=ios]': { alertStyle: Ti.App.iOS.USER_NOTIFICATION_ALERT_STYLE_NONE }
'.alert-style-app[platform=ios]': { alertStyle: Ti.App.iOS.USER_NOTIFICATION_ALERT_STYLE_ALERT }
'.alert-style-app-banner[platform=ios]': { alertStyle: Ti.App.iOS.USER_NOTIFICATION_ALERT_STYLE_BANNER }
```