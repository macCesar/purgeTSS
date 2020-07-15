const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const convert = require('xml-js');
const traverse = require('traverse');

const resetTSS = './tss/reset.tss';
const appTSS = '../../app/styles/app.tss';
const baseTSS = '../../app/styles/base.tss';

const tailwindSourceTSS = './tss/tailwind.tss';
const fontAwesomeSourceTSS = './tss/fontawesome.tss';

function extractClasses(texto) {
	return traverse(JSON.parse(convert.xml2json(texto, { compact: true }))).reduce(function (acc, value) {
		if (this.key === 'class') {
			acc.push(value.split(' '));
		}
		return acc;
	}, []);
}

function walkSync(currentDirPath, callback) {
	fs.readdirSync(currentDirPath).forEach(function (name) {
		let filePath = path.join(currentDirPath, name);

		let stat = fs.statSync(filePath);

		if (stat.isFile()) {
			callback(filePath, stat);
		} else if (stat.isDirectory()) {
			walkSync(filePath, callback);
		}
	});
}

function purgetss() {
	'use strict';

	let viewPaths = [];
	walkSync('../../app/views', viewPath => {
		viewPaths.push(viewPath);
	});

	let allClasses = [];
	_.each(viewPaths, viewPath => {
		allClasses.push(extractClasses(fs.readFileSync(viewPath, 'utf8')));
	});

	let uniqueClasses = _.uniq(_.flattenDeep(allClasses));

	// ! Copy Reset template
	console.log('::purgeTSS:: Copying Reset styles...');
	fs.copyFileSync(resetTSS, appTSS);

	if (fs.existsSync(baseTSS)) {
		console.log('::purgeTSS:: Copying Base styles...');
		fs.appendFileSync(appTSS, '\n// Project’s Styles\n');
		fs.appendFileSync(appTSS, fs.readFileSync(baseTSS, 'utf8'));
	}

	// ! FontAwesome
	console.log('::purgeTSS:: Copying Font Awesome styles...');
	fs.appendFileSync(appTSS, '\n// Font Awesome’s Styles\n');

	fs.readFileSync(fontAwesomeSourceTSS, 'utf8').split(/\r?\n/).forEach((line) => {
		_.each(uniqueClasses, className => {
			if (line.includes(`'.${className}'`)) {
				fs.appendFileSync(appTSS, line + '\n');
				return;
			}
		});
	});

	// ! Tailwind
	console.log('::purgeTSS:: Copying Tailwind styles...');
	fs.appendFileSync(appTSS, '\n// Tailwind’s Styles\n');

	fs.readFileSync(tailwindSourceTSS, 'utf8').split(/\r?\n/).forEach((line) => {
		_.each(uniqueClasses, className => {
			if (className !== 'vertical' && className !== 'horizontal' && line.includes(`'.${className}'`)) {
				fs.appendFileSync(appTSS, line + '\n');
				return;
			}
		});
	});

	console.log('::purgeTSS:: app.tss file created!');
};

purgetss();

module.exports.purgetss = purgetss;
