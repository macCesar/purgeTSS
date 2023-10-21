const _applyClasses = {}
const fs = require('fs')
const cwd = process.cwd()
const _ = require('lodash')
const regexUnicode = /[^\u0000-\u00FF]/
const readCSS = require('read-css')
const HEX_3_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i // i.e. #0F3
const HEX_4_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i // i.e. #80F3
const HEX_6_REGEX = /^#?([a-f\d]){6}$/i // i.e. #00FF33
const HEX_8_REGEX = /^#?([a-f\d]){8}$/i // i.e. #8800FF33

const globalOptions = {
  legacy: false
}
exports.globalOptions = globalOptions

// ! Resets ImageView, View, Window
function resetStyles() {
  let convertedStyles = '\n// Custom Styles and Resets\n'

  convertedStyles += customRules({ ios: { hires: true } }, 'ImageView')
  // convertedStyles += customRules({ default: { width: 'Ti.UI.FILL', height: 'Ti.UI.SIZE' } }, 'Label');
  convertedStyles += customRules({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, 'View')
  convertedStyles += customRules({ default: { backgroundColor: '#ffffff' } }, 'Window')

  return convertedStyles
}
exports.resetStyles = resetStyles

// ! Width, height and margin properties
function height(modifiersAndValues) {
  return processProperties({
    prop: 'height',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.ListItem, Ti.UI.View'
  }, {
    h: '{ height: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.height = height

function width(modifiersAndValues) {
  return processProperties({
    prop: 'width',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.ListItem, Ti.UI.View'
  }, {
    w:
			'{ width: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.width = width

function widthHeight(modifiersAndValues) {
  return processProperties({
    prop: 'width and height',
    modules: 'Ti.UI.View, Ti.Blob, Ti.Media.VideoPlayer, MovieSize, Ti.UI.ActivityIndicator, Ti.UI.Android.CardView, Ti.UI.Android.DrawerLayout, Ti.UI.Android.SearchView, Ti.UI.Animation, Ti.UI.Button, Ti.UI.ButtonBar, Ti.UI.DashboardView, Dimension, DimensionWithAbsolutes, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ListView, Ti.UI.MaskedImage, Ti.UI.NavigationWindow, Ti.UI.OptionBar, Ti.UI.Picker, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.ScrollView, Ti.UI.ScrollableView, Ti.UI.SearchBar, Size, Ti.UI.Slider, Ti.UI.Switch, Ti.UI.TabbedBar, Ti.UI.TableView, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Toolbar, Ti.UI.WebView, Ti.UI.Window, openWindowParams, Ti.UI.iOS.BlurView, Ti.UI.iOS.CoverFlowView, CoverFlowImageType, Ti.UI.iOS.LivePhotoView, Ti.UI.iOS.SplitWindow, Ti.UI.iOS.Stepper, BarItemType, Ti.UI.iPad.Popover'
  }, {
    wh:
			'{ width: {value}, height: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.widthHeight = widthHeight

function margin(modifiersAndValues) {
  let objectPosition = {
    m: '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
    my: '{ top: {value}, bottom: {value} }',
    mx: '{ right: {value}, left: {value} }',
    mt: '{ top: {value} }',
    mr: '{ right: {value} }',
    mb: '{ bottom: {value} }',
    ml: '{ left: {value} }'
  }

  delete modifiersAndValues.screen
  modifiersAndValues.auto = 'null'

  let convertedStyles = processProperties({
    prop: 'top, right, bottom, left ( Margin )',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window'
  }, objectPosition, { default: modifiersAndValues })

  objectPosition = {
    '-m': '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
    '-my': '{ top: {value}, bottom: {value} }',
    '-mx': '{ left: {value}, right: {value} }',
    '-mt': '{ top: {value} }',
    '-mr': '{ right: {value} }',
    '-mb': '{ bottom: {value} }',
    '-ml': '{ left: {value} }'
  }

  delete modifiersAndValues['0']
  delete modifiersAndValues.auto

  convertedStyles += processProperties({
    prop: 'top, right, bottom, left ( Negative Margin )',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window'
  }, objectPosition, {
    default: modifiersAndValues
  })

  return convertedStyles
}
exports.margin = margin

function marginAlternate(modifiersAndValues) {
  let objectPosition = {
    top: '{ top: {value} }',
    right: '{ right: {value} }',
    bottom: '{ bottom: {value} }',
    left: '{ left: {value} }'
  }

  delete modifiersAndValues.screen
  modifiersAndValues.auto = 'null'

  let convertedStyles = processProperties({
    prop: 'top, right, bottom, left',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window'
  }, objectPosition, { default: modifiersAndValues })

  objectPosition = {
    '-bottom': '{ bottom: {value} }',
    '-left': '{ left: {value} }',
    '-right': '{ right: {value} }',
    '-top': '{ top: {value} }'
  }

  delete modifiersAndValues['0']
  delete modifiersAndValues.auto

  convertedStyles += processProperties({
    prop: 'top, right, bottom, left ( Negative )',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window'
  }, objectPosition, {
    default: modifiersAndValues
  })

  return convertedStyles
}
exports.marginAlternate = marginAlternate

// ! Properties with constant values
function accessibilityHidden() {
  return processProperties({
    prop: 'accessibilityHidden',
    modules: 'Ti.UI.View'
  }, {
    default: '{ accessibilityHidden: {value} }'
  }, {
    default: {
      'accessibility-hidden': true,
      'accessibility-not-hidden': false
    }
  })
}
exports.accessibilityHidden = accessibilityHidden

function accessoryType() {
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
exports.accessoryType = accessoryType

function activeIconIsMask() {
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
exports.activeIconIsMask = activeIconIsMask

function activityEnterTransition() {
  return processProperties({
    prop: 'activityEnterTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activityEnterTransition: {value} }'
  }, {
    android: {
      'enter-transition': {
        explode: 'Ti.UI.Android.TRANSITION_EXPLODE',
        'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
        'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
        none: 'Ti.UI.Android.TRANSITION_NONE',
        'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
        'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
        'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
        'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP'
      }
    }
  })
}
exports.activityEnterTransition = activityEnterTransition

function activityExitTransition() {
  return processProperties({
    prop: 'activityExitTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activityExitTransition: {value} }'
  }, {
    android: {
      'exit-transition': {
        explode: 'Ti.UI.Android.TRANSITION_EXPLODE',
        'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
        'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
        none: 'Ti.UI.Android.TRANSITION_NONE',
        'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
        'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
        'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
        'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP'
      }
    }
  })
}
exports.activityExitTransition = activityExitTransition

function activityIndicatorStyle() {
  return processProperties({
    prop: 'style',
    modules: 'Ti.UI.ActivityIndicator'
  }, {
    'activity-indicator-style': '{ style: {value} }'
  }, {
    default: {
      big: 'Ti.UI.ActivityIndicatorStyle.BIG',
      dark: 'Ti.UI.ActivityIndicatorStyle.DARK',
      'big-dark': 'Ti.UI.ActivityIndicatorStyle.BIG_DARK',
      plain: 'Ti.UI.ActivityIndicatorStyle.PLAIN'
    }
  })
}
exports.activityIndicatorStyle = activityIndicatorStyle

function activityReenterTransition() {
  return processProperties({
    prop: 'activityReenterTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activityReenterTransition: {value} }'
  }, {
    android: {
      'reenter-transition': {
        explode: 'Ti.UI.Android.TRANSITION_EXPLODE',
        'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
        'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
        none: 'Ti.UI.Android.TRANSITION_NONE',
        'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
        'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
        'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
        'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP'
      }
    }
  })
}
exports.activityReenterTransition = activityReenterTransition

function activityReturnTransition() {
  return processProperties({
    prop: 'activityReturnTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activityReturnTransition: {value} }'
  }, {
    android: {
      'return-transition': {
        explode: 'Ti.UI.Android.TRANSITION_EXPLODE',
        'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
        'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
        none: 'Ti.UI.Android.TRANSITION_NONE',
        'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
        'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
        'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
        'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP'
      }
    }
  })
}
exports.activityReturnTransition = activityReturnTransition

function activitySharedElementEnterTransition() {
  return processProperties({
    prop: 'activitySharedElementEnterTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activitySharedElementEnterTransition: {value} }'
  }, {
    android: {
      'shared-element-enter-transition': {
        'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
        'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
        'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
        'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
        none: 'Ti.UI.Android.TRANSITION_NONE'
      }
    }
  })
}
exports.activitySharedElementEnterTransition = activitySharedElementEnterTransition

function activitySharedElementExitTransition() {
  return processProperties({
    prop: 'activitySharedElementExitTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activitySharedElementExitTransition: {value} }'
  }, {
    android: {
      'shared-element-exit-transition': {
        'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
        'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
        'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
        'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
        none: 'Ti.UI.Android.TRANSITION_NONE'
      }
    }
  })
}
exports.activitySharedElementExitTransition = activitySharedElementExitTransition

function activitySharedElementReenterTransition() {
  return processProperties({
    prop: 'activitySharedElementReenterTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activitySharedElementReenterTransition: {value} }'
  }, {
    android: {
      'shared-element-reenter-transition': {
        'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
        'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
        'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
        'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
        none: 'Ti.UI.Android.TRANSITION_NONE'
      }
    }
  })
}
exports.activitySharedElementReenterTransition = activitySharedElementReenterTransition

function activitySharedElementReturnTransition() {
  return processProperties({
    prop: 'activitySharedElementReturnTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activitySharedElementReturnTransition: {value} }'
  }, {
    android: {
      'shared-element-return-transition': {
        'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
        'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
        'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
        'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
        none: 'Ti.UI.Android.TRANSITION_NONE'
      }
    }
  })
}
exports.activitySharedElementReturnTransition = activitySharedElementReturnTransition

function alertDialogStyle() {
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
exports.alertDialogStyle = alertDialogStyle

function allowsBackForwardNavigationGestures() {
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
exports.allowsBackForwardNavigationGestures = allowsBackForwardNavigationGestures

function allowsLinkPreview() {
  return processProperties({
    prop: 'allowsLinkPreview - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ allowsLinkPreview: {value} }'
  }, {
    ios: {
      'allows-link-preview': true,
      'dont-allow-link-preview': false
    }
  })
}
exports.allowsLinkPreview = allowsLinkPreview

function allowsMultipleSelectionDuringEditing() {
  return processProperties({
    prop: 'allowsMultipleSelectionDuringEditing',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ allowsMultipleSelectionDuringEditing: {value} }'
  }, {
    default: {
      'allows-multiple-selection-during-editing': true,
      'dont-allow-multiple-selection-during-editing': false
    }
  })
}
exports.allowsMultipleSelectionDuringEditing = allowsMultipleSelectionDuringEditing

function allowsMultipleSelectionInteraction() {
  return processProperties({
    prop: 'allowsMultipleSelectionInteraction',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ allowsMultipleSelectionInteraction: {value} }'
  }, {
    default: {
      'allows-multiple-selection-interaction': true,
      'dont-allow-multiple-selection-interaction': false
    }
  })
}
exports.allowsMultipleSelectionInteraction = allowsMultipleSelectionInteraction

function allowsSelection() {
  return processProperties({
    prop: 'allowsSelection - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ allowsSelection: {value} }'
  }, {
    ios: {
      'allows-selection': true,
      'dont-allow-selection': false
    }
  })
}
exports.allowsSelection = allowsSelection

function allowsSelectionDuringEditing() {
  return processProperties({
    prop: 'allowsSelectionDuringEditing',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ allowsSelectionDuringEditing: {value} }'
  }, {
    default: {
      'allows-selection-during-editing': true,
      'dont-allow-selection-during-editing': false
    }
  })
}
exports.allowsSelectionDuringEditing = allowsSelectionDuringEditing

function allowUserCustomization() {
  return processProperties({
    prop: 'allowUserCustomization - iOS Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    default: '{ allowUserCustomization: {value} }'
  }, {
    ios: {
      'allow-user-customization': true,
      'dont-allow-user-customization': false
    }
  })
}
exports.allowUserCustomization = allowUserCustomization

function transition() {
  return processProperties({
    modules: 'Ti.UI.Animation',
    prop: 'transition - iOS Only'
  }, {
    'animation-style': '{ transition: {value} }'
  }, {
    ios: {
      'curl-down': 'Ti.UI.iOS.AnimationStyle.CURL_DOWN',
      'curl-up': 'Ti.UI.iOS.AnimationStyle.CURL_UP',
      'flip-from-left': 'Ti.UI.iOS.AnimationStyle.FLIP_FROM_LEFT',
      'flip-from-right': 'Ti.UI.iOS.AnimationStyle.FLIP_FROM_RIGHT',
      'flip-from-top': 'Ti.UI.iOS.AnimationStyle.FLIP_FROM_TOP',
      'flip-from-bottom': 'Ti.UI.iOS.AnimationStyle.FLIP_FROM_BOTTOM',
      'cross-dissolve': 'Ti.UI.iOS.AnimationStyle.CROSS_DISSOLVE',
      none: 'Ti.UI.iOS.AnimationStyle.NONE'
    }
  })
}
exports.transition = transition

function audioStreamType() {
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
exports.audioStreamType = audioStreamType

function autoAdjustScrollViewInsets() {
  return processProperties({
    prop: 'autoAdjustScrollViewInsets - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ autoAdjustScrollViewInsets: {value} }'
  }, {
    ios: {
      'auto-adjust-scroll-view-inset': true,
      'dont-auto-adjust-scroll-view-inset': false
    }
  })
}
exports.autoAdjustScrollViewInsets = autoAdjustScrollViewInsets

function autocapitalization() {
  return processProperties({
    prop: 'autocapitalization',
    modules: 'Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ autocapitalization: {value} }'
  }, {
    default: {
      uppercase: 'Ti.UI.TEXT_AUTOCAPITALIZATION_ALL',
      'normal-case': 'Ti.UI.TEXT_AUTOCAPITALIZATION_NONE',
      capitalize: 'Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS',
      sentences: 'Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES'
    }
  })
}
exports.autocapitalization = autocapitalization

function autocorrect() {
  return processProperties({
    prop: 'autocorrect',
    modules: 'Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ autocorrect: {value} }'
  }, {
    default: {
      autocorrect: true,
      'no-autocorrect': false,
      'dont-autocorrect': false
    }
  })
}
exports.autocorrect = autocorrect

function autofillType() {
  return processProperties({
    prop: 'autofillType',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'autofill-type': '{ autofillType: {value} }'
  }, {
    default: {
      url: 'Ti.UI.AUTOFILL_TYPE_URL',
      name: 'Ti.UI.AUTOFILL_TYPE_NAME',
      phone: 'Ti.UI.AUTOFILL_TYPE_PHONE',
      email: 'Ti.UI.AUTOFILL_TYPE_EMAIL',
      address: 'Ti.UI.AUTOFILL_TYPE_ADDRESS',
      username: 'Ti.UI.AUTOFILL_TYPE_USERNAME',
      password: 'Ti.UI.AUTOFILL_TYPE_PASSWORD',
      nickname: 'Ti.UI.AUTOFILL_TYPE_NICKNAME',
      location: 'Ti.UI.AUTOFILL_TYPE_LOCATION',
      'job-title': 'Ti.UI.AUTOFILL_TYPE_JOB_TITLE',
      'given-name': 'Ti.UI.AUTOFILL_TYPE_GIVEN_NAME',
      'name-prefix': 'Ti.UI.AUTOFILL_TYPE_NAME_PREFIX',
      'middle-name': 'Ti.UI.AUTOFILL_TYPE_MIDDLE_NAME',
      'family-name': 'Ti.UI.AUTOFILL_TYPE_FAMILY_NAME',
      'name-suffix': 'Ti.UI.AUTOFILL_TYPE_NAME_SUFFIX',
      sublocality: 'Ti.UI.AUTOFILL_TYPE_SUBLOCALITY',
      'postal-code': 'Ti.UI.AUTOFILL_TYPE_POSTAL_CODE',
      'card-number': 'Ti.UI.AUTOFILL_TYPE_CARD_NUMBER',
      'address-city': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_CITY',
      'country-name': 'Ti.UI.AUTOFILL_TYPE_COUNTRY_NAME',
      'new-password': 'Ti.UI.AUTOFILL_TYPE_NEW_PASSWORD',
      'address-line1': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_LINE1',
      'address-line2': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_LINE2',
      'address-state': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_STATE',
      'one-time-code': 'Ti.UI.AUTOFILL_TYPE_ONE_TIME_CODE',
      'organization-name': 'Ti.UI.AUTOFILL_TYPE_ORGANIZATION_NAME',
      'address-city-state': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_CITY_STATE',
      'card-security-code': 'Ti.UI.AUTOFILL_TYPE_CARD_SECURITY_CODE',
      'card-expiration-day': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_DAY',
      'card-expiration-date': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_DATE',
      'card-expiration-year': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_YEAR',
      'card-expiration-month': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_MONTH'
    }
  })
}
exports.autofillType = autofillType

function autoLink() {
  return processProperties({
    prop: 'autoLink',
    modules: 'Ti.UI.Label, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'auto-link': '{ autoLink: {value} }'
  }, {
    default: {
      all: 'Ti.UI.AUTOLINK_ALL',
      'email-addresses': 'Ti.UI.AUTOLINK_EMAIL_ADDRESSES',
      'map-addresses': 'Ti.UI.AUTOLINK_MAP_ADDRESSES',
      none: 'Ti.UI.AUTOLINK_NONE',
      'phone-numbers': 'Ti.UI.AUTOLINK_PHONE_NUMBERS',
      urls: 'Ti.UI.AUTOLINK_URLS'
    },
    ios: {
      calendar: 'Ti.UI.AUTOLINK_CALENDAR'
    }
  })
}
exports.autoLink = autoLink

function autoreverse() {
  return processProperties({
    prop: 'autoreverse',
    modules: 'Ti.UI.Animation'
  }, {
    default: '{ autoreverse: {value} }'
  }, {
    default: {
      autoreverse: true,
      'no-autoreverse': false
    }
  })
}
exports.autoreverse = autoreverse

function autorotate() {
  return processProperties({
    prop: 'autorotate',
    modules: 'Ti.UI.ImageView'
  }, {
    default: '{ autorotate: {value} }'
  }, {
    default: {
      autorotate: true,
      'dont-autorotate': false
    }
  })
}
exports.autorotate = autorotate

function backgroundBlendMode() {
  if (globalOptions.legacy) {
    return processProperties({
      prop: 'mode ( Background Blend Mode )',
      modules: 'Ti.UI.MaskedImage'
    }, {
      'bg-blend': '{ mode: {value} }'
    }, {
      default: {
        clear: 'Ti.UI.BLEND_MODE_CLEAR',
        copy: 'Ti.UI.BLEND_MODE_COPY',
        darken: 'Ti.UI.BLEND_MODE_DARKEN',
        'destination-atop': 'Ti.UI.BLEND_MODE_DESTINATION_ATOP',
        'destination-in': 'Ti.UI.BLEND_MODE_DESTINATION_IN',
        'destination-out': 'Ti.UI.BLEND_MODE_DESTINATION_OUT',
        'destination-over': 'Ti.UI.BLEND_MODE_DESTINATION_OVER',
        lighten: 'Ti.UI.BLEND_MODE_LIGHTEN',
        multiply: 'Ti.UI.BLEND_MODE_MULTIPLY',
        normal: 'Ti.UI.BLEND_MODE_NORMAL',
        overlay: 'Ti.UI.BLEND_MODE_OVERLAY',
        'plus-lighter': 'Ti.UI.BLEND_MODE_PLUS_LIGHTER',
        screen: 'Ti.UI.BLEND_MODE_SCREEN',
        'source-atop': 'Ti.UI.BLEND_MODE_SOURCE_ATOP',
        'source-in': 'Ti.UI.BLEND_MODE_SOURCE_IN',
        'source-out': 'Ti.UI.BLEND_MODE_SOURCE_OUT',
        xor: 'Ti.UI.BLEND_MODE_XOR'
      },
      ios: {
        color: 'Ti.UI.BLEND_MODE_COLOR',
        'color-burn': 'Ti.UI.BLEND_MODE_COLOR_BURN',
        'color-dodge': 'Ti.UI.BLEND_MODE_COLOR_DODGE',
        diference: 'Ti.UI.BLEND_MODE_DIFFERENCE',
        exclusion: 'Ti.UI.BLEND_MODE_EXCLUSION',
        'hard-light': 'Ti.UI.BLEND_MODE_HARD_LIGHT',
        hue: 'Ti.UI.BLEND_MODE_HUE',
        luminosity: 'Ti.UI.BLEND_MODE_LUMINOSITY',
        'plus-darker': 'Ti.UI.BLEND_MODE_PLUS_DARKER',
        saturation: 'Ti.UI.BLEND_MODE_SATURATION',
        'soft-light': 'Ti.UI.BLEND_MODE_SOFT_LIGHT'
      }
    })
  } else {
    return processProperties({
      prop: 'mode ( Background Blend Mode )',
      modules: 'Ti.UI.MaskedImage'
    }, {
      'bg-blend': '{ mode: {value} }'
    }, {
      default: {
        clear: 'Ti.UI.BLEND_MODE_CLEAR',
        copy: 'Ti.UI.BLEND_MODE_COPY',
        darken: 'Ti.UI.BLEND_MODE_DARKEN',
        'destination-atop': 'Ti.UI.BLEND_MODE_DESTINATION_ATOP',
        'destination-in': 'Ti.UI.BLEND_MODE_DESTINATION_IN',
        'destination-out': 'Ti.UI.BLEND_MODE_DESTINATION_OUT',
        'destination-over': 'Ti.UI.BLEND_MODE_DESTINATION_OVER',
        lighten: 'Ti.UI.BLEND_MODE_LIGHTEN',
        multiply: 'Ti.UI.BLEND_MODE_MULTIPLY',
        normal: 'Ti.UI.BLEND_MODE_NORMAL',
        overlay: 'Ti.UI.BLEND_MODE_OVERLAY',
        'plus-lighter': 'Ti.UI.BLEND_MODE_PLUS_LIGHTER',
        screen: 'Ti.UI.BLEND_MODE_SCREEN',
        'source-atop': 'Ti.UI.BLEND_MODE_SOURCE_ATOP',
        'source-in': 'Ti.UI.BLEND_MODE_SOURCE_IN',
        'source-out': 'Ti.UI.BLEND_MODE_SOURCE_OUT',
        xor: 'Ti.UI.BLEND_MODE_XOR',
        color: 'Ti.UI.BLEND_MODE_COLOR',
        'color-burn': 'Ti.UI.BLEND_MODE_COLOR_BURN',
        'color-dodge': 'Ti.UI.BLEND_MODE_COLOR_DODGE',
        diference: 'Ti.UI.BLEND_MODE_DIFFERENCE',
        exclusion: 'Ti.UI.BLEND_MODE_EXCLUSION',
        'hard-light': 'Ti.UI.BLEND_MODE_HARD_LIGHT',
        hue: 'Ti.UI.BLEND_MODE_HUE',
        luminosity: 'Ti.UI.BLEND_MODE_LUMINOSITY',
        'plus-darker': 'Ti.UI.BLEND_MODE_PLUS_DARKER',
        saturation: 'Ti.UI.BLEND_MODE_SATURATION',
        'soft-light': 'Ti.UI.BLEND_MODE_SOFT_LIGHT'
      }
    })
  }
}
exports.backgroundBlendMode = backgroundBlendMode

function backgroundLinearGradient() {
  let convertedStyles = processComments({
    prop: 'backgroundGradient - Linear',
    modules: 'Ti.UI.MaskedImage'
  })

  convertedStyles += '\'.bg-linear\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'50%\', y: \'100%\' }, endPoint: { x: \'50%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-t\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'100%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-tr\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'100%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-r\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-br\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'100%\' }, endPoint: { x: \'0%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-b\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'100%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-bl\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'100%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-l\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-tl\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'100%\', y: \'100%\' } } }\n'

  convertedStyles += processComments({
    prop: 'backgroundGradient - Gradient',
    modules: 'Ti.UI.MaskedImage'
  })

  convertedStyles += '\'.bg-gradient\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'50%\', y: \'100%\' }, endPoint: { x: \'50%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-t\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'100%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-tr\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'100%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-r\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-br\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'100%\' }, endPoint: { x: \'0%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-b\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'100%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-bl\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'100%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-l\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-tl\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'100%\', y: \'100%\' } } }\n'

  return convertedStyles
}
exports.backgroundLinearGradient = backgroundLinearGradient

function backgroundRadialGradient() {
  let convertedStyles = processComments({
    prop: 'backgroundGradient: type, startRadius, endRadius, backfillStart, backfillEnd - iOS Only',
    modules: 'Ti.UI.ListItem, Ti.UI.View'
  })

  const legacy = (globalOptions.legacy) ? '[platform=ios]' : ''
  convertedStyles += `'.bg-radial${legacy}': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '125%', endRadius: '0%' } }\n`
  convertedStyles += `'.bg-radial-to-b${legacy}': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '50%', y: '0%' }, endPoint: { x: '50%', y: '0%' } } }\n`
  convertedStyles += `'.bg-radial-to-bl${legacy}': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '100%', y: '0%' } } }\n`
  convertedStyles += `'.bg-radial-to-l${legacy}': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '100%', y: '50%' }, endPoint: { x: '100%', y: '50%' } } }\n`
  convertedStyles += `'.bg-radial-to-tl${legacy}': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '100%' } } }\n`
  convertedStyles += `'.bg-radial-to-t${legacy}': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '50%', y: '100%' }, endPoint: { x: '50%', y: '100%' } } }\n`
  convertedStyles += `'.bg-radial-to-tr${legacy}': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '0%', y: '100%' } } }\n`
  convertedStyles += `'.bg-radial-to-r${legacy}': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '0%', y: '50%' }, endPoint: { x: '0%', y: '50%' } } }\n`
  convertedStyles += `'.bg-radial-to-br${legacy}': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '0%' } } }\n`

  return convertedStyles
}
exports.backgroundRadialGradient = backgroundRadialGradient

function backgroundRepeat() {
  return processProperties({
    prop: 'backgroundRepeat',
    modules: 'Ti.UI.View'
  }, {
    default: '{ backgroundRepeat: {value} }'
  }, {
    default: {
      'bg-repeat': true,
      'bg-dont-repeat': false,
      'background-repeat': true,
      'background-dont-repeat': false
    }
  })
}
exports.backgroundRepeat = backgroundRepeat

function borderStyle() {
  return processProperties({
    prop: 'borderStyle',
    modules: 'Ti.UI.Picker[android], Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'border-style': '{ borderStyle: {value} }'
  }, {
    default: {
      bezel: 'Ti.UI.INPUT_BORDERSTYLE_BEZEL',
      filled: 'Ti.UI.INPUT_BORDERSTYLE_FILLED',
      line: 'Ti.UI.INPUT_BORDERSTYLE_LINE',
      none: 'Ti.UI.INPUT_BORDERSTYLE_NONE',
      rounded: 'Ti.UI.INPUT_BORDERSTYLE_ROUNDED',
      underlined: 'Ti.UI.INPUT_BORDERSTYLE_UNDERLINED'
    }
  })
}
exports.borderStyle = borderStyle

function bubbleParent() {
  return processProperties({
    prop: 'bubbleParent',
    modules: 'Ti.Proxy'
  }, {
    default: '{ bubbleParent: {value} }'
  }, {
    default: {
      'bubble-parent': true,
      'dont-bubble-parent': false
    }
  })
}
exports.bubbleParent = bubbleParent

function buttonStyle() {
  return processProperties({
    prop: 'style',
    modules: 'Ti.UI.Button'
  }, {
    'button-style': '{ style: {value} }'
  }, {
    default: {
      filled: 'Ti.UI.BUTTON_STYLE_FILLED',
      'option-negative': 'Ti.UI.BUTTON_STYLE_OPTION_NEGATIVE',
      'option-neutral': 'Ti.UI.BUTTON_STYLE_OPTION_NEUTRAL',
      'option-positive': 'Ti.UI.BUTTON_STYLE_OPTION_POSITIVE',
      outlined: 'Ti.UI.BUTTON_STYLE_OUTLINED',
      text: 'Ti.UI.BUTTON_STYLE_TEXT'
    }
  })
}
exports.buttonStyle = buttonStyle

function cacheMode() {
  return processProperties({
    prop: 'cacheMode - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    'cache-mode': '{ cacheMode: {value} }',
    'webview-load': '{ cacheMode: {value} }'
  }, {
    android: {
      default: 'Ti.UI.Android.WEBVIEW_LOAD_DEFAULT',
      'no-cache': 'Ti.UI.Android.WEBVIEW_LOAD_NO_CACHE',
      'cache-only': 'Ti.UI.Android.WEBVIEW_LOAD_CACHE_ONLY',
      'cache-else-network': 'Ti.UI.Android.WEBVIEW_LOAD_CACHE_ELSE_NETWORK'
    }
  })
}
exports.cacheMode = cacheMode

function cachePolicy() {
  return processProperties({
    prop: 'cachePolicy - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    'cache-policy': '{ cachePolicy: {value} }'
  }, {
    ios: {
      'use-protocol-cache-only': 'Ti.UI.iOS.CACHE_POLICY_USE_PROTOCOL_CACHE_POLICY',
      'ignoring-local-cache-data': 'Ti.UI.iOS.CACHE_POLICY_RELOAD_IGNORING_LOCAL_CACHE_DATA',
      'return-cache-data-else-load': 'Ti.UI.iOS.CACHE_POLICY_RETURN_CACHE_DATA_ELSE_LOAD',
      'return-cache-data-dont-load': 'Ti.UI.iOS.CACHE_POLICY_RETURN_CACHE_DATA_DONT_LOAD'
    }
  })
}
exports.cachePolicy = cachePolicy

function calendarViewShown() {
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
exports.calendarViewShown = calendarViewShown

function canCancelEvents() {
  return processProperties({
    prop: 'canCancelEvents',
    modules: 'Ti.UI.ScrollView'
  }, {
    default: '{ canCancelEvents: {value} }'
  }, {
    default: {
      'can-cancel-events': true,
      'cant-cancel-events': false
    }
  })
}
exports.canCancelEvents = canCancelEvents

function canDelete() {
  return processProperties({
    prop: 'canDelete - iOS Only',
    modules: 'Ti.UI.DashboardItem'
  }, {
    default: '{ canDelete: {value} }'
  }, {
    ios: {
      'can-delete': true,
      'cant-delete': false
    }
  })
}
exports.canDelete = canDelete

function canEdit() {
  return processProperties({
    prop: 'canEdit',
    modules: 'Ti.UI.ListItem'
  }, {
    default: '{ canEdit: {value} }'
  }, {
    default: {
      'can-edit': true,
      'cant-edit': false
    }
  })
}
exports.canEdit = canEdit

function canInsert() {
  return processProperties({
    prop: 'canInsert',
    modules: 'Ti.UI.ListItem'
  }, {
    default: '{ canInsert: {value} }'
  }, {
    default: {
      'can-insert': true,
      'cant-insert': false
    }
  })
}
exports.canInsert = canInsert

function canMove() {
  return processProperties({
    prop: 'canMove',
    modules: 'Ti.UI.ListItem'
  }, {
    default: '{ canMove: {value} }'
  }, {
    default: {
      'can-move': true,
      'cant-move': false
    }
  })
}
exports.canMove = canMove

function canScroll() {
  return processProperties({
    prop: 'canScroll',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ canScroll: {value} }'
  }, {
    default: {
      'can-scroll': true,
      'cant-scroll': false
    }
  })
}
exports.canScroll = canScroll

function caseInsensitiveSearch() {
  return processProperties({
    prop: 'caseInsensitiveSearch',
    modules: 'Ti.UI.ListView'
  }, {
    case: '{ caseInsensitiveSearch: {value} }'
  }, {
    default: {
      'sensitive-search': false,
      'insensitive-search': true
    }
  })
}
exports.caseInsensitiveSearch = caseInsensitiveSearch

function category() {
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
exports.category = category

function checkable() {
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
exports.checkable = checkable

function clearButtonMode() {
  return processProperties({
    prop: 'clearButtonMode - iOS Only',
    modules: 'Ti.UI.TextField'
  }, {
    'clear-button-mode': '{ clearButtonMode: {value} }'
  }, {
    ios: {
      always: 'Ti.UI.INPUT_BUTTONMODE_ALWAYS',
      never: 'Ti.UI.INPUT_BUTTONMODE_NEVER',
      'on-blur': 'Ti.UI.INPUT_BUTTONMODE_ONBLUR',
      'on-focus': 'Ti.UI.INPUT_BUTTONMODE_ONFOCUS'
    }
  })
}
exports.clearButtonMode = clearButtonMode

function clearOnEdit() {
  return processProperties({
    prop: 'clearOnEdit - Android Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ clearOnEdit: {value} }'
  }, {
    android: {
      'clear-on-edit': true,
      'dont-clear-on-edit': false
    }
  })
}
exports.clearOnEdit = clearOnEdit

function clipMode() {
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
exports.clipMode = clipMode

function contentHeightAndWidth() {
  let convertedStyles = processComments({
    prop: 'contentWidth, contentHeight',
    modules: 'Ti.UI.ScrollView'
  })

  convertedStyles += '\'.content-w-auto\': { contentWidth: Ti.UI.SIZE }\n'
  convertedStyles += '\'.content-h-auto\': { contentHeight: Ti.UI.SIZE }\n'
  convertedStyles += '\'.content-w-screen\': { contentWidth: Ti.UI.FILL }\n'
  convertedStyles += '\'.content-h-screen\': { contentHeight: Ti.UI.FILL }\n'
  convertedStyles += '\'.content-auto\': { contentWidth: Ti.UI.SIZE, contentHeight: Ti.UI.SIZE }\n'
  convertedStyles += '\'.content-screen\': { contentWidth: Ti.UI.FILL, contentHeight: Ti.UI.FILL }\n'

  return convertedStyles
}
exports.contentHeightAndWidth = contentHeightAndWidth

function datePickerStyle() {
  return processProperties({
    prop: 'datePickerStyle',
    modules: 'Ti.UI.Picker'
  }, {
    'date-picker-style': '{ datePickerStyle: {value} }'
  }, {
    default: {
      automatic: 'Ti.UI.DATE_PICKER_STYLE_AUTOMATIC',
      wheels: 'Ti.UI.DATE_PICKER_STYLE_WHEELS',
      compact: 'Ti.UI.DATE_PICKER_STYLE_COMPACT',
      inline: 'Ti.UI.DATE_PICKER_STYLE_INLINE'
    }
  })
}
exports.datePickerStyle = datePickerStyle

function defaultItemTemplate() {
  return processProperties({
    prop: 'defaultItemTemplate',
    modules: 'Ti.UI.ListView'
  }, {
    'list-item-template': '{ defaultItemTemplate: {value} }'
  }, {
    [(globalOptions.legacy) ? 'ios' : 'default']: {
      default: 'Ti.UI.LIST_ITEM_TEMPLATE_DEFAULT',
      contacts: 'Ti.UI.LIST_ITEM_TEMPLATE_CONTACTS',
      settings: 'Ti.UI.LIST_ITEM_TEMPLATE_SETTINGS',
      subtitle: 'Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE'
    }
  })
}
exports.defaultItemTemplate = defaultItemTemplate

function dimBackgroundForSearch() {
  return processProperties({
    prop: 'dimBackgroundForSearch - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ dimBackgroundForSearch: {value} }'
  }, {
    ios: {
      'dim-background-for-search': true,
      'dont-dim-background-for-search': false
    }
  })
}
exports.dimBackgroundForSearch = dimBackgroundForSearch

function disableBounce() {
  return processProperties({
    prop: 'disableBounce - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.ScrollableView, Ti.UI.ScrollView, Ti.UI.WebView'
  }, {
    default: '{ disableBounce: {value} }'
  }, {
    ios: {
      'disable-bounce': true,
      'enable-bounce': false
    }
  })
}
exports.disableBounce = disableBounce

function disableContextMenu() {
  return processProperties({
    prop: 'disableContextMenu - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ disableContextMenu: {value} }'
  }, {
    android: {
      'disable-context-menu': true,
      'dont-disable-context-menu': false
    }
  })
}
exports.disableContextMenu = disableContextMenu

function displayCaps() {
  let convertedStyles = '\n// Property(ies): width, height\n'
  convertedStyles += '// Component(s): Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View\n'
  convertedStyles += '// Description: width and height properties using Ti.Platform.displayCaps platformWidth and platformHeight values\n'
  convertedStyles += '\'.platform-w\': { width: Ti.Platform.displayCaps.platformWidth }\n'
  convertedStyles += '\'.platform-h\': { height: Ti.Platform.displayCaps.platformHeight }\n'

  convertedStyles += '\'.inverted-platform-w[platform=ios]\': { width: Ti.Platform.displayCaps.platformHeight }\n'
  convertedStyles += '\'.inverted-platform-h[platform=ios]\': { height: Ti.Platform.displayCaps.platformWidth }\n'

  convertedStyles += '\'.inverted-platform-w[platform=android]\': { width: Ti.Platform.displayCaps.platformWidth }\n'
  convertedStyles += '\'.inverted-platform-h[platform=android]\': { height: Ti.Platform.displayCaps.platformHeight }\n'

  convertedStyles += '\'.platform-wh\': { width: Ti.Platform.displayCaps.platformWidth, height: Ti.Platform.displayCaps.platformHeight }\n'

  convertedStyles += '\'.platform-w-inverted[platform=ios]\': { width: Ti.Platform.displayCaps.platformHeight }\n'
  convertedStyles += '\'.platform-h-inverted[platform=ios]\': { height: Ti.Platform.displayCaps.platformWidth }\n'
  convertedStyles += '\'.platform-wh-inverted[platform=ios]\': { width: Ti.Platform.displayCaps.platformHeight, height: Ti.Platform.displayCaps.platformWidth }\n'

  convertedStyles += '\'.platform-w-inverted[platform=android]\': { width: Ti.Platform.displayCaps.platformWidth }\n'
  convertedStyles += '\'.platform-h-inverted[platform=android]\': { height: Ti.Platform.displayCaps.platformHeight }\n'
  convertedStyles += '\'.platform-wh-inverted[platform=android]\': { width: Ti.Platform.displayCaps.platformWidth, height: Ti.Platform.displayCaps.platformHeight }\n'

  return convertedStyles
}
exports.displayCaps = displayCaps

function displayHomeAsUp() {
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
exports.displayHomeAsUp = displayHomeAsUp

function visible() {
  if (globalOptions.legacy) {
    return processProperties({
      prop: 'visible',
      modules: 'Ti.UI.View, Ti.Android.ActionBar, Ti.Android.MenuItem, Ti.Media.VideoPlayer, Ti.UI.Android.CardView, Ti.UI.Android.DrawerLayout, Ti.UI.Android.SearchView, Ti.UI.Animation, Ti.UI.Button, Ti.UI.ButtonBar, Ti.UI.DashboardView, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ListView, Ti.UI.MaskedImage, Ti.UI.NavigationWindow, Ti.UI.OptionBar, Ti.UI.Picker, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.ScrollView, Ti.UI.ScrollableView, Ti.UI.SearchBar, Ti.UI.ShortcutItem, Ti.UI.Slider, Ti.UI.Switch, Ti.UI.TabGroup, Ti.UI.TabbedBar, Ti.UI.TableView, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Toolbar, Ti.UI.WebView, Ti.UI.Window, Ti.UI.iOS.BlurView, Ti.UI.iOS.CoverFlowView, Ti.UI.iOS.LivePhotoView, Ti.UI.iOS.SplitWindow, Ti.UI.iOS.Stepper'
    }, {
      default: '{ visible: {value} }'
    }, {
      default: {
        block: true,
        hidden: false,
        visible: true,
        invisible: false
      }
    })
  } else {
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
}
exports.visible = visible

function constraint() {
  return processProperties({
    prop: 'A custom property to use it with the Animation module',
    modules: 'Ti.UI.Animation'
  }, {
    default: '{ constraint: {value} }'
  }, {
    default: {
      'horizontal-constraint': 'horizontal',
      'vertical-constraint': 'vertical'
    }
  })
}
exports.constraint = constraint

function draggingType() {
  return processProperties({
    prop: 'draggingType',
    modules: 'For the Animation Component'
  }, {
    drag: '{ draggingType: {value} }'
  }, {
    default: {
      apply: 'apply',
      animate: 'animate'
    }
  })
}
exports.draggingType = draggingType

function drawerIndicatorEnabled() {
  return processProperties({
    prop: 'drawerIndicatorEnabled - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    'drawer-indicator': '{ drawerIndicatorEnabled: {value} }'
  }, {
    android: {
      enabled: true,
      disabled: false
    }
  })
}
exports.drawerIndicatorEnabled = drawerIndicatorEnabled

function drawerLockMode() {
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
exports.drawerLockMode = drawerLockMode

function dropShadow() {
  const shadowValue = '#80000000'
  let convertedStyles = processComments({
    prop: 'shadowOffset, shadowRadius, shadowColor - Drop Shadow in Tailwind',
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
exports.dropShadow = dropShadow

function duration() {
  return processProperties({
    prop: 'duration - Android Only',
    modules: 'Ti.UI.Notification'
  }, {
    'notification-duration': '{ duration: {value} }'
  }, {
    android: {
      long: 'Ti.UI.NOTIFICATION_DURATION_LONG',
      short: 'Ti.UI.NOTIFICATION_DURATION_SHORT'
    }
  })
}
exports.duration = duration

function editable() {
  return processProperties({
    prop: 'editable',
    modules: 'Ti.UI.DashboardView, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ editable: {value} }'
  }, {
    default: {
      editable: true,
      [(globalOptions.legacy) ? 'non-editable' : 'editable-false']: false
    }
  })
}
exports.editable = editable

function editing() {
  return processProperties({
    prop: 'editing - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ editing: {value} }'
  }, {
    default: {
      editing: true,
      'no-editing': true
    }
  })
}
exports.editing = editing

function ellipsize() {
  let convertedStyles = processProperties({
    prop: 'ellipsize',
    modules: 'Ti.UI.Label'
  }, {
    ellipsize: '{ ellipsize: {value} }'
  }, {
    default: {
      end: 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_END',
      clip: 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_CLIP',
      none: 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_NONE',
      start: 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_START',
      middle: 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MIDDLE',
      marquee: 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE',
      'char-wrap': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_CHAR_WRAP',
      'word-wrap': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_WORD_WRAP'
    }
  })

  // for Labels
  convertedStyles += processProperties({
    prop: 'ellipsize',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ ellipsize: {value} }'
  }, {
    default: {
      ellipsize: true,
      [(globalOptions.legacy) ? 'no-ellipsize' : 'ellipsize-false']: false
    }
  })

  return convertedStyles
}
exports.ellipsize = ellipsize

function enableCopy() {
  return processProperties({
    prop: 'enableCopy',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ enableCopy: {value} }'
  }, {
    default: {
      'enable-copy': true,
      'disable-copy': false
    }
  })
}
exports.enableCopy = enableCopy

function enabled() {
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
exports.enabled = enabled

function enableJavascriptInterface() {
  return processProperties({
    prop: 'enableJavascriptInterface - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ enableJavascriptInterface: {value} }'
  }, {
    android: {
      'enable-javascript-interfase': true,
      'disable-javascript-interfase': false,
      'enable-js-interfase': true,
      'disable-js-interfase': false
    }
  })
}
exports.enableJavascriptInterface = enableJavascriptInterface

function enableReturnKey() {
  return processProperties({
    prop: 'enableReturnKey',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ enableReturnKey: {value} }'
  }, {
    default: {
      'enable-return-key': true,
      'disable-return-key': false
    }
  })
}
exports.enableReturnKey = enableReturnKey

function enableZoomControls() {
  return processProperties({
    prop: 'enableZoomControls - Android Only',
    modules: 'Ti.UI.ImageView. Ti.UI.WebView'
  }, {
    default: '{ enableZoomControls: {value} }'
  }, {
    android: {
      'enable-zoom-control': true,
      'disable-zoom-control': false
    }
  })
}
exports.enableZoomControls = enableZoomControls

function exitOnClose() {
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
exports.exitOnClose = exitOnClose

function extendBackground() {
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
exports.extendBackground = extendBackground

function extendEdges() {
  return processProperties({
    prop: 'extendEdges - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'extend-edges': '{ extendEdges: {value} }'
  }, {
    ios: {
      all: '[ Ti.UI.EXTEND_EDGE_ALL ]',
      bottom: '[ Ti.UI.EXTEND_EDGE_BOTTOM ]',
      left: '[ Ti.UI.EXTEND_EDGE_LEFT ]',
      none: '[ Ti.UI.EXTEND_EDGE_NONE ]',
      right: '[ Ti.UI.EXTEND_EDGE_RIGHT ]',
      top: '[ Ti.UI.EXTEND_EDGE_TOP ]'
    }
  })
}
exports.extendEdges = extendEdges

function extendSafeArea() {
  return processProperties({
    prop: 'extendSafeArea',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ extendSafeArea: {value} }'
  }, {
    default: {
      'extend-safe-area': true,
      'dont-extend-safe-area': false
    }
  })
}
exports.extendSafeArea = extendSafeArea

function fastScroll() {
  return processProperties({
    prop: 'fastScroll - Android Only',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ fastScroll: {value} }'
  }, {
    android: {
      'fast-scroll': true,
      'slow-scroll': false
    }
  })
}
exports.fastScroll = fastScroll

function filterAnchored() {
  return processProperties({
    prop: 'filterAnchored',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ filterAnchored: {value} }'
  }, {
    default: {
      'filter-anchored': true,
      'dont-filter-anchored': false
    }
  })
}
exports.filterAnchored = filterAnchored

function filterAttribute() {
  return processProperties({
    prop: 'filterAttribute',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ filterAttribute: {value} }'
  }, {
    default: {
      'filter-attribute': true,
      [(globalOptions.legacy) ? 'dont-filter-attribute' : 'filter-attribute-false']: false
    }
  })
}
exports.filterAttribute = filterAttribute

function filterCaseInsensitive() {
  return processProperties({
    prop: 'filterCaseInsensitive',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ filterCaseInsensitive: {value} }'
  }, {
    default: {
      'filter-case-sensitive': false,
      'filter-case-insensitive': true
    }
  })
}
exports.filterCaseInsensitive = filterCaseInsensitive

function filterTouchesWhenObscured() {
  return processProperties({
    prop: 'filterTouchesWhenObscured - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ filterTouchesWhenObscured: {value} }'
  }, {
    android: {
      'filter-touches-when-obscured': true,
      'dont-filter-touches-when-obscured': false
    }
  })
}
exports.filterTouchesWhenObscured = filterTouchesWhenObscured

function flags() {
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
exports.flags = flags

function flagSecure() {
  return processProperties({
    prop: 'flagSecure - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    flag: '{ flagSecure: {value} }'
  }, {
    android: {
      secure: true,
      'not-secure': false
    }
  })
}
exports.flagSecure = flagSecure

function flip() {
  return processProperties({
    prop: 'flip',
    modules: 'For the Animation Component'
  }, {
    flip: '{ flip: {value} }'
  }, {
    default: {
      horizontal: 'horizontal',
      vertical: 'vertical'
    }
  })
}
exports.flip = flip

function focusable() {
  return processProperties({
    prop: 'focusable - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ focusable: {value} }'
  }, {
    android: {
      focusable: true,
      'no-focusable': false
    }
  })
}
exports.focusable = focusable

function fontStyle() {
  return processProperties({
    prop: 'fontStyle',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Button, Ti.UI.Label, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.PickerColumn, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ font: { fontStyle: {value} } }'
  }, {
    default: {
      italic: 'italic',
      'not-italic': 'normal'
    }
  })
}
exports.fontStyle = fontStyle

function footerDividersEnabled() {
  return processProperties({
    prop: 'footerDividersEnabled - Android Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    'footer-dividers': '{ footerDividersEnabled: {value} }'
  }, {
    android: {
      enabled: true,
      disabled: false
    }
  })
}
exports.footerDividersEnabled = footerDividersEnabled

function format24() {
  return processProperties({
    prop: 'format24 - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    format: '{ format24: {value} }'
  }, {
    android: {
      24: true,
      12: false
    }
  })
}
exports.format24 = format24

function fullscreen() {
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
exports.fullscreen = fullscreen

function gravity() {
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
exports.gravity = gravity

function gridColumnsRowsStartEnd() {
  let modifiersAndValues = {
    1: '8.333334%',
    2: '16.666667%',
    3: '25%',
    4: '33.333334%',
    5: '41.666667%',
    6: '50%',
    7: '58.333334%',
    8: '66.666667%',
    9: '75%',
    10: '83.333334%',
    11: '91.666667%',
    12: '100%'
  }

  let convertedStyles = processProperties({
    prop: 'width - For Grid Column Start/End',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View, Ti.UI.Window'
  }, {
    'col-span': '{ width: {value} }'
  }, {
    default: modifiersAndValues
  })

  modifiersAndValues = {
    1: '8.333334%',
    2: '16.666667%',
    3: '25%',
    4: '33.333334%',
    5: '41.666667%',
    6: '50%',
    7: '58.333334%',
    8: '66.666667%',
    9: '75%',
    10: '83.333334%',
    11: '91.666667%',
    12: '100%'
  }

  convertedStyles += processProperties({
    prop: 'height - For Grid Row Start/End',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View, Ti.UI.Window'
  }, {
    'row-span': '{ height: {value} }'
  }, {
    default: modifiersAndValues
  })

  return convertedStyles
}
exports.gridColumnsRowsStartEnd = gridColumnsRowsStartEnd

function gridFlow() {
  return processProperties({
    prop: 'layout',
    modules: 'Ti.UI.View',
    description: 'Grid Flow - layout'
  }, {
    grid: '{ layout: {value} }'
  }, {
    default: {
      default: 'horizontal\', width: \'100%',
      'flow-col': 'horizontal\', width: \'100%',
      'flow-row': 'vertical\', height: \'100%'
    }
  })
}
exports.gridFlow = gridFlow

function gridSystem() {
  let modifiersAndValues = {
    1: '100%',
    2: '50%',
    3: '33.333334%',
    4: '25%',
    5: '20%',
    6: '16.666667%',
    7: '14.285714%',
    8: '12.5%',
    9: '11.111111%',
    10: '10%',
    11: '9.090909%',
    12: '8.333334%'
  }

  let convertedStyles = processProperties({
    prop: 'width - For Grid Template Columns',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View, Ti.UI.Window'
  }, {
    'grid-cols': '{ width: {value} }'
  }, {
    default: modifiersAndValues
  })

  modifiersAndValues = {
    1: '100%',
    2: '50%',
    3: '33.333334%',
    4: '25%',
    5: '20%',
    6: '16.666667%',
    7: '14.285714%',
    8: '12.5%',
    9: '11.111111%',
    10: '10%',
    11: '9.090909%',
    12: '8.333334%'
  }

  convertedStyles += processProperties({
    prop: 'height - For Grid Template Rows',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View, Ti.UI.Window'
  }, {
    'grid-rows': '{ height: {value} }'
  }, {
    default: modifiersAndValues
  })

  return convertedStyles
}
exports.gridSystem = gridSystem

function hasCheck() {
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
exports.hasCheck = hasCheck

function hasChild() {
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
exports.hasChild = hasChild

function hasDetail() {
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
exports.hasDetail = hasDetail

function headerDividersEnabled() {
  return processProperties({
    prop: 'headerDividersEnabled - Android Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    'header-dividers': '{ headerDividersEnabled: {value} }'
  }, {
    android: {
      enabled: true,
      disabled: false
    }
  })
}
exports.headerDividersEnabled = headerDividersEnabled

function hiddenBehavior() {
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
exports.hiddenBehavior = hiddenBehavior

function hideLoadIndicator() {
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
exports.hideLoadIndicator = hideLoadIndicator

function hidesBackButton() {
  return processProperties({
    prop: 'hidesBackButton',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ hidesBackButton: {value} }'
  }, {
    default: {
      'hides-back-button': true,
      'shows-back-button': false
    }
  })
}
exports.hidesBackButton = hidesBackButton

function hidesBarsOnSwipe() {
  return processProperties({
    prop: 'hidesBarsOnSwipe - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ hidesBarsOnSwipe: {value} }'
  }, {
    ios: {
      'hides-bars-on-swipe': true,
      'shows-bars-on-swipe': false
    }
  })
}
exports.hidesBarsOnSwipe = hidesBarsOnSwipe

function hidesBarsOnTap() {
  return processProperties({
    prop: 'hidesBarsOnTap - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ hidesBarsOnTap: {value} }'
  }, {
    ios: {
      'hides-bars-on-tap': true,
      'shows-bars-on-tap': false
    }
  })
}
exports.hidesBarsOnTap = hidesBarsOnTap

function hidesBarsWhenKeyboardAppears() {
  return processProperties({
    prop: 'hidesBarsWhenKeyboardAppears - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ hidesBarsWhenKeyboardAppears: {value} }'
  }, {
    ios: {
      'hides-bars-when-keyboard-appears': true,
      'shows-bars-when-keyboard-appears': false
    }
  })
}
exports.hidesBarsWhenKeyboardAppears = hidesBarsWhenKeyboardAppears

function hideSearchOnSelection() {
  return processProperties({
    prop: 'hideSearchOnSelection - iOS Only',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ hideSearchOnSelection: {value} }'
  }, {
    ios: {
      'hide-search-on-selection': true,
      'show-search-on-selection': false
    }
  })
}
exports.hideSearchOnSelection = hideSearchOnSelection

function hideShadow() {
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
exports.hideShadow = hideShadow

function hidesSearchBarWhenScrolling() {
  return processProperties({
    prop: 'hidesSearchBarWhenScrolling - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ hidesSearchBarWhenScrolling: {value} }'
  }, {
    ios: {
      'hides-search-bar-when-scrolling': true,
      'shows-search-bar-when-scrolling': false
    }
  })
}
exports.hidesSearchBarWhenScrolling = hidesSearchBarWhenScrolling

function hintType() {
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
exports.hintType = hintType

function hires() {
  return processProperties({
    prop: 'hires - iOS Only',
    modules: 'Ti.UI.ImageView. Ti.UI.WebView'
  }, {
    default: '{ hires: {value} }'
  }, {
    ios: {
      hires: true,
      lowres: false
    }
  })
}
exports.hires = hires

function homeButtonEnabled() {
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
exports.homeButtonEnabled = homeButtonEnabled

function homeIndicatorAutoHidden() {
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
exports.homeIndicatorAutoHidden = homeIndicatorAutoHidden

function horizontalWrap() {
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
exports.horizontalWrap = horizontalWrap

function html() {
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
exports.html = html

function icon() {
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
exports.icon = icon

function iconified() {
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
exports.iconified = iconified

function iconifiedByDefault() {
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
exports.iconifiedByDefault = iconifiedByDefault

function iconIsMask() {
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
exports.iconIsMask = iconIsMask

function ignoreSslError() {
  return processProperties({
    prop: 'ignoreSslError',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ ignoreSslError: {value} }'
  }, {
    default: {
      'ignore-ssl-error': true,
      'dont-ignore-ssl-error': false
    }
  })
}
exports.ignoreSslError = ignoreSslError

function imageTouchFeedback() {
  return processProperties({
    prop: 'imageTouchFeedback - Android Only',
    modules: 'Ti.UI.ImageView'
  }, {
    default: '{ imageTouchFeedback: {value} }'
  }, {
    android: {
      'image-touch-feedback': true,
      'no-image-touch-feedback': false
    }
  })
}
exports.imageTouchFeedback = imageTouchFeedback

function includeFontPadding() {
  return processProperties({
    prop: 'includeFontPadding - Android Only',
    modules: 'Ti.UI.Label'
  }, {
    default: '{ includeFontPadding: {value} }'
  }, {
    android: {
      'include-font-padding': true,
      'dont-include-font-padding': false
    }
  })
}
exports.includeFontPadding = includeFontPadding

function includeOpaqueBars() {
  return processProperties({
    prop: 'includeOpaqueBars - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ includeOpaqueBars: {value} }'
  }, {
    ios: {
      'include-opaque-bars': true,
      'exclude-opaque-bars': false
    }
  })
}
exports.includeOpaqueBars = includeOpaqueBars

function inputType() {
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
exports.inputType = inputType

function items() {
  let convertedStyles = processComments({
    prop: 'top, bottom, width(FILL), height(FILL)',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animaiton, Ti.UI.View, Ti.UI.Window',
    description: 'top, bottom, width, height properties for aligning items in a Grid System'
  })
  convertedStyles += '\'.items-start\': { top: 0 }\n'
  convertedStyles += '\'.items-end\': { bottom: 0 }\n'
  convertedStyles += '\'.items-center\': { width: Ti.UI.FILL, height: Ti.UI.FILL }\n'

  return convertedStyles
}
exports.items = items

function keepScreenOn() {
  return processProperties({
    prop: 'keepScreenOn - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ keepScreenOn: {value} }'
  }, {
    android: {
      'keep-screen-on': true,
      'dont-keep-screen-on': false
    }
  })
}
exports.keepScreenOn = keepScreenOn

function keepSectionsInSearch() {
  return processProperties({
    prop: 'keepSectionsInSearch - iOS Only',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ keepSectionsInSearch: {value} }'
  }, {
    ios: {
      'keep-sections-in-search': true,
      'dont-keep-sections-in-search': false
    }
  })
}
exports.keepSectionsInSearch = keepSectionsInSearch

function keyboardAppearance() {
  return processProperties({
    prop: 'keyboardAppearance - iOS Only',
    modules: 'Ti.UI.AlertDialog, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    keyboard: '{ keyboardAppearance: {value} }'
  }, {
    ios: {
      appearance: {
        default: 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
        dark: 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
        light: 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT'
      }
    }
  })
}
exports.keyboardAppearance = keyboardAppearance

function keyboardDismissMode() {
  return processProperties({
    prop: 'keyboardDismissMode - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    'keyboard-dismiss-mode': '{ keyboardDismissMode: {value} }'
  }, {
    ios: {
      none: 'Ti.UI.iOS.KEYBOARD_DISMISS_MODE_NONE',
      'on-drag': 'Ti.UI.iOS.KEYBOARD_DISMISS_MODE_ON_DRAG',
      interactive: 'Ti.UI.iOS.KEYBOARD_DISMISS_MODE_INTERACTIVE'
    }
  })
}
exports.keyboardDismissMode = keyboardDismissMode

function keyboardDisplayRequiresUserAction() {
  return processProperties({
    prop: 'keyboardDisplayRequiresUserAction - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ keyboardDisplayRequiresUserAction: {value} }'
  }, {
    ios: {
      'keyboard-display-requires-user-action': true,
      'keyboard-display-dont-require-user-action': false
    }
  })
}
exports.keyboardDisplayRequiresUserAction = keyboardDisplayRequiresUserAction

function keyboardType() {
  return processProperties({
    prop: 'keyboardType',
    modules: 'Ti.UI.AlertDialog, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'keyboard-type': '{ keyboardType: {value} }'
  }, {
    default: {
      default: 'Ti.UI.KEYBOARD_TYPE_DEFAULT',
      ascii: 'Ti.UI.KEYBOARD_TYPE_ASCII',
      'decimal-pad': 'Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD',
      email: 'Ti.UI.KEYBOARD_TYPE_EMAIL',
      'namephone-pad': 'Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD',
      'number-pad': 'Ti.UI.KEYBOARD_TYPE_NUMBER_PAD',
      'numbers-punctuation': 'Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION',
      'phone-pad': 'Ti.UI.KEYBOARD_TYPE_PHONE_PAD',
      url: 'Ti.UI.KEYBOARD_TYPE_URL'
    },
    ios: {
      appearance: 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
      'appearance-dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
      'appearance-light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT',
      twitter: 'Ti.UI.KEYBOARD_TYPE_TWITTER',
      websearch: 'Ti.UI.KEYBOARD_TYPE_WEBSEARCH'
    }
  })
}
exports.keyboardType = keyboardType

function largeTitleDisplayMode() {
  return processProperties({
    prop: 'largeTitleDisplayMode - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'large-title-display': '{ largeTitleDisplayMode: {value} }'
  }, {
    ios: {
      always: 'Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_ALWAYS',
      automatic: 'Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_AUTOMATIC',
      never: 'Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_NEVER'
    }
  })
}
exports.largeTitleDisplayMode = largeTitleDisplayMode

function largeTitleEnabled() {
  return processProperties({
    prop: 'largeTitleEnabled - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'large-title': '{ largeTitleEnabled: {value} }'
  }, {
    ios: {
      enabled: true,
      disabled: false
    }
  })
}
exports.largeTitleEnabled = largeTitleEnabled

function layout() {
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
exports.layout = layout

function lazyLoadingEnabled() {
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
exports.lazyLoadingEnabled = lazyLoadingEnabled

function leftButtonMode() {
  return processProperties({
    prop: 'leftButtonMode - iOS Only',
    modules: 'Ti.UI.TextField'
  }, {
    'left-button-mode': '{ leftButtonMode: {value} }'
  }, {
    ios: {
      always: 'Ti.UI.INPUT_BUTTONMODE_ALWAYS',
      never: 'Ti.UI.INPUT_BUTTONMODE_NEVER',
      'on-blur': 'Ti.UI.INPUT_BUTTONMODE_ONBLUR',
      'on-focus': 'Ti.UI.INPUT_BUTTONMODE_ONFOCUS'
    }
  })
}
exports.leftButtonMode = leftButtonMode

function leftDrawerLockMode() {
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
exports.leftDrawerLockMode = leftDrawerLockMode

function lightTouchEnabled() {
  return processProperties({
    prop: 'lightTouchEnabled - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ lightTouchEnabled: {value} }'
  }, {
    android: {
      'light-touch-enabled': true,
      'light-touch-disabled': false
    }
  })
}
exports.lightTouchEnabled = lightTouchEnabled

function listViewStyle() {
  return processProperties({
    prop: 'style - iOS Only',
    modules: 'Ti.UI.ListView'
  }, {
    'list-view-style': '{ style: {value} }'
  }, {
    ios: {
      plain: 'Ti.UI.iOS.ListViewStyle.PLAIN',
      group: 'Ti.UI.iOS.ListViewStyle.GROUPED',
      'inset-grouped': 'Ti.UI.iOS.ListViewStyle.INSET_GROUPED'
    }
  })
}
exports.listViewStyle = listViewStyle

function loginKeyboardType() {
  return processProperties({
    prop: 'loginKeyboardType',
    modules: 'Ti.UI.AlertDialog'
  }, {
    'login-keyboard-type': '{ loginKeyboardType: {value} }'
  }, {
    default: {
      ascii: 'Ti.UI.KEYBOARD_TYPE_ASCII',
      'decimal-pad': 'Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD',
      default: 'Ti.UI.KEYBOARD_TYPE_DEFAULT',
      email: 'Ti.UI.KEYBOARD_TYPE_EMAIL',
      'namephone-pad': 'Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD',
      'number-pad': 'Ti.UI.KEYBOARD_TYPE_NUMBER_PAD',
      'numbers-punctuation': 'Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION',
      'phone-pad': 'Ti.UI.KEYBOARD_TYPE_PHONE_PAD',
      url: 'Ti.UI.KEYBOARD_TYPE_URL'
    },
    ios: {
      'appearance-dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
      'appearance-light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT',
      appearance: 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
      twitter: 'Ti.UI.KEYBOARD_TYPE_TWITTER',
      websearch: 'Ti.UI.KEYBOARD_TYPE_WEBSEARCH'
    }
  })
}
exports.loginKeyboardType = loginKeyboardType

function loginReturnKeyType() {
  return processProperties({
    prop: 'loginReturnKeyType',
    modules: 'Ti.UI.AlertDialog'
  }, {
    'login-return-key-type': '{ loginReturnKeyType: {value} }'
  }, {
    default: {
      default: 'Ti.UI.RETURNKEY_DEFAULT',
      go: 'Ti.UI.RETURNKEY_GO',
      done: 'Ti.UI.RETURNKEY_DONE',
      join: 'Ti.UI.RETURNKEY_JOIN',
      next: 'Ti.UI.RETURNKEY_NEXT',
      send: 'Ti.UI.RETURNKEY_SEND',
      route: 'Ti.UI.RETURNKEY_ROUTE',
      yahoo: 'Ti.UI.RETURNKEY_YAHOO',
      google: 'Ti.UI.RETURNKEY_GOOGLE',
      search: 'Ti.UI.RETURNKEY_SEARCH',
      'emergency-call': 'Ti.UI.RETURNKEY_EMERGENCY_CALL'
    },
    ios: {
      continue: 'Ti.UI.RETURNKEY_CONTINUE'
    }
  })
}
exports.loginReturnKeyType = loginReturnKeyType

function mixedContentMode() {
  return processProperties({
    prop: 'mixedContentMode - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ mixedContentMode: {value} }'
  }, {
    android: {
      'mixed-content-mode': true,
      'unmixed-content-mode': false
    }
  })
}
exports.mixedContentMode = mixedContentMode

function modal() {
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
exports.modal = modal

function moveable() {
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
exports.moveable = moveable

function moving() {
  return processProperties({
    prop: 'moving',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ moving: {value} }'
  }, {
    default: {
      moving: true
    }
  })
}
exports.moving = moving

function nativeSpinner() {
  return processProperties({
    prop: 'nativeSpinner - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    default: '{ nativeSpinner: {value} }'
  }, {
    android: {
      'native-spinner': true
    }
  })
}
exports.nativeSpinner = nativeSpinner

function navBarHidden() {
  return processProperties({
    prop: 'navBarHidden',
    modules: 'Ti.UI.Window'
  }, {
    'nav-bar': '{ navBarHidden: {value} }'
  }, {
    default: {
      hidden: true,
      visible: false
    }
  })
}
exports.navBarHidden = navBarHidden

function navigationMode() {
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
exports.navigationMode = navigationMode

function horizontalMargin() {
  const convertedStyles = processProperties({
    prop: 'horizontalMargin - Android Only',
    modules: 'Ti.UI.Notification'
  }, {
    horizontal: '{ horizontalMargin: \'{value}\' }'
  }, {
    android: {
      center: 0,
      left: '-0.5',
      right: '0.5'
    }
  })

  return convertedStyles
}
exports.horizontalMargin = horizontalMargin

function verticalMargin() {
  const convertedStyles = processProperties({
    prop: 'verticalMargin - Android Only',
    modules: 'Ti.UI.Notification'
  }, {
    vertical: '{ verticalMargin: \'{value}\' }'
  }, {
    android: {
      center: 0,
      top: '-0.5',
      bottom: '0.5'
    }
  })

  return convertedStyles
}
exports.verticalMargin = verticalMargin

function orientationModes() {
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
      landscape: '[ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]'
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
exports.orientationModes = orientationModes

function anchorPoint() {
  const objectPosition = {
    center: 'x: 0.5, y: 0.5',
    top: 'x: 0.5, y: 0',
    'top-right': 'x: 1, y: 0',
    right: 'x: 0.5, y: 1',
    'bottom-right': 'x: 1, y: 1',
    bottom: 'x: 0.5, y: 1',
    'bottom-left': 'x: 0, y: 1',
    left: 'x: 0, y: 0.5',
    'top-left': 'x: 0, y: 0'
  }
  // '\n// anchorPoint Properties\n'
  let convertedStyles = processComments({
    prop: 'anchorPoint',
    modules: 'Ti.UI.Animation, Ti.UI.View'
  })

  _.each(objectPosition, (value, modifier) => {
    convertedStyles += `'.origin-${modifier}': { anchorPoint: { ${value} } }\n`
  })

  convertedStyles += '\n// anchor-point-{position} variant\n'; ``
  _.each(objectPosition, (value, modifier) => {
    convertedStyles += `'.anchor-point-${modifier}': { anchorPoint: { ${value} } }\n`
  })

  return convertedStyles
}
exports.anchorPoint = anchorPoint

function overlayEnabled() {
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
exports.overlayEnabled = overlayEnabled

function overrideCurrentAnimation() {
  return processProperties({
    prop: 'overrideCurrentAnimation - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ overrideCurrentAnimation: {value} }'
  }, {
    android: {
      'override-current-animation': true,
      'dont-override-current-animation': false
    }
  })
}
exports.overrideCurrentAnimation = overrideCurrentAnimation

function overScrollMode() {
  return processProperties({
    prop: 'overScrollMode - Android Only',
    modules: 'Ti.UI.ScrollableView, Ti.UI.ScrollView, Ti.UI.TableView, Ti.UI.WebView'
  }, {
    'over-scroll': '{ overScrollMode: {value} }'
  }, {
    android: {
      always: 'Ti.UI.Android.OVER_SCROLL_ALWAYS',
      'if-content-scrolls': 'Ti.UI.Android.OVER_SCROLL_IF_CONTENT_SCROLLS',
      never: 'Ti.UI.Android.OVER_SCROLL_NEVER'
    }
  })
}
exports.overScrollMode = overScrollMode

function showPagingControl() {
  return processProperties({
    prop: 'showPagingControl',
    modules: 'Ti.UI.ScrollableView'
  }, {
    default: '{ showPagingControl: {value} }'
  }, {
    default: {
      'show-paging-control': true,
      'hide-paging-control': false
    }
  })
}
exports.showPagingControl = showPagingControl

function pagingControlOnTop() {
  return processProperties({
    prop: 'pagingControlOnTop - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control-on': '{ pagingControlOnTop: {value} }'
  }, {
    default: {
      top: true,
      bottom: false
    }
  })
}
exports.pagingControlOnTop = pagingControlOnTop

function passwordKeyboardType() {
  return processProperties({
    prop: 'passwordKeyboardType',
    modules: 'Ti.UI.AlertDialog'
  }, {
    'password-keyboard': '{ passwordKeyboardType: {value} }'
  }, {
    default: {
      type: 'Ti.UI.KEYBOARD_TYPE_DEFAULT',
      'type-ascii': 'Ti.UI.KEYBOARD_TYPE_ASCII',
      'type-decimal-pad': 'Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD',
      'type-email': 'Ti.UI.KEYBOARD_TYPE_EMAIL',
      'type-namephone-pad': 'Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD',
      'type-number-pad': 'Ti.UI.KEYBOARD_TYPE_NUMBER_PAD',
      'type-numbers-punctuation': 'Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION',
      'type-phone-pad': 'Ti.UI.KEYBOARD_TYPE_PHONE_PAD',
      'type-url': 'Ti.UI.KEYBOARD_TYPE_URL'
    },
    ios: {
      'type-appearance-dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
      'type-appearance-light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT',
      'type-appearance': 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
      'type-twitter': 'Ti.UI.KEYBOARD_TYPE_TWITTER',
      'type-websearch': 'Ti.UI.KEYBOARD_TYPE_WEBSEARCH'
    }
  })
}
exports.passwordKeyboardType = passwordKeyboardType

function passwordMask() {
  return processProperties({
    prop: 'passwordMask',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ passwordMask: {value} }'
  }, {
    default: {
      'password-mask': true,
      'password-unmask': false
    }
  })
}
exports.passwordMask = passwordMask

function pickerType() {
  return processProperties({
    prop: 'type (Picker Type)',
    modules: 'Ti.UI.Picker'
  }, {
    'picker-type': '{ type: {value} }'
  }, {
    default: {
      'count-down-timer': 'Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER',
      date: 'Ti.UI.PICKER_TYPE_DATE',
      'date-and-time': 'Ti.UI.PICKER_TYPE_DATE_AND_TIME',
      plain: 'Ti.UI.PICKER_TYPE_PLAIN',
      time: 'Ti.UI.PICKER_TYPE_TIME'
    }
  })
}
exports.pickerType = pickerType

function placement() {
  const objectPosition = {
    'top-auto': 'top: Ti.UI.SIZE',
    'left-auto': 'left: Ti.UI.SIZE',
    'right-auto': 'right: Ti.UI.SIZE',
    'bottom-auto': 'bottom: Ti.UI.SIZE',

    'inset-x-0': 'right: 0, left: 0',
    'inset-y-0': 'top: 0, bottom: 0',
    'inset-0': 'top: 0, right: 0, bottom: 0, left: 0',

    'inset-x-auto': 'right: Ti.UI.SIZE, left: Ti.UI.SIZE',
    'inset-y-auto': 'top: Ti.UI.SIZE, bottom: Ti.UI.SIZE',
    'inset-auto': 'top: Ti.UI.SIZE, right: Ti.UI.SIZE, bottom: Ti.UI.SIZE, left: Ti.UI.SIZE'
  }

  let convertedStyles = processComments({
    prop: 'top, right, bottom, left',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window'
  })

  _.each(objectPosition, (value, modifier) => {
    convertedStyles += `'.${modifier}': { ${value} }\n`
  })

  return convertedStyles
}
exports.placement = placement

function pluginState() {
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
exports.pluginState = pluginState

function preventCornerOverlap() {
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
exports.preventCornerOverlap = preventCornerOverlap

function preventDefaultImage() {
  return processProperties({
    prop: 'preventDefaultImage - iOS Only',
    modules: 'Ti.UI.ImageView'
  }, {
    default: '{ preventDefaultImage: {value} }'
  }, {
    [(globalOptions.legacy) ? 'ios' : 'default']: {
      'prevent-default-image': true,
      [(globalOptions.legacy) ? 'display-default-image' : 'prevent-default-image-false']: false
    }
  })
}
exports.preventDefaultImage = preventDefaultImage

function previewActionStyle() {
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
exports.previewActionStyle = previewActionStyle

function progressBarStyle() {
  return processProperties({
    prop: 'style - iOS Only',
    modules: 'Ti.UI.ProgressBar'
  }, {
    'progress-bar-style': '{ style: {value} }'
  }, {
    ios: {
      bar: 'Ti.UI.iOS.ProgressBarStyle.BAR',
      default: 'Ti.UI.iOS.ProgressBarStyle.DEFAULT',
      plain: 'Ti.UI.iOS.ProgressBarStyle.PLAIN'
    }
  })
}
exports.progressBarStyle = progressBarStyle

function cancelable() {
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
exports.cancelable = cancelable

function canceledOnTouchOutside() {
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
exports.canceledOnTouchOutside = canceledOnTouchOutside

function location() {
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
exports.location = location

function progressIndicatorType() {
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
exports.progressIndicatorType = progressIndicatorType

function pruneSectionsOnEdit() {
  return processProperties({
    prop: 'pruneSectionsOnEdit - iOS Only',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ pruneSectionsOnEdit: {value} }'
  }, {
    ios: {
      'prune-sections-on-edit': true,
      'dont-prune-sections-on-edit': false
    }
  })
}
exports.pruneSectionsOnEdit = pruneSectionsOnEdit

function requestedOrientation() {
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
exports.requestedOrientation = requestedOrientation

function resultsSeparatorStyle() {
  return processProperties({
    prop: 'resultsSeparatorStyle - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    'results-separator-style': '{ resultsSeparatorStyle: {value} }'
  }, {
    ios: {
      none: 'Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE',
      'single-line': 'Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_SINGLE_LINE'
    }
  })
}
exports.resultsSeparatorStyle = resultsSeparatorStyle

function returnKeyType() {
  return processProperties({
    prop: 'returnKeyType',
    modules: 'Ti.UI.AlertDialog, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'return-key-type': '{ returnKeyType: {value} }'
  }, {
    default: {
      default: 'Ti.UI.RETURNKEY_DEFAULT',
      go: 'Ti.UI.RETURNKEY_GO',
      done: 'Ti.UI.RETURNKEY_DONE',
      join: 'Ti.UI.RETURNKEY_JOIN',
      next: 'Ti.UI.RETURNKEY_NEXT',
      send: 'Ti.UI.RETURNKEY_SEND',
      route: 'Ti.UI.RETURNKEY_ROUTE',
      yahoo: 'Ti.UI.RETURNKEY_YAHOO',
      google: 'Ti.UI.RETURNKEY_GOOGLE',
      search: 'Ti.UI.RETURNKEY_SEARCH',
      'emergency-call': 'Ti.UI.RETURNKEY_EMERGENCY_CALL'
    },
    ios: {
      continue: 'Ti.UI.RETURNKEY_CONTINUE'
    }
  })
}
exports.returnKeyType = returnKeyType

function reverse() {
  return processProperties({
    prop: 'reverse',
    modules: 'Ti.UI.ImageView'
  }, {
    default: '{ reverse: {value} }'
  }, {
    default: {
      reverse: true,
      'no-reverse': false
    }
  })
}
exports.reverse = reverse

function rightButtonMode() {
  return processProperties({
    prop: 'rightButtonMode - iOS Only',
    modules: 'Ti.UI.TextField'
  }, {
    'right-button-mode': '{ rightButtonMode: {value} }'
  }, {
    ios: {
      always: 'Ti.UI.INPUT_BUTTONMODE_ALWAYS',
      never: 'Ti.UI.INPUT_BUTTONMODE_NEVER',
      'on-blur': 'Ti.UI.INPUT_BUTTONMODE_ONBLUR',
      'on-focus': 'Ti.UI.INPUT_BUTTONMODE_ONFOCUS'
    }
  })
}
exports.rightButtonMode = rightButtonMode

function rightDrawerLockMode() {
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
exports.rightDrawerLockMode = rightDrawerLockMode

function scalesPageToFit() {
  return processProperties({
    prop: 'scalesPageToFit',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ scalesPageToFit: {value} }'
  }, {
    default: {
      'scales-page-to-fit': true,
      'dont-scale-page-to-fit': false
    }
  })
}
exports.scalesPageToFit = scalesPageToFit

function scrollable() {
  return processProperties({
    prop: 'scrollable',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ scrollable: {value} }'
  }, {
    default: {
      scrollable: true,
      unscrollable: false
    }
  })
}
exports.scrollable = scrollable

function scrollIndicators() {
  let convertedStyles = processComments({
    prop: 'showHorizontalScrollIndicator, showVerticalScrollIndicator',
    modules: 'Ti.UI.ScrollView'
  })

  convertedStyles += '\'.overflow-x-scroll\': { showHorizontalScrollIndicator: true }\n'
  convertedStyles += '\'.overflow-y-scroll\': { showVerticalScrollIndicator: true }\n'
  convertedStyles += '\'.overflow-x-hidden\': { showHorizontalScrollIndicator: false }\n'
  convertedStyles += '\'.overflow-y-hidden\': { showVerticalScrollIndicator: false }\n'
  convertedStyles += '\'.overflow-scroll\': { showHorizontalScrollIndicator: true, showVerticalScrollIndicator: true }\n'
  convertedStyles += '\'.overflow-hidden\': { showHorizontalScrollIndicator: false, showVerticalScrollIndicator: false }\n'

  return convertedStyles
}
exports.scrollIndicators = scrollIndicators

function scrollIndicatorStyle() {
  return processProperties({
    prop: 'scrollIndicatorStyle - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.ScrollView, Ti.UI.TableView'
  }, {
    'scrolling-indicator-style': '{ scrollIndicatorStyle: {value} }'
  }, {
    ios: {
      black: 'Ti.UI.iOS.ScrollIndicatorStyle.BLACK',
      default: 'Ti.UI.iOS.ScrollIndicatorStyle.DEFAULT',
      white: 'Ti.UI.iOS.ScrollIndicatorStyle.WHITE'
    }
  })
}
exports.scrollIndicatorStyle = scrollIndicatorStyle

function scrollingEnabled() {
  return processProperties({
    prop: 'scrollingEnabled',
    modules: 'Ti.UI.ScrollableView, Ti.UI.ScrollView'
  }, {
    scrolling: '{ scrollingEnabled: {value} }'
  }, {
    default: {
      enabled: true,
      disabled: false
    }
  })
}
exports.scrollingEnabled = scrollingEnabled

function scrollsToTop() {
  return processProperties({
    prop: 'scrollsToTop - iOS Only',
    modules: 'Ti.UI.ScrollView, Ti.UI.TableView, Ti.UI.TextArea, Ti.UI.WebView'
  }, {
    default: '{ scrollsToTop: {value} }'
  }, {
    [(globalOptions.legacy) ? 'ios' : 'default']: {
      'scrolls-to-top': true,
      [(globalOptions.legacy) ? 'dont-scrolls-to-top' : 'scrolls-to-top-false']: false
    }
  })
}
exports.scrollsToTop = scrollsToTop

function scrollType() {
  return processProperties({
    prop: 'scrollType - Android Only',
    modules: 'Ti.UI.ScrollView'
  }, {
    'scroll-type': '{ scrollType: {value} }'
  }, {
    [(globalOptions.legacy) ? 'android' : 'default']: {
      horizontal: 'horizontal',
      vertical: 'vertical'
    }
  })
}
exports.scrollType = scrollType

function searchAsChild() {
  return processProperties({
    prop: 'searchAsChild - Android Only',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ searchAsChild: {value} }'
  }, {
    android: {
      'search-as-child': true,
      'dont-search-as-child': false
    }
  })
}
exports.searchAsChild = searchAsChild

function searchBarStyle() {
  return processProperties({
    prop: 'style - iOS Only',
    modules: 'Ti.UI.SearchBar'
  }, {
    'search-bar-style': '{ style: {value} }'
  }, {
    ios: {
      minimal: 'Ti.UI.iOS.SEARCH_BAR_STYLE_MINIMAL',
      prominent: 'Ti.UI.iOS.SEARCH_BAR_STYLE_PROMINENT'
    }
  })
}
exports.searchBarStyle = searchBarStyle

function searchHidden() {
  return processProperties({
    prop: 'searchHidden - iOS Only',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ searchHidden: {value} }'
  }, {
    ios: {
      'search-hidden': true,
      'search-visible': false
    }
  })
}
exports.searchHidden = searchHidden

function selectionGranularity() {
  return processProperties({
    prop: 'selectionGranularity - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    'selection-granularity': '{ selectionGranularity: {value} }'
  }, {
    ios: {
      dynamic: 'Ti.UI.iOS.SELECTION_GRANULARITY_DYNAMIC',
      character: 'Ti.UI.iOS.SELECTION_GRANULARITY_CHARACTER'
    }
  })
}
exports.selectionGranularity = selectionGranularity

function selectionOpens() {
  return processProperties({
    prop: 'selectionOpens - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    selection: '{ selectionOpens: {value} }'
  }, {
    android: {
      opens: true,
      'dont-open': false
    }
  })
}
exports.selectionOpens = selectionOpens

function selectionStyle() {
  return processProperties({
    prop: 'selectionStyle',
    modules: 'Ti.UI.ListItem, Ti.UI.TableViewRow'
  }, {
    'selection-style': '{ selectionStyle: {value} }'
  }, {
    default: {
      default: 'Ti.UI.SELECTION_STYLE_DEFAULT',
      none: 'Ti.UI.SELECTION_STYLE_NONE'
    }
  })
}
exports.selectionStyle = selectionStyle

function separatorStyle() {
  return processProperties({
    prop: 'separatorStyle',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    'separator-style': '{ separatorStyle: {value} }'
  }, {
    default: {
      none: 'Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE',
      'single-line': 'Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_SINGLE_LINE'
    }
  })
}
exports.separatorStyle = separatorStyle

function shiftMode() {
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
exports.shiftMode = shiftMode

function showAsAction() {
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
exports.showAsAction = showAsAction

function showBookmark() {
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
exports.showBookmark = showBookmark

function showCancel() {
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
exports.showCancel = showCancel

function showHorizontalScrollIndicator() {
  return processProperties({
    prop: 'showHorizontalScrollIndicator',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ showHorizontalScrollIndicator: {value} }'
  }, {
    default: {
      'show-horizontal-scrolling-indicator': true,
      'hide-horizontal-scrolling-indicator': false
    }
  })
}
exports.showHorizontalScrollIndicator = showHorizontalScrollIndicator

function showSearchBarInNavBar() {
  return processProperties({
    prop: 'showSearchBarInNavBar - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ showSearchBarInNavBar: {value} }'
  }, {
    ios: {
      show: {
        'search-in-nav': true,
        'search-bar-in-nav-bar': true
      },
      hide: {
        'search-in-nav': false,
        'search-bar-in-nav-bar': false
      }
    }
  })
}
exports.showSearchBarInNavBar = showSearchBarInNavBar

function showSelectionCheck() {
  return processProperties({
    prop: 'showSelectionCheck - Android Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ showSelectionCheck: {value} }'
  }, {
    android: {
      'show-selection-check': true,
      'hide-selection-check': false
    }
  })
}
exports.showSelectionCheck = showSelectionCheck

function showUndoRedoActions() {
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
exports.showUndoRedoActions = showUndoRedoActions

function showVerticalScrollIndicator() {
  return processProperties({
    prop: 'showVerticalScrollIndicator',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ showVerticalScrollIndicator: {value} }'
  }, {
    default: {
      'show-vertical-scrolling-indicator': true,
      'hide-vertical-scrolling-indicator': false
    }
  })
}
exports.showVerticalScrollIndicator = showVerticalScrollIndicator

function smoothScrollOnTabClick() {
  return processProperties({
    prop: 'smoothScrollOnTabClick - Android Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    'smooth-scroll': '{ smoothScrollOnTabClick: {value} }'
  }, {
    android: {
      default: true,
      disabled: false
    }
  })
}
exports.smoothScrollOnTabClick = smoothScrollOnTabClick

function statusBarStyle() {
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
exports.statusBarStyle = statusBarStyle

function submitEnabled() {
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
exports.submitEnabled = submitEnabled

function suppressReturn() {
  return processProperties({
    prop: 'suppressReturn - iOS Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ suppressReturn: {value} }'
  }, {
    ios: {
      'suppress-return': true,
      'dont-suppress-return': false
    }
  })
}
exports.suppressReturn = suppressReturn

function sustainedPerformanceMode() {
  return processProperties({
    prop: 'sustainedPerformanceMode - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    'sustained-performance-mode': '{ sustainedPerformanceMode: {value} }'
  }, {
    android: {
      default: true
    }
  })
}
exports.sustainedPerformanceMode = sustainedPerformanceMode

function swipeToClose() {
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
exports.swipeToClose = swipeToClose

function toggle() {
  let convertedStyles = processComments({
    prop: 'toggle - For the Animation module',
    modules: 'Animation'
  })

  convertedStyles += '\'.opacity-to-0\': { opacity: 1, animationProperties: { open: { opacity: 0 }, close: { opacity: 1 } } }\n'
  convertedStyles += '\'.opacity-to-100\': { opacity: 0, animationProperties: { open: { opacity: 1 }, close: { opacity: 0 } } }\n'
  convertedStyles += '\'.toggle-visible\': { animationProperties: { open: { visible: true }, close: { visible: false } } }\n'

  return convertedStyles
}
exports.toggle = toggle

function zoomIn(modifiersAndValues) {
  return processProperties({
    prop: 'animationProperties - scales the view (in or out) and resets it to 100% when the animation completes',
    modules: 'Animation'
  }, {
    'zoom-in': '{ animationProperties: { open: { scale: {value} }, complete: { scale: 1 } } }',
    'zoom-out': '{ animationProperties: { close: { scale: {value} }, complete: { scale: 1 } } }'
  }, {
    default: modifiersAndValues
  })
}
exports.zoomIn = zoomIn

function switchStyle() {
  return processProperties({
    prop: 'style',
    modules: 'Ti.UI.Switch'
  }, {
    'search-bar-style': '{ style: {value} }'
  }, {
    default: {
      checkox: 'Ti.UI.SWITCH_STYLE_CHECKBOX',
      chip: 'Ti.UI.SWITCH_STYLE_CHIP',
      slider: 'Ti.UI.SWITCH_STYLE_SLIDER',
      'toggle-button': 'Ti.UI.SWITCH_STYLE_TOGGLE_BUTTON'
    }
  })
}
exports.switchStyle = switchStyle

function systemButton() {
  return processProperties({
    prop: 'systemButton - iOS Only',
    modules: 'Ti.UI.ImageView. Ti.UI.WebView'
  }, {
    'system-button': '{ systemButton: {value} }'
  }, {
    ios: {
      action: 'Ti.UI.iOS.SystemButton.ACTION',
      activity: 'Ti.UI.iOS.SystemButton.ACTIVITY',
      add: 'Ti.UI.iOS.SystemButton.ADD',
      bookmarks: 'Ti.UI.iOS.SystemButton.BOOKMARKS',
      camera: 'Ti.UI.iOS.SystemButton.CAMERA',
      cancel: 'Ti.UI.iOS.SystemButton.CANCEL',
      compose: 'Ti.UI.iOS.SystemButton.COMPOSE',
      contact_add: 'Ti.UI.iOS.SystemButton.CONTACT_ADD',
      disclosure: 'Ti.UI.iOS.SystemButton.DISCLOSURE',
      done: 'Ti.UI.iOS.SystemButton.DONE',
      edit: 'Ti.UI.iOS.SystemButton.EDIT',
      'fast-forward': 'Ti.UI.iOS.SystemButton.FAST_FORWARD',
      'fixed-space': 'Ti.UI.iOS.SystemButton.FIXED_SPACE',
      'flexible-space': 'Ti.UI.iOS.SystemButton.FLEXIBLE_SPACE',
      'info-dark': 'Ti.UI.iOS.SystemButton.INFO_DARK',
      'info-light': 'Ti.UI.iOS.SystemButton.INFO_LIGHT',
      organize: 'Ti.UI.iOS.SystemButton.ORGANIZE',
      pause: 'Ti.UI.iOS.SystemButton.PAUSE',
      play: 'Ti.UI.iOS.SystemButton.PLAY',
      refresh: 'Ti.UI.iOS.SystemButton.REFRESH',
      reply: 'Ti.UI.iOS.SystemButton.REPLY',
      rewind: 'Ti.UI.iOS.SystemButton.REWIND',
      save: 'Ti.UI.iOS.SystemButton.SAVE',
      spinner: 'Ti.UI.iOS.SystemButton.SPINNER',
      stop: 'Ti.UI.iOS.SystemButton.STOP',
      trash: 'Ti.UI.iOS.SystemButton.TRASH'
    }
  })
}
exports.systemButton = systemButton

function tabBarHidden() {
  return processProperties({
    prop: 'tabBarHidden - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    'tab-bar': '{ tabBarHidden: {value} }'
  }, {
    ios: {
      hidden: true,
      visible: false
    }
  })
}
exports.tabBarHidden = tabBarHidden

function tabbedBarStyle() {
  return processProperties({
    prop: 'style',
    modules: 'Ti.UI.TabbedBar'
  }, {
    'tabbed-bar-style': '{ style: {value} }'
  }, {
    default: {
      bar: 'Ti.UI.BUTTON_STYLE_FILLED',
      bordered: 'Ti.UI.BUTTON_STYLE_OPTION_NEGATIVE',
      done: 'Ti.UI.BUTTON_STYLE_OPTION_NEUTRAL',
      positive: 'Ti.UI.BUTTON_STYLE_OPTION_POSITIVE',
      outlined: 'Ti.UI.BUTTON_STYLE_OUTLINED',
      text: 'Ti.UI.BUTTON_STYLE_TEXT'
    },
    android: {
      default: 'Ti.UI.Android.TABS_STYLE_DEFAULT',
      'bottom-navigation': 'Ti.UI.Android.TABS_STYLE_BOTTOM_NAVIGATION'
    }
  })
}
exports.tabbedBarStyle = tabbedBarStyle

function tabGroupStyle() {
  return processProperties({
    prop: 'style - Android Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    'tabs-style': '{ style: {value} }'
  }, {
    android: {
      default: 'Ti.UI.Android.TABS_STYLE_DEFAULT',
      'bottom-navigation': 'Ti.UI.Android.TABS_STYLE_BOTTOM_NAVIGATION'
    }
  })
}
exports.tabGroupStyle = tabGroupStyle

function tableViewStyle() {
  return processProperties({
    prop: 'style - iOS Only',
    modules: 'Ti.UI.TableView'
  }, {
    'table-view-style': '{ style: {value} }'
  }, {
    ios: {
      grouped: 'Ti.UI.iOS.TableViewStyle.GROUPED',
      plain: 'Ti.UI.iOS.TableViewStyle.PLAIN',
      'inset-group': 'Ti.UI.iOS.TableViewStyle.INSET_GROUPED'
    }
  })
}
exports.tableViewStyle = tableViewStyle

function tabsTranslucent() {
  return processProperties({
    prop: 'tabsTranslucent - iOS Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    tabs: '{ tabsTranslucent: {value} }'
  }, {
    ios: {
      translucent: true,
      opaque: false
    }
  })
}
exports.tabsTranslucent = tabsTranslucent

function textAlign() {
  return processProperties({
    prop: 'textAlign',
    modules: 'Ti.UI.Button, Ti.UI.Label, Ti.UI.Switch, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    text: '{ textAlign: {value} }'
  }, {
    default: {
      left: 'Ti.UI.TEXT_ALIGNMENT_LEFT',
      right: 'Ti.UI.TEXT_ALIGNMENT_RIGHT',
      center: 'Ti.UI.TEXT_ALIGNMENT_CENTER',
      justify: 'Ti.UI.TEXT_ALIGNMENT_JUSTIFY'
    }
  })
}
exports.textAlign = textAlign

function theme() {
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
exports.theme = theme

function tiMedia(legacy = true) {
  let convertedStyles = '\n// Ti.Media'

  if (legacy) {
    convertedStyles += processProperties({
      prop: 'audioSessionCategory - iOS Only',
      modules: 'Ti.Media'
    }, {
      'audio-session-category': '{ audioSessionCategory: {value} }'
    }, {
      ios: {
        record: 'Ti.Media.AUDIO_SESSION_CATEGORY_RECORD',
        ambient: 'Ti.Media.AUDIO_SESSION_CATEGORY_AMBIENT',
        playback: 'Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK',
        'solo-ambient': 'Ti.Media.AUDIO_SESSION_CATEGORY_SOLO_AMBIENT',
        'play-record': 'Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD'
      }
    })

    convertedStyles += processProperties({
      prop: 'audioType - Android Only',
      modules: 'Ti.Media.AudioPlayer, Ti.Media.Sound'
    }, {
      'audio-type': '{ audioType: {value} }'
    }, {
      android: {
        ring: 'Ti.Media.Sound.AUDIO_TYPE_RING',
        alarm: 'Ti.Media.Sound.AUDIO_TYPE_ALARM',
        media: 'Ti.Media.Sound.AUDIO_TYPE_MEDIA',
        voice: 'Ti.Media.Sound.AUDIO_TYPE_VOICE',
        signalling: 'Ti.Media.Sound.AUDIO_TYPE_SIGNALLING',
        notification: 'Ti.Media.Sound.AUDIO_TYPE_NOTIFICATION'
      }
    })

    convertedStyles += processProperties({
      prop: 'repeatMode - iOS Only',
      modules: 'Ti.Media.MusicPlayer'
    }, {
      'music-repeat-mode': '{ repeatMode: {value} }'
    }, {
      ios: {
        all: 'Ti.Media.MUSIC_PLAYER_REPEAT_ALL',
        default: 'Ti.Media.MUSIC_PLAYER_REPEAT_DEFAULT',
        none: 'Ti.Media.MUSIC_PLAYER_REPEAT_NONE',
        one: 'Ti.Media.MUSIC_PLAYER_REPEAT_ONE'
      }
    })

    convertedStyles += processProperties({
      prop: 'shuffleMode - iOS Only',
      modules: 'Ti.Media.MusicPlayer'
    }, {
      'music-shuffle': '{ shuffleMode: {value} }'
    }, {
      ios: {
        albums: 'Ti.Media.MUSIC_PLAYER_SHUFFLE_ALBUMS',
        default: 'Ti.Media.MUSIC_PLAYER_SHUFFLE_DEFAULT',
        none: 'Ti.Media.MUSIC_PLAYER_SHUFFLE_NONE',
        songs: 'Ti.Media.MUSIC_PLAYER_SHUFFLE_SONGS'
      }
    })

    convertedStyles += processProperties({
      prop: 'scalingMode',
      modules: 'Ti.UI.ImageView',
      description: 'Image Scaling Mode'
    }, {
      'image-scaling': '{ scalingMode: {value} }'
    }, {
      default: {
        auto: 'Ti.Media.IMAGE_SCALING_AUTO',
        none: 'Ti.Media.IMAGE_SCALING_NONE',
        fill: 'Ti.Media.IMAGE_SCALING_FILL',
        cover: 'Ti.Media.IMAGE_SCALING_ASPECT_FILL',
        contain: 'Ti.Media.IMAGE_SCALING_ASPECT_FIT'
      }
    })

    // Video Scaling Mode
    convertedStyles += processProperties({
      prop: 'scalingMode',
      modules: 'Ti.Media.VideoPlayer',
      description: 'Video Scaling Mode'
    }, {
      'video-scaling': '{ scalingMode: {value} }'
    }, {
      default: {
        resize: 'Ti.Media.VIDEO_SCALING_RESIZE',
        contain: 'Ti.Media.VIDEO_SCALING_RESIZE_ASPECT',
        cover: 'Ti.Media.VIDEO_SCALING_RESIZE_ASPECT_FILL'
      }
    })

    convertedStyles += processProperties({
      prop: 'repeatMode',
      modules: 'Ti.Media.VideoPlayer',
      description: 'Determines how the movie player repeats when reaching the end of playback.'
    }, {
      'video-repeat-mode': '{ repeatMode: {value} }'
    }, {
      default: {
        one: 'Ti.Media.VIDEO_REPEAT_MODE_ONE',
        none: 'Ti.Media.VIDEO_REPEAT_MODE_NONE'
      }
    })
  }

  convertedStyles += processProperties({
    prop: 'scalingMode - ( Alternative )',
    modules: 'Ti.UI.ImageView',
    description: 'Background Size for compatibility with Tailwind classes'
  }, {
    bg: '{ scalingMode: {value} }'
  }, {
    default: {
      auto: 'Ti.Media.IMAGE_SCALING_NONE',
      cover: 'Ti.Media.IMAGE_SCALING_ASPECT_FILL',
      contain: 'Ti.Media.IMAGE_SCALING_ASPECT_FIT'
    }
  })

  convertedStyles += processProperties({
    prop: 'scalingMode - ( Alternative )',
    modules: 'Ti.UI.ImageView',
    description: 'Object Fit for compatibility with Tailwind classes'
  }, {
    object: '{ scalingMode: {value} }'
  }, {
    default: {
      auto: 'Ti.Media.IMAGE_SCALING_AUTO',
      fill: 'Ti.Media.IMAGE_SCALING_FILL',
      none: 'Ti.Media.IMAGE_SCALING_NONE',
      cover: 'Ti.Media.IMAGE_SCALING_ASPECT_FILL',
      contain: 'Ti.Media.IMAGE_SCALING_ASPECT_FIT'
    }
  })

  return convertedStyles
}
exports.tiMedia = tiMedia

function titleAttributesShadow() {
  const shadowValue = '#80000000'
  let convertedStyles = processComments({
    prop: 'titleAttributes: shadow, color, blurRadius, offset - iOS Only',
    modules: 'Ti.UI.TabGroup, Ti.UI.Window'
  })

  const legacy = (globalOptions.legacy) ? '[platform=ios]' : ''
  convertedStyles += `'.title-attributes-shadow-xs${legacy}': { titleAttributes: { shadow: { color: '${shadowValue}', blurRadius: 1, offset: { width: 0, height: 0 } } } }\n`
  convertedStyles += `'.title-attributes-shadow-sm${legacy}': { titleAttributes: { shadow: { color: '${shadowValue}', blurRadius: 2, offset: { width: 0, height: 1 } } } }\n`
  convertedStyles += `'.title-attributes-shadow${legacy}': { titleAttributes: { shadow: { color: '${shadowValue}', blurRadius: 4, offset: { width: 0, height: 2 } } } }\n`
  convertedStyles += `'.title-attributes-shadow-md${legacy}': { titleAttributes: { shadow: { color: '${shadowValue}', blurRadius: 6, offset: { width: 0, height: 3 } } } }\n`
  convertedStyles += `'.title-attributes-shadow-lg${legacy}': { titleAttributes: { shadow: { color: '${shadowValue}', blurRadius: 8, offset: { width: 0, height: 4 } } } }\n`
  convertedStyles += `'.title-attributes-shadow-xl${legacy}': { titleAttributes: { shadow: { color: '${shadowValue}', blurRadius: 12, offset: { width: 0, height: 6 } } } }\n`
  convertedStyles += `'.title-attributes-shadow-2xl${legacy}': { titleAttributes: { shadow: { color: '${shadowValue}', blurRadius: 14, offset: { width: 0, height: 8 } } } }\n`
  convertedStyles += `'.title-attributes-shadow-none${legacy}': { titleAttributes: { shadow: { color: null, blurRadius: null, offset: { width: 0, height: 0 } } } }\n`

  return convertedStyles
}
exports.titleAttributesShadow = titleAttributesShadow

function toolbarEnabled() {
  return processProperties({
    prop: 'toolbarEnabled - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    toolbar: '{ toolbarEnabled: {value} }'
  }, {
    android: {
      enabled: true,
      disabled: false
    }
  })
}
exports.toolbarEnabled = toolbarEnabled

function touchEnabled() {
  if (globalOptions.legacy) {
    return processProperties({
      prop: 'touchEnabled',
      modules: 'Ti.UI.View'
    }, {
      default: '{ touchEnabled: {value} }'
    }, {
      default: {
        'touch-enabled': true,
        'touch-disabled': false,
        'pointer-events-auto': true,
        'pointer-events-none': false
      }
    })
  } else {
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
}
exports.touchEnabled = touchEnabled

function touchFeedback() {
  return processProperties({
    prop: 'touchFeedback - Android Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView, Ti.UI.View'
  }, {
    default: '{ touchFeedback: {value} }'
  }, {
    android: {
      'touch-feedback': true,
      'dont-touch-feedback': false
    }
  })
}
exports.touchFeedback = touchFeedback

function curve() {
  let convertedStyles = processProperties({
    prop: 'curve',
    modules: 'Ti.UI.Animation'
  }, {
    ease: '{ curve: {value} }'
  }, {
    default: {
      in: 'Ti.UI.ANIMATION_CURVE_EASE_IN',
      out: 'Ti.UI.ANIMATION_CURVE_EASE_OUT',
      linear: 'Ti.UI.ANIMATION_CURVE_LINEAR',
      'in-out': 'Ti.UI.ANIMATION_CURVE_EASE_IN_OUT'
    }
  })

  convertedStyles += processProperties('debug', {
    debug: '{ debug: {value} }'
  }, {
    default: {
      default: true
    }
  })

  return convertedStyles
}
exports.curve = curve

function debugMode() {
  return processProperties('debug', {
    debug: '{ debug: {value} }'
  }, {
    default: {
      default: true
    }
  })
}
exports.debugMode = debugMode

function translucent() {
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
exports.translucent = translucent

function useCompatPadding() {
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
exports.useCompatPadding = useCompatPadding

function useSpinner() {
  return processProperties({
    prop: 'useSpinner',
    modules: 'Ti.UI.Picker'
  }, {
    default: '{ useSpinner: {value} }'
  }, {
    default: {
      'use-spinner': true,
      'dont-use-spinner': false
    }
  })
}
exports.useSpinner = useSpinner

function verticalAlign() {
  return processProperties({
    prop: 'verticalAlign',
    modules: 'Ti.UI.Button, Ti.UI.Label, Ti.UI.Switch, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    align: '{ verticalAlign: {value} }'
  }, {
    default: {
      top: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP',
      middle: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER',
      bottom: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM'
    }
  })
}
exports.verticalAlign = verticalAlign

function verticalBounce() {
  return processProperties({
    prop: 'verticalBounce - iOS Only',
    modules: 'Ti.UI.ScrollView'
  }, {
    default: '{ verticalBounce: {value} }'
  }, {
    ios: {
      'vertical-bounce': true,
      'no-vertical-bounce': false
    }
  })
}
exports.verticalBounce = verticalBounce

function viewShadow() {
  let convertedStyles = viewShadowAndroid()

  convertedStyles += viewShadowIos()

  return convertedStyles
}
exports.viewShadow = viewShadow

function viewShadowAndroid() {
  let convertedStyles = processComments({
    prop: 'elevation - Box Shadow Effect in Tailwind - Android Only',
    modules: 'Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.View'
  })

  convertedStyles += '\'.shadow-xs[platform=android]\': { elevation: 4 }\n'
  convertedStyles += '\'.shadow-sm[platform=android]\': { elevation: 8 }\n'
  convertedStyles += '\'.shadow[platform=android]\': { elevation: 16 }\n'
  convertedStyles += '\'.shadow-md[platform=android]\': { elevation: 24 }\n'
  convertedStyles += '\'.shadow-lg[platform=android]\': { elevation: 26 }\n'
  convertedStyles += '\'.shadow-xl[platform=android]\': { elevation: 34 }\n'
  convertedStyles += '\'.shadow-2xl[platform=android]\': { elevation: 38 }\n'

  convertedStyles += '\'.shadow-inner[platform=android]\': { elevation: 0 }\n'
  convertedStyles += '\'.shadow-outline[platform=android]\': { elevation: 16 }\n'
  convertedStyles += '\'.shadow-none[platform=android]\': { elevation: 0 }\n'

  return convertedStyles
}

function viewShadowIos(shadowValue = '#80000000') {
  let convertedStyles = processComments({
    prop: 'viewShadowOffset, viewShadowRadius, viewShadowColor - Box Shadow Effect in Tailwind - iOS Only',
    modules: 'Ti.UI.View'
  })

  convertedStyles += `'.shadow-xs[platform=ios]': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-sm[platform=ios]': { viewShadowOffset: { x: 0, y: 1 }, viewShadowRadius: 2, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow[platform=ios]': { viewShadowOffset: { x: 0, y: 2 }, viewShadowRadius: 4, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-md[platform=ios]': { viewShadowOffset: { x: 0, y: 3 }, viewShadowRadius: 6, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-lg[platform=ios]': { viewShadowOffset: { x: 0, y: 4 }, viewShadowRadius: 8, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-xl[platform=ios]': { viewShadowOffset: { x: 0, y: 6 }, viewShadowRadius: 12, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-2xl[platform=ios]': { viewShadowOffset: { x: 0, y: 8 }, viewShadowRadius: 14, viewShadowColor: '${shadowValue}' }\n`

  convertedStyles += '\'.shadow-inner[platform=ios]\': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n'
  convertedStyles += `'.shadow-outline[platform=ios]': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 4, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += '\'.shadow-none[platform=ios]\': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n'

  return convertedStyles
}

function viewShadowV6(shadowValue = '#80000000') {
  let convertedStyles = processComments({
    prop: 'iOS: viewShadowOffset, viewShadowRadius, viewShadowColor, Android: elevation - Box Shadow Effect in Tailwind',
    modules: 'iOS: Ti.UI.View, Android: Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.View'
  })

  convertedStyles += `'.shadow-xs': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: '${shadowValue}', elevation: 4 }\n`
  convertedStyles += `'.shadow-sm': { viewShadowOffset: { x: 0, y: 1 }, viewShadowRadius: 2, viewShadowColor: '${shadowValue}', elevation: 8 }\n`
  convertedStyles += `'.shadow': { viewShadowOffset: { x: 0, y: 2 }, viewShadowRadius: 4, viewShadowColor: '${shadowValue}', elevation: 16 }\n`
  convertedStyles += `'.shadow-md': { viewShadowOffset: { x: 0, y: 3 }, viewShadowRadius: 6, viewShadowColor: '${shadowValue}', elevation: 24 }\n`
  convertedStyles += `'.shadow-lg': { viewShadowOffset: { x: 0, y: 4 }, viewShadowRadius: 8, viewShadowColor: '${shadowValue}', elevation: 26 }\n`
  convertedStyles += `'.shadow-xl': { viewShadowOffset: { x: 0, y: 6 }, viewShadowRadius: 12, viewShadowColor: '${shadowValue}', elevation: 34 }\n`
  convertedStyles += `'.shadow-2xl': { viewShadowOffset: { x: 0, y: 8 }, viewShadowRadius: 14, viewShadowColor: '${shadowValue}', elevation: 38 }\n`

  convertedStyles += '\'.shadow-inner\': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null, elevation: 0 }\n'
  convertedStyles += `'.shadow-outline': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 4, viewShadowColor: '${shadowValue}', elevation: 16 }\n`
  convertedStyles += '\'.shadow-none\': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null, elevation: 0 }\n'

  return convertedStyles
}
exports.viewShadowV6 = viewShadowV6

function willHandleTouches() {
  return processProperties({
    prop: 'willHandleTouches - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ willHandleTouches: {value} }'
  }, {
    ios: {
      'will-handle-touches': true,
      'will-not-handle-touches': false
    }
  })
}
exports.willHandleTouches = willHandleTouches

function willScrollOnStatusTap() {
  return processProperties({
    prop: 'willScrollOnStatusTap - iOS Only',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ willScrollOnStatusTap: {value} }'
  }, {
    ios: {
      'will-scroll-on-status-tap': true,
      'will-not-scroll-on-status-tap': false
    }
  })
}
exports.willScrollOnStatusTap = willScrollOnStatusTap

function windowPixelFormat() {
  return processProperties({
    prop: 'windowPixelFormat - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    'pixel-format': '{ windowPixelFormat: {value} }'
  }, {
    android: {
      'a-8': 'Ti.UI.Android.PIXEL_FORMAT_A_8',
      'la-88': 'Ti.UI.Android.PIXEL_FORMAT_LA_88',
      'l-8': 'Ti.UI.Android.PIXEL_FORMAT_L_8',
      opaque: 'Ti.UI.Android.PIXEL_FORMAT_OPAQUE',
      'rgba-4444': 'Ti.UI.Android.PIXEL_FORMAT_RGBA_4444',
      'rgba-5551': 'Ti.UI.Android.PIXEL_FORMAT_RGBA_5551',
      'rgba-8888': 'Ti.UI.Android.PIXEL_FORMAT_RGBA_8888',
      'rgbx-8888': 'Ti.UI.Android.PIXEL_FORMAT_RGBX_8888',
      'rgb-332': 'Ti.UI.Android.PIXEL_FORMAT_RGB_332',
      'rgb-565': 'Ti.UI.Android.PIXEL_FORMAT_RGB_565',
      'rgb-888': 'Ti.UI.Android.PIXEL_FORMAT_RGB_888',
      translucent: 'Ti.UI.Android.PIXEL_FORMAT_TRANSLUCENT',
      transparent: 'Ti.UI.Android.PIXEL_FORMAT_TRANSPARENT',
      unknown: 'Ti.UI.Android.PIXEL_FORMAT_UNKNOWN'
    }
  })
}
exports.windowPixelFormat = windowPixelFormat

function windowSoftInputMode() {
  return processProperties({
    prop: 'windowSoftInputMode - Android Only',
    modules: 'Ti.UI.TabGroup, Ti.UI.Window'
  }, {
    'window-soft-input': '{ windowSoftInputMode: {value} }'
  }, {
    android: {
      'adjust-pan': 'Ti.UI.Android.SOFT_INPUT_ADJUST_PAN',
      'adjust-resize': 'Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE',
      'adjust-unspecified': 'Ti.UI.Android.SOFT_INPUT_ADJUST_UNSPECIFIED',
      'always-hidden': 'Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN',
      'always-visible': 'Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_VISIBLE',
      'state-hidden': 'Ti.UI.Android.SOFT_INPUT_STATE_HIDDEN',
      'state-unspecified': 'Ti.UI.Android.SOFT_INPUT_STATE_UNSPECIFIED',
      'state-visible': 'Ti.UI.Android.SOFT_INPUT_STATE_VISIBLE'
    }
  })
}
exports.windowSoftInputMode = windowSoftInputMode

function wobble() {
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
exports.wobble = wobble

// ! Configurable properties
function activeTab(modifiersAndValues) {
  return processProperties({
    prop: 'activeTab',
    modules: 'Ti.UI.TabGroup'
  }, {
    'active-tab': '{ activeTab: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.activeTab = activeTab

function backgroundLeftCap(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'backgroundLeftCap - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'bg-l-cap': '{ backgroundLeftCap: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.backgroundLeftCap = backgroundLeftCap

function backgroundPaddingBottom(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'backgroundPaddingBottom - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'bg-padding-b': '{ backgroundPaddingBottom: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.backgroundPaddingBottom = backgroundPaddingBottom

function backgroundPaddingLeft(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'backgroundPaddingLeft - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'bg-padding-l': '{ backgroundPaddingLeft: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.backgroundPaddingLeft = backgroundPaddingLeft

function backgroundPaddingRight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'backgroundPaddingRight - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'bg-padding-r': '{ backgroundPaddingRight: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.backgroundPaddingRight = backgroundPaddingRight

function backgroundPaddingTop(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'backgroundPaddingTop - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'bg-padding-t': '{ backgroundPaddingTop: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.backgroundPaddingTop = backgroundPaddingTop

function backgroundTopCap(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'backgroundTopCap - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'bg-t-cap': '{ backgroundTopCap: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.backgroundTopCap = backgroundTopCap

function borderRadiusFull({ ...modifiersAndValues }) {
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
exports.borderRadiusFull = borderRadiusFull

function borderRadius({ ...modifiersAndValues }) {
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
exports.borderRadius = borderRadius

function processBorderRadius(modifiersAndValues) {
  _.each(modifiersAndValues, (value, key) => {
    if (key.includes('/')) {
      delete modifiersAndValues[key]
    } else if (['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'px', 'DEFAULT'].includes(key)) {
      modifiersAndValues[key] = value
      // check if value is an integer
    } else if (value % 1 === 0) {
      modifiersAndValues[key] = value
    } else {
      modifiersAndValues[key] = 8 * parseFloat(value)
    }
  })

  return modifiersAndValues
}
exports.processBorderRadius = processBorderRadius

function borderWidth(modifiersAndValues) {
  modifiersAndValues[1] = '1px'
  modifiersAndValues[10] = '10px'
  _.each(modifiersAndValues, (value, key) => {
    modifiersAndValues[key] = parseInt(value)
  })

  return processProperties({
    prop: 'borderWidth',
    modules: 'Ti.UI.View'
  }, {
    border: '{ borderWidth: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.borderWidth = borderWidth

function bottomNavigation(modifiersAndValues) {
  const objectPosition = {
    padding: '{ padding: {value} }',
    'padding-x': '{ paddingLeft: {value}, paddingRight: {value} }',
    'padding-y': '{ paddingTop: {value}, paddingBottom: {value} }',
    'padding-t': '{ paddingTop: {value} }',
    'padding-l': '{ paddingLeft: {value} }',
    'padding-r': '{ paddingRight: {value} }',
    'padding-b': '{ paddingBottom: {value} }'
  }

  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'padding, paddingTop, paddingLeft, paddingRight, paddingBottom - Android Only',
    modules: 'Ti.UI.Android.CardView, Ti.UI.TabGroup, Ti.UI.ScrollableView'
  },
  objectPosition,
  {
    android: modifiersAndValues
  }
  )
}
exports.bottomNavigation = bottomNavigation

function cacheSize(modifiersAndValues) {
  return processProperties({
    prop: 'cacheSize',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'cache-size': '{ cacheSize: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.cacheSize = cacheSize

function columnCount(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0'])

  const convertedStyles = processProperties({
    prop: 'columnCount - iOS Only',
    modules: 'Ti.UI.DashboardView'
  }, {
    'col-count': '{ columnCount: {value} }'
  }, {
    ios: modifiersAndValues
  })

  return convertedStyles
}
exports.columnCount = columnCount

function contentHeight(modifiersAndValues) {
  return processProperties({
    prop: 'contentHeight',
    modules: 'Ti.UI.ScrollView'
  }, {
    'content-h': '{ contentHeight: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.contentHeight = contentHeight

function contentWidth(modifiersAndValues) {
  return processProperties({
    prop: 'contentWidth',
    modules: 'Ti.UI.ScrollView'
  }, {
    'content-w': '{ contentWidth: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.contentWidth = contentWidth

function countDownDuration(modifiersAndValues) {
  return processProperties({
    prop: 'countDownDuration - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    default: '{ countDownDuration: {value} }'
  }, {
    android: {
      'count-down-duration': modifiersAndValues
    }
  })
}
exports.countDownDuration = countDownDuration

function elevation(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0', 'full', 'auto', 'screen'])

  _.each(modifiersAndValues, (value, key) => {
    if (key.includes('/')) {
      delete modifiersAndValues[key]
    } else if (['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'px', 'DEFAULT'].includes(key)) {
    } else {
      modifiersAndValues[key] = parseValue(value)
    }
  })

  return processProperties({
    prop: 'elevation - Android Only',
    modules: 'Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.View'
  }, {
    elevation: '{ elevation: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.elevation = elevation

function fontFamily(modifiersAndValues) {
  return processProperties({
    prop: 'fontFamily',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Button, Ti.UI.Label, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.PickerColumn, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    font: '{ font: { fontFamily: {value} } }'
  }, {
    default: modifiersAndValues
  })
}
exports.fontFamily = fontFamily

function fontSize(modifiersAndValues) {
  const cleanValues = {}

  _.each(modifiersAndValues, (value, key) => {
    cleanValues[key] = Array.isArray(value) ? value[0] : value
  })

  return processProperties({
    prop: 'fontSize',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Button, Ti.UI.Label, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.PickerColumn, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    text: '{ font: { fontSize: {value} } }'
  }, {
    default: cleanValues
  })
}
exports.fontSize = fontSize

function fontWeight(modifiersAndValues) {
  const invalidValues = {
    black: 'bold',
    medium: 'normal',
    extrabold: 'bold',
    hairline: 'ultralight'
  }

  _.each(modifiersAndValues, (value, key) => {
    modifiersAndValues[key] = fixInvalidValues(invalidValues, key)
  })

  return processProperties({
    prop: 'fontWeight',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Button, Ti.UI.Label, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.PickerColumn, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    font: '{ font: { fontWeight: {value} } }'
  }, {
    default: modifiersAndValues
  })
}
exports.fontWeight = fontWeight

function gap(modifiersAndValues) {
  // SOME CLEANUP... VALUES NOT NEEDED HERE!.
  modifiersAndValues = removeFractions(modifiersAndValues, ['screen'])
  modifiersAndValues.auto = 'auto'

  return processProperties({
    prop: 'top, right, bottom, left - Gap for Grid System',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window'
  }, {
    gap: '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
    'gap-b': '{ bottom: {value} }',
    'gap-l': '{ left: {value} }',
    'gap-r': '{ right: {value} }',
    'gap-t': '{ top: {value} }',
    'gap-x': '{ right: {value}, left: {value} }',
    'gap-y': '{ top: {value}, bottom: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.gap = gap

function indentionLevel(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'indentionLevel - Android Only',
    modules: 'Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.View'
  }, {
    'indentation-level': '{ indentionLevel: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.indentionLevel = indentionLevel

function keyboardToolbarHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'keyboardToolbarHeight - iOS Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'keyboard-toolbar-h': '{ keyboardToolbarHeight: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.keyboardToolbarHeight = keyboardToolbarHeight

function leftButtonPadding(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'leftButtonPadding - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'left-button-padding': '{ leftButtonPadding: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.leftButtonPadding = leftButtonPadding

function leftWidth(modifiersAndValues) {
  return processProperties({
    prop: 'leftWidth - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    'left-w': '{ leftWidth: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.leftWidth = leftWidth

function lines(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0'])

  return processProperties({
    prop: 'lines - Android Only',
    modules: 'Ti.UI.Label, Ti.UI.TextArea'
  }, {
    lines: '{ lines: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.lines = lines

function maxElevation(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0', 'auto', 'full', 'screen'])

  _.each(modifiersAndValues, (value, key) => {
    if (key.includes('/')) {
      delete modifiersAndValues[key]
    } else if (['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'px', 'DEFAULT'].includes(key)) {
    } else {
      modifiersAndValues[key] = parseValue(value)
    }
  })

  return processProperties({
    prop: 'maxElevation - Android Only',
    modules: 'Ti.UI.Android.CardView'
  }, {
    'max-elevation': '{ maxElevation: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.maxElevation = maxElevation

function maxLines(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0'])
  return processProperties({
    prop: 'maxLines - Android Only',
    modules: 'Ti.UI.Label, Ti.UI.TextArea'
  }, {
    'max-lines': '{ maxLines: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.maxLines = maxLines

function maxRowHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'maxRowHeight - iOS Only',
    modules: 'Ti.UI.TableView'
  }, {
    'max-row-h': '{ maxRowHeight: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.maxRowHeight = maxRowHeight

function maxZoomScale(modifiersAndValues) {
  if (modifiersAndValues) {
    modifiersAndValues[1] = '.01'
  }

  return processProperties({
    prop: 'maxZoomScale',
    modules: 'Ti.UI.ScrollView'
  }, {
    'max-zoom-scale': '{ maxZoomScale: \'{value}\' }'
  }, { ios: modifiersAndValues })
}
exports.maxZoomScale = maxZoomScale

function minimumFontSize(modifiersAndValues) {
  const cleanValues = {}

  _.each(modifiersAndValues, (value, key) => {
    cleanValues[key] = Array.isArray(value) ? value[0] : value
  })

  return processProperties({
    prop: 'minimumFontSize',
    modules: 'Ti.UI.label, Ti.UI.TextField'
  }, {
    'minimum-text': '{ minimumFontSize: {value} }'
  }, {
    default: cleanValues
  })
}
exports.minimumFontSize = minimumFontSize

function minRowHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'minRowHeight - iOS Only',
    modules: 'Ti.UI.TableView'
  }, {
    'min-row-h': '{ minRowHeight: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.minRowHeight = minRowHeight

function minZoomScale(modifiersAndValues) {
  if (modifiersAndValues) {
    modifiersAndValues[1] = '.01'
  }

  return processProperties({
    prop: 'minZoomScale',
    modules: 'Ti.UI.ScrollView'
  }, {
    'min-zoom-scale': '{ minZoomScale: \'{value}\' }'
  }, { ios: modifiersAndValues })
}
exports.minZoomScale = minZoomScale

function offsets(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  let convertedStyles = processProperties({
    prop: 'xOffset - Android Only',
    modules: 'Ti.UI.Notification'
  }, {
    'x-offset': '{ xOffset: {value} }'
  }, {
    android: modifiersAndValues
  })

  convertedStyles += processProperties({
    prop: 'yOffset - Android Only',
    modules: 'Ti.UI.Notification'
  }, {
    'y-offset': '{ yOffset: {value} }'
  }, {
    android: modifiersAndValues
  })

  return convertedStyles
}
exports.offsets = offsets

function opacity(modifiersAndValues) {
  return processProperties({
    prop: 'opacity',
    modules: 'Ti.UI.Animation, Ti.UI.TableViewRow, Ti.UI.View, Ti.UI.Window'
  }, {
    opacity: '{ opacity: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.opacity = opacity

function padding(modifiersAndValues) {
  const objectPosition = {
    p: '{ padding: { top: {value}, right: {value}, bottom: {value}, left: {value} } }',
    py: '{ padding: { top: {value}, bottom: {value} } }',
    px: '{ padding: { right: {value}, left: {value} } }',
    pt: '{ padding: { top: {value} } }',
    pr: '{ padding: { right: {value} } }',
    pb: '{ padding: { bottom: {value} } }',
    pl: '{ padding: { left: {value} } }'
  }

  // modifiersAndValues['0'] = 0;
  delete modifiersAndValues.fit
  delete modifiersAndValues.min
  delete modifiersAndValues.max
  delete modifiersAndValues.auto
  delete modifiersAndValues.screen
  delete modifiersAndValues['min-content']
  delete modifiersAndValues['max-content']

  return processProperties({
    prop: 'padding - Android Only',
    modules: 'Ti.UI.Android.CardView, Ti.UI.TextArea, Ti.UI.TextField'
  }, objectPosition, {
    default: modifiersAndValues
  })
}
exports.padding = padding

function pagingControlAlpha(modifiersAndValues) {
  return processProperties({
    prop: 'pagingControlAlpha - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control-alpha': '{ pagingControlAlpha: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.pagingControlAlpha = pagingControlAlpha

function pagingControlHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'pagingControlHeight - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control-h': '{ pagingControlHeight: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.pagingControlHeight = pagingControlHeight

function pagingControlTimeout(modifiersAndValues) {
  return processProperties({
    prop: 'pagingControlTimeout - Android Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control-timeout': '{ pagingControlTimeout: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.pagingControlTimeout = pagingControlTimeout

function repeat(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0'])

  return processProperties({
    prop: 'repeat',
    modules: 'Ti.UI.Animation'
  }, {
    repeat: '{ repeat: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.repeat = repeat

function repeatCount(modifiersAndValues) {
  return processProperties({
    prop: 'repeatCount',
    modules: 'Ti.UI.ImageView'
  }, {
    'repeat-count': '{ repeatCount: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.repeatCount = repeatCount

function rightButtonPadding(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'rightButtonPadding - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'right-button-padding': '{ rightButtonPadding: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.rightButtonPadding = rightButtonPadding

function rightWidth(modifiersAndValues) {
  return processProperties({
    prop: 'rightWidth - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    'right-w': '{ rightWidth: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.rightWidth = rightWidth

function rotate(modifiersAndValues) {
  let classes = processProperties({
    prop: 'rotate',
    modules: 'For the Animation Component'
  }, {
    rotate: '{ rotate: {value} }'
  }, {
    default: modifiersAndValues
  })

  modifiersAndValues = addNegativeValues(modifiersAndValues)

  classes += processProperties({
    prop: 'rotate ( Negative values )',
    modules: 'For the Animation Component'
  }, {
    '-rotate': '{ rotate: {value} }'
  }, {
    default: modifiersAndValues
  })

  return classes
}
exports.rotate = rotate

function negativeRotate(modifiersAndValues) {
  modifiersAndValues = addNegativeValues(modifiersAndValues)
  return processProperties({
    prop: 'rotate ( Negative values )',
    modules: 'For the Animation Component'
  }, {
    '-rotate': '{ rotate: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.negativeRotate = negativeRotate

function addNegativeValues(modifiersAndValues) {
  _.each(modifiersAndValues, (value, key) => {
    modifiersAndValues[key] = '-' + value
  })

  return modifiersAndValues
}

function rowCount(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0'])

  const convertedStyles = processProperties({
    prop: 'rowCount - iOS Only',
    modules: 'Ti.UI.DashboardView'
  }, {
    'row-count': '{ rowCount: {value} }'
  }, {
    ios: modifiersAndValues
  })

  return convertedStyles
}
exports.rowCount = rowCount

function rowHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'rowHeight',
    modules: 'Ti.UI.TableView'
  }, {
    'row-h': '{ rowHeight: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.rowHeight = rowHeight

function scale(modifiersAndValues) {
  if (modifiersAndValues) {
    modifiersAndValues[1] = '.01'
  }

  return processProperties({
    prop: 'scale',
    modules: 'MatrixCreationDict'
  }, {
    scale: '{ scale: \'{value}\' }'
  }, { default: modifiersAndValues })
}
exports.scale = scale

function sectionHeaderTopPadding(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'sectionHeaderTopPadding - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    'section-header-top-padding': '{ sectionHeaderTopPadding: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.sectionHeaderTopPadding = sectionHeaderTopPadding

function separatorHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'separatorHeight - Android Only',
    modules: 'Ti.UI.ListView'
  }, {
    'separator-h': '{ separatorHeight: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.separatorHeight = separatorHeight

function shadowRadius(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0', 'auto', 'full', 'screen'])

  _.each(modifiersAndValues, (value, key) => {
    if (key.includes('/')) {
      delete modifiersAndValues[key]
    } else if (['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'px', 'DEFAULT'].includes(key)) {
      modifiersAndValues[key] = value
    } else {
      modifiersAndValues[key] = 8 * parseFloat(value)
    }
  })

  return processProperties({
    prop: 'shadowRadius ( with Extra Styles ) - Android Only',
    modules: 'Ti.UI.Button, Ti.UI.Label'
  }, {
    'shadow-radius': '{ shadowRadius: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.shadowRadius = shadowRadius

function timeout(modifiersAndValues) {
  return processProperties({
    prop: 'timeout - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    timeout: '{ timeout: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.timeout = timeout

function transitionDelay(modifiersAndValues) {
  return processProperties({
    prop: 'delay',
    modules: 'Ti.UI.Animation'
  }, {
    delay: '{ delay: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.transitionDelay = transitionDelay

function transitionDuration(modifiersAndValues) {
  return processProperties({
    prop: 'duration',
    modules: 'Ti.UI.Animation, Ti.UI.ImageView'
  }, {
    default: '{ duration: {value} }'
  }, {
    default: {
      duration: modifiersAndValues
    }
  })
}
exports.transitionDuration = transitionDuration

function zIndex(modifiersAndValues) {
  delete modifiersAndValues.auto

  return processProperties({
    prop: 'zIndex',
    modules: 'Ti.UI.Animation, Ti.UI.View'
  }, {
    z: '{ zIndex: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.zIndex = zIndex

function zoomScale(modifiersAndValues) {
  if (modifiersAndValues) {
    modifiersAndValues[1] = '.01'
  }

  return processProperties({
    prop: 'zoomScale',
    modules: 'Ti.UI.ScrollView'
  }, {
    'zoom-scale': '{ zoomScale: \'{value}\' }'
  }, { ios: modifiersAndValues })
}
exports.zoomScale = zoomScale

// ! Color related properties
function activeTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'activeTintColor',
    modules: 'Ti.UI.Tab, Ti.UI.TabGroup'
  }, {
    'active-tint': '{ activeTintColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.activeTintColor = activeTintColor

function activeTitleColor(modifiersAndValues) {
  return processProperties({
    prop: 'activeTitleColor',
    modules: 'Ti.UI.Tab, Ti.UI.TabGroup'
  }, {
    'active-title': '{ activeTitleColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.activeTitleColor = activeTitleColor

function backgroundColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundColor',
    modules: 'Ti.UI, Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.Tab, Ti.UI.TableView, Ti.UI.View, Ti.UI.Window'
  }, {
    bg: '{ backgroundColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.backgroundColor = backgroundColor

function backgroundDisabledColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundDisabledColor - Android Only',
    modules: 'Ti.UI.View'
  }, {
    'bg-disabled': '{ backgroundDisabledColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.backgroundDisabledColor = backgroundDisabledColor

function backgroundFocusedColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundFocusedColor - Android Only',
    modules: 'Ti.UI.Tab, Ti.UI.View'
  }, {
    'bg-focused': '{ backgroundFocusedColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.backgroundFocusedColor = backgroundFocusedColor

function backgroundGradient(modifiersAndValues) {
  let convertedStyles = processComments({
    prop: 'backgroundGradient: colors - From Color',
    modules: 'Ti.UI.ListItem, Ti.UI.View'
  })

  let objectPosition = { from: '{ backgroundGradient: { colors: [ {transparentValue}, {value} ] } }' }

  _.each(objectPosition, (properties, rule) => {
    _.each(modifiersAndValues, (value, modifier) => {
      if (typeof value === 'object') {
        _.each(value, (_value, _modifier) => {
          convertedStyles += `'.${removeLastDash(`${rule}-${setModifier2(modifier, rule)}${setModifier2(_modifier)}`)}': ` + _.replace(_.replace(properties, new RegExp('{transparentValue}', 'g'), `${addTransparencyToValue(parseValue(_value))}`), new RegExp('{value}', 'g'), parseValue(_value)) + '\n'
        })
      } else {
        convertedStyles += `'.${setModifier2(rule, modifier)}${setModifier2(modifier)}': ` + _.replace(_.replace(properties, new RegExp('{value}', 'g'), parseValue(value)), new RegExp('{transparentValue}', 'g'), `${addTransparencyToValue(parseValue(value))}`) + '\n'
      }
    })
  })

  convertedStyles += processComments({
    prop: 'backgroundGradient: colors - To Color',
    modules: 'Ti.UI.ListItem, Ti.UI.View'
  })

  objectPosition = { to: '{ backgroundGradient: { colors: [ {value} ] } }' }

  _.each(objectPosition, (properties, rule) => {
    _.each(modifiersAndValues, (value, modifier) => {
      if (typeof value === 'object') {
        _.each(value, (_value, _modifier) => {
          convertedStyles += `'.${removeLastDash(`${rule}-${setModifier2(modifier, rule)}${setModifier2(_modifier)}`)}': ` + _.replace(properties, new RegExp('{value}', 'g'), parseValue(_value)) + '\n'
        })
      } else {
        convertedStyles += `'.${setModifier2(rule, modifier)}${setModifier2(modifier)}': ` + _.replace(properties, new RegExp('{value}', 'g'), parseValue(value)) + '\n'
      }
    })
  })

  return convertedStyles
}
exports.backgroundGradient = backgroundGradient

function removeLastDash(str) {
  return str.replace(/-$/, '')
}

function backgroundSelectedColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundSelectedColor',
    modules: 'Ti.UI.Button, Ti.UI.ListItem, Ti.UI.TableViewRow, Ti.UI.View'
  }, {
    'bg-selected': '{ backgroundSelectedColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.backgroundSelectedColor = backgroundSelectedColor

function backgroundSelectedGradient(modifiersAndValues) {
  let convertedStyles = processComments({
    prop: 'backgroundSelectedGradient: colors - From Color - iOS Only',
    modules: 'Ti.UI.ListItem, Ti.UI.View'
  })

  let objectPosition = { 'bg-selected-from': '{ backgroundSelectedGradient: { colors: [ {transparentValue}, {value} ] } }' }

  _.each(objectPosition, (properties, rule) => {
    _.each(modifiersAndValues, (value, modifier) => {
      if (typeof value === 'object') {
        _.each(value, (_value, _modifier) => {
          convertedStyles += `'.${removeLastDash(`${rule}-${setModifier2(modifier, rule)}${setModifier2(_modifier)}`)}': ` + _.replace(_.replace(properties, new RegExp('{transparentValue}', 'g'), `${addTransparencyToValue(parseValue(_value))}`), new RegExp('{value}', 'g'), parseValue(_value)) + '\n'
        })
      } else {
        convertedStyles += `'.${setModifier2(rule, modifier)}${setModifier2(modifier)}': ` + _.replace(_.replace(properties, new RegExp('{value}', 'g'), parseValue(value)), new RegExp('{transparentValue}', 'g'), `${addTransparencyToValue(parseValue(value))}`) + '\n'
      }
    })
  })

  convertedStyles += processComments({
    prop: 'backgroundSelectedGradient: colors - To Color - iOS Only',
    modules: 'Ti.UI.ListItem, Ti.UI.View'
  })

  objectPosition = { 'bg-selected-to': '{ backgroundSelectedGradient: { colors: [ {value} ] } }' }

  _.each(objectPosition, (properties, rule) => {
    _.each(modifiersAndValues, (value, modifier) => {
      if (typeof value === 'object') {
        _.each(value, (_value, _modifier) => {
          convertedStyles += `'.${removeLastDash(`${rule}-${setModifier2(modifier, rule)}${setModifier2(_modifier)}`)}': ` + _.replace(properties, new RegExp('{value}', 'g'), parseValue(_value)) + '\n'
        })
      } else {
        convertedStyles += `'.${setModifier2(rule, modifier)}${setModifier2(modifier)}': ` + _.replace(properties, new RegExp('{value}', 'g'), parseValue(value)) + '\n'
      }
    })
  })

  return convertedStyles
}
exports.backgroundSelectedGradient = backgroundSelectedGradient

function badgeColor(modifiersAndValues) {
  return processProperties({
    prop: 'badgeColor',
    modules: 'Ti.UI.Tab'
  }, {
    badge: '{ badgeColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.badgeColor = badgeColor

function barColor(modifiersAndValues) {
  return processProperties({
    prop: 'barColor',
    modules: 'Ti.UI.EmailDialog, Ti.UI.SearchBar, Ti.UI.TabGroup, Ti.UI.Toolbar, Ti.UI.Window'
  }, {
    bar: '{ barColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.barColor = barColor

function borderColor(modifiersAndValues) {
  return processProperties({
    prop: 'borderColor',
    modules: 'Ti.UI.View'
  }, {
    border: '{ borderColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.borderColor = borderColor

function currentPageIndicatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'currentPageIndicatorColor - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'current-page-indicator': '{ currentPageIndicatorColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.currentPageIndicatorColor = currentPageIndicatorColor

function dateTimeColor(modifiersAndValues) {
  return processProperties({
    prop: 'dateTimeColor - iOS Only',
    modules: 'Ti.UI.Picker'
  }, {
    'date-time': '{ dateTimeColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.dateTimeColor = dateTimeColor

function disabledColor(modifiersAndValues) {
  return processProperties({
    prop: 'disabledColor - iOS Only',
    modules: 'Ti.UI.Button'
  }, {
    disabled: '{ disabledColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.disabledColor = disabledColor

function shadowColor(modifiersAndValues) {
  return processProperties({
    prop: 'shadowColor - Drop Shadow in Tailwind',
    modules: 'Ti.UI.Button, Ti.UI.Label'
  }, {
    'drop-shadow': '{ shadowColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.shadowColor = shadowColor

function highlightedColor(modifiersAndValues) {
  return processProperties({
    prop: 'highlightedColor',
    modules: 'Ti.UI.Label'
  }, {
    highlighted: '{ highlightedColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.highlightedColor = highlightedColor

function hintTextColor(modifiersAndValues) {
  return processProperties({
    prop: 'hintTextColor',
    modules: 'Ti.UI.Android.SearchView, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'hint-text': '{ hintTextColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.hintTextColor = hintTextColor

function imageTouchFeedbackColor(modifiersAndValues) {
  return processProperties({
    prop: 'imageTouchFeedbackColor - Android Only',
    modules: 'Ti.UI.ImageView'
  }, {
    'image-touch-feedback': '{ imageTouchFeedbackColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.imageTouchFeedbackColor = imageTouchFeedbackColor

function indicatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'indicatorColor',
    modules: 'Ti.UI.ActivityIndicator'
  }, {
    indicator: '{ indicatorColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.indicatorColor = indicatorColor

function keyboardToolbarColor(modifiersAndValues) {
  return processProperties({
    prop: 'keyboardToolbarColor - iOS Only',
    modules: 'Ti.UI.ActivityIndicator'
  }, {
    'keyboard-toolbar': '{ keyboardToolbarColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.keyboardToolbarColor = keyboardToolbarColor

function navTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'navTintColor - iOS Only',
    modules: 'Ti.UI.TabGroup, Ti.UI.Window'
  }, {
    'nav-tint': '{ navTintColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.navTintColor = navTintColor

function onTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'onTintColor - iOS Only',
    modules: 'Ti.UI.Switch'
  }, {
    'on-tint': '{ onTintColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.onTintColor = onTintColor

function pageIndicatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'pageIndicatorColor - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'page-indicator': '{ pageIndicatorColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.pageIndicatorColor = pageIndicatorColor

function pagingControlColor(modifiersAndValues) {
  return processProperties({
    prop: 'pagingControlColor - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control': '{ pagingControlColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.pagingControlColor = pagingControlColor

function placeholder(modifiersAndValues) {
  return processProperties({
    prop: 'hintTextColor ( Alternative )',
    modules: 'Ti.UI.Android.SearchView, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    placeholder: '{ hintTextColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.placeholder = placeholder

function pullBackgroundColor(modifiersAndValues) {
  return processProperties({
    prop: 'pullBackgroundColor - iOS Only',
    modules: 'Ti.UI.View'
  }, {
    'pull-bg': '{ pullBackgroundColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.pullBackgroundColor = pullBackgroundColor

function resultsBackgroundColor(modifiersAndValues) {
  return processProperties({
    prop: 'resultsBackgroundColor - iOS Only',
    modules: 'Ti.UI.ListView'
  }, {
    'results-bg': '{ resultsBackgroundColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.resultsBackgroundColor = resultsBackgroundColor

function resultsSeparatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'resultsSeparatorColor',
    modules: 'Ti.UI.ListView'
  }, {
    'results-separator': '{ resultsSeparatorColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.resultsSeparatorColor = resultsSeparatorColor

function selectedButtonColor(modifiersAndValues) {
  return processProperties({
    prop: 'selectedButtonColor - iOS Only',
    modules: 'Ti.UI.SearchBar'
  }, {
    'selected-button': '{ selectedButtonColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.selectedButtonColor = selectedButtonColor

function selectedColor(modifiersAndValues) {
  return processProperties({
    prop: 'selectedColor - iOS Only',
    modules: 'Ti.UI.Button, Ti.UI.ListItem, Ti.UI.TableViewRow'
  }, {
    selected: '{ selectedColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.selectedColor = selectedColor

function selectedSubtitleColor(modifiersAndValues) {
  return processProperties({
    prop: 'selectedSubtitleColor - iOS Only',
    modules: 'Ti.UI.ListItem'
  }, {
    'selected-subtitle': '{ selectedSubtitleColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.selectedSubtitleColor = selectedSubtitleColor

function selectedTextColor(modifiersAndValues) {
  return processProperties({
    prop: 'selectedTextColor - iOS Only',
    modules: 'Ti.UI.SearchBar'
  }, {
    'selected-text': '{ selectedTextColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.selectedTextColor = selectedTextColor

function separatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'separatorColor',
    modules: 'Ti.UI.ListView'
  }, {
    separator: '{ separatorColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.separatorColor = separatorColor

function subtitleColor(modifiersAndValues) {
  return processProperties({
    prop: 'subtitleColor - iOS Only',
    modules: 'Ti.UI.ListItem'
  }, {
    subtitle: '{ subtitleColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.subtitleColor = subtitleColor

function tabsBackgroundColor(modifiersAndValues) {
  return processProperties({
    prop: 'tabsBackgroundColor',
    modules: 'Ti.UI.TabGroup'
  }, {
    'tabs-bg': '{ tabsBackgroundColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.tabsBackgroundColor = tabsBackgroundColor

function tabsBackgroundSelectedColor(modifiersAndValues) {
  return processProperties({
    prop: 'tabsBackgroundSelectedColor - Android Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    'tabs-bg-selected': '{ tabsBackgroundSelectedColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.tabsBackgroundSelectedColor = tabsBackgroundSelectedColor

function camelCaseToDash(str) {
  if (str.includes('[')) {
    return str
  } else {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }
}

function textColor(modifiersAndValues) {
  return processProperties({
    prop: 'color',
    modules: 'Ti.UI.Button, Ti.UI.Label, Ti.UI.PickerRow, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.ListItem, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextField, Ti.UI.Android.SearchView'
  }, {
    text: '{ color: {value}, textColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.textColor = textColor

function thumbTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'thumbTintColor - iOS Only',
    modules: 'Ti.UI.Switch'
  }, {
    'thumb-tint': '{ thumbTintColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.thumbTintColor = thumbTintColor

function tintColor(modifiersAndValues) {
  return processProperties({
    prop: 'tintColor',
    modules: 'Ti.UI.View, Ti.Media.VideoPlayer, Ti.UI.AlertDialog, Ti.UI.Button, Ti.UI.ButtonBar, Ti.UI.DashboardView, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ListView, Ti.UI.MaskedImage, Ti.UI.NavigationWindow, Ti.UI.OptionBar, Ti.UI.OptionDialog, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.RefreshControl, Ti.UI.ScrollView, Ti.UI.ScrollableView, Ti.UI.SearchBar, Ti.UI.Slider, Ti.UI.Switch, Ti.UI.Tab, Ti.UI.TabGroup, Ti.UI.TabbedBar, Ti.UI.TableView, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Toolbar, Ti.UI, Ti.UI.WebView, Ti.UI.Window, windowToolbarParam, Ti.UI.iOS.BlurView, Ti.UI.iOS.CoverFlowView, Ti.UI.iOS.LivePhotoView, Ti.UI.iOS.SplitWindow, Ti.UI.iOS.Stepper'
  }, {
    'tint-color': '{ tintColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.tintColor = tintColor

function titleAttributesColor(modifiersAndValues) {
  return processProperties({
    prop: 'titleAttributes: color - iOS Only',
    modules: 'Ti.UI.TabGroup, Ti.UI.Window'
  }, {
    'title-attributes': '{ titleAttributes: { color: {value} } }'
  }, {
    [(globalOptions.legacy) ? 'ios' : 'default']: modifiersAndValues
  })
}
exports.titleAttributesColor = titleAttributesColor

function titleAttributesShadowColor(modifiersAndValues) {
  return processProperties({
    prop: 'titleAttributes: shadow - iOS Only',
    modules: 'Ti.UI.TabGroup, Ti.UI.Window'
  }, {
    'title-attributes-shadow': '{ titleAttributes: { shadow: { color: {value} } } }'
  }, {
    [(globalOptions.legacy) ? 'ios' : 'default']: modifiersAndValues
  })
}
exports.titleAttributesShadowColor = titleAttributesShadowColor

function titleColor(modifiersAndValues) {
  return processProperties({
    prop: 'titleColor',
    modules: 'Ti.UI.Tab, Ti.UI.TabGroup'
  }, {
    title: '{ titleColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.titleColor = titleColor

function titleTextColor(modifiersAndValues) {
  return processProperties({
    prop: 'titleTextColor - Android Only',
    modules: 'Ti.UI.Toolbar'
  }, {
    'title-text': '{ titleTextColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.titleTextColor = titleTextColor

function touchFeedbackColor(modifiersAndValues) {
  return processProperties({
    prop: 'touchFeedbackColor - Android Only',
    modules: 'Ti.UI.View'
  }, {
    'touch-feedback': '{ touchFeedback: true, touchFeedbackColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}
exports.touchFeedbackColor = touchFeedbackColor

function trackTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'trackTintColor',
    modules: 'Ti.UI.ProgressBar, Ti.UI.Slider'
  }, {
    'track-tint': '{ trackTintColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
exports.trackTintColor = trackTintColor

function viewShadowColor(modifiersAndValues) {
  return processProperties({
    prop: 'viewShadowColor - Box Shadow Color in Tailwind - iOS Only',
    modules: 'Ti.UI.View'
  }, {
    shadow: '{ viewShadowColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}
exports.viewShadowColor = viewShadowColor

// ! The Mother Goose
function customRules(_value, _key) {
  // ! Want to refactor
  let convertedStyles = ''

  _.each(_value, (value, modifier) => {
    if (modifier === 'apply') {
      _applyClasses[_key] = new Set(Array.isArray(_value[modifier]) ? _value[modifier] : _value[modifier].split(' '))

      convertedStyles += `'${_key}': { {_applyProperties_} }\n`
    } else {
      let customProperties = ''

      _.each(value, (theValue, theModifier) => {
        if (typeof (theValue) === 'object' && theValue !== null) {
          if (theModifier === 'apply') {
            _applyClasses[`${_key}${setModifier2(modifier)}`] = new Set(Array.isArray(theValue) ? theValue : theValue.split(' '))

            customProperties += ' {_applyProperties_},'
          } else {
            customProperties += ` ${theModifier}: {`

            let extraCustomProperties = ''

            _.each(theValue, (extraValue, extraModifier) => {
              if (typeof (extraValue) === 'object' && extraValue !== null) {
                customProperties += ` ${extraModifier}: {`

                let moreExtraCustomProperties = ''

                _.each(extraValue, (moreExtraValue, moreModifier) => {
                  moreExtraCustomProperties += ` ${moreModifier}: ${parseValue(moreExtraValue)},`
                })

                customProperties += `${remove_last_character(moreExtraCustomProperties)} },`
              } else {
                extraCustomProperties += ` ${extraModifier}: ${parseValue(extraValue)},`
              }
            })

            customProperties += `${remove_last_character(extraCustomProperties)} },`
          }
        } else {
          if (theModifier === 'apply') {
            _applyClasses[`${setModifier2(_key, modifier)}${setModifier2(modifier)}`] = new Set(Array.isArray(theValue) ? theValue : theValue.split(' '))

            customProperties += ' {_applyProperties_},'
          } else {
            customProperties += ` ${theModifier}: ${parseValue(theValue)},`
          }
        }
      })

      convertedStyles += `'${setModifier2(_key, modifier)}${setModifier2(modifier)}': {${remove_last_character(customProperties)} }\n`
    }
  })

  return convertedStyles
}
exports.customRules = customRules

// ! The son of Mother Goose
function compileApplyDirectives(twClasses) {
  const twClassesArray = twClasses.split(/\r?\n/)
  const fontsClassesArray = (fs.existsSync(cwd + '/purgetss/styles/fonts.tss')) ? fs.readFileSync(cwd + '/purgetss/styles/fonts.tss', 'utf8').split(/\r?\n/) : null
  _.each(_applyClasses, (values, className) => {
    const indexOfModifier = findIndexOfClassName(`'${className}':`, twClassesArray)

    if (indexOfModifier !== -1) {
      const compoundClasses = []
      const classesWithOpacityValues = []
      _.each([...values], searchClass => {
        if (searchClass.includes('ios:')) {
          searchClass = `${searchClass.replace('ios:', '')}[platform=ios]`
        } else if (searchClass.includes('android:')) {
          searchClass = `${searchClass.replace('android:', '')}[platform=android]`
        }
        // ! TODO: Needs to handle open, close and complete states...
        if (searchClass.includes('(')) {
          const theClass = formatArbitraryValues(searchClass)
          if (theClass) compoundClasses.push(theClass)
          // ! Process transparency values
        } else if (checkColorClasses(searchClass)) {
          // Set opacity to color properties
          const originalClass = searchClass
          const decimalValue = searchClass.split('/')[1]
          const transparency = Math.round(decimalValue * 255 / 100).toString(16).padStart(2, '0')
          const classNameWithTransparency = searchClass.substring(0, searchClass.lastIndexOf('/'))
          classesWithOpacityValues.push({ decimalValue, transparency, originalClass, classNameWithTransparency })
        } else {
          const className = `'.${searchClass}':`
          let foundClass = twClassesArray[findIndexOfClassName(className, twClassesArray)]

          if (foundClass) compoundClasses.push(justProperties(foundClass))
          else if (fontsClassesArray) {
            foundClass = fontsClassesArray[findIndexOfClassName(className, fontsClassesArray)]
            if (foundClass) compoundClasses.push(justProperties(foundClass))
          }
        }
      })

      // Handle opacity values
      if (classesWithOpacityValues.length) {
        classesWithOpacityValues.forEach(opacityValue => {
          const opacityIndex = findIndexOfClassName(`'.${opacityValue.classNameWithTransparency}`, twClassesArray)
          if (opacityIndex > -1) {
            const defaultHexValue = (twClassesArray[opacityIndex].includes('from')) ? twClassesArray[opacityIndex].match(/\#[0-9a-f]{6}/g)[1] : twClassesArray[opacityIndex].match(/\#[0-9a-f]{6}/i)[0]
            const classWithoutDecimalOpacity = `${twClassesArray[opacityIndex].replace(new RegExp(defaultHexValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `#${opacityValue.transparency}${defaultHexValue.substring(1)}`)}`
            compoundClasses.push(justProperties(classWithoutDecimalOpacity))
          }
        })
      }

      twClassesArray[indexOfModifier] = _.replace(twClassesArray[indexOfModifier], new RegExp('{_applyProperties_}'), fixDuplicateKeys(compoundClasses).join(', '))
    }
  })

  return twClassesArray.join('\n')
}
exports.compileApplyDirectives = compileApplyDirectives

function justProperties(_foundClass) {
  return _foundClass.match(/{(.*)}/)[1].trim()
}

const arbitraryValuesTable = {
  // Spacing
  'bg-l-cap': 'backgroundLeftCap: {value}',
  'bg-padding-b': 'backgroundPaddingBottom: {value}',
  'bg-padding-l': 'backgroundPaddingLeft: {value}',
  'bg-padding-r': 'backgroundPaddingRight: {value}',
  'bg-padding-t': 'backgroundPaddingTop: {value}',
  'bg-t-cap': 'backgroundTopCap: {value}',
  bottom: 'bottom: {value}',
  'content-h': 'contentHeight: {value}',
  'content-w': 'contentWidth: {value}',
  content: 'contentWidth: {value}, contentHeight: {value}',
  'gap-b': 'bottom: {value}',
  'gap-l': 'left: {value}',
  'gap-r': 'right: {value}',
  'gap-t': 'top: {value}',
  'gap-x': 'left: {value}, right: {value}',
  'gap-y': 'top: {value}, bottom: {value}',
  gap: 'top: {value}, right: {value}, bottom: {value}, left: {value}',
  h: 'height: {value}',
  'indentation-level': 'indentionLevel: {value}',
  'keyboard-toolbar-h': 'keyboardToolbarHeight: {value}',
  l: 'left: {value}',
  'left-button-padding': 'leftButtonPadding: {value}',
  'left-w': 'leftWidth: {value}',
  left: 'left: {value}',
  lw: 'leftWidth: {value}',
  m: 'top: {value}, right: {value}, bottom: {value}, left: {value}',
  'max-elevation': 'maxElevation: {value}',
  'max-row-h': 'maxRowHeight: {value}',
  mb: 'bottom: {value}',
  'min-row-h': 'minRowHeight: {value}',
  ml: 'left: {value}',
  mr: 'right: {value}',
  mt: 'top: {value}',
  mx: 'right: {value}, left: {value}',
  my: 'top: {value}, bottom: {value}',
  p: 'padding: { top: {value}, right: {value}, bottom: {value}, left: {value} }',
  'padding-b': 'paddingBottom: {value}',
  'padding-bottom': 'paddingBottom: {value}',
  'padding-l': 'paddingLeft: {value}',
  'padding-left': 'paddingLeft: {value}',
  'padding-r': 'paddingRight: {value}',
  'padding-right': 'paddingRight: {value}',
  'padding-t': 'paddingTop: {value}',
  'padding-top': 'paddingTop: {value}',
  'padding-x': 'paddingLeft: {value}, paddingRight: {value}',
  'padding-y': 'paddingTop: {value}, paddingBottom: {value}',
  padding: 'paddingTop: {value}, paddingBottom: {value}, paddingLeft: {value}, paddingRight: {value}',
  'paging-control-h': 'pagingControlHeight: {value}',
  pb: 'padding: { bottom: {value} }',
  pl: 'padding: { left: {value} }',
  pr: 'padding: { right: {value} }',
  pt: 'padding: { top: {value} }',
  px: 'padding: { left: {value}, right: {value} }',
  py: 'padding: { top: {value}, bottom: {value} }',
  r: 'right: {value}',
  'right-button-padding': 'rightButtonPadding: {value}',
  'right-w': 'rightWidth: {value}',
  right: 'right: {value}',
  'rounded-b': 'borderRadius: [0, 0, {value}, {value}]',
  'rounded-bl': 'borderRadius: [0, 0, 0, {value}]',
  'rounded-br': 'borderRadius: [0, 0, {value}, 0]',
  'rounded-full': 'width: {value}, height: {value}, borderRadius: {value1}',
  'rounded-l': 'borderRadius: [{value}, 0, 0, {value}]',
  'rounded-r': 'borderRadius: [0, {value}, {value}, 0]',
  'rounded-t': 'borderRadius: [{value}, {value}, 0, 0]',
  'rounded-tl': 'borderRadius: [{value}, 0, 0, 0]',
  'rounded-tr': 'borderRadius: [0, {value}, 0, 0]',
  rounded: 'borderRadius: {value}',
  'row-h': 'rowHeight: {value}',
  rw: 'rightWidth: {value}',
  'section-header-top-padding': 'sectionHeaderTopPadding: {value}',
  'separator-h': 'separatorHeight: {value}',
  'shadow-radius': 'shadowRadius: {value}',
  'target-image-h': 'targetImageHeight: {value}',
  'target-image-w': 'targetImageWidth: {value}',
  top: 'top: {value}',
  w: 'width: {value}',
  wh: 'width: {value}, height: {value}',
  'x-offset': 'xOffset: {value}',
  x: 'left: {value}, right: {value}',
  'y-offset': 'yOffset: {value}',
  y: 'top: {value}, bottom: {value}',

  // Color
  'active-tint': 'activeTintColor: {value}',
  'active-title': 'activeTitleColor: {value}',
  'badge-bg': 'badgeBackgroundColor: {value}',
  'badge-text': 'badgeTextColor: {value}',
  badge: 'badgeColor: {value}',
  bar: 'barColor: {value}',
  'bg-disabled': 'backgroundDisabledColor: {value}',
  'bg-focused': 'backgroundFocusedColor: {value}',
  'bg-from': 'backgroundGradient: { colors: [ {value1}, {value} ] }',
  'bg-selected-from': 'backgroundSelectedGradient: { colors: [ {value1}, {value} ] }',
  'bg-selected-to': 'backgroundSelectedGradient: { colors: [ {value} ] }',
  'bg-selected': 'backgroundSelectedColor: {value}',
  'bg-to': 'backgroundGradient: { colors: [ {value} ] }',
  bg: 'backgroundColor: {value}',
  'border-color': 'borderColor: {value}',
  colors: 'colors: {value}',
  'content-scrim': 'contentScrimColor: {value}',
  'current-page-indicator': 'currentPageIndicatorColor: {value}',
  'date-time': 'dateTimeColor: {value}',
  disabled: 'disabledColor: {value}',
  'drop-shadow': 'shadowColor: {value}',
  from: 'backgroundGradient: { colors: [ {value1}, {value} ] }',
  highlighted: 'highlightedColor: {value}',
  'hint-text': 'hintTextColor: {value}',
  icon: 'iconColor: {value}',
  'image-touch-feedback': 'imageTouchFeedbackColor: {value}',
  index: 'index: {value}',
  indicator: 'indicatorColor: {value}',
  'keyboard-toolbar': 'keyboardToolbarColor: {value}',
  light: 'lightColor: {value}',
  'nav-tint': 'navTintColor: {value}',
  'navigation-icon': 'navigationIconColor: {value}',
  'on-tint': 'onTintColor: {value}',
  'page-indicator': 'pageIndicatorColor: {value}',
  'paging-control': 'pagingControlColor: {value}',
  placeholder: 'hintTextColor: {value}',
  'pull-bg': 'pullBackgroundColor: {value}',
  'results-bg': 'resultsBackgroundColor: {value}',
  'results-separator': 'resultsSeparatorColor: {value}',
  'selected-bg': 'selectedBackgroundColor: {value}',
  'selected-button': 'selectedButtonColor: {value}',
  'selected-subtitle': 'selectedSubtitleColor: {value}',
  'selected-text': 'selectedTextColor: {value}',
  selected: 'selectedColor: {value}',
  separator: 'separatorColor: {value}',
  shadow: 'viewShadowColor: {value}',
  'status-bar-bg': 'statusBarBackgroundColor: {value}',
  'subtitle-text': 'subtitleTextColor: {value}',
  subtitle: 'subtitleColor: {value}',
  'tabs-bg-selected': 'tabsBackgroundSelectedColor: {value}',
  'tabs-bg': 'tabsBackgroundColor: {value}',
  'text-color': 'color: {value}, textColor: {value}',
  'thumb-tint': 'thumbTintColor: {value}',
  tint: 'tint: {value}',
  'tint-color': 'tintColor: {value}',
  'title-attributes-shadow': 'titleAttributes: { shadow: { color: {value} } }',
  'title-attributes': 'titleAttributes: { color: {value} }',
  'title-text': 'titleTextColor: {value}',
  title: 'titleColor: {value}',
  to: 'backgroundGradient: { colors: [ {value} ] }',
  'touch-feedback': 'touchFeedback: true, touchFeedbackColor: {value}',
  'track-tint': 'trackTintColor: {value}',
  'view-shadow': 'viewShadowColor: {value}',

  // Misc
  'active-tab': 'activeTab: {value}',
  'border-width': 'borderWidth: {value}',
  'cache-size': 'cacheSize: {value}',
  cancel: 'cancel: {value}',
  'count-down': 'countDownDuration: {value}',
  delay: 'delay: {value}',
  destructive: 'destructive: {value}',
  duration: 'duration: {value}',
  elevation: 'elevation: {value}',
  font: 'font: { fontWeight: {value} }',
  'horizontal-margin': 'horizontalMargin: \'{value}\'',
  lines: 'lines: {value}',
  'max-length': 'maxLength: {value}',
  'max-lines': 'maxLines: {value}',
  'max-zoom-scale': 'maxZoomScale: {value}',
  max: 'max: {value}',
  maximum: 'maximum: {value}',
  'min-zoom-scale': 'minZoomScale: {value}',
  min: 'min: {value}',
  'minimum-text': 'minimumFontSize: {value}',
  minimum: 'minimum: {value}',
  opacity: 'opacity: {value}',
  origin: 'anchorPoint: { x: {value}, y: {value1} }',
  'paging-control-alpha': 'pagingControlAlpha: \'{value}\'',
  'paging-control-timeout': 'pagingControlTimeout: {value}',
  preferred: 'preferred: {value}',
  'repeat-count': 'repeatCount: {value}',
  repeat: 'repeat: {value}',
  rotate: 'rotate: {value}',
  scale: 'scale: \'{value}\'',
  'text-size': 'font: { fontSize: {value} }',
  timeout: 'timeout: {value}',
  value: 'value: \'{value}\'',
  'vertical-margin': 'verticalMargin: \'{value}\'',
  z: 'zIndex: {value}',
  'zoom-scale': 'zoomScale: \'{value}\''
}
exports.arbitraryValuesTable = arbitraryValuesTable

function formatArbitraryValues(arbitraryValue, fromXMLs = false) {
  const sign = (arbitraryValue.startsWith('-')) ? '-' : ''
  const splitedContent = (arbitraryValue.startsWith('-')) ? arbitraryValue.substring(1).split('-') : arbitraryValue.split('-')

  if (splitedContent.length === 1) {
    return ''
  } else if (splitedContent.length === 2) {
    let rule = splitedContent.slice(0, 1).join('-')
    let value = splitedContent[1].match(/(?<=\().*(?=\))/).pop()

    if (rule === 'text') {
      rule = (value.includes('#') || value.includes('rgb')) ? 'text-color' : 'text-size'
    }

    if (rule === 'border') {
      rule = (value.includes('#') || value.includes('rgb')) ? 'border-color' : 'border-width'
    }

    if (rule === 'paging') {
      rule = (value.includes('#') || value.includes('rgb')) ? 'paging-color' : 'paging-alpha'
    }

    let properties = arbitraryValuesTable[rule]

    if (rule === 'from') {
      properties = _.replace(properties, new RegExp('{value1}', 'g'), addTransparencyToHex(parseValue(value)))
    }

    if (rule === 'origin') {
      const value1 = (value.includes(',')) ? value.split(',')[1] : value
      value = value.split(',')[0]
      properties = _.replace(properties, new RegExp('{value1}', 'g'), parseValue(value1, sign))
    }

    if (properties) {
      return (fromXMLs)
        ? `'.${arbitraryValue}': { ` + _.replace(properties, new RegExp('{value}', 'g'), parseValue(value, sign)) + ' }'
        : _.replace(properties, new RegExp('{value}', 'g'), parseValue(value, sign))
    }
  } else if (splitedContent.length === 3) {
    const rule = splitedContent.slice(0, 2).join('-')
    const value = splitedContent[2].match(/(?<=\().*(?=\))/).pop()
    let properties = arbitraryValuesTable[rule]

    if (properties) {
      if (splitedContent[0] === 'rounded') {
        properties = _.replace(properties, new RegExp('{value1}', 'g'), parseValue(parseValue(value) / 2, sign))
      }
      return (fromXMLs)
        ? `'.${arbitraryValue}': { ` + _.replace(properties, new RegExp('{value}', 'g'), parseValue(value, sign)) + ' }'
        : _.replace(properties, new RegExp('{value}', 'g'), parseValue(value, sign))
    }
  } else if (splitedContent.length === 4) {
    const rule = splitedContent.slice(0, 3).join('-')
    const value = splitedContent[3].match(/(?<=\().*(?=\))/).pop()
    let properties = arbitraryValuesTable[rule]

    if (properties) {
      if (rule.includes('from')) {
        properties = _.replace(properties, new RegExp('{value1}', 'g'), addTransparencyToHex(parseValue(value)))
      }

      return (fromXMLs)
        ? `'.${arbitraryValue}': { ` + _.replace(properties, new RegExp('{value}', 'g'), parseValue(value, sign)) + ' }'
        : _.replace(properties, new RegExp('{value}', 'g'), parseValue(value, sign))
    }
  } else if (splitedContent.length === 5) {
    const rule = splitedContent.slice(0, 4).join('-')
    const value = splitedContent[4].match(/(?<=\().*(?=\))/).pop()
    const properties = arbitraryValuesTable[rule]

    if (properties) {
      return (fromXMLs)
        ? `'.${arbitraryValue}': { ` + _.replace(properties, new RegExp('{value}', 'g'), parseValue(value, sign)) + ' }'
        : _.replace(properties, new RegExp('{value}', 'g'), parseValue(value, sign))
    }
  }

  return (fromXMLs) ? `// Property not yet supported: ${arbitraryValue}` : null
}
exports.formatArbitraryValues = formatArbitraryValues

function checkColorClasses(cleanClassName) {
  return (
    cleanClassName.startsWith('active-tint-') ||
		cleanClassName.startsWith('active-title-') ||
		cleanClassName.startsWith('badge-') ||
		cleanClassName.startsWith('bar-') ||
		cleanClassName.startsWith('bg-') ||
		cleanClassName.startsWith('border-') ||
		cleanClassName.startsWith('current-page-indicator-') ||
		cleanClassName.startsWith('date-time-') ||
		cleanClassName.startsWith('disabled-') ||
		cleanClassName.startsWith('from-') ||
		cleanClassName.startsWith('highlighted-') ||
		cleanClassName.startsWith('hint-text-') ||
		cleanClassName.startsWith('image-touch-feedback-') ||
		cleanClassName.startsWith('indicator-') ||
		cleanClassName.startsWith('keyboard-toolbar-') ||
		cleanClassName.startsWith('nav-tint-') ||
		cleanClassName.startsWith('on-tint-') ||
		cleanClassName.startsWith('page-indicator-') ||
		cleanClassName.startsWith('paging-control-') ||
		cleanClassName.startsWith('placeholder-') ||
		cleanClassName.startsWith('pull-bg-') ||
		cleanClassName.startsWith('results-bg-') ||
		cleanClassName.startsWith('results-separator-') ||
		cleanClassName.startsWith('selected-') ||
		cleanClassName.startsWith('separator-') ||
		cleanClassName.startsWith('shadow-') ||
		cleanClassName.startsWith('subtitle-') ||
		cleanClassName.startsWith('tabs-bg-') ||
		cleanClassName.startsWith('text-') ||
		cleanClassName.startsWith('thumb-tint-') ||
		cleanClassName.startsWith('tint-') ||
		cleanClassName.startsWith('title-') ||
		cleanClassName.startsWith('to-') ||
		cleanClassName.startsWith('touch-feedback-') ||
		cleanClassName.startsWith('track-tint-') ||
		cleanClassName.startsWith('view-shadow-')) &&
		cleanClassName.includes('/')
}
exports.checkColorClasses = checkColorClasses

function checkPlatformAndDevice(line, className) {
  // https://regex101.com/r/6VTh23/1
  if (className.includes('ios:')) {
    return (line.includes('platform=ios'))
      ? `${line.replace(/[^'.][^']+|1/, 'ios:$&')}\n`
      : `${line.replace(/[^'.][^']+|1/, 'ios:$&[platform=ios]')}\n`
  } else if (className.includes('android:')) {
    return (line.includes('platform=android'))
      ? `${line.replace(/[^'.][^']+|1/, 'android:$&')}\n`
      : `${line.replace(/[^'.][^']+|1/, 'android:$&[platform=android]')}\n`
  } else if (className.includes('handheld:')) {
    return (line.includes('formFactor=handheld'))
      ? `${line.replace(/[^'.][^']+|1/, 'handheld:$&')}\n`
      : `${line.replace(/[^'.][^']+|1/, 'handheld:$&[formFactor=handheld]')}\n`
  } else if (className.includes('tablet:')) {
    return (line.includes('formFactor=tablet'))
      ? `${line.replace(/[^'.][^']+|1/, 'tablet:$&')}\n`
      : `${line.replace(/[^'.][^']+|1/, 'tablet:$&[formFactor=tablet]')}\n`
  } else if (className.includes('child:')) {
    return `${line.replace(/[^'.][^']+|1/, 'child:$&').replace(/{(.*)}/, '{ animationProperties: { child: $& } }')}\n`
  } else if (className.includes('children:')) {
    return `${line.replace(/[^'.][^']+|1/, 'children:$&').replace(/{(.*)}/, '{ animationProperties: { children: $& } }')}\n`
  } else if (className.includes('open:')) {
    return `${line.replace(/[^'.][^']+|1/, 'open:$&').replace(/{(.*)}/, '{ animationProperties: { open: $& } }')}\n`
  } else if (className.includes('close:')) {
    return `${line.replace(/[^'.][^']+|1/, 'close:$&').replace(/{(.*)}/, '{ animationProperties: { close: $& } }')}\n`
  } else if (className.includes('complete:')) {
    return `${line.replace(/[^'.][^']+|1/, 'complete:$&').replace(/{(.*)}/, '{ animationProperties: { complete: $& } }')}\n`
  } else if (className.includes('bounds:') && (line.includes('top') || line.includes('right') || line.includes('bottom') || line.includes('left'))) {
    return `${line.replace(/[^'.][^']+|1/, 'bounds:$&').replace(/{(.*)}/, '{ bounds: $& }')}\n`
  } else if (className.includes('drag:')) {
    return `${line.replace(/[^'.][^']+|1/, 'drag:$&').replace(/{(.*)}/, '{ draggable: { drag: $& } }')}\n`
  } else if (className.includes('drop:')) {
    return `${line.replace(/[^'.][^']+|1/, 'drop:$&').replace(/{(.*)}/, '{ draggable: { drop: $& } }')}\n`
  } else {
    return `${line}\n`
  }
}
exports.checkPlatformAndDevice = checkPlatformAndDevice

// ! Private Functions
function processProperties(info, selectorAndDeclarationBlock, selectorsAndValues, debug = false) {
  let convertedStyles = (typeof info === 'object') ? processComments(info) : `\n// ${info}\n`

  _.each(selectorAndDeclarationBlock, (declarationBlock, mainSelector) => {
    const minusSigns = (mainSelector.startsWith('-')) ? '-' : ''
    if (debug) console.log('mainSelector:', mainSelector, 'declarationBlock:', declarationBlock)
    _.each(selectorsAndValues, (rulesAndValuesPair, selector) => {
      if (debug) console.log('selector', selector)
      _.each(rulesAndValuesPair, (value, rule) => {
        if (debug) console.log('rule:', rule, 'value:', value)
        if (typeof value === 'object') {
          _.each(value, (_value, key) => {
            if (debug) console.log('key:', key, '_value:', _value)
            let processedProperties = _.replace(declarationBlock, new RegExp('{value}', 'g'), parseValue(_value, minusSigns))
            if (declarationBlock.includes('double')) {
              processedProperties = _.replace(processedProperties, new RegExp('{double}', 'g'), parseValue(_value, minusSigns) * 2)
            }
            convertedStyles += defaultModifier(key) ? `'.${setModifier2(mainSelector, rule)}${setModifier2(rule)}${setModifier2(selector)}': ${processedProperties}\n` : `'.${setModifier2(mainSelector, rule)}${setModifier2(rule, key)}${setModifier2(key)}${setModifier2(selector)}': ${processedProperties}\n`
          })
        } else {
          let processedProperties = _.replace(declarationBlock, new RegExp('{value}', 'g'), parseValue(value, minusSigns))
          if (declarationBlock.includes('double')) {
            processedProperties = _.replace(processedProperties, new RegExp('{double}', 'g'), parseValue(value, minusSigns) * 2)
          }
          convertedStyles += `'.${setModifier2(mainSelector, rule)}${setModifier2(rule)}${setModifier2(selector)}': ${processedProperties}\n`
        }
      })
    })
  })

  return convertedStyles
}
exports.processProperties = processProperties

function processComments(data, key = undefined) {
  let myComments = ''

  // if (data.type) {
  // 	myComments += `\n// Type: ${data.type}`;
  // }

  if (key) {
    myComments += `\n// Property: ${key}`
  }

  if (data.prop) {
    myComments += `\n// Property(ies): ${data.prop}`
  }

  if (data.description) {
    myComments += `\n// Description: ${data.description.replace(/\n/g, ' ')}`
  }

  if (data.modules) {
    if (Array.isArray(data.modules)) {
      myComments += `\n// Component(s): ${data.modules.join(', ')}\n`
    } else {
      myComments += `\n// Component(s): ${data.modules}\n`
    }
  }

  return myComments
}

function findIndexOfClassName(_substring, _array) {
  return _array.findIndex(element => element.startsWith(_substring))
}

function parseValue(value, sign = '') {
  if (value === '') return '\'\''

  // Match on everything outside this range: [^\u0000-\u00FF].
  if (regexUnicode.test(value)) {
    return `'\\u${value.charCodeAt(0).toString(16)}'`
  }

  if (value === '0px') {
    value = 0
  }

  const unit = isNaN(value) ? checkTitanium(value) : value

  if (typeof value === 'string' && value.indexOf('-') > -1 || value < 0) sign = ''

  switch (unit) {
    case '0':
    case true:
    case false:
    case 'titanium':
      return `${sign}${value}`
    case 'vw':
    case 'vh':
    case 'screen':
      return 'Ti.UI.FILL'
    case 'auto':
      return 'Ti.UI.SIZE'
    case 'none':
    case 'null':
      return null
    case 'em':
    case 'rem':
      return `${sign}${16 * parseFloat(value)}`
    case 'dp':
      return `${sign}${parseFloat(value)}`
    case 'hex':
      return toHex(value)
    case 'deg':
      return parseFloat(value)
    case 'ms':
    case 's':
      return parseFloat(value)
    case 'transparent':
      return `'${value}'`
    default:
      return isNaN(value) ? `'${sign}${value}'` : `${sign}${value}`
  }
}
exports.parseValue = parseValue

function addTransparencyToValue(color) {
  if (color.includes('#')) {
    switch (color.length) {
      case 4:
        color = `#0${color[0]}${color[1]}${color[2]}`
        break
      case 7:
        color = `#00${color[0]}${color[1]}${color[2]}${color[3]}${color[4]}${color[5]}`
        break
      case 9:
        color = `#00${color[2]}${color[3]}${color[4]}${color[5]}${color[6]}${color[7]}`
        break
      case 11:
        color = `#00${color[4]}${color[5]}${color[6]}${color[7]}${color[8]}${color[9]}`
        break
    }
    return `'${color}'`
  } else if (color.match(/rgba?/i)) {
    const rgba = color.replace(/[\[\]')]+/g, '').split(',')
    color = `'${rgba[0].trim()}, ${rgba[1].trim()}, ${rgba[2].trim()}, 0)'`
  }

  return color
}

function addTransparencyToHex(color, transparency = '00') {
  if (color.includes('#')) {
    if (color.includes('\'')) {
      color = color.replace(/'/g, '')
    }
    switch (color.length) {
      case 4:
        color = `#${transparency}${color[1]}${color[2]}${color[3]}`
        break
      case 7:
        color = `#${transparency}${color[1]}${color[2]}${color[3]}${color[4]}${color[5]}${color[6]}`
        break
      case 9:
        color = `#${transparency}${color[3]}${color[4]}${color[5]}${color[6]}${color[7]}${color[8]}`
        break
    }
  }

  return `'${color}'`
}

function fixDuplicateKeys(compoundClasses) {
  compoundClasses.sort()

  const fontObject = []
  const cleanedStyles = []
  const paddingObject = []
  const backgroundGradientObject = []

  _.each(compoundClasses, value => {
    if (compoundClasses.length > 1) {
      if (value.includes('font:')) {
        fontObject.push(value.replace('font: ', '').replace(/{(.*)}/, '$1').trim())
      } else if (value.includes('backgroundGradient: { colors')) {
        backgroundGradientObject.push(value.replace('backgroundGradient: ', '').replace(/{(.*)}/, '$1').trim())
      } else if (value.includes('padding:')) {
        paddingObject.push(value.replace('padding: ', '').replace(/{(.*)}/, '$1').trim())
      } else {
        cleanedStyles.push(value)
      }
    } else {
      cleanedStyles.push(value)
    }
  })

  if (paddingObject.length) {
    const individualPaddingObjects = []
    paddingObject.forEach(propertyAndValue => {
      if (propertyAndValue.includes(',')) {
        const separateObjects = propertyAndValue.split(',')
        individualPaddingObjects.push(separateObjects[0].trim())
        individualPaddingObjects.push(separateObjects[1].trim())
      } else {
        individualPaddingObjects.push(propertyAndValue)
      }
    })

    cleanedStyles.push(`padding: { ${individualPaddingObjects.sort().join(', ')} }`)
  }

  if (fontObject.length) {
    cleanedStyles.push(`font: { ${fontObject.sort().join(', ')} }`)
  }

  if (backgroundGradientObject.length === 1) {
    cleanedStyles.push(`backgroundGradient: { ${backgroundGradientObject} }`)
  } else if (backgroundGradientObject.length === 2) {
    const toColor = backgroundGradientObject[1].replace('colors: ', '').replace(/[\[\]']+/g, '').trim().split(',')
    const fromToColors = backgroundGradientObject[0].replace('colors: ', '').replace(/[\[\]']+/g, '').trim().split(',')
    fromToColors[0] = toColor[0]
    cleanedStyles.push(`backgroundGradient: { colors: [ '${fromToColors[0]}', '${fromToColors[1].trim()}' ] }`)
  }

  // Missing properties to process
  /*
	* shadowColor
	* viewShadowColor
	* titleAttributes:shadow:color
	* titleAttributes:shadow:offset
	*/

  return cleanedStyles
}

function setModifier2(modifier, rule = null) {
  if (defaultModifier(modifier)) {
    modifier = ''
  } else if (modifier === 'ios') {
    modifier = '[platform=ios]'
  } else if (modifier === 'android') {
    modifier = '[platform=android]'
  } else if (modifier === 'handheld') {
    modifier = '[formFactor=handheld]'
  } else if (modifier === 'tablet') {
    modifier = '[formFactor=tablet]'
  } else if (modifier.startsWith('[if=')) {
    modifier = `${modifier}`
  } else if (notDefaultRules(rule)) {
    modifier = `${modifier}-`
  }

  if (!globalOptions.legacy) {
    modifier = camelCaseToDash(modifier)
  }

  return modifier
}

function defaultModifier(modifier) {
  return modifier === '' || modifier === null || modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT'
}

function notDefaultRules(rule) {
  return rule !== '' && rule !== null && rule !== 'global' && rule !== 'default' && rule !== 'DEFAULT' && rule !== 'ios' && rule !== 'android' && rule !== 'android' && rule !== 'handheld' && rule !== 'tablet' && !rule.startsWith('[if=')
}

function checkTitanium(value) {
  const substrings = ['Alloy', 'Ti.', 'Theme', 'Titanium', 'L(']

  if (typeof value === 'string') {
    if (substrings.some(substring => {
      return value.indexOf(substring) >= 0
    })) {
      return 'titanium'
    } else if (value.includes('#')) {
      return 'hex'
    }
    return value.replace(/[^a-zA-Z#%]+/g, '')
  }

  return value
}

function fixInvalidValues(invalidValues, currentValue) {
  return invalidValues[currentValue] || currentValue
}

function remove_last_character(element) {
  return element.slice(0, element.length - 1)
}

function removeFractions(modifiersAndValues, extras = []) {
  const newModifiersAndValues = { ...modifiersAndValues }
  _.each(newModifiersAndValues, (value, key) => {
    if (key.includes('/')) {
      delete newModifiersAndValues[key]
    }
  })

  if (extras.length) {
    _.each(extras, key => {
      delete newModifiersAndValues[key]
    })
  }

  return newModifiersAndValues
}
exports.removeFractions = removeFractions

function toHex(color) {
  if (color.includes('#')) {
    color = expandHex(color)
  } else if (color.match(/rgba?/i)) {
    color = rgbToHex(color)
  } else if (defaultColors(color)) {
    color = defaultColors(color)
  }

  return `'${color}'`
}

function expandHex(color) {
  // expand the shorter hex string forms to 6 or 8 digits
  if (color.length === 4) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    color = color.replace(HEX_3_REGEX, (m, r, g, b) => '#' + r + r + g + g + b + b)
  } else if (color.length === 5) {
    // Expand shorthand form (e.g. "03F8") to full form (e.g. "0033FF88")
    color = color.replace(HEX_4_REGEX, (m, a, r, g, b) => '#' + a + a + r + r + g + g + b + b)
  }

  return color
}

function rgbToHex(color) {
  const rgba = color.replace(/^rgba?\(|\s+|\)$/img, '').split(',')
  const alpha = (((rgba[3] || 0o1) * 255) | 1 << 8).toString(16).slice(1)
  return `#${alpha}${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`
}

function defaultColors(color) {
  const colors = {
    aqua: '#00FFFF',
    aquamarine: '#7FFFD4',
    azure: '#F0FFFF',
    beige: '#F5F5DC',
    bisque: '#FFE4C4',
    black: '#000000',
    blue: '#0000FF',
    brown: '#A52A2A',
    chartreuse: '#7FFF00',
    chocolate: '#D2691E',
    coral: '#FF7F50',
    cornsilk: '#FFF8DC',
    crimson: '#DC143C',
    cyan: '#00FFFF',
    darkgray: '#444444',
    fuchsia: '#FF00FF',
    gainsboro: '#DCDCDC',
    gold: '#FFD700',
    gray: '#808080',
    green: '#008000',
    grey: '#808080',
    indigo: '#4B0082',
    ivory: '#FFFFF0',
    khaki: '#F0E68C',
    lavender: '#E6E6FA',
    lightgray: '#cccccc',
    lime: '#00FF00',
    linen: '#FAF0E6',
    magenta: '#FF00FF',
    maroon: '#800000',
    moccasin: '#FFE4B5',
    navy: '#000080',
    olive: '#808000',
    orange: '#FFA500',
    orchid: '#DA70D6',
    peru: '#CD853F',
    pink: '#FFC0CB',
    plum: '#DDA0DD',
    purple: '#800080',
    red: '#FF0000',
    salmon: '#FA8072',
    sienna: '#A0522D',
    silver: '#C0C0C0',
    snow: '#FFFAFA',
    tan: '#D2B48C',
    teal: '#008080',
    thistle: '#D8BFD8',
    tomato: '#FF6347',
    turquoise: '#40E0D0',
    violet: '#EE82EE',
    wheat: '#F5DEB3',
    white: '#FFFFFF',
    yellow: '#FFFF00',
    'alice-blue': '#F0F8FF',
    'antique-white': '#FAEBD7',
    'blanched-almond': '#FFEBCD',
    'blue-violet': '#8A2BE2',
    'burly-wood': '#DEB887',
    'cadet-blue': '#5F9EA0',
    'cornflower-blue': '#6495ED',
    'dark-blue': '#00008B',
    'dark-cyan': '#008B8B',
    'dark-golden-rod': '#B8860B',
    'dark-gray': '#A9A9A9',
    'dark-green': '#006400',
    'dark-grey': '#A9A9A9',
    'dark-khaki': '#BDB76B',
    'dark-magenta': '#8B008B',
    'dark-olive-green': '#556B2F',
    'dark-orange': '#FF8C00',
    'dark-orchid': '#9932CC',
    'dark-red': '#8B0000',
    'dark-salmon': '#E9967A',
    'dark-sea-green': '#8FBC8F',
    'dark-slate-blue': '#483D8B',
    'dark-slate-gray': '#2F4F4F',
    'dark-slate-grey': '#2F4F4F',
    'dark-turquoise': '#00CED1',
    'dark-violet': '#9400D3',
    'deep-pink': '#FF1493',
    'deep-sky-blue': '#00BFFF',
    'dim-gray': '#696969',
    'dim-grey': '#696969',
    'dodger-blue': '#1E90FF',
    'fire-brick': '#B22222',
    'floral-white': '#FFFAF0',
    'forest-green': '#228B22',
    'ghost-white': '#F8F8FF',
    'golden-rod': '#DAA520',
    'green-yellow': '#ADFF2F',
    'honey-dew': '#F0FFF0',
    'hot-pink': '#FF69B4',
    'indian-red': '#CD5C5C',
    'lavender-blush': '#FFF0F5',
    'lawn-green': '#7CFC00',
    'lemon-chiffon': '#FFFACD',
    'light-blue': '#ADD8E6',
    'light-coral': '#F08080',
    'light-cyan': '#E0FFFF',
    'light-golden-rod-yellow': '#FAFAD2',
    'light-gray': '#D3D3D3',
    'light-green': '#90EE90',
    'light-grey': '#D3D3D3',
    'light-pink': '#FFB6C1',
    'light-salmon': '#FFA07A',
    'light-sea-green': '#20B2AA',
    'light-sky-blue': '#87CEFA',
    'light-slate-gray': '#778899',
    'light-slate-grey': '#778899',
    'light-steel-blue': '#B0C4DE',
    'light-yellow': '#FFFFE0',
    'lime-green': '#32CD32',
    'medium-aqua-marine': '#66CDAA',
    'medium-blue': '#0000CD',
    'medium-orchid': '#BA55D3',
    'medium-purple': '#9370DB',
    'medium-sea-green': '#3CB371',
    'medium-slate-blue': '#7B68EE',
    'medium-spring-green': '#00FA9A',
    'medium-turquoise': '#48D1CC',
    'medium-violet-red': '#C71585',
    'midnight-blue': '#191970',
    'mint-cream': '#F5FFFA',
    'misty-rose': '#FFE4E1',
    'navajo-white': '#FFDEAD',
    'old-lace': '#FDF5E6',
    'olive-drab': '#6B8E23',
    'orange-red': '#FF4500',
    'pale-golden-rod': '#EEE8AA',
    'pale-green': '#98FB98',
    'pale-turquoise': '#AFEEEE',
    'pale-violet-red': '#DB7093',
    'papaya-whip': '#FFEFD5',
    'peach-puff': '#FFDAB9',
    'powder-blue': '#B0E0E6',
    'rebecca-purple': '#663399',
    'rosy-brown': '#BC8F8F',
    'royal-blue': '#4169E1',
    'saddle-brown': '#8B4513',
    'sandy-brown': '#F4A460',
    'sea-green': '#2E8B57',
    'sea-shell': '#FFF5EE',
    'sky-blue': '#87CEEB',
    'slate-blue': '#6A5ACD',
    'slate-gray': '#708090',
    'slate-grey': '#708090',
    'spring-green': '#00FF7F',
    'steel-blue': '#4682B4',
    'white-smoke': '#F5F5F5',
    'yellow-green': '#9ACD32'
  }

  return colors[color] || null
}

// ! RecycleBin
