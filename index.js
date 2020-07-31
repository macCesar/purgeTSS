const fs = require('fs');
const arg = require('arg');
const junk = require('junk');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const convert = require('xml-js');
const traverse = require('traverse');
const colores = {
	gris: '#53606B',
	verdeClaro: '#8FB63E',
	verdeOscuro: '#79A342',
	purgeLabel: chalk.hex('#79A342')('::purgeTSS::')
}
module.exports.colores = colores;

const purgeLabel = colores.purgeLabel;

const cwd = process.cwd();

const appTSS = cwd + '/app/styles/app.tss';
const _appTSS = cwd + '/app/styles/_app.tss';
const resetTSS = path.resolve(__dirname, './tss/reset.tss');
const tailwindSourceTSS = path.resolve(__dirname, './tss/tailwind.tss');
const fontAwesomeSourceTSS = path.resolve(__dirname, './tss/fontawesome.tss');

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

		let uniqueClasses = _.uniq(_.flattenDeep(allClasses));

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

			console.log(`${purgeLabel} Copying _app.tss styles...`);
			fs.appendFileSync(appTSS, '\n// *** _app.tss Styles ***\n');
			fs.appendFileSync(appTSS, fs.readFileSync(_appTSS, 'utf8'));
		}

		if (options.dev) {
			console.log(purgeLabel + chalk.yellow(' DEV MODE, Copying Everything...'));

			fs.appendFileSync(appTSS, '\n' + fs.readFileSync(fontAwesomeSourceTSS, 'utf8'));

			fs.appendFileSync(appTSS, '\n' + fs.readFileSync(tailwindSourceTSS, 'utf8'));
		} else {
			//! FontAwesome
			console.log(`${purgeLabel} Copying Font Awesome styles...`);

			fs.appendFileSync(appTSS, '\n// *** Font Awesome Styles ***\n');

			fs.readFileSync(fontAwesomeSourceTSS, 'utf8').split(/\r?\n/).forEach((line) => {
				_.each(uniqueClasses, className => {
					if (line.includes(`'.${className}'`)) {
						fs.appendFileSync(appTSS, line + '\n');
						return;
					}
				});
			});

			//! Tailwind
			console.log(`${purgeLabel} Copying Tailwind styles...`);

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

		console.log(`${purgeLabel} app.tss file created!`);

	} else {
		console.log(chalk.red(purgeLabel + ' Please make sure you’re running purgeTSS inside an Alloy Project.'))
	}
}
module.exports.purgeClasses = purgeClasses;
