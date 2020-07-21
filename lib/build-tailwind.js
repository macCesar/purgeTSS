const fs = require('fs');

if (!fs.existsSync('./tss')) {
	fs.mkdirSync('./tss')
}

(function constructor() {
	'use strict';

	const helpers = require('./helpers');

	const defaultConfigTheme = require('tailwindcss/defaultTheme');

	const tailwindui = require('@tailwindcss/ui/index')({}, {}).config.theme;

	let convertedStyles = '// Tailwind CSS: A utility-first CSS framework for rapidly building custom designs. ( https://tailwindcss.com )\n';

	convertedStyles += '// Tailwind UI Plugin ( https://www.npmjs.com/package/@tailwindcss/ui ).\n';

	convertedStyles += '// Created by Adam Wathan ( https://twitter.com/adamwathan ).\n\n';

	convertedStyles += '// Tailwind TSS Generator\n// Created by César Estrada\n';

	convertedStyles += '// https://github.com/macCesar/tailwind-tss-color-generator\n';

	// Reset Styles ( Preflight in Tailwind lingo )
	// Some reseting has to be so everything else work as intended.
	saveFile('./tss/reset.tss', convertedStyles + helpers.resetStyles());

	// Colors: text-, bg-, border-, placeholder-
	convertedStyles += helpers.colors(tailwindui.colors);

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
	convertedStyles += helpers.shadow(tailwindui.boxShadow);

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

	console.log("::purgeTSS:: '" + file + "' file created!");
}
