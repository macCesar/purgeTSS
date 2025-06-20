import { processProperties, processComments, addNegativeValues } from './utils.js'

/**
 * Animation curve property for transitions
 * @returns {string} Generated styles
 */
export function curve() {
  let convertedStyles = processProperties({
    prop: 'curve',
    modules: 'Ti.UI.Animation'
  }, {
    ease: '{ curve: {value} }'
  }, {
    default: {
      in: 'Ti.UI.ANIMATION_CURVE_EASE_IN',
      out: 'Ti.UI.ANIMATION_CURVE_EASE_OUT',
      linear: 'Ti.UI.ANIMATION_CURVE_LINEAR',
      'in-out': 'Ti.UI.ANIMATION_CURVE_EASE_IN_OUT'
    }
  })

  convertedStyles += processProperties('debug', {
    debug: '{ debug: {value} }'
  }, {
    default: {
      default: true
    }
  })

  return convertedStyles
}

/**
 * Transition delay property
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function transitionDelay(modifiersAndValues) {
  return processProperties({
    prop: 'delay',
    modules: 'Ti.UI.Animation'
  }, {
    delay: '{ delay: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Transition duration property
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function transitionDuration(modifiersAndValues) {
  return processProperties({
    prop: 'duration',
    modules: 'Ti.UI.Animation, Ti.UI.ImageView'
  }, {
    default: '{ duration: {value} }'
  }, {
    default: {
      duration: modifiersAndValues
    }
  })
}

/**
 * Duration property for notifications (Android only)
 * @returns {string} Generated styles
 */
export function duration() {
  return processProperties({
    prop: 'duration - Android Only',
    modules: 'Ti.UI.Notification'
  }, {
    'notification-duration': '{ duration: {value} }'
  }, {
    android: {
      long: 'Ti.UI.NOTIFICATION_DURATION_LONG',
      short: 'Ti.UI.NOTIFICATION_DURATION_SHORT'
    }
  })
}

/**
 * Animation repeat property
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function repeat(modifiersAndValues) {
  return processProperties({
    prop: 'repeat',
    modules: 'Ti.UI.Animation'
  }, {
    repeat: '{ repeat: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Animation repeat count property
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function repeatCount(modifiersAndValues) {
  return processProperties({
    prop: 'repeatCount',
    modules: 'Ti.UI.Animation'
  }, {
    'repeat-count': '{ repeatCount: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Animation autoreverse property
 * @returns {string} Generated styles
 */
export function autoreverse() {
  return processProperties({
    prop: 'autoreverse',
    modules: 'Ti.UI.Animation'
  }, {
    default: '{ autoreverse: {value} }'
  }, {
    default: {
      autoreverse: true,
      'no-autoreverse': false
    }
  })
}

/**
 * Rotation transform property
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function rotate(modifiersAndValues) {
  let classes = processProperties({
    prop: 'rotate',
    modules: 'For the Animation Component'
  }, {
    rotate: '{ rotate: {value} }'
  }, {
    default: modifiersAndValues
  })

  modifiersAndValues = addNegativeValues(modifiersAndValues)

  classes += processProperties({
    prop: 'rotate ( Negative values )',
    modules: 'For the Animation Component'
  }, {
    '-rotate': '{ rotate: {value} }'
  }, {
    default: modifiersAndValues
  })

  return classes
}

export function negativeRotate(modifiersAndValues) {
  modifiersAndValues = addNegativeValues(modifiersAndValues)
  return processProperties({
    prop: 'rotate ( Negative values )',
    modules: 'For the Animation Component'
  }, {
    '-rotate': '{ rotate: {value} }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Scale transform property
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function scale(modifiersAndValues) {
  if (modifiersAndValues) {
    modifiersAndValues[1] = '.01'
  }

  return processProperties({
    prop: 'scale',
    modules: 'MatrixCreationDict'
  }, {
    scale: '{ scale: \'{value}\' }'
  }, { default: modifiersAndValues })
}

/**
 * Flip transform property
 * @returns {string} Generated styles
 */
export function flip() {
  return processProperties({
    prop: 'flip',
    modules: 'For the Animation Component'
  }, {
    flip: '{ flip: {value} }'
  }, {
    default: {
      horizontal: 'horizontal',
      vertical: 'vertical'
    }
  })
}

/**
 * Zoom in animation
 * @param {Object} modifiersAndValues - Modifier and value pairs
 * @returns {string} Generated styles
 */
export function zoomIn(modifiersAndValues) {
  return processProperties({
    prop: 'animationProperties - scales the view (in or out) and resets it to 100% when the animation completes',
    modules: 'Animation'
  }, {
    'zoom-in': '{ animationProperties: { open: { scale: {value} }, complete: { scale: 1 } } }',
    'zoom-out': '{ animationProperties: { close: { scale: {value} }, complete: { scale: 1 } } }'
  }, {
    default: modifiersAndValues
  })
}

/**
 * Toggle animation property
 * @returns {string} Generated styles
 */
export function toggle() {
  let convertedStyles = processComments({
    prop: 'toggle - For the Animation module',
    modules: 'Animation'
  })

  convertedStyles += '\'.opacity-to-0\': { opacity: 1, animationProperties: { open: { opacity: 0 }, close: { opacity: 1 } } }\n'
  convertedStyles += '\'.opacity-to-100\': { opacity: 0, animationProperties: { open: { opacity: 1 }, close: { opacity: 0 } } }\n'
  convertedStyles += '\'.toggle-visible\': { animationProperties: { open: { visible: true }, close: { visible: false } } }\n'

  return convertedStyles
}

/**
 * Dragging type property
 * @returns {string} Generated styles
 */
export function draggingType() {
  return processProperties({
    prop: 'draggingType',
    modules: 'For the Animation Component'
  }, {
    drag: '{ draggingType: {value} }'
  }, {
    default: {
      apply: 'apply',
      animate: 'animate'
    }
  })
}

/**
 * View shadow base property
 * @returns {string} Generated styles
 */
export function viewShadow() {
  return processProperties({
    prop: 'viewShadow',
    modules: 'Ti.UI.View'
  }, {
    shadow: '{ viewShadow: {value} }'
  }, {
    default: {
      none: null,
      sm: { shadowRadius: 2, shadowOffset: { x: 0, y: 1 } },
      default: { shadowRadius: 3, shadowOffset: { x: 0, y: 1 } },
      md: { shadowRadius: 6, shadowOffset: { x: 0, y: 4 } },
      lg: { shadowRadius: 15, shadowOffset: { x: 0, y: 10 } },
      xl: { shadowRadius: 25, shadowOffset: { x: 0, y: 20 } },
      '2xl': { shadowRadius: 50, shadowOffset: { x: 0, y: 25 } }
    }
  })
}

/**
 * View shadow for Android
 * @returns {string} Generated styles
 */
export function viewShadowAndroid() {
  return processProperties({
    prop: 'viewShadow - Android',
    modules: 'Ti.UI.View'
  }, {
    shadow: '{ viewShadow: {value} }'
  }, {
    android: {
      none: null,
      sm: { shadowRadius: 2, shadowOffset: { x: 0, y: 1 } },
      default: { shadowRadius: 3, shadowOffset: { x: 0, y: 1 } },
      md: { shadowRadius: 6, shadowOffset: { x: 0, y: 4 } },
      lg: { shadowRadius: 15, shadowOffset: { x: 0, y: 10 } },
      xl: { shadowRadius: 25, shadowOffset: { x: 0, y: 20 } },
      '2xl': { shadowRadius: 50, shadowOffset: { x: 0, y: 25 } }
    }
  })
}

/**
 * View shadow for iOS
 * @param {string} shadowValue - Shadow color value
 * @returns {string} Generated styles
 */
export function viewShadowIos(shadowValue = '#80000000') {
  let convertedStyles = processComments({
    prop: 'viewShadowOffset, viewShadowRadius, viewShadowColor - Box Shadow Effect in Tailwind - iOS Only',
    modules: 'Ti.UI.View'
  })

  convertedStyles += `'.shadow-xs[platform=ios]': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-sm[platform=ios]': { viewShadowOffset: { x: 0, y: 1 }, viewShadowRadius: 2, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow[platform=ios]': { viewShadowOffset: { x: 0, y: 2 }, viewShadowRadius: 4, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-md[platform=ios]': { viewShadowOffset: { x: 0, y: 3 }, viewShadowRadius: 6, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-lg[platform=ios]': { viewShadowOffset: { x: 0, y: 4 }, viewShadowRadius: 8, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-xl[platform=ios]': { viewShadowOffset: { x: 0, y: 6 }, viewShadowRadius: 12, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += `'.shadow-2xl[platform=ios]': { viewShadowOffset: { x: 0, y: 8 }, viewShadowRadius: 14, viewShadowColor: '${shadowValue}' }\n`

  convertedStyles += '\'.shadow-inner[platform=ios]\': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n'
  convertedStyles += `'.shadow-outline[platform=ios]': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 4, viewShadowColor: '${shadowValue}' }\n`
  convertedStyles += '\'.shadow-none[platform=ios]\': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }\n'

  return convertedStyles
}

/**
 * View shadow V6 compatibility
 * @param {string} shadowValue - Shadow color value
 * @returns {string} Generated styles
 */

export function activityEnterTransition() {
  return processProperties({
    prop: 'activityEnterTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activityEnterTransition: {value} }'
  }, {
    android: {
      'enter-transition': {
        explode: 'Ti.UI.Android.TRANSITION_EXPLODE',
        'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
        'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
        none: 'Ti.UI.Android.TRANSITION_NONE',
        'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
        'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
        'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
        'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP'
      }
    }
  })
}

export function activityExitTransition() {
  return processProperties({
    prop: 'activityExitTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activityExitTransition: {value} }'
  }, {
    android: {
      'exit-transition': {
        explode: 'Ti.UI.Android.TRANSITION_EXPLODE',
        'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
        'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
        none: 'Ti.UI.Android.TRANSITION_NONE',
        'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
        'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
        'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
        'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP'
      }
    }
  })
}

export function activityReenterTransition() {
  return processProperties({
    prop: 'activityReenterTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activityReenterTransition: {value} }'
  }, {
    android: {
      'reenter-transition': {
        explode: 'Ti.UI.Android.TRANSITION_EXPLODE',
        'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
        'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
        none: 'Ti.UI.Android.TRANSITION_NONE',
        'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
        'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
        'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
        'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP'
      }
    }
  })
}

export function activityReturnTransition() {
  return processProperties({
    prop: 'activityReturnTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activityReturnTransition: {value} }'
  }, {
    android: {
      'return-transition': {
        explode: 'Ti.UI.Android.TRANSITION_EXPLODE',
        'fade-in': 'Ti.UI.Android.TRANSITION_FADE_IN',
        'fade-out': 'Ti.UI.Android.TRANSITION_FADE_OUT',
        none: 'Ti.UI.Android.TRANSITION_NONE',
        'slide-bottom': 'Ti.UI.Android.TRANSITION_SLIDE_BOTTOM',
        'slide-left': 'Ti.UI.Android.TRANSITION_SLIDE_LEFT',
        'slide-right': 'Ti.UI.Android.TRANSITION_SLIDE_RIGHT',
        'slide-top': 'Ti.UI.Android.TRANSITION_SLIDE_TOP'
      }
    }
  })
}

export function activitySharedElementEnterTransition() {
  return processProperties({
    prop: 'activitySharedElementEnterTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activitySharedElementEnterTransition: {value} }'
  }, {
    android: {
      'shared-element-enter-transition': {
        'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
        'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
        'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
        'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
        none: 'Ti.UI.Android.TRANSITION_NONE'
      }
    }
  })
}

export function activitySharedElementExitTransition() {
  return processProperties({
    prop: 'activitySharedElementExitTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activitySharedElementExitTransition: {value} }'
  }, {
    android: {
      'shared-element-exit-transition': {
        'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
        'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
        'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
        'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
        none: 'Ti.UI.Android.TRANSITION_NONE'
      }
    }
  })
}

export function activitySharedElementReenterTransition() {
  return processProperties({
    prop: 'activitySharedElementReenterTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activitySharedElementReenterTransition: {value} }'
  }, {
    android: {
      'shared-element-reenter-transition': {
        'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
        'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
        'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
        'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
        none: 'Ti.UI.Android.TRANSITION_NONE'
      }
    }
  })
}

export function activitySharedElementReturnTransition() {
  return processProperties({
    prop: 'activitySharedElementReturnTransition - Android Only',
    modules: 'Ti.UI.Window'
  }, {
    activity: '{ activitySharedElementReturnTransition: {value} }'
  }, {
    android: {
      'shared-element-return-transition': {
        'change-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_BOUNDS',
        'change-clip-bounds': 'Ti.UI.Android.TRANSITION_CHANGE_CLIP_BOUNDS',
        'change-transform': 'Ti.UI.Android.TRANSITION_CHANGE_TRANSFORM',
        'change-image-transform': 'Ti.UI.Android.TRANSITION_CHANGE_IMAGE_TRANSFORM',
        none: 'Ti.UI.Android.TRANSITION_NONE'
      }
    }
  })
}
export function viewShadowV6(shadowValue = '#80000000') {
  let convertedStyles = processComments({
    prop: 'iOS: viewShadowOffset, viewShadowRadius, viewShadowColor, Android: elevation - Box Shadow Effect in Tailwind',
    modules: 'iOS: Ti.UI.View, Android: Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.View'
  })

  convertedStyles += `'.shadow-xs': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: '${shadowValue}', elevation: 4 }\n`
  convertedStyles += `'.shadow-sm': { viewShadowOffset: { x: 0, y: 1 }, viewShadowRadius: 2, viewShadowColor: '${shadowValue}', elevation: 8 }\n`
  convertedStyles += `'.shadow': { viewShadowOffset: { x: 0, y: 2 }, viewShadowRadius: 4, viewShadowColor: '${shadowValue}', elevation: 16 }\n`
  convertedStyles += `'.shadow-md': { viewShadowOffset: { x: 0, y: 3 }, viewShadowRadius: 6, viewShadowColor: '${shadowValue}', elevation: 24 }\n`
  convertedStyles += `'.shadow-lg': { viewShadowOffset: { x: 0, y: 4 }, viewShadowRadius: 8, viewShadowColor: '${shadowValue}', elevation: 26 }\n`
  convertedStyles += `'.shadow-xl': { viewShadowOffset: { x: 0, y: 6 }, viewShadowRadius: 12, viewShadowColor: '${shadowValue}', elevation: 34 }\n`
  convertedStyles += `'.shadow-2xl': { viewShadowOffset: { x: 0, y: 8 }, viewShadowRadius: 14, viewShadowColor: '${shadowValue}', elevation: 38 }\n`

  convertedStyles += '\'.shadow-inner\': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null, elevation: 0 }\n'
  convertedStyles += `'.shadow-outline': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 4, viewShadowColor: '${shadowValue}', elevation: 16 }\n`
  convertedStyles += '\'.shadow-none\': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null, elevation: 0 }\n'

  return convertedStyles
}

/**
 * Transition property
 * @returns {string} Generated styles
 */
export function transition() {
  return processProperties({
    modules: 'Ti.UI.Animation',
    prop: 'transition - iOS Only'
  }, {
    'animation-style': '{ transition: {value} }'
  }, {
    ios: {
      'curl-down': 'Ti.UI.iOS.AnimationStyle.CURL_DOWN',
      'curl-up': 'Ti.UI.iOS.AnimationStyle.CURL_UP',
      'flip-from-left': 'Ti.UI.iOS.AnimationStyle.FLIP_FROM_LEFT',
      'flip-from-right': 'Ti.UI.iOS.AnimationStyle.FLIP_FROM_RIGHT',
      'flip-from-top': 'Ti.UI.iOS.AnimationStyle.FLIP_FROM_TOP',
      'flip-from-bottom': 'Ti.UI.iOS.AnimationStyle.FLIP_FROM_BOTTOM',
      'cross-dissolve': 'Ti.UI.iOS.AnimationStyle.CROSS_DISSOLVE',
      none: 'Ti.UI.iOS.AnimationStyle.NONE'
    }
  })
}
