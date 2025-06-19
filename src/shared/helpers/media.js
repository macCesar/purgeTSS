import _ from 'lodash'
import { processProperties, processComments, removeFractions, parseValue } from './utils.js'

/**
 * PurgeTSS Media Module
 *
 * Funciones relacionadas con multimedia, imágenes, videos,
 * gradientes, cacheo y contenido web.
 *
 * @since 6.0.0
 */

// Importar utilidades compartidas

/**
 * Permite vista previa de enlaces
 * @returns {object} Configuración CSS
 */
export function allowsLinkPreview() {
  return processProperties({
    prop: 'allowsLinkPreview - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ allowsLinkPreview: {value} }'
  }, {
    ios: {
      'allows-link-preview': true,
      'dont-allow-link-preview': false
    }
  })
}

/**
 * Auto-rotación para ImageView
 * @returns {object} Configuración CSS
 */
export function autorotate() {
  return processProperties({
    prop: 'autorotate',
    modules: 'Ti.UI.ImageView'
  }, {
    default: '{ autorotate: {value} }'
  }, {
    default: {
      autorotate: true,
      'dont-autorotate': false
    }
  })
}

/**
 * Modo de mezcla de fondo para imágenes
 * @returns {object} Configuración CSS
 */
export function backgroundBlendMode() {
  return ''
}

/**
 * Gradiente lineal de fondo
 * @returns {string} CSS generado
 */
export function backgroundLinearGradient() {
  let convertedStyles = processComments({
    prop: 'backgroundGradient - Linear',
    modules: 'Ti.UI.MaskedImage'
  })

  convertedStyles += '\'.bg-linear\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'50%\', y: \'100%\' }, endPoint: { x: \'50%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-t\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'100%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-tr\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'100%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-r\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-br\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'100%\' }, endPoint: { x: \'0%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-b\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'100%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-bl\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'100%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-l\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-linear-to-tl\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'100%\', y: \'100%\' } } }\n'

  convertedStyles += processComments({
    prop: 'backgroundGradient - Gradient',
    modules: 'Ti.UI.MaskedImage'
  })

  convertedStyles += '\'.bg-gradient\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'50%\', y: \'100%\' }, endPoint: { x: \'50%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-t\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'100%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-tr\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'100%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-r\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'0%\' }, endPoint: { x: \'0%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-br\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'100%\' }, endPoint: { x: \'0%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-b\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'100%\', y: \'100%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-bl\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'100%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-l\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'100%\', y: \'0%\' } } }\n'
  convertedStyles += '\'.bg-gradient-to-tl\': { backgroundGradient: { type: \'linear\', backfillStart: true, startPoint: { x: \'0%\', y: \'0%\' }, endPoint: { x: \'100%\', y: \'100%\' } } }\n'

  return convertedStyles
}

/**
 * Gradiente radial de fondo (iOS)
 * @returns {string} CSS generado
 */
export function backgroundRadialGradient() {
  let convertedStyles = processComments({
    prop: 'backgroundGradient: type, startRadius, endRadius, backfillStart, backfillEnd - iOS Only',
    modules: 'Ti.UI.ListItem, Ti.UI.View'
  })

  convertedStyles += `'.bg-radial': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '125%', endRadius: '0%' } }\n`
  convertedStyles += `'.bg-radial-to-b': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '50%', y: '0%' }, endPoint: { x: '50%', y: '0%' } } }\n`
  convertedStyles += `'.bg-radial-to-bl': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '100%', y: '0%' } } }\n`
  convertedStyles += `'.bg-radial-to-l': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '100%', y: '50%' }, endPoint: { x: '100%', y: '50%' } } }\n`
  convertedStyles += `'.bg-radial-to-tl': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '100%' } } }\n`
  convertedStyles += `'.bg-radial-to-t': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '50%', y: '100%' }, endPoint: { x: '50%', y: '100%' } } }\n`
  convertedStyles += `'.bg-radial-to-tr': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '0%', y: '100%' } } }\n`
  convertedStyles += `'.bg-radial-to-r': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '0%', y: '50%' }, endPoint: { x: '0%', y: '50%' } } }\n`
  convertedStyles += `'.bg-radial-to-br': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '0%' } } }\n`

  return convertedStyles
}

/**
 * Repetición de fondo
 * @returns {object} Configuración CSS
 */
export function backgroundRepeat() {
  return processProperties({
    prop: 'backgroundRepeat',
    modules: 'Ti.UI.View'
  }, {
    default: '{ backgroundRepeat: {value} }'
  }, {
    default: {
      'bg-repeat': true,
      'bg-dont-repeat': false,
      'background-repeat': true,
      'background-dont-repeat': false
    }
  })
}

/**
 * Modo de caché para imágenes
 * @returns {object} Configuración CSS
 */
export function cacheMode() {
  return processProperties({
    prop: 'cacheMode - iOS Only',
    modules: 'Ti.UI.ImageView'
  }, {
    'cache-mode': '{ cacheMode: {value} }'
  }, {
    ios: {
      default: 'Ti.UI.iOS.CACHE_POLICY_DEFAULT',
      'reload-ignoring-local-cache': 'Ti.UI.iOS.CACHE_POLICY_RELOAD_IGNORING_LOCAL_CACHE_DATA',
      'return-cache-data-else-load': 'Ti.UI.iOS.CACHE_POLICY_RETURN_CACHE_DATA_ELSE_LOAD',
      'return-cache-data-dont-load': 'Ti.UI.iOS.CACHE_POLICY_RETURN_CACHE_DATA_DONT_LOAD'
    }
  })
}

/**
 * Política de caché para WebView
 * @returns {object} Configuración CSS
 */
export function cachePolicy() {
  return processProperties({
    prop: 'cachePolicy - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    'cache-policy': '{ cachePolicy: {value} }'
  }, {
    ios: {
      'use-protocol-cache-policy': 'Ti.UI.iOS.CACHE_POLICY_USE_PROTOCOL_CACHE_POLICY',
      'reload-ignoring-local-cache-data': 'Ti.UI.iOS.CACHE_POLICY_RELOAD_IGNORING_LOCAL_CACHE_DATA',
      'return-cache-data-else-load': 'Ti.UI.iOS.CACHE_POLICY_RETURN_CACHE_DATA_ELSE_LOAD',
      'return-cache-data-dont-load': 'Ti.UI.iOS.CACHE_POLICY_RETURN_CACHE_DATA_DONT_LOAD'
    }
  })
}

/**
 * Imágenes de alta resolución (iOS)
 * @returns {object} Configuración CSS
 */
export function hires() {
  return processProperties({
    prop: 'hires - iOS Only',
    modules: 'Ti.UI.ImageView. Ti.UI.WebView'
  }, {
    default: '{ hires: {value} }'
  }, {
    ios: {
      hires: true,
      lowres: false
    }
  })
}

/**
 * Ignora errores SSL en WebView
 * @returns {object} Configuración CSS
 */
export function ignoreSslError() {
  return processProperties({
    prop: 'ignoreSslError',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ ignoreSslError: {value} }'
  }, {
    default: {
      'ignore-ssl-error': true,
      'dont-ignore-ssl-error': false
    }
  })
}

/**
 * Feedback táctil en imágenes (Android)
 * @returns {object} Configuración CSS
 */
export function imageTouchFeedback() {
  return processProperties({
    prop: 'imageTouchFeedback - Android Only',
    modules: 'Ti.UI.ImageView'
  }, {
    default: '{ imageTouchFeedback: {value} }'
  }, {
    android: {
      'image-touch-feedback': true,
      'no-image-touch-feedback': false
    }
  })
}

/**
 * Modo de contenido mixto en WebView (Android)
 * @returns {object} Configuración CSS
 */
export function mixedContentMode() {
  return processProperties({
    prop: 'mixedContentMode - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    'mixed-content-mode': '{ mixedContentMode: {value} }'
  }, {
    android: {
      'never-allow': 'Ti.UI.Android.MIXED_CONTENT_NEVER_ALLOW',
      'always-allow': 'Ti.UI.Android.MIXED_CONTENT_ALWAYS_ALLOW',
      'compatibility-mode': 'Ti.UI.Android.MIXED_CONTENT_COMPATIBILITY_MODE'
    }
  })
}

/**
 * Previene imagen por defecto
 * @returns {object} Configuración CSS
 */
export function preventDefaultImage() {
  return processProperties({
    prop: 'preventDefaultImage',
    modules: 'Ti.UI.ImageView'
  }, {
    default: '{ preventDefaultImage: {value} }'
  }, {
    default: {
      'prevent-default-image': true,
      'allow-default-image': false
    }
  })
}

/**
 * Reproduce en reversa
 * @returns {object} Configuración CSS
 */
export function reverse() {
  return processProperties({
    prop: 'reverse',
    modules: 'Ti.UI.ImageView'
  }, {
    default: '{ reverse: {value} }'
  }, {
    default: {
      reverse: true,
      'no-reverse': false
    }
  })
}

/**
 * Escala página para ajustar en WebView
 * @returns {object} Configuración CSS
 */
export function scalesPageToFit() {
  return processProperties({
    prop: 'scalesPageToFit',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ scalesPageToFit: {value} }'
  }, {
    default: {
      'scales-page-to-fit': true,
      'dont-scale-page-to-fit': false
    }
  })
}

/**
 * Funciones multimedia de Titanium
 * @param {boolean} legacy - Usar modo legacy
 * @returns {string} CSS generado
 */

export function contentHeight(modifiersAndValues) {
  return processProperties({
    prop: 'contentHeight',
    modules: 'Ti.UI.ScrollView'
  }, {
    'content-h': '{ contentHeight: {value} }'
  }, {
    default: modifiersAndValues
  })
}
// Exported as function

export function contentWidth(modifiersAndValues) {
  return processProperties({
    prop: 'contentWidth',
    modules: 'Ti.UI.ScrollView'
  }, {
    'content-w': '{ contentWidth: {value} }'
  }, {
    default: modifiersAndValues
  })
}

export function countDownDuration(modifiersAndValues) {
  return processProperties({
    prop: 'countDownDuration - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    default: '{ countDownDuration: {value} }'
  }, {
    android: {
      'count-down-duration': modifiersAndValues
    }
  })
}

export function keyboardToolbarHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'keyboardToolbarHeight - iOS Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'keyboard-toolbar-h': '{ keyboardToolbarHeight: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function leftButtonPadding(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'leftButtonPadding - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'left-button-padding': '{ leftButtonPadding: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function maxElevation(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0', 'auto', 'full', 'screen'])

  _.each(modifiersAndValues, (value, key) => {
    if (key.includes('/')) {
      delete modifiersAndValues[key]
    } else if (['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'px', 'DEFAULT'].includes(key)) {
      //
    } else {
      modifiersAndValues[key] = parseValue(value)
    }
  })

  return processProperties({
    prop: 'maxElevation - Android Only',
    modules: 'Ti.UI.Android.CardView'
  }, {
    'max-elevation': '{ maxElevation: {value} }'
  }, {
    android: modifiersAndValues
  })
}

export function maxZoomScale(modifiersAndValues) {
  if (modifiersAndValues) {
    modifiersAndValues[1] = '.01'
  }

  return processProperties({
    prop: 'maxZoomScale',
    modules: 'Ti.UI.ScrollView'
  }, {
    'max-zoom-scale': '{ maxZoomScale: \'{value}\' }'
  }, { ios: modifiersAndValues })
}

export function minZoomScale(modifiersAndValues) {
  if (modifiersAndValues) {
    modifiersAndValues[1] = '.01'
  }

  return processProperties({
    prop: 'minZoomScale',
    modules: 'Ti.UI.ScrollView'
  }, {
    'min-zoom-scale': '{ minZoomScale: \'{value}\' }'
  }, { ios: modifiersAndValues })
}

export function pagingControlAlpha(modifiersAndValues) {
  return processProperties({
    prop: 'pagingControlAlpha - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control-alpha': '{ pagingControlAlpha: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function pagingControlHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'pagingControlHeight - iOS Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control-h': '{ pagingControlHeight: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function pagingControlTimeout(modifiersAndValues) {
  return processProperties({
    prop: 'pagingControlTimeout - Android Only',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control-timeout': '{ pagingControlTimeout: {value} }'
  }, {
    android: modifiersAndValues
  })
}

export function rightButtonPadding(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'rightButtonPadding - iOS Only',
    modules: 'Ti.UI.Label'
  }, {
    'right-button-padding': '{ rightButtonPadding: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function shadowRadius(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0', 'auto', 'full', 'screen'])

  _.each(modifiersAndValues, (value, key) => {
    if (key.includes('/')) {
      delete modifiersAndValues[key]
    } else if (['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'px', 'DEFAULT'].includes(key)) {
      modifiersAndValues[key] = value
    } else {
      modifiersAndValues[key] = 8 * parseFloat(value)
    }
  })

  return processProperties({
    prop: 'shadowRadius ( with Extra Styles ) - Android Only',
    modules: 'Ti.UI.Button, Ti.UI.Label'
  }, {
    'shadow-radius': '{ shadowRadius: {value} }'
  }, {
    android: modifiersAndValues
  })
}

export function timeout(modifiersAndValues) {
  return processProperties({
    prop: 'timeout - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    timeout: '{ timeout: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function zoomScale(modifiersAndValues) {
  if (modifiersAndValues) {
    modifiersAndValues[1] = '.01'
  }

  return processProperties({
    prop: 'zoomScale',
    modules: 'Ti.UI.ScrollView'
  }, {
    'zoom-scale': '{ zoomScale: \'{value}\' }'
  }, { ios: modifiersAndValues })
}

export function tiMedia(legacy = true) {
  let convertedStyles = '\n// Ti.Media'

  if (legacy) {
    convertedStyles += processProperties({
      prop: 'audioSessionCategory - iOS Only',
      modules: 'Ti.Media'
    }, {
      'audio-session-category': '{ audioSessionCategory: {value} }'
    }, {
      ios: {
        record: 'Ti.Media.AUDIO_SESSION_CATEGORY_RECORD',
        ambient: 'Ti.Media.AUDIO_SESSION_CATEGORY_AMBIENT',
        playback: 'Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK',
        'solo-ambient': 'Ti.Media.AUDIO_SESSION_CATEGORY_SOLO_AMBIENT',
        'play-record': 'Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD'
      }
    })

    convertedStyles += processProperties({
      prop: 'audioType - Android Only',
      modules: 'Ti.Media.AudioPlayer, Ti.Media.Sound'
    }, {
      'audio-type': '{ audioType: {value} }'
    }, {
      android: {
        ring: 'Ti.Media.Sound.AUDIO_TYPE_RING',
        alarm: 'Ti.Media.Sound.AUDIO_TYPE_ALARM',
        media: 'Ti.Media.Sound.AUDIO_TYPE_MEDIA',
        voice: 'Ti.Media.Sound.AUDIO_TYPE_VOICE',
        signalling: 'Ti.Media.Sound.AUDIO_TYPE_SIGNALLING',
        notification: 'Ti.Media.Sound.AUDIO_TYPE_NOTIFICATION'
      }
    })

    convertedStyles += processProperties({
      prop: 'repeatMode - iOS Only',
      modules: 'Ti.Media.MusicPlayer'
    }, {
      'music-repeat-mode': '{ repeatMode: {value} }'
    }, {
      ios: {
        all: 'Ti.Media.MUSIC_PLAYER_REPEAT_ALL',
        default: 'Ti.Media.MUSIC_PLAYER_REPEAT_DEFAULT',
        none: 'Ti.Media.MUSIC_PLAYER_REPEAT_NONE',
        one: 'Ti.Media.MUSIC_PLAYER_REPEAT_ONE'
      }
    })

    convertedStyles += processProperties({
      prop: 'shuffleMode - iOS Only',
      modules: 'Ti.Media.MusicPlayer'
    }, {
      'music-shuffle': '{ shuffleMode: {value} }'
    }, {
      ios: {
        albums: 'Ti.Media.MUSIC_PLAYER_SHUFFLE_ALBUMS',
        default: 'Ti.Media.MUSIC_PLAYER_SHUFFLE_DEFAULT',
        none: 'Ti.Media.MUSIC_PLAYER_SHUFFLE_NONE',
        songs: 'Ti.Media.MUSIC_PLAYER_SHUFFLE_SONGS'
      }
    })

    convertedStyles += processProperties({
      prop: 'scalingMode',
      modules: 'Ti.UI.ImageView',
      description: 'Image Scaling Mode'
    }, {
      'image-scaling': '{ scalingMode: {value} }'
    }, {
      default: {
        auto: 'Ti.Media.IMAGE_SCALING_AUTO',
        none: 'Ti.Media.IMAGE_SCALING_NONE',
        fill: 'Ti.Media.IMAGE_SCALING_FILL',
        cover: 'Ti.Media.IMAGE_SCALING_ASPECT_FILL',
        contain: 'Ti.Media.IMAGE_SCALING_ASPECT_FIT'
      }
    })

    // Video Scaling Mode
    convertedStyles += processProperties({
      prop: 'scalingMode',
      modules: 'Ti.Media.VideoPlayer',
      description: 'Video Scaling Mode'
    }, {
      'video-scaling': '{ scalingMode: {value} }'
    }, {
      default: {
        resize: 'Ti.Media.VIDEO_SCALING_RESIZE',
        contain: 'Ti.Media.VIDEO_SCALING_RESIZE_ASPECT',
        cover: 'Ti.Media.VIDEO_SCALING_RESIZE_ASPECT_FILL'
      }
    })

    convertedStyles += processProperties({
      prop: 'repeatMode',
      modules: 'Ti.Media.VideoPlayer',
      description: 'Determines how the movie player repeats when reaching the end of playback.'
    }, {
      'video-repeat-mode': '{ repeatMode: {value} }'
    }, {
      default: {
        one: 'Ti.Media.VIDEO_REPEAT_MODE_ONE',
        none: 'Ti.Media.VIDEO_REPEAT_MODE_NONE'
      }
    })
  }

  convertedStyles += processProperties({
    prop: 'scalingMode - ( Alternative )',
    modules: 'Ti.UI.ImageView',
    description: 'Background Size for compatibility with Tailwind classes'
  }, {
    bg: '{ scalingMode: {value} }'
  }, {
    default: {
      auto: 'Ti.Media.IMAGE_SCALING_AUTO',
      fill: 'Ti.Media.IMAGE_SCALING_FILL',
      none: 'Ti.Media.IMAGE_SCALING_NONE',
      cover: 'Ti.Media.IMAGE_SCALING_ASPECT_FILL',
      contain: 'Ti.Media.IMAGE_SCALING_ASPECT_FIT'
    }
  })

  convertedStyles += processProperties({
    prop: 'scalingMode - ( Alternative )',
    modules: 'Ti.UI.ImageView',
    description: 'Object Fit for compatibility with Tailwind classes'
  }, {
    object: '{ scalingMode: {value} }'
  }, {
    default: {
      auto: 'Ti.Media.IMAGE_SCALING_AUTO',
      fill: 'Ti.Media.IMAGE_SCALING_FILL',
      none: 'Ti.Media.IMAGE_SCALING_NONE',
      cover: 'Ti.Media.IMAGE_SCALING_ASPECT_FILL',
      contain: 'Ti.Media.IMAGE_SCALING_ASPECT_FIT'
    }
  })

  return convertedStyles
}
