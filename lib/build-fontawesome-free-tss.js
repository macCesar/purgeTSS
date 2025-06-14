import fs from 'fs';
import _ from 'lodash';
import logger from './logger.js';
import readCSS from 'read-css';

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

(function constructor() {
  'use strict'

  readCSS('./node_modules/@fortawesome/fontawesome-free/css/all.css', (err, data) => {
    if (err) throw err

    let tssClasses = fs.readFileSync('./lib/templates/fontawesome/free-template.tss', 'utf8') + '\n'

    tssClasses += fs.readFileSync('./lib/templates/fontawesome/free-reset.tss', 'utf8')

    tssClasses += processCSS(data)

    fs.writeFileSync('./dist/fontawesome.tss', tssClasses, _err => {
      throw _err
    })

    logger.file('./dist/fontawesome.tss')
  })
}())

export function processCSS(data) {
  const rules = _.map(data.stylesheet.rules, rule => {
    if (rule.type === 'rule' && rule.selectors && rule.declarations[0].value.includes('"\\')) {
      return {
        selector: rule.selectors[0].replace('::before', '').replace(':before', ''),
        property: ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '')).slice(-4)
      }
    }
  })

  let paraTSS = ''

  _.each(rules, rule => {
    if (rule) {
      paraTSS += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`
    }
  })

  return paraTSS
}
