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

const logger = {
	info: function (...args) {
		console.log(purgeLabel, args.join(' '));
	},
	warn: function (...args) {
		console.log(purgeLabel, chalk.yellow(args.join(' ')));
	},
	error: function (...args) {
		console.log(purgeLabel, chalk.red(args.join(' ')));
	},
	file: function (...args) {
		console.log(purgeLabel, chalk.yellow(args.join(' ')), 'file created!');
	}
}

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
		case 'font':
		case 'fontawesome':
			// FontAwesome Fonts
			fs.copyFile(sourceFontsFolder + '/FontAwesome5Brands-Regular.ttf', detinationFontsFolder + '/FontAwesome5Brands-Regular.ttf', callback);
			fs.copyFile(sourceFontsFolder + '/FontAwesome5Free-Regular.ttf', detinationFontsFolder + '/FontAwesome5Free-Regular.ttf', callback);
			fs.copyFile(sourceFontsFolder + '/FontAwesome5Free-Solid.ttf', detinationFontsFolder + '/FontAwesome5Free-Solid.ttf', callback);

			logger.info('Font Awesome Icons Fonts copied to', chalk.yellow('./app/assets/fonts'));
			break;
		case 'md':
		case 'material':
		case 'materialdesign':
			// Material Desing Icons Font
			fs.copyFile(sourceFontsFolder + '/MaterialIcons-Regular.ttf', detinationFontsFolder + '/MaterialIcons-Regular.ttf', callback);
			fs.copyFile(sourceFontsFolder + '/MaterialIconsOutlined-Regular.otf', detinationFontsFolder + '/MaterialIconsOutlined-Regular.otf', callback);
			fs.copyFile(sourceFontsFolder + '/MaterialIconsRound-Regular.otf', detinationFontsFolder + '/MaterialIconsRound-Regular.otf', callback);
			fs.copyFile(sourceFontsFolder + '/MaterialIconsSharp-Regular.otf', detinationFontsFolder + '/MaterialIconsSharp-Regular.otf', callback);
			fs.copyFile(sourceFontsFolder + '/MaterialIconsTwoTone-Regular.otf', detinationFontsFolder + '/MaterialIconsTwoTone-Regular.otf', callback);

			logger.info('Material Design Icons Fonts copied to', chalk.yellow('./app/assets/fonts'));
			break;
		case 'li':
		case 'line':
		case 'lineicons':
			// LineIcons Font
			fs.copyFile(sourceFontsFolder + '/LineIcons.ttf', detinationFontsFolder + '/LineIcons.ttf', callback);

			logger.info('LineIcons Font copied to', chalk.yellow('./app/assets/fonts'));
			break;
	}
}

// Commands
function init() {
	if (checkIfAlloyProject()) {
		if (!fs.existsSync(configFile)) {
			if (!fs.existsSync(purgeTSSFolder)) {
				fs.mkdirSync(purgeTSSFolder)
			}

			fs.copyFileSync(srcConfigFile, configFile);

			logger.file('./purgetss/config.js');
		} else {
			logger.warn('./purgetss/config.js', chalk.red('file already exists!'));
		}
	}
}
module.exports.init = init;

function purgeClasses(options) {
	if (checkIfAlloyProject()) {
		let viewPaths = [];

		if (options.dev) {
			options.files = options.dev;
			devMode(options);
		} else {
			backupOriginalAppTss();

			copyResetTemplateAndOriginalAppTSS();

			walkSync(cwd + '/app/views', viewPath => {
				viewPaths.push(viewPath);
			});

			let allClasses = [];

			_.each(viewPaths, viewPath => {
				allClasses.push(extractClasses(fs.readFileSync(viewPath, 'utf8'), viewPath));
			});

			let uniqueClasses = _.uniq(_.flattenDeep(allClasses));

			purgeTailwind(uniqueClasses);

			// Parse Custom Classes from
			if (fs.existsSync(customTSS)) {
				purgeCustom(uniqueClasses);
			}

			purgeFontAwesome(uniqueClasses);

			purgeMaterialDesign(uniqueClasses);

			purgeLineIcons(uniqueClasses);

			logger.file('app.tss');
		}
	}
}
module.exports.purgeClasses = purgeClasses;

function buildCustom() {
	if (checkIfAlloyProject()) {
		if (fs.existsSync(configFile)) {
			let convertedStyles = fs.readFileSync(path.resolve(__dirname, './lib/templates/custom-template.tss'), 'utf8');

			let parseConfigFile = require(configFile);
			let colors = parseConfigFile.theme.colors;
			delete parseConfigFile.theme['colors'];

			let spacing = parseConfigFile.theme.spacing;
			delete parseConfigFile.theme['spacing'];

			let spacingKeys = ['margin', 'padding', 'width', 'height'];
			let colorKeys = ['textColor', 'backgroundColor', 'borderColor', 'placeholderColor', 'gradientColorStops'];

			let clientKeys = [];
			_.each(parseConfigFile.theme, (value, key) => {
				clientKeys.push(key);
			});

			colorKeys = colorKeys.filter((el) => !clientKeys.includes(el));
			spacingKeys = spacingKeys.filter((el) => !clientKeys.includes(el));

			// Fill in missing spacing keys
			if (spacing) {
				_.each(spacingKeys, (key) => {
					parseConfigFile.theme[key] = {};
				});
			}

			// Fill in missing color keys
			if (colors) {
				_.each(colorKeys, (key) => {
					parseConfigFile.theme[key] = {};
				});
			}

			_.each(parseConfigFile.theme, (value, key) => {
				convertedStyles += buildCustomValues(key, value, colors, spacing);
			});

			fs.writeFileSync(customTSS, convertedStyles);

			logger.file('./purgetss/custom.tss');
		} else {
			logger.warn('./purgetss/config.js', chalk.red('file doesn’t exists!\n             Please use `purgeTSS init` to create one!'));
		}
	}
}
module.exports.buildCustom = buildCustom;

function devMode(options) {
	if (checkIfAlloyProject()) {

		backupOriginalAppTss();

		copyResetTemplateAndOriginalAppTSS();

		if (options.files && typeof options.files === 'string') {
			let selected = _.uniq(options.files.replace(/ /g, '').split(','));
			if (selected.length === 5) {
				copyEverything();
			} else {
				_.each(selected, option => {
					switch (option) {
						case 'tw':
						case 'tail':
						case 'tailwind':
							logger.warn('DEV MODE: Copying Tailwind styles...');
							fs.appendFileSync(appTSS, '\n' + fs.readFileSync(tailwindSourceTSS, 'utf8'));
							break;
						case 'fa':
						case 'font':
						case 'fontawesome':
							logger.warn('DEV MODE: Copying Font Awesome styles...');
							fs.appendFileSync(appTSS, '\n' + fs.readFileSync(fontAwesomeSourceTSS, 'utf8'));
							break;
						case 'md':
						case 'material':
						case 'materialdesign':
							logger.warn('DEV MODE: Copying Material Design Icons styles...');
							fs.appendFileSync(appTSS, '\n' + fs.readFileSync(materialDesignIconsSourceTSS, 'utf8'));
							break;
						case 'li':
						case 'line':
						case 'lineicons':
							logger.warn('DEV MODE: Copying LineIcons styles...');
							fs.appendFileSync(appTSS, '\n' + fs.readFileSync(lineiconsFontSourceTSS, 'utf8'));
							break;
						case 'cu':
						case 'custom':
						case 'customstyles':
							if (fs.existsSync(customTSS)) {
								logger.warn('DEV MODE: Copying Custom styles...');
								fs.appendFileSync(appTSS, '\n' + fs.readFileSync(customTSS, 'utf8'));
							}
							break;
					}
				});
			}
		} else {
			copyEverything();
		}

		logger.file('app.tss');
	}
}
module.exports.devMode = devMode;

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

// Private Functions
function checkIfAlloyProject() {
	if (!fs.existsSync(cwd + '/app/views')) {
		logger.error('Please make sure you’re running purgeTSS inside an Alloy Project.');

		return false;
	}

	return true;
}

function backupOriginalAppTss() {
	//! FIRST: Backup original app.tss
	if (!fs.existsSync(_appTSS) && fs.existsSync(appTSS)) {
		logger.warn('Backing up app.tss into _app.tss\n             FROM NOW ON, add, update or delete your original classes in _app.tss');
		fs.copyFileSync(appTSS, _appTSS);
	} else if (!fs.existsSync(_appTSS)) {
		fs.appendFileSync(_appTSS, '// Empty _app.tss\n');
	}
}

function buildCustomValues(key, value, colors, spacing) {
	switch (key) {
		case 'textColor':
			return helpers.textColor({ ...colors, ...value });
		case 'backgroundColor':
			return helpers.backgroundColor({ ...colors, ...value });
		case 'borderColor':
			return helpers.borderColor({ ...colors, ...value });
		case 'placeholderColor':
			return helpers.placeholderColor({ ...colors, ...value });
		case 'gradientColorStops':
			return helpers.gradientColorStops({ ...colors, ...value });
		case 'fontFamily':
			return helpers.fontFamily(value);
		case 'fontSize':
			return helpers.fontSize(value);
		case 'borderRadius':
			return helpers.borderRadius(value);
		case 'borderWidth':
			return helpers.borderWidth(value);
		case 'margin':
			return helpers.margin({ ...spacing, ...value });
		case 'padding':
			return helpers.padding({ ...spacing, ...value });
		case 'width':
			return helpers.width({ ...spacing, ...value });
		case 'height':
			return helpers.height({ ...spacing, ...value });
		case 'opacity':
			return helpers.opacity(value);
		default:
			return helpers.customRules(value, key);
	}
}

function copyResetTemplateAndOriginalAppTSS() {
	//! Copy Reset template
	logger.info('Copying Reset styles...');
	fs.copyFileSync(resetTSS, appTSS);

	if (fs.existsSync(_appTSS)) {
		let appTSSContent = fs.readFileSync(_appTSS, 'utf8');
		if (appTSSContent.length) {
			logger.info('Copying', chalk.yellow('_app.tss'), 'styles...');
			fs.appendFileSync(appTSS, '\n// Styles from _app.tss\n');
			fs.appendFileSync(appTSS, appTSSContent);
		}
	}
}

function copyEverything() {
	logger.error('DEV MODE: Copying Everything... This could slow down compilation time!');
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(tailwindSourceTSS, 'utf8'));
	if (fs.existsSync(customTSS)) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(customTSS, 'utf8'));
	}
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(fontAwesomeSourceTSS, 'utf8'));
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(materialDesignIconsSourceTSS, 'utf8'));
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(lineiconsFontSourceTSS, 'utf8'));
}

function purgeTailwind(uniqueClasses) {
	//! Tailwind
	logger.info('Purging Tailwind styles...');

	let encontrados = '';
	fs.readFileSync(tailwindSourceTSS, 'utf8').split(/\r?\n/).forEach(line => {
		_.each(uniqueClasses, className => {
			if (line.includes(`'.${className}'`)) {
				encontrados += line + '\n';
				return;
			}
		});
	});

	if (encontrados) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind-template.tss'), 'utf8') + encontrados);
	}
}

function purgeCustom(uniqueClasses) {
	//! Custom
	logger.info('Purging Custom styles...');

	let encontrados = '';
	fs.readFileSync(customTSS, 'utf8').split(/\r?\n/).forEach(line => {
		_.each(uniqueClasses, className => {
			if (line.includes(`'.${className}'`)) {
				encontrados += line + '\n';
				return;
			}
		});
	});

	if (encontrados) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/custom-template.tss'), 'utf8') + encontrados);
	}
}

function purgeFontAwesome(uniqueClasses) {
	//! FontAwesome
	logger.info('Purging Font Awesome styles...');

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

function purgeMaterialDesign(uniqueClasses) {
	//! Material Design Icons
	logger.info('Purging Material Design Icons styles...');

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

function purgeLineIcons(uniqueClasses) {
	//! LineIcons
	logger.info('Purging LineIcons styles...');

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

	logger.info(chalk.yellow(file + ' file created!'));
}
