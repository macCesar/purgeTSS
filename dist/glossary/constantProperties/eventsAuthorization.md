```scss
// Property: eventsAuthorization
// Description: Returns an authorization constant indicating if the application has access to the events in the EventKit. Removed in 8.1.0. Use the Titanium.Calendar.calendarAuthorization property instead.
// Component(s): Ti.Calendar
'.events-authorization-calendar-authorized': { eventsAuthorization: Ti.Calendar.AUTHORIZATION_AUTHORIZED }
'.events-authorization-calendar-denied': { eventsAuthorization: Ti.Calendar.AUTHORIZATION_DENIED }
'.events-authorization-calendar-restricted': { eventsAuthorization: Ti.Calendar.AUTHORIZATION_RESTRICTED }
'.events-authorization-calendar-unknown': { eventsAuthorization: Ti.Calendar.AUTHORIZATION_UNKNOWN }
```