const _ = require('lodash');

function resetStyles() {

	let convertedStyles = '\n// Reset Styles\n';

	convertedStyles += singleValue('Window', '', 'backgroundColor', `'#ffffff'`);

	convertedStyles += singleValue('ImageView[platform=ios]', '', 'hires', true);

	convertedStyles += `'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }\n`;

	convertedStyles += `'.vertical': { layout: 'vertical' }\n`;
	convertedStyles += `'.horizontal': { layout: 'horizontal' }\n`;
	convertedStyles += `'.vertical[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }\n`;
	convertedStyles += `'.horizontal[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }\n`;
	convertedStyles += singleValue('.clip-enabled[platform=ios]', '', 'clipMode', 'Ti.UI.iOS.CLIP_MODE_ENABLED');

	return convertedStyles;
}
exports.resetStyles = resetStyles;

function colors(tailwindColors) {
	const rulesAndProperties = {
		'text-': 'color',
		'bg-': 'backgroundColor',
		'border-': 'borderColor',
		'placeholder-': 'hintTextColor'
	};

	let convertedStyles = '\n// Colors';

	_.each(rulesAndProperties, (property, rule) => {
		convertedStyles += '\n// ' + property + ' Property\n';
		_.each(tailwindColors, (hexValue, modifier) => {
			if (typeof hexValue === 'string' && hexValue !== 'currentColor') {
				convertedStyles += singleValue(`.${rule}`, modifier, property, `'${hexValue}'`);
			} else if (hexValue !== 'currentColor') {
				_.each(hexValue, (shadeValue, shadeName) => {
					convertedStyles += singleValue(`.${rule}`, `${modifier}-${shadeName}`, property, `'${shadeValue}'`);
				});
			}
		});
	});

	return convertedStyles;
}
exports.colors = colors;

function processColorProperties(header, rule, property, data) {
	let convertedStyles = `\n// ${header} Property\n`;

	_.each(data, (hexValue, modifier) => {
		if (typeof hexValue === 'string' && hexValue !== 'currentColor') {
			convertedStyles += singleValue(`${rule}`, modifier, `${property}`, `'${hexValue}'`);
		} else if (hexValue !== 'currentColor') {
			_.each(hexValue, (shadeValue, shadeName) => {
				if (shadeName === 'DEFAULT' || shadeName === 'default') {
					convertedStyles += singleValue(`${rule}`, `${modifier}`, `${property}`, `'${shadeValue}'`);
				} else {
					convertedStyles += singleValue(`${rule}`, `${modifier}-${shadeName}`, `${property}`, `'${shadeValue}'`);
				}
			});
		}
	});

	return convertedStyles;
}
function textColor(tailwindColors) {
	return processColorProperties('color', '.text-', 'color', tailwindColors);
}
exports.textColor = textColor;

function backgroundColor(tailwindColors) {
	return processColorProperties('backgroundColor', '.bg-', 'backgroundColor', tailwindColors);
}
exports.backgroundColor = backgroundColor;

function borderColor(tailwindColors) {
	return processColorProperties('borderColor', '.border-', 'borderColor', tailwindColors);
}
exports.borderColor = borderColor;

function placeholderColor(tailwindColors) {
	return processColorProperties('hintTextColor', '.placeholder-', 'hintTextColor', tailwindColors);
}
exports.placeholderColor = placeholderColor;

function fontFamily(values) {
	let convertedStyles = '\n// fontFamily Property\n';

	_.each(values, (value, modifier) => {
		convertedStyles += multiValues('.font-', modifier, 'font', ` fontFamily : '${value}'`);
	});

	return convertedStyles;
}
exports.fontFamily = fontFamily;

function backgroundGradient() {
	return `\n// backgroundGradient Property\n'.bg-none': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, backFillStart: true } }
'.bg-gradient-to-t': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backFillStart: true } }
'.bg-gradient-to-tr': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backFillStart: true } }
'.bg-gradient-to-r': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, backFillStart: true } }
'.bg-gradient-to-br': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '0%', y: '0%' }, backFillStart: true } }
'.bg-gradient-to-b': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backFillStart: true } }
'.bg-gradient-to-bl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backFillStart: true } }
'.bg-gradient-to-l': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '0%' }, backFillStart: true } }
'.bg-gradient-to-tl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '100%' }, backFillStart: true } }\n`;
}
exports.backgroundGradient = backgroundGradient;

function gradientColorStops(tailwindColors) {
	let rulesAndProperties = [ 'from-' ];

	let convertedStyles = '\n// Gradient Color Stops';

	_.each(rulesAndProperties, rule => {
		convertedStyles += '\n// From Color\n';
		_.each(tailwindColors, (hexValue, modifier) => {
			if (typeof hexValue === 'string') {
				if (hexValue === 'transparent') {
					convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '${hexValue}', '${hexValue}' ] } }\n`;
				} else if (hexValue !== 'currentColor') {
					convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '` + addTransparency(hexValue, 1) + `', '${hexValue}' ] } }\n`;
				}
			} else {
				_.each(hexValue, (shadeValue, shadeName) => {
					if (shadeName === 'DEFAULT' || shadeName === 'default') {
						convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '` + addTransparency(shadeValue, 1) + `', '${shadeValue}' ] } }\n`;
					} else {
						convertedStyles += `'.${rule}${modifier}-${shadeName}': { backgroundGradient: { colors: [ '` + addTransparency(shadeValue, 1) + `', '${shadeValue}' ] } }\n`;
					}
				});
			}
		});
	});

	rulesAndProperties = [ 'to-' ];

	_.each(rulesAndProperties, rule => {
		convertedStyles += '\n// To Color\n';
		_.each(tailwindColors, (hexValue, modifier) => {
			if (typeof hexValue === 'string' && hexValue !== 'currentColor') {
				convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '${hexValue}' ] } }\n`;
			} else if (hexValue !== 'currentColor') {
				_.each(hexValue, (shadeValue, shadeName) => {
					if (shadeName === 'DEFAULT' || shadeName === 'default') {
						convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '${shadeValue}' ] } }\n`;
					} else {
						convertedStyles += `'.${rule}${modifier}-${shadeName}': { backgroundGradient: { colors: [ '${shadeValue}' ] } }\n`;
					}
				});
			}
		});
	});

	return convertedStyles;
}
exports.gradientColorStops = gradientColorStops;

function fontSize(tailwindFontSizes) {
	let convertedStyles = '\n// fontSize Property\n';

	_.each(tailwindFontSizes, (value, modifier) => {
		if (typeof value === 'string') {
			convertedStyles += singleValue('.text-', modifier, 'font: { fontSize', `${parseValue(value)} }`);
		} else {
			convertedStyles += singleValue('.text-', modifier, 'font: { fontSize', `${parseValue(value[ 0 ])} }`);
		}
	});

	return convertedStyles;
}
exports.fontSize = fontSize;

function fontStyle() {
	let convertedStyles = '\n// fontStyle Property\n';

	convertedStyles += `'.italic': { font: { fontStyle: 'italic' } }\n`;

	convertedStyles += `'.not-italic': { font: { fontStyle: 'normal' } }\n`;

	return convertedStyles;
}
exports.fontStyle = fontStyle;

function fontWeight(fontWeights) {
	// Valid values are "bold", "semibold", "normal", "thin", "light" and "ultralight".
	const invalidValues = {
		black: 'bold',
		medium: 'normal',
		extrabold: 'bold',
		hairline: 'ultralight'
	}

	let convertedStyles = '\n// fontWeight Property\n';

	_.each(fontWeights, (value, modifier) => {
		convertedStyles += singleValue('.font-', `${modifier}`, 'font: { fontWeight', `'${fixInvalidValues(invalidValues, modifier)}' }`);
	});

	return convertedStyles;
}
exports.fontWeight = fontWeight;

function borderRadius(tailwindBorderRadius) {
	let convertedStyles = '\n// borderRadius Property\n';

	_.each(tailwindBorderRadius, (value, modifier) => {
		if (modifier === 'default' || modifier === 'DEFAULT') {
			convertedStyles += singleValue('.rounded', '', 'borderRadius', parseValue(value));
		} else if (modifier === 'full') {
			// convertedStyles += singleValue('.rounded-full', '', 'borderRadius', 4);
		} else {
			convertedStyles += singleValue('.rounded-', modifier, 'borderRadius', parseValue(value));
		}
	});

	return convertedStyles;
}
exports.borderRadius = borderRadius;

function borderRadiusExtraStyles(spacing) {
	let convertedStyles = '\n// borderRadius Property - ( With Extra Styles )\n';

	_.each(spacing, (value, modifier) => {
		if (modifier === 'default' || modifier === 'DEFAULT') {
			convertedStyles += singleValue('.rounded', '', 'borderRadius', parseValue(value));
		} else if (!modifier.includes('/') && modifier !== 'full' && modifier !== 'px') {
			convertedStyles += singleValue('.rounded-', modifier, 'borderRadius', 8 * parseFloat(value));
		} else if (modifier === 'px') {
			convertedStyles += singleValue('.rounded-', 'px', 'borderRadius', "'1px'");
		}
	});

	return convertedStyles;
}
exports.borderRadiusExtraStyles = borderRadiusExtraStyles;

function borderWidth(tailwindBorderWidth) {
	let convertedStyles = '\n// borderWidth Property\n';

	_.each(tailwindBorderWidth, (value, modifier) => {
		if (modifier === 'default' || modifier === 'DEFAULT') {
			convertedStyles += singleValue('.border', '', 'borderWidth', "'1px'");
		} else if (value.includes('px')) {
			convertedStyles += singleValue('.border-', modifier, 'borderWidth', parseInt(value))
		} else {
			convertedStyles += singleValue('.border-', modifier, 'borderWidth', parseValue(value))
		}
	});

	return convertedStyles;
}
exports.borderWidth = borderWidth;

function shadow() {

	// boxShadow: NEXT TIME!!!
	let convertedStyles = '\n// Box Shadow\n';

	convertedStyles += `'.shadow-xs': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: '#77000000' }\n`;
	convertedStyles += `'.shadow-sm': { viewShadowOffset: { x: 0, y: 1 }, viewShadowRadius: 1, viewShadowColor: '#77000000' }\n`;
	convertedStyles += `'.shadow': { viewShadowOffset: { x: 0, y: 2 }, viewShadowRadius: 2, viewShadowColor: '#77000000' }\n`;
	convertedStyles += `'.shadow-md': { viewShadowOffset: { x: 0, y: 4 }, viewShadowRadius: 4, viewShadowColor: '#77000000' }\n`;
	convertedStyles += `'.shadow-lg': { viewShadowOffset: { x: 0, y: 8 }, viewShadowRadius: 8, viewShadowColor: '#77000000' }\n`;
	convertedStyles += `'.shadow-xl': { viewShadowOffset: { x: 0, y: 12 }, viewShadowRadius: 12, viewShadowColor: '#77000000' }\n`;
	convertedStyles += `'.shadow-2xl': { viewShadowOffset: { x: 0, y: 16 }, viewShadowRadius: 16, viewShadowColor: '#77000000' }\n`;
	convertedStyles += `'.shadow-inner': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n`;
	convertedStyles += `'.shadow-outline': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 2, viewShadowColor: '#77000000' }\n`;
	convertedStyles += `'.shadow-none': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n`;

	return convertedStyles;
}
exports.shadow = shadow;

function opacity(tailwindOpacity) {
	let convertedStyles = '\n// opacity Property\n';

	_.each(tailwindOpacity, (value, modifier) => {
		convertedStyles += singleValue('.opacity-', modifier, 'opacity', parseFloat(value));
	});

	return convertedStyles;
}
exports.opacity = opacity;

function interactivity(tailwindOpacity) {
	let convertedStyles = '\n// touchEnabled Property\n';

	convertedStyles += `'.pointer-events-none': { touchEnabled: false }\n`;
	convertedStyles += `'.pointer-events-auto': { touchEnabled: true }\n`;

	return convertedStyles;
}
exports.interactivity = interactivity;

function textAlign() {
	const alignments = {
		left: 'Ti.UI.TEXT_ALIGNMENT_LEFT',
		right: 'Ti.UI.TEXT_ALIGNMENT_RIGHT',
		center: 'Ti.UI.TEXT_ALIGNMENT_CENTER',
		justify: 'Ti.UI.TEXT_ALIGNMENT_JUSTIFY'
	};

	let convertedStyles = '\n// textAlign Property\n';

	_.each(alignments, (value, modifier) => {
		convertedStyles += singleValue('.text-', modifier, 'textAlign', value);
	});

	return convertedStyles;
}
exports.textAlign = textAlign;

function verticalAlignment() {
	const alignments = {
		top: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP',
		middle: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER',
		bottom: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM',
	};

	let convertedStyles = '\n// verticalAlign Property\n';

	_.each(alignments, (value, modifier) => {
		convertedStyles += singleValue('.align-', modifier, 'verticalAlign', value);
	});

	return convertedStyles;
}
exports.verticalAlignment = verticalAlignment;

function placement() {
	const objectPosition = {
		'top-0': 'top: 0',
		'left-0': 'left: 0',
		'right-0': 'right: 0',
		'bottom-0': 'bottom: 0',

		'top-auto': 'top: null',
		'left-auto': 'left: null',
		'right-auto': 'right: null',
		'bottom-auto': 'bottom: null',

		'inset-0': 'top: 0, right: 0, bottom: 0, left: 0',
		'inset-y-0': 'top: 0, bottom: 0',
		'inset-x-0': 'right: 0, left: 0',

		'inset-auto': 'top: null, right: null, bottom: null, left: null',
		'inset-y-auto': 'top: null, bottom: null',
		'inset-x-auto': 'right: null, left: null'
	}

	let convertedStyles = '\n// Top / Right / Bottom / Left\n';

	_.each(objectPosition, (value, modifier) => {
		convertedStyles += `'.${modifier}': { ${value} }\n`;
	});

	return convertedStyles;
}
exports.placement = placement;

function margin(spacing, internal = false) {
	const objectPosition = {
		'm': [ 'top', 'right', 'bottom', 'left' ],
		'my': [ 'top', 'bottom' ],
		'mx': [ 'right', 'left' ],
		'mt': [ 'top' ],
		'mr': [ 'right' ],
		'mb': [ 'bottom' ],
		'ml': [ 'left' ],
	}

	let convertedStyles = '\n// Margin\n';

	_.each(objectPosition, (properties, rule) => {
		// Positive numbers
		_.each(spacing, (value, modifier) => {
			if (modifier !== 'min' && modifier !== 'max' && modifier !== 'screen') {
				let sides = '';

				_.each(properties, property => {
					sides += (modifier === 'px')
						? ` ${property}: '1px',`
						: ` ${property}: ${parseValue(value)},`;
				});

				convertedStyles += multiProperties(`.${rule}-`, modifier, remove_last_character(sides));
			}
		});

		if (internal) {
			// auto
			let sides = '';

			_.each(properties, property => {
				sides += ` ${property}: null,`;
			});

			convertedStyles += multiProperties(`.${rule}-`, 'auto', remove_last_character(sides));
		}

		// Negative numbers
		_.each(spacing, (value, modifier) => {
			if (modifier !== 'min' && modifier !== 'max' && modifier !== 'screen') {
				let sides = '';

				_.each(properties, property => {
					if (parseFloat(value) !== 0) {
						sides += (modifier === 'px')
							? ` ${property}: '-1px',`
							: (!modifier.includes('/') && modifier !== 'full') ? ` ${property}: ${parseValue(value, '-')},` : ` ${property}: ${parseValue(value, '-')},`;
					}
				});

				if (`{ ${sides}}` !== '{ }') {
					convertedStyles += multiProperties(`.-${rule}-`, modifier, remove_last_character(sides));
				}
			}
		});
	});

	return convertedStyles;
}
exports.margin = margin;

function padding(spacing) {
	const objectPosition = {
		'p': [ 'top', 'right', 'bottom', 'left' ],
		'py': [ 'top', 'bottom' ],
		'px': [ 'right', 'left' ],
		'pt': [ 'top' ],
		'pr': [ 'right' ],
		'pb': [ 'bottom' ],
		'pl': [ 'left' ],
	}

	let convertedStyles = '\n// padding Property\n';

	_.each(objectPosition, (properties, rule) => {
		// Positive numbers
		_.each(spacing, (value, modifier) => {
			if (modifier !== 'min' && modifier !== 'max' && modifier !== 'screen') {
				let sides = '';

				_.each(properties, property => {
					sides += (modifier === 'px')
						? ` ${property}: '1px',`
						: (!modifier.includes('/') && modifier !== 'full') ? ` ${property}: ${parseValue(value)},` : ` ${property}: ${parseValue(value)},`;
				});

				convertedStyles += multiValues(`.${rule}-`, modifier, 'padding', remove_last_character(sides));
			}
		});
	});

	return convertedStyles;
}
exports.padding = padding;

function width(widths) {
	return processElements('width Property', 'w-', 'width', widths);
}
exports.width = width;

function height(heights) {
	return processElements('height Property', 'h-', 'height', heights);
}
exports.height = height;

function customRules(_value, _key) {
	let convertedStyles = '\n';

	_.each(_value, (value, modifier) => {
		let customProperties = '';

		_.each(value, (elValue, laPropiedad) => {
			if (typeof (elValue) === 'object') {
				customProperties += ` ${laPropiedad}: {`;

				let extraCustomProperties = '';

				_.each(elValue, (extraValue, modifier) => {
					extraCustomProperties += ` ${modifier}: ${parseValue(extraValue)},`;
				});

				customProperties += `${remove_last_character(extraCustomProperties)} },`;
			} else {
				customProperties += ` ${laPropiedad}: ${parseValue(elValue)},`;
			}
		});

		if (modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT') {
			modifier = '';
		} else if (modifier === 'ios') {
			modifier = '[platform=ios]';
		} else if (modifier === 'android') {
			modifier = '[platform=android]';
		} else if (modifier.startsWith('[')) {
			//
		} else if (!modifier.startsWith('-')) {
			modifier = `-${modifier}`;
		}

		convertedStyles += `'${_key}${modifier}': {${remove_last_character(customProperties)} }\n`;
	});

	return convertedStyles;
}
exports.customRules = customRules;

// Private Functions
function checkTitanium(value) {
	let substrings = [ 'Alloy', 'Ti.', 'Titanium' ];

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
		case 'rem':
			return `${sign}${16 * parseFloat(value)}`;
		case 'dp':
			return `${sign}${parseFloat(value)}`;
		default:
			return isNaN(value) ? `'${sign}${value}'` : `${sign}${value}`;
	}
}

function processElements(header, rule, property, data) {
	let convertedStyles = `\n// ${header}\n`;

	_.each(data, (value, modifier) => {
		if (modifier !== 'min' && modifier !== 'max' && modifier !== 'min-content' && modifier !== 'max-content') {
			if (modifier === 'screen') {
				convertedStyles += singleValue(`.${rule}`, modifier, property, 'Ti.UI.FILL');
			} else if (modifier === 'auto') {
				convertedStyles += singleValue(`.${rule}`, modifier, property, 'Ti.UI.SIZE');
			} else if (modifier === 'px') {
				convertedStyles += singleValue(`.${rule}`, modifier, property, "'1px'");
			} else {
				convertedStyles += singleValue(`.${rule}`, modifier, property, parseValue(value));
			}
		}
	});

	return convertedStyles;
}

function singleValue(rule, modifier, property, value) {
	return `'${rule}${modifier}': { ${property}: ${value} }\n`;
}

function multiValues(rule, modifier, property, values) {
	return `'${rule}${modifier}': { ${property}: {${values} } }\n`;
}

function multiProperties(rule, modifier, values) {
	return `'${rule}${modifier}': {${values} }\n`;
}

function singleProperty(property, value) {
	return `${property}: ${value}`;
}

function fixInvalidValues(invalidValues, currentValue) {
	return invalidValues[ currentValue ] || currentValue;
}

function remove_last_character(element) {
	return element.slice(0, element.length - 1)
}

function transparentColor(percentage, yourNum) {
	percentage *= 255;

	return ('0000000' + ((yourNum | 0) + 4294967296).toString(16)).substr(-2).toUpperCase();

	// !	Alpha Level	HEX Code
	/*
	|-------------------------------------------------------------------------------
	|	100%	FF
	|	95%		F2
	|	90%		E6
	|	85%		D9
	|	80%		CC
	|	75%		BF
	|	70%		B3
	|	65%		A6
	|	60%		99
	|	55%		8C
	|	50%		80
	|	45%		73
	|	40%		66
	|	35%		59
	|	30%		4D
	|	25%		40
	|	20%		33
	|	15%		26
	|	10%		1A
	|	5%		0D
	|	0%		00
	|-------------------------------------------------------------------------------
	*/
}

function addTransparency(hexValue, position) {
	let value = (hexValue.length > 4) ? '00' : '0';
	return [ hexValue.slice(0, position), value, hexValue.slice(position) ].join('');
}
