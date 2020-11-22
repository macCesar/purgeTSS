const fs = require('fs');
const junk = require('junk');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const convert = require('xml-js');
const traverse = require('traverse');
const { config } = require('process');
const colores = require('./lib/colores').colores;
module.exports.colores = colores;
const purgeLabel = colores.purgeLabel;

const logger = {
	info: function(...args) {
		console.log(purgeLabel, args.join(' '));
	},
	warn: function(...args) {
		console.log(purgeLabel, chalk.yellow(args.join(' ')));
	},
	error: function(...args) {
		console.log(purgeLabel, chalk.red(args.join(' ')));
	},
	file: function(...args) {
		console.log(purgeLabel, chalk.yellow(args.join(' ')), 'file created!');
	}
}

const helpers = require(path.resolve(__dirname, './lib/helpers'));

const cwd = process.cwd();

const appTSS = cwd + '/app/styles/app.tss';
const _appTSS = cwd + '/app/styles/_app.tss';
const purgeTSSFolder = cwd + '/purgetss';
const customTSS = purgeTSSFolder + '/custom.tss';
const customTailwind = purgeTSSFolder + '/tailwind.tss';
const configJS = purgeTSSFolder + '/config.js';
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

		return traverse(JSON.parse(jsontext)).reduce(function(acc, value) {
			if (this.key === 'class' || this.key === 'id') acc.push(value.split(' '));
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
		if (!fs.existsSync(configJS)) {
			if (!fs.existsSync(purgeTSSFolder)) {
				fs.mkdirSync(purgeTSSFolder)
			}

			fs.copyFileSync(srcConfigFile, configJS);

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
			let configFile = (fs.existsSync(configJS)) ? require(configJS) : false;

			let safelist = false;
			let purgeMode = 'all';
			let purgeOptions = false;

			if (configFile.purge) {
				purgeMode = configFile.purge.mode || 'all';
				purgeOptions = configFile.purge.options || false;
				safelist = purgeOptions.safelist || false;
			}

			backupOriginalAppTss();

			copyResetTemplateAndOriginalAppTSS();

			walkSync(cwd + '/app/views', viewPath => {
				viewPaths.push(viewPath);
			});

			let allClasses = [];

			_.each(viewPaths, viewPath => {
				let file = fs.readFileSync(viewPath, 'utf8');

				if (purgeMode === 'all') {
					allClasses.push(extractClasses(file, viewPath));
				} else {
					allClasses.push(file.match(/[^<>"'`\s]*[^<>"'`\s:]/g));
				}
			});

			if (safelist) {
				_.each(safelist, safe => {
					allClasses.push(safe);
				})
			}

			let uniqueClasses = _.uniq(_.flattenDeep(allClasses));

			if (fs.existsSync(customTailwind)) {
				purgeCustomTailwind(uniqueClasses);
			} else {
				purgeTailwind(uniqueClasses);
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
		if (!fs.existsSync(configJS)) {
			init();
		}
		buildCustomTailwind();
	}
}
module.exports.buildCustom = buildCustom;

function buildCustomTailwind() {
	let configFile = require(configJS);
	const defaultColors = require('tailwindcss/colors');
	const defaultTheme = require('tailwindcss/defaultTheme');
	const tailwindui = require('@tailwindcss/ui/index')({}, {}).config.theme;

	if (!configFile.theme.extend) {
		configFile.theme.extend = {};
	}

	let allWidthsCombined = (configFile.theme.spacing) ? { ...{ full: '100%', auto: '', screen: '' }, ...configFile.theme.spacing } : { ...tailwindui.width(theme => (tailwindui.spacing)), ...defaultTheme.width(theme => (defaultTheme.spacing)) };
	let allHeightsCombined = (configFile.theme.spacing) ? { ...{ full: '100%', auto: '', screen: '' }, ...configFile.theme.spacing } : defaultTheme.height(theme => (defaultTheme.spacing));

	let overwritten = {
		colors: (configFile.theme.colors) ? configFile.theme.colors : { transparent: 'transparent', ...defaultColors },
		spacing: (configFile.theme.spacing) ? configFile.theme.spacing : { ...tailwindui.spacing, ...defaultTheme.spacing },
		width: (configFile.theme.width) ? configFile.theme.width : allWidthsCombined,
		height: (configFile.theme.height) ? configFile.theme.height : allHeightsCombined
	}

	let base = {
		colors: { ...overwritten.colors, ...configFile.theme.extend.colors },
		spacing: { ...overwritten.spacing, ...configFile.theme.extend.spacing },
		width: { ...overwritten.width, ...overwritten.spacing, ...configFile.theme.extend.width, ...configFile.theme.extend.spacing },
		height: { ...overwritten.height, ...overwritten.spacing, ...configFile.theme.extend.height, ...configFile.theme.extend.spacing }
	}

	// color
	configFile.theme.textColor = combineKeys(configFile.theme, base.colors, 'textColor', true);

	// backgroundColor
	configFile.theme.backgroundColor = combineKeys(configFile.theme, base.colors, 'backgroundColor', true);

	// borderColor
	configFile.theme.borderColor = combineKeys(configFile.theme, base.colors, 'borderColor', true);

	// placeholderColor
	configFile.theme.placeholderColor = combineKeys(configFile.theme, base.colors, 'placeholderColor', true);

	// Gradient Color Stops
	configFile.theme.gradientColorStops = combineKeys(configFile.theme, base.colors, 'gradientColorStops', true);

	// Background Gradient
	configFile.theme.backgroundGradient = {};

	// Object Position
	configFile.theme.placement = {};

	// Font Sizes
	configFile.theme.fontSize = combineKeys(configFile.theme, defaultTheme.fontSize, 'fontSize', false);

	// Font Style
	configFile.theme.fontStyle = {};

	// Font Weight
	configFile.theme.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight', true);

	// Font Family
	configFile.theme.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily', false);
	if (!Object.keys(configFile.theme.fontFamily).length) {
		delete configFile.theme.fontFamily;
	}

	// Text Align
	configFile.theme.textAlign = {};

	// Vertical Alignment
	configFile.theme.verticalAlignment = {};

	// Border Radius
	// configFile.theme.borderRadius = combineKeys(configFile.theme, { ...defaultTheme.borderRadius, ...base.spacing }, 'borderRadius', false);

	// Border Radius ( Extra Styles )
	let defaultBorderRadius = (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...base.spacing, ...defaultTheme.borderRadius };
	configFile.theme.borderRadiusExtraStyles = combineKeys(configFile.theme, { ...defaultBorderRadius, ...configFile.theme.spacing, ...configFile.theme.extend.spacing }, 'borderRadius', true);

	// Border Width
	configFile.theme.borderWidth = combineKeys(configFile.theme, defaultTheme.borderWidth, 'borderWidth', false);

	// Margin
	configFile.theme.margin = combineKeys(configFile.theme, base.spacing, 'margin', true);

	// Padding
	configFile.theme.padding = combineKeys(configFile.theme, base.spacing, 'padding', true);

	// Sizing
	configFile.theme.width = base.width;
	configFile.theme.height = base.height;

	// Box Shadow
	configFile.theme.shadow = {};

	// Opacity
	configFile.theme.opacity = (configFile.theme.opacity) ? { ...configFile.theme.opacity, ...configFile.theme.extend.opacity } : { ...defaultTheme.opacity, ...configFile.theme.extend.opacity };

	// Interactivity
	configFile.theme.interactivity = {};

	let convertedStyles = fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind-template.tss'), 'utf8');
	convertedStyles += fs.readFileSync(path.resolve(__dirname, './lib/templates/custom-tailwind-template.tss'), 'utf8');

	delete configFile.theme.extend;
	delete configFile.theme.colors;
	delete configFile.theme.spacing;
	delete configFile.theme.borderRadius;

	_.each(configFile.corePlugins, (value, key) => {
		delete configFile.theme[ key ];
	});

	let sorteado = Object.entries(configFile.theme).sort().reduce((o, [ k, v ]) => (o[ k ] = v, o), {});

	_.each(sorteado, (value, key) => {
		convertedStyles += buildCustomValues(key, value);
	});

	fs.writeFileSync(customTailwind, convertedStyles);

	logger.file('./purgetss/tailwind.tss');
}

function combineKeys(values, base, key, extras = false) {
	if (extras) {
		_extras = base;
	} else {
		_extras = {};
	}

	return (values[ key ]) ? { ..._extras, ...values[ key ], ...values.extend[ key ] } : { ...base, ...values.extend[ key ] };
}

function buildCustomValues(key, value) {
	switch (key) {
		case 'textColor':
			return helpers.textColor(value);
		case 'backgroundColor':
			return helpers.backgroundColor(value);
		case 'borderColor':
			return helpers.borderColor(value);
		case 'placeholderColor':
			return helpers.placeholderColor(value);
		case 'backgroundGradient':
			return helpers.backgroundGradient();
		case 'gradientColorStops':
			return helpers.gradientColorStops(value);
		case 'placement':
			return helpers.placement();
		case 'fontFamily':
			return helpers.fontFamily(value);
		case 'fontSize':
			return helpers.fontSize(value);
		case 'fontStyle':
			return helpers.fontStyle();
		case 'fontWeight':
			return helpers.fontWeight(value);
		case 'textAlign':
			return helpers.textAlign();
		case 'verticalAlignment':
			return helpers.verticalAlignment();
		case 'borderRadius':
			return helpers.borderRadius(value);
		case 'borderRadiusExtraStyles':
			return helpers.borderRadiusExtraStyles(value);
		case 'borderWidth':
			return helpers.borderWidth(value);
		case 'margin':
			return helpers.margin(value, true);
		case 'padding':
			return helpers.padding(value);
		case 'width':
			return helpers.width(value);
		case 'height':
			return helpers.height(value);
		case 'shadow':
			return helpers.shadow();
		case 'opacity':
			return helpers.opacity(value);
		case 'interactivity':
			return helpers.interactivity(value);
		default:
			return helpers.customRules(value, key);
	}
}

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
							if (fs.existsSync(customTailwind)) {
								logger.warn('DEV MODE: Copying Custom Tailwind styles...');
								fs.appendFileSync(appTSS, '\n' + fs.readFileSync(customTailwind, 'utf8'));
							} else {
								logger.warn('DEV MODE: Copying Default Tailwind styles...');
								fs.appendFileSync(appTSS, '\n' + fs.readFileSync(tailwindSourceTSS, 'utf8'));
							}
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
	if (fs.existsSync(customTailwind)) {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(customTailwind, 'utf8'));
	} else {
		fs.appendFileSync(appTSS, '\n' + fs.readFileSync(tailwindSourceTSS, 'utf8'));
	}
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(fontAwesomeSourceTSS, 'utf8'));
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(materialDesignIconsSourceTSS, 'utf8'));
	fs.appendFileSync(appTSS, '\n' + fs.readFileSync(lineiconsFontSourceTSS, 'utf8'));
}

function purgeTailwind(uniqueClasses) {
	//! Tailwind
	logger.info('Purging Default Tailwind styles...');

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

function purgeCustomTailwind(uniqueClasses) {
	//! Custom
	logger.info('Purging', chalk.yellow('Custom Tailwind'), 'styles...');

	let encontrados = '';
	fs.readFileSync(customTailwind, 'utf8').split(/\r?\n/).forEach(line => {
		_.each(uniqueClasses, className => {
			if (line.includes(`'.${className}'`) || line.includes(`'.${className}[`) || line.includes(`'#${className}'`) || line.includes(`'#${className}[`) || line.includes(`'${className}'`) || line.includes(`'${className}[`)) {
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
	return str.replace(/[&]/gm, i => code[ i ]);
}

function saveFile(file, data) {
	fs.writeFileSync(file, data, err => {
		throw err;
	});

	logger.info(chalk.yellow(file + ' file created!'));
}
