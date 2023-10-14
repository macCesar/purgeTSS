const fs = require('fs')
const _ = require('lodash')
const read = require('read-css')
const colores = require('./colores').colores
const purgeLabel = colores.purgeLabel

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

(function constructor() {
  'use strict'

  read('./node_modules/@fortawesome/fontawesome-free/css/all.css', (err, data) => {
    if (err) throw err

    const rules = _.map(data.stylesheet.rules, rule => {
      if (rule.type === 'rule' && rule.selectors[0].includes(':before')) {
        return {
          selector: rule.selectors[0].replace('::before', '').replace(':before', '').replace('.', ''),
          property: ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '')).slice(-4)
        }
      }
    })

    let fontawesome = fs.readFileSync('./lib/templates/fontawesome/free-template.js', 'utf8')

    fontawesome += '\n' + fs.readFileSync('./lib/templates/icon-functions.js', 'utf8')

    let exportIcons = '\nconst icons = {\n'

    _.each(rules, rule => {
      if (rule) {
        exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`
      }
    })

    exportIcons += '};\n'

    exportIcons += 'exports.icons = icons;\n'

    fontawesome += exportIcons

    fs.writeFileSync('./dist/fontawesome.js', fontawesome, _err => {
      throw _err
    })

    console.log(`${purgeLabel} './dist/fontawesome.js' file created!`)
  })
}())

function prettifyFontName(str) {
  str = str.replace('fa-', '')
  const temp = str.split('-'); let i; let pretty

  for (i = 0; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
  }

  pretty = temp.join('')
  pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase())

  return pretty
}
