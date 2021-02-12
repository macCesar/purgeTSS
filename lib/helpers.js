const _ = require('lodash');
const HEX_3_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; // i.e. #0F3
const HEX_4_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i; // i.e. #0F38
const HEX_6_REGEX = /^#?([a-f\d]){6}$/i; // i.e. #00FF33
const HEX_8_REGEX = /^#?([a-f\d]){8}$/i; // i.e. #00FF3388

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

function processColorProperties(header, rule, property, data) {
	let convertedStyles = `\n// ${header} Property\n`;

	_.each(data, (value, modifier) => {
		if (typeof value === 'string' && value !== 'currentColor') {
			convertedStyles += singleValue(`${rule}`, modifier, `${property}`, `'${toHex(value)}'`);
		} else if (value !== 'currentColor') {
			_.each(value, (shadeValue, shadeName) => {
				if (shadeName === 'global' || shadeName === 'default' || shadeName === 'DEFAULT') {
					convertedStyles += singleValue(`${rule}`, `${checkModifier(modifier)}`, `${property}`, `'${toHex(shadeValue)}'`);
				} else if (shadeName === 'ios' || shadeName === 'android' || shadeName.includes('[')) {
					convertedStyles += singleValue(`${rule}${modifier}`, `${checkModifier(shadeName)}`, `${property}`, `'${toHex(shadeValue)}'`);
				} else {
					if (modifier === 'ios' || modifier === 'android' || modifier.includes('[')) {
						convertedStyles += singleValue(`${rule}`, `${shadeName}${checkModifier(modifier)}`, `${property}`, `'${toHex(shadeValue)}'`);
					} else {
						if (modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT') {
							convertedStyles += singleValue(`${rule}`, `${shadeName}`, `${property}`, `'${toHex(shadeValue)}'`);
						} else {
							convertedStyles += singleValue(`${rule}`, `${modifier}-${shadeName}`, `${property}`, `'${toHex(shadeValue)}'`);
						}
					}
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

function tintColor(tailwindColors) {
	return processColorProperties('tintColor', '.tint-', 'tintColor', tailwindColors);
}
exports.tintColor = tintColor;

function fontFamily(values) {
	let convertedStyles = '\n// fontFamily Property\n';

	_.each(values, (value, modifier) => {
		if (modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT' || modifier === 'ios' || modifier === 'android' || modifier.includes('[')) {
			if (typeof value === 'object') {
				_.each(value, (elValue, laPropiedad) => {
					convertedStyles += multiValues(`.font-${laPropiedad}`, checkModifier(modifier), 'font', ` fontFamily: '${elValue}'`);
				});
			} else {
				convertedStyles += multiValues('.font-', modifier, 'font', ` fontFamily: '${value}'`);
			}
		} else {
			if (typeof value === 'object') {
				_.each(value, (elValue, laPropiedad) => {
					convertedStyles += multiValues(`.font-${modifier}`, `-${checkModifier(laPropiedad)}`, 'font', ` fontFamily: '${elValue}'`);
				});
			} else {
				convertedStyles += multiValues('.font-', modifier, 'font', ` fontFamily: '${value}'`);
			}
		}
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
		_.each(tailwindColors, (value, modifier) => {
			if (typeof value === 'string') {
				if (value === 'transparent') {
					convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '${value}', '${value}' ] } }\n`;
				} else if (value !== 'currentColor') {
					convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '${addTransparencyToHex(toHex(value))}', '${toHex(value)}' ] } }\n`;
				}
			} else {
				_.each(value, (shadeValue, shadeName) => {
					if (shadeName === 'global' || shadeName === 'default' || shadeName === 'DEFAULT') {
						convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '${addTransparencyToHex(toHex(shadeValue))}', '${toHex(shadeValue)}' ] } }\n`;
					} else if (shadeName === 'ios' || shadeName === 'android' || shadeName.includes('[')) {
						convertedStyles += `'.${rule}${modifier}${checkModifier(shadeName)}': { backgroundGradient: { colors: [ '${addTransparencyToHex(toHex(shadeValue))}', '${toHex(shadeValue)}' ] } }\n`;
					} else {
						if (modifier === 'ios' || modifier === 'android' || modifier.includes('[') || modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT') {
							convertedStyles += `'.${rule}${shadeName}${checkModifier(modifier)}': { backgroundGradient: { colors: [ '${addTransparencyToHex(toHex(shadeValue))}', '${toHex(shadeValue)}' ] } }\n`;
						} else {
							convertedStyles += `'.${rule}${modifier}-${shadeName}': { backgroundGradient: { colors: [ '${addTransparencyToHex(toHex(shadeValue))}', '${toHex(shadeValue)}' ] } }\n`;
						}
					}
				});
			}
		});
	});

	rulesAndProperties = [ 'to-' ];

	_.each(rulesAndProperties, rule => {
		convertedStyles += '\n// To Color\n';
		_.each(tailwindColors, (value, modifier) => {
			if (typeof value === 'string' && value !== 'currentColor') {
				convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '${toHex(value)}' ] } }\n`;
			} else if (value !== 'currentColor') {
				_.each(value, (shadeValue, shadeName) => {
					if (shadeName === 'global' || shadeName === 'default' || shadeName === 'DEFAULT') {
						convertedStyles += `'.${rule}${modifier}': { backgroundGradient: { colors: [ '${toHex(shadeValue)}' ] } }\n`;
					} else {
						if (modifier === 'ios' || modifier === 'android' || modifier.includes('[') || modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT') {
							convertedStyles += `'.${rule}${shadeName}${checkModifier(modifier)}': { backgroundGradient: { colors: [ '${toHex(shadeValue)}' ] } }\n`;
						} else {
							convertedStyles += `'.${rule}${modifier}-${shadeName}': { backgroundGradient: { colors: [ '${toHex(shadeValue)}' ] } }\n`;
						}
					}
				});
			}
		});
	});

	return convertedStyles;
}
exports.gradientColorStops = gradientColorStops;

function checkModifier(modifier) {
	if (modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT') {
		modifier = '';
	} else if (modifier === 'ios') {
		modifier = '[platform=ios]';
	} else if (modifier === 'android') {
		modifier = '[platform=android]';
	}

	return modifier;
}

function fontSize(tailwindFontSizes) {
	let convertedStyles = '\n// fontSize Property\n';

	_.each(tailwindFontSizes, (value, modifier) => {
		if (Array.isArray(value)) {
			convertedStyles += singleValue('.text-', modifier, 'font: { fontSize', `${parseValue(value[ 0 ])} }`);
		} else if (typeof value === 'object') {
			_.each(value, (elValue, laPropiedad) => {
				if (laPropiedad === 'global' || laPropiedad === 'default' || laPropiedad === 'DEFAULT' || laPropiedad === 'ios' || laPropiedad === 'android' || laPropiedad.includes('[')) {
					// convertedStyles += `'.${rule}${modifier}${checkModifier(laPropiedad)}': { backgroundGradient: { colors: [ '${addTransparencyToHex(toHex(shadeValue))}', '${toHex(shadeValue)}' ] } }\n`;
					convertedStyles += singleValue(`.text-${modifier}`, checkModifier(laPropiedad), 'font: { fontSize', `${parseValue(elValue)} }`);
				} else {
					convertedStyles += singleValue(`.text-${laPropiedad}`, checkModifier(modifier), 'font: { fontSize', `${parseValue(elValue)} }`);
				}
			});
		} else {
			if (typeof value === 'object') {
				_.each(value, (elValue, laPropiedad) => {
					convertedStyles += multiValues(`.text-${modifier}`, checkModifier(laPropiedad), 'font', ` fontSize: '${elValue}'`);
				});
			} else {
				convertedStyles += singleValue('.text-', modifier, 'font: { fontSize', `${parseValue(value)} }`);
			}
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
		if (modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT' || modifier === 'ios' || modifier === 'android' || modifier.includes('[')) {
			if (typeof value === 'object') {
				_.each(value, (elValue, laPropiedad) => {
					convertedStyles += singleValue(`.font-${laPropiedad}`, checkModifier(modifier), 'font: { fontWeight', `'${fixInvalidValues(invalidValues, elValue)}' }`);
				});
			} else {
				convertedStyles += singleValue('.font-', `${modifier}`, 'font: { fontWeight', `'${fixInvalidValues(invalidValues, modifier)}' }`);
			}
		} else {
			convertedStyles += singleValue('.font-', `${modifier}`, 'font: { fontWeight', `'${fixInvalidValues(invalidValues, modifier)}' }`);
		}
	});

	return convertedStyles;
}
exports.fontWeight = fontWeight;

function borderRadius(tailwindBorderRadius) {
	let convertedStyles = '\n// borderRadius Property\n';

	_.each(tailwindBorderRadius, (value, modifier) => {
		if (modifier !== 'min' && modifier !== 'max' && modifier !== 'min-content' && modifier !== 'max-content') {
			if (modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT') {
				convertedStyles += singleValue('.rounded', '', 'borderRadius', parseValue(value));
			} else if (modifier === 'full') {
				// convertedStyles += singleValue('.rounded-full', '', 'borderRadius', 4);
			} else {
				convertedStyles += singleValue('.rounded-', modifier, 'borderRadius', parseValue(value));
			}
		}
	});

	return convertedStyles;
}
exports.borderRadius = borderRadius;

function borderRadiusExtraStyles(spacing) {
	let convertedStyles = '\n// borderRadius Property - ( With Extra Styles )\n';

	_.each(spacing, (value, modifier) => {
		if (modifier !== 'min' && modifier !== 'max' && modifier !== 'min-content' && modifier !== 'max-content' && modifier !== 'auto' && modifier !== 'screen') {
			if (modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT' || modifier === 'ios' || modifier === 'android' || modifier.includes('[')) {
				if (typeof value === 'object') {
					_.each(value, (elValue, laPropiedad) => {
						convertedStyles += singleValue(`.rounded-${laPropiedad}`, checkModifier(modifier), 'borderRadius', parseValue(elValue));
					});
				} else {
					convertedStyles += singleValue('.rounded', '', 'borderRadius', parseValue(value));
				}
			} else if (!modifier.includes('/') && modifier !== 'full' && modifier !== 'px') {
				convertedStyles += singleValue('.rounded-', modifier, 'borderRadius', 8 * parseFloat(value));
			} else if (modifier === 'px') {
				convertedStyles += singleValue('.rounded-', 'px', 'borderRadius', "'1px'");
			}
		}
	});

	return convertedStyles;
}
exports.borderRadiusExtraStyles = borderRadiusExtraStyles;

function borderWidth(tailwindBorderWidth) {
	let convertedStyles = '\n// borderWidth Property\n';

	_.each(tailwindBorderWidth, (value, modifier) => {
		if (modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT' || modifier === 'ios' || modifier === 'android' || modifier.includes('[')) {
			if (typeof value === 'object') {
				_.each(value, (elValue, laPropiedad) => {
					convertedStyles += singleValue(`.border-${laPropiedad}`, checkModifier(modifier), 'borderWidth', parseValue(elValue));
				});
			} else {
				convertedStyles += singleValue('.border', '', 'borderWidth', parseInt(value));
			}
		} else if (typeof value === 'object') {
			_.each(value, (elValue, laPropiedad) => {
				convertedStyles += singleValue(`.border-${modifier}`, checkModifier(laPropiedad), 'borderWidth', parseValue(elValue));
			});
		} else if (isNaN(value) && value.includes('px')) {
			convertedStyles += singleValue('.border-', modifier, 'borderWidth', parseInt(value))
		} else {
			convertedStyles += singleValue('.border-', modifier, 'borderWidth', parseValue(value))
		}
	});

	return convertedStyles;
}
exports.borderWidth = borderWidth;

function displayUtilities() {
	// Display
	let convertedStyles = '\n// Display\n';

	convertedStyles += `'.block': { visible: true }\n`;
	convertedStyles += `'.hidden': { visible: false }\n`;

	return convertedStyles;
}
exports.displayUtilities = displayUtilities;

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
		if (typeof value === 'object') {
			_.each(value, (elValue, laPropiedad) => {
				convertedStyles += singleValue(`.opacity-${laPropiedad}`, checkModifier(modifier), 'opacity', parseValue(elValue));
			});
		} else {
			convertedStyles += singleValue('.opacity-', modifier, 'opacity', parseValue(value));
		}
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
			if (modifier !== 'min' && modifier !== 'min-content' && modifier !== 'max' && modifier !== 'max-content' && modifier !== 'screen' && modifier !== 'auto') {
				if (typeof value === 'object') {
					_.each(value, (elValue, laPropiedad) => {
						modifier = checkModifier(modifier);

						let sides = '';

						_.each(properties, property => {
							sides += (modifier === 'px')
								? ` ${property}: '1px',`
								: ` ${property}: ${parseValue(elValue)},`;
						});

						convertedStyles += multiProperties(`.${rule}-${laPropiedad}`, modifier, remove_last_character(sides));
					});
				} else {
					let sides = '';

					_.each(properties, property => {
						sides += (modifier === 'px')
							? ` ${property}: '1px',`
							: ` ${property}: ${parseValue(value)},`;
					});

					convertedStyles += multiProperties(`.${rule}-`, modifier, remove_last_character(sides));
				}
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
			if (modifier !== 'min' && modifier !== 'min-content' && modifier !== 'max' && modifier !== 'max-content' && modifier !== 'screen' && modifier !== 'auto') {
				if (typeof value === 'object') {
					_.each(value, (elValue, laPropiedad) => {
						modifier = checkModifier(modifier);

						let sides = '';

						_.each(properties, property => {
							if (parseFloat(elValue) !== 0) {
								sides += (modifier === 'px')
									? ` ${property}: '-1px',`
									: (!modifier.includes('/') && modifier !== 'full') ? ` ${property}: ${parseValue(elValue, '-')},` : ` ${property}: ${parseValue(elValue, '-')},`;
							}
						});

						if (`{ ${sides}}` !== '{ }') {
							convertedStyles += multiProperties(`.-${rule}-${laPropiedad}`, modifier, remove_last_character(sides));
						}
					});
				} else {
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
			if (modifier !== 'min' && modifier !== 'max' && modifier !== 'min-content' && modifier !== 'max-content' && modifier !== 'screen' && modifier !== 'auto') {
				if (typeof value === 'object') {
					_.each(value, (elValue, laPropiedad) => {
						modifier = checkModifier(modifier);

						let sides = '';

						_.each(properties, property => {
							sides += (modifier === 'px')
								? ` ${property}: '1px',`
								: (!modifier.includes('/') && modifier !== 'full') ? ` ${property}: ${parseValue(elValue)},` : ` ${property}: ${parseValue(elValue)},`;
						});

						convertedStyles += multiValues(`.${rule}-${laPropiedad}`, modifier, 'padding', remove_last_character(sides));
					});
				} else {
					let sides = '';

					_.each(properties, property => {
						sides += (modifier === 'px')
							? ` ${property}: '1px',`
							: (!modifier.includes('/') && modifier !== 'full') ? ` ${property}: ${parseValue(value)},` : ` ${property}: ${parseValue(value)},`;
					});

					convertedStyles += multiValues(`.${rule}-`, modifier, 'padding', remove_last_character(sides));
				}

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
	let convertedStyles = '';

	_.each(_value, (value, modifier) => {
		let customProperties = '';

		_.each(value, (elValue, laPropiedad) => {
			if (typeof (elValue) === 'object' && elValue !== null) {
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
				if (typeof value === 'object') {
					_.each(value, (elValue, laPropiedad) => {
						convertedStyles += singleValue(`.${rule}${laPropiedad}`, checkModifier(modifier), property, parseValue(elValue));
					});
				} else {
					convertedStyles += singleValue(`.${rule}`, modifier, property, parseValue(value));
				}
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

function addTransparencyToHex(color) {
	if (color.includes('#')) {
		switch (color.length) {
			case 4:
				color = `#0${color[ 1 ]}${color[ 2 ]}${color[ 3 ]}`
				break;
			case 7:
				color = `#00${color[ 1 ]}${color[ 2 ]}${color[ 3 ]}${color[ 4 ]}${color[ 5 ]}${color[ 6 ]}`
				break;
			case 9:
				color = `#00${color[ 3 ]}${color[ 4 ]}${color[ 5 ]}${color[ 6 ]}${color[ 7 ]}${color[ 8 ]}`
				break;
		}
	}

	return color;
}

function toHex(color) {
	if (color.includes('#')) {
		color = expandHex(color);
	} else if (color.match(/rgba?/i)) {
		color = rgbToHex(color);
	} if (defaultColors(color)) {
		color = defaultColors(color);
	}

	return color;
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
	// Handles rgb and rgba
	const rgba = color.replace(/^rgba?\(|\s+|\)$/img, '').split(',');
	const alpha = (((rgba[ 3 ] || 01) * 255) | 1 << 8).toString(16).slice(1);
	return `#${alpha}${((1 << 24) + (parseInt(rgba[ 0 ]) << 16) + (parseInt(rgba[ 1 ]) << 8) + parseInt(rgba[ 2 ])).toString(16).slice(1)}`;
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

	return colors[ color ] || null;
}
