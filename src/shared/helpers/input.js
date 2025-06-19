/**
 * PurgeTSS Input Module
 *
 * Funciones relacionadas con entrada de datos, campos de texto,
 * teclados, autocompletado y controles de entrada de usuario.
 *
 * @since 6.0.0
 */

// Importar utilidades compartidas
import { processProperties } from './utils.js'

/**
 * Configuración de autocapitalización para campos de texto
 * @returns {object} Configuración CSS
 */
export function autocapitalization() {
  return processProperties({
    prop: 'autocapitalization',
    modules: 'Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ autocapitalization: {value} }'
  }, {
    default: {
      uppercase: 'Ti.UI.TEXT_AUTOCAPITALIZATION_ALL',
      'normal-case': 'Ti.UI.TEXT_AUTOCAPITALIZATION_NONE',
      capitalize: 'Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS',
      sentences: 'Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES'
    }
  })
}

/**
 * Configuración de autocorrección para campos de texto
 * @returns {object} Configuración CSS
 */
export function autocorrect() {
  return processProperties({
    prop: 'autocorrect',
    modules: 'Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ autocorrect: {value} }'
  }, {
    default: {
      autocorrect: true,
      'no-autocorrect': false,
      'dont-autocorrect': false
    }
  })
}

/**
 * Tipos de autocompletado para campos de texto
 * @returns {object} Configuración CSS
 */
export function autofillType() {
  return processProperties({
    prop: 'autofillType',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'autofill-type': '{ autofillType: {value} }'
  }, {
    default: {
      url: 'Ti.UI.AUTOFILL_TYPE_URL',
      name: 'Ti.UI.AUTOFILL_TYPE_NAME',
      phone: 'Ti.UI.AUTOFILL_TYPE_PHONE',
      email: 'Ti.UI.AUTOFILL_TYPE_EMAIL',
      address: 'Ti.UI.AUTOFILL_TYPE_ADDRESS',
      username: 'Ti.UI.AUTOFILL_TYPE_USERNAME',
      password: 'Ti.UI.AUTOFILL_TYPE_PASSWORD',
      nickname: 'Ti.UI.AUTOFILL_TYPE_NICKNAME',
      location: 'Ti.UI.AUTOFILL_TYPE_LOCATION',
      'job-title': 'Ti.UI.AUTOFILL_TYPE_JOB_TITLE',
      'given-name': 'Ti.UI.AUTOFILL_TYPE_GIVEN_NAME',
      'name-prefix': 'Ti.UI.AUTOFILL_TYPE_NAME_PREFIX',
      'middle-name': 'Ti.UI.AUTOFILL_TYPE_MIDDLE_NAME',
      'family-name': 'Ti.UI.AUTOFILL_TYPE_FAMILY_NAME',
      'name-suffix': 'Ti.UI.AUTOFILL_TYPE_NAME_SUFFIX',
      sublocality: 'Ti.UI.AUTOFILL_TYPE_SUBLOCALITY',
      'postal-code': 'Ti.UI.AUTOFILL_TYPE_POSTAL_CODE',
      'card-number': 'Ti.UI.AUTOFILL_TYPE_CARD_NUMBER',
      'address-city': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_CITY',
      'country-name': 'Ti.UI.AUTOFILL_TYPE_COUNTRY_NAME',
      'new-password': 'Ti.UI.AUTOFILL_TYPE_NEW_PASSWORD',
      'address-line1': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_LINE1',
      'address-line2': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_LINE2',
      'address-state': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_STATE',
      'one-time-code': 'Ti.UI.AUTOFILL_TYPE_ONE_TIME_CODE',
      'organization-name': 'Ti.UI.AUTOFILL_TYPE_ORGANIZATION_NAME',
      'address-city-state': 'Ti.UI.AUTOFILL_TYPE_ADDRESS_CITY_STATE',
      'card-security-code': 'Ti.UI.AUTOFILL_TYPE_CARD_SECURITY_CODE',
      'card-expiration-day': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_DAY',
      'card-expiration-date': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_DATE',
      'card-expiration-year': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_YEAR',
      'card-expiration-month': 'Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_MONTH'
    }
  })
}

/**
 * Configuración de enlace automático para texto
 * @returns {object} Configuración CSS
 */
export function autoLink() {
  return processProperties({
    prop: 'autoLink',
    modules: 'Ti.UI.Label, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'auto-link': '{ autoLink: {value} }'
  }, {
    default: {
      all: 'Ti.UI.AUTOLINK_ALL',
      'email-addresses': 'Ti.UI.AUTOLINK_EMAIL_ADDRESSES',
      'map-addresses': 'Ti.UI.AUTOLINK_MAP_ADDRESSES',
      none: 'Ti.UI.AUTOLINK_NONE',
      'phone-numbers': 'Ti.UI.AUTOLINK_PHONE_NUMBERS',
      urls: 'Ti.UI.AUTOLINK_URLS'
    }
  })
}

/**
 * Limpiar contenido al editar (Android)
 * @returns {object} Configuración CSS
 */
export function clearOnEdit() {
  return processProperties({
    prop: 'clearOnEdit - Android Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ clearOnEdit: {value} }'
  }, {
    android: {
      'clear-on-edit': true,
      'dont-clear-on-edit': false
    }
  })
}

/**
 * Configuración de editabilidad
 * @returns {object} Configuración CSS
 */
export function editable() {
  return processProperties({
    prop: 'editable',
    modules: 'Ti.UI.DashboardView, Ti.UI.SearchBar, Ti.UI.TableView, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ editable: {value} }'
  }, {
    default: {
      editable: true,
      'editable-false': false
    }
  })
}

/**
 * Habilitar tecla de retorno
 * @returns {object} Configuración CSS
 */
export function enableReturnKey() {
  return processProperties({
    prop: 'enableReturnKey',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ enableReturnKey: {value} }'
  }, {
    default: {
      'enable-return-key': true,
      'disable-return-key': false
    }
  })
}

/**
 * Tipos de teclado
 * @returns {object} Configuración CSS
 */
export function keyboardType() {
  return processProperties({
    prop: 'keyboardType',
    modules: 'Ti.UI.AlertDialog, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'keyboard-type': '{ keyboardType: {value} }'
  }, {
    default: {
      default: 'Ti.UI.KEYBOARD_TYPE_DEFAULT',
      ascii: 'Ti.UI.KEYBOARD_TYPE_ASCII',
      'decimal-pad': 'Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD',
      email: 'Ti.UI.KEYBOARD_TYPE_EMAIL',
      'namephone-pad': 'Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD',
      'number-pad': 'Ti.UI.KEYBOARD_TYPE_NUMBER_PAD',
      'numbers-punctuation': 'Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION',
      'phone-pad': 'Ti.UI.KEYBOARD_TYPE_PHONE_PAD',
      url: 'Ti.UI.KEYBOARD_TYPE_URL'
    },
    ios: {
      appearance: 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
      'appearance-dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
      'appearance-light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT',
      twitter: 'Ti.UI.KEYBOARD_TYPE_TWITTER',
      websearch: 'Ti.UI.KEYBOARD_TYPE_WEBSEARCH'
    }
  })
}

/**
 * Modo de botón izquierdo para TextField (iOS)
 * @returns {object} Configuración CSS
 */
export function leftButtonMode() {
  return processProperties({
    prop: 'leftButtonMode - iOS Only',
    modules: 'Ti.UI.TextField'
  }, {
    'left-button-mode': '{ leftButtonMode: {value} }'
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
 * Teclado para contraseñas en AlertDialog
 * @returns {object} Configuración CSS
 */
export function passwordKeyboardType() {
  return processProperties({
    prop: 'passwordKeyboardType',
    modules: 'Ti.UI.AlertDialog'
  }, {
    'password-keyboard': '{ passwordKeyboardType: {value} }'
  }, {
    default: {
      type: 'Ti.UI.KEYBOARD_TYPE_DEFAULT',
      'type-ascii': 'Ti.UI.KEYBOARD_TYPE_ASCII',
      'type-decimal-pad': 'Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD',
      'type-email': 'Ti.UI.KEYBOARD_TYPE_EMAIL',
      'type-namephone-pad': 'Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD',
      'type-number-pad': 'Ti.UI.KEYBOARD_TYPE_NUMBER_PAD',
      'type-numbers-punctuation': 'Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION',
      'type-phone-pad': 'Ti.UI.KEYBOARD_TYPE_PHONE_PAD',
      'type-url': 'Ti.UI.KEYBOARD_TYPE_URL'
    },
    ios: {
      'type-appearance-dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
      'type-appearance-light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT',
      'type-appearance': 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
      'type-twitter': 'Ti.UI.KEYBOARD_TYPE_TWITTER',
      'type-websearch': 'Ti.UI.KEYBOARD_TYPE_WEBSEARCH'
    }
  })
}

/**
 * Máscara de contraseña para TableView
 * @returns {object} Configuración CSS
 */
export function passwordMask() {
  return processProperties({
    prop: 'passwordMask',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ passwordMask: {value} }'
  }, {
    default: {
      'password-mask': true,
      'password-unmask': false
    }
  })
}

/**
 * Tipo de tecla de retorno
 * @returns {object} Configuración CSS
 */
export function returnKeyType() {
  return processProperties({
    prop: 'returnKeyType',
    modules: 'Ti.UI.AlertDialog, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'return-key-type': '{ returnKeyType: {value} }'
  }, {
    default: {
      default: 'Ti.UI.RETURNKEY_DEFAULT',
      go: 'Ti.UI.RETURNKEY_GO',
      done: 'Ti.UI.RETURNKEY_DONE',
      join: 'Ti.UI.RETURNKEY_JOIN',
      next: 'Ti.UI.RETURNKEY_NEXT',
      send: 'Ti.UI.RETURNKEY_SEND',
      route: 'Ti.UI.RETURNKEY_ROUTE',
      yahoo: 'Ti.UI.RETURNKEY_YAHOO',
      google: 'Ti.UI.RETURNKEY_GOOGLE',
      search: 'Ti.UI.RETURNKEY_SEARCH',
      'emergency-call': 'Ti.UI.RETURNKEY_EMERGENCY_CALL'
    },
    ios: {
      continue: 'Ti.UI.RETURNKEY_CONTINUE'
    }
  })
}

/**
 * Modo de botón derecho para TextField (iOS)
 * @returns {object} Configuración CSS
 */
export function rightButtonMode() {
  return processProperties({
    prop: 'rightButtonMode - iOS Only',
    modules: 'Ti.UI.TextField'
  }, {
    'right-button-mode': '{ rightButtonMode: {value} }'
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
 * Suprimir tecla de retorno (iOS)
 * @returns {object} Configuración CSS
 */
export function suppressReturn() {
  return processProperties({
    prop: 'suppressReturn - iOS Only',
    modules: 'Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    default: '{ suppressReturn: {value} }'
  }, {
    ios: {
      'suppress-return': true,
      'dont-suppress-return': false
    }
  })
}

/**
 * Alineación de texto
 * @returns {object} Configuración CSS
 */
export function textAlign() {
  return processProperties({
    prop: 'textAlign',
    modules: 'Ti.UI.Button, Ti.UI.Label, Ti.UI.Switch, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    text: '{ textAlign: {value} }'
  }, {
    default: {
      left: 'Ti.UI.TEXT_ALIGNMENT_LEFT',
      right: 'Ti.UI.TEXT_ALIGNMENT_RIGHT',
      center: 'Ti.UI.TEXT_ALIGNMENT_CENTER',
      justify: 'Ti.UI.TEXT_ALIGNMENT_JUSTIFY'
    }
  })
}

/**
 * Alineación vertical
 * @returns {object} Configuración CSS
 */

export function filterAnchored() {
  return processProperties({
    prop: 'filterAnchored',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ filterAnchored: {value} }'
  }, {
    default: {
      'filter-anchored': true,
      'dont-filter-anchored': false
    }
  })
}

export function filterAttribute() {
  return processProperties({
    prop: 'filterAttribute',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ filterAttribute: {value} }'
  }, {
    default: {
      'filter-attribute': true,
      'filter-attribute-false': false
    }
  })
}

export function filterCaseInsensitive() {
  return processProperties({
    prop: 'filterCaseInsensitive',
    modules: 'Ti.UI.TableView'
  }, {
    default: '{ filterCaseInsensitive: {value} }'
  }, {
    default: {
      'filter-case-sensitive': false,
      'filter-case-insensitive': true
    }
  })
}

export function format24() {
  return processProperties({
    prop: 'format24 - Android Only',
    modules: 'Ti.UI.Picker'
  }, {
    format: '{ format24: {value} }'
  }, {
    android: {
      24: true,
      12: false
    }
  })
}

export function keyboardAppearance() {
  return processProperties({
    prop: 'keyboardAppearance - iOS Only',
    modules: 'Ti.UI.AlertDialog, Ti.UI.SearchBar, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    keyboard: '{ keyboardAppearance: {value} }'
  }, {
    ios: {
      appearance: {
        default: 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
        dark: 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
        light: 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT'
      }
    }
  })
}

export function keyboardDismissMode() {
  return processProperties({
    prop: 'keyboardDismissMode - iOS Only',
    modules: 'Ti.UI.ListView, Ti.UI.TableView'
  }, {
    'keyboard-dismiss-mode': '{ keyboardDismissMode: {value} }'
  }, {
    ios: {
      none: 'Ti.UI.iOS.KEYBOARD_DISMISS_MODE_NONE',
      'on-drag': 'Ti.UI.iOS.KEYBOARD_DISMISS_MODE_ON_DRAG',
      interactive: 'Ti.UI.iOS.KEYBOARD_DISMISS_MODE_INTERACTIVE'
    }
  })
}

export function keyboardDisplayRequiresUserAction() {
  return processProperties({
    prop: 'keyboardDisplayRequiresUserAction - iOS Only',
    modules: 'Ti.UI.WebView'
  }, {
    default: '{ keyboardDisplayRequiresUserAction: {value} }'
  }, {
    ios: {
      'keyboard-display-requires-user-action': true,
      'keyboard-display-dont-require-user-action': false
    }
  })
}

export function loginKeyboardType() {
  return processProperties({
    prop: 'loginKeyboardType',
    modules: 'Ti.UI.AlertDialog'
  }, {
    'login-keyboard-type': '{ loginKeyboardType: {value} }'
  }, {
    default: {
      ascii: 'Ti.UI.KEYBOARD_TYPE_ASCII',
      'decimal-pad': 'Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD',
      default: 'Ti.UI.KEYBOARD_TYPE_DEFAULT',
      email: 'Ti.UI.KEYBOARD_TYPE_EMAIL',
      'namephone-pad': 'Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD',
      'number-pad': 'Ti.UI.KEYBOARD_TYPE_NUMBER_PAD',
      'numbers-punctuation': 'Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION',
      'phone-pad': 'Ti.UI.KEYBOARD_TYPE_PHONE_PAD',
      url: 'Ti.UI.KEYBOARD_TYPE_URL'
    },
    ios: {
      'appearance-dark': 'Ti.UI.KEYBOARD_APPEARANCE_DARK',
      'appearance-light': 'Ti.UI.KEYBOARD_APPEARANCE_LIGHT',
      appearance: 'Ti.UI.KEYBOARD_APPEARANCE_DEFAULT',
      twitter: 'Ti.UI.KEYBOARD_TYPE_TWITTER',
      websearch: 'Ti.UI.KEYBOARD_TYPE_WEBSEARCH'
    }
  })
}

export function loginReturnKeyType() {
  return processProperties({
    prop: 'loginReturnKeyType',
    modules: 'Ti.UI.AlertDialog'
  }, {
    'login-return-key-type': '{ loginReturnKeyType: {value} }'
  }, {
    default: {
      default: 'Ti.UI.RETURNKEY_DEFAULT',
      go: 'Ti.UI.RETURNKEY_GO',
      done: 'Ti.UI.RETURNKEY_DONE',
      join: 'Ti.UI.RETURNKEY_JOIN',
      next: 'Ti.UI.RETURNKEY_NEXT',
      send: 'Ti.UI.RETURNKEY_SEND',
      route: 'Ti.UI.RETURNKEY_ROUTE',
      yahoo: 'Ti.UI.RETURNKEY_YAHOO',
      google: 'Ti.UI.RETURNKEY_GOOGLE',
      search: 'Ti.UI.RETURNKEY_SEARCH',
      'emergency-call': 'Ti.UI.RETURNKEY_EMERGENCY_CALL'
    },
    ios: {
      continue: 'Ti.UI.RETURNKEY_CONTINUE'
    }
  })
}
export function verticalAlign() {
  return processProperties({
    prop: 'verticalAlign',
    modules: 'Ti.UI.Button, Ti.UI.Label, Ti.UI.TextArea, Ti.UI.TextField'
  }, {
    'align-text': '{ verticalAlign: {value} }'
  }, {
    default: {
      top: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP',
      center: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER',
      bottom: 'Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM'
    }
  })
}
