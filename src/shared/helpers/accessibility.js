/**
 * PurgeTSS Accessibility Module
 *
 * Funciones relacionadas con accesibilidad, interacción de usuario,
 * filtros de eventos y funcionalidades de ayuda.
 *
 * @since 6.0.0
 */

// Importar utilidades compartidas
import { processProperties } from './utils.js'

/**
 * Oculta elemento para accesibilidad
 * @returns {object} Configuración CSS
 */
export function accessibilityHidden() {
  return processProperties({
    prop: 'accessibilityHidden',
    modules: 'Ti.UI.View'
  }, {
    default: '{ accessibilityHidden: {value} }'
  }, {
    default: {
      'accessibility-hidden': true,
      'accessibility-not-hidden': false
    }
  })
}

/**
 * Permite personalización por el usuario (iOS)
 * @returns {object} Configuración CSS
 */
export function allowUserCustomization() {
  return processProperties({
    prop: 'allowUserCustomization - iOS Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    default: '{ allowUserCustomization: {value} }'
  }, {
    ios: {
      'allow-user-customization': true,
      'dont-allow-user-customization': false
    }
  })
}

/**
 * Permite cancelar eventos
 * @returns {object} Configuración CSS
 */
export function canCancelEvents() {
  return processProperties({
    prop: 'canCancelEvents',
    modules: 'Ti.UI.ScrollView'
  }, {
    default: '{ canCancelEvents: {value} }'
  }, {
    default: {
      'can-cancel-events': true,
      'cant-cancel-events': false
    }
  })
}

/**
 * Habilita copia de texto
 * @returns {object} Configuración CSS
 */
export function enableCopy() {
  return processProperties({
    prop: 'enableCopy - iOS Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ enableCopy: {value} }'
  }, {
    ios: {
      'enable-copy': true,
      'disable-copy': false
    }
  })
}

/**
 * Habilita interfaz JavaScript (Android)
 * @returns {object} Configuración CSS
 */
export function enableJavascriptInterface() {
  return processProperties({
    prop: 'enableJavascriptInterface - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ enableJavascriptInterface: {value} }'
  }, {
    android: {
      'enable-javascript-interface': true,
      'disable-javascript-interface': false
    }
  })
}

/**
 * Habilita controles de zoom (Android)
 * @returns {object} Configuración CSS
 */
export function enableZoomControls() {
  return processProperties({
    prop: 'enableZoomControls - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ enableZoomControls: {value} }'
  }, {
    android: {
      'enable-zoom-controls': true,
      'disable-zoom-controls': false
    }
  })
}

/**
 * Filtra toques cuando está obscurecido (Android)
 * @returns {object} Configuración CSS
 */
export function filterTouchesWhenObscured() {
  return processProperties({
    prop: 'filterTouchesWhenObscured - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ filterTouchesWhenObscured: {value} }'
  }, {
    android: {
      'filter-touches-when-obscured': true,
      'dont-filter-touches-when-obscured': false
    }
  })
}

/**
 * Mantiene pantalla encendida (Android)
 * @returns {object} Configuración CSS
 */
export function keepScreenOn() {
  return processProperties({
    prop: 'keepScreenOn - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ keepScreenOn: {value} }'
  }, {
    android: {
      'keep-screen-on': true,
      'dont-keep-screen-on': false
    }
  })
}

/**
 * Toque ligero habilitado (Android)
 * @returns {object} Configuración CSS
 */
export function lightTouchEnabled() {
  return processProperties({
    prop: 'lightTouchEnabled - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ lightTouchEnabled: {value} }'
  }, {
    android: {
      'light-touch-enabled': true,
      'light-touch-disabled': false
    }
  })
}

/**
 * Anula animación actual
 * @returns {object} Configuración CSS
 */
export function overrideCurrentAnimation() {
  return processProperties({
    prop: 'overrideCurrentAnimation - Android Only',
    modules: 'Ti.UI.View'
  }, {
    default: '{ overrideCurrentAnimation: {value} }'
  }, {
    android: {
      'override-current-animation': true,
      'dont-override-current-animation': false
    }
  })
}

/**
 * Manejará toques
 * @returns {object} Configuración CSS
 */
export function willHandleTouches() {
  return processProperties({
    prop: 'willHandleTouches - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ willHandleTouches: {value} }'
  }, {
    ios: {
      'will-handle-touches': true,
      'wont-handle-touches': false
    }
  })
}
