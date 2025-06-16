/**
 * PurgeTSS v7.1 - Fonts Folder Builder (Development)
 * 
 * Copies font files from node_modules to assets folder for development/distribution.
 * COPIED from lib/build-fonts-folder.js - NO CHANGES to logic.
 * 
 * Copies fonts to: ./assets/fonts/
 * 
 * @since 7.1.0 (refactored from lib/)
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { colores } from '../../../lib/colores.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')

const purgeLabel = colores.purgeLabel

/**
 * Callback function for file operations
 * COPIED exactly from original callback() function
 */
export function callback(err) {
  if (err) throw err
}

/**
 * Main builder function
 * COPIED exactly from original constructor() function
 */
export function buildFontsFolder() {
  const detinationFontsFolder = path.resolve(projectRoot, './assets/fonts')

  // FontAwesome
  let sourceFontsFolder = path.resolve(projectRoot, './node_modules/@fortawesome/fontawesome-free/webfonts')

  if (!fs.existsSync(detinationFontsFolder)) {
    fs.mkdirSync(detinationFontsFolder)
  }

  fs.copyFile(sourceFontsFolder + '/fa-brands-400.ttf', detinationFontsFolder + '/FontAwesome6Brands-Regular.ttf', callback)
  fs.copyFile(sourceFontsFolder + '/fa-regular-400.ttf', detinationFontsFolder + '/FontAwesome6Free-Regular.ttf', callback)
  fs.copyFile(sourceFontsFolder + '/fa-solid-900.ttf', detinationFontsFolder + '/FontAwesome6Free-Solid.ttf', callback)

  console.log(`${purgeLabel} Font Awesome Free copied to './assets/fonts'`)

  // framework7Icons-Regular
  sourceFontsFolder = path.resolve(projectRoot, './node_modules/framework7-icons/fonts')

  fs.copyFile(sourceFontsFolder + '/Framework7Icons-Regular.ttf', detinationFontsFolder + '/Framework7-Icons.ttf', callback)

  console.log(`${purgeLabel} Framework7-Icons.ttf copied to './assets/fonts'`)
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildFontsFolder()
}