const fs = require('fs');
const _ = require('lodash');
const read = require('read-css');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;

if (!fs.existsSync('./tss')) {
	fs.mkdirSync('./tss')
}

(function constructor() {
	'use strict';

	read('./node_modules/@fortawesome/fontawesome-free/css/all.css', (err, data) => {
		if (err) throw err

		let rules = _.map(data.stylesheet.rules, rule => {
			if (rule.type === 'rule' && rule.selectors[ 0 ].includes(':before')) {
				return {
					'selector': rule.selectors[ 0 ].replace(':before', '').replace('.', ''),
					'property': rule.declarations[ 0 ].value.replace('\"\\', '').replace('\"', '')
				};
			}
		});

		let paraJS = '\nconst fontawesome = {\n';

		_.each(rules, rule => {
			if (rule) {
				paraJS += `\t'${rule.selector}': '\\u${rule.property}',\n`;
			}
		});

		paraJS += '};\n';

		paraJS += 'exports.fontawesome = fontawesome;\n';

		let fontawesome = fs.readFileSync('./lib/templates/fa-free.js', 'utf8');

		fontawesome += '\n' + fs.readFileSync('./lib/templates/fa-functions.js', 'utf8');

		fontawesome += paraJS;

		let exportIcons = '\nconst icons = {\n';

		_.each(rules, rule => {
			if (rule) {
				exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`;
			}
		});

		exportIcons += '};\n';

		exportIcons += 'exports.icons = icons;\n';

		fontawesome += exportIcons;

		fs.writeFileSync('./tss/fontawesome.js', fontawesome, err => {
			throw err;
		});

		console.log(`${purgeLabel} './tss/fontawesome.js' file created!`);
	});
}());

function prettifyFontName(str) {
	str = str.replace('fa-', '');
	var temp = str.split('-'), i, pretty;

	for (i = 0; i < temp.length; i++) {
		temp[ i ] = temp[ i ].charAt(0).toUpperCase() + temp[ i ].slice(1);
	}

	pretty = temp.join('');
	pretty = pretty.replace(/^.{1}/g, pretty[ 0 ].toLowerCase());

	return pretty;
};
