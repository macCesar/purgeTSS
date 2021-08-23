function Animation(args) {
	let state = {
		open: false,
		playing: false,
		delay: args.delay,
		debug: args.debug ?? false
	};

	const animationView = Ti.UI.createView({ width: 0, height: 0, touchEnabled: false });

	if (args.anchorPoint || args.rotate || args.scale) {
		args.transform = Ti.UI.createMatrix2D({ anchorPoint, rotate, scale } = args);
	}

	delete args.id;
	delete args.scale;
	delete args.rotate;

	// TODO: A library of useful animations
	animationView.play = (views, _cb) => {
		if (state.playing) {
			logger(`$.${state.view.id}: is playing...`);
		} else {
			if (args.animation) {
				state.open = !state.open;
				args = state.open ? { ...args, ...args.animation.open } : { ...args, ...args.animation.close };
				state.open = (args.autoreverse) ? !state.open : state.open;
			}
			play(views, _cb, 'play');
		}
	};

	animationView.apply = (views, _cb) => {
		if (args.animation) {
			state.open = !state.open;
			args = state.open ? { ...args, ...args.animation.open } : { ...args, ...args.animation.close };
		}
		play(views, _cb, 'apply')
	};

	function play(views, _cb, action = 'play') {
		if (Array.isArray(views)) {
			args.delay = state.delay;
			views.forEach(view => {
				(action === 'play') ? animateView(view, _cb, action) : applyView(view, _cb, action);
				args.delay += state.delay;
			});
		} else if (action === 'play') {
			animateView(views, _cb, action);
		} else {
			applyView(views, _cb, action);
		}
	}

	//! Helper Functions
	function logger(_message, forceLog = false) {
		if (state.debug || forceLog) console.warn(`:: ti.animation :: ${_message}`);
	}

	function notFound(source) {
		console.error('$.' + source.id, ': The provided target can’t be found!');
	}

	function checkComplete(view, action) {
		if (args.animation && args.animation.complete) {
			if (action === 'play') {
				state.playing = true;
				view.animate(Ti.UI.createAnimation(args.animation.complete), () => {
					state.playing = false;
				});
			} else {
				view.applyProperties(args.animation.complete);
			}
		}
	}

	function animateView(view, _cb, action) {
		if (view) {
			state.view = view;
			state.playing = true;
			view.animate(Ti.UI.createAnimation(args), e => {
				checkComplete(view, action);

				(typeof _cb === 'function') ? _cb(e) : e => {
					logger('Animation complete on object: ' + JSON.stringify(e));
				};

				state.playing = false;
			});
		} else {
			notFound(args);
		}
	}

	function applyView(view, _cb, action) {
		if (view) {
			view.applyProperties(args);

			checkComplete(view, action);

			(typeof _cb === 'function') ? _cb() : () => {
				logger('Animation complete on objects: ' + JSON.stringify(e));
				state.playing = false;
			};
		} else {
			notFound(args);
		}
	}

	return animationView;
}
exports.Animation = Animation;

function deviceInfo() {
	console.log('------------------- DEVICE INFO -------------------');

	console.log('');
	console.log('version:', Ti.Platform.version);
	console.log('name:', Ti.Platform.name);
	console.log('username:', Ti.Platform.username);
	console.log('locale:', Ti.Platform.locale);
	console.log('osname:', Ti.Platform.osname);
	console.log('ostype:', Ti.Platform.ostype);
	console.log('model:', Ti.Platform.model);
	console.log('manufacturer:', Ti.Platform.manufacturer);
	console.log('architecture:', Ti.Platform.architecture);
	console.log('availableMemory:', Ti.Platform.availableMemory);

	console.log('');
	console.log('isTablet:', Alloy.isTablet);
	console.log('isHandheld:', Alloy.isHandheld);

	console.log('');
	console.log('Ti.Platform.displayCaps.dpi:', Ti.Platform.displayCaps.dpi);
	console.log('Ti.Platform.displayCaps.density:', Ti.Platform.displayCaps.density);
	console.log('Ti.Platform.displayCaps.platformWidth:', Ti.Platform.displayCaps.platformWidth);
	console.log('Ti.Platform.displayCaps.platformHeight:', Ti.Platform.displayCaps.platformHeight);

	if (Ti.Platform.osname === 'android') {
		console.log('');
		console.log('Ti.Platform.displayCaps.xdpi:', Ti.Platform.displayCaps.xdpi);
		console.log('Ti.Platform.displayCaps.ydpi:', Ti.Platform.displayCaps.ydpi);
	}

	if ((Ti.Platform.osname === 'iphone') || (Ti.Platform.osname === 'ipad') || (Ti.Platform.osname === 'android')) {
		console.log('');
		console.log('Ti.Platform.displayCaps.logicalDensityFactor:', Ti.Platform.displayCaps.logicalDensityFactor);
	}

	console.log('');
	console.log('----------------- END DEVICE INFO -----------------');
}
exports.deviceInfo = deviceInfo;

module.exports.createAnimation = (args) => {
	return new Animation(args);
};
