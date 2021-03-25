const fs = require('fs');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;

if (!fs.existsSync('./tss')) {
	fs.mkdirSync('./tss')
}

(function constructor() {
	'use strict';

	const helpers = require('./helpers');

	const defaultConfigTheme = require('tailwindcss/defaultTheme');

	const tailwindui = require('@tailwindcss/ui/index')({}, {}).config.theme;
	const defaultColors = require('tailwindcss/colors');

	// Reset Styles ( Preflight in Tailwind lingo )
	// Some reseting has to be so everything else work as intended.
	saveFile('./tss/reset.tss', '// purgeTSS\n// Created by César Estrada\n// https://github.com/macCesar/purgeTSS\n');

	// Template
	let convertedStyles = fs.readFileSync('./lib/templates/tailwind-template.tss', 'utf8');
	let combinedColors = { transparent: 'transparent', ...defaultColors };
	let combinedSpacing = { ...tailwindui.spacing, ...defaultConfigTheme.spacing };

	convertedStyles += '\n// Custom Styles and Resets\n';
	convertedStyles += helpers.customRules({ ios: { clipMode: 'Ti.UI.iOS.CLIP_MODE_ENABLED' } }, '.clip-enabled');
	convertedStyles += helpers.customRules({ ios: { clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED' } }, '.clip-disabled');
	convertedStyles += helpers.customRules({ default: { layout: 'horizontal' } }, '.horizontal');
	convertedStyles += helpers.customRules({ default: { layout: 'vertical' } }, '.vertical');
	convertedStyles += helpers.customRules({ ios: { hires: true } }, 'ImageView');
	convertedStyles += helpers.customRules({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, 'View');
	convertedStyles += helpers.customRules({ default: { backgroundColor: '#ffffff' } }, 'Window');

	// backgroundColor
	convertedStyles += helpers.backgroundColor(combinedColors);

	// Background Gradient
	convertedStyles += helpers.backgroundGradient();

	// borderColor
	convertedStyles += helpers.borderColor(combinedColors);

	// Border Radius
	// convertedStyles += helpers.borderRadius(defaultConfigTheme.borderRadius);

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

	saveFile('./tss/tailwind.tss', convertedStyles);
}());

function saveFile(file, data) {
	fs.writeFileSync(file, data, err => {
		throw err;
	});

	console.log(`${purgeLabel} '${file}' file created!`);
}
