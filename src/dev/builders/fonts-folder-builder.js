import { getFreeFontAwesomeBuildInfo } from '../utils/fontawesome-fonts.js'
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
import { colores } from '../../shared/brand-colors.js'

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
export async function buildFontsFolder() {
  const { copies } = getFreeFontAwesomeBuildInfo(projectRoot)
  const detinationFontsFolder = path.resolve(projectRoot, './assets/fonts')

  // FontAwesome
  let sourceFontsFolder = path.resolve(projectRoot, './src/fonts')

  if (!fs.existsSync(detinationFontsFolder)) {
    fs.mkdirSync(detinationFontsFolder)
  }

  for (const [source, destination] of Object.entries(copies)) {
    await fs.promises.copyFile(path.join(sourceFontsFolder, source), path.join(detinationFontsFolder, destination))
  }
  // Remove only obsolete generated Free font filenames after a major upgrade.
  for (const file of fs.readdirSync(detinationFontsFolder)) {
    if (/^FontAwesome\d+(?:Free-(?:Solid|Regular)|Brands-Regular)\.ttf$/.test(file) && !Object.values(copies).includes(file)) {
      fs.unlinkSync(path.join(detinationFontsFolder, file))
    }
  }

  console.log(`${purgeLabel} Font Awesome Free copied to './assets/fonts'`)

  // framework7Icons-Regular
  sourceFontsFolder = path.resolve(projectRoot, './node_modules/framework7-icons/fonts')

  await fs.promises.copyFile(sourceFontsFolder + '/Framework7Icons-Regular.ttf', detinationFontsFolder + '/Framework7-Icons.ttf')

  console.log(`${purgeLabel} Framework7-Icons.ttf copied to './assets/fonts'`)
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await buildFontsFolder()
}
