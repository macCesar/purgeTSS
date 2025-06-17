/**
 * PurgeTSS v7.1.0 - Core Builder: Tailwind Helpers
 * Helper functions for building Tailwind CSS
 *
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @since 7.1.0
 * @author César Estrada
 */

import _ from 'lodash'
import defaultColors from 'tailwindcss/colors.js'

// TODO: These dependencies need to be resolved during refactoring
// Import functions from their new modular locations
import { configFile } from '../../shared/config-manager.js'
import { removeDeprecatedColors, fixPercentages } from '../../shared/helpers.js'

/**
 * Remove fit, max, min values from width, height and spacing objects
 * @param {Object} theObject - Object with width, height, spacing properties
 */
export function removeFitMaxMin(theObject) {
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

/**
 * Combine keys from theme and extend, with fallback to base values
 * @param {Object} values - Theme values object
 * @param {Object} base - Base values object
 * @param {string} key - Key to combine
 * @returns {Object} Combined values
 */
export function combineKeys(values, base, key) {
  return (values[key]) ? { ...values[key], ...values.extend[key] } : { ...base, ...values.extend[key] }
}

/**
 * Get base values for Tailwind building
 * This function prepares all the base theme values needed for building
 * @param {Object} defaultTheme - Default Tailwind theme
 * @returns {Object} Base values object
 */
export function getBaseValues(defaultTheme) {
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
    fontSize: configFile.theme.spacing ?? defaultTheme.fontSize,
    colors: configFile.theme.colors ?? { transparent: 'transparent', ...defaultColors }
  }

  // ! Remove unnecessary values
  removeFitMaxMin(themeOrDefaultValues)

  // ! Merge with extend values
  const base = {
    width: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing, ...themeOrDefaultValues.width, ...configFile.theme.extend.width },
    height: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing, ...themeOrDefaultValues.height, ...configFile.theme.extend.height },
    colors: { ...themeOrDefaultValues.colors, ...configFile.theme.extend.colors },
    spacing: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing },
    fontSize: { ...themeOrDefaultValues.fontSize, ...configFile.theme.extend.spacing, ...configFile.theme.extend.fontSize },
    columns: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
    delay: { 0: '0ms', 25: '25ms', 50: '50ms', 250: '250ms', 350: '350ms', 400: '400ms', 450: '450ms', 600: '600ms', 800: '800ms', 900: '900ms', 2000: '2000ms', 3000: '3000ms', 4000: '4000ms', 5000: '5000ms' }
  }

  fixPercentages(base.width)
  fixPercentages(base.height)
  fixPercentages(base.spacing)

  return base
}

/**
 * Combine all values for Tailwind building - MASSIVE function with all Titanium properties
 * This function builds the complete values object used in legacy Tailwind building
 * @param {Object} base - Base values from getBaseValues()
 * @param {Object} defaultTheme - Default Tailwind theme
 * @returns {Object} Complete values object for building
 */
export function combineAllValues(base, defaultTheme) {
  const allValues = {}

  // ! Custom Window, View and ImageView
  allValues.Window = (configFile.theme.Window && configFile.theme.Window.apply)
    ? _.merge({ apply: configFile.theme.Window.apply }, configFile.theme.Window)
    : _.merge({ default: { backgroundColor: '#FFFFFF' } }, configFile.theme.Window)

  allValues.ImageView = (configFile.theme.ImageView && configFile.theme.ImageView.apply)
    ? _.merge({ apply: configFile.theme.ImageView.apply }, { ios: { hires: true } }, configFile.theme.ImageView)
    : _.merge({ ios: { hires: true } }, configFile.theme.ImageView)

  allValues.View = (configFile.theme.View && configFile.theme.View.apply)
    ? _.merge({ apply: configFile.theme.View.apply }, configFile.theme.View)
    : _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View)

  // ! Width, height and margin properties
  // INFO: sizingProperties: For glossary generator only... Do not move from this position.
  allValues.sizingProperties = {}

  allValues.height = base.height
  allValues.width = base.width
  allValues.margin = combineKeys(configFile.theme, base.spacing, 'margin')
  allValues.marginAlternate = combineKeys(configFile.theme, base.spacing, 'margin')

  // ! Properties with constant values
  // INFO: constantProperties: For glossary generator only... Do not move from this position.
  allValues.constantProperties = {}

  // allValues.audioStreamType = {};
  // allValues.category = {};
  allValues.accessibilityHidden = {}
  allValues.accessoryType = {}
  allValues.activeIconIsMask = {}
  allValues.activityEnterTransition = {}
  allValues.activityExitTransition = {}
  allValues.activityIndicatorStyle = {}
  allValues.activityReenterTransition = {}
  allValues.activityReturnTransition = {}
  allValues.activitySharedElementEnterTransition = {}
  allValues.activitySharedElementExitTransition = {}
  allValues.activitySharedElementReenterTransition = {}
  allValues.activitySharedElementReturnTransition = {}
  allValues.alertDialogStyle = {}
  allValues.allowsBackForwardNavigationGestures = {}
  allValues.allowsLinkPreview = {}
  allValues.allowsMultipleSelectionDuringEditing = {}
  allValues.allowsMultipleSelectionInteraction = {}
  allValues.allowsSelection = {}
  allValues.allowsSelectionDuringEditing = {}
  allValues.allowUserCustomization = {}
  allValues.anchorPoint = {}
  allValues.autoAdjustScrollViewInsets = {}
  allValues.autocapitalization = {}
  allValues.autocorrect = {}
  allValues.autofillType = {}
  allValues.autoLink = {}
  allValues.autoreverse = {}
  allValues.autorotate = {}
  allValues.backgroundBlendMode = {}
  allValues.backgroundLinearGradient = {}
  allValues.backgroundRadialGradient = {}
  allValues.backgroundRepeat = {}
  allValues.borderStyle = {}
  allValues.bubbleParent = {}
  allValues.buttonStyle = {}
  allValues.cacheMode = {}
  allValues.cachePolicy = {}
  allValues.calendarViewShown = {}
  allValues.canCancelEvents = {}
  allValues.cancelable = {}
  allValues.canceledOnTouchOutside = {}
  allValues.canDelete = {}
  allValues.canEdit = {}
  allValues.canInsert = {}
  allValues.canMove = {}
  allValues.canScroll = {}
  allValues.caseInsensitiveSearch = {}
  allValues.checkable = {}
  allValues.clearButtonMode = {}
  allValues.clearOnEdit = {}
  allValues.clipMode = {}
  allValues.constraint = {}
  allValues.contentHeightAndWidth = {}
  allValues.curve = {}
  allValues.datePickerStyle = {}
  allValues.defaultItemTemplate = {}
  allValues.dimBackgroundForSearch = {}
  allValues.disableBounce = {}
  allValues.disableContextMenu = {}
  allValues.displayCaps = {}
  allValues.displayHomeAsUp = {}
  allValues.draggingType = {}
  allValues.drawerIndicatorEnabled = {}
  allValues.drawerLockMode = {}
  allValues.dropShadow = {}
  allValues.duration = {}
  allValues.editable = {}
  allValues.editing = {}
  allValues.ellipsize = {}
  allValues.enableCopy = {}
  allValues.enabled = {}
  allValues.enableJavascriptInterface = {}
  allValues.enableReturnKey = {}
  allValues.enableZoomControls = {}
  allValues.exitOnClose = {}
  allValues.extendBackground = {}
  allValues.extendEdges = {}
  allValues.extendSafeArea = {}
  allValues.fastScroll = {}
  allValues.filterAnchored = {}
  allValues.filterAttribute = {}
  allValues.filterCaseInsensitive = {}
  allValues.filterTouchesWhenObscured = {}
  allValues.flags = {}
  allValues.flagSecure = {}
  allValues.flip = {}
  allValues.focusable = {}
  allValues.fontStyle = {}
  allValues.footerDividersEnabled = {}
  allValues.format24 = {}
  allValues.fullscreen = {}
  allValues.gravity = {}
  allValues.gridColumnsRowsStartEnd = {}
  allValues.gridFlow = {}
  allValues.gridSystem = {}
  allValues.hasCheck = {}
  allValues.hasChild = {}
  allValues.hasDetail = {}
  allValues.headerDividersEnabled = {}
  allValues.hiddenBehavior = {}
  allValues.hideLoadIndicator = {}
  allValues.hidesBackButton = {}
  allValues.hidesBarsOnSwipe = {}
  allValues.hidesBarsOnTap = {}
  allValues.hidesBarsWhenKeyboardAppears = {}
  allValues.hideSearchOnSelection = {}
  allValues.hideShadow = {}
  allValues.hidesSearchBarWhenScrolling = {}
  allValues.hintType = {}
  allValues.hires = {}
  allValues.homeButtonEnabled = {}
  allValues.homeIndicatorAutoHidden = {}
  allValues.horizontalWrap = {}
  allValues.html = {}
  allValues.icon = {}
  allValues.iconified = {}
  allValues.iconifiedByDefault = {}
  allValues.iconIsMask = {}
  allValues.ignoreSslError = {}
  allValues.imageTouchFeedback = {}
  allValues.includeFontPadding = {}
  allValues.includeOpaqueBars = {}
  allValues.keepScreenOn = {}
  allValues.keepSectionsInSearch = {}
  allValues.keyboardAppearance = {}
  allValues.keyboardDismissMode = {}
  allValues.keyboardDisplayRequiresUserAction = {}
  allValues.keyboardType = {}
  allValues.largeTitleDisplayMode = {}
  allValues.largeTitleEnabled = {}
  allValues.layout = {}
  allValues.lazyLoadingEnabled = {}
  allValues.leftButtonMode = {}
  allValues.leftDrawerLockMode = {}
  allValues.lightTouchEnabled = {}
  allValues.listViewStyle = {}
  allValues.loginKeyboardType = {}
  allValues.loginReturnKeyType = {}
  allValues.mixedContentMode = {}
  allValues.modal = {}
  allValues.moveable = {}
  allValues.moving = {}
  allValues.nativeSpinner = {}
  allValues.navBarHidden = {}
  allValues.navigationMode = {}
  allValues.orientationModes = {}
  allValues.overlayEnabled = {}
  allValues.overrideCurrentAnimation = {}
  allValues.overScrollMode = {}
  allValues.showPagingControl = {}
  allValues.pagingControlOnTop = {}
  allValues.passwordKeyboardType = {}
  allValues.passwordMask = {}
  allValues.pickerType = {}
  allValues.placement = {}
  allValues.pluginState = {}
  allValues.preventCornerOverlap = {}
  allValues.preventDefaultImage = {}
  allValues.previewActionStyle = {}
  allValues.progressBarStyle = {}
  allValues.progressIndicatorType = {}
  allValues.pruneSectionsOnEdit = {}
  allValues.requestedOrientation = {}
  allValues.resultsSeparatorStyle = {}
  allValues.returnKeyType = {}
  allValues.reverse = {}
  allValues.rightButtonMode = {}
  allValues.rightDrawerLockMode = {}
  allValues.scalesPageToFit = {}
  allValues.scrollable = {}
  allValues.scrollIndicators = {}
  allValues.scrollIndicatorStyle = {}
  allValues.scrollingEnabled = {}
  allValues.scrollsToTop = {}
  allValues.scrollType = {}
  allValues.searchAsChild = {}
  allValues.searchBarStyle = {}
  allValues.searchHidden = {}
  allValues.selectionGranularity = {}
  allValues.selectionOpens = {}
  allValues.selectionStyle = {}
  allValues.separatorStyle = {}
  allValues.shiftMode = {}
  allValues.showAsAction = {}
  allValues.showBookmark = {}
  allValues.showCancel = {}
  allValues.showHorizontalScrollIndicator = {}
  allValues.showSearchBarInNavBar = {}
  allValues.showSelectionCheck = {}
  allValues.showUndoRedoActions = {}
  allValues.showVerticalScrollIndicator = {}
  allValues.smoothScrollOnTabClick = {}
  allValues.statusBarStyle = {}
  allValues.submitEnabled = {}
  allValues.suppressReturn = {}
  allValues.sustainedPerformanceMode = {}
  allValues.swipeToClose = {}
  allValues.switchStyle = {}
  allValues.systemButton = {}
  allValues.tabBarHidden = {}
  allValues.tabbedBarStyle = {}
  allValues.tabGroupStyle = {}
  allValues.tableViewStyle = {}
  allValues.tabsTranslucent = {}
  allValues.textAlign = {}
  allValues.theme = {}
  allValues.titleAttributesShadow = {}
  allValues.toolbarEnabled = {}
  allValues.touchEnabled = {}
  allValues.touchFeedback = {}
  allValues.translucent = {}
  allValues.useCompatPadding = {}
  allValues.useSpinner = {}
  allValues.verticalAlign = {}
  allValues.verticalBounce = {}
  allValues.viewShadow = {}
  allValues.visible = {}
  allValues.willHandleTouches = {}
  allValues.willScrollOnStatusTap = {}
  allValues.windowPixelFormat = {}
  allValues.windowSoftInputMode = {}
  allValues.wobble = {}

  // ! Configurable properties
  // INFO: configurableProperties: For glossary generator only... Do not move from this position.
  allValues.configurableProperties = {}

  allValues.activeTab = combineKeys(configFile.theme, base.spacing, 'activeTab')
  allValues.backgroundLeftCap = combineKeys(configFile.theme, base.spacing, 'backgroundLeftCap')
  allValues.backgroundPaddingBottom = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingBottom')
  allValues.backgroundPaddingLeft = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingLeft')
  allValues.backgroundPaddingRight = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingRight')
  allValues.backgroundPaddingTop = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingTop')
  allValues.backgroundTopCap = combineKeys(configFile.theme, base.spacing, 'backgroundTopCap')
  allValues.borderRadius = combineKeys(configFile.theme, base.spacing, 'borderRadius')
  allValues.borderWidth = combineKeys(configFile.theme, base.spacing, 'borderWidth')
  allValues.bottomNavigation = combineKeys(configFile.theme, base.spacing, 'bottomNavigation')
  allValues.cacheSize = combineKeys(configFile.theme, base.spacing, 'cacheSize')
  allValues.columnCount = combineKeys(configFile.theme, { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 }, 'columnCount')
  allValues.contentHeight = combineKeys(configFile.theme, base.height, 'contentHeight')
  allValues.contentWidth = combineKeys(configFile.theme, base.width, 'contentWidth')
  allValues.countDownDuration = combineKeys(configFile.theme, base.spacing, 'countDownDuration')
  allValues.elevation = combineKeys(configFile.theme, base.spacing, 'elevation')
  allValues.fontFamily = combineKeys(configFile.theme, defaultTheme.fontFamily, 'fontFamily')
  allValues.fontSize = combineKeys(configFile.theme, base.fontSize, 'fontSize')
  allValues.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight')
  allValues.gap = combineKeys(configFile.theme, base.spacing, 'gap')
  allValues.indentionLevel = combineKeys(configFile.theme, base.spacing, 'indentionLevel')
  allValues.keyboardToolbarHeight = combineKeys(configFile.theme, base.spacing, 'keyboardToolbarHeight')
  allValues.leftButtonPadding = combineKeys(configFile.theme, base.spacing, 'leftButtonPadding')
  allValues.leftWidth = combineKeys(configFile.theme, base.width, 'leftWidth')
  allValues.lines = combineKeys(configFile.theme, { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 }, 'lines')
  allValues.maxElevation = combineKeys(configFile.theme, base.spacing, 'maxElevation')
  allValues.maxLines = combineKeys(configFile.theme, { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 }, 'maxLines')
  allValues.maxRowHeight = combineKeys(configFile.theme, base.height, 'maxRowHeight')
  allValues.maxZoomScale = combineKeys(configFile.theme, { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }, 'maxZoomScale')
  allValues.minimumFontSize = combineKeys(configFile.theme, base.fontSize, 'minimumFontSize')
  allValues.minRowHeight = combineKeys(configFile.theme, base.height, 'minRowHeight')
  allValues.minZoomScale = combineKeys(configFile.theme, { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }, 'minZoomScale')
  allValues.offsets = combineKeys(configFile.theme, base.spacing, 'offsets')
  allValues.opacity = combineKeys(configFile.theme, defaultTheme.opacity, 'opacity')
  allValues.padding = combineKeys(configFile.theme, base.spacing, 'padding')
  allValues.pagingControlAlpha = combineKeys(configFile.theme, defaultTheme.opacity, 'pagingControlAlpha')
  allValues.pagingControlHeight = combineKeys(configFile.theme, base.height, 'pagingControlHeight')
  allValues.pagingControlTimeout = combineKeys(configFile.theme, base.delay, 'pagingControlTimeout')
  allValues.repeat = combineKeys(configFile.theme, { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, infinite: -1 }, 'repeat')
  allValues.repeatCount = combineKeys(configFile.theme, { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, infinite: -1 }, 'repeatCount')
  allValues.rightButtonPadding = combineKeys(configFile.theme, base.spacing, 'rightButtonPadding')
  allValues.rightWidth = combineKeys(configFile.theme, base.width, 'rightWidth')
  allValues.rotate = combineKeys(configFile.theme, defaultTheme.rotate, 'rotate')

  // ! Custom Color properties
  // INFO: colorProperties: For glossary generator only... Do not move from this position.
  allValues.colorProperties = {}

  allValues.activeTintColor = combineKeys(configFile.theme, base.colors, 'activeTintColor')
  allValues.activeTitleColor = combineKeys(configFile.theme, base.colors, 'activeTitleColor')
  allValues.backgroundColor = combineKeys(configFile.theme, base.colors, 'backgroundColor')
  allValues.backgroundDisabledColor = combineKeys(configFile.theme, base.colors, 'backgroundDisabledColor')
  allValues.backgroundFocusedColor = combineKeys(configFile.theme, base.colors, 'backgroundFocusedColor')
  allValues.backgroundGradient = combineKeys(configFile.theme, base.colors, 'backgroundGradient')
  allValues.backgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'backgroundSelectedColor')
  allValues.backgroundSelectedGradient = combineKeys(configFile.theme, base.colors, 'backgroundSelectedGradient')
  allValues.badgeColor = combineKeys(configFile.theme, base.colors, 'badgeColor')
  allValues.barColor = combineKeys(configFile.theme, base.colors, 'barColor')
  allValues.borderColor = combineKeys(configFile.theme, base.colors, 'borderColor')
  allValues.currentPageIndicatorColor = combineKeys(configFile.theme, base.colors, 'currentPageIndicatorColor')
  allValues.dateTimeColor = combineKeys(configFile.theme, base.colors, 'dateTimeColor')
  allValues.disabledColor = combineKeys(configFile.theme, base.colors, 'disabledColor')
  allValues.highlightedColor = combineKeys(configFile.theme, base.colors, 'highlightedColor')
  allValues.hintTextColor = combineKeys(configFile.theme, base.colors, 'hintTextColor')
  allValues.imageTouchFeedbackColor = combineKeys(configFile.theme, base.colors, 'imageTouchFeedbackColor')
  allValues.pageIndicatorColor = combineKeys(configFile.theme, base.colors, 'pageIndicatorColor')
  allValues.pagingControlColor = combineKeys(configFile.theme, base.colors, 'pagingControlColor')
  allValues.pullBackgroundColor = combineKeys(configFile.theme, base.colors, 'pullBackgroundColor')
  allValues.resultsBackgroundColor = combineKeys(configFile.theme, base.colors, 'resultsBackgroundColor')
  allValues.resultsSeparatorColor = combineKeys(configFile.theme, base.colors, 'resultsSeparatorColor')
  allValues.selectedBackgroundColor = combineKeys(configFile.theme, base.colors, 'selectedBackgroundColor')
  allValues.selectedBackgroundGradient = combineKeys(configFile.theme, base.colors, 'selectedBackgroundGradient')
  allValues.selectedColor = combineKeys(configFile.theme, base.colors, 'selectedColor')
  allValues.separatorColor = combineKeys(configFile.theme, base.colors, 'separatorColor')
  allValues.shadowColor = combineKeys(configFile.theme, base.colors, 'shadowColor')
  allValues.tabsBackgroundColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundColor')
  allValues.tabsBackgroundDisabledColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundDisabledColor')
  allValues.tabsBackgroundFocusedColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundFocusedColor')
  allValues.tabsBackgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundSelectedColor')
  allValues.textColor = combineKeys(configFile.theme, base.colors, 'textColor')
  allValues.tintColor = combineKeys(configFile.theme, base.colors, 'tintColor')
  allValues.titleColor = combineKeys(configFile.theme, base.colors, 'titleColor')
  allValues.titleDisabledColor = combineKeys(configFile.theme, base.colors, 'titleDisabledColor')
  allValues.titleFocusedColor = combineKeys(configFile.theme, base.colors, 'titleFocusedColor')
  allValues.titleHighlightedColor = combineKeys(configFile.theme, base.colors, 'titleHighlightedColor')
  allValues.titleSelectedColor = combineKeys(configFile.theme, base.colors, 'titleSelectedColor')
  allValues.touchFeedbackColor = combineKeys(configFile.theme, base.colors, 'touchFeedbackColor')
  allValues.viewShadowColor = combineKeys(configFile.theme, base.colors, 'viewShadowColor')
  allValues.navTintColor = combineKeys(configFile.theme, base.colors, 'navTintColor')

  return allValues
}
