```scss
// Property: carPlaySetting
// Description: The current CarPlay settings.
// Component(s): GetUserNotificationSettings
'.car-play-setting-app-not-supported[platform=ios]': { carPlaySetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_NOT_SUPPORTED }
'.car-play-setting-app-enabled[platform=ios]': { carPlaySetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_ENABLED }
'.car-play-setting-app-disabled[platform=ios]': { carPlaySetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_DISABLED }
```