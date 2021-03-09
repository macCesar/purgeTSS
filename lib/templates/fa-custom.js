/**
* Font Awesome by @fontawesome - https://fontawesome.com
* License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
*/

function getIcon(selector) {
	if (icons[selector] !== undefined) {
		return icons[selector];
	}
	return fontawesome[selector];
}
exports.getIcon = getIcon;

function setTitle(selector, object) {
	if (icons[selector] !== undefined) {
		object.title = icons[selector];
		return;
	}
	object.title = fontawesome[selector];
}
exports.setTitle = setTitle;

function setText(selector, object) {
	if (icons[selector] !== undefined) {
		object.text = icons[selector];
		return;
	}
	object.text = fontawesome[selector];
}
exports.setText = setText;

// Custom fontawesome
