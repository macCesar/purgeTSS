const fs = require('fs');
const _ = require('lodash');
const readCSS = require('read-css');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;

if (!fs.existsSync('./dist')) {
	fs.mkdirSync('./dist')
}

(function constructor() {
	'use strict';

	readCSS('./node_modules/@tabler/icons/iconfont/tabler-icons.css', (err, data) => {
		if (err) throw err

		let tssClasses = fs.readFileSync('./lib/templates/tablericons/template.tss', 'utf8') + '\n';

		tssClasses += fs.readFileSync('./lib/templates/tablericons/reset.tss', 'utf8');

		tssClasses += processCSS(data);

		fs.writeFileSync('./dist/tablericons.tss', tssClasses, err => {
			throw err;
		});

		console.log(`${purgeLabel} './dist/tablericons.tss' file created!`);
	});
}());

function processCSS(data) {
	let rules = _.map(data.stylesheet.rules, rule => {
		if (rule.type === 'rule' && rule.selectors[0].includes(':before')) {
			return {
				'selector': rule.selectors[0].replace(':before', ''),
				'property': rule.declarations[0].value.replace('\"\\', '').replace('\"', '')
			};
		}
	});

	let paraTSS = '';

	_.each(rules, rule => {
		if (rule) {
			paraTSS += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`;
		}
	});

	return paraTSS;
}