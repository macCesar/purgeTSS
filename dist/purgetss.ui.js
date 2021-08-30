function Animation(args) {
	let param = {
		id: args.id,
		open: false,
		draggables: [],
		playing: false,
		delay: args.delay,
		debug: args.debug ?? false,
		hasTransformation: (args.scale !== undefined || args.rotate !== undefined),
	};

	logger('Create Animation View:');

	const animationView = Ti.UI.createView({ width: 0, height: 0, touchEnabled: false });

	if (args.scale || args.rotate || args.anchorPoint) {
		logger('   Creating transform');
		args.transform = Ti.UI.createMatrix2D({ scale, rotate, anchorPoint } = args);
	}

	delete args.id;
	delete args.scale;
	delete args.rotate;

	if (args.animation && args.animation.open && (args.animation.open.anchorPoint || args.animation.open.rotate || args.animation.open.scale)) {
		logger('   Creating transformOnOpen');
		args.transformOnOpen = Ti.UI.createMatrix2D({ anchorPoint, rotate, scale } = args.animation.open);
		delete args.animation.open.scale;
		delete args.animation.open.rotate;
		delete args.animation.open.anchorPoint;
	}

	if (args.animation && args.animation.close && (args.animation.close.anchorPoint || args.animation.close.rotate || args.animation.close.scale)) {
		logger('   Creating transformOnClose');
		args.transformOnClose = Ti.UI.createMatrix2D({ anchorPoint, rotate, scale } = args.animation.close);
		delete args.animation.close.scale;
		delete args.animation.close.rotate;
		delete args.animation.close.anchorPoint;
	}

	// TODO: A library of useful animations
	animationView.play = (_views, _cb) => {
		logger('-> play Called');
		(param.playing) ? logger(`$.${param.view.id}: is playing...`) : play(_views, _cb);
	};

	animationView.toggle = animationView.play;

	animationView.apply = (_views, _cb) => {
		logger('-> apply Called');
		play(_views, _cb, 'apply')
	};

	animationView.draggable = (_views) => {
		logger('-> draggable Called');
		if (Array.isArray(_views)) {
			_views.forEach((_view, key) => {
				_view.zIndex = key;
				draggable(_view);
			});
		} else {
			draggable(_views);
		}
	};

	//! Helper Functions
	function play(_views, _cb, action = 'play') {
		logger('     Helper Function');

		checkAnimation(action);

		if (Array.isArray(_views)) {
			args.delay = param.delay;
			_views.forEach(_view => {
				(action === 'play') ? playView(_view, _cb, action) : applyView(_view, _cb, action);
				args.delay += param.delay;
			});
		} else if (action === 'play') {
			playView(_views, _cb, action);
		} else if (action === 'apply') {
			applyView(_views, _cb, action);
		}
	}

	function draggable(_view) {
		if (_view) {
			logger('    draggable helper function');

			let offsetX, offsetY;

			param.draggables.push(_view);

			_view.addEventListener('touchstart', function(e) {
				offsetX = e.x;
				offsetY = e.y;

				param.draggables.push(param.draggables.splice(e.source.zIndex, 1)[0]);

				param.draggables.forEach((draggable, key) => {
					draggable.zIndex = key;
				});

				checkDraggable(_view, 'drag');
			});

			_view.addEventListener('touchend', e => {
				checkDraggable(_view, 'drop');
			});

			_view.addEventListener('touchmove', function(e) {
				if (!e.source.transform && !param.hasTransformation && !_view.transform) {
					let convertedPoint = _view.convertPointToView({ x: e.x, y: e.y }, _view.parent);

					let moveValues = {
						duration: 0,
						top: Math.round(convertedPoint.y - offsetY),
						left: Math.round(convertedPoint.x - offsetX),
					}

					if (_view.constraint === 'vertical') {
						delete moveValues.left;
					} else if (_view.constraint === 'horizontal') {
						delete moveValues.top;
					}

					_view.animate(moveValues);
				}
			});
		} else {
			notFound();
		}
	}

	function checkAnimation(action) {
		if (args.animation) {
			logger('       Check Animation');
			param.open = !param.open;

			// For regular animations, including extra animations with open and close states.
			args = param.open ? { ...args, ...args.animation.open } : { ...args, ...args.animation.close };

			if (action === 'play') {
				if (param.open && args.transformOnOpen) {
					logger('       Set args.transform = args.transformOnOpen');
					args.transform = args.transformOnOpen;
				} else if (args.transformOnClose) {
					logger('       Set args.transform = args.transformOnClose');
					args.transform = args.transformOnClose;
				}

				param.open = (args.autoreverse) ? !param.open : param.open;
			}
		}
	}

	function logger(_message, forceLog = false) {
		if (param.debug || forceLog) console.warn(`:: ti.animation :: ${_message}`);
	}

	function notFound(source) {
		console.error('The provided target can’t be found!');
	}

	function checkDraggable(_view, _action) {
		logger('   Check Draggable');
		if (_action === 'drag' && _view.draggable && _view.draggable.drag) {
			(_view.draggingType === 'apply') ? _view.applyProperties(_view.draggable.drag) : _view.animate(Ti.UI.createAnimation(_view.draggable.drag));
		} else if (_action === 'drop' && _view.draggable && _view.draggable.drop) {
			(_view.draggingType === 'apply') ? _view.applyProperties(_view.draggable.drop) : _view.animate(Ti.UI.createAnimation(_view.draggable.drop));
		} else if (args.draggable) {
			if (_action === 'drag') {
				(args.draggingType === 'apply') ? _view.applyProperties(args.draggable.drag) : _view.animate(Ti.UI.createAnimation(args.draggable.drag));
			} else if (_action === 'drop') {
				(args.draggingType === 'apply') ? _view.applyProperties(args.draggable.drop) : _view.animate(Ti.UI.createAnimation(args.draggable.drop));
			}
		}
	}

	function checkComplete(view, action) {
		if (args.animation && args.animation.complete) {
			logger('       check `complete` args');
			if (action === 'play') {
				param.playing = true;
				view.animate(Ti.UI.createAnimation(args.animation.complete), () => {
					param.playing = false;
				});
			} else {
				view.applyProperties(args.animation.complete);
			}
		}
	}

	function playView(view, _cb, action) {
		if (view) {
			logger('---> Animate args to View');
			// if (args && args.constructor === Object && Object.keys(args).length === 0) {
			param.view = view;
			param.playing = true;
			view.animate(Ti.UI.createAnimation(args), e => {
				checkComplete(view, action);

				(typeof _cb === 'function') ? _cb(e) : e => {
					logger('Animation complete on object: ' + JSON.stringify(e));
				};

				param.playing = false;
			});
			// }
		} else {
			notFound(args);
		}
	}

	function applyView(view, _cb, action) {
		if (view) {
			logger('---> Apply Properties to View');
			view.applyProperties(args);

			checkComplete(view, action);

			(typeof _cb === 'function') ? _cb() : () => {
				logger('Animation complete on objects: ' + JSON.stringify(e));
				param.playing = false;
			};
		} else {
			notFound(args);
		}
	}

	return animationView;
}
exports.Animation = Animation;

function deviceInfo() {
	console.warn('------------------- DEVICE INFO -------------------');

	console.warn('');
	console.warn('version:', Ti.Platform.version);
	console.warn('name:', Ti.Platform.name);
	console.warn('username:', Ti.Platform.username);
	console.warn('locale:', Ti.Platform.locale);
	console.warn('osname:', Ti.Platform.osname);
	console.warn('ostype:', Ti.Platform.ostype);
	console.warn('model:', Ti.Platform.model);
	console.warn('manufacturer:', Ti.Platform.manufacturer);
	console.warn('architecture:', Ti.Platform.architecture);
	console.warn('availableMemory:', Ti.Platform.availableMemory);

	console.warn('');
	console.warn('isTablet:', Alloy.isTablet);
	console.warn('isHandheld:', Alloy.isHandheld);

	console.warn('');
	console.warn('Ti.Platform.displayCaps.dpi:', Ti.Platform.displayCaps.dpi);
	console.warn('Ti.Platform.displayCaps.density:', Ti.Platform.displayCaps.density);
	console.warn('Ti.Platform.displayCaps.platformWidth:', Ti.Platform.displayCaps.platformWidth);
	console.warn('Ti.Platform.displayCaps.platformHeight:', Ti.Platform.displayCaps.platformHeight);

	if (Ti.Platform.osname === 'android') {
		console.warn('');
		console.warn('Ti.Platform.displayCaps.xdpi:', Ti.Platform.displayCaps.xdpi);
		console.warn('Ti.Platform.displayCaps.ydpi:', Ti.Platform.displayCaps.ydpi);
	}

	if ((Ti.Platform.osname === 'iphone') || (Ti.Platform.osname === 'ipad') || (Ti.Platform.osname === 'android')) {
		console.warn('');
		console.warn('Ti.Platform.displayCaps.logicalDensityFactor:', Ti.Platform.displayCaps.logicalDensityFactor);
	}

	console.warn('');
	console.warn('----------------- END DEVICE INFO -----------------');
}
exports.deviceInfo = deviceInfo;

exports.createAnimation = (args) => {
	return new Animation(args);
};
