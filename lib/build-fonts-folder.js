const fs = require('fs');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;

function callback(err) {
	if (err) throw err;
}

(function constructor() {
	'use strict';

	const detinationFontsFolder = './assets/fonts';

	// FontAwesome
	let sourceFontsFolder = './node_modules/@fortawesome/fontawesome-free/webfonts';

	if (!fs.existsSync(detinationFontsFolder)) {
		fs.mkdirSync(detinationFontsFolder)
	}

	fs.copyFile(sourceFontsFolder + '/fa-brands-400.ttf', detinationFontsFolder + '/FontAwesome5Brands-Regular.ttf', callback);
	fs.copyFile(sourceFontsFolder + '/fa-regular-400.ttf', detinationFontsFolder + '/FontAwesome5Free-Regular.ttf', callback);
	fs.copyFile(sourceFontsFolder + '/fa-solid-900.ttf', detinationFontsFolder + '/FontAwesome5Free-Solid.ttf', callback);

	console.log(`${purgeLabel} Font Awesome Free copied to './assets/fonts'`);

	// boxicons
	sourceFontsFolder = './node_modules/boxicons/fonts';

	fs.copyFile(sourceFontsFolder + '/boxicons.ttf', detinationFontsFolder + '/boxicons.ttf', callback);

	console.log(`${purgeLabel} Boxicons copied to './assets/fonts'`);

	// framework7Icons-Regular
	sourceFontsFolder = './node_modules/framework7-icons/fonts';

	fs.copyFile(sourceFontsFolder + '/Framework7Icons-Regular.ttf', detinationFontsFolder + '/Framework7-Icons.ttf', callback);

	console.log(`${purgeLabel} Framework7-Icons.ttf copied to './assets/fonts'`);

	// tabler-icons-Regular
	sourceFontsFolder = './node_modules/@tabler/icons/iconfont/fonts';

	fs.copyFile(sourceFontsFolder + '/tabler-icons.ttf', detinationFontsFolder + '/tabler-icons.ttf', callback);

	console.log(`${purgeLabel} tabler-icons.ttf copied to './assets/fonts'`);
}());
