import fs from 'fs';
import _ from 'lodash';
import logger from './logger.js';

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

(function constructor() {
  'use strict'

  let codepoints = fs.readFileSync('./lib/templates/materialicons/MaterialIcons-Regular.codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsOutlined-Regular.codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsRound-Regular.codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsSharp-Regular.codepoints', 'utf8')
  codepoints += fs.readFileSync('./lib/templates/materialicons/MaterialIconsTwoTone-Regular.codepoints', 'utf8')

  const uniqueCodepoints = _.map(_.uniq(codepoints.split('\n').sort()), rule => {
    if (rule !== '') {
      const separado = rule.split(' ')
      return {
        selector: separado[0],
        property: separado[1]
      }
    }
  })

  let fileContent = fs.readFileSync('./lib/templates/materialicons/template.js.cjs', 'utf8')

  fileContent += '\n' + fs.readFileSync('./lib/templates/icon-functions.js.cjs', 'utf8')

  let exportIcons = '\nconst icons = {\n'

  _.each(uniqueCodepoints, rule => {
    if (rule) {
      exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`
    }
  })

  exportIcons += '};\n'

  exportIcons += 'export const icons = icons;\n'

  exportIcons += '\nconst iconKeys = Object.keys(icons)\n'

  fileContent += exportIcons

  fs.writeFileSync('./dist/materialicons.js', fileContent, err => {
    throw err
  })

  logger.file('./dist/materialicons.js')
}())

export function prettifyFontName(str) {
  const temp = str.split('_'); let i; let pretty

  for (i = 0; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
  }

  pretty = temp.join('')
  pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase())

  return pretty
}
