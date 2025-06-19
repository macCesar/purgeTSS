/**
 * PurgeTSS v7.1.0 - Core Builder: Tailwind Builder
 * Functions for building Tailwind CSS from configuration
 *
 * @since 7.1.0
 * @author César Estrada
 */

// Import functions from their new modular locations
import * as helpers from '../../shared/helpers.js'
import { autoBuildTailwindTSS } from '../../../experimental/completions2.js'

/**
 * Build Tailwind (AUTO mode using experimental completions engine)
 * @param {Object} options - Build options
 */
export function buildTailwind(options) {
  // Always modern mode in v7.1 - legacy removed completely
  autoBuildTailwindTSS(options)
}

/**
 * Build Tailwind using modern auto-generation (v7.1)
 * Legacy mode has been removed in v7.1
 * @param {Object} options - Build options
 */
export function buildTailwindBasedOnConfigOptions(options = {}) {
  // Always use modern mode in v7.1 - legacy removed
  buildTailwind(options)
}

/**
 * Helper function to build Tailwind classes using helpers.js functions
 * This is a MASSIVE switch statement with 200+ cases that calls
 * specific helper functions for each Titanium property
 * @param {string} key - The property key
 * @param {*} value - The property value
 * @returns {string} Generated CSS classes
 */
export function helperToBuildTailwindClasses(key, value) {
  switch (key) {
    // case 'audioStreamType':
    // case 'category':
    case 'accessibilityHidden':
    case 'accessoryType':
    case 'activeIconIsMask':
    case 'activeTab':
    case 'activeTintColor':
    case 'activeTitleColor':
    case 'activityEnterTransition':
    case 'activityExitTransition':
    case 'activityIndicatorStyle':
    case 'activityReenterTransition':
    case 'activityReturnTransition':
    case 'activitySharedElementEnterTransition':
    case 'activitySharedElementExitTransition':
    case 'activitySharedElementReenterTransition':
    case 'activitySharedElementReturnTransition':
    case 'alertDialogStyle':
    case 'allowsBackForwardNavigationGestures':
    case 'allowsLinkPreview':
    case 'allowsMultipleSelectionDuringEditing':
    case 'allowsMultipleSelectionInteraction':
    case 'allowsSelection':
    case 'allowsSelectionDuringEditing':
    case 'allowUserCustomization':
    case 'anchorPoint':
    case 'autoAdjustScrollViewInsets':
    case 'autocapitalization':
    case 'autocorrect':
    case 'autofillType':
    case 'autoLink':
    case 'autoreverse':
    case 'autorotate':
    case 'backgroundBlendMode':
    case 'backgroundColor':
    case 'backgroundDisabledColor':
    case 'backgroundFocusedColor':
    case 'backgroundGradient':
    case 'backgroundLeftCap':
    case 'backgroundLinearGradient':
    case 'backgroundPaddingBottom':
    case 'backgroundPaddingLeft':
    case 'backgroundPaddingRight':
    case 'backgroundPaddingTop':
    case 'backgroundRadialGradient':
    case 'backgroundRepeat':
    case 'backgroundSelectedColor':
    case 'backgroundSelectedGradient':
    case 'backgroundTopCap':
    case 'badgeColor':
    case 'barColor':
    case 'borderColor':
    case 'borderRadius':
    case 'borderStyle':
    case 'borderWidth':
    case 'bottomNavigation':
    case 'bubbleParent':
    case 'buttonStyle':
    case 'cacheMode':
    case 'cachePolicy':
    case 'cacheSize':
    case 'calendarViewShown':
    case 'canCancelEvents':
    case 'cancelable':
    case 'canceledOnTouchOutside':
    case 'canDelete':
    case 'canEdit':
    case 'canInsert':
    case 'canMove':
    case 'canScroll':
    case 'caseInsensitiveSearch':
    case 'checkable':
    case 'clearButtonMode':
    case 'clearOnEdit':
    case 'clipMode':
    case 'columnCount':
    case 'constraint':
    case 'contentHeight':
    case 'contentHeightAndWidth':
    case 'contentWidth':
    case 'countDownDuration':
    case 'currentPageIndicatorColor':
    case 'curve':
    case 'datePickerStyle':
    case 'dateTimeColor':
    case 'defaultItemTemplate':
    case 'dimBackgroundForSearch':
    case 'disableBounce':
    case 'disableContextMenu':
    case 'disabledColor':
    case 'displayCaps':
    case 'displayHomeAsUp':
    case 'draggingType':
    case 'drawerIndicatorEnabled':
    case 'drawerLockMode':
    case 'dropShadow':
    case 'duration':
    case 'editable':
    case 'editing':
    case 'elevation':
    case 'ellipsize':
    case 'enableCopy':
    case 'enabled':
    case 'enableJavascriptInterface':
    case 'enableReturnKey':
    case 'enableZoomControls':
    case 'exitOnClose':
    case 'extendBackground':
    case 'extendEdges':
    case 'extendSafeArea':
    case 'fastScroll':
    case 'filterAnchored':
    case 'filterAttribute':
    case 'filterCaseInsensitive':
    case 'filterTouchesWhenObscured':
    case 'flags':
    case 'flagSecure':
    case 'flip':
    case 'focusable':
    case 'fontFamily':
    case 'fontSize':
    case 'fontStyle':
    case 'fontWeight':
    case 'footerDividersEnabled':
    case 'format24':
    case 'fullscreen':
    case 'gap':
    case 'gravity':
    case 'gridColumnsRowsStartEnd':
    case 'gridFlow':
    case 'gridSystem':
    case 'hasCheck':
    case 'hasChild':
    case 'hasDetail':
    case 'headerDividersEnabled':
    case 'height':
    case 'hiddenBehavior':
    case 'hideLoadIndicator':
    case 'hidesBackButton':
    case 'hidesBarsOnSwipe':
    case 'hidesBarsOnTap':
    case 'hidesBarsWhenKeyboardAppears':
    case 'hideSearchOnSelection':
    case 'hideShadow':
    case 'hidesSearchBarWhenScrolling':
    case 'highlightedColor':
    case 'hintTextColor':
    case 'hintType':
    case 'hires':
    case 'homeButtonEnabled':
    case 'homeIndicatorAutoHidden':
    case 'horizontalMargin':
    case 'horizontalWrap':
    case 'html':
    case 'icon':
    case 'iconified':
    case 'iconifiedByDefault':
    case 'iconIsMask':
    case 'ignoreSslError':
    case 'imageTouchFeedback':
    case 'imageTouchFeedbackColor':
    case 'includeFontPadding':
    case 'includeOpaqueBars':
    case 'indentionLevel':
    case 'intent':
    case 'keepScreenOn':
    case 'keyboardAppearance':
    case 'keyboardDisplayRequiresUserAction':
    case 'keyboardToolbar':
    case 'keyboardToolbarColor':
    case 'keyboardToolbarHeight':
    case 'keyboardType':
    case 'lazyLoadingEnabled':
    case 'layout':
    case 'layoutId':
    case 'leftButtonMode':
    case 'leftImage':
    case 'leftWidth':
    case 'lifecycleContainer':
    case 'lineSpacing':
    case 'listViewStyle':
    case 'locale':
    case 'loading':
    case 'lockPortraitUpsideDown':
    case 'longClickable':
    case 'longpressEnabled':
    case 'loop':
    case 'margin':
    case 'maxClassname':
    case 'maxDate':
    case 'maxEms':
    case 'maxLength':
    case 'maxLines':
    case 'maxRowHeight':
    case 'maxZoomScale':
    case 'minDate':
    case 'minRowHeight':
    case 'minZoomScale':
    case 'modal':
    case 'modalStyle':
    case 'modalTransitionStyle':
    case 'mode':
    case 'moveable':
    case 'moving':
    case 'navBarHidden':
    case 'navTintColor':
    case 'opacity':
    case 'orientation':
    case 'orientationModes':
    case 'overlayEnabled':
    case 'overScrollMode':
    case 'padding':
    case 'paddingBottom':
    case 'paddingLeft':
    case 'paddingRight':
    case 'paddingTop':
    case 'pageIndicatorColor':
    case 'pagingControlAlpha':
    case 'pagingControlColor':
    case 'pagingControlHeight':
    case 'pagingControlOnTop':
    case 'pagingControlTimeout':
    case 'passwordMask':
    case 'persistent':
    case 'pickerType':
    case 'pinchingEnabled':
    case 'placeholderText':
    case 'playableDuration':
    case 'playing':
    case 'position':
    case 'previewContext':
    case 'pullBackgroundColor':
    case 'pullView':
    case 'queryHint':
    case 'readonlyBackground':
    case 'regionFit':
    case 'repeatCount':
    case 'requireMasterView':
    case 'resultsBackgroundColor':
    case 'resultsSeparatorColor':
    case 'returnKeyType':
    case 'rightButtonMode':
    case 'rightImage':
    case 'rightWidth':
    case 'rotation':
    case 'rotationX':
    case 'rotationY':
    case 'saveToPhotoGallery':
    case 'scaleX':
    case 'scaleY':
    case 'scalesPageToFit':
    case 'scrollable':
    case 'scrollingEnabled':
    case 'scrollIndicatorStyle':
    case 'scrollsToTop':
    case 'scrollType':
    case 'searchAsChild':
    case 'searchHidden':
    case 'searchableText':
    case 'selectedBackgroundColor':
    case 'selectedBackgroundGradient':
    case 'selectedBackgroundImage':
    case 'selectedColor':
    case 'selectedImage':
    case 'selectionGranularity':
    case 'selectionIndicator':
    case 'selectionOpens':
    case 'selectionStyle':
    case 'separatorColor':
    case 'separatorInsets':
    case 'separatorStyle':
    case 'shadowColor':
    case 'shadowImage':
    case 'shadowOffset':
    case 'shadowOpacity':
    case 'shadowRadius':
    case 'showAsAction':
    case 'showBookmark':
    case 'showCancel':
    case 'showHorizontalScrollIndicator':
    case 'showPagingControl':
    case 'showSearchBarInNavBar':
    case 'showUndoRedoActions':
    case 'showVerticalScrollIndicator':
    case 'size':
    case 'softKeyboardOnFocus':
    case 'sound':
    case 'splitActionBar':
    case 'statusBarStyle':
    case 'style':
    case 'submitEnabled':
    case 'suppressReturn':
    case 'swipeToDelete':
    case 'switchStyle':
    case 'systemButton':
    case 'systemIcon':
    case 'tabBarHidden':
    case 'tabsBackgroundColor':
    case 'tabsBackgroundDisabledColor':
    case 'tabsBackgroundDisabledImage':
    case 'tabsBackgroundFocusedColor':
    case 'tabsBackgroundFocusedImage':
    case 'tabsBackgroundImage':
    case 'tabsBackgroundSelectedColor':
    case 'tabsBackgroundSelectedImage':
    case 'tableViewStyle':
    case 'textAlign':
    case 'textColor':
    case 'textid':
    case 'titleColor':
    case 'titleDisabledColor':
    case 'titleFocusedColor':
    case 'titleHighlightedColor':
    case 'titleSelectedColor':
    case 'tintColor':
    case 'toolbarEnabled':
    case 'top':
    case 'touchEnabled':
    case 'touchFeedback':
    case 'touchFeedbackColor':
    case 'transform':
    case 'transformMatrix':
    case 'transition':
    case 'translationX':
    case 'translationY':
    case 'translationZ':
    case 'translucent':
    case 'type':
    case 'url':
    case 'useSpinner':
    case 'verticalAlign':
    case 'verticalBounce':
    case 'verticalMargin':
    case 'viewShadowColor':
    case 'viewShadowOffset':
    case 'viewShadowRadius':
    case 'visible':
    case 'visibleItems':
    case 'volume':
    case 'width':
    case 'willHandleTouches':
    case 'windowFlags':
    case 'windowPixelFormat':
    case 'windowSoftInputMode':
    case 'wobble':
    case 'zIndex':
    case 'zoomScale':
      return helpers[key](value)

    default: return helpers.customRules(value, key)
  }
}
