// PurgeTSS v6.2.44
// Created by César Estrada
// https://purgetss.com

function Animation(args = {}) {
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

  handleTransformations(args)

  animationView.play = (_views, _cb) => {
    if (param.debug) { console.log('') }
    logger('`play` method called on: ' + param.id)
    param.playing ? logger(`$.${param.view.id}: is playing...`) : mainPlayApplyFn(_views, _cb)
  }

  animationView.toggle = animationView.play

  animationView.apply = (_views, _cb) => {
    if (param.debug) { console.log('') }
    logger('`apply` method called on: ' + param.id)
    mainPlayApplyFn(_views, _cb, 'apply')
  }

  animationView.draggable = (_views) => {
    if (param.debug) { console.log('') }
    logger('`draggable` method called on: ' + param.id)
    makeViewsDraggable(_views)
  }

  animationView.open = (_views, _cb) => {
    if (param.debug) { console.log('') }
    logger('`open` method called on: ' + param.id)
    mainPlayApplyFn(_views, _cb, 'play', 'open')
  }

  animationView.close = (_views, _cb) => {
    if (param.debug) { console.log('') }
    logger('`close` method called on: ' + param.id)
    mainPlayApplyFn(_views, _cb, 'play', 'close')
  }

  function handleTransformations(args) {
    if ('anchorPoint' in args || 'rotate' in args || 'scale' in args) {
      logger('   -> Creating transform')
      args.transform = Ti.UI.createMatrix2D(args)
      delete args.scale
      delete args.rotate
      delete args.anchorPoint
    }

    if (args.animationProperties) {
      if ('open' in args.animationProperties) {
        handleTransformOnOpenClose(args, 'open')
      }
      if ('close' in args.animationProperties) {
        handleTransformOnOpenClose(args, 'close')
      }
    }
  }

  function handleTransformOnOpenClose(args, state) {
    const properties = args.animationProperties[state]
    if ('anchorPoint' in properties || 'rotate' in properties || 'scale' in properties) {
      logger(`   -> Creating transformOn${capitalize(state)}`)
      args[`transformOn${capitalize(state)}`] = Ti.UI.createMatrix2D(properties)
    }
  }

  function mainPlayApplyFn(_views, _cb, action = 'play', state) {
    logger('   -> `mainPlayApplyFn` helper')

    if (state) {
      param.open = state === 'open'
    } else {
      param.open = !param.open
    }

    chooseAnimationBasedOnState(action)

    const applyOrPlayView = (view) => {
      action === 'play' ? playView(view, _cb, action) : applyView(view, _cb, action)
    }

    if (Array.isArray(_views)) {
      args.delay = param.delay
      _views.forEach((view) => {
        applyOrPlayView(view)
        args.delay += param.delay
      })
    } else {
      applyOrPlayView(_views)
    }
  }

  function makeViewsDraggable(_views) {
    if (Array.isArray(_views)) {
      _views.forEach((view, key) => {
        view.zIndex = key
        makeDraggable(view)
      })
    } else {
      makeDraggable(_views)
    }
  }

  function makeDraggable(draggableView) {
    if (draggableView) {
      logger('   -> `draggable` helper')

      let offsetX, offsetY
      setBounds(draggableView, args.bounds)

      draggableView.addEventListener('touchstart', (event) => {
        offsetX = event.x
        offsetY = event.y

        updateDraggableZIndex(draggableView, event)
        checkDraggable(draggableView, 'drag')
      })

      draggableView.addEventListener('touchend', () => {
        checkDraggable(draggableView, 'drop')
      })

      draggableView.addEventListener('touchmove', (event) => handleTouchMove(event, draggableView, offsetX, offsetY))

      Ti.Gesture.addEventListener('orientationchange', () => {
        checkBoundaries(draggableView)
      })

      param.draggables.push(draggableView)
    } else {
      notFound()
    }
  }

  function handleTouchMove(event, draggableView, offsetX, offsetY) {
    const convertedPoint = draggableView.convertPointToView({ x: event.x, y: event.y }, draggableView.parent)
    const top = Math.round(convertedPoint.y - offsetY)
    const left = Math.round(convertedPoint.x - offsetX)

    const parentViewRect = draggableView.parent.rect
    applyBounds(draggableView, { top, left }, parentViewRect)

    const { x, y } = calculateTranslation(draggableView, parentViewRect, left, top)

    if (param.moveByProperties) {
      draggableView.applyProperties({ duration: 0, transform: Ti.UI.createMatrix2D().translate(x, y) })
    } else {
      draggableView.animate({ top, left, duration: 0 })
    }
  }

  function applyBounds(view, position, parentViewRect) {
    if (view.bounds) {
      if (view.bounds.top !== undefined && position.top < view.bounds.top) {
        position.top = view.bounds.top
      }
      if (view.bounds.left !== undefined && position.left < view.bounds.left) {
        position.left = view.bounds.left
      }
      if (view.bounds.right !== undefined && position.left > parentViewRect.width - view.rect.width - view.bounds.right) {
        position.left = parentViewRect.width - view.rect.width - view.bounds.right
      }
      if (view.bounds.bottom !== undefined && position.top > parentViewRect.height - view.rect.height - view.bounds.bottom) {
        position.top = parentViewRect.height - view.rect.height - view.bounds.bottom
      }
    }
  }

  function calculateTranslation(draggableView, parentViewRect, left, top) {
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

    return { x, y }
  }

  function setBounds(view, bounds) {
    if (bounds) {
      view.bounds = view.bounds ? { ...bounds, ...view.bounds } : bounds
    }
  }

  function updateDraggableZIndex(draggableView, event) {
    param.draggables.push(param.draggables.splice(realSourceView(event.source).zIndex, 1)[0])
    param.draggables.forEach((draggable, key) => { draggable.zIndex = key })
  }

  function realSourceView(_source) {
    return param.draggables.map(a => a.id).includes(_source.id) ? _source : realSourceView(_source.parent)
  }

  function chooseAnimationBasedOnState(action) {
    if (args.animationProperties) {
      args = param.open ? { ...args, ...args.animationProperties.open } : { ...args, ...args.animationProperties.close }
      if (action === 'play') {
        logger(`   -> '${action}' Check Animation`)
        args.transform = param.open ? args.transformOnOpen : args.transformOnClose
        param.open = args.autoreverse ? !param.open : param.open
      }
    }
  }

  function checkBoundaries(_view) {
    const bounds = _view.bounds
    const parentRect = _view.parent.rect
    if (bounds) {
      if (bounds.right !== undefined && _view.left > parentRect.width - _view.rect.width - bounds.right) {
        _view.left = parentRect.width - _view.rect.width - bounds.right
      }
      if (bounds.bottom !== undefined && _view.top > parentRect.height - _view.rect.height - bounds.bottom) {
        _view.top = parentRect.height - _view.rect.height - bounds.bottom
      }
    }
  }

  function checkComplete(view, action) {
    if (args.animationProperties?.complete) {
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
      ...(args.animationProperties?.children ?? {}),
      ..._child.animationProperties?.child ?? {},
      ..._child.animationProperties?.[type] ?? {},
      transform: Ti.UI.createMatrix2D(_child.animationProperties?.[type] ?? {})
    })
  }

  function checkDraggable(_view, _action) {
    logger('Check Draggable')
    logger(`   -> '${_action}'`)
    const draggingType = _view.draggingType ?? args.draggingType
    const handleDragDrop = (properties) => ((draggingType === 'apply') ? _view.applyProperties(properties) : _view.animate(Ti.UI.createAnimation(properties)))

    if (_action === 'drag') {
      handleDragDrop(args.draggable?.drag ? { ...args.draggable.drag, ..._view.draggable?.drag } : _view.draggable?.drag)
    } else if (_action === 'drop') {
      handleDragDrop(args.draggable?.drop ? { ...args.draggable.drop, ..._view.draggable?.drop } : _view.draggable?.drop)
    }
  }

  function playView(view, _cb, action) {
    if (view) {
      logger('   -> `animate` View')
      param.view = view
      param.playing = true

      const animation = Ti.UI.createAnimation(args)
      const onComplete = (event) => {
        checkComplete(view, action)
        if (typeof _cb === 'function') {
          _cb(event)
        } else {
          logger('Animation complete on object: ' + JSON.stringify(args))
        }
        param.playing = false
      }

      animation.addEventListener('complete', onComplete)
      view.animate(animation)

      innerAnimations(view, action)
    } else {
      notFound()
    }
  }

  function applyView(view, _cb, action) {
    if (view) {
      logger('   -> `apply` View')
      view.applyProperties(args)
      innerAnimations(view, action)
      checkComplete(view, action)
      if (typeof _cb === 'function') { _cb() }
    } else {
      notFound()
    }
  }

  function innerAnimations(_view, _action) {
    _view.children.forEach((child) => {
      const state = param.open ? 'open' : 'close'
      if (child.animationProperties?.[state]) {
        if (_action === 'play') {
          child.animate(createAnimationObject(child, state), () => {
            if (child.animationProperties.complete) {
              child.animate(createAnimationObject(child, 'complete'))
            }
          })
        } else {
          child.applyProperties({ transform: Ti.UI.createMatrix2D(child.animationProperties[state]), ...child.animationProperties[state] })
        }
      }
    })
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return animationView
}

exports.AnimationProperties = Animation

function deviceInfo() {
  console.warn('------------------- DEVICE INFO -------------------')
  const platform = Ti.Platform
  const displayCaps = platform.displayCaps
  console.warn(`
  version: ${platform.version}
  name: ${platform.name}
  username: ${platform.username}
  locale: ${platform.locale}
  osname: ${platform.osname}
  ostype: ${platform.ostype}
  model: ${platform.model}
  manufacturer: ${platform.manufacturer}
  architecture: ${platform.architecture}
  availableMemory: ${platform.availableMemory}
  isTablet: ${Alloy.isTablet}
  isHandheld: ${Alloy.isHandheld}
  Ti.Platform.displayCaps.dpi: ${displayCaps.dpi}
  Ti.Platform.displayCaps.density: ${displayCaps.density}
  Ti.Platform.displayCaps.platformWidth: ${displayCaps.platformWidth}
  Ti.Platform.displayCaps.platformHeight: ${displayCaps.platformHeight}`)

  if (platform.osname === 'android') {
    console.warn(`
  Ti.Platform.displayCaps.xdpi: ${displayCaps.xdpi}
  Ti.Platform.displayCaps.ydpi: ${displayCaps.ydpi}`)
  }

  if (['iphone', 'ipad', 'android'].includes(platform.osname)) {
    console.warn(`
  Ti.Platform.displayCaps.logicalDensityFactor: ${displayCaps.logicalDensityFactor}`)
  }

  console.warn('')
  console.warn('----------------- END DEVICE INFO -----------------')
}

exports.deviceInfo = deviceInfo

function saveComponent({ source, directory = Ti.Filesystem.tempDirectory }) {
  const componentImage = source.toImage()
  const md5 = `${Ti.Utils.md5HexDigest(componentImage)}.png`
  Ti.Filesystem.getFile(directory, md5).write(componentImage)
  Ti.Media.saveToPhotoGallery(componentImage)
}
exports.saveComponent = saveComponent

exports.createAnimation = (args) => new Animation(args)
