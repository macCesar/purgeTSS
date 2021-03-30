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

	read('./lib/templates/lineicons/lineicons.css', (err, data) => {
		if (err) throw err

		let rules = _.map(data.stylesheet.rules, rule => {
			if (rule.type === 'rule' && rule.selectors[0].includes('::before')) {
				return {
					'selector': rule.selectors[0].replace('::before', '').replace('.', ''),
					'property': rule.declarations[0].value.replace('\"\\', '').replace('\"', '')
				};
			}
		});

		let fileContent = fs.readFileSync('./lib/templates/lineicons/template.js', 'utf8');

		fileContent += '\n' + fs.readFileSync('./lib/templates/icon-functions.js', 'utf8');

		let exportIcons = '\nconst icons = {\n';

		_.each(rules, rule => {
			if (rule) {
				exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`;
			}
		});

		exportIcons += '};\n';

		exportIcons += 'exports.icons = icons;\n';

		fileContent += exportIcons;

		fs.writeFileSync('./dist/lineicons.js', fileContent, err => {
			throw err;
		});

		console.log(`${purgeLabel} './dist/lineicons.js' file created!`);
	});
}());

function prettifyFontName(str) {
	str = str.replace('lni-', '');
	var temp = str.split('-'), i, pretty;

	for (i = 0; i < temp.length; i++) {
		temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
	}

	pretty = temp.join('');
	pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase());

	return pretty;
};
