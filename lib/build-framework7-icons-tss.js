const fs = require('fs');
const _ = require('lodash');
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

	let tssClasses = fs.readFileSync('./lib/templates/framework7/template.tss', 'utf8') + '\n';

	tssClasses += fs.readFileSync('./lib/templates/framework7/reset.tss', 'utf8');

	tssClasses += processNames(justNames);

	fs.writeFileSync('./dist/framework7icons.tss', tssClasses, err => {
		throw err;
	});

	console.log(`${purgeLabel} './dist/framework7icons.tss' file created!`);
}());

function processNames(data) {
	let paraTSS = '';

	_.each(data, rule => {
		paraTSS += `'.f7-${rule}': { text: '${rule}', title: '${rule}' }\n`;
	});

	return paraTSS;
}