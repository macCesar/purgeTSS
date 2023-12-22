const fs = require('fs')
const _ = require('lodash')
const logger = require('./logger')

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

(function constructor() {
  'use strict'

  let tssClasses = fs.readFileSync('./lib/templates/materialicons/template.tss', 'utf8') + '\n'

  tssClasses += fs.readFileSync('./lib/templates/materialicons/reset.tss', 'utf8')

  let codepoints = fs.readFileSync('./lib/templates/materialicons/MaterialIcons-Regular.codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsOutlined-Regular.codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsRound-Regular.codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsSharp-Regular.codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsTwoTone-Regular.codepoints', 'utf8')

  codepoints = codepoints.split('\n').sort()

  tssClasses += processCodePoints(_.uniq(codepoints), 'mi-')

  fs.writeFileSync('./dist/materialicons.tss', tssClasses, err => {
    throw err
  })

  logger.file('./dist/materialicons.tss')
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
