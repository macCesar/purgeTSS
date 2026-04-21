/**
 * PurgeTSS - Branding pipeline orchestrator
 *
 * Composes the branding pipeline for Titanium projects.
 *
 * Every invocation (kitchen-sink) generates:
 *
 *   iOS & marketplace:
 *     - DefaultIcon.png              (alpha preserved)
 *     - DefaultIcon-ios.png          (flattened on bg-color)
 *     - DefaultIcon-Dark.png         (iOS 18+, transparent by default)
 *     - DefaultIcon-Tinted.png       (iOS 18+, grayscale on black)
 *     - iTunesConnect.png            (1024²)
 *     - MarketplaceArtwork.png       (512²)
 *
 *   Android:
 *     - ic_launcher_foreground.png   × 5 densities
 *     - ic_launcher_background.png   × 5 densities
 *     - ic_launcher_monochrome.png   × 5 densities  (themed icons / dark mode)
 *     - ic_launcher.png              × 5 densities  (legacy pre-adaptive)
 *     - mipmap-anydpi-v26/ic_launcher.xml
 *
 *   Optional (opt-in):
 *     - ic_stat_notify.png × 5       (--notification)
 *     - splash_icon.png × 5          (--splash)
 *
 *   Opt-out:
 *     - DefaultIcon-Dark.png         (--no-dark)
 *     - DefaultIcon-Tinted.png       (--no-tinted)
 *
 * @fileoverview Titanium branding pipeline orchestrator
 * @author César Estrada
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { logger } from './branding-logger.js'
import { logger as mainLogger } from '../../shared/logger.js'
import { confirmWithAlways } from '../../shared/prompt.js'
import { setConfigProperty } from '../../shared/config-writer.js'
import { prepareMaster } from './prepare-master.js'
import { genIos } from './gen-ios.js'
import { genIosDark } from './gen-ios-dark.js'
import { genIosTinted } from './gen-ios-tinted.js'
import { genAndroidAdaptive } from './gen-android-adaptive.js'
import { genAndroidLegacy } from './gen-android-legacy.js'
import { genMarketplace } from './gen-marketplace.js'
import { genNotification } from './gen-notification.js'
import { genSplash } from './gen-splash.js'
import { genIcLauncherXml } from './gen-ic-launcher-xml.js'
import { detectProjectType } from './tiapp-reader.js'
import { cleanupLegacy } from './cleanup-legacy.js'
import { printPostGenNotes } from './post-gen-notes.js'

export async function runBranding(opts) {
  const {
    logo,
    monochromeLogo = null,
    darkLogo = null,
    darkBgColor = null,
    withDark = true,
    withTinted = true,
    tintedLogo = null,
    bgColor = '#FFFFFF',
    bgColorExplicit = false,
    padding = 15,
    iosPadding = 4,
    notification = false,
    splash = false,
    cleanupLegacy: runCleanup = false,
    aggressive = false,
    projectRoot = process.cwd(),
    output,
    dryRun = false,
    inPlace = false,
    notes = false,
    yes = false,
    confirmOverwrites = true
  } = opts

  validateOptions({ logo, bgColor, darkBgColor, padding, iosPadding, cleanupLegacy: runCleanup })

  const projectType = detectProjectType(projectRoot)
  const isInPlace = inPlace && !output
  const stagingRoot = output || (isInPlace ? projectRoot : path.join(projectRoot, '.ti-branding'))

  console.log()
  mainLogger.info('Generating branding assets...')
  console.log()
  logger.property('Project:    ', `${projectRoot} (${projectType})`)
  if (logo) {
    logger.property('Logo:       ', logo)
    logger.property('Background: ', bgColor)
    logger.property('Padding:    ', `Android ${padding}% / iOS ${iosPadding}% per side`)
    console.log()
    logger.property(isInPlace ? 'Writing IN PLACE to: ' : 'Staging:    ', isInPlace ? projectRoot : stagingRoot)
  }
  if (isInPlace && !dryRun && confirmOverwrites) {
    logger.warning(`⚠  In-place mode will OVERWRITE files in ${projectRoot}.`)
    logger.warning(`   Commit first if you want a rollback.`)
    const choice = await confirmWithAlways('Continue? [y/N/a]', { yes })
    if (choice === 'no') {
      logger.info('Aborted.')
      // eslint-disable-next-line n/no-process-exit
      process.exit(0)
    }
    if (choice === 'always') {
      const saved = setConfigProperty('brand', 'confirmOverwrites', false)
      if (saved) {
        logger.success('Saved brand.confirmOverwrites = false to purgetss/config.cjs — you won\'t be asked again.')
      } else {
        logger.warning('Could not persist preference (config.cjs missing or unreadable). Proceeding anyway.')
      }
    }
  }
  if (dryRun) logger.warning('DRY RUN — no files will be written')

  const generated = []

  // Cleanup-only mode
  if (!logo && runCleanup) {
    logger.info('Cleanup-only mode')
    await cleanupLegacy({ projectRoot, projectType, aggressive, dryRun })
    return { stagingRoot, generated }
  }

  if (!logo) {
    throw new Error('Logo image is required (unless running --cleanup-legacy alone).')
  }
  if (!fs.existsSync(logo)) {
    throw new Error(`Logo image not found: ${logo}`)
  }

  if (projectType === 'unknown') {
    logger.warning(`Could not detect project layout. Expected 'app/' (Alloy) or 'Resources/' (Classic).`)
    logger.warning(`Assets will be staged under ${stagingRoot}/standalone/ — copy manually.`)
  }

  const androidResStaging = getStagingAndroidResRoot(stagingRoot, projectType)

  if (dryRun) {
    const lines = [
      `${stagingRoot}/DefaultIcon.png + DefaultIcon-ios.png`
    ]
    if (withDark) {
      const darkSrc = darkLogo
        ? `from ${darkLogo}`
        : (darkBgColor ? `opaque bg ${darkBgColor}` : 'transparent per Apple HIG')
      lines.push(`${stagingRoot}/DefaultIcon-Dark.png (${darkSrc})`)
    }
    if (withTinted) {
      const tintedSrc = tintedLogo ? `from ${tintedLogo}` : 'grayscale of logo, flattened on black'
      lines.push(`${stagingRoot}/DefaultIcon-Tinted.png (${tintedSrc})`)
    }
    lines.push(`${stagingRoot}/iTunesConnect.png + MarketplaceArtwork.png`)
    lines.push(`${androidResStaging}/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher_{foreground,background,monochrome}.png`)
    lines.push(`${androidResStaging}/mipmap-{...}/ic_launcher.png (legacy)`)
    lines.push(`${androidResStaging}/mipmap-anydpi-v26/ic_launcher.xml`)
    if (notification) lines.push(`${androidResStaging}/drawable-*/ic_stat_notify.png × 5`)
    if (splash) lines.push(`${androidResStaging}/drawable-*/splash_icon.png × 5`)
    mainLogger.block('[dry-run] Would generate:', ...lines)
    if (runCleanup) {
      await cleanupLegacy({ projectRoot, projectType, aggressive, dryRun })
    }
    return { stagingRoot, generated }
  }

  // Route temp logos through the OS temp dir in --in-place mode so the
  // project tree (and VSCode's file explorer) stays clean. Using a unique
  // subdir per run avoids clashes between parallel invocations.
  const tempDir = isInPlace
    ? path.join(os.tmpdir(), `pt-branding-${process.pid}-${Date.now()}`)
    : stagingRoot
  const weCreatedTempDir = isInPlace && !fs.existsSync(tempDir)
  if (weCreatedTempDir) fs.mkdirSync(tempDir, { recursive: true })

  // ---- Section: Logos ---------------------------------------------------
  logger.section('Logos')
  logger.bullet('Dual logos (square + tight)')
  const logoBase = path.join(tempDir, '_logo')
  const { tight } = await prepareMaster(logo, logoBase)

  let monoTight = null
  if (monochromeLogo) {
    if (!fs.existsSync(monochromeLogo)) {
      throw new Error(`Monochrome logo not found: ${monochromeLogo}`)
    }
    logger.bullet(`Monochrome logo: ${monochromeLogo}`)
    const monoBase = path.join(tempDir, '_logo_mono')
    const monoResult = await prepareMaster(monochromeLogo, monoBase)
    monoTight = monoResult.tight
  }

  // ---- Section: iOS & marketplace ----------------------------------------
  logger.section('iOS & marketplace')
  logger.bullet(`DefaultIcon.png (Android-safe padding ${padding}%) + DefaultIcon-ios.png (iOS padding ${iosPadding}%)`)
  const ios = await genIos(tight, bgColor, padding, iosPadding, stagingRoot)
  generated.push(ios.defaultIcon, ios.defaultIconIos)

  if (withDark) {
    let darkSource = tight
    if (darkLogo) {
      if (!fs.existsSync(darkLogo)) throw new Error(`Dark logo not found: ${darkLogo}`)
      const darkBase = path.join(tempDir, '_logo_dark')
      const darkResult = await prepareMaster(darkLogo, darkBase)
      darkSource = darkResult.tight
    }
    const darkSrcLabel = darkLogo ? 'from --dark-logo, ' : ''
    const darkBgLabel = darkBgColor ? `opaque bg ${darkBgColor}` : 'transparent per Apple HIG'
    logger.bullet(`DefaultIcon-Dark.png (${darkSrcLabel}${darkBgLabel})`)
    const darkPath = await genIosDark(darkSource, darkBgColor, iosPadding, stagingRoot)
    generated.push(darkPath)
  }

  if (withTinted) {
    let tintedSource = tight
    if (tintedLogo) {
      if (!fs.existsSync(tintedLogo)) throw new Error(`Tinted logo not found: ${tintedLogo}`)
      const tintedBase = path.join(tempDir, '_logo_tinted')
      const tintedResult = await prepareMaster(tintedLogo, tintedBase)
      tintedSource = tintedResult.tight
    }
    const tintedSrcLabel = tintedLogo ? 'from --tinted-logo' : 'grayscale of logo'
    logger.bullet(`DefaultIcon-Tinted.png (${tintedSrcLabel}, flattened on black)`)
    const tintedPath = await genIosTinted(tintedSource, iosPadding, stagingRoot)
    generated.push(tintedPath)
  }

  const alphaMode = bgColorExplicit ? `flattened on ${bgColor}` : 'alpha preserved'
  logger.bullet(`iTunesConnect.png + MarketplaceArtwork.png (${alphaMode})`)
  const mkt = await genMarketplace(tight, iosPadding, stagingRoot, {
    flatten: bgColorExplicit,
    bgColor
  })
  generated.push(mkt.itunesConnect, mkt.marketplaceArtwork)

  // ---- Section: Android --------------------------------------------------
  logger.section('Android')

  const monoLabel = monoTight ? ', monochrome from --monochrome-logo' : ''
  logger.bullet(`Adaptive icons (foreground + background + monochrome${monoLabel}) × 5`)
  const adaptiveFiles = await genAndroidAdaptive(tight, bgColor, padding, androidResStaging, { monoTight })
  generated.push(...adaptiveFiles)

  logger.bullet('Legacy ic_launcher.png × 5')
  const legacyFiles = await genAndroidLegacy(tight, bgColor, padding, androidResStaging)
  generated.push(...legacyFiles)

  const xmlPath = genIcLauncherXml(androidResStaging)
  generated.push(xmlPath)
  logger.bullet(`Adaptive icon XML: ${xmlPath}`)

  if (notification) {
    const monoLabelNotif = monoTight ? ' from --monochrome-logo' : ' whitened from logo'
    logger.bullet(`Notification icons (white+alpha, edge-to-edge${monoLabelNotif}) × 5`)
    const notifFiles = await genNotification(monoTight || tight, androidResStaging)
    generated.push(...notifFiles)
  }

  if (splash) {
    logger.bullet('Splash icons × 5')
    const splashFiles = await genSplash(tight, androidResStaging)
    generated.push(...splashFiles)
  }

  if (runCleanup) {
    logger.info('Cleanup legacy artifacts')
    await cleanupLegacy({ projectRoot, projectType, aggressive, dryRun })
  }

  // Clean up temp _logo_* files in --in-place mode
  if (isInPlace) {
    if (weCreatedTempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } else {
      const tmpFiles = [
        path.join(tempDir, '_logo_square.png'),
        path.join(tempDir, '_logo_tight.png'),
        path.join(tempDir, '_logo_mono_square.png'),
        path.join(tempDir, '_logo_mono_tight.png'),
        path.join(tempDir, '_logo_dark_square.png'),
        path.join(tempDir, '_logo_dark_tight.png'),
        path.join(tempDir, '_logo_tinted_square.png'),
        path.join(tempDir, '_logo_tinted_tight.png')
      ]
      for (const tmp of tmpFiles) {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
      }
    }
    logger.info('')
    logger.success(`All assets written IN PLACE at: ${projectRoot}`)
  } else {
    logger.info('')
    logger.success(`All assets staged at: ${stagingRoot}`)
  }

  printPostGenNotes({
    projectType,
    projectRoot,
    stagingRoot,
    bgColor,
    padding,
    iosPadding,
    withSplash: splash,
    withNotification: notification,
    inPlace: isInPlace,
    fullNotes: notes
  })

  return { stagingRoot, generated }
}

function getStagingAndroidResRoot(stagingRoot, projectType) {
  if (projectType === 'alloy') return path.join(stagingRoot, 'app', 'platform', 'android', 'res')
  if (projectType === 'classic') return path.join(stagingRoot, 'platform', 'android', 'res')
  return path.join(stagingRoot, 'standalone', 'platform', 'android', 'res')
}

function validateOptions({ logo, bgColor, darkBgColor, padding, iosPadding, cleanupLegacy }) {
  if (!logo && !cleanupLegacy) {
    throw new Error('Logo image path is required (unless using --cleanup-legacy alone).')
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(bgColor)) {
    throw new Error(`--bg-color must be a 6-digit hex like #0B1326 (got: ${bgColor}).`)
  }
  if (darkBgColor && !/^#[0-9A-Fa-f]{6}$/.test(darkBgColor)) {
    throw new Error(`--dark-bg-color must be a 6-digit hex like #1C1C1E (got: ${darkBgColor}).`)
  }
  if (padding < 0 || padding > 40) {
    throw new Error(`--padding must be between 0 and 40 (got: ${padding}).`)
  }
  if (iosPadding < 0 || iosPadding > 40) {
    throw new Error(`--ios-padding must be between 0 and 40 (got: ${iosPadding}).`)
  }
}
