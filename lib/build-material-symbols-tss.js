const fs = require('fs')
const _ = require('lodash')
const logger = require('./logger')

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

(function constructor() {
  'use strict'

  let tssClasses = fs.readFileSync('./lib/templates/materialsymbols/template.tss', 'utf8') + '\n'

  tssClasses += fs.readFileSync('./lib/templates/materialsymbols/reset.tss', 'utf8')

  let codepoints = fs.readFileSync('./lib/templates/materialsymbols/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialsymbols/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialsymbols/MaterialSymbolsSharp[FILL,GRAD,opsz,wght].codepoints', 'utf8')

  codepoints = codepoints.split('\n').sort()

  tssClasses += processCodePoints(_.uniq(codepoints), 'ms-')

  fs.writeFileSync('./dist/materialsymbols.tss', tssClasses, err => {
    throw err
  })

  logger.file('./dist/materialsymbols.tss')
}())

function processCodePoints(data, addSelector) {
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
