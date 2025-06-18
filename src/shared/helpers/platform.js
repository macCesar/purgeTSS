import { processProperties } from './utils.js'
import { globalOptions } from './core.js'

/**
 * Status bar style (iOS only)
 * @returns {string} Generated styles
 */
export function statusBarStyle() {
  return processProperties({
    prop: 'statusBarStyle - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'status-bar': '{ statusBarStyle: {value} }'
  }, {
    ios: {
      default: 'Ti.UI.iOS.StatusBar.DEFAULT',
      dark: 'Ti.UI.iOS.StatusBar.DARK_CONTENT',
      light: 'Ti.UI.iOS.StatusBar.LIGHT_CONTENT'
    }
  })
}

/**
 * Navigation mode (Android only)
 * @returns {string} Generated styles
 */
export function navigationMode() {
  return processProperties({
    prop: 'navigationMode',
    modules: 'Ti.Android.ActionBar'
  }, {
    'navigation-mode': '{ navigationMode: {value} }'
  }, {
    android: {
      standard: 'Ti.Android.NAVIGATION_MODE_STANDARD',
      tabs: 'Ti.Android.NAVIGATION_MODE_TABS'
    }
  })
}

/**
 * Theme configuration (Android only)
 * @returns {string} Generated styles
 */
export function theme() {
  return processProperties({
    prop: 'theme - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    theme: '{ theme: \'{value}\' }'
  }, {
    [(globalOptions.legacy) ? 'android' : 'default']: {
      titanium: {
        default: 'Theme.Titanium',
        'day-night': 'Theme.Titanium.DayNight',
        'day-night-no-title-bar': 'Theme.Titanium.DayNight.NoTitleBar',
        'day-night-fullscreen': 'Theme.Titanium.DayNight.Fullscreen',
        'day-night-solid': 'Theme.Titanium.DayNight.Solid',
        'day-night-solid-no-title-bar': 'Theme.Titanium.DayNight.Solid.NoTitleBar',
        'day-night-solid-fullscreen': 'Theme.Titanium.DayNight.Solid.Fullscreen',
        dark: 'Theme.Titanium.Dark',
        'dark-no-title-bar': 'Theme.Titanium.Dark.NoTitleBar',
        'dark-fullscreen': 'Theme.Titanium.Dark.Fullscreen',
        'dark-solid': 'Theme.Titanium.Dark.Solid',
        'dark-solid-no-title-bar': 'Theme.Titanium.Dark.Solid.NoTitleBar',
        'dark-solid-fullscreen': 'Theme.Titanium.Dark.Solid.Fullscreen',
        light: 'Theme.Titanium.Light',
        'light-no-title-bar': 'Theme.Titanium.Light.NoTitleBar',
        'light-fullscreen': 'Theme.Titanium.Light.Fullscreen',
        'light-solid': 'Theme.Titanium.Light.Solid',
        'light-solid-no-title-bar': 'Theme.Titanium.Light.Solid.NoTitleBar',
        'light-solid-fullscreen': 'Theme.Titanium.Light.Solid.Fullscreen'
      },
      'app-derived': {
        'no-title-bar': 'Theme.AppDerived.NoTitleBar',
        fullscreen: 'Theme.AppDerived.Fullscreen',
        translucent: 'Theme.AppDerived.Translucent',
        'translucent-no-title-bar': 'Theme.AppDerived.Translucent.NoTitleBar',
        'translucent-fullscreen': 'Theme.AppDerived.Translucent.Fullscreen'
      }
    }
  })
}

/**
 * Orientation modes for windows
 * @returns {string} Generated styles
 */
export function orientationModes() {
  let convertedStyles = processProperties({
    prop: 'orientationModes',
    description: 'Array of supported orientation modes, specified using the orientation constants defined in Titanium.UI.',
    modules: 'Ti.UI.NavigationWindow, Ti.UI.TabGroup, Ti.UI.Window, Ti.UI.iOS.SplitWindow'
  }, {
    orientation: '{ orientationModes: {value} }'
  }, {
    default: {
      'landscape-left': '[ Ti.UI.LANDSCAPE_LEFT ]',
      'landscape-right': '[ Ti.UI.LANDSCAPE_RIGHT ]',
      portrait: '[ Ti.UI.PORTRAIT ]',
      'upside-portrait': '[ Ti.UI.UPSIDE_PORTRAIT ]',
      landscape: '[ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]',
      all: '[ Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]'
    }
  })

  convertedStyles += processProperties({
    prop: 'orientationModes (Alternative)',
    description: 'Array of supported orientation modes, specified using the orientation constants defined in Titanium.UI.',
    modules: 'Ti.UI.NavigationWindow, Ti.UI.TabGroup, Ti.UI.Window, Ti.UI.iOS.SplitWindow'
  }, {
    default: '{ orientationModes: {value} }'
  }, {
    default: {
      portrait: '[ Ti.UI.PORTRAIT ]',
      'upside-portrait': '[ Ti.UI.UPSIDE_PORTRAIT ]',
      'landscape-left': '[ Ti.UI.LANDSCAPE_LEFT ]',
      'landscape-right': '[ Ti.UI.LANDSCAPE_RIGHT ]',
      landscape: '[ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]'
    }
  })

  return convertedStyles
}

/**
 * Window pixel format (Android only)
 * @returns {string} Generated styles
 */
export function windowPixelFormat() {
  return processProperties({
    prop: 'windowPixelFormat - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    'window-pixel-format': '{ windowPixelFormat: {value} }'
  }, {
    android: {
      rgb565: 'Ti.UI.Android.PIXEL_FORMAT_RGB_565',
      rgba8888: 'Ti.UI.Android.PIXEL_FORMAT_RGBA_8888',
      rgbx8888: 'Ti.UI.Android.PIXEL_FORMAT_RGBX_8888',
      a8: 'Ti.UI.Android.PIXEL_FORMAT_A_8'
    }
  })
}

/**
 * Window soft input mode (Android only)
 * @returns {string} Generated styles
 */
export function windowSoftInputMode() {
  return processProperties({
    prop: 'windowSoftInputMode - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    'window-soft-input-mode': '{ windowSoftInputMode: {value} }'
  }, {
    android: {
      'adjust-pan': 'Ti.UI.Android.SOFT_INPUT_ADJUST_PAN',
      'adjust-resize': 'Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE',
      'adjust-unspecified': 'Ti.UI.Android.SOFT_INPUT_ADJUST_UNSPECIFIED',
      'state-always-hidden': 'Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN',
      'state-always-visible': 'Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_VISIBLE',
      'state-hidden': 'Ti.UI.Android.SOFT_INPUT_STATE_HIDDEN',
      'state-unspecified': 'Ti.UI.Android.SOFT_INPUT_STATE_UNSPECIFIED',
      'state-visible': 'Ti.UI.Android.SOFT_INPUT_STATE_VISIBLE'
    }
  })
}

/**
 * Large title display mode (iOS only)
 * @returns {string} Generated styles
 */
export function largeTitleDisplayMode() {
  return processProperties({
    prop: 'largeTitleDisplayMode - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'large-title-display-mode': '{ largeTitleDisplayMode: {value} }'
  }, {
    ios: {
      automatic: 'Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_AUTOMATIC',
      always: 'Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_ALWAYS',
      never: 'Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_NEVER'
    }
  })
}

/**
 * Large title enabled (iOS only)
 * @returns {string} Generated styles
 */
export function largeTitleEnabled() {
  return processProperties({
    prop: 'largeTitleEnabled - iOS Only',
    modules: 'Ti.UI.NavigationWindow'
  }, {
    'large-title-enabled': '{ largeTitleEnabled: {value} }'
  }, {
    ios: {
      'large-title-enabled': true,
      'large-title-disabled': false
    }
  })
}

/**
 * Navigation bar hidden (iOS only)
 * @returns {string} Generated styles
 */
export function navBarHidden() {
  return processProperties({
    prop: 'navBarHidden - iOS Only',
    modules: 'Ti.UI.NavigationWindow, Ti.UI.Window'
  }, {
    'nav-bar-hidden': '{ navBarHidden: {value} }'
  }, {
    ios: {
      'nav-bar-hidden': true,
      'nav-bar-visible': false
    }
  })
}

/**
 * Tab bar hidden (iOS only)
 * @returns {string} Generated styles
 */
export function tabBarHidden() {
  return processProperties({
    prop: 'tabBarHidden - iOS Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    'tab-bar-hidden': '{ tabBarHidden: {value} }'
  }, {
    ios: {
      'tab-bar-hidden': true,
      'tab-bar-visible': false
    }
  })
}

/**
 * Hides back button (iOS only)
 * @returns {string} Generated styles
 */
export function hidesBackButton() {
  return processProperties({
    prop: 'hidesBackButton - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'hides-back-button': '{ hidesBackButton: {value} }'
  }, {
    ios: {
      'hides-back-button': true,
      'shows-back-button': false
    }
  })
}

/**
 * Hides bars on swipe (iOS only)
 * @returns {string} Generated styles
 */
export function hidesBarsOnSwipe() {
  return processProperties({
    prop: 'hidesBarsOnSwipe - iOS Only',
    modules: 'Ti.UI.NavigationWindow'
  }, {
    'hides-bars-on-swipe': '{ hidesBarsOnSwipe: {value} }'
  }, {
    ios: {
      'hides-bars-on-swipe': true,
      'shows-bars-on-swipe': false
    }
  })
}

/**
 * Extend edges (iOS only)
 * @returns {string} Generated styles
 */
export function extendEdges() {
  return processProperties({
    prop: 'extendEdges - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'extend-edges': '{ extendEdges: {value} }'
  }, {
    ios: {
      none: '[]',
      top: '[ Ti.UI.EXTEND_EDGE_TOP ]',
      left: '[ Ti.UI.EXTEND_EDGE_LEFT ]',
      bottom: '[ Ti.UI.EXTEND_EDGE_BOTTOM ]',
      right: '[ Ti.UI.EXTEND_EDGE_RIGHT ]',
      all: '[ Ti.UI.EXTEND_EDGE_ALL ]'
    }
  })
}

/**
 * Extend safe area (iOS only)
 * @returns {string} Generated styles
 */
export function extendSafeArea() {
  return processProperties({
    prop: 'extendSafeArea - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'extend-safe-area': '{ extendSafeArea: {value} }'
  }, {
    ios: {
      'extend-safe-area': true,
      'dont-extend-safe-area': false
    }
  })
}

/**
 * Include opaque bars (iOS only)
 * @returns {string} Generated styles
 */
export function includeOpaqueBars() {
  return processProperties({
    prop: 'includeOpaqueBars - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'include-opaque-bars': '{ includeOpaqueBars: {value} }'
  }, {
    ios: {
      'include-opaque-bars': true,
      'exclude-opaque-bars': false
    }
  })
}

/**
 * Flag secure (Android only)
 * @returns {string} Generated styles
 */
export function flagSecure() {
  return processProperties({
    prop: 'flagSecure - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    'flag-secure': '{ flagSecure: {value} }'
  }, {
    android: {
      'flag-secure': true,
      'no-flag-secure': false
    }
  })
}

/**
 * Sustained performance mode (Android only)
 * @returns {string} Generated styles
 */

export function drawerLockMode() {
  return processProperties({
    prop: 'drawerLockMode - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    'drawer-lock-mode': '{ drawerLockMode: {value} }'
  }, {
    android: {
      'locked-closed': 'Ti.UI.Android.DrawerLayout.LOCK_MODE_LOCKED_CLOSED',
      'locked-open': 'Ti.UI.Android.DrawerLayout.LOCK_MODE_LOCKED_OPEN',
      undefined: 'Ti.UI.Android.DrawerLayout.LOCK_MODE_UNDEFINED',
      unlocked: 'Ti.UI.Android.DrawerLayout.LOCK_MODE_UNLOCKED'
    }
  })
}

export function leftDrawerLockMode() {
  return processProperties({
    prop: 'leftDrawerLockMode - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    'left-drawer-lock-mode': '{ leftDrawerLockMode: {value} }'
  }, {
    android: {
      'locked-closed': 'Ti.UI.Android.DrawerLayout.LOCK_MODE_LOCKED_CLOSED',
      'locked-open': 'Ti.UI.Android.DrawerLayout.LOCK_MODE_LOCKED_OPEN',
      undefined: 'Ti.UI.Android.DrawerLayout.LOCK_MODE_UNDEFINED',
      unlocked: 'Ti.UI.Android.DrawerLayout.LOCK_MODE_UNLOCKED'
    }
  })
}

export function rightDrawerLockMode() {
  return processProperties({
    prop: 'rightDrawerLockMode - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    'right-drawer-lock-mode': '{ rightDrawerLockMode: {value} }'
  }, {
    android: {
      'locked-closed': 'Ti.UI.Android.DrawerLayout.LOCK_MODE_LOCKED_CLOSED',
      'locked-open': 'Ti.UI.Android.DrawerLayout.LOCK_MODE_LOCKED_OPEN',
      undefined: 'Ti.UI.Android.DrawerLayout.LOCK_MODE_UNDEFINED',
      unlocked: 'Ti.UI.Android.DrawerLayout.LOCK_MODE_UNLOCKED'
    }
  })
}

export function flags() {
  return processProperties({
    prop: 'flags - Android Only',
    modules: 'Ti.Android.Intent'
  }, {
    flag: '{ flags: {value} }'
  }, {
    android: {
      'activity-brought-to-front': 'Ti.Android.FLAG_ACTIVITY_BROUGHT_TO_FRONT',
      'activity-clear-top': 'Ti.Android.FLAG_ACTIVITY_CLEAR_TOP',
      'activity-clear-when-task-reset': 'Ti.Android.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET',
      'activity-exclude-from-recents': 'Ti.Android.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS',
      'activity-forward-result': 'Ti.Android.FLAG_ACTIVITY_FORWARD_RESULT',
      'activity-launched-from-history': 'Ti.Android.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY',
      'activity-multiple-task': 'Ti.Android.FLAG_ACTIVITY_MULTIPLE_TASK',
      'activity-new-task': 'Ti.Android.FLAG_ACTIVITY_NEW_TASK',
      'activity-no-animation': 'Ti.Android.FLAG_ACTIVITY_NO_ANIMATION',
      'activity-no-history': 'Ti.Android.FLAG_ACTIVITY_NO_HISTORY',
      'activity-no-user-action': 'Ti.Android.FLAG_ACTIVITY_NO_USER_ACTION',
      'activity-previous-is-top': 'Ti.Android.FLAG_ACTIVITY_PREVIOUS_IS_TOP',
      'activity-reorder-to-front': 'Ti.Android.FLAG_ACTIVITY_REORDER_TO_FRONT',
      'activity-reset-task-if-needed': 'Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED',
      'activity-single-top': 'Ti.Android.FLAG_ACTIVITY_SINGLE_TOP',
      'auto-cancel': 'Ti.Android.FLAG_AUTO_CANCEL',
      'cancel-current': 'Ti.Android.FLAG_CANCEL_CURRENT',
      'debug-log-resolution': 'Ti.Android.FLAG_DEBUG_LOG_RESOLUTION',
      'from-background': 'Ti.Android.FLAG_FROM_BACKGROUND',
      'grant-read-uri-permission': 'Ti.Android.FLAG_GRANT_READ_URI_PERMISSION',
      'grant-write-uri-permission': 'Ti.Android.FLAG_GRANT_WRITE_URI_PERMISSION',
      immutable: 'Ti.Android.FLAG_IMMUTABLE',
      insistent: 'Ti.Android.FLAG_INSISTENT',
      mutable: 'Ti.Android.FLAG_MUTABLE',
      'no-clear': 'Ti.Android.FLAG_NO_CLEAR',
      'no-create': 'Ti.Android.FLAG_NO_CREATE',
      'one-shot': 'Ti.Android.FLAG_ONE_SHOT',
      'ongoing-event': 'Ti.Android.FLAG_ONGOING_EVENT',
      'only-alert-once': 'Ti.Android.FLAG_ONLY_ALERT_ONCE',
      'receiver-registered-only': 'Ti.Android.FLAG_RECEIVER_REGISTERED_ONLY',
      'show-lights': 'Ti.Android.FLAG_SHOW_LIGHTS',
      'update-current': 'Ti.Android.FLAG_UPDATE_CURRENT'
    }
  })
}
export function sustainedPerformanceMode() {
  return processProperties({
    prop: 'sustainedPerformanceMode - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    'sustained-performance-mode': '{ sustainedPerformanceMode: {value} }'
  }, {
    android: {
      'sustained-performance-mode': true,
      'no-sustained-performance-mode': false
    }
  })
}
