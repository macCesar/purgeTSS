import fs from 'fs'
import _ from 'lodash'
import { isNotJunk } from 'junk'
import logger from './logger.js'

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

(function constructor() {
  'use strict'

  const files = fs.readdirSync('./node_modules/framework7-icons/svg')

  const justNames = []

  files.filter(isNotJunk).forEach(name => {
    justNames.push(name.replace('.svg', ''))
  })

  let framework7 = fs.readFileSync('./lib/templates/framework7/template.js.cjs', 'utf8')

  framework7 += '\n' + fs.readFileSync('./lib/templates/icon-functions.js.cjs', 'utf8')

  let exportIcons = '\nconst icons = {\n'

  _.each(justNames, rule => {
    exportIcons += `\t'${prettifyFontName(rule)}': '${rule}',\n`
  })

  exportIcons += '};\n'

  exportIcons += 'export const icons = icons;\n'

  exportIcons += '\nconst iconKeys = Object.keys(icons)\n'

  framework7 += exportIcons

  fs.writeFileSync('./dist/framework7icons.js', framework7, err => {
    throw err
  })

  logger.file('./dist/framework7icons.js')
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
