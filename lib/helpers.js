const _ = require('lodash');
const HEX_3_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; // i.e. #0F3
const HEX_4_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i; // i.e. #80F3
const HEX_6_REGEX = /^#?([a-f\d]){6}$/i; // i.e. #00FF33
const HEX_8_REGEX = /^#?([a-f\d]){8}$/i; // i.e. #8800FF33

function resetStyles() {

	let convertedStyles = '\n// Custom Styles and Resets\n';

	convertedStyles += customRules({ ios: { clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED' } }, '.clip-disabled');
	convertedStyles += customRules({ ios: { clipMode: 'Ti.UI.iOS.CLIP_MODE_ENABLED' } }, '.clip-enabled');
	convertedStyles += customRules({ default: { layout: 'horizontal' } }, '.horizontal');
	convertedStyles += customRules({ default: { layout: 'vertical' } }, '.vertical');
	convertedStyles += customRules({ ios: { hires: true } }, 'ImageView');
	convertedStyles += customRules({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, 'View');
	convertedStyles += customRules({ default: { backgroundColor: '#ffffff' } }, 'Window');

	return convertedStyles;
}
exports.resetStyles = resetStyles;

// Main Functions
function processModifiersAndColorProperties(header, objectPosition, modifiersAndValues) {
	let convertedStyles = `\n// ${header} Property\n`;

	_.each(objectPosition, (properties, rule) => {
		_.each(modifiersAndValues, (value, modifier) => {
			if (typeof value === 'object') {
				_.each(value, (_value, _modifier) => {
					convertedStyles += `'.${rule}-${modifier}${setModifier(_modifier)}': ` + _.replace(properties, new RegExp("{value}", "g"), parseValue(_value)) + '\n';
				});
			} else {
				convertedStyles += `'.${rule}${setModifier(modifier)}': ` + _.replace(properties, new RegExp("{value}", "g"), parseValue(value)) + '\n';
			}
		});
	});

	return convertedStyles;
}

function processModifiersAndProperties(header, objectPosition, modifiersAndValues, minusSigns = '') {
	let convertedStyles = `\n// ${header} Property\n`;

	_.each(objectPosition, (properties, rule) => {
		_.each(modifiersAndValues, (value, modifier) => {
			if (typeof value === 'object') {
				_.each(value, (_value, _modifier) => {
					convertedStyles += `'.${rule}-${_modifier}${setModifier(modifier)}': ` + _.replace(properties, new RegExp("{value}", "g"), parseValue(_value, minusSigns)) + '\n';
				});
			} else {
				convertedStyles += `'.${rule}${setModifier(modifier)}': ` + _.replace(properties, new RegExp("{value}", "g"), parseValue(value, minusSigns)) + '\n';
			}
		});
	});

	return convertedStyles;
}

function textColor(modifiersAndValues) {
	return processModifiersAndColorProperties('color', {'text': '{ color: {value} }'}, modifiersAndValues);
}
exports.textColor = textColor;

function backgroundColor(modifiersAndValues) {
	return processModifiersAndColorProperties('backgroundColor', {'bg': '{ backgroundColor: {value} }'}, modifiersAndValues);
}
exports.backgroundColor = backgroundColor;

function backgroundSelectedColor(modifiersAndValues) {
	return processModifiersAndColorProperties('backgroundSelectedColor', {'bg-selected': '{ backgroundSelectedColor: {value} }'}, modifiersAndValues);
}
exports.backgroundSelectedColor = backgroundSelectedColor;

function borderColor(modifiersAndValues) {
	return processModifiersAndColorProperties('borderColor', {'border': '{ borderColor: {value} }'}, modifiersAndValues);
}
exports.borderColor = borderColor;

function touchFeedbackColor(modifiersAndValues) {
	return processModifiersAndColorProperties('touchFeedbackColor', {'feedback': '{ touchFeedback: true, touchFeedbackColor: {value} }'}, modifiersAndValues);
}
exports.touchFeedbackColor = touchFeedbackColor;

function placeholderColor(modifiersAndValues) {
	return processModifiersAndColorProperties('hintTextColor', {'placeholder': '{ hintTextColor: {value} }'}, modifiersAndValues);
}
exports.placeholderColor = placeholderColor;

function tintColor(modifiersAndValues) {
	return processModifiersAndColorProperties('tintColor', {'tint': '{ tintColor: {value} }'}, modifiersAndValues);
}
exports.tintColor = tintColor;

function fontFamily(modifiersAndValues) {
	return processModifiersAndProperties('fontFamily', { 'font': '{ font: { fontFamily: {value} } }' }, modifiersAndValues);
}
exports.fontFamily = fontFamily;

function backgroundGradient() {
	let convertedStyles = `\n// backgroundGradient Property\n`;

	convertedStyles += `'.bg-none': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, backFillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-t': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backFillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-tr': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backFillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-r': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, backFillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-br': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '0%', y: '0%' }, backFillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-b': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backFillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-bl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backFillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-l': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '0%' }, backFillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-tl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '100%' }, backFillStart: true } }\n`;

	return convertedStyles;
}
exports.backgroundGradient = backgroundGradient;

function gradientColorStops(modifiersAndValues) {
	let convertedStyles = '\n// Gradient Color Stops\n// From Color\n';

	let objectPosition = { 'from': '{ backgroundGradient: { colors: [ {transparentValue}, {value} ] } }' };

	_.each(objectPosition, (properties, rule) => {
		_.each(modifiersAndValues, (value, modifier) => {
			if (typeof value === 'object') {
				_.each(value, (_value, _modifier) => {
					convertedStyles += `'.${rule}-${modifier}${setModifier(_modifier)}': ` + _.replace(_.replace(properties, new RegExp("{transparentValue}", "g"), `${addTransparencyToHex(parseValue(_value))}`), new RegExp("{value}", "g"), parseValue(_value)) + '\n';
				});
			} else {
				convertedStyles += `'.${rule}${setModifier(modifier)}': ` + _.replace(_.replace(properties, new RegExp("{value}", "g"), parseValue(value)), new RegExp("{transparentValue}", "g"), `${addTransparencyToHex(parseValue(value))}`) + '\n';
			}
		});
	});

	convertedStyles += '\n// To Color\n';

	objectPosition = { 'to': '{ backgroundGradient: { colors: [ {value} ] } }' };

	_.each(objectPosition, (properties, rule) => {
		_.each(modifiersAndValues, (value, modifier) => {
			if (typeof value === 'object') {
				_.each(value, (_value, _modifier) => {
					convertedStyles += `'.${rule}-${modifier}${setModifier(_modifier)}': ` + _.replace(properties, new RegExp("{value}", "g"), parseValue(_value)) + '\n';
				});
			} else {
				convertedStyles += `'.${rule}${setModifier(modifier)}': ` + _.replace(properties, new RegExp("{value}", "g"), parseValue(value)) + '\n';
			}
		});
	});

	return convertedStyles;
}
exports.gradientColorStops = gradientColorStops;

function fontSize(modifiersAndValues) {
	let cleanValues = {};

	_.each(modifiersAndValues, (value, key) => {
		cleanValues[key] = Array.isArray(value) ? value[0] : value;
	});

	return processModifiersAndProperties('fontSize', { 'text': '{ font: { fontSize: {value} } }' }, cleanValues);
}
exports.fontSize = fontSize;

function fontStyle() {
	let convertedStyles = '\n// fontStyle Property\n';
	convertedStyles += `'.italic': { font: { fontStyle: 'italic' } }\n`;
	convertedStyles += `'.not-italic': { font: { fontStyle: 'normal' } }\n`;

	return convertedStyles;
}
exports.fontStyle = fontStyle;

function fontWeight(modifiersAndValues) {
	const invalidValues = {
		black: 'bold',
		medium: 'normal',
		extrabold: 'bold',
		hairline: 'ultralight'
	}

	_.each(modifiersAndValues, (value, key) => {
		modifiersAndValues[key] = fixInvalidValues(invalidValues, key);
	});

	return processModifiersAndProperties('fontWeight', { 'font': '{ font: { fontWeight: {value} } }' }, modifiersAndValues);
}
exports.fontWeight = fontWeight;

function borderRadiusExtraStyles(modifiersAndValues) {
	// SOME CLEANUP... VALUES NOT NEEDED IN rounded property.
	delete modifiersAndValues.min;
	delete modifiersAndValues.max;
	delete modifiersAndValues.full;
	delete modifiersAndValues.auto;
	delete modifiersAndValues.screen;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues['max-content'];

	_.each(modifiersAndValues, (value, key) => {
		if (key.includes('/')) {
			delete modifiersAndValues[key];
		} else if (['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'px', 'DEFAULT'].includes(key)) {
			modifiersAndValues[key] = value;
		} else {
			modifiersAndValues[key] = 8 * parseFloat(value);
		}
	});

	return processModifiersAndProperties('borderRadius - ( With Extra Styles )', {'rounded': '{ borderRadius: {value} }'}, modifiersAndValues);
}
exports.borderRadiusExtraStyles = borderRadiusExtraStyles;

function borderWidth(modifiersAndValues) {
	_.each(modifiersAndValues, (value, key) => {
		modifiersAndValues[key] = parseInt(value);
	});

	return processModifiersAndProperties('borderWidth', { 'border': '{ borderWidth: {value} }' }, modifiersAndValues);
}
exports.borderWidth = borderWidth;

function displayUtilities() {
	let convertedStyles = '\n// Display\n';

	convertedStyles += `'.block': { visible: true }\n`;
	convertedStyles += `'.hidden': { visible: false }\n`;

	return convertedStyles;
}
exports.displayUtilities = displayUtilities;

function shadow(shadowValue = '#80000000') {
	let convertedStyles = '\n// Box Shadow\n';

	convertedStyles += `'.shadow-xs': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: ${parseValue(shadowValue)} }\n`;
	convertedStyles += `'.shadow-sm': { viewShadowOffset: { x: 0, y: 1 }, viewShadowRadius: 1, viewShadowColor: ${parseValue(shadowValue)} }\n`;
	convertedStyles += `'.shadow': { viewShadowOffset: { x: 0, y: 2 }, viewShadowRadius: 2, viewShadowColor: ${parseValue(shadowValue)} }\n`;
	convertedStyles += `'.shadow-md': { viewShadowOffset: { x: 0, y: 4 }, viewShadowRadius: 4, viewShadowColor: ${parseValue(shadowValue)} }\n`;
	convertedStyles += `'.shadow-lg': { viewShadowOffset: { x: 0, y: 8 }, viewShadowRadius: 8, viewShadowColor: ${parseValue(shadowValue)} }\n`;
	convertedStyles += `'.shadow-xl': { viewShadowOffset: { x: 0, y: 12 }, viewShadowRadius: 12, viewShadowColor: ${parseValue(shadowValue)} }\n`;
	convertedStyles += `'.shadow-2xl': { viewShadowOffset: { x: 0, y: 16 }, viewShadowRadius: 16, viewShadowColor: ${parseValue(shadowValue)} }\n`;
	convertedStyles += `'.shadow-inner': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n`;
	convertedStyles += `'.shadow-outline': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 2, viewShadowColor: ${parseValue(shadowValue)} }\n`;
	convertedStyles += `'.shadow-none': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n`;

	return convertedStyles;
}
exports.shadow = shadow;

function opacity(modifiersAndValues) {
	return processModifiersAndProperties('opacity', {'opacity': '{ opacity: {value} }'}, modifiersAndValues);
}
exports.opacity = opacity;

function interactivity(tailwindOpacity) {
	const modifiersAndValues = {
		none: false,
		auto: true
	};

	return processModifiersAndProperties('touchEnabled', {'pointer-events': '{ touchEnabled: {value} }'}, modifiersAndValues);
}
exports.interactivity = interactivity;

function textAlign() {
	const modifiersAndValues = {
		left: 'Ti.UI.TEXT_ALIGNMENT_LEFT',
		right: 'Ti.UI.TEXT_ALIGNMENT_RIGHT',
		center: 'Ti.UI.TEXT_ALIGNMENT_CENTER',
		justify: 'Ti.UI.TEXT_ALIGNMENT_JUSTIFY'
	};

	return processModifiersAndProperties('textAlign', {'text': '{ textAlign: {value} }'}, modifiersAndValues);
}
exports.textAlign = textAlign;

function verticalAlignment() {
	const modifiersAndValues = {
		top: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP',
		middle: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER',
		bottom: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM',
	};

	return processModifiersAndProperties('verticalAlign', {'align': '{ verticalAlign: {value} }'}, modifiersAndValues);
}
exports.verticalAlignment = verticalAlignment;

function scrollableRegion() {
	let convertedStyles = '\n// Content Width & Height ( for ScrollViews )\n';

	convertedStyles += `'.content-auto': { contentWidth: Ti.UI.SIZE, contentHeight: Ti.UI.SIZE }\n`;
	convertedStyles += `'.content-screen': { contentWidth: Ti.UI.FILL, contentHeight: Ti.UI.FILL }\n`;
	convertedStyles += `'.content-w-auto': { contentWidth: Ti.UI.SIZE }\n`;
	convertedStyles += `'.content-w-screen': { contentWidth: Ti.UI.FILL }\n`;
	convertedStyles += `'.content-h-auto': { contentHeight: Ti.UI.SIZE }\n`;
	convertedStyles += `'.content-h-screen': { contentHeight: Ti.UI.FILL }\n`;

	return convertedStyles;
}
exports.scrollableRegion = scrollableRegion;

function scrollIndicators() {
	let convertedStyles = '\n// Scroll Indicators ( for ScrollViews )\n';

	convertedStyles += `'.overflow-scroll': { showHorizontalScrollIndicator: true, showVerticalScrollIndicator: true }\n`;
	convertedStyles += `'.overflow-hidden': { showHorizontalScrollIndicator: false, showVerticalScrollIndicator: false }\n`;
	convertedStyles += `'.overflow-x-scroll': { showHorizontalScrollIndicator: true }\n`;
	convertedStyles += `'.overflow-x-hidden': { showHorizontalScrollIndicator: false }\n`;
	convertedStyles += `'.overflow-y-scroll': { showVerticalScrollIndicator: true }\n`;
	convertedStyles += `'.overflow-y-hidden': { showVerticalScrollIndicator: false }\n`;

	return convertedStyles;
}
exports.scrollIndicators = scrollIndicators;

function placement() {
	const objectPosition = {
		'top-0': 'top: 0',
		'left-0': 'left: 0',
		'right-0': 'right: 0',
		'bottom-0': 'bottom: 0',

		'top-auto': 'top: Ti.UI.SIZE',
		'left-auto': 'left: Ti.UI.SIZE',
		'right-auto': 'right: Ti.UI.SIZE',
		'bottom-auto': 'bottom: Ti.UI.SIZE',

		'inset-0': 'top: 0, right: 0, bottom: 0, left: 0',
		'inset-y-0': 'top: 0, bottom: 0',
		'inset-x-0': 'right: 0, left: 0',

		'inset-auto': 'top: Ti.UI.SIZE, right: Ti.UI.SIZE, bottom: Ti.UI.SIZE, left: Ti.UI.SIZE',
		'inset-y-auto': 'top: Ti.UI.SIZE, bottom: Ti.UI.SIZE',
		'inset-x-auto': 'right: Ti.UI.SIZE, left: Ti.UI.SIZE'
	}

	let convertedStyles = '\n// Top / Right / Bottom / Left\n';

	_.each(objectPosition, (value, modifier) => {
		convertedStyles += `'.${modifier}': { ${value} }\n`;
	});

	return convertedStyles;
}
exports.placement = placement;

function margin(modifiersAndValues, internal = false) {
	let objectPosition = {
		'm': '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
		'my': '{ top: {value}, bottom: {value} }',
		'mx': '{ right: {value}, left: {value} }',
		'mt': '{ top: {value} }',
		'mr': '{ right: {value} }',
		'mb': '{ bottom: {value} }',
		'ml': '{ left: {value} }',
	}

	// SOME CLEANUP... VALUES NOT NEEDED IN rounded property.
	delete modifiersAndValues.min;
	delete modifiersAndValues.max;
	delete modifiersAndValues.screen;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues['max-content'];

	if (!modifiersAndValues.auto) {
		modifiersAndValues.auto = 'auto';
	}

	let convertedStyles = processModifiersAndProperties('Margin', objectPosition, modifiersAndValues);

	objectPosition = {
		'-m': '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
		'-my': '{ top: {value}, bottom: {value} }',
		'-mx': '{ right: {value}, left: {value} }',
		'-mt': '{ top: {value} }',
		'-mr': '{ right: {value} }',
		'-mb': '{ bottom: {value} }',
		'-ml': '{ left: {value} }',
	}

	delete modifiersAndValues['0'];
	delete modifiersAndValues.auto;

	convertedStyles += processModifiersAndProperties('Negative Margins', objectPosition, modifiersAndValues, '-');

	return convertedStyles;
}
exports.margin = margin;

function padding(modifiersAndValues) {
	const objectPosition = {
		'p': '{ padding: { top: {value}, right: {value}, bottom: {value}, left: {value} } }',
		'py': '{ padding: { top: {value}, bottom: {value} } }',
		'px': '{ padding: { right: {value}, left: {value} } }',
		'pt': '{ padding: { top: {value} } }',
		'pr': '{ padding: { right: {value} } }',
		'pb': '{ padding: { bottom: {value} } }',
		'pl': '{ padding: { left: {value} } }',
	}

	modifiersAndValues['0'] = 0;
	delete modifiersAndValues.min;
	delete modifiersAndValues.max;
	delete modifiersAndValues.auto;
	delete modifiersAndValues.screen;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues['max-content'];

	return processModifiersAndProperties('padding', objectPosition, modifiersAndValues);;
}
exports.padding = padding;

function width(modifiersAndValues) {
	delete modifiersAndValues.min;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues.max;
	delete modifiersAndValues['max-content'];

	return processModifiersAndProperties('width', {'w': '{ width: {value} }'}, modifiersAndValues);
}
exports.width = width;

function height(modifiersAndValues) {
	delete modifiersAndValues.min;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues.max;
	delete modifiersAndValues['max-content'];

	return processModifiersAndProperties('height', { 'h': '{ height: {value} }' }, modifiersAndValues);
}
exports.height = height;

function customRules(_value, _key) {
	// !Have to refactor
	let convertedStyles = '';

	_.each(_value, (value, modifier) => {
		let customProperties = '';

		_.each(value, (theValue, theModifier) => {
			if (typeof (theValue) === 'object' && theValue !== null) {
				customProperties += ` ${theModifier}: {`;

				let extraCustomProperties = '';

				_.each(theValue, (extraValue, extraModifier) => {
					if (typeof (extraValue) === 'object' && extraValue !== null) {
						customProperties += ` ${extraModifier}: {`;

						let moreExtraCustomProperties = '';

						_.each(extraValue, (moreExtraValue, moreModifier) => {
							moreExtraCustomProperties += ` ${moreModifier}: ${parseValue(moreExtraValue)},`;
						});

						customProperties += `${remove_last_character(moreExtraCustomProperties)} },`;
					} else {
						extraCustomProperties += ` ${extraModifier}: ${parseValue(extraValue)},`;
					}
				});

				customProperties += `${remove_last_character(extraCustomProperties)} },`;
			} else {
				customProperties += ` ${theModifier}: ${parseValue(theValue)},`;
			}
		});

		modifier = setModifier(modifier);

		convertedStyles += `'${_key}${modifier}': {${remove_last_character(customProperties)} }\n`;
	});

	return convertedStyles;
}
exports.customRules = customRules;

//! Private Functions
function setModifier(modifier) {
	if (defaultModifier(modifier)) {
		modifier = '';
	} else if (modifier === 'ios') {
		modifier = '[platform=ios]';
	} else if (modifier === 'android') {
		modifier = '[platform=android]';
	} else if (modifier === 'handheld') {
		modifier = '[formFactor=handheld]';
	} else if (modifier === 'tablet') {
		modifier = '[formFactor=tablet]';
	} else if (modifier.startsWith('[if=') ) {
		modifier = `${modifier}`;
	} else if (modifier !== '' && !modifier.startsWith('-')) {
		modifier = `-${modifier}`;
	} else {
		modifier = modifier;
	}

	return modifier;
}

function defaultModifier(modifier) {
	return modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT';
}

function checkTitanium(value) {
	let substrings = ['Alloy', 'Ti.', 'Titanium', 'L('];

	if (substrings.some(substring => { return value.indexOf(substring) >= 0; })) {
		return 'titanium';
	} else if (value.includes('#')) {
		return 'hex';
	}

	return value.replace(/[^a-zA-Z#%]+/g, '');
}

function parseValue(value, sign = '') {
	if (value === '') return `''`;

	// Hack for unicode values
	if (/[^\u0000-\u00ff]/.test(value)) {
		return `'\\u${value.charCodeAt(0).toString(16)}'`;
	}

	if (value === '0px') {
		value = 0;
	}

	let unit = isNaN(value) ? checkTitanium(value) : value;

	switch (unit) {
		case '0':
		case true:
		case false:
		case 'titanium':
			return `${sign}${value}`;
		case 'vw':
		case 'vh':
		case 'screen':
			return 'Ti.UI.FILL';
		case 'auto':
			return 'Ti.UI.SIZE';
		case 'none':
			return null;
		case 'rem':
			return `${sign}${16 * parseFloat(value)}`;
		case 'dp':
			return `${sign}${parseFloat(value)}`;
		case 'hex':
			return toHex(value);
		case 'transparent':
			return `'${value}'`;
		default:
			return isNaN(value) ? `'${sign}${value}'` : `${sign}${value}`;
	}
}
exports.parseValue = parseValue;

function fixInvalidValues(invalidValues, currentValue) {
	return invalidValues[currentValue] || currentValue;
}

function remove_last_character(element) {
	return element.slice(0, element.length - 1)
}

function addTransparencyToHex(color) {
	if (color.includes('#')) {
		switch (color.length) {
			case 4:
				color = `#0${color[0]}${color[1]}${color[2]}`
				break;
			case 7:
				color = `#00${color[0]}${color[1]}${color[2]}${color[3]}${color[4]}${color[5]}`
				break;
			case 9:
				color = `#00${color[2]}${color[3]}${color[4]}${color[5]}${color[6]}${color[7]}`
				break;
			case 11:
				color = `#00${color[4]}${color[5]}${color[6]}${color[7]}${color[8]}${color[9]}`
				break;
		}
		return `'${color}'`;
	}

	return color;
}
exports.addTransparencyToHex = addTransparencyToHex;

function toHex(color) {
	if (color.includes('#')) {
		color = expandHex(color);
	} else if (color.match(/rgba?/i)) {
		color = rgbToHex(color);
	} if (defaultColors(color)) {
		color = defaultColors(color);
	}

	return `'${color}'`;
}

function expandHex(color) {
	// expand the shorter hex string forms to 6 or 8 digits
	if (color.length === 4) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		color = color.replace(HEX_3_REGEX, (m, r, g, b) => '#' + r + r + g + g + b + b);
	} else if (color.length === 5) {
		// Expand shorthand form (e.g. "03F8") to full form (e.g. "0033FF88")
		color = color.replace(HEX_4_REGEX, (m, a, r, g, b) => '#' + a + a + r + r + g + g + b + b);
	}

	return color;
}

function rgbToHex(color) {
	const rgba = color.replace(/^rgba?\(|\s+|\)$/img, '').split(',');
	const alpha = (((rgba[3] || 01) * 255) | 1 << 8).toString(16).slice(1);
	return `#${alpha}${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
}

function defaultColors(color) {
	const colors = {
		aqua: '#00FFFF',
		aquamarine: '#7FFFD4',
		azure: '#F0FFFF',
		beige: '#F5F5DC',
		bisque: '#FFE4C4',
		black: '#000000',
		blue: '#0000FF',
		brown: '#A52A2A',
		chartreuse: '#7FFF00',
		chocolate: '#D2691E',
		coral: '#FF7F50',
		cornsilk: '#FFF8DC',
		crimson: '#DC143C',
		cyan: '#00FFFF',
		darkgray: '#444444',
		fuchsia: '#FF00FF',
		gainsboro: '#DCDCDC',
		gold: '#FFD700',
		gray: '#808080',
		green: '#008000',
		grey: '#808080',
		indigo: '#4B0082',
		ivory: '#FFFFF0',
		khaki: '#F0E68C',
		lavender: '#E6E6FA',
		lightgray: '#cccccc',
		lime: '#00FF00',
		linen: '#FAF0E6',
		magenta: '#FF00FF',
		maroon: '#800000',
		moccasin: '#FFE4B5',
		navy: '#000080',
		olive: '#808000',
		orange: '#FFA500',
		orchid: '#DA70D6',
		peru: '#CD853F',
		pink: '#FFC0CB',
		plum: '#DDA0DD',
		purple: '#800080',
		red: '#FF0000',
		salmon: '#FA8072',
		sienna: '#A0522D',
		silver: '#C0C0C0',
		snow: '#FFFAFA',
		tan: '#D2B48C',
		teal: '#008080',
		thistle: '#D8BFD8',
		tomato: '#FF6347',
		turquoise: '#40E0D0',
		violet: '#EE82EE',
		wheat: '#F5DEB3',
		white: '#FFFFFF',
		yellow: '#FFFF00',
		'alice-blue': '#F0F8FF',
		'antique-white': '#FAEBD7',
		'blanched-almond': '#FFEBCD',
		'blue-violet': '#8A2BE2',
		'burly-wood': '#DEB887',
		'cadet-blue': '#5F9EA0',
		'cornflower-blue': '#6495ED',
		'dark-blue': '#00008B',
		'dark-cyan': '#008B8B',
		'dark-golden-rod': '#B8860B',
		'dark-gray': '#A9A9A9',
		'dark-green': '#006400',
		'dark-grey': '#A9A9A9',
		'dark-khaki': '#BDB76B',
		'dark-magenta': '#8B008B',
		'dark-olive-green': '#556B2F',
		'dark-orange': '#FF8C00',
		'dark-orchid': '#9932CC',
		'dark-red': '#8B0000',
		'dark-salmon': '#E9967A',
		'dark-sea-green': '#8FBC8F',
		'dark-slate-blue': '#483D8B',
		'dark-slate-gray': '#2F4F4F',
		'dark-slate-grey': '#2F4F4F',
		'dark-turquoise': '#00CED1',
		'dark-violet': '#9400D3',
		'deep-pink': '#FF1493',
		'deep-sky-blue': '#00BFFF',
		'dim-gray': '#696969',
		'dim-grey': '#696969',
		'dodger-blue': '#1E90FF',
		'fire-brick': '#B22222',
		'floral-white': '#FFFAF0',
		'forest-green': '#228B22',
		'ghost-white': '#F8F8FF',
		'golden-rod': '#DAA520',
		'green-yellow': '#ADFF2F',
		'honey-dew': '#F0FFF0',
		'hot-pink': '#FF69B4',
		'indian-red': '#CD5C5C',
		'lavender-blush': '#FFF0F5',
		'lawn-green': '#7CFC00',
		'lemon-chiffon': '#FFFACD',
		'light-blue': '#ADD8E6',
		'light-coral': '#F08080',
		'light-cyan': '#E0FFFF',
		'light-golden-rod-yellow': '#FAFAD2',
		'light-gray': '#D3D3D3',
		'light-green': '#90EE90',
		'light-grey': '#D3D3D3',
		'light-pink': '#FFB6C1',
		'light-salmon': '#FFA07A',
		'light-sea-green': '#20B2AA',
		'light-sky-blue': '#87CEFA',
		'light-slate-gray': '#778899',
		'light-slate-grey': '#778899',
		'light-steel-blue': '#B0C4DE',
		'light-yellow': '#FFFFE0',
		'lime-green': '#32CD32',
		'medium-aqua-marine': '#66CDAA',
		'medium-blue': '#0000CD',
		'medium-orchid': '#BA55D3',
		'medium-purple': '#9370DB',
		'medium-sea-green': '#3CB371',
		'medium-slate-blue': '#7B68EE',
		'medium-spring-green': '#00FA9A',
		'medium-turquoise': '#48D1CC',
		'medium-violet-red': '#C71585',
		'midnight-blue': '#191970',
		'mint-cream': '#F5FFFA',
		'misty-rose': '#FFE4E1',
		'navajo-white': '#FFDEAD',
		'old-lace': '#FDF5E6',
		'olive-drab': '#6B8E23',
		'orange-red': '#FF4500',
		'pale-golden-rod': '#EEE8AA',
		'pale-green': '#98FB98',
		'pale-turquoise': '#AFEEEE',
		'pale-violet-red': '#DB7093',
		'papaya-whip': '#FFEFD5',
		'peach-puff': '#FFDAB9',
		'powder-blue': '#B0E0E6',
		'rebecca-purple': '#663399',
		'rosy-brown': '#BC8F8F',
		'royal-blue': '#4169E1',
		'saddle-brown': '#8B4513',
		'sandy-brown': '#F4A460',
		'sea-green': '#2E8B57',
		'sea-shell': '#FFF5EE',
		'sky-blue': '#87CEEB',
		'slate-blue': '#6A5ACD',
		'slate-gray': '#708090',
		'slate-grey': '#708090',
		'spring-green': '#00FF7F',
		'steel-blue': '#4682B4',
		'white-smoke': '#F5F5F5',
		'yellow-green': '#9ACD32'
	}

	return colors[color] || null;
}
