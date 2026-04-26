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
import sharp from 'sharp'
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
import { genAndroidDefault } from './gen-android-default.js'
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
    iconLogo = null,
    splashLogo = null,
    monochromeLogo = null,
    darkLogo = null,
    darkBgColor = null,
    withDark = true,
    withTinted = true,
    tintedLogo = null,
    bgColor = '#FFFFFF',
    bgColorExplicit = false,
    androidAdaptivePadding = 19,
    androidLegacyPadding = 10,
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

  validateOptions({ logo, bgColor, darkBgColor, androidAdaptivePadding, androidLegacyPadding, iosPadding, cleanupLegacy: runCleanup })

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
    logger.property('Padding:    ', `Android adaptive ${androidAdaptivePadding}% / Android legacy ${androidLegacyPadding}% / iOS ${iosPadding}% per side`)
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
    const androidAssetsStaging = getStagingAndroidAssetsRoot(stagingRoot, projectType)
    if (androidAssetsStaging) lines.push(`${androidAssetsStaging}/default.png (Android <12 legacy splash fallback)`)
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
  const { square, tight } = await prepareMaster(logo, logoBase)

  let iconMaster = square
  if (iconLogo) {
    if (!fs.existsSync(iconLogo)) {
      throw new Error(`Android icon logo not found: ${iconLogo}`)
    }
    logger.bullet(`Android icon logo: ${iconLogo}`)
    const iconBase = path.join(tempDir, '_logo_icon')
    const iconResult = await prepareMaster(iconLogo, iconBase)
    iconMaster = iconResult.square
  }
  await warnIfLogoAspectIsUnsafeForLauncher(tight)

  let splashMaster = iconMaster
  if (splashLogo) {
    if (!fs.existsSync(splashLogo)) {
      throw new Error(`Android splash logo not found: ${splashLogo}`)
    }
    logger.bullet(`Android splash logo: ${splashLogo}`)
    const splashBase = path.join(tempDir, '_logo_splash')
    const splashResult = await prepareMaster(splashLogo, splashBase)
    splashMaster = splashResult.square
  }

  let monoMaster = null
  if (monochromeLogo) {
    if (!fs.existsSync(monochromeLogo)) {
      throw new Error(`Monochrome logo not found: ${monochromeLogo}`)
    }
    logger.bullet(`Monochrome logo: ${monochromeLogo}`)
    const monoBase = path.join(tempDir, '_logo_mono')
    const monoResult = await prepareMaster(monochromeLogo, monoBase)
    monoMaster = monoResult.square
  }

  // ---- Section: iOS & marketplace ----------------------------------------
  logger.section('iOS & marketplace')
  logger.bullet(`DefaultIcon.png (Android-safe padding ${androidAdaptivePadding}%) + DefaultIcon-ios.png (iOS padding ${iosPadding}%)`)
  const ios = await genIos(tight, bgColor, androidAdaptivePadding, iosPadding, stagingRoot)
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

  const monoLabel = monoMaster ? ', monochrome from --monochrome-logo' : ''
  logger.bullet(`Adaptive icons (foreground + background + monochrome${monoLabel}, padding ${androidAdaptivePadding}%) × 5`)
  const adaptiveFiles = await genAndroidAdaptive(iconMaster, bgColor, androidAdaptivePadding, androidResStaging, { monoMaster })
  generated.push(...adaptiveFiles)

  logger.bullet(`Legacy ic_launcher.png × 5 (padding ${androidLegacyPadding}%)`)
  const legacyFiles = await genAndroidLegacy(iconMaster, bgColor, androidLegacyPadding, androidResStaging)
  generated.push(...legacyFiles)

  const xmlPath = genIcLauncherXml(androidResStaging)
  generated.push(xmlPath)
  logger.bullet(`Adaptive icon XML: ${xmlPath}`)

  const androidDefaultDir = getStagingAndroidAssetsRoot(stagingRoot, projectType)
  if (androidDefaultDir) {
    logger.bullet('Legacy Android default.png splash fallback')
    const defaultSplashPath = await genAndroidDefault(splashMaster, bgColor, androidDefaultDir)
    generated.push(defaultSplashPath)
  }

  if (notification) {
    const monoLabelNotif = monoMaster ? ' from --monochrome-logo' : ' whitened from logo'
    logger.bullet(`Notification icons (white+alpha, edge-to-edge${monoLabelNotif}) × 5`)
    const notifFiles = await genNotification(monoMaster || iconMaster, androidResStaging)
    generated.push(...notifFiles)
  }

  if (splash) {
    logger.bullet('Splash icons × 5')
    const splashFiles = await genSplash(splashMaster, androidResStaging)
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
        path.join(tempDir, '_logo_icon_square.png'),
        path.join(tempDir, '_logo_icon_tight.png'),
        path.join(tempDir, '_logo_mono_square.png'),
        path.join(tempDir, '_logo_mono_tight.png'),
        path.join(tempDir, '_logo_dark_square.png'),
        path.join(tempDir, '_logo_dark_tight.png'),
        path.join(tempDir, '_logo_tinted_square.png'),
        path.join(tempDir, '_logo_tinted_tight.png'),
        path.join(tempDir, '_logo_splash_square.png'),
        path.join(tempDir, '_logo_splash_tight.png')
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
    androidAdaptivePadding,
    androidLegacyPadding,
    iosPadding,
    withSplash: splash,
    withNotification: notification,
    inPlace: isInPlace,
    fullNotes: notes
  })

  return { stagingRoot, generated }
}

async function warnIfLogoAspectIsUnsafeForLauncher(tightLogoPath) {
  const meta = await sharp(tightLogoPath).metadata()
  const width = meta.width || 0
  const height = meta.height || 0

  if (!width || !height) return

  const aspect = width / height
  const isWideWordmark = aspect > 1.25
  const isTallWordmark = aspect < 0.8

  if (!isWideWordmark && !isTallWordmark) return

  logger.warning('The source logo is not close to square.')
  logger.warning(`Aspect ratio detected: ${width}×${height} (${aspect.toFixed(2)}:1).`)
  logger.warning('Launcher icons and Android 12+ system splash screens work best with a square mark.')
  logger.warning('A wide/tall wordmark can look cramped or cropped once centered inside icon masks.')
  logger.warning('Recommendation: use a dedicated square app-icon source for `purgetss brand`.')
}

function getStagingAndroidResRoot(stagingRoot, projectType) {
  if (projectType === 'alloy') return path.join(stagingRoot, 'app', 'platform', 'android', 'res')
  if (projectType === 'classic') return path.join(stagingRoot, 'platform', 'android', 'res')
  return path.join(stagingRoot, 'standalone', 'platform', 'android', 'res')
}

function getStagingAndroidAssetsRoot(stagingRoot, projectType) {
  if (projectType === 'alloy') return path.join(stagingRoot, 'app', 'assets', 'android')
  if (projectType === 'classic') return path.join(stagingRoot, 'Resources', 'android')
  return null
}

function validateOptions({ logo, bgColor, darkBgColor, androidAdaptivePadding, androidLegacyPadding, iosPadding, cleanupLegacy }) {
  if (!logo && !cleanupLegacy) {
    throw new Error('Logo image path is required (unless using --cleanup-legacy alone).')
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(bgColor)) {
    throw new Error(`--bg-color must be a 6-digit hex like #0B1326 (got: ${bgColor}).`)
  }
  if (darkBgColor && !/^#[0-9A-Fa-f]{6}$/.test(darkBgColor)) {
    throw new Error(`--dark-bg-color must be a 6-digit hex like #1C1C1E (got: ${darkBgColor}).`)
  }
  if (androidAdaptivePadding < 0 || androidAdaptivePadding > 40) {
    throw new Error(`--android-adaptive-padding must be between 0 and 40 (got: ${androidAdaptivePadding}).`)
  }
  if (androidLegacyPadding < 0 || androidLegacyPadding > 40) {
    throw new Error(`--android-legacy-padding must be between 0 and 40 (got: ${androidLegacyPadding}).`)
  }
  if (iosPadding < 0 || iosPadding > 40) {
    throw new Error(`--ios-padding must be between 0 and 40 (got: ${iosPadding}).`)
  }
}
