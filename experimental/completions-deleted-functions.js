

//! Soon to be removed
function getBaseValuesXXX(defaultTheme) {
	console.log('get Base Values 1');
	const defaultColors = require('tailwindcss/colors');
	const defaultThemeWidth = defaultTheme.width({ theme: () => (defaultTheme.spacing) });
	const defaultThemeHeight = defaultTheme.height({ theme: () => (defaultTheme.spacing) });

	removeDeprecatedColors(defaultColors);

	// !Prepare values
	let tiResets = { full: '100%' };
	let allWidthsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth };
	let allHeightsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeHeight };
	let allSpacingCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth, ...defaultThemeHeight };

	let themeOrDefaultValues = {
		width: configFile.theme.width ?? allWidthsCombined,
		height: configFile.theme.height ?? allHeightsCombined,
		spacing: configFile.theme.spacing ?? allSpacingCombined,
		fontSize: configFile.theme.spacing ?? defaultTheme.fontSize,
		colors: configFile.theme.colors ?? { transparent: 'transparent', ...defaultColors },
	}

	removeUnnecesaryValues(themeOrDefaultValues);

	//! Merge with extend values
	let base = {
		width: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing, ...themeOrDefaultValues.width, ...configFile.theme.extend.width },
		height: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing, ...themeOrDefaultValues.height, ...configFile.theme.extend.height },
		colors: { ...themeOrDefaultValues.colors, ...configFile.theme.extend.colors },
		spacing: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing },
		fontSize: { ...themeOrDefaultValues.fontSize, ...configFile.theme.extend.spacing, ...configFile.theme.extend.fontSize },
		columns: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
		delay: { 0: '0ms', 25: '25ms', 50: '50ms', 250: '250ms', 350: '350ms', 400: '400ms', 450: '450ms', 600: '600ms', 800: '800ms', 900: '900ms', 2000: '2000ms', 3000: '3000ms', 4000: '4000ms', 5000: '5000ms' }
	};

	fixPercentages(base.width);
	fixPercentages(base.height);
	fixPercentages(base.spacing);

	return base;
}

function getBaseValuesYYY(defaultTheme) {
	console.log('get Base Values 2');
	console.log('configFile getBaseValues:', JSON.stringify(configFile));
	const defaultColors = require('tailwindcss/colors');
	const defaultThemeWidth = defaultTheme.width({ theme: () => (defaultTheme.spacing) });
	const defaultThemeHeight = defaultTheme.height({ theme: () => (defaultTheme.spacing) });

	removeDeprecatedColors(defaultColors);

	// !Prepare values
	let tiResets = { full: '100%' };
	let allWidthsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth };
	let allHeightsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeHeight };
	let allSpacingCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth, ...defaultThemeHeight };

	let themeOrDefaultValues = {
		width: configFile.theme.width ?? allWidthsCombined,
		height: configFile.theme.height ?? allHeightsCombined,
		spacing: configFile.theme.spacing ?? allSpacingCombined,
		fontSize: configFile.theme.spacing ?? defaultTheme.fontSize,
		colors: configFile.theme.colors ?? { transparent: 'transparent', ...defaultColors },
	}
	//
	removeUnnecesaryValues(themeOrDefaultValues);

	//! Merge with extend values
	let base = {
		width: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing, ...themeOrDefaultValues.width, ...configFile.theme.extend.width },
		height: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing, ...themeOrDefaultValues.height, ...configFile.theme.extend.height },
		colors: { ...themeOrDefaultValues.colors, ...configFile.theme.extend.colors },
		spacing: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing },
		fontSize: { ...themeOrDefaultValues.fontSize, ...configFile.theme.extend.spacing, ...configFile.theme.extend.fontSize },
		columns: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
		delay: { 0: '0ms', 25: '25ms', 50: '50ms', 250: '250ms', 350: '350ms', 400: '400ms', 450: '450ms', 600: '600ms', 800: '800ms', 900: '900ms', 2000: '2000ms', 3000: '3000ms', 4000: '4000ms', 5000: '5000ms' }
	};

	fixPercentages(base.width);
	fixPercentages(base.height);
	fixPercentages(base.spacing);

	return base;
}

function createPurgeAlloy(base) {
	let alloyModules = [];
	_.each(alloyCompletionsFile.tags, (value, key) => {
		if (tiCompletionsFile.types[value.apiName]) {
			alloyModules.push(value.apiName);
		}
	});

	alloyModules.sort();

	let alloyTypes = {};
	_.each(alloyModules, property => {
		alloyTypes[property] = tiCompletionsFile.types[property];
	});

	let alloyProperties = getProperties(alloyTypes);
	let alloyClasses = processProperties(alloyProperties, base);

	makeSureFolderExists(__dirname + '/auto-generated');

	fs.writeFileSync(path.resolve(__dirname, 'auto-generated/alloy-classes.tss'), alloyClasses);
	fs.writeFileSync(path.resolve(__dirname, 'auto-generated/alloy-modules.json'), JSON.stringify(alloyModules));
	fs.writeFileSync(path.resolve(__dirname, 'auto-generated/alloy-properties.json'), JSON.stringify(alloyProperties));

	return alloyClasses;
}

function combineAllValuesXXX(base, defaultTheme) {
	console.log('combineAllValues 1');
	let allValues = {};

	//! Custom Window, View and ImageView
	allValues.Window = (configFile.theme.Window && configFile.theme.Window.apply)
		? _.merge({ apply: configFile.theme.Window.apply }, configFile.theme.Window)
		: _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window);

	allValues.ImageView = (configFile.theme.ImageView && configFile.theme.ImageView.apply)
		? _.merge({ apply: configFile.theme.ImageView.apply }, { ios: { hires: true } }, configFile.theme.ImageView)
		: _.merge({ ios: { hires: true } }, configFile.theme.ImageView);

	allValues.View = (configFile.theme.View && configFile.theme.View.apply)
		? _.merge({ apply: configFile.theme.View.apply }, configFile.theme.View)
		: _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View);

	//! Width, height and margin properties
	// INFO: sizingProperties: For glossary generator only... Do not move from this position.
	allValues.sizingProperties = {};

	allValues.height = base.height;
	allValues.width = base.width;
	allValues.margin = combineKeys(configFile.theme, base.spacing, 'margin');
	allValues.marginAlternate = combineKeys(configFile.theme, base.spacing, 'margin');

	//! Properties with constant values
	// INFO: constantProperties: For glossary generator only... Do not move from this position.
	allValues.constantProperties = {};

	// allValues.audioStreamType = {};
	// allValues.category = {};
	allValues.accessibilityHidden = {};
	allValues.accessoryType = {};
	allValues.activeIconIsMask = {};
	allValues.activityEnterTransition = {};
	allValues.activityExitTransition = {};
	allValues.activityIndicatorStyle = {};
	allValues.activityReenterTransition = {};
	allValues.activityReturnTransition = {};
	allValues.activitySharedElementEnterTransition = {};
	allValues.activitySharedElementExitTransition = {};
	allValues.activitySharedElementReenterTransition = {};
	allValues.activitySharedElementReturnTransition = {};
	allValues.alertDialogStyle = {};
	allValues.allowsBackForwardNavigationGestures = {};
	allValues.allowsLinkPreview = {};
	allValues.allowsMultipleSelectionDuringEditing = {};
	allValues.allowsMultipleSelectionInteraction = {};
	allValues.allowsSelection = {};
	allValues.allowsSelectionDuringEditing = {};
	allValues.allowUserCustomization = {};
	allValues.anchorPoint = {};
	allValues.autoAdjustScrollViewInsets = {};
	allValues.autocapitalization = {};
	allValues.autocorrect = {};
	allValues.autofillType = {};
	allValues.autoLink = {};
	allValues.autoreverse = {};
	allValues.autorotate = {};
	allValues.backgroundBlendMode = {};
	allValues.backgroundLinearGradient = {};
	allValues.backgroundRadialGradient = {};
	allValues.backgroundRepeat = {};
	allValues.borderStyle = {};
	allValues.bubbleParent = {};
	allValues.buttonStyle = {};
	allValues.cacheMode = {};
	allValues.cachePolicy = {};
	allValues.calendarViewShown = {};
	allValues.canCancelEvents = {};
	allValues.cancelable = {};
	allValues.canceledOnTouchOutside = {};
	allValues.canDelete = {};
	allValues.canEdit = {};
	allValues.canInsert = {};
	allValues.canMove = {};
	allValues.canScroll = {};
	allValues.caseInsensitiveSearch = {};
	allValues.checkable = {};
	allValues.clearButtonMode = {};
	allValues.clearOnEdit = {};
	allValues.clipMode = {};
	allValues.constraint = {};
	allValues.contentHeightAndWidth = {};
	allValues.curve = {};
	allValues.datePickerStyle = {};
	allValues.defaultItemTemplate = {};
	allValues.dimBackgroundForSearch = {};
	allValues.disableBounce = {};
	allValues.disableContextMenu = {};
	allValues.displayCaps = {};
	allValues.displayHomeAsUp = {};
	allValues.draggingType = {};
	allValues.drawerIndicatorEnabled = {};
	allValues.drawerLockMode = {};
	allValues.dropShadow = {};
	allValues.duration = {};
	allValues.editable = {};
	allValues.editing = {};
	allValues.ellipsize = {};
	allValues.enableCopy = {};
	allValues.enabled = {};
	allValues.enableJavascriptInterface = {};
	allValues.enableReturnKey = {};
	allValues.enableZoomControls = {};
	allValues.exitOnClose = {};
	allValues.extendBackground = {};
	allValues.extendEdges = {};
	allValues.extendSafeArea = {};
	allValues.fastScroll = {};
	allValues.filterAnchored = {};
	allValues.filterAttribute = {};
	allValues.filterCaseInsensitive = {};
	allValues.filterTouchesWhenObscured = {};
	allValues.flags = {};
	allValues.flagSecure = {};
	allValues.flip = {};
	allValues.focusable = {};
	allValues.fontStyle = {};
	allValues.footerDividersEnabled = {};
	allValues.format24 = {};
	allValues.fullscreen = {};
	allValues.gravity = {};
	allValues.gridColumnsRowsStartEnd = {};
	allValues.gridFlow = {};
	allValues.gridSystem = {};
	allValues.hasCheck = {};
	allValues.hasChild = {};
	allValues.hasDetail = {};
	allValues.headerDividersEnabled = {};
	allValues.hiddenBehavior = {};
	allValues.hideLoadIndicator = {};
	allValues.hidesBackButton = {};
	allValues.hidesBarsOnSwipe = {};
	allValues.hidesBarsOnTap = {};
	allValues.hidesBarsWhenKeyboardAppears = {};
	allValues.hideSearchOnSelection = {};
	allValues.hideShadow = {};
	allValues.hidesSearchBarWhenScrolling = {};
	allValues.hintType = {};
	allValues.hires = {};
	allValues.homeButtonEnabled = {};
	allValues.homeIndicatorAutoHidden = {};
	allValues.horizontalMargin = {};
	allValues.horizontalWrap = {};
	allValues.html = {};
	allValues.icon = {};
	allValues.iconified = {};
	allValues.iconifiedByDefault = {};
	allValues.iconIsMask = {};
	allValues.ignoreSslError = {};
	allValues.imageTouchFeedback = {};
	allValues.includeFontPadding = {};
	allValues.includeOpaqueBars = {};
	allValues.inputType = {};
	allValues.items = {};
	allValues.keepScreenOn = {};
	allValues.keepSectionsInSearch = {};
	allValues.keyboardAppearance = {};
	allValues.keyboardDismissMode = {};
	allValues.keyboardDisplayRequiresUserAction = {};
	allValues.keyboardType = {};
	allValues.largeTitleDisplayMode = {};
	allValues.largeTitleEnabled = {};
	allValues.layout = {};
	allValues.lazyLoadingEnabled = {};
	allValues.leftButtonMode = {};
	allValues.leftDrawerLockMode = {};
	allValues.lightTouchEnabled = {};
	allValues.listViewStyle = {};
	allValues.location = {};
	allValues.loginKeyboardType = {};
	allValues.loginReturnKeyType = {};
	allValues.mixedContentMode = {};
	allValues.modal = {};
	allValues.moveable = {};
	allValues.moving = {};
	allValues.nativeSpinner = {};
	allValues.navBarHidden = {};
	allValues.navigationMode = {};
	allValues.orientationModes = {};
	allValues.overlayEnabled = {};
	allValues.overrideCurrentAnimation = {};
	allValues.overScrollMode = {};
	allValues.pagingControlOnTop = {};
	allValues.passwordKeyboardType = {};
	allValues.passwordMask = {};
	allValues.pickerType = {};
	allValues.placement = {};
	allValues.pluginState = {};
	allValues.preventCornerOverlap = {};
	allValues.preventDefaultImage = {};
	allValues.previewActionStyle = {};
	allValues.progressBarStyle = {};
	allValues.progressIndicatorType = {};
	allValues.pruneSectionsOnEdit = {};
	allValues.requestedOrientation = {};
	allValues.resultsSeparatorStyle = {};
	allValues.returnKeyType = {};
	allValues.reverse = {};
	allValues.rightButtonMode = {};
	allValues.rightDrawerLockMode = {};
	allValues.scalesPageToFit = {};
	allValues.scrollable = {};
	allValues.scrollIndicators = {};
	allValues.scrollIndicatorStyle = {};
	allValues.scrollingEnabled = {};
	allValues.scrollsToTop = {};
	allValues.scrollType = {};
	allValues.searchAsChild = {};
	allValues.searchBarStyle = {};
	allValues.searchHidden = {};
	allValues.selectionGranularity = {};
	allValues.selectionOpens = {};
	allValues.selectionStyle = {};
	allValues.separatorStyle = {};
	allValues.shiftMode = {};
	allValues.showAsAction = {};
	allValues.showBookmark = {};
	allValues.showCancel = {};
	allValues.showHorizontalScrollIndicator = {};
	allValues.showPagingControl = {};
	allValues.showSearchBarInNavBar = {};
	allValues.showSelectionCheck = {};
	allValues.showUndoRedoActions = {};
	allValues.showVerticalScrollIndicator = {};
	allValues.smoothScrollOnTabClick = {};
	allValues.statusBarStyle = {};
	allValues.submitEnabled = {};
	allValues.suppressReturn = {};
	allValues.sustainedPerformanceMode = {};
	allValues.swipeToClose = {};
	allValues.switchStyle = {};
	allValues.systemButton = {};
	allValues.tabBarHidden = {};
	allValues.tabbedBarStyle = {};
	allValues.tabGroupStyle = {};
	allValues.tableViewStyle = {};
	allValues.tabsTranslucent = {};
	allValues.textAlign = {};
	allValues.theme = {};
	allValues.tiMedia = {};
	allValues.titleAttributesShadow = {};
	allValues.toolbarEnabled = {};
	allValues.touchEnabled = {};
	allValues.touchFeedback = {};
	allValues.transition = {};
	allValues.translucent = {};
	allValues.useCompatPadding = {};
	allValues.useSpinner = {};
	allValues.verticalAlign = {};
	allValues.verticalBounce = {};
	allValues.verticalMargin = {};
	allValues.viewShadow = {};
	allValues.visible = {};
	allValues.willHandleTouches = {};
	allValues.willScrollOnStatusTap = {};
	allValues.windowPixelFormat = {};
	allValues.windowSoftInputMode = {};
	allValues.wobble = {};

	//! Configurable properties
	// INFO: configurableProperties: For glossary generator only... Do not move from this position.
	allValues.configurableProperties = {};

	allValues.activeTab = combineKeys(configFile.theme, base.columns, 'activeTab');
	allValues.backgroundLeftCap = combineKeys(configFile.theme, base.spacing, 'backgroundLeftCap');
	allValues.backgroundPaddingBottom = combineKeys(configFile.theme, base.height, 'backgroundPaddingBottom');
	allValues.backgroundPaddingLeft = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingLeft');
	allValues.backgroundPaddingRight = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingRight');
	allValues.backgroundPaddingTop = combineKeys(configFile.theme, base.height, 'backgroundPaddingTop');
	allValues.backgroundTopCap = combineKeys(configFile.theme, base.spacing, 'backgroundTopCap');
	allValues.borderRadius = combineKeys(configFile.theme, (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, 'borderRadius');
	allValues.borderWidth = combineKeys(configFile.theme, defaultTheme.borderWidth, 'borderWidth');
	allValues.bottomNavigation = combineKeys(configFile.theme, base.spacing, 'bottomNavigation');
	allValues.cacheSize = combineKeys(configFile.theme, base.columns, 'cacheSize');
	allValues.columnCount = combineKeys(configFile.theme, base.columns, 'columnCount');
	allValues.contentHeight = combineKeys(configFile.theme, base.height, 'contentHeight');
	allValues.contentWidth = combineKeys(configFile.theme, base.width, 'contentWidth');
	allValues.countDownDuration = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDuration }, 'countDownDuration');
	allValues.elevation = combineKeys(configFile.theme, base.spacing, 'elevation');
	allValues.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily');
	allValues.fontSize = combineKeys(configFile.theme, base.fontSize, 'fontSize');
	allValues.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight');
	allValues.gap = combineKeys(configFile.theme, base.spacing, 'margin');
	allValues.indentionLevel = combineKeys(configFile.theme, base.spacing, 'indentionLevel');
	allValues.keyboardToolbarHeight = combineKeys(configFile.theme, base.height, 'keyboardToolbarHeight');
	allValues.leftButtonPadding = combineKeys(configFile.theme, base.spacing, 'leftButtonPadding');
	allValues.leftWidth = combineKeys(configFile.theme, base.width, 'leftWidth');
	allValues.lines = combineKeys(configFile.theme, base.columns, 'lines');
	allValues.maxElevation = combineKeys(configFile.theme, base.spacing, 'maxElevation');
	allValues.maxLines = combineKeys(configFile.theme, base.columns, 'maxLines');
	allValues.maxRowHeight = combineKeys(configFile.theme, base.height, 'maxRowHeight');
	allValues.maxZoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'maxZoomScale');
	allValues.minimumFontSize = combineKeys(configFile.theme, defaultTheme.fontSize, 'minimumFontSize');
	allValues.minRowHeight = combineKeys(configFile.theme, base.height, 'minRowHeight');
	allValues.minZoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'minZoomScale');
	allValues.offsets = combineKeys(configFile.theme, base.height, 'offsets');
	allValues.opacity = combineKeys(configFile.theme, defaultTheme.opacity, 'opacity');
	allValues.padding = combineKeys(configFile.theme, base.spacing, 'padding');
	allValues.pagingControlAlpha = combineKeys(configFile.theme, defaultTheme.opacity, 'pagingControlAlpha');
	allValues.pagingControlHeight = combineKeys(configFile.theme, base.height, 'pagingControlHeight');
	allValues.pagingControlTimeout = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'pagingControlTimeout');
	allValues.repeat = combineKeys(configFile.theme, base.columns, 'repeat');
	allValues.repeatCount = combineKeys(configFile.theme, base.columns, 'repeatCount');
	allValues.rightButtonPadding = combineKeys(configFile.theme, base.spacing, 'rightButtonPadding');
	allValues.rightWidth = combineKeys(configFile.theme, base.width, 'rightWidth');
	allValues.rotate = combineKeys(configFile.theme, defaultTheme.rotate, 'rotate');
	allValues.rowCount = combineKeys(configFile.theme, base.columns, 'rowCount');
	allValues.rowHeight = combineKeys(configFile.theme, base.height, 'rowHeight');
	allValues.scale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'scale');
	allValues.sectionHeaderTopPadding = combineKeys(configFile.theme, base.height, 'sectionHeaderTopPadding');
	allValues.separatorHeight = combineKeys(configFile.theme, base.height, 'separatorHeight');
	allValues.shadowRadius = combineKeys(configFile.theme, base.spacing, 'shadowRadius');
	allValues.timeout = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'timeout');
	allValues.transitionDelay = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'transitionDelay');
	allValues.transitionDuration = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDuration }, 'transitionDuration');
	allValues.zIndex = combineKeys(configFile.theme, defaultTheme.zIndex, 'zIndex');
	allValues.zoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'zoomScale');

	//! Color related properties
	// INFO: colorProperties: For glossary generator only... Do not move from this position.
	allValues.colorProperties = {};

	allValues.activeTintColor = combineKeys(configFile.theme, base.colors, 'activeTintColor');
	allValues.activeTitleColor = combineKeys(configFile.theme, base.colors, 'activeTitleColor');
	allValues.backgroundColor = combineKeys(configFile.theme, base.colors, 'backgroundColor');
	allValues.backgroundDisabledColor = combineKeys(configFile.theme, base.colors, 'backgroundDisabledColor');
	allValues.backgroundFocusedColor = combineKeys(configFile.theme, base.colors, 'backgroundFocusedColor');
	allValues.backgroundGradient = combineKeys(configFile.theme, base.colors, 'backgroundGradient');
	allValues.backgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'backgroundSelectedColor');
	allValues.backgroundSelectedGradient = combineKeys(configFile.theme, base.colors, 'backgroundSelectedGradient');
	allValues.badgeColor = combineKeys(configFile.theme, base.colors, 'badgeColor');
	allValues.barColor = combineKeys(configFile.theme, base.colors, 'barColor');
	allValues.borderColor = combineKeys(configFile.theme, base.colors, 'borderColor');
	allValues.currentPageIndicatorColor = combineKeys(configFile.theme, base.colors, 'currentPageIndicatorColor');
	allValues.dateTimeColor = combineKeys(configFile.theme, base.colors, 'dateTimeColor');
	allValues.disabledColor = combineKeys(configFile.theme, base.colors, 'disabledColor');
	allValues.highlightedColor = combineKeys(configFile.theme, base.colors, 'highlightedColor');
	allValues.hintTextColor = combineKeys(configFile.theme, base.colors, 'hintTextColor');
	allValues.imageTouchFeedbackColor = combineKeys(configFile.theme, base.colors, 'imageTouchFeedbackColor');
	allValues.indicatorColor = combineKeys(configFile.theme, base.colors, 'indicatorColor');
	allValues.keyboardToolbarColor = combineKeys(configFile.theme, base.colors, 'keyboardToolbarColor');
	allValues.navTintColor = combineKeys(configFile.theme, base.colors, 'navTintColor');
	allValues.onTintColor = combineKeys(configFile.theme, base.colors, 'onTintColor');
	allValues.pageIndicatorColor = combineKeys(configFile.theme, base.colors, 'pageIndicatorColor');
	allValues.pagingControlColor = combineKeys(configFile.theme, base.colors, 'pagingControlColor');
	allValues.placeholder = combineKeys(configFile.theme, base.colors, 'placeholder');
	allValues.pullBackgroundColor = combineKeys(configFile.theme, base.colors, 'pullBackgroundColor');
	allValues.resultsBackgroundColor = combineKeys(configFile.theme, base.colors, 'resultsBackgroundColor');
	allValues.resultsSeparatorColor = combineKeys(configFile.theme, base.colors, 'resultsSeparatorColor');
	allValues.selectedButtonColor = combineKeys(configFile.theme, base.colors, 'selectedButtonColor');
	allValues.selectedColor = combineKeys(configFile.theme, base.colors, 'selectedColor');
	allValues.selectedSubtitleColor = combineKeys(configFile.theme, base.colors, 'selectedSubtitleColor');
	allValues.selectedTextColor = combineKeys(configFile.theme, base.colors, 'selectedTextColor');
	allValues.separatorColor = combineKeys(configFile.theme, base.colors, 'separatorColor');
	allValues.shadowColor = combineKeys(configFile.theme, base.colors, 'shadowColor');
	allValues.subtitleColor = combineKeys(configFile.theme, base.colors, 'subtitleColor');
	allValues.tabsBackgroundColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundColor');
	allValues.tabsBackgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundSelectedColor');
	allValues.textColor = combineKeys(configFile.theme, base.colors, 'textColor');
	allValues.thumbTintColor = combineKeys(configFile.theme, base.colors, 'thumbTintColor');
	allValues.tintColor = combineKeys(configFile.theme, base.colors, 'tintColor');
	allValues.titleAttributesColor = combineKeys(configFile.theme, base.colors, 'titleAttributesColor');
	allValues.titleAttributesShadowColor = combineKeys(configFile.theme, base.colors, 'titleAttributesShadowColor');
	allValues.titleColor = combineKeys(configFile.theme, base.colors, 'titleColor');
	allValues.titleTextColor = combineKeys(configFile.theme, base.colors, 'titleTextColor');
	allValues.touchFeedbackColor = combineKeys(configFile.theme, base.colors, 'touchFeedbackColor');
	allValues.trackTintColor = combineKeys(configFile.theme, base.colors, 'trackTintColor');
	allValues.viewShadowColor = combineKeys(configFile.theme, base.colors, 'viewShadowColor');

	// !Some final cleanup
	delete configFile.theme.extend;
	delete configFile.theme.colors;
	delete configFile.theme.spacing;

	if (!Object.keys(allValues.fontFamily).length) {
		delete allValues.fontFamily;
		delete configFile.theme.fontFamily;
	}

	// !Delete corePlugins specified in the config file
	let corePlugins = Array.isArray(configFile.corePlugins) ? configFile.corePlugins : Object.keys(configFile.corePlugins).map(key => key);
	_.each(corePlugins, value => {
		delete allValues[value];
		delete configFile.theme[value];
	});

	_.each(allValues, (value, key) => {
		delete configFile.theme[key];
	});

	return allValues;
}

function combineAllValuesYYY(base, defaultTheme) {
	console.log('combineAllValues 2');
	let allValues = {};

	//! Custom Window, View and ImageView
	allValues.Window = (configFile.theme.Window && configFile.theme.Window.apply)
		? _.merge({ apply: configFile.theme.Window.apply }, configFile.theme.Window)
		: _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window);

	allValues.ImageView = (configFile.theme.ImageView && configFile.theme.ImageView.apply)
		? _.merge({ apply: configFile.theme.ImageView.apply }, { ios: { hires: true } }, configFile.theme.ImageView)
		: _.merge({ ios: { hires: true } }, configFile.theme.ImageView);

	allValues.View = (configFile.theme.View && configFile.theme.View.apply)
		? _.merge({ apply: configFile.theme.View.apply }, configFile.theme.View)
		: _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View);

	//! Width, height and margin properties
	// INFO: sizingProperties: For glossary generator only... Do not move from this position.
	allValues.sizingProperties = {};

	allValues.height = base.height;
	allValues.width = base.width;
	allValues.margin = combineKeys(configFile.theme, base.spacing, 'margin');
	allValues.marginAlternate = combineKeys(configFile.theme, base.spacing, 'margin');

	//! Properties with constant values
	// INFO: constantProperties: For glossary generator only... Do not move from this position.
	allValues.constantProperties = {};

	// allValues.audioStreamType = {};
	// allValues.category = {};
	allValues.accessibilityHidden = {};
	allValues.accessoryType = {};
	allValues.activeIconIsMask = {};
	allValues.activityEnterTransition = {};
	allValues.activityExitTransition = {};
	allValues.activityIndicatorStyle = {};
	allValues.activityReenterTransition = {};
	allValues.activityReturnTransition = {};
	allValues.activitySharedElementEnterTransition = {};
	allValues.activitySharedElementExitTransition = {};
	allValues.activitySharedElementReenterTransition = {};
	allValues.activitySharedElementReturnTransition = {};
	allValues.alertDialogStyle = {};
	allValues.allowsBackForwardNavigationGestures = {};
	allValues.allowsLinkPreview = {};
	allValues.allowsMultipleSelectionDuringEditing = {};
	allValues.allowsMultipleSelectionInteraction = {};
	allValues.allowsSelection = {};
	allValues.allowsSelectionDuringEditing = {};
	allValues.allowUserCustomization = {};
	allValues.anchorPoint = {};
	allValues.autoAdjustScrollViewInsets = {};
	allValues.autocapitalization = {};
	allValues.autocorrect = {};
	allValues.autofillType = {};
	allValues.autoLink = {};
	allValues.autoreverse = {};
	allValues.autorotate = {};
	allValues.backgroundBlendMode = {};
	allValues.backgroundLinearGradient = {};
	allValues.backgroundRadialGradient = {};
	allValues.backgroundRepeat = {};
	allValues.borderStyle = {};
	allValues.bubbleParent = {};
	allValues.buttonStyle = {};
	allValues.cacheMode = {};
	allValues.cachePolicy = {};
	allValues.calendarViewShown = {};
	allValues.canCancelEvents = {};
	allValues.cancelable = {};
	allValues.canceledOnTouchOutside = {};
	allValues.canDelete = {};
	allValues.canEdit = {};
	allValues.canInsert = {};
	allValues.canMove = {};
	allValues.canScroll = {};
	allValues.caseInsensitiveSearch = {};
	allValues.checkable = {};
	allValues.clearButtonMode = {};
	allValues.clearOnEdit = {};
	allValues.clipMode = {};
	allValues.constraint = {};
	allValues.contentHeightAndWidth = {};
	allValues.curve = {};
	allValues.datePickerStyle = {};
	allValues.defaultItemTemplate = {};
	allValues.dimBackgroundForSearch = {};
	allValues.disableBounce = {};
	allValues.disableContextMenu = {};
	allValues.displayCaps = {};
	allValues.displayHomeAsUp = {};
	allValues.draggingType = {};
	allValues.drawerIndicatorEnabled = {};
	allValues.drawerLockMode = {};
	allValues.dropShadow = {};
	allValues.duration = {};
	allValues.editable = {};
	allValues.editing = {};
	allValues.ellipsize = {};
	allValues.enableCopy = {};
	allValues.enabled = {};
	allValues.enableJavascriptInterface = {};
	allValues.enableReturnKey = {};
	allValues.enableZoomControls = {};
	allValues.exitOnClose = {};
	allValues.extendBackground = {};
	allValues.extendEdges = {};
	allValues.extendSafeArea = {};
	allValues.fastScroll = {};
	allValues.filterAnchored = {};
	allValues.filterAttribute = {};
	allValues.filterCaseInsensitive = {};
	allValues.filterTouchesWhenObscured = {};
	allValues.flags = {};
	allValues.flagSecure = {};
	allValues.flip = {};
	allValues.focusable = {};
	allValues.fontStyle = {};
	allValues.footerDividersEnabled = {};
	allValues.format24 = {};
	allValues.fullscreen = {};
	allValues.gravity = {};
	allValues.gridColumnsRowsStartEnd = {};
	allValues.gridFlow = {};
	allValues.gridSystem = {};
	allValues.hasCheck = {};
	allValues.hasChild = {};
	allValues.hasDetail = {};
	allValues.headerDividersEnabled = {};
	allValues.hiddenBehavior = {};
	allValues.hideLoadIndicator = {};
	allValues.hidesBackButton = {};
	allValues.hidesBarsOnSwipe = {};
	allValues.hidesBarsOnTap = {};
	allValues.hidesBarsWhenKeyboardAppears = {};
	allValues.hideSearchOnSelection = {};
	allValues.hideShadow = {};
	allValues.hidesSearchBarWhenScrolling = {};
	allValues.hintType = {};
	allValues.hires = {};
	allValues.homeButtonEnabled = {};
	allValues.homeIndicatorAutoHidden = {};
	allValues.horizontalMargin = {};
	allValues.horizontalWrap = {};
	allValues.html = {};
	allValues.icon = {};
	allValues.iconified = {};
	allValues.iconifiedByDefault = {};
	allValues.iconIsMask = {};
	allValues.ignoreSslError = {};
	allValues.imageTouchFeedback = {};
	allValues.includeFontPadding = {};
	allValues.includeOpaqueBars = {};
	allValues.inputType = {};
	allValues.items = {};
	allValues.keepScreenOn = {};
	allValues.keepSectionsInSearch = {};
	allValues.keyboardAppearance = {};
	allValues.keyboardDismissMode = {};
	allValues.keyboardDisplayRequiresUserAction = {};
	allValues.keyboardType = {};
	allValues.largeTitleDisplayMode = {};
	allValues.largeTitleEnabled = {};
	allValues.layout = {};
	allValues.lazyLoadingEnabled = {};
	allValues.leftButtonMode = {};
	allValues.leftDrawerLockMode = {};
	allValues.lightTouchEnabled = {};
	allValues.listViewStyle = {};
	allValues.location = {};
	allValues.loginKeyboardType = {};
	allValues.loginReturnKeyType = {};
	allValues.mixedContentMode = {};
	allValues.modal = {};
	allValues.moveable = {};
	allValues.moving = {};
	allValues.nativeSpinner = {};
	allValues.navBarHidden = {};
	allValues.navigationMode = {};
	allValues.orientationModes = {};
	allValues.overlayEnabled = {};
	allValues.overrideCurrentAnimation = {};
	allValues.overScrollMode = {};
	allValues.pagingControlOnTop = {};
	allValues.passwordKeyboardType = {};
	allValues.passwordMask = {};
	allValues.pickerType = {};
	allValues.placement = {};
	allValues.pluginState = {};
	allValues.preventCornerOverlap = {};
	allValues.preventDefaultImage = {};
	allValues.previewActionStyle = {};
	allValues.progressBarStyle = {};
	allValues.progressIndicatorType = {};
	allValues.pruneSectionsOnEdit = {};
	allValues.requestedOrientation = {};
	allValues.resultsSeparatorStyle = {};
	allValues.returnKeyType = {};
	allValues.reverse = {};
	allValues.rightButtonMode = {};
	allValues.rightDrawerLockMode = {};
	allValues.scalesPageToFit = {};
	allValues.scrollable = {};
	allValues.scrollIndicators = {};
	allValues.scrollIndicatorStyle = {};
	allValues.scrollingEnabled = {};
	allValues.scrollsToTop = {};
	allValues.scrollType = {};
	allValues.searchAsChild = {};
	allValues.searchBarStyle = {};
	allValues.searchHidden = {};
	allValues.selectionGranularity = {};
	allValues.selectionOpens = {};
	allValues.selectionStyle = {};
	allValues.separatorStyle = {};
	allValues.shiftMode = {};
	allValues.showAsAction = {};
	allValues.showBookmark = {};
	allValues.showCancel = {};
	allValues.showHorizontalScrollIndicator = {};
	allValues.showPagingControl = {};
	allValues.showSearchBarInNavBar = {};
	allValues.showSelectionCheck = {};
	allValues.showUndoRedoActions = {};
	allValues.showVerticalScrollIndicator = {};
	allValues.smoothScrollOnTabClick = {};
	allValues.statusBarStyle = {};
	allValues.submitEnabled = {};
	allValues.suppressReturn = {};
	allValues.sustainedPerformanceMode = {};
	allValues.swipeToClose = {};
	allValues.switchStyle = {};
	allValues.systemButton = {};
	allValues.tabBarHidden = {};
	allValues.tabbedBarStyle = {};
	allValues.tabGroupStyle = {};
	allValues.tableViewStyle = {};
	allValues.tabsTranslucent = {};
	allValues.textAlign = {};
	allValues.theme = {};
	allValues.tiMedia = {};
	allValues.titleAttributesShadow = {};
	allValues.toolbarEnabled = {};
	allValues.touchEnabled = {};
	allValues.touchFeedback = {};
	allValues.transition = {};
	allValues.translucent = {};
	allValues.useCompatPadding = {};
	allValues.useSpinner = {};
	allValues.verticalAlign = {};
	allValues.verticalBounce = {};
	allValues.verticalMargin = {};
	allValues.viewShadow = {};
	allValues.visible = {};
	allValues.willHandleTouches = {};
	allValues.willScrollOnStatusTap = {};
	allValues.windowPixelFormat = {};
	allValues.windowSoftInputMode = {};
	allValues.wobble = {};

	//! Configurable properties
	// INFO: configurableProperties: For glossary generator only... Do not move from this position.
	allValues.configurableProperties = {};

	allValues.activeTab = combineKeys(configFile.theme, base.columns, 'activeTab');
	allValues.backgroundLeftCap = combineKeys(configFile.theme, base.spacing, 'backgroundLeftCap');
	allValues.backgroundPaddingBottom = combineKeys(configFile.theme, base.height, 'backgroundPaddingBottom');
	allValues.backgroundPaddingLeft = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingLeft');
	allValues.backgroundPaddingRight = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingRight');
	allValues.backgroundPaddingTop = combineKeys(configFile.theme, base.height, 'backgroundPaddingTop');
	allValues.backgroundTopCap = combineKeys(configFile.theme, base.spacing, 'backgroundTopCap');
	allValues.borderRadius = combineKeys(configFile.theme, (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, 'borderRadius');
	allValues.borderWidth = combineKeys(configFile.theme, defaultTheme.borderWidth, 'borderWidth');
	allValues.bottomNavigation = combineKeys(configFile.theme, base.spacing, 'bottomNavigation');
	allValues.cacheSize = combineKeys(configFile.theme, base.columns, 'cacheSize');
	allValues.columnCount = combineKeys(configFile.theme, base.columns, 'columnCount');
	allValues.contentHeight = combineKeys(configFile.theme, base.height, 'contentHeight');
	allValues.contentWidth = combineKeys(configFile.theme, base.width, 'contentWidth');
	allValues.countDownDuration = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDuration }, 'countDownDuration');
	allValues.elevation = combineKeys(configFile.theme, base.spacing, 'elevation');
	allValues.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily');
	allValues.fontSize = combineKeys(configFile.theme, base.fontSize, 'fontSize');
	allValues.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight');
	allValues.gap = combineKeys(configFile.theme, base.spacing, 'margin');
	allValues.indentionLevel = combineKeys(configFile.theme, base.spacing, 'indentionLevel');
	allValues.keyboardToolbarHeight = combineKeys(configFile.theme, base.height, 'keyboardToolbarHeight');
	allValues.leftButtonPadding = combineKeys(configFile.theme, base.spacing, 'leftButtonPadding');
	allValues.leftWidth = combineKeys(configFile.theme, base.width, 'leftWidth');
	allValues.lines = combineKeys(configFile.theme, base.columns, 'lines');
	allValues.maxElevation = combineKeys(configFile.theme, base.spacing, 'maxElevation');
	allValues.maxLines = combineKeys(configFile.theme, base.columns, 'maxLines');
	allValues.maxRowHeight = combineKeys(configFile.theme, base.height, 'maxRowHeight');
	allValues.maxZoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'maxZoomScale');
	allValues.minimumFontSize = combineKeys(configFile.theme, defaultTheme.fontSize, 'minimumFontSize');
	allValues.minRowHeight = combineKeys(configFile.theme, base.height, 'minRowHeight');
	allValues.minZoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'minZoomScale');
	allValues.offsets = combineKeys(configFile.theme, base.height, 'offsets');
	allValues.opacity = combineKeys(configFile.theme, defaultTheme.opacity, 'opacity');
	allValues.padding = combineKeys(configFile.theme, base.spacing, 'padding');
	allValues.pagingControlAlpha = combineKeys(configFile.theme, defaultTheme.opacity, 'pagingControlAlpha');
	allValues.pagingControlHeight = combineKeys(configFile.theme, base.height, 'pagingControlHeight');
	allValues.pagingControlTimeout = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'pagingControlTimeout');
	allValues.repeat = combineKeys(configFile.theme, base.columns, 'repeat');
	allValues.repeatCount = combineKeys(configFile.theme, base.columns, 'repeatCount');
	allValues.rightButtonPadding = combineKeys(configFile.theme, base.spacing, 'rightButtonPadding');
	allValues.rightWidth = combineKeys(configFile.theme, base.width, 'rightWidth');
	allValues.rotate = combineKeys(configFile.theme, defaultTheme.rotate, 'rotate');
	allValues.rowCount = combineKeys(configFile.theme, base.columns, 'rowCount');
	allValues.rowHeight = combineKeys(configFile.theme, base.height, 'rowHeight');
	allValues.scale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'scale');
	allValues.sectionHeaderTopPadding = combineKeys(configFile.theme, base.height, 'sectionHeaderTopPadding');
	allValues.separatorHeight = combineKeys(configFile.theme, base.height, 'separatorHeight');
	allValues.shadowRadius = combineKeys(configFile.theme, base.spacing, 'shadowRadius');
	allValues.timeout = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'timeout');
	allValues.transitionDelay = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'transitionDelay');
	allValues.transitionDuration = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDuration }, 'transitionDuration');
	allValues.zIndex = combineKeys(configFile.theme, defaultTheme.zIndex, 'zIndex');
	allValues.zoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'zoomScale');

	//! Color related properties
	// INFO: colorProperties: For glossary generator only... Do not move from this position.
	allValues.colorProperties = {};

	allValues.activeTintColor = combineKeys(configFile.theme, base.colors, 'activeTintColor');
	allValues.activeTitleColor = combineKeys(configFile.theme, base.colors, 'activeTitleColor');
	allValues.backgroundColor = combineKeys(configFile.theme, base.colors, 'backgroundColor');
	allValues.backgroundDisabledColor = combineKeys(configFile.theme, base.colors, 'backgroundDisabledColor');
	allValues.backgroundFocusedColor = combineKeys(configFile.theme, base.colors, 'backgroundFocusedColor');
	allValues.backgroundGradient = combineKeys(configFile.theme, base.colors, 'backgroundGradient');
	allValues.backgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'backgroundSelectedColor');
	allValues.backgroundSelectedGradient = combineKeys(configFile.theme, base.colors, 'backgroundSelectedGradient');
	allValues.badgeColor = combineKeys(configFile.theme, base.colors, 'badgeColor');
	allValues.barColor = combineKeys(configFile.theme, base.colors, 'barColor');
	allValues.borderColor = combineKeys(configFile.theme, base.colors, 'borderColor');
	allValues.currentPageIndicatorColor = combineKeys(configFile.theme, base.colors, 'currentPageIndicatorColor');
	allValues.dateTimeColor = combineKeys(configFile.theme, base.colors, 'dateTimeColor');
	allValues.disabledColor = combineKeys(configFile.theme, base.colors, 'disabledColor');
	allValues.highlightedColor = combineKeys(configFile.theme, base.colors, 'highlightedColor');
	allValues.hintTextColor = combineKeys(configFile.theme, base.colors, 'hintTextColor');
	allValues.imageTouchFeedbackColor = combineKeys(configFile.theme, base.colors, 'imageTouchFeedbackColor');
	allValues.indicatorColor = combineKeys(configFile.theme, base.colors, 'indicatorColor');
	allValues.keyboardToolbarColor = combineKeys(configFile.theme, base.colors, 'keyboardToolbarColor');
	allValues.navTintColor = combineKeys(configFile.theme, base.colors, 'navTintColor');
	allValues.onTintColor = combineKeys(configFile.theme, base.colors, 'onTintColor');
	allValues.pageIndicatorColor = combineKeys(configFile.theme, base.colors, 'pageIndicatorColor');
	allValues.pagingControlColor = combineKeys(configFile.theme, base.colors, 'pagingControlColor');
	allValues.placeholder = combineKeys(configFile.theme, base.colors, 'placeholder');
	allValues.pullBackgroundColor = combineKeys(configFile.theme, base.colors, 'pullBackgroundColor');
	allValues.resultsBackgroundColor = combineKeys(configFile.theme, base.colors, 'resultsBackgroundColor');
	allValues.resultsSeparatorColor = combineKeys(configFile.theme, base.colors, 'resultsSeparatorColor');
	allValues.selectedButtonColor = combineKeys(configFile.theme, base.colors, 'selectedButtonColor');
	allValues.selectedColor = combineKeys(configFile.theme, base.colors, 'selectedColor');
	allValues.selectedSubtitleColor = combineKeys(configFile.theme, base.colors, 'selectedSubtitleColor');
	allValues.selectedTextColor = combineKeys(configFile.theme, base.colors, 'selectedTextColor');
	allValues.separatorColor = combineKeys(configFile.theme, base.colors, 'separatorColor');
	allValues.shadowColor = combineKeys(configFile.theme, base.colors, 'shadowColor');
	allValues.subtitleColor = combineKeys(configFile.theme, base.colors, 'subtitleColor');
	allValues.tabsBackgroundColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundColor');
	allValues.tabsBackgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundSelectedColor');
	allValues.textColor = combineKeys(configFile.theme, base.colors, 'textColor');
	allValues.thumbTintColor = combineKeys(configFile.theme, base.colors, 'thumbTintColor');
	allValues.tintColor = combineKeys(configFile.theme, base.colors, 'tintColor');
	allValues.titleAttributesColor = combineKeys(configFile.theme, base.colors, 'titleAttributesColor');
	allValues.titleAttributesShadowColor = combineKeys(configFile.theme, base.colors, 'titleAttributesShadowColor');
	allValues.titleColor = combineKeys(configFile.theme, base.colors, 'titleColor');
	allValues.titleTextColor = combineKeys(configFile.theme, base.colors, 'titleTextColor');
	allValues.touchFeedbackColor = combineKeys(configFile.theme, base.colors, 'touchFeedbackColor');
	allValues.trackTintColor = combineKeys(configFile.theme, base.colors, 'trackTintColor');
	allValues.viewShadowColor = combineKeys(configFile.theme, base.colors, 'viewShadowColor');

	// !Some final cleanup
	delete configFile.theme.extend;
	delete configFile.theme.colors;
	delete configFile.theme.spacing;

	if (!Object.keys(allValues.fontFamily).length) {
		delete allValues.fontFamily;
		delete configFile.theme.fontFamily;
	}

	// !Delete corePlugins specified in the config file
	let corePlugins = Array.isArray(configFile.corePlugins) ? configFile.corePlugins : Object.keys(configFile.corePlugins).map(key => key);
	_.each(corePlugins, value => {
		delete allValues[value];
		delete configFile.theme[value];
	});

	_.each(allValues, (value, key) => {
		delete configFile.theme[key];
	});

	return allValues;
}

function completionsRevisedXXX() {
	const defaultTheme = require('tailwindcss/defaultTheme');

	let allValuesCombined = combineAllValues(getBaseValues(defaultTheme), defaultTheme);

	saveFile(cwd + '/allValuesCombined.json', JSON.stringify(allValuesCombined));
}

function getTiUIModulesXXX() {
	let tiUIModulesOnly = {};
	_.each(tiCompletionsFile.types, (value, key) => {
		tiUIModulesOnly[key] = {
			properties: value.properties
		};
	});

	return tiUIModulesOnly;
}

function generateColorClassesXXX(key, data, colors) {
	let myClasses = processComments(key, data);

	_.each(colors, (value, _key) => {
		if (typeof value === 'object') {
			_.each(value, (_value, __key) => {
				myClasses += `'.${removeUneededVariables(camelCaseToDash(key + '-' + _key + '-' + __key))}': { ${key}: '${_value}' }\n`;
			});
		} else {
			myClasses += `'.${removeUneededVariables(camelCaseToDash(key + '-' + _key))}': { ${key}: '${value}' }\n`;
		}
	});

	return myClasses;
}
