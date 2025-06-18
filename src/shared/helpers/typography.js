import _ from 'lodash'
import { processProperties, fixInvalidValues, processComments } from './utils.js'
import { globalOptions } from './core.js'

/**
 * Remove fractions from modifiers and values
 * @param {Object} modifiersAndValues - Original modifiers and values
 * @param {Array} extras - Extra keys to remove
 * @returns {Object} Cleaned modifiers and values
 */
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

/**
 * Font family property for text components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function fontFamily(modifiersAndValues) {
  return processProperties({
    prop: 'fontFamily',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Button, Ti.UI.Label, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.PickerColumn, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    font: '{ font: { fontFamily: {value} } }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Font size property for text components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function fontSize(modifiersAndValues) {
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

/**
 * Font weight property for text components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function fontWeight(modifiersAndValues) {
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

/**
 * Font style property for text components
 * @returns {string} Generated styles
 */
export function fontStyle() {
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

/**
 * Text ellipsize property for text truncation
 * @returns {string} Generated styles
 */
export function ellipsize() {
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

  // for TextArea and TextField
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

/**
 * Minimum font size property
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function minimumFontSize(modifiersAndValues) {
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

/**
 * Lines property for text components (Android only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function lines(modifiersAndValues) {
  const cleanValues = removeFractions(modifiersAndValues, ['0'])

  return processProperties({
    prop: 'lines - Android Only',
    modules: 'Ti.UI.Label, Ti.UI.TextArea'
  }, {
    lines: '{ lines: {value} }'
  }, {
    android: cleanValues
  })
}

/**
 * Maximum lines property for text components (Android only)
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function maxLines(modifiersAndValues) {
  const cleanValues = removeFractions(modifiersAndValues, ['0'])

  return processProperties({
    prop: 'maxLines - Android Only',
    modules: 'Ti.UI.Label, Ti.UI.TextArea'
  }, {
    'max-lines': '{ maxLines: {value} }'
  }, {
    android: cleanValues
  })
}

/**
 * Include font padding property (Android only)
 * @returns {string} Generated styles
 */

export function hidesBarsOnTap() {
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

export function hidesBarsWhenKeyboardAppears() {
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

export function titleAttributesShadow() {
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

export function includeFontPadding() {
  return processProperties({
    prop: 'includeFontPadding - Android Only',
    modules: 'Ti.UI.Label, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ includeFontPadding: {value} }'
  }, {
    android: {
      'include-font-padding': true,
      'exclude-font-padding': false
    }
  })
}
