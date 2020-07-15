const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const convert = require('xml-js');
const traverse = require('traverse');
const arg = require('arg');
const junk = require('junk');

const resetTSS = path.resolve(__dirname, './tss/reset.tss');
const appTSS = './app/styles/app.tss';
const baseTSS = './app/styles/base.tss';

const tailwindSourceTSS = path.resolve(__dirname, './tss/tailwind.tss');
const fontAwesomeSourceTSS = path.resolve(__dirname, './tss/fontawesome.tss');

function extractClasses(texto) {
	return traverse(JSON.parse(convert.xml2json(texto, { compact: true }))).reduce(function (acc, value) {
		if (this.key === 'class') {
			acc.push(value.split(' '));
		}
		return acc;
	}, []);
}

function walkSync(currentDirPath, callback) {
	let files = fs.readdirSync(currentDirPath);

	files.filter(junk.not).forEach(function (name) {
		let filePath = path.join(currentDirPath, name);

		let stat = fs.statSync(filePath);

		if (stat.isFile()) {
			callback(filePath, stat);
		} else if (stat.isDirectory()) {
			walkSync(filePath, callback);
		}
	});
}

function parseArgs(rawArgs) {
	const args = arg({
		'--dev': Boolean,
		'-d': '--dev'
	}, {
		argv: rawArgs.slice(2)
	});

	return {
		development: args['--dev'] || false
	}
}

function purgetss(args) {
	'use strict';

	let options = parseArgs(args);

	let viewPaths = [];
	walkSync('./app/views', viewPath => {
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
		fs.appendFileSync(appTSS, '\n// *** Project Styles ***\n');
		fs.appendFileSync(appTSS, fs.readFileSync(baseTSS, 'utf8'));
	}

	if (options.development) {
		console.log('::purgeTSS:: DEV MODE, Copying Everything...');

		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(fontAwesomeSourceTSS, 'utf8'));

		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(tailwindSourceTSS, 'utf8'));
	} else {
		// ! FontAwesome
		console.log('::purgeTSS:: Copying Font Awesome styles...');

		fs.appendFileSync(appTSS, '\n// *** Font Awesome Styles ***\n');

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

		fs.appendFileSync(appTSS, '\n// *** Tailwind Styles ***\n');

		fs.readFileSync(tailwindSourceTSS, 'utf8').split(/\r?\n/).forEach((line) => {
			_.each(uniqueClasses, className => {
				if (className !== 'vertical' && className !== 'horizontal' && line.includes(`'.${className}'`)) {
					fs.appendFileSync(appTSS, line + '\n');
					return;
				}
			});
		});
	}

	console.log('::purgeTSS:: app.tss file created!');
};

module.exports.purgetss = purgetss;
