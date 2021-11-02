const _ = require('lodash');
const readCSS = require('read-css');

const HEX_3_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; // i.e. #0F3
const HEX_4_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i; // i.e. #80F3
const HEX_6_REGEX = /^#?([a-f\d]){6}$/i; // i.e. #00FF33
const HEX_8_REGEX = /^#?([a-f\d]){8}$/i; // i.e. #8800FF33
let _applyClasses = {};

let startTime;

function start() {
	startTime = new Date();
};

function finish(message = 'Finished purging in') {
	let endTime = new Date(new Date() - startTime);
	console.log(message, `${endTime.getSeconds()}s ${endTime.getMilliseconds()}ms`);
}

function resetStyles() {
	let convertedStyles = '\n// Custom Styles and Resets\n';

	convertedStyles += customRules({ ios: { hires: true } }, 'ImageView');
	// convertedStyles += customRules({ default: { width: 'Ti.UI.FILL', height: 'Ti.UI.SIZE' } }, 'Label');
	convertedStyles += customRules({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, 'View');
	convertedStyles += customRules({ default: { backgroundColor: '#ffffff' } }, 'Window');

	return convertedStyles;
}
exports.resetStyles = resetStyles;

// Main Functions
function processModifiersAndProperties(header, objectPosition, modifiersAndValues, minusSigns = '') {
	let convertedStyles = `\n// ${header} Property\n`;

	_.each(objectPosition, (properties, rule) => {
		_.each(modifiersAndValues, (value, modifier) => {
			let ruleSign;
			if (modifier.startsWith('-')) {
				ruleSign = '-';
			} else {
				ruleSign = '';
			}
			if (typeof value === 'object') {
				_.each(value, (_value, _modifier) => {
					convertedStyles += `'.${ruleSign}${rule}-${modifier}${setModifier(_modifier)}': ` + _.replace(properties, new RegExp("{value}", "g"), parseValue(_value, minusSigns)) + '\n';
				});
			} else {
				convertedStyles += `'.${ruleSign}${rule}${setModifier(modifier)}': ` + _.replace(properties, new RegExp("{value}", "g"), parseValue(value, minusSigns)) + '\n';
			}
		});
	});

	return convertedStyles;
}

function textColor(modifiersAndValues) {
	return processModifiersAndProperties('color', { 'text': '{ color: {value} }' }, modifiersAndValues);
}
exports.textColor = textColor;

function backgroundColor(modifiersAndValues) {
	return processModifiersAndProperties('backgroundColor', { 'bg': '{ backgroundColor: {value} }' }, modifiersAndValues);
}
exports.backgroundColor = backgroundColor;

function backgroundSelectedColor(modifiersAndValues) {
	return processModifiersAndProperties('backgroundSelectedColor', { 'bg-selected': '{ backgroundSelectedColor: {value} }' }, modifiersAndValues);
}
exports.backgroundSelectedColor = backgroundSelectedColor;

function borderColor(modifiersAndValues) {
	return processModifiersAndProperties('borderColor', { 'border': '{ borderColor: {value} }' }, modifiersAndValues);
}
exports.borderColor = borderColor;

function pagingControlAlpha(modifiersAndValues) {
	return processModifiersAndProperties('pagingControlAlpha', { 'paging-alpha': '{ pagingControlAlpha: {value} }' }, modifiersAndValues);
}
exports.pagingControlAlpha = pagingControlAlpha;

function pagingControlColor(modifiersAndValues) {
	return processModifiersAndProperties('pagingControlColor', { 'paging': '{ pagingControlColor: {value} }' }, modifiersAndValues);
}
exports.pagingControlColor = pagingControlColor;

function pageIndicatorColor(modifiersAndValues) {
	return processModifiersAndProperties('pageIndicatorColor', { 'page': '{ pageIndicatorColor: {value} }' }, modifiersAndValues);
}
exports.pageIndicatorColor = pageIndicatorColor;

function currentPageIndicatorColor(modifiersAndValues) {
	return processModifiersAndProperties('currentPageIndicatorColor', { 'current-page': '{ currentPageIndicatorColor: {value} }' }, modifiersAndValues);
}
exports.currentPageIndicatorColor = currentPageIndicatorColor;

function pagingControlHeight({ ...modifiersAndValues }) {
	modifiersAndValues = removeFractions(modifiersAndValues);

	delete modifiersAndValues.full;
	delete modifiersAndValues.auto;
	delete modifiersAndValues.screen;

	return processModifiersAndProperties('pagingControlHeight', { 'paging-h': '{ pagingControlHeight: {value} }' }, modifiersAndValues);
}
exports.pagingControlHeight = pagingControlHeight;

function touchFeedbackColor(modifiersAndValues) {
	return processModifiersAndProperties('touchFeedbackColor', { 'feedback': '{ touchFeedback: true, touchFeedbackColor: {value} }' }, modifiersAndValues);
}
exports.touchFeedbackColor = touchFeedbackColor;

function placeholderColor(modifiersAndValues) {
	return processModifiersAndProperties('hintTextColor', { 'placeholder': '{ hintTextColor: {value} }' }, modifiersAndValues);
}
exports.placeholderColor = placeholderColor;

function tintColor(modifiersAndValues) {
	return processModifiersAndProperties('tintColor', { 'tint': '{ tintColor: {value} }' }, modifiersAndValues);
}
exports.tintColor = tintColor;

function rotate(modifiersAndValues) {
	return processModifiersAndProperties('rotate', { 'rotate': '{ rotate: {value} }' }, modifiersAndValues);
}
exports.rotate = rotate;

function zIndex(modifiersAndValues) {
	delete modifiersAndValues.auto;
	return processModifiersAndProperties('zIndex', { 'z': '{ zIndex: {value} }' }, modifiersAndValues);
}
exports.zIndex = zIndex;

function scale(modifiersAndValues) {
	modifiersAndValues[5] = .05;
	modifiersAndValues[10] = .10;
	modifiersAndValues[25] = .25;
	return processModifiersAndProperties('scale', { 'scale': '{ scale: \'{value}\' }' }, modifiersAndValues);
}
exports.scale = scale;

function transitionDuration(modifiersAndValues) {
	modifiersAndValues[0] = '0ms';
	modifiersAndValues[25] = '25ms';
	modifiersAndValues[50] = '50ms';
	return processModifiersAndProperties('duration', { 'duration': '{ duration: {value} }' }, modifiersAndValues);
}
exports.transitionDuration = transitionDuration;

function transitionDelay(modifiersAndValues) {
	modifiersAndValues[0] = '0ms';
	modifiersAndValues[25] = '25ms';
	modifiersAndValues[50] = '50ms';
	modifiersAndValues[2000] = '2000ms';
	modifiersAndValues[3000] = '3000ms';
	modifiersAndValues[4000] = '4000ms';
	modifiersAndValues[5000] = '5000ms';
	return processModifiersAndProperties('delay', { 'delay': '{ delay: {value} }' }, modifiersAndValues);
}
exports.transitionDelay = transitionDelay;

function pagingControlTimeout(modifiersAndValues) {
	modifiersAndValues[0] = '0ms';
	modifiersAndValues[25] = '25ms';
	modifiersAndValues[50] = '50ms';
	modifiersAndValues[2000] = '2000ms';
	modifiersAndValues[3000] = '3000ms';
	modifiersAndValues[4000] = '4000ms';
	modifiersAndValues[5000] = '5000ms';

	return processModifiersAndProperties('pagingControlTimeout', { 'paging-timeout': '{ pagingControlTimeout: {value} }' }, modifiersAndValues);
}
exports.pagingControlTimeout = pagingControlTimeout;


function fontFamily(modifiersAndValues) {
	return processModifiersAndProperties('fontFamily', { 'font': '{ font: { fontFamily: {value} } }' }, modifiersAndValues);
}
exports.fontFamily = fontFamily;

function linearGradient() {
	let convertedStyles = `\n// Linear backgroundGradient Property\n`;

	convertedStyles += `'.bg-linear': { backgroundGradient: { type: 'linear', startPoint: { x: '50%', y: '100%' }, endPoint: { x: '50%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-t': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-tr': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-r': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-br': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '0%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-b': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-bl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-l': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-tl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '100%' }, backfillStart: true } }\n`;

	return convertedStyles;
}
exports.linearGradient = linearGradient;

function radialGradient() {
	let convertedStyles = `\n// Radial backgroundGradient Property [iOS]\n`;

	convertedStyles += `'.bg-radial[platform=ios]': { backgroundGradient: { type: 'radial', startRadius: '125%', endRadius: '0%', backfillStart: true, backfillEnd: true } }\n`;
	convertedStyles += `'.bg-radial-to-b[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '50%', y: '0%' }, endPoint: { x: '50%', y: '0%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }\n`;
	convertedStyles += `'.bg-radial-to-bl[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '100%', y: '0%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }\n`;
	convertedStyles += `'.bg-radial-to-l[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '100%', y: '50%' }, endPoint: { x: '100%', y: '50%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }\n`;
	convertedStyles += `'.bg-radial-to-tl[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '100%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }\n`;
	convertedStyles += `'.bg-radial-to-t[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '50%', y: '100%' }, endPoint: { x: '50%', y: '100%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }\n`;
	convertedStyles += `'.bg-radial-to-tr[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '0%', y: '100%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }\n`;
	convertedStyles += `'.bg-radial-to-r[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '0%', y: '50%' }, endPoint: { x: '0%', y: '50%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }\n`;
	convertedStyles += `'.bg-radial-to-br[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }\n`;

	return convertedStyles;
}
exports.radialGradient = radialGradient;

function gradientColorStops({ ...modifiersAndValues }) {
	let convertedStyles = '\n// Gradient Color Stops\n// From Color\n';

	let objectPosition = { 'from': '{ backgroundGradient: { colors: [ {transparentValue}, {value} ] } }' };

	_.each(objectPosition, (properties, rule) => {
		_.each(modifiersAndValues, (value, modifier) => {
			if (typeof value === 'object') {
				_.each(value, (_value, _modifier) => {
					convertedStyles += `'.${rule}-${modifier}${setModifier(_modifier)}': ` + _.replace(_.replace(properties, new RegExp("{transparentValue}", "g"), `${addTransparencyToValue(parseValue(_value))}`), new RegExp("{value}", "g"), parseValue(_value)) + '\n';
				});
			} else {
				convertedStyles += `'.${rule}${setModifier(modifier)}': ` + _.replace(_.replace(properties, new RegExp("{value}", "g"), parseValue(value)), new RegExp("{transparentValue}", "g"), `${addTransparencyToValue(parseValue(value))}`) + '\n';
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

function fontSize({ ...modifiersAndValues }) {
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

function bounce() {
	let convertedStyles = '\n// disableBounce Property\n';
	convertedStyles += `'.enable-bounce': { disableBounce: false }\n`;
	convertedStyles += `'.disable-bounce': { disableBounce: true }\n`;

	return convertedStyles;
}
exports.bounce = bounce;

function draggingType() {
	let convertedStyles = '\n// draggingType Property\n';
	convertedStyles += `'.drag-apply': { draggingType: 'apply' }\n`;
	convertedStyles += `'.drag-animate': { draggingType: 'animate' }\n`;

	return convertedStyles;
}
exports.draggingType = draggingType;

function keepScreenOn() {
	let convertedStyles = '\n// keepScreenOn Property\n';

	convertedStyles += `'.keep-screen-on[platform=android]': { keepScreenOn: true }\n`;
	convertedStyles += `'.keep-screen-off[platform=android]': { keepScreenOn: false }\n`;

	return convertedStyles;
}
exports.keepScreenOn = keepScreenOn;

function overlay() {
	let convertedStyles = '\n// overlayEnabled Property\n';
	convertedStyles += `'.overlay-enabled[platform=ios]': { overlayEnabled: true }\n`;
	convertedStyles += `'.overlay-disabled[platform=ios]': { overlayEnabled: false }\n`;

	return convertedStyles;
}
exports.overlay = overlay;

function platform() {
	let convertedStyles = '\n// Ti.Platform Property\n';
	convertedStyles += `'.platform-w': { width: Ti.Platform.displayCaps.platformWidth }\n`;
	convertedStyles += `'.platform-h': { height: Ti.Platform.displayCaps.platformHeight }\n`;

	convertedStyles += `'.inverted-platform-w': { width: Ti.Platform.displayCaps.platformHeight }\n`;
	convertedStyles += `'.inverted-platform-h': { height: Ti.Platform.displayCaps.platformWidth }\n`;

	convertedStyles += `'.inverted-platform-w[platform=android]': { width: Ti.Platform.displayCaps.platformWidth }\n`;
	convertedStyles += `'.inverted-platform-h[platform=android]': { height: Ti.Platform.displayCaps.platformHeight }\n`;

	return convertedStyles;
}
exports.platform = platform;

function scrolling() {
	let convertedStyles = '\n// scrollingEnabled Property\n';
	convertedStyles += `'.scrolling-enabled': { scrollingEnabled: true }\n`;
	convertedStyles += `'.scrolling-disabled': { scrollingEnabled: false }\n`;

	return convertedStyles;
}
exports.scrolling = scrolling;

function pagingControl() {
	let convertedStyles = '\n// showPagingControl Property\n';
	convertedStyles += `'.show-paging': { showPagingControl: true }\n`;
	convertedStyles += `'.hide-paging': { showPagingControl: false }\n`;

	return convertedStyles;
}
exports.pagingControl = pagingControl;

function pagingControlOnTop() {
	let convertedStyles = '\n// pagingControlOnTop Property\n';
	convertedStyles += `'.paging-on-top': { pagingControlOnTop: true }\n`;
	convertedStyles += `'.paging-on-bottom': { pagingControlOnTop: false }\n`;

	return convertedStyles;
}
exports.pagingControlOnTop = pagingControlOnTop;

function autoreverse() {
	let convertedStyles = '\n// autoreverse Property\n';
	convertedStyles += `'.autoreverse': { autoreverse: true }\n`;
	convertedStyles += `'.no-autoreverse': { autoreverse: false }\n`;

	return convertedStyles;
}
exports.autoreverse = autoreverse;

function transition() {
	let convertedStyles = '\n// curve Property\n';
	convertedStyles += `'.ease-in': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN }\n`;
	convertedStyles += `'.ease-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_OUT }\n`;
	convertedStyles += `'.ease-linear': { curve: Ti.UI.ANIMATION_CURVE_LINEAR }\n`;
	convertedStyles += `'.ease-in-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT }\n`;

	// '.debug': { debug: true }
	convertedStyles += '\n// Debug Mode Property\n';
	convertedStyles += `'.debug-on': { debug: true }\n`;
	convertedStyles += `'.debug-off': { debug: false }\n`;

	return convertedStyles;
}
exports.transition = transition;

function fontWeight({ ...modifiersAndValues }) {
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

function gaps({ ...modifiersAndValues }) {
	let objectPosition = {
		'gap': '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
		'gap-b': '{ bottom: {value} }',
		'gap-l': '{ left: {value} }',
		'gap-r': '{ right: {value} }',
		'gap-t': '{ top: {value} }',
		'gap-x': '{ right: {value}, left: {value} }',
		'gap-y': '{ top: {value}, bottom: {value} }',
	}

	// SOME CLEANUP... VALUES NOT NEEDED HERE!.
	modifiersAndValues = removeFractions(modifiersAndValues);

	modifiersAndValues.auto = 'auto';
	delete modifiersAndValues.min;
	delete modifiersAndValues.max;
	delete modifiersAndValues.screen;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues['max-content'];

	return processModifiersAndProperties('Gaps', objectPosition, modifiersAndValues);
}
exports.gaps = gaps;

function gridFlow() {
	const modifiersAndValues = {
		'default': 'horizontal',
		'flow-col': 'horizontal',
		'flow-row': 'vertical',
	};

	return processModifiersAndProperties('grid and gridFlow', { 'grid': '{ layout: {value} }' }, modifiersAndValues);
}
exports.gridFlow = gridFlow;

function items() {
	let convertedStyles = '\n// items Property\n';
	convertedStyles += `'.items-start': { top: 0 }\n`;
	convertedStyles += `'.items-end': { bottom: 0 }\n`;
	convertedStyles += `'.items-center': { width: Ti.UI.FILL, height: Ti.UI.FILL }\n`;

	return convertedStyles;
}
exports.items = items;


function clipMode() {
	let convertedStyles = '\n// clipMode Property\n';
	convertedStyles += `'.clip-enabled[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }\n`;
	convertedStyles += `'.clip-disabled[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }\n`;

	return convertedStyles;
}
exports.clipMode = clipMode;

function exitOnClose() {
	let convertedStyles = '\n// exitOnClose Property\n';
	convertedStyles += `'.exit-on-close[platform=android]': { exitOnClose: true }\n`;
	convertedStyles += `'.dont-exit-on-close[platform=android]': { exitOnClose: false }\n`;

	return convertedStyles;
}
exports.exitOnClose = exitOnClose;

function layout() {
	let convertedStyles = '\n// layout Property\n';
	convertedStyles += `'.vertical': { layout: 'vertical' }\n`;
	convertedStyles += `'.horizontal': { layout: 'horizontal' }\n`;

	return convertedStyles;
}
exports.layout = layout;

function scrollType() {
	let convertedStyles = '\n// scrollType Property\n';
	convertedStyles += `'.scroll-horizontal[platform=android]': { scrollType: 'horizontal' }\n`;
	convertedStyles += `'.scroll-vertical[platform=android]': { scrollType: 'vertical' }\n`;

	return convertedStyles;
}
exports.scrollType = scrollType;

function defaultImage() {
	let convertedStyles = '\n// preventDefaultImage Property\n';
	convertedStyles += `'.prevent-default-image[platform=ios]': { preventDefaultImage: true }\n`;
	convertedStyles += `'.display-default-image[platform=ios]': { preventDefaultImage: false }\n`;

	return convertedStyles;
}
exports.defaultImage = defaultImage;

function scalingMode() {
	let convertedStyles = '\n// scalingMode Property\n';
	convertedStyles += `'.scaling-auto': { scalingMode: Ti.Media.IMAGE_SCALING_AUTO }\n`;
	convertedStyles += `'.scaling-none': { scalingMode: Ti.Media.IMAGE_SCALING_NONE }\n`;
	convertedStyles += `'.scaling-fill': { scalingMode: Ti.Media.IMAGE_SCALING_FILL }\n`;
	convertedStyles += `'.scaling-aspect-fit': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FIT }\n`;
	convertedStyles += `'.scaling-aspect-fill': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FILL }\n`;

	convertedStyles += `\n// Background Size ( for compatibility with Tailwind’s classes )\n`;
	convertedStyles += `'.bg-auto': { scalingMode: Ti.Media.IMAGE_SCALING_NONE }\n`;
	convertedStyles += `'.bg-cover': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FILL }\n`;
	convertedStyles += `'.bg-contain': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FIT }\n`;

	return convertedStyles;
}
exports.scalingMode = scalingMode;

function draggingConstraints() {
	let convertedStyles = '\n// Constraint Property\n';

	convertedStyles += `'.vertical-constraint': { constraint: 'vertical' }\n`;
	convertedStyles += `'.horizontal-constraint': { constraint: 'horizontal' }\n`;

	return convertedStyles;
}
exports.draggingConstraints = draggingConstraints;

function gridSystem() {
	let modifiersAndValues = {
		1: '100%',
		2: '50%',
		3: '33.333334%',
		4: '25%',
		5: '20%',
		6: '16.666667%',
		7: '14.285714%',
		8: '12.5%',
		9: '11.111111%',
		10: '10%',
		11: '9.090909%',
		12: '8.333334%',
	};

	let convertedStyles = processModifiersAndProperties('Grid Template Columns', { 'grid-cols': '{ width: {value} }' }, modifiersAndValues);

	modifiersAndValues = {
		1: '100%',
		2: '50%',
		3: '33.333334%',
		4: '25%',
		5: '20%',
		6: '16.666667%',
		7: '14.285714%',
		8: '12.5%',
		9: '11.111111%',
		10: '10%',
		11: '9.090909%',
		12: '8.333334%',
	};

	convertedStyles += processModifiersAndProperties('Grid Template Rows', { 'grid-rows': '{ height: {value} }' }, modifiersAndValues);

	return convertedStyles;
}
exports.gridSystem = gridSystem;

function gridColumnsStartEnd() {
	let modifiersAndValues = {
		'span-1': '8.333334%',
		'span-2': '16.666667%',
		'span-3': '25%',
		'span-4': '33.333334%',
		'span-5': '41.666667%',
		'span-6': '50%',
		'span-7': '58.333334%',
		'span-8': '66.666667%',
		'span-9': '75%',
		'span-10': '83.333334%',
		'span-11': '91.666667%',
		'span-12': '100%'
	};

	let convertedStyles = processModifiersAndProperties('Grid Column Start / End', { 'col': '{ width: {value} }' }, modifiersAndValues);

	modifiersAndValues = {
		'span-1': '8.333334%',
		'span-2': '16.666667%',
		'span-3': '25%',
		'span-4': '33.333334%',
		'span-5': '41.666667%',
		'span-6': '50%',
		'span-7': '58.333334%',
		'span-8': '66.666667%',
		'span-9': '75%',
		'span-10': '83.333334%',
		'span-11': '91.666667%',
		'span-12': '100%'
	};

	convertedStyles += processModifiersAndProperties('Grid Row Start / End', { 'row': '{ height: {value} }' }, modifiersAndValues);

	return convertedStyles;
}
exports.gridColumnsStartEnd = gridColumnsStartEnd;

function borderRadiusExtraStyles({ ...modifiersAndValues }) {
	// SOME CLEANUP... VALUES NOT NEEDED HERE!.
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

	return processModifiersAndProperties('borderRadius - ( With Extra Styles )', { 'rounded': '{ borderRadius: {value} }' }, modifiersAndValues);
}
exports.borderRadiusExtraStyles = borderRadiusExtraStyles;

function borderWidth({ ...modifiersAndValues }) {
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

function flip() {
	let convertedStyles = '\n// Flip Property\n';

	convertedStyles += `'.flip-vertical': { flip: 'vertical'}\n`;
	convertedStyles += `'.flip-horizontal': { flip: 'horizontal'}\n`;

	return convertedStyles;
}
exports.flip = flip;

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
	return processModifiersAndProperties('opacity', { 'opacity': '{ opacity: {value} }' }, modifiersAndValues);
}
exports.opacity = opacity;

function interactivity() {
	let convertedStyles = '\n// touchEnabled Property\n';
	convertedStyles += `'.touch-enabled': { touchEnabled: true }\n`;
	convertedStyles += `'.touch-disabled': { touchEnabled: false }\n`;
	convertedStyles += `'.pointer-events-auto': { touchEnabled: true }\n`;
	convertedStyles += `'.pointer-events-none': { touchEnabled: false }\n`;

	return convertedStyles;
}
exports.interactivity = interactivity;

function textAlign() {
	const modifiersAndValues = {
		left: 'Ti.UI.TEXT_ALIGNMENT_LEFT',
		right: 'Ti.UI.TEXT_ALIGNMENT_RIGHT',
		center: 'Ti.UI.TEXT_ALIGNMENT_CENTER',
		justify: 'Ti.UI.TEXT_ALIGNMENT_JUSTIFY'
	};

	return processModifiersAndProperties('textAlign', { 'text': '{ textAlign: {value} }' }, modifiersAndValues);
}
exports.textAlign = textAlign;

function verticalAlignment() {
	const modifiersAndValues = {
		top: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP',
		middle: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER',
		bottom: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM',
	};

	return processModifiersAndProperties('verticalAlign', { 'align': '{ verticalAlign: {value} }' }, modifiersAndValues);
}
exports.verticalAlignment = verticalAlignment;

function scrollableRegion() {
	let convertedStyles = '\n// contentWidth & contentHeight ( for ScrollViews )\n';

	convertedStyles += `'.content-w-auto': { contentWidth: Ti.UI.SIZE }\n`;
	convertedStyles += `'.content-w-screen': { contentWidth: Ti.UI.FILL }\n`;
	convertedStyles += `'.content-h-auto': { contentHeight: Ti.UI.SIZE }\n`;
	convertedStyles += `'.content-h-screen': { contentHeight: Ti.UI.FILL }\n`;
	convertedStyles += `'.content-auto': { contentWidth: Ti.UI.SIZE, contentHeight: Ti.UI.SIZE }\n`;
	convertedStyles += `'.content-screen': { contentWidth: Ti.UI.FILL, contentHeight: Ti.UI.FILL }\n`;

	return convertedStyles;
}
exports.scrollableRegion = scrollableRegion;

function scrollIndicators() {
	let convertedStyles = '\n// Scroll Indicators ( for ScrollViews )\n';

	convertedStyles += `'.overflow-x-scroll': { showHorizontalScrollIndicator: true }\n`;
	convertedStyles += `'.overflow-y-scroll': { showVerticalScrollIndicator: true }\n`;
	convertedStyles += `'.overflow-x-hidden': { showHorizontalScrollIndicator: false }\n`;
	convertedStyles += `'.overflow-y-hidden': { showVerticalScrollIndicator: false }\n`;
	convertedStyles += `'.overflow-scroll': { showHorizontalScrollIndicator: true, showVerticalScrollIndicator: true }\n`;
	convertedStyles += `'.overflow-hidden': { showHorizontalScrollIndicator: false, showVerticalScrollIndicator: false }\n`;

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

		'inset-x-0': 'right: 0, left: 0',
		'inset-y-0': 'top: 0, bottom: 0',
		'inset-0': 'top: 0, right: 0, bottom: 0, left: 0',

		'inset-x-auto': 'right: Ti.UI.SIZE, left: Ti.UI.SIZE',
		'inset-y-auto': 'top: Ti.UI.SIZE, bottom: Ti.UI.SIZE',
		'inset-auto': 'top: Ti.UI.SIZE, right: Ti.UI.SIZE, bottom: Ti.UI.SIZE, left: Ti.UI.SIZE'
	}

	let convertedStyles = '\n// Top / Right / Bottom / Left\n';

	_.each(objectPosition, (value, modifier) => {
		convertedStyles += `'.${modifier}': { ${value} }\n`;
	});

	return convertedStyles;
}
exports.placement = placement;

function origin() {
	const objectPosition = {
		'center': 'x: 0.5, y: 0.5',
		'top': 'x: 0.5, y: 0',
		'top-right': 'x: 1, y: 0',
		'right': 'x: 0.5, y: 1',
		'bottom-right': 'x: 1, y: 1',
		'bottom': 'x: 0.5, y: 1',
		'bottom-left': 'x: 0, y: 1',
		'left': 'x: 0, y: 0.5',
		'top-left': 'x: 0, y: 0'
	}

	let convertedStyles = '\n// anchorPoint Properties\n';

	_.each(objectPosition, (value, modifier) => {
		convertedStyles += `'.origin-${modifier}': { anchorPoint: { ${value} } }\n`;
	});

	return convertedStyles;
}
exports.origin = origin;

function margin({ ...modifiersAndValues }) {
	let objectPosition = {
		'm': '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
		'my': '{ top: {value}, bottom: {value} }',
		'mx': '{ right: {value}, left: {value} }',
		'mt': '{ top: {value} }',
		'mr': '{ right: {value} }',
		'mb': '{ bottom: {value} }',
		'ml': '{ left: {value} }',
	}


	// SOME CLEANUP... VALUES NOT NEEDED HERE.
	delete modifiersAndValues.min;
	delete modifiersAndValues.max;
	delete modifiersAndValues.screen;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues['max-content'];

	// modifiersAndValues.none = 'undefined';

	modifiersAndValues.auto = 'null';

	let convertedStyles = processModifiersAndProperties('Margin', objectPosition, modifiersAndValues);

	objectPosition = {
		'-m': '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
		'-my': '{ top: {value}, bottom: {value} }',
		'-mx': '{ left: {value}, right: {value} }',
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

function repeat() {
	return processModifiersAndProperties('repeat', { 'repeat': '{ repeat: {value} }' }, { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10 });
}
exports.repeat = repeat;

function padding({ ...modifiersAndValues }) {
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

	return processModifiersAndProperties('padding', objectPosition, modifiersAndValues);
}
exports.padding = padding;

function width({ ...modifiersAndValues }) {
	delete modifiersAndValues.min;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues.max;
	delete modifiersAndValues['max-content'];

	return processModifiersAndProperties('width', { 'w': '{ width: {value} }' }, modifiersAndValues);
}
exports.width = width;

function height({ ...modifiersAndValues }) {
	delete modifiersAndValues.min;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues.max;
	delete modifiersAndValues['max-content'];

	return processModifiersAndProperties('height', { 'h': '{ height: {value} }' }, modifiersAndValues);
}
exports.height = height;

function testingAppPTSSFile() {
	readCSS(srcAppPTSSFile, (err, data) => {
		if (err) throw err

		let someData = _.map(data.stylesheet.rules, (processing) => {
			let selector = processing.selectors[0];
			let property = processing.declarations[0].property;
			let __value = JSON.parse(processing.declarations[0].value);
			let value = Array.isArray(__value) ? __value : __value.split(' ');

			return {
				selector: selector,
				property: property,
				value: value
			}
		});

		console.log('Some Data:', someData);
	});
}
//! The son of Mother Goose
function applyProperties(twStyles) {
	let twStylesArray = twStyles.split(/\r?\n/);

	_.each(_applyClasses, (value, modifier) => {
		let indexOfModifier = findIndexOf(`'${modifier}':`, twStylesArray);

		if (indexOfModifier !== -1) {
			let compoundClasses = [];
			_.each([...value], searchClass => {
				// let cleanClass = searchClass.replace('open:', '').replace('close:', '');
				//! Needs to handle open, close and complete states...
				if (searchClass.includes('(')) {
					let theClass = formatArbitraryValues(searchClass);
					if (theClass) {
						compoundClasses.push(formatArbitraryValues(searchClass));
					}
				} else {
					let indexOfClass = findIndexOf(`'.${searchClass}': `, twStylesArray);

					if (indexOfClass !== -1) {
						compoundClasses.push(twStylesArray[indexOfClass]
							.replace(`'.${searchClass}': `, '')
							.replace(/{(.*)}/, '$1')
							.trim());
					}
				}
			});

			twStylesArray[indexOfModifier] = _.replace(twStylesArray[indexOfModifier], new RegExp("{_applyProperties_}"), fixDuplicateKeys(compoundClasses).join(', '));
		}
	});

	return twStylesArray.join('\n');
}
exports.applyProperties = applyProperties;

function findIndexOf(_substring, _array) {
	return _array.findIndex(element => element.includes(_substring));
}
exports.findIndexOf = findIndexOf;

function fixDuplicateKeys(compoundClasses) {
	compoundClasses.sort();

	let fontObject = [];
	let cleanedStyles = [];
	let paddingObject = [];
	let backgroundGradientObject = [];

	_.each(compoundClasses, value => {
		if (value.includes('font:')) {
			fontObject.push(value.replace('font: ', '').replace(/{(.*)}/, "$1").trim());
		} else if (value.includes('backgroundGradient: { colors')) {
			backgroundGradientObject.push(value.replace('backgroundGradient: ', '').replace(/{(.*)}/, "$1").trim());
		} else if (value.includes('padding:')) {
			paddingObject.push(value.replace('padding: ', '').replace(/{(.*)}/, "$1").trim());
		} else {
			cleanedStyles.push(value);
		}
	});

	if (paddingObject.length) {
		let individualPaddingObjects = [];
		paddingObject.forEach(propertyAndValue => {
			if (propertyAndValue.includes(',')) {
				let separateObjects = propertyAndValue.split(',');
				individualPaddingObjects.push(separateObjects[0].trim());
				individualPaddingObjects.push(separateObjects[1].trim());
			} else {
				individualPaddingObjects.push(propertyAndValue);
			}
		});

		cleanedStyles.push(`padding: { ${individualPaddingObjects.sort().join(', ')} }`);
	}

	if (fontObject.length) {
		cleanedStyles.push(`font: { ${fontObject.sort().join(', ')} }`);
	}

	if (backgroundGradientObject.length === 2) {
		let toColor = backgroundGradientObject[1].replace('colors: ', '').replace(/[\[\]']+/g, '').trim().split(',');
		let fromToColors = backgroundGradientObject[0].replace('colors: ', '').replace(/[\[\]']+/g, '').trim().split(',');
		fromToColors[0] = toColor[0];
		cleanedStyles.push(`backgroundGradient: { colors: [ '${fromToColors[0]}', '${fromToColors[1].trim()}' ] }`);
	}

	return cleanedStyles;
}


const arbitraryValuesTable = {
	// Check if they are really needed
	'font': 'font: { fontWeight: {value} }',
	'content-w': 'contentWidth: {value}',
	'content-h': 'contentHeight: {value}',
	// 'bg-selected': 'backgroundSelectedColor: {value}',
	'content': 'contentWidth: {value}, contentHeight: {value}',
	// 'shadow': 'viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: {value}',

	'anchorPoint': 'anchorPoint: { x: {value}, y: {value1}',
	'bg': 'backgroundColor: {value}',
	'border-color': 'borderColor: {value}',
	'border-width': 'borderWidth: {value}',
	'bottom': 'bottom: {value}',
	'delay': 'delay: {value}',
	'duration': 'duration: {value}',
	'feedback': 'touchFeedback: true, touchFeedbackColor: {value}',
	'from': 'backgroundGradient: { colors: [ {value1}, {value} ] }',
	'h': 'height: {value}',
	'left': 'left: {value}',
	'm': 'top: {value}, right: {value}, bottom: {value}, left: {value}',
	'mb': 'bottom: {value}',
	'ml': 'left: {value}',
	'mr': 'right: {value}',
	'mt': 'top: {value}',
	'mx': 'right: {value}, left: {value}',
	'my': 'top: {value}, bottom: {value}',
	'opacity': 'opacity: {value}',

	'page': 'pageIndicatorColor: {value}',
	'paging': 'pagingControlColor: {value}',
	'cache-size': 'cacheSize: {value}',

	'current-page': 'currentPageIndicatorColor: {value}',
	'p': 'padding: { top: {value}, right: {value}, bottom: {value}, left: {value} }',
	'pb': 'padding: { bottom: {value} }',
	'pl': 'padding: { left: {value} }',
	'placeholder': 'hintTextColor: {value}',
	'pr': 'padding: { right: {value} }',
	'pt': 'padding: { top: {value} }',
	'px': 'padding: { right: {value}, left: {value} }',
	'py': 'padding: { top: {value}, bottom: {value} }',
	'repeat': 'repeat: {value}',
	'right': 'right: {value}',
	'rotate': 'rotate: {value}',
	'rounded': 'borderRadius: {value}',
	'text-color': 'color: {value}',
	'text-size': 'font: { fontSize: {value} }',
	'tint': 'tintColor: {value}',
	'grid-col': 'width: Alloy.Globals.cols_{value}',
	'grid-row': 'height: Alloy.Globals.rows_{value}',
	'to': 'backgroundGradient: { colors: [ {value} ] }',
	'top': 'top: {value}',
	'w': 'width: {value}'
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
			properties = _.replace(properties, new RegExp("{value1}", "g"), addTransparencyToHex(parseValue(value, sign)));
		}

		if (rule === 'anchorPoint') {
			// anchorPoint
			let value1 = (value.includes(',')) ? value.split(',')[1] : value;

			value = value.split(',')[0];

			properties = _.replace(properties, new RegExp("{value1}", "g"), parseValue(value1, sign));
		}

		if (properties) {
			return _.replace(properties, new RegExp("{value}", "g"), parseValue(value, sign));
		}
	} else if (splitedContent.length === 3) {
		let rule = `${splitedContent[0]}-${splitedContent[1]}`;

		let value = splitedContent[2].match(/(?<=\().*(?=\))/).pop();

		let properties = arbitraryValuesTable[rule];

		if (properties) {
			return _.replace(properties, new RegExp("{value}", "g"), parseValue(value, sign));
		}
	} else if (splitedContent.length === 4) {
		let rule = `${splitedContent[0]}-${splitedContent[1]}-${splitedContent[2]}`;

		let value = splitedContent[3].match(/(?<=\().*(?=\))/).pop();

		let properties = arbitraryValuesTable[rule];

		if (properties) {
			return _.replace(properties, new RegExp("{value}", "g"), parseValue(value, sign));
		}
	}

	return null;
}

//! The Mother Goose
function customRules(_value, _key) {
	//! Want to refactor
	let convertedStyles = '';

	_.each(_value, (value, modifier) => {
		if (modifier === 'apply') {
			_applyClasses[_key] = new Set(Array.isArray(_value[modifier]) ? _value[modifier] : _value[modifier].split(' '));

			convertedStyles += `'${_key}': { {_applyProperties_} }\n`;
		} else {
			let customProperties = '';

			_.each(value, (theValue, theModifier) => {
				if (typeof (theValue) === 'object' && theValue !== null) {
					if (theModifier === 'apply') {
						_applyClasses[`${_key}${setModifier(modifier)}`] = new Set(Array.isArray(theValue) ? theValue : theValue.split(' '));

						customProperties += ` {_applyProperties_},`;
					} else {
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
					}
				} else {
					if (theModifier === 'apply') {
						_applyClasses[`${_key}${setModifier(modifier)}`] = new Set(Array.isArray(theValue) ? theValue : theValue.split(' '));

						customProperties += ` {_applyProperties_},`;
					} else {
						customProperties += ` ${theModifier}: ${parseValue(theValue)},`;
					}
				}
			});

			convertedStyles += `'${_key}${setModifier(modifier)}': {${remove_last_character(customProperties)} }\n`;
		}
	});

	return convertedStyles;
}
exports.customRules = customRules;

function checkPlatformAndDevice(line, className) {
	// https://regex101.com/r/YXLWYt/1
	if (className.includes('ios:')) {
		return (line.includes('platform=ios'))
			? `${line.replace(/[^'.]+|1/, `ios:$&`)}\n`
			: `${line.replace(/[^'.]+|1/, `ios:$&[platform=ios]`)}\n`;
	} else if (className.includes('android:')) {
		return (line.includes('platform=android'))
			? `${line.replace(/[^'.]+|1/, `android:$&`)}\n`
			: `${line.replace(/[^'.]+|1/, `android:$&[platform=android]`)}\n`;
	} else if (className.includes('handheld:')) {
		return (line.includes('formFactor=handheld'))
			? `${line.replace(/[^'.]+|1/, `handheld:$&`)}\n`
			: `${line.replace(/[^'.]+|1/, `handheld:$&[formFactor=handheld]`)}\n`;
	} else if (className.includes('tablet:')) {
		return (line.includes('formFactor=tablet'))
			? `${line.replace(/[^'.]+|1/, `tablet:$&`)}\n`
			: `${line.replace(/[^'.]+|1/, `tablet:$&[formFactor=tablet]`)}\n`;
	} else if (className.includes('open:')) {
		return `${line.replace(/[^'.]+|1/, `open:$&`).replace(/{(.*)}/, '{ animation: { open: $& } }')}\n`;
	} else if (className.includes('close:')) {
		return `${line.replace(/[^'.]+|1/, `close:$&`).replace(/{(.*)}/, '{ animation: { close: $& } }')}\n`;
	} else if (className.includes('complete:')) {
		return `${line.replace(/[^'.]+|1/, `complete:$&`).replace(/{(.*)}/, '{ animation: { complete: $& } }')}\n`;

	} else if (className.includes('bounds:') && (line.includes('top') || line.includes('right') || line.includes('bottom') || line.includes('left'))) {
		return `${line.replace(/[^'.]+|1/, `bounds:$&`).replace(/{(.*)}/, '{ bounds: $& }')}\n`;
	} else if (className.includes('drag:')) {
		return `${line.replace(/[^'.]+|1/, `drag:$&`).replace(/{(.*)}/, '{ draggable: { drag: $& } }')}\n`;
	} else if (className.includes('drop:')) {
		return `${line.replace(/[^'.]+|1/, `drop:$&`).replace(/{(.*)}/, '{ draggable: { drop: $& } }')}\n`;
	} else {
		return `${line}\n`;
	}
}
exports.checkPlatformAndDevice = checkPlatformAndDevice;

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
		case 'null':
			return null;
		case 'rem':
			return `${sign}${16 * parseFloat(value)}`;
		case 'dp':
			return `${sign}${parseFloat(value)}`;
		case 'hex':
			return toHex(value);
		case 'deg':
			return parseFloat(value);
		case 'ms':
			return parseFloat(value);
		case 'transparent':
			return `'${value}'`;
		default:
			return isNaN(value) ? `'${sign}${value}'` : `${sign}${value}`;
	}
}
exports.parseValue = parseValue;

function addTransparencyToValue(color) {
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
	} else if (color.match(/rgba?/i)) {
		const rgba = color.replace(/[\[\]')]+/g, '').split(',');
		color = `'${rgba[0].trim()}, ${rgba[1].trim()}, ${rgba[2].trim()}, 0)'`;
	}

	return color;
}
exports.addTransparencyToValue = addTransparencyToValue;

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
	} else if (modifier.startsWith('[if=')) {
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

function fixInvalidValues(invalidValues, currentValue) {
	return invalidValues[currentValue] || currentValue;
}

function remove_last_character(element) {
	return element.slice(0, element.length - 1)
}

function removeFractions(modifiersAndValues) {
	_.each(modifiersAndValues, (value, key) => {
		if (key.includes('/')) {
			delete modifiersAndValues[key];
		}
	});

	return modifiersAndValues;
}

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

function convertHexToRGBA(hexCode, opacity) {
	let hex = hexCode.replace('#', '');

	if (hex.length === 3) {
		hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
	}

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return `rgba(${r},${g},${b},${opacity / 100})`;
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
