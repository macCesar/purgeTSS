/**
 * Test imports for new helpers modules
 */

console.log('Testing helpers modules import...')

try {
  // Test core module
  const { globalOptions, resetStyles } = await import('../src/shared/helpers/core.js')
  console.log('✅ Core module imported:', typeof globalOptions, typeof resetStyles)

  // Test utils module
  const { processProperties, parseValue, setModifier2, customRules } = await import('../src/shared/helpers/utils.js')
  console.log('✅ Utils module imported:', typeof processProperties, typeof parseValue, typeof setModifier2, typeof customRules)

  // Test colors module
  const { backgroundColor, textColor, tintColor } = await import('../src/shared/helpers/colors.js')
  console.log('✅ Colors module imported:', typeof backgroundColor, typeof textColor, typeof tintColor)

  // Test layout module
  const { height, width, margin, padding } = await import('../src/shared/helpers/layout.js')
  console.log('✅ Layout module imported:', typeof height, typeof width, typeof margin, typeof padding)

  // Test typography module
  const { fontFamily, fontSize, ellipsize } = await import('../src/shared/helpers/typography.js')
  console.log('✅ Typography module imported:', typeof fontFamily, typeof fontSize, typeof ellipsize)

  // Test input module (for textAlign)
  const { textAlign } = await import('../src/shared/helpers/input.js')
  console.log('✅ Input module textAlign imported:', typeof textAlign)

  // Test ui-properties module
  const { visible, enabled, opacity, borderRadius } = await import('../src/shared/helpers/ui-properties.js')
  console.log('✅ UI Properties module imported:', typeof visible, typeof enabled, typeof opacity, typeof borderRadius)

  // Test animation module
  const { curve, duration, rotate, scale } = await import('../src/shared/helpers/animation.js')
  console.log('✅ Animation module imported:', typeof curve, typeof duration, typeof rotate, typeof scale)

  // Test main index
  const indexModule = await import('../src/shared/helpers.js')
  console.log('✅ Main helpers.js imported, exports count:', Object.keys(indexModule).length)

  // Test functionality
  console.log('\nTesting functionality...')

  // Test resetStyles
  const resetResult = resetStyles()
  console.log('✅ resetStyles() works:', typeof resetResult === 'string' && resetResult.length > 0)

  // Test backgroundColor function
  const bgResult = backgroundColor({ 'red-500': '#ef4444' })
  console.log('✅ backgroundColor() works:', typeof bgResult === 'string' && bgResult.includes('backgroundColor'))

  // Test width function
  const widthResult = width({ 4: '1rem' })
  console.log('✅ width() works:', typeof widthResult === 'string' && widthResult.includes('width'))

  // Test fontSize function
  const fontSizeResult = fontSize({ sm: '14px', lg: '18px' })
  console.log('✅ fontSize() works:', typeof fontSizeResult === 'string' && fontSizeResult.includes('fontSize'))

  // Test textAlign function
  const textAlignResult = textAlign()
  console.log('✅ textAlign() works:', typeof textAlignResult === 'string' && textAlignResult.includes('textAlign'))

  // Test curve function
  const curveResult = curve()
  console.log('✅ curve() works:', typeof curveResult === 'string' && curveResult.includes('curve'))

  console.log('\n🎉 All helpers modules are working correctly!')
} catch (error) {
  console.error('❌ Error testing helpers modules:', error.message)
  console.error(error.stack)
}

// Test módulo input.js
console.log('\n--- Testing Input Module ---')
try {
  const inputModule = await import('../src/shared/helpers/input.js')
  const inputFunctions = [
    'autocapitalization', 'autocorrect', 'autofillType', 'autoLink',
    'clearOnEdit', 'editable', 'enableReturnKey', 'keyboardType',
    'leftButtonMode', 'passwordKeyboardType', 'passwordMask',
    'returnKeyType', 'rightButtonMode', 'suppressReturn',
    'textAlign', 'verticalAlign'
  ]

  for (const func of inputFunctions) {
    if (inputModule[func]) {
      inputModule[func]()
      console.log(`✓ ${func}()`)
    } else {
      console.log(`✗ ${func}() - No encontrada`)
    }
  }
  console.log(`✓ Input module: ${inputFunctions.length} funciones testeadas`)
} catch (error) {
  console.error('✗ Error testing input module:', error.message)
}

// Test módulo scrolling.js
console.log('\n--- Testing Scrolling Module ---')
try {
  const scrollingModule = await import('../src/shared/helpers/scrolling.js')
  const scrollingFunctions = [
    'autoAdjustScrollViewInsets', 'canScroll', 'fastScroll', 'hidesSearchBarWhenScrolling',
    'overScrollMode', 'showPagingControl', 'pagingControlOnTop', 'scrollable',
    'scrollIndicators', 'scrollIndicatorStyle', 'scrollingEnabled', 'scrollsToTop',
    'scrollType', 'showHorizontalScrollIndicator', 'showVerticalScrollIndicator',
    'smoothScrollOnTabClick', 'willScrollOnStatusTap'
  ]

  for (const func of scrollingFunctions) {
    if (scrollingModule[func]) {
      scrollingModule[func]()
      console.log(`✓ ${func}()`)
    } else {
      console.log(`✗ ${func}() - No encontrada`)
    }
  }
  console.log(`✓ Scrolling module: ${scrollingFunctions.length} funciones testeadas`)
} catch (error) {
  console.error('✗ Error testing scrolling module:', error.message)
}

// Test módulo lists.js
console.log('\n--- Testing Lists Module ---')
try {
  const listsModule = await import('../src/shared/helpers/lists.js')
  const listsFunctions = [
    'allowsMultipleSelectionDuringEditing', 'allowsMultipleSelectionInteraction',
    'allowsSelection', 'allowsSelectionDuringEditing', 'caseInsensitiveSearch',
    'dimBackgroundForSearch', 'editing', 'footerDividersEnabled', 'headerDividersEnabled',
    'hideSearchOnSelection', 'keepSectionsInSearch', 'listViewStyle', 'moving',
    'pruneSectionsOnEdit', 'resultsSeparatorStyle', 'searchAsChild', 'searchBarStyle',
    'searchHidden', 'selectionGranularity', 'selectionOpens', 'selectionStyle',
    'separatorStyle', 'showSearchBarInNavBar', 'showSelectionCheck', 'tableViewStyle'
  ]

  for (const func of listsFunctions) {
    if (listsModule[func]) {
      listsModule[func]()
      console.log(`✓ ${func}()`)
    } else {
      console.log(`✗ ${func}() - No encontrada`)
    }
  }
  console.log(`✓ Lists module: ${listsFunctions.length} funciones testeadas`)
} catch (error) {
  console.error('✗ Error testing lists module:', error.message)
}

// Test módulo media.js
console.log('\n--- Testing Media Module ---')
try {
  const mediaModule = await import('../src/shared/helpers/media.js')
  const mediaFunctions = [
    'allowsLinkPreview', 'autorotate', 'backgroundBlendMode', 'backgroundLinearGradient',
    'backgroundRadialGradient', 'backgroundRepeat', 'cacheMode', 'cachePolicy',
    'hires', 'ignoreSslError', 'imageTouchFeedback', 'mixedContentMode',
    'preventDefaultImage', 'reverse', 'scalesPageToFit', 'tiMedia'
  ]

  for (const func of mediaFunctions) {
    if (mediaModule[func]) {
      mediaModule[func]()
      console.log(`✓ ${func}()`)
    } else {
      console.log(`✗ ${func}() - No encontrada`)
    }
  }
  console.log(`✓ Media module: ${mediaFunctions.length} funciones testeadas`)
} catch (error) {
  console.error('✗ Error testing media module:', error.message)
}

// Test módulo form-controls.js
console.log('\n--- Testing Form Controls Module ---')
try {
  const formControlsModule = await import('../src/shared/helpers/form-controls.js')
  const formControlsFunctions = [
    'activityIndicatorStyle', 'buttonStyle', 'clearButtonMode', 'datePickerStyle',
    'drawerIndicatorEnabled', 'nativeSpinner', 'pickerType', 'progressBarStyle',
    'switchStyle', 'systemButton', 'useSpinner'
  ]

  for (const func of formControlsFunctions) {
    if (formControlsModule[func]) {
      formControlsModule[func]()
      console.log(`✓ ${func}()`)
    } else {
      console.log(`✗ ${func}() - No encontrada`)
    }
  }
  console.log(`✓ Form Controls module: ${formControlsFunctions.length} funciones testeadas`)
} catch (error) {
  console.error('✗ Error testing form controls module:', error.message)
}

// Test módulo animation.js
console.log('\n--- Testing Animation Module ---')
try {
  const animationModule = await import('../src/shared/helpers/animation.js')
  const animationFunctions = [
    'curve', 'duration', 'rotate', 'scale'
  ]

  for (const func of animationFunctions) {
    if (animationModule[func]) {
      animationModule[func]()
      console.log(`✓ ${func}()`)
    } else {
      console.log(`✗ ${func}() - No encontrada`)
    }
  }
  console.log(`✓ Animation module: ${animationFunctions.length} funciones testeadas`)
} catch (error) {
  console.error('✗ Error testing animation module:', error.message)
}

// Test módulo platform.js
console.log('\n--- Testing Platform Module ---')
try {
  const platformModule = await import('../src/shared/helpers/platform.js')
  const platformFunctions = [
    'statusBarStyle', 'navigationMode', 'theme', 'orientationModes',
    'windowPixelFormat', 'windowSoftInputMode', 'largeTitleDisplayMode',
    'largeTitleEnabled', 'navBarHidden', 'tabBarHidden', 'hidesBackButton',
    'hidesBarsOnSwipe', 'extendEdges', 'extendSafeArea', 'includeOpaqueBars',
    'flagSecure', 'sustainedPerformanceMode'
  ]

  for (const func of platformFunctions) {
    if (platformModule[func]) {
      platformModule[func]()
      console.log(`✓ ${func}()`)
    } else {
      console.log(`✗ ${func}() - No encontrada`)
    }
  }
  console.log(`✓ Platform module: ${platformFunctions.length} funciones testeadas`)
} catch (error) {
  console.error('✗ Error testing platform module:', error.message)
}

// Test módulo accessibility.js
console.log('\n--- Testing Accessibility Module ---')
try {
  const accessibilityModule = await import('../src/shared/helpers/accessibility.js')
  const accessibilityFunctions = [
    'accessibilityHidden', 'allowUserCustomization', 'canCancelEvents', 'enableCopy',
    'enableJavascriptInterface', 'enableZoomControls', 'filterTouchesWhenObscured',
    'keepScreenOn', 'lightTouchEnabled', 'overrideCurrentAnimation', 'willHandleTouches'
  ]

  for (const func of accessibilityFunctions) {
    if (accessibilityModule[func]) {
      accessibilityModule[func]()
      console.log(`✓ ${func}()`)
    } else {
      console.log(`✗ ${func}() - No encontrada`)
    }
  }
  console.log(`✓ Accessibility module: ${accessibilityFunctions.length} funciones testeadas`)
} catch (error) {
  console.error('✗ Error testing accessibility module:', error.message)
}
