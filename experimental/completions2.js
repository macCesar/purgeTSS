'use_strick';
let _applyClasses = {};
let debugMode = false;
const fs = require('fs');
const cwd = process.cwd();
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const colores = require('../lib/colores').colores;
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

function autoBuildTailwindTSS(options = {}) {
	debugMode = options.debug ?? false;
	let tailwindStyles = fs.readFileSync(path.resolve(__dirname, '../lib/templates/tailwind/template.tss'), 'utf8');
	tailwindStyles += fs.readFileSync(path.resolve(__dirname, '../lib/templates/tailwind/custom-template.tss'), 'utf8');
	tailwindStyles += (fs.existsSync(projectConfigJS)) ? `// config.js file updated on: ${getFileUpdatedDate(projectConfigJS)}\n` : `// default config.js file\n`;

	let baseValues = combineDefaultThemeWithConfigFile();
	let completionsProrpertiesWithBaseValues = setBaseValuesToProperties(getPropertiesFromTiCompletionsFile(), baseValues);

	let tiUIComponents = getTiUIComponents(baseValues);
	tailwindStyles += processTitaniumRules(tiUIComponents);
	tailwindStyles += processCustomClasses();
	tailwindStyles += processCompoundClasses(baseValues);
	tailwindStyles += processCompletionsClasses(completionsProrpertiesWithBaseValues);

	tailwindStyles = helpers.compileApplyDirectives(tailwindStyles);

	if (fs.existsSync(projectConfigJS)) {
		fs.writeFileSync(cwd + '/purgetss/tailwind.tss', tailwindStyles);
		logger.file('./purgetss/tailwind.tss');
		if (debugMode) {
			saveFile(cwd + '/purgetss/experimental/baseValues.json', JSON.stringify(baseValues, null, 2));
			saveFile(cwd + '/purgetss/experimental/tiUIComponents.json', JSON.stringify(tiUIComponents, null, 2));
			fs.writeFileSync(cwd + '/purgetss/experimental/completionsProrpertiesWithBaseValues.json', JSON.stringify(completionsProrpertiesWithBaseValues, null, 2));
		}
	} else {
		fs.writeFileSync(path.resolve(__dirname, '../dist/tailwind.tss'), tailwindStyles);
		logger.file('./dist/tailwind.tss');
	}
}
exports.autoBuildTailwindTSS = autoBuildTailwindTSS;

function processCustomClasses() {
	let tailwindStyles = '';

	if (Object.keys(configFile.theme).length) {
		_.each(configFile.theme, (value, key) => {
			if (key !== 'extend') {
				tailwindStyles += helpers.customRules(value, key)
			}
		});
	}

	if (tailwindStyles !== '') {
		return `\n// Custom Classes\n${tailwindStyles}`;
	}

	return '';
}

function processTitaniumRules(_propertiesOnly) {
	let currentLegacyOption = helpers.globalOptions.legacy;
	helpers.globalOptions.legacy = true;
	let customRules = '\n// Ti.UI Components';
	_.each(_propertiesOnly, (value, key) => {
		let property = `\n// Property: ${key}\n`;
		let description = `// Description: ${value.description.replace(/\n/g, ' ')}\n`;
		customRules += property + description + helpers.customRules(value.base, key);
	});

	helpers.globalOptions.legacy = currentLegacyOption;

	if (customRules != '\n// Ti.UI Components\n') {
		return customRules;
	}

	return '';
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

function setBaseValuesToProperties(_allProperties, _base) {
	let allKeys = '';
	_.each(_allProperties, (data, key) => {
		let activeKey = findBaseKey(key, data);
		allKeys += `${key}\n`;
		if (_base[key]) {
			_allProperties[key].base = combineKeys(configFile.theme, _base[key], key);
		} else {
			_allProperties[key].base = combineKeys(configFile.theme, _base[activeKey], key);
		}
	});

	if (fs.existsSync(projectConfigJS) && debugMode) {
		makeSureFolderExists(cwd + '/purgetss/experimental/');
		saveFile(cwd + '/purgetss/experimental/allKeys.txt', allKeys);
	}

	return _allProperties;
}

function getTiUIComponents(_base) {
	let propertiesOnly = {};
	_.each(tiCompletionsFile.types, (value, key) => {
		if (key.includes('Ti.UI.') || key.includes('Ti.Android.')) {
			let _key = key.replace('Ti.UI.', '').replace('Ti.Android.', '');
			let combinedKeys = combineKeys(configFile.theme, _base[_key], _key);
			if (combinedKeys !== {}) {
				delete configFile.theme[_key];
				if (!propertiesOnly[_key] && Object.keys(combinedKeys).length) {
					propertiesOnly[_key] = {
						base: combinedKeys,
						description: value.description,
					};
				}
			}
		}
	});

	if (fs.existsSync(projectConfigJS) && debugMode) {
		saveFile(cwd + '/purgetss/experimental/propertiesOnly.json', JSON.stringify(propertiesOnly, null, 2));
	}

	return propertiesOnly;
}

function processCompoundClasses({ ..._base }) {
	let compoundClasses = '';
	let compoundTemplate = require('../lib/templates/tailwind/compoundTemplate.json');

	_.each(compoundTemplate, (value, key) => {
		compoundClasses += helpers.processProperties(value.description, value.template, value.base ?? { default: _base[key] });
	});

	compoundClasses += helpers.anchorPoint();

	compoundClasses += helpers.autocapitalization();
	compoundClasses += helpers.backgroundBlendMode();
	compoundClasses += helpers.backgroundLinearGradient();
	compoundClasses += helpers.backgroundRadialGradient();
	compoundClasses += helpers.clipMode();
	compoundClasses += helpers.constraint();
	compoundClasses += helpers.contentHeightAndWidth();
	compoundClasses += helpers.debugMode();
	compoundClasses += helpers.defaultItemTemplate();
	compoundClasses += helpers.displayCaps();
	compoundClasses += helpers.draggingType();
	compoundClasses += helpers.dropShadow();
	compoundClasses += helpers.editable();
	compoundClasses += helpers.ellipsize();
	compoundClasses += helpers.filterAttribute();
	compoundClasses += helpers.flip();
	compoundClasses += helpers.fontStyle();
	compoundClasses += helpers.gridColumnsRowsStartEnd();
	compoundClasses += helpers.gridFlow();
	compoundClasses += helpers.gridSystem();
	compoundClasses += helpers.items();
	compoundClasses += helpers.navigationMode();
	compoundClasses += helpers.orientationModes();
	compoundClasses += helpers.placement();
	compoundClasses += helpers.progressBarStyle();
	compoundClasses += helpers.scrollIndicators();
	compoundClasses += helpers.scrollsToTop();
	compoundClasses += helpers.scrollType();
	compoundClasses += helpers.selectionStyle();
	compoundClasses += helpers.statusBarStyle();
	compoundClasses += helpers.theme();
	compoundClasses += helpers.titleAttributesShadow();
	compoundClasses += helpers.touchEnabled();
	compoundClasses += helpers.viewShadowV6();
	compoundClasses += helpers.visible();

	compoundClasses += helpers.borderRadius(_base.borderRadius);
	compoundClasses += helpers.fontFamily(_base.fontFamily);
	compoundClasses += helpers.fontSize(_base.fontSize);
	compoundClasses += helpers.fontWeight(_base.fontWeight);
	compoundClasses += helpers.gap(_base.margin);
	compoundClasses += helpers.minimumFontSize(_base.fontSize);
	compoundClasses += helpers.negativeRotate(_base.rotate);
	compoundClasses += helpers.padding(_base.padding);

	// colors
	compoundClasses += helpers.backgroundGradient(combineKeys(configFile.theme, _base.colors, 'backgroundGradient'));
	compoundClasses += helpers.backgroundSelectedColor(combineKeys(configFile.theme, _base.colors, 'backgroundSelectedColor'));
	compoundClasses += helpers.backgroundSelectedGradient(combineKeys(configFile.theme, _base.colors, 'backgroundSelectedGradient'));
	compoundClasses += helpers.textColor(combineKeys(configFile.theme, _base.colors, 'textColor'));
	compoundClasses += helpers.titleAttributesColor(combineKeys(configFile.theme, _base.colors, 'titleAttributesColor'));
	compoundClasses += helpers.titleAttributesShadowColor(combineKeys(configFile.theme, _base.colors, 'titleAttributesShadowColor'));

	return compoundClasses;
}

function findBaseKey(_key, _data) {
	if (_key.includes('color') || _key.includes('Color')) {
		return 'colors';
	} else if (_key.includes('spacing') || _key.includes('Spacing')) {
		return 'spacing';
	} else if (_key === 'duration' || _key === 'timeout' || _key.includes('Timeout')) {
		return 'delay';
	} else if (_key === 'pagingControlAlpha') {
		return 'opacity';
	} else if (_key === 'lines' || _key === 'columnCount' || _key === 'rowCount' || _key === 'repeatCount' || _key === 'maxLines') {
		return 'count'; // 1-12
	} else if (_key === 'activeTab' || _key === 'cacheSize') {
		return 'repeat'; // 0-12
	} else if ((_key.includes('scale') || (_key.includes('Scale')) && _data.type !== 'Boolean')) {
		return 'scale';
	} else if (_key === 'shadowRadius' || _key === 'separatorHeight' || _key.includes('RowHeight') || _key === 'rowHeight' || _key === 'elevation' || _key === 'maxElevation' || _key === 'indentionLevel' || _key === 'keyboardToolbarHeight' || _key === 'maximumLineHeight' || _key === 'yOffset' || _key === 'xOffset' || _key === 'pagingControlHeight' || _key === 'pageWidth' || _key === 'pageHeight' || _key === 'uprightWidth' || _key === 'uprightHeight' || _key === 'backgroundLeftCap' || _key === 'backgroundTopCap' || _key === 'contentWidth' || _key === 'contentHeight' || ((_key.includes('Padding') || _key.includes('padding') || _key == 'leftTrackLeftCap' || _key == 'leftTrackTopCap' || _key == 'rightTrackLeftCap' || _key == 'rightTrackTopCap') && _data.type !== 'Boolean')) {
		return 'noFractions';
	} else if (_key == 'top' || _key == 'bottom' || _key == 'left' || _key == 'right') {
		return 'margin';
	} else if ((_key.includes('height') || _key.includes('Height')) && _key !== 'platformHeight') {
		return 'height';
	} else if ((_key.includes('width') || _key.includes('Width')) && _key !== 'platformWidth') {
		return 'width';
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
		minimumFontSize: configFile.theme.spacing ?? defaultTheme.minimumFontSize,
		colors: configFile.theme.colors ?? { transparent: 'transparent', ...defaultColors },
	}

	removeUnnecesaryValues(themeOrDefaultValues);
	fixDefaultScale(defaultTheme.scale);

	let base = {
		colors: {},
		spacing: {},
		width: {},
		height: {},
		rotate: combineKeys(configFile.theme, defaultTheme.rotate, 'rotate'),
		zIndex: defaultTheme.zIndex,
		opacity: defaultTheme.opacity,
		fontWeight: defaultTheme.fontWeight,
		borderWidth: combineKeys(configFile.theme, removePxFromDefaultTheme(defaultTheme.borderWidth), 'borderWidth'),
		fontSize: { ...themeOrDefaultValues.fontSize, ...configFile.theme.extend.spacing, ...configFile.theme.extend.fontSize },
		minimumFontSize: { ...themeOrDefaultValues.minimumFontSize, ...configFile.theme.extend.spacing, ...configFile.theme.extend.minimumFontSize },
		verticalMargin: { top: '-0.5', bottom: '0.5', middle: '0' },
		horizontalMargin: { left: '-0.5', right: '0.5', center: '0' },
		scale: { ...{ 1: '0.01', 5: '0.05', 10: '0.10', 25: '0.25' }, ...defaultTheme.scale },
		repeat: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
		count: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
		delay: { ...{ 0: '0ms', 25: '25ms', 50: '50ms', 250: '250ms', 350: '350ms', 400: '400ms', 450: '450ms', 600: '600ms', 800: '800ms', 900: '900ms', 2000: '2000ms', 3000: '3000ms', 4000: '4000ms', 5000: '5000ms' }, ...defaultTheme.transitionDelay }
	};

	_.merge(base.colors, themeOrDefaultValues.colors, configFile.theme.extend.colors);
	_.merge(base.spacing, themeOrDefaultValues.spacing, configFile.theme.extend.spacing);
	_.merge(base.width, themeOrDefaultValues.spacing, configFile.theme.extend.spacing, themeOrDefaultValues.width, configFile.theme.extend.width);
	_.merge(base.height, themeOrDefaultValues.spacing, configFile.theme.extend.spacing, themeOrDefaultValues.height, configFile.theme.extend.height);

	fixPercentages(base.width);
	fixPercentages(base.height);
	fixPercentages(base.spacing);
	// fixfontSize(base.fontSize);

	//! Extras...
	base.transitionDuration = { ...base.delay, ...defaultTheme.transitionDuration };
	base.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily');
	base.fontSize = combineKeys(configFile.theme, base.fontSize, 'fontSize');
	base.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight');
	base.textColor = combineKeys(configFile.theme, base.colors, 'textColor');

	base.margin = combineKeys(configFile.theme, base.spacing, 'margin');
	base.padding = combineKeys(configFile.theme, helpers.removeFractions(base.spacing, ['full', 'auto', 'screen']), 'padding');
	base.countDownDuration = { ...base.delay, ...defaultTheme.transitionDuration };
	base.noFractions = helpers.removeFractions(base.spacing, ['full', 'auto', 'screen']);
	base.minimumFontSize = combineKeys(configFile.theme, base.fontSize, 'minimumFontSize');

	// combineKeys(configFile.theme, (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, 'borderRadius');
	base.borderRadius = helpers.processBorderRadius(helpers.removeFractions((configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, ['full', 'auto', 'screen']));

	_.each(base, (_value, key) => {
		delete configFile.theme[key];
	});

	delete base.margin.screen;
	delete base.zIndex.auto;

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

function removePxFromDefaultTheme(theObject) {
	_.each(theObject, (value, key) => {
		if (value.toString().includes('px')) {
			theObject[key] = value.replace('px', '');
		}
	});

	return theObject;
}

function fixfontSize(theObject) {
	_.each(theObject, value => {
		if (value.length > 1) {
			value.pop();
		}
	});
}

function combineKeys(values, base, key) {
	return (values[key]) ? { ...values[key], ...values.extend[key] } : { ...base, ...values.extend[key] };
}

function getPropertiesFromTiCompletionsFile() {
	let propertiesOnly = {};
	let properties = [
		//! Deprecated
		'handlePlatformUrl',
		'selectionIndicator',
		'semanticColorType',
		'splitActionBar',
		'supported',
		'tabsTintColor',
		'unselectedItemTintColor',
		'wordWrap',

		//! Readonly
		'animating',
		'batteryState',
		'externalPlaybackActive',
		'isAdvertisingTrackingEnabled',
		'landscape',
		'muted',
		'orientation',
		'paused',
		'playing',
		'portrait',
		'waiting',

		//! Handled by PurgeTSS
		'fontFamily',
		'fontSize',
		'fontWeight',
		'minimumFontSize',
		'orientationModes',
		'textColor',

	];
	_.each(tiCompletionsFile.types, (value, key) => {
		_.each(value.properties, property => {
			if (validTypesOnly(property, key) && !properties.includes(property)) {
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

function validTypesOnly(property, key) {
	return key.includes('Ti.UI.')
		|| tiCompletionsFile.properties[property].type === 'Boolean'
		|| tiCompletionsFile.properties[property].type === 'Point'
		|| tiCompletionsFile.properties[property].type === 'Number'
		|| tiCompletionsFile.properties[property].type === 'Array'
		|| tiCompletionsFile.properties[property].type === 'String';
}

function fixDefaultScale(values) {
	_.each(values, (value, key) => {
		if (value.startsWith('.')) {
			values[key] = '0' + value;
		}
	});

	return values;
}

function processComments(key, data) {
	let myComments = '';

	// if (data.type) {
	// 	myComments += `\n// Type: ${data.type}`;
	// }

	myComments += `\n// Property: ${key}`;

	if (data.description) {
		// remove hrefs
		myComments += `\n// Description: ${data.description.replace(/\n/g, ' ').replace(/<code>|<\/code>/g, '').replace(/<strong>|<\/strong>/g, '').replace(/<em>|<\/em>/g, '').replace(/<a[^>]*>|<\/a>/g, '')}`;
	}

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
					myClasses += `'.${setModifier(removeUneededVariablesFromPropertyName(camelCaseToDash(key + '-' + _key + '-' + __key)))}': { ${key}: ${helpers.parseValue(_value)} }\n`;
				});
			} else {
				myClasses += `'.${setModifier(removeUneededVariablesFromPropertyName(camelCaseToDash(key + '-' + _key)))}': { ${key}: ${helpers.parseValue(value)} }\n`;
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
	if (fs.existsSync(projectConfigJS) && debugMode) {
		makeSureFolderExists(cwd + '/purgetss/experimental/tailwind-classes/');
		saveFile(cwd + `/purgetss/experimental/tailwind-classes/${key}.tss`, classes);
	}
}

function formatClass(key, value) {
	return `'.${formatClassName(key, value)}': { ${key}: ${value} }\n`;
}

function formatClassName(property, value) {
	return removeUneededVariablesFromPropertyName(camelCaseToDash(`${property}-${removeModuleName(value, property)}`));
}

function removeUneededVariablesFromPropertyName(property) {
	return Array.from(new Set(property.split('-')))
		.join('-')

		.replace('-default', '')
		.replace('prevent-image', 'prevent-default-image')
		.replace('-input-buttonmode', '')
		.replace('-option-', '-')
		.replace('-ti-platform-android', '')
		.replace('-ti-platform', '')
		.replace('-ti-confidential-', '-')
		.replace('-ti-', '-')
		.replace('-android', '')
		.replace('-true', '')
		.replace('-user-notification', '')
		.replace('-user-setting', '')
		.replace('align-alignment-', '')
		.replace('autolink', '')
		.replace('background-', 'bg-')
		.replace('border-width', 'border')
		.replace('color-', '')
		.replace('column-', 'col-')
		.replace('flag-', '')
		.replace('height-', 'h-')
		.replace('input-borderstyle-', '')
		.replace('layout-', '')
		.replace('recurrencefrequency', 'recurrence')
		.replace('returnkey-', '')
		.replace('text-alignment-', '')
		.replace('width-', 'w-')
		.replace('-bg-false', '-background-false')
		.replace('bg-repeat', 'background-repeat')
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
