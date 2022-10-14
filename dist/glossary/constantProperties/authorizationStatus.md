```scss
// Property: authorizationStatus
// Description: The current authorization status for using notifications.
// Component(s): GetUserNotificationSettings
'.authorization-status-app-not-determined[platform=ios]': { authorizationStatus: Ti.App.iOS.USER_NOTIFICATION_AUTHORIZATION_STATUS_NOT_DETERMINED }
'.authorization-status-app-authorized[platform=ios]': { authorizationStatus: Ti.App.iOS.USER_NOTIFICATION_AUTHORIZATION_STATUS_AUTHORIZED }
'.authorization-status-app-denied[platform=ios]': { authorizationStatus: Ti.App.iOS.USER_NOTIFICATION_AUTHORIZATION_STATUS_DENIED }
'.authorization-status-app-provisional[platform=ios]': { authorizationStatus: Ti.App.iOS.USER_NOTIFICATION_AUTHORIZATION_STATUS_PROVISIONAL }
```