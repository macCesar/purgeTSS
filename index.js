const fs = require('fs');
const arg = require('arg');
const junk = require('junk');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const convert = require('xml-js');
const traverse = require('traverse');
const colores = require('./lib/colores').colores;
const purgeLabel = colores.purgeLabel;

const cwd = process.cwd();

let encontrados = '';
const appTSS = cwd + '/app/styles/app.tss';
const _appTSS = cwd + '/app/styles/_app.tss';
const resetTSS = path.resolve(__dirname, './tss/reset.tss');
const tailwindSourceTSS = path.resolve(__dirname, './tss/tailwind.tss');
const fontAwesomeSourceTSS = path.resolve(__dirname, './tss/fontawesome.tss');
const lineiconsFontSourceTSS = path.resolve(__dirname, './tss/lineicons.tss');

function extractClasses(texto) {
	return traverse(JSON.parse(convert.xml2json(texto, { compact: true }))).reduce(function (acc, value) {
		if (this.key === 'class') acc.push(value.split(' '));
		return acc;
	}, []);
}

function callback(err) {
	if (err) throw err;
}

function walkSync(currentDirPath, callback) {
	let files = fs.readdirSync(currentDirPath);

	files.filter(junk.not).forEach(name => {
		let filePath = path.join(currentDirPath, name);

		let stat = fs.statSync(filePath);

		if (stat.isFile()) {
			callback(filePath, stat);
		} else if (stat.isDirectory()) {
			walkSync(filePath, callback);
		}
	});
}

function copyFontsFolder() {
	const detinationFontsFolder = cwd + '/app/assets/fonts';
	const sourceFontsFolder = path.resolve(__dirname, './assets/fonts');

	if (!fs.existsSync(detinationFontsFolder)) {
		fs.mkdirSync(detinationFontsFolder)
	}

	fs.copyFile(sourceFontsFolder + '/FontAwesome5Brands-Regular.ttf', detinationFontsFolder + '/FontAwesome5Brands-Regular.ttf', callback);
	fs.copyFile(sourceFontsFolder + '/FontAwesome5Free-Regular.ttf', detinationFontsFolder + '/FontAwesome5Free-Regular.ttf', callback);
	fs.copyFile(sourceFontsFolder + '/FontAwesome5Free-Solid.ttf', detinationFontsFolder + '/FontAwesome5Free-Solid.ttf', callback);

	console.log(`${purgeLabel} Font Awesome icons Fonts copied to ` + chalk.yellow('"app/assets/fonts"'));

	fs.copyFile(sourceFontsFolder + '/LineIcons.ttf', detinationFontsFolder + '/LineIcons.ttf', callback);

	console.log(`${purgeLabel} LineIcons Font copied to ` + chalk.yellow('"app/assets/fonts"'));
}
module.exports.copyFontsFolder = copyFontsFolder;

function purgeClasses(options) {
	let viewPaths = [];

	if (fs.existsSync(cwd + '/app/views')) {
		walkSync(cwd + '/app/views', viewPath => {
			viewPaths.push(viewPath);
		});

		let allClasses = [];

		_.each(viewPaths, viewPath => {
			allClasses.push(extractClasses(fs.readFileSync(viewPath, 'utf8')));
		});

		//! FIRST: Backup original app.tss
		if (!fs.existsSync(_appTSS) && fs.existsSync(appTSS)) {
			console.log(purgeLabel + chalk.yellow(' Backing up app.tss into _app.tss'));
			console.log(chalk.yellow('             FROM NOW ON, add, update or delete your custom classes in _app.tss'));
			fs.copyFileSync(appTSS, _appTSS);
		}

		//! Copy Reset template
		console.log(`${purgeLabel} Copying Reset styles...`);
		fs.copyFileSync(resetTSS, appTSS);

		if (fs.existsSync(_appTSS)) {
			let appTSSContent = fs.readFileSync(_appTSS, 'utf8');
			if (appTSSContent.length) {
				console.log(`${purgeLabel} Copying _app.tss styles...`);
				fs.appendFileSync(appTSS, '\n// *** _app.tss Styles ***\n');
				fs.appendFileSync(appTSS, appTSSContent);
			}
		}

		if (options.dev) {
			console.log(purgeLabel + chalk.yellow(' DEV MODE, Copying Everything...'));
			fs.appendFileSync(appTSS, '\n' + fs.readFileSync(fontAwesomeSourceTSS, 'utf8'));
			fs.appendFileSync(appTSS, '\n\n' + fs.readFileSync(lineiconsFontSourceTSS, 'utf8'));
			fs.appendFileSync(appTSS, '\n\n' + fs.readFileSync(tailwindSourceTSS, 'utf8'));
		} else {
			let uniqueClasses = _.uniq(_.flattenDeep(allClasses));

			processTailwind(uniqueClasses);

			processFA(uniqueClasses);

			processLineIcons(uniqueClasses);
		}

		console.log(`${purgeLabel} app.tss file created!`);

	} else {
		console.log(chalk.red(purgeLabel + ' Please make sure you’re running purgeTSS inside an Alloy Project.'))
	}
}
module.exports.purgeClasses = purgeClasses;

function processFA(uniqueClasses) {
	//! FontAwesome
	console.log(`${purgeLabel} Purging Font Awesome styles...`);

	let encontrados = '';
	fs.readFileSync(fontAwesomeSourceTSS, 'utf8').split(/\r?\n/).forEach((line) => {
		_.each(uniqueClasses, className => {
			if (line.includes(`'.${className}'`)) {
				encontrados += line + '\n';
				return;
			}
		});
	});

	if (encontrados) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/fontawesome-template.tss'), 'utf8') + encontrados);
	}
}

function processLineIcons(uniqueClasses) {
	//! LineIcons
	console.log(`${purgeLabel} Purging LineIcons styles...`);

	let encontrados = '';
	fs.readFileSync(lineiconsFontSourceTSS, 'utf8').split(/\r?\n/).forEach((line) => {
		_.each(uniqueClasses, className => {
			if (line.includes(`'.${className}'`)) {
				encontrados += line + '\n';
				return;
			}
		});
	});

	if (encontrados) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/lineicons-template.tss'), 'utf8') + encontrados);
	}
}

function processTailwind(uniqueClasses) {
	//! Tailwind
	console.log(`${purgeLabel} Purging Tailwind styles...`);

	let encontrados = '';
	fs.readFileSync(tailwindSourceTSS, 'utf8').split(/\r?\n/).forEach((line) => {
		_.each(uniqueClasses, className => {
			if (className !== 'vertical' && className !== 'horizontal' && line.includes(`'.${className}'`)) {
				encontrados += line + '\n';
				return;
			}
		});
	});

	if (encontrados) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind-template.tss'), 'utf8') + encontrados);
	}
}
