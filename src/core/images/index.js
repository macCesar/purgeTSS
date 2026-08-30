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
import sharp from 'sharp'
import { logger } from '../branding/branding-logger.js'
import { logger as mainLogger } from '../../shared/logger.js'
import { confirmWithAlways } from '../../shared/prompt.js'
import { setConfigProperty } from '../../shared/config-writer.js'
import { detectProjectType } from '../branding/tiapp-reader.js'
import { genAndroidScales, genIphoneScales } from './gen-scales.js'

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
    opacity = null,     // 0-100 or null
    padding = null,     // 0-40 (per side, %) or null
    outputRelpath = null, // basename + subfolder relative to images root, no extension
    dryRun = false,
    yes = false,
    confirmOverwrites = true,
    filesOverrides = []  // [{ filename: 'images/<relpath>', width, height? }, …]
  } = opts

  if (!fs.existsSync(source)) {
    throw new Error(`Source not found: ${source}`)
  }

  if (outputRelpath != null && fs.statSync(source).isDirectory()) {
    throw new Error('--output is incompatible with directory sources (one basename cannot apply to multiple files). Pass a single file as the source, or drop --output.')
  }

  const projectType = detectProjectType(projectRoot)
  const { androidBaseDir, iphoneBaseDir } = resolveOutputDirs(projectRoot, projectType)

  const files = collectImageFiles(source)

  // Build a lookup keyed by `images/<subpath>` so per-file `width`/`height`
  // declared in `config.cjs > images.files` can override the directory scan's
  // default sizing. CLI `--width` still wins over both.
  const overrides = buildOverridesMap(filesOverrides)
  const imagesFolderForKey = path.join(projectRoot, 'purgetss', 'images')

  if (baseWidth == null) {
    const uncoveredSvgs = files.filter(f => {
      if (path.extname(f).toLowerCase() !== '.svg') return false
      const key = overrideKeyFor(f, imagesFolderForKey)
      return !overrides.has(key)
    })
    if (uncoveredSvgs.length > 0) {
      logger.warning('⚠  SVG source detected without --width and no entry in config.cjs > images.files. Output sizes will be derived from each SVG\'s viewBox (treated as a 4× master).')
      logger.warning('   For SVGs from vector editors with disproportionate viewBoxes, pass --width <n> (e.g. --width 256) or add an entry to images.files to pin the @1x/mdpi width.')
    }
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
  if (opacity != null) logger.property('Opacity:    ', `${opacity}%`)
  if (padding != null) logger.property('Padding:    ', `${padding}% per side`)
  if (outputRelpath != null) logger.property('Output:     ', `images/${outputRelpath}.<ext>`)
  if (dryRun) logger.warning('DRY RUN — no files will be written')

  if (files.length === 0) {
    logger.warning('No images found. Put your source files inside purgetss/images/ (svg, png, jpg, jpeg, webp, gif).')
    return { written: [] }
  }

  if (!dryRun && confirmOverwrites && !yes) {
    const overwriteDirs = []
    if (!iphoneOnly) overwriteDirs.push(androidBaseDir)
    if (!androidOnly) overwriteDirs.push(iphoneBaseDir)
    logger.warning(`⚠  Scaled images will OVERWRITE existing variants under ${overwriteDirs.join(' and ')}.`)
    logger.warning('   Commit first if you want a rollback.')
    const choice = await confirmWithAlways('Continue? [y/N/a]', { yes })
    if (choice === 'no') {
      logger.info('Aborted.')
      // eslint-disable-next-line n/no-process-exit
      process.exit(0)
    }
    if (choice === 'always') {
      const saved = setConfigProperty(
        'images',
        'confirmOverwrites',
        false,
        path.join(projectRoot, 'purgetss', 'config.cjs')
      )
      if (saved) {
        logger.success('Saved images.confirmOverwrites = false to purgetss/config.cjs — you won\'t be asked again.')
      } else {
        logger.warning('Could not persist preference (config.cjs missing or unreadable). Proceeding anyway.')
      }
    }
  }

  if (projectType === 'unknown') {
    logger.warning('Could not detect project layout. Expected \'app/\' (Alloy) or \'Resources/\' (Classic).')
    logger.warning('Assets will still be written to the detected default paths — verify the output.')
  }

  // Relative paths preserve the user's subdirectory structure inside purgetss/images/.
  // If the source is inside purgetss/images/, compute relPath from that folder
  // so subdirectories are always preserved in the output — regardless of whether
  // the user passed the full folder, a subfolder, or a single file.
  const imagesFolder = path.join(projectRoot, 'purgetss', 'images')
  const sourceIsInsideImagesFolder = source === imagesFolder
    || source.startsWith(imagesFolder + path.sep)

  const sourceRoot = sourceIsInsideImagesFolder
    ? imagesFolder
    : (fs.statSync(source).isDirectory() ? source : path.dirname(source))

  const written = []

  logger.section('Scaling')
  for (const file of files) {
    // When --output is set, override the computed relPath with the user's
    // basename + subfolder. Append the source extension so downstream
    // path.parse / renameWithFormat behave the same as for natural sources.
    const relPath = outputRelpath != null
      ? outputRelpath + path.extname(file)
      : path.relative(sourceRoot, file)

    // Per-file resolution: CLI --width wins; if absent, fall back to the
    // entry in `images.files` (if any); else null (gen-scales reads viewBox).
    const override = overrides.get(overrideKeyFor(file, imagesFolderForKey))
    const effectiveBaseWidth = baseWidth ?? override?.width ?? null
    const effectiveBaseHeight = baseWidth != null ? null : (override?.height ?? null)

    // SVGs listed in `images.files` are almost always referenced from views/
    // controllers as `image="/.../foo.svg"`, and Titanium's runtime only falls
    // back from a `.svg` reference to `.png` (verified empirically — not to
    // .webp, .jpeg, etc.). Forcing PNG here prevents the standalone command
    // from quietly emitting a format Titanium can't load via that fallback.
    // Raster files in `files` and SVGs NOT in `files` still honor `format`.
    const ext = path.extname(file).toLowerCase()
    const isSvg = ext === '.svg'
    const isSvgInFiles = override != null && isSvg
    const effectiveFormat = isSvgInFiles ? null : format

    // Build an informative bullet so the user can see which decisions applied
    // per file: source of width, where it came from, and the actual output
    // format (especially when PNG is forced for SVGs in `files`).
    const widthSource = baseWidth != null
      ? `${baseWidth}dp (CLI --width)`
      : override
        ? `${override.width}dp (files)`
        : isSvg ? 'viewBox' : 'source 4×'
    const outFormat = effectiveFormat ?? (isSvg ? 'png' : ext.slice(1))
    const formatTag = isSvgInFiles && format && format !== 'png'
      ? `${outFormat} (forced; ignores format: ${format})`
      : outFormat
    logger.bullet(`${relPath} → ${widthSource} · ${formatTag}`)

    if (dryRun) continue

    // Quality warning: if the user pinned a width (via CLI or `files`), the
    // source must carry at least `width × 4` pixels — that's what xxxhdpi/@4x
    // needs. Anything smaller forces Sharp to upscale, producing blurry output.
    // SVG sources are vector and exempt from this check.
    if (effectiveBaseWidth != null && !isSvg) {
      const meta = await sharp(file).metadata()
      const requiredXxxhdpi = effectiveBaseWidth * 4
      if (Number.isFinite(meta.width) && meta.width < requiredXxxhdpi) {
        logger.warning(
          `⚠  ${relPath}: source is ${meta.width}px wide but xxxhdpi needs ${requiredXxxhdpi}px (4× of declared ${effectiveBaseWidth}dp @1x). Output will be upscaled and may look blurry — provide a source ≥ ${requiredXxxhdpi}px.`
        )
      }
    }

    if (!iphoneOnly) {
      const androidFiles = await genAndroidScales(file, relPath, androidBaseDir, {
        format: effectiveFormat, quality, baseWidth: effectiveBaseWidth, baseHeight: effectiveBaseHeight, opacity, padding
      })
      written.push(...androidFiles)
    }
    if (!androidOnly) {
      const iphoneFiles = await genIphoneScales(file, relPath, iphoneBaseDir, {
        format: effectiveFormat, quality, baseWidth: effectiveBaseWidth, baseHeight: effectiveBaseHeight, opacity, padding
      })
      written.push(...iphoneFiles)
    }
  }

  if (!dryRun) {
    console.log()
    logger.success(`${written.length} file${written.length === 1 ? '' : 's'} written.`)
    if (!iphoneOnly) logger.property('Android:    ', androidBaseDir)
    if (!androidOnly) logger.property('iPhone:     ', iphoneBaseDir)
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

// Normalize a config `images.files` entry list into a Map keyed by filename.
// Invalid entries (missing filename, non-numeric width) are silently skipped
// so a typo in config doesn't crash the whole pipeline.
function buildOverridesMap(entries) {
  const map = new Map()
  if (!Array.isArray(entries)) return map
  for (const entry of entries) {
    if (!entry || typeof entry.filename !== 'string') continue
    if (typeof entry.width !== 'number' || !Number.isFinite(entry.width)) continue
    const key = entry.filename.replace(/^\/+/, '')
    map.set(key, {
      width: entry.width,
      height: typeof entry.height === 'number' && Number.isFinite(entry.height) ? entry.height : null
    })
  }
  return map
}

// Match the key shape stored in `config.cjs > images.files`:
// `images/<subpath>/<name>.<ext>` relative to `purgetss/images/`.
function overrideKeyFor(file, imagesFolder) {
  const rel = path.relative(imagesFolder, file).split(path.sep).join('/')
  return rel.startsWith('..') ? null : `images/${rel}`
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
