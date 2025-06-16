import _ from 'lodash'

/**
 * Process codepoints data to TSS format
 * Shared utility for Material Icons and Material Symbols builders
 * 
 * @param {Array} data - Codepoints data array
 * @param {string} addSelector - Selector prefix to add
 * @returns {string} Processed TSS classes
 */
export function processCodePoints(data, addSelector) {
  const rules = _.map(data, rule => {
    if (rule !== '') {
      const separado = rule.split(' ')
      return {
        selector: separado[0],
        property: separado[1]
      }
    }
  })

  let paraTSS = ''

  _.each(rules, rule => {
    if (rule) {
      paraTSS += `'.${addSelector}${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`
    }
  })

  return paraTSS
}