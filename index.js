const fs = require('fs');
const _ = require('lodash');
const junk = require('junk');
const glob = require("glob");
const path = require('path');
const chalk = require('chalk');
const convert = require('xml-js');
const readCSS = require('read-css');
const traverse = require('traverse');
const { config, exit } = require('process');
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

const destJMKFile = cwd + '/app/alloy.jmk';
const destPurgeTSSFolder = cwd + '/purgetss';
const destFontsFolder = cwd + '/app/assets/fonts';
const destAppTSSFile = cwd + '/app/styles/app.tss';
const dest_appTSSFile = cwd + '/app/styles/_app.tss';
const destConfigJSFile = cwd + '/purgetss/config.js';
//
const customTailwindFile = cwd + '/purgetss/tailwind.tss';
const defaultTailwindFile = path.resolve(__dirname, './tss/tailwind.tss');
//
const customFontAwesomeFile = cwd + '/purgetss/fontawesome.tss';
const destLibFolder = cwd + '/app/lib';
const customFontAwesomeJSFile = cwd + '/app/lib/fontawesome.js';

// PRO
const srcFontAwesomeProCSSFile = cwd + '/node_modules/@fortawesome/fontawesome-pro/css/all.css';
const srcFontAwesomeProWebFontsFolder = cwd + '/node_modules/@fortawesome/fontawesome-pro/webfonts/';
const srcFontAwesomeProResetTSS = './lib/templates/fontawesome-pro-reset.tss';
const srcFontAwesomeProTemplateTSS = './lib/templates/fontawesome-pro-template.tss';
const srcFontAwesomeProFontFamilies = {
	'fa-light-300.ttf': 'FontAwesome5Pro-Light.ttf',
	'fa-brands-400.ttf': 'FontAwesome5Brands-Regular.ttf',
	'fa-regular-400.ttf': 'FontAwesome5Pro-Regular.ttf',
	'fa-solid-900.ttf': 'FontAwesome5Pro-Solid.ttf'
}

// BETA
const srcFontAwesomeBetaCSSFile = cwd + '/purgetss/fontawesome-beta/css/all.css';
const srcFontAwesomeBetaWebFontsFolder = cwd + '/purgetss/fontawesome-beta/webfonts/';
const srcFontAwesomeBetaResetTSS = './lib/templates/fontawesome-beta-reset.tss';
const srcFontAwesomeBetaTemplateTSS = './lib/templates/fontawesome-beta-template.tss';
const srcFontAwesomeBetaFontFamilies = {
	'fa-thin-100.ttf': 'FontAwesome6Pro-Thin.ttf',
	'fa-light-300.ttf': 'FontAwesome6Pro-Light.ttf',
	'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
	'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
	'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf',
}
//
const srcFontsFolder = path.resolve(__dirname, './assets/fonts');
const srcResetTSSFile = path.resolve(__dirname, './tss/reset.tss');
const srcJMKFile = path.resolve(__dirname, './lib/templates/alloy.jmk');
const srcFontAwesomeTSSFile = path.resolve(__dirname, './tss/fontawesome.tss');
const srcLineiconsFontTSSFile = path.resolve(__dirname, './tss/lineicons.tss');
const srcPurgetssConfigFile = path.resolve(__dirname, './lib/templates/purgetss.config.js');
const srcMaterialDesignIconsTSSFile = path.resolve(__dirname, './tss/materialicons.tss');
//

//! Interfase
//! Command: dev-mode
function devMode(options) {
	if (alloyProject()) {

		let tempPurged = backupOriginalAppTss();

		tempPurged += copyResetTemplateAnd_appTSS();

		if (options.files && typeof options.files === 'string') {
			let selected = _.uniq(options.files.replace(/ /g, '').split(','));
			tempPurged += (selected.length === 4) ? copyAllLibraries() : copySelectedLibraries(selected);
		} else {
			tempPurged += copyAllLibraries();
		}

		saveFile(destAppTSSFile, tempPurged);

		logger.file('app.tss');
	}
}
module.exports.devMode = devMode;

//! Command: watch
function watchMode(options) {
	if (alloyProject()) {
		if (fs.existsSync(destJMKFile)) {
			logger.warn('./app/alloy.jmk', chalk.red('file already exists!'));

			let updatedJMKFile = [];
			let originalJMKFile = fs.readFileSync(destJMKFile, 'utf8');
			let includesPurgeTSS = (originalJMKFile.includes('purgeTSS'));
			let includesPreCompileFunction = (originalJMKFile.includes('pre:compile'));

			//! TODO: Refactor with readline or line-reader: https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
			if (options.off) {
				originalJMKFile.split(/\r?\n/).forEach((line) => {
					if (!line.includes('purgeTSS')) {
						updatedJMKFile.push(line);
					}
				});
				saveFile(destJMKFile, updatedJMKFile.join("\n"));
			} else if (!includesPurgeTSS) {
				if (includesPreCompileFunction) {
					originalJMKFile.split(/\r?\n/).forEach((line) => {
						if (line.includes('pre:compile')) {
							line += "\n\trequire('child_process').execSync('purgetss', logger.warn('::purgeTSS:: Auto-Purging ' + event.dir.project));";
						}
						updatedJMKFile.push(line);
					});
					saveFile(destJMKFile, updatedJMKFile.join("\n"));
				} else {
					fs.appendFileSync(destJMKFile, '\n' + fs.readFileSync(srcJMKFile, 'utf8'));
				}
			}
		} else if (!options.off) {
			createJMKFile();
		}
	}
}
module.exports.watchMode = watchMode;

//! Command: copy-fonts
function copyFonts(options) {
	if (alloyProject()) {
		makeSureFolderExists(destFontsFolder);

		if (options.files && typeof options.files === 'string') {
			let selected = _.uniq(options.files.replace(/ /g, '').split(','));
			_.each(selected, vendor => {
				copyFont(vendor);
			});
		} else {
			copyFont('fa');
			copyFont('li');
			copyFont('md');
		}
	}
}
module.exports.copyFonts = copyFonts;

//! Command: purgetss
function purgeClasses(options) {
	start();
	if (alloyProject()) {
		if (options.dev) {
			options.files = options.dev;
			devMode(options);
		} else {
			let uniqueClasses = getUniqueClasses();

			let tempPurged = backupOriginalAppTss();

			tempPurged += copyResetTemplateAnd_appTSS();

			tempPurged += purgeTailwind(uniqueClasses);

			tempPurged += purgeFontAwesome(uniqueClasses);

			tempPurged += purgeMaterialDesign(uniqueClasses);

			tempPurged += purgeLineIcons(uniqueClasses);

			saveFile(destAppTSSFile, tempPurged);

			logger.file('app.tss');
		}
	}

	logger.warn(end());
}
module.exports.purgeClasses = purgeClasses;

//! Command: init
function init() {
	if (alloyProject()) {
		if (fs.existsSync(destConfigJSFile)) {
			logger.warn('./purgetss/config.js', chalk.red('file already exists!'));
		} else {
			makeSureFolderExists(destPurgeTSSFolder);

			fs.copyFileSync(srcPurgetssConfigFile, destConfigJSFile);

			logger.file('./purgetss/config.js');
		}
	}
}
module.exports.init = init;

//! Command: build-custom
function buildCustom() {
	if (alloyProject()) {
		initIfNotConfig()
		buildCustomTailwind();
		buildCustomFontAwesome();
		buildCustomFontAwesomeJS();
	}
}
module.exports.buildCustom = buildCustom;

function buildCustomFontAwesome() {
	if (fs.existsSync(srcFontAwesomeBetaCSSFile)) {
		processCustomFontAwesomeTSS(srcFontAwesomeBetaCSSFile, srcFontAwesomeBetaTemplateTSS, srcFontAwesomeBetaResetTSS, srcFontAwesomeBetaFontFamilies, srcFontAwesomeBetaWebFontsFolder);
	} else if (fs.existsSync(srcFontAwesomeProCSSFile)) {
		processCustomFontAwesomeTSS(srcFontAwesomeProCSSFile, srcFontAwesomeProTemplateTSS, srcFontAwesomeProResetTSS, srcFontAwesomeProFontFamilies, srcFontAwesomeProWebFontsFolder);
	}
}

function processCustomFontAwesomeTSS(CSSFile, templateTSS, resetTSS, fontFamilies, webFonts) {
	readCSS(CSSFile, (err, data) => {
		if (err) throw err

		let tssClasses = fs.readFileSync(path.resolve(__dirname, templateTSS), 'utf8') + '\n';

		tssClasses += fs.readFileSync(path.resolve(__dirname, resetTSS), 'utf8') + '\n';

		tssClasses += processFontawesomeStyles(data);

		fs.writeFileSync(customFontAwesomeFile, tssClasses, err => {
			throw err;
		});

		logger.file('./purgetss/fontawesome.tss');

		// Check if fonts are copied to assets/fonts
		makeSureFolderExists(destFontsFolder);

		copyProFonts(fontFamilies, webFonts);
	});
}
function prettifyFontName(str) {
	str = str.replace('fa-', '');
	var temp = str.split('-'), i, pretty;

	for (i = 0; i < temp.length; i++) {
		temp[ i ] = temp[ i ].charAt(0).toUpperCase() + temp[ i ].slice(1);
	}

	pretty = temp.join('').replace(':', '');
	pretty = pretty.replace(/^.{1}/g, pretty[ 0 ].toLowerCase());

	return pretty;
};

function buildCustomFontAwesomeJS() {
	if (fs.existsSync(srcFontAwesomeBetaCSSFile)) {
		processCustomFontAwesomeJS(srcFontAwesomeBetaCSSFile, './lib/templates/fa-beta.js');
	} else if (fs.existsSync(srcFontAwesomeProCSSFile)) {
		processCustomFontAwesomeJS(srcFontAwesomeProCSSFile, './lib/templates/fa-pro.js');
	}
}

function processCustomFontAwesomeJS(CSSFile, faJS) {
	readCSS(CSSFile, (err, data) => {
		if (err) throw err

		let rules = _.map(data.stylesheet.rules, rule => {
			if (rule.type === 'rule' && rule.selectors[ 0 ].includes(':before') && !rule.selectors[ 0 ].includes('.fad')) {
				return {
					'selector': rule.selectors[ 0 ].replace(':before', '').replace('.', '').replace(':', ''),
					'property': rule.declarations[ 0 ].value.replace('\"\\', '').replace('\"', '')
				};
			}
		});

		let paraJS = 'const fontawesome = {\n';

		_.each(rules, rule => {
			if (rule) {
				paraJS += `\t'${rule.selector}': '\\u${rule.property}',\n`;
			}
		});

		paraJS += '};\n';

		paraJS += 'exports.fontawesome = fontawesome;\n';

		let tssClasses = fs.readFileSync(path.resolve(__dirname, faJS), 'utf8');

		tssClasses += '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/fa-functions.js'), 'utf8');

		tssClasses += '\n' + paraJS;

		let exportIcons = '\nconst icons = {\n';

		_.each(rules, rule => {
			if (rule) {
				exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`;
			}
		});

		exportIcons += '};\n';
		exportIcons += 'exports.icons = icons;\n';

		tssClasses += exportIcons;

		makeSureFolderExists(destLibFolder);

		fs.writeFileSync(customFontAwesomeJSFile, tssClasses, err => {
			throw err;
		});

		logger.file('./purgetss/fontawesome.js');
	});
}

function copyFreeFonts() {
	// FontAwesome Fonts
	fs.copyFile(srcFontsFolder + '/FontAwesome5Brands-Regular.ttf', destFontsFolder + '/FontAwesome5Brands-Regular.ttf', callback);
	fs.copyFile(srcFontsFolder + '/FontAwesome5Free-Regular.ttf', destFontsFolder + '/FontAwesome5Free-Regular.ttf', callback);
	fs.copyFile(srcFontsFolder + '/FontAwesome5Free-Solid.ttf', destFontsFolder + '/FontAwesome5Free-Solid.ttf', callback);

	logger.info('Font Awesome Free Icons Fonts copied to', chalk.yellow('./app/assets/fonts'));
}

function copyProFonts(fontFamilies, webFonts) {
	_.each(fontFamilies, (dest, src) => {
		if (copyFile(`${webFonts}/${src}`, dest)) {
			logger.info(`${dest} Font copied to`, chalk.yellow('./app/assets/fonts'));
		}
	});
}

function copyMaterialDesignFonts() {
	// Material Desing Icons Font
	let fontFamilies = [
		'MaterialIcons-Regular.ttf',
		'MaterialIconsOutlined-Regular.otf',
		'MaterialIconsRound-Regular.otf',
		'MaterialIconsSharp-Regular.otf',
		'MaterialIconsTwoTone-Regular.otf'
	];

	_.each(fontFamilies, familyName => {
		if (copyFile(`${srcFontsFolder}/${familyName}`, familyName)) {
			logger.info(`${familyName} Font copied to`, chalk.yellow('./app/assets/fonts'));
		}
	});
}

function copyLineIconsFonts() {
	// LineIcons Font
	if (copyFile(srcFontsFolder + '/LineIcons.ttf', 'LineIcons.ttf')) {
		logger.info('LineIcons Font copied to', chalk.yellow('./app/assets/fonts'));
	}
}

function processFontawesomeStyles(data) {
	let convertedTSSClasses = '';

	let rules = _.map(data.stylesheet.rules, rule => {
		// Without Duotones
		if (rule.type === 'rule' && rule.selectors[ 0 ].includes(':before') && !rule.selectors[ 0 ].includes('.fad')) {
			return {
				'selector': rule.selectors[ 0 ].replace(':before', '').replace(':', ''),
				'property': rule.declarations[ 0 ].value.replace('\"\\', '').replace('\"', '')
			};
		}

	});

	_.each(rules, rule => {
		if (rule) {
			convertedTSSClasses += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`;
		}
	});

	//! Experimental
	// Check duotones
	// let duotoneRules = _.map(data.stylesheet.rules, rule => {
	// 	if (rule.type === 'rule' && rule.selectors[ 0 ].includes(':after') && rule.selectors[ 0 ] !== '.fad:after') {
	// 		return {
	// 			'selector': rule.selectors[ 0 ].replace(':after', '').replace('.fad.', '.fad-'),
	// 			'property': rule.declarations[ 0 ].value.replace('\"\\', '').replace('\"', '')
	// 		};
	// 	}
	// });

	// _.each(duotoneRules, rule => {
	// 	if (rule) {
	// 		convertedTSSClasses += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`;
	// 	}
	// });

	return convertedTSSClasses;
}

//! Helper Functions
function initIfNotConfig() {
	if (!fs.existsSync(destConfigJSFile)) {
		init();
	}
}

function makeSureFolderExists(folder) {
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}
}

function copyFile(src, dest) {
	let copied = false;

	if (fs.existsSync(src)) {
		if (!fs.existsSync(`${destFontsFolder}/${dest}`)) {
			fs.copyFile(src, `${destFontsFolder}/${dest}`, callback);
			copied = true;
		}
	}

	return copied;
}

function getUniqueClasses() {
	let configFile = (fs.existsSync(destConfigJSFile)) ? require(destConfigJSFile) : false;

	let safelist = false;
	let widgets = false;
	let purgeMode = 'all';
	let purgeOptions = false;

	if (configFile.purge) {
		purgeMode = configFile.purge.mode || 'all';
		purgeOptions = configFile.purge.options || false;
		safelist = purgeOptions.safelist || false;
		widgets = purgeOptions.widgets || false;
	}

	let viewPaths = [];

	walkSync(cwd + '/app/views', viewPath => {
		viewPaths.push(viewPath);
	});

	if (widgets) {
		//! Parse Widgets' Views ( Experimental )
		viewPaths.push(...glob.sync(cwd + '/app/widgets/**/views/*.xml'));
	}

	let allClasses = [];

	// read all XML files
	_.each(viewPaths, viewPath => {
		let file = fs.readFileSync(viewPath, 'utf8');

		if (purgeMode === 'all') {
			allClasses.push(file.match(/[^<>"'`\s]*[^<>"'`\s:]/g));
		} else {
			allClasses.push(extractClasses(file, viewPath));
		}
	});

	if (safelist) {
		_.each(safelist, safe => {
			allClasses.push(safe);
		})
	}

	let uniqueClasses = [];

	// Clean even more unnecessary names
	_.each(_.uniq(_.flattenDeep(allClasses)).sort(), uniqueClass => {
		if (!uniqueClass.startsWith('{') && !uniqueClass.startsWith('[') && !uniqueClass.startsWith('--') && !uniqueClass.startsWith('!--') && !uniqueClass.startsWith('#') && !uniqueClass.startsWith('/')) {
			uniqueClasses.push(uniqueClass.replace(',', ''));
		}
	});

	uniqueClasses = _.uniq(uniqueClasses);

	return uniqueClasses;
}

function buildCustomTailwind() {
	let configFile = require(destConfigJSFile);
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
		colors: _.merge(overwritten.colors, configFile.theme.extend.colors),
		spacing: _.merge(overwritten.spacing, configFile.theme.extend.spacing),
		width: _.merge(overwritten.spacing, configFile.theme.extend.spacing, overwritten.width, configFile.theme.extend.width),
		height: _.merge(overwritten.spacing, configFile.theme.extend.spacing, overwritten.height, configFile.theme.extend.height)
	}

	// Reset some stiles
	configFile.theme.Window = _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window);
	configFile.theme.ImageView = _.merge({ ios: { hires: true } }, configFile.theme.ImageView);
	configFile.theme.View = _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View);
	configFile.theme[ '.vertical' ] = _.merge({ default: { layout: 'vertical' }, ios: { clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED' } }, configFile.theme[ '.vertical' ]);
	configFile.theme[ '.horizontal' ] = _.merge({ default: { layout: 'horizontal' }, ios: { clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED' } }, configFile.theme[ '.horizontal' ]);
	configFile.theme[ '.clip-enabled' ] = _.merge({ ios: { clipMode: 'Ti.UI.iOS.CLIP_MODE_ENABLED' } }, configFile.theme[ '.clip-enabled' ]);
	configFile.theme[ '.clip-disabled' ] = _.merge({ ios: { clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED' } }, configFile.theme[ '.clip-disabled' ]);

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
	configFile.theme.scrollableRegion = {};
	configFile.theme.scrollIndicators = {};
	configFile.theme.tintColor = combineKeys(configFile.theme, base.colors, 'tintColor', true);

	// Border Radius
	// configFile.theme.borderRadius = combineKeys(configFile.theme, { ...defaultTheme.borderRadius, ...base.spacing }, 'borderRadius', false);

	// Border Radius ( Extra Styles )
	let defaultBorderRadius = (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing };
	configFile.theme.borderRadiusExtraStyles = combineKeys(configFile.theme, _.merge(defaultBorderRadius, configFile.theme.spacing, configFile.theme.extend.spacing), 'borderRadius', true);

	// Border Width
	configFile.theme.borderWidth = combineKeys(configFile.theme, defaultTheme.borderWidth, 'borderWidth', false);

	// Display
	configFile.theme.displayUtilities = {};

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
	configFile.theme.opacity = (configFile.theme.opacity) ? _.merge(configFile.theme.opacity, configFile.theme.extend.opacity) : _.merge(defaultTheme.opacity, configFile.theme.extend.opacity);

	// Interactivity
	configFile.theme.interactivity = {};

	let convertedStyles = fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind-template.tss'), 'utf8');
	convertedStyles += fs.readFileSync(path.resolve(__dirname, './lib/templates/custom-tailwind-template.tss'), 'utf8') + '\n// Custom Styles and Resets\n';

	delete configFile.theme.extend;
	delete configFile.theme.colors;
	delete configFile.theme.spacing;
	delete configFile.theme.borderRadius;

	_.each(configFile.corePlugins, (value, key) => {
		delete configFile.theme[ key ];
	});

	let sorted = Object.entries(configFile.theme).sort().reduce((object, [ key, value ]) => (object[ key ] = value, object), {});

	_.each(sorted, (value, key) => {
		convertedStyles += buildCustomValues(key, value);
	});

	fs.writeFileSync(customTailwindFile, convertedStyles);

	logger.file('./purgetss/tailwind.tss');
}

function combineKeys(values, base, key, extras = false) {
	let _extras = (extras) ? base : {};

	return (values[ key ]) ? { ..._extras, ...values[ key ], ...values.extend[ key ] } : { ...base, ...values.extend[ key ] };
}

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

function encodeHTML(str) {
	const code = {
		'&': '&amp;',
	};
	return str.replace(/[&]/gm, i => code[ i ]);
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
	makeSureFolderExists(destFontsFolder);

	switch (vendor) {
		case 'fa':
		case 'font':
		case 'fontawesome':
			if (fs.existsSync(srcFontAwesomeBetaCSSFile)) {
				copyProFonts(srcFontAwesomeBetaFontFamilies, srcFontAwesomeBetaWebFontsFolder);
			} else if (fs.existsSync(srcFontAwesomeProCSSFile)) {
				copyProFonts(srcFontAwesomeProFontFamilies, srcFontAwesomeProWebFontsFolder);
			} else {
				copyFreeFonts();
			}
			break;
		case 'md':
		case 'material':
		case 'materialdesign':
			copyMaterialDesignFonts();
			break;
		case 'li':
		case 'line':
		case 'lineicons':
			copyLineIconsFonts();
			break;
	}
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
		case 'tintColor':
			return helpers.tintColor(value);
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
		case 'contentWidth':
			return helpers.contentWidth();
		case 'scrollIndicators':
			return helpers.scrollIndicators();
		case 'borderRadius':
			return helpers.borderRadius(value);
		case 'borderRadiusExtraStyles':
			return helpers.borderRadiusExtraStyles(value);
		case 'borderWidth':
			return helpers.borderWidth(value);
		case 'displayUtilities':
			return helpers.displayUtilities();
		case 'scrollableRegion':
			return helpers.scrollableRegion();
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

function alloyProject() {
	if (!fs.existsSync(cwd + '/app/views')) {
		logger.error('Please make sure you’re running purgeTSS inside an Alloy Project.');

		return false;
	}

	return true;
}

function backupOriginalAppTss() {
	//! FIRST: Backup original app.tss
	if (!fs.existsSync(dest_appTSSFile) && fs.existsSync(destAppTSSFile)) {
		logger.warn('Backing up app.tss into _app.tss\n             FROM NOW ON, add, update or delete your original classes in _app.tss');
		fs.copyFileSync(destAppTSSFile, dest_appTSSFile);
		// return fs.readFileSync(dest_appTSSFile, 'utf8');
	} else if (!fs.existsSync(dest_appTSSFile)) {
		fs.appendFileSync(dest_appTSSFile, '// Empty _app.tss\n');
	}

	return '';
}

function copyResetTemplateAnd_appTSS() {
	//! Copy Reset template
	logger.info('Copying Reset styles...');

	let tempPurged = fs.readFileSync(srcResetTSSFile, 'utf8');

	if (fs.existsSync(dest_appTSSFile)) {
		let appTSSContent = fs.readFileSync(dest_appTSSFile, 'utf8');

		if (appTSSContent.length) {
			logger.info('Copying', chalk.yellow('_app.tss'), 'styles...');
			tempPurged += '\n// Styles from _app.tss\n' + appTSSContent;
		}
	}

	return tempPurged;
}

function copyAllLibraries() {
	let tempPurged = '';

	logger.error('DEV MODE: Copying Everything... This will slow down compilation time!');

	// Tailwind
	if (fs.existsSync(customTailwindFile)) {
		tempPurged += '\n' + fs.readFileSync(customTailwindFile, 'utf8');
	} else {
		tempPurged += '\n' + fs.readFileSync(defaultTailwindFile, 'utf8');
	}

	// Fontawesome
	if (fs.existsSync(customFontAwesomeFile)) {
		tempPurged += '\n' + fs.readFileSync(customFontAwesomeFile, 'utf8');
	} else {
		tempPurged += '\n' + fs.readFileSync(srcFontAwesomeTSSFile, 'utf8');
	}

	// Material Design
	tempPurged += '\n' + fs.readFileSync(srcMaterialDesignIconsTSSFile, 'utf8');

	// Lineicons
	tempPurged += '\n' + fs.readFileSync(srcLineiconsFontTSSFile, 'utf8');

	return tempPurged;
}

function copySelectedLibraries(selected) {
	let tempPurged = '';
	_.each(selected, option => {
		switch (option) {
			case 'tw':
			case 'tail':
			case 'tailwind':
				if (fs.existsSync(customTailwindFile)) {
					logger.warn('DEV MODE: Copying Custom Tailwind styles...');
					tempPurged += '\n' + fs.readFileSync(customTailwindFile, 'utf8');
				} else {
					logger.warn('DEV MODE: Copying Default Tailwind styles...');
					tempPurged += '\n' + fs.readFileSync(defaultTailwindFile, 'utf8');
				}
				break;
			case 'fa':
			case 'font':
			case 'fontawesome':
				logger.warn('DEV MODE: Copying Font Awesome styles...');
				tempPurged += '\n' + fs.readFileSync(srcFontAwesomeTSSFile, 'utf8');
				break;
			case 'md':
			case 'material':
			case 'materialdesign':
				logger.warn('DEV MODE: Copying Material Design Icons styles...');
				tempPurged += '\n' + fs.readFileSync(srcMaterialDesignIconsTSSFile, 'utf8');
				break;
			case 'li':
			case 'line':
			case 'lineicons':
				logger.warn('DEV MODE: Copying LineIcons styles...');
				tempPurged += '\n' + fs.readFileSync(srcLineiconsFontTSSFile, 'utf8');
				break;
		}
	});

	return tempPurged;
}

let startTime, endTime;

function start() {
	startTime = new Date();
};

function end() {
	endTime = new Date();

	let milli = timeDiff = endTime - startTime; //in ms

	// strip the ms
	timeDiff /= 1000;

	// get seconds
	let seconds = Math.round(timeDiff);

	let plural = (seconds === 1) ? 'second' : 'seconds';

	return `${seconds} ${plural} (${milli} ms)`;
}

//! Purge Functions
function purgeTailwind(uniqueClasses) {
	//! Custom Tailwind

	let sourceFolder = '';
	let purgedClasses = '';

	if (fs.existsSync(customTailwindFile)) {
		sourceFolder = customTailwindFile;
		purgedClasses = '\n// Custom Tailwind Styles\n';
		logger.info('Purging', chalk.yellow('Custom Tailwind'), 'styles...');
	} else {
		sourceFolder = defaultTailwindFile;
		purgedClasses = '\n// Default Tailwind Styles\n';
		logger.info('Purging Default Tailwind styles...');
	}

	let sourceTSS = fs.readFileSync(sourceFolder, 'utf8').split(/\r?\n/);
	let soc = sourceTSS.toString(); // soc = String of Classes

	_.each(uniqueClasses, className => {
		if (soc.includes(`'.${className}'`) || soc.includes(`'.${className}[`) || soc.includes(`'#${className}'`) || soc.includes(`'#${className}[`) || soc.includes(`'${className}'`) || soc.includes(`'${className}[`)) {
			_.each(sourceTSS, line => {
				if (line.startsWith(`'.${className}'`) || line.startsWith(`'.${className}[`) || line.startsWith(`'#${className}'`) || line.startsWith(`'#${className}[`) || line.startsWith(`'${className}'`) || line.startsWith(`'${className}[`)) {
					purgedClasses += line + '\n';
				}
			});
		}
	});

	return purgedClasses;
}

function purgeFontAwesome(uniqueClasses) {
	//! FontAwesome
	let sourceFolder = '';
	let purgedClasses = '';

	if (fs.existsSync(customFontAwesomeFile)) {
		sourceFolder = customFontAwesomeFile;
		purgedClasses = '\n// Custom Font Awesome styles\n';
		logger.info('Purging', chalk.yellow('Custom Font Awesome'), 'styles...');
	} else {
		sourceFolder = srcFontAwesomeTSSFile;
		purgedClasses = '\n// Default Font Awesome styles\n';
		logger.info('Purging Default Font Awesome styles...');
	}

	let sourceTSS = fs.readFileSync(sourceFolder, 'utf8').split(/\r?\n/);
	let soc = sourceTSS.toString(); // soc = String of Classes

	_.each(uniqueClasses, className => {
		if (soc.includes(`'.${className}'`)) {
			_.each(sourceTSS, line => {
				if (line.startsWith(`'.${className}'`)) {
					purgedClasses += line + '\n';
				}
			});
		}
	});

	return (purgedClasses === '\n// Custom Font Awesome styles\n' || purgedClasses === '\n// Default Font Awesome styles\n') ? '' : purgedClasses;
}

function purgeMaterialDesign(uniqueClasses) {
	//! Material Design Icons
	logger.info('Purging Material Design Icons styles...');
	let purgedClasses = '\n// Material Design Icons styles\n';

	let sourceTSS = fs.readFileSync(srcMaterialDesignIconsTSSFile, 'utf8').split(/\r?\n/);
	let soc = sourceTSS.toString(); // soc = String of Classes

	_.each(uniqueClasses, className => {
		if (soc.includes(`'.${className}'`)) {
			_.each(sourceTSS, line => {
				if (line.startsWith(`'.${className}'`)) {
					purgedClasses += line + '\n';
				}
			});
		}
	});

	return (purgedClasses === '\n// Material Design Icons styles\n') ? '' : purgedClasses;
}

function purgeLineIcons(uniqueClasses) {
	//! LineIcons
	logger.info('Purging LineIcons styles...');

	let purgedClasses = '\n// LineIcons styles\n';

	let sourceTSS = fs.readFileSync(srcLineiconsFontTSSFile, 'utf8').split(/\r?\n/);
	let soc = sourceTSS.toString(); // soc = String of Classes

	_.each(uniqueClasses, className => {
		if (soc.includes(`'.${className}'`)) {
			_.each(sourceTSS, line => {
				if (line.startsWith(`'.${className}'`)) {
					purgedClasses += line + '\n';
				}
			});
		}
	});

	return (purgedClasses === '\n// LineIcons styles\n') ? '' : purgedClasses;
}

function saveFile(file, data) {
	fs.writeFileSync(file, data, err => {
		throw err;
	});
}

function createJMKFile() {
	fs.copyFileSync(srcJMKFile, destJMKFile);
	logger.file('alloy.jmk');
}
