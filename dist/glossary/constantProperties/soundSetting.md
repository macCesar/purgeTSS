```scss
// Property: soundSetting
// Description: The current sound settings.
// Component(s): GetUserNotificationSettings
'.sound-setting-not-supported[platform=ios]': { soundSetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_NOT_SUPPORTED }
'.sound-setting-enabled[platform=ios]': { soundSetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_ENABLED }
'.sound-setting-disabled[platform=ios]': { soundSetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_DISABLED }
```