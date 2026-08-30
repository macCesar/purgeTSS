/**
 * PurgeTSS - post-gen-notes
 *
 * Prints guidance after a successful branding run. Two modes:
 *   - default (compact): what was generated + "Next steps" block
 *   - `--notes` (full):  adds brand color reminder, padding tips, and platform
 *                         configuration snippets (iOS launch, Android launcher,
 *                         Android launch theme, FCM notification tint)
 *
 * Both modes read the list of pieces the run actually generated, so nothing
 * here has to be kept in sync by hand with the pipeline.
 *
 * @fileoverview Post-generation guidance output
 * @author César Estrada
 */

import chalk from 'chalk'
import { logger } from './branding-logger.js'

/** Pieces whose output lands at the staging/project root, in `cp` order. */
const ROOT_FILES = {
  icon: ['DefaultIcon', 'DefaultIcon-ios'],
  dark: ['DefaultIcon-Dark'],
  tinted: ['DefaultIcon-Tinted'],
  marketplace: ['iTunesConnect', 'MarketplaceArtwork'],
  'feature-graphic': ['MarketplaceArtworkFeature']
}

export function printPostGenNotes(opts) {
  const view = buildView(opts)

  if (opts.fullNotes) {
    printFullNotes(view)
  } else {
    printCompactSummary(view)
  }
}

/**
 * Everything the two printers need, derived from the resolved pieces so the
 * callers only pass what the run produced.
 */
function buildView(opts) {
  const pieces = opts.pieces ?? {}
  const generatedPieces = opts.generatedPieces ?? []
  const was = (name) => generatedPieces.includes(name)

  return {
    ...opts,
    pieces,
    generatedPieces,
    generatedDescriptions: opts.generatedDescriptions ?? {},
    generatedRootFiles: opts.generatedRootFiles,
    platformTargets: opts.platformTargets ?? { ios: true, android: true },
    was,
    androidAdaptivePadding: pieces.adaptive?.padding ?? 19,
    androidLegacyPadding: pieces['legacy-icon']?.padding ?? 10,
    iosPadding: pieces.icon?.padding ?? 0,
    withSplash: was('splash-icon'),
    withNotification: was('notification-icon'),
    withLaunchLogo: was('launch-logo'),
    withIosAssets: was('ios-splash') || was('launch-logo'),
    withAndroidAssets: was('appicon') || was('android-splash')
  }
}

/**
 * The `{A,B,C}.png` brace list for the root-level icons this run produced.
 * @returns {string|null} null when no root-level file was generated
 */
function rootFilesBrace(view) {
  const names = view.generatedRootFiles ?? view.generatedPieces.flatMap((name) => ROOT_FILES[name] ?? [])
  if (names.length === 0) return null
  return names.length === 1 ? `${names[0]}.png` : `{${names.join(',')}}.png`
}

function printCompactSummary(view) {
  const {
    projectType,
    projectRoot,
    stagingRoot,
    bgColor,
    pieces,
    generatedPieces,
    generatedDescriptions,
    platformTargets,
    inPlace
  } = view

  logger.section('Summary')
  logger.bullet(`Background: ${chalk.cyan(bgColor)}`)
  for (const name of generatedPieces) {
    logger.bullet(`${chalk.cyan(name)} — ${generatedDescriptions[name] ?? pieces[name]?.generates ?? ''}`)
  }
  logger.bullet(`${inPlace ? 'Written in place to' : 'Staged at'}: ${chalk.cyan(inPlace ? projectRoot : stagingRoot)}`)

  logger.section('Next steps')
  if (inPlace) {
    logger.bullet(`Preview the new icons in ${chalk.yellow('Preview.app')}.`)
    logger.bullet(`If something looks wrong: ${chalk.gray('git checkout -- .')}`)
    for (const { platform, command } of rebuildCommands(platformTargets)) {
      logger.bullet(`Rebuild ${platform}: ${chalk.gray(command)}`)
    }
  } else if (projectType === 'alloy' || projectType === 'classic') {
    const alloy = projectType === 'alloy'
    const resDir = alloy ? 'app/platform/android/res' : 'platform/android/res'
    const androidAssets = alloy ? 'app/assets/android' : 'Resources/android'
    const iosAssets = alloy ? 'app/assets/iphone' : 'Resources/iphone'
    const brace = rootFilesBrace(view)

    logger.bullet(`Preview in ${chalk.yellow('Preview.app')}, then copy to project:`)
    if (brace) console.log(chalk.gray(`      cp ${stagingRoot}/${brace} ${projectRoot}/`))
    if (platformTargets.android) console.log(chalk.gray(`      cp -R ${stagingRoot}/${resDir}/. ${projectRoot}/${resDir}/`))
    if (view.withAndroidAssets) console.log(chalk.gray(`      cp -R ${stagingRoot}/${androidAssets}/. ${projectRoot}/${androidAssets}/`))
    if (view.withIosAssets) console.log(chalk.gray(`      cp -R ${stagingRoot}/${iosAssets}/. ${projectRoot}/${iosAssets}/`))
    logger.bullet(`Cleanup staging: ${chalk.gray('rm -rf ' + stagingRoot)}`)
  } else {
    logger.bullet(`Review ${chalk.cyan(stagingRoot + '/')} and copy files to their final paths manually.`)
  }
  console.log()
  console.log(`Pass ${chalk.yellow('--notes')} to print platform launch/theme snippets + padding tuning guide.`)
  console.log()
}

function printFullNotes(view) {
  const {
    projectType, stagingRoot,
    bgColor, androidAdaptivePadding, androidLegacyPadding, iosPadding,
    withSplash, withNotification, withLaunchLogo, platformTargets, inPlace
  } = view

  const code = (s) => chalk.gray(s)
  const flag = (s) => chalk.yellow(s)
  const num = (n) => chalk.cyan(n)

  // The --notes blocks are numbered in the order they print, and which ones
  // print depends on what the run generated — so the counter walks with them.
  let step = 0
  const nextStep = () => num(`${++step}.`)

  const androidValuesDir = projectType === 'alloy'
    ? 'app/platform/android/res/values'
    : projectType === 'classic'
      ? 'platform/android/res/values'
      : '<android-res-root>/values'
  const legacySplashPath = projectType === 'classic'
    ? 'Resources/android/default.png'
    : 'app/assets/android/default.png'
  const iosAssetsDir = projectType === 'classic' ? 'Resources/iphone' : 'app/assets/iphone'

  logger.section('Notes on what was generated')
  logger.bullet(`Brand color ${chalk.cyan(bgColor)} was baked into Android adaptive background layer`)
  console.log('    and iOS/marketplace flattened masters (Apple rejects alpha).')
  console.log('    This color is inherited by pieces unless they override it; white is')
  console.log('    only the fallback, not a platform requirement.')
  logger.bullet(`Android adaptive padding: ${chalk.cyan(androidAdaptivePadding + '%')}  (logo fills ${100 - 2 * androidAdaptivePadding}% of each adaptive foreground canvas)`)
  logger.bullet(`Android legacy padding:   ${chalk.cyan(androidLegacyPadding + '%')}  (logo fills ${100 - 2 * androidLegacyPadding}% of each legacy launcher canvas)`)
  logger.bullet(`iOS padding:              ${chalk.cyan(iosPadding + '%')}  (logo fills ${100 - 2 * iosPadding}% of DefaultIcon-ios and marketplace art)`)

  console.log()
  console.log('  Padding is per piece and is never inherited: the adaptive floor')
  console.log('  answers to the Android safe-zone, while iOS/store icons default to')
  console.log('  full-bleed at 0%. One global value would break the launcher mask.')
  console.log('  Raise iOS padding only when the source is logo artwork that needs air;')
  console.log('  Android adaptive foregrounds still need their own safe-zone padding.')
  console.log()
  console.log('  If the logo looks cramped: re-run with higher padding')
  console.log(`      ${flag('--android-adaptive-padding 25-30')}   (adaptive icon)`)
  console.log(`      ${flag('--android-legacy-padding 14-18')}     (legacy icon)`)
  console.log(`      ${flag('--ios-padding 2-8')}                  (inset iOS/store logo artwork)`)
  console.log()
  console.log('  If the logo looks too small: re-run with lower padding')
  console.log(`      ${flag('--android-adaptive-padding 19')}      (adaptive spec floor)`)
  console.log(`      ${flag('--android-legacy-padding 8-12')}      (legacy icon)`)
  console.log(`      ${flag('--ios-padding 0')}                    (full-bleed finished iOS/store icon)`)

  logger.section('Configuration reminders')
  console.log('  The tool does NOT auto-edit tiapp.xml or Android theme resources.')
  console.log('  Snippets below are optional —')
  console.log('  paste only what you need, after reviewing.')
  console.log('  Android uses a dedicated theme for the launcher Activity below, so the')
  console.log('  app\'s existing <application> theme can stay unchanged.')
  console.log()
  console.log(`  ${chalk.yellow('⚠')}  ${chalk.yellow('tiapp.xml <application> tag may be self-closing')}`)
  console.log('     If yours looks like:')
  console.log(code('         <application android:icon="@mipmap/ic_launcher" .../>'))
  console.log('     You must expand it BEFORE adding children:')
  console.log(code('         <application android:icon="@mipmap/ic_launcher" ...>'))
  console.log(code('         </application>'))

  console.log()
  console.log(`  ${nextStep()} ${chalk.cyan('iOS launch background')} — under ${flag('<ios>')} in tiapp.xml:`)
  console.log(code('      <ios>'))
  console.log(code('        <enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>'))
  console.log(code(`        <default-background-color>${bgColor}</default-background-color>`))
  console.log(code('      </ios>'))

  if (withLaunchLogo) {
    console.log()
    console.log(`  ${nextStep()} ${chalk.cyan('iOS launch screen artwork')}`)
    console.log(`     Generated ${flag(iosAssetsDir + '/LaunchLogo.png')} (1024×1024 exactly).`)
    console.log('     Titanium resizes it into LaunchLogo.imageset on every iOS build,')
    console.log('     and prefers it over DefaultIcon.png — so the launch screen now')
    console.log('     shows the logotype instead of the padded app icon.')
    console.log('     Nothing to configure; the size must stay 1024×1024 or the SDK')
    console.log('     drops the file with a warning.')
  }

  console.log()
  console.log(`  ${nextStep()} ${chalk.cyan('Android launcher icon')} — under ${flag('<android><manifest><application>')}:`)
  console.log(code('      <application android:icon="@mipmap/ic_launcher"'))
  console.log(code('                   android:usesCleartextTraffic="false"/>'))

  console.log()
  console.log(`  ${nextStep()} ${chalk.cyan('Android launch background')} — create ${flag(androidValuesDir + '/splashscreen.xml')}:`)
  console.log('     Theme.Titanium is Titanium\'s launcher theme; Theme.AppDerived keeps')
  console.log('     the <application> theme in its inheritance chain.')
  console.log(code('       <?xml version="1.0" encoding="utf-8"?>'))
  console.log(code('       <resources>'))
  console.log(code(`         <color name="splashscreen_background">${bgColor}</color>`))
  console.log()
  console.log(code('         <style name="Theme.SplashScreen" parent="@style/Theme.Titanium">'))
  console.log(code('           <item name="android:windowSplashScreenBackground">@color/splashscreen_background</item>'))
  console.log(code('           <item name="android:windowBackground">@color/splashscreen_background</item>'))
  console.log(code('           <item name="android:colorBackground">@color/splashscreen_background</item>'))
  if (withSplash) {
    console.log(code('           <item name="android:windowSplashScreenAnimatedIcon">@drawable/splash_icon</item>'))
  }
  console.log(code('         </style>'))
  console.log(code('       </resources>'))
  console.log('     Keep this <resources> block in that file; Android resources cannot')
  console.log('     be declared inside tiapp.xml.')
  console.log()
  console.log('     Then keep the existing <application> theme and apply the new theme')
  console.log('     only to Titanium\'s launcher Activity in tiapp.xml:')
  console.log(code('       <application ...>'))
  console.log(code('         <activity android:name=".YourAppActivity"'))
  console.log(code('                   android:theme="@style/Theme.SplashScreen"/>'))
  console.log(code('       </application>'))
  console.log()
  console.log('     Theme.SplashScreen is a fixed, copy-ready resource name. To change')
  console.log('     the launch color later, edit only splashscreen_background above.')
  console.log('     The three theme attributes are separate consumers of that one color:')
  console.log('     Android 12+ splash, native launch window, and the background value')
  console.log('     referenced by Titanium\'s base splash theme.')
  console.log('     Replace .YourAppActivity with the project\'s real launcher Activity.')
  console.log('     If that Activity is already declared, add android:theme to the')
  console.log('     existing element; do not paste a duplicate declaration.')
  console.log('     If it already has a custom Activity theme, do not replace it blindly:')
  console.log('     inherit from that theme or merge the items into that launcher-only theme.')

  if (withSplash) {
    console.log()
    console.log(`  ${nextStep()} ${chalk.cyan('Android 12+ splash artwork')} — ${chalk.yellow('OPTIONAL, advanced')}`)
    console.log()
    console.log('     Generated files: @drawable/splash_icon.png across densities.')
    console.log('     The Theme.SplashScreen snippet above already points Android 12+')
    console.log('     to splash_icon instead of the default ic_launcher artwork.')
    console.log('     Android masks that icon into a circle, so a wide wordmark loses')
    console.log('     its corners — use a square mark for this piece.')
    console.log('     If you still see a brief flash during splash exit, the artifact may')
    console.log('     come from Titanium or the system splash transition rather than from')
    console.log('     the generated PNG assets themselves.')
  }

  if (view.was('android-splash')) {
    console.log()
    console.log(`  ${nextStep()} ${chalk.cyan('Android <12 splash')}`)
    console.log(`     Regenerated ${legacySplashPath} and the 11 per-qualifier`)
    console.log('     images/res-*/default.png that Titanium maps to drawable-*/background.png.')
    console.log('     The solid windowBackground above takes precedence on Android <12,')
    console.log('     so drop the windowBackground item if you want that artwork to show.')
  }

  if (withNotification) {
    const colorsDir = projectType === 'classic'
      ? 'platform/android/res/values'
      : 'app/platform/android/res/values'

    console.log()
    console.log(`  ${nextStep()} ${chalk.cyan('FCM notification icon + tint')}`)
    console.log('     Only needed if you use firebase.cloudmessaging for push.')
    console.log()
    console.log(`     Create ${flag(colorsDir + '/colors.xml')} (or merge):`)
    console.log(code('       <?xml version="1.0" encoding="utf-8"?>'))
    console.log(code('       <resources>'))
    console.log(code(`         <color name="notification_tint">${bgColor}</color>`))
    console.log(code('       </resources>'))
    console.log()
    console.log('     Then under <application> in tiapp.xml:')
    console.log(code('       <meta-data android:name="com.google.firebase.messaging.default_notification_icon"'))
    console.log(code('                  android:resource="@drawable/ic_stat_notify"/>'))
    console.log(code('       <meta-data android:name="com.google.firebase.messaging.default_notification_color"'))
    console.log(code('                  android:resource="@color/notification_tint"/>'))
  }

  logger.section('Next steps')
  if (inPlace) {
    console.log(`  ${num('1.')} Preview in ${flag('Preview.app')} — files were overwritten directly.`)
    console.log(`  ${num('2.')} If something looks wrong: ${code('git checkout -- .')}`)
  } else {
    console.log(`  ${num('1.')} Preview the generated icons, then copy to project (see Summary).`)
    console.log(`  ${num('2.')} Cleanup staging: ${code('rm -rf ' + stagingRoot)}`)
  }
  let next = 3
  for (const { platform, command } of rebuildCommands(platformTargets)) {
    console.log(`  ${num(next++ + '.')} Rebuild ${platform}: ${code(command)}`)
  }
  console.log()
}

function rebuildCommands(platformTargets) {
  const commands = []
  if (platformTargets.ios) {
    commands.push({ platform: 'iOS', command: 'ti clean && ti build -p ios -T simulator' })
  }
  if (platformTargets.android) {
    commands.push({ platform: 'Android', command: 'ti clean && ti build -p android -T emulator' })
  }
  return commands
}
