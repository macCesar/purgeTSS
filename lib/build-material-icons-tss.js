const fs = require('fs');
const _ = require('lodash');
const readCSS = require('read-css');
const colores = require('./colores').colores;
const purgeLabel = colores.purgeLabel;

if (!fs.existsSync('./tss')) {
	fs.mkdirSync('./tss')
}

(function constructor() {
	'use strict';

	let tssClasses = fs.readFileSync('./lib/templates/materialicons-template.tss', 'utf8') + '\n';

	tssClasses += fs.readFileSync('./lib/templates/materialicons-reset.tss', 'utf8');

	let codepoints = fs.readFileSync('./lib/templates/MaterialIcons-Regular.codepoints', 'utf8');
	codepoints += fs.readFileSync('./lib/templates/MaterialIconsOutlined-Regular.codepoints', 'utf8');
	codepoints += fs.readFileSync('./lib/templates/MaterialIconsRound-Regular.codepoints', 'utf8');
	codepoints += fs.readFileSync('./lib/templates/MaterialIconsSharp-Regular.codepoints', 'utf8');
	codepoints += fs.readFileSync('./lib/templates/MaterialIconsTwoTone-Regular.codepoints', 'utf8');

	codepoints = codepoints.split("\n").sort();

	tssClasses += processCodePoints(_.uniq(codepoints), 'md-');
	// tssClasses += processCodePoints(codepoints, 'md-');

	fs.writeFileSync('./tss/materialicons.tss', tssClasses, err => {
		throw err;
	});

	console.log(`${purgeLabel} './tss/materialicons.tss' file created!`);
}());

function processCodePoints(data, addSelector) {
	let rules = _.map(data, rule => {
		if (rule !== '') {

			let separado = rule.split(' ');
			return {
				'selector': separado[ 0 ],
				'property': separado[ 1 ]
			};
		}
	});

	let paraTSS = '';

	_.each(rules, rule => {
		if (rule) {
			paraTSS += `'.${addSelector}${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`;
		}
	});

	return paraTSS;
}
