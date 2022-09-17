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
const inquirer = require('inquirer');
const helpers = require('./lib/helpers');
const colores = require('./lib/colores').colores;
module.exports.colores = colores;
const purgeLabel = colores.purgeLabel;

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

const projectsLibFolder = cwd + '/app/lib';
const projectsAppTSS = cwd + '/app/styles/app.tss';
const projects_AppTSS = cwd + '/app/styles/_app.tss';
const projectsAlloyJMKFile = cwd + '/app/alloy.jmk';
const projectsFontsFolder = cwd + '/app/assets/fonts';
const projectsFontAwesomeJS = cwd + '/app/lib/fontawesome.js';

const projectsPurgeTSSFolder = cwd + '/purgetss';
const projectsConfigJS = cwd + '/purgetss/config.js';
const projectsTailwind_TSS = cwd + '/purgetss/tailwind.tss';
const projectsPurge_TSS_Fonts_Folder = cwd + '/purgetss/fonts';
const projectsFA_TSS_File = cwd + '/purgetss/fontawesome.tss';

// js icon modules
const srcLibFA = path.resolve(__dirname, './dist/fontawesome.js');
const srcLibF7 = path.resolve(__dirname, './dist/framework7icons.js');
const srcLibMD = path.resolve(__dirname, './dist/materialdesignicons.js');
const srcPurgeTSSLibrary = path.resolve(__dirname, './dist/purgetss.ui.js');

//
const srcTailwindTSS = path.resolve(__dirname, './dist/tailwind.tss');
//

// PRO
const srcFA_Pro_CSS = cwd + '/node_modules/@fortawesome/fontawesome-pro/css/all.css';
const srcFA_Pro_Web_Fonts_Folder = cwd + '/node_modules/@fortawesome/fontawesome-pro/webfonts/';
// Alternate location
const srcFA_Pro_CSS_Alt = cwd + '/app/lib/node_modules/@fortawesome/fontawesome-pro/css/all.css';
const srcFA_Pro_Web_Fonts_Folder_Alt = cwd + '/app/lib/node_modules/@fortawesome/fontawesome-pro/webfonts/';

const srcFA_ProReset_TSS_File = './lib/templates/fontawesome/pro-reset.tss';
const srcFA_ProTemplateTSS_File = './lib/templates/fontawesome/pro-template.tss';
const srcFA_ProFontFamilies = {
	'fa-thin-100.ttf': 'FontAwesome6Pro-Thin.ttf',
	'fa-light-300.ttf': 'FontAwesome6Pro-Light.ttf',
	'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
	'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
	'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf'
}

// BETA
const srcFA_Beta_CSSFile = cwd + '/purgetss/fontawesome-beta/css/all.css';
const srcFA_Beta_Web_Fonts_Folder = cwd + '/purgetss/fontawesome-beta/webfonts/';
const srcFA_Beta_ResetTSS = './lib/templates/fontawesome/beta-reset.tss';
const srcFA_Beta_TemplateTSS = './lib/templates/fontawesome/beta-template.tss';
const srcFA_Beta_FontFamilies = {
	'fa-thin-100.ttf': 'FontAwesome6Pro-Thin.ttf',
	'fa-light-300.ttf': 'FontAwesome6Pro-Light.ttf',
	'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
	'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
	'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf',
}
//
const srcFonts_Folder = path.resolve(__dirname, './assets/fonts');
const srcReset_TSS_File = path.resolve(__dirname, './dist/reset.tss');

const srcFontAwesomeTSSFile = path.resolve(__dirname, './dist/fontawesome.tss');
const srcFramework7FontTSSFile = path.resolve(__dirname, './dist/framework7icons.tss');
const srcMaterialDesignIconsTSSFile = path.resolve(__dirname, './dist/materialdesignicons.tss');

const srcConfigFile = path.resolve(__dirname, './lib/templates/purgetss.config.js');

const configFile = (fs.existsSync(projectsConfigJS)) ? require(projectsConfigJS) : require(srcConfigFile);
configFile.corePlugins = configFile.corePlugins ?? {};
configFile.purge = configFile.purge ?? { mode: 'all' };
configFile.theme.extend = configFile.theme.extend ?? {};
configFile.fonts = configFile.fonts ?? { mode: 'fileName' };

const configOptions = (configFile.purge && configFile.purge.options) ? configFile.purge.options : false;
if (configOptions) {
	configOptions.legacy = configOptions.legacy ?? false;
	configOptions.widgets = configOptions.widgets ?? false;
	configOptions.missing = configOptions.missing ?? true;
}

const srcJMKFile = path.resolve(__dirname, './lib/templates/alloy.jmk');

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

		tempPurged += purgeFonts(uniqueClasses, cleanUniqueClasses);

		tempPurged += processMissingClasses(tempPurged);

		saveFile(projectsAppTSS, tempPurged);

		logger.file('app.tss');

		finish();
	}
}
module.exports.purgeClasses = purgeClasses;

function init(options) {
	// config file
	if (!fs.existsSync(projectsConfigJS)) {
		createConfigFile();
	}

	// tailwind.tss
	if (!fs.existsSync(projectsTailwind_TSS) || options.all) {
		buildTailwindBasedOnConfigOptions(options);
	}

	// definitios file
	if (!fs.existsSync(cwd + '/purgetss/definitions.css') || options.all) {
		createDefinitionsFile();
	}

	// auto purge hook
	if (fs.existsSync(projectsAlloyJMKFile)) {
		if (!fs.readFileSync(projectsAlloyJMKFile, 'utf8').includes('::PurgeTSS::')) {
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
		if (fs.existsSync(projectsAlloyJMKFile)) {
			//! TODO: Refactor with readline or line-reader: https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
			if (options.off) {
				removeHook();
			} else if (!fs.readFileSync(projectsAlloyJMKFile, 'utf8').includes('::PurgeTSS::')) {
				addHook();
			} else if (fs.readFileSync(projectsAlloyJMKFile, 'utf8').includes("//\trequire('child_process').execSync('")) {
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
		makeSureFolderExists(projectsFontsFolder);

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
		makeSureFolderExists(projectsLibFolder);

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

function copyModulesLibrary() {
	if (alloyProject()) {
		makeSureFolderExists(projectsLibFolder);

		fs.copyFileSync(srcPurgeTSSLibrary, projectsLibFolder + '/purgetss.ui.js');
		logger.info(chalk.yellow('purgetss.ui'), 'module copied to', chalk.yellow('./app/lib'), 'folder');
	}
}
module.exports.copyModulesLibrary = copyModulesLibrary;

function getFileUpdatedDate(thePath) {
	return fs.statSync(thePath).mtime;
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
		makeSureFolderExists(projectsPurgeTSSFolder);

		makeSureFolderExists(projectsPurge_TSS_Fonts_Folder);

		if (fs.existsSync(projectsConfigJS)) {
			logger.warn('./purgetss/config.js', chalk.red('file already exists!'));
		} else {
			fs.copyFileSync(srcConfigFile, projectsConfigJS);
			logger.file('./purgetss/config.js');
		}
	}
}

//! Command: create
function create(args, options) {
	start();
	const { exec } = require("child_process");

	exec(`ti config app.idprefix && ti config app.workspace`, (error, stdout) => {

		let results = stdout.split('\n');
		let idPrefix = results[0];
		let workspace = results[1];

		if (idPrefix !== 'app.idprefix not found' && workspace !== '') {
			let projectID = `${idPrefix}.${args.name.replace(/ /g, '').replace(/-/g, '').replace(/_/g, '').toLowerCase()}`;
			console.log('');

			if (fs.existsSync(`${workspace}/${args.name}`)) {
				if (options.force) {
					logger.info('Deleting existing project folder');
					exec(`chown -R $USER "${workspace}/${args.name}" && rm -rf "${workspace}/${args.name}"`, error => {
						if (error) return logger.error(error);
						createProject(workspace, args.name, projectID, options);
					});
				} else {
					inquirer.prompt([{
						type: 'confirm',
						name: 'delete',
						message: `The folder ‘${args.name}’ already exists. Do you want to delete it?`,
						default: false
					}]).then(answers => {
						if (answers.delete) {
							logger.info('Deleting existing project folder');
							exec(`chown -R $USER "${workspace}/${args.name}" && rm -rf "${workspace}/${args.name}"`, error => {
								if (error) return logger.error(error);
								createProject(workspace, args.name, projectID, options);
							});
						} else {
							console.log('');
							logger.warn(chalk.yellow('Project creation aborted!'));
						}
					});
				}
			} else {
				createProject(workspace, args.name, projectID, options);
			}
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

function createProject(workspace, argsName, projectID, options) {
	let projectName = `"${argsName}"`;
	const { exec } = require("child_process");
	const commandExistsSync = require('command-exists').sync;

	logger.info('Creating a new Titanium project');

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

				fs.writeFileSync(`${workspace}/${argsName}/package.json`, JSON.stringify({ "name": `${argsName.replace(/ /g, '-').toLowerCase()}`, "private": true }));

				let installTailwind = `cd ${workspace}/${projectName} && npm init -y && npm i tailwindcss -D && npx tailwindcss init`;
				exec(installTailwind, (error) => {
					if (error) return logger.error(error);

					finish(chalk.yellow(`‘${argsName}’`) + ' project created successfully in');

					exec(theOpenCommand, (error) => {
						if (error) return logger.error(error);
					});
				});
			} else {
				finish(chalk.yellow(`‘${argsName}’`) + ' project created successfully in');

				exec(theOpenCommand, (error) => {
					if (error) return logger.error(error);
				});
			}
		});
	});
}

//! Command: build
function build(options) {
	if (alloyProject()) {
		initIfNotConfig()
		buildTailwindBasedOnConfigOptions(options)
		buildFontAwesome();
		buildFontAwesomeJS();
		createDefinitionsFile();
	}
}
module.exports.build = build;

//! Command: build-legacy
function buildLegacy() {
	if (alloyProject()) {
		initIfNotConfig()
		buildTailwindLegacy();
		buildFontAwesome();
		buildFontAwesomeJS();
		createDefinitionsFile();
	}
}
module.exports.buildLegacy = buildLegacy;

//! Command: Build fonts.tss
function buildFonts(options) {
	if (fs.existsSync(projectsPurge_TSS_Fonts_Folder)) {
		start();

		let files = getFiles(projectsPurge_TSS_Fonts_Folder).filter(file => {
			return file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.css') || file.endsWith('.TTF') || file.endsWith('.OTF') || file.endsWith('.CSS');
		});

		let fontMeta = '';
		let fontJS = '';
		let fontFamiliesJS = '';
		const FontName = require('fontname');
		let tssClasses = `// Fonts TSS file generated with PurgeTSS\n// https://github.com/macCesar/purgeTSS\n`;

		//! Process font files
		_.each(files, file => {
			if (file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.TTF') || file.endsWith('.OTF')) {
				fontMeta = FontName.parse(fs.readFileSync(file))[0];

				tssClasses += processFontMeta(fontMeta);

				let fontFamilyName = fontMeta.postScriptName.replace(/\//g, '');
				//! Maybe this is deprecated
				if (configFile.fonts.mode.toLowerCase() === 'postscriptname' || configFile.fonts.mode.toLowerCase() === 'postscript' || configFile.fonts.mode.toLowerCase() === 'ps') {
					tssClasses += `\n'.${fontFamilyName}': { font: { fontFamily: '${fontFamilyName}' } }\n`;
				} else {
					tssClasses += `\n'.${getFileName(file)}': { font: { fontFamily: '${fontFamilyName}' } }\n`;
				}

				//! Copy Font File
				makeSureFolderExists(projectsFontsFolder);
				let fontExtension = file.split('.').pop();
				fs.copyFile(file, `${projectsFontsFolder}/${fontFamilyName}.${fontExtension}`, err => {
					if (err) {
						throw err;
					}
				});
				logger.info('Copying font', `${chalk.yellow(file.split('/').pop())}...`);
			}
		});

		let oneTimeMessage = `\n// Unicode Characters\n// To use your Icon Fonts in Buttons AND Labels each class sets 'text' and 'title' properties\n`;

		//! Process styles files
		_.each(files, file => {
			if (file.endsWith('.css') || file.endsWith('.CSS')) {
				let theFile = file.split('/');
				let theCSSFile = theFile.pop();
				let theFolder = theFile.pop() + '/';
				if (theFolder === 'fonts/') {
					theFolder = '';
				}

				let theCSSFileName = theFolder + theCSSFile;

				tssClasses += oneTimeMessage + `\n// ${theCSSFileName}\n`;
				oneTimeMessage = '';

				tssClasses += processFontsCSS(readCSS(file));

				//! JavaScript Module
				if (options.modules) {
					fontJS += processFontsJS(readCSS(file), `\n\t// ${theCSSFileName}`);
					fontFamiliesJS += processFontFamilyNamesJS(readCSS(file), `\n\t// ${theCSSFileName}`);
				}

				// !Done processing stylesheet
				logger.info('Processing', `${chalk.yellow(theCSSFileName)}...`);
			}
		});

		if (files.length > 0) {
			makeSureFolderExists(projectsPurgeTSSFolder);

			fs.writeFileSync(cwd + '/purgetss/fonts.tss', tssClasses, err => {
				throw err;
			});

			makeSureFolderExists(projectsLibFolder);
		}

		if (fontJS) {
			let exportIcons = 'const icons = {';
			exportIcons += fontJS.slice(0, -1);
			exportIcons += '\n};\n';
			exportIcons += 'exports.icons = icons;\n';

			exportIcons += '\nconst families = {';
			exportIcons += fontFamiliesJS.slice(0, -1);
			exportIcons += '\n};\n';
			exportIcons += 'exports.families = families;\n';

			exportIcons += '\n// Helper Functions\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/icon-functions.js'), 'utf8');

			fs.writeFileSync(projectsLibFolder + '/purgetss.fonts.js', exportIcons, err => {
				throw err;
			});

			logger.info(`${chalk.yellow('./app/lib/purgetss.fonts.js')} file created!`);
		} else {
			if (fs.existsSync(projectsLibFolder + '/purgetss.fonts.js')) {
				fs.unlinkSync(projectsLibFolder + '/purgetss.fonts.js');
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
module.exports.buildFonts = buildFonts;

function buildFontAwesome() {
	if (fs.existsSync(srcFA_Beta_CSSFile)) {
		processFontAwesomeTSS(srcFA_Beta_CSSFile, srcFA_Beta_TemplateTSS, srcFA_Beta_ResetTSS, srcFA_Beta_FontFamilies, srcFA_Beta_Web_Fonts_Folder);
	} else if (fs.existsSync(srcFA_Pro_CSS)) {
		processFontAwesomeTSS(srcFA_Pro_CSS, srcFA_ProTemplateTSS_File, srcFA_ProReset_TSS_File, srcFA_ProFontFamilies, srcFA_Pro_Web_Fonts_Folder);
	} else if (fs.existsSync(srcFA_Pro_CSS_Alt)) {
		processFontAwesomeTSS(srcFA_Pro_CSS_Alt, srcFA_ProTemplateTSS_File, srcFA_ProReset_TSS_File, srcFA_ProFontFamilies, srcFA_Pro_Web_Fonts_Folder_Alt);
	}
}

function processFontAwesomeTSS(CSSFile, templateTSS, resetTSS, fontFamilies, webFonts) {
	readCSS(CSSFile, (err, data) => {
		if (err) throw err

		let tssClasses = fs.readFileSync(path.resolve(__dirname, templateTSS), 'utf8') + '\n';

		tssClasses += fs.readFileSync(path.resolve(__dirname, resetTSS), 'utf8') + '\n';

		tssClasses += processFontawesomeStyles(data);

		fs.writeFileSync(projectsFA_TSS_File, tssClasses, err2 => {
			throw err2;
		});

		logger.file('./purgetss/fontawesome.tss');

		makeSureFolderExists(projectsFontsFolder);

		copyProFonts(fontFamilies, webFonts);
	});
}

function buildFontAwesomeJS() {
	if (fs.existsSync(srcFA_Beta_CSSFile)) {
		processFontAwesomeJS(srcFA_Beta_CSSFile, './lib/templates/fontawesome/beta-template.js');
	} else if (fs.existsSync(srcFA_Pro_CSS)) {
		processFontAwesomeJS(srcFA_Pro_CSS, './lib/templates/fontawesome/pro-template.js');
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

function processFontAwesomeJS(CSSFile, faJS) {
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

		makeSureFolderExists(projectsLibFolder);

		fs.writeFileSync(projectsFontAwesomeJS, fontAwesomeContent, err2 => {
			throw err2;
		});

		logger.file('./app/lib/fontawesome.js');
	});
}

function copyFreeFonts() {
	fs.copyFile(srcFonts_Folder + '/FontAwesome6Brands-Regular.ttf', projectsFontsFolder + '/FontAwesome6Brands-Regular.ttf', callback);
	fs.copyFile(srcFonts_Folder + '/FontAwesome6Free-Regular.ttf', projectsFontsFolder + '/FontAwesome6Free-Regular.ttf', callback);
	fs.copyFile(srcFonts_Folder + '/FontAwesome6Free-Solid.ttf', projectsFontsFolder + '/FontAwesome6Free-Solid.ttf', callback);

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
		copyFile(`${srcFonts_Folder}/${familyName}`, familyName);
	});

	logger.info('Material Design Icons Font copied to', chalk.yellow('./app/assets/fonts'), 'folder');
}

function copyFramework7IconsFonts() {
	// Framework7 Font
	copyFile(srcFonts_Folder + '/Framework7-Icons.ttf', 'Framework7-Icons.ttf');
	logger.info('Framework7-Icons Font copied to', chalk.yellow('./app/assets/fonts'), 'folder');
}

function processFontsCSS(data) {
	let rules = getRules(data);

	let processedRules = '';

	_.each(rules, rule => {
		if (rule) {
			processedRules += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`;
		}
	});

	return processedRules;
}

function processFontsJS(data, fontFamily = '') {
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

function processFontFamilyNamesJS(data, fontFamily = '') {
	let rules = getRules(data);

	let thePrefix = findPrefix(rules);

	if (thePrefix === undefined) {
		thePrefix = fontFamily;
	}

	return `${fontFamily}\n\t'${_.camelCase(thePrefix)}': '${getFontFamily(data)}',`;
}

function processFontMeta(fontMeta) {
	let fontMetaString = `\n/**\n * ${fontMeta.fullName}`;

	fontMetaString += `\n * ${fontMeta.version}`;

	if (fontMeta.urlVendor) {
		fontMetaString += `\n * ${fontMeta.urlVendor}`;
	}

	// if (fontMeta.description) {
	// 	fontMetaString += `\n * Description: ${fontMeta.description}`;
	// }

	if (fontMeta.designer) {
		fontMetaString += `\n * ${fontMeta.designer}`;
		if (fontMeta.urlDesigner) {
			fontMetaString += ` - ${fontMeta.urlDesigner}`;
		}
	}

	if (fontMeta.copyright) {
		fontMetaString += `\n * ${fontMeta.copyright}`;
	}

	if (fontMeta.trademark) {
		fontMetaString += `\n * ${fontMeta.trademark}`;
	}

	if (fontMeta.licence) {
		fontMetaString += `\n * ${fontMeta.licence.split('\n')[0]}`;
		if (fontMeta.licenceURL) {
			fontMetaString += ` - ${fontMeta.licenceURL}`;
		}
	}

	fontMetaString += `\n */`;

	return fontMetaString;
}

function getFiles(dir) {
	return fs.readdirSync(dir).flatMap((item) => {
		const thePath = `${dir}/${item}`;
		if (fs.statSync(thePath).isDirectory()) {
			return getFiles(thePath);
		}

		return thePath;
	});
}

function getFileName(file) {
	return file.split('/').pop().split('.').shift().replace(/ /g, '-').toLowerCase();
}

function getRules(data) {
	return _.map(data.stylesheet.rules, rule => {
		if (rule.type === 'rule' && rule.declarations[0].property === 'content' && rule.selectors[0].includes('before')) {
			return {
				'selector': '.' + rule.selectors[0].replace('.', '').replace('::before', '').replace(':before', ''),
				'property': ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '').replace('\'\\', '').replace('\'', '')).slice(-4)
			};
		}
	}).filter(rule => rule);
}

function getFontFamily(data) {
	return _.map(data.stylesheet.rules, rule => {
		if (rule.type === 'font-face') {
			let something = rule.declarations.filter(declaration => declaration.property === 'font-family').map(declaration => declaration.value)[0];
			something = something.replace(/'(.*?)'/g, (_match, p1) => p1);
			return something;
		}
	}).filter(rule => rule);
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

//! Purge Fonts
function purgeFonts(uniqueClasses, cleanUniqueClasses) {
	if (fs.existsSync(cwd + '/purgetss/fonts.tss')) {
		let purgedClasses = '\n// Font Styles\n';
		purgedClasses += purgeFontIcons(cwd + '/purgetss/fonts.tss', uniqueClasses, 'Purging Font styles...', cleanUniqueClasses, []);
		return (purgedClasses === '\n// Font Styles\n') ? '' : purgedClasses;
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
	//! Get Styles from App - Minus `app.tss`
	_.each(getFiles(cwd + '/app/styles').filter(file => file.endsWith('.tss') && !file.endsWith('app.tss') && !file.endsWith('_app.tss')), file => {
		tempPurged += '\n' + fs.readFileSync(file, 'utf8');
	});

	//! Get Styles from Widgets  ( Experimental )
	if (configOptions.widgets && fs.existsSync(cwd + '/app/widgets/')) {
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
	let originalJMKFile = fs.readFileSync(projectsAlloyJMKFile, 'utf8');

	if (originalJMKFile.includes('pre:compile')) {
		let updatedJMKFile = [];

		originalJMKFile.split(/\r?\n/).forEach((line) => {
			if (line.includes('pre:compile')) {
				line += `\n\trequire('child_process').execSync('purgetss', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));`;
			}
			updatedJMKFile.push(line);
		});

		saveFile(projectsAlloyJMKFile, updatedJMKFile.join("\n"));
	} else {
		fs.appendFileSync(projectsAlloyJMKFile, '\n' + fs.readFileSync(srcJMKFile, 'utf8'));
	}
}

function removeHook() {
	let updatedJMKFile = [];
	let originalJMKFile = fs.readFileSync(projectsAlloyJMKFile, 'utf8');
	let purgeCmdPresent = (originalJMKFile.includes('::PurgeTSS::'));

	if (purgeCmdPresent) {
		originalJMKFile.split(/\r?\n/).forEach((line) => {
			if (!line.includes("::PurgeTSS::")) {
				updatedJMKFile.push(line);
			} else if (!line.includes("//")) {
				updatedJMKFile.push(`\t//${line}`);
				logger.warn(chalk.yellow('Auto-Purging hook disabled!'));
			} else {
				updatedJMKFile.push(line);
				logger.warn(chalk.red('Auto-Purging hook already disabled!'));
			}
		});

		saveFile(projectsAlloyJMKFile, updatedJMKFile.join("\n"));
	}
}

function enableHook() {
	let updatedJMKFile = [];

	let originalJMKFile = fs.readFileSync(projectsAlloyJMKFile, 'utf8');

	originalJMKFile.split(/\r?\n/).forEach((line) => {
		if (line.includes("::PurgeTSS::")) {
			logger.warn(chalk.green('Auto-Purging hook enabled!'));
			line = line.replace(/\/\/\t/g, "");
		}

		updatedJMKFile.push(line);

		saveFile(projectsAlloyJMKFile, updatedJMKFile.join("\n"));
	});
}

function initIfNotConfig() {
	if (!fs.existsSync(projectsConfigJS)) {
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
		fs.copyFile(src, `${projectsFontsFolder}/${dest}`, callback);
		return true;
	}
}

function getViewPaths() {
	let viewPaths = [];

	//! Parse Views from App
	viewPaths.push(...glob.sync(cwd + '/app/views/**/*.xml'));

	//! Parse Views from Widgets  ( Experimental )
	if (configOptions.widgets && fs.existsSync(cwd + '/app/widgets/')) {
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
		allClasses.push(extractClassesOnly(fs.readFileSync(viewPath, 'utf8'), viewPath));
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

function getBaseValues(defaultTheme) {
	const defaultColors = require('tailwindcss/colors');
	const defaultThemeWidth = defaultTheme.width({ theme: () => (defaultTheme.spacing) });
	const defaultThemeHeight = defaultTheme.height({ theme: () => (defaultTheme.spacing) });

	removeDeprecatedColors(defaultColors);

	// !Prepare values
	let tiResets = { full: '100%' };
	let allWidthsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth };
	let allHeightsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeHeight };
	let allSpacingCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth, ...defaultThemeHeight };

	let themeOrDefaultValues = {
		width: configFile.theme.width ?? allWidthsCombined,
		height: configFile.theme.height ?? allHeightsCombined,
		spacing: configFile.theme.spacing ?? allSpacingCombined,
		fontSize: configFile.theme.spacing ?? defaultTheme.fontSize,
		colors: configFile.theme.colors ?? { transparent: 'transparent', ...defaultColors },
	}

	//! Remove unnecessary values
	removeFitMaxMin(themeOrDefaultValues);

	//! Merge with extend values
	let base = {
		width: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing, ...themeOrDefaultValues.width, ...configFile.theme.extend.width },
		height: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing, ...themeOrDefaultValues.height, ...configFile.theme.extend.height },
		colors: { ...themeOrDefaultValues.colors, ...configFile.theme.extend.colors },
		spacing: { ...themeOrDefaultValues.spacing, ...configFile.theme.extend.spacing },
		fontSize: { ...themeOrDefaultValues.fontSize, ...configFile.theme.extend.spacing, ...configFile.theme.extend.fontSize },
		columns: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
		delay: { 0: '0ms', 25: '25ms', 50: '50ms', 250: '250ms', 350: '350ms', 400: '400ms', 450: '450ms', 600: '600ms', 800: '800ms', 900: '900ms', 2000: '2000ms', 3000: '3000ms', 4000: '4000ms', 5000: '5000ms' }
	};

	fixPercentages(base.width);
	fixPercentages(base.height);
	fixPercentages(base.spacing);

	return base;
}

function combineAllValues(base, defaultTheme) {
	let allValues = {};

	//! Custom Window, View and ImageView
	allValues.Window = (configFile.theme.Window && configFile.theme.Window.apply)
		? _.merge({ apply: configFile.theme.Window.apply }, configFile.theme.Window)
		: _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window);

	allValues.ImageView = (configFile.theme.ImageView && configFile.theme.ImageView.apply)
		? _.merge({ apply: configFile.theme.ImageView.apply }, { ios: { hires: true } }, configFile.theme.ImageView)
		: _.merge({ ios: { hires: true } }, configFile.theme.ImageView);

	allValues.View = (configFile.theme.View && configFile.theme.View.apply)
		? _.merge({ apply: configFile.theme.View.apply }, configFile.theme.View)
		: _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View);

	//! Width, height and margin properties
	// INFO: sizingProperties: For glossary generator only... Do not move from this position.
	allValues.sizingProperties = {};

	allValues.height = base.height;
	allValues.width = base.width;
	allValues.margin = combineKeys(configFile.theme, base.spacing, 'margin');
	allValues.marginAlternate = combineKeys(configFile.theme, base.spacing, 'margin');

	//! Properties with constant values
	// INFO: constantProperties: For glossary generator only... Do not move from this position.
	allValues.constantProperties = {};

	// allValues.audioStreamType = {};
	// allValues.category = {};
	allValues.accessibilityHidden = {};
	allValues.accessoryType = {};
	allValues.activeIconIsMask = {};
	allValues.activityEnterTransition = {};
	allValues.activityExitTransition = {};
	allValues.activityIndicatorStyle = {};
	allValues.activityReenterTransition = {};
	allValues.activityReturnTransition = {};
	allValues.activitySharedElementEnterTransition = {};
	allValues.activitySharedElementExitTransition = {};
	allValues.activitySharedElementReenterTransition = {};
	allValues.activitySharedElementReturnTransition = {};
	allValues.alertDialogStyle = {};
	allValues.allowsBackForwardNavigationGestures = {};
	allValues.allowsLinkPreview = {};
	allValues.allowsMultipleSelectionDuringEditing = {};
	allValues.allowsMultipleSelectionInteraction = {};
	allValues.allowsSelection = {};
	allValues.allowsSelectionDuringEditing = {};
	allValues.allowUserCustomization = {};
	allValues.anchorPoint = {};
	allValues.autoAdjustScrollViewInsets = {};
	allValues.autocapitalization = {};
	allValues.autocorrect = {};
	allValues.autofillType = {};
	allValues.autoLink = {};
	allValues.autoreverse = {};
	allValues.autorotate = {};
	allValues.backgroundBlendMode = {};
	allValues.backgroundLinearGradient = {};
	allValues.backgroundRadialGradient = {};
	allValues.backgroundRepeat = {};
	allValues.borderStyle = {};
	allValues.bubbleParent = {};
	allValues.buttonStyle = {};
	allValues.cacheMode = {};
	allValues.cachePolicy = {};
	allValues.calendarViewShown = {};
	allValues.canCancelEvents = {};
	allValues.cancelable = {};
	allValues.canceledOnTouchOutside = {};
	allValues.canDelete = {};
	allValues.canEdit = {};
	allValues.canInsert = {};
	allValues.canMove = {};
	allValues.canScroll = {};
	allValues.caseInsensitiveSearch = {};
	allValues.checkable = {};
	allValues.clearButtonMode = {};
	allValues.clearOnEdit = {};
	allValues.clipMode = {};
	allValues.constraint = {};
	allValues.contentHeightAndWidth = {};
	allValues.curve = {};
	allValues.datePickerStyle = {};
	allValues.defaultItemTemplate = {};
	allValues.dimBackgroundForSearch = {};
	allValues.disableBounce = {};
	allValues.disableContextMenu = {};
	allValues.displayCaps = {};
	allValues.displayHomeAsUp = {};
	allValues.draggingType = {};
	allValues.drawerIndicatorEnabled = {};
	allValues.drawerLockMode = {};
	allValues.dropShadow = {};
	allValues.duration = {};
	allValues.editable = {};
	allValues.editing = {};
	allValues.ellipsize = {};
	allValues.enableCopy = {};
	allValues.enabled = {};
	allValues.enableJavascriptInterface = {};
	allValues.enableReturnKey = {};
	allValues.enableZoomControls = {};
	allValues.exitOnClose = {};
	allValues.extendBackground = {};
	allValues.extendEdges = {};
	allValues.extendSafeArea = {};
	allValues.fastScroll = {};
	allValues.filterAnchored = {};
	allValues.filterAttribute = {};
	allValues.filterCaseInsensitive = {};
	allValues.filterTouchesWhenObscured = {};
	allValues.flags = {};
	allValues.flagSecure = {};
	allValues.flip = {};
	allValues.focusable = {};
	allValues.fontStyle = {};
	allValues.footerDividersEnabled = {};
	allValues.format24 = {};
	allValues.fullscreen = {};
	allValues.gravity = {};
	allValues.gridColumnsRowsStartEnd = {};
	allValues.gridFlow = {};
	allValues.gridSystem = {};
	allValues.hasCheck = {};
	allValues.hasChild = {};
	allValues.hasDetail = {};
	allValues.headerDividersEnabled = {};
	allValues.hiddenBehavior = {};
	allValues.hideLoadIndicator = {};
	allValues.hidesBackButton = {};
	allValues.hidesBarsOnSwipe = {};
	allValues.hidesBarsOnTap = {};
	allValues.hidesBarsWhenKeyboardAppears = {};
	allValues.hideSearchOnSelection = {};
	allValues.hideShadow = {};
	allValues.hidesSearchBarWhenScrolling = {};
	allValues.hintType = {};
	allValues.hires = {};
	allValues.homeButtonEnabled = {};
	allValues.homeIndicatorAutoHidden = {};
	allValues.horizontalMargin = {};
	allValues.horizontalWrap = {};
	allValues.html = {};
	allValues.icon = {};
	allValues.iconified = {};
	allValues.iconifiedByDefault = {};
	allValues.iconIsMask = {};
	allValues.ignoreSslError = {};
	allValues.imageTouchFeedback = {};
	allValues.includeFontPadding = {};
	allValues.includeOpaqueBars = {};
	allValues.inputType = {};
	allValues.items = {};
	allValues.keepScreenOn = {};
	allValues.keepSectionsInSearch = {};
	allValues.keyboardAppearance = {};
	allValues.keyboardDismissMode = {};
	allValues.keyboardDisplayRequiresUserAction = {};
	allValues.keyboardType = {};
	allValues.largeTitleDisplayMode = {};
	allValues.largeTitleEnabled = {};
	allValues.layout = {};
	allValues.lazyLoadingEnabled = {};
	allValues.leftButtonMode = {};
	allValues.leftDrawerLockMode = {};
	allValues.lightTouchEnabled = {};
	allValues.listViewStyle = {};
	allValues.location = {};
	allValues.loginKeyboardType = {};
	allValues.loginReturnKeyType = {};
	allValues.mixedContentMode = {};
	allValues.modal = {};
	allValues.moveable = {};
	allValues.moving = {};
	allValues.nativeSpinner = {};
	allValues.navBarHidden = {};
	allValues.navigationMode = {};
	allValues.orientationModes = {};
	allValues.overlayEnabled = {};
	allValues.overrideCurrentAnimation = {};
	allValues.overScrollMode = {};
	allValues.pagingControlOnTop = {};
	allValues.passwordKeyboardType = {};
	allValues.passwordMask = {};
	allValues.pickerType = {};
	allValues.placement = {};
	allValues.pluginState = {};
	allValues.preventCornerOverlap = {};
	allValues.preventDefaultImage = {};
	allValues.previewActionStyle = {};
	allValues.progressBarStyle = {};
	allValues.progressIndicatorType = {};
	allValues.pruneSectionsOnEdit = {};
	allValues.requestedOrientation = {};
	allValues.resultsSeparatorStyle = {};
	allValues.returnKeyType = {};
	allValues.reverse = {};
	allValues.rightButtonMode = {};
	allValues.rightDrawerLockMode = {};
	allValues.scalesPageToFit = {};
	allValues.scrollable = {};
	allValues.scrollIndicators = {};
	allValues.scrollIndicatorStyle = {};
	allValues.scrollingEnabled = {};
	allValues.scrollsToTop = {};
	allValues.scrollType = {};
	allValues.searchAsChild = {};
	allValues.searchBarStyle = {};
	allValues.searchHidden = {};
	allValues.selectionGranularity = {};
	allValues.selectionOpens = {};
	allValues.selectionStyle = {};
	allValues.separatorStyle = {};
	allValues.shiftMode = {};
	allValues.showAsAction = {};
	allValues.showBookmark = {};
	allValues.showCancel = {};
	allValues.showHorizontalScrollIndicator = {};
	allValues.showPagingControl = {};
	allValues.showSearchBarInNavBar = {};
	allValues.showSelectionCheck = {};
	allValues.showUndoRedoActions = {};
	allValues.showVerticalScrollIndicator = {};
	allValues.smoothScrollOnTabClick = {};
	allValues.statusBarStyle = {};
	allValues.submitEnabled = {};
	allValues.suppressReturn = {};
	allValues.sustainedPerformanceMode = {};
	allValues.swipeToClose = {};
	allValues.switchStyle = {};
	allValues.systemButton = {};
	allValues.tabBarHidden = {};
	allValues.tabbedBarStyle = {};
	allValues.tabGroupStyle = {};
	allValues.tableViewStyle = {};
	allValues.tabsTranslucent = {};
	allValues.textAlign = {};
	allValues.theme = {};
	allValues.tiMedia = {};
	allValues.titleAttributesShadow = {};
	allValues.toolbarEnabled = {};
	allValues.touchEnabled = {};
	allValues.touchFeedback = {};
	allValues.transition = {};
	allValues.translucent = {};
	allValues.useCompatPadding = {};
	allValues.useSpinner = {};
	allValues.verticalAlign = {};
	allValues.verticalBounce = {};
	allValues.verticalMargin = {};
	allValues.viewShadow = {};
	allValues.visible = {};
	allValues.willHandleTouches = {};
	allValues.willScrollOnStatusTap = {};
	allValues.windowPixelFormat = {};
	allValues.windowSoftInputMode = {};
	allValues.wobble = {};

	//! Configurable properties
	// INFO: configurableProperties: For glossary generator only... Do not move from this position.
	allValues.configurableProperties = {};

	allValues.activeTab = combineKeys(configFile.theme, base.columns, 'activeTab');
	allValues.backgroundLeftCap = combineKeys(configFile.theme, base.spacing, 'backgroundLeftCap');
	allValues.backgroundPaddingBottom = combineKeys(configFile.theme, base.height, 'backgroundPaddingBottom');
	allValues.backgroundPaddingLeft = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingLeft');
	allValues.backgroundPaddingRight = combineKeys(configFile.theme, base.spacing, 'backgroundPaddingRight');
	allValues.backgroundPaddingTop = combineKeys(configFile.theme, base.height, 'backgroundPaddingTop');
	allValues.backgroundTopCap = combineKeys(configFile.theme, base.spacing, 'backgroundTopCap');
	allValues.borderRadius = helpers.processBorderRadius(helpers.removeFractions((configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, ['full', 'auto', 'screen']));
	allValues.borderWidth = combineKeys(configFile.theme, defaultTheme.borderWidth, 'borderWidth');
	allValues.bottomNavigation = combineKeys(configFile.theme, base.spacing, 'bottomNavigation');
	allValues.cacheSize = combineKeys(configFile.theme, base.columns, 'cacheSize');
	allValues.columnCount = combineKeys(configFile.theme, base.columns, 'columnCount');
	allValues.contentHeight = combineKeys(configFile.theme, base.height, 'contentHeight');
	allValues.contentWidth = combineKeys(configFile.theme, base.width, 'contentWidth');
	allValues.countDownDuration = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDuration }, 'countDownDuration');
	allValues.elevation = combineKeys(configFile.theme, base.spacing, 'elevation');
	allValues.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily');
	allValues.fontSize = combineKeys(configFile.theme, base.fontSize, 'fontSize');
	allValues.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight');
	allValues.gap = combineKeys(configFile.theme, base.spacing, 'margin');
	allValues.indentionLevel = combineKeys(configFile.theme, base.spacing, 'indentionLevel');
	allValues.keyboardToolbarHeight = combineKeys(configFile.theme, base.height, 'keyboardToolbarHeight');
	allValues.leftButtonPadding = combineKeys(configFile.theme, base.spacing, 'leftButtonPadding');
	allValues.leftWidth = combineKeys(configFile.theme, base.width, 'leftWidth');
	allValues.lines = combineKeys(configFile.theme, base.columns, 'lines');
	allValues.maxElevation = combineKeys(configFile.theme, base.spacing, 'maxElevation');
	allValues.maxLines = combineKeys(configFile.theme, base.columns, 'maxLines');
	allValues.maxRowHeight = combineKeys(configFile.theme, base.height, 'maxRowHeight');
	allValues.maxZoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'maxZoomScale');
	allValues.minimumFontSize = combineKeys(configFile.theme, defaultTheme.fontSize, 'minimumFontSize');
	allValues.minRowHeight = combineKeys(configFile.theme, base.height, 'minRowHeight');
	allValues.minZoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'minZoomScale');
	allValues.offsets = combineKeys(configFile.theme, base.height, 'offsets');
	allValues.opacity = combineKeys(configFile.theme, defaultTheme.opacity, 'opacity');
	allValues.padding = combineKeys(configFile.theme, base.spacing, 'padding');
	allValues.pagingControlAlpha = combineKeys(configFile.theme, defaultTheme.opacity, 'pagingControlAlpha');
	allValues.pagingControlHeight = combineKeys(configFile.theme, base.height, 'pagingControlHeight');
	allValues.pagingControlTimeout = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'pagingControlTimeout');
	allValues.repeat = combineKeys(configFile.theme, base.columns, 'repeat');
	allValues.repeatCount = combineKeys(configFile.theme, base.columns, 'repeatCount');
	allValues.rightButtonPadding = combineKeys(configFile.theme, base.spacing, 'rightButtonPadding');
	allValues.rightWidth = combineKeys(configFile.theme, base.width, 'rightWidth');
	allValues.rotate = combineKeys(configFile.theme, defaultTheme.rotate, 'rotate');
	allValues.rowCount = combineKeys(configFile.theme, base.columns, 'rowCount');
	allValues.rowHeight = combineKeys(configFile.theme, base.height, 'rowHeight');
	allValues.scale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'scale');
	allValues.sectionHeaderTopPadding = combineKeys(configFile.theme, base.height, 'sectionHeaderTopPadding');
	allValues.separatorHeight = combineKeys(configFile.theme, base.height, 'separatorHeight');
	allValues.shadowRadius = combineKeys(configFile.theme, base.spacing, 'shadowRadius');
	allValues.timeout = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'timeout');
	allValues.transitionDelay = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDelay }, 'transitionDelay');
	allValues.transitionDuration = combineKeys(configFile.theme, { ...base.delay, ...defaultTheme.transitionDuration }, 'transitionDuration');
	allValues.zIndex = combineKeys(configFile.theme, defaultTheme.zIndex, 'zIndex');
	allValues.zoomScale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'zoomScale');

	//! Color related properties
	// INFO: colorProperties: For glossary generator only... Do not move from this position.
	allValues.colorProperties = {};

	allValues.activeTintColor = combineKeys(configFile.theme, base.colors, 'activeTintColor');
	allValues.activeTitleColor = combineKeys(configFile.theme, base.colors, 'activeTitleColor');
	allValues.backgroundColor = combineKeys(configFile.theme, base.colors, 'backgroundColor');
	allValues.backgroundDisabledColor = combineKeys(configFile.theme, base.colors, 'backgroundDisabledColor');
	allValues.backgroundFocusedColor = combineKeys(configFile.theme, base.colors, 'backgroundFocusedColor');
	allValues.backgroundGradient = combineKeys(configFile.theme, base.colors, 'backgroundGradient');
	allValues.backgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'backgroundSelectedColor');
	allValues.backgroundSelectedGradient = combineKeys(configFile.theme, base.colors, 'backgroundSelectedGradient');
	allValues.badgeColor = combineKeys(configFile.theme, base.colors, 'badgeColor');
	allValues.barColor = combineKeys(configFile.theme, base.colors, 'barColor');
	allValues.borderColor = combineKeys(configFile.theme, base.colors, 'borderColor');
	allValues.currentPageIndicatorColor = combineKeys(configFile.theme, base.colors, 'currentPageIndicatorColor');
	allValues.dateTimeColor = combineKeys(configFile.theme, base.colors, 'dateTimeColor');
	allValues.disabledColor = combineKeys(configFile.theme, base.colors, 'disabledColor');
	allValues.highlightedColor = combineKeys(configFile.theme, base.colors, 'highlightedColor');
	allValues.hintTextColor = combineKeys(configFile.theme, base.colors, 'hintTextColor');
	allValues.imageTouchFeedbackColor = combineKeys(configFile.theme, base.colors, 'imageTouchFeedbackColor');
	allValues.indicatorColor = combineKeys(configFile.theme, base.colors, 'indicatorColor');
	allValues.keyboardToolbarColor = combineKeys(configFile.theme, base.colors, 'keyboardToolbarColor');
	allValues.navTintColor = combineKeys(configFile.theme, base.colors, 'navTintColor');
	allValues.onTintColor = combineKeys(configFile.theme, base.colors, 'onTintColor');
	allValues.pageIndicatorColor = combineKeys(configFile.theme, base.colors, 'pageIndicatorColor');
	allValues.pagingControlColor = combineKeys(configFile.theme, base.colors, 'pagingControlColor');
	allValues.placeholder = combineKeys(configFile.theme, base.colors, 'placeholder');
	allValues.pullBackgroundColor = combineKeys(configFile.theme, base.colors, 'pullBackgroundColor');
	allValues.resultsBackgroundColor = combineKeys(configFile.theme, base.colors, 'resultsBackgroundColor');
	allValues.resultsSeparatorColor = combineKeys(configFile.theme, base.colors, 'resultsSeparatorColor');
	allValues.selectedButtonColor = combineKeys(configFile.theme, base.colors, 'selectedButtonColor');
	allValues.selectedColor = combineKeys(configFile.theme, base.colors, 'selectedColor');
	allValues.selectedSubtitleColor = combineKeys(configFile.theme, base.colors, 'selectedSubtitleColor');
	allValues.selectedTextColor = combineKeys(configFile.theme, base.colors, 'selectedTextColor');
	allValues.separatorColor = combineKeys(configFile.theme, base.colors, 'separatorColor');
	allValues.shadowColor = combineKeys(configFile.theme, base.colors, 'shadowColor');
	allValues.subtitleColor = combineKeys(configFile.theme, base.colors, 'subtitleColor');
	allValues.tabsBackgroundColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundColor');
	allValues.tabsBackgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundSelectedColor');
	allValues.textColor = combineKeys(configFile.theme, base.colors, 'textColor');
	allValues.thumbTintColor = combineKeys(configFile.theme, base.colors, 'thumbTintColor');
	allValues.tintColor = combineKeys(configFile.theme, base.colors, 'tintColor');
	allValues.titleAttributesColor = combineKeys(configFile.theme, base.colors, 'titleAttributesColor');
	allValues.titleAttributesShadowColor = combineKeys(configFile.theme, base.colors, 'titleAttributesShadowColor');
	allValues.titleColor = combineKeys(configFile.theme, base.colors, 'titleColor');
	allValues.titleTextColor = combineKeys(configFile.theme, base.colors, 'titleTextColor');
	allValues.touchFeedbackColor = combineKeys(configFile.theme, base.colors, 'touchFeedbackColor');
	allValues.trackTintColor = combineKeys(configFile.theme, base.colors, 'trackTintColor');
	allValues.viewShadowColor = combineKeys(configFile.theme, base.colors, 'viewShadowColor');

	// !Some final cleanup
	delete configFile.theme.extend;
	delete configFile.theme.colors;
	delete configFile.theme.spacing;

	if (!Object.keys(allValues.fontFamily).length) {
		delete allValues.fontFamily;
		delete configFile.theme.fontFamily;
	}

	// !Delete corePlugins specified in the config file
	let corePlugins = Array.isArray(configFile.corePlugins) ? configFile.corePlugins : Object.keys(configFile.corePlugins).map(key => key);
	_.each(corePlugins, value => {
		delete allValues[value];
		delete configFile.theme[value];
	});

	_.each(allValues, (_value, key) => {
		delete configFile.theme[key];
	});

	return allValues;
}

//! Build Tailwind ( AUTO )
function buildTailwind(options) {
	helpers.globalOptions.legacy = configOptions.legacy;
	require('./experimental/completions2').autoBuildTailwindTSS(options);
}
module.exports.buildTailwind = buildTailwind;

//! Build Tailwind ( LEGACY )
function buildTailwindLegacy() {
	helpers.globalOptions.legacy = true;
	const defaultTheme = require('tailwindcss/defaultTheme');

	let allValuesCombined = combineAllValues(getBaseValues(defaultTheme), defaultTheme);

	let tailwindStyles = fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/template.tss'), 'utf8');
	tailwindStyles += fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/custom-template.tss'), 'utf8');
	tailwindStyles += (fs.existsSync(projectsConfigJS)) ? `// config.js file updated on: ${getFileUpdatedDate(projectsConfigJS)}\n` : `// default config.js file\n`;

	if (Object.keys(configFile.theme).length) {
		tailwindStyles += '\n// Custom Styles\n';
		_.each(configFile.theme, (value, key) => {
			tailwindStyles += helperToBuildTailwindClasses(key, value);
		});
	}

	tailwindStyles += '\n// Resets\n';

	//! Generate glossary files
	let distributionFolder = !fs.existsSync(projectsConfigJS);

	if (distributionFolder) {
		var destinationFolder = path.resolve(__dirname, './dist/glossary-legacy/');
		makeSureFolderExists(destinationFolder);
	}

	let menuPosition = 1;
	_.each(allValuesCombined, (value, key) => {
		if (key.includes('Properties') && distributionFolder) {
			destinationFolder = path.resolve(__dirname, './dist/glossary-legacy/' + key);
			makeSureFolderExists(destinationFolder);
			fs.writeFileSync(destinationFolder + '/_category_.json', `{ "label": "${key}", "position": ${menuPosition} }`);
			menuPosition++;
		} else {
			let theClasses = helperToBuildTailwindClasses(key, value);

			if (destinationFolder) {
				fs.writeFileSync(`${destinationFolder}/${key}.md`, '```scss' + theClasses + '```');
			}

			tailwindStyles += theClasses;
		}
	});

	//! Compile @apply properties
	let finalTailwindStyles = helpers.compileApplyDirectives(tailwindStyles);

	if (fs.existsSync(projectsConfigJS)) {
		fs.writeFileSync(projectsTailwind_TSS, finalTailwindStyles);
		logger.file('./purgetss/tailwind.tss', '( Legacy )');
	} else {
		fs.writeFileSync(srcTailwindTSS, finalTailwindStyles);
		logger.file('./dist/tailwind.tss', '( Legacy )');
	}
}
module.exports.buildTailwindLegacy = buildTailwindLegacy;

function buildTailwindBasedOnConfigOptions(options = {}) {
	if (configOptions.legacy) {
		buildTailwindLegacy();
	} else {
		buildTailwind(options);
	}
}

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

	// read classes from _app.tss file
	_.each(getFiles(cwd + '/app/styles').filter(file => file.endsWith('.tss') && file.endsWith('_app.tss')), file => {
		classDefinitions += fs.readFileSync(file, 'utf8');
	});

	if (fs.existsSync(projectsTailwind_TSS)) {
		classDefinitions += fs.readFileSync(projectsTailwind_TSS, 'utf8');
	}

	if (configOptions.widgets && fs.existsSync(cwd + '/app/widgets/')) {
		_.each(getFiles(cwd + '/app/widgets').filter(file => file.endsWith('.tss')), file => {
			classDefinitions += fs.readFileSync(file, 'utf8');
		});
	}

	//! Get Styles from Themes  ( Experimental )
	if (fs.existsSync(cwd + '/app/themes/')) {
		_.each(getFiles(cwd + '/app/themes').filter(file => file.endsWith('.tss')), file => {
			classDefinitions += fs.readFileSync(file, 'utf8');
		});
	}

	if (fs.existsSync(cwd + '/purgetss/fonts.tss')) {
		classDefinitions += fs.readFileSync(cwd + '/purgetss/fonts.tss', 'utf8');
	}

	classDefinitions += (fs.existsSync(projectsFA_TSS_File)) ? fs.readFileSync(projectsFA_TSS_File, 'utf8') : fs.readFileSync(srcFontAwesomeTSSFile, 'utf8');

	classDefinitions += fs.readFileSync(srcFramework7FontTSSFile, 'utf8');

	classDefinitions += fs.readFileSync(srcMaterialDesignIconsTSSFile, 'utf8');

	classDefinitions = classDefinitions
		.replace(/\/\/[^\n]*\n/g, '')
		.replace(/\/\*\*\n([\s\S]*?)\*\//gm, '')
		.replace(/\{[\s\S]*?\}/gm, '{ }')
		.replace(/{(.*)}/g, '{}')
		.replace(/\[(.*)\]/g, '')
		.replace(/[:'"]/g, '')
		.replace(/^[a-zA-Z].*$/gm, '')
		.replace(/\s/g, '');

	classDefinitions += '.ios{}.android{}.handheld{}.tablet{}.open{}.close{}.complete{}.drag{}.drop{}.bounds{}';

	fs.writeFileSync(cwd + '/purgetss/definitions.css', `/* Class definitions (v6.x) */${classDefinitions}`);

	logger.file('./purgetss/definitions.css');
}

//! Build tailwind's custom values
function helperToBuildTailwindClasses(key, value) {
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

function extractClassesOnly(currentText, currentFile) {
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
	makeSureFolderExists(projectsFontsFolder);

	switch (vendor) {
		case 'fa':
		case 'font':
		case 'fontawesome':
			if (fs.existsSync(srcFA_Beta_CSSFile)) {
				copyProFonts(srcFA_Beta_FontFamilies, srcFA_Beta_Web_Fonts_Folder);
			} else if (fs.existsSync(srcFA_Pro_CSS)) {
				copyProFonts(srcFA_ProFontFamilies, srcFA_Pro_Web_Fonts_Folder);
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
			if (fs.existsSync(srcFA_Beta_CSSFile) || fs.existsSync(srcFA_Pro_CSS)) {
				buildFontAwesomeJS();
			} else {
				fs.copyFileSync(srcLibFA, projectsLibFolder + '/fontawesome.js');
				logger.info('FontAwesome CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			}
			break;
		case 'md':
		case 'material':
		case 'materialdesign':
			fs.copyFileSync(srcLibMD, projectsLibFolder + '/materialdesignicons.js');
			logger.info('Material Design CommonJS module copied to', chalk.yellow('./app/lib'), 'folder');
			break;
		case 'f7':
		case 'framework':
		case 'framework7':
			fs.copyFileSync(srcLibF7, projectsLibFolder + '/framework7icons.js');
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
	if (!fs.existsSync(projects_AppTSS) && fs.existsSync(projectsAppTSS)) {
		logger.warn('Backing up app.tss into _app.tss\n             FROM NOW ON, add, update or delete your original classes in _app.tss');
		fs.copyFileSync(projectsAppTSS, projects_AppTSS);
	} else if (!fs.existsSync(projects_AppTSS)) {
		fs.appendFileSync(projects_AppTSS, '// Empty _app.tss\n');
	}
}

//! Copy Reset template
function copyResetTemplateAnd_appTSS() {
	localStart();

	logger.info('Copying Reset styles...');

	let tempPurged = fs.readFileSync(srcReset_TSS_File, 'utf8');

	if (fs.existsSync(projects_AppTSS)) {
		let appTSSContent = fs.readFileSync(projects_AppTSS, 'utf8');

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
}

function finish(customMessage = 'Finished purging in') {
	let endTime = new Date(new Date() - startTime);
	logger.info(customMessage, chalk.green(`${endTime.getSeconds()}s ${endTime.getMilliseconds()}ms`));
}

let localStartTime;
function localStart() {
	localStartTime = new Date();
}

function localFinish(customMessage = 'Finished purging in') {
	let localEndTime = new Date(new Date() - localStartTime);
	if (purgingDebug) logger.info(customMessage, chalk.green(`${localEndTime.getSeconds()}s ${localEndTime.getMilliseconds()}ms`));
}

//! Purge Functions
//! Tailwind
function purgeTailwind(uniqueClasses) {
	localStart();

	let purgedClasses = '\n// Main styles\n';
	let tailwindClasses = fs.readFileSync(projectsTailwind_TSS, 'utf8').split(/\r?\n/);

	if (`// config.js file updated on: ${getFileUpdatedDate(projectsConfigJS)}` !== tailwindClasses[6]) {
		logger.info(chalk.yellow('config.js'), 'file changed!, rebuilding tailwind.tss...');
		buildTailwindBasedOnConfigOptions();
		createDefinitionsFile();
		tailwindClasses = fs.readFileSync(projectsTailwind_TSS, 'utf8').split(/\r?\n/);
	}

	let cleanUniqueClasses = [];
	let classesWithOpacityValues = [];

	let arbitraryValues = '\n// Styles with arbitrary values\n';

	uniqueClasses.forEach((className, index) => {
		let cleanClassName = cleanClassNameFn(className);

		//TODO: Check if cleanClassName is a complex class ( several classes separated by : )
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

	logger.info('Purging', chalk.yellow('Tailwind'), 'styles...')

	let mensaje = 'Purging ' + chalk.yellow('Tailwind') + ' styles...';

	localFinish(mensaje);

	return purgedClasses;
}

function cleanClassNameFn(className) {
	return className.replace('ios:', '').replace('android:', '').replace('handheld:', '').replace('tablet:', '').replace('open:', '').replace('close:', '').replace('complete:', '').replace('drag:', '').replace('drop:', '').replace('bounds:', '');
}

//! FontAwesome
function purgeFontAwesome(uniqueClasses, cleanUniqueClasses) {
	let fontAwesome = false;

	// check if fonts.tss exists and if it includes Font Awesome
	if (fs.existsSync(cwd + '/purgetss/fonts.tss')) {
		let fontsTSS = fs.readFileSync(cwd + '/purgetss/fonts.tss', 'utf8');
		fontAwesome = fontsTSS.includes('Font Awesome');
	}

	if (!fontAwesome) {
		let sourceFolder = '';
		let purgedClasses = '';
		let purgingMessage = '';

		if (fs.existsSync(projectsFA_TSS_File)) {
			sourceFolder = projectsFA_TSS_File;
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

function purgeFontIcons(sourceFolder, uniqueClasses, message, cleanUniqueClasses, _prefixes) {
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
	fs.copyFileSync(srcJMKFile, projectsAlloyJMKFile);
	logger.file('./app/alloy.jmk');
	addHook();
}

//! Soon to be deleted
