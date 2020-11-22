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
	saveFile('./tss/reset.tss', '// purgeTSS\n// Created by César Estrada\n// https://github.com/macCesar/purgeTSS\n' + helpers.resetStyles());

	// Template
	let convertedStyles = fs.readFileSync('./lib/templates/tailwind-template.tss', 'utf8');
	let combinedColors = { transparent: 'transparent', ...defaultColors };
	let combinedSpacing = { ...tailwindui.spacing, ...defaultConfigTheme.spacing };
	// color
	convertedStyles += helpers.textColor(combinedColors);

	// backgroundColor
	convertedStyles += helpers.backgroundColor(combinedColors);

	// borderColor
	convertedStyles += helpers.borderColor(combinedColors);

	// placeholderColor
	convertedStyles += helpers.placeholderColor(combinedColors);

	// Background Gradient
	convertedStyles += helpers.backgroundGradient();

	// Gradient Color Stops
	convertedStyles += helpers.gradientColorStops(combinedColors);

	// Object Position
	convertedStyles += helpers.placement();

	// Font Sizes
	convertedStyles += helpers.fontSize(defaultConfigTheme.fontSize);

	// Font Style
	convertedStyles += helpers.fontStyle();

	// Font Weight
	convertedStyles += helpers.fontWeight(defaultConfigTheme.fontWeight);

	// Text Align
	convertedStyles += helpers.textAlign();

	// Vertical Alignment
	convertedStyles += helpers.verticalAlignment();

	// Border Radius
	// convertedStyles += helpers.borderRadius(defaultConfigTheme.borderRadius);

	// Border Radius ( Extra Styles )
	convertedStyles += helpers.borderRadiusExtraStyles({ ...combinedSpacing, ...defaultConfigTheme.borderRadius });

	// Border Width
	convertedStyles += helpers.borderWidth(defaultConfigTheme.borderWidth);

	// Margin
	convertedStyles += helpers.margin(combinedSpacing, true);

	// Padding
	convertedStyles += helpers.padding(combinedSpacing);

	// Sizing
	// convertedStyles += helpers.width(defaultConfigTheme.width(theme => (defaultConfigTheme.spacing)));
	convertedStyles += helpers.width({ ...tailwindui.width(theme => (tailwindui.spacing)), ...defaultConfigTheme.width(theme => (defaultConfigTheme.spacing)) });
	convertedStyles += helpers.height({ ...tailwindui.spacing, ...defaultConfigTheme.height(theme => (defaultConfigTheme.spacing)) });

	// Box Shadow
	convertedStyles += helpers.shadow();

	// Opacity
	convertedStyles += helpers.opacity(defaultConfigTheme.opacity);

	// Interactivity
	convertedStyles += helpers.interactivity();

	saveFile('./tss/tailwind.tss', convertedStyles);
}());

function saveFile(file, data) {
	fs.writeFileSync(file, data, err => {
		throw err;
	});

	console.log(`${purgeLabel} '${file}' file created!`);
}
