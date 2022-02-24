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
const projecrFontAwesomeTSS = cwd + '/purgetss/fontawesome.tss';

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
const srcJMKFile = path.resolve(__dirname, './lib/templates/alloy.jmk');

const srcFontAwesomeTSSFile = path.resolve(__dirname, './dist/fontawesome.tss');
const srcFramework7FontTSSFile = path.resolve(__dirname, './dist/framework7icons.tss');
const srcMaterialDesignIconsTSSFile = path.resolve(__dirname, './dist/materialdesignicons.tss');

const srcConfigFile = path.resolve(__dirname, './lib/templates/purgetss.config.js');

//! Interfase

//! Command: purgetss
function purgeClasses(options) {
	if (alloyProject()) {
		start();

		if (!fs.existsSync(projectConfigJS)) {
			init();
		}

		if (!fs.existsSync(projectTailwindTSS)) {
			buildCustomTailwind('file created!');
		}

		if (isInstalledGlobally) {
			if (fs.existsSync(projectAlloyJMKFile)) {
				if (!fs.readFileSync(projectAlloyJMKFile, 'utf8').includes('::PurgeTSS::')) {
					addHook();
				}
			} else {
				createJMKFile();
			}
		} else {
			logger.error('Please install PurgeTSS globally!');
		}

		backupOriginalAppTss();

		let uniqueClasses = getUniqueClasses();

		let tempPurged = copyResetTemplateAnd_appTSS();

		tempPurged += purgeTailwind(uniqueClasses);

		let cleanUniqueClasses = cleanClasses(uniqueClasses);

		tempPurged += purgeFontAwesome(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeMaterialDesign(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeFramework7(uniqueClasses, cleanUniqueClasses);

		tempPurged += purgeCustomFonts(uniqueClasses, cleanUniqueClasses);

		let missingClasses = getMissingClasses(tempPurged);

		if (missingClasses.length > 0) {
			tempPurged += '\n';
			tempPurged += '// Unused or unsupported classes\n';

			_.each(missingClasses, (missingClass) => {
				tempPurged += `'.${missingClass}': { }\n`;
			});
		}

		saveFile(projectAppTSS, tempPurged);

		logger.file('app.tss');

		finish();
	}
}
module.exports.purgeClasses = purgeClasses;

//! Command: watch
function watchMode(options) {
	if (alloyProject() && isInstalledGlobally) {
		if (fs.existsSync(projectAlloyJMKFile)) {
			//! TODO: Refactor with readline or line-reader: https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
			if (options.off) {
				removeHook();
			} else if (!fs.readFileSync(projectAlloyJMKFile, 'utf8').includes('purgetss')) {
				addHook();
			} else if (fs.readFileSync(projectAlloyJMKFile, 'utf8').includes("//\trequire('child_process').execSync('purgetss")) {
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
		logger.info('PurgeTSS modules copied to', chalk.yellow('./app/lib'), 'folder');
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
function init() {
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

				tssClasses += `\n'.${getFileName(file).toLowerCase()}': { font: { fontFamily: '${fontMeta.postScriptName.replace(/\//g, '')}' } }\n`;

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
			console.log();

			finish(`Finished building ${chalk.yellow('fonts.tss')} in`);

			createDefinitionsFile();
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

		fs.writeFileSync(projecrFontAwesomeTSS, tssClasses, err => {
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
	return file.split('/').pop().split('.').shift();
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

		let sourceTSS = fs.readFileSync(cwd + '/purgetss/fonts.tss', 'utf8').split(/\r?\n/);

		purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, 'Purging Custom Fonts styles...', cleanUniqueClasses, []);

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
function getMissingClasses(tempPurged) {
	_.each(getFiles(cwd + '/app/styles').filter(file => file.endsWith('.tss') && !file.endsWith('app.tss')), file => {
		tempPurged += '\n' + fs.readFileSync(file, 'utf8');
	});

	return getOnlyClassesFromXMLFiles().filter(item => !tempPurged.includes(item));
}

function addHook() {
	logger.warn(chalk.green('Adding Auto-Purging hook!'));
	let originalJMKFile = fs.readFileSync(projectAlloyJMKFile, 'utf8');

	if (originalJMKFile.includes('pre:compile')) {
		let updatedJMKFile = [];

		originalJMKFile.split(/\r?\n/).forEach((line) => {
			if (line.includes('pre:compile')) {
				line += "\n\trequire('child_process').execSync('purgetss', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));";
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

		saveFile(projectAlloyJMKFile, updatedJMKFile.join("\n"));
	}
}

function enableHook() {
	let updatedJMKFile = [];

	let originalJMKFile = fs.readFileSync(projectAlloyJMKFile, 'utf8');

	originalJMKFile.split(/\r?\n/).forEach((line) => {
		if (line.includes("require('child_process').execSync('purgetss")) {
			logger.warn(chalk.green('Auto-Purging hook enabled!'));
			line = line.replace(/\/\/\t/g, "");
		}

		updatedJMKFile.push(line);

		saveFile(projectAlloyJMKFile, updatedJMKFile.join("\n"));
	});
}

function initIfNotConfig() {
	if (!fs.existsSync(projectConfigJS)) {
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
		// if (!fs.existsSync(`${projectFontsFolder}/${dest}`)) {
		fs.copyFile(src, `${projectFontsFolder}/${dest}`, callback);
		return true;
		// }
	}
}

function getOnlyClassesFromXMLFiles() {
	let viewPaths = [];

	readAllXMLFiles(cwd + '/app/views', viewPath => {
		viewPaths.push(viewPath);
	});

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
	let configFile = (fs.existsSync(projectConfigJS)) ? require(projectConfigJS) : false;

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
	let iAmInProjectFolder = fs.existsSync(projectConfigJS);
	let configFile = (iAmInProjectFolder) ? require(projectConfigJS) : require(srcConfigFile);

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

	//! Process custom Window, View and ImageView
	if (configFile.theme.Window && configFile.theme.Window.apply) {
		let theApply = configFile.theme.Window.apply;
		delete configFile.theme.Window.apply;
		configFile.theme['Window'] = _.merge({ apply: theApply }, configFile.theme.Window);
	} else {
		configFile.theme['Window'] = _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window);
	}

	if (configFile.theme.ImageView && configFile.theme.ImageView.apply) {
		let theApply = configFile.theme.ImageView.apply;
		delete configFile.theme.ImageView.apply;
		configFile.theme['ImageView'] = _.merge({ apply: theApply }, { ios: { hires: true } }, configFile.theme.ImageView);
	} else {
		configFile.theme['ImageView'] = _.merge({ ios: { hires: true } }, configFile.theme.ImageView);
	}

	if (configFile.theme.View && configFile.theme.View.apply) {
		let theApply = configFile.theme.View.apply;
		delete configFile.theme.View.apply;
		configFile.theme['View'] = _.merge({ apply: theApply }, configFile.theme.View);
	} else {
		configFile.theme['View'] = _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View);
	}

	let defaultBorderRadius = (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing };

	// Some clean up
	// pagingControlHeight
	delete base.height['fit'];
	delete base.height['max'];
	delete base.height['min'];
	delete base.height['min-content'];
	delete base.height['max-content'];

	//! Width, height and margin properties
	configFile.theme.height = base.height;
	configFile.theme.width = base.width;
	configFile.theme.margin = combineKeys(configFile.theme, base.spacing, 'margin');

	//! Properties with constant values
	configFile.theme.accessibilityHidden = {};
	configFile.theme.activeIconIsMask = {};
	configFile.theme.activityEnterTransition = {};
	configFile.theme.activityExitTransition = {};
	configFile.theme.activityIndicatorStyle = {};
	configFile.theme.activityReenterTransition = {};
	configFile.theme.activityReturnTransition = {};
	configFile.theme.activitySharedElementEnterTransition = {};
	configFile.theme.activitySharedElementExitTransition = {};
	configFile.theme.activitySharedElementReenterTransition = {};
	configFile.theme.activitySharedElementReturnTransition = {};
	configFile.theme.alertDialogStyle = {};
	configFile.theme.allowUserCustomization = {};
	configFile.theme.animationStyle = {};
	configFile.theme.autoAdjustScrollViewInsets = {};
	configFile.theme.autocapitalization = {};
	configFile.theme.autocorrect = {};
	configFile.theme.autofillType = {};
	configFile.theme.autoLink = {};
	configFile.theme.autoreverse = {};
	configFile.theme.backgroundBlendMode = {};
	configFile.theme.backgroundLinearGradient = {};
	configFile.theme.backgroundRadialGradient = {};
	configFile.theme.backgroundRepeat = {};
	configFile.theme.borderStyle = {};
	configFile.theme.bubbleParent = {};
	configFile.theme.buttonStyle = {};
	configFile.theme.cacheSize = {};
	configFile.theme.canDelete = {};
	configFile.theme.clipMode = {};
	configFile.theme.disableBounce = {};
	configFile.theme.displayCaps = {};
	configFile.theme.displayHomeAsUp = {};
	configFile.theme.displayUtilities = {};
	configFile.theme.draggingConstraints = {};
	configFile.theme.draggingType = {};
	configFile.theme.drawerIndicatorEnabled = {};
	configFile.theme.drawerLockMode = {};
	configFile.theme.dropShadow = {};
	configFile.theme.editable = {};
	configFile.theme.ellipsize = {};
	configFile.theme.enableCopy = {};
	configFile.theme.enabled = {};
	configFile.theme.enableReturnKey = {};
	configFile.theme.enableZoomControls = {};
	configFile.theme.exitOnClose = {};
	configFile.theme.extendBackground = {};
	configFile.theme.extendEdges = {};
	configFile.theme.extendSafeArea = {};
	configFile.theme.flagSecure = {};
	configFile.theme.flip = {};
	configFile.theme.fontStyle = {};
	configFile.theme.fullscreen = {};
	configFile.theme.gridColumnsStartEnd = {};
	configFile.theme.gridFlow = {};
	configFile.theme.gridSystem = {};
	configFile.theme.hidesBackButton = {};
	configFile.theme.hidesBarsOnSwipe = {};
	configFile.theme.hidesBarsOnTap = {};
	configFile.theme.hidesBarsWhenKeyboardAppears = {};
	configFile.theme.hideShadow = {};
	configFile.theme.hidesSearchBarWhenScrolling = {};
	configFile.theme.hires = {};
	configFile.theme.homeButtonEnabled = {};
	configFile.theme.homeIndicatorAutoHidden = {};
	configFile.theme.html = {};
	configFile.theme.iconified = {};
	configFile.theme.iconifiedByDefault = {};
	configFile.theme.iconIsMask = {};
	configFile.theme.includeOpaqueBars = {};
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
	configFile.theme.leftDrawerLockMode = {};
	configFile.theme.listViewStyle = {};
	configFile.theme.loginKeyboardType = {};
	configFile.theme.loginReturnKeyType = {};
	configFile.theme.modal = {};
	configFile.theme.navBarHidden = {};
	configFile.theme.orientationModes = {};
	configFile.theme.origin = {};
	configFile.theme.overlayEnabled = {};
	configFile.theme.pagingControl = {};
	configFile.theme.pagingControlOnTop = {};
	configFile.theme.passwordKeyboardType = {};
	configFile.theme.pickerType = {};
	configFile.theme.placement = {};
	configFile.theme.preventCornerOverlap = {};
	configFile.theme.preventDefaultImage = {};
	configFile.theme.previewActionStyle = {};
	configFile.theme.progressBarStyle = {};
	configFile.theme.progressIndicatorCancelable = {};
	configFile.theme.progressIndicatorCancelOnTouchOutside = {};
	configFile.theme.progressIndicatorLocation = {};
	configFile.theme.progressIndicatorType = {};
	configFile.theme.repeat = {};
	configFile.theme.requestOrientation = {};
	configFile.theme.returnKeyType = {};
	configFile.theme.rightDrawerLockMode = {};
	configFile.theme.rowAndColumnCount = {};
	configFile.theme.scrollableRegion = {};
	configFile.theme.scrollIndicators = {};
	configFile.theme.scrollIndicatorStyle = {};
	configFile.theme.scrollingEnabled = {};
	configFile.theme.scrollsToTop = {};
	configFile.theme.scrollType = {};
	configFile.theme.searchBarStyle = {};
	configFile.theme.selectionStyle = {};
	configFile.theme.separatorStyle = {};
	configFile.theme.shiftMode = {};
	configFile.theme.showAsAction = {};
	configFile.theme.showBookmark = {};
	configFile.theme.showCancel = {};
	configFile.theme.showSearchBarInNavBar = {};
	configFile.theme.smoothScrollOnTabClick = {};
	configFile.theme.statusBarStyle = {};
	configFile.theme.submitEnabled = {};
	configFile.theme.sustainedPerformanceMode = {};
	configFile.theme.swipeToClose = {};
	configFile.theme.switchStyle = {};
	configFile.theme.systemButton = {};
	configFile.theme.tabBarHidden = {};
	configFile.theme.tabbedBarStyle = {};
	configFile.theme.tabGroupStyle = {};
	configFile.theme.tableViewStyle = {};
	configFile.theme.tabsTranslucent = {};
	configFile.theme.textAlign = {};
	configFile.theme.theme = {};
	configFile.theme.tiMedia = {};
	configFile.theme.titleAttributesShadow = {};
	configFile.theme.toolbarEnabled = {};
	configFile.theme.touchEnabled = {};
	configFile.theme.touchFeedback = {};
	configFile.theme.transition = {};
	configFile.theme.translucent = {};
	configFile.theme.useCompatPadding = {};
	configFile.theme.useSpinner = {};
	configFile.theme.verticalAlign = {};
	configFile.theme.viewShadow = {};
	configFile.theme.windowPixelFormat = {};
	configFile.theme.windowSoftInputMode = {};
	configFile.theme.wobble = {};

	//! Configurable properties
	configFile.theme.borderRadius = combineKeys(configFile.theme, _.merge(defaultBorderRadius, configFile.theme.spacing, configFile.theme.extend.spacing), 'borderRadius');
	configFile.theme.borderWidth = combineKeys(configFile.theme, defaultTheme.borderWidth, 'borderWidth');
	configFile.theme.bottomNavigation = combineKeys(configFile.theme, base.spacing, 'bottomNavigation');
	configFile.theme.elevation = combineKeys(configFile.theme, _.merge(base.spacing, configFile.theme.spacing, configFile.theme.extend.spacing), 'elevation');
	configFile.theme.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily');
	configFile.theme.fontSize = combineKeys(configFile.theme, defaultTheme.fontSize, 'fontSize');
	configFile.theme.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight');
	configFile.theme.gap = combineKeys(configFile.theme, base.spacing, 'margin');
	configFile.theme.leftWidth = combineKeys(configFile.theme, base.width, 'leftWidth');
	configFile.theme.maxElevation = combineKeys(configFile.theme, _.merge(base.spacing, configFile.theme.spacing, configFile.theme.extend.spacing), 'maxElevation');
	configFile.theme.opacity = combineKeys(configFile.theme, defaultTheme.opacity, 'opacity');
	configFile.theme.padding = combineKeys(configFile.theme, base.spacing, 'padding');
	configFile.theme.pagingControlAlpha = combineKeys(configFile.theme, defaultTheme.opacity, 'pagingControlAlpha');
	configFile.theme.pagingControlHeight = combineKeys(configFile.theme, base.height, 'pagingControlHeight');
	configFile.theme.pagingControlTimeout = combineKeys(configFile.theme, { ...{ '0': '0ms', '25': '25ms', '50': '50ms', '2000': '2000ms', '3000': '3000ms', '4000': '4000ms', '5000': '5000ms' }, ...defaultTheme.transitionDelay }, 'pagingControlTimeout');
	configFile.theme.rightWidth = combineKeys(configFile.theme, base.width, 'rightWidth');
	configFile.theme.rotate = combineKeys(configFile.theme, defaultTheme.rotate, 'rotate');
	configFile.theme.scale = combineKeys(configFile.theme, { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale }, 'scale');
	configFile.theme.shadowRadius = combineKeys(configFile.theme, _.merge(base.spacing, configFile.theme.spacing, configFile.theme.extend.spacing), 'shadowRadius');
	configFile.theme.transitionDelay = combineKeys(configFile.theme, { ...{ '0': '0ms', '25': '25ms', '50': '50ms', '250': '250ms', '350': '350ms', '400': '400ms', '450': '450ms', '600': '600ms', '800': '800ms', '900': '900ms', '2000': '2000ms', '3000': '3000ms', '4000': '4000ms', '5000': '5000ms' }, ...defaultTheme.transitionDelay }, 'transitionDelay');
	configFile.theme.transitionDuration = combineKeys(configFile.theme, { ...{ '0': '0ms', '25': '25ms', '50': '50ms', '250': '250ms', '350': '350ms', '400': '400ms', '450': '450ms', '600': '600ms', '800': '800ms', '900': '900ms', '2000': '2000ms', '3000': '3000ms', '4000': '4000ms', '5000': '5000ms' }, ...defaultTheme.transitionDuration }, 'transitionDuration');
	configFile.theme.zIndex = combineKeys(configFile.theme, defaultTheme.zIndex, 'zIndex');

	//! Color related properties
	configFile.theme.activeTintColor = combineKeys(configFile.theme, base.colors, 'activeTintColor');
	configFile.theme.activeTitleColor = combineKeys(configFile.theme, base.colors, 'activeTitleColor');
	configFile.theme.backgroundColor = combineKeys(configFile.theme, base.colors, 'backgroundColor');
	configFile.theme.backgroundGradient = combineKeys(configFile.theme, base.colors, 'backgroundGradient');
	configFile.theme.backgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'backgroundSelectedColor');
	configFile.theme.barColor = combineKeys(configFile.theme, base.colors, 'barColor');
	configFile.theme.borderColor = combineKeys(configFile.theme, base.colors, 'borderColor');
	configFile.theme.currentPageIndicatorColor = combineKeys(configFile.theme, base.colors, 'currentPageIndicatorColor');
	configFile.theme.disabledColor = combineKeys(configFile.theme, base.colors, 'disabledColor');
	configFile.theme.dropShadowColor = combineKeys(configFile.theme, base.colors, 'shadowColor');
	configFile.theme.hintTextColor = combineKeys(configFile.theme, base.colors, 'hintTextColor');
	configFile.theme.indicatorColor = combineKeys(configFile.theme, base.colors, 'indicatorColor');
	configFile.theme.navTintColor = combineKeys(configFile.theme, base.colors, 'navTintColor');
	configFile.theme.pageIndicatorColor = combineKeys(configFile.theme, base.colors, 'pageIndicatorColor');
	configFile.theme.pagingControlColor = combineKeys(configFile.theme, base.colors, 'pagingControlColor');
	configFile.theme.selectedButtonColor = combineKeys(configFile.theme, base.colors, 'selectedButtonColor');
	configFile.theme.selectedColor = combineKeys(configFile.theme, base.colors, 'selectedColor');
	configFile.theme.selectedTextColor = combineKeys(configFile.theme, base.colors, 'selectedTextColor');
	configFile.theme.tabsBackgroundColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundColor');
	configFile.theme.tabsBackgroundSelectedColor = combineKeys(configFile.theme, base.colors, 'tabsBackgroundSelectedColor');
	configFile.theme.textColor = combineKeys(configFile.theme, base.colors, 'textColor');
	configFile.theme.tintColor = combineKeys(configFile.theme, base.colors, 'tintColor');
	configFile.theme.titleAttributesColor = combineKeys(configFile.theme, base.colors, 'titleAttributesColor');
	configFile.theme.titleAttributesShadowColor = combineKeys(configFile.theme, base.colors, 'titleAttributesShadowColor');
	configFile.theme.titleColor = combineKeys(configFile.theme, base.colors, 'titleColor');
	configFile.theme.touchFeedbackColor = combineKeys(configFile.theme, base.colors, 'touchFeedbackColor');
	configFile.theme.viewShadowColor = combineKeys(configFile.theme, base.colors, 'viewShadowColor');

	// !Some final cleanup
	delete configFile.theme.extend;
	delete configFile.theme.colors;
	delete configFile.theme.spacing;

	if (!Object.keys(configFile.theme.fontFamily).length) {
		delete configFile.theme.fontFamily;
	}

	// convert Object to Array
	let corePlugins = Array.isArray(configFile.corePlugins) ? configFile.corePlugins : Object.keys(configFile.corePlugins).map(key => key);
	// !Delete corePlugins specified in the config file
	_.each(corePlugins, value => {
		delete configFile.theme[value];
	});

	let tailwindStyles = fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/template.tss'), 'utf8');
	tailwindStyles += fs.readFileSync(path.resolve(__dirname, './lib/templates/tailwind/custom-template.tss'), 'utf8');
	tailwindStyles += (iAmInProjectFolder) ? `// config.js file updated on: ${getFileUpdatedDate(projectConfigJS)}\n` : `// default config.js file\n`;
	tailwindStyles += '\n// Custom Styles and Resets\n';

	_.each(configFile.theme, (value, key) => {
		tailwindStyles += helperToBuildCustomTailwindClasses(key, value);
	});

	let finalTailwindStyles = helpers.applyProperties(tailwindStyles);

	if (iAmInProjectFolder) {
		fs.writeFileSync(projectTailwindTSS, finalTailwindStyles);
		logger.info(chalk.yellow('./purgetss/tailwind.tss'), message);
	} else {
		fs.writeFileSync(srcTailwindTSS, finalTailwindStyles);
		logger.info(chalk.yellow('./dist/tailwind.tss'), message);
	}
}
module.exports.buildCustomTailwind = buildCustomTailwind;

function createDefinitionsFile() {
	let classDefinitions = '';

	if (fs.existsSync(projectTailwindTSS)) {
		classDefinitions += fs.readFileSync(projectTailwindTSS, 'utf8');
	}

	if (fs.existsSync(cwd + '/purgetss/fonts.tss')) {
		classDefinitions += fs.readFileSync(cwd + '/purgetss/fonts.tss', 'utf8').replace(/\n\/\*\*\n([\s\S]*?)\*\/\n/g, '');
	}

	if (fs.existsSync(projecrFontAwesomeTSS)) {
		classDefinitions += fs.readFileSync(projecrFontAwesomeTSS, 'utf8');
	}

	classDefinitions = classDefinitions
		.replace(`'ImageView[platform=ios]': { hires: true }\n`, '')
		.replace(`'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }\n`, '')
		.replace(`'Window': { backgroundColor: '#ffffff' }\n\n`, '')
		.replace(/'.(.*)': /g, '.$1')
		.replace(/{(.*)}/g, '{}')
		.replace(/\[(.*)\]/g, '')
		.replace(/\/\/(.*)\n/g, '')
		.replace(/\n\n/g, '\n');

	fs.writeFileSync(cwd + '/purgetss/definitions.css', `/* Class definitions */${classDefinitions}`);

	logger.file('./purgetss/definitions.css');
}

//! Build tailwind's custom values
function helperToBuildCustomTailwindClasses(key, value) {
	switch (key) {
		case 'accessibilityHidden':
		case 'activeIconIsMask':
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
		case 'allowUserCustomization':
		case 'animationStyle':
		case 'autoAdjustScrollViewInsets':
		case 'autocapitalization':
		case 'autocorrect':
		case 'autofillType':
		case 'autoLink':
		case 'autoreverse':
		case 'backgroundBlendMode':
		case 'backgroundColor':
		case 'backgroundGradient':
		case 'backgroundLinearGradient':
		case 'backgroundRadialGradient':
		case 'backgroundRepeat':
		case 'backgroundSelectedColor':
		case 'barColor':
		case 'borderColor':
		case 'borderRadius':
		case 'borderStyle':
		case 'borderWidth':
		case 'bottomNavigation':
		case 'bubbleParent':
		case 'buttonStyle':
		case 'cacheSize':
		case 'canDelete':
		case 'clipMode':
		case 'currentPageIndicatorColor':
		case 'disableBounce':
		case 'disabledColor':
		case 'displayCaps':
		case 'displayHomeAsUp':
		case 'displayUtilities':
		case 'draggingConstraints':
		case 'draggingType':
		case 'drawerIndicatorEnabled':
		case 'drawerLockMode':
		case 'dropShadow':
		case 'dropShadowColor':
		case 'editable':
		case 'elevation':
		case 'ellipsize':
		case 'enableCopy':
		case 'enabled':
		case 'enableReturnKey':
		case 'enableZoomControls':
		case 'exitOnClose':
		case 'extendBackground':
		case 'extendEdges':
		case 'extendSafeArea':
		case 'flagSecure':
		case 'flip':
		case 'fontFamily':
		case 'fontSize':
		case 'fontStyle':
		case 'fontWeight':
		case 'fullscreen':
		case 'gap':
		case 'gridColumnsStartEnd':
		case 'gridFlow':
		case 'gridSystem':
		case 'height':
		case 'hidesBackButton':
		case 'hidesBarsOnSwipe':
		case 'hidesBarsOnTap':
		case 'hidesBarsWhenKeyboardAppears':
		case 'hideShadow':
		case 'hidesSearchBarWhenScrolling':
		case 'hintTextColor':
		case 'hires':
		case 'homeButtonEnabled':
		case 'homeIndicatorAutoHidden':
		case 'html':
		case 'iconified':
		case 'iconifiedByDefault':
		case 'iconIsMask':
		case 'includeOpaqueBars':
		case 'indicatorColor':
		case 'items':
		case 'keepScreenOn':
		case 'keepSectionsInSearch':
		case 'keyboardAppearance':
		case 'keyboardDismissMode':
		case 'keyboardType':
		case 'largeTitleDisplayMode':
		case 'largeTitleEnabled':
		case 'layout':
		case 'lazyLoadingEnabled':
		case 'leftDrawerLockMode':
		case 'leftWidth':
		case 'listViewStyle':
		case 'loginKeyboardType':
		case 'loginReturnKeyType':
		case 'margin':
		case 'maxElevation':
		case 'modal':
		case 'navBarHidden':
		case 'navTintColor':
		case 'opacity':
		case 'orientationModes':
		case 'origin':
		case 'overlayEnabled':
		case 'padding':
		case 'pageIndicatorColor':
		case 'pagingControl':
		case 'pagingControlAlpha':
		case 'pagingControlColor':
		case 'pagingControlHeight':
		case 'pagingControlOnTop':
		case 'pagingControlTimeout':
		case 'passwordKeyboardType':
		case 'pickerType':
		case 'placement':
		case 'preventCornerOverlap':
		case 'preventDefaultImage':
		case 'previewActionStyle':
		case 'progressBarStyle':
		case 'progressIndicatorCancelable':
		case 'progressIndicatorCancelOnTouchOutside':
		case 'progressIndicatorLocation':
		case 'progressIndicatorType':
		case 'repeat':
		case 'requestOrientation':
		case 'returnKeyType':
		case 'rightDrawerLockMode':
		case 'rightWidth':
		case 'rotate':
		case 'rowAndColumnCount':
		case 'scale':
		case 'scrollableRegion':
		case 'scrollIndicators':
		case 'scrollIndicatorStyle':
		case 'scrollingEnabled':
		case 'scrollsToTop':
		case 'scrollType':
		case 'searchBarStyle':
		case 'selectedButtonColor':
		case 'selectedColor':
		case 'selectedTextColor':
		case 'selectionStyle':
		case 'separatorStyle':
		case 'shadow':
		case 'shadowRadius':
		case 'shiftMode':
		case 'showAsAction':
		case 'showBookmark':
		case 'showCancel':
		case 'showSearchBarInNavBar':
		case 'smoothScrollOnTabClick':
		case 'statusBarStyle':
		case 'submitEnabled':
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
		case 'tiMedia':
		case 'tintColor':
		case 'titleAttributesColor':
		case 'titleAttributesShadow':
		case 'titleAttributesShadowColor':
		case 'titleColor':
		case 'toolbarEnabled':
		case 'touchEnabled':
		case 'touchFeedback':
		case 'touchFeedbackColor':
		case 'transition':
		case 'transitionDelay':
		case 'transitionDuration':
		case 'translucent':
		case 'useCompatPadding':
		case 'useSpinner':
		case 'verticalAlign':
		case 'viewShadow':
		case 'viewShadowColor':
		case 'width':
		case 'windowPixelFormat':
		case 'windowSoftInputMode':
		case 'wobble':
		case 'zIndex':
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
	logger.info('Copying Reset styles...');

	let tempPurged = fs.readFileSync(srcResetTSSFile, 'utf8');

	if (fs.existsSync(project_AppTSS)) {
		let appTSSContent = fs.readFileSync(project_AppTSS, 'utf8');

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
	let tailwindClasses = fs.readFileSync(projectTailwindTSS, 'utf8').split(/\r?\n/);

	if (`// config.js file updated on: ${getFileUpdatedDate(projectConfigJS)}` !== tailwindClasses[6]) {
		logger.info(chalk.yellow('config.js'), 'file updated!, rebuilding tailwind.tss...');
		buildCustomTailwind('file updated!');
		tailwindClasses = fs.readFileSync(projectTailwindTSS, 'utf8').split(/\r?\n/);
	}

	logger.info('Purging', chalk.yellow('Custom Tailwind'), 'styles...')

	let cleanUniqueClasses = [];
	let classesWithOpacityValues = [];

	let arbitraryValues = '\n// Styles with arbitrary values\n';

	uniqueClasses.forEach((className, index) => {
		let cleanClassName = cleanClassNameFn(className);

		if (cleanClassName.includes('(')) {
			let line = helpers.formatArbitraryValues(cleanClassName, fromXMLs = true);
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

	return purgedClasses;
}

function cleanClassNameFn(className) {
	return className.replace('ios:', '').replace('android:', '').replace('handheld:', '').replace('tablet:', '').replace('open:', '').replace('complete:', '').replace('close:', '').replace('complete:', '').replace('drag:', '').replace('drop:', '').replace('bounds:', '');
}

//! FontAwesome
function purgeFontAwesome(uniqueClasses, cleanUniqueClasses) {
	let sourceFolder = '';
	let purgedClasses = '';
	let purgingMessage = '';

	if (fs.existsSync(projecrFontAwesomeTSS)) {
		sourceFolder = projecrFontAwesomeTSS;
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

//! Framework7
function purgeFramework7(uniqueClasses, cleanUniqueClasses) {
	let purgedClasses = '\n// Framework7 styles\n';

	let sourceTSS = fs.readFileSync(srcFramework7FontTSSFile, 'utf8').split(/\r?\n/);

	purgedClasses += purgeFontIcons(sourceTSS, uniqueClasses, 'Purging Framework7 Icons styles...', cleanUniqueClasses, ['f7', 'f7i', 'framework7']);

	return (purgedClasses === '\n// Framework7 styles\n') ? '' : purgedClasses;
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
	fs.copyFileSync(srcJMKFile, projectAlloyJMKFile);
	logger.file('./app/alloy.jmk');
}

//! Soon to be deleted
function reviewThis(className) {
	let twStylesWithoyPlatformSpecificStyles = className.replace(/\[platform=ios\]/g, '').replace(/\[platform=android\]/g, '').split(/\r?\n/);
	twStylesArray[indexOfClass].replace('[platform=android]', '').replace('[platform=ios]', '')
}
