import _ from 'lodash'
import { processProperties, processComments } from './utils.js'

/**
 * Visible property for UI components
 * @returns {string} Generated styles
 */
export function visible() {
  return processProperties({
    prop: 'visible (Alternative)',
    modules: 'Ti.UI.View, Ti.Android.ActionBar, Ti.Android.MenuItem, Ti.Media.VideoPlayer, Ti.UI.Android.CardView, Ti.UI.Android.DrawerLayout, Ti.UI.Android.SearchView, Ti.UI.Animation, Ti.UI.Button, Ti.UI.ButtonBar, Ti.UI.DashboardView, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ListView, Ti.UI.MaskedImage, Ti.UI.NavigationWindow, Ti.UI.OptionBar, Ti.UI.Picker, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.ScrollView, Ti.UI.ScrollableView, Ti.UI.SearchBar, Ti.UI.ShortcutItem, Ti.UI.Slider, Ti.UI.Switch, Ti.UI.TabGroup, Ti.UI.TabbedBar, Ti.UI.TableView, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Toolbar, Ti.UI.WebView, Ti.UI.Window, Ti.UI.iOS.BlurView, Ti.UI.iOS.CoverFlowView, Ti.UI.iOS.LivePhotoView, Ti.UI.iOS.SplitWindow, Ti.UI.iOS.Stepper'
  }, {
    default: '{ visible: {value} }'
  }, {
    default: {
      block: true,
      hidden: false
    }
  })
}

/**
 * Enabled property for UI components
 * @returns {string} Generated styles
 */
export function enabled() {
  return processProperties({
    prop: 'enabled',
    modules: 'Ti.UI.Button, Ti.UI.iOS.Stepper, Ti.Android.MenuItem, Ti.UI.Slider, Ti.UI.Switch'
  }, {
    default: '{ enabled: {value} }'
  }, {
    default: {
      enabled: true,
      disabled: false
    }
  })
}

/**
 * Focusable property for UI components
 * @returns {string} Generated styles
 */
export function focusable() {
  return processProperties({
    prop: 'focusable',
    modules: 'Ti.UI.View, Ti.UI.Button, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ScrollView, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ focusable: {value} }'
  }, {
    default: {
      focusable: true,
      'not-focusable': false
    }
  })
}

/**
 * Touch enabled property for UI components
 * @returns {string} Generated styles
 */
export function touchEnabled() {
  return processProperties({
    prop: 'touchEnabled ( Alternative )',
    modules: 'Ti.UI.View'
  }, {
    default: '{ touchEnabled: {value} }'
  }, {
    default: {
      'pointer-events-auto': true,
      'pointer-events-none': false
    }
  })
}

/**
 * Touch feedback property (Android only)
 * @returns {string} Generated styles
 */
export function touchFeedback() {
  return processProperties({
    prop: 'touchFeedback - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ touchFeedback: {value} }'
  }, {
    android: {
      'touch-feedback': true,
      'no-touch-feedback': false
    }
  })
}

/**
 * Bubble parent property for event handling
 * @returns {string} Generated styles
 */
export function bubbleParent() {
  return processProperties({
    prop: 'bubbleParent',
    modules: 'Ti.UI.View'
  }, {
    default: '{ bubbleParent: {value} }'
  }, {
    default: {
      'bubble-parent': true,
      'no-bubble-parent': false
    }
  })
}

/**
 * Opacity property for UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function opacity(modifiersAndValues) {
  return processProperties({
    prop: 'opacity',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View'
  }, {
    opacity: '{ opacity: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Z-index property for layering
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function zIndex(modifiersAndValues) {
  return processProperties({
    prop: 'zIndex',
    modules: 'Ti.UI.View'
  }, {
    z: '{ zIndex: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Elevation property (Android only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function elevation(modifiersAndValues) {
  return processProperties({
    prop: 'elevation - Android Only',
    modules: 'Ti.UI.View'
  }, {
    elevation: '{ elevation: {value} }'
  }, {
    android: modifiersAndValues
  })
}

/**
 * Border style property
 * @returns {string} Generated styles
 */
export function borderStyle() {
  return processProperties({
    prop: 'borderStyle - iOS Only',
    modules: 'Ti.UI.View, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    border: '{ borderStyle: {value} }'
  }, {
    ios: {
      solid: 'Ti.UI.INPUT_BORDERSTYLE_BEZEL',
      none: 'Ti.UI.INPUT_BORDERSTYLE_NONE',
      line: 'Ti.UI.INPUT_BORDERSTYLE_LINE',
      rounded: 'Ti.UI.INPUT_BORDERSTYLE_ROUNDED'
    }
  })
}

/**
 * Border width property
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function borderWidth(modifiersAndValues) {
  return processProperties({
    prop: 'borderWidth',
    modules: 'Ti.UI.View'
  }, {
    'border-w': '{ borderWidth: {value} }',
    'border-l': '{ borderLeft: {value} }',
    'border-r': '{ borderRight: {value} }',
    'border-t': '{ borderTop: {value} }',
    'border-b': '{ borderBottom: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Border radius property
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function borderRadius({ ...modifiersAndValues }) {
  delete modifiersAndValues[0]
  delete modifiersAndValues.full
  delete modifiersAndValues.auto
  delete modifiersAndValues.screen

  _.each(modifiersAndValues, (value, key) => {
    if (key.includes('/')) {
      delete modifiersAndValues[key]
    } else if (['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'px', 'DEFAULT'].includes(key)) {
      modifiersAndValues[key] = value
    } else {
      modifiersAndValues[key] = value
    }
  })

  return processProperties({
    prop: 'borderRadius ( with Extra Styles )',
    modules: 'Ti.UI.View, Ti.Media.VideoPlayer, Ti.UI.Android.CardView, Ti.UI.Android.DrawerLayout, Ti.UI.Android.SearchView, Ti.UI.Button, Ti.UI.ButtonBar, Ti.UI.DashboardView, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ListView, Ti.UI.MaskedImage, Ti.UI.NavigationWindow, Ti.UI.OptionBar, Ti.UI.Picker, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.ScrollView, Ti.UI.ScrollableView, Ti.UI.SearchBar, Ti.UI.Slider, Ti.UI.Switch, Ti.UI.TabbedBar, Ti.UI.TableView, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Toolbar, Ti.UI.WebView, Ti.UI.Window, Ti.UI.iOS.BlurView, Ti.UI.iOS.CoverFlowView, Ti.UI.iOS.LivePhotoView, Ti.UI.iOS.SplitWindow, Ti.UI.iOS.Stepper'
  }, {
    rounded: '{ borderRadius: {value} }',

    'rounded-t': '{ borderRadius: [{value}, {value}, 0, 0] }',
    'rounded-r': '{ borderRadius: [0, {value}, {value}, 0] }',
    'rounded-b': '{ borderRadius: [0, 0, {value}, {value}] }',
    'rounded-l': '{ borderRadius: [{value}, 0, 0, {value}] }',

    'rounded-tl': '{ borderRadius: [{value}, 0, 0, 0] }',
    'rounded-tr': '{ borderRadius: [0, {value}, 0, 0] }',
    'rounded-br': '{ borderRadius: [0, 0, {value}, 0] }',
    'rounded-bl': '{ borderRadius: [0, 0, 0, {value}] }',

    'rounded-tl-br': '{ borderRadius: [{value}, 0, {value}, 0] }',
    'rounded-tr-bl': '{ borderRadius: [0, {value}, 0, {value}] }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Border radius full (circular)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */

export function accessoryType() {
  return processProperties({
    prop: 'accessoryType',
    modules: 'Ti.UI.ListItem'
  }, {
    'accesory-type': '{ accessoryType: {value} }'
  }, {
    default: {
      checkmark: 'Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK',
      detail: 'Ti.UI.LIST_ACCESSORY_TYPE_DETAIL',
      disclosure: 'Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE',
      none: 'Ti.UI.LIST_ACCESSORY_TYPE_NONE'
    }
  })
}

export function activeIconIsMask() {
  return processProperties({
    prop: 'activeIconIsMask - iOS Only',
    modules: 'Ti.UI.Tab'
  }, {
    default: '{ activeIconIsMask: {value} }'
  }, {
    ios: {
      'active-icon-is': {
        mask: true,
        'not-mask': false
      }
    }
  })
}

export function alertDialogStyle() {
  return processProperties({
    prop: 'style - iOS Only',
    modules: 'Ti.UI.AlertDialog'
  }, {
    alert: '{ style: {value} }'
  }, {
    ios: {
      'dialog-style': {
        default: 'Ti.UI.iOS.AlertDialogStyle.DEFAULT',
        'login-and-password': 'Ti.UI.iOS.AlertDialogStyle.LOGIN_AND_PASSWORD_INPUT',
        'plain-text-input': 'Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT',
        'secure-text-input': 'Ti.UI.iOS.AlertDialogStyle.SECURE_TEXT_INPUT'
      }
    }
  })
}

export function audioStreamType() {
  return processProperties({
    prop: 'audioStreamType - Android Only',
    modules: 'Ti.Android.Notification'
  }, {
    default: '{ audioStreamType: {value} }'
  }, {
    android: {
      'audio-stream-type-alarm': 'Ti.Android.STREAM_ALARM',
      'audio-stream-type-music': 'Ti.Android.STREAM_MUSIC',
      'audio-stream-type-notification': 'Ti.Android.STREAM_NOTIFICATION',
      'audio-stream-type-ring': 'Ti.Android.STREAM_RING',
      'audio-stream-type-system': 'Ti.Android.STREAM_SYSTEM',
      'audio-stream-type-voice-call': 'Ti.Android.STREAM_VOICE_CALL',
      'audio-stream-type': 'Ti.Android.STREAM_DEFAULT'
    }
  })
}

export function calendarViewShown() {
  return processProperties({
    prop: 'calendarViewShown - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    'calendar-view': '{ calendarViewShown: {value} }'
  }, {
    android: {
      shown: true,
      hidden: false
    }
  })
}

export function category() {
  return processProperties({
    prop: 'category - Android Only',
    modules: 'Ti.Android.Notification'
  }, {
    default: '{ category: {value} }'
  }, {
    android: {
      'category-alarm': 'Ti.Android.CATEGORY_ALARM',
      'category-alternative': 'Ti.Android.CATEGORY_ALTERNATIVE',
      'category-browsable': 'Ti.Android.CATEGORY_BROWSABLE',
      'category-call': 'Ti.Android.CATEGORY_CALL',
      'category-default': 'Ti.Android.CATEGORY_DEFAULT',
      'category-development-preference': 'Ti.Android.CATEGORY_DEVELOPMENT_PREFERENCE',
      'category-email': 'Ti.Android.CATEGORY_EMAIL',
      'category-embed': 'Ti.Android.CATEGORY_EMBED',
      'category-error': 'Ti.Android.CATEGORY_ERROR',
      'category-event': 'Ti.Android.CATEGORY_EVENT',
      'category-framework-instrumentation-test': 'Ti.Android.CATEGORY_FRAMEWORK_INSTRUMENTATION_TEST',
      'category-home': 'Ti.Android.CATEGORY_HOME',
      'category-info': 'Ti.Android.CATEGORY_INFO',
      'category-launcher': 'Ti.Android.CATEGORY_LAUNCHER',
      'category-message': 'Ti.Android.CATEGORY_MESSAGE',
      'category-monkey': 'Ti.Android.CATEGORY_MONKEY',
      'category-openable': 'Ti.Android.CATEGORY_OPENABLE',
      'category-preference': 'Ti.Android.CATEGORY_PREFERENCE',
      'category-progress': 'Ti.Android.CATEGORY_PROGRESS',
      'category-promo': 'Ti.Android.CATEGORY_PROMO',
      'category-recommendation': 'Ti.Android.CATEGORY_RECOMMENDATION',
      'category-sample-code': 'Ti.Android.CATEGORY_SAMPLE_CODE',
      'category-selected-alternative': 'Ti.Android.CATEGORY_SELECTED_ALTERNATIVE',
      'category-service': 'Ti.Android.CATEGORY_SERVICE',
      'category-social': 'Ti.Android.CATEGORY_SOCIAL',
      'category-status': 'Ti.Android.CATEGORY_STATUS',
      'category-tab': 'Ti.Android.CATEGORY_TAB',
      'category-test': 'Ti.Android.CATEGORY_TEST',
      'category-transport': 'Ti.Android.CATEGORY_TRANSPORT',
      'category-unit-test': 'Ti.Android.CATEGORY_UNIT_TEST'
    }
  })
}

export function checkable() {
  return processProperties({
    prop: 'checkable - Android Only',
    modules: 'Ti.Android.MenuItem'
  }, {
    default: '{ checkable: {value} }'
  }, {
    android: {
      checable: true,
      unchecable: false
    }
  })
}

export function clipMode() {
  return processProperties({
    prop: 'clipMode - iOS Only',
    modules: 'Ti.UI.View'
  }, {
    clip: '{ clipMode: {value} }'
  }, {
    ios: {
      enabled: 'Ti.UI.iOS.CLIP_MODE_ENABLED',
      disabled: 'Ti.UI.iOS.CLIP_MODE_DISABLED'
    }
  })
}

export function defaultItemTemplate() {
  return processProperties({
    prop: 'defaultItemTemplate',
    modules: 'Ti.UI.ListView'
  }, {
    'list-item-template': '{ defaultItemTemplate: {value} }'
  }, {
    default: {
      default: 'Ti.UI.LIST_ITEM_TEMPLATE_DEFAULT',
      contacts: 'Ti.UI.LIST_ITEM_TEMPLATE_CONTACTS',
      settings: 'Ti.UI.LIST_ITEM_TEMPLATE_SETTINGS',
      subtitle: 'Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE'
    }
  })
}

export function displayHomeAsUp() {
  return processProperties({
    prop: 'displayHomeAsUp - Android Only',
    modules: 'Ti.Android.ActionBar'
  }, {
    default: '{ displayHomeAsUp: {value} }'
  }, {
    android: {
      'display-home-as-up': true,
      'dont-display-home-as-up': false
    }
  })
}

export function dropShadow() {
  const shadowValue = '#80000000'
  let convertedStyles = processComments({
    prop: 'shadowOffset, shadowRadius, shadowColor',
    modules: 'Ti.UI.Button, Ti.UI.Label'
  })
  convertedStyles += `'.drop-shadow-xs': { shadowOffset: { x: 0, y: 0 }, shadowRadius: 1, shadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.drop-shadow-sm': { shadowOffset: { x: 0, y: 1 }, shadowRadius: 2, shadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.drop-shadow': { shadowOffset: { x: 0, y: 2 }, shadowRadius: 4, shadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.drop-shadow-md': { shadowOffset: { x: 0, y: 3 }, shadowRadius: 6, shadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.drop-shadow-lg': { shadowOffset: { x: 0, y: 4 }, shadowRadius: 8, shadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.drop-shadow-xl': { shadowOffset: { x: 0, y: 6 }, shadowRadius: 12, shadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.drop-shadow-2xl': { shadowOffset: { x: 0, y: 8 }, shadowRadius: 14, shadowColor: '${shadowValue}' }\n`
  convertedStyles += '\'.drop-shadow-none\': { shadowOffset: { x: 0, y: 0 }, shadowRadius: null, shadowColor: null }\n'

  return convertedStyles
}

export function exitOnClose() {
  return processProperties({
    prop: 'exitOnClose - Android Only',
    modules: 'Ti.UI.TabGroup, Ti.UI.Window'
  }, {
    default: '{ exitOnClose: {value} }'
  }, {
    android: {
      'exit-on-close': true,
      'dont-exit-on-close': false
    }
  })
}

export function extendBackground() {
  return processProperties({
    prop: 'extendBackground',
    modules: 'Ti.UI.Toolbar'
  }, {
    default: '{ extendBackground: {value} }'
  }, {
    default: {
      'extend-background': true,
      'dont-extend-background': false
    }
  })
}

export function fullscreen() {
  return processProperties({
    prop: 'fullscreen',
    modules: 'Ti.Media.VideoPlayer[android], Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Window'
  }, {
    fullscreen: '{ fullscreen: {value} }'
  }, {
    default: {
      default: true,
      disabled: false
    }
  })
}

export function gravity() {
  return processProperties({
    prop: 'gravity - Android Only',
    modules: 'Ti.UI.Notification'
  }, {
    gravity: '{ gravity: {value} }'
  }, {
    android: {
      'axis-clip': 'Ti.UI.Android.GRAVITY_AXIS_CLIP',
      'axis-pull-after': 'Ti.UI.Android.GRAVITY_AXIS_PULL_AFTER',
      'axis-pull-before': 'Ti.UI.Android.GRAVITY_AXIS_PULL_BEFORE',
      'axis-specified': 'Ti.UI.Android.GRAVITY_AXIS_SPECIFIED',
      'axis-x-shift': 'Ti.UI.Android.GRAVITY_AXIS_X_SHIFT',
      'axis-y-shift': 'Ti.UI.Android.GRAVITY_AXIS_Y_SHIFT',
      bottom: 'Ti.UI.Android.GRAVITY_BOTTOM',
      'center-horizontal': 'Ti.UI.Android.GRAVITY_CENTER_HORIZONTAL',
      'center-vertical': 'Ti.UI.Android.GRAVITY_CENTER_VERTICAL',
      center: 'Ti.UI.Android.GRAVITY_CENTER',
      'clip-horizontal': 'Ti.UI.Android.GRAVITY_CLIP_HORIZONTAL',
      'clip-vertical': 'Ti.UI.Android.GRAVITY_CLIP_VERTICAL',
      'display-clip-horizontal': 'Ti.UI.Android.GRAVITY_DISPLAY_CLIP_HORIZONTAL',
      'display-clip-vertical': 'Ti.UI.Android.GRAVITY_DISPLAY_CLIP_VERTICAL',
      end: 'Ti.UI.Android.GRAVITY_END',
      'fill-horizontal': 'Ti.UI.Android.GRAVITY_FILL_HORIZONTAL',
      'fill-vertical': 'Ti.UI.Android.GRAVITY_FILL_VERTICAL',
      fill: 'Ti.UI.Android.GRAVITY_FILL',
      'horizontal-gravity-mask': 'Ti.UI.Android.GRAVITY_HORIZONTAL_GRAVITY_MASK',
      left: 'Ti.UI.Android.GRAVITY_LEFT',
      'no-gravity': 'Ti.UI.Android.GRAVITY_NO_GRAVITY',
      'relative-horizontal-gravity-mask': 'Ti.UI.Android.GRAVITY_RELATIVE_HORIZONTAL_GRAVITY_MASK',
      'relative-layout-direction': 'Ti.UI.Android.GRAVITY_RELATIVE_LAYOUT_DIRECTION',
      right: 'Ti.UI.Android.GRAVITY_RIGHT',
      start: 'Ti.UI.Android.GRAVITY_START',
      top: 'Ti.UI.Android.GRAVITY_TOP',
      'vertical-gravity-mask': 'Ti.UI.Android.GRAVITY_VERTICAL_GRAVITY_MASK'
    }
  })
}

export function hasCheck() {
  return processProperties({
    prop: 'hasCheck',
    modules: 'Ti.UI.TableViewRow'
  }, {
    default: '{ hasCheck: {value} }'
  }, {
    default: {
      'has-check': true,
      'dont-have-check': false
    }
  })
}

export function hasChild() {
  return processProperties({
    prop: 'hasChild',
    modules: 'Ti.UI.TableViewRow'
  }, {
    default: '{ hasChild: {value} }'
  }, {
    default: {
      'has-child': true,
      'dont-have-child': false
    }
  })
}

export function hasDetail() {
  return processProperties({
    prop: 'hasDetail',
    modules: 'Ti.UI.TableViewRow'
  }, {
    default: '{ hasDetail: {value} }'
  }, {
    default: {
      'has-detail': true,
      'dont-have-detail': false
    }
  })
}

export function hiddenBehavior() {
  return processProperties({
    prop: 'hiddenBehavior - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ hiddenBehavior: {value} }'
  }, {
    android: {
      'hidden-behavior': true,
      'no-hidden-behavior': false
    }
  })
}

export function hideLoadIndicator() {
  return processProperties({
    prop: 'hideLoadIndicator - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ hideLoadIndicator: {value} }'
  }, {
    ios: {
      'hide-load-indicator': true,
      'show-load-indicator': false
    }
  })
}

export function hideShadow() {
  return processProperties({
    prop: 'hideShadow - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ hideShadow: {value} }'
  }, {
    ios: {
      'hide-shadow': true,
      'show-shadow': false
    }
  })
}

export function hintType() {
  return processProperties({
    prop: 'hintType - Android Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'hint-type': '{ hintType: {value} }'
  }, {
    android: {
      static: 'Ti.UI.HINT_TYPE_STATIC',
      animated: 'Ti.UI.HINT_TYPE_ANIMATED'
    }
  })
}

export function homeButtonEnabled() {
  return processProperties({
    prop: 'homeButtonEnabled - Android Only',
    modules: 'Ti.Android.ActionBar'
  }, {
    'home-button': '{ homeButtonEnabled: {value} }'
  }, {
    android: {
      enabled: true,
      disabled: false
    }
  })
}

export function homeIndicatorAutoHidden() {
  return processProperties({
    prop: 'homeIndicatorAutoHidden - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'home-indicator': '{ homeIndicatorAutoHidden: {value} }'
  }, {
    ios: {
      'auto-hidden': true,
      'always-visible': false
    }
  })
}

export function horizontalWrap() {
  return processProperties({
    prop: 'horizontalWrap - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ horizontalWrap: {value} }'
  }, {
    android: {
      'horizontal-wrap': true,
      'no-horizontal-wrap': false
    }
  })
}

export function html() {
  return processProperties({
    prop: 'html',
    modules: 'Ti.UI.EmailDialog'
  }, {
    default: '{ html: {value} }'
  }, {
    default: {
      html: true
    }
  })
}

export function icon() {
  let convertedStyles = processProperties({
    prop: 'icon - iOS Only',
    modules: 'Ti.UI.ShortcutItem'
  }, {
    'shortcut-icon-type': '{ icon: \'{value}\' }'
  }, {
    ios: {
      add: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_ADD',
      alarm: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_ALARM',
      audio: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_AUDIO',
      bookmark: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_BOOKMARK',
      'capture-photo': 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_CAPTURE_PHOTO',
      'capture-video': 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_CAPTURE_VIDEO',
      cloud: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_CLOUD',
      compose: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_COMPOSE',
      confirmation: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_CONFIRMATION',
      contact: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_CONTACT',
      date: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_DATE',
      favorite: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_FAVORITE',
      home: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_HOME',
      invitation: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_INVITATION',
      location: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_LOCATION',
      love: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_LOVE',
      mail: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_MAIL',
      'mark-location': 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_MARK_LOCATION',
      message: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_MESSAGE',
      pause: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_PAUSE',
      play: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_PLAY',
      prohibit: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_PROHIBIT',
      search: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_SEARCH',
      share: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_SHARE',
      shuffle: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_SHUFFLE',
      'task-completed': 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_TASK_COMPLETED',
      task: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_TASK',
      time: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_TIME',
      update: 'Ti.UI.iOS.SHORTCUT_ICON_TYPE_UPDATE'
    }
  })

  convertedStyles += processProperties({
    prop: 'icon - Android Only',
    modules: 'Ti.Android.R'
  }, {
    'r-drawable': '{ icon: {value} }'
  }, {
    android: {
      'alert-dark-frame': 'Ti.Android.R.drawable.alert_dark_frame',
      'alert-light-frame': 'Ti.Android.R.drawable.alert_light_frame',
      'arrow-down-float': 'Ti.Android.R.drawable.arrow_down_float',
      'arrow-up-float': 'Ti.Android.R.drawable.arrow_up_float',
      'bottom-bar': 'Ti.Android.R.drawable.bottom_bar',
      'btn-default': 'Ti.Android.R.drawable.btn_default',
      'btn-default-small': 'Ti.Android.R.drawable.btn_default_small',
      'btn-dialog': 'Ti.Android.R.drawable.btn_dialog',
      'btn-dropdown': 'Ti.Android.R.drawable.btn_dropdown',
      'btn-minus': 'Ti.Android.R.drawable.btn_minus',
      'btn-plus': 'Ti.Android.R.drawable.btn_plus',
      'btn-radio': 'Ti.Android.R.drawable.btn_radio',
      'btn-star': 'Ti.Android.R.drawable.btn_star',
      'btn-star-big-off': 'Ti.Android.R.drawable.btn_star_big_off',
      'btn-star-big-on': 'Ti.Android.R.drawable.btn_star_big_on',
      'button-onoff-indicator-off': 'Ti.Android.R.drawable.button_onoff_indicator_off',
      'button-onoff-indicator-on': 'Ti.Android.R.drawable.button_onoff_indicator_on',
      'checkbox-off-background': 'Ti.Android.R.drawable.checkbox_off_background',
      'checkbox-on-background': 'Ti.Android.R.drawable.checkbox_on_background',
      'dark-header': 'Ti.Android.R.drawable.dark_header',
      'dialog-frame': 'Ti.Android.R.drawable.dialog_frame',
      'dialog-holo-dark-frame': 'Ti.Android.R.drawable.dialog_holo_dark_frame',
      'dialog-holo-light-frame': 'Ti.Android.R.drawable.dialog_holo_light_frame',
      'divider-horizontal-bright': 'Ti.Android.R.drawable.divider_horizontal_bright',
      'divider-horizontal-dark': 'Ti.Android.R.drawable.divider_horizontal_dark',
      'divider-horizontal-dim-dark': 'Ti.Android.R.drawable.divider_horizontal_dim_dark',
      'divider-horizontal-textfield': 'Ti.Android.R.drawable.divider_horizontal_textfield',
      'edit-text': 'Ti.Android.R.drawable.edit_text',
      'editbox-background': 'Ti.Android.R.drawable.editbox_background',
      'editbox-background-normal': 'Ti.Android.R.drawable.editbox_background_normal',
      'editbox-dropdown-dark-frame': 'Ti.Android.R.drawable.editbox_dropdown_dark_frame',
      'editbox-dropdown-light-frame': 'Ti.Android.R.drawable.editbox_dropdown_light_frame',
      'gallery-thumb': 'Ti.Android.R.drawable.gallery_thumb',
      'ic-btn-speak-now': 'Ti.Android.R.drawable.ic_btn_speak_now',
      'ic-delete': 'Ti.Android.R.drawable.ic_delete',
      'ic-dialog-alert': 'Ti.Android.R.drawable.ic_dialog_alert',
      'ic-dialog-dialer': 'Ti.Android.R.drawable.ic_dialog_dialer',
      'ic-dialog-email': 'Ti.Android.R.drawable.ic_dialog_email',
      'ic-dialog-info': 'Ti.Android.R.drawable.ic_dialog_info',
      'ic-dialog-map': 'Ti.Android.R.drawable.ic_dialog_map',
      'ic-input-add': 'Ti.Android.R.drawable.ic_input_add',
      'ic-input-delete': 'Ti.Android.R.drawable.ic_input_delete',
      'ic-input-get': 'Ti.Android.R.drawable.ic_input_get',
      'ic-lock-idle-alarm': 'Ti.Android.R.drawable.ic_lock_idle_alarm',
      'ic-lock-idle-charging': 'Ti.Android.R.drawable.ic_lock_idle_charging',
      'ic-lock-idle-lock': 'Ti.Android.R.drawable.ic_lock_idle_lock',
      'ic-lock-idle-low-battery': 'Ti.Android.R.drawable.ic_lock_idle_low_battery',
      'ic-lock-lock': 'Ti.Android.R.drawable.ic_lock_lock',
      'ic-lock-power-off': 'Ti.Android.R.drawable.ic_lock_power_off',
      'ic-lock-silent-mode': 'Ti.Android.R.drawable.ic_lock_silent_mode',
      'ic-lock-silent-mode-off': 'Ti.Android.R.drawable.ic_lock_silent_mode_off',
      'ic-media-ff': 'Ti.Android.R.drawable.ic_media_ff',
      'ic-media-next': 'Ti.Android.R.drawable.ic_media_next',
      'ic-media-pause': 'Ti.Android.R.drawable.ic_media_pause',
      'ic-media-play': 'Ti.Android.R.drawable.ic_media_play',
      'ic-media-previous': 'Ti.Android.R.drawable.ic_media_previous',
      'ic-media-rew': 'Ti.Android.R.drawable.ic_media_rew',
      'ic-menu-add': 'Ti.Android.R.drawable.ic_menu_add',
      'ic-menu-agenda': 'Ti.Android.R.drawable.ic_menu_agenda',
      'ic-menu-always-landscape-portrait': 'Ti.Android.R.drawable.ic_menu_always_landscape_portrait',
      'ic-menu-call': 'Ti.Android.R.drawable.ic_menu_call',
      'ic-menu-camera': 'Ti.Android.R.drawable.ic_menu_camera',
      'ic-menu-close-clear-cancel': 'Ti.Android.R.drawable.ic_menu_close_clear_cancel',
      'ic-menu-compass': 'Ti.Android.R.drawable.ic_menu_compass',
      'ic-menu-crop': 'Ti.Android.R.drawable.ic_menu_crop',
      'ic-menu-day': 'Ti.Android.R.drawable.ic_menu_day',
      'ic-menu-delete': 'Ti.Android.R.drawable.ic_menu_delete',
      'ic-menu-directions': 'Ti.Android.R.drawable.ic_menu_directions',
      'ic-menu-edit': 'Ti.Android.R.drawable.ic_menu_edit',
      'ic-menu-gallery': 'Ti.Android.R.drawable.ic_menu_gallery',
      'ic-menu-help': 'Ti.Android.R.drawable.ic_menu_help',
      'ic-menu-info-details': 'Ti.Android.R.drawable.ic_menu_info_details',
      'ic-menu-manage': 'Ti.Android.R.drawable.ic_menu_manage',
      'ic-menu-mapmode': 'Ti.Android.R.drawable.ic_menu_mapmode',
      'ic-menu-month': 'Ti.Android.R.drawable.ic_menu_month',
      'ic-menu-more': 'Ti.Android.R.drawable.ic_menu_more',
      'ic-menu-my-calendar': 'Ti.Android.R.drawable.ic_menu_my_calendar',
      'ic-menu-mylocation': 'Ti.Android.R.drawable.ic_menu_mylocation',
      'ic-menu-myplaces': 'Ti.Android.R.drawable.ic_menu_myplaces',
      'ic-menu-preferences': 'Ti.Android.R.drawable.ic_menu_preferences',
      'ic-menu-recent-history': 'Ti.Android.R.drawable.ic_menu_recent_history',
      'ic-menu-report-image': 'Ti.Android.R.drawable.ic_menu_report_image',
      'ic-menu-revert': 'Ti.Android.R.drawable.ic_menu_revert',
      'ic-menu-rotate': 'Ti.Android.R.drawable.ic_menu_rotate',
      'ic-menu-save': 'Ti.Android.R.drawable.ic_menu_save',
      'ic-menu-search': 'Ti.Android.R.drawable.ic_menu_search',
      'ic-menu-send': 'Ti.Android.R.drawable.ic_menu_send',
      'ic-menu-set-as': 'Ti.Android.R.drawable.ic_menu_set_as',
      'ic-menu-share': 'Ti.Android.R.drawable.ic_menu_share',
      'ic-menu-slideshow': 'Ti.Android.R.drawable.ic_menu_slideshow',
      'ic-menu-sort-alphabetically': 'Ti.Android.R.drawable.ic_menu_sort_alphabetically',
      'ic-menu-sort-by-size': 'Ti.Android.R.drawable.ic_menu_sort_by_size',
      'ic-menu-today': 'Ti.Android.R.drawable.ic_menu_today',
      'ic-menu-upload': 'Ti.Android.R.drawable.ic_menu_upload',
      'ic-menu-upload-you-tube': 'Ti.Android.R.drawable.ic_menu_upload_you_tube',
      'ic-menu-view': 'Ti.Android.R.drawable.ic_menu_view',
      'ic-menu-week': 'Ti.Android.R.drawable.ic_menu_week',
      'ic-menu-zoom': 'Ti.Android.R.drawable.ic_menu_zoom',
      'ic-notification-clear-all': 'Ti.Android.R.drawable.ic_notification_clear_all',
      'ic-notification-overlay': 'Ti.Android.R.drawable.ic_notification_overlay',
      'ic-partial-secure': 'Ti.Android.R.drawable.ic_partial_secure',
      'ic-popup-disk-full': 'Ti.Android.R.drawable.ic_popup_disk_full',
      'ic-popup-reminder': 'Ti.Android.R.drawable.ic_popup_reminder',
      'ic-popup-sync': 'Ti.Android.R.drawable.ic_popup_sync',
      'ic-search-category-default': 'Ti.Android.R.drawable.ic_search_category_default',
      'ic-secure': 'Ti.Android.R.drawable.ic_secure',
      'list-selector-background': 'Ti.Android.R.drawable.list_selector_background',
      'menu-frame': 'Ti.Android.R.drawable.menu_frame',
      'menu-full-frame': 'Ti.Android.R.drawable.menu_full_frame',
      'menuitem-background': 'Ti.Android.R.drawable.menuitem_background',
      'picture-frame': 'Ti.Android.R.drawable.picture_frame',
      'presence-audio-away': 'Ti.Android.R.drawable.presence_audio_away',
      'presence-audio-busy': 'Ti.Android.R.drawable.presence_audio_busy',
      'presence-audio-online': 'Ti.Android.R.drawable.presence_audio_online',
      'presence-away': 'Ti.Android.R.drawable.presence_away',
      'presence-busy': 'Ti.Android.R.drawable.presence_busy',
      'presence-invisible': 'Ti.Android.R.drawable.presence_invisible',
      'presence-offline': 'Ti.Android.R.drawable.presence_offline',
      'presence-online': 'Ti.Android.R.drawable.presence_online',
      'presence-video-away': 'Ti.Android.R.drawable.presence_video_away',
      'presence-video-busy': 'Ti.Android.R.drawable.presence_video_busy',
      'presence-video-online': 'Ti.Android.R.drawable.presence_video_online',
      'progress-horizontal': 'Ti.Android.R.drawable.progress_horizontal',
      'progress-indeterminate-horizontal': 'Ti.Android.R.drawable.progress_indeterminate_horizontal',
      'radiobutton-off-background': 'Ti.Android.R.drawable.radiobutton_off_background',
      'radiobutton-on-background': 'Ti.Android.R.drawable.radiobutton_on_background',
      'screen-background-dark': 'Ti.Android.R.drawable.screen_background_dark',
      'screen-background-dark-transparent': 'Ti.Android.R.drawable.screen_background_dark_transparent',
      'screen-background-light': 'Ti.Android.R.drawable.screen_background_light',
      'screen-background-light-transparent': 'Ti.Android.R.drawable.screen_background_light_transparent',
      'spinner-background': 'Ti.Android.R.drawable.spinner_background',
      'spinner-dropdown-background': 'Ti.Android.R.drawable.spinner_dropdown_background',
      'star-big-off': 'Ti.Android.R.drawable.star_big_off',
      'star-big-on': 'Ti.Android.R.drawable.star_big_on',
      'star-off': 'Ti.Android.R.drawable.star_off',
      'star-on': 'Ti.Android.R.drawable.star_on',
      'stat-notify-call-mute': 'Ti.Android.R.drawable.stat_notify_call_mute',
      'stat-notify-chat': 'Ti.Android.R.drawable.stat_notify_chat',
      'stat-notify-error': 'Ti.Android.R.drawable.stat_notify_error',
      'stat-notify-missed-call': 'Ti.Android.R.drawable.stat_notify_missed_call',
      'stat-notify-more': 'Ti.Android.R.drawable.stat_notify_more',
      'stat-notify-sdcard': 'Ti.Android.R.drawable.stat_notify_sdcard',
      'stat-notify-sdcard-prepare': 'Ti.Android.R.drawable.stat_notify_sdcard_prepare',
      'stat-notify-sdcard-usb': 'Ti.Android.R.drawable.stat_notify_sdcard_usb',
      'stat-notify-sync': 'Ti.Android.R.drawable.stat_notify_sync',
      'stat-notify-sync-noanim': 'Ti.Android.R.drawable.stat_notify_sync_noanim',
      'stat-notify-voicemail': 'Ti.Android.R.drawable.stat_notify_voicemail',
      'stat-sys-data-bluetooth': 'Ti.Android.R.drawable.stat_sys_data_bluetooth',
      'stat-sys-download': 'Ti.Android.R.drawable.stat_sys_download',
      'stat-sys-download-done': 'Ti.Android.R.drawable.stat_sys_download_done',
      'stat-sys-headset': 'Ti.Android.R.drawable.stat_sys_headset',
      'stat-sys-speakerphone': 'Ti.Android.R.drawable.stat_sys_speakerphone',
      'stat-sys-upload': 'Ti.Android.R.drawable.stat_sys_upload',
      'stat-sys-upload-done': 'Ti.Android.R.drawable.stat_sys_upload_done',
      'stat-sys-warning': 'Ti.Android.R.drawable.stat_sys_warning',
      'status-bar-item-app-background': 'Ti.Android.R.drawable.status_bar_item_app_background',
      'status-bar-item-background': 'Ti.Android.R.drawable.status_bar_item_background',
      'sym-action-call': 'Ti.Android.R.drawable.sym_action_call',
      'sym-action-chat': 'Ti.Android.R.drawable.sym_action_chat',
      'sym-action-email': 'Ti.Android.R.drawable.sym_action_email',
      'sym-call-incoming': 'Ti.Android.R.drawable.sym_call_incoming',
      'sym-call-missed': 'Ti.Android.R.drawable.sym_call_missed',
      'sym-call-outgoing': 'Ti.Android.R.drawable.sym_call_outgoing',
      'sym-contact-card': 'Ti.Android.R.drawable.sym_contact_card',
      'sym-def-app-icon': 'Ti.Android.R.drawable.sym_def_app_icon',
      'title-bar': 'Ti.Android.R.drawable.title_bar',
      'title-bar-tall': 'Ti.Android.R.drawable.title_bar_tall',
      'toast-frame': 'Ti.Android.R.drawable.toast_frame',
      'zoom-plate': 'Ti.Android.R.drawable.zoom_plate'
    }
  })

  return convertedStyles
}

export function iconified() {
  return processProperties({
    prop: 'iconified',
    modules: 'Ti.UI.Android.SearchView, Ti.UI.Android.SearchBar'
  }, {
    iconified: '{ iconified: {value} }'
  }, {
    default: {
      default: true
    }
  })
}

export function iconifiedByDefault() {
  return processProperties({
    prop: 'iconifiedByDefault',
    modules: 'Ti.UI.Android.SearchView, Ti.UI.SearchBar'
  }, {
    'iconified-by-default': '{ iconifiedByDefault: {value} }'
  }, {
    default: {
      default: true
    }
  })
}

export function iconIsMask() {
  return processProperties({
    prop: 'iconIsMask - iOS Only',
    modules: 'Ti.UI.Tab'
  }, {
    default: '{ iconIsMask: {value} }'
  }, {
    ios: {
      'icon-is': {
        mask: true,
        'not-mask': false
      }
    }
  })
}

export function inputType() {
  return processProperties({
    prop: 'inputType - Android Only',
    modules: 'Ti.UI.TextField'
  }, {
    'input-type-class': '{ inputType: {value} }'
  }, {
    android: {
      number: 'Ti.UI.INPUT_TYPE_CLASS_NUMBER',
      text: 'Ti.UI.INPUT_TYPE_CLASS_TEXT'
    }
  })
}

export function layout() {
  return processProperties({
    prop: 'layout',
    modules: 'Ti.UI.OptionBar, Ti.UI.View'
  }, {
    default: '{ layout: {value} }'
  }, {
    default: {
      composite: 'composite',
      horizontal: 'horizontal',
      vertical: 'vertical'
    }
  })
}

export function lazyLoadingEnabled() {
  return processProperties({
    prop: 'lazyLoadingEnabled - iOS Only',
    modules: 'Ti.UI.ListView'
  }, {
    'lazy-loading': '{ lazyLoadingEnabled: {value} }'
  }, {
    ios: {
      enabled: true,
      disabled: false
    }
  })
}

export function modal() {
  return processProperties({
    prop: 'modal',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ modal: {value} }'
  }, {
    default: {
      modal: true,
      regular: false
    }
  })
}

export function moveable() {
  return processProperties({
    prop: 'moveable',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ moveable: {value} }'
  }, {
    default: {
      moveable: true,
      unmovable: false
    }
  })
}

export function overlayEnabled() {
  return processProperties({
    prop: 'overlayEnabled - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    overlay: '{ overlayEnabled: {value} }'
  }, {
    ios: {
      enabled: true,
      disabled: false
    }
  })
}

export function pluginState() {
  return processProperties({
    prop: 'pluginState - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    'webview-plugins': '{ pluginState: {value} }'
  }, {
    android: {
      off: 'Ti.UI.Android.WEBVIEW_PLUGINS_OFF',
      on: 'Ti.UI.Android.WEBVIEW_PLUGINS_ON',
      'on-demand': 'Ti.UI.Android.WEBVIEW_PLUGINS_ON_DEMAND'
    }
  })
}

export function preventCornerOverlap() {
  return processProperties({
    prop: 'preventCornerOverlap - Android Only',
    modules: 'Ti.UI.Android.CardView'
  }, {
    default: '{ preventCornerOverlap: {value} }'
  }, {
    android: {
      'prevent-corner-overlap': true,
      'dont-prevent-corner-overlap': false
    }
  })
}

export function previewActionStyle() {
  return processProperties({
    prop: 'style - iOS Only',
    modules: 'Ti.UI.iOS.PreviewAction, Ti.UI.iOS.PreviewActionGroup'
  }, {
    'preview-action-style': '{ style: {value} }'
  }, {
    ios: {
      default: 'Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT',
      selected: 'Ti.UI.iOS.PREVIEW_ACTION_STYLE_SELECTED',
      destrutive: 'Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE'
    }
  })
}

export function cancelable() {
  return processProperties({
    prop: 'cancelable - Android Only',
    modules: 'Ti.UI.Android.ProgressIndicator'
  }, {
    cancelable: '{ cancelable: {value} }'
  }, {
    android: {
      default: true
    }
  })
}

export function canceledOnTouchOutside() {
  return processProperties({
    prop: 'canceledOnTouchOutside - Android Only',
    modules: 'Ti.UI.Android.ProgressIndicator'
  }, {
    'canceled-on-touch-outside': '{ canceledOnTouchOutside: {value} }'
  }, {
    android: {
      default: true
    }
  })
}

export function location() {
  return processProperties({
    prop: 'location - Android Only',
    modules: 'Ti.UI.Android.ProgressIndicator'
  }, {
    location: '{ location: {value} }'
  }, {
    android: {
      dialog: 'Ti.UI.Android.PROGRESS_INDICATOR_DIALOG',
      'statur-bar': 'Ti.UI.Android.PROGRESS_INDICATOR_STATUS_BAR'
    }
  })
}

export function progressIndicatorType() {
  return processProperties({
    prop: 'type - Android Only',
    modules: 'Ti.UI.Android.ProgressIndicator'
  }, {
    type: '{ type: {value} }'
  }, {
    android: {
      determinant: 'Ti.UI.Android.PROGRESS_INDICATOR_DETERMINANT',
      indeterminant: 'Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT'
    }
  })
}

export function requestedOrientation() {
  return processProperties({
    prop: 'requestedOrientation - Android Only',
    modules: 'Ti.Android.Activity'
  }, {
    'requested-orientation': '{ requestedOrientation: {value} }'
  }, {
    android: {
      behind: 'Ti.Android.SCREEN_ORIENTATION_BEHIND',
      landscape: 'Ti.Android.SCREEN_ORIENTATION_LANDSCAPE',
      nosensor: 'Ti.Android.SCREEN_ORIENTATION_NOSENSOR',
      portrait: 'Ti.Android.SCREEN_ORIENTATION_PORTRAIT',
      sensor: 'Ti.Android.SCREEN_ORIENTATION_SENSOR',
      unspecified: 'Ti.Android.SCREEN_ORIENTATION_UNSPECIFIED',
      user: 'Ti.Android.SCREEN_ORIENTATION_USER'
    }
  })
}

export function shiftMode() {
  return processProperties({
    prop: 'shiftMode - Android Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    'shift-mode': '{ shiftMode: {value} }'
  }, {
    android: {
      default: true,
      disabled: false
    }
  })
}

export function showAsAction() {
  return processProperties({
    prop: 'showAsAction - Android Only',
    modules: 'Ti.Android.MenuItem'
  }, {
    'show-as-action': '{ showAsAction: {value} }'
  }, {
    android: {
      always: 'Ti.Android.SHOW_AS_ACTION_ALWAYS',
      collapse: 'Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW',
      'if-room': 'Ti.Android.SHOW_AS_ACTION_IF_ROOM',
      never: 'Ti.Android.SHOW_AS_ACTION_NEVER',
      'with-text': 'Ti.Android.SHOW_AS_ACTION_WITH_TEXT'
    }
  })
}

export function showBookmark() {
  return processProperties({
    prop: 'showBookmark - iOS Only',
    modules: 'Ti.UI.SearchBar'
  }, {
    default: '{ showBookmark: {value} }'
  }, {
    ios: {
      'show-bookmark': true,
      'hide-bookmark': false
    }
  })
}

export function showCancel() {
  return processProperties({
    prop: 'showCancel',
    modules: 'Ti.UI.SearchBar'
  }, {
    default: '{ showCancel: {value} }'
  }, {
    default: {
      'show-cancel': true,
      'hide-cancel': false
    }
  })
}

export function showUndoRedoActions() {
  return processProperties({
    prop: 'showUndoRedoActions - iOS Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ showUndoRedoActions: {value} }'
  }, {
    ios: {
      'show-undo-redo-actions': true,
      'hide-undo-redo-actions': false
    }
  })
}

export function submitEnabled() {
  return processProperties({
    prop: 'submitEnabled - Android Only',
    modules: 'Ti.UI.Android.SearchView'
  }, {
    submit: '{ submitEnabled: {value} }'
  }, {
    android: {
      enabled: true,
      disabled: false
    }
  })
}

export function swipeToClose() {
  return processProperties({
    prop: 'swipeToClose - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ swipeToClose: {value} }'
  }, {
    ios: {
      'swipe-to-close': true,
      'dont-swipe-to-close': false
    }
  })
}

export function debugMode() {
  return processProperties('debug', {
    debug: '{ debug: {value} }'
  }, {
    default: {
      default: true
    }
  })
}

export function translucent() {
  return processProperties({
    prop: 'translucent - iOS Only',
    modules: 'Ti.UI.iOS.Toolbar, Ti.UI.TabGroup, Ti.UI.Toolbar, Ti.UI.Window'
  }, {
    translucent: '{ translucent: {value} }'
  }, {
    ios: {
      default: true,
      disabled: false
    }
  })
}

export function useCompatPadding() {
  return processProperties({
    prop: 'useCompatPadding - Android Only',
    modules: 'Ti.UI.Android.CardView'
  }, {
    default: '{ useCompatPadding: {value} }'
  }, {
    android: {
      'use-compat-padding': true,
      'dont-use-compat-padding': false
    }
  })
}

export function wobble() {
  return processProperties({
    prop: 'wobble - iOS Only',
    modules: 'Ti.UI.DashboardView'
  }, {
    default: '{ wobble: {value} }'
  }, {
    ios: {
      wobble: true,
      'dont-wobble': false
    }
  })
}
export function borderRadiusFull({ ...modifiersAndValues }) {
  delete modifiersAndValues[0]
  delete modifiersAndValues.px

  return processProperties({
    prop: 'borderRadius ( FULL )',
    modules: 'Ti.UI.View, Ti.Media.VideoPlayer, Ti.UI.Android.CardView, Ti.UI.Android.DrawerLayout, Ti.UI.Android.SearchView, Ti.UI.Button, Ti.UI.ButtonBar, Ti.UI.DashboardView, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ListView, Ti.UI.MaskedImage, Ti.UI.NavigationWindow, Ti.UI.OptionBar, Ti.UI.Picker, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.ScrollView, Ti.UI.ScrollableView, Ti.UI.SearchBar, Ti.UI.Slider, Ti.UI.Switch, Ti.UI.TabbedBar, Ti.UI.TableView, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Toolbar, Ti.UI.WebView, Ti.UI.Window, Ti.UI.iOS.BlurView, Ti.UI.iOS.CoverFlowView, Ti.UI.iOS.LivePhotoView, Ti.UI.iOS.SplitWindow, Ti.UI.iOS.Stepper'
  }, {
    'rounded-full': '{ width: {double}, height: {double}, borderRadius: {value} }'
  }, {
    default: modifiersAndValues
  })
}

export function allowsBackForwardNavigationGestures() {
  return processProperties({
    prop: 'allowsBackForwardNavigationGestures - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ allowsBackForwardNavigationGestures: {value} }'
  }, {
    ios: {
      'allow-back-forward-navigation-gestures': true,
      'dont-allow-back-forward-navigation-gestures': false
    }
  })
}
