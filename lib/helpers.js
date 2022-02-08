const _ = require('lodash');
const readCSS = require('read-css');

const HEX_3_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; // i.e. #0F3
const HEX_4_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i; // i.e. #80F3
const HEX_6_REGEX = /^#?([a-f\d]){6}$/i; // i.e. #00FF33
const HEX_8_REGEX = /^#?([a-f\d]){8}$/i; // i.e. #8800FF33

let startTime;
let _applyClasses = {};

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

function textColor(modifiersAndValues) {
	return processProperties({ 'prop': 'color', 'component': 'Ti.UI.Button, Ti.UI.Label, Ti.UI.PickerRow, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.ListItem, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextField, Ti.UI.Android.SearchView' }, {
		'text': '{ color: {value} }'
	}, modifiersAndValues);
}
exports.textColor = textColor;

function backgroundColor(modifiersAndValues) {
	return processProperties({ 'prop': 'backgroundColor', 'component': 'Ti.UI, Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.Tab, Ti.UI.TableView, Ti.UI.View, Ti.UI.Window' }, {
		'bg': '{ backgroundColor: {value} }'
	}, modifiersAndValues);
}
exports.backgroundColor = backgroundColor;

function navTintColor(modifiersAndValues) {
	return processProperties({ 'prop': 'navTintColor', 'component': 'Ti.UI.TabGroup, Ti.UI.Window' }, {
		'nav-tint': '{ navTintColor: {value} }'
	}, modifiersAndValues);
}
exports.navTintColor = navTintColor;

function backgroundSelectedColor(modifiersAndValues) {
	return processProperties({ 'prop': 'backgroundSelectedColor', 'component': 'Ti.UI.Button, Ti.UI.ListItem, Ti.UI.TableViewRow, Ti.UI.View' }, {
		'bg-selected': '{ backgroundSelectedColor: {value} }'
	}, modifiersAndValues);
}
exports.backgroundSelectedColor = backgroundSelectedColor;

function barColor(modifiersAndValues) {
	return processProperties({ 'prop': 'barColor', 'component': 'Ti.UI.EmailDialog, Ti.UI.SearchBar, Ti.UI.TabGroup, Ti.UI.Toolbar, Ti.UI.Window' }, {
		'bar': '{ barColor: {value} }'
	}, modifiersAndValues);
}
exports.barColor = barColor;

function shadow(shadowValue = '#59000000') {
	let convertedStyles = processComments({ 'prop': 'viewShadowOffset, viewShadowRadius, viewShadowColor - Box Shadow in Tailwind', 'component': 'Ti.UI.View' });
	convertedStyles += `'.shadow-xs': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.shadow-sm': { viewShadowOffset: { x: 0, y: 1 }, viewShadowRadius: 1, viewShadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.shadow': { viewShadowOffset: { x: 0, y: 2 }, viewShadowRadius: 2, viewShadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.shadow-md': { viewShadowOffset: { x: 0, y: 3 }, viewShadowRadius: 3, viewShadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.shadow-lg': { viewShadowOffset: { x: 0, y: 4 }, viewShadowRadius: 4, viewShadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.shadow-xl': { viewShadowOffset: { x: 0, y: 6 }, viewShadowRadius: 6, viewShadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.shadow-2xl': { viewShadowOffset: { x: 0, y: 8 }, viewShadowRadius: 8, viewShadowColor: '${shadowValue}' }\n`;

	convertedStyles += `'.shadow-inner': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n`;
	convertedStyles += `'.shadow-outline': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 2, viewShadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.shadow-none': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n`;

	return convertedStyles;
}
exports.shadow = shadow;

function shadowColor(modifiersAndValues) {
	return processProperties({ 'prop': 'viewShadowColor - Box Shadow in Tailwind', 'component': 'Ti.UI.View' }, {
		'shadow': '{ viewShadowColor: {value} }',
	}, modifiersAndValues);
}
exports.shadowColor = shadowColor;

function dropShadow(shadowValue = '#59000000') {
	let convertedStyles = processComments({ 'prop': 'shadowOffset, shadowRadius, shadowColor - Drop Shadow in Tailwind', 'component': 'Ti.UI.Button, Ti.UI.Label' });
	convertedStyles += `'.drop-shadow-xs': { shadowOffset: { x: 0, y: 0 }, shadowRadius: 1, shadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.drop-shadow-sm': { shadowOffset: { x: 0, y: 1 }, shadowRadius: 1, shadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.drop-shadow': { shadowOffset: { x: 0, y: 2 }, shadowRadius: 2, shadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.drop-shadow-md': { shadowOffset: { x: 0, y: 3 }, shadowRadius: 3, shadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.drop-shadow-lg': { shadowOffset: { x: 0, y: 4 }, shadowRadius: 4, shadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.drop-shadow-xl': { shadowOffset: { x: 0, y: 6 }, shadowRadius: 6, shadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.drop-shadow-2xl': { shadowOffset: { x: 0, y: 8 }, shadowRadius: 8, shadowColor: '${shadowValue}' }\n`;
	convertedStyles += `'.drop-shadow-none': { shadowOffset: { x: 0, y: 0 }, shadowRadius: null, shadowColor: null }\n`;

	return convertedStyles;
}
exports.dropShadow = dropShadow;

function dropShadowColor(modifiersAndValues) {
	return processProperties({ 'prop': 'shadowColor - Drop Shadow in Tailwind', 'component': 'Ti.UI.Button, Ti.UI.Label' }, {
		'drop-shadow': '{ shadowColor: {value} }',
	}, modifiersAndValues);
}
exports.dropShadowColor = dropShadowColor;

function barTitleShadow(shadowValue = '#59000000') {

	let convertedStyles = processComments({ 'prop': 'titleAttributes: shadow, offset, blurRadius - Bar Title Shadow', 'component': 'Ti.UI.TabGroup, Ti.UI.Window' });
	convertedStyles += `'.bar-shadow-xs': { titleAttributes: { shadow: { color: '${shadowValue}', offset: { width: 0, height: 0 }, blurRadius: 1 } } }\n`;
	convertedStyles += `'.bar-shadow-sm': { titleAttributes: { shadow: { color: '${shadowValue}', offset: { width: 0, height: 1 }, blurRadius: 1 } } }\n`;
	convertedStyles += `'.bar-shadow': { titleAttributes: { shadow: { color: '${shadowValue}', offset: { width: 0, height: 2 }, blurRadius: 2 } } }\n`;
	convertedStyles += `'.bar-shadow-md': { titleAttributes: { shadow: { color: '${shadowValue}', offset: { width: 0, height: 3 }, blurRadius: 3 } } }\n`;
	convertedStyles += `'.bar-shadow-lg': { titleAttributes: { shadow: { color: '${shadowValue}', offset: { width: 0, height: 4 }, blurRadius: 4 } } }\n`;
	convertedStyles += `'.bar-shadow-xl': { titleAttributes: { shadow: { color: '${shadowValue}', offset: { width: 0, height: 6 }, blurRadius: 6 } } }\n`;
	convertedStyles += `'.bar-shadow-2xl': { titleAttributes: { shadow: { color: '${shadowValue}', offset: { width: 0, height: 8 }, blurRadius: 8 } } }\n`;
	convertedStyles += `'.bar-shadow-none': { titleAttributes: { shadow: { color: null, offset: { width: 0, height: 0 }, blurRadius: null } } }\n`;

	return convertedStyles;
}
exports.barTitleShadow = barTitleShadow;

function barTitleShadowColor(modifiersAndValues) {
	return processProperties({ 'prop': 'titleAttributes: shadow - Bar Title Shadow', 'component': 'Ti.UI.TabGroup, Ti.UI.Window' }, {
		'bar': '{ titleAttributes: { shadow: { color: {value} } } }'
	}, {
		'shadow': {
			'ios': modifiersAndValues
		}
	});
}
exports.barTitleShadowColor = barTitleShadowColor;

function barTitleColor(modifiersAndValues) {
	return processProperties({ 'prop': 'titleAttributes', 'component': 'Ti.UI.TabGroup, Ti.UI.Window' }, {
		'bar': '{ titleAttributes: { color: {value} } }'
	}, {
		title: {
			ios: { ...modifiersAndValues }
		}
	});
}
exports.barTitleColor = barTitleColor;

function tabsBackgroundColor(modifiersAndValues) {
	return processProperties({ 'prop': 'tabsBackgroundColor', 'component': 'Ti.UI.TabGroup' }, {
		'tabs-bg': '{ tabsBackgroundColor: {value} }'
	}, modifiersAndValues);
}
exports.tabsBackgroundColor = tabsBackgroundColor;

function tabsBackgroundSelectedColor(modifiersAndValues) {
	return processProperties({ 'prop': 'tabsBackgroundSelectedColor', 'component': 'Ti.UI.TabGroup' }, {
		'tabs-bg-selected': '{ tabsBackgroundSelectedColor: {value} }'
	}, modifiersAndValues);
}
exports.tabsBackgroundSelectedColor = tabsBackgroundSelectedColor;

function titleColor(modifiersAndValues) {
	return processProperties({ 'prop': 'titleColor', 'component': 'Ti.UI.Tab, Ti.UI.TabGroup' }, {
		'title': '{ titleColor: {value} }'
	}, modifiersAndValues);
}
exports.titleColor = titleColor;

function activeTintColor(modifiersAndValues) {
	return processProperties({ 'prop': 'activeTintColor', 'component': 'Ti.UI.Tab, Ti.UI.TabGroup' }, {
		'active-tint': '{ activeTintColor: {value} }'
	}, modifiersAndValues);
}
exports.activeTintColor = activeTintColor;

function activeTitleColor(modifiersAndValues) {
	return processProperties({ 'prop': 'activeTitleColor', 'component': 'Ti.UI.Tab, Ti.UI.TabGroup' }, {
		'active-title': '{ activeTitleColor: {value} }'
	}, modifiersAndValues);
}
exports.activeTitleColor = activeTitleColor;

function borderColor(modifiersAndValues) {
	return processProperties({ 'prop': 'borderColor', 'component': 'Ti.UI.View' }, {
		'border': '{ borderColor: {value} }'
	}, modifiersAndValues);
}
exports.borderColor = borderColor;

function indicatorColor(modifiersAndValues) {
	return processProperties({ 'prop': 'indicatorColor', 'component': 'Ti.UI.ActivityIndicator' }, {
		'indicator': '{ indicatorColor: {value} }'
	}, modifiersAndValues);
}
exports.indicatorColor = indicatorColor;

function pagingControlAlpha(modifiersAndValues) {
	return processProperties({ 'prop': 'pagingControlAlpha', 'component': 'Ti.UI.ScrollableView' }, {
		'paging-alpha': '{ pagingControlAlpha: {value} }'
	}, modifiersAndValues);
}
exports.pagingControlAlpha = pagingControlAlpha;

function pagingControlColor(modifiersAndValues) {
	return processProperties({ 'prop': 'pagingControlColor', 'component': 'Ti.UI.ScrollableView' }, {
		'paging': '{ pagingControlColor: {value} }'
	}, modifiersAndValues);
}
exports.pagingControlColor = pagingControlColor;

function pageIndicatorColor(modifiersAndValues) {
	return processProperties({ 'prop': 'pageIndicatorColor', 'component': 'Ti.UI.ScrollableView' }, {
		'page': '{ pageIndicatorColor: {value} }'
	}, modifiersAndValues);
}
exports.pageIndicatorColor = pageIndicatorColor;

function currentPageIndicatorColor(modifiersAndValues) {
	return processProperties({ 'prop': 'currentPageIndicatorColor', 'component': 'Ti.UI.ScrollableView' }, {
		'current-page': '{ currentPageIndicatorColor: {value} }'
	}, modifiersAndValues);
}
exports.currentPageIndicatorColor = currentPageIndicatorColor;

function touchFeedbackColor(modifiersAndValues) {
	return processProperties({ 'prop': 'touchFeedbackColor', 'component': 'Ti.UI.View' }, {
		'feedback': '{ touchFeedback: true, touchFeedbackColor: {value} }'
	}, modifiersAndValues);
}
exports.touchFeedbackColor = touchFeedbackColor;

function placeholderColor(modifiersAndValues) {
	return processProperties({ 'prop': 'hintTextColor', 'component': 'Ti.UI.Android.SearchView, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'placeholder': '{ hintTextColor: {value} }'
	}, modifiersAndValues);
}
exports.placeholderColor = placeholderColor;

function tintColor(modifiersAndValues) {
	return processProperties({ 'prop': 'tint and tintColor', 'component': 'Ti.UI, Ti.UI.AlertDialog, Ti.UI.Button, Ti.UI.ImageView, Ti.UI.iOS.Stepper, Ti.UI.ProgressBar, Ti.UI.RefreshControll, Ti.UI.Slider, Ti.UI.Switch, and `tint` for Ti.UI.MaskedImage' }, {
		'tint': '{ tint: {value}, tintColor: {value} }'
	}, modifiersAndValues);
}
exports.tintColor = tintColor;

function borderRadiusExtraStyles({ ...modifiersAndValues }) {
	// SOME CLEANUP... SOME VALUES NOT NEEDED HERE!.
	delete modifiersAndValues[0];
	delete modifiersAndValues.fit;
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

	return processProperties({ 'prop': 'borderRadius ( with Extra Styles )', 'component': 'Ti.UI.Android.CardView, Ti.UI.View' }, {
		'rounded': '{ borderRadius: {value} }',

		'rounded-t': '{ borderRadius: [{value}, {value}, 0, 0] }',
		'rounded-r': '{ borderRadius: [0, {value}, {value}, 0] }',
		'rounded-b': '{ borderRadius: [0, 0, {value}, {value}] }',
		'rounded-l': '{ borderRadius: [{value}, 0, 0, {value}] }',

		'rounded-tl': '{ borderRadius: [{value}, 0, 0, 0] }',
		'rounded-tr': '{ borderRadius: [0, {value}, 0, 0] }',
		'rounded-br': '{ borderRadius: [0, 0, {value}, 0] }',
		'rounded-bl': '{ borderRadius: [0, 0, 0, {value}] }',

	}, modifiersAndValues);
}
exports.borderRadiusExtraStyles = borderRadiusExtraStyles;

function borderWidth({ ...modifiersAndValues }) {
	_.each(modifiersAndValues, (value, key) => {
		modifiersAndValues[key] = parseInt(value);
	});

	return processProperties({ 'prop': 'borderWidth', 'component': 'Ti.UI.View' }, {
		'border': '{ borderWidth: {value} }'
	}, modifiersAndValues);
}
exports.borderWidth = borderWidth;

function scale(modifiersAndValues) {
	modifiersAndValues[1] = '.01';
	return processProperties({ 'prop': 'scale', 'component': 'Ti.UI.ScrollView, MatrixCreationDict' }, {
		'scale': '{ scale: \'{value}\' }'
	}, modifiersAndValues);
}
exports.scale = scale;

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

	return processProperties({ 'prop': 'fontWeight', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Button, Ti.UI.Label, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.PickerColumn, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'font': '{ font: { fontWeight: {value} } }'
	}, modifiersAndValues);
}
exports.fontWeight = fontWeight;

function gap({ ...modifiersAndValues }) {
	// SOME CLEANUP... VALUES NOT NEEDED HERE!.
	modifiersAndValues = removeFractions(modifiersAndValues);

	modifiersAndValues.auto = 'auto';
	delete modifiersAndValues.min;
	delete modifiersAndValues.max;
	delete modifiersAndValues.screen;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues['max-content'];

	return processProperties({ 'prop': 'top, right, bottom, left - Gap for Grid System', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window' }, {
		'gap': '{ top: {value}, right: {value}, bottom: {value}, left: {value} }',
		'gap-b': '{ bottom: {value} }',
		'gap-l': '{ left: {value} }',
		'gap-r': '{ right: {value} }',
		'gap-t': '{ top: {value} }',
		'gap-x': '{ right: {value}, left: {value} }',
		'gap-y': '{ top: {value}, bottom: {value} }',
	}, modifiersAndValues);
}
exports.gap = gap;

function transitionDelay(modifiersAndValues) {
	return processProperties({ 'prop': 'delay', 'component': 'Ti.UI.Animation' }, {
		'delay': '{ delay: {value} }'
	}, modifiersAndValues);
}
exports.transitionDelay = transitionDelay;

function transitionDuration(modifiersAndValues) {
	return processProperties({ 'prop': 'duration', 'component': 'Ti.UI.Animation' }, {
		'duration': '{ duration: {value} }'
	}, modifiersAndValues);
}
exports.transitionDuration = transitionDuration;

function pagingControlTimeout(modifiersAndValues) {
	return processProperties({ 'prop': 'pagingControlTimeout', 'component': 'Ti.UI.ScrollableView' }, {
		'paging-timeout': '{ pagingControlTimeout: {value} }'
	}, modifiersAndValues);
}
exports.pagingControlTimeout = pagingControlTimeout;

function fontFamily(modifiersAndValues) {
	return processProperties({ 'prop': 'fontFamily', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Button, Ti.UI.Label, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.PickerColumn, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'font': '{ font: { fontFamily: {value} } }'
	}, modifiersAndValues);
}
exports.fontFamily = fontFamily;

function pagingControlHeight({ ...modifiersAndValues }) {
	modifiersAndValues = removeFractions(modifiersAndValues);

	delete modifiersAndValues.full;
	delete modifiersAndValues.auto;
	delete modifiersAndValues.screen;

	return processProperties({ 'prop': 'pagingControlHeight', 'component': 'Ti.UI.ScrollableView' }, {
		'paging-h': '{ pagingControlHeight: {value} }'
	}, modifiersAndValues);
}
exports.pagingControlHeight = pagingControlHeight;

function rotate(modifiersAndValues) {
	return processProperties({ 'prop': 'rotate', 'component': 'For the Animation Component' }, {
		'rotate': '{ rotate: {value} }'
	}, modifiersAndValues);
}
exports.rotate = rotate;

function zIndex(modifiersAndValues) {
	delete modifiersAndValues.auto;
	return processProperties({ 'prop': 'zIndex', 'component': 'Ti.UI.Animation, Ti.UI.View' }, {
		'z': '{ zIndex: {value} }'
	}, modifiersAndValues);
}
exports.zIndex = zIndex;

function linearGradient() {
	let convertedStyles = processComments({ 'prop': 'backgroundGradient - Linear', 'component': 'Ti.UI.MaskedImage' });

	convertedStyles += `'.bg-linear': { backgroundGradient: { type: 'linear', startPoint: { x: '50%', y: '100%' }, endPoint: { x: '50%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-t': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-tr': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-r': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-br': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '0%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-b': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-bl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-l': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-linear-to-tl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '100%' }, backfillStart: true } }\n`;

	convertedStyles += processComments({ 'prop': 'backgroundGradient - Gradient', 'component': 'Ti.UI.MaskedImage' });

	convertedStyles += `'.bg-gradient': { backgroundGradient: { type: 'linear', startPoint: { x: '50%', y: '100%' }, endPoint: { x: '50%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-t': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-tr': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-r': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-br': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '0%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-b': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-bl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-l': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }\n`;
	convertedStyles += `'.bg-gradient-to-tl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '100%' }, backfillStart: true } }\n`;

	return convertedStyles;
}
exports.linearGradient = linearGradient;

function backgroundBlendMode() {
	return processProperties({ 'prop': 'mode ( Background Blend Mode )', 'component': 'Ti.UI.MaskedImage' }, {
		'default': '{ mode: {value} }'
	}, {
		'bg-blend': {
			'default': {
				'clear': 'Ti.UI.BLEND_MODE_CLEAR',
				'copy': 'Ti.UI.BLEND_MODE_COPY',
				'darken': 'Ti.UI.BLEND_MODE_DARKEN',
				'destination-atop': 'Ti.UI.BLEND_MODE_DESTINATION_ATOP',
				'destination-in': 'Ti.UI.BLEND_MODE_DESTINATION_IN',
				'destination-out': 'Ti.UI.BLEND_MODE_DESTINATION_OUT',
				'destination-over': 'Ti.UI.BLEND_MODE_DESTINATION_OVER',
				'lighten': 'Ti.UI.BLEND_MODE_LIGHTEN',
				'multiply': 'Ti.UI.BLEND_MODE_MULTIPLY',
				'normal': 'Ti.UI.BLEND_MODE_NORMAL',
				'overlay': 'Ti.UI.BLEND_MODE_OVERLAY',
				'plus-lighter': 'Ti.UI.BLEND_MODE_PLUS_LIGHTER',
				'screen': 'Ti.UI.BLEND_MODE_SCREEN',
				'source-atop': 'Ti.UI.BLEND_MODE_SOURCE_ATOP',
				'source-in': 'Ti.UI.BLEND_MODE_SOURCE_IN',
				'source-out': 'Ti.UI.BLEND_MODE_SOURCE_OUT',
				'xor': 'Ti.UI.BLEND_MODE_XOR',
			},
			'ios': {
				'color': 'Ti.UI.BLEND_MODE_COLOR',
				'color-burn': 'Ti.UI.BLEND_MODE_COLOR_BURN',
				'color-dodge': 'Ti.UI.BLEND_MODE_COLOR_DODGE',
				'diference': 'Ti.UI.BLEND_MODE_DIFFERENCE',
				'exclusion': 'Ti.UI.BLEND_MODE_EXCLUSION',
				'hard-light': 'Ti.UI.BLEND_MODE_HARD_LIGHT',
				'hue': 'Ti.UI.BLEND_MODE_HUE',
				'luminosity': 'Ti.UI.BLEND_MODE_LUMINOSITY',
				'plus-darker': 'Ti.UI.BLEND_MODE_PLUS_DARKER',
				'saturation': 'Ti.UI.BLEND_MODE_SATURATION',
				'soft-light': 'Ti.UI.BLEND_MODE_SOFT_LIGHT',
			},
		}
	});
}
exports.backgroundBlendMode = backgroundBlendMode;

function radialGradient() {
	let convertedStyles = processComments({ 'prop': 'backgroundGradient: type, startRadius, endRadius, backfillStart, backfillEnd', 'component': 'Ti.UI.ListItem, Ti.UI.View' });

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
	let convertedStyles = processComments({ 'prop': 'backgroundGradient: colors - From Color', 'component': 'Ti.UI.ListItem, Ti.UI.View' });

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

	convertedStyles += processComments({ 'prop': 'backgroundGradient: colors - To Color', 'component': 'Ti.UI.ListItem, Ti.UI.View' });

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

	return processProperties({ 'prop': 'fontSize', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Button, Ti.UI.Label, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.PickerColumn, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'text': '{ font: { fontSize: {value} } }'
	}, cleanValues);
}
exports.fontSize = fontSize;

function opacity(modifiersAndValues) {
	return processProperties({ 'prop': 'opacity', 'component': 'Ti.UI.Animation, Ti.UI.TableViewRow, Ti.UI.View, Ti.UI.Window' }, {
		'opacity': '{ opacity: {value} }'
	}, modifiersAndValues);
}
exports.opacity = opacity;

function fontStyle() {
	return processProperties({ 'prop': 'fontStyle', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Button, Ti.UI.Label, Ti.UI.ListItem, Ti.UI.Picker, Ti.UI.PickerColumn, Ti.UI.PickerRow, Ti.UI.ProgressBar, Ti.UI.Switch, Ti.UI.TableViewRow, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'default': '{ font: { fontStyle: {value} } }'
	}, {
		'italic': 'italic',
		'not-italic': 'normal',
	});
}
exports.fontStyle = fontStyle;

function cacheSize() {
	return processProperties({ 'prop': 'cacheSize', 'component': 'Ti.UI.ScrollableView' }, {
		'cache-size': '{ cacheSize: {value} }'
	}, {
		1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10
	});
}
exports.cacheSize = cacheSize;

function activityIndicatorStyle() {
	return processProperties({ 'prop': 'style', 'component': 'Ti.UI.ActivityIndicator' }, {
		'activity-indicator-style': '{ style: {value} }',
	}, {
		'big': 'Ti.UI.ActivityIndicatorStyle.BIG',
		'dark': 'Ti.UI.ActivityIndicatorStyle.DARK',
		'big-dark': 'Ti.UI.ActivityIndicatorStyle.BIG_DARK',
		'plain': 'Ti.UI.ActivityIndicatorStyle.PLAIN'
	});
}
exports.activityIndicatorStyle = activityIndicatorStyle;

function statusBar() {
	return processProperties({ 'prop': 'statusBarStyle - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ statusBarStyle: {value} }'
	}, {
		'status-bar': {
			'ios': {
				'default': 'Ti.UI.iOS.StatusBar.DEFAULT',
				'dark': 'Ti.UI.iOS.StatusBar.DARK_CONTENT',
				'light': 'Ti.UI.iOS.StatusBar.LIGHT_CONTENT',
			}
		}
	});
}
exports.statusBar = statusBar;

function disableBounce() {
	return processProperties({ 'prop': 'disableBounce', 'component': 'Ti.UI.ListView, Ti.UI.ScrollableView, Ti.UI.ScrollView, Ti.UI.WebView' }, {
		'default': '{ disableBounce: {value} }'
	}, {
		'disable-bounce': true,
		'enable-bounce': false,
	});
}
exports.disableBounce = disableBounce;

function bubbleParent() {
	return processProperties({ 'prop': 'bubbleParent', 'component': 'Ti.Proxy' }, {
		'default': '{ bubbleParent: {value} }'
	}, {
		'bubble-parent': true,
		'dont-bubble-parent': false,
	});
}
exports.bubbleParent = bubbleParent;

function draggingType() {
	return processProperties({ 'prop': 'draggingType', 'component': 'For the Animation Component' }, {
		'default': '{ draggingType: {value} }'
	}, {
		'drag-apply': 'apply',
		'drag-animate': 'animate',
	});
}
exports.draggingType = draggingType;

function keepScreenOn() {
	return processProperties({ 'prop': 'keepScreenOn - Android Only', 'component': 'Ti.UI.View' }, {
		'default': '{ keepScreenOn: {value} }'
	}, {
		'keep-screen': {
			'android': {
				'on': true,
			}
		}
	});
}
exports.keepScreenOn = keepScreenOn;

function largeTitleDisplayMode() {
	return processProperties({ 'prop': 'largeTitleDisplayMode - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ largeTitleDisplayMode: {value} }'
	}, {
		'large-title-display': {
			'ios': {
				'always': 'Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_ALWAYS',
				'automatic': 'Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_AUTOMATIC',
				'never': 'Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_NEVER',
			}
		}
	});
}
exports.largeTitleDisplayMode = largeTitleDisplayMode;

function autoAdjustScrollViewInsets() {
	return processProperties({ 'prop': 'autoAdjustScrollViewInsets - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ autoAdjustScrollViewInsets: {value} }'
	}, {
		'auto-adjust-scroll-view-inset': {
			'ios': {
				'default': true,
			}
		}
	});
}
exports.autoAdjustScrollViewInsets = autoAdjustScrollViewInsets;

function largeTitleEnabled() {
	return processProperties({ 'prop': 'largeTitleEnabled - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ largeTitleEnabled: {value} }'
	}, {
		'large-title': {
			'ios': {
				'enabled': true,
			}
		}
	});
}
exports.largeTitleEnabled = largeTitleEnabled;

function includeOpaqueBars() {
	return processProperties({ 'prop': 'includeOpaqueBars - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ includeOpaqueBars: {value} }'
	}, {
		'include': {
			'ios': {
				'opaque-bars': true,
			}
		},
		'exclude': {
			'ios': {
				'opaque-bars': false,
			}
		}
	});
}
exports.includeOpaqueBars = includeOpaqueBars;

function extendEdges() {
	return processProperties({ 'prop': 'extendEdges - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ extendEdges: {value} }'
	}, {
		'extend-edges': {
			'ios': {
				'all': '[ Ti.UI.EXTEND_EDGE_ALL ]',
				'bottom': '[ Ti.UI.EXTEND_EDGE_BOTTOM ]',
				'left': '[ Ti.UI.EXTEND_EDGE_LEFT ]',
				'none': '[ Ti.UI.EXTEND_EDGE_NONE ]',
				'right': '[ Ti.UI.EXTEND_EDGE_RIGHT ]',
				'top': '[ Ti.UI.EXTEND_EDGE_TOP ]',
			}
		}
	});
}
exports.extendEdges = extendEdges;

function extendSafeArea() {
	return processProperties({ 'prop': 'extendSafeArea', 'component': 'Ti.UI.Window' }, {
		'default': '{ extendSafeArea: {value} }'
	}, {
		'extend-safe-area': true,
		'dont-extend-safe-area': false,
	});
}
exports.extendSafeArea = extendSafeArea;

function flagSecure() {
	return processProperties({ 'prop': 'flagSecure', 'component': 'Ti.UI.Window' }, {
		'default': '{ flagSecure: {value} }'
	}, {
		'flag': {
			'android': {
				'secure': true,
				'not-secure': false,
			}
		}
	});
}
exports.flagSecure = flagSecure;

function overlay() {
	return processProperties({ 'prop': 'overlayEnabled', 'component': 'Ti.UI.ScrollableView' }, {
		'default': '{ overlayEnabled: {value} }'
	}, {
		'overlay': {
			'ios': {
				'enabled': true,
				'disabled': false,
			}
		}
	});
}
exports.overlay = overlay;

function translucent() {
	return processProperties({ 'prop': 'translucent - iOS Only', 'component': 'Ti.UI.iOS.Toolbar, Ti.UI.TabGroup, Ti.UI.Toolbar, Ti.UI.Window' }, {
		'default': '{ translucent: {value} }'
	}, {
		'translucent': {
			'ios': {
				'default': true,
				'disabled': false,
			}
		}
	});
}
exports.translucent = translucent;

function tabsTranslucent() {
	return processProperties({ 'prop': 'tabsTranslucent - iOS Only', 'component': 'Ti.UI.TabGroup' }, {
		'default': '{ tabsTranslucent: {value} }'
	}, {
		'tabs': {
			'ios': {
				'translucent': true,
				'not-translucent': false,
			}
		}
	});
}
exports.tabsTranslucent = tabsTranslucent;

function displayCaps() {
	let convertedStyles = '\n// Property(ies): width, height\n';
	convertedStyles += '// Component(s): Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View\n';
	convertedStyles += '// Description: width and height properties using Ti.Platform.displayCaps platformWidth and platformHeight values\n';
	convertedStyles += `'.platform-w': { width: Ti.Platform.displayCaps.platformWidth }\n`;
	convertedStyles += `'.platform-h': { height: Ti.Platform.displayCaps.platformHeight }\n`;

	convertedStyles += `'.inverted-platform-w': { width: Ti.Platform.displayCaps.platformHeight }\n`;
	convertedStyles += `'.inverted-platform-h': { height: Ti.Platform.displayCaps.platformWidth }\n`;

	convertedStyles += `'.inverted-platform-w[platform=android]': { width: Ti.Platform.displayCaps.platformWidth }\n`;
	convertedStyles += `'.inverted-platform-h[platform=android]': { height: Ti.Platform.displayCaps.platformHeight }\n`;

	return convertedStyles;
}
exports.displayCaps = displayCaps;

function scrollingEnabled() {
	return processProperties({ 'prop': 'scrollingEnabled', 'component': 'Ti.UI.ScrollableView, Ti.UI.ScrollView' }, {
		'scrolling': '{ scrollingEnabled: {value} }'
	}, {
		'enabled': true,
		'disabled': false,
	});
}
exports.scrollingEnabled = scrollingEnabled;

function modal() {
	return processProperties({ 'prop': 'modal', 'component': 'Ti.UI.Window' }, {
		'default': '{ modal: {value} }'
	}, {
		'modal': true,
		'regular': false,
	});
}
exports.modal = modal;

function fullscreen() {
	return processProperties({ 'prop': 'fullscreen', 'component': 'Ti.Media.VideoPlayer[android], Ti.UI.TextArea, Ti.UI.TextField, Ti.UI.Window' }, {
		'default': '{ fullscreen: {value} }'
	}, {
		'fullscreen': true,
		'fullscreen-disabled': false,
	});
}
exports.fullscreen = fullscreen;

function hidesBackButton() {
	return processProperties({ 'prop': 'hidesBackButton', 'component': 'Ti.UI.Window' }, {
		'default': '{ hidesBackButton: {value} }'
	}, {
		'hides-back-button': true,
		'show-back-button': false,
	});
}
exports.hidesBackButton = hidesBackButton;

function hidesBarsOnSwipe() {
	return processProperties({ 'prop': 'hidesBarsOnSwipe - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ hidesBarsOnSwipe: {value} }'
	}, {
		'hides': {
			'ios': {
				'bars-on-swipe': true,
			}
		},
		'show': {
			'ios': {
				'bars-on-swipe': false,
			}
		}
	});
}
exports.hidesBarsOnSwipe = hidesBarsOnSwipe;

function hidesBarsOnTap() {
	return processProperties({ 'prop': 'hidesBarsOnTap - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ hidesBarsOnTap: {value} }'
	}, {
		'hides': {
			'ios': {
				'bars-on-tap': true,
			}
		},
		'show': {
			'ios': {
				'bars-on-tap': false,
			}
		}
	});
}
exports.hidesBarsOnTap = hidesBarsOnTap;

function hidesBarsWhenKeyboardAppears() {
	return processProperties({ 'prop': 'hidesBarsWhenKeyboardAppears - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ hidesBarsWhenKeyboardAppears: {value} }'
	}, {
		'hides': {
			'ios': {
				'bars-when-keyboard-appears': true,
			}
		},
		'show': {
			'ios': {
				'bars-when-keyboard-appears': false,
			}
		}
	});
}
exports.hidesBarsWhenKeyboardAppears = hidesBarsWhenKeyboardAppears;

function hideShadow() {
	return processProperties({ 'prop': 'hideShadow - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ hideShadow: {value} }'
	}, {
		'hide': {
			'ios': {
				'shadow': true,
			}
		},
		'show': {
			'ios': {
				'shadow': false,
			}
		}
	});
}
exports.hideShadow = hideShadow;

function hidesSearchBarWhenScrolling() {
	return processProperties({ 'prop': 'hidesSearchBarWhenScrolling - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ hidesSearchBarWhenScrolling: {value} }'
	}, {
		'hides': {
			'ios': {
				'search-bar-when-scrolling': true,
			}
		},
		'show': {
			'ios': {
				'search-bar-when-scrolling': false,
			}
		}
	});
}
exports.hidesSearchBarWhenScrolling = hidesSearchBarWhenScrolling;

function homeIndicatorAutoHidden() {
	return processProperties({ 'prop': 'homeIndicatorAutoHidden - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ homeIndicatorAutoHidden: {value} }'
	}, {
		'home-indicator-auto-hidden': {
			'ios': {
				'default': true,
			}
		}
	});
}
exports.homeIndicatorAutoHidden = homeIndicatorAutoHidden;

function pagingControl() {
	return processProperties({ 'prop': 'showPagingControl', 'component': 'Ti.UI.ScrollableView' }, {
		'default': '{ showPagingControl: {value} }'
	}, {
		'show-paging-control': true,
		'hide-paging-control': false,
	});
}
exports.pagingControl = pagingControl;

function pagingControlOnTop() {
	return processProperties({ 'prop': 'pagingControlOnTop', 'component': 'Ti.UI.ScrollableView' }, {
		'paging-control-on': '{ pagingControlOnTop: {value} }'
	}, {
		'top': true,
		'bottom': false
	});
}
exports.pagingControlOnTop = pagingControlOnTop;

function autoreverse() {
	return processProperties({ 'prop': 'autoreverse', 'component': 'Ti.UI.Animation' }, {
		'default': '{ autoreverse: {value} }'
	}, {
		'autoreverse': true,
		'no-autoreverse': false,
	});
}
exports.autoreverse = autoreverse;

function transition() {
	let convertedStyles = processProperties({ 'prop': 'curve', 'component': 'Ti.UI.Animation' }, {
		'ease': '{ curve: {value} }'
	}, {
		'in': 'Ti.UI.ANIMATION_CURVE_EASE_IN',
		'out': 'Ti.UI.ANIMATION_CURVE_EASE_OUT',
		'linear': 'Ti.UI.ANIMATION_CURVE_LINEAR',
		'in-out': 'Ti.UI.ANIMATION_CURVE_EASE_IN_OUT',
	});

	convertedStyles += processProperties('debug', {
		'debug': '{ debug: {value} }'
	}, {
		'default': true,
	});

	return convertedStyles;
}
exports.transition = transition;

function gridFlow() {
	return processProperties({ 'prop': 'layout', 'component': 'Ti.UI.View', 'description': 'Grid Flow - layout' }, {
		'grid': '{ layout: {value} }'
	}, {
		'default': 'horizontal',
		'flow-col': 'horizontal',
		'flow-row': 'vertical',
	});
}
exports.gridFlow = gridFlow;

function orientationModes() {
	let convertedStyles = processProperties({ 'prop': 'orientationModes', 'component': 'Ti.UI.Window' }, {
		'default': '{ orientationModes: {value} }'
	}, {
		'orientation': {
			'default': {
				'left': '[ Ti.UI.LANDSCAPE_LEFT ]',
				'right': '[ Ti.UI.LANDSCAPE_RIGHT ]',
				'portrait': '[ Ti.UI.PORTRAIT ]',
				'upside-portrait': '[ Ti.UI.UPSIDE_PORTRAIT ]',
				'landscape': '[ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]',
			}
		}
	});

	convertedStyles += processProperties({ 'prop': 'orientationModes (Alternative)', 'component': 'Ti.UI.Window' }, {
		'default': '{ orientationModes: {value} }'
	}, {
		'portrait': '[ Ti.UI.PORTRAIT ]',
		'upside-portrait': '[ Ti.UI.UPSIDE_PORTRAIT ]',
		'landscape-left': '[ Ti.UI.LANDSCAPE_LEFT ]',
		'landscape-right': '[ Ti.UI.LANDSCAPE_RIGHT ]',
		'landscape': '[ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]',
	});

	return convertedStyles;
}
exports.orientationModes = orientationModes;

function items() {
	let convertedStyles = processComments({
		prop: 'top, bottom, width(FILL), height(FILL)',
		component: 'Ti.UI.ActivityIndicator, Ti.UI.Animaiton, Ti.UI.View, Ti.UI.Window',
		description: 'top, bottom, width, height properties for aligning items in a Grid System',
	});
	convertedStyles += `'.items-start': { top: 0 }\n`;
	convertedStyles += `'.items-end': { bottom: 0 }\n`;
	convertedStyles += `'.items-center': { width: Ti.UI.FILL, height: Ti.UI.FILL }\n`;

	return convertedStyles;
}
exports.items = items;

function clipMode() {
	return processProperties({ 'prop': 'clipMode - iOS Only', 'component': 'Ti.UI.View' }, {
		'default': '{ clipMode: {value} }'
	}, {
		'clip': {
			'ios': {
				'enabled': 'Ti.UI.iOS.CLIP_MODE_ENABLED',
				'disabled': 'Ti.UI.iOS.CLIP_MODE_DISABLED',
			}
		}
	});
}
exports.clipMode = clipMode;

function exitOnClose() {
	let convertedStyles = processComments({ 'prop': 'exitOnClose', 'component': 'Ti.UI.TabGroup[android], Ti.UI.Window[android]' });
	convertedStyles += `'.exit-on-close[platform=android]': { exitOnClose: true }\n`;
	convertedStyles += `'.dont-exit-on-close[platform=android]': { exitOnClose: false }\n`;

	return convertedStyles;
}
exports.exitOnClose = exitOnClose;

function layout() {
	return processProperties({ 'prop': 'layout', 'component': 'Ti.UI.OptionBar, Ti.UI.View' }, {
		'default': '{ layout: {value} }'
	}, {
		'horizontal': 'horizontal',
		'vertical': 'vertical',
	});
}
exports.layout = layout;

function scrollType() {
	return processProperties({ 'prop': 'scrollType', 'component': 'Ti.UI.ScrollView' }, {
		'default': '{ scrollType: {value} }'
	}, {
		'scroll': {
			'android': {
				'horizontal': 'horizontal',
				'vertical': 'vertical',
			}
		}
	});
}
exports.scrollType = scrollType;

function sustainedPerformanceMode() {
	return processProperties({ 'prop': 'sustainedPerformanceMode', 'component': 'Ti.UI.Window' }, {
		'default': '{ sustainedPerformanceMode: {value} }'
	}, {
		'sustained-performance-mode': {
			'android': {
				'default': true,
			}
		}
	});
}
exports.sustainedPerformanceMode = sustainedPerformanceMode;

function swipeToClose() {
	return processProperties({ 'prop': 'swipeToClose', 'component': 'Ti.UI.Window' }, {
		'default': '{ swipeToClose: {value} }'
	}, {
		'swipe-to-close': {
			'ios': {
				'default': true,
			}
		},
		'dont-swipe-to-close': {
			'ios': {
				'default': false,
			}
		}
	});
}
exports.swipeToClose = swipeToClose;

function preventDefaultImage() {
	let convertedStyles = processComments({ 'prop': 'preventDefaultImage - iOS Only', 'component': 'Ti.UI.ImageView' });
	convertedStyles += `'.prevent-default-image[platform=ios]': { preventDefaultImage: true }\n`;
	convertedStyles += `'.display-default-image[platform=ios]': { preventDefaultImage: false }\n`;

	return convertedStyles;
}
exports.preventDefaultImage = preventDefaultImage;

function tiMedia() {
	let convertedStyles = '\n// Ti.Media';

	convertedStyles += processProperties({
		'prop': 'audioSessionCategory - iOS Only',
		'component': 'Ti.Media'
	}, {
		'audio': '{ audioSessionCategory: {value} }'
	}, {
		'session': {
			'ios': {
				'record': 'Ti.Media.AUDIO_SESSION_CATEGORY_RECORD',
				'ambient': 'Ti.Media.AUDIO_SESSION_CATEGORY_AMBIENT',
				'playback': 'Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK',
				'solo-ambient': 'Ti.Media.AUDIO_SESSION_CATEGORY_SOLO_AMBIENT',
				'play-record': 'Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD',
			}
		}
	});

	convertedStyles += processProperties({
		'prop': 'audioType',
		'component': 'Ti.Media.AudioPlayer[android], Ti.Media.Sound[android]'
	}, {
		'audio': '{ audioType: {value} }'
	}, {
		'type': {
			'android': {
				'ring': 'Ti.Media.Sound.AUDIO_TYPE_RING',
				'alarm': 'Ti.Media.Sound.AUDIO_TYPE_ALARM',
				'media': 'Ti.Media.Sound.AUDIO_TYPE_MEDIA',
				'voice': 'Ti.Media.Sound.AUDIO_TYPE_VOICE',
				'signalling': 'Ti.Media.Sound.AUDIO_TYPE_SIGNALLING',
				'notification': 'Ti.Media.Sound.AUDIO_TYPE_NOTIFICATION',
			}
		}
	});

	convertedStyles += processProperties({
		'prop': 'repeatMode - iOS Only',
		'component': 'Ti.Media.MusicPlayer'
	}, {
		'music': '{ repeatMode: {value} }'
	}, {
		'repeat': {
			'ios': {
				'all': 'Ti.Media.MUSIC_PLAYER_REPEAT_ALL',
				'default': 'Ti.Media.MUSIC_PLAYER_REPEAT_DEFAULT',
				'none': 'Ti.Media.MUSIC_PLAYER_REPEAT_NONE',
				'one': 'Ti.Media.MUSIC_PLAYER_REPEAT_ONE',
			}
		}
	});

	convertedStyles += processProperties({
		'prop': 'shuffleMode - iOS Only',
		'component': 'Ti.Media.MusicPlayer'
	}, {
		'music': '{ shuffleMode: {value} }'
	}, {
		'shuffle': {
			'ios': {
				'albums': 'Ti.Media.MUSIC_PLAYER_SHUFFLE_ALBUMS',
				'default': 'Ti.Media.MUSIC_PLAYER_SHUFFLE_DEFAULT',
				'none': 'Ti.Media.MUSIC_PLAYER_SHUFFLE_NONE',
				'songs': 'Ti.Media.MUSIC_PLAYER_SHUFFLE_SONGS',
			}
		}
	});

	convertedStyles += processProperties({
		'prop': 'scalingMode',
		'component': 'Ti.UI.ImageView',
		'description': 'Background Size for compatibility with Tailwind classes'
	}, {
		'bg': '{ scalingMode: {value} }'
	}, {
		'auto': 'Ti.Media.IMAGE_SCALING_NONE',
		'cover': 'Ti.Media.IMAGE_SCALING_ASPECT_FILL',
		'contain': 'Ti.Media.IMAGE_SCALING_ASPECT_FIT'
	});

	convertedStyles += processProperties({
		'prop': 'scalingMode',
		'component': 'Ti.UI.ImageView',
		'description': 'Object Fit for compatibility with Tailwind classes'
	}, {
		'object': '{ scalingMode: {value} }'
	}, {
		'auto': 'Ti.Media.IMAGE_SCALING_AUTO',
		'fill': 'Ti.Media.IMAGE_SCALING_FILL',
		'none': 'Ti.Media.IMAGE_SCALING_NONE',
		'cover': 'Ti.Media.IMAGE_SCALING_ASPECT_FILL',
		'contain': 'Ti.Media.IMAGE_SCALING_ASPECT_FIT',
	});

	convertedStyles += processProperties({
		'prop': 'scalingMode',
		'component': 'Ti.UI.ImageView',
		'description': 'Image Scaling Mode'
	}, {
		'image-scaling': '{ scalingMode: {value} }'
	}, {
		'auto': 'Ti.Media.IMAGE_SCALING_AUTO',
		'none': 'Ti.Media.IMAGE_SCALING_NONE',
		'fill': 'Ti.Media.IMAGE_SCALING_FILL',
		'cover': 'Ti.Media.IMAGE_SCALING_ASPECT_FILL',
		'contain': 'Ti.Media.IMAGE_SCALING_ASPECT_FIT',
	});

	// Video Scaling Mode
	convertedStyles += processProperties({
		'prop': 'scalingMode',
		'component': 'Ti.Media.VideoPlayer',
		'description': 'Video Scaling Mode'
	}, {
		'video-scaling': '{ scalingMode: {value} }'
	}, {
		'resize': 'Ti.Media.VIDEO_SCALING_RESIZE',
		'contain': 'Ti.Media.VIDEO_SCALING_RESIZE_ASPECT',
		'cover': 'Ti.Media.VIDEO_SCALING_RESIZE_ASPECT_FILL'
	});

	convertedStyles += processProperties({
		'prop': 'repeatMode',
		'component': 'Ti.Media.VideoPlayer',
		'description': 'Determines how the movie player repeats when reaching the end of playback.'
	}, {
		'video-repeat': '{ repeatMode: {value} }'
	}, {
		'one': 'Ti.Media.VIDEO_REPEAT_MODE_ONE',
		'none': 'Ti.Media.VIDEO_REPEAT_MODE_NONE',
	});

	return convertedStyles;
}
exports.tiMedia = tiMedia;

function autocapitalization() {
	return processProperties({ 'prop': 'autocapitalization', 'component': 'Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'default': '{ autocapitalization: {value} }'
	}, {
		'uppercase': 'Ti.UI.TEXT_AUTOCAPITALIZATION_ALL',
		'normal-case': 'Ti.UI.TEXT_AUTOCAPITALIZATION_NONE',
		'capitalize': 'Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS',
		'sentences': 'Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES',
	});
}
exports.autocapitalization = autocapitalization;

function showCancel() {
	return processProperties({ 'prop': 'showCancel', 'component': 'Ti.UI.SearchBar' }, {
		'default': '{ showCancel: {value} }'
	}, {
		'show-cancel': true,
		'hide-cancel': false,
	});
}
exports.showCancel = showCancel;

function loginKeyboardType() {
	return processProperties({ 'prop': 'loginKeyboardType', 'component': 'Ti.UI.AlertDialog' }, {
		'login-keyboard': '{ loginKeyboardType: {value} }'
	}, {
		'default': 'Ti.UI.KEYBOARD_TYPE_DEFAULT',
		'appearance': 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
		'appearance-dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
		'appearance-light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT',
		'ascii': 'Ti.UI.KEYBOARD_TYPE_ASCII',
		'decimal-pad': 'Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD',
		'email': 'Ti.UI.KEYBOARD_TYPE_EMAIL',
		'namephone-pad': 'Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD',
		'number-pad': 'Ti.UI.KEYBOARD_TYPE_NUMBER_PAD',
		'numbers-punctuation': 'Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION',
		'phone-pad': 'Ti.UI.KEYBOARD_TYPE_PHONE_PAD',
		'twitter': 'Ti.UI.KEYBOARD_TYPE_TWITTER',
		'url': 'Ti.UI.KEYBOARD_TYPE_URL',
		'websearch': 'Ti.UI.KEYBOARD_TYPE_WEBSEARCH',
	});
}
exports.loginKeyboardType = loginKeyboardType;

function keyboardAppearance() {
	return processProperties({ 'prop': 'keyboardAppearance - iOS Only', 'component': 'Ti.UI.AlertDialog, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'keyboard': '{ keyboardAppearance: {value} }'
	}, {
		'appearance': {
			'ios': {
				'default': 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
				'dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
				'light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT'
			}
		}
	});
}
exports.keyboardAppearance = keyboardAppearance;

function keyboardDismissMode() {
	return processProperties({ 'prop': 'keyboardDismissMode - iOS Only', 'component': 'Ti.UI.AlertDialog, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'keyboard': '{ keyboardDismissMode: {value} }'
	}, {
		'dismiss': {
			'ios': {
				'interactive': 'Ti.UI.iOS.KEYBOARD_DISMISS_MODE_INTERACTIVE',
				'none': 'Ti.UI.iOS.KEYBOARD_DISMISS_MODE_NONE',
				'on-drag': 'Ti.UI.iOS.KEYBOARD_DISMISS_MODE_ON_DRAG',
			}
		}
	});
}
exports.keyboardDismissMode = keyboardDismissMode;

function keyboardType() {
	return processProperties({ 'prop': 'keyboardType', 'component': 'Ti.UI.AlertDialog, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'keyboard': '{ keyboardType: {value} }'
	}, {
		'type': {
			'default': {
				'default': 'Ti.UI.KEYBOARD_TYPE_DEFAULT',
				'ascii': 'Ti.UI.KEYBOARD_TYPE_ASCII',
				'decimal-pad': 'Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD',
				'email': 'Ti.UI.KEYBOARD_TYPE_EMAIL',
				'namephone-pad': 'Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD',
				'number-pad': 'Ti.UI.KEYBOARD_TYPE_NUMBER_PAD',
				'numbers-punctuation': 'Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION',
				'phone-pad': 'Ti.UI.KEYBOARD_TYPE_PHONE_PAD',
				'url': 'Ti.UI.KEYBOARD_TYPE_URL'
			},
			'ios': {
				'appearance': 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
				'appearance-dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
				'appearance-light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT',
				'twitter': 'Ti.UI.KEYBOARD_TYPE_TWITTER',
				'websearch': 'Ti.UI.KEYBOARD_TYPE_WEBSEARCH'
			}
		}
	});
}
exports.keyboardType = keyboardType;

function passwordKeyboardType() {
	return processProperties({ 'prop': 'passwordKeyboardType', 'component': 'Ti.UI.AlertDialog' }, {
		'password': '{ passwordKeyboardType: {value} }'
	}, {
		'keyboard': {
			'default': {
				'default': 'Ti.UI.KEYBOARD_TYPE_DEFAULT',
				'ascii': 'Ti.UI.KEYBOARD_TYPE_ASCII',
				'decimal-pad': 'Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD',
				'email': 'Ti.UI.KEYBOARD_TYPE_EMAIL',
				'namephone-pad': 'Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD',
				'number-pad': 'Ti.UI.KEYBOARD_TYPE_NUMBER_PAD',
				'numbers-punctuation': 'Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION',
				'phone-pad': 'Ti.UI.KEYBOARD_TYPE_PHONE_PAD',
				'url': 'Ti.UI.KEYBOARD_TYPE_URL'
			},
			'ios': {
				'appearance': 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
				'appearance-dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
				'appearance-light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT',
				'twitter': 'Ti.UI.KEYBOARD_TYPE_TWITTER',
				'websearch': 'Ti.UI.KEYBOARD_TYPE_WEBSEARCH'
			}
		}
	});
}
exports.passwordKeyboardType = passwordKeyboardType;

function draggingConstraints() {
	return processProperties({
		'prop': 'A custom property to use it with the Animation module',
		'component': 'Ti.UI.Animation',
	}, {
		'default': '{ constraint: {value} }'
	}, {
		'horizontal-constraint': 'horizontal',
		'vertical-constraint': 'vertical',
	});
}
exports.draggingConstraints = draggingConstraints;

function navBarHidden() {
	return processProperties({ 'prop': 'navBarHidden', 'component': 'Ti.UI.Window' }, {
		'default': '{ navBarHidden: {value} }'
	}, {
		'nav-bar-hidden': true,
		'nav-bar-visible': false,
	});
}
exports.navBarHidden = navBarHidden;

function autocorrect() {
	return processProperties({ 'prop': 'autocorrect', 'component': 'Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'default': '{ autocorrect: {value} }'
	}, {
		'autocorrect': true,
		'no-autocorrect': false,
	});
}
exports.autocorrect = autocorrect;

function editable() {
	return processProperties({ 'prop': 'editable', 'component': 'Ti.UI.DashboardView, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'default': '{ editable: {value} }'
	}, {
		'editable': true,
		'none-editable': false,
	});
}
exports.editable = editable;

function ellipsize() {
	let convertedStyles = processProperties({ 'prop': 'ellipsize', 'component': 'Ti.UI.Label' }, {
		'ellipsize': '{ ellipsize: {value} }'
	}, {
		'end': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_END',
		'clip': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_CLIP',
		'none': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_NONE',
		'start': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_START',
		'middle': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MIDDLE',
		'marquee': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE',
		'char-wrap': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_CHAR_WRAP',
		'word-wrap': 'Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_WORD_WRAP'
	});

	// for Labels
	convertedStyles += processProperties({ 'prop': 'ellipsize', 'component': 'Ti.UI.TextArea, Ti.UI.TextField' });

	convertedStyles += `'.ellipsize': { ellipsize: true }\n`;
	convertedStyles += `'.no-ellipsize': { ellipsize: false }\n`;

	return convertedStyles;
}
exports.ellipsize = ellipsize;

function enableCopy() {
	return processProperties({ 'prop': 'enableCopy', 'component': 'Ti.UI.TextArea, Ti.UI.TextField' }, {
		'default': '{ enableCopy: {value} }'
	}, {
		'enable-copy': true,
		'disable-copy': false,
	});
}
exports.enableCopy = enableCopy;

function enableReturnKey() {
	return processProperties({ 'prop': 'enableReturnKey - iOS Only', 'component': 'Ti.UI.TextArea, Ti.UI.TextField' }, {
		'default': '{ enableReturnKey: {value} }'
	}, {
		'enable': {
			'ios': {
				'return-key': true,
			}
		},
		'disable': {
			'ios': {
				'return-key': false,
			}
		}
	});
}
exports.enableReturnKey = enableReturnKey;

function extendBackground() {
	return processProperties({ 'prop': 'extendBackground', 'component': 'Ti.UI.Toolbar' }, {
		'default': '{ extendBackground: {value} }'
	}, {
		'extend-background': true,
		'dont-extend-background': false,
	});
}
exports.extendBackground = extendBackground;

function autoLink() {
	return processProperties({ 'prop': 'autoLink', 'component': 'Ti.UI.Label, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'auto': '{ autoLink: {value} }'
	}, {
		'link': {
			default: {
				'all': 'Ti.UI.AUTOLINK_ALL',
				'email-addresses': 'Ti.UI.AUTOLINK_EMAIL_ADDRESSES',
				'map-addresses': 'Ti.UI.AUTOLINK_MAP_ADDRESSES',
				'none': 'Ti.UI.AUTOLINK_NONE',
				'phone-numbers': 'Ti.UI.AUTOLINK_PHONE_NUMBERS',
				'urls': 'Ti.UI.AUTOLINK_URLS',
			},
			ios: {
				'calendar': 'Ti.UI.AUTOLINK_CALENDAR',
			},
		}
	});
}
exports.autoLink = autoLink;

function borderStyle() {
	return processProperties({ 'prop': 'borderStyle', 'component': 'Ti.UI.Picker[android], Ti.UI.TextArea, Ti.UI.TextField' }, {
		'border-style': '{ borderStyle: {value} }'
	}, {
		'bezel': 'Ti.UI.INPUT_BORDERSTYLE_BEZEL',
		'filled': 'Ti.UI.INPUT_BORDERSTYLE_FILLED',
		'line': 'Ti.UI.INPUT_BORDERSTYLE_LINE',
		'none': 'Ti.UI.INPUT_BORDERSTYLE_NONE',
		'rounded': 'Ti.UI.INPUT_BORDERSTYLE_ROUNDED',
		'underlined': 'Ti.UI.INPUT_BORDERSTYLE_UNDERLINED',
	});
}
exports.borderStyle = borderStyle;

function pickerType() {
	return processProperties({ 'prop': 'type (Picker Type)', 'component': 'Ti.UI.Picker' }, {
		'picker-type': '{ type: {value} }'
	}, {
		'count-down-timer': 'Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER',
		'date': 'Ti.UI.PICKER_TYPE_DATE',
		'date-and-time': 'Ti.UI.PICKER_TYPE_DATE_AND_TIME',
		'plain': 'Ti.UI.PICKER_TYPE_PLAIN',
		'time': 'Ti.UI.PICKER_TYPE_TIME',
	});
}
exports.pickerType = pickerType;

function lazyLoadingEnabled() {
	return processProperties({ 'prop': 'lazyLoadingEnabled - iOS Only', 'component': 'Ti.UI.ListView' }, {
		'lazy': '{ lazyLoadingEnabled: {value} }'
	}, {
		'loading': {
			'ios': {
				'enabled': true,
				'disabled': false,
			}
		}
	});
}
exports.lazyLoadingEnabled = lazyLoadingEnabled;

function allowUserCustomization() {
	return processProperties({ 'prop': 'allowUserCustomization - iOS Only', 'component': 'Ti.UI.TabGroup' }, {
		'default': '{ allowUserCustomization: {value} }'
	}, {
		'allow-user-customization': {
			'ios': {
				'default': true,
			}
		},
		'dont-allow-user-customization': {
			'ios': {
				'default': false,
			}
		}
	});
}
exports.allowUserCustomization = allowUserCustomization;

function showAsAction() {
	return processProperties({ 'prop': 'showAsAction - Android Only', 'component': 'Ti.Android.MenuItem' }, {
		'show-as': '{ showAsAction: {value} }'
	}, {
		'action': {
			'android': {
				'always': 'Ti.Android.SHOW_AS_ACTION_ALWAYS',
				'collapse': 'Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW',
				'if-room': 'Ti.Android.SHOW_AS_ACTION_IF_ROOM',
				'never': 'Ti.Android.SHOW_AS_ACTION_NEVER',
				'with-text': 'Ti.Android.SHOW_AS_ACTION_WITH_TEXT',
			}
		}
	});
}
exports.showAsAction = showAsAction;

function autofillType() {
	return processProperties({ 'prop': 'autofillType', 'component': 'Ti.UI.TextArea, Ti.UI.TextField' }, {
		'autofill-type': '{ autofillType: {value} }'
	}, {
		'url': 'Ti.UI.AUTOFILL_TYPE_URL',
		'name': 'Ti.UI.AUTOFILL_TYPE_NAME',
		'phone': 'Ti.UI.AUTOFILL_TYPE_PHONE',
		'email': 'Ti.UI.AUTOFILL_TYPE_EMAIL',
		'address': 'Ti.UI.AUTOFILL_TYPE_ADDRESS',
		'username': 'Ti.UI.AUTOFILL_TYPE_USERNAME',
		'password': 'Ti.UI.AUTOFILL_TYPE_PASSWORD',
		'nickname': 'Ti.UI.AUTOFILL_TYPE_NICKNAME',
		'location': 'Ti.UI.AUTOFILL_TYPE_LOCATION',
		'job-title': 'Ti.UI.AUTOFILL_TYPE_JOB_TITLE',
		'given-name': 'Ti.UI.AUTOFILL_TYPE_GIVEN_NAME',
		'name-prefix': 'Ti.UI.AUTOFILL_TYPE_NAME_PREFIX',
		'middle-name': 'Ti.UI.AUTOFILL_TYPE_MIDDLE_NAME',
		'family-name': 'Ti.UI.AUTOFILL_TYPE_FAMILY_NAME',
		'name-suffix': 'Ti.UI.AUTOFILL_TYPE_NAME_SUFFIX',
		'sublocality': 'Ti.UI.AUTOFILL_TYPE_SUBLOCALITY',
		'postal-code': 'Ti.UI.AUTOFILL_TYPE_POSTAL_CODE',
		'card-number': 'Ti.UI.AUTOFILL_TYPE_CARD_NUMBER',
		'address-city': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_CITY',
		'country-name': 'Ti.UI.AUTOFILL_TYPE_COUNTRY_NAME',
		'new-password': 'Ti.UI.AUTOFILL_TYPE_NEW_PASSWORD',
		'address-line1': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_LINE1',
		'address-line2': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_LINE2',
		'address-state': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_STATE',
		'one-time-code': 'Ti.UI.AUTOFILL_TYPE_ONE_TIME_CODE',
		'organization-name': 'Ti.UI.AUTOFILL_TYPE_ORGANIZATION_NAME',
		'address-city-state': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_CITY_STATE',
		'card-security-code': 'Ti.UI.AUTOFILL_TYPE_CARD_SECURITY_CODE',
		'card-expiration-day': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_DAY',
		'card-expiration-date': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_DATE',
		'card-expiration-year': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_YEAR',
		'card-expiration-month': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_MONTH',
	});
}
exports.autofillType = autofillType;

function returnKeyType() {
	return processProperties({ 'prop': 'returnKeyType', 'component': 'Ti.UI.AlertDialog, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'default': '{ returnKeyType: {value} }'
	}, {
		'returnkey': {
			default: {
				'default': 'Ti.UI.RETURNKEY_DEFAULT',
				'go': 'Ti.UI.RETURNKEY_GO',
				'done': 'Ti.UI.RETURNKEY_DONE',
				'join': 'Ti.UI.RETURNKEY_JOIN',
				'next': 'Ti.UI.RETURNKEY_NEXT',
				'send': 'Ti.UI.RETURNKEY_SEND',
				'route': 'Ti.UI.RETURNKEY_ROUTE',
				'yahoo': 'Ti.UI.RETURNKEY_YAHOO',
				'google': 'Ti.UI.RETURNKEY_GOOGLE',
				'search': 'Ti.UI.RETURNKEY_SEARCH',
				'emergency-call': 'Ti.UI.RETURNKEY_EMERGENCY_CALL'
			},
			ios: {
				'continue': 'Ti.UI.RETURNKEY_CONTINUE',
			}
		}
	});
}
exports.returnKeyType = returnKeyType;

function loginReturnKeyType() {
	return processProperties({ 'prop': 'loginReturnKeyType', 'component': 'Ti.UI.AlertDialog' }, {
		'login': '{ loginReturnKeyType: {value} }'
	}, {
		'returnkey': {
			default: {
				'default': 'Ti.UI.RETURNKEY_DEFAULT',
				'go': 'Ti.UI.RETURNKEY_GO',
				'done': 'Ti.UI.RETURNKEY_DONE',
				'join': 'Ti.UI.RETURNKEY_JOIN',
				'next': 'Ti.UI.RETURNKEY_NEXT',
				'send': 'Ti.UI.RETURNKEY_SEND',
				'route': 'Ti.UI.RETURNKEY_ROUTE',
				'yahoo': 'Ti.UI.RETURNKEY_YAHOO',
				'google': 'Ti.UI.RETURNKEY_GOOGLE',
				'search': 'Ti.UI.RETURNKEY_SEARCH',
				'emergency-call': 'Ti.UI.RETURNKEY_EMERGENCY_CALL'
			},
			ios: {
				'continue': 'Ti.UI.RETURNKEY_CONTINUE',
			}
		}
	});
}
exports.loginReturnKeyType = loginReturnKeyType;

// loginReturnKeyType ( Android and iOS )

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

	let convertedStyles = processProperties({ 'prop': 'width - For Grid Template Columns', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View, Ti.UI.Window' }, {
		'grid-cols': '{ width: {value} }'
	}, modifiersAndValues);

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

	convertedStyles += processProperties({ 'prop': 'height - For Grid Template Rows', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View, Ti.UI.Window' }, {
		'grid-rows': '{ height: {value} }'
	}, modifiersAndValues);

	return convertedStyles;
}
exports.gridSystem = gridSystem;

function gridColumnsStartEnd() {
	let modifiersAndValues = {
		1: '8.333334%',
		2: '16.666667%',
		3: '25%',
		4: '33.333334%',
		5: '41.666667%',
		6: '50%',
		7: '58.333334%',
		8: '66.666667%',
		9: '75%',
		10: '83.333334%',
		11: '91.666667%',
		12: '100%'
	};

	let convertedStyles = processProperties({ 'prop': 'width - For Grid Column Start/End', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View, Ti.UI.Window' }, {
		'col-span': '{ width: {value} }'
	}, modifiersAndValues);

	modifiersAndValues = {
		1: '8.333334%',
		2: '16.666667%',
		3: '25%',
		4: '33.333334%',
		5: '41.666667%',
		6: '50%',
		7: '58.333334%',
		8: '66.666667%',
		9: '75%',
		10: '83.333334%',
		11: '91.666667%',
		12: '100%'
	};

	convertedStyles += processProperties({ 'prop': 'height - For Grid Row Start/End', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.View, Ti.UI.Window' }, {
		'row-span': '{ height: {value} }'
	}, modifiersAndValues);

	return convertedStyles;
}
exports.gridColumnsStartEnd = gridColumnsStartEnd;

function displayUtilities() {
	return processProperties({ 'prop': 'visible', 'component': 'Ti.Android.MenuItem, Ti.UI.Animation, Ti.UI.Picker, Ti.UI.ScrollableView, Ti.UI.ShortcutItem, Ti.UI.View' }, {
		'default': '{ visible: {value} }'
	}, {
		'block': true,
		'hidden': false,
	});
}
exports.displayUtilities = displayUtilities;

function useSpinner() {
	return processProperties({ 'prop': 'useSpinner', 'component': 'Ti.UI.Picker' }, {
		'default': '{ useSpinner: {value} }'
	}, {
		'use-spinner': true,
		'dont-use-spinner': false,
	});
}
exports.useSpinner = useSpinner;

function calendarViewShown() {
	return processProperties({ 'prop': 'calendarViewShown', 'component': 'Ti.UI.Picker' }, {
		'default': '{ calendarViewShown: {value} }'
	}, {
		'show-calendar-view': true,
		'hide-calendar-view': false,
	});
}
exports.calendarViewShown = calendarViewShown;

function flip() {
	return processProperties({ 'prop': 'flip', 'component': 'For the Animation Component' }, {
		'flip': '{ flip: {value} }'
	}, {
		'horizontal': 'horizontal',
		'vertical': 'vertical',
	});
}
exports.flip = flip;

function shiftMode() {
	return processProperties({ 'prop': 'shiftMode - Android Only', 'component': 'Ti.UI.TabGroup' }, {
		'default': '{ shiftMode: {value} }'
	}, {
		'shift-mode': {
			'android': {
				'default': true,
				'disabled': false
			}
		}
	});
}
exports.shiftMode = shiftMode;

function smoothScrollOnTabClick() {
	return processProperties({ 'prop': 'smoothScrollOnTabClick', 'component': 'Ti.UI.TabGroup' }, {
		'default': '{ smoothScrollOnTabClick: {value} }'
	}, {
		'smooth-scroll': {
			'android': {
				'default': true,
				'disabled': false
			}
		}
	});
}
exports.smoothScrollOnTabClick = smoothScrollOnTabClick;

function tabGroupStyle() {
	return processProperties({ 'prop': 'style - Android Only', 'component': 'Ti.UI.TabGroup' }, {
		'default': '{ style: {value} }'
	}, {
		'tabs-style': {
			'android': {
				'default': 'Ti.UI.Android.TABS_STYLE_DEFAULT',
				'bottom-navigation': 'Ti.UI.Android.TABS_STYLE_BOTTOM_NAVIGATION'
			}
		}
	});
}
exports.tabGroupStyle = tabGroupStyle;

function tabbedBarStyle() {
	return processProperties({ 'prop': 'style - iOS Only', 'component': 'Ti.UI.iOS.TabbedBar' }, {
		'default': '{ style: {value} }'
	}, {
		'tabbed-bar-style': {
			'ios': {
				'bordered': 'Ti.UI.iOS.SystemButtonStyle.BORDERED',
				'done': 'Ti.UI.iOS.SystemButtonStyle.DONE',
				'plain': 'Ti.UI.iOS.SystemButtonStyle.PLAIN',
			}
		}
	});
}
exports.tabbedBarStyle = tabbedBarStyle;

function windowPixelFormat() {
	return processProperties({ 'prop': 'windowPixelFormat - Android Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ windowPixelFormat: {value} }'
	}, {
		'pixel-format': {
			'android': {
				'a-8': 'Ti.UI.Android.PIXEL_FORMAT_A_8',
				'la-88': 'Ti.UI.Android.PIXEL_FORMAT_LA_88',
				'l-8': 'Ti.UI.Android.PIXEL_FORMAT_L_8',
				'opaque': 'Ti.UI.Android.PIXEL_FORMAT_OPAQUE',
				'rgba-4444': 'Ti.UI.Android.PIXEL_FORMAT_RGBA_4444',
				'rgba-5551': 'Ti.UI.Android.PIXEL_FORMAT_RGBA_5551',
				'rgba-8888': 'Ti.UI.Android.PIXEL_FORMAT_RGBA_8888',
				'rgbx-8888': 'Ti.UI.Android.PIXEL_FORMAT_RGBX_8888',
				'rgb-332': 'Ti.UI.Android.PIXEL_FORMAT_RGB_332',
				'rgb-565': 'Ti.UI.Android.PIXEL_FORMAT_RGB_565',
				'rgb-888': 'Ti.UI.Android.PIXEL_FORMAT_RGB_888',
				'translucent': 'Ti.UI.Android.PIXEL_FORMAT_TRANSLUCENT',
				'transparent': 'Ti.UI.Android.PIXEL_FORMAT_TRANSPARENT',
				'unknown': 'Ti.UI.Android.PIXEL_FORMAT_UNKNOWN',
			}
		}
	});
}
exports.windowPixelFormat = windowPixelFormat;

function tabBarHidden() {
	return processProperties({ 'prop': 'tabBarHidden - iOS Only', 'component': 'Ti.UI.Window' }, {
		'default': '{ tabBarHidden: {value} }'
	}, {
		'tab-bar-hidden': {
			'ios': {
				'default': true,
			}
		},
		'tab-bar-visible': {
			'ios': {
				'default': false,
			}
		}
	});
}
exports.tabBarHidden = tabBarHidden;

function windowSoftInputMode() {
	return processProperties({ 'prop': 'windowSoftInputMode - Android Only', 'component': 'Ti.UI.TabGroup, Ti.UI.Window' }, {
		'window': '{ windowSoftInputMode: {value} }'
	}, {
		'soft-input': {
			'android': {
				'always-hidden': 'Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN',
				'always-visible': 'Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_VISIBLE',
				'hidden': 'Ti.UI.Android.SOFT_INPUT_STATE_HIDDEN',
				'pan': 'Ti.UI.Android.SOFT_INPUT_ADJUST_PAN',
				'resize': 'Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE',
				'unspecified': 'Ti.UI.Android.SOFT_INPUT_ADJUST_UNSPECIFIED',
				'unspecified': 'Ti.UI.Android.SOFT_INPUT_STATE_UNSPECIFIED',
				'visible': 'Ti.UI.Android.SOFT_INPUT_STATE_VISIBLE',
			}
		}
	});
}
exports.windowSoftInputMode = windowSoftInputMode;

// Activities Android
function activityEnterTransition() {
	return processProperties({ 'prop': 'activityEnterTransition - Android Only', 'component': 'Ti.UI.Window' }, {
		'activity': '{ activityEnterTransition: {value} }'
	}, {
		'enter-transition': {
			'android': {
				'explode': 'Ti.UI.Android.TRANSITION_EXPLODE',
				'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
				'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
				'none': 'Ti.UI.Android.TRANSITION_NONE',
				'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
				'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
				'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
				'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP',
			}
		}
	});
}
exports.activityEnterTransition = activityEnterTransition;

function activityExitTransition() {
	return processProperties({ 'prop': 'activityExitTransition - Android Only', 'component': 'Ti.UI.Window' }, {
		'activity': '{ activityExitTransition: {value} }'
	}, {
		'exit-transition': {
			'android': {
				'explode': 'Ti.UI.Android.TRANSITION_EXPLODE',
				'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
				'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
				'none': 'Ti.UI.Android.TRANSITION_NONE',
				'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
				'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
				'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
				'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP',
			}
		}
	});
}
exports.activityExitTransition = activityExitTransition;

function activityReenterTransition() {
	return processProperties({ 'prop': 'activityReenterTransition - Android Only', 'component': 'Ti.UI.Window' }, {
		'activity': '{ activityReenterTransition: {value} }'
	}, {
		'reenter-transition': {
			'android': {
				'explode': 'Ti.UI.Android.TRANSITION_EXPLODE',
				'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
				'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
				'none': 'Ti.UI.Android.TRANSITION_NONE',
				'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
				'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
				'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
				'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP',
			}
		}
	});
}
exports.activityReenterTransition = activityReenterTransition;

function activityReturnTransition() {
	return processProperties({ 'prop': 'activityReturnTransition - Android Only', 'component': 'Ti.UI.Window' }, {
		'activity': '{ activityReturnTransition: {value} }'
	}, {
		'return-transition': {
			'android': {
				'explode': 'Ti.UI.Android.TRANSITION_EXPLODE',
				'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
				'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
				'none': 'Ti.UI.Android.TRANSITION_NONE',
				'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
				'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
				'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
				'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP',
			}
		}
	});
}
exports.activityReturnTransition = activityReturnTransition;

function activitySharedElementEnterTransition() {
	return processProperties({ 'prop': 'activitySharedElementEnterTransition - Android Only', 'component': 'Ti.UI.Window' }, {
		'activity': '{ activitySharedElementEnterTransition: {value} }'
	}, {
		'shared-element-enter-transition': {
			'android': {
				'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
				'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
				'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
				'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
				'none': 'Ti.UI.Android.TRANSITION_NONE',
			}
		}
	});
}
exports.activitySharedElementEnterTransition = activitySharedElementEnterTransition;

function activitySharedElementExitTransition() {
	return processProperties({ 'prop': 'activitySharedElementExitTransition - Android Only', 'component': 'Ti.UI.Window' }, {
		'activity': '{ activitySharedElementExitTransition: {value} }'
	}, {
		'shared-element-exit-transition': {
			'android': {
				'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
				'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
				'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
				'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
				'none': 'Ti.UI.Android.TRANSITION_NONE',
			}
		}
	});
}
exports.activitySharedElementExitTransition = activitySharedElementExitTransition;

function activitySharedElementReenterTransition() {
	return processProperties({ 'prop': 'activitySharedElementReenterTransition - Android Only', 'component': 'Ti.UI.Window' }, {
		'activity': '{ activitySharedElementReenterTransition: {value} }'
	}, {
		'shared-element-reenter-transition': {
			'android': {
				'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
				'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
				'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
				'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
				'none': 'Ti.UI.Android.TRANSITION_NONE',
			}
		}
	});
}
exports.activitySharedElementReenterTransition = activitySharedElementReenterTransition;

function activitySharedElementReturnTransition() {
	return processProperties({ 'prop': 'activitySharedElementReturnTransition - Android Only', 'component': 'Ti.UI.Window' }, {
		'activity': '{ activitySharedElementReturnTransition: {value} }'
	}, {
		'shared-element-return-transition': {
			'android': {
				'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
				'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
				'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
				'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
				'none': 'Ti.UI.Android.TRANSITION_NONE',
			}
		}
	});
}
exports.activitySharedElementReturnTransition = activitySharedElementReturnTransition;

function iconIsMask() {
	return processProperties({ 'prop': 'iconIsMask - iOS Only', 'component': 'Ti.UI.Tab' }, {
		'default': '{ iconIsMask: {value} }'
	}, {
		'icon-is': {
			'ios': {
				'mask': true,
				'not-mask': false
			}
		}
	});
}
exports.iconIsMask = iconIsMask;

function activeIconIsMask() {
	return processProperties({ 'prop': 'activeIconIsMask - iOS Only', 'component': 'Ti.UI.Tab' }, {
		'default': '{ activeIconIsMask: {value} }'
	}, {
		'active-icon-is': {
			'ios': {
				'mask': true,
				'not-mask': false
			}
		}
	});
}
exports.activeIconIsMask = activeIconIsMask;

function keepSectionsInSearch() {
	let convertedStyles = processComments({ 'prop': 'keepSectionsInSearch - iOS Only', 'component': 'Ti.UI.ListView' });
	convertedStyles += `'.keep-sections-in-search[platform=ios]': { keepSectionsInSearch: true }\n`;
	convertedStyles += `'.dont-keep-sections-in-search[platform=ios]': { keepSectionsInSearch: false }\n`;

	return convertedStyles;
}
exports.keepSectionsInSearch = keepSectionsInSearch;

function bottomNavigation({ ...modifiersAndValues }) {
	const objectPosition = {
		'padding': '{ padding: {value} }',
		'padding-x': '{ paddingLeft: {value}, paddingRight: {value} }',
		'padding-y': '{ paddingTop: {value}, paddingBottom: {value} }',
		'padding-t': '{ paddingTop: {value} }',
		'padding-l': '{ paddingLeft: {value} }',
		'padding-r': '{ paddingRight: {value} }',
		'padding-b': '{ paddingBottom: {value} }',
	}

	modifiersAndValues = removeFractions(modifiersAndValues);
	delete modifiersAndValues.fit;
	delete modifiersAndValues.min;
	delete modifiersAndValues.max;
	delete modifiersAndValues.full;
	delete modifiersAndValues.auto;
	delete modifiersAndValues.screen;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues['max-content'];

	return processProperties({ 'prop': 'padding, paddingTop, paddingLeft, paddingRight, paddingBottom', 'component': 'Ti.UI.Android.CardView, Ti.UI.TabGroup' }, objectPosition, modifiersAndValues);
}
exports.bottomNavigation = bottomNavigation;

function interactivity() {
	return processProperties({ 'prop': 'touchEnabled', 'component': 'Ti.UI.View' }, {
		'default': '{ touchEnabled: {value} }'
	}, {
		'touch-enabled': true,
		'touch-disabled': false,
		'pointer-events-auto': true,
		'pointer-events-none': false,
	});
}
exports.interactivity = interactivity;

function textAlign() {
	return processProperties({ 'prop': 'textAlign', 'component': 'Ti.UI.Button, Ti.UI.Label, Ti.UI.Switch, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'text': '{ textAlign: {value} }'
	}, {
		'left': 'Ti.UI.TEXT_ALIGNMENT_LEFT',
		'right': 'Ti.UI.TEXT_ALIGNMENT_RIGHT',
		'center': 'Ti.UI.TEXT_ALIGNMENT_CENTER',
		'justify': 'Ti.UI.TEXT_ALIGNMENT_JUSTIFY',
	});
}
exports.textAlign = textAlign;

function verticalAlignment() {
	return processProperties({ 'prop': 'verticalAlign', 'component': 'Ti.UI.Button, Ti.UI.Label, Ti.UI.Switch, Ti.UI.TextArea, Ti.UI.TextField' }, {
		'align': '{ verticalAlign: {value} }'
	}, {
		'top': 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP',
		'middle': 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER',
		'bottom': 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM',
	});
}
exports.verticalAlignment = verticalAlignment;

function scrollableRegion() {
	let convertedStyles = processComments({ 'prop': 'contentWidth, contentHeight', 'component': 'Ti.UI.ScrollView' });

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
	let convertedStyles = processComments({ 'prop': 'showHorizontalScrollIndicator, showVerticalScrollIndicator', 'component': 'Ti.UI.ScrollView' });

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

	let convertedStyles = processComments({ 'prop': 'top, right, bottom, left', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window' });

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
	// '\n// anchorPoint Properties\n'
	let convertedStyles = processComments({ 'prop': 'anchorPoint', 'component': 'Ti.UI.Animation, Ti.UI.View' });

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
	delete modifiersAndValues.fit;
	delete modifiersAndValues.min;
	delete modifiersAndValues.max;
	delete modifiersAndValues.screen;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues['max-content'];

	// modifiersAndValues.none = 'undefined';

	modifiersAndValues.auto = 'null';

	let convertedStyles = processProperties({ 'prop': 'top, right, bottom, left ( Margin )', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window' }, objectPosition, modifiersAndValues);

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

	convertedStyles += processProperties({ 'prop': 'top, right, bottom, left ( Negative Margin )', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.View, Ti.UI.Window' }, objectPosition, modifiersAndValues, '-');

	return convertedStyles;
}
exports.margin = margin;

function repeat() {
	return processProperties({ 'prop': 'repeat', 'component': 'Ti.UI.Animation' }, {
		'repeat': '{ repeat: {value} }'
	}, {
		1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10
	});
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

	// modifiersAndValues['0'] = 0;
	delete modifiersAndValues.fit;
	delete modifiersAndValues.min;
	delete modifiersAndValues.max;
	delete modifiersAndValues.auto;
	delete modifiersAndValues.screen;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues['max-content'];

	return processProperties({ 'prop': 'padding', 'component': 'Ti.UI.Android.CardView, Ti.UI.TextArea, Ti.UI.TextField' }, objectPosition, modifiersAndValues);
}
exports.padding = padding;

function width({ ...modifiersAndValues }) {
	delete modifiersAndValues.fit;
	delete modifiersAndValues['fit-content'];
	delete modifiersAndValues.min;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues.max;
	delete modifiersAndValues['max-content'];

	return processProperties({ 'prop': 'width', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.ListItem, Ti.UI.View' }, {
		'w':
			'{ width: {value} }'
	}, modifiersAndValues);
}
exports.width = width;

function height({ ...modifiersAndValues }) {
	delete modifiersAndValues.fit;
	delete modifiersAndValues['fit-content'];
	delete modifiersAndValues.min;
	delete modifiersAndValues['min-content'];
	delete modifiersAndValues.max;
	delete modifiersAndValues['max-content'];

	return processProperties({ 'prop': 'height', 'component': 'Ti.UI.ActivityIndicator, Ti.UI.Animation, Ti.UI.iPad.Popover, Ti.UI.ListItem, Ti.UI.View' }, {
		'h': '{ height: {value} }'
	}, modifiersAndValues);
}
exports.height = height;

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

//! The son of Mother Goose
function applyProperties(twStyles) {
	let twStylesArray = twStyles.split(/\r?\n/);

	_.each(_applyClasses, (value, modifier) => {
		let indexOfModifier = findIndexOf(`'${modifier}':`, twStylesArray);

		if (indexOfModifier !== -1) {
			let compoundClasses = [];
			let classesWithOpacityValues = [];
			_.each([...value], searchClass => {
				// let cleanClass = searchClass.replace('open:', '').replace('close:', '');
				//! Needs to handle open, close and complete states...
				if (searchClass.includes('(')) {
					let theClass = formatArbitraryValues(searchClass);
					if (theClass) {
						compoundClasses.push(formatArbitraryValues(searchClass));
					}
					//! Process transparency values
				} else if (checkColorClasses(searchClass)) {
					// Set opacity to color properties
					let decimalValue = searchClass.split('/')[1];
					let transparency = Math.round(decimalValue * 255 / 100).toString(16);
					if (transparency.length === 1) transparency = '0' + transparency;
					let originalClass = searchClass;
					let classNameWithTransparency = searchClass.substring(0, searchClass.lastIndexOf('/'));
					classesWithOpacityValues.push({ decimalValue, transparency, originalClass, classNameWithTransparency });
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

			// Handle opacity values
			if (classesWithOpacityValues.length > 0) {
				classesWithOpacityValues.forEach(opacityValue => {
					let opacityIndex = _.findIndex(twStylesArray, line => line.startsWith(`'.${opacityValue.classNameWithTransparency}`));
					if (opacityIndex > -1) {
						let defaultHexValue;
						if (twStylesArray[opacityIndex].includes('from')) {
							defaultHexValue = twStylesArray[opacityIndex].match(/\#[0-9a-f]{6}/g)[1];
						} else {
							defaultHexValue = twStylesArray[opacityIndex].match(/\#[0-9a-f]{6}/i)[0];
						}

						let classWithoutDecimalOpacity = `${twStylesArray[opacityIndex].replace(defaultHexValue, `#${opacityValue.transparency}${defaultHexValue.substring(1)}`)}`;
						let defaultTextValue = twStylesArray[opacityIndex].match(/'[^']*'/i)[0];
						compoundClasses.push(classWithoutDecimalOpacity
							.replace(`${defaultTextValue}: `, '')
							.replace(/{(.*)}/, '$1')
							.trim());
					}
				});
			}

			twStylesArray[indexOfModifier] = _.replace(twStylesArray[indexOfModifier], new RegExp("{_applyProperties_}"), fixDuplicateKeys(compoundClasses).join(', '));
		}
	});

	return twStylesArray.join('\n');
}
exports.applyProperties = applyProperties;

function processProperties(info, selectorAndDeclarationBlock, selectorsAndValues, minusSigns = '') {
	let convertedStyles = '';

	if (typeof info === 'object') {
		convertedStyles = processComments(info);
	} else {
		convertedStyles = `\n// ${info}\n`;
	}

	_.each(selectorAndDeclarationBlock, (declarationBlock, mainSelector) => {
		_.each(selectorsAndValues, (value, secondSelector) => {
			let selectorSign = (secondSelector.startsWith('-')) ? '-' : '';
			if (typeof value === 'object') {
				_.each(value, (_values, modifier) => {
					if (typeof _values === 'object') {
						_.each(_values, (__value, thirdSelector) => {
							if (typeof __value === 'object') {
								_.each(__value, (___value, fourthSelector) => {
									let valores = _.replace(declarationBlock, new RegExp("{value}", "g"), parseValue(___value, minusSigns));
									convertedStyles += (mainSelector === 'default') ?
										`'.${selectorSign}${setModifier(secondSelector)}${setModifier(thirdSelector)}${setModifier(fourthSelector)}${setModifier(modifier)}': ${valores} \n` :
										`'.${selectorSign}${mainSelector}-${secondSelector}${setModifier(thirdSelector)}${setModifier(fourthSelector)}${setModifier(modifier)}': ${valores} \n`;
								});
							} else {
								let valores = _.replace(declarationBlock, new RegExp("{value}", "g"), parseValue(__value, minusSigns));
								convertedStyles += (mainSelector === 'default') ?
									`'.${selectorSign}${secondSelector}${setModifier(thirdSelector)}${setModifier(modifier)}': ${valores}\n` :
									`'.${selectorSign}${mainSelector}-${secondSelector}${setModifier(thirdSelector)}${setModifier(modifier)}': ${valores}\n`;
							}
						});
					} else {
						let valores = _.replace(declarationBlock, new RegExp("{value}", "g"), parseValue(_values, minusSigns));
						convertedStyles += (mainSelector === 'default') ?
							`'.${selectorSign}${setModifier(secondSelector)}${setModifier(modifier)}': ${valores}\n` :
							`'.${selectorSign}${mainSelector}${setModifier(secondSelector)}${setModifier(modifier)}': ${valores}\n`;
					}
				});
			} else {
				let valores = _.replace(declarationBlock, new RegExp("{value}", "g"), parseValue(value, minusSigns));
				convertedStyles += (mainSelector === 'default') ?
					`'.${selectorSign}${secondSelector}': ${valores}\n` :
					`'.${selectorSign}${mainSelector}${setModifier(secondSelector)}': ${valores}\n`;
			}
		});
	});

	return convertedStyles;
}
exports.processProperties = processProperties;

function processComments(info) {
	let comments = '';

	comments += (info.component) ? `\n// Component(s): ${info.component}` : '';
	comments += (info.prop) ? `\n// Property(ies): ${info.prop}\n` : '';
	comments += (info.description) ? `// Description: ${info.description}\n` : '';

	return comments;
}

function checkColorClasses(cleanClassName) {
	return (
		cleanClassName.startsWith('active-tint-') ||
		cleanClassName.startsWith('active-title-') ||
		cleanClassName.startsWith('bar-') ||
		cleanClassName.startsWith('bg-') ||
		cleanClassName.startsWith('bg-selected-') ||
		cleanClassName.startsWith('border-') ||
		cleanClassName.startsWith('current-page-') ||
		cleanClassName.startsWith('drop-shadow-') ||
		cleanClassName.startsWith('feedback-') ||
		cleanClassName.startsWith('from-') ||
		cleanClassName.startsWith('indicator-') ||
		cleanClassName.startsWith('nav-tint-') ||
		cleanClassName.startsWith('page-') ||
		cleanClassName.startsWith('paging-') ||
		cleanClassName.startsWith('placeholder-') ||
		cleanClassName.startsWith('shadow-') ||
		cleanClassName.startsWith('tabs-bg-') ||
		cleanClassName.startsWith('tabs-bg-selected-') ||
		cleanClassName.startsWith('text-') ||
		cleanClassName.startsWith('tint-') ||
		cleanClassName.startsWith('title-') ||
		cleanClassName.startsWith('to-')) &&
		cleanClassName.includes('/');
}
exports.checkColorClasses = checkColorClasses;

function findIndexOf(_substring, _array) {
	return _array.findIndex(element => element.includes(_substring));
}
exports.findIndexOf = findIndexOf;

function checkPlatformAndDevice(line, className) {
	// https://regex101.com/r/6VTh23/1
	if (className.includes('ios:')) {
		return (line.includes('platform=ios'))
			? `${line.replace(/[^'.][^']+|1/, `ios:$&`)}\n`
			: `${line.replace(/[^'.][^']+|1/, `ios:$&[platform=ios]`)}\n`;
	} else if (className.includes('android:')) {
		return (line.includes('platform=android'))
			? `${line.replace(/[^'.][^']+|1/, `android:$&`)}\n`
			: `${line.replace(/[^'.][^']+|1/, `android:$&[platform=android]`)}\n`;
	} else if (className.includes('handheld:')) {
		return (line.includes('formFactor=handheld'))
			? `${line.replace(/[^'.][^']+|1/, `handheld:$&`)}\n`
			: `${line.replace(/[^'.][^']+|1/, `handheld:$&[formFactor=handheld]`)}\n`;
	} else if (className.includes('tablet:')) {
		return (line.includes('formFactor=tablet'))
			? `${line.replace(/[^'.][^']+|1/, `tablet:$&`)}\n`
			: `${line.replace(/[^'.][^']+|1/, `tablet:$&[formFactor=tablet]`)}\n`;
	} else if (className.includes('open:')) {
		return `${line.replace(/[^'.][^']+|1/, `open:$&`).replace(/{(.*)}/, '{ animation: { open: $& } }')}\n`;
	} else if (className.includes('close:')) {
		return `${line.replace(/[^'.][^']+|1/, `close:$&`).replace(/{(.*)}/, '{ animation: { close: $& } }')}\n`;
	} else if (className.includes('complete:')) {
		return `${line.replace(/[^'.][^']+|1/, `complete:$&`).replace(/{(.*)}/, '{ animation: { complete: $& } }')}\n`;
	} else if (className.includes('bounds:') && (line.includes('top') || line.includes('right') || line.includes('bottom') || line.includes('left'))) {
		return `${line.replace(/[^'.][^']+|1/, `bounds:$&`).replace(/{(.*)}/, '{ bounds: $& }')}\n`;
	} else if (className.includes('drag:')) {
		return `${line.replace(/[^'.][^']+|1/, `drag:$&`).replace(/{(.*)}/, '{ draggable: { drag: $& } }')}\n`;
	} else if (className.includes('drop:')) {
		return `${line.replace(/[^'.][^']+|1/, `drop:$&`).replace(/{(.*)}/, '{ draggable: { drop: $& } }')}\n`;
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

function addTransparencyToHex(color, transparency = '00') {
	if (color.includes('#')) {
		if (color.includes('\'')) {
			color = color.replace(/'/g, '');
		}
		switch (color.length) {
			case 4:
				color = `#${transparency}${color[1]}${color[2]}${color[3]}`
				break;
			case 7:
				color = `#${transparency}${color[1]}${color[2]}${color[3]}${color[4]}${color[5]}${color[6]}`
				break;
			case 9:
				color = `#${transparency}${color[3]}${color[4]}${color[5]}${color[6]}${color[7]}${color[8]}`
				break;
		}
	}

	return `'${color}'`;
}
exports.addTransparencyToHex = addTransparencyToHex;

//! Private Functions
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

	if (backgroundGradientObject.length === 1) {
		cleanedStyles.push(`backgroundGradient: { ${backgroundGradientObject} }`);
	} else if (backgroundGradientObject.length === 2) {
		let toColor = backgroundGradientObject[1].replace('colors: ', '').replace(/[\[\]']+/g, '').trim().split(',');
		let fromToColors = backgroundGradientObject[0].replace('colors: ', '').replace(/[\[\]']+/g, '').trim().split(',');
		fromToColors[0] = toColor[0];
		cleanedStyles.push(`backgroundGradient: { colors: [ '${fromToColors[0]}', '${fromToColors[1].trim()}' ] }`);
	}

	return cleanedStyles;
}

const arbitraryValuesTable = {
	'active-tint': 'activeTintColor: {value}',
	'active-title': 'activeTitleColor: {value}',
	'bar-title': 'titleAttributes : { color : {value} }',
	'bar-title-shadow': 'titleAttributes: { shadow: { color: {value} } }',
	'bar': 'barColor: {value}',
	'bg-selected': 'backgroundSelectedColor: {value}',
	'bg': 'backgroundColor: {value}',
	'border-color': 'borderColor: {value}',
	'border-width': 'borderWidth: {value}',
	'bottom': 'bottom: {value}',
	'cache-size': 'cacheSize: {value}',
	'content-h': 'contentHeight: {value}',
	'content-w': 'contentWidth: {value}',
	'content': 'contentWidth: {value}, contentHeight: {value}',
	'current-page': 'currentPageIndicatorColor: {value}',
	'delay': 'delay: {value}',
	'drop-shadow': 'shadowColor: {value} }',
	'duration': 'duration: {value}',
	'feedback': 'touchFeedback: true, touchFeedbackColor: {value}',
	'font': 'font: { fontWeight: {value} }',
	'from': 'backgroundGradient: { colors: [ {value1}, {value} ] }',
	'grid-cols': 'width: Alloy.Globals.cols_{value}',
	'grid-rows': 'height: Alloy.Globals.rows_{value}',
	'h': 'height: {value}',
	'indicator': 'indicatorColor: {value}',
	'left': 'left: {value}',
	'm': 'top: {value}, right: {value}, bottom: {value}, left: {value}',
	'max-scale': 'maxZoomScale: {value}',
	'mb': 'bottom: {value}',
	'min-scale': 'minZoomScale: {value}',
	'ml': 'left: {value}',
	'mr': 'right: {value}',
	'mt': 'top: {value}',
	'mx': 'right: {value}, left: {value}',
	'my': 'top: {value}, bottom: {value}',
	'nav-tint': 'navTintColor: {value}',
	'opacity': 'opacity: {value}',
	'origin': 'anchorPoint: { x: {value}, y: {value1} }',
	'p': 'padding: { top: {value}, right: {value}, bottom: {value}, left: {value} }',
	'padding': 'paddingTop: {value}, paddingBottom: {value}, paddingLeft: {value}, paddingRight: {value}',
	'padding-b': 'paddingBottom: {value}',
	'padding-bottom': 'paddingBottom: {value}',
	'padding-l': 'paddingLeft: {value}',
	'padding-left': 'paddingLeft: {value}',
	'padding-r': 'paddingRight: {value}',
	'padding-right': 'paddingRight: {value}',
	'padding-t': 'paddingTop: {value}',
	'padding-top': 'paddingTop: {value}',
	'padding-x': 'paddingLeft: {value}, paddingRight: {value}',
	'padding-y': 'paddingTop: {value}, paddingBottom: {value}',
	'page': 'pageIndicatorColor: {value}',
	'paging-alpha': 'pagingControlAlpha: {value}',
	'paging-color': 'pagingControlColor: {value}',
	'pb': 'padding: { bottom: {value} }',
	'pl': 'padding: { left: {value} }',
	'placeholder': 'hintTextColor: {value}',
	'pr': 'padding: { right: {value} }',
	'pt': 'padding: { top: {value} }',
	'px': 'padding: { left: {value}, right: {value} }',
	'py': 'padding: { top: {value}, bottom: {value} }',
	'repeat': 'repeat: {value}',
	'right': 'right: {value}',
	'rotate': 'rotate: {value}',
	'rounded-b': 'borderRadius: [0, 0, {value}, {value}]',
	'rounded-bl': 'borderRadius: [0, 0, 0, {value}]',
	'rounded-br': 'borderRadius: [0, 0, {value}, 0]',
	'rounded-l': 'borderRadius: [{value}, 0, 0, {value}]',
	'rounded-r': 'borderRadius: [0, {value}, {value}, 0]',
	'rounded-t': 'borderRadius: [{value}, {value}, 0, 0]',
	'rounded-tl': 'borderRadius: [{value}, 0, 0, 0]',
	'rounded-tr': 'borderRadius: [0, {value}, 0, 0]',
	'rounded': 'borderRadius: {value}',
	'shadow': 'viewShadowColor: {value} }',
	'tabs-bg': 'tabsBackgroundColor: {value}',
	'tabs-bg-selected': 'tabsBackgroundSelectedColor: {value}',
	'text-color': 'color: {value}',
	'text-size': 'font: { fontSize: {value} }',
	'tint': 'tint: {value}, tintColor: {value}',
	'title': 'titleColor: {value}',
	'to': 'backgroundGradient: { colors: [ {value} ] }',
	'top': 'top: {value}',
	'w': 'width: {value}',
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
			properties = _.replace(properties, new RegExp("{value1}", "g"), addTransparencyToHex(parseValue(value)));
		}

		if (rule === 'origin') {
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
	return modifier === '' || modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT';
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

//! RecycleBin
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

function processModifiersAndProperties(header, objectPosition, modifiersAndValues, minusSigns = '') {
	let convertedStyles = `\n// ${header} Property\n`;

	_.each(objectPosition, (properties, rule) => {
		_.each(modifiersAndValues, (value, modifier) => {
			let ruleSign = (modifier.startsWith('-')) ? '-' : '';
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

function selectionIndicator() {
	return processProperties({ 'prop': 'selectionIndicator', 'component': 'Ti.UI.Picker' }, {
		'default': '{ selectionIndicator: {value} }'
	}, {
		'show-selection-indicator': true,
		'hide-selection-indicator': false,
	});
}
exports.selectionIndicator = selectionIndicator;
