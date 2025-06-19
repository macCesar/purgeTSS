import _ from 'lodash'
import { processProperties, processComments, parseValue, setModifier2, removeLastDash, addTransparencyToValue } from './utils.js'
const globalOptions = {
  legacy: false
}
/**
 * Active tint color for tabs
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function activeTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'activeTintColor',
    modules: 'Ti.UI.Tab, Ti.UI.TabGroup'
  }, {
    'active-tint': '{ activeTintColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Active title color for tabs
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function activeTitleColor(modifiersAndValues) {
  return processProperties({
    prop: 'activeTitleColor',
    modules: 'Ti.UI.Tab, Ti.UI.TabGroup'
  }, {
    'active-title': '{ activeTitleColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Background color for various UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function backgroundColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundColor',
    modules: 'Ti.UI, Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.Tab, Ti.UI.TableView, Ti.UI.View, Ti.UI.Window'
  }, {
    bg: '{ backgroundColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Background disabled color (Android only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function backgroundDisabledColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundDisabledColor - Android Only',
    modules: 'Ti.UI.View'
  }, {
    'bg-disabled': '{ backgroundDisabledColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}

/**
 * Background focused color (Android only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function backgroundFocusedColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundFocusedColor - Android Only',
    modules: 'Ti.UI.Tab, Ti.UI.View'
  }, {
    'bg-focused': '{ backgroundFocusedColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}

/**
 * Background selected color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function backgroundSelectedColor(modifiersAndValues) {
  return processProperties({
    prop: 'backgroundSelectedColor',
    modules: 'Ti.UI.Button, Ti.UI.ListItem, Ti.UI.TableViewRow, Ti.UI.View'
  }, {
    'bg-selected': '{ backgroundSelectedColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Badge color for tabs
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function badgeColor(modifiersAndValues) {
  return processProperties({
    prop: 'badgeColor',
    modules: 'Ti.UI.Tab'
  }, {
    badge: '{ badgeColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Bar color for various UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function barColor(modifiersAndValues) {
  return processProperties({
    prop: 'barColor',
    modules: 'Ti.UI.EmailDialog, Ti.UI.SearchBar, Ti.UI.TabGroup, Ti.UI.Toolbar, Ti.UI.Window'
  }, {
    bar: '{ barColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Border color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function borderColor(modifiersAndValues) {
  return processProperties({
    prop: 'borderColor',
    modules: 'Ti.UI.View'
  }, {
    border: '{ borderColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Current page indicator color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function currentPageIndicatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'currentPageIndicatorColor - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'current-page-indicator': '{ currentPageIndicatorColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

/**
 * DateTime color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function dateTimeColor(modifiersAndValues) {
  return processProperties({
    prop: 'dateTimeColor - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    'datetime-color': '{ dateTimeColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}

/**
 * Disabled color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function disabledColor(modifiersAndValues) {
  return processProperties({
    prop: 'disabledColor',
    modules: 'Ti.UI.Button'
  }, {
    disabled: '{ disabledColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Shadow color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function shadowColor(modifiersAndValues) {
  return processProperties({
    prop: 'shadowColor',
    modules: 'Ti.UI.Button, Ti.UI.Label'
  }, {
    shadow: '{ shadowColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Highlighted color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function highlightedColor(modifiersAndValues) {
  return processProperties({
    prop: 'highlightedColor',
    modules: 'Ti.UI.Button, Ti.UI.Label'
  }, {
    highlighted: '{ highlightedColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Hint text color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function hintTextColor(modifiersAndValues) {
  return processProperties({
    prop: 'hintTextColor',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'hint-text': '{ hintTextColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Image touch feedback color (Android only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function imageTouchFeedbackColor(modifiersAndValues) {
  return processProperties({
    prop: 'imageTouchFeedbackColor - Android Only',
    modules: 'Ti.UI.ImageView'
  }, {
    'image-touch-feedback': '{ imageTouchFeedbackColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}

/**
 * Indicator color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function indicatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'indicatorColor',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.ScrollableView'
  }, {
    indicator: '{ indicatorColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Keyboard toolbar color (iOS only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function keyboardToolbarColor(modifiersAndValues) {
  return processProperties({
    prop: 'keyboardToolbarColor - iOS Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'keyboard-toolbar': '{ keyboardToolbarColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

/**
 * Navigation tint color (iOS only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function navTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'navTintColor - iOS Only',
    modules: 'Ti.UI.NavigationWindow, Ti.UI.Window'
  }, {
    'nav-tint': '{ navTintColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

/**
 * On tint color (iOS only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function onTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'onTintColor - iOS Only',
    modules: 'Ti.UI.Switch'
  }, {
    'on-tint': '{ onTintColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

/**
 * Page indicator color (iOS only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function pageIndicatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'pageIndicatorColor - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'page-indicator': '{ pageIndicatorColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

/**
 * Paging control color (iOS only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function pagingControlColor(modifiersAndValues) {
  return processProperties({
    prop: 'pagingControlColor - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control': '{ pagingControlColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

/**
 * Text color for various UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function textColor(modifiersAndValues) {
  return processProperties({
    prop: 'color',
    modules: 'Ti.UI.Button, Ti.UI.Label, Ti.UI.PickerRow, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.ListItem, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextField, Ti.UI.Android.SearchView'
  }, {
    text: '{ color: {value}, textColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Thumb tint color (iOS only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function thumbTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'thumbTintColor - iOS Only',
    modules: 'Ti.UI.Switch'
  }, {
    'thumb-tint': '{ thumbTintColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

/**
 * Tint color for various UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function tintColor(modifiersAndValues) {
  return processProperties({
    prop: 'tintColor',
    modules: 'Ti.UI.View, Ti.Media.VideoPlayer, Ti.UI.AlertDialog, Ti.UI.Button, Ti.UI.ButtonBar, Ti.UI.DashboardView, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ListView, Ti.UI.MaskedImage, Ti.UI.NavigationWindow, Ti.UI.OptionBar, Ti.UI.OptionDialog, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.RefreshControl, Ti.UI.ScrollView, Ti.UI.ScrollableView, Ti.UI.SearchBar, Ti.UI.Slider, Ti.UI.Switch, Ti.UI.Tab, Ti.UI.TabGroup, Ti.UI.TabbedBar, Ti.UI.TableView, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Toolbar, Ti.UI, Ti.UI.WebView, Ti.UI.Window, windowToolbarParam, Ti.UI.iOS.BlurView, Ti.UI.iOS.CoverFlowView, Ti.UI.iOS.LivePhotoView, Ti.UI.iOS.SplitWindow, Ti.UI.iOS.Stepper'
  }, {
    'tint-color': '{ tintColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Title attributes color (iOS only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function titleAttributesColor(modifiersAndValues) {
  return processProperties({
    prop: 'titleAttributes: color - iOS Only',
    modules: 'Ti.UI.TabGroup, Ti.UI.Window'
  }, {
    'title-attributes': '{ titleAttributes: { color: {value} } }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Title attributes shadow color (iOS only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function titleAttributesShadowColor(modifiersAndValues) {
  return processProperties({
    prop: 'titleAttributes: shadow - iOS Only',
    modules: 'Ti.UI.TabGroup, Ti.UI.Window'
  }, {
    'title-attributes-shadow': '{ titleAttributes: { shadow: { color: {value} } } }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Title color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function titleColor(modifiersAndValues) {
  return processProperties({
    prop: 'titleColor',
    modules: 'Ti.UI.Button, Ti.UI.Tab'
  }, {
    title: '{ titleColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Title text color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function titleTextColor(modifiersAndValues) {
  return processProperties({
    prop: 'titleTextColor - Android Only',
    modules: 'Ti.UI.SearchBar'
  }, {
    'title-text': '{ titleTextColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}

/**
 * Touch feedback color (Android only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function touchFeedbackColor(modifiersAndValues) {
  return processProperties({
    prop: 'touchFeedbackColor - Android Only',
    modules: 'Ti.UI.View'
  }, {
    'touch-feedback': '{ touchFeedbackColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}

/**
 * Track tint color (iOS only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function trackTintColor(modifiersAndValues) {
  return processProperties({
    prop: 'trackTintColor - iOS Only',
    modules: 'Ti.UI.Switch'
  }, {
    'track-tint': '{ trackTintColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

/**
 * View shadow color
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function viewShadowColor(modifiersAndValues) {
  return processProperties({
    prop: 'viewShadowColor',
    modules: 'Ti.UI.View'
  }, {
    'view-shadow': '{ viewShadowColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

// Additional missing color functions
export function pullBackgroundColor(modifiersAndValues) {
  return processProperties({
    prop: 'pullBackgroundColor - iOS Only',
    modules: 'Ti.UI.RefreshControl'
  }, {
    'pull-bg': '{ pullBackgroundColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function resultsBackgroundColor(modifiersAndValues) {
  return processProperties({
    prop: 'resultsBackgroundColor - iOS Only',
    modules: 'Ti.UI.SearchBar'
  }, {
    'results-bg': '{ resultsBackgroundColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function resultsSeparatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'resultsSeparatorColor - iOS Only',
    modules: 'Ti.UI.SearchBar'
  }, {
    'results-separator': '{ resultsSeparatorColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function selectedButtonColor(modifiersAndValues) {
  return processProperties({
    prop: 'selectedButtonColor',
    modules: 'Ti.UI.ButtonBar, Ti.UI.TabbedBar'
  }, {
    'selected-button': '{ selectedButtonColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

export function selectedColor(modifiersAndValues) {
  return processProperties({
    prop: 'selectedColor',
    modules: 'Ti.UI.ListItem, Ti.UI.PickerRow, Ti.UI.TableViewRow'
  }, {
    selected: '{ selectedColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

export function selectedSubtitleColor(modifiersAndValues) {
  return processProperties({
    prop: 'selectedSubtitleColor - iOS Only',
    modules: 'Ti.UI.ListItem'
  }, {
    'selected-subtitle': '{ selectedSubtitleColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function selectedTextColor(modifiersAndValues) {
  return processProperties({
    prop: 'selectedTextColor - iOS Only',
    modules: 'Ti.UI.ListItem'
  }, {
    'selected-text': '{ selectedTextColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function separatorColor(modifiersAndValues) {
  return processProperties({
    prop: 'separatorColor',
    modules: 'Ti.UI.ListView'
  }, {
    separator: '{ separatorColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

export function subtitleColor(modifiersAndValues) {
  return processProperties({
    prop: 'subtitleColor - iOS Only',
    modules: 'Ti.UI.ListItem'
  }, {
    subtitle: '{ subtitleColor: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function tabsBackgroundColor(modifiersAndValues) {
  return processProperties({
    prop: 'tabsBackgroundColor',
    modules: 'Ti.UI.TabGroup'
  }, {
    'tabs-bg': '{ tabsBackgroundColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}

export function tabsBackgroundSelectedColor(modifiersAndValues) {
  return processProperties({
    prop: 'tabsBackgroundSelectedColor - Android Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    'tabs-bg-selected': '{ tabsBackgroundSelectedColor: {value} }'
  }, {
    android: modifiersAndValues
  })
}

// Gradient functions
export function backgroundGradient(modifiersAndValues) {
  let convertedStyles = processComments({
    prop: 'backgroundGradient: colors - From Color',
    modules: 'Ti.UI.ListItem, Ti.UI.View'
  })

  let objectPosition = { from: '{ backgroundGradient: { colors: [ {transparentValue}, {value} ] } }' }

  _.each(objectPosition, (properties, rule) => {
    _.each(modifiersAndValues, (value, modifier) => {
      if (typeof value === 'object') {
        _.each(value, (_value, _modifier) => {
          convertedStyles += `'.${removeLastDash(`${rule}-${setModifier2(modifier, rule)}${setModifier2(_modifier)}`)}': ` + _.replace(_.replace(properties, /{transparentValue}/g, `${addTransparencyToValue(parseValue(_value))}`), /{value}/g, parseValue(_value)) + '\n'
        })
      } else {
        convertedStyles += `'.${setModifier2(rule, modifier)}${setModifier2(modifier)}': ` + _.replace(_.replace(properties, /{value}/g, parseValue(value)), /{transparentValue}/g, `${addTransparencyToValue(parseValue(value))}`) + '\n'
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
          convertedStyles += `'.${removeLastDash(`${rule}-${setModifier2(modifier, rule)}${setModifier2(_modifier)}`)}': ` + _.replace(properties, /{value}/g, parseValue(_value)) + '\n'
        })
      } else {
        convertedStyles += `'.${setModifier2(rule, modifier)}${setModifier2(modifier)}': ` + _.replace(properties, /{value}/g, parseValue(value)) + '\n'
      }
    })
  })

  return convertedStyles
}

export function backgroundSelectedGradient(modifiersAndValues) {
  let convertedStyles = processComments({
    prop: 'backgroundSelectedGradient: colors - From Color - iOS Only',
    modules: 'Ti.UI.ListItem, Ti.UI.View'
  })

  let objectPosition = { 'bg-selected-from': '{ backgroundSelectedGradient: { colors: [ {transparentValue}, {value} ] } }' }

  _.each(objectPosition, (properties, rule) => {
    _.each(modifiersAndValues, (value, modifier) => {
      if (typeof value === 'object') {
        _.each(value, (_value, _modifier) => {
          convertedStyles += `'.${removeLastDash(`${rule}-${setModifier2(modifier, rule)}${setModifier2(_modifier)}`)}': ` + _.replace(_.replace(properties, /{transparentValue}/g, `${addTransparencyToValue(parseValue(_value))}`), /{value}/g, parseValue(_value)) + '\n'
        })
      } else {
        convertedStyles += `'.${setModifier2(rule, modifier)}${setModifier2(modifier)}': ` + _.replace(_.replace(properties, /{value}/g, parseValue(value)), /{transparentValue}/g, `${addTransparencyToValue(parseValue(value))}`) + '\n'
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
          convertedStyles += `'.${removeLastDash(`${rule}-${setModifier2(modifier, rule)}${setModifier2(_modifier)}`)}': ` + _.replace(properties, /{value}/g, parseValue(_value)) + '\n'
        })
      } else {
        convertedStyles += `'.${setModifier2(rule, modifier)}${setModifier2(modifier)}': ` + _.replace(properties, /{value}/g, parseValue(value)) + '\n'
      }
    })
  })

  return convertedStyles
}

export function placeholder(modifiersAndValues) {
  return processProperties({
    prop: 'hintTextColor ( Alternative )',
    modules: 'Ti.UI.Android.SearchView, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    placeholder: '{ hintTextColor: {value} }'
  }, {
    default: modifiersAndValues
  })
}
