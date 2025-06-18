import fs from 'fs'
import _ from 'lodash'
import { globalOptions } from './core.js'

// Internal variables and constants
const _applyClasses = {}
const cwd = process.cwd()
const regexUnicode = /[^\u0000-\u00FF]/ // eslint-disable-line no-control-regex
const HEX_3_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i // i.e. #0F3
const HEX_4_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i // i.e. #80F3
const HEX_6_REGEX = /^#?([a-f\d]){6}$/i // i.e. #00FF33
const HEX_8_REGEX = /^#?([a-f\d]){8}$/i // i.e. #8800FF33

/**
 * Process properties and generate CSS-like styles for Titanium
 * @param {Object|string} info - Information object or string for comments
 * @param {Object} selectorAndDeclarationBlock - Selector and declaration block mapping
 * @param {Object} selectorsAndValues - Selectors and values mapping
 * @param {boolean} debug - Debug mode flag
 * @returns {string} Converted styles string
 */
export function processProperties(info, selectorAndDeclarationBlock, selectorsAndValues, debug = false) {
  let convertedStyles = (typeof info === 'object') ? processComments(info) : `\n// ${info}\n`

  _.each(selectorAndDeclarationBlock, (declarationBlock, mainSelector) => {
    const minusSigns = (mainSelector.startsWith('-')) ? '-' : ''
    if (debug) console.log('mainSelector:', mainSelector, 'declarationBlock:', declarationBlock)
    _.each(selectorsAndValues, (rulesAndValuesPair, selector) => {
      if (debug) console.log('selector', selector)
      _.each(rulesAndValuesPair, (value, rule) => {
        if (debug) console.log('rule:', rule, 'value:', value)
        if (typeof value === 'object') {
          _.each(value, (_value, key) => {
            if (debug) console.log('key:', key, '_value:', _value)
            let processedProperties = _.replace(declarationBlock, /{value}/g, parseValue(_value, minusSigns))
            if (declarationBlock.includes('double')) {
              processedProperties = _.replace(processedProperties, /{double}/g, parseValue(_value, minusSigns) * 2)
            }
            convertedStyles += defaultModifier(key) ? `'.${setModifier2(mainSelector, rule)}${setModifier2(rule)}${setModifier2(selector)}': ${processedProperties}\n` : `'.${setModifier2(mainSelector, rule)}${setModifier2(rule, key)}${setModifier2(key)}${setModifier2(selector)}': ${processedProperties}\n`
          })
        } else {
          let processedProperties = _.replace(declarationBlock, /{value}/g, parseValue(value, minusSigns))
          if (declarationBlock.includes('double')) {
            processedProperties = _.replace(processedProperties, /{double}/g, parseValue(value, minusSigns) * 2)
          }
          convertedStyles += `'.${setModifier2(mainSelector, rule)}${setModifier2(rule)}${setModifier2(selector)}': ${processedProperties}\n`
        }
      })
    })
  })

  return convertedStyles
}

/**
 * Process comments for CSS generation
 * @param {Object} data - Data object containing comment information
 * @param {string} key - Optional key for property name
 * @returns {string} Generated comments string
 */
export function processComments(data, key = undefined) {
  let myComments = ''

  // if (data.type) {
  //  myComments += `\n// Type: ${data.type}`;
  // }

  if (key) {
    myComments += `\n// Property: ${key}`
  }

  if (data.prop) {
    myComments += `\n// Property(ies): ${data.prop}`
  }

  if (data.description) {
    myComments += `\n// Description: ${data.description.replace(/\n/g, ' ')}`
  }

  if (data.modules) {
    if (Array.isArray(data.modules)) {
      myComments += `\n// Component(s): ${data.modules.join(', ')}\n`
    } else {
      myComments += `\n// Component(s): ${data.modules}\n`
    }
  }

  return myComments
}

/**
 * Parse and convert values for Titanium properties
 * @param {*} value - Value to parse
 * @param {string} sign - Optional sign prefix
 * @returns {*} Parsed value
 */
export function parseValue(value, sign = '') {
  if (value === '') return '\'\''

  // Match on everything outside this range: [^\u0000-\u00FF].
  if (regexUnicode.test(value)) {
    return `'\\u${value.charCodeAt(0).toString(16)}'`
  }

  if (value === '0px') {
    value = 0
  }

  if (typeof value === 'string' && value.includes('/') && /^\d+\/\d+$/.test(value)) {
    /* eslint-disable no-eval */
    let parsedFloat = parseFloat(eval(value)) * 100
    const splittedValues = parsedFloat.toString().split('.')

    if (splittedValues[1] && splittedValues[1].length >= 6) {
      if (`.${splittedValues[1]}` < 0.5) {
        parsedFloat += 0.000001
      }
      parsedFloat = parsedFloat.toFixed(6)
    }

    value = `${parsedFloat}%`
  }

  const unit = isNaN(value) ? checkTitanium(value) : value

  if ((typeof value === 'string' && value.indexOf('-') > -1) || value < 0) {
    sign = ''
  }

  switch (unit) {
    case '0':
    case true:
    case false:
    case 'titanium':
      return `${sign}${value}`
    case 'vw':
    case 'vh':
    case 'screen':
      return 'Ti.UI.FILL'
    case 'auto':
      return 'Ti.UI.SIZE'
    case 'none':
    case 'null':
      return null
    case 'em':
    case 'rem':
      return `${sign}${16 * parseFloat(value)}`
    case 'dp':
      return `${sign}${parseFloat(value)}`
    case 'hex':
      return toHex(value)
    case 'deg':
      return parseFloat(value)
    case 'ms':
    case 's':
      return parseFloat(value)
    case 'transparent':
      return `'${value}'`
    default:
      return isNaN(value) ? `'${sign}${value}'` : `${sign}${value}`
  }
}

/**
 * Set modifier for CSS class names
 * @param {string} modifier - Modifier to set
 * @param {string} rule - Optional rule parameter
 * @returns {string} Modified class name
 */
export function setModifier2(modifier, rule = null) {
  if (defaultModifier(modifier)) {
    modifier = ''
  } else if (modifier === 'ios') {
    modifier = '[platform=ios]'
  } else if (modifier === 'android') {
    modifier = '[platform=android]'
  } else if (modifier === 'handheld') {
    modifier = '[formFactor=handheld]'
  } else if (modifier === 'tablet') {
    modifier = '[formFactor=tablet]'
  } else if (modifier.startsWith('[if=')) {
    modifier = `${modifier}`
  } else if (notDefaultRules(rule)) {
    modifier = `${modifier}-`
  }

  if (!globalOptions.legacy) {
    modifier = camelCaseToDash(modifier)
  }

  return modifier
}

/**
 * Check if modifier is a default modifier
 * @param {string} modifier - Modifier to check
 * @returns {boolean} True if default modifier
 */
export function defaultModifier(modifier) {
  return modifier === '' || modifier === null || modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT'
}

/**
 * Check if rule is not a default rule
 * @param {string} rule - Rule to check
 * @returns {boolean} True if not default rule
 */
export function notDefaultRules(rule) {
  return rule !== '' && rule !== null && rule !== 'global' && rule !== 'default' && rule !== 'DEFAULT' && rule !== 'ios' && rule !== 'android' && rule !== 'android' && rule !== 'handheld' && rule !== 'tablet' && !rule.startsWith('[if=')
}

/**
 * Check if value contains Titanium-specific properties
 * @param {*} value - Value to check
 * @returns {string|*} 'titanium' if contains Titanium properties, processed value otherwise
 */
export function checkTitanium(value) {
  const substrings = ['Alloy', 'Ti.', 'Theme', 'Titanium', 'L(']

  if (typeof value === 'string') {
    if (substrings.some(substring => {
      return value.indexOf(substring) >= 0
    })) {
      return 'titanium'
    } else if (value.includes('#')) {
      return 'hex'
    }
    return value.replace(/[^a-zA-Z#%]+/g, '')
  }

  return value
}

/**
 * Convert camelCase to dash-case
 * @param {string} str - String to convert
 * @returns {string} Converted string
 */
export function camelCaseToDash(str) {
  if (str.includes('[') || str.includes('#')) {
    return str
  } else {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }
}

/**
 * Remove last character from string
 * @param {string} element - String to process
 * @returns {string} String without last character
 */
export function removeLastCharacter(element) {
  return element.slice(0, element.length - 1)
}

/**
 * Convert color to hex format
 * @param {string} color - Color to convert
 * @returns {string} Hex color string
 */
export function toHex(color) {
  if (color.includes('#')) {
    color = expandHex(color)
  } else if (color.match(/rgba?/i)) {
    color = rgbToHex(color)
  } else if (defaultColors(color)) {
    color = defaultColors(color)
  }

  return `'${color}'`
}

/**
 * Expand short hex color format to full format
 * @param {string} color - Short hex color
 * @returns {string} Expanded hex color
 */
export function expandHex(color) {
  // expand the shorter hex string forms to 6 or 8 digits
  if (color.length === 4) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    color = color.replace(HEX_3_REGEX, (m, r, g, b) => '#' + r + r + g + g + b + b)
  } else if (color.length === 5) {
    // Expand shorthand form (e.g. "03F8") to full form (e.g. "0033FF88")
    color = color.replace(HEX_4_REGEX, (m, a, r, g, b) => '#' + a + a + r + r + g + g + b + b)
  }

  return color
}

/**
 * Convert RGB/RGBA color to hex
 * @param {string} color - RGB/RGBA color string
 * @returns {string} Hex color string
 */
export function rgbToHex(color) {
  const rgba = color.replace(/^rgba?\(|\s+|\)$/img, '').split(',')
  const alpha = (((rgba[3] || 0o1) * 255) | 1 << 8).toString(16).slice(1)
  return `#${alpha}${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`
}

/**
 * Get default color value by name
 * @param {string} color - Color name
 * @returns {string|undefined} Hex color value or undefined if not found
 */
export function defaultColors(color) {
  const colors = {
    aqua: '#00FFFF',
    aquamarine: '#7FFFD4',
    azure: '#F0FFFF',
    beige: '#F5F5DC',
    bisque: '#FFE4C4',
    black: '#000000',
    blue: '#0000FF',
    brown: '#A52A2A',
    chartreuse: '#7FFF00',
    chocolate: '#D2691E',
    coral: '#FF7F50',
    cornsilk: '#FFF8DC',
    crimson: '#DC143C',
    cyan: '#00FFFF',
    darkgray: '#444444',
    fuchsia: '#FF00FF',
    gainsboro: '#DCDCDC',
    gold: '#FFD700',
    gray: '#808080',
    green: '#008000',
    grey: '#808080',
    indigo: '#4B0082',
    ivory: '#FFFFF0',
    khaki: '#F0E68C',
    lavender: '#E6E6FA',
    lightgray: '#cccccc',
    lime: '#00FF00',
    linen: '#FAF0E6',
    magenta: '#FF00FF',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    orange: '#FFA500',
    pink: '#FFC0CB',
    purple: '#800080',
    red: '#FF0000',
    salmon: '#FA8072',
    silver: '#C0C0C0',
    tan: '#D2B48C',
    teal: '#008080',
    violet: '#EE82EE',
    wheat: '#F5DEB3',
    white: '#FFFFFF',
    yellow: '#FFFF00'
  }

  return colors[color]
}

/**
 * Find index of class name in array
 * @param {string} _substring - Substring to find
 * @param {Array} _array - Array to search in
 * @returns {number} Index of found element or -1 if not found
 */
export function findIndexOfClassName(_substring, _array) {
  return _array.findIndex(element => element.startsWith(_substring))
}

/**
 * Fix invalid values using mapping
 * @param {Object} invalidValues - Mapping of invalid to valid values
 * @param {*} currentValue - Current value to check
 * @returns {*} Fixed value or original value
 */
export function fixInvalidValues(invalidValues, currentValue) {
  return invalidValues[currentValue] || currentValue
}

/**
 * Generate custom rules for Titanium styles
 * @param {Object} _value - Value object containing rules
 * @param {string} _key - Key for the rule
 * @returns {string} Generated styles string
 */
export function customRules(_value, _key) {
  // ! Want to refactor
  let convertedStyles = ''

  _.each(_value, (value, modifier) => {
    if (modifier === 'apply') {
      _applyClasses[setModifier2(_key)] = new Set(Array.isArray(_value[modifier]) ? _value[modifier] : _value[modifier].split(' '))

      convertedStyles += `'${setModifier2(_key)}': { {_applyProperties_} }\n`
    } else {
      let customProperties = ''

      _.each(value, (theValue, theModifier) => {
        if (typeof (theValue) === 'object' && theValue !== null) {
          if (theModifier === 'apply') {
            _applyClasses[`${setModifier2(_key, modifier)}`] = new Set(Array.isArray(theValue) ? theValue : theValue.split(' '))

            customProperties += ' {_applyProperties_},'
          } else {
            customProperties += ` ${theModifier}: {`

            let extraCustomProperties = ''

            _.each(theValue, (extraValue, extraModifier) => {
              if (typeof (extraValue) === 'object' && extraValue !== null) {
                customProperties += ` ${extraModifier}: {`

                let moreExtraCustomProperties = ''

                _.each(extraValue, (moreExtraValue, moreModifier) => {
                  moreExtraCustomProperties += ` ${moreModifier}: ${parseValue(moreExtraValue)},`
                })

                customProperties += `${removeLastCharacter(moreExtraCustomProperties)} },`
              } else {
                extraCustomProperties += ` ${extraModifier}: ${parseValue(extraValue)},`
              }
            })

            customProperties += `${removeLastCharacter(extraCustomProperties)} },`
          }
        } else {
          if (theModifier === 'apply') {
            _applyClasses[`${setModifier2(_key, modifier)}${setModifier2(modifier)}`] = new Set(Array.isArray(theValue) ? theValue : theValue.split(' '))

            customProperties += ' {_applyProperties_},'
          } else {
            customProperties += ` ${theModifier}: ${parseValue(theValue)},`
          }
        }
      })

      convertedStyles += `'${setModifier2(_key, modifier)}${setModifier2(modifier)}': {${removeLastCharacter(customProperties)} }\n`
    }
  })

  return convertedStyles
}

// Export internal variables for other modules
export { _applyClasses, cwd }

/**
 * Fix percentage values by replacing problematic .333333% with .333334%
 * @param {Object} theObject - Object containing percentage values to fix
 */
export function fixPercentages(theObject) {
  _.each(theObject, (value, key) => {
    if (value.toString().includes('.333333%')) {
      theObject[key] = value.replace('.333333%', '.333334%')
    }
  })
}

/**
 * Remove deprecated color keys from an object
 * @param {Object} theObject - Object containing color properties
 */

export function compileApplyDirectives(twClasses) {
  const twClassesArray = twClasses.split(/\r?\n/)
  const fontsClassesArray = (fs.existsSync(cwd + '/purgetss/styles/fonts.tss')) ? fs.readFileSync(cwd + '/purgetss/styles/fonts.tss', 'utf8').split(/\r?\n/) : null

  _.each(_applyClasses, (values, className) => {
    const indexOfModifier = findIndexOfClassName(`'${className}':`, twClassesArray)

    if (indexOfModifier !== -1) {
      const compoundClasses = []
      const classesWithOpacityValues = []

      _.each([...values], searchClass => {
        if (searchClass.includes('ios:')) {
          searchClass = `${searchClass.replace('ios:', '')}[platform=ios]`
        } else if (searchClass.includes('android:')) {
          searchClass = `${searchClass.replace('android:', '')}[platform=android]`
        }

        // ! TODO: Needs to handle open, close and complete states...
        if (searchClass.includes('open:') || searchClass.includes('close:') || searchClass.includes('complete:')) {
          console.warn('The open: modifier is not supported in this version of PurgeTSS. Please use the apply: modifier instead.')
        }

        if (searchClass.includes('(')) {
          const theClass = formatArbitraryValues(searchClass)

          if (theClass) compoundClasses.push(theClass)
          // ! Process transparency values
        } else if (checkColorClasses(searchClass)) {
          // Set opacity to color properties
          const originalClass = searchClass
          const decimalValue = searchClass.split('/')[1]
          const transparency = Math.round(decimalValue * 255 / 100).toString(16).padStart(2, '0')
          const classNameWithTransparency = searchClass.substring(0, searchClass.lastIndexOf('/'))

          classesWithOpacityValues.push({ decimalValue, transparency, originalClass, classNameWithTransparency })
        } else {
          const className = `'.${searchClass}':`
          let foundClass = twClassesArray[findIndexOfClassName(className, twClassesArray)]

          if (foundClass) compoundClasses.push(justProperties(foundClass))
          else if (fontsClassesArray) {
            foundClass = fontsClassesArray[findIndexOfClassName(className, fontsClassesArray)]
            if (foundClass) compoundClasses.push(justProperties(foundClass))
          }
        }
      })

      // Handle opacity values
      if (classesWithOpacityValues.length) {
        classesWithOpacityValues.forEach(opacityValue => {
          const opacityIndex = findIndexOfClassName(`'.${opacityValue.classNameWithTransparency}`, twClassesArray)

          if (opacityIndex > -1) {
            const defaultHexValue = (twClassesArray[opacityIndex].includes('from')) ? twClassesArray[opacityIndex].match(/#[0-9a-f]{6}/g)[1] : twClassesArray[opacityIndex].match(/#[0-9a-f]{6}/i)[0]
            const classWithoutDecimalOpacity = `${twClassesArray[opacityIndex].replace(new RegExp(defaultHexValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `#${opacityValue.transparency}${defaultHexValue.substring(1)}`)}`

            compoundClasses.push(justProperties(classWithoutDecimalOpacity))
          }
        })
      }

      twClassesArray[indexOfModifier] = _.replace(twClassesArray[indexOfModifier], /{_applyProperties_}/, fixDuplicateKeys(compoundClasses).join(', '))
    }
  })

  return twClassesArray.join('\n')
}

export function justProperties(_foundClass) {
  return _foundClass.match(/{(.*)}/)[1].trim()
}

export function formatArbitraryValues(arbitraryValue, fromXMLs = false) {
  const sign = (arbitraryValue.startsWith('-')) ? '-' : ''
  const splitedContent = (arbitraryValue.startsWith('-')) ? arbitraryValue.substring(1).split('-') : arbitraryValue.split('-')

  if (splitedContent.length === 1) {
    return ''
  } else if (splitedContent.length === 2) {
    let rule = splitedContent.slice(0, 1).join('-')
    let value = splitedContent[1].match(/(?<=\().*(?=\))/).pop()

    if (rule === 'text') {
      rule = (value.includes('#') || value.includes('rgb')) ? 'text-color' : 'text-size'
    }

    if (rule === 'border') {
      rule = (value.includes('#') || value.includes('rgb')) ? 'border-color' : 'border-width'
    }

    if (rule === 'paging') {
      rule = (value.includes('#') || value.includes('rgb')) ? 'paging-color' : 'paging-alpha'
    }

    let properties = arbitraryValuesTable[rule]

    if (rule === 'from') {
      properties = _.replace(properties, /{value1}/g, addTransparencyToHex(parseValue(value)))
    }

    if (rule === 'origin') {
      const value1 = (value.includes(',')) ? value.split(',')[1] : value
      value = value.split(',')[0]
      properties = _.replace(properties, /{value1}/g, parseValue(value1, sign))
    }

    if (properties) {
      return (fromXMLs)
        ? `'.${arbitraryValue}': { ` + _.replace(properties, /{value}/g, parseValue(value, sign)) + ' }'
        : _.replace(properties, /{value}/g, parseValue(value, sign))
    }
  } else if (splitedContent.length === 3) {
    const rule = splitedContent.slice(0, 2).join('-')
    const value = splitedContent[2].match(/(?<=\().*(?=\))/).pop()
    let properties = arbitraryValuesTable[rule]

    if (properties) {
      if (splitedContent[0] === 'rounded') {
        properties = _.replace(properties, /{value1}/g, parseValue(parseValue(value) / 2, sign))
      }
      return (fromXMLs)
        ? `'.${arbitraryValue}': { ` + _.replace(properties, /{value}/g, parseValue(value, sign)) + ' }'
        : _.replace(properties, /{value}/g, parseValue(value, sign))
    }
  } else if (splitedContent.length === 4) {
    const rule = splitedContent.slice(0, 3).join('-')
    const value = splitedContent[3].match(/(?<=\().*(?=\))/).pop()
    let properties = arbitraryValuesTable[rule]

    if (properties) {
      if (rule.includes('from')) {
        properties = _.replace(properties, /{value1}/g, addTransparencyToHex(parseValue(value)))
      }

      return (fromXMLs)
        ? `'.${arbitraryValue}': { ` + _.replace(properties, /{value}/g, parseValue(value, sign)) + ' }'
        : _.replace(properties, /{value}/g, parseValue(value, sign))
    }
  } else if (splitedContent.length === 5) {
    const rule = splitedContent.slice(0, 4).join('-')
    const value = splitedContent[4].match(/(?<=\().*(?=\))/).pop()
    const properties = arbitraryValuesTable[rule]

    if (properties) {
      return (fromXMLs)
        ? `'.${arbitraryValue}': { ` + _.replace(properties, /{value}/g, parseValue(value, sign)) + ' }'
        : _.replace(properties, /{value}/g, parseValue(value, sign))
    }
  }

  return (fromXMLs) ? `// Property not yet supported: ${arbitraryValue}` : null
}

export function checkPlatformAndDevice(line, className) {
  // https://regex101.com/r/6VTh23/1
  if (className.includes('ios:')) {
    return (line.includes('platform=ios'))
      ? `${line.replace(/[^'.][^']+|1/, 'ios:$&')}\n`
      : `${line.replace(/[^'.][^']+|1/, 'ios:$&[platform=ios]')}\n`
  } else if (className.includes('android:')) {
    return (line.includes('platform=android'))
      ? `${line.replace(/[^'.][^']+|1/, 'android:$&')}\n`
      : `${line.replace(/[^'.][^']+|1/, 'android:$&[platform=android]')}\n`
  } else if (className.includes('handheld:')) {
    return (line.includes('formFactor=handheld'))
      ? `${line.replace(/[^'.][^']+|1/, 'handheld:$&')}\n`
      : `${line.replace(/[^'.][^']+|1/, 'handheld:$&[formFactor=handheld]')}\n`
  } else if (className.includes('tablet:')) {
    return (line.includes('formFactor=tablet'))
      ? `${line.replace(/[^'.][^']+|1/, 'tablet:$&')}\n`
      : `${line.replace(/[^'.][^']+|1/, 'tablet:$&[formFactor=tablet]')}\n`
  } else if (className.includes('child:')) {
    return `${line.replace(/[^'.][^']+|1/, 'child:$&').replace(/{(.*)}/, '{ animationProperties: { child: $& } }')}\n`
  } else if (className.includes('children:')) {
    return `${line.replace(/[^'.][^']+|1/, 'children:$&').replace(/{(.*)}/, '{ animationProperties: { children: $& } }')}\n`
  } else if (className.includes('open:')) {
    return `${line.replace(/[^'.][^']+|1/, 'open:$&').replace(/{(.*)}/, '{ animationProperties: { open: $& } }')}\n`
  } else if (className.includes('close:')) {
    return `${line.replace(/[^'.][^']+|1/, 'close:$&').replace(/{(.*)}/, '{ animationProperties: { close: $& } }')}\n`
  } else if (className.includes('complete:')) {
    return `${line.replace(/[^'.][^']+|1/, 'complete:$&').replace(/{(.*)}/, '{ animationProperties: { complete: $& } }')}\n`
  } else if (className.includes('bounds:') && (line.includes('top') || line.includes('right') || line.includes('bottom') || line.includes('left'))) {
    return `${line.replace(/[^'.][^']+|1/, 'bounds:$&').replace(/{(.*)}/, '{ bounds: $& }')}\n`
  } else if (className.includes('drag:')) {
    return `${line.replace(/[^'.][^']+|1/, 'drag:$&').replace(/{(.*)}/, '{ draggable: { drag: $& } }')}\n`
  } else if (className.includes('drop:')) {
    return `${line.replace(/[^'.][^']+|1/, 'drop:$&').replace(/{(.*)}/, '{ draggable: { drop: $& } }')}\n`
  } else {
    return `${line}\n`
  }
}

export function fixDuplicateKeys(compoundClasses) {
  compoundClasses.sort()

  const fontObject = []
  const cleanedStyles = []
  const paddingObject = []
  const backgroundGradientObject = []

  _.each(compoundClasses, value => {
    if (compoundClasses.length > 1) {
      if (value.includes('font:')) {
        fontObject.push(value.replace('font: ', '').replace(/{(.*)}/, '$1').trim())
      } else if (value.includes('backgroundGradient: { colors')) {
        backgroundGradientObject.push(value.replace('backgroundGradient: ', '').replace(/{(.*)}/, '$1').trim())
      } else if (value.includes('padding:')) {
        paddingObject.push(value.replace('padding: ', '').replace(/{(.*)}/, '$1').trim())
      } else {
        cleanedStyles.push(value)
      }
    } else {
      cleanedStyles.push(value)
    }
  })

  if (paddingObject.length) {
    const individualPaddingObjects = []
    paddingObject.forEach(propertyAndValue => {
      if (propertyAndValue.includes(',')) {
        const separateObjects = propertyAndValue.split(',')
        separateObjects.forEach(obj => {
          individualPaddingObjects.push(obj.trim())
        })
      } else {
        individualPaddingObjects.push(propertyAndValue)
      }
    })

    cleanedStyles.push(`padding: { ${individualPaddingObjects.sort().join(', ')} }`)
  }

  if (fontObject.length) {
    cleanedStyles.push(`font: { ${fontObject.sort().join(', ')} }`)
  }

  if (backgroundGradientObject.length === 1) {
    cleanedStyles.push(`backgroundGradient: { ${backgroundGradientObject} }`)
  } else if (backgroundGradientObject.length === 2) {
    const toColor = backgroundGradientObject[1].replace('colors: ', '').replace(/[[\]']+/g, '').trim().split(',')
    const fromToColors = backgroundGradientObject[0].replace('colors: ', '').replace(/[[\]']+/g, '').trim().split(',')
    fromToColors[0] = toColor[0]
    cleanedStyles.push(`backgroundGradient: { colors: [ '${fromToColors[0]}', '${fromToColors[1].trim()}' ] }`)
  }

  // Missing properties to process
  /*
  * shadowColor
  * viewShadowColor
  * titleAttributes:shadow:color
  * titleAttributes:shadow:offset
  */

  return cleanedStyles
}

export function remove_last_character(element) {
  return element.slice(0, element.length - 1)
}

export function removeFractions(modifiersAndValues, extras = []) {
  const newModifiersAndValues = { ...modifiersAndValues }
  _.each(newModifiersAndValues, (value, key) => {
    if (key.includes('/')) {
      delete newModifiersAndValues[key]
    }
  })

  if (extras.length) {
    _.each(extras, key => {
      delete newModifiersAndValues[key]
    })
  }

  return newModifiersAndValues
}

export function expandAnimationApply(className, applyString) {
  // Convierte un string tipo 'open:opacity-0 close:opacity-100 duration-300' en clases hijas
  const parts = applyString.split(/\s+/)
  const result = {}
  let duration, ease
  parts.forEach(part => {
    if (part.startsWith('open:')) {
      const [prop, value] = part.replace('open:', '').split('-')
      result[`.${className}.open`] = { animationProperties: { open: { [prop]: isNaN(Number(value)) ? value : Number(value) } } }
    } else if (part.startsWith('close:')) {
      const [prop, value] = part.replace('close:', '').split('-')
      result[`.${className}.close`] = { animationProperties: { close: { [prop]: isNaN(Number(value)) ? value : Number(value) } } }
    } else if (part.startsWith('duration-')) {
      duration = Number(part.replace('duration-', ''))
    } else if (part.startsWith('ease-')) {
      ease = part.replace('ease-', '')
    }
  })
  // Agrega duration y ease a ambas si existen
  if (duration) {
    Object.keys(result).forEach(k => {
      const state = k.endsWith('.open') ? 'open' : 'close'
      result[k].animationProperties[state].duration = duration
    })
  }
  if (ease) {
    Object.keys(result).forEach(k => {
      const state = k.endsWith('.open') ? 'open' : 'close'
      result[k].animationProperties[state].curve = ease
    })
  }
  return result
}

export function removeDeprecatedColors(theObject) {
  delete theObject.blueGray
  delete theObject.coolGray
  delete theObject.current
  delete theObject.inherit
  delete theObject.lightBlue
  delete theObject.trueGray
  delete theObject.warmGray
}

export function removeLastDash(str) {
  return str.replace(/-$/, '')
}

export function addTransparencyToValue(color) {
  if (color.includes('#')) {
    switch (color.length) {
      case 4:
        color = `#0${color[0]}${color[1]}${color[2]}`
        break
      case 7:
        color = `#00${color[0]}${color[1]}${color[2]}${color[3]}${color[4]}${color[5]}`
        break
      case 9:
        color = `#00${color[2]}${color[3]}${color[4]}${color[5]}${color[6]}${color[7]}`
        break
      case 11:
        color = `#00${color[4]}${color[5]}${color[6]}${color[7]}${color[8]}${color[9]}`
        break
    }
    return `'${color}'`
  } else if (color.match(/rgba?/i)) {
    const rgba = color.replace(/[[\]')]+/g, '').split(',')
    color = `'${rgba[0].trim()}, ${rgba[1].trim()}, ${rgba[2].trim()}, 0)'`
  }

  return color
}

export function addTransparencyToHex(color, transparency = '00') {
  if (color.includes('#')) {
    if (color.includes('\'')) {
      color = color.replace(/'/g, '')
    }
    switch (color.length) {
      case 4:
        color = `#${transparency}${color[1]}${color[2]}${color[3]}`
        break
      case 7:
        color = `#${transparency}${color[1]}${color[2]}${color[3]}${color[4]}${color[5]}${color[6]}`
        break
      case 9:
        color = `#${transparency}${color[3]}${color[4]}${color[5]}${color[6]}${color[7]}${color[8]}`
        break
    }
  }

  return `'${color}'`
}

export function checkColorClasses(cleanClassName) {
  return (
    cleanClassName.startsWith('active-tint-') ||
    cleanClassName.startsWith('active-title-') ||
    cleanClassName.startsWith('badge-') ||
    cleanClassName.startsWith('bar-') ||
    cleanClassName.startsWith('bg-') ||
    cleanClassName.startsWith('border-') ||
    cleanClassName.startsWith('current-page-indicator-') ||
    cleanClassName.startsWith('date-time-') ||
    cleanClassName.startsWith('disabled-') ||
    cleanClassName.startsWith('from-') ||
    cleanClassName.startsWith('highlighted-') ||
    cleanClassName.startsWith('hint-text-') ||
    cleanClassName.startsWith('image-touch-feedback-') ||
    cleanClassName.startsWith('indicator-') ||
    cleanClassName.startsWith('keyboard-toolbar-') ||
    cleanClassName.startsWith('nav-tint-') ||
    cleanClassName.startsWith('on-tint-') ||
    cleanClassName.startsWith('page-indicator-') ||
    cleanClassName.startsWith('paging-control-') ||
    cleanClassName.startsWith('placeholder-') ||
    cleanClassName.startsWith('pull-bg-') ||
    cleanClassName.startsWith('results-bg-') ||
    cleanClassName.startsWith('results-separator-') ||
    cleanClassName.startsWith('selected-') ||
    cleanClassName.startsWith('separator-') ||
    cleanClassName.startsWith('shadow-') ||
    cleanClassName.startsWith('subtitle-') ||
    cleanClassName.startsWith('tabs-bg-') ||
    cleanClassName.startsWith('text-') ||
    cleanClassName.startsWith('thumb-tint-') ||
    cleanClassName.startsWith('tint-') ||
    cleanClassName.startsWith('title-') ||
    cleanClassName.startsWith('to-') ||
    cleanClassName.startsWith('touch-feedback-') ||
    cleanClassName.startsWith('track-tint-') ||
    cleanClassName.startsWith('view-shadow-')) &&
    cleanClassName.includes('/')
}

const arbitraryValuesTable = {
  // Spacing
  'bg-l-cap': 'backgroundLeftCap: {value}',
  'bg-padding-b': 'backgroundPaddingBottom: {value}',
  'bg-padding-l': 'backgroundPaddingLeft: {value}',
  'bg-padding-r': 'backgroundPaddingRight: {value}',
  'bg-padding-t': 'backgroundPaddingTop: {value}',
  'bg-t-cap': 'backgroundTopCap: {value}',
  bottom: 'bottom: {value}',
  'content-h': 'contentHeight: {value}',
  'content-w': 'contentWidth: {value}',
  content: 'contentWidth: {value}, contentHeight: {value}',
  'gap-b': 'bottom: {value}',
  'gap-l': 'left: {value}',
  'gap-r': 'right: {value}',
  'gap-t': 'top: {value}',
  'gap-x': 'left: {value}, right: {value}',
  'gap-y': 'top: {value}, bottom: {value}',
  gap: 'top: {value}, right: {value}, bottom: {value}, left: {value}',
  h: 'height: {value}',
  'indentation-level': 'indentionLevel: {value}',
  'keyboard-toolbar-h': 'keyboardToolbarHeight: {value}',
  l: 'left: {value}',
  'left-button-padding': 'leftButtonPadding: {value}',
  'left-w': 'leftWidth: {value}',
  left: 'left: {value}',
  lw: 'leftWidth: {value}',
  m: 'top: {value}, right: {value}, bottom: {value}, left: {value}',
  'max-elevation': 'maxElevation: {value}',
  'max-row-h': 'maxRowHeight: {value}',
  mb: 'bottom: {value}',
  'min-row-h': 'minRowHeight: {value}',
  ml: 'left: {value}',
  mr: 'right: {value}',
  mt: 'top: {value}',
  mx: 'right: {value}, left: {value}',
  my: 'top: {value}, bottom: {value}',
  p: 'padding: { top: {value}, right: {value}, bottom: {value}, left: {value} }',
  'padding-b': 'paddingBottom: {value}',
  'padding-bottom': 'paddingBottom: {value}',
  'padding-l': 'paddingLeft: {value}',
  'padding-left': 'paddingLeft: {value}',
  'padding-r': 'paddingRight: {value}',
  'padding-right': 'paddingRight: {value}',
  'padding-t': 'paddingTop: {value}',
  'padding-top': 'paddingTop: {value}',
  'padding-x': 'paddingLeft: {value}, paddingRight: {value}',
  'padding-y': 'paddingTop: {value}, paddingBottom: {value}',
  padding: 'paddingTop: {value}, paddingBottom: {value}, paddingLeft: {value}, paddingRight: {value}',
  'paging-control-h': 'pagingControlHeight: {value}',
  pb: 'padding: { bottom: {value} }',
  pl: 'padding: { left: {value} }',
  pr: 'padding: { right: {value} }',
  pt: 'padding: { top: {value} }',
  px: 'padding: { left: {value}, right: {value} }',
  py: 'padding: { top: {value}, bottom: {value} }',
  r: 'right: {value}',
  'right-button-padding': 'rightButtonPadding: {value}',
  'right-w': 'rightWidth: {value}',
  right: 'right: {value}',
  'rounded-b': 'borderRadius: [0, 0, {value}, {value}]',
  'rounded-bl': 'borderRadius: [0, 0, 0, {value}]',
  'rounded-br': 'borderRadius: [0, 0, {value}, 0]',
  'rounded-full': 'width: {value}, height: {value}, borderRadius: {value1}',
  'rounded-l': 'borderRadius: [{value}, 0, 0, {value}]',
  'rounded-r': 'borderRadius: [0, {value}, {value}, 0]',
  'rounded-t': 'borderRadius: [{value}, {value}, 0, 0]',
  'rounded-tl': 'borderRadius: [{value}, 0, 0, 0]',
  'rounded-tr': 'borderRadius: [0, {value}, 0, 0]',
  rounded: 'borderRadius: {value}',
  'row-h': 'rowHeight: {value}',
  rw: 'rightWidth: {value}',
  'section-header-top-padding': 'sectionHeaderTopPadding: {value}',
  'separator-h': 'separatorHeight: {value}',
  'shadow-radius': 'shadowRadius: {value}',
  'target-image-h': 'targetImageHeight: {value}',
  'target-image-w': 'targetImageWidth: {value}',
  top: 'top: {value}',
  w: 'width: {value}',
  wh: 'width: {value}, height: {value}',
  'x-offset': 'xOffset: {value}',
  x: 'left: {value}, right: {value}',
  'y-offset': 'yOffset: {value}',
  y: 'top: {value}, bottom: {value}',

  // Color
  'active-tint': 'activeTintColor: {value}',
  'active-title': 'activeTitleColor: {value}',
  'badge-bg': 'badgeBackgroundColor: {value}',
  'badge-text': 'badgeTextColor: {value}',
  badge: 'badgeColor: {value}',
  bar: 'barColor: {value}',
  'bg-disabled': 'backgroundDisabledColor: {value}',
  'bg-focused': 'backgroundFocusedColor: {value}',
  'bg-from': 'backgroundGradient: { colors: [ {value1}, {value} ] }',
  'bg-selected-from': 'backgroundSelectedGradient: { colors: [ {value1}, {value} ] }',
  'bg-selected-to': 'backgroundSelectedGradient: { colors: [ {value} ] }',
  'bg-selected': 'backgroundSelectedColor: {value}',
  'bg-to': 'backgroundGradient: { colors: [ {value} ] }',
  bg: 'backgroundColor: {value}',
  'border-color': 'borderColor: {value}',
  colors: 'colors: {value}',
  'content-scrim': 'contentScrimColor: {value}',
  'current-page-indicator': 'currentPageIndicatorColor: {value}',
  'date-time': 'dateTimeColor: {value}',
  disabled: 'disabledColor: {value}',
  'drop-shadow': 'shadowColor: {value}',
  from: 'backgroundGradient: { colors: [ {value1}, {value} ] }',
  highlighted: 'highlightedColor: {value}',
  'hint-text': 'hintTextColor: {value}',
  icon: 'iconColor: {value}',
  'image-touch-feedback': 'imageTouchFeedbackColor: {value}',
  index: 'index: {value}',
  indicator: 'indicatorColor: {value}',
  'keyboard-toolbar': 'keyboardToolbarColor: {value}',
  light: 'lightColor: {value}',
  'nav-tint': 'navTintColor: {value}',
  'navigation-icon': 'navigationIconColor: {value}',
  'on-tint': 'onTintColor: {value}',
  'page-indicator': 'pageIndicatorColor: {value}',
  'paging-control': 'pagingControlColor: {value}',
  placeholder: 'hintTextColor: {value}',
  'pull-bg': 'pullBackgroundColor: {value}',
  'results-bg': 'resultsBackgroundColor: {value}',
  'results-separator': 'resultsSeparatorColor: {value}',
  'selected-bg': 'selectedBackgroundColor: {value}',
  'selected-button': 'selectedButtonColor: {value}',
  'selected-subtitle': 'selectedSubtitleColor: {value}',
  'selected-text': 'selectedTextColor: {value}',
  selected: 'selectedColor: {value}',
  separator: 'separatorColor: {value}',
  shadow: 'viewShadowColor: {value}',
  'status-bar-bg': 'statusBarBackgroundColor: {value}',
  'subtitle-text': 'subtitleTextColor: {value}',
  subtitle: 'subtitleColor: {value}',
  'tabs-bg-selected': 'tabsBackgroundSelectedColor: {value}',
  'tabs-bg': 'tabsBackgroundColor: {value}',
  'text-color': 'color: {value}, textColor: {value}',
  'thumb-tint': 'thumbTintColor: {value}',
  tint: 'tint: {value}',
  'tint-color': 'tintColor: {value}',
  'title-attributes-shadow': 'titleAttributes: { shadow: { color: {value} } }',
  'title-attributes': 'titleAttributes: { color: {value} }',
  'title-text': 'titleTextColor: {value}',
  title: 'titleColor: {value}',
  to: 'backgroundGradient: { colors: [ {value} ] }',
  'touch-feedback': 'touchFeedback: true, touchFeedbackColor: {value}',
  'track-tint': 'trackTintColor: {value}',
  'view-shadow': 'viewShadowColor: {value}',

  // Misc
  'active-tab': 'activeTab: {value}',
  'border-width': 'borderWidth: {value}',
  'cache-size': 'cacheSize: {value}',
  cancel: 'cancel: {value}',
  'count-down': 'countDownDuration: {value}',
  delay: 'delay: {value}',
  destructive: 'destructive: {value}',
  duration: 'duration: {value}',
  elevation: 'elevation: {value}',
  font: 'font: { fontWeight: {value} }',
  'horizontal-margin': 'horizontalMargin: {value}',
  lines: 'lines: {value}',
  'max-length': 'maxLength: {value}',
  'max-lines': 'maxLines: {value}',
  'max-zoom-scale': 'maxZoomScale: {value}',
  max: 'max: {value}',
  maximum: 'maximum: {value}',
  'min-zoom-scale': 'minZoomScale: {value}',
  min: 'min: {value}',
  'minimum-text': 'minimumFontSize: {value}',
  minimum: 'minimum: {value}',
  opacity: 'opacity: {value}',
  origin: 'anchorPoint: { x: {value}, y: {value1} }',
  'paging-control-alpha': 'pagingControlAlpha: {value}',
  'paging-control-timeout': 'pagingControlTimeout: {value}',
  preferred: 'preferred: {value}',
  'repeat-count': 'repeatCount: {value}',
  repeat: 'repeat: {value}',
  rotate: 'rotate: {value}',
  scale: 'scale: {value}',
  'text-size': 'font: { fontSize: {value} }',
  timeout: 'timeout: {value}',
  value: 'value: {value}',
  'vertical-margin': 'verticalMargin: {value}',
  z: 'zIndex: {value}',
  'zoom-scale': 'zoomScale: {value}'
}
// Exported as function

/**
 * Add negative values to modifiers
 * @param {Object} modifiersAndValues - Object containing modifiers and values
 * @returns {Object} Object with negative values
 */
export function addNegativeValues(modifiersAndValues) {
  _.each(modifiersAndValues, (value, key) => {
    modifiersAndValues[key] = '-' + value
  })

  return modifiersAndValues
}
