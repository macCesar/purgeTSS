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
const { includes } = require('lodash');
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
const srcAppPTSSFile = cwd + '/app/styles/app.ptss';
const dest_appTSSFile = cwd + '/app/styles/_app.tss';
const destConfigJSFile = cwd + '/purgetss/config.js';

// js icon modules
const srcLibLI = path.resolve(__dirname, './dist/lineicons.js');
const srcLibBX = path.resolve(__dirname, './dist/boxicons.js');
const srcPurgeTSSLibrary = path.resolve(__dirname, './dist/purgetss.ui.js');
const srcLibFA = path.resolve(__dirname, './dist/fontawesome.js');
const srcLibMD = path.resolve(__dirname, './dist/materialdesignicons.js');

//
const customTailwindFile = cwd + '/purgetss/tailwind.tss';
const defaultTailwindFile = path.resolve(__dirname, './dist/tailwind.tss');
//
const customFontAwesomeFile = cwd + '/purgetss/fontawesome.tss';
const destLibFolder = cwd + '/app/lib';
const customFontAwesomeJSFile = cwd + '/app/lib/fontawesome.js';

// PRO
const srcFontAwesomeProCSSFile = cwd + '/node_modules/@fortawesome/fontawesome-pro/css/all.css';
const srcFontAwesomeProWebFontsFolder = cwd + '/node_modules/@fortawesome/fontawesome-pro/webfonts/';
// Alternate location
const srcFontAwesomeProCSSFileAlternate = cwd + '/app/lib/node_modules/@fortawesome/fontawesome-pro/css/all.css';
const srcFontAwesomeProWebFontsFolderAlternate = cwd + '/app/lib/node_modules/@fortawesome/fontawesome-pro/webfonts/';

const srcFontAwesomeProResetTSS = './lib/templates/fontawesome/pro-reset.tss';
const srcFontAwesomeProTemplateTSS = './lib/templates/fontawesome/pro-template.tss';
const srcFontAwesomeProFontFamilies = {
	'fa-light-300.ttf': 'FontAwesome5Pro-Light.ttf',
	'fa-brands-400.ttf': 'FontAwesome5Brands-Regular.ttf',
	'fa-regular-400.ttf': 'FontAwesome5Pro-Regular.ttf',
	'fa-solid-900.ttf': 'FontAwesome5Pro-Solid.ttf'
}

// BETA
const srcFontAwesomeBetaCSSFile = cwd + '/purgetss/fontawesome-beta/css/all.css';
const srcFontAwesomeBetaWebFontsFolder = cwd + '/purgetss/fontawesome-beta/webfonts/';
const srcFontAwesomeBetaResetTSS = './lib/templates/fontawesome/beta-reset.tss';
const srcFontAwesomeBetaTemplateTSS = './lib/templates/fontawesome/beta-template.tss';
const srcFontAwesomeBetaFontFamilies = {
	'fa-thin-100.ttf': 'FontAwesome6Pro-Thin.ttf',
	'fa-light-300.ttf': 'FontAwesome6Pro-Light.ttf',
	'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
	'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
	'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf',
}
//
const srcFontsFolder = path.resolve(__dirname, './assets/fonts');
const srcResetTSSFile = path.resolve(__dirname, './dist/reset.tss');
const srcJMKFile = path.resolve(__dirname, './lib/templates/alloy.jmk');
const srcFontAwesomeTSSFile = path.resolve(__dirname, './dist/fontawesome.tss');
const srcLineiconsFontTSSFile = path.resolve(__dirname, './dist/lineicons.tss');
const srcBoxIconsFontTSSFile = path.resolve(__dirname, './dist/boxicons.tss');
const srcPurgetssConfigFile = path.resolve(__dirname, './lib/templates/purgetss.config.js');
const srcMaterialDesignIconsTSSFile = path.resolve(__dirname, './dist/materialdesignicons.tss');
//

//! Interfase
//! Command: watch
function watchMode(options) {
	if (alloyProject()) {
		if (fs.existsSync(destJMKFile)) {
			//! TODO: Refactor with readline or line-reader: https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
			if (options.off) {
				removeHook();
			} else if (!fs.readFileSync(destJMKFile, 'utf8').includes('purgetss')) {
				addHook();
			} else if (fs.readFileSync(destJMKFile, 'utf8').includes("//\trequire('child_process').execSync('purgetss")) {
				enableHook();
			} else {
				logger.warn(chalk.yellow('Auto-Purging hook already present!'));
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

		if (options.vendor && typeof options.vendor === 'string') {
			let selected = _.uniq(options.vendor.replace(/ /g, '').split(','));
			_.each(selected, vendor => {
				copyFont(vendor);
			});
		} else {
			copyFont('fa');
			copyFont('li');
			copyFont('md');
			copyFont('bx');
		}

		if (options.modules) {
			copyFontLibraries(options);
		}
	}
}
module.exports.copyFonts = copyFonts;

//! Command: copy-font-liraries
function copyFontLibraries(options) {
	if (alloyProject()) {
		makeSureFolderExists(destLibFolder);

		if (options.vendor && typeof options.vendor === 'string') {
			let selected = _.uniq(options.vendor.replace(/ /g, '').split(','));
			_.each(selected, vendor => {
				copyFontLibrary(vendor);
			});
		} else {
			copyFontLibrary('fa');
			copyFontLibrary('li');
			copyFontLibrary('md');
			copyFontLibrary('bx');
		}
	}
}
module.exports.copyFontLibraries = copyFontLibraries;

function copyModulesLibrary() {
	if (alloyProject()) {
		makeSureFolderExists(destLibFolder);

		fs.copyFileSync(srcPurgeTSSLibrary, destLibFolder + '/purgetss.ui.js');
		logger.info('PurgeTSS modules copied to', chalk.yellow('./app/lib'), 'folder');
	}
}
module.exports.copyModulesLibrary = copyModulesLibrary;

function getFileUpdatedDate(path) {
	return fs.statSync(path).mtime;
}

//! Command: purgetss
function purgeClasses(options) {
	if (alloyProject()) {
		start();

		if (!fs.existsSync(destConfigJSFile)) {
			init();
		}

		if (fs.existsSync(destJMKFile)) {
			if (!fs.readFileSync(destJMKFile, 'utf8').includes('::PurgeTSS::')) {
				addHook();
			}
		} else {
			createJMKFile();
		}

		backupOriginalAppTss();

		let uniqueClasses = getUniqueClasses();

		let tempPurged = copyResetTemplateAnd_appTSS();

		tempPurged += purgeTailwind2(uniqueClasses);

		tempPurged += purgeFontAwesome(uniqueClasses);

		tempPurged += purgeMaterialDesign(uniqueClasses);

		tempPurged += purgeLineIcons(uniqueClasses);

		tempPurged += purgeBoxIcons(uniqueClasses);

		saveFile(destAppTSSFile, tempPurged);

		logger.file('app.tss');

		finish();
	}
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

//! Command: create
function create(args, options) {
	const { exec } = require("child_process");
	const commandExistsSync = require('command-exists').sync;

	logger.info('Creating a new Titanium Project with `PurgeTSS`...');

	exec(`ti config app.idprefix && ti config app.workspace`, (error, stdout, stderr) => {
		if (error) {
			return logger.error(error);
		}

		// if (stderr) {
		// 	return logger.warn(stderr);
		// }

		let results = stdout.split('\n');

		let idPrefix = results[0];
		let workspace = results[1];

		if (idPrefix && workspace) {
			let theIDPrefix = `${idPrefix}.${args.name.replace(/ /g, '').replace(/_/g, '').toLowerCase()}`;

			let tiCreateCommand = `ti create -t app -p all -n "${args.name}" --no-prompt --id ${theIDPrefix}`;

			exec(tiCreateCommand, (error, stdout, stderr) => {
				if (error) {
					return logger.error(error);
				}

				// if (stderr) {
				// 	return logger.warn(stderr);
				// }

				logger.info(stdout);

				let theOpenCommand;
				// returns true/false; doesn't throw
				if (commandExistsSync('code')) {
					theOpenCommand = 'code .';
				} else if (commandExistsSync('subl')) {
					theOpenCommand = 'subl .';
				} else {
					theOpenCommand = 'open .';
				}

				let fonts = (options.vendor) ? `&& purgetss f -m -v=${options.vendor}` : '';
				let cdToProject = `cd ${workspace}/"${args.name}" && alloy new && purgetss w && purgetss b ${fonts} && ${theOpenCommand}`;

				exec(cdToProject, (error, stdout, stderr) => {
					if (error) {
						return logger.error(error);
					}

					// if (stderr) {
					// 	return logger.warn(stderr);
					// }

					logger.info(stdout);
				});
			});
		} else {
			return logger.error('You need to have `app.idprefix` and `app.workspace` configure in `ti config` to create an App with `PurgeTSS`.');
		}
	});
}
exports.create = create;

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
	} else if (fs.existsSync(srcFontAwesomeProCSSFileAlternate)) {
		processCustomFontAwesomeTSS(srcFontAwesomeProCSSFileAlternate, srcFontAwesomeProTemplateTSS, srcFontAwesomeProResetTSS, srcFontAwesomeProFontFamilies, srcFontAwesomeProWebFontsFolderAlternate);
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
		temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
	}

	pretty = temp.join('').replace(':', '');
	pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase());

	return pretty;
};

function buildCustomFontAwesomeJS() {
	if (fs.existsSync(srcFontAwesomeBetaCSSFile)) {
		processCustomFontAwesomeJS(srcFontAwesomeBetaCSSFile, './lib/templates/fontawesome/beta-template.js');
	} else if (fs.existsSync(srcFontAwesomeProCSSFile)) {
		processCustomFontAwesomeJS(srcFontAwesomeProCSSFile, './lib/templates/fontawesome/pro-template.js');
	}
}

function processCustomFontAwesomeJS(CSSFile, faJS) {
	readCSS(CSSFile, (err, data) => {
		if (err) throw err

		let rules = _.map(data.stylesheet.rules, rule => {
			if (rule.type === 'rule' && rule.selectors[0].includes(':before') && !rule.selectors[0].includes('.fad')) {
				return {
					'selector': rule.selectors[0].replace(':before', '').replace('.', '').replace(':', ''),
					'property': ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '')).slice(-4)
				};
			}
		});

		let fontAwesomeContent = fs.readFileSync(path.resolve(__dirname, faJS), 'utf8');

		fontAwesomeContent += '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/icon-functions.js'), 'utf8');

		let exportIcons = '\nconst icons = {\n';

		_.each(rules, rule => {
			if (rule) {
				exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`;
			}
		});

		exportIcons += '};\n';

		exportIcons += 'exports.icons = icons;\n';

		fontAwesomeContent += exportIcons;

		makeSureFolderExists(destLibFolder);

		fs.writeFileSync(customFontAwesomeJSFile, fontAwesomeContent, err => {
			throw err;
		});

		logger.file('./app/lib/fontawesome.js');
	});
}

function copyFreeFonts() {
	// FontAwesome Fonts
	fs.copyFile(srcFontsFolder + '/FontAwesome5Brands-Regular.ttf', destFontsFolder + '/FontAwesome5Brands-Regular.ttf', callback);
	fs.copyFile(srcFontsFolder + '/FontAwesome5Free-Regular.ttf', destFontsFolder + '/FontAwesome5Free-Regular.ttf', callback);
	fs.copyFile(srcFontsFolder + '/FontAwesome5Free-Solid.ttf', destFontsFolder + '/FontAwesome5Free-Solid.ttf', callback);

	logger.info('Font Awesome Free Icons Fonts copied to', chalk.yellow('./app/assets/fonts'), 'folder');
}

function copyProFonts(fontFamilies, webFonts) {
	_.each(fontFamilies, (dest, src) => {
		if (copyFile(`${webFonts}/${src}`, dest)) {
			logger.info(`${dest} Font copied to`, chalk.yellow('./app/assets/fonts'), 'folder');
		}
	});
}

function copyMaterialDesignFonts() {
	// Material Design Icons Font
	let fontFamilies = [
		'MaterialIcons-Regular.ttf',
		'MaterialIconsOutlined-Regular.otf',
		'MaterialIconsRound-Regular.otf',
		'MaterialIconsSharp-Regular.otf',
		'MaterialIconsTwoTone-Regular.otf'
	];

	_.each(fontFamilies, familyName => {
		copyFile(`${srcFontsFolder}/${familyName}`, familyName);
	});

	logger.info('Material Design Icons Font copied to', chalk.yellow('./app/assets/fonts'), 'folder');
}

function copyLineIconsFonts() {
	// LineIcons Font
	copyFile(srcFontsFolder + '/LineIcons.ttf', 'LineIcons.ttf');
	logger.info('LineIcons Font copied to', chalk.yellow('./app/assets/fonts'), 'folder');
}

function copyBoxIconsFonts() {
	// BoxIcons Font
	copyFile(srcFontsFolder + '/boxicons.ttf', 'boxicons.ttf');
	logger.info('Boxicons Font copied to', chalk.yellow('./app/assets/fonts'), 'folder');
}

function processFontawesomeStyles(data) {
	let convertedTSSClasses = '';

	let rules = _.map(data.stylesheet.rules, rule => {
		// Without Duotones
		if (rule.type === 'rule' && rule.selectors[0].includes(':before') && !rule.selectors[0].includes('.fad')) {
			return {
				'selector': rule.selectors[0].replace(':before', '').replace(':', ''),
				'property': ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '')).slice(-4)
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
function addHook() {
	logger.warn(chalk.green('Adding Auto-Purging hook!'));
	let originalJMKFile = fs.readFileSync(destJMKFile, 'utf8');

	if (originalJMKFile.includes('pre:compile')) {
		let updatedJMKFile = [];

		originalJMKFile.split(/\r?\n/).forEach((line) => {
			if (line.includes('pre:compile')) {
				line += "\n\trequire('child_process').execSync('purgetss', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));";
			}
			updatedJMKFile.push(line);
		});

		saveFile(destJMKFile, updatedJMKFile.join("\n"));
	} else {
		fs.appendFileSync(destJMKFile, '\n' + fs.readFileSync(srcJMKFile, 'utf8'));
	}
}

function removeHook() {
	let updatedJMKFile = [];
	let originalJMKFile = fs.readFileSync(destJMKFile, 'utf8');
	let purgeCmdPresent = (originalJMKFile.includes('::PurgeTSS::'));

	if (purgeCmdPresent) {
		originalJMKFile.split(/\r?\n/).forEach((line) => {
			if (!line.includes("require('child_process').execSync('purgetss")) {
				updatedJMKFile.push(line);
			} else if (!line.includes("//")) {
				// if not disabled, disable it!!
				updatedJMKFile.push(`\t//${line}`);
			}
		});

		logger.warn(chalk.red('Auto-Purging hook removed!'));

		saveFile(destJMKFile, updatedJMKFile.join("\n"));
	}
}

function enableHook() {
	let updatedJMKFile = [];

	let originalJMKFile = fs.readFileSync(destJMKFile, 'utf8');

	originalJMKFile.split(/\r?\n/).forEach((line) => {
		if (line.includes("require('child_process').execSync('purgetss")) {
			logger.warn(chalk.green('Auto-Purging hook enabled!'));
			line = line.replace(/\/\/\t/g, "");
		}

		updatedJMKFile.push(line);

		saveFile(destJMKFile, updatedJMKFile.join("\n"));
	});
}

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
	if (fs.existsSync(src)) {
		// if (!fs.existsSync(`${destFontsFolder}/${dest}`)) {
		fs.copyFile(src, `${destFontsFolder}/${dest}`, callback);
		return true;
		// }
	}
}

function getUniqueClasses() {
	let configFile = (fs.existsSync(destConfigJSFile)) ? require(destConfigJSFile) : false;

	let widgets = false;
	let safelist = false;
	let purgeMode = 'all';
	let purgeOptions = false;

	if (configFile.purge) {
		purgeOptions = configFile.purge.options || false;
		widgets = purgeOptions.widgets || false;
		safelist = purgeOptions.safelist || false;
		purgeMode = configFile.purge.mode || 'all';
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

		allClasses.push((purgeMode === 'all') ? file.match(/[^<>"'`\s]*[^<>"'`\s:]/g) : extractClasses(file, viewPath));
	});

	if (safelist) {
		_.each(safelist, safe => {
			allClasses.push(safe);
		})
	}

	let uniqueClasses = [];

	// Clean even more unnecessary names
	_.each(_.uniq(_.flattenDeep(allClasses)).sort(), uniqueClass => {
		if (filterCharacters(uniqueClass)) {
			uniqueClasses.push(uniqueClass);
		}
	});

	return uniqueClasses.sort();
}

function filterCharacters(uniqueClass) {
	return isNaN(uniqueClass.charAt(0)) &&
		!uniqueClass.startsWith('--') &&
		!uniqueClass.startsWith('!') &&
		!uniqueClass.startsWith('[') &&
		!uniqueClass.startsWith('{') &&
		!uniqueClass.startsWith('/') &&
		!uniqueClass.startsWith('\\') &&
		!uniqueClass.startsWith('#') &&
		!uniqueClass.startsWith('$') &&
		!uniqueClass.startsWith('Ti.') &&
		!uniqueClass.startsWith(',') &&
		!uniqueClass.includes('http') &&
		!uniqueClass.includes('www') &&
		// !uniqueClass.includes(')') &&
		!uniqueClass.includes('=') &&
		!uniqueClass.includes('L(') &&
		!uniqueClass.endsWith(',') &&
		!uniqueClass.endsWith('/');
}

//! Build Custom Tailwind ( Main )
function buildCustomTailwind(message = 'file created!') {
	let configFile = require(destConfigJSFile);
	const defaultColors = require('tailwindcss/colors');
	const defaultTheme = require('tailwindcss/defaultTheme');
	const tailwindui = require('@tailwindcss/ui/index')({}, {}).config.theme;

	delete defaultColors.lightBlue;

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

	// Have to 'fix' any '.333333%' value to '.333334%' to propertly fit the screen
	_.each(base.spacing, (value, key) => {
		if (value.toString().includes('.333333%')) {
			base.spacing[key] = value.replace('.333333%', '.333334%');
		}
	});

	configFile.theme['ImageView'] = _.merge({ ios: { hires: true } }, configFile.theme.ImageView);
	// configFile.theme['Label'] = _.merge({ default: { width: 'Ti.UI.FILL', height: 'Ti.UI.SIZE' } }, configFile.theme.Label);
	configFile.theme['View'] = _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View);
	configFile.theme['Window'] = _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window);

	configFile.theme.textColor = combineKeys(configFile.theme, base.colors, 'textColor', true);

	configFile.theme.backgroundColor = combineKeys(configFile.theme, base.colors, 'backgroundColor', true);

	configFile.theme.backgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'backgroundSelectedColor', true);

	configFile.theme.borderColor = combineKeys(configFile.theme, base.colors, 'borderColor', true);

	configFile.theme.pagingControlAlpha = (configFile.theme.opacity) ? _.merge(configFile.theme.opacity, configFile.theme.extend.opacity) : _.merge(defaultTheme.opacity, configFile.theme.extend.opacity);

	configFile.theme.pagingControlTimeout = { ...defaultTheme.transitionDelay, ...configFile.theme.transitionDelay, ...configFile.theme.extend.transitionDelay };

	configFile.theme.pagingControlColor = combineKeys(configFile.theme, base.colors, 'pagingControlColor', true);

	configFile.theme.pageIndicatorColor = combineKeys(configFile.theme, base.colors, 'pageIndicatorColor', true);

	configFile.theme.currentPageIndicatorColor = combineKeys(configFile.theme, base.colors, 'currentPageIndicatorColor', true);

	// pagingControlHeight
	delete base.height['max'];
	delete base.height['min'];
	delete base.height['min-content'];
	delete base.height['max-content'];

	configFile.theme.pagingControlHeight = base.height;

	configFile.theme.placeholderColor = combineKeys(configFile.theme, base.colors, 'placeholderColor', true);

	configFile.theme.touchFeedbackColor = combineKeys(configFile.theme, base.colors, 'touchFeedbackColor', true);

	configFile.theme.gradientColorStops = combineKeys(configFile.theme, base.colors, 'gradientColorStops', true);

	configFile.theme.linearGradient = {};
	configFile.theme.radialGradient = {};

	configFile.theme.placement = {};

	configFile.theme.fontSize = combineKeys(configFile.theme, defaultTheme.fontSize, 'fontSize', false);

	configFile.theme.fontStyle = {};

	configFile.theme.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight', true);

	configFile.theme.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily', false);

	if (!Object.keys(configFile.theme.fontFamily).length) {
		delete configFile.theme.fontFamily;
	}

	configFile.theme.gaps = combineKeys(configFile.theme, base.spacing, 'margin', true);

	configFile.theme.gridFlow = {};

	configFile.theme.gridSystem = {};

	configFile.theme.gridColumnsStartEnd = {};

	configFile.theme.textAlign = {};

	configFile.theme.verticalAlignment = {};
	configFile.theme.scrollableRegion = {};
	configFile.theme.scrollIndicators = {};
	configFile.theme.tintColor = combineKeys(configFile.theme, base.colors, 'tintColor', true);

	let defaultBorderRadius = (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing };
	configFile.theme.borderRadiusExtraStyles = combineKeys(configFile.theme, _.merge(defaultBorderRadius, configFile.theme.spacing, configFile.theme.extend.spacing), 'borderRadius', true);

	configFile.theme.borderWidth = combineKeys(configFile.theme, defaultTheme.borderWidth, 'borderWidth', false);

	configFile.theme.displayUtilities = {};

	configFile.theme.margin = combineKeys(configFile.theme, base.spacing, 'margin', true);

	configFile.theme.padding = combineKeys(configFile.theme, base.spacing, 'padding', true);

	configFile.theme.width = base.width;
	configFile.theme.height = base.height;

	configFile.theme.shadow = {};

	configFile.theme.opacity = (configFile.theme.opacity) ? _.merge(configFile.theme.opacity, configFile.theme.extend.opacity) : _.merge(defaultTheme.opacity, configFile.theme.extend.opacity);

	configFile.theme.interactivity = {};

	configFile.theme.items = {};
	configFile.theme.layout = {};
	configFile.theme.clipMode = {};
	configFile.theme.draggingConstraints = {};
	configFile.theme.draggingType = {};
	configFile.theme.scrollType = {};
	configFile.theme.transition = {};
	configFile.theme.exitOnClose = {};
	configFile.theme.defaultImage = {};
	configFile.theme.scalingMode = {};
	configFile.theme.autoreverse = {};
	configFile.theme.repeat = { ...configFile.theme.repeat, ...configFile.theme.extend.repeat };
	configFile.theme.origin = { ...configFile.theme.origin, ...configFile.theme.extend.origin };
	configFile.theme.scale = { ...defaultTheme.scale, ...configFile.theme.scale, ...configFile.theme.extend.scale };
	configFile.theme.rotate = { ...defaultTheme.rotate, ...configFile.theme.rotate, ...configFile.theme.extend.rotate };
	configFile.theme.transitionDelay = { ...defaultTheme.transitionDelay, ...configFile.theme.transitionDelay, ...configFile.theme.extend.transitionDelay };
	configFile.theme.transitionDuration = { ...defaultTheme.transitionDuration, ...configFile.theme.transitionDuration, ...configFile.theme.extend.transitionDuration };

	configFile.theme.bounce = {};
	configFile.theme.overlay = {};
	configFile.theme.platform = {};
	configFile.theme.flip = {};
	configFile.theme.scrolling = {};
	configFile.theme.pagingControl = {};
	configFile.theme.pagingControlOnTop = {};
	configFile.theme.keepScreenOn = {};
	configFile.theme.zIndex = { ...defaultTheme.zIndex, ...configFile.theme.zIndex, ...configFile.theme.extend.zIndex };

	delete configFile.theme.extend;
	delete configFile.theme.colors;
	delete configFile.theme.spacing;
	delete configFile.theme.borderRadius;

	_.each(configFile.corePlugins, (value, key) => {
		delete configFile.theme[key];
	});

	let sorted = Object.entries(configFile.theme).sort().reduce((object, [key, value]) => (object[key] = value, object), {});

	let tailwindStyles = fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/template.tss'), 'utf8');

	tailwindStyles += fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/custom-template.tss'), 'utf8');

	tailwindStyles += `// Updated At: ${getFileUpdatedDate(destConfigJSFile)}\n` + '\n// Custom Styles and Resets\n';

	_.each(sorted, (value, key) => {
		tailwindStyles += buildCustomTailwindClasses(key, value);
	});

	fs.writeFileSync(customTailwindFile, helpers.applyProperties(tailwindStyles));

	logger.info(chalk.yellow('./purgetss/tailwind.tss'), message);
}

//! Build tailwind's custom values
function buildCustomTailwindClasses(key, value) {
	switch (key) {
		case 'autoreverse': return helpers.autoreverse();
		case 'backgroundColor': return helpers.backgroundColor(value);
		case 'linearGradient': return helpers.linearGradient();
		case 'radialGradient': return helpers.radialGradient();
		case 'keepScreenOn': return helpers.keepScreenOn();
		case 'backgroundSelectedColor': return helpers.backgroundSelectedColor(value);
		case 'borderColor': return helpers.borderColor(value);
		case 'borderRadiusExtraStyles': return helpers.borderRadiusExtraStyles(value);
		case 'borderWidth': return helpers.borderWidth(value);
		case 'clipMode': return helpers.clipMode();
		case 'contentWidth': return helpers.contentWidth();
		case 'defaultImage': return helpers.defaultImage();
		case 'scalingMode': return helpers.scalingMode();
		case 'draggingConstraints': return helpers.draggingConstraints();
		case 'draggingType': return helpers.draggingType();
		case 'displayUtilities': return helpers.displayUtilities();
		case 'exitOnClose': return helpers.exitOnClose();
		case 'fontFamily': return helpers.fontFamily(value);
		case 'fontSize': return helpers.fontSize(value);
		case 'fontStyle': return helpers.fontStyle();
		case 'fontWeight': return helpers.fontWeight(value);
		case 'gaps': return helpers.gaps(value);
		case 'gradientColorStops': return helpers.gradientColorStops(value);
		case 'gridColumnsStartEnd': return helpers.gridColumnsStartEnd();
		case 'gridFlow': return helpers.gridFlow();
		case 'gridSystem': return helpers.gridSystem();
		case 'height': return helpers.height(value);
		case 'zIndex': return helpers.zIndex(value);

		case 'bounce': return helpers.bounce();
		case 'overlay': return helpers.overlay();
		case 'platform': return helpers.platform();
		case 'scrolling': return helpers.scrolling();
		case 'pagingControl': return helpers.pagingControl();
		case 'pagingControlOnTop': return helpers.pagingControlOnTop();

		case 'pagingControlAlpha': return helpers.pagingControlAlpha(value);
		case 'pagingControlTimeout': return helpers.pagingControlTimeout(value);
		case 'pagingControlColor': return helpers.pagingControlColor(value);
		case 'pageIndicatorColor': return helpers.pageIndicatorColor(value);
		case 'currentPageIndicatorColor': return helpers.currentPageIndicatorColor(value);
		case 'pagingControlHeight': return helpers.pagingControlHeight(value);

		case 'interactivity': return helpers.interactivity(value);
		case 'items': return helpers.items();
		case 'layout': return helpers.layout();
		case 'flip': return helpers.flip();
		case 'margin': return helpers.margin(value);

		case 'opacity': return helpers.opacity(value);
		case 'padding': return helpers.padding(value);
		case 'placeholderColor': return helpers.placeholderColor(value);
		case 'placement': return helpers.placement();
		case 'repeat': return helpers.repeat(value);
		case 'rotate': return helpers.rotate(value);
		case 'origin': return helpers.origin(value);
		case 'scale': return helpers.scale(value);
		case 'scrollableRegion': return helpers.scrollableRegion();
		case 'scrollIndicators': return helpers.scrollIndicators();
		case 'scrollType': return helpers.scrollType();
		case 'shadow': return helpers.shadow();
		case 'transition': return helpers.transition(value);
		case 'transitionDelay': return helpers.transitionDelay(value);
		case 'transitionDuration': return helpers.transitionDuration(value);
		case 'textAlign': return helpers.textAlign();
		case 'textColor': return helpers.textColor(value);
		case 'tintColor': return helpers.tintColor(value);
		case 'touchFeedbackColor': return helpers.touchFeedbackColor(value);
		case 'verticalAlignment': return helpers.verticalAlignment();
		case 'width': return helpers.width(value);

		default: return helpers.customRules(value, key);
	}
}

function combineKeys(values, base, key, extras = false) {
	let _extras = (extras) ? base : {};

	return (values[key]) ? { ..._extras, ...values[key], ...values.extend[key] } : { ...base, ...values.extend[key] };
}

function extractClasses(currentText, currentFile) {
	try {
		let jsontext = convert.xml2json(encodeHTML(currentText), { compact: true });

		return traverse(JSON.parse(jsontext)).reduce(function(acc, value) {
			if (this.key === 'class' || this.key === 'id') acc.push(value.split(' '));
			return acc;
		}, []);
	} catch (error) {
		throw chalk.red(`::PurgeTSS:: Error processing: “${currentFile}”`);
	}
}

function encodeHTML(str) {
	const code = {
		'&': '&amp;',
	};
	return str.replace(/[&]/gm, i => code[i]);
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
			if (name.includes('xml')) {
				callback(filePath, stat);
			}
		} else if (stat.isDirectory()) {
			walkSync(filePath, callback);
		}
	});
}

//! Copy Fonts
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
		case 'bx':
		case 'box':
		case 'boxicons':
			copyBoxIconsFonts();
			break;
	}
}

//! Copy Font Libraries
function copyFontLibrary(vendor) {
	switch (vendor) {
		case 'fa':
		case 'font':
		case 'fontawesome':
			if (fs.existsSync(srcFontAwesomeBetaCSSFile) || fs.existsSync(srcFontAwesomeProCSSFile)) {
				buildCustomFontAwesomeJS();
			} else {
				fs.copyFileSync(srcLibFA, destLibFolder + '/fontawesome.js');
				logger.info('FA CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			}
			break;
		case 'md':
		case 'material':
		case 'materialdesign':
			fs.copyFileSync(srcLibMD, destLibFolder + '/materialdesignicons.js');
			logger.info('MD CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
		case 'li':
		case 'line':
		case 'lineicons':
			fs.copyFileSync(srcLibLI, destLibFolder + '/lineicons.js');
			logger.info('LI CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
		case 'bx':
		case 'box':
		case 'boxicons':
			fs.copyFileSync(srcLibBX, destLibFolder + '/boxicons.js');
			logger.info('BX CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
	}
}

//! Check if running inside an Alloy Project
function alloyProject() {
	if (!fs.existsSync(cwd + '/app/views')) {
		logger.error('Please make sure you’re running PurgeTSS inside an Alloy Project.');

		return false;
	}

	return true;
}

//! FIRST: Backup original app.tss
function backupOriginalAppTss() {
	if (!fs.existsSync(dest_appTSSFile) && fs.existsSync(destAppTSSFile)) {
		logger.warn('Backing up app.tss into _app.tss\n             FROM NOW ON, add, update or delete your original classes in _app.tss');
		fs.copyFileSync(destAppTSSFile, dest_appTSSFile);
	} else if (!fs.existsSync(dest_appTSSFile)) {
		fs.appendFileSync(dest_appTSSFile, '// Empty _app.tss\n');
	}
}

//! Copy Reset template
function copyResetTemplateAnd_appTSS() {
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

//! Copy ALL Libraries
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

//! Copy Selected Libraries
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

let startTime;

function start() {
	startTime = new Date();
};

function finish(customMessage = 'Finished purging in') {
	let endTime = new Date(new Date() - startTime);
	logger.info(customMessage, chalk.green(`${endTime.getSeconds()}s ${endTime.getMilliseconds()}ms`));
}

//! Purge Functions
//! Tailwind
function purgeTailwind(uniqueClasses) {
	let sourceFolder = '';
	let purgedClasses = '\n// Tailwind Styles\n';

	if (fs.existsSync(customTailwindFile)) {
		sourceFolder = customTailwindFile;
	} else {
		sourceFolder = defaultTailwindFile;
	}

	let sourceTSS = fs.readFileSync(sourceFolder, 'utf8').split(/\r?\n/);

	if (`// Updated At: ${getFileUpdatedDate(destConfigJSFile)}` !== sourceTSS[7]) {
		logger.info(chalk.yellow('config.js'), 'file modified, rebuilding tailwind.tss...');
		buildCustomTailwind('file updated!');
		sourceTSS = fs.readFileSync(sourceFolder, 'utf8').split(/\r?\n/);
	}

	if (fs.existsSync(customTailwindFile)) {
		logger.info('Purging', chalk.yellow('Custom Tailwind'), 'styles...');
	} else {
		logger.info('Purging Default Tailwind styles...');
	}

	let soc = sourceTSS.toString(); // soc = String of Classes

	_.each(uniqueClasses, className => {
		let cleanClassName = className.replace('ios:', '').replace('android:', '').replace('handheld:', '').replace('tablet:', '').replace('open:', '').replace('close:', '').replace('complete:', '').replace('drag:', '').replace('drop:', '').replace('bounds:', '');

		if (includesClassName(soc, cleanClassName)) {
			_.each(sourceTSS, line => {
				if (startsWith(line, cleanClassName)) {
					purgedClasses += helpers.checkPlatformAndDevice(line, className);
					// https://regex101.com/r/YXLWYt/1
					// if (className.includes('ios:')) {
					// 	purgedClasses += (line.includes('platform=ios'))
					// 		? `${line.replace(/[^'.]+|1/, `ios:$&`)}\n`
					// 		: `${line.replace(/[^'.]+|1/, `ios:$&[platform=ios]`)}\n`;
					// } else if (className.includes('android:')) {
					// 	purgedClasses += (line.includes('platform=android'))
					// 		? `${line.replace(/[^'.]+|1/, `android:$&`)}\n`
					// 		: `${line.replace(/[^'.]+|1/, `android:$&[platform=android]`)}\n`;
					// } else if (className.includes('handheld:')) {
					// 	purgedClasses += (line.includes('formFactor=handheld'))
					// 		? `${line.replace(/[^'.]+|1/, `handheld:$&`)}\n`
					// 		: `${line.replace(/[^'.]+|1/, `handheld:$&[formFactor=handheld]`)}\n`;
					// } else if (className.includes('tablet:')) {
					// 	purgedClasses += (line.includes('formFactor=tablet'))
					// 		? `${line.replace(/[^'.]+|1/, `tablet:$&`)}\n`
					// 		: `${line.replace(/[^'.]+|1/, `tablet:$&[formFactor=tablet]`)}\n`;
					// } else {
					// 	purgedClasses += `${line}\n`;
					// }
				}
			});
		} else if (cleanClassName.includes('(')) {
			let line = formatArbitraryValues(cleanClassName);

			if (line) {
				purgedClasses += helpers.checkPlatformAndDevice(line, className);
				// if (className.includes('ios:')) {
				// 	purgedClasses += (className.includes('platform=ios'))
				// 	? `${line.replace(/[^'.]+|1/, `ios:$&`)}\n`
				// 	: `${line.replace(/[^'.]+|1/, `ios:$&[platform=ios]`)}\n`;
				// } else if (className.includes('android:')) {
				// 	purgedClasses += (className.includes('platform=android'))
				// 	? `${line.replace(/[^'.]+|1/, `android:$&`)}\n`
				// 	: `${line.replace(/[^'.]+|1/, `android:$&[platform=android]`)}\n`;
				// } else if (className.includes('handheld:')) {
				// 	purgedClasses += (className.includes('formFactor=handheld'))
				// 	? `${line.replace(/[^'.]+|1/, `handheld:$&`)}\n`
				// 	: `${line.replace(/[^'.]+|1/, `handheld:$&[formFactor=handheld]`)}\n`;
				// } else if (className.includes('tablet:')) {
				// 	purgedClasses += (className.includes('formFactor=tablet'))
				// 	? `${line.replace(/[^'.]+|1/, `tablet:$&`)}\n`
				// 	: `${line.replace(/[^'.]+|1/, `tablet:$&[formFactor=tablet]`)}\n`;
				// } else {
				// 	purgedClasses += line + '\n';
				// }
			}
		}
	});

	return purgedClasses;
}

function purgeTailwind2(uniqueClasses) {
	let tailwindFile = '';
	let purgedClasses = '\n// Tailwind Styles\n';

	if (fs.existsSync(customTailwindFile)) {
		tailwindFile = customTailwindFile;
	} else {
		tailwindFile = defaultTailwindFile;
	}

	let tailwindClasses = fs.readFileSync(tailwindFile, 'utf8').split(/\r?\n/);

	if (`// Updated At: ${getFileUpdatedDate(destConfigJSFile)}` !== tailwindClasses[7]) {
		logger.info(chalk.yellow('config.js'), 'file updated!, rebuilding tailwind.tss...');
		buildCustomTailwind('file updated!');
		tailwindClasses = fs.readFileSync(tailwindFile, 'utf8').split(/\r?\n/);
	}

	(fs.existsSync(customTailwindFile)) ? logger.info('Purging', chalk.yellow('Custom Tailwind'), 'styles...') : logger.info('Purging Default Tailwind styles...');

	let cleanUniqueClasses = [];
	let soc = tailwindClasses.toString();
	let arbitraryValues = '\n// Styles with arbitrary values\n';

	_.each(uniqueClasses, className => {
		let cleanClassName = cleanClassNameFn(className);

		if (includesClassName(soc, cleanClassName)) {
			cleanUniqueClasses.push(className);
		} else if (cleanClassName.includes('(')) {
			let line = formatArbitraryValues(cleanClassName);
			if (line) {
				arbitraryValues += helpers.checkPlatformAndDevice(line, className);
			}
		}
	});

	_.each(tailwindClasses, tailwindClass => {
		if (tailwindClass !== '' && !tailwindClass.includes('//')) {
			let cleanTailwindClass = `${tailwindClass.split(':')[0].replace('.', '').replace(/'/g, '').replace(/ *\[[^\]]*]/, '')}`;

			if (cleanUniqueClasses.indexOf(cleanTailwindClass) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(cleanTailwindClass)]);
			}

			if (cleanUniqueClasses.indexOf(`ios:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`ios:${cleanTailwindClass}`)]);
			}

			if (cleanUniqueClasses.indexOf(`android:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`android:${cleanTailwindClass}`)]);
			}

			if (cleanUniqueClasses.indexOf(`tablet:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`tablet:${cleanTailwindClass}`)]);
			}

			if (cleanUniqueClasses.indexOf(`handheld:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`handheld:${cleanTailwindClass}`)]);
			}

			if (cleanUniqueClasses.indexOf(`open:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`open:${cleanTailwindClass}`)]);
			}

			if (cleanUniqueClasses.indexOf(`close:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`close:${cleanTailwindClass}`)]);
			}

			if (cleanUniqueClasses.indexOf(`drag:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`drag:${cleanTailwindClass}`)]);
			}

			if (cleanUniqueClasses.indexOf(`drop:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`drop:${cleanTailwindClass}`)]);
			}

			if (cleanUniqueClasses.indexOf(`complete:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`complete:${cleanTailwindClass}`)]);
			}

			if (cleanUniqueClasses.indexOf(`bounds:${cleanTailwindClass}`) > -1) {
				purgedClasses += helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`bounds:${cleanTailwindClass}`)]);
			}
		}
	});

	return purgedClasses += (arbitraryValues !== '\n// Styles with arbitrary values\n') ? arbitraryValues : '';
}

function checkIndexOf(array, line) {
	return array.indexOf(line) || array.indexOf(`ios:${line}`);
}

function cleanClassNameFn(className) {
	return className.replace('ios:', '').replace('android:', '').replace('handheld:', '').replace('tablet:', '').replace('open:', '').replace('complete:', '').replace('close:', '').replace('complete:', '').replace('drag:', '').replace('drop:', '').replace('bounds:', '');
}

function includesClassName(soc, cleanClassName) {
	return soc.includes(`'.${cleanClassName}'`) || soc.includes(`'.${cleanClassName}[`) || soc.includes(`'#${cleanClassName}'`) || soc.includes(`'#${cleanClassName}[`) || soc.includes(`'${cleanClassName}'`) || soc.includes(`'${cleanClassName}[`);
}

function startsWith(line, cleanClassName) {
	return line.startsWith(`'.${cleanClassName}'`) || line.startsWith(`'.${cleanClassName}[`) || line.startsWith(`'#${cleanClassName}'`) || line.startsWith(`'#${cleanClassName}[`) || line.startsWith(`'${cleanClassName}'`) || line.startsWith(`'${cleanClassName}[`);
}

const arbitraryValuesTable = {
	// Check if they are really needed
	'font': '{ fontWeight: {value} }',
	'content-w': '{ contentWidth: {value} }',
	'content-h': '{ contentHeight: {value} }',
	// 'bg-selected': '{ backgroundSelectedColor: {value} }',
	'content': '{ contentWidth: {value}, contentHeight: {value} }',
	// 'shadow': '{ viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: {value} }',

	'anchorPoint': '{ anchorPoint: { x: {value}, y: {value1} } }',
	'bg': '{ backgroundColor: {value} }',
	'border-color': '{ borderColor: {value} }',
	'border-width': '{ borderWidth: {value} }',
	'bottom': '{ bottom: {value} }',
	'delay': '{ delay: {value} }',
	'duration': '{ duration: {value} }',
	'feedback': '{ touchFeedback: true, touchFeedbackColor: {value} }',
	'from': '{ backgroundGradient: { colors: [ {value1}, {value} ] } }',
	'h': '{ height: {value}}',
	'left': '{ left: {value} }',
	'm': '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
	'mb': '{ bottom: {value} }',
	'ml': '{ left: {value} }',
	'mr': '{ right: {value} }',
	'mt': '{ top: {value} }',
	'mx': '{ right: {value}, left: {value} }',
	'my': '{ top: {value}, bottom: {value} }',
	'opacity': '{ opacity: {value} }',

	'page': '{ pageIndicatorColor: {value} }',
	'paging': '{ pagingControlColor: {value} }',
	'cache-size': '{ cacheSize: {value} }',

	'current-page': '{ currentPageIndicatorColor: {value} }',
	'p': '{ padding: { top: {value}, right: {value}, bottom: {value}, left: {value} } }',
	'pb': '{ padding: { bottom: {value} } }',
	'pl': '{ padding: { left: {value} } }',
	'placeholder': '{ hintTextColor: {value} }',
	'pr': '{ padding: { right: {value} } }',
	'pt': '{ padding: { top: {value} } }',
	'px': '{ padding: { right: {value}, left: {value} } }',
	'py': '{ padding: { top: {value}, bottom: {value} } }',
	'repeat': '{ repeat: {value} }',
	'right': '{ right: {value} }',
	'rotate': '{ rotate: {value} }',
	'rounded': '{ borderRadius: {value} }',
	'text-color': '{ color: {value} }',
	'text-size': '{ font: { fontSize: {value} } }',
	'tint': '{ tintColor: {value} }',
	'grid-col': '{ width: Alloy.Globals.cols_{value} }',
	'grid-row': '{ height: Alloy.Globals.rows_{value} }',
	'to': '{ backgroundGradient: { colors: [ {value} ] } }',
	'top': '{ top: {value} }',
	'w': '{ width: {value} }'
};

function formatArbitraryValues(arbitraryValue) {
	let sign = (arbitraryValue.startsWith('-')) ? '-' : '';

	let splitedContent = (arbitraryValue.startsWith('-')) ? arbitraryValue.substring(1).split('-') : arbitraryValue.split('-');

	if (splitedContent.length === 1) {
		return '';
	} else if (splitedContent.length === 2) {
		let rule = splitedContent[0];

		let value = splitedContent[1].match(/(?<=\().*(?=\))/).pop();

		if (rule === 'text') {
			rule = (value.includes('#')) ? 'text-color' : 'text-size';
		}

		if (rule === 'border') {
			rule = (value.includes('#')) ? 'border-color' : 'border-width';
		}

		let properties = arbitraryValuesTable[rule];

		if (rule === 'from') {
			properties = _.replace(properties, new RegExp("{value1}", "g"), helpers.addTransparencyToHex(helpers.parseValue(value, sign)));
		}

		if (rule === 'anchorPoint') {
			// anchorPoint
			let value1 = (value.includes(',')) ? value.split(',')[1] : value;

			value = value.split(',')[0];

			properties = _.replace(properties, new RegExp("{value1}", "g"), helpers.parseValue(value1, sign));
		}

		if (properties) {
			return `'.${arbitraryValue}': ` + _.replace(properties, new RegExp("{value}", "g"), helpers.parseValue(value, sign));
		}
	} else if (splitedContent.length === 3) {
		let rule = `${splitedContent[0]}-${splitedContent[1]}`;

		let value = splitedContent[2].match(/(?<=\().*(?=\))/).pop();

		let properties = arbitraryValuesTable[rule];

		if (properties) {
			return `'.${arbitraryValue}': ` + _.replace(properties, new RegExp("{value}", "g"), helpers.parseValue(value, sign));
		}
	} else if (splitedContent.length === 4) {
		let rule = `${splitedContent[0]}-${splitedContent[1]}-${splitedContent[2]}`;

		let value = splitedContent[3].match(/(?<=\().*(?=\))/).pop();

		let properties = arbitraryValuesTable[rule];

		if (properties) {
			return `'.${arbitraryValue}': ` + _.replace(properties, new RegExp("{value}", "g"), helpers.parseValue(value, sign));
		}
	}

	return `// Property not yet supported: ${arbitraryValue}`;
}

//! FontAwesome
function purgeFontAwesome(uniqueClasses) {
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
					purgedClasses += `${line}\n`;
				}
			});
		}
	});

	return (purgedClasses === '\n// Custom Font Awesome styles\n' || purgedClasses === '\n// Default Font Awesome styles\n') ? '' : purgedClasses;
}

//! Material Design Icons
function purgeMaterialDesign(uniqueClasses) {
	logger.info('Purging Material Design Icons styles...');

	let purgedClasses = '\n// Material Design Icons styles\n';

	let sourceTSS = fs.readFileSync(srcMaterialDesignIconsTSSFile, 'utf8').split(/\r?\n/);
	let soc = sourceTSS.toString(); // soc = String of Classes

	_.each(uniqueClasses, className => {
		if (soc.includes(`'.${className}'`)) {
			_.each(sourceTSS, line => {
				if (line.startsWith(`'.${className}'`)) {
					purgedClasses += `${line}\n`;
				}
			});
		}
	});

	return (purgedClasses === '\n// Material Design Icons styles\n') ? '' : purgedClasses;
}

//! LineIcons
function purgeLineIcons(uniqueClasses) {
	logger.info('Purging LineIcons styles...');

	let purgedClasses = '\n// LineIcons styles\n';

	let sourceTSS = fs.readFileSync(srcLineiconsFontTSSFile, 'utf8').split(/\r?\n/);
	let soc = sourceTSS.toString(); // soc = String of Classes

	_.each(uniqueClasses, className => {
		if (soc.includes(`'.${className}'`)) {
			_.each(sourceTSS, line => {
				if (line.startsWith(`'.${className}'`)) {
					purgedClasses += `${line}\n`;
				}
			});
		}
	});

	return (purgedClasses === '\n// LineIcons styles\n') ? '' : purgedClasses;
}

//! BoxIcons
function purgeBoxIcons(uniqueClasses) {
	logger.info('Purging BoxIcons styles...');

	let purgedClasses = '\n// BoxIcons styles\n';

	let sourceTSS = fs.readFileSync(srcBoxIconsFontTSSFile, 'utf8').split(/\r?\n/);
	let soc = sourceTSS.toString(); // soc = String of Classes

	_.each(uniqueClasses, className => {
		if (soc.includes(`'.${className}'`)) {
			_.each(sourceTSS, line => {
				if (line.startsWith(`'.${className}'`)) {
					purgedClasses += `${line}\n`;
				}
			});
		}
	});

	return (purgedClasses === '\n// BoxIcons styles\n') ? '' : purgedClasses;
}

function saveFile(file, data) {
	fs.writeFileSync(file, data, err => {
		throw err;
	});
}

function createJMKFile() {
	logger.warn(chalk.green('Adding Auto-Purging hook!'));
	fs.copyFileSync(srcJMKFile, destJMKFile);
	logger.file('./app/alloy.jmk');
}
