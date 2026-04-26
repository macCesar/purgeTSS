/**
 * PurgeTSS - Brand command config resolver
 *
 * Merges three sources of configuration, in this precedence order:
 *   1. CLI flags (highest priority)
 *   2. `brand: { ... }` section from purgetss/config.cjs
 *   3. Built-in defaults (lowest priority)
 *
 * Also auto-discovers logo images inside `./purgetss/brand/` following the
 * project convention:
 *   logo.{svg,png}          → required (main logo)
 *   logo-icon.{svg,png}     → optional (square launcher/splash mark for Android)
 *   logo-mono.{svg,png}     → optional (monochrome layer + notifications)
 *   logo-dark.{svg,png}     → optional (iOS 18+ dark variant)
 *   logo-tinted.{svg,png}   → optional (iOS 18+ tinted variant)
 *   logo-splash.{svg,png}   → optional (Android 12+ splash icon override)
 *
 * CLI --monochrome-logo / --dark-logo / --tinted-logo always override
 * discovery, and the positional argument overrides the main logo.
 *
 * @fileoverview Brand config + logo discovery
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { getConfigFile } from '../../shared/config-manager.js'

const BRAND_DIR = 'purgetss/brand'
const SUPPORTED_EXTS = ['svg', 'png']

/**
 * Find the first existing file matching <baseName>.<ext> for each supported ext.
 * @param {string} baseDir - Absolute path to the search directory
 * @param {string} baseName - Filename without extension (e.g. 'logo-mono')
 * @returns {string|null} Absolute path to the first match, or null
 */
function findLogoFile(baseDir, baseName) {
  for (const ext of SUPPORTED_EXTS) {
    const candidate = path.join(baseDir, `${baseName}.${ext}`)
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

/**
 * Build the final opts object for runBranding().
 *
 * @param {Object} cliOptions - Raw options from Commander
 * @param {string|undefined} cliLogo - Positional logo arg from Commander
 * @param {string} projectRoot - Absolute project root
 * @returns {Object} Resolved options
 */
export function resolveBrandConfig(cliOptions, cliLogo, projectRoot) {
  const brandConfig = loadBrandSection()
  const brandDir = path.join(projectRoot, BRAND_DIR)
  const logos = brandConfig.logos || {}
  const padding = brandConfig.padding || {}
  const android = brandConfig.android || {}
  const ios = brandConfig.ios || {}
  const colors = brandConfig.colors || {}

  const androidAdaptivePadding = cliOptions.androidAdaptivePadding
    ?? cliOptions.padding
    ?? padding.androidAdaptive
    ?? 19

  const androidLegacyPadding = cliOptions.androidLegacyPadding
    ?? padding.androidLegacy
    ?? 10

  const iosPadding = cliOptions.iosPadding
    ?? padding.ios
    ?? 4

  const bgColor = cliOptions.bgColor
    ?? colors.background
    ?? '#FFFFFF'

  const darkBgColor = cliOptions.darkBgColor
    ?? ios.darkBackground
    ?? null

  const resolved = {
    logo: pickLogo(cliLogo, logos.primary, brandDir, 'logo', projectRoot),
    iconLogo: pickLogo(cliOptions.iconLogo, logos.androidLauncher, brandDir, 'logo-icon', projectRoot),
    monochromeLogo: pickLogo(cliOptions.monochromeLogo, logos.monochrome, brandDir, 'logo-mono', projectRoot),
    darkLogo: pickLogo(cliOptions.darkLogo, logos.iosDark, brandDir, 'logo-dark', projectRoot),
    tintedLogo: pickLogo(cliOptions.tintedLogo, logos.iosTinted, brandDir, 'logo-tinted', projectRoot),
    splashLogo: pickLogo(cliOptions.splashLogo, logos.androidSplash, brandDir, 'logo-splash', projectRoot),

    bgColor,
    bgColorExplicit: Boolean(cliOptions.bgColor ?? colors.background),
    darkBgColor,
    androidAdaptivePadding,
    androidLegacyPadding,
    iosPadding,

    // Kitchen-sink defaults: adaptive + marketplace are always generated; only
    // notification and splash are opt-in. Config can pre-enable them.
    notification: Boolean(cliOptions.notification ?? android.notification ?? false),
    splash: Boolean(cliOptions.splash ?? android.splash ?? false),

    withDark: cliOptions.dark !== false && (ios.dark ?? true),
    withTinted: cliOptions.tinted !== false && (ios.tinted ?? true),

    cleanupLegacy: Boolean(cliOptions.cleanupLegacy),
    aggressive: Boolean(cliOptions.aggressive),
    projectRoot,
    output: cliOptions.output || null,
    dryRun: Boolean(cliOptions.dryRun),
    notes: Boolean(cliOptions.notes),
    confirmOverwrites: brandConfig.confirmOverwrites !== false
  }

  return resolved
}

/**
 * @returns {Object} The `brand` section of the resolved config, or {} if missing/invalid.
 */
function loadBrandSection() {
  try {
    const cfg = getConfigFile()
    if (cfg && typeof cfg === 'object' && cfg.brand && typeof cfg.brand === 'object') {
      return cfg.brand
    }
  } catch {
    // Config file missing or invalid — fall back to empty defaults.
  }
  return {}
}

/**
 * Resolve a logo path with proper precedence.
 * Config-relative paths are resolved against projectRoot.
 */
function pickLogo(cliValue, configValue, brandDir, baseName, projectRoot) {
  if (cliValue) return path.resolve(cliValue)
  if (configValue) return path.isAbsolute(configValue) ? configValue : path.resolve(projectRoot, configValue)
  return findLogoFile(brandDir, baseName)
}
