/**
 * PurgeTSS Form Controls Module
 *
 * Funciones relacionadas con controles de formulario como
 * botones, switches, pickers, sliders e indicadores.
 *
 * @since 6.0.0
 */

// Importar utilidades compartidas
import { processProperties } from './utils.js'

/**
 * Estilo de indicador de actividad
 * @returns {object} Configuración CSS
 */
export function activityIndicatorStyle() {
  return processProperties({
    prop: 'indicatorStyle - iOS Only',
    modules: 'Ti.UI.ActivityIndicator'
  }, {
    'activity-indicator-style': '{ style: {value} }'
  }, {
    ios: {
      big: 'Ti.UI.ActivityIndicatorStyle.BIG',
      dark: 'Ti.UI.ActivityIndicatorStyle.DARK',
      'big-dark': 'Ti.UI.ActivityIndicatorStyle.BIG_DARK',
      plain: 'Ti.UI.ActivityIndicatorStyle.PLAIN'
    }
  })
}

/**
 * Estilo de botón
 * @returns {object} Configuración CSS
 */
export function buttonStyle() {
  return processProperties({
    prop: 'style',
    modules: 'Ti.UI.Button'
  }, {
    'button-style': '{ style: {value} }'
  }, {
    default: {
      filled: 'Ti.UI.BUTTON_STYLE_FILLED',
      'option-negative': 'Ti.UI.BUTTON_STYLE_OPTION_NEGATIVE',
      'option-neutral': 'Ti.UI.BUTTON_STYLE_OPTION_NEUTRAL',
      'option-positive': 'Ti.UI.BUTTON_STYLE_OPTION_POSITIVE',
      outlined: 'Ti.UI.BUTTON_STYLE_OUTLINED',
      text: 'Ti.UI.BUTTON_STYLE_TEXT'
    }
  })
}

/**
 * Modo de botón de limpieza (iOS)
 * @returns {object} Configuración CSS
 */
export function clearButtonMode() {
  return processProperties({
    prop: 'clearButtonMode - iOS Only',
    modules: 'Ti.UI.TextField'
  }, {
    'clear-button-mode': '{ clearButtonMode: {value} }'
  }, {
    ios: {
      always: 'Ti.UI.INPUT_BUTTONMODE_ALWAYS',
      never: 'Ti.UI.INPUT_BUTTONMODE_NEVER',
      'on-blur': 'Ti.UI.INPUT_BUTTONMODE_ONBLUR',
      'on-focus': 'Ti.UI.INPUT_BUTTONMODE_ONFOCUS'
    }
  })
}

/**
 * Estilo de selector de fecha (iOS)
 * @returns {object} Configuración CSS
 */
export function datePickerStyle() {
  return processProperties({
    prop: 'datePickerStyle - iOS Only',
    modules: 'Ti.UI.Picker'
  }, {
    'date-picker-style': '{ datePickerStyle: {value} }'
  }, {
    ios: {
      automatic: 'Ti.UI.iOS.DATE_PICKER_STYLE_AUTOMATIC',
      compact: 'Ti.UI.iOS.DATE_PICKER_STYLE_COMPACT',
      wheels: 'Ti.UI.iOS.DATE_PICKER_STYLE_WHEELS'
    }
  })
}

/**
 * Indicador de drawer habilitado (Android)
 * @returns {object} Configuración CSS
 */
export function drawerIndicatorEnabled() {
  return processProperties({
    prop: 'drawerIndicatorEnabled - Android Only',
    modules: 'Ti.Android.ActionBar'
  }, {
    'drawer-indicator': '{ drawerIndicatorEnabled: {value} }'
  }, {
    android: {
      enabled: true,
      disabled: false
    }
  })
}

/**
 * Spinner nativo (Android)
 * @returns {object} Configuración CSS
 */
export function nativeSpinner() {
  return processProperties({
    prop: 'nativeSpinner - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    default: '{ nativeSpinner: {value} }'
  }, {
    android: {
      'native-spinner': true
    }
  })
}

/**
 * Tipo de picker
 * @returns {object} Configuración CSS
 */
export function pickerType() {
  return processProperties({
    prop: 'type (Picker Type)',
    modules: 'Ti.UI.Picker'
  }, {
    'picker-type': '{ type: {value} }'
  }, {
    default: {
      'count-down-timer': 'Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER',
      date: 'Ti.UI.PICKER_TYPE_DATE',
      'date-and-time': 'Ti.UI.PICKER_TYPE_DATE_AND_TIME',
      plain: 'Ti.UI.PICKER_TYPE_PLAIN',
      time: 'Ti.UI.PICKER_TYPE_TIME'
    }
  })
}

/**
 * Estilo de barra de progreso (Android)
 * @returns {object} Configuración CSS
 */
export function progressBarStyle() {
  return processProperties({
    prop: 'style - iOS Only',
    modules: 'Ti.UI.ProgressBar'
  }, {
    'progress-bar-style': '{ style: {value} }'
  }, {
    ios: {
      bar: 'Ti.UI.iOS.ProgressBarStyle.BAR',
      default: 'Ti.UI.iOS.ProgressBarStyle.DEFAULT',
      plain: 'Ti.UI.iOS.ProgressBarStyle.PLAIN'
    }
  })
}

/**
 * Estilo de switch
 * @returns {object} Configuración CSS
 */
export function switchStyle() {
  return processProperties({
    prop: 'style',
    modules: 'Ti.UI.Switch'
  }, {
    'switch-style': '{ style: {value} }'
  }, {
    default: {
      checkbox: 'Ti.UI.SWITCH_STYLE_CHECKBOX',
      chip: 'Ti.UI.SWITCH_STYLE_CHIP',
      slider: 'Ti.UI.SWITCH_STYLE_SLIDER',
      'toggle-button': 'Ti.UI.SWITCH_STYLE_TOGGLE_BUTTON'
    }
  })
}

/**
 * Botón del sistema (iOS)
 * @returns {object} Configuración CSS
 */
export function systemButton() {
  return processProperties({
    prop: 'systemButton - iOS Only',
    modules: 'Ti.UI.Button'
  }, {
    'system-button': '{ systemButton: {value} }'
  }, {
    ios: {
      action: 'Ti.UI.iOS.SystemButton.ACTION',
      activity: 'Ti.UI.iOS.SystemButton.ACTIVITY',
      add: 'Ti.UI.iOS.SystemButton.ADD',
      bookmarks: 'Ti.UI.iOS.SystemButton.BOOKMARKS',
      camera: 'Ti.UI.iOS.SystemButton.CAMERA',
      cancel: 'Ti.UI.iOS.SystemButton.CANCEL',
      compose: 'Ti.UI.iOS.SystemButton.COMPOSE',
      'contact-add': 'Ti.UI.iOS.SystemButton.CONTACT_ADD',
      disclosure: 'Ti.UI.iOS.SystemButton.DISCLOSURE',
      done: 'Ti.UI.iOS.SystemButton.DONE',
      edit: 'Ti.UI.iOS.SystemButton.EDIT',
      'fast-forward': 'Ti.UI.iOS.SystemButton.FAST_FORWARD',
      'fixed-space': 'Ti.UI.iOS.SystemButton.FIXED_SPACE',
      'flexible-space': 'Ti.UI.iOS.SystemButton.FLEXIBLE_SPACE',
      'info-dark': 'Ti.UI.iOS.SystemButton.INFO_DARK',
      'info-light': 'Ti.UI.iOS.SystemButton.INFO_LIGHT',
      organize: 'Ti.UI.iOS.SystemButton.ORGANIZE',
      pause: 'Ti.UI.iOS.SystemButton.PAUSE',
      play: 'Ti.UI.iOS.SystemButton.PLAY',
      refresh: 'Ti.UI.iOS.SystemButton.REFRESH',
      reply: 'Ti.UI.iOS.SystemButton.REPLY',
      rewind: 'Ti.UI.iOS.SystemButton.REWIND',
      save: 'Ti.UI.iOS.SystemButton.SAVE',
      search: 'Ti.UI.iOS.SystemButton.SEARCH',
      stop: 'Ti.UI.iOS.SystemButton.STOP',
      trash: 'Ti.UI.iOS.SystemButton.TRASH'
    }
  })
}

/**
 * Usa spinner para loading
 * @returns {object} Configuración CSS
 */
export function useSpinner() {
  return processProperties({
    prop: 'useSpinner - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    default: '{ useSpinner: {value} }'
  }, {
    android: {
      'use-spinner': true,
      'dont-use-spinner': false
    }
  })
}
