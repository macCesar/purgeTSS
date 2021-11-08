exports.getIcon = function getIcon(selector) {
	if (selector === undefined) throw new Error('Selector missing!');
	return (icons[selector] !== undefined) ? icons[selector] : fontawesome[selector];
};

exports.setTitle = function setTitle(selector, object) {
	if (selector === undefined || object === undefined) throw new Error('Selector or target Object missing!');
	object.title = (icons[selector] !== undefined) ? icons[selector] : fontawesome[selector];
};

exports.setText = function setText(selector, object) {
	if (selector === undefined || object === undefined) throw new Error('Selector or target Object missing!');
	object.text = (icons[selector] !== undefined) ? icons[selector] : fontawesome[selector];
};

exports.getRandomKey = function getRandomKey() {
	return Object.keys(icons)[Math.floor(Math.random() * Object.keys(icons).length)];
};

exports.getRandomValue = function getRandomValue() {
	return icons[Object.keys(icons)[Math.floor(Math.random() * Object.keys(icons).length)]];
};
