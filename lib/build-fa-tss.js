const fs = require('fs');
const _ = require('lodash');
const read = require('read-css');
const chalk = require('chalk');
const colores = {
	gris: '#53606B',
	verdeClaro: '#8FB63E',
	verdeOscuro: '#79A342',
	purgeLabel: chalk.hex('#79A342')('::purgeTSS::')
}
const purgeLabel = colores.purgeLabel;

if (!fs.existsSync('./tss')) {
	fs.mkdirSync('./tss')
}

(function constructor() {
	'use strict';

	read('./node_modules/@fortawesome/fontawesome-free/css/all.css', (err, data) => {
		if (err) throw err

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
				paraTSS += `\n'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }`;
			}
		});

		let fontawesome = fs.readFileSync('./lib/templates/fa.tss', 'utf8');

		fontawesome += paraTSS;

		fs.writeFileSync('./tss/fontawesome.tss', fontawesome, err => {
			throw err;
		});

		console.log(`${purgeLabel} './tss/fontawesome.tss' file created!`);
	});
}());
