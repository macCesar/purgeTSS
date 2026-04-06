// Created by César Estrada
// https://purgetss.com

function Animation(args = {}) {
  const params = {
    // Global
    id: args.id,
    debug: args.debug ?? false,
    isIOS: Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad',

    // Play / Toggle / Sequence
    open: false,
    playing: false,
    delay: args.delay ?? 0,
    hasTransformation: (args.scale !== undefined || args.rotate !== undefined),

    // Draggable
    draggables: [],

    // Collision Detection
    collisionViews: [],
    dragCB: null,
    dropCB: null,
    lastHoverTarget: null,
    lastKnownTarget: null
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

  animationView.detectCollisions = (views, _dragCB, _dropCB) => {
    if (params.debug) { console.log('') }
    logger('`detectCollisions` method called on: ' + params.id)
    if (_dragCB) params.dragCB = _dragCB
    if (_dropCB) params.dropCB = _dropCB
    const arr = Array.isArray(views) ? views : [views]
    arr.forEach(view => {
      view._collisionEnabled = true
      if (!params.collisionViews.includes(view)) {
        params.collisionViews.push(view)
      }
    })
  }

  function resolvePosition(view) {
    if (view._originTop !== undefined) return { top: view._originTop, left: view._originLeft }
    if (view.top !== undefined && view.top !== null && view.left !== undefined && view.left !== null) return { top: view.top, left: view.left }
    const r = view.rect
    return { top: r.y, left: r.x }
  }

  function normalizePosition(view) {
    const pos = resolvePosition(view)
    view.applyProperties({ top: pos.top, left: pos.left, right: null, bottom: null })
    view._originTop = pos.top
    view._originLeft = pos.left
  }

  animationView.swap = (view1, view2) => {
    if (params.debug) { console.log('') }
    logger('`swap` method called on: ' + params.id)

      // Cancel any pending bounce-back animations
      ;[view1, view2].forEach(v => {
        if (v._bouncingBack) {
          logger(`   -> cancelling bounce-back for ${v.id} before swap`)
          v.applyProperties({ top: v._originTop, left: v._originLeft, transform: Ti.UI.createMatrix2D() })
          v._bouncingBack = false
        }
      })

    // Read REAL positions — rect gives actual rendered position, no stale variables
    const targetRect = view2.rect
    const sourceHome = { top: view1._originTop ?? view1.top, left: view1._originLeft ?? view1.left }

    // Source goes to target's real position, target goes to source's home
    const dest1Top = targetRect.y
    const dest1Left = targetRect.x
    const dest2Top = sourceHome.top
    const dest2Left = sourceHome.left

    logger(`   -> ${view1.id}: home(${sourceHome.top}, ${sourceHome.left}) → dest(${dest1Top}, ${dest1Left})`)
    logger(`   -> ${view2.id}: rect(${targetRect.y}, ${targetRect.x}) → dest(${dest2Top}, ${dest2Left})`)

    const maxZ = params.draggables.length
    view1.zIndex = maxZ + 1
    view2.zIndex = maxZ

    view1.animate({
      ...args, left: dest1Left, top: dest1Top, transform: Ti.UI.createMatrix2D()
    }, () => {
      view1.applyProperties({ left: dest1Left, top: dest1Top, transform: Ti.UI.createMatrix2D() })
      params.draggables.forEach((d, k) => { d.zIndex = k })
    })

    view2.animate({
      ...args, left: dest2Left, top: dest2Top
    }, () => {
      view2.applyProperties({ left: dest2Left, top: dest2Top })
    })

    view1._originTop = dest1Top
    view1._originLeft = dest1Left
    view2._originTop = dest2Top
    view2._originLeft = dest2Left
  }

  animationView.sequence = (_views, _cb) => {
    if (params.debug) { console.log('') }
    logger('`sequence` method called on: ' + params.id)
    const views = Array.isArray(_views) ? _views : [_views]
    const total = views.length

    params.open = !params.open
    chooseAnimationBasedOnState('play')

    function animateNext(index) {
      if (index >= total) { return }
      const isLast = index === total - 1
      playView(views[index], (e) => {
        if (isLast && typeof _cb === 'function') {
          _cb(e)
        } else {
          animateNext(index + 1)
        }
      }, 'play', index, total)
    }

    animateNext(0)
  }

  animationView.shake = (view, intensity = 10) => {
    if (params.debug) { console.log('') }
    logger('`shake` method called on: ' + params.id)
    if (!view) { return notFound() }

    view.applyProperties({ transform: Ti.UI.createMatrix2D().translate(-intensity, 0) })

    view.animate({
      ...args,
      transform: Ti.UI.createMatrix2D().translate(intensity, 0),
      duration: Math.round((args.duration ?? 400) / 6),
      autoreverse: true,
      repeat: 3,
      curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
    }, () => {
      view.applyProperties({ transform: Ti.UI.createMatrix2D() })
    })
  }

  animationView.pulse = (view, count = 1) => {
    if (params.debug) { console.log('') }
    logger('`pulse` method called on: ' + params.id)
    if (!view) { return notFound() }

    view.animate({
      ...args,
      transform: args.transform ?? Ti.UI.createMatrix2D().scale(1.2),
      autoreverse: true,
      repeat: count,
      curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
    }, () => {
      view.applyProperties({ transform: Ti.UI.createMatrix2D() })
    })
  }

  animationView.snapTo = (view, targets) => {
    if (params.debug) { console.log('') }
    logger('`snapTo` method called on: ' + params.id)
    if (!view) { return notFound() }

    const arr = Array.isArray(targets) ? targets : [targets]
    const vr = view.rect
    const vcx = (view._visualLeft ?? view.left) + vr.width / 2
    const vcy = (view._visualTop ?? view.top) + vr.height / 2

    let closest = null
    let minDist = Infinity

    arr.forEach(target => {
      if (target === view) { return }
      const tr = target.rect
      const tcx = tr.x + tr.width / 2
      const tcy = tr.y + tr.height / 2
      const dist = Math.sqrt((vcx - tcx) ** 2 + (vcy - tcy) ** 2)
      if (dist < minDist) {
        minDist = dist
        closest = target
      }
    })

    if (!closest) { return null }

    const cr = closest.rect
    normalizePosition(closest)
    const destLeft = closest._originLeft + (cr.width - vr.width) / 2
    const destTop = closest._originTop + (cr.height - vr.height) / 2

    view.animate({
      ...args, left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D()
    }, () => {
      view.applyProperties({ left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D() })
    })

    view._originTop = destTop
    view._originLeft = destLeft

    return closest
  }

  animationView.reorder = (views, newOrder) => {
    if (params.debug) { console.log('') }
    logger('`reorder` method called on: ' + params.id)
    const arr = Array.isArray(views) ? views : [views]
    if (newOrder.length !== arr.length) { return }

    arr.forEach(v => normalizePosition(v))

    const positions = arr.map(v => ({
      left: v._originLeft,
      top: v._originTop
    }))

    arr.forEach((view, i) => {
      const dest = positions[newOrder[i]]

      view.animate({
        ...args, left: dest.left, top: dest.top, transform: Ti.UI.createMatrix2D()
      }, () => {
        view.applyProperties({ left: dest.left, top: dest.top, transform: Ti.UI.createMatrix2D() })
      })

      view._originTop = dest.top
      view._originLeft = dest.left
    })
  }

  animationView.undraggable = (_views) => {
    if (params.debug) { console.log('') }
    logger('`undraggable` method called on: ' + params.id)
    const arr = Array.isArray(_views) ? _views : [_views]

    arr.forEach(view => {
      if (view._dragListeners) {
        view.removeEventListener('touchstart', view._dragListeners.onTouchStart)
        view.removeEventListener('touchend', view._dragListeners.onTouchEnd)
        view.removeEventListener('touchmove', view._dragListeners.onTouchMove)
        Ti.Gesture.removeEventListener('orientationchange', view._dragListeners.onOrientationChange)
        delete view._dragListeners
      }

      const idx = params.draggables.indexOf(view)
      if (idx !== -1) { params.draggables.splice(idx, 1) }

      const cIdx = params.collisionViews.indexOf(view)
      if (cIdx !== -1) { params.collisionViews.splice(cIdx, 1) }

      delete view._originTop
      delete view._originLeft
      delete view._visualTop
      delete view._visualLeft
      delete view._collisionEnabled
      delete view._bouncingBack
    })
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

  // Mac Catalyst note: Parent containers of transitioned views should use fixed
  // dimensions (not Ti.UI.FILL). Resizable containers trigger a UIKit re-layout
  // that distorts views with rotated Matrix2D transforms.
  animationView.transition = (views, layouts) => {
    if (params.debug) { console.log('') }
    logger('`transition` method called on: ' + params.id)

    const arr = Array.isArray(views) ? views : [views]

    arr.forEach((view, i) => {
      const layout = layouts[i]

      if (!layout) {
        view.animate(Ti.UI.createAnimation({ ...args, zIndex: 0, opacity: 0 }), () => {
          view.applyProperties({ zIndex: 0, opacity: 0, transform: Ti.UI.createMatrix2D(), translation: { x: 0, y: 0 }, rotate: 0, scale: 1 })
        })
        return
      }

      const tx = layout.translation?.x ?? 0
      const ty = layout.translation?.y ?? 0
      const rotate = layout.rotate ?? 0
      const scale = layout.scale ?? 1

      const transform = Ti.UI.createMatrix2D().translate(tx, ty).rotate(rotate).scale(scale)

      const needsFadeIn = view.opacity === 0

      if (layout.zIndex !== undefined) view.zIndex = layout.zIndex

      const animation = Ti.UI.createAnimation({
        ...args,
        transform
      })

      if (needsFadeIn) animation.opacity = 1
      if (layout.width !== undefined) animation.width = layout.width
      if (layout.height !== undefined) animation.height = layout.height
      if (layout.opacity !== undefined) animation.opacity = layout.opacity

      view.animate(animation, () => {
        const props = { transform, translation: { x: tx, y: ty }, rotate, scale, zIndex: layout.zIndex }
        if (needsFadeIn) props.opacity = 1
        view.applyProperties(props)
      })
    })
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

    const applyOrPlayView = (view, index = 0, total = 1) => {
      action === 'play' ? playView(view, _cb, action, index, total) : applyView(view, _cb, action, index, total)
    }

    if (Array.isArray(_views)) {
      args.delay = params.delay
      _views.forEach((view, index) => {
        applyOrPlayView(view, index, _views.length)
        args.delay += params.delay
      })
    } else {
      applyOrPlayView(_views, 0, 1)
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

      const onTouchStart = (event) => {
        offsetX = event.x
        offsetY = event.y
        draggableView._wasDragged = false

        // If a bounce-back animation is still running, complete it immediately
        if (draggableView._bouncingBack) {
          logger(`   -> completing pending bounce-back for ${draggableView.id}`)
          draggableView.applyProperties({
            top: draggableView._originTop,
            left: draggableView._originLeft,
            transform: Ti.UI.createMatrix2D()
          })
          draggableView._bouncingBack = false
        }

        updateDraggableZIndex(event)
        checkDraggable(draggableView, 'drag')

        if (draggableView._collisionEnabled) {
          if (draggableView._originTop === undefined) {
            draggableView._originTop = draggableView.top
            draggableView._originLeft = draggableView.left
            logger(`   -> touchStart origin capture (first): ${draggableView.id} top=${draggableView.top} left=${draggableView.left}`)
          } else {
            logger(`   -> touchStart origin kept: ${draggableView.id} origin=(${draggableView._originTop}, ${draggableView._originLeft}) vs top/left=(${draggableView.top}, ${draggableView.left})`)
          }
        }
      }

      const onTouchEnd = () => {
        checkDraggable(draggableView, 'drop')

        // Android: consolidate transform after drag so transition reads correct state
        if (!params.isIOS && draggableView.translation) {
          const { translation, rotate, scale } = draggableView
          draggableView.applyProperties({
            translation, rotate, scale,
            transform: Ti.UI.createMatrix2D().translate(translation.x, translation.y).rotate(rotate ?? 0).scale(scale ?? 1)
          })
        }

        if (draggableView._collisionEnabled) {
          const directTarget = checkCollision(draggableView)
          const target = directTarget ?? params.lastKnownTarget
          logger(`   -> collision check: ${draggableView.id} | direct: ${directTarget?.id ?? 'null'} | lastKnown: ${params.lastKnownTarget?.id ?? 'null'} | final: ${target?.id ?? 'null'}`)
          if (target) {
            // On Android, consolidate drag position before snap to avoid animation conflict
            if (!params.isIOS) {
              draggableView.applyProperties({
                top: draggableView._visualTop ?? draggableView.top,
                left: draggableView._visualLeft ?? draggableView.left
              })
            }
            if (args.animationProperties?.snap?.center) {
              logger(`   -> snap-center: ${draggableView.id} to ${target.id}`)
              animationView.snapTo(draggableView, [target])
            }
            if (params.dropCB) {
              logger(`   -> dropCB: ${draggableView.id} on ${target.id}`)
              params.dropCB(draggableView, target)
            }
          } else if (!target && args.animationProperties?.snap?.back) {
            logger(`   -> bounce-back: ${draggableView.id} to (${draggableView._originTop}, ${draggableView._originLeft})`)

            // On Android, consolidate drag position before bounce-back to avoid animation conflict
            if (!params.isIOS) {
              draggableView.applyProperties({
                top: draggableView._visualTop ?? draggableView.top,
                left: draggableView._visualLeft ?? draggableView.left
              })
            }

            draggableView._bouncingBack = true

            draggableView.animate({
              ...args,
              top: draggableView._originTop,
              left: draggableView._originLeft,
              transform: Ti.UI.createMatrix2D()
            }, () => {
              draggableView._bouncingBack = false
              draggableView.applyProperties({
                top: draggableView._originTop,
                left: draggableView._originLeft,
                transform: Ti.UI.createMatrix2D()
              })
              logger(`   -> bounce-back complete: ${draggableView.id}`)
            })
          }
          params.lastHoverTarget = null
          params.lastKnownTarget = null
          if (params.dragCB) {
            params.dragCB(draggableView, null)
          }
        }
      }

      const onTouchMove = (event) => handleTouchMove(event, draggableView, offsetX, offsetY)
      const onOrientationChange = () => checkBoundaries(draggableView)

      draggableView._dragListeners = { onTouchStart, onTouchEnd, onTouchMove, onOrientationChange }

      draggableView.addEventListener('touchend', onTouchEnd)
      draggableView.addEventListener('touchmove', onTouchMove)
      draggableView.addEventListener('touchstart', onTouchStart)
      Ti.Gesture.addEventListener('orientationchange', onOrientationChange)

      params.draggables.push(draggableView)
    } else {
      notFound()
    }
  }

  function handleTouchMove(event, draggableView, offsetX, offsetY) {
    draggableView._wasDragged = true
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

    draggableView._visualTop = top
    draggableView._visualLeft = left

    if (params.isIOS) {
      const r = draggableView.rotate ?? 0
      const s = draggableView.scale ?? 1

      if (r !== 0 || s !== 1) {
        // Delta-based drag for transformed views (preserves rotate/scale)
        const translation = draggableView.translation ?? { x: 0, y: 0 }
        const deltaX = Math.round((event.x - offsetX) * s)
        const deltaY = Math.round((event.y - offsetY) * s)
        translation.x += deltaX
        translation.y += deltaY
        draggableView.applyProperties({
          translation, rotate: r, scale: s,
          transform: Ti.UI.createMatrix2D().translate(translation.x, translation.y).rotate(r).scale(s)
        })
      } else {
        // Standard drag for non-transformed views
        const { x, y } = calculateTranslation(draggableView, draggableView.parent.rect, left, top)
        draggableView.applyProperties({ duration: 0, transform: Ti.UI.createMatrix2D().translate(x, y) })
      }
    } else {
      const r = draggableView.rotate ?? 0
      const s = draggableView.scale ?? 1

      if (r !== 0 || s !== 1) {
        // Delta-based drag for transformed views on Android
        const translation = draggableView.translation ?? { x: 0, y: 0 }
        const deltaX = Math.round((event.x - offsetX) * s)
        const deltaY = Math.round((event.y - offsetY) * s)
        translation.x += deltaX
        translation.y += deltaY
        draggableView.animate(Ti.UI.createAnimation({
          transform: Ti.UI.createMatrix2D().translate(translation.x, translation.y).rotate(r).scale(s),
          duration: 0
        }))
        draggableView.translation = translation
        draggableView.rotate = r
        draggableView.scale = s
      } else {
        draggableView.animate(Ti.UI.createAnimation({ top, left, duration: 0 }))
      }
    }

    if (draggableView._collisionEnabled && params.dragCB) {
      try {
        const target = checkCollision(draggableView)
        if (target) { params.lastKnownTarget = target }
        if (target !== params.lastHoverTarget) {
          params.lastHoverTarget = target
          params.dragCB(draggableView, target)
        }
      } catch (e) {
        logger(`   !! collision error in touchmove: ${e.message}`)
      }
    }
  }

  function calculateTranslation(draggableView, parentViewRect, left, top) {
    let x = left - parentViewRect.width / 2 + draggableView.rect.width / 2
    let y = top - parentViewRect.height / 2 + draggableView.rect.height / 2

    if (draggableView.left != null) {
      x = left - draggableView.left
    } else if (draggableView.right != null) {
      x = left - (parentViewRect.width - draggableView.right - draggableView.rect.width)
    }

    if (draggableView.top != null) {
      y = top - draggableView.top
    } else if (draggableView.bottom != null) {
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
    if (args.animationProperties?.keepZIndex) return

    const source = realSourceView(event.source)
    const idx = params.draggables.indexOf(source)
    if (idx !== -1) {
      params.draggables.push(params.draggables.splice(idx, 1)[0])
      params.draggables.forEach((draggable, key) => { draggable.zIndex = key })
    }
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

  function checkCollision(draggableView) {
    const top = draggableView._visualTop
    const left = draggableView._visualLeft
    if (left === null || left === undefined || top === null || top === undefined) {
      return null
    }

    const cy = top + draggableView.rect.height / 2
    const cx = left + draggableView.rect.width / 2

    for (const other of params.collisionViews) {
      if (other === draggableView) { continue }
      const r = other.rect
      if (cx > r.x && cx < r.x + r.width && cy > r.y && cy < r.y + r.height) {
        return other
      }
    }
    return null
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

  function playView(view, _cb, action, index = 0, total = 1) {
    if (view) {
      logger('   -> `animate` View')
      params.view = view
      params.playing = true

      const animation = Ti.UI.createAnimation(args)
      const onComplete = (event) => {
        checkComplete(view, action)
        params.playing = false
        if (typeof _cb === 'function') {
          const enrichedEvent = {
            // Safe properties from the original event
            type: event.type,
            bubbles: event.bubbles,
            cancelBubble: event.cancelBubble,
            // Added properties (primitives only)
            action,                             // 'play'
            state: params.open ? 'open' : 'close',
            id: params.id,
            targetId: view.id || 'unknown',     // View ID only, not the object
            index,
            total,
            // Helper method to get the view
            getTarget: () => view
          }
          _cb(enrichedEvent)
        } else {
          logger('Animation complete on object: ' + JSON.stringify(args))
        }
      }

      animation.addEventListener('complete', onComplete)
      view.animate(animation)

      innerAnimations(view, action)
    } else {
      notFound()
    }
  }

  function applyView(view, _cb, action, index = 0, total = 1) {
    if (view) {
      logger('   -> `apply` View')
      view.applyProperties(args)
      innerAnimations(view, action)
      checkComplete(view, action)
      params.playing = false
      if (typeof _cb === 'function') {
        const enrichedEvent = {
          type: 'applied',
          bubbles: false,
          cancelBubble: false,
          // Added properties (primitives only)
          action,                             // 'apply'
          state: params.open ? 'open' : 'close',
          id: params.id,
          targetId: view.id || 'unknown',     // View ID only, not the object
          index,
          total,
          // Helper method to get the view
          getTarget: () => view
        }
        _cb(enrichedEvent)
      }
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

  // Classic-compatible detection (no Alloy dependency)
  const isTablet = platform.osname === 'ipad'
  const isHandheld = ['iphone', 'android'].includes(platform.osname) && !isTablet

  console.warn(`
  version: ${platform.version}
  name: ${platform.name}
  isTablet: ${isTablet}
  isHandheld: ${isHandheld}
  model: ${platform.model}
  locale: ${platform.locale}
  osname: ${platform.osname}
  ostype: ${platform.ostype}
  username: ${platform.username}
  manufacturer: ${platform.manufacturer}
  architecture: ${platform.architecture}
  availableMemory: ${platform.availableMemory}
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
