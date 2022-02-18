const fs = require('fs');
const _ = require('lodash');
const junk = require('junk');
const glob = require("glob");
const path = require('path');
const chalk = require('chalk');
const convert = require('xml-js');
const readCSS = require('read-css');
const traverse = require('traverse');
// const { config, exit } = require('process');
const colores = require('./lib/colores').colores;
const { opacity } = require('tailwindcss/defaultTheme');
// const { includes } = require('lodash');
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
const srcLibF7 = path.resolve(__dirname, './dist/framework7icons.js');
const srcLibTI = path.resolve(__dirname, './dist/tablericons.js');
const srcLibFA = path.resolve(__dirname, './dist/fontawesome.js');
const srcLibMD = path.resolve(__dirname, './dist/materialdesignicons.js');
const srcLibBI = path.resolve(__dirname, './dist/bootstrapicons.js');
const srcPurgeTSSLibrary = path.resolve(__dirname, './dist/purgetss.ui.js');

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
	'fa-thin-100.ttf': 'FontAwesome6Pro-Thin.ttf',
	'fa-light-300.ttf': 'FontAwesome6Pro-Light.ttf',
	'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
	'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
	'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf'
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

const srcBoxIconsFontTSSFile = path.resolve(__dirname, './dist/boxicons.tss');
const srcFontAwesomeTSSFile = path.resolve(__dirname, './dist/fontawesome.tss');
const srcLineiconsFontTSSFile = path.resolve(__dirname, './dist/lineicons.tss');
const srcTablerIconsFontTSSFile = path.resolve(__dirname, './dist/tablericons.tss');
const srcFramework7FontTSSFile = path.resolve(__dirname, './dist/framework7icons.tss');
const srcMaterialDesignIconsTSSFile = path.resolve(__dirname, './dist/materialdesignicons.tss');
const srcBootstrapIconsFontTSSFile = path.resolve(__dirname, './dist/bootstrapicons.tss');

const srcPurgetssConfigFile = path.resolve(__dirname, './lib/templates/purgetss.config.js');
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
			copyFont('f7');
			copyFont('ti');
			copyFont('bi');
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
			copyFontLibrary('f7');
			copyFontLibrary('ti');
			copyFontLibrary('bi');
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

		tempPurged += purgeTailwind(uniqueClasses);

		let cleanUniqueClasses = cleanClasses(uniqueClasses);

		tempPurged += purgeFontAwesome(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeMaterialDesign(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeLineIcons(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeBoxIcons(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeFramework7(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeTablerIcons(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeBootstrapIcons(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeCustomFonts(uniqueClasses, cleanUniqueClasses);

		saveFile(destAppTSSFile, tempPurged);

		logger.file('app.tss');

		finish();
	}
}
module.exports.purgeClasses = purgeClasses;

function cleanClasses(uniqueClasses) {
	let cleanClassNames = [];

	uniqueClasses.forEach(classeName => {
		cleanClassNames.push(cleanClassNameFn(classeName));
	});

	return cleanClassNames;
}

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
	start();
	const { exec } = require("child_process");
	const commandExistsSync = require('command-exists').sync;

	exec(`ti config app.idprefix && ti config app.workspace`, (error, stdout) => {

		let results = stdout.split('\n');
		let idPrefix = results[0];
		let workspace = results[1];

		// if (error) return logger.error(error);

		if (idPrefix !== 'app.idprefix not found' && workspace !== '') {
			console.log('');
			logger.info('Creating a new Titanium project');

			let projectName = `"${args.name}"`;
			let projectID = `${idPrefix}.${args.name.replace(/ /g, '').replace(/-/g, '').replace(/_/g, '').toLowerCase()}`;

			let tiCreateCommand = `ti create -t app -p all -n ${projectName} --no-prompt --id ${projectID}`;
			exec(tiCreateCommand, (error) => {
				if (error) return logger.error(error);

				let fonts = (options.vendor) ? `&& purgetss f -m -v=${options.vendor}` : '';

				if (options.vendor) {
					logger.info('Installing requested fonts');
				}

				let cdToProject = `cd ${workspace}/${projectName} && alloy new && purgetss w && purgetss b ${fonts}`;
				exec(cdToProject, (error) => {
					if (error) return logger.error(error);

					let theOpenCommand;
					if (commandExistsSync('code')) {
						theOpenCommand = `cd ${workspace}/${projectName} && code .`;
					} else if (commandExistsSync('subl')) {
						theOpenCommand = `cd ${workspace}/${projectName} && subl .`;
					} else {
						theOpenCommand = `cd ${workspace}/${projectName} && open .`;
					}

					if (options.tailwind) {
						logger.info('Installing Tailwind CSS');

						fs.writeFileSync(`${workspace}/${args.name}/package.json`, JSON.stringify({ "name": `${args.name.replace(/ /g, '-').toLowerCase()}`, "private": true }));

						let installTailwind = `cd ${workspace}/${projectName} && npm init -y && npm i tailwindcss -D && npx tailwindcss init`;
						exec(installTailwind, (error) => {
							if (error) return logger.error(error);

							finish(chalk.yellow(`‘${args.name}’`) + ' project created successfully in');

							exec(theOpenCommand, (error) => {
								if (error) return logger.error(error);
							});
						});
					} else {
						finish(chalk.yellow(`‘${args.name}’`) + ' project created successfully in');

						exec(theOpenCommand, (error) => {
							if (error) return logger.error(error);
						});
					}
				});
			});
		} else {
			console.log('');
			logger.error('::Can’t create a Titanium project::');
			logger.info('You need to have', chalk.green('`app.idprefix`'), 'and', chalk.green('`app.workspace`'), 'configured to create a Project with', chalk.green('`PurgeTSS`'));
			console.log('');
			logger.info('Please, set them like this:');
			logger.info(chalk.green('ti config app.idprefix'), chalk.yellow("'com.your.reverse.domain'"));
			logger.info(chalk.green('ti config app.workspace'), chalk.yellow("'path/to/your/workspace/directory'"));
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
				exportIcons += `\t'${prettifyFontName(rule.selector, 'fa-')}': '\\u${rule.property}',\n`;
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
	fs.copyFile(srcFontsFolder + '/FontAwesome6Brands-Regular.ttf', destFontsFolder + '/FontAwesome6Brands-Regular.ttf', callback);
	fs.copyFile(srcFontsFolder + '/FontAwesome6Free-Regular.ttf', destFontsFolder + '/FontAwesome6Free-Regular.ttf', callback);
	fs.copyFile(srcFontsFolder + '/FontAwesome6Free-Solid.ttf', destFontsFolder + '/FontAwesome6Free-Solid.ttf', callback);

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

function copyFramework7IconsFonts() {
	// Framework7 Font
	copyFile(srcFontsFolder + '/Framework7-Icons.ttf', 'Framework7-Icons.ttf');
	logger.info('Framework7-Icons Font copied to', chalk.yellow('./app/assets/fonts'), 'folder');
}

function copyTablerIconsFonts() {
	// Tabler Icons Font
	copyFile(srcFontsFolder + '/tabler-icons.ttf', 'tabler-icons.ttf');
	logger.info('tabler-icons Font copied to', chalk.yellow('./app/assets/fonts'), 'folder');
}

function copyBootstrapIconsFonts() {
	// Bootstrap Icons Font
	copyFile(srcFontsFolder + '/bootstrap-icons.ttf', 'bootstrap-icons.ttf');
	logger.info('bootstrap-icons Font copied to', chalk.yellow('./app/assets/fonts'), 'folder');
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

// ! Build fonts.tss
function getFiles(dir) {
	return fs.readdirSync(dir).flatMap((item) => {
		const path = `${dir}/${item}`;
		if (fs.statSync(path).isDirectory()) {
			return getFiles(path);
		}

		return path;
	});
}

function buildCustomFonts(options) {
	if (fs.existsSync(cwd + '/purgetss/fonts/')) {
		start();

		let files = getFiles(cwd + '/purgetss/fonts').filter(file => {
			return file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.css') || file.endsWith('.TTF') || file.endsWith('.OTF') || file.endsWith('.CSS');
		});

		let fontMeta = '';
		let customFontsJS = '';
		const FontName = require('fontname');
		let tssClasses = `// Fonts TSS file generated with PurgeTSS\n// https://github.com/macCesar/purgeTSS\n`;
		let prefix, tssPrefix = '';

		_.each(files, file => {
			if (file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.TTF') || file.endsWith('.OTF')) {
				fontMeta = FontName.parse(fs.readFileSync(file))[0];

				tssClasses += processFontMeta(fontMeta);

				tssClasses += `\n'.${fontMeta.postScriptName.replace(/\//g, '').toLowerCase()}': { font: { fontFamily: '${fontMeta.postScriptName.replace(/\//g, '')}' } }\n`;

				//! Copy Font File
				makeSureFolderExists(destFontsFolder);
				let fontExtension = file.split('.').pop();
				fs.copyFile(file, `${destFontsFolder}/${fontMeta.postScriptName.replace(/\//g, '')}.${fontExtension}`, err => { });
				logger.info('Copying font', `${chalk.yellow(file.split('/').pop())}...`);
			}
		});

		let oneTimeMessage = `\n// Unicode Characters\n// To use your Icon Fonts in Buttons AND Labels each class sets 'text' and 'title' properties\n`;

		_.each(files, file => {
			if (file.endsWith('.css') || file.endsWith('.CSS')) {
				let cssFileString = fs.readFileSync(file).toString();

				let syntax = cssFileString.includes('::before') ? '::before' : ':before';

				tssClasses += oneTimeMessage + `\n// ${file.split('/').pop()}\n`;
				oneTimeMessage = '';

				tssClasses += processCustomFontsCSS(readCSS(file), syntax, prefix, tssPrefix);

				//! JavaScript Module
				if (options.modules) {
					customFontsJS += processCustomFontsJS(readCSS(file), syntax, prefix, tssPrefix, `\n	// ${file.split('/').pop()}`);
				}

				// !Done processing stylesheet
				logger.info('Processing', `${chalk.yellow(file.split('/').pop())}...`);
			}
		});

		fs.writeFileSync(cwd + '/purgetss/fonts.tss', tssClasses, err => {
			throw err;
		});

		makeSureFolderExists(destLibFolder);

		if (customFontsJS) {
			let exportIcons = fs.readFileSync(path.resolve(__dirname, './lib/templates/icon-functions.js'), 'utf8');
			exportIcons += '\nconst icons = {';
			exportIcons += customFontsJS
			exportIcons += '};\n';
			exportIcons += 'exports.icons = icons;\n';

			fs.writeFileSync(destLibFolder + '/purgetss.fonts.js', exportIcons, err => {
				throw err;
			});

			logger.info(`${chalk.yellow('./app/lib/purgetss.fonts.js')} file created!`);
		} else {
			if (fs.existsSync(destLibFolder + '/purgetss.fonts.js')) {
				fs.unlinkSync(destLibFolder + '/purgetss.fonts.js');
			}
		}

		if (files.length > 0) {
			console.log();

			finish(`Finished building ${chalk.yellow('fonts.tss')} in`);
		} else {
			logger.info('No fonts found in', chalk.yellow('./purgetss/fonts'), 'folder!');
		}
	} else {
		logger.info(`Add fonts and css files to ${chalk.yellow('./purgetss/fonts')} and run this command again!`);
	}
}
module.exports.buildCustomFonts = buildCustomFonts;

function readFilesAndFolers(currentDirPath, callback) {
	const getAllFiles = dir =>
		fs.readdirSync(dir).reduce((files, file) => {
			const name = path.join(dir, file);
			const isDirectory = fs.statSync(name).isDirectory();
			return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
		}, []);
}

function processCustomFontsCSS(data, syntax, prefix, tssPrefix) {
	let rules = getRules(data, syntax, prefix, tssPrefix);

	let paraTSS = '';

	_.each(rules, rule => {
		if (rule) {
			paraTSS += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`;
		}
	});

	return paraTSS;
}

function processCustomFontsJS(data, syntax, prefix, tssPrefix, fontFamily = '') {
	let rules = getRules(data, syntax, prefix, tssPrefix);

	let exportIcons = `${fontFamily}\n`;

	_.each(rules, rule => {
		if (rule) {
			exportIcons += `\t'${prettifyFontName(rule.selector.replace('.', ''))}': '\\u${rule.property}',\n`;
		}
	});

	return exportIcons;
}

function getRules(data, syntax, prefix, tssPrefix) {
	let rules = _.map(data.stylesheet.rules, rule => {
		if (rule.type === 'rule' && rule.declarations[0].property === 'content') {
			return {
				'selector': '.' + rule.selectors[0].replace('.', '').replace(prefix, tssPrefix ? tssPrefix : prefix).replace(syntax, ''),
				'property': ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '').replace('\'\\', '').replace('\'', '')).slice(-4)
			};
		}
	});

	return rules;
}

function processFontMeta(fontMeta) {
	let fontMetaString = `\n/**\n * ${fontMeta.fullName}`;

	fontMetaString += `\n * ${fontMeta.version}`;

	// if (fontMeta.description) {
	// 	fontMetaString += `\n * description: ${fontMeta.description}`;
	// }

	if (fontMeta.designer) {
		fontMetaString += `\n * ${fontMeta.designer}`;
	}

	if (fontMeta.urlVendor) {
		fontMetaString += `\n * ${fontMeta.urlVendor}`;
	}

	// if (fontMeta.urlDesigner) {
	// 	fontMetaString += `\n * urlDesigner: ${fontMeta.urlDesigner}`;
	// }

	if (fontMeta.copyright) {
		fontMetaString += `\n * ${fontMeta.copyright}`;
	}

	if (fontMeta.trademark) {
		fontMetaString += `\n * ${fontMeta.trademark}`;
	}

	if (fontMeta.licence) {
		fontMetaString += `\n * ${fontMeta.licence.split('\n')[0]}`;
	}

	if (fontMeta.licenceURL) {
		fontMetaString += `\n * ${fontMeta.licenceURL}`;
	}

	fontMetaString += `\n */`;

	return fontMetaString;
}

//! Purge Custom Fonts
function purgeCustomFonts(uniqueClasses, cleanUniqueClasses) {
	if (fs.existsSync(cwd + '/purgetss/fonts.tss')) {
		let purgedClasses = '\n// Custom Fonts styles\n';

		let sourceTSS = fs.readFileSync(cwd + '/purgetss/fonts.tss', 'utf8').split(/\r?\n/);

		purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, 'Purging Custom Fonts styles...', cleanUniqueClasses, []);

		return (purgedClasses === '\n// Custom Fonts styles\n') ? '' : purgedClasses;
	}

	return '';
}

function prettifyFontName(str, prefix) {
	str = str.replace(/_/g, '-');

	if (prefix) {
		str = str.replace(prefix, '');
	}

	str = str.replace(/\s/g, '');

	let temp = str.split('-'), i, pretty;

	for (i = 1; i < temp.length; i++) {
		temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
	}

	pretty = temp.join('').replace(':', '');

	pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase());

	return pretty;
};

function buildCustomFontsXXX() {
	let configFile = require(destConfigJSFile);

	if (configFile.fonts) {
		start();
		const FontName = require('fontname');
		let tssClasses = `// Fonts TSS file generated with PurgeTSS\n// https://github.com/macCesar/purgeTSS\n`;
		let exportIcons = fs.readFileSync(path.resolve(__dirname, './lib/templates/icon-functions.js'), 'utf8');
		let customFontsJS = '';

		_.each(configFile.fonts, customFont => {
			let { folder, prefix, tssPrefix } = customFont;

			if (!fs.existsSync(cwd + `/purgetss/fonts/${folder}`)) {
				throw new Error(`The folder '${folder}' does not exist`);
			}

			// use glob.sync to read .ttf and otf files
			let fontFiles = glob.sync(cwd + `/purgetss/fonts/${folder}/*.{ttf,otf}`);
			// let trueType = glob.sync(cwd + `/purgetss/fonts/${folder}/*.ttf`,);
			// let openType = glob.sync(cwd + `/purgetss/fonts/${folder}/*.otf`);

			if (fontFiles.length === 0) {
				throw new Error(`The folder '${folder}' does not contain any font file`);
			}

			// let fontFiles = trueType.length > 0 ? trueType : openType.length > 0 ? openType : '';
			let fontMeta = '';

			_.each(fontFiles, fontFile => {
				fontMeta = FontName.parse(fs.readFileSync(fontFile))[0];

				// Add font information and font-family
				tssClasses += processFontMeta(fontMeta);

				if (fontFiles.length > 0) {
					tssClasses += `\n'.${fontMeta.postScriptName.replace(/\//g, '').toLowerCase()}': { font: { fontFamily: '${fontMeta.postScriptName.replace(/\//g, '')}' } }\n`;
				} else {
					tssClasses += `\n'.${tssPrefix ? tssPrefix.replace('-', '') : prefix ? prefix : fontMeta.postScriptName.replace(/\//g, '').toLowerCase()}': { font: { fontFamily: '${fontMeta.postScriptName.replace(/\//g, '')}' } }\n`;
				}

				//! Copy Font File
				makeSureFolderExists(destFontsFolder);
				let fontExtension = fontFile.split('.').pop();
				fs.copyFile(fontFile, `${destFontsFolder}/${fontMeta.postScriptName.replace(/\//g, '')}.${fontExtension}`, err => { });
			});

			//! Stylesheet
			let stylesheetFiles = glob.sync(cwd + `/purgetss/fonts/${folder}/*.css`);
			_.each(stylesheetFiles, stylesheet => {
				// let stylesheet = stylesheetFiles.length > 0 ? stylesheetFiles[0] : '';

				let cssFileString = fs.readFileSync(stylesheet).toString();

				let syntax = cssFileString.includes('::before') ? '::before' : ':before';

				tssClasses += `\n// Unicode Characters\n// To use your Icon Fonts in Buttons AND Labels each class sets 'text' and 'title' properties\n`;

				tssClasses += processCustomFontsCSS(readCSS(stylesheet), syntax, prefix, tssPrefix);

				// !JavaScript Module
				customFontsJS += processCustomFontsJS(readCSS(stylesheet), syntax, prefix, tssPrefix, processFontMeta(fontMeta));

				// !Done processing stylesheet
				logger.info('Processing', `${chalk.yellow(stylesheet.split('/').pop())}...`);
			});
		});

		fs.writeFileSync(cwd + '/purgetss/fonts.tss', tssClasses, err => {
			throw err;
		});

		makeSureFolderExists(destLibFolder);

		if (customFontsJS) {
			exportIcons += '\nconst icons = {';
			exportIcons += customFontsJS
			exportIcons += '};\n';
			fs.writeFileSync(destLibFolder + '/purgetss.fonts.js', exportIcons, err => {
				throw err;
			});
		} else {
			if (fs.existsSync(destLibFolder + '/purgetss.fonts.js')) {
				fs.unlinkSync(destLibFolder + '/purgetss.fonts.js');
			}
		}

		console.log();
		finish(`Finished building ${chalk.yellow('fonts.tss')} in`);
	}
}
module.exports.buildCustomFontsXXX = buildCustomFontsXXX;

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
				updatedJMKFile.push(`\t//${line}`);
				logger.warn(chalk.yellow('Auto-Purging hook disabled!'));
			} else {
				logger.warn(chalk.red('Auto-Purging hook removed!'));
				logger.warn(chalk.red('It will be added the next time `PurgeTSS` runs!'));
			}
		});

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

	readAllXMLFiles(cwd + '/app/views', viewPath => {
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

	// Remove deprecated colors
	delete defaultColors.blueGray;
	delete defaultColors.coolGray;
	delete defaultColors.current;
	delete defaultColors.inherit;
	delete defaultColors.lightBlue;
	delete defaultColors.trueGray;
	delete defaultColors.warmGray;

	// !Prepare values
	configFile.theme.extend = configFile.theme.extend ?? {};

	let allWidthsCombined = (configFile.theme.spacing) ? { ...{ full: '100%', auto: '', screen: '' }, ...configFile.theme.spacing } : { ...defaultTheme.width({ theme: () => (defaultTheme.spacing) }) };
	let allHeightsCombined = (configFile.theme.spacing) ? { ...{ full: '100%', auto: '', screen: '' }, ...configFile.theme.spacing } : defaultTheme.height({ theme: () => (defaultTheme.spacing) });

	let overwritten = {
		width: configFile.theme.width ?? allWidthsCombined,
		height: configFile.theme.height ?? allHeightsCombined,
		spacing: configFile.theme.spacing ?? { ...defaultTheme.spacing },
		colors: configFile.theme.colors ?? { transparent: 'transparent', ...defaultColors },
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

	if (configFile.theme.ImageView && configFile.theme.ImageView.apply) {
		let theApply = configFile.theme.ImageView.apply;
		delete configFile.theme.ImageView.apply;
		configFile.theme['ImageView'] = _.merge({ apply: theApply }, { ios: { hires: true } }, configFile.theme.ImageView);
	} else {
		configFile.theme['ImageView'] = _.merge({ ios: { hires: true } }, configFile.theme.ImageView);
	}

	// configFile.theme['Label'] = _.merge({ default: { width: 'Ti.UI.FILL', height: 'Ti.UI.SIZE' } }, configFile.theme.Label);
	if (configFile.theme.View && configFile.theme.View.apply) {
		let theApply = configFile.theme.View.apply;
		delete configFile.theme.View.apply;
		configFile.theme['View'] = _.merge({ apply: theApply }, configFile.theme.View);
	} else {
		configFile.theme['View'] = _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View);
	}

	if (configFile.theme.Window && configFile.theme.Window.apply) {
		let theApply = configFile.theme.Window.apply;
		delete configFile.theme.Window.apply;
		configFile.theme['Window'] = _.merge({ apply: theApply }, configFile.theme.Window);
	} else {
		configFile.theme['Window'] = _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window);
	}

	let defaultBorderRadius = (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing };

	// Some clean up
	// pagingControlHeight
	delete base.height['fit'];
	delete base.height['max'];
	delete base.height['min'];
	delete base.height['min-content'];
	delete base.height['max-content'];

	// !Core Properties

	// !Combine `key` values from configFile.theme with base.values or with default.values to generate classes

	// Android Specific
	configFile.theme.activeIconIsMask = {};
	configFile.theme.activeTintColor = combineKeys(configFile.theme, base.colors, 'activeTintColor');
	configFile.theme.activeTitleColor = combineKeys(configFile.theme, base.colors, 'activeTitleColor');
	configFile.theme.activityEnterTransition = {};
	configFile.theme.activityExitTransition = {};
	configFile.theme.activityIndicatorStyle = {};
	configFile.theme.activityReenterTransition = {};
	configFile.theme.activityReturnTransition = {};
	configFile.theme.activitySharedElementEnterTransition = {};
	configFile.theme.activitySharedElementExitTransition = {};
	configFile.theme.activitySharedElementReenterTransition = {};
	configFile.theme.activitySharedElementReturnTransition = {};
	configFile.theme.allowUserCustomization = {};
	configFile.theme.autoAdjustScrollViewInsets = {};
	configFile.theme.autocapitalization = {};
	configFile.theme.autocorrect = {};
	configFile.theme.autofillType = {};
	configFile.theme.autoLink = {};
	configFile.theme.autoreverse = {};
	configFile.theme.backgroundBlendMode = {};
	configFile.theme.backgroundColor = combineKeys(configFile.theme, base.colors, 'backgroundColor');
	configFile.theme.backgroundGradient = combineKeys(configFile.theme, base.colors, 'backgroundGradient');
	configFile.theme.backgroundLinearGradient = {};
	configFile.theme.backgroundRadialGradient = {};
	configFile.theme.backgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'backgroundSelectedColor');
	configFile.theme.barColor = combineKeys(configFile.theme, base.colors, 'barColor');
	configFile.theme.borderColor = combineKeys(configFile.theme, base.colors, 'borderColor');
	configFile.theme.borderRadius = combineKeys(configFile.theme, _.merge(defaultBorderRadius, configFile.theme.spacing, configFile.theme.extend.spacing), 'borderRadius');
	configFile.theme.borderStyle = {};
	configFile.theme.borderWidth = combineKeys(configFile.theme, defaultTheme.borderWidth, 'borderWidth');
	configFile.theme.bottomNavigation = combineKeys(configFile.theme, base.spacing, 'bottomNavigation');
	configFile.theme.boxShadow = {};
	configFile.theme.bubbleParent = {};
	configFile.theme.cacheSize = {};
	configFile.theme.clipMode = {};
	configFile.theme.currentPageIndicatorColor = combineKeys(configFile.theme, base.colors, 'currentPageIndicatorColor');
	configFile.theme.disableBounce = {};
	configFile.theme.displayCaps = {};
	configFile.theme.displayUtilities = {};
	configFile.theme.draggingConstraints = {};
	configFile.theme.draggingType = {};
	configFile.theme.dropShadow = {};
	configFile.theme.editable = {};
	configFile.theme.elevation = combineKeys(configFile.theme, _.merge(base.spacing, configFile.theme.spacing, configFile.theme.extend.spacing), 'elevation');
	configFile.theme.ellipsize = {};
	configFile.theme.enableCopy = {};
	configFile.theme.enableReturnKey = {};
	configFile.theme.exitOnClose = {};
	configFile.theme.extendBackground = {};
	configFile.theme.extendEdges = {};
	configFile.theme.extendSafeArea = {};
	configFile.theme.flagSecure = {};
	configFile.theme.flip = {};
	configFile.theme.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily');
	configFile.theme.fontSize = combineKeys(configFile.theme, defaultTheme.fontSize, 'fontSize');
	configFile.theme.fontStyle = {};
	configFile.theme.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight');
	configFile.theme.fullscreen = {};
	configFile.theme.gap = combineKeys(configFile.theme, base.spacing, 'margin');
	configFile.theme.gridColumnsStartEnd = {};
	configFile.theme.gridFlow = {};
	configFile.theme.gridSystem = {};
	configFile.theme.height = base.height;
	configFile.theme.hidesBackButton = {};
	configFile.theme.hidesBarsOnSwipe = {};
	configFile.theme.hidesBarsOnTap = {};
	configFile.theme.hidesBarsWhenKeyboardAppears = {};
	configFile.theme.hideShadow = {};
	configFile.theme.hidesSearchBarWhenScrolling = {};
	configFile.theme.hintTextColor = combineKeys(configFile.theme, base.colors, 'hintTextColor');
	configFile.theme.homeIndicatorAutoHidden = {};
	configFile.theme.iconIsMask = {};
	configFile.theme.includeOpaqueBars = {};
	configFile.theme.indicatorColor = combineKeys(configFile.theme, base.colors, 'indicatorColor');
	configFile.theme.interactivity = {};
	configFile.theme.items = {};
	configFile.theme.keepScreenOn = {};
	configFile.theme.keepSectionsInSearch = {};
	configFile.theme.keyboardAppearance = {};
	configFile.theme.keyboardDismissMode = {};
	configFile.theme.keyboardType = {};
	configFile.theme.largeTitleDisplayMode = {};
	configFile.theme.largeTitleEnabled = {};
	configFile.theme.layout = {};
	configFile.theme.lazyLoadingEnabled = {};
	configFile.theme.loginKeyboardType = {};
	configFile.theme.loginReturnKeyType = {};
	configFile.theme.margin = combineKeys(configFile.theme, base.spacing, 'margin');
	configFile.theme.maxElevation = combineKeys(configFile.theme, _.merge(base.spacing, configFile.theme.spacing, configFile.theme.extend.spacing), 'maxElevation');
	configFile.theme.modal = {};
	configFile.theme.navBarHidden = {};
	configFile.theme.navTintColor = combineKeys(configFile.theme, base.colors, 'navTintColor');
	configFile.theme.opacity = combineKeys(configFile.theme, defaultTheme.opacity, 'opacity');
	configFile.theme.orientationModes = {};
	configFile.theme.origin = {};
	configFile.theme.overlay = {};
	configFile.theme.padding = combineKeys(configFile.theme, base.spacing, 'padding');
	configFile.theme.pageIndicatorColor = combineKeys(configFile.theme, base.colors, 'pageIndicatorColor');
	configFile.theme.pagingControl = {};
	configFile.theme.pagingControlAlpha = combineKeys(configFile.theme, defaultTheme.opacity, 'pagingControlAlpha');
	configFile.theme.pagingControlColor = combineKeys(configFile.theme, base.colors, 'pagingControlColor');
	configFile.theme.pagingControlHeight = base.height;
	configFile.theme.pagingControlOnTop = {};
	configFile.theme.pagingControlTimeout = combineKeys(configFile.theme, { ...{ '0': '0ms', '25': '25ms', '50': '50ms', '2000': '2000ms', '3000': '3000ms', '4000': '4000ms', '5000': '5000ms' }, ...defaultTheme.transitionDelay }, 'pagingControlTimeout');
	configFile.theme.passwordKeyboardType = {};
	configFile.theme.pickerType = {};
	configFile.theme.placement = {};
	configFile.theme.preventCornerOverlap = {};
	configFile.theme.preventDefaultImage = {};
	configFile.theme.repeat = {};
	configFile.theme.returnKeyType = {};
	configFile.theme.rotate = combineKeys(configFile.theme, defaultTheme.rotate, 'rotate');
	configFile.theme.scale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'scale');
	configFile.theme.scrollableRegion = {};
	configFile.theme.scrollIndicators = {};
	configFile.theme.scrollingEnabled = {};
	configFile.theme.scrollType = {};
	configFile.theme.shadowColor = combineKeys(configFile.theme, base.colors, 'shadowColor');
	configFile.theme.shiftMode = {};
	configFile.theme.showAsAction = {};
	configFile.theme.showCancel = {};
	configFile.theme.smoothScrollOnTabClick = {};
	configFile.theme.statusBar = {};
	configFile.theme.sustainedPerformanceMode = {};
	configFile.theme.swipeToClose = {};
	configFile.theme.tabBarHidden = {};
	configFile.theme.tabGroupStyle = {};
	configFile.theme.tabsBackgroundColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundColor');
	configFile.theme.tabsBackgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundSelectedColor');
	configFile.theme.tabsTranslucent = {};
	configFile.theme.textAlign = {};
	configFile.theme.textColor = combineKeys(configFile.theme, base.colors, 'textColor');
	configFile.theme.theme = {};
	configFile.theme.tiMedia = {};
	configFile.theme.tintColor = combineKeys(configFile.theme, base.colors, 'tintColor');
	configFile.theme.titleAttributesColor = combineKeys(configFile.theme, base.colors, 'titleAttributesColor');
	configFile.theme.titleAttributesShadow = {};
	configFile.theme.titleAttributesShadowColor = combineKeys(configFile.theme, base.colors, 'titleAttributesShadowColor');
	configFile.theme.titleColor = combineKeys(configFile.theme, base.colors, 'titleColor');
	configFile.theme.touchFeedbackColor = combineKeys(configFile.theme, base.colors, 'touchFeedbackColor');
	configFile.theme.transition = {};
	configFile.theme.transitionDelay = combineKeys(configFile.theme, { ...{ '0': '0ms', '25': '25ms', '50': '50ms', '250': '250ms', '350': '350ms', '400': '400ms', '450': '450ms', '600': '600ms', '800': '800ms', '900': '900ms', '2000': '2000ms', '3000': '3000ms', '4000': '4000ms', '5000': '5000ms' }, ...defaultTheme.transitionDelay }, 'transitionDelay');
	configFile.theme.transitionDuration = combineKeys(configFile.theme, { ...{ '0': '0ms', '25': '25ms', '50': '50ms', '250': '250ms', '350': '350ms', '400': '400ms', '450': '450ms', '600': '600ms', '800': '800ms', '900': '900ms', '2000': '2000ms', '3000': '3000ms', '4000': '4000ms', '5000': '5000ms' }, ...defaultTheme.transitionDuration }, 'transitionDuration');
	configFile.theme.translucent = {};
	configFile.theme.useCompatPadding = {};
	configFile.theme.useSpinner = {};
	configFile.theme.verticalAlignment = {};
	configFile.theme.viewShadowColor = combineKeys(configFile.theme, base.colors, 'viewShadowColor');
	configFile.theme.width = base.width;
	configFile.theme.windowPixelFormat = {};
	configFile.theme.windowSoftInputMode = {};
	configFile.theme.zIndex = combineKeys(configFile.theme, defaultTheme.zIndex, 'zIndex');

	// !Some final cleanup
	delete configFile.theme.extend;
	delete configFile.theme.colors;
	delete configFile.theme.spacing;

	if (!Object.keys(configFile.theme.fontFamily).length) {
		delete configFile.theme.fontFamily;
	}

	// !Delete corePlugins specified in the config file
	let corePlugins = Array.isArray(configFile.corePlugins) ? configFile.corePlugins : Object.keys(configFile.corePlugins).map(key => key);
	// convert Object to Array
	_.each(corePlugins, value => {
		delete configFile.theme[value];
	});

	let sorted = Object.entries(configFile.theme).sort().reduce((object, [key, value]) => (object[key] = value, object), {});

	let tailwindStyles = fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/template.tss'), 'utf8');

	tailwindStyles += fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/custom-template.tss'), 'utf8');

	tailwindStyles += `// config.js file updated on: ${getFileUpdatedDate(destConfigJSFile)}\n` + '\n// Custom Styles and Resets\n';

	_.each(sorted, (value, key) => {
		tailwindStyles += helpersToBuildCustomTailwindClasses(key, value);
	});

	fs.writeFileSync(customTailwindFile, helpers.applyProperties(tailwindStyles));

	logger.info(chalk.yellow('./purgetss/tailwind.tss'), message);
}

//! Build tailwind's custom values
function helpersToBuildCustomTailwindClasses(key, value) {
	switch (key) {

		case 'activeIconIsMask': return helpers.activeIconIsMask();
		case 'activeTintColor': return helpers.activeTintColor(value);
		case 'activeTitleColor': return helpers.activeTitleColor(value);
		case 'activityEnterTransition': return helpers.activityEnterTransition();
		case 'activityExitTransition': return helpers.activityExitTransition();
		case 'activityIndicatorStyle': return helpers.activityIndicatorStyle();
		case 'activityReenterTransition': return helpers.activityReenterTransition();
		case 'activityReturnTransition': return helpers.activityReturnTransition();
		case 'activitySharedElementEnterTransition': return helpers.activitySharedElementEnterTransition();
		case 'activitySharedElementExitTransition': return helpers.activitySharedElementExitTransition();
		case 'activitySharedElementReenterTransition': return helpers.activitySharedElementReenterTransition();
		case 'activitySharedElementReturnTransition': return helpers.activitySharedElementReturnTransition();
		case 'allowUserCustomization': return helpers.allowUserCustomization();
		case 'autoAdjustScrollViewInsets': return helpers.autoAdjustScrollViewInsets();
		case 'autocapitalization': return helpers.autocapitalization();
		case 'autocorrect': return helpers.autocorrect();
		case 'autofillType': return helpers.autofillType();
		case 'autoLink': return helpers.autoLink();
		case 'autoreverse': return helpers.autoreverse();
		case 'backgroundBlendMode': return helpers.backgroundBlendMode();
		case 'backgroundColor': return helpers.backgroundColor(value);
		case 'backgroundGradient': return helpers.backgroundGradient(value);
		case 'backgroundLinearGradient': return helpers.linearGradient();
		case 'backgroundRadialGradient': return helpers.radialGradient();
		case 'backgroundSelectedColor': return helpers.backgroundSelectedColor(value);
		case 'barColor': return helpers.barColor(value);
		case 'borderColor': return helpers.borderColor(value);
		case 'borderRadius': return helpers.borderRadius(value);
		case 'borderStyle': return helpers.borderStyle();
		case 'borderWidth': return helpers.borderWidth(value);
		case 'bottomNavigation': return helpers.bottomNavigation(value);
		case 'boxShadow': return helpers.boxShadow();
		case 'bubbleParent': return helpers.bubbleParent();
		case 'cacheSize': return helpers.cacheSize();
		case 'clipMode': return helpers.clipMode();
		case 'currentPageIndicatorColor': return helpers.currentPageIndicatorColor(value);
		case 'disableBounce': return helpers.disableBounce();
		case 'displayCaps': return helpers.displayCaps();
		case 'displayUtilities': return helpers.displayUtilities();
		case 'draggingConstraints': return helpers.draggingConstraints();
		case 'draggingType': return helpers.draggingType();
		case 'dropShadow': return helpers.dropShadow();
		case 'editable': return helpers.editable();
		case 'elevation': return helpers.elevation(value);
		case 'ellipsize': return helpers.ellipsize();
		case 'enableCopy': return helpers.enableCopy();
		case 'enableReturnKey': return helpers.enableReturnKey();
		case 'exitOnClose': return helpers.exitOnClose();
		case 'extendBackground': return helpers.extendBackground();
		case 'extendEdges': return helpers.extendEdges();
		case 'extendSafeArea': return helpers.extendSafeArea();
		case 'flagSecure': return helpers.flagSecure();
		case 'flip': return helpers.flip();
		case 'fontFamily': return helpers.fontFamily(value);
		case 'fontSize': return helpers.fontSize(value);
		case 'fontStyle': return helpers.fontStyle();
		case 'fontWeight': return helpers.fontWeight(value);
		case 'fullscreen': return helpers.fullscreen();
		case 'gap': return helpers.gap(value);
		case 'gridColumnsStartEnd': return helpers.gridColumnsStartEnd();
		case 'gridFlow': return helpers.gridFlow();
		case 'gridSystem': return helpers.gridSystem();
		case 'height': return helpers.height(value);
		case 'hidesBackButton': return helpers.hidesBackButton();
		case 'hidesBarsOnSwipe': return helpers.hidesBarsOnSwipe();
		case 'hidesBarsOnTap': return helpers.hidesBarsOnTap();
		case 'hidesBarsWhenKeyboardAppears': return helpers.hidesBarsWhenKeyboardAppears();
		case 'hideShadow': return helpers.hideShadow();
		case 'hidesSearchBarWhenScrolling': return helpers.hidesSearchBarWhenScrolling();
		case 'hintTextColor': return helpers.hintTextColor(value);
		case 'homeIndicatorAutoHidden': return helpers.homeIndicatorAutoHidden();
		case 'iconIsMask': return helpers.iconIsMask();
		case 'includeOpaqueBars': return helpers.includeOpaqueBars();
		case 'indicatorColor': return helpers.indicatorColor(value);
		case 'interactivity': return helpers.interactivity(value);
		case 'items': return helpers.items();
		case 'keepScreenOn': return helpers.keepScreenOn();
		case 'keepSectionsInSearch': return helpers.keepSectionsInSearch();
		case 'keyboardAppearance': return helpers.keyboardAppearance();
		case 'keyboardDismissMode': return helpers.keyboardDismissMode();
		case 'keyboardType': return helpers.keyboardType();
		case 'largeTitleDisplayMode': return helpers.largeTitleDisplayMode();
		case 'largeTitleEnabled': return helpers.largeTitleEnabled();
		case 'layout': return helpers.layout();
		case 'lazyLoadingEnabled': return helpers.lazyLoadingEnabled();
		case 'loginKeyboardType': return helpers.loginKeyboardType();
		case 'loginReturnKeyType': return helpers.loginReturnKeyType();
		case 'margin': return helpers.margin(value);
		case 'maxElevation': return helpers.maxElevation(value);
		case 'modal': return helpers.modal();
		case 'navBarHidden': return helpers.navBarHidden();
		case 'navTintColor': return helpers.navTintColor(value);
		case 'opacity': return helpers.opacity(value);
		case 'orientationModes': return helpers.orientationModes();
		case 'origin': return helpers.origin();
		case 'overlay': return helpers.overlay();
		case 'padding': return helpers.padding(value);
		case 'pageIndicatorColor': return helpers.pageIndicatorColor(value);
		case 'pagingControl': return helpers.pagingControl();
		case 'pagingControlAlpha': return helpers.pagingControlAlpha(value);
		case 'pagingControlColor': return helpers.pagingControlColor(value);
		case 'pagingControlHeight': return helpers.pagingControlHeight(value);
		case 'pagingControlOnTop': return helpers.pagingControlOnTop();
		case 'pagingControlTimeout': return helpers.pagingControlTimeout(value);
		case 'passwordKeyboardType': return helpers.passwordKeyboardType();
		case 'pickerType': return helpers.pickerType();
		case 'placement': return helpers.placement();
		case 'preventCornerOverlap': return helpers.preventCornerOverlap();
		case 'preventDefaultImage': return helpers.preventDefaultImage();
		case 'repeat': return helpers.repeat();
		case 'returnKeyType': return helpers.returnKeyType();
		case 'rotate': return helpers.rotate(value);
		case 'scale': return helpers.scale(value);
		case 'scrollableRegion': return helpers.scrollableRegion();
		case 'scrollIndicators': return helpers.scrollIndicators();
		case 'scrollingEnabled': return helpers.scrollingEnabled();
		case 'scrollType': return helpers.scrollType();
		case 'shadow': return helpers.shadow();
		case 'shadowColor': return helpers.shadowColor(value);
		case 'shiftMode': return helpers.shiftMode();
		case 'showAsAction': return helpers.showAsAction();
		case 'showCancel': return helpers.showCancel();
		case 'smoothScrollOnTabClick': return helpers.smoothScrollOnTabClick();
		case 'statusBar': return helpers.statusBar();
		case 'sustainedPerformanceMode': return helpers.sustainedPerformanceMode();
		case 'swipeToClose': return helpers.swipeToClose();
		case 'tabBarHidden': return helpers.tabBarHidden();
		case 'tabGroupStyle': return helpers.tabGroupStyle();
		case 'tabsBackgroundColor': return helpers.tabsBackgroundColor(value);
		case 'tabsBackgroundSelectedColor': return helpers.tabsBackgroundSelectedColor(value);
		case 'tabsTranslucent': return helpers.tabsTranslucent();
		case 'textAlign': return helpers.textAlign();
		case 'textColor': return helpers.textColor(value);
		case 'theme': return helpers.theme();
		case 'tiMedia': return helpers.tiMedia();
		case 'tintColor': return helpers.tintColor(value);
		case 'titleAttributesColor': return helpers.titleAttributesColor(value);
		case 'titleAttributesShadow': return helpers.titleAttributesShadow();
		case 'titleAttributesShadowColor': return helpers.titleAttributesShadowColor(value);
		case 'titleColor': return helpers.titleColor(value);
		case 'touchFeedbackColor': return helpers.touchFeedbackColor(value);
		case 'transition': return helpers.transition(value);
		case 'transitionDelay': return helpers.transitionDelay(value);
		case 'transitionDuration': return helpers.transitionDuration(value);
		case 'translucent': return helpers.translucent();
		case 'useCompatPadding': return helpers.useCompatPadding();
		case 'useSpinner': return helpers.useSpinner(value);
		case 'verticalAlignment': return helpers.verticalAlignment();
		case 'viewShadowColor': return helpers.viewShadowColor(value);
		case 'width': return helpers.width(value);
		case 'windowPixelFormat': return helpers.windowPixelFormat();
		case 'windowSoftInputMode': return helpers.windowSoftInputMode();
		case 'zIndex': return helpers.zIndex(value);

		default: return helpers.customRules(value, key);
	}
}

function combineKeys(values, base, key) {
	return (values[key]) ? { ...values[key], ...values.extend[key] } : { ...base, ...values.extend[key] };
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

function readAllXMLFiles(currentDirPath, callback) {
	let files = fs.readdirSync(currentDirPath);

	files.filter(junk.not).forEach(name => {
		let filePath = path.join(currentDirPath, name);

		let stat = fs.statSync(filePath);

		if (stat.isFile()) {
			if (name.includes('xml')) {
				callback(filePath, stat);
			}
		} else if (stat.isDirectory()) {
			readAllXMLFiles(filePath, callback);
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
		case 'f7':
		case 'framework':
		case 'framework7':
			copyFramework7IconsFonts();
			break;
		case 'ti':
		case 'tabler':
		case 'tablericons':
			copyTablerIconsFonts();
			break;
		case 'bi':
		case 'bootstrap':
		case 'bootstrapicons':
			copyBootstrapIconsFonts();
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
				logger.info('FontAwesome CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			}
			break;
		case 'md':
		case 'material':
		case 'materialdesign':
			fs.copyFileSync(srcLibMD, destLibFolder + '/materialdesignicons.js');
			logger.info('Material Design CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
		case 'li':
		case 'line':
		case 'lineicons':
			fs.copyFileSync(srcLibLI, destLibFolder + '/lineicons.js');
			logger.info('LineIcons CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
		case 'bx':
		case 'box':
		case 'boxicons':
			fs.copyFileSync(srcLibBX, destLibFolder + '/boxicons.js');
			logger.info('BoxIcons CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
		case 'f7':
		case 'framework':
		case 'framework7':
			fs.copyFileSync(srcLibF7, destLibFolder + '/framework7icons.js');
			logger.info('Framework7-Icons CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
		case 'ti':
		case 'tabler':
		case 'tablericons':
			fs.copyFileSync(srcLibTI, destLibFolder + '/tablericons.js');
			logger.info('Tabler Icons CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
		case 'bi':
		case 'bootstrap':
		case 'bootstrapicons':
			fs.copyFileSync(srcLibBI, destLibFolder + '/bootstrapicons.js');
			logger.info('Bootstrap Icons CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
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
	let purgedClasses = '\n// Main styles\n';
	let tailwindFile = (fs.existsSync(customTailwindFile)) ? customTailwindFile : defaultTailwindFile;
	let tailwindClasses = fs.readFileSync(tailwindFile, 'utf8').split(/\r?\n/);

	if (`// config.js file updated on: ${getFileUpdatedDate(destConfigJSFile)}` !== tailwindClasses[6]) {
		logger.info(chalk.yellow('config.js'), 'file updated!, rebuilding tailwind.tss...');
		buildCustomTailwind('file updated!');
		tailwindClasses = fs.readFileSync(tailwindFile, 'utf8').split(/\r?\n/);
	}

	(fs.existsSync(customTailwindFile)) ? logger.info('Purging', chalk.yellow('Custom Tailwind'), 'styles...') : logger.info('Purging Default Tailwind styles...');

	let cleanUniqueClasses = [];
	let classesWithOpacityValues = [];
	let arbitraryValues = '\n// Styles with arbitrary values\n';

	uniqueClasses.forEach((className, index) => {
		let cleanClassName = cleanClassNameFn(className);

		if (cleanClassName.includes('(')) {
			let line = formatArbitraryValues(cleanClassName);
			if (line) arbitraryValues += helpers.checkPlatformAndDevice(line, className);
		} else if (helpers.checkColorClasses(cleanClassName)) {
			// Set opacity to color properties
			let decimalValue = cleanClassName.split('/')[1];
			let transparency = Math.round(decimalValue * 255 / 100).toString(16);
			if (transparency.length === 1) transparency = '0' + transparency;
			let classNameWithTransparency = uniqueClasses[index];
			let className = cleanClassName.substring(0, cleanClassName.lastIndexOf('/'));
			classesWithOpacityValues.push({ decimalValue, transparency, className, classNameWithTransparency });
		} else {
			cleanUniqueClasses.push(className);
		}
	});

	let comoArreglo = [];
	tailwindClasses.forEach(tailwindClass => {
		if (tailwindClass !== '' && !tailwindClass.includes('//')) {
			let cleanTailwindClass = `${tailwindClass.split(':')[0].replace('.', '').replace(/'/g, '').replace(/ *\[[^\]]*]/, '')}`;

			if (cleanUniqueClasses.indexOf(cleanTailwindClass) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(cleanTailwindClass)]));
			}

			if (cleanUniqueClasses.indexOf(`ios:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`ios:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`android:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`android:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`tablet:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`tablet:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`handheld:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`handheld:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`open:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`open:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`close:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`close:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`drag:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`drag:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`drop:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`drop:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`complete:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`complete:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`bounds:${cleanTailwindClass}`) > -1) {
				comoArreglo.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`bounds:${cleanTailwindClass}`)]));
			}
		}
	});

	purgedClasses += comoArreglo.join('');

	// Styles with color opacity modifiers
	if (classesWithOpacityValues.length > 0) {
		purgedClasses += '\n// Styles with color opacity modifiers\n';
		classesWithOpacityValues.forEach(opacityValue => {
			let opacityIndex = _.findIndex(tailwindClasses, line => line.startsWith(`'.${opacityValue.className}`));

			if (opacityIndex > -1) {
				let defaultHexValue;
				if (tailwindClasses[opacityIndex].includes('from')) {
					defaultHexValue = tailwindClasses[opacityIndex].match(/\#[0-9a-f]{6}/g)[1];
				} else {
					defaultHexValue = tailwindClasses[opacityIndex].match(/\#[0-9a-f]{6}/i)[0];
				}

				let classWithoutDecimalOpacity = `${tailwindClasses[opacityIndex].replace(defaultHexValue, `#${opacityValue.transparency}${defaultHexValue.substring(1)}`)}`;
				let defaultTextValue = tailwindClasses[opacityIndex].match(/'[^']*'/i)[0];
				defaultTextValue = defaultTextValue.substring(1, defaultTextValue.length);
				let finalClassName = `${classWithoutDecimalOpacity.replace(defaultTextValue, `.${defaultTextValue.substring(1, defaultTextValue.length - 1)}/${opacityValue.decimalValue}'`)}`;
				let withPlatformDeviceStyle = helpers.checkPlatformAndDevice(finalClassName, opacityValue.classNameWithTransparency);

				// !Move platform specific styles to the end of the class name
				let platformIndex = withPlatformDeviceStyle.search(/\[platform=ios\]|\[platform=android\]/i);
				if (platformIndex > -1) {
					if (withPlatformDeviceStyle.includes('[platform=ios]')) {
						withPlatformDeviceStyle = withPlatformDeviceStyle.replace('[platform=ios]', '').replace(/[^'.][^']+|1/, `$&[platform=ios]`);
					} else {
						withPlatformDeviceStyle = withPlatformDeviceStyle.replace('[platform=android]', '').replace(/[^'.][^']+|1/, `$&[platform=android]`);
					}
				}

				purgedClasses += withPlatformDeviceStyle;
			}
		});
	}

	// Add arbitrary values
	purgedClasses += (arbitraryValues !== '\n// Styles with arbitrary values\n') ? arbitraryValues : '';

	return purgedClasses;
}

function cleanClassNameFn(className) {
	return className.replace('ios:', '').replace('android:', '').replace('handheld:', '').replace('tablet:', '').replace('open:', '').replace('complete:', '').replace('close:', '').replace('complete:', '').replace('drag:', '').replace('drop:', '').replace('bounds:', '');
}

const arbitraryValuesTable = {
	'active-tint': '{ activeTintColor: {value} }',
	'active-title': '{ activeTitleColor: {value} }',
	'title-attributes': '{ titleAttributes: { color: {value} } }',
	'title-attributes-shadow': '{ titleAttributes: { shadow: { color: {value} } } }',
	'bar': '{ barColor: {value} }',
	'bg-selected': '{ backgroundSelectedColor: {value} }',
	'bg': '{ backgroundColor: {value} }',
	'border-color': '{ borderColor: {value} }',
	'border-width': '{ borderWidth: {value} }',
	'bottom': '{ bottom: {value} }',
	'cache-size': '{ cacheSize: {value} }',
	'content-h': '{ contentHeight: {value} }',
	'content-w': '{ contentWidth: {value} }',
	'content': '{ contentWidth: {value}, contentHeight: {value} }',
	'current-page': '{ currentPageIndicatorColor: {value} }',
	'delay': '{ delay: {value} }',
	'drop-shadow': '{ shadowColor: {value} } }',
	'duration': '{ duration: {value} }',
	'elevation': '{ elevation: {value} }',
	'feedback': '{ touchFeedback: true, touchFeedbackColor: {value} }',
	'font': '{ fontWeight: {value} }',
	'from': '{ backgroundGradient: { colors: [ {value1}, {value} ] } }',
	'grid-cols': '{ width: Alloy.Globals.cols_{value} }',
	'grid-rows': '{ height: Alloy.Globals.rows_{value} }',
	'h': '{ height: {value}}',
	'indicator': '{ indicatorColor: {value} }',
	'left': '{ left: {value} }',
	'm': '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
	'max-elevation': '{ maxElevation: {value} }',
	'max-scale': '{ maxZoomScale: {value} }',
	'mb': '{ bottom: {value} }',
	'min-scale': '{ minZoomScale: {value} }',
	'ml': '{ left: {value} }',
	'mr': '{ right: {value} }',
	'mt': '{ top: {value} }',
	'mx': '{ right: {value}, left: {value} }',
	'my': '{ top: {value}, bottom: {value} }',
	'nav-tint': '{ navTintColor: {value} }',
	'opacity': '{ opacity: {value} }',
	'origin': '{ anchorPoint: { x: {value}, y: {value1} } }',
	'p': '{ padding: { top: {value}, right: {value}, bottom: {value}, left: {value} } }',
	'padding': '{ paddingTop: {value}, paddingBottom: {value}, paddingLeft: {value}, paddingRight: {value} }',
	'padding-b': '{ paddingBottom: {value} }',
	'padding-bottom': '{ paddingBottom: {value} }',
	'padding-l': '{ paddingLeft: {value} }',
	'padding-left': '{ paddingLeft: {value} }',
	'padding-r': '{ paddingRight: {value} }',
	'padding-right': '{ paddingRight: {value} }',
	'padding-t': '{ paddingTop: {value} }',
	'padding-top': '{ paddingTop: {value} }',
	'padding-x': '{ paddingLeft: {value}, paddingRight: {value} }',
	'padding-y': '{ paddingTop: {value}, paddingBottom: {value} }',
	'page': '{ pageIndicatorColor: {value} }',
	'paging-alpha': '{ pagingControlAlpha: {value} }',
	'paging-color': '{ pagingControlColor: {value} }',
	'pb': '{ padding: { bottom: {value} } }',
	'pl': '{ padding: { left: {value} } }',
	'placeholder': '{ hintTextColor: {value} }',
	'pr': '{ padding: { right: {value} } }',
	'pt': '{ padding: { top: {value} } }',
	'px': '{ padding: { left: {value}, right: {value} } }',
	'py': '{ padding: { top: {value}, bottom: {value} } }',
	'repeat': '{ repeat: {value} }',
	'right': '{ right: {value} }',
	'rotate': '{ rotate: {value} }',
	'rounded-b': '{ borderRadius: [0, 0, {value}, {value}] }',
	'rounded-bl': '{ borderRadius: [0, 0, 0, {value}] }',
	'rounded-br': '{ borderRadius: [0, 0, {value}, 0] }',
	'rounded-l': '{ borderRadius: [{value}, 0, 0, {value}] }',
	'rounded-r': '{ borderRadius: [0, {value}, {value}, 0] }',
	'rounded-t': '{ borderRadius: [{value}, {value}, 0, 0] }',
	'rounded-tl': '{ borderRadius: [{value}, 0, 0, 0] }',
	'rounded-tr': '{ borderRadius: [0, {value}, 0, 0] }',
	'rounded': '{ borderRadius: {value} }',
	'shadow': '{ viewShadowColor: {value} }',
	'tabs-bg': '{ tabsBackgroundColor: {value} }',
	'tabs-bg-selected': '{ tabsBackgroundSelectedColor: {value} }',
	'text-color': '{ color: {value} }',
	'text-size': '{ font: { fontSize: {value} } }',
	'tint': '{ tint: {value}, tintColor: {value} }',
	'title': '{ titleColor: {value} }',
	'to': '{ backgroundGradient: { colors: [ {value} ] } }',
	'top': '{ top: {value} }',
	'w': '{ width: {value} }',
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
			rule = (value.includes('#') || value.includes('rgb')) ? 'text-color' : 'text-size';
		}

		if (rule === 'border') {
			rule = (value.includes('#') || value.includes('rgb')) ? 'border-color' : 'border-width';
		}

		if (rule === 'paging') {
			rule = (value.includes('#') || value.includes('rgb')) ? 'paging-color' : 'paging-alpha';
		}

		let properties = arbitraryValuesTable[rule];

		if (rule === 'from') {
			properties = _.replace(properties, new RegExp("{value1}", "g"), helpers.addTransparencyToHex(helpers.parseValue(value)));
		}

		if (rule === 'origin') {
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
function purgeFontAwesome(uniqueClasses, cleanUniqueClasses) {
	let sourceFolder = '';
	let purgedClasses = '';
	let purgingMessage = '';

	if (fs.existsSync(customFontAwesomeFile)) {
		sourceFolder = customFontAwesomeFile;
		purgedClasses = '\n// Pro/Beta Font Awesome styles\n';
		purgingMessage = `Purging ${chalk.yellow('Pro/Beta Font Awesome')} styles...')`;
	} else {
		sourceFolder = srcFontAwesomeTSSFile;
		purgedClasses = '\n// Default Font Awesome styles\n';
		purgingMessage = `Purging Default Font Awesome styles...`;
	}

	let sourceTSS = fs.readFileSync(sourceFolder, 'utf8').split(/\r?\n/);

	purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, purgingMessage, cleanUniqueClasses, ['fa', 'fat', 'fas', 'fal', 'far', 'fab', 'fa-thin', 'fa-solid', 'fa-light', 'fa-regular', 'fa-brands', 'fontawesome', 'fontawesome-thin', 'fontawesome-solid', 'fontawesome-light', 'fontawesome-regular', 'fontawesome-brands']);

	return (purgedClasses === '\n// Pro/Beta Font Awesome styles\n' || purgedClasses === '\n// Default Font Awesome styles\n') ? '' : purgedClasses;
}

//! Material Design Icons
function purgeMaterialDesign(uniqueClasses, cleanUniqueClasses) {
	let purgedClasses = '\n// Material Design Icons styles\n';

	let sourceTSS = fs.readFileSync(srcMaterialDesignIconsTSSFile, 'utf8').split(/\r?\n/);

	purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, 'Purging Material Design Icons styles...', cleanUniqueClasses, ['md', 'mdo', 'mdr', 'mds', 'mdt', '.materialdesign', '.materialdesign-round', '.materialdesign-sharp', '.materialdesign-two-tone', '.materialdesign-outlined', '.material-icons', '.material-icons-round', '.material-icons-sharp', '.material-icons-two-tone', '.material-icons-outlined']);

	return (purgedClasses === '\n// Material Design Icons styles\n') ? '' : purgedClasses;
}

//! LineIcons
function purgeLineIcons(uniqueClasses, cleanUniqueClasses) {
	let purgedClasses = '\n// LineIcons styles\n';

	let sourceTSS = fs.readFileSync(srcLineiconsFontTSSFile, 'utf8').split(/\r?\n/);

	purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, 'Purging LineIcons styles...', cleanUniqueClasses, ['li', 'lni', 'lineicons']);

	return (purgedClasses === '\n// LineIcons styles\n') ? '' : purgedClasses;
}

//! Framework7
function purgeFramework7(uniqueClasses, cleanUniqueClasses) {
	let purgedClasses = '\n// Framework7 styles\n';

	let sourceTSS = fs.readFileSync(srcFramework7FontTSSFile, 'utf8').split(/\r?\n/);

	purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, 'Purging Framework7 Icons styles...', cleanUniqueClasses, ['f7', 'f7i', 'framework7']);

	return (purgedClasses === '\n// Framework7 styles\n') ? '' : purgedClasses;
}

//! BoxIcons
function purgeBoxIcons(uniqueClasses, cleanUniqueClasses) {
	let purgedClasses = '\n// BoxIcons styles\n';

	let sourceTSS = fs.readFileSync(srcBoxIconsFontTSSFile, 'utf8').split(/\r?\n/);

	purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, 'Purging BoxIcons styles...', cleanUniqueClasses, ['bx', 'bxi', 'boxicons']);

	return (purgedClasses === '\n// BoxIcons styles\n') ? '' : purgedClasses;
}

//! TablerIcons
function purgeTablerIcons(uniqueClasses, cleanUniqueClasses) {
	let purgedClasses = '\n// Tabler Icons styles\n';

	let sourceTSS = fs.readFileSync(srcTablerIconsFontTSSFile, 'utf8').split(/\r?\n/);

	purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, 'Purging Tabler Icons styles...', cleanUniqueClasses, ['ti', 'tablericons', 'tabler']);

	return (purgedClasses === '\n// Tabler Icons styles\n') ? '' : purgedClasses;
}

//! BootstrapIcons
function purgeBootstrapIcons(uniqueClasses, cleanUniqueClasses) {
	let purgedClasses = '\n// Bootstrap Icons styles\n';

	let sourceTSS = fs.readFileSync(srcBootstrapIconsFontTSSFile, 'utf8').split(/\r?\n/);

	purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, 'Purging Bootstrap Icons styles...', cleanUniqueClasses, ['bi', 'bootstrap']);

	return (purgedClasses === '\n// Bootstrap Icons styles\n') ? '' : purgedClasses;
}

function purgeFontIcons(sourceTSS, uniqueClasses, message, cleanUniqueClasses, prefixes) {
	let purgedClasses = '';
	let soc = sourceTSS.toString();

	if (prefixes.length > 0) {
		if (cleanUniqueClasses.some(element => prefixes.includes(element))) {
			logger.info(message);
			uniqueClasses.forEach(className => {
				let cleanClassName = cleanClassNameFn(className);
				if (soc.includes(`'.${cleanClassName}'`)) {
					sourceTSS.forEach(line => {
						if (line.startsWith(`'.${cleanClassName}'`)) {
							purgedClasses += helpers.checkPlatformAndDevice(line, uniqueClasses[uniqueClasses.indexOf(className)]);
						}
					});
				}
			});
		}
	} else {
		logger.info(message);
		uniqueClasses.forEach(className => {
			let cleanClassName = cleanClassNameFn(className);
			if (soc.includes(`'.${cleanClassName}'`)) {
				sourceTSS.forEach(line => {
					if (line.startsWith(`'.${cleanClassName}'`)) {
						purgedClasses += helpers.checkPlatformAndDevice(line, uniqueClasses[uniqueClasses.indexOf(className)]);
					}
				});
			}
		});
	}

	return purgedClasses;
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

//! Soon to be deleted
// function checkIndexOf(array, line) {
// 	return array.indexOf(line) || array.indexOf(`ios:${line}`);
// }

// function includesClassName(soc, cleanClassName) {
// 	return soc.includes(`'.${cleanClassName}'`) || soc.includes(`'.${cleanClassName}[`) || soc.includes(`'#${cleanClassName}'`) || soc.includes(`'#${cleanClassName}[`) || soc.includes(`'${cleanClassName}'`) || soc.includes(`'${cleanClassName}[`);
// }

// function startsWith(line, cleanClassName) {
// 	return line.startsWith(`'.${cleanClassName}'`) || line.startsWith(`'.${cleanClassName}[`) || line.startsWith(`'#${cleanClassName}'`) || line.startsWith(`'#${cleanClassName}[`) || line.startsWith(`'${cleanClassName}'`) || line.startsWith(`'${cleanClassName}[`);
// }

function reviewThis(className) {
	let twStylesWithoyPlatformSpecificStyles = className.replace(/\[platform=ios\]/g, '').replace(/\[platform=android\]/g, '').split(/\r?\n/);
	twStylesArray[indexOfClass].replace('[platform=android]', '').replace('[platform=ios]', '')
}
