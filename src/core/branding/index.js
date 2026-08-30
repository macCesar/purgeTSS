/**
 * PurgeTSS - Branding pipeline orchestrator
 *
 * Composes the branding pipeline for Titanium projects.
 *
 * Two rules decide what runs: the piece must be enabled by config/CLI and its
 * platform must be enabled in tiapp.xml. An explicit --only request may prepare
 * a disabled platform deliberately. The defaults cover both fresh Alloy and
 * Classic projects without making a Classic app depend on PurgeTSS at build
 * time.
 *
 *   iOS & marketplace:
 *     icon              DefaultIcon.png + DefaultIcon-ios.png
 *     dark              DefaultIcon-Dark.png            (iOS 18+, transparent by default)
 *     tinted            DefaultIcon-Tinted.png          (iOS 18+, grayscale on black)
 *     ios-splash        assets/iphone/Default*.png × 16
 *     launch-logo       LaunchLogo.png 1024²            (by convention: logo-launch.*)
 *     marketplace       iTunesConnect.png + MarketplaceArtwork.png
 *     feature-graphic   MarketplaceArtworkFeature.png   (1024×500)
 *
 *   Android:
 *     adaptive          ic_launcher_{foreground,background,monochrome}.png × 5 + ic_launcher.xml
 *     legacy-icon       ic_launcher.png × 5
 *     appicon           appicon.png (128²)
 *     android-splash    assets/android/default.png + images/res-*\/default.png × 11
 *
 *   Opt-in — inert until the user edits XML by hand, so they stay off:
 *     splash-icon       drawable-*\/splash_icon.png × 5  (--splash-icon)
 *     notification-icon drawable-*\/ic_stat_notify.png × 5 (--notification-icon)
 *     nine-patch        background.9.png                (--nine-patch, not implemented)
 *
 * The PIPELINE map below is the single source of truth for what each piece
 * writes: the real run and the --dry-run listing both read it.
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
import { genIosSplashes, listIosSplashTargets, listIosSplashSizes } from './gen-ios-splashes.js'
import { genLaunchLogo } from './gen-launch-logo.js'
import { genAndroidAdaptive } from './gen-android-adaptive.js'
import { genAndroidLegacy } from './gen-android-legacy.js'
import { genAndroidDefault } from './gen-android-default.js'
import { genAndroidSplashes, listSplashFolders, listSplashSizes } from './gen-android-splashes.js'
import { genAppicon } from './gen-appicon.js'
import { genMarketplace } from './gen-marketplace.js'
import { genFeatureGraphic } from './gen-feature-graphic.js'
import { genNotification } from './gen-notification.js'
import { genSplash } from './gen-splash.js'
import { genIcLauncherXml } from './gen-ic-launcher-xml.js'
import { detectProjectType, readTiapp } from './tiapp-reader.js'
import { cleanupLegacy } from './cleanup-legacy.js'
import { printPostGenNotes } from './post-gen-notes.js'
import { optimizePngs, formatBytes } from './optimize-pngs.js'
import { logoBox } from './splash-geometry.js'
import { selectPiecesForTargets, targetsForExplicitSelection } from './platform-selection.js'
import { adoptCliLogo } from './adopt-cli-logo.js'
import { analyzeArtworkEdges, findVisibleFrameRisks } from './artwork-edges.js'

/** Side of the box a piece fits its logo into, for a square canvas. */
function inner(canvas, paddingPct) {
  return Math.max(1, Math.floor((canvas * (100 - 2 * (paddingPct ?? 0))) / 100))
}

/**
 * Largest number of pixels any selected piece will ask of the master.
 *
 * The masters are rasterized to this, so every destination is a reduction and
 * never an upscale. A default run needs ~950 px; lowering a padding raises the
 * figure and the master grows with it, rather than the output going soft
 * against a fixed ceiling.
 *
 * @param {string[]} names - Selected piece names
 * @param {Object} pieces - Resolved pieces
 * @returns {number} Longest side, in px
 */
function requiredMasterPx(names, pieces) {
  const asked = names.map((name) => PIPELINE[name]?.maxLogoPx?.(pieces[name]) ?? 0)
  return Math.max(MIN_MASTER_PX, ...asked)
}

/** Never build a master smaller than this — cheap, and keeps small runs sharp. */
const MIN_MASTER_PX = 512

/**
 * pieza → generador. Each entry declares which prepared master it wants
 * ('tight' keeps the logo's own aspect for presentation art, 'square' pads it
 * for icon masks), where it writes, what it would write (dry-run) and how it
 * writes it.
 *
 * @type {Object<string, {variant: string, root: string, describe: Function, run: Function}>}
 */
const PIPELINE = {
  icon: {
    variant: 'tight',
    root: 'staging',
    maxLogoPx: (piece) => inner(1024, piece.padding),
    describe: (ctx) => [`${ctx.stagingRoot}/DefaultIcon.png + DefaultIcon-ios.png`],
    run: async(ctx, piece, master) => {
      logger.bullet(`DefaultIcon.png + DefaultIcon-ios.png (padding ${piece.padding}%, opaque on ${piece.background})`)
      const ios = await genIos(master, piece.background, piece.padding, ctx.stagingRoot)
      return [ios.defaultIcon, ios.defaultIconIos]
    }
  },

  dark: {
    variant: 'tight',
    root: 'staging',
    maxLogoPx: (piece) => inner(1024, piece.padding),
    describe: (ctx, piece) => {
      const source = piece.logo
        ? `from ${piece.logo}`
        : (piece.background ? `opaque bg ${piece.background}` : 'transparent per Apple HIG')
      return [`${ctx.stagingRoot}/DefaultIcon-Dark.png (${source})`]
    },
    run: async(ctx, piece, master) => {
      const srcLabel = piece.logo ? 'from dark logo, ' : ''
      const bgLabel = piece.background ? `opaque bg ${piece.background}` : 'transparent per Apple HIG'
      logger.bullet(`DefaultIcon-Dark.png (${srcLabel}${bgLabel})`)
      return [await genIosDark(master, piece.background, piece.padding, ctx.stagingRoot)]
    }
  },

  tinted: {
    variant: 'tight',
    root: 'staging',
    maxLogoPx: (piece) => inner(1024, piece.padding),
    describe: (ctx, piece) => {
      const source = piece.logo ? `from ${piece.logo}` : 'grayscale of logo, flattened on black'
      return [`${ctx.stagingRoot}/DefaultIcon-Tinted.png (${source})`]
    },
    run: async(ctx, piece, master) => {
      const srcLabel = piece.logo ? 'from tinted logo' : 'grayscale of logo'
      logger.bullet(`DefaultIcon-Tinted.png (${srcLabel}, flattened on black)`)
      return [await genIosTinted(master, piece.padding, ctx.stagingRoot)]
    }
  },

  'ios-splash': {
    variant: 'tight',
    root: 'ios-assets',
    maxLogoPx: (piece) => Math.max(...listIosSplashSizes().map(([w, h]) => logoBox(w, h, piece.padding))),
    describe: (ctx, piece) => [`${ctx.iosAssetsRoot}/{${listIosSplashTargets().join(',')}} (${piece.padding}% padding)`],
    summary: (ctx) => `${relativeAssetRoot(ctx, 'iphone')}/Default*.png × ${listIosSplashTargets().length}`,
    keeps: (ctx) => listIosSplashTargets().map((file) => path.join(ctx.iosAssetsRoot, file)),
    run: async(ctx, piece, master) => {
      logger.bullet(`iPhone launch images × ${listIosSplashTargets().length} (padding ${piece.padding}%)`)
      return genIosSplashes(master, piece.background, ctx.iosAssetsRoot, piece.padding)
    }
  },

  'launch-logo': {
    variant: 'tight',
    root: 'ios-assets',
    maxLogoPx: (piece) => inner(1024, piece.padding),
    describe: (ctx, piece) => [`${ctx.iosAssetsRoot}/LaunchLogo.png (1024×1024, ${piece.padding}% padding)`],
    summary: (ctx) => `${relativeAssetRoot(ctx, 'iphone')}/LaunchLogo.png (1024×1024)`,
    run: async(ctx, piece, master) => {
      logger.bullet(`LaunchLogo.png (1024×1024, padding ${piece.padding}%) — iOS launch screen source`)
      return [await genLaunchLogo(master, piece.padding, ctx.iosAssetsRoot, { bgColor: piece.background })]
    }
  },

  marketplace: {
    variant: 'tight',
    root: 'staging',
    maxLogoPx: (piece) => inner(1024, piece.padding),
    describe: (ctx) => {
      const files = []
      if (ctx.platformTargets.ios) files.push(`${ctx.stagingRoot}/iTunesConnect.png`)
      if (ctx.platformTargets.android) files.push(`${ctx.stagingRoot}/MarketplaceArtwork.png`)
      return files
    },
    summary: (ctx) => [
      ctx.platformTargets.ios ? 'iTunesConnect.png' : null,
      ctx.platformTargets.android ? 'MarketplaceArtwork.png' : null
    ].filter(Boolean).join(' + '),
    run: async(ctx, piece, master) => {
      const names = [
        ctx.platformTargets.ios ? 'iTunesConnect.png' : null,
        ctx.platformTargets.android ? 'MarketplaceArtwork.png' : null
      ].filter(Boolean).join(' + ')
      logger.bullet(`${names} (opaque on ${piece.background})`)
      const mkt = await genMarketplace(master, piece.padding, ctx.stagingRoot, {
        flatten: true,
        bgColor: piece.background,
        generateIos: ctx.platformTargets.ios,
        generateAndroid: ctx.platformTargets.android
      })
      return [mkt.itunesConnect, mkt.marketplaceArtwork].filter(Boolean)
    }
  },

  'feature-graphic': {
    variant: 'tight',
    root: 'staging',
    maxLogoPx: (piece) => inner(500, piece.padding),
    describe: (ctx, piece) => {
      const source = piece.logo ? `from ${piece.logo}` : 'from main logo'
      return [`${ctx.stagingRoot}/MarketplaceArtworkFeature.png (${source}, ${piece.padding}% vertical padding)`]
    },
    run: async(ctx, piece, master) => {
      const srcLabel = piece.logo ? 'from feature logo' : 'from main logo'
      logger.bullet(`MarketplaceArtworkFeature.png (1024×500, ${srcLabel}, ${piece.padding}% vertical padding, flattened on ${piece.background})`)
      return [await genFeatureGraphic(master, piece.padding, ctx.stagingRoot, { bgColor: piece.background })]
    }
  },

  adaptive: {
    variant: 'square',
    root: 'android-res',
    maxLogoPx: (piece) => inner(432, piece.padding),
    describe: (ctx) => [
      `${ctx.androidResRoot}/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher_{foreground,background,monochrome}.png`,
      `${ctx.androidResRoot}/mipmap-anydpi-v26/ic_launcher.xml`
    ],
    run: async(ctx, piece, master) => {
      const monoLabel = ctx.monoMaster ? ', monochrome from monochrome logo' : ''
      logger.bullet(`Adaptive icons (foreground + background + monochrome${monoLabel}, padding ${piece.padding}%) × 5`)
      const files = await genAndroidAdaptive(master, piece.background, piece.padding, ctx.androidResRoot, { monoMaster: ctx.monoMaster })
      const xmlPath = genIcLauncherXml(ctx.androidResRoot)
      logger.bullet(`Adaptive icon XML: ${xmlPath}`)
      return [...files, xmlPath]
    }
  },

  'legacy-icon': {
    variant: 'square',
    root: 'android-res',
    maxLogoPx: (piece) => inner(432, piece.padding),
    describe: (ctx) => [`${ctx.androidResRoot}/mipmap-{...}/ic_launcher.png (legacy)`],
    run: async(ctx, piece, master) => {
      logger.bullet(`Legacy ic_launcher.png × 5 (padding ${piece.padding}%)`)
      return genAndroidLegacy(master, piece.background, piece.padding, ctx.androidResRoot)
    }
  },

  appicon: {
    variant: 'square',
    root: 'android-assets',
    maxLogoPx: (piece) => inner(128, piece.padding),
    describe: (ctx, piece) => [`${ctx.androidAssetsRoot}/appicon.png (128×128, ${piece.padding}% padding)`],
    summary: (ctx) => `${relativeAssetRoot(ctx, 'android')}/appicon.png (128×128)`,
    keeps: (ctx) => [path.join(ctx.androidAssetsRoot, 'appicon.png')],
    run: async(ctx, piece, master) => {
      logger.bullet(`appicon.png (128×128, padding ${piece.padding}%)`)
      return [await genAppicon(master, piece.background, piece.padding, ctx.androidAssetsRoot)]
    }
  },

  'android-splash': {
    variant: 'tight',
    root: 'android-assets',
    maxLogoPx: (piece) => Math.max(logoBox(1440, 2560, piece.padding), ...listSplashSizes().map(([w, h]) => logoBox(w, h, piece.padding))),
    describe: (ctx, piece) => [
      `${ctx.androidAssetsRoot}/default.png (${piece.padding}% padding)`,
      `${ctx.androidAssetsRoot}/images/{${listSplashFolders().join(',')}}/default.png`
    ],
    summary: (ctx) => `${relativeAssetRoot(ctx, 'android')}/default.png + ${relativeAssetRoot(ctx, 'android')}/images/res-*/default.png × ${listSplashFolders().length}`,
    keeps: (ctx) => listSplashFolders().map((folder) => path.join(ctx.androidAssetsRoot, 'images', folder, 'default.png')),
    run: async(ctx, piece, master) => {
      logger.bullet(`Android default.png splash (padding ${piece.padding}%)`)
      const defaultSplash = await genAndroidDefault(master, piece.background, ctx.androidAssetsRoot, piece.padding)
      logger.bullet(`Per-qualifier Android splashes × ${listSplashFolders().length} (Android <12)`)
      const perQualifier = await genAndroidSplashes(master, piece.background, path.join(ctx.androidAssetsRoot, 'images'), piece.padding)
      return [defaultSplash, ...perQualifier]
    }
  },

  'splash-icon': {
    variant: 'square',
    root: 'android-res',
    maxLogoPx: () => 288,
    describe: (ctx) => [`${ctx.androidResRoot}/drawable-*/splash_icon.png × 5`],
    run: async(ctx, piece, master) => {
      logger.bullet('Splash icons × 5 (Android 12+ windowSplashScreenAnimatedIcon)')
      return genSplash(master, ctx.androidResRoot)
    }
  },

  'notification-icon': {
    variant: 'square',
    root: 'android-res',
    maxLogoPx: () => 96,
    describe: (ctx) => [`${ctx.androidResRoot}/drawable-*/ic_stat_notify.png × 5`],
    run: async(ctx, piece, master) => {
      const monoLabel = ctx.monoMaster ? ' from monochrome logo' : ' whitened from logo'
      logger.bullet(`Notification icons (white+alpha, edge-to-edge${monoLabel}) × 5`)
      return genNotification(ctx.monoMaster || master, ctx.androidResRoot)
    }
  },

  'nine-patch': {
    variant: 'tight',
    root: 'android-res',
    describe: () => ['background.9.png — not implemented yet, nothing will be written'],
    run: async() => {
      logger.warning('--nine-patch is declared but not implemented yet; no background.9.png was written.')
      return []
    }
  }
}

export async function runBranding(opts) {
  const {
    logo,
    monochromeLogo = null,
    bgColor = '#FFFFFF',
    pieces = {},
    selection = [],
    onlySelection = null,
    optimize = false,
    cleanupLegacy: runCleanup = false,
    aggressive = false,
    projectRoot = process.cwd(),
    output,
    dryRun = false,
    inPlace = false,
    notes = false,
    yes = false,
    confirmOverwrites = true,
    adoptLogo = false
  } = opts

  validateOptions({ logo, bgColor, pieces, cleanupLegacy: runCleanup })

  const projectType = detectProjectType(projectRoot)
  const tiapp = readTiapp(path.join(projectRoot, 'tiapp.xml'))
  const targetFilter = selectPiecesForTargets(selection, pieces, tiapp.deploymentTargets, {
    explicit: Boolean(onlySelection)
  })
  const platformTargets = onlySelection
    ? targetsForExplicitSelection(targetFilter.selected, pieces)
    : tiapp.deploymentTargets
  const isInPlace = inPlace && !output
  const stagingRoot = output || (isInPlace ? projectRoot : path.join(projectRoot, '.ti-branding'))

  console.log()
  mainLogger.info('Generating branding assets...')
  console.log()
  logger.property('Project:    ', `${projectRoot} (${projectType})`)
  logger.property('Targets:    ', formatTargets(platformTargets, Boolean(onlySelection)))
  if (logo) {
    logger.property('Logo:       ', logo)
    logger.property('Background: ', `${bgColor} (opaque fallback, inherited by pieces)`)
    logger.property('Pieces:     ', targetFilter.selected.length ? targetFilter.selected.join(', ') : '(none selected)')
    console.log()
    logger.property(isInPlace ? 'Writing IN PLACE to: ' : 'Staging:    ', isInPlace ? projectRoot : stagingRoot)
  }
  if (logo && targetFilter.selected.length === 0) {
    logger.warning('No branding pieces match the enabled <deployment-targets> in tiapp.xml.')
    logger.warning('Enable iphone/ipad or android, or use --only to prepare a platform explicitly.')
    return { stagingRoot, generated: [] }
  }
  if (isInPlace && !dryRun && confirmOverwrites) {
    logger.warning(`⚠  In-place mode will OVERWRITE files in ${projectRoot}.`)
    logger.warning('   Commit first if you want a rollback.')
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

  if (targetFilter.skipped.length > 0) {
    logger.warning(`Skipped for disabled deployment target(s): ${targetFilter.skipped.join(', ')}`)
  }

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
  let activeLogo = logo
  if (adoptLogo && isInPlace) {
    const adopted = adoptCliLogo(activeLogo, projectRoot, { dryRun })
    if (adopted.wouldMove) {
      logger.info(`Would move source logo to: ${adopted.to}`)
    } else if (adopted.moved) {
      activeLogo = adopted.logo
      logger.success(`Moved source logo to: ${adopted.to}`)
    }
  }

  if (!fs.existsSync(activeLogo)) {
    throw new Error(`Logo image not found: ${activeLogo}`)
  }

  if (projectType === 'unknown') {
    logger.warning('Could not detect project layout. Expected \'app/\' (Alloy) or \'Resources/\' (Classic).')
    logger.warning(`Assets will be staged under ${stagingRoot}/standalone/ — copy manually.`)
  }

  const ctx = {
    projectType,
    stagingRoot,
    androidResRoot: getStagingAndroidResRoot(stagingRoot, projectType),
    androidAssetsRoot: getStagingAndroidAssetsRoot(stagingRoot, projectType),
    iosAssetsRoot: getStagingIosAssetsRoot(stagingRoot, projectType),
    platformTargets,
    pieces,
    monoMaster: null
  }

  const runnable = targetFilter.selected.filter((name) => {
    const entry = PIPELINE[name]
    if (!entry) return false
    if (entry.root === 'android-assets' && !ctx.androidAssetsRoot) return false
    if (entry.root === 'ios-assets' && !ctx.iosAssetsRoot) return false
    return true
  })

  const skipped = targetFilter.selected.filter((name) => !runnable.includes(name))
  if (skipped.length > 0) {
    logger.warning(`Skipped (no project folder for them in a '${projectType}' layout): ${skipped.join(', ')}`)
  }

  if (dryRun) {
    const lines = runnable.flatMap((name) => PIPELINE[name].describe(ctx, pieces[name]))
    if (optimize) lines.push('...then re-encode every PNG above with a quantized palette (--optimize)')
    mainLogger.block('[dry-run] Would generate:', ...lines)
    if (runCleanup) {
      await cleanupLegacy({ projectRoot, projectType, aggressive, dryRun, keepPaths: plannedPaths(ctx, runnable) })
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

  const masterBases = []
  const mastersByLogo = new Map()

  /**
   * Prepare (once) the square + tight masters for a logo path.
   * @param {string} logoPath
   * @param {string} label - Suffix for the temp file name
   * @returns {Promise<{square: string, tight: string}>}
   */
  const masterPx = requiredMasterPx(runnable, pieces)
  logger.bullet(`Masters at ${masterPx} px — the largest any selected piece asks for`)

  const mastersFor = async(logoPath, label) => {
    if (mastersByLogo.has(logoPath)) return mastersByLogo.get(logoPath)
    if (!fs.existsSync(logoPath)) {
      throw new Error(`Logo not found: ${logoPath}`)
    }
    const base = path.join(tempDir, label)
    masterBases.push(base)
    const result = await prepareMaster(logoPath, base, masterPx)
    mastersByLogo.set(logoPath, result)
    return result
  }

  const mainMaster = await mastersFor(activeLogo, '_logo')
  await warnIfLogoAspectIsUnsafeForLauncher(mainMaster.tight)
  await warnIfArtworkWillShowAFrame(mainMaster.tight, runnable, pieces)

  if (monochromeLogo) {
    logger.bullet(`Monochrome logo: ${monochromeLogo}`)
    const mono = await mastersFor(monochromeLogo, '_logo_mono')
    ctx.monoMaster = mono.square
  }

  for (const name of runnable) {
    const piece = pieces[name]
    if (piece?.logo) logger.bullet(`${name} logo: ${piece.logo}`)
  }

  // ---- Sections: one per piece, grouped by the piece's section ------------
  let currentSection = null

  for (const name of runnable) {
    const piece = pieces[name]
    const entry = PIPELINE[name]

    if (piece.section !== currentSection) {
      currentSection = piece.section
      logger.section(currentSection)
    }

    const masters = piece.logo ? await mastersFor(piece.logo, `_logo_${name}`) : mainMaster
    const written = await entry.run(ctx, piece, masters[entry.variant])
    generated.push(...written)
  }

  if (optimize) {
    logger.section('Optimize')
    const result = await optimizePngs(generated)
    if (result.files === 0) {
      logger.bullet('Nothing to shrink — the generated PNGs were already smaller than a palette version.')
    } else {
      const saved = Math.round((1 - result.after / result.before) * 100)
      logger.bullet(`${result.files} file(s): ${formatBytes(result.before)} → ${formatBytes(result.after)} (${saved}% smaller)`)
    }
  }

  if (runCleanup) {
    logger.info('Cleanup legacy artifacts')
    await cleanupLegacy({ projectRoot, projectType, aggressive, dryRun, keepPaths: generated })
  }

  // Clean up temp _logo_* files in --in-place mode
  if (isInPlace) {
    if (weCreatedTempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } else {
      for (const base of masterBases) {
        for (const suffix of ['_square.png', '_tight.png']) {
          const tmp = `${base}${suffix}`
          if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
        }
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
    pieces,
    generatedPieces: runnable,
    generatedDescriptions: Object.fromEntries(runnable.map((name) => [
      name,
      PIPELINE[name].summary?.(ctx, pieces[name]) ?? pieces[name]?.generates ?? ''
    ])),
    generatedRootFiles: generated
      .filter((file) => path.dirname(file) === stagingRoot)
      .map((file) => path.basename(file, path.extname(file))),
    platformTargets,
    inPlace: isInPlace,
    fullNotes: notes
  })

  return { stagingRoot, generated }
}

async function warnIfArtworkWillShowAFrame(mainLogo, runnable, pieces) {
  const analysis = await analyzeArtworkEdges(mainLogo)
  const risks = findVisibleFrameRisks(analysis, runnable, pieces)
  if (risks.length === 0) return

  const affected = risks
    .map(({ name, padding, background }) => `${name} (${padding}% on ${background})`)
    .join(', ')

  logger.warning(`The source is opaque to its edges (edge color ≈ ${analysis.edgeColor}).`)
  logger.warning(`A contrasting frame will be visible in: ${affected}.`)
  logger.warning('brand.background is inherited by these canvases: set it once to a matching color.')

  if (risks.some(({ name }) => ['icon', 'dark', 'tinted', 'marketplace'].includes(name))) {
    logger.warning('For finished iOS/store artwork, use --ios-padding 0 (the default) to keep it full-bleed.')
  }
  if (risks.some(({ name }) => ['adaptive', 'legacy-icon', 'appicon'].includes(name))) {
    logger.warning('For Android launcher pieces, keep safe-zone padding and prefer transparent piece-specific logo artwork over a complete square icon.')
  }
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

/**
 * Paths a --dry-run pass would write, for the pieces whose output overlaps what
 * --cleanup-legacy deletes. Lets the dry-run plan match what a real run does.
 *
 * @param {Object} ctx - Pipeline context
 * @param {string[]} names - Selected piece names
 * @returns {string[]} Absolute paths
 */
function plannedPaths(ctx, names) {
  return names.flatMap((name) => PIPELINE[name].keeps?.(ctx) ?? [])
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

function getStagingIosAssetsRoot(stagingRoot, projectType) {
  if (projectType === 'alloy') return path.join(stagingRoot, 'app', 'assets', 'iphone')
  if (projectType === 'classic') return path.join(stagingRoot, 'Resources', 'iphone')
  return null
}

function formatTargets(targets, explicit) {
  const enabled = []
  if (targets.ios) enabled.push('iOS')
  if (targets.android) enabled.push('Android')
  const label = enabled.length > 0 ? enabled.join(', ') : '(none enabled)'
  return explicit ? `${label} (explicit --only)` : label
}

function relativeAssetRoot(ctx, platform) {
  if (ctx.projectType === 'classic') return `Resources/${platform}`
  if (ctx.projectType === 'alloy') return `app/assets/${platform}`
  return `standalone/${platform}`
}

function validateOptions({ logo, bgColor, pieces, cleanupLegacy }) {
  if (!logo && !cleanupLegacy) {
    throw new Error('Logo image path is required (unless using --cleanup-legacy alone).')
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(bgColor)) {
    throw new Error(`--bg-color must be a 6-digit hex like #0B1326 (got: ${bgColor}).`)
  }

  for (const piece of Object.values(pieces)) {
    if (piece.background != null && !/^#[0-9A-Fa-f]{6}$/.test(piece.background)) {
      throw new Error(`brand.${piece.configKey}.background must be a 6-digit hex like #1C1C1E (got: ${piece.background}).`)
    }
    if (piece.padding == null) continue
    if (!Number.isFinite(piece.padding) || piece.padding < 0 || piece.padding > 40) {
      throw new Error(`brand.${piece.configKey}.padding must be a number between 0 and 40 (got: ${piece.padding}).`)
    }
  }
}
