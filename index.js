'use strict';

const fs = require('fs');
const cwd = process.cwd();
const _ = require('lodash');
const junk = require('junk');
const glob = require("glob");
const path = require('path');
const chalk = require('chalk');
const convert = require('xml-js');
const readCSS = require('read-css');
const traverse = require('traverse');
const colores = require('./lib/colores').colores;
const isInstalledGlobally = require('is-installed-globally');
module.exports.colores = colores;
const purgeLabel = colores.purgeLabel;
const helpers = require(path.resolve(__dirname, './lib/helpers'));

let purgingDebug = false;

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

const projectLibFolder = cwd + '/app/lib';
const projectAppTSS = cwd + '/app/styles/app.tss';
const project_AppTSS = cwd + '/app/styles/_app.tss';
const projectAlloyJMKFile = cwd + '/app/alloy.jmk';
const projectFontsFolder = cwd + '/app/assets/fonts';
const projectFontAwesomeJS = cwd + '/app/lib/fontawesome.js';

const projectPurgeTSSFolder = cwd + '/purgetss';
const projectConfigJS = cwd + '/purgetss/config.js';
const projectTailwindTSS = cwd + '/purgetss/tailwind.tss';
const projectPurgeTSSFontsFolder = cwd + '/purgetss/fonts';
const projectFontAwesomeTSS = cwd + '/purgetss/fontawesome.tss';

// js icon modules
const srcLibFA = path.resolve(__dirname, './dist/fontawesome.js');
const srcLibF7 = path.resolve(__dirname, './dist/framework7icons.js');
const srcLibMD = path.resolve(__dirname, './dist/materialdesignicons.js');
const srcPurgeTSSLibrary = path.resolve(__dirname, './dist/purgetss.ui.js');

//
const srcTailwindTSS = path.resolve(__dirname, './dist/tailwind.tss');
//

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

const srcFontAwesomeTSSFile = path.resolve(__dirname, './dist/fontawesome.tss');
const srcFramework7FontTSSFile = path.resolve(__dirname, './dist/framework7icons.tss');
const srcMaterialDesignIconsTSSFile = path.resolve(__dirname, './dist/materialdesignicons.tss');

const srcConfigFile = path.resolve(__dirname, './lib/templates/purgetss.config.js');

const configFile = (fs.existsSync(projectConfigJS)) ? require(projectConfigJS) : require(srcConfigFile);
if (!configFile.purge) configFile.purge = { mode: 'all' };
if (!configFile.fonts) configFile.fonts = { mode: 'fileName' };
configFile.corePlugins = configFile.corePlugins ?? {};
const configOptions = (configFile.purge && configFile.purge.options) ? configFile.purge.options : false;
configOptions.widgets = configOptions.widgets ?? false;
configOptions.missing = configOptions.missing ?? false;
const srcJMKFile = (isInstalledGlobally) ? path.resolve(__dirname, './lib/templates/alloy.jmk') : path.resolve(__dirname, './lib/templates/alloy-local.jmk');

//! Interfase

//! Command: purgetss
function purgeClasses(options) {
	purgingDebug = options.debug;
	if (alloyProject()) {
		start();

		init(options);

		backupOriginalAppTss();

		let uniqueClasses = getUniqueClasses();

		let tempPurged = copyResetTemplateAnd_appTSS();

		tempPurged += purgeTailwind(uniqueClasses);

		let cleanUniqueClasses = cleanClasses(uniqueClasses);

		tempPurged += purgeFontAwesome(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeMaterialDesign(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeFramework7(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeCustomFonts(uniqueClasses, cleanUniqueClasses);

		tempPurged += processMissingClasses(tempPurged);

		saveFile(projectAppTSS, tempPurged);

		logger.file('app.tss');

		finish();

		if (!isInstalledGlobally) {
			logger.error('Please install PurgeTSS globally!');
		}
	}
}
module.exports.purgeClasses = purgeClasses;

function init(options) {
	// config file
	if (!fs.existsSync(projectConfigJS)) {
		createConfigFile();
	}

	// tailwind.tss
	if (!fs.existsSync(projectTailwindTSS) || options.all) {
		buildCustomTailwind('file created!');
	}

	// definitios file
	if (!fs.existsSync(cwd + '/purgetss/definitions.css') || options.all) {
		createDefinitionsFile();
	}

	// auto purge hook
	if (fs.existsSync(projectAlloyJMKFile)) {
		if (!fs.readFileSync(projectAlloyJMKFile, 'utf8').includes('::PurgeTSS::')) {
			addHook();
		}
	} else {
		createJMKFile();
	}
}
module.exports.init = init;

function processMissingClasses(tempPurged) {
	let unusedOrMissingClasses = '';

	if (configOptions.missing) {
		let missingClasses = findMissingClasses(tempPurged);

		if (missingClasses.length > 0) {
			unusedOrMissingClasses += '\n';
			unusedOrMissingClasses += '// Unused or unsupported classes\n';

			_.each(missingClasses, (missingClass) => {
				unusedOrMissingClasses += `// '.${missingClass}': { }\n`;
			});
		}
	}

	return unusedOrMissingClasses;
}

//! Command: watch
function watchMode(options) {
	if (alloyProject()) {
		if (fs.existsSync(projectAlloyJMKFile)) {
			//! TODO: Refactor with readline or line-reader: https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
			if (options.off) {
				removeHook();
			} else if (!fs.readFileSync(projectAlloyJMKFile, 'utf8').includes('::PurgeTSS::')) {
				addHook();
			} else if (fs.readFileSync(projectAlloyJMKFile, 'utf8').includes("//\trequire('child_process').execSync('")) {
				enableHook();
			} else {
				logger.warn(chalk.yellow('Auto-Purging hook already present!'));
			}
		} else if (!options.off) {
			createJMKFile();
		}
	} else {
		logger.warn(chalk.yellow('You can’t autorun purgetss !'));
	}
}
module.exports.watchMode = watchMode;

//! Command: copy-fonts
function copyFonts(options) {
	if (alloyProject()) {
		makeSureFolderExists(projectFontsFolder);

		if (options.vendor && typeof options.vendor === 'string') {
			let selected = _.uniq(options.vendor.replace(/ /g, '').split(','));
			_.each(selected, vendor => {
				copyFont(vendor);
			});
		} else {
			copyFont('fa');
			copyFont('md');
			copyFont('f7');
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
		makeSureFolderExists(projectLibFolder);

		if (options.vendor && typeof options.vendor === 'string') {
			let selected = _.uniq(options.vendor.replace(/ /g, '').split(','));
			_.each(selected, vendor => {
				copyFontLibrary(vendor);
			});
		} else {
			copyFontLibrary('fa');
			copyFontLibrary('md');
			copyFontLibrary('f7');
		}
	}
}
module.exports.copyFontLibraries = copyFontLibraries;

function copyModulesLibrary() {
	if (alloyProject()) {
		makeSureFolderExists(projectLibFolder);

		fs.copyFileSync(srcPurgeTSSLibrary, projectLibFolder + '/purgetss.ui.js');
		logger.info(chalk.yellow('purgetss.ui'), 'module copied to', chalk.yellow('./app/lib'), 'folder');
	}
}
module.exports.copyModulesLibrary = copyModulesLibrary;

function getFileUpdatedDate(path) {
	return fs.statSync(path).mtime;
}

function cleanClasses(uniqueClasses) {
	let cleanClassNames = [];

	uniqueClasses.forEach(classeName => {
		cleanClassNames.push(cleanClassNameFn(classeName));
	});

	return cleanClassNames;
}

//! Command: init
function createConfigFile() {
	if (alloyProject()) {
		makeSureFolderExists(projectPurgeTSSFolder);

		makeSureFolderExists(projectPurgeTSSFontsFolder);

		if (fs.existsSync(projectConfigJS)) {
			logger.warn('./purgetss/config.js', chalk.red('file already exists!'));
		} else {
			fs.copyFileSync(srcConfigFile, projectConfigJS);
			logger.file('./purgetss/config.js');
		}
	}
}

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
		createDefinitionsFile();
	}
}
module.exports.buildCustom = buildCustom;

//! Command: Build fonts.tss
function buildCustomFonts(options) {
	if (fs.existsSync(projectPurgeTSSFontsFolder)) {
		start();

		let files = getFiles(projectPurgeTSSFontsFolder).filter(file => {
			return file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.css') || file.endsWith('.TTF') || file.endsWith('.OTF') || file.endsWith('.CSS');
		});

		let fontMeta = '';
		let customFontsJS = '';
		const FontName = require('fontname');
		let tssClasses = `// Fonts TSS file generated with PurgeTSS\n// https://github.com/macCesar/purgeTSS\n`;

		_.each(files, file => {
			if (file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.TTF') || file.endsWith('.OTF')) {
				fontMeta = FontName.parse(fs.readFileSync(file))[0];

				tssClasses += processFontMeta(fontMeta);

				if (configFile.fonts.mode.toLowerCase() === 'postscriptname' || configFile.fonts.mode.toLowerCase() === 'postscript' || configFile.fonts.mode.toLowerCase() === 'ps') {
					tssClasses += `\n'.${fontMeta.postScriptName.replace(/\//g, '')}': { font: { fontFamily: '${fontMeta.postScriptName.replace(/\//g, '')}' } }\n`;
				} else {
					tssClasses += `\n'.${getFileName(file)}': { font: { fontFamily: '${fontMeta.postScriptName.replace(/\//g, '')}' } }\n`;
				}

				//! Copy Font File
				makeSureFolderExists(projectFontsFolder);
				let fontExtension = file.split('.').pop();
				fs.copyFile(file, `${projectFontsFolder}/${fontMeta.postScriptName.replace(/\//g, '')}.${fontExtension}`, err => { });
				logger.info('Copying font', `${chalk.yellow(file.split('/').pop())}...`);
			}
		});

		let oneTimeMessage = `\n// Unicode Characters\n// To use your Icon Fonts in Buttons AND Labels each class sets 'text' and 'title' properties\n`;

		_.each(files, file => {
			if (file.endsWith('.css') || file.endsWith('.CSS')) {
				tssClasses += oneTimeMessage + `\n// ${file.split('/').pop()}\n`;
				oneTimeMessage = '';

				tssClasses += processCustomFontsCSS(readCSS(file));

				//! JavaScript Module
				if (options.modules) {
					customFontsJS += processCustomFontsJS(readCSS(file), `\n\t// ${getFileName(file)}`);
				}

				// !Done processing stylesheet
				logger.info('Processing', `${chalk.yellow(file.split('/').pop())}...`);
			}
		});

		if (files.length > 0) {
			makeSureFolderExists(projectPurgeTSSFolder);

			fs.writeFileSync(cwd + '/purgetss/fonts.tss', tssClasses, err => {
				throw err;
			});

			makeSureFolderExists(projectLibFolder);
		}

		if (customFontsJS) {
			let exportIcons = fs.readFileSync(path.resolve(__dirname, './lib/templates/icon-functions.js'), 'utf8');
			exportIcons += '\nconst icons = {';
			exportIcons += customFontsJS.slice(0, -1);
			exportIcons += '\n};\n';
			exportIcons += 'exports.icons = icons;\n';

			fs.writeFileSync(projectLibFolder + '/purgetss.fonts.js', exportIcons, err => {
				throw err;
			});

			logger.info(`${chalk.yellow('./app/lib/purgetss.fonts.js')} file created!`);
		} else {
			if (fs.existsSync(projectLibFolder + '/purgetss.fonts.js')) {
				fs.unlinkSync(projectLibFolder + '/purgetss.fonts.js');
			}
		}

		if (files.length > 0) {

			createDefinitionsFile();

			console.log();
			finish(`Finished building ${chalk.yellow('fonts.tss')} in`);
		} else {
			logger.info('No fonts found in', chalk.yellow('./purgetss/fonts'), 'folder!');
		}
	} else {
		logger.info(`Add font and style files to ${chalk.yellow('./purgetss/fonts')} and run this command again!`);
	}
}
module.exports.buildCustomFonts = buildCustomFonts;

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

		fs.writeFileSync(projectFontAwesomeTSS, tssClasses, err => {
			throw err;
		});

		logger.file('./purgetss/fontawesome.tss');

		makeSureFolderExists(projectFontsFolder);

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

	return convertedTSSClasses;
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
				exportIcons += `\t'${prettifyFontName(rule.selector, 'fa')}': '\\u${rule.property}',\n`;
			}
		});

		exportIcons += '};\n';

		exportIcons += 'exports.icons = icons;\n';

		fontAwesomeContent += exportIcons;

		makeSureFolderExists(projectLibFolder);

		fs.writeFileSync(projectFontAwesomeJS, fontAwesomeContent, err => {
			throw err;
		});

		logger.file('./app/lib/fontawesome.js');
	});
}

function copyFreeFonts() {
	fs.copyFile(srcFontsFolder + '/FontAwesome6Brands-Regular.ttf', projectFontsFolder + '/FontAwesome6Brands-Regular.ttf', callback);
	fs.copyFile(srcFontsFolder + '/FontAwesome6Free-Regular.ttf', projectFontsFolder + '/FontAwesome6Free-Regular.ttf', callback);
	fs.copyFile(srcFontsFolder + '/FontAwesome6Free-Solid.ttf', projectFontsFolder + '/FontAwesome6Free-Solid.ttf', callback);

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

function copyFramework7IconsFonts() {
	// Framework7 Font
	copyFile(srcFontsFolder + '/Framework7-Icons.ttf', 'Framework7-Icons.ttf');
	logger.info('Framework7-Icons Font copied to', chalk.yellow('./app/assets/fonts'), 'folder');
}

function processCustomFontsCSS(data) {
	let rules = getRules(data);

	let processedRules = '';

	_.each(rules, rule => {
		if (rule) {
			processedRules += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`;
		}
	});

	return processedRules;
}

function processCustomFontsJS(data, fontFamily = '') {
	let rules = getRules(data);

	let exportIcons = '\n';

	let thePrefix = findPrefix(rules);

	_.each(rules, rule => {
		if (rule) {
			exportIcons += `\t\t'${prettifyFontName(rule.selector.replace('.', ''), thePrefix)}': '\\u${rule.property}',\n`;
		}
	});

	if (thePrefix === undefined) {
		thePrefix = fontFamily;
	}

	return `${fontFamily}\n\t'${_.camelCase(thePrefix)}': {${exportIcons}\t},`;
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

function getFiles(dir) {
	return fs.readdirSync(dir).flatMap((item) => {
		const path = `${dir}/${item}`;
		if (fs.statSync(path).isDirectory()) {
			return getFiles(path);
		}

		return path;
	});
}

function getFileName(file) {
	return file.split('/').pop().split('.').shift().replace(/ /g, '-').toLowerCase();
}

function getRules(data) {
	let rules = _.map(data.stylesheet.rules, rule => {
		if (rule.type === 'rule' && rule.declarations[0].property === 'content' && rule.selectors[0].includes('before')) {
			return {
				'selector': '.' + rule.selectors[0].replace('.', '').replace('::before', '').replace(':before', ''),
				'property': ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '').replace('\'\\', '').replace('\'', '')).slice(-4)
			};
		}
	}).filter(rule => rule);

	return rules;
}

function findPrefix(rules) {
	let arrayOfRules = rules.map(function(item) {
		return item.selector.replace('.', '').split('-');
	});

	let firstPrefix = '';
	let firstCounter = 0;
	let secondPrefix = '';
	let secondCounter = 0;
	let thirdPrefix = '';
	let thirdCounter = 0;

	_.each(arrayOfRules, item => {
		if (item[0] != firstPrefix) {
			firstPrefix = item[0];
			firstCounter++;
		}
		if (item.length > 1 && secondPrefix != item[1]) {
			secondPrefix = item[1];
			secondCounter++;
		}
		if (item.length > 2 && thirdPrefix != item[2]) {
			thirdPrefix = item[2];
			thirdCounter++;
		}
	});

	if (firstCounter == 1 && secondCounter == 1 && thirdCounter == 1) {
		return `${firstPrefix}-${secondPrefix}-${thirdPrefix}`;
	} else if (firstCounter == 1 && secondCounter == 1) {
		return `${firstPrefix}-${secondPrefix}`;
	} else if (firstCounter == 1) {
		return `${firstPrefix}`;
	};
}

//! Purge Custom Fonts
function purgeCustomFonts(uniqueClasses, cleanUniqueClasses) {
	if (fs.existsSync(cwd + '/purgetss/fonts.tss')) {
		let purgedClasses = '\n// Custom Fonts styles\n';

		purgedClasses += purgeFontIcons(cwd + '/purgetss/fonts.tss', uniqueClasses, 'Purging Custom Fonts styles...', cleanUniqueClasses, []);

		return (purgedClasses === '\n// Custom Fonts styles\n') ? '' : purgedClasses;
	}

	return '';
}

function prettifyFontName(str, prefix) {
	let temp = str.replace(/_/g, '-').replace(prefix, '').replace(/\s/g, '').split('-');

	let withoutPrefix = [];

	let i = 1;
	if (prefix === undefined) {
		i = 0;
	}

	for (i; i < temp.length; i++) {
		withoutPrefix.push(temp[i].charAt(0).toUpperCase() + temp[i].slice(1));
	}

	let pretty = withoutPrefix.join('').replace(':', '');
	return pretty.replace(/^.{1}/g, pretty[0].toLowerCase());
};

//! Helper Functions
function findMissingClasses(tempPurged) {

	//! Get Views from App - Minus `app.tss`
	_.each(getFiles(cwd + '/app/styles').filter(file => file.endsWith('.tss') && !file.endsWith('app.tss') && !file.endsWith('_app.tss')), file => {
		tempPurged += '\n' + fs.readFileSync(file, 'utf8');
	});

	//! Get Views from Widgets  ( Experimental )
	if (configOptions.widgets) {
		_.each(getFiles(cwd + '/app/widgets').filter(file => file.endsWith('.tss')), file => {
			tempPurged += '\n' + fs.readFileSync(file, 'utf8');
		});
	}

	//! Get Views from Themes  ( Experimental )
	if (fs.existsSync(cwd + '/app/themes/')) {
		_.each(getFiles(cwd + '/app/themes').filter(file => file.endsWith('.tss')), file => {
			tempPurged += '\n' + fs.readFileSync(file, 'utf8');
		});
	}

	if (configOptions.safelist) {
		_.each(configOptions.safelist, safe => {
			tempPurged += safe + '\n';
		})
	}

	return getClassesOnlyFromXMLFiles().filter(item => !tempPurged.includes(item));
}

function addHook() {
	logger.warn(chalk.green('Adding Auto-Purging hook!'));
	let originalJMKFile = fs.readFileSync(projectAlloyJMKFile, 'utf8');

	if (originalJMKFile.includes('pre:compile')) {
		let updatedJMKFile = [];

		originalJMKFile.split(/\r?\n/).forEach((line) => {
			if (line.includes('pre:compile')) {
				let execCommand = "";

				if (__dirname.includes('alloy')) {
					execCommand = 'alloy purgetss';
				} else if (isInstalledGlobally) {
					execCommand = 'purgetss';
				} else {
					execCommand = 'node node_modules/purgetss/bin/purgetss';
				};

				line += `\n\trequire('child_process').execSync('${execCommand}', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));`;
			}
			updatedJMKFile.push(line);
		});

		saveFile(projectAlloyJMKFile, updatedJMKFile.join("\n"));
	} else {
		fs.appendFileSync(projectAlloyJMKFile, '\n' + fs.readFileSync(srcJMKFile, 'utf8'));
	}
}

function removeHook() {
	let updatedJMKFile = [];
	let originalJMKFile = fs.readFileSync(projectAlloyJMKFile, 'utf8');
	let purgeCmdPresent = (originalJMKFile.includes('::PurgeTSS::'));

	if (purgeCmdPresent) {
		originalJMKFile.split(/\r?\n/).forEach((line) => {
			if (!line.includes("::PurgeTSS::")) {
				updatedJMKFile.push(line);
			} else if (!line.includes("//")) {
				updatedJMKFile.push(`\t//${line}`);
				logger.warn(chalk.yellow('Auto-Purging hook disabled!'));
			} else {
				logger.warn(chalk.red('Auto-Purging hook removed!'));
				// logger.warn(chalk.red('It will be added the next time `PurgeTSS` runs!'));
			}
		});

		saveFile(projectAlloyJMKFile, updatedJMKFile.join("\n"));
	}
}

function enableHook() {
	let updatedJMKFile = [];

	let originalJMKFile = fs.readFileSync(projectAlloyJMKFile, 'utf8');

	originalJMKFile.split(/\r?\n/).forEach((line) => {
		if (line.includes("::PurgeTSS::")) {
			logger.warn(chalk.green('Auto-Purging hook enabled!'));
			line = line.replace(/\/\/\t/g, "");
		}

		updatedJMKFile.push(line);

		saveFile(projectAlloyJMKFile, updatedJMKFile.join("\n"));
	});
}

function initIfNotConfig() {
	if (!fs.existsSync(projectConfigJS)) {
		createConfigFile();
	}
}

function makeSureFolderExists(folder) {
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}
}

function copyFile(src, dest) {
	if (fs.existsSync(src)) {
		// if (!fs.existsSync(`${projectFontsFolder}/${dest}`)) {
		fs.copyFile(src, `${projectFontsFolder}/${dest}`, callback);
		return true;
		// }
	}
}

function getViewPaths() {
	let viewPaths = [];

	//! Parse Views from App
	viewPaths.push(...glob.sync(cwd + '/app/views/**/*.xml'));

	//! Parse Views from Widgets  ( Experimental )
	if (configOptions.widgets) {
		viewPaths.push(...glob.sync(cwd + '/app/widgets/**/views/*.xml'));
	}

	//! Parse Views from Themes  ( Experimental )
	if (fs.existsSync(cwd + '/app/themes/')) {
		viewPaths.push(...glob.sync(cwd + '/app/themes/**/views/*.xml'));
	}

	return viewPaths;
}

function getClassesOnlyFromXMLFiles() {
	let viewPaths = getViewPaths();

	let allClasses = [];
	_.each(viewPaths, viewPath => {
		allClasses.push(extractOnlyClasses(fs.readFileSync(viewPath, 'utf8'), viewPath));
	});

	let uniqueClasses = [];
	_.each(_.uniq(_.flattenDeep(allClasses)).sort(), uniqueClass => {
		if (filterCharacters(uniqueClass)) {
			uniqueClasses.push(uniqueClass);
		}
	});

	return uniqueClasses.sort();
}

function getUniqueClasses() {
	localStart();

	let viewPaths = getViewPaths();

	let allClasses = [];
	_.each(viewPaths, viewPath => {
		let file = fs.readFileSync(viewPath, 'utf8');
		if (file) {
			allClasses.push((configFile.purge.mode === 'all') ? file.match(/[^<>"'`\s]*[^<>"'`\s:]/g) : extractClasses(file, viewPath));
		}
	});

	if (configOptions.safelist) {
		_.each(configOptions.safelist, safe => {
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

	localFinish('Get Unique Classes');

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
		!uniqueClass.endsWith('.') &&
		!uniqueClass.endsWith('/');
}

//! Build Custom Tailwind ( Main )
function buildCustomTailwind(message = 'file created!') {
	const defaultColors = require('tailwindcss/colors');
	const defaultTheme = require('tailwindcss/defaultTheme');
	const defaultThemeWidth = defaultTheme.width({ theme: () => (defaultTheme.spacing) });
	const defaultThemeHeight = defaultTheme.height({ theme: () => (defaultTheme.spacing) });

	removeDeprecatedColors(defaultColors);

	// !Prepare values
	configFile.theme.extend = configFile.theme.extend ?? {};

	let tiResets = { full: '100%' };

	let allWidthsCombined = (configFile.theme.spacing)
		? { ...configFile.theme.spacing, ...tiResets }
		: { ...defaultThemeWidth };
	let allHeightsCombined = (configFile.theme.spacing)
		? { ...configFile.theme.spacing, ...tiResets }
		: { ...defaultThemeHeight };
	let allSpacingCombined = (configFile.theme.spacing)
		? { ...configFile.theme.spacing, ...tiResets }
		: { ...defaultThemeWidth, ...defaultThemeHeight };

	let overwritten = {
		width: configFile.theme.width ?? allWidthsCombined,
		height: configFile.theme.height ?? allHeightsCombined,
		spacing: configFile.theme.spacing ?? allSpacingCombined,
		colors: configFile.theme.colors ?? { transparent: 'transparent', ...defaultColors },
	}

	//! Remove unnecessary values
	removeFitMaxMin(overwritten);

	let base = {
		colors: {},
		spacing: {},
		width: {},
		height: {},
		columns: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
		delay: { 0: '0ms', 25: '25ms', 50: '50ms', 250: '250ms', 350: '350ms', 400: '400ms', 450: '450ms', 600: '600ms', 800: '800ms', 900: '900ms', 2000: '2000ms', 3000: '3000ms', 4000: '4000ms', 5000: '5000ms' }
	};

	_.merge(base.colors, overwritten.colors, configFile.theme.extend.colors);
	_.merge(base.spacing, overwritten.spacing, configFile.theme.extend.spacing);
	_.merge(base.width, overwritten.spacing, configFile.theme.extend.spacing, overwritten.width, configFile.theme.extend.width);
	_.merge(base.height, overwritten.spacing, configFile.theme.extend.spacing, overwritten.height, configFile.theme.extend.height);

	fixPercentages(base.width);
	fixPercentages(base.height);
	fixPercentages(base.spacing);

	let configThemeFile = {};
	//! Process custom Window, View and ImageView
	configThemeFile.Window = (configFile.theme.Window && configFile.theme.Window.apply)
		? _.merge({ apply: configFile.theme.Window.apply }, configFile.theme.Window)
		: _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window);

	configThemeFile.ImageView = (configFile.theme.ImageView && configFile.theme.ImageView.apply)
		? _.merge({ apply: configFile.theme.ImageView.apply }, { ios: { hires: true } }, configFile.theme.ImageView)
		: _.merge({ ios: { hires: true } }, configFile.theme.ImageView);

	configThemeFile.View = (configFile.theme.View && configFile.theme.View.apply)
		? _.merge({ apply: configFile.theme.View.apply }, configFile.theme.View)
		: _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View);

	let defaultBorderRadius = (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing };

	//! Width, height and margin properties
	configThemeFile.sizingProperties = {};
	configThemeFile.height = base.height;
	configThemeFile.width = base.width;
	configThemeFile.margin = combineKeys(configFile.theme, base.spacing, 'margin');
	configThemeFile.marginAlternate = combineKeys(configFile.theme, base.spacing, 'margin');

	//! Properties with constant values
	configThemeFile.constantProperties = {};
	// configThemeFile.audioStreamType = {};
	// configThemeFile.category = {};
	configThemeFile.accessibilityHidden = {};
	configThemeFile.accessoryType = {};
	configThemeFile.activeIconIsMask = {};
	configThemeFile.activityEnterTransition = {};
	configThemeFile.activityExitTransition = {};
	configThemeFile.activityIndicatorStyle = {};
	configThemeFile.activityReenterTransition = {};
	configThemeFile.activityReturnTransition = {};
	configThemeFile.activitySharedElementEnterTransition = {};
	configThemeFile.activitySharedElementExitTransition = {};
	configThemeFile.activitySharedElementReenterTransition = {};
	configThemeFile.activitySharedElementReturnTransition = {};
	configThemeFile.alertDialogStyle = {};
	configThemeFile.allowsBackForwardNavigationGestures = {};
	configThemeFile.allowsLinkPreview = {};
	configThemeFile.allowsMultipleSelectionDuringEditing = {};
	configThemeFile.allowsMultipleSelectionInteraction = {};
	configThemeFile.allowsSelection = {};
	configThemeFile.allowsSelectionDuringEditing = {};
	configThemeFile.allowUserCustomization = {};
	configThemeFile.anchorPoint = {};
	configThemeFile.autoAdjustScrollViewInsets = {};
	configThemeFile.autocapitalization = {};
	configThemeFile.autocorrect = {};
	configThemeFile.autofillType = {};
	configThemeFile.autoLink = {};
	configThemeFile.autoreverse = {};
	configThemeFile.autorotate = {};
	configThemeFile.backgroundBlendMode = {};
	configThemeFile.backgroundLinearGradient = {};
	configThemeFile.backgroundRadialGradient = {};
	configThemeFile.backgroundRepeat = {};
	configThemeFile.borderStyle = {};
	configThemeFile.bubbleParent = {};
	configThemeFile.buttonStyle = {};
	configThemeFile.cacheMode = {};
	configThemeFile.cachePolicy = {};
	configThemeFile.calendarViewShown = {};
	configThemeFile.canCancelEvents = {};
	configThemeFile.cancelable = {};
	configThemeFile.canceledOnTouchOutside = {};
	configThemeFile.canDelete = {};
	configThemeFile.canEdit = {};
	configThemeFile.canInsert = {};
	configThemeFile.canMove = {};
	configThemeFile.canScroll = {};
	configThemeFile.caseInsensitiveSearch = {};
	configThemeFile.checkable = {};
	configThemeFile.clearButtonMode = {};
	configThemeFile.clearOnEdit = {};
	configThemeFile.clipMode = {};
	configThemeFile.constraint = {};
	configThemeFile.contentHeightAndWidth = {};
	configThemeFile.curve = {};
	configThemeFile.datePickerStyle = {};
	configThemeFile.defaultItemTemplate = {};
	configThemeFile.dimBackgroundForSearch = {};
	configThemeFile.disableBounce = {};
	configThemeFile.disableContextMenu = {};
	configThemeFile.displayCaps = {};
	configThemeFile.displayHomeAsUp = {};
	configThemeFile.draggingType = {};
	configThemeFile.drawerIndicatorEnabled = {};
	configThemeFile.drawerLockMode = {};
	configThemeFile.dropShadow = {};
	configThemeFile.duration = {};
	configThemeFile.editable = {};
	configThemeFile.editing = {};
	configThemeFile.ellipsize = {};
	configThemeFile.enableCopy = {};
	configThemeFile.enabled = {};
	configThemeFile.enableJavascriptInterface = {};
	configThemeFile.enableReturnKey = {};
	configThemeFile.enableZoomControls = {};
	configThemeFile.exitOnClose = {};
	configThemeFile.extendBackground = {};
	configThemeFile.extendEdges = {};
	configThemeFile.extendSafeArea = {};
	configThemeFile.fastScroll = {};
	configThemeFile.filterAnchored = {};
	configThemeFile.filterAttribute = {};
	configThemeFile.filterCaseInsensitive = {};
	configThemeFile.filterTouchesWhenObscured = {};
	configThemeFile.flags = {};
	configThemeFile.flagSecure = {};
	configThemeFile.flip = {};
	configThemeFile.focusable = {};
	configThemeFile.fontStyle = {};
	configThemeFile.footerDividersEnabled = {};
	configThemeFile.format24 = {};
	configThemeFile.fullscreen = {};
	configThemeFile.gravity = {};
	configThemeFile.gridColumnsRowsStartEnd = {};
	configThemeFile.gridFlow = {};
	configThemeFile.gridSystem = {};
	configThemeFile.hasCheck = {};
	configThemeFile.hasChild = {};
	configThemeFile.hasDetail = {};
	configThemeFile.headerDividersEnabled = {};
	configThemeFile.hiddenBehavior = {};
	configThemeFile.hideLoadIndicator = {};
	configThemeFile.hidesBackButton = {};
	configThemeFile.hidesBarsOnSwipe = {};
	configThemeFile.hidesBarsOnTap = {};
	configThemeFile.hidesBarsWhenKeyboardAppears = {};
	configThemeFile.hideSearchOnSelection = {};
	configThemeFile.hideShadow = {};
	configThemeFile.hidesSearchBarWhenScrolling = {};
	configThemeFile.hintType = {};
	configThemeFile.hires = {};
	configThemeFile.homeButtonEnabled = {};
	configThemeFile.homeIndicatorAutoHidden = {};
	configThemeFile.horizontalMargin = {};
	configThemeFile.horizontalWrap = {};
	configThemeFile.html = {};
	configThemeFile.icon = {};
	configThemeFile.iconified = {};
	configThemeFile.iconifiedByDefault = {};
	configThemeFile.iconIsMask = {};
	configThemeFile.ignoreSslError = {};
	configThemeFile.imageTouchFeedback = {};
	configThemeFile.includeFontPadding = {};
	configThemeFile.includeOpaqueBars = {};
	configThemeFile.inputType = {};
	configThemeFile.items = {};
	configThemeFile.keepScreenOn = {};
	configThemeFile.keepSectionsInSearch = {};
	configThemeFile.keyboardAppearance = {};
	configThemeFile.keyboardDismissMode = {};
	configThemeFile.keyboardDisplayRequiresUserAction = {};
	configThemeFile.keyboardType = {};
	configThemeFile.largeTitleDisplayMode = {};
	configThemeFile.largeTitleEnabled = {};
	configThemeFile.layout = {};
	configThemeFile.lazyLoadingEnabled = {};
	configThemeFile.leftButtonMode = {};
	configThemeFile.leftDrawerLockMode = {};
	configThemeFile.lightTouchEnabled = {};
	configThemeFile.listViewStyle = {};
	configThemeFile.location = {};
	configThemeFile.loginKeyboardType = {};
	configThemeFile.loginReturnKeyType = {};
	configThemeFile.mixedContentMode = {};
	configThemeFile.modal = {};
	configThemeFile.moveable = {};
	configThemeFile.moving = {};
	configThemeFile.nativeSpinner = {};
	configThemeFile.navBarHidden = {};
	configThemeFile.navigationMode = {};
	configThemeFile.orientationModes = {};
	configThemeFile.overlayEnabled = {};
	configThemeFile.overrideCurrentAnimation = {};
	configThemeFile.overScrollMode = {};
	configThemeFile.pagingControlOnTop = {};
	configThemeFile.passwordKeyboardType = {};
	configThemeFile.passwordMask = {};
	configThemeFile.pickerType = {};
	configThemeFile.placement = {};
	configThemeFile.pluginState = {};
	configThemeFile.preventCornerOverlap = {};
	configThemeFile.preventDefaultImage = {};
	configThemeFile.previewActionStyle = {};
	configThemeFile.progressBarStyle = {};
	configThemeFile.progressIndicatorType = {};
	configThemeFile.pruneSectionsOnEdit = {};
	configThemeFile.requestedOrientation = {};
	configThemeFile.resultsSeparatorStyle = {};
	configThemeFile.returnKeyType = {};
	configThemeFile.reverse = {};
	configThemeFile.rightButtonMode = {};
	configThemeFile.rightDrawerLockMode = {};
	configThemeFile.scalesPageToFit = {};
	configThemeFile.scrollable = {};
	configThemeFile.scrollIndicators = {};
	configThemeFile.scrollIndicatorStyle = {};
	configThemeFile.scrollingEnabled = {};
	configThemeFile.scrollsToTop = {};
	configThemeFile.scrollType = {};
	configThemeFile.searchAsChild = {};
	configThemeFile.searchBarStyle = {};
	configThemeFile.searchHidden = {};
	configThemeFile.selectionGranularity = {};
	configThemeFile.selectionOpens = {};
	configThemeFile.selectionStyle = {};
	configThemeFile.separatorStyle = {};
	configThemeFile.shiftMode = {};
	configThemeFile.showAsAction = {};
	configThemeFile.showBookmark = {};
	configThemeFile.showCancel = {};
	configThemeFile.showHorizontalScrollIndicator = {};
	configThemeFile.showPagingControl = {};
	configThemeFile.showSearchBarInNavBar = {};
	configThemeFile.showSelectionCheck = {};
	configThemeFile.showUndoRedoActions = {};
	configThemeFile.showVerticalScrollIndicator = {};
	configThemeFile.smoothScrollOnTabClick = {};
	configThemeFile.statusBarStyle = {};
	configThemeFile.submitEnabled = {};
	configThemeFile.suppressReturn = {};
	configThemeFile.sustainedPerformanceMode = {};
	configThemeFile.swipeToClose = {};
	configThemeFile.switchStyle = {};
	configThemeFile.systemButton = {};
	configThemeFile.tabBarHidden = {};
	configThemeFile.tabbedBarStyle = {};
	configThemeFile.tabGroupStyle = {};
	configThemeFile.tableViewStyle = {};
	configThemeFile.tabsTranslucent = {};
	configThemeFile.textAlign = {};
	configThemeFile.theme = {};
	configThemeFile.tiMedia = {};
	configThemeFile.titleAttributesShadow = {};
	configThemeFile.toolbarEnabled = {};
	configThemeFile.touchEnabled = {};
	configThemeFile.touchFeedback = {};
	configThemeFile.transition = {};
	configThemeFile.translucent = {};
	configThemeFile.useCompatPadding = {};
	configThemeFile.useSpinner = {};
	configThemeFile.verticalAlign = {};
	configThemeFile.verticalBounce = {};
	configThemeFile.verticalMargin = {};
	configThemeFile.viewShadow = {};
	configThemeFile.visible = {};
	configThemeFile.willHandleTouches = {};
	configThemeFile.willScrollOnStatusTap = {};
	configThemeFile.windowPixelFormat = {};
	configThemeFile.windowSoftInputMode = {};
	configThemeFile.wobble = {};

	//! Configurable properties
	configThemeFile.configurableProperties = {};
	configThemeFile.activeTab = combineKeys(configFile.theme, base.columns, 'activeTab');
	configThemeFile.backgroundLeftCap = combineKeys(configFile.theme, base.spacing, 'backgroundLeftCap');
	configThemeFile.backgroundPaddingBottom = combineKeys(configFile.theme, base.height, 'backgroundPaddingBottom');
	configThemeFile.backgroundPaddingLeft = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingLeft');
	configThemeFile.backgroundPaddingRight = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingRight');
	configThemeFile.backgroundPaddingTop = combineKeys(configFile.theme, base.height, 'backgroundPaddingTop');
	configThemeFile.backgroundTopCap = combineKeys(configFile.theme, base.spacing, 'backgroundTopCap');
	configThemeFile.borderRadius = combineKeys(configFile.theme, defaultBorderRadius, 'borderRadius');
	configThemeFile.borderWidth = combineKeys(configFile.theme, defaultTheme.borderWidth, 'borderWidth');
	configThemeFile.bottomNavigation = combineKeys(configFile.theme, base.spacing, 'bottomNavigation');
	configThemeFile.cacheSize = combineKeys(configFile.theme, base.columns, 'cacheSize');
	configThemeFile.columnCount = combineKeys(configFile.theme, base.columns, 'columnCount');
	configThemeFile.contentHeight = combineKeys(configFile.theme, base.height, 'contentHeight');
	configThemeFile.contentWidth = combineKeys(configFile.theme, base.width, 'contentWidth');
	configThemeFile.countDownDuration = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDuration }, 'countDownDuration');
	configThemeFile.elevation = combineKeys(configFile.theme, base.spacing, 'elevation');
	configThemeFile.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily');
	configThemeFile.fontSize = combineKeys(configFile.theme, defaultTheme.fontSize, 'fontSize');
	configThemeFile.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight');
	configThemeFile.gap = combineKeys(configFile.theme, base.spacing, 'margin');
	configThemeFile.indentionLevel = combineKeys(configFile.theme, base.spacing, 'indentionLevel');
	configThemeFile.keyboardToolbarHeight = combineKeys(configFile.theme, base.height, 'keyboardToolbarHeight');
	configThemeFile.leftButtonPadding = combineKeys(configFile.theme, base.spacing, 'leftButtonPadding');
	configThemeFile.leftWidth = combineKeys(configFile.theme, base.width, 'leftWidth');
	configThemeFile.lines = combineKeys(configFile.theme, base.columns, 'lines');
	configThemeFile.maxElevation = combineKeys(configFile.theme, base.spacing, 'maxElevation');
	configThemeFile.maxLines = combineKeys(configFile.theme, base.columns, 'maxLines');
	configThemeFile.maxRowHeight = combineKeys(configFile.theme, base.height, 'maxRowHeight');
	configThemeFile.maxZoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'maxZoomScale');
	configThemeFile.minimumFontSize = combineKeys(configFile.theme, defaultTheme.fontSize, 'minimumFontSize');
	configThemeFile.minRowHeight = combineKeys(configFile.theme, base.height, 'minRowHeight');
	configThemeFile.minZoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'minZoomScale');
	configThemeFile.offsets = combineKeys(configFile.theme, base.height, 'offsets');
	configThemeFile.opacity = combineKeys(configFile.theme, defaultTheme.opacity, 'opacity');
	configThemeFile.padding = combineKeys(configFile.theme, base.spacing, 'padding');
	configThemeFile.pagingControlAlpha = combineKeys(configFile.theme, defaultTheme.opacity, 'pagingControlAlpha');
	configThemeFile.pagingControlHeight = combineKeys(configFile.theme, base.height, 'pagingControlHeight');
	configThemeFile.pagingControlTimeout = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'pagingControlTimeout');
	configThemeFile.repeat = combineKeys(configFile.theme, base.columns, 'repeat');
	configThemeFile.repeatCount = combineKeys(configFile.theme, base.columns, 'repeatCount');
	configThemeFile.rightButtonPadding = combineKeys(configFile.theme, base.spacing, 'rightButtonPadding');
	configThemeFile.rightWidth = combineKeys(configFile.theme, base.width, 'rightWidth');
	configThemeFile.rotate = combineKeys(configFile.theme, defaultTheme.rotate, 'rotate');
	configThemeFile.rowCount = combineKeys(configFile.theme, base.columns, 'rowCount');
	configThemeFile.rowHeight = combineKeys(configFile.theme, base.height, 'rowHeight');
	configThemeFile.scale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'scale');
	configThemeFile.sectionHeaderTopPadding = combineKeys(configFile.theme, base.height, 'sectionHeaderTopPadding');
	configThemeFile.separatorHeight = combineKeys(configFile.theme, base.height, 'separatorHeight');
	configThemeFile.shadowRadius = combineKeys(configFile.theme, base.spacing, 'shadowRadius');
	configThemeFile.timeout = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'timeout');
	configThemeFile.transitionDelay = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'transitionDelay');
	configThemeFile.transitionDuration = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDuration }, 'transitionDuration');
	configThemeFile.zIndex = combineKeys(configFile.theme, defaultTheme.zIndex, 'zIndex');
	configThemeFile.zoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'zoomScale');

	//! Color related properties
	configThemeFile.colorProperties = {};
	configThemeFile.activeTintColor = combineKeys(configFile.theme, base.colors, 'activeTintColor');
	configThemeFile.activeTitleColor = combineKeys(configFile.theme, base.colors, 'activeTitleColor');
	configThemeFile.backgroundColor = combineKeys(configFile.theme, base.colors, 'backgroundColor');
	configThemeFile.backgroundDisabledColor = combineKeys(configFile.theme, base.colors, 'backgroundDisabledColor');
	configThemeFile.backgroundFocusedColor = combineKeys(configFile.theme, base.colors, 'backgroundFocusedColor');
	configThemeFile.backgroundGradient = combineKeys(configFile.theme, base.colors, 'backgroundGradient');
	configThemeFile.backgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'backgroundSelectedColor');
	configThemeFile.backgroundSelectedGradient = combineKeys(configFile.theme, base.colors, 'backgroundSelectedGradient');
	configThemeFile.badgeColor = combineKeys(configFile.theme, base.colors, 'badgeColor');
	configThemeFile.barColor = combineKeys(configFile.theme, base.colors, 'barColor');
	configThemeFile.borderColor = combineKeys(configFile.theme, base.colors, 'borderColor');
	configThemeFile.currentPageIndicatorColor = combineKeys(configFile.theme, base.colors, 'currentPageIndicatorColor');
	configThemeFile.dateTimeColor = combineKeys(configFile.theme, base.colors, 'dateTimeColor');
	configThemeFile.disabledColor = combineKeys(configFile.theme, base.colors, 'disabledColor');
	configThemeFile.highlightedColor = combineKeys(configFile.theme, base.colors, 'highlightedColor');
	configThemeFile.hintTextColor = combineKeys(configFile.theme, base.colors, 'hintTextColor');
	configThemeFile.imageTouchFeedbackColor = combineKeys(configFile.theme, base.colors, 'imageTouchFeedbackColor');
	configThemeFile.indicatorColor = combineKeys(configFile.theme, base.colors, 'indicatorColor');
	configThemeFile.keyboardToolbarColor = combineKeys(configFile.theme, base.colors, 'keyboardToolbarColor');
	configThemeFile.navTintColor = combineKeys(configFile.theme, base.colors, 'navTintColor');
	configThemeFile.onTintColor = combineKeys(configFile.theme, base.colors, 'onTintColor');
	configThemeFile.pageIndicatorColor = combineKeys(configFile.theme, base.colors, 'pageIndicatorColor');
	configThemeFile.pagingControlColor = combineKeys(configFile.theme, base.colors, 'pagingControlColor');
	configThemeFile.placeholder = combineKeys(configFile.theme, base.colors, 'placeholder');
	configThemeFile.pullBackgroundColor = combineKeys(configFile.theme, base.colors, 'pullBackgroundColor');
	configThemeFile.resultsBackgroundColor = combineKeys(configFile.theme, base.colors, 'resultsBackgroundColor');
	configThemeFile.resultsSeparatorColor = combineKeys(configFile.theme, base.colors, 'resultsSeparatorColor');
	configThemeFile.selectedButtonColor = combineKeys(configFile.theme, base.colors, 'selectedButtonColor');
	configThemeFile.selectedColor = combineKeys(configFile.theme, base.colors, 'selectedColor');
	configThemeFile.selectedSubtitleColor = combineKeys(configFile.theme, base.colors, 'selectedSubtitleColor');
	configThemeFile.selectedTextColor = combineKeys(configFile.theme, base.colors, 'selectedTextColor');
	configThemeFile.separatorColor = combineKeys(configFile.theme, base.colors, 'separatorColor');
	configThemeFile.shadowColor = combineKeys(configFile.theme, base.colors, 'shadowColor');
	configThemeFile.subtitleColor = combineKeys(configFile.theme, base.colors, 'subtitleColor');
	configThemeFile.tabsBackgroundColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundColor');
	configThemeFile.tabsBackgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundSelectedColor');
	configThemeFile.textColor = combineKeys(configFile.theme, base.colors, 'textColor');
	configThemeFile.thumbTintColor = combineKeys(configFile.theme, base.colors, 'thumbTintColor');
	configThemeFile.tintColor = combineKeys(configFile.theme, base.colors, 'tintColor');
	configThemeFile.titleAttributesColor = combineKeys(configFile.theme, base.colors, 'titleAttributesColor');
	configThemeFile.titleAttributesShadowColor = combineKeys(configFile.theme, base.colors, 'titleAttributesShadowColor');
	configThemeFile.titleColor = combineKeys(configFile.theme, base.colors, 'titleColor');
	configThemeFile.titleTextColor = combineKeys(configFile.theme, base.colors, 'titleTextColor');
	configThemeFile.touchFeedbackColor = combineKeys(configFile.theme, base.colors, 'touchFeedbackColor');
	configThemeFile.trackTintColor = combineKeys(configFile.theme, base.colors, 'trackTintColor');
	configThemeFile.viewShadowColor = combineKeys(configFile.theme, base.colors, 'viewShadowColor');

	// !Some final cleanup
	delete configFile.theme.extend;
	delete configFile.theme.colors;
	delete configFile.theme.spacing;

	if (!Object.keys(configThemeFile.fontFamily).length) {
		delete configThemeFile.fontFamily;
		delete configFile.theme.fontFamily;
	}

	// convert Object to Array
	let corePlugins = Array.isArray(configFile.corePlugins) ? configFile.corePlugins : Object.keys(configFile.corePlugins).map(key => key);
	// !Delete corePlugins specified in the config file
	_.each(corePlugins, value => {
		delete configThemeFile[value];
		delete configFile.theme[value];
	});

	let tailwindStyles = fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/template.tss'), 'utf8');
	tailwindStyles += fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/custom-template.tss'), 'utf8');
	tailwindStyles += (fs.existsSync(projectConfigJS)) ? `// config.js file updated on: ${getFileUpdatedDate(projectConfigJS)}\n` : `// default config.js file\n`;

	_.each(configThemeFile, (value, key) => {
		delete configFile.theme[key];
	});

	if (Object.keys(configFile.theme).length) {
		tailwindStyles += '\n// Custom Styles\n';
		_.each(configFile.theme, (value, key) => {
			tailwindStyles += helperToBuildCustomTailwindClasses(key, value);
		});
	}

	tailwindStyles += '\n// Resets\n';

	let distributionFolder = !fs.existsSync(projectConfigJS);

	if (distributionFolder) {
		var destinationFolder = path.resolve(__dirname, './dist/glossary/');
		makeSureFolderExists(destinationFolder);
	}

	let menuPosition = 1;
	_.each(configThemeFile, (value, key) => {
		if (key.includes('Properties') && distributionFolder) {
			destinationFolder = path.resolve(__dirname, './dist/glossary/' + key);
			makeSureFolderExists(destinationFolder);
			fs.writeFileSync(destinationFolder + '/_category_.json', `{ "label": "${key}", "position": ${menuPosition} }`);
			menuPosition++;
		} else {
			let theClasses = helperToBuildCustomTailwindClasses(key, value);

			if (distributionFolder) {
				fs.writeFileSync(`${destinationFolder}/${key}.md`, '```scss' + theClasses + '```');
			}

			tailwindStyles += theClasses;
		}
	});

	let finalTailwindStyles = helpers.applyProperties(tailwindStyles);

	if (fs.existsSync(projectConfigJS)) {
		fs.writeFileSync(projectTailwindTSS, finalTailwindStyles);
		logger.info(chalk.yellow('./purgetss/tailwind.tss'), message);
	} else {
		fs.writeFileSync(srcTailwindTSS, finalTailwindStyles);
		logger.info(chalk.yellow('./dist/tailwind.tss'), message);
	}
}
module.exports.buildCustomTailwind = buildCustomTailwind;

function removeFitMaxMin(theObject) {
	delete theObject.width['fit'];
	delete theObject.width['max'];
	delete theObject.width['min'];
	delete theObject.height['fit'];
	delete theObject.height['max'];
	delete theObject.height['min'];
	delete theObject.spacing['fit'];
	delete theObject.spacing['max'];
	delete theObject.spacing['min'];
}

function fixPercentages(theObject) {
	_.each(theObject, (value, key) => {
		if (value.toString().includes('.333333%')) {
			theObject[key] = value.replace('.333333%', '.333334%');
		}
	});
}

function removeDeprecatedColors(theObject) {
	delete theObject.blueGray;
	delete theObject.coolGray;
	delete theObject.current;
	delete theObject.inherit;
	delete theObject.lightBlue;
	delete theObject.trueGray;
	delete theObject.warmGray;
}

function createDefinitionsFile() {
	let classDefinitions = '';

	if (fs.existsSync(projectTailwindTSS)) {
		classDefinitions += fs.readFileSync(projectTailwindTSS, 'utf8');
	}

	if (fs.existsSync(cwd + '/purgetss/fonts.tss')) {
		classDefinitions += fs.readFileSync(cwd + '/purgetss/fonts.tss', 'utf8').replace(/\n\/\*\*\n([\s\S]*?)\*\/\n/g, '');
	}

	if (fs.existsSync(projectFontAwesomeTSS)) {
		classDefinitions += fs.readFileSync(projectFontAwesomeTSS, 'utf8');
	} else {
		classDefinitions += fs.readFileSync(srcFontAwesomeTSSFile, 'utf8');
	}

	classDefinitions += fs.readFileSync(srcFramework7FontTSSFile, 'utf8');

	classDefinitions += fs.readFileSync(srcMaterialDesignIconsTSSFile, 'utf8');

	classDefinitions = classDefinitions
		.replace(`'ImageView[platform=ios]': { hires: true }\n`, '')
		.replace(`'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }\n`, '')
		.replace(`'Window': { backgroundColor: '#ffffff' }\n\n`, '')
		.replace(/'.(.*)': /g, '.$1')
		.replace(/{(.*)}/g, '{}')
		.replace(/\[(.*)\]/g, '')
		.replace(/\/\/(.*)\n/g, '')
		.replace(/\n/g, '');

	fs.writeFileSync(cwd + '/purgetss/definitions.css', `/* Class definitions */${classDefinitions}`);

	logger.file('./purgetss/definitions.css');
}

//! Build tailwind's custom values
function helperToBuildCustomTailwindClasses(key, value) {
	switch (key) {
		// case 'audioStreamType':
		// case 'category':
		case 'accessibilityHidden':
		case 'accessoryType':
		case 'activeIconIsMask':
		case 'activeTab':
		case 'activeTintColor':
		case 'activeTitleColor':
		case 'activityEnterTransition':
		case 'activityExitTransition':
		case 'activityIndicatorStyle':
		case 'activityReenterTransition':
		case 'activityReturnTransition':
		case 'activitySharedElementEnterTransition':
		case 'activitySharedElementExitTransition':
		case 'activitySharedElementReenterTransition':
		case 'activitySharedElementReturnTransition':
		case 'alertDialogStyle':
		case 'allowsBackForwardNavigationGestures':
		case 'allowsLinkPreview':
		case 'allowsMultipleSelectionDuringEditing':
		case 'allowsMultipleSelectionInteraction':
		case 'allowsSelection':
		case 'allowsSelectionDuringEditing':
		case 'allowUserCustomization':
		case 'anchorPoint':
		case 'autoAdjustScrollViewInsets':
		case 'autocapitalization':
		case 'autocorrect':
		case 'autofillType':
		case 'autoLink':
		case 'autoreverse':
		case 'autorotate':
		case 'backgroundBlendMode':
		case 'backgroundColor':
		case 'backgroundDisabledColor':
		case 'backgroundFocusedColor':
		case 'backgroundGradient':
		case 'backgroundLeftCap':
		case 'backgroundLinearGradient':
		case 'backgroundPaddingBottom':
		case 'backgroundPaddingLeft':
		case 'backgroundPaddingRight':
		case 'backgroundPaddingTop':
		case 'backgroundRadialGradient':
		case 'backgroundRepeat':
		case 'backgroundSelectedColor':
		case 'backgroundSelectedGradient':
		case 'backgroundTopCap':
		case 'badgeColor':
		case 'barColor':
		case 'borderColor':
		case 'borderRadius':
		case 'borderStyle':
		case 'borderWidth':
		case 'bottomNavigation':
		case 'bubbleParent':
		case 'buttonStyle':
		case 'cacheMode':
		case 'cachePolicy':
		case 'cacheSize':
		case 'calendarViewShown':
		case 'canCancelEvents':
		case 'cancelable':
		case 'canceledOnTouchOutside':
		case 'canDelete':
		case 'canEdit':
		case 'canInsert':
		case 'canMove':
		case 'canScroll':
		case 'caseInsensitiveSearch':
		case 'checkable':
		case 'clearButtonMode':
		case 'clearOnEdit':
		case 'clipMode':
		case 'columnCount':
		case 'constraint':
		case 'contentHeight':
		case 'contentHeightAndWidth':
		case 'contentWidth':
		case 'countDownDuration':
		case 'currentPageIndicatorColor':
		case 'curve':
		case 'datePickerStyle':
		case 'dateTimeColor':
		case 'defaultItemTemplate':
		case 'dimBackgroundForSearch':
		case 'disableBounce':
		case 'disableContextMenu':
		case 'disabledColor':
		case 'displayCaps':
		case 'displayHomeAsUp':
		case 'draggingType':
		case 'drawerIndicatorEnabled':
		case 'drawerLockMode':
		case 'dropShadow':
		case 'duration':
		case 'editable':
		case 'editing':
		case 'elevation':
		case 'ellipsize':
		case 'enableCopy':
		case 'enabled':
		case 'enableJavascriptInterface':
		case 'enableReturnKey':
		case 'enableZoomControls':
		case 'exitOnClose':
		case 'extendBackground':
		case 'extendEdges':
		case 'extendSafeArea':
		case 'fastScroll':
		case 'filterAnchored':
		case 'filterAttribute':
		case 'filterCaseInsensitive':
		case 'filterTouchesWhenObscured':
		case 'flags':
		case 'flagSecure':
		case 'flip':
		case 'focusable':
		case 'fontFamily':
		case 'fontSize':
		case 'fontStyle':
		case 'fontWeight':
		case 'footerDividersEnabled':
		case 'format24':
		case 'fullscreen':
		case 'gap':
		case 'gravity':
		case 'gridColumnsRowsStartEnd':
		case 'gridFlow':
		case 'gridSystem':
		case 'hasCheck':
		case 'hasChild':
		case 'hasDetail':
		case 'headerDividersEnabled':
		case 'height':
		case 'hiddenBehavior':
		case 'hideLoadIndicator':
		case 'hidesBackButton':
		case 'hidesBarsOnSwipe':
		case 'hidesBarsOnTap':
		case 'hidesBarsWhenKeyboardAppears':
		case 'hideSearchOnSelection':
		case 'hideShadow':
		case 'hidesSearchBarWhenScrolling':
		case 'highlightedColor':
		case 'hintTextColor':
		case 'hintType':
		case 'hires':
		case 'homeButtonEnabled':
		case 'homeIndicatorAutoHidden':
		case 'horizontalMargin':
		case 'horizontalWrap':
		case 'html':
		case 'icon':
		case 'iconified':
		case 'iconifiedByDefault':
		case 'iconIsMask':
		case 'ignoreSslError':
		case 'imageTouchFeedback':
		case 'imageTouchFeedbackColor':
		case 'includeFontPadding':
		case 'includeOpaqueBars':
		case 'indentionLevel':
		case 'indicatorColor':
		case 'inputType':
		case 'items':
		case 'keepScreenOn':
		case 'keepSectionsInSearch':
		case 'keyboardAppearance':
		case 'keyboardDismissMode':
		case 'keyboardDisplayRequiresUserAction':
		case 'keyboardToolbarColor':
		case 'keyboardToolbarHeight':
		case 'keyboardType':
		case 'largeTitleDisplayMode':
		case 'largeTitleEnabled':
		case 'layout':
		case 'lazyLoadingEnabled':
		case 'leftButtonMode':
		case 'leftButtonPadding':
		case 'leftDrawerLockMode':
		case 'leftWidth':
		case 'lightTouchEnabled':
		case 'lines':
		case 'listViewStyle':
		case 'location':
		case 'loginKeyboardType':
		case 'loginReturnKeyType':
		case 'margin':
		case 'marginAlternate':
		case 'maxElevation':
		case 'maxLines':
		case 'maxRowHeight':
		case 'maxZoomScale':
		case 'minimumFontSize':
		case 'minRowHeight':
		case 'minZoomScale':
		case 'mixedContentMode':
		case 'modal':
		case 'moveable':
		case 'moving':
		case 'nativeSpinner':
		case 'navBarHidden':
		case 'navigationMode':
		case 'navTintColor':
		case 'offsets':
		case 'onTintColor':
		case 'opacity':
		case 'orientationModes':
		case 'overlayEnabled':
		case 'overrideCurrentAnimation':
		case 'overScrollMode':
		case 'padding':
		case 'pageIndicatorColor':
		case 'pagingControlAlpha':
		case 'pagingControlColor':
		case 'pagingControlHeight':
		case 'pagingControlOnTop':
		case 'pagingControlTimeout':
		case 'passwordKeyboardType':
		case 'passwordMask':
		case 'pickerType':
		case 'placeholder':
		case 'placement':
		case 'pluginState':
		case 'preventCornerOverlap':
		case 'preventDefaultImage':
		case 'previewActionStyle':
		case 'progressBarStyle':
		case 'progressIndicatorType':
		case 'pruneSectionsOnEdit':
		case 'pullBackgroundColor':
		case 'repeat':
		case 'repeatCount':
		case 'requestedOrientation':
		case 'resultsBackgroundColor':
		case 'resultsSeparatorColor':
		case 'resultsSeparatorStyle':
		case 'returnKeyType':
		case 'reverse':
		case 'rightButtonMode':
		case 'rightButtonPadding':
		case 'rightDrawerLockMode':
		case 'rightWidth':
		case 'rotate':
		case 'rowCount':
		case 'rowHeight':
		case 'scale':
		case 'scalesPageToFit':
		case 'scrollable':
		case 'scrollIndicators':
		case 'scrollIndicatorStyle':
		case 'scrollingEnabled':
		case 'scrollsToTop':
		case 'scrollType':
		case 'searchAsChild':
		case 'searchBarStyle':
		case 'searchHidden':
		case 'sectionHeaderTopPadding':
		case 'selectedButtonColor':
		case 'selectedColor':
		case 'selectedSubtitleColor':
		case 'selectedTextColor':
		case 'selectionGranularity':
		case 'selectionOpens':
		case 'selectionStyle':
		case 'separatorColor':
		case 'separatorHeight':
		case 'separatorStyle':
		case 'shadow':
		case 'shadowColor':
		case 'shadowRadius':
		case 'shiftMode':
		case 'showAsAction':
		case 'showBookmark':
		case 'showCancel':
		case 'showHorizontalScrollIndicator':
		case 'showPagingControl':
		case 'showSearchBarInNavBar':
		case 'showSelectionCheck':
		case 'showUndoRedoActions':
		case 'showVerticalScrollIndicator':
		case 'smoothScrollOnTabClick':
		case 'statusBarStyle':
		case 'submitEnabled':
		case 'subtitleColor':
		case 'suppressReturn':
		case 'sustainedPerformanceMode':
		case 'swipeToClose':
		case 'switchStyle':
		case 'systemButton':
		case 'tabBarHidden':
		case 'tabbedBarStyle':
		case 'tabGroupStyle':
		case 'tableViewStyle':
		case 'tabsBackgroundColor':
		case 'tabsBackgroundSelectedColor':
		case 'tabsTranslucent':
		case 'textAlign':
		case 'textColor':
		case 'theme':
		case 'thumbTintColor':
		case 'tiMedia':
		case 'timeout':
		case 'tintColor':
		case 'titleAttributesColor':
		case 'titleAttributesShadow':
		case 'titleAttributesShadowColor':
		case 'titleColor':
		case 'titleTextColor':
		case 'toolbarEnabled':
		case 'touchEnabled':
		case 'touchFeedback':
		case 'touchFeedbackColor':
		case 'trackTintColor':
		case 'transition':
		case 'transitionDelay':
		case 'transitionDuration':
		case 'translucent':
		case 'useCompatPadding':
		case 'useSpinner':
		case 'verticalAlign':
		case 'verticalBounce':
		case 'verticalMargin':
		case 'viewShadow':
		case 'viewShadowColor':
		case 'visible':
		case 'width':
		case 'willHandleTouches':
		case 'willScrollOnStatusTap':
		case 'windowPixelFormat':
		case 'windowSoftInputMode':
		case 'wobble':
		case 'zIndex':
		case 'zoomScale':
			return helpers[key](value);

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

function extractOnlyClasses(currentText, currentFile) {
	try {
		let jsontext = convert.xml2json(encodeHTML(currentText), { compact: true });

		return traverse(JSON.parse(jsontext)).reduce(function(acc, value) {
			if (this.key === 'class') acc.push(value.split(' '));
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
	makeSureFolderExists(projectFontsFolder);

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
		case 'f7':
		case 'framework':
		case 'framework7':
			copyFramework7IconsFonts();
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
				fs.copyFileSync(srcLibFA, projectLibFolder + '/fontawesome.js');
				logger.info('FontAwesome CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			}
			break;
		case 'md':
		case 'material':
		case 'materialdesign':
			fs.copyFileSync(srcLibMD, projectLibFolder + '/materialdesignicons.js');
			logger.info('Material Design CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
		case 'f7':
		case 'framework':
		case 'framework7':
			fs.copyFileSync(srcLibF7, projectLibFolder + '/framework7icons.js');
			logger.info('Framework7-Icons CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
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
	if (!fs.existsSync(project_AppTSS) && fs.existsSync(projectAppTSS)) {
		logger.warn('Backing up app.tss into _app.tss\n             FROM NOW ON, add, update or delete your original classes in _app.tss');
		fs.copyFileSync(projectAppTSS, project_AppTSS);
	} else if (!fs.existsSync(project_AppTSS)) {
		fs.appendFileSync(project_AppTSS, '// Empty _app.tss\n');
	}
}

//! Copy Reset template
function copyResetTemplateAnd_appTSS() {
	localStart();

	logger.info('Copying Reset styles...');

	let tempPurged = fs.readFileSync(srcResetTSSFile, 'utf8');

	if (fs.existsSync(project_AppTSS)) {
		let appTSSContent = fs.readFileSync(project_AppTSS, 'utf8');

		if (appTSSContent.length) {
			logger.info('Copying', chalk.yellow('_app.tss'), 'styles...');
			tempPurged += '\n// Styles from _app.tss\n' + appTSSContent;
		}
	}

	localFinish('Copying Reset and ' + chalk.yellow('_app.tss') + ' styles...');

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

let localStartTime;
function localStart() {
	localStartTime = new Date();
};

function localFinish(customMessage = 'Finished purging in') {
	let localEndTime = new Date(new Date() - localStartTime);
	if (purgingDebug) logger.info(customMessage, chalk.green(`${localEndTime.getSeconds()}s ${localEndTime.getMilliseconds()}ms`));
}

//! Purge Functions
//! Tailwind
function purgeTailwind(uniqueClasses) {
	localStart();

	let purgedClasses = '\n// Main styles\n';
	let tailwindClasses = fs.readFileSync(projectTailwindTSS, 'utf8').split(/\r?\n/);

	if (`// config.js file updated on: ${getFileUpdatedDate(projectConfigJS)}` !== tailwindClasses[6]) {
		logger.info(chalk.yellow('config.js'), 'file updated!, rebuilding tailwind.tss...');
		buildCustomTailwind('file updated!');
		createDefinitionsFile();
		tailwindClasses = fs.readFileSync(projectTailwindTSS, 'utf8').split(/\r?\n/);
	}

	logger.info('Purging', chalk.yellow('Custom Tailwind'), 'styles...')

	let cleanUniqueClasses = [];
	let classesWithOpacityValues = [];

	let arbitraryValues = '\n// Styles with arbitrary values\n';

	uniqueClasses.forEach((className, index) => {
		let cleanClassName = cleanClassNameFn(className);

		if (cleanClassName.includes('(')) {
			let line = helpers.formatArbitraryValues(cleanClassName, true);
			if (line) arbitraryValues += helpers.checkPlatformAndDevice(line, className);
		} else if (helpers.checkColorClasses(cleanClassName)) {
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

	let anArrayOfClasses = [];
	tailwindClasses.forEach(tailwindClass => {
		if (tailwindClass !== '' && !tailwindClass.includes('//')) {
			let cleanTailwindClass = `${tailwindClass.split(':')[0].replace('.', '').replace(/'/g, '').replace(/ *\[[^\]]*]/, '')}`;

			if (cleanUniqueClasses.indexOf(cleanTailwindClass) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(cleanTailwindClass)]));
			}

			if (cleanUniqueClasses.indexOf(`ios:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`ios:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`android:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`android:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`tablet:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`tablet:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`handheld:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`handheld:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`open:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`open:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`close:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`close:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`drag:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`drag:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`drop:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`drop:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`complete:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`complete:${cleanTailwindClass}`)]));
			}

			if (cleanUniqueClasses.indexOf(`bounds:${cleanTailwindClass}`) > -1) {
				anArrayOfClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`bounds:${cleanTailwindClass}`)]));
			}
		}
	});

	purgedClasses += anArrayOfClasses.join('');

	// Styles with color opacity modifiers
	if (classesWithOpacityValues.length > 0) {
		purgedClasses += '\n// Styles with color opacity modifiers\n';
		classesWithOpacityValues.forEach(opacityValue => {
			let opacityIndex = _.findIndex(tailwindClasses, line => line.startsWith(`'.${opacityValue.className}`));

			if (opacityIndex > -1) {
				//! TODO: Check if color value is a hex value!! (if not, they are using rbg, rgba or semantic colors)
				//! In other words, we need to validate the color value, before we can alter its opacity.
				let defaultHexValue;
				if (tailwindClasses[opacityIndex].includes('from')) {
					defaultHexValue = tailwindClasses[opacityIndex].match(/\#[0-9a-f]{6}/g)[1];
				} else {
					defaultHexValue = tailwindClasses[opacityIndex].match(/\#[0-9a-f]{6}/i)[0];
				}

				let classWithoutDecimalOpacity = `${tailwindClasses[opacityIndex].replace(new RegExp(defaultHexValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `#${opacityValue.transparency}${defaultHexValue.substring(1)}`)}`;
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

	let mensaje = 'Purging ' + chalk.yellow('Custom Tailwind') + ' styles...';

	localFinish(mensaje);

	return purgedClasses;
}

function cleanClassNameFn(className) {
	return className.replace('ios:', '').replace('android:', '').replace('handheld:', '').replace('tablet:', '').replace('open:', '').replace('complete:', '').replace('close:', '').replace('complete:', '').replace('drag:', '').replace('drop:', '').replace('bounds:', '');
}

//! FontAwesome
function purgeFontAwesome(uniqueClasses, cleanUniqueClasses) {
	// check if fonts.tss includes Font Awesome
	let fontAwesome = false;

	if (fs.existsSync(cwd + '/purgetss/fonts.tss')) {
		let fontsTSS = fs.readFileSync(cwd + '/purgetss/fonts.tss', 'utf8');
		fontAwesome = fontsTSS.includes('Font Awesome');
	}

	if (!fontAwesome) {
		let sourceFolder = '';
		let purgedClasses = '';
		let purgingMessage = '';

		if (fs.existsSync(projectFontAwesomeTSS)) {
			sourceFolder = projectFontAwesomeTSS;
			purgedClasses = '\n// Pro/Beta Font Awesome styles\n';
			purgingMessage = `Purging ${chalk.yellow('Pro/Beta Font Awesome')} styles...')`;
		} else {
			sourceFolder = srcFontAwesomeTSSFile;
			purgedClasses = '\n// Default Font Awesome styles\n';
			purgingMessage = `Purging Default Font Awesome styles...`;
		}

		purgedClasses += purgeFontIcons(sourceFolder, uniqueClasses, purgingMessage, cleanUniqueClasses, ['fa', 'fat', 'fas', 'fal', 'far', 'fab', 'fa-thin', 'fa-solid', 'fa-light', 'fa-regular', 'fa-brands', 'fontawesome', 'fontawesome-thin', 'fontawesome-solid', 'fontawesome-light', 'fontawesome-regular', 'fontawesome-brands']);

		return (purgedClasses === '\n// Pro/Beta Font Awesome styles\n' || purgedClasses === '\n// Default Font Awesome styles\n') ? '' : purgedClasses;
	}

	return '';
}

//! Material Design Icons
function purgeMaterialDesign(uniqueClasses, cleanUniqueClasses) {
	let purgedClasses = '\n// Material Design Icons styles\n';

	purgedClasses += purgeFontIcons(srcMaterialDesignIconsTSSFile, uniqueClasses, 'Purging Material Design Icons styles...', cleanUniqueClasses, ['md', 'mdo', 'mdr', 'mds', 'mdt', '.materialdesign', '.materialdesign-round', '.materialdesign-sharp', '.materialdesign-two-tone', '.materialdesign-outlined', '.material-icons', '.material-icons-round', '.material-icons-sharp', '.material-icons-two-tone', '.material-icons-outlined']);

	return (purgedClasses === '\n// Material Design Icons styles\n') ? '' : purgedClasses;
}

//! Framework7
function purgeFramework7(uniqueClasses, cleanUniqueClasses) {
	let purgedClasses = '\n// Framework7 styles\n';

	purgedClasses += purgeFontIcons(srcFramework7FontTSSFile, uniqueClasses, 'Purging Framework7 Icons styles...', cleanUniqueClasses, ['f7', 'f7i', 'framework7']);

	return (purgedClasses === '\n// Framework7 styles\n') ? '' : purgedClasses;
}

function purgeFontIcons(sourceFolder, uniqueClasses, message, cleanUniqueClasses, prefixes) {
	localStart();

	let purgedClasses = '';
	let sourceTSS = fs.readFileSync(sourceFolder, 'utf8');

	if (cleanUniqueClasses.some(element => sourceTSS.includes(`'.${element}'`))) {
		logger.info(message);
		let sourceTSSFile = sourceTSS.split(/\r?\n/);
		uniqueClasses.forEach(className => {
			let cleanClassName = cleanClassNameFn(className);
			if (sourceTSS.includes(`'.${cleanClassName}'`)) {
				let newLine = _.filter(sourceTSSFile, s => s.indexOf(`'.${cleanClassName}'`) !== -1)[0];
				purgedClasses += helpers.checkPlatformAndDevice(newLine, className);
			}
		});
	}

	localFinish(message);

	return purgedClasses;
}

function saveFile(file, data) {
	localStart();

	fs.writeFileSync(file, data, err => {
		throw err;
	});

	localFinish(`Saving ${chalk.yellow('app.tss')}...`);
}

function createJMKFile() {
	fs.copyFileSync(srcJMKFile, projectAlloyJMKFile);
	logger.file('./app/alloy.jmk');
	addHook();
}

//! Soon to be deleted
function reviewThis(className) {
	let twStylesWithoyPlatformSpecificStyles = className.replace(/\[platform=ios\]/g, '').replace(/\[platform=android\]/g, '').split(/\r?\n/);
	twStylesArray[indexOfClass].replace('[platform=android]', '').replace('[platform=ios]', '')
}
