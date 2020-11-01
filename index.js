const fs = require('fs');
const junk = require('junk');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const convert = require('xml-js');
const traverse = require('traverse');
const colores = require('./lib/colores').colores;
module.exports.colores = colores;
const purgeLabel = colores.purgeLabel;
const helpers = require(path.resolve(__dirname, './lib/helpers'));

const cwd = process.cwd();

const appTSS = cwd + '/app/styles/app.tss';
const _appTSS = cwd + '/app/styles/_app.tss';
const purgeTSSFolder = cwd + '/purgetss';
const customTSS = purgeTSSFolder + '/custom.tss';
const configFile = purgeTSSFolder + '/config.js';
const resetTSS = path.resolve(__dirname, './tss/reset.tss');
const tailwindSourceTSS = path.resolve(__dirname, './tss/tailwind.tss');
const fontAwesomeSourceTSS = path.resolve(__dirname, './tss/fontawesome.tss');
const lineiconsFontSourceTSS = path.resolve(__dirname, './tss/lineicons.tss');
const srcConfigFile = path.resolve(__dirname, './lib/templates/purgetss.config.js');
const materialDesignIconsSourceTSS = path.resolve(__dirname, './tss/materialicons.tss');

const detinationFontsFolder = cwd + '/app/assets/fonts';
const sourceFontsFolder = path.resolve(__dirname, './assets/fonts');

function extractClasses(currentText, currentFile) {
	try {
		let jsontext = convert.xml2json(encodeHTML(currentText), { compact: true });

		return traverse(JSON.parse(jsontext)).reduce(function (acc, value) {
			if (this.key === 'class') acc.push(value.split(' '));
			return acc;
		}, []);
	} catch (error) {
		throw chalk.red(`::purgeTSS:: Error processing: “${currentFile}”`);
	}
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

function copyFont(vendor) {
	switch (vendor) {
		case 'fa':
			// FontAwesome Fonts
			fs.copyFile(sourceFontsFolder + '/FontAwesome5Brands-Regular.ttf', detinationFontsFolder + '/FontAwesome5Brands-Regular.ttf', callback);
			fs.copyFile(sourceFontsFolder + '/FontAwesome5Free-Regular.ttf', detinationFontsFolder + '/FontAwesome5Free-Regular.ttf', callback);
			fs.copyFile(sourceFontsFolder + '/FontAwesome5Free-Solid.ttf', detinationFontsFolder + '/FontAwesome5Free-Solid.ttf', callback);

			console.log(`${purgeLabel} Font Awesome Icons Fonts copied to ` + chalk.yellow('"app/assets/fonts"'));
			break;
		case 'md':
			// Material Desing Icons Font
			fs.copyFile(sourceFontsFolder + '/MaterialIcons-Regular.ttf', detinationFontsFolder + '/MaterialIcons-Regular.ttf', callback);
			fs.copyFile(sourceFontsFolder + '/MaterialIconsOutlined-Regular.otf', detinationFontsFolder + '/MaterialIconsOutlined-Regular.otf', callback);
			fs.copyFile(sourceFontsFolder + '/MaterialIconsRound-Regular.otf', detinationFontsFolder + '/MaterialIconsRound-Regular.otf', callback);
			fs.copyFile(sourceFontsFolder + '/MaterialIconsSharp-Regular.otf', detinationFontsFolder + '/MaterialIconsSharp-Regular.otf', callback);
			fs.copyFile(sourceFontsFolder + '/MaterialIconsTwoTone-Regular.otf', detinationFontsFolder + '/MaterialIconsTwoTone-Regular.otf', callback);

			console.log(`${purgeLabel} Material Design Icons Fonts copied to ` + chalk.yellow('"app/assets/fonts"'));
			break;
		case 'li':
			// LineIcons Font
			fs.copyFile(sourceFontsFolder + '/LineIcons.ttf', detinationFontsFolder + '/LineIcons.ttf', callback);

			console.log(`${purgeLabel} LineIcons Font copied to ` + chalk.yellow('"app/assets/fonts"'));
			break;
	}
}

function init() {
	if (checkIfAlloyProject()) {
		if (!fs.existsSync(configFile)) {
			if (!fs.existsSync(purgeTSSFolder)) {
				fs.mkdirSync(purgeTSSFolder)
			}
			console.log(chalk.yellow(purgeLabel + ' `purgetss.config.js` created!'));

			fs.copyFileSync(srcConfigFile, configFile);
		} else {
			console.log(chalk.red(purgeLabel + ' `purgetss.config.js` already exists!'));
		}
	}
}
module.exports.init = init;

function buildCustom() {
	if (checkIfAlloyProject()) {
		if (fs.existsSync(configFile)) {
			const parseConfigFile = require(configFile);

			let convertedStyles = fs.readFileSync(path.resolve(__dirname, './lib/templates/custom-template.tss'), 'utf8');

			let colors = parseConfigFile.theme.colors;
			let spacing = parseConfigFile.theme.spacing;

			_.each(parseConfigFile.theme, (value, key) => {
				convertedStyles += buildCustomValues(key, value, colors, spacing);
			});

			saveFile(customTSS, convertedStyles);
		} else {
			console.log(chalk.red(purgeLabel + ' `purgetss.config.js` doesn’t exists!\n              Please use `purgeTSS init` to create one!'));
		}
	}
}
module.exports.buildCustom = buildCustom;

function buildCustomValues(key, value, colors, spacing) {
	switch (key) {
		case 'textColor':
			return helpers.textColor({ ...value, ...colors });
		case 'backgroundColor':
			return helpers.backgroundColor({ ...value, ...colors });
		case 'borderColor':
			return helpers.borderColor({ ...value, ...colors });
		case 'placeholderColor':
			return helpers.placeholderColor({ ...value, ...colors });
		case 'gradientColorStops':
			return helpers.gradientColorStops({ ...value, ...colors });
		case 'fontFamily':
			return helpers.fontFamily(value);
		case 'fontSize':
			return helpers.fontSize(value);
		case 'fontWeight':
			return helpers.fontWeight(value);
		case 'borderRadius':
			return helpers.borderRadius(value);
		case 'borderWidth':
			return helpers.borderWidth(value);
		case 'margin':
			return helpers.margin({ ...value, ...spacing });
		case 'padding':
			return helpers.padding({ ...value, ...spacing });
		case 'width':
			return helpers.width({ ...value, ...spacing });
		case 'height':
			return helpers.height({ ...value, ...spacing });
		case 'opacity':
			return helpers.opacity(value);
		default:
			return '';
	}
}

function copyFonts(options) {
	if (checkIfAlloyProject()) {
		if (!fs.existsSync(detinationFontsFolder)) {
			fs.mkdirSync(detinationFontsFolder)
		}

		if (options.files && typeof options.files === 'string') {
			let selected = _.uniq(options.files.replace(/ /g, '').split(','));
			_.each(selected, vendor => {
				copyFont(vendor);
			});
		} else {
			copyFont('fa');
			copyFont('md');
			copyFont('li');
		}
	}
}
module.exports.copyFonts = copyFonts;

function purgeClasses(options) {
	if (checkIfAlloyProject()) {
		let viewPaths = [];

		if (options.dev) {
			options.files = options.dev;
			devMode(options);
		} else {
			backupOriginalAppTss();

			copyResetTemplate();

			walkSync(cwd + '/app/views', viewPath => {
				viewPaths.push(viewPath);
			});

			let allClasses = [];

			_.each(viewPaths, viewPath => {
				allClasses.push(extractClasses(fs.readFileSync(viewPath, 'utf8'), viewPath));
			});

			let uniqueClasses = _.uniq(_.flattenDeep(allClasses));

			processTailwind(uniqueClasses);

			// Parse Custom Classes from
			if (fs.existsSync(customTSS)) {
				processCustom(uniqueClasses);
			}

			processFA(uniqueClasses);

			processMD(uniqueClasses);

			processLineIcons(uniqueClasses);

			console.log(`${purgeLabel} app.tss file created!`);
		}
	}
}
module.exports.purgeClasses = purgeClasses;

function backupOriginalAppTss() {
	//! FIRST: Backup original app.tss
	if (!fs.existsSync(_appTSS) && fs.existsSync(appTSS)) {
		console.log(purgeLabel + chalk.yellow(' Backing up app.tss into _app.tss'));
		console.log(chalk.yellow('             FROM NOW ON, add, update or delete your custom classes in _app.tss'));
		fs.copyFileSync(appTSS, _appTSS);
	}
}

function copyResetTemplate() {
	//! Copy Reset template
	console.log(`${purgeLabel} Copying Reset styles...`);
	fs.copyFileSync(resetTSS, appTSS);

	if (fs.existsSync(_appTSS)) {
		let appTSSContent = fs.readFileSync(_appTSS, 'utf8');
		if (appTSSContent.length) {
			console.log(`${purgeLabel} Copying _app.tss styles...`);
			fs.appendFileSync(appTSS, '\n// Styles from _app.tss\n');
			fs.appendFileSync(appTSS, appTSSContent);
		}
	}
}

function copyEverything() {
	console.log(purgeLabel + chalk.red(' DEV MODE: Copying Everything... Might slow down compilation time!'));
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(tailwindSourceTSS, 'utf8'));
	if (fs.existsSync(customTSS)) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(customTSS, 'utf8'));
	}
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(fontAwesomeSourceTSS, 'utf8'));
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(materialDesignIconsSourceTSS, 'utf8'));
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(lineiconsFontSourceTSS, 'utf8'));
}

function devMode(options) {
	if (checkIfAlloyProject()) {

		backupOriginalAppTss();

		copyResetTemplate();

		if (options.files && typeof options.files === 'string') {
			let selected = _.uniq(options.files.replace(/ /g, '').split(','));
			if (selected.length === 4) {
				copyEverything();
			} else {
				_.each(selected, option => {
					switch (option) {
						case 'tw':
							console.log(purgeLabel + chalk.yellow(' DEV MODE: Copying Tailwind styles...'));
							fs.appendFileSync(appTSS, '\n' + fs.readFileSync(tailwindSourceTSS, 'utf8'));
							break;
						case 'fa':
							console.log(purgeLabel + chalk.yellow(' DEV MODE: Copying Font Awesome styles...'));
							fs.appendFileSync(appTSS, '\n' + fs.readFileSync(fontAwesomeSourceTSS, 'utf8'));
							break;
						case 'md':
							console.log(purgeLabel + chalk.yellow(' DEV MODE: Copying Material Design Icons styles...'));
							fs.appendFileSync(appTSS, '\n' + fs.readFileSync(materialDesignIconsSourceTSS, 'utf8'));
							break;
						case 'li':
							console.log(purgeLabel + chalk.yellow(' DEV MODE: Copying LineIcons styles...'));
							fs.appendFileSync(appTSS, '\n' + fs.readFileSync(lineiconsFontSourceTSS, 'utf8'));
							break;
						case 'custom':
							if (fs.existsSync(customTSS)) {
								console.log(purgeLabel + chalk.yellow(' DEV MODE: Copying custom.tss...'));
								fs.appendFileSync(appTSS, '\n' + fs.readFileSync(customTSS, 'utf8'));
							}
							break;
					}
				});
			}
		} else {
			copyEverything();
		}

		console.log(`${purgeLabel} app.tss file created!`);
	}
}
module.exports.devMode = devMode;

function checkIfAlloyProject() {
	if (!fs.existsSync(cwd + '/app/views')) {
		console.log(chalk.red(purgeLabel + ' Please make sure you’re running purgeTSS inside an Alloy Project.'));

		return false;
	}

	return true;
}

function processFA(uniqueClasses) {
	//! FontAwesome
	console.log(`${purgeLabel} Purging Font Awesome styles...`);

	let encontrados = '';
	fs.readFileSync(fontAwesomeSourceTSS, 'utf8').split(/\r?\n/).forEach(line => {
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

function processMD(uniqueClasses) {
	//! Material Design Icons
	console.log(`${purgeLabel} Purging Material Design Icons styles...`);

	let encontrados = '';
	fs.readFileSync(materialDesignIconsSourceTSS, 'utf8').split(/\r?\n/).forEach(line => {
		_.each(uniqueClasses, className => {
			if (line.includes(`'.${className}'`)) {
				encontrados += line + '\n';
				return;
			}
		});
	});

	if (encontrados) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/materialicons-template.tss'), 'utf8') + encontrados);
	}
}

function processLineIcons(uniqueClasses) {
	//! LineIcons
	console.log(`${purgeLabel} Purging LineIcons styles...`);

	let encontrados = '';
	fs.readFileSync(lineiconsFontSourceTSS, 'utf8').split(/\r?\n/).forEach(line => {
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
	fs.readFileSync(tailwindSourceTSS, 'utf8').split(/\r?\n/).forEach(line => {
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

function processCustom(uniqueClasses) {
	//! Custom
	console.log(`${purgeLabel} Purging Custom styles...`);

	let encontrados = '';
	fs.readFileSync(customTSS, 'utf8').split(/\r?\n/).forEach(line => {
		_.each(uniqueClasses, className => {
			if (className !== 'vertical' && className !== 'horizontal' && line.includes(`'.${className}'`)) {
				encontrados += line + '\n';
				return;
			}
		});
	});

	if (encontrados) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/custom-template.tss'), 'utf8') + encontrados);
	}
}

function encodeHTML(str) {
	const code = {
		'&': '&amp;',
	};
	return str.replace(/[&]/gm, (i) => code[i]);
}

function saveFile(file, data) {
	fs.writeFileSync(file, data, err => {
		throw err;
	});

	console.log(`${purgeLabel} '${file}' file created!`);
}
