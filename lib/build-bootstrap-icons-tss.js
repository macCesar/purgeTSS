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

	readCSS('./lib/templates/bootstrap-icons/bootstrap-icons.css', (err, data) => {
		if (err) throw err

		let tssClasses = fs.readFileSync('./lib/templates/bootstrap-icons/template.tss', 'utf8') + '\n';

		tssClasses += fs.readFileSync('./lib/templates/bootstrap-icons/reset.tss', 'utf8');

		tssClasses += processCSS(data);

		fs.writeFileSync('./dist/bootstrapicons.tss', tssClasses, err => {
			throw err;
		});

		console.log(`${purgeLabel} './dist/bootstrapicons.tss' file created!`);
	});
}());

function processCSS(data) {
	let rules = _.map(data.stylesheet.rules, rule => {
		if (rule.type === 'rule' && rule.selectors[0].includes('::before') && !rule.selectors[0].includes('bi::before')) {
			return {
				'selector': rule.selectors[0].replace('::before', ''),
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
