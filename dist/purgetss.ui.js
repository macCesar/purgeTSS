// PurgeTSS v6.2.43
// Created by César Estrada
// https://purgetss.com

function Animation(args) {
  const param = {
    id: args.id,
    open: false,
    draggables: [],
    playing: false,
    delay: args.delay ?? 0,
    debug: args.debug ?? false,
    moveByProperties: args.moveByProperties ?? false,
    hasTransformation: (args.scale !== undefined || args.rotate !== undefined)
  }

  logger('Create Animation View: ' + param.id)

  const animationView = Ti.UI.createView({ width: 0, height: 0, touchEnabled: false })

  delete args.id

  if ('anchorPoint' in args || 'rotate' in args || 'scale' in args) {
    logger('   -> Creating transform')
    args.transform = Ti.UI.createMatrix2D(args)
    delete args.scale
    delete args.rotate
    delete args.anchorPoint
  }

  if (args.animationProperties && args.animationProperties.open && ('anchorPoint' in args.animationProperties.open || 'rotate' in args.animationProperties.open || 'scale' in args.animationProperties.open)) {
    logger('   -> Creating transformOnOpen')
    args.transformOnOpen = Ti.UI.createMatrix2D(args.animationProperties.open)
    // delete args.animationProperties.open;
  }

  if (args.animationProperties && args.animationProperties.close && ('anchorPoint' in args.animationProperties.close || 'rotate' in args.animationProperties.close || 'scale' in args.animationProperties.close)) {
    logger('   -> Creating transformOnClose')
    args.transformOnClose = Ti.UI.createMatrix2D(args.animationProperties.close)
    // delete args.animationProperties.close;
  }

  // TODO: Create a library of useful animations!!
  animationView.play = (_views, _cb) => {
    if (param.debug) { console.log('') } // Just for debug
    logger('`play` method called on: ' + param.id);
    (param.playing) ? logger(`$.${param.view.id}: is playing...`) : mainPlayApplyFn(_views, _cb)
  }

  animationView.toggle = animationView.play

  animationView.apply = (_views, _cb) => {
    if (param.debug) { console.log('') } // Just for debug
    logger('`apply` method called on: ' + param.id)
    mainPlayApplyFn(_views, _cb, 'apply')
  }

  animationView.draggable = (_views) => {
    if (param.debug) { console.log('') } // Just for debug
    logger('`draggable` method called on: ' + param.id)
    if (Array.isArray(_views)) {
      _views.forEach((_view, key) => {
        _view.zIndex = key
        draggable(_view)
      })
    } else {
      draggable(_views)
    }
  }

  // ! Helper Functions
  function mainPlayApplyFn(_views, _cb, action = 'play') {
    logger('   -> `mainPlayApplyFn` helper')

    param.open = !param.open

    chooseAnimationBasedOnState(action)

    if (Array.isArray(_views)) {
      args.delay = param.delay
      _views.forEach(_view => {
        (action === 'play') ? playView(_view, _cb, action) : applyView(_view, _cb, action)
        args.delay += param.delay
      })
    } else {
      (action === 'play') ? playView(_views, _cb, action) : applyView(_views, _cb, action)
    }
  }

  function draggable(draggableView) {
    if (draggableView) {
      logger('   -> `draggable` helper')

      let offsetX, offsetY

      if (args.bounds) {
        draggableView.bounds = (draggableView.bounds) ? { ...args.bounds, ...draggableView.bounds } : args.bounds
      }

      draggableView.addEventListener('touchstart', event => {
        offsetX = event.x
        offsetY = event.y

        param.draggables.push(param.draggables.splice(realSourceView(event.source).zIndex, 1)[0])
        param.draggables.forEach((draggable, key) => { draggable.zIndex = key })

        checkDraggable(draggableView, 'drag')
      })

      draggableView.addEventListener('touchend', () => {
        checkDraggable(draggableView, 'drop')
      })

      if (OS_IOS) {
        draggableView.addEventListener('touchmove', event => {
          const parentViewRect = draggableView.parent.rect
          const convertedPoint = draggableView.convertPointToView({ x: event.x, y: event.y }, draggableView.parent)

          let top = Math.round(convertedPoint.y - offsetY)
          let left = Math.round(convertedPoint.x - offsetX)

          if (draggableView.bounds) {
            if (draggableView.bounds.top !== undefined && top < draggableView.bounds.top) {
              top = draggableView.bounds.top
            }
            if (draggableView.bounds.left !== undefined && left < draggableView.bounds.left) {
              left = draggableView.bounds.left
            }
            if (draggableView.bounds.right !== undefined && left > parentViewRect.width - draggableView.rect.width - draggableView.bounds.right) {
              left = parentViewRect.width - draggableView.rect.width - draggableView.bounds.right
            }
            if (draggableView.bounds.bottom !== undefined && top > parentViewRect.height - draggableView.rect.height - draggableView.bounds.bottom) {
              top = parentViewRect.height - draggableView.rect.height - draggableView.bounds.bottom
            }
          }

          let x = left - parentViewRect.width / 2 + draggableView.rect.width / 2
          let y = top - parentViewRect.height / 2 + draggableView.rect.height / 2

          if (draggableView.left) {
            x = left - draggableView.left
          } else if (draggableView.right) {
            x = left - (parentViewRect.width - draggableView.right - draggableView.rect.width)
          }

          if (draggableView.top) {
            y = top - draggableView.top
          } else if (draggableView.bottom) {
            y = top - (parentViewRect.height - draggableView.bottom - draggableView.rect.height)
          }

          if (draggableView.constraint === 'vertical') {
            x = 0
          } else if (draggableView.constraint === 'horizontal') {
            y = 0
          }

          draggableView.applyProperties({ duration: 0, transform: Ti.UI.createMatrix2D().translate(x, y) })
        })

        Ti.Gesture.addEventListener('orientationchange', () => {
          checkBoundaries(draggableView)
        })
      } else {
        draggableView.addEventListener('touchmove', event => {
          if (!event.source.transform && !param.hasTransformation && !draggableView.transform) {
            const convertedPoint = draggableView.convertPointToView({ x: event.x, y: event.y }, draggableView.parent)

            let top = Math.round(convertedPoint.y - offsetY)
            let left = Math.round(convertedPoint.x - offsetX)

            if (draggableView.bounds) {
              if (draggableView.bounds.top !== undefined && top < draggableView.bounds.top) {
                top = draggableView.bounds.top
              }
              if (draggableView.bounds.left !== undefined && left < draggableView.bounds.left) {
                left = draggableView.bounds.left
              }
              if (draggableView.bounds.right !== undefined && left > draggableView.parent.rect.width - draggableView.rect.width - draggableView.bounds.right) {
                left = draggableView.parent.rect.width - draggableView.rect.width - draggableView.bounds.right
              }
              if (draggableView.bounds.bottom !== undefined && top > draggableView.parent.rect.height - draggableView.rect.height - draggableView.bounds.bottom) {
                top = draggableView.parent.rect.height - draggableView.rect.height - draggableView.bounds.bottom
              }
            }

            const moveValues = { top, left, duration: 0 }

            if (draggableView.constraint === 'vertical') {
              delete moveValues.left
            } else if (draggableView.constraint === 'horizontal') {
              delete moveValues.top
            }

            if (param.moveByProperties) {
              draggableView.applyProperties(moveValues)
            } else {
              draggableView.animate(moveValues)
            }
          }
        })

        Ti.Gesture.addEventListener('orientationchange', () => {
          const BOUNDARY_CHECK_DELAY = 1000
          setTimeout(() => {
            checkBoundaries(draggableView)
          }, BOUNDARY_CHECK_DELAY)
        })
      }

      param.draggables.push(draggableView)
    } else {
      notFound()
    }
  }

  function realSourceView(_source) {
    return (param.draggables.map(a => a.id).includes(_source.id)) ? _source : realSourceView(_source.parent)
  }

  function chooseAnimationBasedOnState(action) {
    if (args.animationProperties) {
      // For regular animations, including extra animations with open and close states.
      args = param.open ? { ...args, ...args.animationProperties.open } : { ...args, ...args.animationProperties.close }

      if (action === 'play') {
        logger('   -> `' + action + '` Check Animation')
        if (param.open && args.transformOnOpen) {
          logger('   -> set args.transform = args.transformOnOpen')
          args.transform = args.transformOnOpen
        } else if (args.transformOnClose) {
          logger('   -> set args.transform = args.transformOnClose')
          args.transform = args.transformOnClose
        }

        param.open = (args.autoreverse) ? !param.open : param.open
      }
    }
  }

  function checkBoundaries(_view) {
    if (_view.bounds) {
      if (_view.bounds.right !== undefined && _view.left > _view.parent.rect.width - _view.rect.width - _view.bounds.right) {
        _view.left = _view.parent.rect.width - _view.rect.width - _view.bounds.right
      }

      if (_view.bounds.bottom !== undefined && _view.top > _view.parent.rect.height - _view.rect.height - _view.bounds.bottom) {
        _view.top = _view.parent.rect.height - _view.rect.height - _view.bounds.bottom
      }
    }
  }

  function checkComplete(view, action) {
    if (args.animationProperties && args.animationProperties.complete) {
      logger('   -> `complete` Animation')
      if (action === 'play') {
        param.playing = true
        view.animate(Ti.UI.createAnimation({ ...args, ...args.animationProperties.complete, transform: Ti.UI.createMatrix2D(args.animationProperties.complete) }), () => {
          param.playing = false
        })
      } else {
        view.applyProperties(args.animationProperties.complete)
      }
    }
  }

  function logger(_message, forceLog = false) {
    if (param.debug || forceLog) { console.warn(`::ti.animation:: ${_message}`) }
  }

  function notFound() {
    console.error('The provided target can’t be found!')
  }

  function createAnimationObject(_child, type) {
    return Ti.UI.createAnimation({
      ...(args.animationProperties && args.animationProperties.children) ?? {},
      ..._child.animationProperties.child ?? {},
      ..._child.animationProperties[type] ?? {},
      transform: Ti.UI.createMatrix2D(_child.animationProperties[type] ?? {})
    })
  }

  // ! Needs refactor!! It's so ugly right now!!
  function checkDraggable(_view, _action) {
    logger('Check Draggable')
    logger('   -> `' + _action + '`')
    const draggingType = _view.draggingType ?? args.draggingType
    if (_action === 'drag' && _view.draggable && _view.draggable.drag) {
      const theArgs = (args.draggable) ? { ...args.draggable.drag, ..._view.draggable.drag } : _view.draggable.drag;
      (draggingType === 'apply') ? _view.applyProperties(theArgs) : _view.animate(Ti.UI.createAnimation(theArgs))
    } else if (_action === 'drop' && _view.draggable && _view.draggable.drop) {
      const theArgs = (args.draggable) ? { ...args.draggable.drop, ..._view.draggable.drop } : _view.draggable.drop;
      (draggingType === 'apply') ? _view.applyProperties(theArgs) : _view.animate(Ti.UI.createAnimation(theArgs))
    } else if (args.draggable) {
      if (_action === 'drag') {
        (draggingType === 'apply') ? _view.applyProperties(args.draggable.drag) : _view.animate(Ti.UI.createAnimation(args.draggable.drag))
      } else if (_action === 'drop') {
        (draggingType === 'apply') ? _view.applyProperties(args.draggable.drop) : _view.animate(Ti.UI.createAnimation(args.draggable.drop))
      }
    }
  }

  function playView(view, _cb, action) {
    if (view) {
      logger('   -> `animate` View')
      param.view = view
      param.playing = true
      view.animate(Ti.UI.createAnimation(args), event => {
        checkComplete(view, action);

        // eslint-disable-next-line no-unused-expressions
        (typeof _cb === 'function')
          ? _cb(event)
          : logger('Animation complete on object: ' + JSON.stringify(args))

        param.playing = false
      })

      innerAnimations(view, action)
    } else {
      notFound(args)
    }
  }

  function applyView(view, _cb, action) {
    if (view) {
      logger('   -> `apply` View')
      view.applyProperties(args)

      innerAnimations(view, action)

      checkComplete(view, action);

      // eslint-disable-next-line no-unused-expressions
      (typeof _cb === 'function')
        ? _cb()
        : () => {
            logger('Animation complete on objects: ' + JSON.stringify(args))
            param.playing = false
          }
    } else {
      notFound(args)
    }
  }

  function innerAnimations(_view, _action) {
    _.each(_view.children, child => {
      if (param.open && child.animationProperties && child.animationProperties.open) {
        if (_action === 'play') {
          child.animate(createAnimationObject(child, 'open'), () => {
            if (child.animationProperties.complete) {
              child.animate(createAnimationObject(child, 'complete'))
            }
          })
        } else {
          child.applyProperties({
            transform: Ti.UI.createMatrix2D(child.animationProperties.open),
            ...child.animationProperties.open
          })
        }
      } else if (child.animationProperties && child.animationProperties.close) {
        (_action === 'play') ? child.animate(createAnimationObject(child, 'close')) : child.applyProperties({ transform: Ti.UI.createMatrix2D(child.animationProperties.close), ...child.animationProperties.close })
      }
    })
  }

  return animationView
}
exports.AnimationProperties = Animation

function deviceInfo() {
  console.warn('------------------- DEVICE INFO -------------------')

  console.warn('')
  console.warn('version:', Ti.Platform.version)
  console.warn('name:', Ti.Platform.name)
  console.warn('username:', Ti.Platform.username)
  console.warn('locale:', Ti.Platform.locale)
  console.warn('osname:', Ti.Platform.osname)
  console.warn('ostype:', Ti.Platform.ostype)
  console.warn('model:', Ti.Platform.model)
  console.warn('manufacturer:', Ti.Platform.manufacturer)
  console.warn('architecture:', Ti.Platform.architecture)
  console.warn('availableMemory:', Ti.Platform.availableMemory)

  console.warn('')
  console.warn('isTablet:', Alloy.isTablet)
  console.warn('isHandheld:', Alloy.isHandheld)

  console.warn('')
  console.warn('Ti.Platform.displayCaps.dpi:', Ti.Platform.displayCaps.dpi)
  console.warn('Ti.Platform.displayCaps.density:', Ti.Platform.displayCaps.density)
  console.warn('Ti.Platform.displayCaps.platformWidth:', Ti.Platform.displayCaps.platformWidth)
  console.warn('Ti.Platform.displayCaps.platformHeight:', Ti.Platform.displayCaps.platformHeight)

  if (Ti.Platform.osname === 'android') {
    console.warn('')
    console.warn('Ti.Platform.displayCaps.xdpi:', Ti.Platform.displayCaps.xdpi)
    console.warn('Ti.Platform.displayCaps.ydpi:', Ti.Platform.displayCaps.ydpi)
  }

  if ((Ti.Platform.osname === 'iphone') || (Ti.Platform.osname === 'ipad') || (Ti.Platform.osname === 'android')) {
    console.warn('')
    console.warn('Ti.Platform.displayCaps.logicalDensityFactor:', Ti.Platform.displayCaps.logicalDensityFactor)
  }

  console.warn('')
  console.warn('----------------- END DEVICE INFO -----------------')
}
exports.deviceInfo = deviceInfo

exports.createAnimation = args => new Animation(args)
