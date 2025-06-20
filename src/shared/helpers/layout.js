import _ from 'lodash'
import { processProperties, processComments, removeFractions } from './utils.js'

/**
 * Height property for UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function height(modifiersAndValues) {
  return processProperties({
    prop: 'height',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.ListItem, Ti.UI.View'
  }, {
    h: '{ height: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Width property for UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function width(modifiersAndValues) {
  return processProperties({
    prop: 'width',
    modules: 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.ListItem, Ti.UI.View'
  }, {
    w: '{ width: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Width and height properties for UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function widthHeight(modifiersAndValues) {
  return processProperties({
    prop: 'width and height',
    modules: 'Ti.UI.View, Ti.Blob, Ti.Media.VideoPlayer, MovieSize, Ti.UI.ActivityIndicator, Ti.UI.Android.CardView, Ti.UI.Android.DrawerLayout, Ti.UI.Android.SearchView, Ti.UI.Animation, Ti.UI.Button, Ti.UI.ButtonBar, Ti.UI.DashboardView, Dimension, DimensionWithAbsolutes, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ListView, Ti.UI.MaskedImage, Ti.UI.NavigationWindow, Ti.UI.OptionBar, Ti.UI.Picker, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.ScrollView, Ti.UI.ScrollableView, Ti.UI.SearchBar, Size, Ti.UI.Slider, Ti.UI.Switch, Ti.UI.TabbedBar, Ti.UI.TableView, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Toolbar, Ti.UI.WebView, Ti.UI.Window, openWindowParams, Ti.UI.iOS.BlurView, Ti.UI.iOS.CoverFlowView, CoverFlowImageType, Ti.UI.iOS.LivePhotoView, Ti.UI.iOS.SplitWindow, Ti.UI.iOS.Stepper, BarItemType, Ti.UI.iPad.Popover'
  }, {
    wh: '{ width: {value}, height: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Size property (width and height) for UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function size(modifiersAndValues) {
  return processProperties({
    prop: 'width and height',
    modules: 'Ti.UI.View, Ti.Blob, Ti.Media.VideoPlayer, MovieSize, Ti.UI.ActivityIndicator, Ti.UI.Android.CardView, Ti.UI.Android.DrawerLayout, Ti.UI.Android.SearchView, Ti.UI.Animation, Ti.UI.Button, Ti.UI.ButtonBar, Ti.UI.DashboardView, Dimension, DimensionWithAbsolutes, Ti.UI.ImageView, Ti.UI.Label, Ti.UI.ListView, Ti.UI.MaskedImage, Ti.UI.NavigationWindow, Ti.UI.OptionBar, Ti.UI.Picker, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.ScrollView, Ti.UI.ScrollableView, Ti.UI.SearchBar, Size, Ti.UI.Slider, Ti.UI.Switch, Ti.UI.TabbedBar, Ti.UI.TableView, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Toolbar, Ti.UI.WebView, Ti.UI.Window, openWindowParams, Ti.UI.iOS.BlurView, Ti.UI.iOS.CoverFlowView, CoverFlowImageType, Ti.UI.iOS.LivePhotoView, Ti.UI.iOS.SplitWindow, Ti.UI.iOS.Stepper, BarItemType, Ti.UI.iPad.Popover'
  }, {
    size: '{ width: {value}, height: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Margin properties for UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function margin(modifiersAndValues) {
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

/**
 * Padding properties for UI components
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function padding(modifiersAndValues) {
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

/**
 * Gap property for layout spacing
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function gap(modifiersAndValues) {
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

/**
 * Anchor point for transformations
 * @returns {string} Generated styles
 */
export function anchorPoint() {
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

  convertedStyles += '\n// anchor-point-{position} variant\n'
  _.each(objectPosition, (value, modifier) => {
    convertedStyles += `'.anchor-point-${modifier}': { anchorPoint: { ${value} } }\n`
  })

  return convertedStyles
}

/**
 * Placement/positioning properties
 * @returns {string} Generated styles
 */
export function placement() {
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

/**
 * Content height and width properties
 * @returns {string} Generated styles
 */
export function contentHeightAndWidth() {
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

/**
 * Display caps for text components
 * @returns {string} Generated styles
 */
export function displayCaps() {
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

/**
 * Layout constraints and sizing
 * @returns {string} Generated styles
 */
export function constraint() {
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

/**
 * Grid system layout
 * @returns {string} Generated styles
 */
export function gridSystem() {
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

/**
 * Grid flow properties
 * @returns {string} Generated styles
 */
export function gridFlow() {
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

/**
 * Grid columns, rows, start and end
 * @returns {string} Generated styles
 */
export function gridColumnsRowsStartEnd() {
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

/**
 * Items alignment
 * @returns {string} Generated styles
 */
export function items() {
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

/**
 * Alternative margin implementation
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */

export function horizontalMargin() {
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

export function verticalMargin() {
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

export function backgroundLeftCap(modifiersAndValues) {
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

export function backgroundPaddingBottom(modifiersAndValues) {
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

export function backgroundPaddingLeft(modifiersAndValues) {
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

export function backgroundPaddingRight(modifiersAndValues) {
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

export function backgroundPaddingTop(modifiersAndValues) {
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

export function backgroundTopCap(modifiersAndValues) {
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

export function processBorderRadius(modifiersAndValues) {
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

export function bottomNavigation(modifiersAndValues) {
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
  }, objectPosition, { android: modifiersAndValues }
  )
}

export function leftWidth(modifiersAndValues) {
  return processProperties({
    prop: 'leftWidth - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    'left-w': '{ leftWidth: {value} }'
  }, {
    android: modifiersAndValues
  })
}

export function rightWidth(modifiersAndValues) {
  return processProperties({
    prop: 'rightWidth - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    'right-w': '{ rightWidth: {value} }'
  }, {
    android: modifiersAndValues
  })
}

export function offsets(modifiersAndValues) {
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

export function sectionHeaderTopPadding(modifiersAndValues) {
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

export function separatorHeight(modifiersAndValues) {
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
export function marginAlternate(modifiersAndValues) {
  const objectPosition = {
    'space-x': '{ layout: \'horizontal\' }',
    'space-y': '{ layout: \'vertical\' }',
    '-space-x': '{ layout: \'horizontal\' }',
    '-space-y': '{ layout: \'vertical\' }'
  }

  return processProperties({
    prop: 'space between elements',
    modules: 'Ti.UI.View'
  }, objectPosition, { default: modifiersAndValues })
}
