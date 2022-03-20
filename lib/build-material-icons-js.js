const fs = require('fs');
const _ = require('lodash');
const read = require('read-css');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;

if (!fs.existsSync('./dist')) {
	fs.mkdirSync('./dist')
}

(function constructor() {
	'use strict';

	let codepoints = fs.readFileSync('./lib/templates/materialicons/MaterialIcons-Regular.codepoints', 'utf8');
	codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsOutlined-Regular.codepoints', 'utf8');
	codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsRound-Regular.codepoints', 'utf8');
	codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsSharp-Regular.codepoints', 'utf8');
	codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsTwoTone-Regular.codepoints', 'utf8');

	let uniqueCodepoints = _.map(_.uniq(codepoints.split("\n").sort()), rule => {
		if (rule !== '') {
			let separado = rule.split(' ');
			return {
				'selector': separado[0],
				'property': separado[1]
			};
		}
	});

	let fileContent = fs.readFileSync('./lib/templates/materialicons/template.js', 'utf8');

	fileContent += '\n' + fs.readFileSync('./lib/templates/icon-functions.js', 'utf8');

	let exportIcons = '\nconst icons = {\n';

	_.each(uniqueCodepoints, rule => {
		if (rule) {
			exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`;
		}
	});

	exportIcons += '};\n';

	exportIcons += 'exports.icons = icons;\n';

	fileContent += exportIcons;

	fs.writeFileSync('./dist/materialdesignicons.js', fileContent, err => {
		throw err;
	});

	console.log(`${purgeLabel} './dist/materialdesignicons.js' file created!`);
}());

function prettifyFontName(str) {
	var temp = str.split('_'), i, pretty;

	for (i = 0; i < temp.length; i++) {
		temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
	}

	pretty = temp.join('');
	pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase());

	return pretty;
};
