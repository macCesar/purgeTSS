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

	// Reset Styles ( Preflight in Tailwind lingo )
	// Some reseting has to be so everything else work as intended.
	saveFile('./tss/reset.tss', '// purgeTSS\n// Created by César Estrada\n// https://github.com/macCesar/purgeTSS\n' + helpers.resetStyles());

	// Template
	let convertedStyles = fs.readFileSync('./lib/templates/tailwind-template.tss', 'utf8');

	// Colors: text-, bg-, border-, placeholder-
	convertedStyles += helpers.colors(tailwindui.colors);

	// Background Image
	convertedStyles += helpers.backgroundImage();

	// Gradient Color Stops
	convertedStyles += helpers.gradientColorStops(tailwindui.colors);

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
	convertedStyles += helpers.borderRadius(defaultConfigTheme.borderRadius);

	// Border Radius ( Extra Styles )
	convertedStyles += helpers.borderRadiusExtraStyles(tailwindui.spacing);

	// Border Width
	convertedStyles += helpers.borderWidth(defaultConfigTheme.borderWidth);

	// Margin
	convertedStyles += helpers.margin(tailwindui.spacing);

	// Padding
	convertedStyles += helpers.padding(tailwindui.spacing);

	// Sizing
	convertedStyles += helpers.width(defaultConfigTheme.width(theme => ({ spacing: tailwindui.spacing })));
	convertedStyles += helpers.height(defaultConfigTheme.height(theme => ({ spacing: tailwindui.spacing })));

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
