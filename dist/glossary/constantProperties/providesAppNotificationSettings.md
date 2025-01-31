```css
// Property: providesAppNotificationSettings
// Description: A Boolean value indicating the system displays a button for in-app notification settings. Available in Titanium SDK 7.4.0 and later.
// Component(s): GetUserNotificationSettings
'.provides-app-notification-settings-not-supported[platform=ios]': { providesAppNotificationSettings: Ti.App.iOS.USER_NOTIFICATION_SETTING_NOT_SUPPORTED }
'.provides-app-notification-settings-enabled[platform=ios]': { providesAppNotificationSettings: Ti.App.iOS.USER_NOTIFICATION_SETTING_ENABLED }
'.provides-app-notification-settings-disabled[platform=ios]': { providesAppNotificationSettings: Ti.App.iOS.USER_NOTIFICATION_SETTING_DISABLED }
```