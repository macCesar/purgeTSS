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

  let tssClasses = fs.readFileSync('./lib/templates/framework7/template.tss', 'utf8') + '\n'

  tssClasses += fs.readFileSync('./lib/templates/framework7/reset.tss', 'utf8')

  tssClasses += processNames(justNames)

  fs.writeFileSync('./dist/framework7icons.tss', tssClasses, err => {
    throw err
  })

  logger.file('./dist/framework7icons.tss')
}())

export function processNames(data) {
  let paraTSS = ''

  _.each(data, rule => {
    paraTSS += `'.f7-${rule}': { text: '${rule}', title: '${rule}' }\n`
  })

  return paraTSS
}
