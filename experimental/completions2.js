'use_strick';
let _applyClasses = {};
const fs = require('fs');
const cwd = process.cwd();
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const colores = require('../lib/colores').colores;
const isInstalledGlobally = require('is-installed-globally');
module.exports.colores = colores;
const purgeLabel = colores.purgeLabel;

const projectConfigJS = cwd + '/purgetss/config.js';

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

const helpers = require('../lib/helpers');
const tiCompletionsFile = require('../lib/completions/titanium/completions-v3.json');
// const alloyCompletionsFile = require('../lib/completions/alloy/completions-v3.json');
const srcConfigFile = path.resolve(__dirname, '../lib/templates/purgetss.config.js');

const configFile = (fs.existsSync(projectConfigJS)) ? require(projectConfigJS) : require(srcConfigFile);
configFile.corePlugins = configFile.corePlugins ?? {};
configFile.purge = configFile.purge ?? { mode: 'all' };
configFile.theme.extend = configFile.theme.extend ?? {};
configFile.fonts = configFile.fonts ?? { mode: 'fileName' };

const configOptions = (configFile.purge && configFile.purge.options) ? configFile.purge.options : false;
if (configOptions) {
	configOptions.widgets = configOptions.widgets ?? false;
	configOptions.missing = configOptions.missing ?? false;
}

completions();

function completions(message = 'file created!') {
	let tailwindStyles = fs.readFileSync(path.resolve(__dirname, '../lib/templates/tailwind/template.tss'), 'utf8');
	tailwindStyles += fs.readFileSync(path.resolve(__dirname, '../lib/templates/tailwind/custom-template.tss'), 'utf8');
	tailwindStyles += (fs.existsSync(projectConfigJS)) ? `// config.js file updated on: ${getFileUpdatedDate(projectConfigJS)}\n` : `// default config.js file\n`;

	let base = combineDefaultThemeWithConfigFile();
	let tiCompletionsFileProperties = getProperties();
	let tiCompletionsWithBaseValues = setBaseValuesToCompletions(tiCompletionsFileProperties, base);
	saveFile(cwd + '/purgetss/tiCompletionsWithBaseValues.json', JSON.stringify(tiCompletionsWithBaseValues));

	tailwindStyles += prrocessCustomRules(processUIElementos(base));

	tailwindStyles += processCompletionsClasses(tiCompletionsWithBaseValues);

	if (fs.existsSync(projectConfigJS)) {
		fs.writeFileSync(cwd + '/purgetss/tailwind-auto.tss', tailwindStyles);
		fs.writeFileSync(cwd + '/purgetss/tiCompletionsWithBaseValues.json', JSON.stringify(tiCompletionsWithBaseValues));
		logger.info(chalk.yellow('./purgetss/tailwind-auto.tss'), message);
	} else {
		fs.writeFileSync(path.resolve(__dirname, '../dist/tailwind-auto.tss'), tailwindStyles);
		logger.info(chalk.yellow('./dist/tailwind-auto.tss'), message);
	}
}
exports.completions = completions;

function prrocessCustomRules(_propertiesOnly) {
	let customRules = '\n// Custom Rules\n';
	_.each(_propertiesOnly, (value, key) => {
		customRules += helpers.customRules(value.base, key);
	});

	return customRules;
}

function processCompletionsClasses(_completionsWithBaseValues) {
	let processedClasses = '';

	_.each(_completionsWithBaseValues, (data, key) => {
		let theClasses = generateCombinedClasses(key, data);
		if (theClasses) {
			processedClasses += theClasses;
		}
	});

	return processedClasses;
}

function setBaseValuesToCompletions(_allProperties, _base) {
	_.each(_allProperties, (data, key) => {
		let _currentKey = currentKey(key, data);
		_allProperties[key].base = combineKeys(configFile.theme, _base[_currentKey], key);
	});

	return _allProperties;
}

function processUIElementos(_base) {
	let propertiesOnly = {};
	_.each(tiCompletionsFile.types, (value, key) => {
		if (key.includes('Ti.UI.')) {
			let _key = key.replace('Ti.UI.', '');
			let combinedKeys = combineKeys(configFile.theme, _base[_key], _key);
			if (combinedKeys !== {}) {
				if (!propertiesOnly[_key]) {
					propertiesOnly[_key] = {
						description: value.description,
					};
					propertiesOnly[_key].base = combinedKeys;
				}
			}
		}
	});

	saveFile(cwd + '/purgetss/propertiesOnly.json', JSON.stringify(propertiesOnly));
	return propertiesOnly;
}

function currentKey(_key, _data) {
	if (_key.includes('Color') || _key.includes('color')) {
		return 'colors';
	} else if (_key.includes('Spacing') || _key.includes('spacing') || _key.includes('backgroundLeftCap') || _key.includes('backgroundTopCap') || _key.includes('uprightWidth') || _key.includes('uprightHeight') || _key.includes('borderWidth') || _key.includes('pageWidth') || _key.includes('pageHeight') || (_key.includes('Padding') || (_key.includes('padding')) && _data.type !== 'Boolean')) {
		return 'spacing';
	} else if (_key.includes('Height') || _key.includes('height')) {
		return 'height';
	} else if (_key.includes('Width') || _key.includes('width')) {
		return 'width';
	} else if ((_key.includes('Padding') || (_key.includes('padding')) && _data.type !== 'Boolean')) {
		return 'spacing';
	} else if ((_key.includes('Scale') || (_key.includes('scale')) && _data.type !== 'Boolean')) {
		return 'scale';
	} else if (_key == 'bottom' || _key == 'left' || _key == 'right' || _key == 'leftTrackImage' || _key == 'leftTrackLeftCap' || _key == 'leftTrackTopCap' || _key == 'rightTrackImage' || _key == 'rightTrackLeftCap' || _key == 'rightTrackTopCap') {
		return 'margin';
	}

	return _key;
}

function combineDefaultThemeWithConfigFile() {
	const defaultColors = require('tailwindcss/colors');
	const defaultTheme = require('tailwindcss/defaultTheme');
	const defaultThemeWidth = defaultTheme.width({ theme: () => (defaultTheme.spacing) });
	const defaultThemeHeight = defaultTheme.height({ theme: () => (defaultTheme.spacing) });

	removeDeprecatedColors(defaultColors);

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

	removeUnnecesaryValues(themeOrDefaultValues);
	let base = {
		colors: {},
		spacing: {},
		width: {},
		height: {},
		rotate: defaultTheme.rotate,
		zIndex: defaultTheme.zIndex,
		opacity: defaultTheme.opacity,
		fontSize: { ...themeOrDefaultValues.fontSize, ...configFile.theme.extend.spacing, ...configFile.theme.extend.fontSize },
		fontWeight: defaultTheme.fontWeight,
		borderWidth: defaultTheme.borderWidth,
		verticalMargin: { top: '-0.5', bottom: '0.5', middle: '0' },
		horizontalMargin: { left: '-0.5', right: '0.5', center: '0' },
		scale: { ...{ 5: '.05', 10: '.10', 25: '.25' }, ...defaultTheme.scale },
		columns: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
		delay: { 0: '0ms', 25: '25ms', 50: '50ms', 250: '250ms', 350: '350ms', 400: '400ms', 450: '450ms', 600: '600ms', 800: '800ms', 900: '900ms', 2000: '2000ms', 3000: '3000ms', 4000: '4000ms', 5000: '5000ms' }
	};

	_.merge(base.colors, themeOrDefaultValues.colors, configFile.theme.extend.colors);
	_.merge(base.spacing, themeOrDefaultValues.spacing, configFile.theme.extend.spacing);
	_.merge(base.width, themeOrDefaultValues.spacing, configFile.theme.extend.spacing, themeOrDefaultValues.width, configFile.theme.extend.width);
	_.merge(base.height, themeOrDefaultValues.spacing, configFile.theme.extend.spacing, themeOrDefaultValues.height, configFile.theme.extend.height);

	fixPercentages(base.width);
	fixPercentages(base.height);
	fixPercentages(base.spacing);

	//! Extras...
	base.transitionDelay = { ...base.delay, ...defaultTheme.transitionDelay };
	base.transitionDuration = { ...base.delay, ...defaultTheme.transitionDuration };
	base.borderRadius = helpers.integersInHalf(helpers.removeFractions((configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, ['full', 'auto', 'screen']));
	base.margin = combineKeys(configFile.theme, base.spacing, 'margin');
	delete base.margin.screen;

	//! Process custom Window, View and ImageView
	base.Window = (configFile.theme.Window && configFile.theme.Window.apply)
		? _.merge({ apply: configFile.theme.Window.apply }, configFile.theme.Window)
		: _.merge({ default: { backgroundColor: '#ffffff' } }, configFile.theme.Window);

	base.ImageView = (configFile.theme.ImageView && configFile.theme.ImageView.apply)
		? _.merge({ apply: configFile.theme.ImageView.apply }, { ios: { hires: true } }, configFile.theme.ImageView)
		: _.merge({ ios: { hires: true } }, configFile.theme.ImageView);

	base.View = (configFile.theme.View && configFile.theme.View.apply)
		? _.merge({ apply: configFile.theme.View.apply }, configFile.theme.View)
		: _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View);

	return base;
}

//! Helper Functions
function removeDeprecatedColors(theObject) {
	delete theObject.blueGray;
	delete theObject.coolGray;
	delete theObject.current;
	delete theObject.inherit;
	delete theObject.lightBlue;
	delete theObject.trueGray;
	delete theObject.warmGray;
}

function removeUnnecesaryValues(theObject) {
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

function combineKeys(values, base, key) {
	return (values[key]) ? { ...values[key], ...values.extend[key] } : { ...base, ...values.extend[key] };
}

function getProperties() {
	let propertiesOnly = {};
	_.each(tiCompletionsFile.types, (value, key) => {
		_.each(value.properties, property => {
			if (validTypesOnly(property, key)) {
				if (!propertiesOnly[property]) {
					propertiesOnly[property] = tiCompletionsFile.properties[property];
					propertiesOnly[property].modules = [];
				}
				propertiesOnly[property].modules.push(key);
			}
		});
	});

	return propertiesOnly;
}

function getFileUpdatedDate(_path) {
	return fs.statSync(_path).mtime;
}

function saveFile(file, data) {
	fs.writeFileSync(file, data, err => {
		throw err;
	});
}

function hasValidValues(key) {
	key = key.toLowerCase();
	return !key.includes('_') &&
		!key.includes('apiname') &&
		!key.includes('animatedcenter') &&
		!key.includes('attributes') &&
		!key.includes('button') &&
		!key.includes('children') &&
		!key.includes('copyright') &&
		!key.includes('data') &&
		!key.includes('hint') &&
		!key.includes('id') &&
		!key.includes('image') &&
		!key.includes('index') &&
		!key.includes('item') &&
		!key.includes('label') &&
		!key.includes('landscape') &&
		!key.includes('logo') &&
		!key.includes('message') &&
		!key.includes('name') &&
		!key.includes('order') &&
		!key.includes('placeholder') &&
		!key.includes('text') &&
		!key.includes('title') &&
		!key.includes('value');
}

function validTypesOnly(property, key) {
	return key.includes('Ti.UI.')
		|| tiCompletionsFile.properties[property].type === 'Boolean'
		|| tiCompletionsFile.properties[property].type === 'Point'
		|| tiCompletionsFile.properties[property].type === 'Number'
		|| tiCompletionsFile.properties[property].type === 'Array'
		|| tiCompletionsFile.properties[property].type === 'String';
}

function validType(data) {
	return data.type === 'Boolean'
		|| data.type === 'Point'
		|| data.type === 'Number'
		|| data.type === 'Array'
		|| data.type === 'String';
}

function generateClasses(key, data) {
	let myClasses = '';
	let comments = processComments(key, data);

	_.each(data.values, (value, _key) => {
		if (!value.includes('deprecated')) {
			myClasses += formatClass(key, value);
		}
	});

	if (myClasses) {
		return comments + myClasses;
	}

	return false;
}

function processComments(key, data) {
	let myComments = '';
	if (data.type) {
		myComments += `\n// Type: ${data.type}`;
	}
	myComments += `\n// Property: ${key}`;

	if (data.description) myComments += `\n// Description: ${data.description.replace(/\n/g, ' ')}`;

	if (data.modules) {
		myComments += `\n// Component(s): ${data.modules.join(', ')}\n`;
	}

	return myComments;
}

function generateCombinedClasses(key, data) {
	let myClasses = '';
	let comments = processComments(key, data);

	if (Object.entries(data.base).length) {
		_.each(data.base, (value, _key) => {
			if (typeof value === 'object') {
				_.each(value, (_value, __key) => {
					myClasses += `'.${setModifier(removeUneededVariables(camelCaseToDash(key + '-' + _key + '-' + __key)))}': { ${key}: ${helpers.parseValue(_value)} }\n`;
				});
			} else {
				myClasses += `'.${setModifier(removeUneededVariables(camelCaseToDash(key + '-' + _key)))}': { ${key}: ${helpers.parseValue(value)} }\n`;
			}
		});
	} else {
		_.each(data.values, (_value, _key) => {
			if (!_value.includes('deprecated')) {
				myClasses += formatClass(key, _value);
			}
		});
	}

	if (myClasses !== '') {
		saveAutoTSS(key, comments + myClasses);
		return comments + myClasses;
	}

	return false;
}

function saveAutoTSS(key, classes) {
	if (fs.existsSync(projectConfigJS)) {
		makeSureFolderExists(cwd + '/purgetss/tailwind-auto/');
		saveFile(cwd + `/purgetss/tailwind-auto/${key}-auto.tss`, classes);
	} else {
		makeSureFolderExists(cwd + '/experimental/tailwind-auto/');
		saveFile(cwd + `/experimental/tailwind-auto/${key}-auto.tss`, classes);
	}
}

function formatClass(key, value) {
	return `'.${formatClassName(key, value)}': { ${key}: ${value} }\n`;
}

function formatClassName(property, value) {
	return removeUneededVariables(camelCaseToDash(`${property}-${removeModuleName(value, property)}`));
}

function removeUneededVariables(property) {
	return Array.from(new Set(property.split('-')))
		.join('-')
		.replace('-bottom-', '-b-')
		.replace('-calendar-', '-')
		.replace('-default', '')
		.replace('-left-', '-l-')
		.replace('-margin', '')
		.replace('-right-', '-r-')
		.replace('-top-', '-t-')
		.replace('-true', '')
		.replace('autolink', '')
		.replace('background-', 'bg-')
		.replace('buttonmode', '')
		.replace('color-', '')
		.replace('flag-', '')
		.replace('height-', 'h-')
		.replace('layout-', '')
		.replace('recurrencefrequency', 'recurrence')
		.replace('returnkey-', '')
		.replace('text-alignment-', '')
		.replace('ti-', '')
		.replace('width-', 'w-')
		.replace(/--/g, '-');
}

function setModifier(_modifier) {
	if (_modifier.includes('-ios-')) {
		_modifier = _modifier.replace('-ios-', '-') + '[platform=ios]';
	} else if (_modifier.includes('-android-')) {
		_modifier = _modifier.replace('-android-', '-') + '[platform=android]';
	} else if (_modifier.includes('-handheld-')) {
		_modifier = _modifier.replace('-handheld-', '-') + '[formFactor=handheld]';
	} else if (_modifier.includes('-tablet-')) {
		_modifier = _modifier.replace('-tablet-', '-') + '[formFactor=tablet]';
	} else if (_modifier.includes('[if=')) {
		let ifStatement = _modifier.match(/\[if=(.*?)\]/);
		if (ifStatement) {
			ifStatement = ifStatement[0];
			_modifier = _modifier.replace(/\[if=(.*?)\]-/, '');
			_modifier = _modifier + `${ifStatement}`;
		}
	}

	return _modifier;
}

function defaultModifier(modifier) {
	return modifier === '' || modifier === null || modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT';
}

function notDefaultRules(rule) {
	return rule !== '' && rule !== null && rule !== 'global' && rule !== 'default' && rule !== 'DEFAULT' && rule !== 'ios' && rule !== 'android' && rule !== 'android' && rule !== 'handheld' && rule !== 'tablet' && !rule.startsWith('[if=');
}

function camelCaseToDash(str) {
	if (str.includes('[')) {
		return str;
	} else {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}
}

function removeModuleName(value, property) {
	return camelCaseToDash(value
		.replace(/^Ti.UI.iOS./, '')
		.replace(/^Ti.UI.iPad./, '')
		.replace(/^Ti.App.iOS./, '')
		.replace(/^Ti.Geolocation.Android./, '')
		.replace(/^Ti.Geolocation./, '')
		.replace(/^Ti.UI.Android./, '')
		.replace(/^Ti.UI./, '')
		.replace(/^Ti.Media.Sound./, '')
		.replace(/^Ti.Media./, '')
		.replace(/_/g, '-')
		.replace(/'/g, '')
		.replace(`${property}-`, '')
		.replace(/\./g, '-'));
}

function makeSureFolderExists(folder) {
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}
}
