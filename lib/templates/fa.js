/**
* Font Awesome Free 5.14.0 by @fontawesome - https://fontawesome.com
* License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
*/

function getIcon(selector) {
	return fontawesome[selector];
}
exports.getIcon = getIcon;

function setTitle(selector, object) {
	object.title = fontawesome[selector];
}
exports.setTitle = setTitle;

function setText(selector, object) {
	object.text = fontawesome[selector];
}
exports.setText = setText;
