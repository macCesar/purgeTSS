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

	const defaultTheme = require('tailwindcss/defaultTheme');

	const tailwindui = require('@tailwindcss/ui/index')({}, {}).config.theme;
	const defaultColors = require('tailwindcss/colors');
	delete defaultColors.lightBlue;

	// Reset Styles ( Preflight in Tailwind lingo )
	// Some reseting has to be done so everything else work as intended.
	saveFile('./dist/reset.tss', '// purgeTSS\n// Created by César Estrada\n// https://github.com/macCesar/purgeTSS\n');

	// Template
	let combinedColors = { transparent: 'transparent', ...defaultColors };
	let combinedSpacing = { ...tailwindui.spacing, ...defaultTheme.spacing };
	let convertedStyles = fs.readFileSync('./lib/templates/tailwind/template.tss', 'utf8');

	combinedSpacing = fixOneThirds(combinedSpacing);

	convertedStyles += helpers.resetStyles();
	convertedStyles += helpers.autoreverse();
	convertedStyles += helpers.backgroundColor(combinedColors);
	convertedStyles += helpers.linearGradient();
	convertedStyles += helpers.radialGradient();
	convertedStyles += helpers.backgroundSelectedColor(combinedColors);
	convertedStyles += helpers.borderColor(combinedColors);
	convertedStyles += helpers.borderRadiusExtraStyles({ ...combinedSpacing, ...defaultTheme.borderRadius });
	convertedStyles += helpers.borderWidth(defaultTheme.borderWidth);
	convertedStyles += helpers.bounce();
	convertedStyles += helpers.clipMode();
	// convertedStyles += helpers.closeBackgroundColor(combinedColors);
	// convertedStyles += helpers.closeBorderColor(combinedColors);
	// convertedStyles += helpers.closeOpacity(defaultTheme.opacity);
	// convertedStyles += helpers.closeSizingPosition(combinedSpacing);
	convertedStyles += helpers.currentPageIndicatorColor(combinedColors);
	convertedStyles += helpers.defaultImage();
	convertedStyles += helpers.displayUtilities();
	convertedStyles += helpers.exitOnClose();
	convertedStyles += helpers.fontSize(defaultTheme.fontSize);
	convertedStyles += helpers.fontStyle();
	convertedStyles += helpers.fontWeight(defaultTheme.fontWeight);
	convertedStyles += helpers.gaps(combinedSpacing);
	convertedStyles += helpers.gradientColorStops(combinedColors);
	convertedStyles += helpers.gridColumnsStartEnd();
	convertedStyles += helpers.gridFlow();
	convertedStyles += helpers.gridSystem();
	let allHeights = fixOneThirds({ ...tailwindui.spacing, ...defaultTheme.height(theme => (defaultTheme.spacing)) });
	convertedStyles += helpers.height(allHeights);
	convertedStyles += helpers.interactivity();
	convertedStyles += helpers.items();
	convertedStyles += helpers.keepScreenOn();
	convertedStyles += helpers.layout();
	convertedStyles += helpers.margin(combinedSpacing);
	convertedStyles += helpers.opacity(defaultTheme.opacity);

	// convertedStyles += helpers.openBackgroundColor(combinedColors);
	// convertedStyles += helpers.openBorderColor(combinedColors);
	// convertedStyles += helpers.openOpacity(defaultTheme.opacity);
	// convertedStyles += helpers.openSizingPosition(combinedSpacing);

	convertedStyles += helpers.origin();
	convertedStyles += helpers.overlay();
	convertedStyles += helpers.padding(combinedSpacing);
	convertedStyles += helpers.pageIndicatorColor(combinedColors);

	convertedStyles += helpers.pagingControl();
	convertedStyles += helpers.pagingControlAlpha(defaultTheme.opacity);
	convertedStyles += helpers.pagingControlColor(combinedColors);
	convertedStyles += helpers.pagingControlHeight(allHeights);
	convertedStyles += helpers.pagingControlTimeout(defaultTheme.transitionDelay);

	convertedStyles += helpers.placeholderColor(combinedColors);
	convertedStyles += helpers.placement();
	convertedStyles += helpers.platform();
	convertedStyles += helpers.repeat();
	convertedStyles += helpers.rotate(defaultTheme.rotate);
	convertedStyles += helpers.scale(defaultTheme.scale);
	convertedStyles += helpers.scrollIndicators();
	convertedStyles += helpers.scrollType();
	convertedStyles += helpers.scrollableRegion();
	convertedStyles += helpers.scrolling();
	convertedStyles += helpers.shadow();
	convertedStyles += helpers.textAlign();
	convertedStyles += helpers.textColor(combinedColors);
	convertedStyles += helpers.tintColor(combinedColors);
	convertedStyles += helpers.touchFeedbackColor(combinedColors);
	convertedStyles += helpers.transition();
	convertedStyles += helpers.transitionDelay(defaultTheme.transitionDelay);
	convertedStyles += helpers.transitionDuration(defaultTheme.transitionDuration);
	convertedStyles += helpers.verticalAlignment();
	convertedStyles += helpers.width(fixOneThirds({ ...tailwindui.width(theme => (tailwindui.spacing)), ...defaultTheme.width(theme => (defaultTheme.spacing)) }));

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
