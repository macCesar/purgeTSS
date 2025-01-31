```css
// Property: carPlaySetting
// Description: The current CarPlay settings.
// Component(s): GetUserNotificationSettings
'.car-play-setting-not-supported[platform=ios]': { carPlaySetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_NOT_SUPPORTED }
'.car-play-setting-enabled[platform=ios]': { carPlaySetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_ENABLED }
'.car-play-setting-disabled[platform=ios]': { carPlaySetting: Ti.App.iOS.USER_NOTIFICATION_SETTING_DISABLED }
```