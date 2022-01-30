const fs = require('fs');
const _ = require('lodash');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;

if (!fs.existsSync('./dist')) {
	fs.mkdirSync('./dist')
}

(function constructor() {
	'use strict';

	const helpers = require('./helpers');
	const defaultColors = require('tailwindcss/colors');
	const defaultTheme = require('tailwindcss/defaultTheme');

	// Remove deprecated colors
	delete defaultColors.blueGray;
	delete defaultColors.coolGray;
	delete defaultColors.current;
	delete defaultColors.inherit;
	delete defaultColors.lightBlue;
	delete defaultColors.trueGray;
	delete defaultColors.warmGray;

	// Reset Styles ( Preflight in Tailwind lingo )
	// Some reseting has to be done so everything else work as intended.
	saveFile('./dist/reset.tss', '// PurgeTSS\n// Created by César Estrada\n// https://github.com/macCesar/purgeTSS\n');

	// Template
	let combinedColors = { transparent: 'transparent', ...defaultColors };
	// let combinedSpacing = { ...defaultTheme.spacing };
	let combinedSpacing = { ...defaultTheme.width({ theme: () => (defaultTheme.spacing) }), ...defaultTheme.height({ theme: () => (defaultTheme.spacing) }) };
	let convertedStyles = fs.readFileSync('./lib/templates/tailwind/template.tss', 'utf8');

	combinedSpacing = fixOneThirds(combinedSpacing);

	delete combinedSpacing.min;
	delete combinedSpacing.max;
	delete combinedSpacing.fit;

	convertedStyles += helpers.resetStyles();
	//
	convertedStyles += helpers.activeIconIsMask();
	convertedStyles += helpers.activeTintColor(combinedColors);
	convertedStyles += helpers.activeTitleColor(combinedColors);
	convertedStyles += helpers.activityEnterTransition();
	convertedStyles += helpers.activityExitTransition();
	convertedStyles += helpers.activityIndicatorStyle();
	convertedStyles += helpers.activityReenterTransition();
	convertedStyles += helpers.activityReturnTransition();
	convertedStyles += helpers.activitySharedElementEnterTransition();
	convertedStyles += helpers.activitySharedElementExitTransition();
	convertedStyles += helpers.activitySharedElementReenterTransition();
	convertedStyles += helpers.activitySharedElementReturnTransition();
	convertedStyles += helpers.allowUserCustomization();
	convertedStyles += helpers.autoAdjustScrollViewInsets();
	convertedStyles += helpers.autocapitalization();
	convertedStyles += helpers.autocorrect();
	convertedStyles += helpers.autofillType();
	convertedStyles += helpers.autoLink();
	convertedStyles += helpers.autoreverse();
	convertedStyles += helpers.backgroundBlendMode();
	convertedStyles += helpers.backgroundColor(combinedColors);
	convertedStyles += helpers.backgroundSelectedColor(combinedColors);
	convertedStyles += helpers.barColor(combinedColors);
	convertedStyles += helpers.barTitleColor(combinedColors);
	convertedStyles += helpers.barTitleShadow();
	convertedStyles += helpers.barTitleShadowColor(combinedColors);
	convertedStyles += helpers.borderColor(combinedColors);
	convertedStyles += helpers.borderRadiusExtraStyles({ ...combinedSpacing, ...defaultTheme.borderRadius });
	convertedStyles += helpers.borderStyle();
	convertedStyles += helpers.borderWidth(defaultTheme.borderWidth);
	convertedStyles += helpers.bottomNavigation(combinedSpacing);
	convertedStyles += helpers.bubbleParent();
	convertedStyles += helpers.cacheSize();
	convertedStyles += helpers.clipMode();
	convertedStyles += helpers.currentPageIndicatorColor(combinedColors);
	convertedStyles += helpers.disableBounce();
	convertedStyles += helpers.displayCaps();
	convertedStyles += helpers.displayUtilities();
	convertedStyles += helpers.draggingConstraints();
	convertedStyles += helpers.draggingType();
	convertedStyles += helpers.dropShadow();
	convertedStyles += helpers.dropShadowColor(combinedColors);
	convertedStyles += helpers.editable();
	convertedStyles += helpers.ellipsize();
	convertedStyles += helpers.enableCopy();
	convertedStyles += helpers.enableReturnKey();
	convertedStyles += helpers.exitOnClose();
	convertedStyles += helpers.extendBackground();
	convertedStyles += helpers.extendEdges();
	convertedStyles += helpers.extendSafeArea();
	convertedStyles += helpers.flagSecure();
	convertedStyles += helpers.flip();
	convertedStyles += helpers.fontSize(defaultTheme.fontSize);
	convertedStyles += helpers.fontStyle();
	convertedStyles += helpers.fontWeight(defaultTheme.fontWeight);
	convertedStyles += helpers.fullscreen();
	convertedStyles += helpers.gap(combinedSpacing);
	convertedStyles += helpers.gradientColorStops(combinedColors);
	convertedStyles += helpers.gridColumnsStartEnd();
	convertedStyles += helpers.gridFlow();
	convertedStyles += helpers.gridSystem();
	convertedStyles += helpers.height(combinedSpacing);
	convertedStyles += helpers.hidesBackButton();
	convertedStyles += helpers.hidesBarsOnSwipe();
	convertedStyles += helpers.hidesBarsOnTap();
	convertedStyles += helpers.hidesBarsWhenKeyboardAppears();
	convertedStyles += helpers.hideShadow();
	convertedStyles += helpers.hidesSearchBarWhenScrolling();
	convertedStyles += helpers.homeIndicatorAutoHidden();
	convertedStyles += helpers.iconIsMask();
	convertedStyles += helpers.includeOpaqueBars();
	convertedStyles += helpers.indicatorColor(combinedColors);
	convertedStyles += helpers.interactivity();
	convertedStyles += helpers.items();
	convertedStyles += helpers.keepScreenOn();
	convertedStyles += helpers.keepSectionsInSearch();
	convertedStyles += helpers.keyboardAppearance();
	convertedStyles += helpers.keyboardDismissMode();
	convertedStyles += helpers.keyboardType();
	convertedStyles += helpers.largeTitleDisplayMode();
	convertedStyles += helpers.largeTitleEnabled();
	convertedStyles += helpers.layout();
	convertedStyles += helpers.lazyLoadingEnabled();
	convertedStyles += helpers.linearGradient();
	convertedStyles += helpers.loginKeyboardType();
	convertedStyles += helpers.loginReturnKeyType();
	convertedStyles += helpers.margin(combinedSpacing);
	convertedStyles += helpers.modal();
	convertedStyles += helpers.navBarHidden();
	convertedStyles += helpers.navTintColor(combinedColors);
	convertedStyles += helpers.opacity(defaultTheme.opacity);
	convertedStyles += helpers.orientationModes();
	convertedStyles += helpers.origin();
	convertedStyles += helpers.overlay();
	convertedStyles += helpers.padding(combinedSpacing);
	convertedStyles += helpers.pageIndicatorColor(combinedColors);
	convertedStyles += helpers.pagingControl();
	convertedStyles += helpers.pagingControlAlpha(defaultTheme.opacity);
	convertedStyles += helpers.pagingControlColor(combinedColors);
	convertedStyles += helpers.pagingControlHeight(combinedSpacing);
	convertedStyles += helpers.pagingControlOnTop();
	convertedStyles += helpers.pagingControlTimeout({ ...{ '0': '0ms', '25': '25ms', '50': '50ms', '2000': '2000ms', '3000': '3000ms', '4000': '4000ms', '5000': '5000ms' }, ...defaultTheme.transitionDelay });
	convertedStyles += helpers.passwordKeyboardType();
	convertedStyles += helpers.pickerType();
	convertedStyles += helpers.placeholderColor(combinedColors);
	convertedStyles += helpers.placement();
	convertedStyles += helpers.preventDefaultImage();
	convertedStyles += helpers.radialGradient();
	convertedStyles += helpers.repeat();
	convertedStyles += helpers.returnKeyType();
	convertedStyles += helpers.rotate(defaultTheme.rotate);
	convertedStyles += helpers.scale({ ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale });
	convertedStyles += helpers.scrollableRegion();
	convertedStyles += helpers.scrollIndicators();
	convertedStyles += helpers.scrollingEnabled();
	convertedStyles += helpers.scrollType();
	convertedStyles += helpers.shadow();
	convertedStyles += helpers.shadowColor(combinedColors);
	convertedStyles += helpers.shiftMode();
	convertedStyles += helpers.showAsAction();
	convertedStyles += helpers.showCancel();
	convertedStyles += helpers.smoothScrollOnTabClick();
	convertedStyles += helpers.statusBar();
	convertedStyles += helpers.sustainedPerformanceMode();
	convertedStyles += helpers.swipeToClose();
	convertedStyles += helpers.tabBarHidden();
	convertedStyles += helpers.tabGroupStyle();
	convertedStyles += helpers.tabsBackgroundColor(combinedColors);
	convertedStyles += helpers.tabsBackgroundSelectedColor(combinedColors);
	convertedStyles += helpers.tabsTranslucent();
	convertedStyles += helpers.textAlign();
	convertedStyles += helpers.textColor(combinedColors);
	convertedStyles += helpers.tiMedia();
	convertedStyles += helpers.tintColor(combinedColors);
	convertedStyles += helpers.titleColor(combinedColors);
	convertedStyles += helpers.touchFeedbackColor(combinedColors);
	convertedStyles += helpers.transition();
	convertedStyles += helpers.transitionDelay({ ...{ '0': '0ms', '25': '25ms', '50': '50ms', '2000': '2000ms', '3000': '3000ms', '4000': '4000ms', '5000': '5000ms' }, ...defaultTheme.transitionDelay });
	convertedStyles += helpers.transitionDuration({ ...{ 0: '0ms', 25: '25ms', 50: '50ms' }, ...defaultTheme.transitionDuration });
	convertedStyles += helpers.translucent();
	convertedStyles += helpers.useSpinner();
	convertedStyles += helpers.verticalAlignment();
	convertedStyles += helpers.width(combinedSpacing);
	convertedStyles += helpers.windowPixelFormat();
	convertedStyles += helpers.windowSoftInputMode();
	convertedStyles += helpers.zIndex(defaultTheme.zIndex);

	saveFile('./dist/tailwind.tss', convertedStyles);
}());

function fixOneThirds(values) {
	_.each(values, (value, key) => {
		if (value.toString().includes('.333333%')) {
			values[key] = value.replace('.333333%', '.333334%');
		}
	});

	return values;
}

function saveFile(file, data) {
	fs.writeFileSync(file, data, err => {
		throw err;
	});

	console.log(`${purgeLabel} '${file}' file created!`);
}
