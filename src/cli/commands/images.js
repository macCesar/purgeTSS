/**
 * PurgeTSS - Images Command
 *
 * Generates multi-density variants of UI images for Titanium Alloy or Classic
 * projects. Auto-discovers sources in `./purgetss/images/` by default; accepts
 * a path argument to override (file or directory).
 *
 * Precedence for every option: CLI flag > `images:` section in config > default.
 *
 * @fileoverview Assets command entry point
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { runImages } from '../../core/images/index.js'
import { logger } from '../../core/branding/branding-logger.js'
import { ensureImagesSection } from '../../core/images/ensure-images-section.js'
import { getConfigFile } from '../../shared/config-manager.js'
import { projectsPurge_TSS_Images_Folder } from '../../shared/constants.js'

const VALID_FORMATS = new Set(['webp', 'jpeg', 'jpg', 'png', 'avif', 'gif', 'tiff'])

export async function images(cliSource, options = {}) {
  if (options.debug) logger.setDebugMode(true)

  const projectRoot = options.project ? path.resolve(options.project) : process.cwd()

  if (!options.project) ensureImagesSection()

  const cfg = loadImagesSection()

  // --android and --ios are mutually exclusive.
  if (options.android && options.ios) {
    logger.error('--android and --ios are mutually exclusive. Pass neither to generate both, or pick one.')
    process.exit(1)
  }

  const format = options.format ?? cfg.format ?? null
  if (format && !VALID_FORMATS.has(format.toLowerCase())) {
    logger.error(`Invalid --format '${format}'. Valid: ${[...VALID_FORMATS].join(', ')}`)
    process.exit(1)
  }

  const source = resolveSource(cliSource, projectRoot)
  if (!source) {
    printMissingSourceHelp(projectRoot)
    process.exit(1)
  }

  try {
    await runImages({
      source,
      projectRoot,
      androidOnly: Boolean(options.android),
      iphoneOnly: Boolean(options.ios),
      format: format ? format.toLowerCase() : null,
      quality: options.quality ?? cfg.quality ?? 85,
      dryRun: Boolean(options.dryRun),
      yes: Boolean(options.yes),
      confirmOverwrites: cfg.confirmOverwrites !== false
    })
  } catch (err) {
    logger.error(err.message)
    if (options.debug) console.error(err.stack)
    process.exit(1)
  }
}

function loadImagesSection() {
  try {
    const cfg = getConfigFile()
    if (cfg && typeof cfg.images === 'object') return cfg.images
  } catch {}
  return {}
}

function resolveSource(cliSource, projectRoot) {
  const imagesFolder = projectRoot === process.cwd()
    ? projectsPurge_TSS_Images_Folder
    : path.join(projectRoot, 'purgetss', 'images')

  if (cliSource) {
    if (path.isAbsolute(cliSource)) {
      return fs.existsSync(cliSource) ? cliSource : null
    }
    // Relative paths: try purgetss/images/ first (convention), then cwd.
    // Lets users write short paths like `background/pink.png` without the prefix.
    const insideImages = path.resolve(imagesFolder, cliSource)
    if (fs.existsSync(insideImages)) return insideImages

    const cwdResolved = path.resolve(projectRoot, cliSource)
    if (fs.existsSync(cwdResolved)) return cwdResolved

    return null
  }
  return fs.existsSync(imagesFolder) ? imagesFolder : null
}

function printMissingSourceHelp(projectRoot) {
  const rel = (p) => path.relative(projectRoot, p) || '.'
  const imagesDir = path.join(projectRoot, 'purgetss', 'images')

  logger.error('No source images found.')
  console.log()
  console.log(`  Expected images inside ${chalk.cyan(rel(imagesDir) + '/')}.`)
  console.log(`  The folder already exists — drop your images into it (subdirectories are preserved):`)
  console.log(`     ${chalk.cyan('cp my-ui-asset.png ' + rel(imagesDir) + '/')}`)
  console.log()
  console.log('  Alternatives:')
  console.log(`    ${chalk.gray('•')} Pass a file or directory explicitly:`)
  console.log(`       ${chalk.cyan('purgetss images ./docs/screenshots')}`)
  console.log(`       ${chalk.cyan('purgetss images ./logo.png')}`)
  console.log()
}
