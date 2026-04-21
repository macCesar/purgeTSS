/**
 * PurgeTSS - cleanup-legacy
 *
 * Context-aware removal of legacy branding artifacts.
 *
 * Reads tiapp.xml via tiapp-reader and categorizes targets into:
 *
 *   SAFE          always deleted — universally obsolete (dead qualifiers)
 *   CONDITIONAL   deleted only when project config guarantees they're unused
 *                 (e.g. iOS legacy launch images when storyboard is enabled)
 *   AGGRESSIVE    behind --aggressive — strongly defensible but some edge
 *                 cases (e.g. ldpi drawables on <1% of devices)
 *
 * Always prints the plan before acting. Respects dryRun.
 *
 * @fileoverview Legacy-artifact cleanup for Titanium branding
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { logger } from './branding-logger.js'
import { readTiapp, hasAdaptiveIcons } from './tiapp-reader.js'

export async function cleanupLegacy({ projectRoot, projectType, aggressive = false, dryRun = false }) {
  const tiappPath = path.join(projectRoot, 'tiapp.xml')
  const tiapp = readTiapp(tiappPath)
  const adaptive = hasAdaptiveIcons(projectRoot)

  const layout = getLayoutPaths(projectRoot, projectType)

  const safe = []
  const conditional = []
  const aggressiveTargets = []

  // ---- SAFE -----------------------------------------------------------
  if (layout.androidImages && fs.existsSync(layout.androidImages)) {
    const reason = 'Android long/notlong qualifier (dead since Android 3.0, 2011)'
    for (const entry of listChildDirs(layout.androidImages, /^res-(long|notlong)-/)) {
      safe.push({ path: entry, reason })
    }
  }

  // ---- CONDITIONAL ----------------------------------------------------
  if (tiapp.storyboardEnabled && layout.iphoneDir && fs.existsSync(layout.iphoneDir)) {
    const reason = 'iOS legacy launch image (storyboard enabled → not consulted)'
    for (const entry of listChildFiles(layout.iphoneDir, /^Default(-.+)?(@2x)?\.png$/)) {
      conditional.push({ path: entry, reason })
    }
  }

  if (tiapp.portraitOnly && layout.androidImages && fs.existsSync(layout.androidImages)) {
    const reason = 'Landscape variant (app is portrait-only)'
    for (const entry of listChildDirs(layout.androidImages, /(^res-.+-land-|^res-land-)/)) {
      conditional.push({ path: entry, reason })
    }
  }

  if (adaptive && layout.androidAssets) {
    const defaultPng = path.join(layout.androidAssets, 'default.png')
    if (fs.existsSync(defaultPng)) {
      conditional.push({
        path: defaultPng,
        reason: 'Legacy Android splash PNG (adaptive launcher handles splash now)'
      })
    }
    const appicon = path.join(layout.androidAssets, 'appicon.png')
    if (fs.existsSync(appicon)) {
      conditional.push({
        path: appicon,
        reason: 'Legacy appicon.png (adaptive launcher takes precedence)'
      })
    }
  }

  // ---- AGGRESSIVE -----------------------------------------------------
  if (aggressive) {
    const reason = 'ldpi density (<1% global market)'
    if (layout.androidImages && fs.existsSync(layout.androidImages)) {
      for (const entry of listChildDirs(layout.androidImages, /(^res-ldpi$|^res-.+-ldpi$)/)) {
        aggressiveTargets.push({ path: entry, reason })
      }
    }
    const ldpiDirs = [
      path.join(projectRoot, 'app', 'platform', 'android', 'res', 'drawable-ldpi'),
      path.join(projectRoot, 'app', 'platform', 'android', 'res', 'values-ldpi'),
      path.join(projectRoot, 'app', 'platform', 'android', 'res', 'mipmap-ldpi'),
      path.join(projectRoot, 'platform', 'android', 'res', 'drawable-ldpi'),
      path.join(projectRoot, 'platform', 'android', 'res', 'values-ldpi'),
      path.join(projectRoot, 'platform', 'android', 'res', 'mipmap-ldpi')
    ]
    for (const d of ldpiDirs) {
      if (fs.existsSync(d)) {
        aggressiveTargets.push({ path: d, reason: 'ldpi resource folder (<1% global market)' })
      }
    }
  }

  printPlan({
    projectRoot, projectType, tiapp, adaptive, aggressive,
    safe, conditional, aggressiveTargets
  })

  const total = safe.length + conditional.length + aggressiveTargets.length
  if (total === 0) {
    logger.success('No legacy artifacts detected. Project is already clean.')
    return { removed: 0, bytes: 0 }
  }

  if (dryRun) {
    logger.info('Dry-run mode — nothing deleted. Re-run without --dry-run to apply.')
    return { removed: 0, bytes: 0 }
  }

  let removed = 0
  let bytes = 0
  for (const bucket of [safe, conditional, aggressiveTargets]) {
    for (const { path: target } of bucket) {
      const size = getSizeBytes(target)
      fs.rmSync(target, { recursive: true, force: true })
      bytes += size
      removed += 1
      logger.success(`Removed ${path.relative(projectRoot, target)}`)
    }
  }
  return { removed, bytes }
}

function getLayoutPaths(projectRoot, projectType) {
  if (projectType === 'alloy') {
    return {
      androidImages: path.join(projectRoot, 'app', 'assets', 'android', 'images'),
      iphoneDir: path.join(projectRoot, 'app', 'assets', 'iphone'),
      androidAssets: path.join(projectRoot, 'app', 'assets', 'android')
    }
  }
  if (projectType === 'classic') {
    return {
      androidImages: path.join(projectRoot, 'Resources', 'android', 'images'),
      iphoneDir: path.join(projectRoot, 'Resources', 'iphone'),
      androidAssets: path.join(projectRoot, 'Resources', 'android')
    }
  }
  return { androidImages: null, iphoneDir: null, androidAssets: null }
}

function listChildDirs(parent, regex) {
  if (!fs.existsSync(parent)) return []
  return fs.readdirSync(parent)
    .filter((name) => regex.test(name))
    .map((name) => path.join(parent, name))
    .filter((p) => fs.statSync(p).isDirectory())
}

function listChildFiles(parent, regex) {
  if (!fs.existsSync(parent)) return []
  return fs.readdirSync(parent)
    .filter((name) => regex.test(name))
    .map((name) => path.join(parent, name))
    .filter((p) => fs.statSync(p).isFile())
}

function getSizeBytes(target) {
  try {
    const stat = fs.statSync(target)
    if (stat.isFile()) return stat.size
    let total = 0
    for (const name of fs.readdirSync(target)) {
      total += getSizeBytes(path.join(target, name))
    }
    return total
  } catch {
    return 0
  }
}

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)}K`
}

function printPlan({ projectRoot, projectType, tiapp, adaptive, aggressive, safe, conditional, aggressiveTargets }) {
  console.log()
  logger.warning('⚠  WARNING — --cleanup-legacy deletes files permanently.')
  logger.warning('   Recommended: commit your project with git before running without --dry-run.')
  console.log()
  console.log('Cleanup plan')
  console.log(`  Project:            ${projectRoot} (${projectType})`)
  console.log(`  Storyboard:         ${tiapp.storyboardEnabled ? 'enabled' : 'disabled'}`)
  console.log(`  Orientation:        ${tiapp.portraitOnly ? 'portrait-only' : 'landscape allowed'}`)
  console.log(`  Adaptive icons:     ${adaptive ? 'present' : 'not detected'}`)
  console.log(`  Aggressive mode:    ${aggressive ? 'on (includes ldpi)' : 'off'}`)

  if (safe.length) {
    console.log()
    logger.success('SAFE — universally obsolete')
    for (const { path: p, reason } of safe) {
      console.log(`    ${formatKb(getSizeBytes(p)).padEnd(6)}  ${path.relative(projectRoot, p)}`)
      console.log(`              ${reason}`)
    }
  }
  if (conditional.length) {
    console.log()
    logger.warning('CONDITIONAL — safe given your project config')
    for (const { path: p, reason } of conditional) {
      console.log(`    ${formatKb(getSizeBytes(p)).padEnd(6)}  ${path.relative(projectRoot, p)}`)
      console.log(`              ${reason}`)
    }
  }
  if (aggressiveTargets.length) {
    console.log()
    logger.error('AGGRESSIVE — --aggressive enabled')
    for (const { path: p, reason } of aggressiveTargets) {
      console.log(`    ${formatKb(getSizeBytes(p)).padEnd(6)}  ${path.relative(projectRoot, p)}`)
      console.log(`              ${reason}`)
    }
  }
  const total = safe.length + conditional.length + aggressiveTargets.length
  console.log()
  console.log(`  Total: ${total} item(s) to remove`)
}
