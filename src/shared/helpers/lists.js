/**
 * PurgeTSS Lists Module
 *
 * Funciones relacionadas con listas, tablas, filas, secciones,
 * selección, edición y separadores.
 *
 * @since 6.0.0
 */

// Importar utilidades compartidas
import { processProperties, removeFractions } from './utils.js'

/**
 * Permite selección múltiple durante edición
 * @returns {object} Configuración CSS
 */
export function allowsMultipleSelectionDuringEditing() {
  return processProperties({
    prop: 'allowsMultipleSelectionDuringEditing',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ allowsMultipleSelectionDuringEditing: {value} }'
  }, {
    default: {
      'allows-multiple-selection-during-editing': true,
      'dont-allow-multiple-selection-during-editing': false
    }
  })
}

/**
 * Permite interacción de selección múltiple
 * @returns {object} Configuración CSS
 */
export function allowsMultipleSelectionInteraction() {
  return processProperties({
    prop: 'allowsMultipleSelectionInteraction',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ allowsMultipleSelectionInteraction: {value} }'
  }, {
    default: {
      'allows-multiple-selection-interaction': true,
      'dont-allow-multiple-selection-interaction': false
    }
  })
}

/**
 * Permite selección (iOS)
 * @returns {object} Configuración CSS
 */
export function allowsSelection() {
  return processProperties({
    prop: 'allowsSelection - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ allowsSelection: {value} }'
  }, {
    ios: {
      'allows-selection': true,
      'dont-allow-selection': false
    }
  })
}

/**
 * Permite selección durante edición
 * @returns {object} Configuración CSS
 */
export function allowsSelectionDuringEditing() {
  return processProperties({
    prop: 'allowsSelectionDuringEditing',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ allowsSelectionDuringEditing: {value} }'
  }, {
    default: {
      'allows-selection-during-editing': true,
      'dont-allow-selection-during-editing': false
    }
  })
}

/**
 * Búsqueda insensible a mayúsculas/minúsculas
 * @returns {object} Configuración CSS
 */
export function caseInsensitiveSearch() {
  return processProperties({
    prop: 'caseInsensitiveSearch',
    modules: 'Ti.UI.ListView'
  }, {
    case: '{ caseInsensitiveSearch: {value} }'
  }, {
    default: {
      'sensitive-search': false,
      'insensitive-search': true
    }
  })
}

/**
 * Atenúa el fondo durante búsqueda
 * @returns {object} Configuración CSS
 */
export function dimBackgroundForSearch() {
  return processProperties({
    prop: 'dimBackgroundForSearch',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ dimBackgroundForSearch: {value} }'
  }, {
    default: {
      'dim-background-for-search': true,
      'dont-dim-background-for-search': false
    }
  })
}

/**
 * Modo de edición (iOS)
 * @returns {object} Configuración CSS
 */
export function editing() {
  return processProperties({
    prop: 'editing - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ editing: {value} }'
  }, {
    default: {
      editing: true,
      'no-editing': false
    }
  })
}

/**
 * Divisores habilitados en el pie (Android)
 * @returns {object} Configuración CSS
 */
export function footerDividersEnabled() {
  return processProperties({
    prop: 'footerDividersEnabled - Android Only',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ footerDividersEnabled: {value} }'
  }, {
    android: {
      'footer-dividers-enabled': true,
      'footer-dividers-disabled': false
    }
  })
}

/**
 * Divisores habilitados en el encabezado (Android)
 * @returns {object} Configuración CSS
 */
export function headerDividersEnabled() {
  return processProperties({
    prop: 'headerDividersEnabled - Android Only',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ headerDividersEnabled: {value} }'
  }, {
    android: {
      'header-dividers-enabled': true,
      'header-dividers-disabled': false
    }
  })
}

/**
 * Oculta búsqueda en selección
 * @returns {object} Configuración CSS
 */
export function hideSearchOnSelection() {
  return processProperties({
    prop: 'hideSearchOnSelection',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ hideSearchOnSelection: {value} }'
  }, {
    default: {
      'hide-search-on-selection': true,
      'show-search-on-selection': false
    }
  })
}

/**
 * Mantiene secciones en búsqueda
 * @returns {object} Configuración CSS
 */
export function keepSectionsInSearch() {
  return processProperties({
    prop: 'keepSectionsInSearch',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ keepSectionsInSearch: {value} }'
  }, {
    default: {
      'keep-sections-in-search': true,
      'dont-keep-sections-in-search': false
    }
  })
}

/**
 * Estilo de ListView (iOS)
 * @returns {object} Configuración CSS
 */
export function listViewStyle() {
  return processProperties({
    prop: 'style - iOS Only',
    modules: 'Ti.UI.ListView'
  }, {
    'list-view-style': '{ style: {value} }'
  }, {
    ios: {
      plain: 'Ti.UI.iOS.ListViewStyle.PLAIN',
      group: 'Ti.UI.iOS.ListViewStyle.GROUPED',
      'inset-grouped': 'Ti.UI.iOS.ListViewStyle.INSET_GROUPED'
    }
  })
}

/**
 * Permite mover filas en TableView
 * @returns {object} Configuración CSS
 */
export function moving() {
  return processProperties({
    prop: 'moving',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ moving: {value} }'
  }, {
    default: {
      moving: true
    }
  })
}

/**
 * Poda secciones en edición
 * @returns {object} Configuración CSS
 */
export function pruneSectionsOnEdit() {
  return processProperties({
    prop: 'pruneSectionsOnEdit',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ pruneSectionsOnEdit: {value} }'
  }, {
    default: {
      'prune-sections-on-edit': true,
      'dont-prune-sections-on-edit': false
    }
  })
}

/**
 * Estilo de separador de resultados (iOS)
 * @returns {object} Configuración CSS
 */
export function resultsSeparatorStyle() {
  return processProperties({
    prop: 'resultsSeparatorStyle - iOS Only',
    modules: 'Ti.UI.ListView'
  }, {
    'results-separator-style': '{ resultsSeparatorStyle: {value} }'
  }, {
    ios: {
      none: 'Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE',
      'single-line': 'Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_SINGLE_LINE'
    }
  })
}

/**
 * Búsqueda como hijo (Android)
 * @returns {object} Configuración CSS
 */
export function searchAsChild() {
  return processProperties({
    prop: 'searchAsChild - Android Only',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ searchAsChild: {value} }'
  }, {
    android: {
      'search-as-child': true,
      'search-not-as-child': false
    }
  })
}

/**
 * Estilo de barra de búsqueda
 * @returns {object} Configuración CSS
 */
export function searchBarStyle() {
  return processProperties({
    prop: 'searchBarStyle - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    'search-bar-style': '{ searchBarStyle: {value} }'
  }, {
    ios: {
      default: 'Ti.UI.iOS.SearchBarStyle.PROMINENT',
      minimal: 'Ti.UI.iOS.SearchBarStyle.MINIMAL'
    }
  })
}

/**
 * Búsqueda oculta
 * @returns {object} Configuración CSS
 */
export function searchHidden() {
  return processProperties({
    prop: 'searchHidden',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ searchHidden: {value} }'
  }, {
    default: {
      'search-hidden': true,
      'search-visible': false
    }
  })
}

/**
 * Granularidad de selección
 * @returns {object} Configuración CSS
 */
export function selectionGranularity() {
  return processProperties({
    prop: 'selectionGranularity - iOS Only',
    modules: 'Ti.UI.TextArea'
  }, {
    'selection-granularity': '{ selectionGranularity: {value} }'
  }, {
    ios: {
      character: 'Ti.UI.TEXT_GRANULARITY_CHARACTER',
      line: 'Ti.UI.TEXT_GRANULARITY_LINE',
      paragraph: 'Ti.UI.TEXT_GRANULARITY_PARAGRAPH',
      sentence: 'Ti.UI.TEXT_GRANULARITY_SENTENCE',
      word: 'Ti.UI.TEXT_GRANULARITY_WORD'
    }
  })
}

/**
 * Abre selección
 * @returns {object} Configuración CSS
 */
export function selectionOpens() {
  return processProperties({
    prop: 'selectionOpens - iOS Only',
    modules: 'Ti.UI.ListView'
  }, {
    default: '{ selectionOpens: {value} }'
  }, {
    ios: {
      'selection-opens': true,
      'selection-dont-open': false
    }
  })
}

/**
 * Estilo de selección
 * @returns {object} Configuración CSS
 */
export function selectionStyle() {
  return processProperties({
    prop: 'selectionStyle - iOS Only',
    modules: 'Ti.UI.TableViewRow'
  }, {
    'selection-style': '{ selectionStyle: {value} }'
  }, {
    ios: {
      blue: 'Ti.UI.iOS.TableViewCellSelectionStyle.BLUE',
      gray: 'Ti.UI.iOS.TableViewCellSelectionStyle.GRAY',
      none: 'Ti.UI.iOS.TableViewCellSelectionStyle.NONE'
    }
  })
}

/**
 * Estilo de separador
 * @returns {object} Configuración CSS
 */
export function separatorStyle() {
  return processProperties({
    prop: 'separatorStyle',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    'separator-style': '{ separatorStyle: {value} }'
  }, {
    default: {
      none: 'Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE',
      'single-line': 'Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_SINGLE_LINE'
    }
  })
}

/**
 * Muestra barra de búsqueda en barra de navegación (iOS)
 * @returns {object} Configuración CSS
 */
export function showSearchBarInNavBar() {
  return processProperties({
    prop: 'showSearchBarInNavBar - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ showSearchBarInNavBar: {value} }'
  }, {
    ios: {
      'search-in-nav': true,
      'search-bar-in-nav-bar': true,
      'search-not-in-nav': false,
      'search-bar-not-in-nav-bar': false
    }
  })
}

/**
 * Muestra check de selección (Android)
 * @returns {object} Configuración CSS
 */
export function showSelectionCheck() {
  return processProperties({
    prop: 'showSelectionCheck - Android Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    default: '{ showSelectionCheck: {value} }'
  }, {
    android: {
      'show-selection-check': true,
      'hide-selection-check': false
    }
  })
}

/**
 * Estilo de TableView (iOS)
 * @returns {object} Configuración CSS
 */

export function tabbedBarStyle() {
  return processProperties({
    prop: 'style',
    modules: 'Ti.UI.TabbedBar'
  }, {
    'tabbed-bar-style': '{ style: {value} }'
  }, {
    default: {
      bar: 'Ti.UI.BUTTON_STYLE_FILLED',
      bordered: 'Ti.UI.BUTTON_STYLE_OPTION_NEGATIVE',
      done: 'Ti.UI.BUTTON_STYLE_OPTION_NEUTRAL',
      positive: 'Ti.UI.BUTTON_STYLE_OPTION_POSITIVE',
      outlined: 'Ti.UI.BUTTON_STYLE_OUTLINED',
      text: 'Ti.UI.BUTTON_STYLE_TEXT'
    },
    android: {
      default: 'Ti.UI.Android.TABS_STYLE_DEFAULT',
      'bottom-navigation': 'Ti.UI.Android.TABS_STYLE_BOTTOM_NAVIGATION'
    }
  })
}

export function tabGroupStyle() {
  return processProperties({
    prop: 'style - Android Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    'tabs-style': '{ style: {value} }'
  }, {
    android: {
      default: 'Ti.UI.Android.TABS_STYLE_DEFAULT',
      'bottom-navigation': 'Ti.UI.Android.TABS_STYLE_BOTTOM_NAVIGATION'
    }
  })
}

export function tabsTranslucent() {
  return processProperties({
    prop: 'tabsTranslucent - iOS Only',
    modules: 'Ti.UI.TabGroup'
  }, {
    tabs: '{ tabsTranslucent: {value} }'
  }, {
    ios: {
      translucent: true,
      opaque: false
    }
  })
}

export function toolbarEnabled() {
  return processProperties({
    prop: 'toolbarEnabled - Android Only',
    modules: 'Ti.UI.Android.DrawerLayout'
  }, {
    toolbar: '{ toolbarEnabled: {value} }'
  }, {
    android: {
      enabled: true,
      disabled: false
    }
  })
}

export function activeTab(modifiersAndValues) {
  return processProperties({
    prop: 'activeTab',
    modules: 'Ti.UI.TabGroup'
  }, {
    'active-tab': '{ activeTab: {value} }'
  }, {
    default: modifiersAndValues
  })
}

export function cacheSize(modifiersAndValues) {
  return processProperties({
    prop: 'cacheSize',
    modules: 'Ti.UI.ScrollableView'
  }, {
    'cache-size': '{ cacheSize: {value} }'
  }, {
    default: modifiersAndValues
  })
}

export function columnCount(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0'])

  const convertedStyles = processProperties({
    prop: 'columnCount - iOS Only',
    modules: 'Ti.UI.DashboardView'
  }, {
    'col-count': '{ columnCount: {value} }'
  }, {
    ios: modifiersAndValues
  })

  return convertedStyles
}

export function indentionLevel(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'indentionLevel - Android Only',
    modules: 'Ti.UI.Android.CardView, Ti.UI.Animation, Ti.UI.View'
  }, {
    'indentation-level': '{ indentionLevel: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function maxRowHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'maxRowHeight - iOS Only',
    modules: 'Ti.UI.TableView'
  }, {
    'max-row-h': '{ maxRowHeight: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function minRowHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'minRowHeight - iOS Only',
    modules: 'Ti.UI.TableView'
  }, {
    'min-row-h': '{ minRowHeight: {value} }'
  }, {
    ios: modifiersAndValues
  })
}

export function rowCount(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['0'])

  const convertedStyles = processProperties({
    prop: 'rowCount - iOS Only',
    modules: 'Ti.UI.DashboardView'
  }, {
    'row-count': '{ rowCount: {value} }'
  }, {
    ios: modifiersAndValues
  })

  return convertedStyles
}

export function rowHeight(modifiersAndValues) {
  modifiersAndValues = removeFractions(modifiersAndValues, ['full', 'auto', 'screen'])

  return processProperties({
    prop: 'rowHeight',
    modules: 'Ti.UI.TableView'
  }, {
    'row-h': '{ rowHeight: {value} }'
  }, {
    default: modifiersAndValues
  })
}
export function tableViewStyle() {
  return processProperties({
    prop: 'style - iOS Only',
    modules: 'Ti.UI.TableView'
  }, {
    'table-view-style': '{ style: {value} }'
  }, {
    ios: {
      grouped: 'Ti.UI.iOS.TableViewStyle.GROUPED',
      plain: 'Ti.UI.iOS.TableViewStyle.PLAIN',
      'inset-group': 'Ti.UI.iOS.TableViewStyle.INSET_GROUPED'
    }
  })
}

/**
 * canDelete (iOS)
 * @returns {object} Configuración CSS
 */
export function canDelete() {
  return processProperties({
    prop: 'canDelete - iOS Only',
    modules: 'Ti.UI.DashboardItem'
  }, {
    default: '{ canDelete: {value} }'
  }, {
    ios: {
      'can-delete': true,
      'cant-delete': false
    }
  })
}

/**
 * canEdit
 * @returns {object} Configuración CSS
 */
export function canEdit() {
  return processProperties({
    prop: 'canEdit',
    modules: 'Ti.UI.ListItem'
  }, {
    default: '{ canEdit: {value} }'
  }, {
    default: {
      'can-edit': true,
      'cant-edit': false
    }
  })
}

/**
 * canInsert
 * @returns {object} Configuración CSS
 */
export function canInsert() {
  return processProperties({
    prop: 'canInsert',
    modules: 'Ti.UI.ListItem'
  }, {
    default: '{ canInsert: {value} }'
  }, {
    default: {
      'can-insert': true,
      'cant-insert': false
    }
  })
}

/**
 * canMove
 * @returns {object} Configuración CSS
 */
export function canMove() {
  return processProperties({
    prop: 'canMove',
    modules: 'Ti.UI.ListItem'
  }, {
    default: '{ canMove: {value} }'
  }, {
    default: {
      'can-move': true,
      'cant-move': false
    }
  })
}
