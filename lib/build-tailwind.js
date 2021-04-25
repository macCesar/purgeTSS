const fs = require('fs');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;

if (!fs.existsSync('./dist')) {
	fs.mkdirSync('./dist')
}

(function constructor() {
	'use strict';

	const helpers = require('./helpers');

	const defaultConfigTheme = require('tailwindcss/defaultTheme');

	const tailwindui = require('@tailwindcss/ui/index')({}, {}).config.theme;
	const defaultColors = require('tailwindcss/colors');

	// Reset Styles ( Preflight in Tailwind lingo )
	// Some reseting has to be done so everything else work as intended.
	saveFile('./dist/reset.tss', '// purgeTSS\n// Created by César Estrada\n// https://github.com/macCesar/purgeTSS\n');

	// Template
	let convertedStyles = fs.readFileSync('./lib/templates/tailwind/template.tss', 'utf8');
	let combinedColors = { transparent: 'transparent', ...defaultColors };
	let combinedSpacing = { ...tailwindui.spacing, ...defaultConfigTheme.spacing };

	convertedStyles += helpers.resetStyles();

	// backgroundColor
	convertedStyles += helpers.backgroundColor(combinedColors);

	// backgroundSelectedColor
	convertedStyles += helpers.backgroundSelectedColor(combinedColors);

	// Background Gradient
	convertedStyles += helpers.backgroundGradient();

	// borderColor
	convertedStyles += helpers.borderColor(combinedColors);

	// Border Radius ( Extra Styles )
	convertedStyles += helpers.borderRadiusExtraStyles({ ...combinedSpacing, ...defaultConfigTheme.borderRadius });

	// Border Width
	convertedStyles += helpers.borderWidth(defaultConfigTheme.borderWidth);

	// Display
	convertedStyles += helpers.displayUtilities();

	// Font Sizes
	convertedStyles += helpers.fontSize(defaultConfigTheme.fontSize);

	// Font Style
	convertedStyles += helpers.fontStyle();

	// Font Weight
	convertedStyles += helpers.fontWeight(defaultConfigTheme.fontWeight);

	// Gradient Color Stops
	convertedStyles += helpers.gradientColorStops(combinedColors);

	convertedStyles += helpers.height({ ...tailwindui.spacing, ...defaultConfigTheme.height(theme => (defaultConfigTheme.spacing)) });

	// touchEnabled Property
	convertedStyles += helpers.interactivity();

	// Margin
	convertedStyles += helpers.margin(combinedSpacing, true);

	// Opacity
	convertedStyles += helpers.opacity(defaultConfigTheme.opacity);

	// Padding
	convertedStyles += helpers.padding(combinedSpacing);

	// hintTextColor
	convertedStyles += helpers.placeholderColor(combinedColors);

	// touchFeedbackColor
	convertedStyles += helpers.touchFeedbackColor(combinedColors);

	// Top / Right / Bottom / Left
	convertedStyles += helpers.placement();

	// Scroll Indicators ( for ScrollView )
	convertedStyles += helpers.scrollIndicators();

	// Content Width & Height ( for ScrollView )
	convertedStyles += helpers.scrollableRegion();

	// Box Shadow
	convertedStyles += helpers.shadow();

	// Text Align
	convertedStyles += helpers.textAlign();

	// color
	convertedStyles += helpers.textColor(combinedColors);

	// Vertical Alignment
	convertedStyles += helpers.verticalAlignment();

	// Sizing
	convertedStyles += helpers.width({ ...tailwindui.width(theme => (tailwindui.spacing)), ...defaultConfigTheme.width(theme => (defaultConfigTheme.spacing)) });

	saveFile('./dist/tailwind.tss', convertedStyles);
}());

function saveFile(file, data) {
	fs.writeFileSync(file, data, err => {
		throw err;
	});

	console.log(`${purgeLabel} '${file}' file created!`);
}
