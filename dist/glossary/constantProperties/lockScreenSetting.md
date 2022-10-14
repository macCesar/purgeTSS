```scss
// Property: lockScreenSetting
// Description: The current lock-screen settings.
// Component(s): GetUserNotificationSettings
'.lock-screen-setting-app-not-supported[platform=ios]': { lockScreenSetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_NOT_SUPPORTED }
'.lock-screen-setting-app-enabled[platform=ios]': { lockScreenSetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_ENABLED }
'.lock-screen-setting-app-disabled[platform=ios]': { lockScreenSetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_DISABLED }
```