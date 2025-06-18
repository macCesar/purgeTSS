/**
 * PurgeTSS Scrolling Module
 *
 * Funciones relacionadas con scroll, desplazamiento, paginación,
 * indicadores de scroll y navegación de contenido.
 *
 * @since 6.0.0
 */

// Importar utilidades compartidas
import { processProperties, processComments } from './utils.js'
import { globalOptions } from './core.js'

/**
 * Auto-ajuste de insets en ScrollView (iOS)
 * @returns {object} Configuración CSS
 */
export function autoAdjustScrollViewInsets() {
  return processProperties({
    prop: 'autoAdjustScrollViewInsets - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ autoAdjustScrollViewInsets: {value} }'
  }, {
    ios: {
      'auto-adjust-scroll-view-inset': true,
      'dont-auto-adjust-scroll-view-inset': false
    }
  })
}

/**
 * Permite hacer scroll en ListView
 * @returns {object} Configuración CSS
 */
export function canScroll() {
  return processProperties({
    prop: 'canScroll',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ canScroll: {value} }'
  }, {
    default: {
      'can-scroll': true,
      'cant-scroll': false
    }
  })
}

/**
 * Scroll rápido (Android)
 * @returns {object} Configuración CSS
 */
export function fastScroll() {
  return processProperties({
    prop: 'fastScroll - Android Only',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ fastScroll: {value} }'
  }, {
    android: {
      'fast-scroll': true,
      'slow-scroll': false
    }
  })
}

/**
 * Oculta la barra de búsqueda al hacer scroll (iOS)
 * @returns {object} Configuración CSS
 */
export function hidesSearchBarWhenScrolling() {
  return processProperties({
    prop: 'hidesSearchBarWhenScrolling - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ hidesSearchBarWhenScrolling: {value} }'
  }, {
    ios: {
      'hide-search-when-scrolling': true,
      'show-search-when-scrolling': false
    }
  })
}

/**
 * Modo de over-scroll (Android)
 * @returns {object} Configuración CSS
 */
export function overScrollMode() {
  return processProperties({
    prop: 'overScrollMode - Android Only',
    modules: 'Ti.UI.ScrollView'
  }, {
    'over-scroll': '{ overScrollMode: {value} }'
  }, {
    android: {
      always: 'Ti.UI.Android.OVER_SCROLL_ALWAYS',
      'if-content-scrolls': 'Ti.UI.Android.OVER_SCROLL_IF_CONTENT_SCROLLS',
      never: 'Ti.UI.Android.OVER_SCROLL_NEVER'
    }
  })
}

/**
 * Control de paginación visible
 * @returns {object} Configuración CSS
 */
export function showPagingControl() {
  return processProperties({
    prop: 'showPagingControl',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'paging-control': '{ showPagingControl: {value} }'
  }, {
    default: {
      show: true,
      hide: false
    }
  })
}

/**
 * Control de paginación en la parte superior
 * @returns {object} Configuración CSS
 */
export function pagingControlOnTop() {
  return processProperties({
    prop: 'pagingControlOnTop',
    modules: 'Ti.UI.ScrollableView'
  }, {
    default: '{ pagingControlOnTop: {value} }'
  }, {
    default: {
      'paging-control-on-top': true,
      'paging-control-on-bottom': false
    }
  })
}

/**
 * Permite scroll en TableView
 * @returns {object} Configuración CSS
 */
export function scrollable() {
  return processProperties({
    prop: 'scrollable',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ scrollable: {value} }'
  }, {
    default: {
      scrollable: true,
      unscrollable: false
    }
  })
}

/**
 * Indicadores de scroll horizontal y vertical
 * @returns {string} CSS generado
 */
export function scrollIndicators() {
  let convertedStyles = processComments({
    prop: 'showHorizontalScrollIndicator, showVerticalScrollIndicator',
    modules: 'Ti.UI.ScrollView'
  })

  convertedStyles += '\'.overflow-x-scroll\': { showHorizontalScrollIndicator: true }\n'
  convertedStyles += '\'.overflow-y-scroll\': { showVerticalScrollIndicator: true }\n'
  convertedStyles += '\'.overflow-x-hidden\': { showHorizontalScrollIndicator: false }\n'
  convertedStyles += '\'.overflow-y-hidden\': { showVerticalScrollIndicator: false }\n'
  convertedStyles += '\'.overflow-scroll\': { showHorizontalScrollIndicator: true, showVerticalScrollIndicator: true }\n'
  convertedStyles += '\'.overflow-hidden\': { showHorizontalScrollIndicator: false, showVerticalScrollIndicator: false }\n'

  return convertedStyles
}

/**
 * Estilo de indicador de scroll (iOS)
 * @returns {object} Configuración CSS
 */
export function scrollIndicatorStyle() {
  return processProperties({
    prop: 'scrollIndicatorStyle - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.ScrollView, Ti.UI.TableView'
  }, {
    'scrolling-indicator-style': '{ scrollIndicatorStyle: {value} }'
  }, {
    ios: {
      black: 'Ti.UI.iOS.ScrollIndicatorStyle.BLACK',
      default: 'Ti.UI.iOS.ScrollIndicatorStyle.DEFAULT',
      white: 'Ti.UI.iOS.ScrollIndicatorStyle.WHITE'
    }
  })
}

/**
 * Habilita o deshabilita el scroll
 * @returns {object} Configuración CSS
 */
export function scrollingEnabled() {
  return processProperties({
    prop: 'scrollingEnabled',
    modules: 'Ti.UI.ScrollableView, Ti.UI.ScrollView'
  }, {
    scrolling: '{ scrollingEnabled: {value} }'
  }, {
    default: {
      enabled: true,
      disabled: false
    }
  })
}

/**
 * Scroll automático hacia arriba (iOS)
 * @returns {object} Configuración CSS
 */
export function scrollsToTop() {
  return processProperties({
    prop: 'scrollsToTop - iOS Only',
    modules: 'Ti.UI.ScrollView, Ti.UI.TableView, Ti.UI.TextArea, Ti.UI.WebView'
  }, {
    default: '{ scrollsToTop: {value} }'
  }, {
    [(globalOptions.legacy) ? 'ios' : 'default']: {
      'scrolls-to-top': true,
      [(globalOptions.legacy) ? 'dont-scrolls-to-top' : 'scrolls-to-top-false']: false
    }
  })
}

/**
 * Tipo de scroll (Android)
 * @returns {object} Configuración CSS
 */
export function scrollType() {
  return processProperties({
    prop: 'scrollType - Android Only',
    modules: 'Ti.UI.ScrollView'
  }, {
    'scroll-type': '{ scrollType: {value} }'
  }, {
    [(globalOptions.legacy) ? 'android' : 'default']: {
      horizontal: 'horizontal',
      vertical: 'vertical'
    }
  })
}

/**
 * Muestra indicador de scroll horizontal
 * @returns {object} Configuración CSS
 */
export function showHorizontalScrollIndicator() {
  return processProperties({
    prop: 'showHorizontalScrollIndicator',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ showHorizontalScrollIndicator: {value} }'
  }, {
    default: {
      'show-horizontal-scrolling-indicator': true,
      'hide-horizontal-scrolling-indicator': false
    }
  })
}

/**
 * Muestra indicador de scroll vertical
 * @returns {object} Configuración CSS
 */
export function showVerticalScrollIndicator() {
  return processProperties({
    prop: 'showVerticalScrollIndicator',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ showVerticalScrollIndicator: {value} }'
  }, {
    default: {
      'show-vertical-scrolling-indicator': true,
      'hide-vertical-scrolling-indicator': false
    }
  })
}

/**
 * Scroll suave al hacer clic en tab (Android)
 * @returns {object} Configuración CSS
 */
export function smoothScrollOnTabClick() {
  return processProperties({
    prop: 'smoothScrollOnTabClick - Android Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    'smooth-scroll': '{ smoothScrollOnTabClick: {value} }'
  }, {
    android: {
      default: true,
      disabled: false
    }
  })
}

/**
 * Scroll automático al tocar la barra de estado (iOS)
 * @returns {object} Configuración CSS
 */

export function disableBounce() {
  return processProperties({
    prop: 'disableBounce - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.ScrollableView, Ti.UI.ScrollView, Ti.UI.WebView'
  }, {
    default: '{ disableBounce: {value} }'
  }, {
    ios: {
      'disable-bounce': true,
      'enable-bounce': false
    }
  })
}

export function disableContextMenu() {
  return processProperties({
    prop: 'disableContextMenu - Android Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ disableContextMenu: {value} }'
  }, {
    android: {
      'disable-context-menu': true,
      'dont-disable-context-menu': false
    }
  })
}

export function verticalBounce() {
  return processProperties({
    prop: 'verticalBounce - iOS Only',
    modules: 'Ti.UI.ScrollView'
  }, {
    default: '{ verticalBounce: {value} }'
  }, {
    ios: {
      'vertical-bounce': true,
      'no-vertical-bounce': false
    }
  })
}
export function willScrollOnStatusTap() {
  return processProperties({
    prop: 'willScrollOnStatusTap - iOS Only',
    modules: 'Ti.UI.Window'
  }, {
    default: '{ willScrollOnStatusTap: {value} }'
  }, {
    ios: {
      'will-scroll-on-status-tap': true,
      'wont-scroll-on-status-tap': false
    }
  })
}
