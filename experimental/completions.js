'use_strick'

const fs = require('fs')
const cwd = process.cwd()
const _ = require('lodash')
const path = require('path')
const chalk = require('chalk')
const colores = require('../lib/colores').colores
const isInstalledGlobally = require('is-installed-globally')
module.exports.colores = colores
const purgeLabel = colores.purgeLabel

const projectConfigJS = cwd + '/purgetss/config.js'

const logger = {
  info: function (...args) {
    console.log(purgeLabel, args.join(' '))
  },
  warn: function (...args) {
    console.log(purgeLabel, chalk.yellow(args.join(' ')))
  },
  error: function (...args) {
    console.log(purgeLabel, chalk.red(args.join(' ')))
  },
  file: function (...args) {
    console.log(purgeLabel, chalk.yellow(args.join(' ')), 'file created!')
  }
}

const helpers = require('../lib/helpers')
const tiCompletionsFile = require('../lib/completions/titanium/completions-v3.json')
// const alloyCompletionsFile = require('../lib/completions/alloy/completions-v3.json');
const srcConfigFile = path.resolve(__dirname, '../lib/templates/purgetss.config.js')

const configFile = (fs.existsSync(projectConfigJS)) ? require(projectConfigJS) : require(srcConfigFile)
configFile.corePlugins = configFile.corePlugins ?? {}
configFile.purge = configFile.purge ?? { mode: 'all' }
configFile.theme.extend = configFile.theme.extend ?? {}
configFile.fonts = configFile.fonts ?? { mode: 'fileName' }

const configOptions = (configFile.purge && configFile.purge.options) ? configFile.purge.options : false
if (configOptions) {
  configOptions.widgets = configOptions.widgets ?? false
  configOptions.missing = configOptions.missing ?? false
}

completions()

function completions (message = 'file created!') {
  const allValuesCombined = combineDefaultThemeWithConfigFile()

  if (fs.existsSync(projectConfigJS)) {
    fs.writeFileSync(cwd + '/purgetss/tailwind-auto.tss', createPurgeTi(allValuesCombined))
    logger.info(chalk.yellow('./purgetss/tailwind.tss'), message)
  } else {
    fs.writeFileSync(path.resolve(__dirname, '../dist/tailwind-auto.tss'), createPurgeTi(allValuesCombined))
    logger.info(chalk.yellow('./dist/tailwind-auto.tss'), message)
  }
}
exports.completions = completions

function combineDefaultThemeWithConfigFile () {
  const defaultColors = require('tailwindcss/colors')
  const defaultTheme = require('tailwindcss/defaultTheme')
  const defaultThemeWidth = defaultTheme.width({ theme: () => (defaultTheme.spacing) })
  const defaultThemeHeight = defaultTheme.height({ theme: () => (defaultTheme.spacing) })

  removeDeprecatedColors(defaultColors)

  // !Prepare values
  const tiResets = { full: '100%' }

  const allWidthsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth }
  const allHeightsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeHeight }
  const allSpacingCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth, ...defaultThemeHeight }

  const themeOrDefaultValues = {
    width: configFile.theme.width ?? allWidthsCombined,
    height: configFile.theme.height ?? allHeightsCombined,
    spacing: configFile.theme.spacing ?? allSpacingCombined,
    colors: configFile.theme.colors ?? { transparent: 'transparent', ...defaultColors }
  }

  removeUnnecesaryValues(themeOrDefaultValues)

  const base = {
    colors: {},
    spacing: {},
    width: {},
    height: {},
    rotate: defaultTheme.rotate,
    zIndex: defaultTheme.zIndex,
    opacity: defaultTheme.opacity,
    fontSize: defaultTheme.fontSize,
    fontWeight: defaultTheme.fontWeight,
    borderWidth: defaultTheme.borderWidth,
    scale: { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale },
    columns: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
    delay: { 0: '0ms', 25: '25ms', 50: '50ms', 250: '250ms', 350: '350ms', 400: '400ms', 450: '450ms', 600: '600ms', 800: '800ms', 900: '900ms', 2000: '2000ms', 3000: '3000ms', 4000: '4000ms', 5000: '5000ms' }
  }

  _.merge(base.colors, themeOrDefaultValues.colors, configFile.theme.extend.colors)
  _.merge(base.spacing, themeOrDefaultValues.spacing, configFile.theme.extend.spacing)
  _.merge(base.width, themeOrDefaultValues.spacing, configFile.theme.extend.spacing, themeOrDefaultValues.width, configFile.theme.extend.width)
  _.merge(base.height, themeOrDefaultValues.spacing, configFile.theme.extend.spacing, themeOrDefaultValues.height, configFile.theme.extend.height)

  fixPercentages(base.width)
  fixPercentages(base.height)
  fixPercentages(base.spacing)

  // ! Extras...
  base.transitionDelay = { ...base.delay, ...defaultTheme.transitionDelay }
  base.transitionDuration = { ...base.delay, ...defaultTheme.transitionDuration }
  base.borderRadius = helpers.integersInHalf(helpers.removeFractions((configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, ['full', 'auto', 'screen']))

  const configThemeFile = {}
  // ! Process custom Window, View and ImageView
  configThemeFile.Window = (configFile.theme.Window && configFile.theme.Window.apply)
    ? _.merge({ apply: configFile.theme.Window.apply }, configFile.theme.Window)
    : _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window)

  configThemeFile.ImageView = (configFile.theme.ImageView && configFile.theme.ImageView.apply)
    ? _.merge({ apply: configFile.theme.ImageView.apply }, { ios: { hires: true } }, configFile.theme.ImageView)
    : _.merge({ ios: { hires: true } }, configFile.theme.ImageView)

  configThemeFile.View = (configFile.theme.View && configFile.theme.View.apply)
    ? _.merge({ apply: configFile.theme.View.apply }, configFile.theme.View)
    : _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View)

  return mergeWithConfigFile(configThemeFile, base, configFile, defaultTheme)
}

function mergeWithConfigFile (configThemeFile, base, _configFile, defaultTheme) {
  const defaultBorderRadius = helpers.integersInHalf(helpers.removeFractions((_configFile.theme.spacing || _configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, ['full', 'auto', 'screen']))

  // ! Width, height and margin properties
  configThemeFile.height = base.height
  configThemeFile.width = base.width
  configThemeFile.colors = base.colors
  configThemeFile.delay = base.delay
  configThemeFile.columns = base.columns

  configThemeFile.spacing = helpers.removeFractions(base.spacing, ['full', 'auto', 'screen'])

  configThemeFile.margin = combineKeys(_configFile.theme, base.spacing, 'margin')
  delete configThemeFile.margin.screen

  configThemeFile.margin.auto = 'null'
  configThemeFile.elevation = combineKeys(_configFile.theme, base.spacing, 'elevation')
  configThemeFile.marginAlternate = combineKeys(_configFile.theme, base.spacing, 'margin')

  // ! Properties with constant values
  configThemeFile.constantProperties = {}
  // configThemeFile.audioStreamType = {};
  // configThemeFile.category = {};
  configThemeFile.accessibilityHidden = {}
  configThemeFile.accessoryType = {}
  configThemeFile.activeIconIsMask = {}
  configThemeFile.activityEnterTransition = {}
  configThemeFile.activityExitTransition = {}
  configThemeFile.activityIndicatorStyle = {}
  configThemeFile.activityReenterTransition = {}
  configThemeFile.activityReturnTransition = {}
  configThemeFile.activitySharedElementEnterTransition = {}
  configThemeFile.activitySharedElementExitTransition = {}
  configThemeFile.activitySharedElementReenterTransition = {}
  configThemeFile.activitySharedElementReturnTransition = {}
  configThemeFile.alertDialogStyle = {}
  configThemeFile.allowsBackForwardNavigationGestures = {}
  configThemeFile.allowsLinkPreview = {}
  configThemeFile.allowsMultipleSelectionDuringEditing = {}
  configThemeFile.allowsMultipleSelectionInteraction = {}
  configThemeFile.allowsSelection = {}
  configThemeFile.allowsSelectionDuringEditing = {}
  configThemeFile.allowUserCustomization = {}
  configThemeFile.anchorPoint = {}
  configThemeFile.autoAdjustScrollViewInsets = {}
  configThemeFile.autocapitalization = {}
  configThemeFile.autocorrect = {}
  configThemeFile.autofillType = {}
  configThemeFile.autoLink = {}
  configThemeFile.autoreverse = {}
  configThemeFile.autorotate = {}
  configThemeFile.backgroundBlendMode = {}
  configThemeFile.backgroundLinearGradient = {}
  configThemeFile.backgroundRadialGradient = {}
  configThemeFile.backgroundRepeat = {}
  configThemeFile.borderStyle = {}
  configThemeFile.bubbleParent = {}
  configThemeFile.buttonStyle = {}
  configThemeFile.cacheMode = {}
  configThemeFile.cachePolicy = {}
  configThemeFile.calendarViewShown = {}
  configThemeFile.canCancelEvents = {}
  configThemeFile.cancelable = {}
  configThemeFile.canceledOnTouchOutside = {}
  configThemeFile.canDelete = {}
  configThemeFile.canEdit = {}
  configThemeFile.canInsert = {}
  configThemeFile.canMove = {}
  configThemeFile.canScroll = {}
  configThemeFile.caseInsensitiveSearch = {}
  configThemeFile.checkable = {}
  configThemeFile.clearButtonMode = {}
  configThemeFile.clearOnEdit = {}
  configThemeFile.clipMode = {}
  configThemeFile.constraint = {}
  configThemeFile.contentHeightAndWidth = {}
  configThemeFile.curve = {}
  configThemeFile.datePickerStyle = {}
  configThemeFile.defaultItemTemplate = {}
  configThemeFile.dimBackgroundForSearch = {}
  configThemeFile.disableBounce = {}
  configThemeFile.disableContextMenu = {}
  configThemeFile.displayCaps = {}
  configThemeFile.displayHomeAsUp = {}
  configThemeFile.draggingType = {}
  configThemeFile.drawerIndicatorEnabled = {}
  configThemeFile.drawerLockMode = {}
  configThemeFile.dropShadow = {}
  configThemeFile.duration = {}
  configThemeFile.editable = {}
  configThemeFile.editing = {}
  configThemeFile.ellipsize = {}
  configThemeFile.enableCopy = {}
  configThemeFile.enabled = {}
  configThemeFile.enableJavascriptInterface = {}
  configThemeFile.enableReturnKey = {}
  configThemeFile.enableZoomControls = {}
  configThemeFile.exitOnClose = {}
  configThemeFile.extendBackground = {}
  configThemeFile.extendEdges = {}
  configThemeFile.extendSafeArea = {}
  configThemeFile.fastScroll = {}
  configThemeFile.filterAnchored = {}
  configThemeFile.filterAttribute = {}
  configThemeFile.filterCaseInsensitive = {}
  configThemeFile.filterTouchesWhenObscured = {}
  configThemeFile.flags = {}
  configThemeFile.flagSecure = {}
  configThemeFile.flip = {}
  configThemeFile.focusable = {}
  configThemeFile.fontStyle = {}
  configThemeFile.footerDividersEnabled = {}
  configThemeFile.format24 = {}
  configThemeFile.fullscreen = {}
  configThemeFile.gravity = {}
  configThemeFile.gridColumnsRowsStartEnd = {}
  configThemeFile.gridFlow = {}
  configThemeFile.gridSystem = {}
  configThemeFile.hasCheck = {}
  configThemeFile.hasChild = {}
  configThemeFile.hasDetail = {}
  configThemeFile.headerDividersEnabled = {}
  configThemeFile.hiddenBehavior = {}
  configThemeFile.hideLoadIndicator = {}
  configThemeFile.hidesBackButton = {}
  configThemeFile.hidesBarsOnSwipe = {}
  configThemeFile.hidesBarsOnTap = {}
  configThemeFile.hidesBarsWhenKeyboardAppears = {}
  configThemeFile.hideSearchOnSelection = {}
  configThemeFile.hideShadow = {}
  configThemeFile.hidesSearchBarWhenScrolling = {}
  configThemeFile.hintType = {}
  configThemeFile.hires = {}
  configThemeFile.homeButtonEnabled = {}
  configThemeFile.homeIndicatorAutoHidden = {}
  configThemeFile.horizontalMargin = { left: '-0.5', right: '0.5', center: '0' }
  configThemeFile.html = {}
  configThemeFile.icon = {}
  configThemeFile.iconified = {}
  configThemeFile.iconifiedByDefault = {}
  configThemeFile.iconIsMask = {}
  configThemeFile.ignoreSslError = {}
  configThemeFile.imageTouchFeedback = {}
  configThemeFile.includeFontPadding = {}
  configThemeFile.includeOpaqueBars = {}
  configThemeFile.inputType = {}
  configThemeFile.items = {}
  configThemeFile.keepScreenOn = {}
  configThemeFile.keepSectionsInSearch = {}
  configThemeFile.keyboardAppearance = {}
  configThemeFile.keyboardDismissMode = {}
  configThemeFile.keyboardDisplayRequiresUserAction = {}
  configThemeFile.keyboardType = {}
  configThemeFile.largeTitleDisplayMode = {}
  configThemeFile.largeTitleEnabled = {}
  configThemeFile.layout = {}
  configThemeFile.lazyLoadingEnabled = {}
  configThemeFile.leftButtonMode = {}
  configThemeFile.leftDrawerLockMode = {}
  configThemeFile.lightTouchEnabled = {}
  configThemeFile.listViewStyle = {}
  configThemeFile.location = {}
  configThemeFile.loginKeyboardType = {}
  configThemeFile.loginReturnKeyType = {}
  configThemeFile.mixedContentMode = {}
  configThemeFile.modal = {}
  configThemeFile.moveable = {}
  configThemeFile.moving = {}
  configThemeFile.nativeSpinner = {}
  configThemeFile.navBarHidden = {}
  configThemeFile.navigationMode = {}
  configThemeFile.orientationModes = {}
  configThemeFile.overlayEnabled = {}
  configThemeFile.overrideCurrentAnimation = {}
  configThemeFile.overScrollMode = {}
  configThemeFile.pagingControlOnTop = {}
  configThemeFile.passwordKeyboardType = {}
  configThemeFile.passwordMask = {}
  configThemeFile.pickerType = {}
  configThemeFile.placement = {}
  configThemeFile.pluginState = {}
  configThemeFile.preventCornerOverlap = {}
  configThemeFile.preventDefaultImage = {}
  configThemeFile.previewActionStyle = {}
  configThemeFile.progressBarStyle = {}
  configThemeFile.progressIndicatorType = {}
  configThemeFile.pruneSectionsOnEdit = {}
  configThemeFile.requestedOrientation = {}
  configThemeFile.resultsSeparatorStyle = {}
  configThemeFile.returnKeyType = {}
  configThemeFile.reverse = {}
  configThemeFile.rightButtonMode = {}
  configThemeFile.rightDrawerLockMode = {}
  configThemeFile.scalesPageToFit = {}
  configThemeFile.scrollable = {}
  configThemeFile.scrollIndicators = {}
  configThemeFile.scrollIndicatorStyle = {}
  configThemeFile.scrollingEnabled = {}
  configThemeFile.scrollsToTop = {}
  configThemeFile.scrollType = {}
  configThemeFile.searchAsChild = {}
  configThemeFile.searchBarStyle = {}
  configThemeFile.searchHidden = {}
  configThemeFile.selectionGranularity = {}
  configThemeFile.selectionOpens = {}
  configThemeFile.selectionStyle = {}
  configThemeFile.separatorStyle = {}
  configThemeFile.shiftMode = {}
  configThemeFile.showAsAction = {}
  configThemeFile.showBookmark = {}
  configThemeFile.showCancel = {}
  configThemeFile.showHorizontalScrollIndicator = {}
  configThemeFile.showPagingControl = {}
  configThemeFile.showSearchBarInNavBar = {}
  configThemeFile.showSelectionCheck = {}
  configThemeFile.showUndoRedoActions = {}
  configThemeFile.showVerticalScrollIndicator = {}
  configThemeFile.smoothScrollOnTabClick = {}
  configThemeFile.statusBarStyle = {}
  configThemeFile.submitEnabled = {}
  configThemeFile.suppressReturn = {}
  configThemeFile.sustainedPerformanceMode = {}
  configThemeFile.swipeToClose = {}
  configThemeFile.switchStyle = {}
  configThemeFile.systemButton = {}
  configThemeFile.tabBarHidden = {}
  configThemeFile.tabbedBarStyle = {}
  configThemeFile.tabGroupStyle = {}
  configThemeFile.tableViewStyle = {}
  configThemeFile.tabsTranslucent = {}
  configThemeFile.textAlign = {}
  configThemeFile.theme = {}
  configThemeFile.tiMedia = {}
  configThemeFile.titleAttributesShadow = {}
  configThemeFile.toolbarEnabled = {}
  configThemeFile.touchEnabled = {}
  configThemeFile.touchFeedback = {}
  configThemeFile.transition = {}
  configThemeFile.translucent = {}
  configThemeFile.useCompatPadding = {}
  configThemeFile.useSpinner = {}
  configThemeFile.verticalAlign = {}
  configThemeFile.verticalBounce = {}
  configThemeFile.verticalMargin = {}
  configThemeFile.viewShadow = {}
  configThemeFile.visible = {}
  // configThemeFile.willHandleTouches = {};
  configThemeFile.willScrollOnStatusTap = {}
  configThemeFile.windowPixelFormat = {}
  configThemeFile.windowSoftInputMode = {}
  configThemeFile.wobble = {}

  // ! Configurable properties
  configThemeFile.configurableProperties = {}
  configThemeFile.activeTab = combineKeys(_configFile.theme, base.columns, 'activeTab')
  configThemeFile.backgroundLeftCap = combineKeys(_configFile.theme, base.spacing, 'backgroundLeftCap')
  configThemeFile.backgroundPaddingBottom = combineKeys(_configFile.theme, base.height, 'backgroundPaddingBottom')
  configThemeFile.backgroundPaddingLeft = combineKeys(_configFile.theme, base.spacing, 'backgroundPaddingLeft')
  configThemeFile.backgroundPaddingRight = combineKeys(_configFile.theme, base.spacing, 'backgroundPaddingRight')
  configThemeFile.backgroundPaddingTop = combineKeys(_configFile.theme, base.height, 'backgroundPaddingTop')
  configThemeFile.backgroundTopCap = combineKeys(_configFile.theme, base.spacing, 'backgroundTopCap')
  configThemeFile.borderRadius = combineKeys(_configFile.theme, defaultBorderRadius, 'borderRadius')
  configThemeFile.borderWidth = combineKeys(_configFile.theme, base.borderWidth, 'borderWidth')
  configThemeFile.bottomNavigation = combineKeys(_configFile.theme, base.spacing, 'bottomNavigation')
  configThemeFile.cacheSize = combineKeys(_configFile.theme, base.columns, 'cacheSize')
  configThemeFile.columnCount = combineKeys(_configFile.theme, base.columns, 'columnCount')
  configThemeFile.contentHeight = combineKeys(_configFile.theme, base.height, 'contentHeight')
  configThemeFile.contentWidth = combineKeys(_configFile.theme, base.width, 'contentWidth')
  configThemeFile.countDownDuration = combineKeys(_configFile.theme, base.transitionDuration, 'countDownDuration')
  configThemeFile.elevation = combineKeys(_configFile.theme, base.spacing, 'elevation')
  configThemeFile.fontFamily = combineKeys(_configFile.theme, {}, 'fontFamily')
  configThemeFile.fontSize = combineKeys(_configFile.theme, base.fontSize, 'fontSize')
  configThemeFile.fontWeight = combineKeys(_configFile.theme, base.fontWeight, 'fontWeight')
  configThemeFile.gap = combineKeys(_configFile.theme, base.spacing, 'margin')
  configThemeFile.indentionLevel = combineKeys(_configFile.theme, base.spacing, 'indentionLevel')
  configThemeFile.keyboardToolbarHeight = combineKeys(_configFile.theme, base.height, 'keyboardToolbarHeight')
  configThemeFile.leftButtonPadding = combineKeys(_configFile.theme, base.spacing, 'leftButtonPadding')
  configThemeFile.leftWidth = combineKeys(_configFile.theme, base.width, 'leftWidth')
  configThemeFile.lines = combineKeys(_configFile.theme, base.columns, 'lines')
  configThemeFile.maxElevation = combineKeys(_configFile.theme, base.spacing, 'maxElevation')
  configThemeFile.maxLines = combineKeys(_configFile.theme, base.columns, 'maxLines')
  configThemeFile.maxRowHeight = combineKeys(_configFile.theme, base.height, 'maxRowHeight')
  configThemeFile.maxZoomScale = combineKeys(_configFile.theme, base.scale, 'maxZoomScale')
  configThemeFile.minimumFontSize = combineKeys(_configFile.theme, base.fontSize, 'minimumFontSize')
  configThemeFile.minRowHeight = combineKeys(_configFile.theme, base.height, 'minRowHeight')
  configThemeFile.minZoomScale = combineKeys(_configFile.theme, base.scale, 'minZoomScale')
  configThemeFile.offsets = combineKeys(_configFile.theme, base.height, 'offsets')
  configThemeFile.opacity = combineKeys(_configFile.theme, base.opacity, 'opacity')
  configThemeFile.padding = combineKeys(_configFile.theme, base.spacing, 'padding')
  configThemeFile.pagingControlAlpha = combineKeys(_configFile.theme, base.opacity, 'pagingControlAlpha')
  configThemeFile.pagingControlHeight = combineKeys(_configFile.theme, base.height, 'pagingControlHeight')
  configThemeFile.pagingControlTimeout = combineKeys(_configFile.theme, base.transitionDelay, 'pagingControlTimeout')
  configThemeFile.repeat = combineKeys(_configFile.theme, base.columns, 'repeat')
  configThemeFile.repeatCount = combineKeys(_configFile.theme, base.columns, 'repeatCount')
  configThemeFile.rightButtonPadding = combineKeys(_configFile.theme, base.spacing, 'rightButtonPadding')
  configThemeFile.rightWidth = combineKeys(_configFile.theme, base.width, 'rightWidth')
  configThemeFile.rotate = combineKeys(_configFile.theme, base.rotate, 'rotate')
  configThemeFile.rowCount = combineKeys(_configFile.theme, base.columns, 'rowCount')
  configThemeFile.rowHeight = combineKeys(_configFile.theme, base.height, 'rowHeight')
  configThemeFile.scale = combineKeys(_configFile.theme, base.scale, 'scale')
  configThemeFile.sectionHeaderTopPadding = combineKeys(_configFile.theme, base.height, 'sectionHeaderTopPadding')
  configThemeFile.separatorHeight = combineKeys(_configFile.theme, base.height, 'separatorHeight')
  configThemeFile.shadowRadius = combineKeys(_configFile.theme, base.spacing, 'shadowRadius')
  configThemeFile.timeout = combineKeys(_configFile.theme, base.transitionDelay, 'timeout')
  configThemeFile.transitionDelay = combineKeys(_configFile.theme, base.transitionDelay, 'transitionDelay')
  configThemeFile.transitionDuration = combineKeys(_configFile.theme, base.transitionDuration, 'transitionDuration')
  configThemeFile.zIndex = combineKeys(_configFile.theme, base.zIndex, 'zIndex')
  configThemeFile.zoomScale = combineKeys(_configFile.theme, base.scale, 'zoomScale')

  // ! Color related properties
  configThemeFile.colorProperties = {}

  const tiCompletionsFileProperties = getProperties(tiCompletionsFile.types)
  _.each(tiCompletionsFileProperties, (_data, key) => {
    if (key.includes('Color') || key.includes('color')) {
      configThemeFile[key] = combineKeys(_configFile.theme, base.colors, key)
      tiCompletionsFileProperties[key].values = combineKeys(_configFile.theme, base.colors, key)
    }
  })

  return configThemeFile
}

// ! Helper Functions
function removeDeprecatedColors (theObject) {
  delete theObject.blueGray
  delete theObject.coolGray
  delete theObject.current
  delete theObject.inherit
  delete theObject.lightBlue
  delete theObject.trueGray
  delete theObject.warmGray
}

function removeUnnecesaryValues (theObject) {
  delete theObject.width.fit
  delete theObject.width.max
  delete theObject.width.min
  delete theObject.height.fit
  delete theObject.height.max
  delete theObject.height.min
  delete theObject.spacing.fit
  delete theObject.spacing.max
  delete theObject.spacing.min
}

function fixPercentages (theObject) {
  _.each(theObject, (value, key) => {
    if (value.toString().includes('.333333%')) {
      theObject[key] = value.replace('.333333%', '.333334%')
    }
  })
}

function combineKeys (values, base, key) {
  return (values[key]) ? { ...values[key], ...values.extend[key] } : { ...base, ...values.extend[key] }
}

function createPurgeTi (configThemeFile) {
  let tailwindStyles = fs.readFileSync(path.resolve(__dirname, '../lib/templates/tailwind/template.tss'), 'utf8')
  tailwindStyles += fs.readFileSync(path.resolve(__dirname, '../lib/templates/tailwind/custom-template.tss'), 'utf8')
  tailwindStyles += (fs.existsSync(projectConfigJS)) ? `// config.js file updated on: ${getFileUpdatedDate(projectConfigJS)}\n` : '// default config.js file\n'
  tailwindStyles += processProperties(getProperties(tiCompletionsFile.types), configThemeFile)
  return tailwindStyles
}

function getProperties (tiCompletionTypesOnly) {
  const propertiesOnly = {}
  _.each(tiCompletionTypesOnly, (value, key) => {
    _.each(value.properties, property => {
      if (validTypesOnly(property)) {
        if (!propertiesOnly[property]) {
          propertiesOnly[property] = tiCompletionsFile.properties[property]
          propertiesOnly[property].modules = []
        }
        propertiesOnly[property].modules.push(key)
      }
    })
  })

  // saveFile(cwd + '/experimental/propertiesOnly.json', JSON.stringify(propertiesOnly));

  return propertiesOnly
}

function processProperties (tiCompletionsFileProperties, configThemeFile) {
  let heights = ''
  let widths = ''
  let margins = helpers.margin({ ...configThemeFile.margin })
  margins += helpers.gap({ ...configThemeFile.margin })
  let spacing = ''
  const columns = ''
  let colorClasses = ''
  let mixedClasses = ''
  let missingClasses = ''
  let generatedClasses = ''

  if (fs.existsSync(projectConfigJS)) {
    makeSureFolderExists(cwd + '/purgetss/tailwind-auto')
    saveFile(cwd + '/purgetss/tiCompletionsFileProperties.json', JSON.stringify(tiCompletionsFileProperties))
  } else {
    makeSureFolderExists(cwd + '/experimental/tailwind-auto')
    saveFile(cwd + '/experimental/tiCompletionsFileProperties.json', JSON.stringify(tiCompletionsFileProperties))
  }

  _.each(tiCompletionsFileProperties, (data, key) => {
    if (key.includes('Columns') || key.includes('columns') || key.includes('rights') || key.includes('leftNavButtons') || key.includes('rightNavButtons')) {
      // look for a better way to skip this properties
    } else if (key.includes('Color') || key.includes('color')) {
      colorClasses += generateCombinedClasses(key, data, configThemeFile[key])
    } else if (key.includes('horizontalMargin')) {
      margins += generateCombinedClasses(key, data, configThemeFile[key])
    } else if (key.includes('verticalMargin')) {
      margins += generateCombinedClasses(key, data, { top: '-0.5', bottom: '0.5', middle: '0' })
    } else if (key.includes('top') || (key.includes('right') && key !== 'copyright') || key.includes('bottom') || key.includes('left')) {
      margins += generateCombinedClasses(key, data, configThemeFile[key])
    } else if (key.includes('Spacing') || key.includes('spacing')) {
      spacing += generateCombinedClasses(key, data, configThemeFile.spacing)
    } else if (key.includes('backgroundLeftCap') || key.includes('backgroundTopCap')) {
      spacing += generateCombinedClasses(key, data, configThemeFile.spacing)
    } else if (key.includes('uprightWidth') || key.includes('uprightHeight')) {
      widths += generateCombinedClasses(key, data, configThemeFile.spacing)
    } else if (key.includes('Height') || key.includes('height')) {
      heights += generateCombinedClasses(key, data, configThemeFile.height)
    } else if (key.includes('borderWidth')) {
      widths += generateCombinedClasses(key, data, configThemeFile.spacing)
    } else if (key.includes('pageWidth') || key.includes('pageHeight')) {
      widths += generateCombinedClasses(key, data, configThemeFile.spacing)
    } else if (key.includes('Width') || key.includes('width')) {
      widths += generateCombinedClasses(key, data, configThemeFile.width)
    } else if (((key.includes('Padding') || key.includes('padding')) && data.type !== 'Boolean')) {
      mixedClasses += generateCombinedClasses(key, data, configThemeFile.spacing)
    } else if (key.includes('delay')) {
      mixedClasses += generateCombinedClasses(key, data, configThemeFile.delay)
    } else if (key.includes('opacity')) {
      mixedClasses += generateCombinedClasses(key, data, configThemeFile.opacity)
    } else if (key.includes('borderRadius')) {
      const _borderRadius = helpers.processProperties(processComments(key, data), {
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
        default: configThemeFile.borderRadius
      })

      saveAutoTSS(key, _borderRadius)

      mixedClasses += _borderRadius
    } else if (hasValidValues(key)) {
      const classes = generateClasses(key, data)

      if (classes) {
        saveAutoTSS(key, classes)
        mixedClasses += classes
      } else if (helpers[key]) {
        const helperKey = processComments(key, data) + helpers[key](configThemeFile[key])
        saveAutoTSS(key, helperKey)
        mixedClasses += helperKey
      } else {
        const withProcessedComments = processComments(key, data)
        saveAutoTSS(key, withProcessedComments)
        missingClasses += withProcessedComments
      }
    }
  })

  // mixedClasses += helpers.anchorPoint();
  // mixedClasses += helpers.clipMode();

  // Extras: anchorPoint, clipMode, elevation, (block and hidden: visible:true-false ), navigationMode, theme, repeat, rowCount, timeout, scale, rotate, maxElevation, shadowRadius, columnCount, fontSize = text, minimumFontSize, selectionStyle, countDownDuration, maxZoomScale, minZoomScale, scrollType, zoomScale, cacheSize, pagingControlTimeout, pagingControlAlpha, autocapitalization = alternates, activeTab, shiftMode, filterAttribute, indentionLevel

  generatedClasses += spacing
  generatedClasses += heights
  generatedClasses += widths
  generatedClasses += margins
  generatedClasses += columns
  generatedClasses += mixedClasses
  generatedClasses += colorClasses
  generatedClasses += missingClasses

  return generatedClasses
}

function getFileUpdatedDate (_path) {
  return fs.statSync(_path).mtime
}

function saveFile (file, data) {
  fs.writeFileSync(file, data, err => {
    throw err
  })
}

function hasValidValues (key) {
  key = key.toLowerCase()
  return !key.includes('_') &&
		!key.includes('apiname') &&
		!key.includes('animatedcenter') &&
		!key.includes('attributes') &&
		!key.includes('button') &&
		!key.includes('children') &&
		!key.includes('copyright') &&
		!key.includes('data') &&
		!key.includes('hint') &&
		!key.includes('id') &&
		!key.includes('image') &&
		!key.includes('index') &&
		!key.includes('item') &&
		!key.includes('label') &&
		!key.includes('landscape') &&
		!key.includes('logo') &&
		!key.includes('message') &&
		!key.includes('name') &&
		!key.includes('order') &&
		!key.includes('placeholder') &&
		!key.includes('text') &&
		!key.includes('title') &&
		!key.includes('value')
}

function validTypesOnly (property) {
  return tiCompletionsFile.properties[property].type === 'Boolean' ||
		tiCompletionsFile.properties[property].type === 'Point' ||
		tiCompletionsFile.properties[property].type === 'Number' ||
		tiCompletionsFile.properties[property].type === 'Array' ||
		tiCompletionsFile.properties[property].type === 'String'
}

function validType (data) {
  return data.type === 'Boolean' ||
		data.type === 'Point' ||
		data.type === 'Number' ||
		data.type === 'Array' ||
		data.type === 'String'
}

function generateClasses (key, data) {
  let myClasses = ''
  const comments = processComments(key, data)

  _.each(data.values, (value, _key) => {
    if (!value.includes('deprecated')) {
      myClasses += formatClass(key, value)
    }
  })

  if (myClasses) {
    return comments + myClasses
  }

  return false
}

function processComments (key, data) {
  let myClasses = `\n// Type: ${data.type}`
  myClasses += `\n// Property: ${key}`
  if (data.description) myClasses += `\n// Description: ${data.description.replace(/\n/g, ' ')}`
  myClasses += `\n// Component(s): ${data.modules.join(', ')}\n`

  return myClasses
}

function generateCombinedClasses (key, data, values) {
  let myClasses = processComments(key, data)

  _.each(values, (value, _key) => {
    if (typeof value === 'object') {
      _.each(value, (_value, __key) => {
        myClasses += `'.${removeUneededVariables(camelCaseToDash(key + '-' + _key + '-' + __key))}': { ${key}: ${helpers.parseValue(_value)} }\n`
      })
    } else {
      myClasses += `'.${removeUneededVariables(camelCaseToDash(key + '-' + _key))}': { ${key}: ${helpers.parseValue(value)} }\n`
    }
  })

  saveAutoTSS(key, myClasses)

  return myClasses
}

function saveAutoTSS (key, classes) {
  if (fs.existsSync(projectConfigJS)) {
    saveFile(cwd + `/purgetss/tailwind-auto/${key}-auto.tss`, classes)
  } else {
    saveFile(cwd + `/experimental/tailwind-auto/${key}-auto.tss`, classes)
  }
}

function formatClass (key, value) {
  return `'.${formatClassName(key, value)}': { ${key}: ${value} }\n`
}

function formatClassName (property, value) {
  return removeUneededVariables(camelCaseToDash(`${property}-${removeModuleName(value, property)}`))
}

function removeUneededVariables (property) {
  return Array.from(new Set(property.split('-')))
    .join('-')
    .replace('-android', '')
    .replace('-bottom-', '-b-')
    .replace('-calendar-', '-')
    .replace('-default', '')
    .replace('-left-', '-l-')
    .replace('-margin', '')
    .replace('-right-', '-r-')
    .replace('-top-', '-t-')
    .replace('-true', '')
    .replace('autolink', '')
    .replace('background-', 'bg-')
    .replace('buttonmode', '')
    .replace('color-', '')
    .replace('flag-', '')
    .replace('height-', 'h-')
    .replace('layout-', '')
    .replace('recurrencefrequency', 'recurrence')
    .replace('returnkey-', '')
    .replace('text-alignment-', '')
    .replace('ti-', '')
    .replace('width-', 'w-')
    .replace(/--/g, '-')
}

function camelCaseToDash (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function removeModuleName (value, property) {
  return camelCaseToDash(value
    .replace(/^Ti.UI.iOS./, '')
    .replace(/^Ti.UI.iPad./, '')
    .replace(/^Ti.App.iOS./, '')
    .replace(/^Ti.Geolocation.Android./, '')
    .replace(/^Ti.Geolocation./, '')
    .replace(/^Ti.UI.Android./, '')
    .replace(/^Ti.UI./, '')
    .replace(/^Ti.Media.Sound./, '')
    .replace(/^Ti.Media./, '')
    .replace(/_/g, '-')
    .replace(/'/g, '')
    .replace(`${property}-`, '')
    .replace(/\./g, '-'))
}

function makeSureFolderExists (folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }
}
