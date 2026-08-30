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

/* eslint-disable n/no-process-exit */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { createRequire } from 'module'
import { runImages } from '../../core/images/index.js'
import { logger } from '../../core/branding/branding-logger.js'
import { readTiapp } from '../../core/branding/tiapp-reader.js'
import { ensureImagesSection } from '../../core/images/ensure-images-section.js'
import { detectProjectType } from '../utils/project-detection.js'

const VALID_FORMATS = new Set(['webp', 'jpeg', 'jpg', 'png', 'avif', 'gif', 'tiff'])
const require = createRequire(import.meta.url)

export async function images(cliSource, options = {}) {
  if (options.debug) logger.setDebugMode(true)

  const projectRoot = options.project ? path.resolve(options.project) : process.cwd()

  if (detectProjectType(projectRoot) === 'unknown') {
    logger.error(`Could not detect a Titanium Alloy or Classic project at ${projectRoot}.`)
    process.exit(1)
  }

  // A positional source is self-contained. Do not create purgetss/images/ or
  // patch config.cjs merely because the source lives elsewhere.
  if (!cliSource) ensureImagesSection({ projectRoot })

  const cfg = loadImagesSection(projectRoot)

  // --android and --ios are mutually exclusive.
  if (options.android && options.ios) {
    logger.error('--android and --ios are mutually exclusive. Pass neither to generate both, or pick one.')
    process.exit(1)
  }

  let androidOnly = Boolean(options.android)
  let iphoneOnly = Boolean(options.ios)
  if (!androidOnly && !iphoneOnly) {
    const { deploymentTargets } = readTiapp(path.join(projectRoot, 'tiapp.xml'))
    if (!deploymentTargets.android && !deploymentTargets.ios) {
      logger.error('No Android or iOS deployment target is enabled in tiapp.xml.')
      process.exit(1)
    }
    androidOnly = deploymentTargets.android && !deploymentTargets.ios
    iphoneOnly = deploymentTargets.ios && !deploymentTargets.android
  }

  if (options.width !== undefined) {
    if (!Number.isFinite(options.width) || !Number.isInteger(options.width) || options.width < 1 || options.width > 8192) {
      logger.error(`Invalid --width '${options.width}'. Must be an integer between 1 and 8192.`)
      process.exit(1)
    }
  }

  let opacity = null
  if (options.opacity !== undefined) {
    if (!Number.isFinite(options.opacity) || !Number.isInteger(options.opacity) || options.opacity < 0 || options.opacity > 100) {
      logger.error(`Invalid --opacity '${options.opacity}'. Must be an integer between 0 and 100.`)
      process.exit(1)
    }
    opacity = options.opacity
  }

  let padding = null
  if (options.padding !== undefined) {
    if (!Number.isFinite(options.padding) || !Number.isInteger(options.padding) || options.padding < 0 || options.padding > 40) {
      logger.error(`Invalid --padding '${options.padding}'. Must be an integer between 0 and 40.`)
      process.exit(1)
    }
    padding = options.padding
  }

  let outputRelpath = null
  if (options.output !== undefined && options.output !== null && options.output !== '') {
    const raw = String(options.output)
    if (path.isAbsolute(raw)) {
      logger.error(`Invalid --output '${raw}'. Must be a relative path inside the project images folder, not absolute.`)
      process.exit(1)
    }
    const segments = raw.split(/[\\/]/)
    if (segments.includes('..')) {
      logger.error(`Invalid --output '${raw}'. '..' segments are not allowed (must stay inside the project images folder).`)
      process.exit(1)
    }
    // Strip any trailing extension — --format (or source ext) decides actual extension.
    const parsed = path.parse(raw)
    outputRelpath = parsed.dir ? path.join(parsed.dir, parsed.name) : parsed.name
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
      androidOnly,
      iphoneOnly,
      format: format ? format.toLowerCase() : null,
      quality: options.quality ?? cfg.quality ?? 85,
      baseWidth: options.width ?? null,
      opacity,
      padding,
      outputRelpath,
      dryRun: Boolean(options.dryRun),
      yes: Boolean(options.yes),
      confirmOverwrites: cfg.confirmOverwrites !== false,
      filesOverrides: Array.isArray(cfg.files) ? cfg.files : []
    })
  } catch (err) {
    logger.error(err.message)
    if (options.debug) console.error(err.stack)
    process.exit(1)
  }
}

function loadImagesSection(projectRoot) {
  const configPath = path.join(projectRoot, 'purgetss', 'config.cjs')
  if (!fs.existsSync(configPath)) return {}

  try {
    const resolved = require.resolve(configPath)
    delete require.cache[resolved]
    const cfg = require(resolved)
    if (cfg && typeof cfg.images === 'object') return cfg.images
  } catch {
    // Invalid or stale project configuration falls back to command defaults.
  }
  return {}
}

function resolveSource(cliSource, projectRoot) {
  const imagesFolder = path.join(projectRoot, 'purgetss', 'images')

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
  console.log('  The folder already exists — drop your images into it (subdirectories are preserved):')
  console.log(`     ${chalk.cyan('cp my-ui-asset.png ' + rel(imagesDir) + '/')}`)
  console.log()
  console.log('  Alternatives:')
  console.log(`    ${chalk.gray('•')} Pass a file or directory explicitly:`)
  console.log(`       ${chalk.cyan('purgetss images ./docs/screenshots')}`)
  console.log(`       ${chalk.cyan('purgetss images ./logo.png')}`)
  console.log()
}
