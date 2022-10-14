```scss
// Property: criticalAlertSetting
// Description: The authorization status to play sounds for critical alerts. Available in Titanium SDK 7.4.0 and later.
// Component(s): GetUserNotificationSettings
'.critical-alert-setting-app-not-supported[platform=ios]': { criticalAlertSetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_NOT_SUPPORTED }
'.critical-alert-setting-app-enabled[platform=ios]': { criticalAlertSetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_ENABLED }
'.critical-alert-setting-app-disabled[platform=ios]': { criticalAlertSetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_DISABLED }
```