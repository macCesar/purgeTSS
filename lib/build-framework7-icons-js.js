const fs = require('fs');
const _ = require('lodash');
const read = require('read-css');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;
const junk = require('junk');

if (!fs.existsSync('./dist')) {
	fs.mkdirSync('./dist')
}

(function constructor() {
	'use strict';

	let files = fs.readdirSync('./node_modules/framework7-icons/svg');

	let justNames = [];

	files.filter(junk.not).forEach(name => {
		justNames.push(name.replace('.svg', ''));
	});

	let framework7 = fs.readFileSync('./lib/templates/framework7/template.js', 'utf8');

	framework7 += '\n' + fs.readFileSync('./lib/templates/icon-functions.js', 'utf8');

	let exportIcons = '\nconst icons = {\n';

	_.each(justNames, rule => {
		exportIcons += `\t'${prettifyFontName(rule)}': '${rule}',\n`;
	});

	exportIcons += '};\n';

	exportIcons += 'exports.icons = icons;\n';

	framework7 += exportIcons;

	fs.writeFileSync('./dist/framework7icons.js', framework7, err => {
		throw err;
	});

	console.log(`${purgeLabel} './dist/framework7icons.js' file created!`);
}());

function prettifyFontName(str) {
	let temp = str.split('_'), i, pretty;

	for (i = 0; i < temp.length; i++) {
		temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
	}

	pretty = temp.join('');
	pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase());

	return pretty;
}
