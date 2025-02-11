// Purge TSS v6.3.11
// Created by César Estrada
// https://purgetss.com

function Animation(args = {}) {
  const params = {
    id: args.id,
    open: false,
    draggables: [],
    playing: false,
    delay: args.delay ?? 0,
    debug: args.debug ?? false,
    isIOS: Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad',
    hasTransformation: (args.scale !== undefined || args.rotate !== undefined)
  }

  logger('Create Animation View: ' + params.id)

  const animationView = Ti.UI.createView({ width: 0, height: 0, touchEnabled: false })

  delete args.id

  handleTransformations(args)

  animationView.play = (_views, _cb) => {
    if (params.debug) { console.log('') }
    logger('`play` method called on: ' + params.id)
    params.playing ? logger(`$.${params.view.id}: is playing...`) : mainPlayApplyFn(_views, _cb)
  }

  animationView.toggle = animationView.play

  animationView.apply = (_views, _cb) => {
    if (params.debug) { console.log('') }
    logger('`apply` method called on: ' + params.id)
    mainPlayApplyFn(_views, _cb, 'apply')
  }

  animationView.draggable = (_views) => {
    if (params.debug) { console.log('') }
    logger('`draggable` method called on: ' + params.id)
    makeViewsDraggable(_views)
  }

  animationView.open = (_views, _cb) => {
    if (params.debug) { console.log('') }
    logger('`open` method called on: ' + params.id)
    mainPlayApplyFn(_views, _cb, 'play', 'open')
  }

  animationView.close = (_views, _cb) => {
    if (params.debug) { console.log('') }
    logger('`close` method called on: ' + params.id)
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
      params.open = state === 'open'
    } else {
      params.open = !params.open
    }

    chooseAnimationBasedOnState(action)

    const applyOrPlayView = (view) => {
      action === 'play' ? playView(view, _cb, action) : applyView(view, _cb, action)
    }

    if (Array.isArray(_views)) {
      args.delay = params.delay
      _views.forEach((view) => {
        applyOrPlayView(view)
        args.delay += params.delay
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

        updateDraggableZIndex(event)
        checkDraggable(draggableView, 'drag')
      })

      draggableView.addEventListener('touchend', () => checkDraggable(draggableView, 'drop'))

      draggableView.addEventListener('touchmove', (event) => handleTouchMove(event, draggableView, offsetX, offsetY))

      Ti.Gesture.addEventListener('orientationchange', () => checkBoundaries(draggableView))

      params.draggables.push(draggableView)
    } else {
      notFound()
    }
  }

  function handleTouchMove(event, draggableView, offsetX, offsetY) {
    const convertedPoint = draggableView.convertPointToView({ x: event.x, y: event.y }, draggableView.parent)
    let top = Math.round(convertedPoint.y - offsetY)
    let left = Math.round(convertedPoint.x - offsetX)

    const parentViewRect = draggableView.parent.rect

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

    if (params.isIOS) {
      const { x, y } = calculateTranslation(draggableView, draggableView.parent.rect, left, top)
      draggableView.applyProperties({ duration: 0, transform: Ti.UI.createMatrix2D().translate(x, y) })
    } else {
      draggableView.animate(Ti.UI.createAnimation({ top, left, duration: 0 }))
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

  function updateDraggableZIndex(event) {
    params.draggables.push(params.draggables.splice(realSourceView(event.source).zIndex, 1)[0])
    params.draggables.forEach((draggable, key) => { draggable.zIndex = key })
  }

  function realSourceView(_source) {
    return params.draggables.map(a => a.id).includes(_source.id) ? _source : realSourceView(_source.parent)
  }

  function chooseAnimationBasedOnState(action) {
    if (args.animationProperties) {
      args = params.open ? { ...args, ...args.animationProperties.open } : { ...args, ...args.animationProperties.close }
      if (action === 'play') {
        logger(`   -> '${action}' Check Animation`)
        args.transform = params.open ? args.transformOnOpen : args.transformOnClose
        params.open = args.autoreverse ? !params.open : params.open
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
        params.playing = true
        view.animate(Ti.UI.createAnimation({ ...args, ...args.animationProperties.complete, transform: Ti.UI.createMatrix2D(args.animationProperties.complete) }), () => {
          params.playing = false
        })
      } else {
        view.applyProperties(args.animationProperties.complete)
      }
    }
  }

  function logger(_message, forceLog = false) {
    if (params.debug || forceLog) { console.warn(`::ti.animation:: ${_message}`) }
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
    logger('   -> `' + _action + '`')

    const draggingType = _view.draggingType ?? args.draggingType
    const argsActions = args.draggable ? args.draggable[_action] : null
    const draggableActions = _view.draggable ? _view.draggable[_action] : null
    const theArgs = draggableActions ? { ...argsActions, ...draggableActions } : argsActions

    if (theArgs) {
      if (draggingType === 'apply') {
        _view.applyProperties(theArgs)
      } else {
        _view.animate(Ti.UI.createAnimation(theArgs))
      }
    }
  }

  function playView(view, _cb, action) {
    if (view) {
      logger('   -> `animate` View')
      params.view = view
      params.playing = true

      const animation = Ti.UI.createAnimation(args)
      const onComplete = (event) => {
        checkComplete(view, action)
        if (typeof _cb === 'function') {
          _cb(event)
        } else {
          logger('Animation complete on object: ' + JSON.stringify(args))
        }
        params.playing = false
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
      const state = params.open ? 'open' : 'close'
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
