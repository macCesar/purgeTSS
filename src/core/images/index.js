/**
 * PurgeTSS - Images pipeline orchestrator
 *
 * Discovers source images (auto from `purgetss/images/` or from a user-provided
 * path) and generates Titanium multi-density variants for Alloy or Classic
 * projects.
 *
 * Layouts:
 *   Alloy:   app/assets/android/images/res-{density}/  +  app/assets/iphone/images/
 *   Classic: Resources/android/images/res-{density}/   +  Resources/iphone/images/
 *
 * Subdirectories of `purgetss/images/` are preserved in the output paths.
 *
 * @fileoverview Orchestrator for `purgetss images`
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { logger } from '../branding/branding-logger.js'
import { logger as mainLogger } from '../../shared/logger.js'
import { confirmWithAlways } from '../../shared/prompt.js'
import { setConfigProperty } from '../../shared/config-writer.js'
import { detectProjectType } from '../branding/tiapp-reader.js'
import { genAndroidScales, genIphoneScales } from './gen-scales.js'
import { projectsPurge_TSS_Images_Folder } from '../../shared/constants.js'

const SUPPORTED_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'])

export async function runImages(opts) {
  const {
    source,             // resolved absolute path (file or directory)
    projectRoot = process.cwd(),
    androidOnly = false,
    iphoneOnly = false,
    format = null,
    quality = 85,
    baseWidth = null,
    dryRun = false,
    yes = false,
    confirmOverwrites = true
  } = opts

  if (!fs.existsSync(source)) {
    throw new Error(`Source not found: ${source}`)
  }

  const projectType = detectProjectType(projectRoot)
  const { androidBaseDir, iphoneBaseDir } = resolveOutputDirs(projectRoot, projectType)

  const files = collectImageFiles(source)

  if (baseWidth == null && files.some(f => path.extname(f).toLowerCase() === '.svg')) {
    logger.warning('⚠  SVG source detected without --width. Output sizes will be derived from each SVG\'s viewBox (treated as a 4× master).')
    logger.warning('   For SVGs from vector editors with disproportionate viewBoxes, pass --width <n> (e.g. --width 256) to pin the @1x/mdpi width.')
  }

  console.log()
  mainLogger.info('Generating multi-density image variants...')
  console.log()
  logger.property('Project:    ', `${projectRoot} (${projectType})`)
  logger.property('Source:     ', source)
  logger.property('Images:     ', `${files.length} file${files.length === 1 ? '' : 's'}`)
  const platforms = []
  if (!iphoneOnly) platforms.push('Android (5 densities)')
  if (!androidOnly) platforms.push('iPhone (@1x, @2x, @3x)')
  logger.property('Platforms:  ', platforms.join(' + '))
  if (format) logger.property('Format:     ', `convert all to ${format}`)
  if (baseWidth != null) logger.property('Width:      ', `${baseWidth} px @1x/mdpi`)
  if (dryRun) logger.warning('DRY RUN — no files will be written')

  if (files.length === 0) {
    logger.warning('No images found. Put your source files inside purgetss/images/ (svg, png, jpg, jpeg, webp, gif).')
    return { written: [] }
  }

  if (!dryRun && confirmOverwrites) {
    logger.warning(`⚠  Scaled images will OVERWRITE existing variants under ${androidBaseDir} and ${iphoneBaseDir}.`)
    logger.warning(`   Commit first if you want a rollback.`)
    const choice = await confirmWithAlways('Continue? [y/N/a]', { yes })
    if (choice === 'no') {
      logger.info('Aborted.')
      // eslint-disable-next-line n/no-process-exit
      process.exit(0)
    }
    if (choice === 'always') {
      const saved = setConfigProperty('images', 'confirmOverwrites', false)
      if (saved) {
        logger.success('Saved images.confirmOverwrites = false to purgetss/config.cjs — you won\'t be asked again.')
      } else {
        logger.warning('Could not persist preference (config.cjs missing or unreadable). Proceeding anyway.')
      }
    }
  }

  if (projectType === 'unknown') {
    logger.warning(`Could not detect project layout. Expected 'app/' (Alloy) or 'Resources/' (Classic).`)
    logger.warning(`Assets will still be written to the detected default paths — verify the output.`)
  }

  // Relative paths preserve the user's subdirectory structure inside purgetss/images/.
  // If the source is inside purgetss/images/, compute relPath from that folder
  // so subdirectories are always preserved in the output — regardless of whether
  // the user passed the full folder, a subfolder, or a single file.
  const imagesFolder = projectRoot === process.cwd()
    ? projectsPurge_TSS_Images_Folder
    : path.join(projectRoot, 'purgetss', 'images')
  const sourceIsInsideImagesFolder = source === imagesFolder
    || source.startsWith(imagesFolder + path.sep)

  const sourceRoot = sourceIsInsideImagesFolder
    ? imagesFolder
    : (fs.statSync(source).isDirectory() ? source : path.dirname(source))

  const written = []

  logger.section('Scaling')
  for (const file of files) {
    const relPath = path.relative(sourceRoot, file)
    logger.bullet(relPath)

    if (dryRun) continue

    if (!iphoneOnly) {
      const androidFiles = await genAndroidScales(file, relPath, androidBaseDir, { format, quality, baseWidth })
      written.push(...androidFiles)
    }
    if (!androidOnly) {
      const iphoneFiles = await genIphoneScales(file, relPath, iphoneBaseDir, { format, quality, baseWidth })
      written.push(...iphoneFiles)
    }
  }

  if (!dryRun) {
    console.log()
    logger.success(`${written.length} file${written.length === 1 ? '' : 's'} written.`)
    logger.property('Android:    ', androidBaseDir)
    logger.property('iPhone:     ', iphoneBaseDir)
  }

  return { written }
}

function resolveOutputDirs(projectRoot, projectType) {
  if (projectType === 'classic') {
    return {
      androidBaseDir: path.join(projectRoot, 'Resources', 'android', 'images'),
      iphoneBaseDir: path.join(projectRoot, 'Resources', 'iphone', 'images')
    }
  }
  // Alloy (or unknown fallback uses Alloy convention)
  return {
    androidBaseDir: path.join(projectRoot, 'app', 'assets', 'android', 'images'),
    iphoneBaseDir: path.join(projectRoot, 'app', 'assets', 'iphone', 'images')
  }
}

function collectImageFiles(source) {
  const stat = fs.statSync(source)
  if (stat.isFile()) {
    return SUPPORTED_EXTS.has(path.extname(source).toLowerCase()) ? [source] : []
  }
  // Directory — recurse
  return walk(source)
}

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walk(full))
    } else if (entry.isFile() && SUPPORTED_EXTS.has(path.extname(entry.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out
}
