const fs = require('fs')
const _ = require('lodash')
const colores = require('./colores').colores
const purgeLabel = colores.purgeLabel

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

(function constructor() {
  'use strict'

  let codepoints = fs.readFileSync('./lib/templates/materialsymbols/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialsymbols/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialsymbols/MaterialSymbolsSharp[FILL,GRAD,opsz,wght].codepoints', 'utf8')

  const uniqueCodepoints = _.map(_.uniq(codepoints.split('\n').sort()), rule => {
    if (rule !== '') {
      const separado = rule.split(' ')
      return {
        selector: separado[0],
        property: separado[1]
      }
    }
  })

  let fileContent = fs.readFileSync('./lib/templates/materialsymbols/template.js', 'utf8')

  fileContent += '\n' + fs.readFileSync('./lib/templates/icon-functions.js', 'utf8')

  let exportIcons = '\nconst icons = {\n'

  _.each(uniqueCodepoints, rule => {
    if (rule) {
      exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`
    }
  })

  exportIcons += '};\n'

  exportIcons += 'exports.icons = icons;\n'

  fileContent += exportIcons

  fs.writeFileSync('./dist/materialsymbols.js', fileContent, err => {
    throw err
  })

  console.log(`${purgeLabel} './dist/materialsymbols.js' file created!`)
}())

function prettifyFontName(str) {
  const temp = str.split('_'); let i; let pretty

  for (i = 0; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
  }

  pretty = temp.join('')
  pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase())

  return pretty
}
