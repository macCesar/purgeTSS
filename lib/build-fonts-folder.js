const fs = require('fs')
const colores = require('./colores').colores
const purgeLabel = colores.purgeLabel

function callback(err) {
  if (err) throw err
}

(function constructor() {
  'use strict'

  const detinationFontsFolder = './assets/fonts'

  // FontAwesome
  let sourceFontsFolder = './node_modules/@fortawesome/fontawesome-free/webfonts'

  if (!fs.existsSync(detinationFontsFolder)) {
    fs.mkdirSync(detinationFontsFolder)
  }

  fs.copyFile(sourceFontsFolder + '/fa-brands-400.ttf', detinationFontsFolder + '/FontAwesome6Brands-Regular.ttf', callback)
  fs.copyFile(sourceFontsFolder + '/fa-regular-400.ttf', detinationFontsFolder + '/FontAwesome6Free-Regular.ttf', callback)
  fs.copyFile(sourceFontsFolder + '/fa-solid-900.ttf', detinationFontsFolder + '/FontAwesome6Free-Solid.ttf', callback)

  console.log(`${purgeLabel} Font Awesome Free copied to './assets/fonts'`)

  // framework7Icons-Regular
  sourceFontsFolder = './node_modules/framework7-icons/fonts'

  fs.copyFile(sourceFontsFolder + '/Framework7Icons-Regular.ttf', detinationFontsFolder + '/Framework7-Icons.ttf', callback)

  console.log(`${purgeLabel} Framework7-Icons.ttf copied to './assets/fonts'`)
}())
