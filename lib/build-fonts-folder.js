const fs = require('fs');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;

function callback(err) {
	if (err) throw err;
}

(function constructor() {
	'use strict';

	const detinationFontsFolder = './assets/fonts';
	const sourceFontsFolder = './node_modules/@fortawesome/fontawesome-free/webfonts';

	if (!fs.existsSync(detinationFontsFolder)) {
		fs.mkdirSync(detinationFontsFolder)
	}

	fs.copyFile(sourceFontsFolder + '/fa-brands-400.ttf', detinationFontsFolder + '/FontAwesome5Brands-Regular.ttf', callback);
	fs.copyFile(sourceFontsFolder + '/fa-regular-400.ttf', detinationFontsFolder + '/FontAwesome5Free-Regular.ttf', callback);
	fs.copyFile(sourceFontsFolder + '/fa-solid-900.ttf', detinationFontsFolder + '/FontAwesome5Free-Solid.ttf', callback);
	console.log(`${purgeLabel} Font Awesome Fonts copied to './assets/fonts'`);
}());
