function Animation(args) {
	let param = {
		id: args.id,
		open: false,
		draggables: [],
		playing: false,
		delay: args.delay ?? 0,
		debug: args.debug ?? false,
		hasTransformation: (args.scale !== undefined || args.rotate !== undefined),
	};

	logger('Create Animation View: ' + param.id);

	const animationView = Ti.UI.createView({ width: 0, height: 0, touchEnabled: false });

	delete args.id;

	if ("anchorPoint" in args || "rotate" in args || "scale" in args) {
		logger('   -> Creating transform');
		args.transform = Ti.UI.createMatrix2D(args);
		delete args.scale;
		delete args.rotate;
		delete args.anchorPoint;
	}

	if (args.animationProperties && args.animationProperties.open && ("anchorPoint" in args.animationProperties.open || "rotate" in args.animationProperties.open || "scale" in args.animationProperties.open)) {
		logger('   -> Creating transformOnOpen');
		args.transformOnOpen = Ti.UI.createMatrix2D(args.animationProperties.open);
		delete args.animationProperties.open;
	}

	if (args.animationProperties && args.animationProperties.close && ("anchorPoint" in args.animationProperties.close || "rotate" in args.animationProperties.close || "scale" in args.animationProperties.close)) {
		logger('   -> Creating transformOnClose');
		args.transformOnClose = Ti.UI.createMatrix2D(args.animationProperties.close);
		delete args.animationProperties.close;
	}

	// TODO: Create a library of useful animations!!
	animationView.play = (_views, _cb) => {
		if (param.debug) console.log(''); // Just for debug
		logger('`play` method called on: ' + param.id);
		(param.playing) ? logger(`$.${param.view.id}: is playing...`) : mainPlayApplyFn(_views, _cb);
	};

	animationView.toggle = animationView.play;

	animationView.apply = (_views, _cb) => {
		if (param.debug) console.log(''); // Just for debug
		logger('`apply` method called on: ' + param.id);
		mainPlayApplyFn(_views, _cb, 'apply')
	};

	animationView.draggable = (_views) => {
		if (param.debug) console.log(''); // Just for debug
		logger('`draggable` method called on: ' + param.id);
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
	function mainPlayApplyFn(_views, _cb, action = 'play') {
		logger('   -> `mainPlayApplyFn` helper');

		param.open = !param.open;

		chooseAnimationBasedOnState(action);

		if (Array.isArray(_views)) {
			args.delay = param.delay;
			_views.forEach(_view => {
				(action === 'play') ? playView(_view, _cb, action) : applyView(_view, _cb, action);
				args.delay += param.delay;
			});
		} else {
			(action === 'play') ? playView(_views, _cb, action) : applyView(_views, _cb, action);
		}
	}

	function draggable(_view) {
		if (_view) {
			logger('   -> `draggable` helper');

			let offsetX, offsetY;

			if (args.bounds) _view.bounds = (_view.bounds) ? { ...args.bounds, ..._view.bounds } : args.bounds;

			param.draggables.push(_view);

			Ti.Gesture.addEventListener('orientationchange', (e) => {
				if (OS_ANDROID) setTimeout(() => { checkBoundaries(_view); }, 1000);
				else checkBoundaries(_view);
			});

			_view.addEventListener('touchstart', function(e) {
				offsetX = e.x;
				offsetY = e.y;

				param.draggables.push(param.draggables.splice(realSourceView(e.source).zIndex, 1)[0]);

				param.draggables.forEach((draggable, key) => { draggable.zIndex = key; });

				checkDraggable(_view, 'drag');
			});

			_view.addEventListener('touchend', e => {
				checkDraggable(_view, 'drop');
			});

			_view.addEventListener('touchmove', function(e) {
				if (!e.source.transform && !param.hasTransformation && !_view.transform) {
					let convertedPoint = _view.convertPointToView({ x: e.x, y: e.y }, _view.parent);

					let top = Math.round(convertedPoint.y - offsetY);
					let left = Math.round(convertedPoint.x - offsetX);

					if (_view.bounds) {
						if (_view.bounds.top !== undefined && top < _view.bounds.top) top = _view.bounds.top;
						if (_view.bounds.left !== undefined && left < _view.bounds.left) left = _view.bounds.left;
						if (_view.bounds.right !== undefined && left > _view.parent.rect.width - _view.rect.width - _view.bounds.right) left = _view.parent.rect.width - _view.rect.width - _view.bounds.right;
						if (_view.bounds.bottom !== undefined && top > _view.parent.rect.height - _view.rect.height - _view.bounds.bottom) top = _view.parent.rect.height - _view.rect.height - _view.bounds.bottom;
					}

					let moveValues = { top: top, left: left, duration: 0 }

					if (_view.constraint === 'vertical') delete moveValues.left;
					else if (_view.constraint === 'horizontal') delete moveValues.top;

					_view.animate(moveValues);
				}
			});
		} else {
			notFound();
		}
	}

	function realSourceView(_source) {
		return (param.draggables.map(a => a.id).includes(_source.id)) ? _source : realSourceView(_source.parent);
	}

	function chooseAnimationBasedOnState(action) {
		if (args.animationProperties) {
			// For regular animations, including extra animations with open and close states.
			args = param.open ? { ...args, ...args.animationProperties.open } : { ...args, ...args.animationProperties.close };

			if (action === 'play') {
				logger('   -> `' + action + '` Check Animation');
				if (param.open && args.transformOnOpen) {
					logger('   -> set args.transform = args.transformOnOpen');
					args.transform = args.transformOnOpen;
				} else if (args.transformOnClose) {
					logger('   -> set args.transform = args.transformOnClose');
					args.transform = args.transformOnClose;
				}

				param.open = (args.autoreverse) ? !param.open : param.open;
			}
		}
	}

	function checkBoundaries(_view) {
		if (_view.bounds) {
			if (_view.bounds.right !== undefined && _view.left > _view.parent.rect.width - _view.rect.width - _view.bounds.right) _view.left = _view.parent.rect.width - _view.rect.width - _view.bounds.right;
			if (_view.bounds.bottom !== undefined && _view.top > _view.parent.rect.height - _view.rect.height - _view.bounds.bottom) _view.top = _view.parent.rect.height - _view.rect.height - _view.bounds.bottom;
		}
	}

	function checkComplete(view, action) {
		if (args.animationProperties && args.animationProperties.complete) {
			logger('   -> `complete` Animation');
			if (action === 'play') {
				param.playing = true;
				view.animate(Ti.UI.createAnimation({ ...args, ...args.animationProperties.complete, transform: Ti.UI.createMatrix2D(args.animationProperties.complete) }), () => {
					param.playing = false;
				});
			} else {
				view.applyProperties(args.animationProperties.complete);
			}
		}
	}

	function logger(_message, forceLog = false) {
		if (param.debug || forceLog) console.warn(`::ti.animation:: ${_message}`);
	}

	function notFound(source) {
		console.error('The provided target can’t be found!');
	}

	function createAnimationObject(_child, type) {
		return Ti.UI.createAnimation({
			...(args['animationProperties'] && args['animationProperties']['children']) ?? {},
			..._child['animationProperties']['child'] ?? {},
			..._child['animationProperties'][type] ?? {},
			transform: Ti.UI.createMatrix2D(_child['animationProperties'][type] ?? {})
		});
	}

	//! Needs refactor!! It's so ugly right now!!
	function checkDraggable(_view, _action) {
		logger('Check Draggable');
		logger('   -> `' + _action + '`');
		let draggingType = _view.draggingType ?? args.draggingType;
		if (_action === 'drag' && _view.draggable && _view.draggable.drag) {
			let theArgs = (args.draggable) ? { ...args.draggable.drag, ..._view.draggable.drag } : _view.draggable.drag;
			(draggingType === 'apply') ? _view.applyProperties(theArgs) : _view.animate(Ti.UI.createAnimation(theArgs));
		} else if (_action === 'drop' && _view.draggable && _view.draggable.drop) {
			let theArgs = (args.draggable) ? { ...args.draggable.drop, ..._view.draggable.drop } : _view.draggable.drop;
			(draggingType === 'apply') ? _view.applyProperties(theArgs) : _view.animate(Ti.UI.createAnimation(theArgs));
		} else if (args.draggable) {
			if (_action === 'drag') {
				(draggingType === 'apply') ? _view.applyProperties(args.draggable.drag) : _view.animate(Ti.UI.createAnimation(args.draggable.drag));
			} else if (_action === 'drop') {
				(draggingType === 'apply') ? _view.applyProperties(args.draggable.drop) : _view.animate(Ti.UI.createAnimation(args.draggable.drop));
			}
		}
	}

	function playView(view, _cb, action) {
		if (view) {
			logger('   -> `animate` View');
			param.view = view;
			param.playing = true;
			view.animate(Ti.UI.createAnimation(args), e => {
				checkComplete(view, action);

				(typeof _cb === 'function') ? _cb(e) : e => {
					logger('Animation complete on object: ' + JSON.stringify(e));
				};

				param.playing = false;
			});

			innerAnimations(view, action);
		} else {
			notFound(args);
		}
	}

	function applyView(view, _cb, action) {
		if (view) {
			logger('   -> `apply` View');
			view.applyProperties(args);

			innerAnimations(view, action);

			checkComplete(view, action);

			(typeof _cb === 'function') ? _cb() : () => {
				logger('Animation complete on objects: ' + JSON.stringify(e));
				param.playing = false;
			};
		} else {
			notFound(args);
		}
	}

	function innerAnimations(_view, _action) {
		_.each(_view.children, child => {
			if (param.open && child['animationProperties'] && child['animationProperties']['open']) {
				if (_action === 'play') {
					child.animate(createAnimationObject(child, 'open'), () => {
						if (child['animationProperties']['complete']) child.animate(createAnimationObject(child, 'complete'));
					});
				} else {
					child.applyProperties({
						transform: Ti.UI.createMatrix2D(child['animationProperties']['open']),
						...child['animationProperties']['open']
					});
				}
			} else if (child['animationProperties'] && child['animationProperties']['close']) {
				(_action === 'play') ? child.animate(createAnimationObject(child, 'close')) : child.applyProperties({ transform: Ti.UI.createMatrix2D(child['animationProperties']['close']), ...child['animationProperties']['close'] });
			}
		});
	}

	return animationView;
}
exports.AnimationProperties = Animation;

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

exports.createAnimation = (args) => { return new Animation(args); };
