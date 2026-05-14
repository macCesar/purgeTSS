/**
 * PurgeTSS - SVG image pipeline (orchestrator)
 *
 * Post-step of the regular purge. Once `app.tss` is finalized, this module:
 *
 *   1. Parses app.tss into a class → props map.
 *   2. Scans every view (.xml) and controller (.js) for SVG references paired
 *      with their classes / `class=""` attribute.
 *   3. Reduces each SVG to a single resolved `{ widthDp, heightDp }` (max of
 *      every reference; falls back to viewBox aspect for height when `h-*` is
 *      missing or non-numeric).
 *   4. Upserts `images.files` in config.cjs (never decreases — manual overrides
 *      always win).
 *   5. Generates the iOS @1x/@2x/@3x and Android mdpi…xxxhdpi PNGs from the
 *      same SVG master, using a hash-based cache to skip unchanged inputs.
 *
 * The pipeline never rewrites XML/Controller files. Titanium falls back to the
 * generated PNGs at runtime when an `image="/.../foo.svg"` reference resolves
 * against a `.png` with the same basename in the platform assets folder.
 *
 * @fileoverview Compile-time SVG → multi-density PNG pipeline for Titanium
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import {
  cwd,
  projectsPurge_TSS_Images_Folder  
} from '../../shared/constants.js'
import { detectProjectType } from '../branding/tiapp-reader.js'
import { genAndroidScales, genIphoneScales, ANDROID_SCALES, IPHONE_SCALES } from '../images/gen-scales.js'
import { parseTssMap } from './tss-reader.js'
import { deriveDimensions } from './derive-dimensions.js'
import { syncConfigImages } from './sync-images.js'
import { loadCache, saveCache, hashFile, isCacheHit, makeCacheEntry } from './cache.js'
import { extractSvgRefsFromXml } from '../analyzers/class-extractor.js'
import { extractSvgRefsFromController } from '../analyzers/controller-svg-refs.js'
import { getConfigFile } from '../../shared/config-manager.js'

/**
 * Run the SVG image pipeline as a post-step of `purgetss` (purge command).
 *
 * Silent (no-op) when no SVG references are found. Logs progress at each step
 * so the user can trace cache hits, dimension changes, and skipped SVGs.
 *
 * @param {Object} args
 * @param {string} args.tssContent - Final purged TSS string (in memory).
 * @param {string[]} args.viewPaths - Absolute paths to view .xml files.
 * @param {string[]} args.controllerPaths - Absolute paths to controller .js files.
 * @param {Object} args.logger - Logger with `.info/.warning/.success/.file`.
 * @returns {Promise<void>}
 */
export async function runSvgPipeline({ tssContent, viewPaths, controllerPaths, logger }) {
   
  const imagesFolder = projectsPurge_TSS_Images_Folder
  if (!fs.existsSync(imagesFolder)) return

  const refsBySvg = collectRefs({ viewPaths, controllerPaths })
  if (refsBySvg.size === 0) return

  logger.info('Resolving SVG dimensions from app.tss...')
  const tssMap = parseTssMap(tssContent)
  const derived = await deriveDimensions({ refsBySvg, tssMap, imagesFolder, logger })
  if (derived.size === 0) return

  // Sync config.cjs first so external runs (`purgetss images`) reflect the
  // current resolution even if the cache short-circuits actual generation.
  // The returned `effective` map merges derived values with any pre-existing
  // manual overrides (config wins when its width is higher). The actual file
  // write is gated by `images.autoSync` so devs who prefer hand-managed config
  // can opt out.
  const autoSync = readAutoSyncFlag()
  const { stats, effective } = syncConfigImages(derived, { logger, write: autoSync })
  if (autoSync && (stats.inserted || stats.updated)) {
    logger.info(
      `config.cjs > images.files: ${stats.inserted} inserted, ${stats.updated} updated, ${stats.untouched} untouched`
    )
  } else if (!autoSync && (stats.inserted || stats.updated)) {
    logger.info(
      `images.autoSync is off — would have ${stats.inserted ? `inserted ${stats.inserted}` : ''}${stats.inserted && stats.updated ? ', ' : ''}${stats.updated ? `updated ${stats.updated}` : ''} entry/entries in config.cjs > images.files`
    )
  }

  await generatePngs({ derived: effective, imagesFolder, logger })
}

function collectRefs({ viewPaths, controllerPaths }) {
  const refsBySvg = new Map()
  const push = (src, classes) => {
    const relPath = normalizeSvgSrc(src)
    if (!relPath) return
    if (!refsBySvg.has(relPath)) refsBySvg.set(relPath, [])
    refsBySvg.get(relPath).push({ classes })
  }

  for (const file of viewPaths) {
    const text = fs.readFileSync(file, 'utf8')
    if (!text) continue
    let refs
    try {
      refs = extractSvgRefsFromXml(text, file)
    } catch {
      // Malformed XML is reported by the regular purge path already; the SVG
      // pipeline silently skips so we don't double-error on the same file.
      continue
    }
    for (const ref of refs) push(ref.src, ref.classes)
  }

  for (const file of controllerPaths) {
    const text = fs.readFileSync(file, 'utf8')
    if (!text) continue
    const refs = extractSvgRefsFromController(text)
    for (const ref of refs) push(ref.src, ref.classes)
  }

  return refsBySvg
}

// Map `/images/logos/foo.svg` → `logos/foo.svg`. Anything outside the
// `/images/` namespace is unknown to this pipeline and returns null.
function normalizeSvgSrc(src) {
  if (typeof src !== 'string') return null
  const stripped = src.replace(/^\/+/, '')
  if (!stripped.startsWith('images/')) return null
  return stripped.slice('images/'.length)
}

async function generatePngs({ derived, imagesFolder, logger }) {
  const projectType = detectProjectType(cwd)
  const { androidBaseDir, iphoneBaseDir } = resolveOutputDirs(cwd, projectType)
  const cache = loadCache()
  let generated = 0
  let cached = 0

  for (const [relPath, { widthDp, heightDp }] of derived) {
    const absSvg = path.join(imagesFolder, relPath)
    const relForOutput = swapExt(relPath, '.png')
    const targets = enumerateTargets({ relForOutput, androidBaseDir, iphoneBaseDir })

    const svgHash = hashFile(absSvg)
    if (isCacheHit(cache[relPath], svgHash, widthDp, heightDp, targets)) {
      cached++
      continue
    }

    try {
      await genAndroidScales(absSvg, relPath, androidBaseDir, { baseWidth: widthDp, baseHeight: heightDp })
      await genIphoneScales(absSvg, relPath, iphoneBaseDir, { baseWidth: widthDp, baseHeight: heightDp })
    } catch (err) {
      logger.warning(`✗ ${relPath}: ${err.message}`)
      continue
    }

    cache[relPath] = makeCacheEntry(svgHash, widthDp, heightDp, targets)
    generated++
    logger.info(`✓ ${relPath} → ${widthDp}×${heightDp}dp`)
  }

  saveCache(cache)
  if (generated || cached) {
    logger.info(`SVG pipeline: ${generated} generated, ${cached} cached.`)
  }
}

function resolveOutputDirs(projectRoot, projectType) {
  if (projectType === 'classic') {
    return {
      androidBaseDir: path.join(projectRoot, 'Resources', 'android', 'images'),
      iphoneBaseDir: path.join(projectRoot, 'Resources', 'iphone', 'images')
    }
  }
  return {
    androidBaseDir: path.join(projectRoot, 'app', 'assets', 'android', 'images'),
    iphoneBaseDir: path.join(projectRoot, 'app', 'assets', 'iphone', 'images')
  }
}

function enumerateTargets({ relForOutput, androidBaseDir, iphoneBaseDir }) {
  const out = []
  const parsed = path.parse(relForOutput)
  for (const { name } of ANDROID_SCALES) {
    out.push(path.join(androidBaseDir, name, relForOutput))
  }
  for (const { suffix } of IPHONE_SCALES) {
    out.push(path.join(iphoneBaseDir, parsed.dir, `${parsed.name}${suffix}${parsed.ext}`))
  }
  return out
}

function swapExt(relPath, newExt) {
  const parsed = path.parse(relPath)
  return path.join(parsed.dir, parsed.name + newExt)
}

// Read `images.autoSync` from config; defaults to true. Anything goes wrong
// (config missing, parse error) → assume autoSync stays on, mirroring V1
// behavior so existing projects don't get a surprise opt-out.
function readAutoSyncFlag() {
  try {
    const cfg = getConfigFile()
    if (cfg && typeof cfg.images === 'object' && cfg.images.autoSync === false) {
      return false
    }
  } catch { /* fall through to default */ }
  return true
}
