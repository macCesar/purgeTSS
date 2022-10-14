```scss
// Property: activityReenterTransition
// Description: The type of transition used when reentering to a previously started activity.
// Component(s): Ti.UI.NavigationWindow, Ti.UI.TabGroup, Ti.UI.Window
'.activity-reenter-transition-explode[platform=android]': { activityReenterTransition: Ti.UI.Android.TRANSITION_EXPLODE }
'.activity-reenter-transition-fade-in[platform=android]': { activityReenterTransition: Ti.UI.Android.TRANSITION_FADE_IN }
'.activity-reenter-transition-fade-out[platform=android]': { activityReenterTransition: Ti.UI.Android.TRANSITION_FADE_OUT }
'.activity-reenter-transition-slide-top[platform=android]': { activityReenterTransition: Ti.UI.Android.TRANSITION_SLIDE_TOP }
'.activity-reenter-transition-slide-right[platform=android]': { activityReenterTransition: Ti.UI.Android.TRANSITION_SLIDE_RIGHT }
'.activity-reenter-transition-slide-bottom[platform=android]': { activityReenterTransition: Ti.UI.Android.TRANSITION_SLIDE_BOTTOM }
'.activity-reenter-transition-slide-left[platform=android]': { activityReenterTransition: Ti.UI.Android.TRANSITION_SLIDE_LEFT }
'.activity-reenter-transition-none[platform=android]': { activityReenterTransition: Ti.UI.Android.TRANSITION_NONE }
```