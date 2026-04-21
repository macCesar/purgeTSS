/**
 * PurgeTSS - post-gen-notes
 *
 * Prints guidance after a successful branding run. Two modes:
 *   - default (compact): one-line per category + "Next steps" block
 *   - `--notes` (full):  adds brand color reminder, padding tips, and all
 *                         tiapp.xml snippets (iOS launch, Android launcher,
 *                         Android 12+ splash theme, FCM notification tint)
 *
 * @fileoverview Post-generation guidance output
 * @author César Estrada
 */

import chalk from 'chalk'
import { logger } from './branding-logger.js'

export function printPostGenNotes(opts) {
  if (opts.fullNotes) {
    printFullNotes(opts)
  } else {
    printCompactSummary(opts)
  }
}

function printCompactSummary(opts) {
  const { projectType, projectRoot, stagingRoot, bgColor, padding, iosPadding, inPlace } = opts

  logger.section('Summary')
  logger.bullet(`Background: ${chalk.cyan(bgColor)}`)
  logger.bullet(`Padding: Android ${chalk.cyan(padding + '%')} / iOS ${chalk.cyan(iosPadding + '%')}`)
  logger.bullet(`${inPlace ? 'Written in place to' : 'Staged at'}: ${chalk.cyan(inPlace ? projectRoot : stagingRoot)}`)

  logger.section('Next steps')
  if (inPlace) {
    logger.bullet(`Preview the new icons in ${chalk.yellow('Preview.app')}.`)
    logger.bullet(`If something looks wrong: ${chalk.gray('git checkout -- .')}`)
    logger.bullet(`Rebuild: ${chalk.gray('ti clean && ti build -p android -T emulator')}`)
  } else if (projectType === 'alloy') {
    logger.bullet(`Preview in ${chalk.yellow('Preview.app')}, then copy to project:`)
    console.log(chalk.gray(`      cp ${stagingRoot}/{DefaultIcon,DefaultIcon-ios,DefaultIcon-Dark,DefaultIcon-Tinted,iTunesConnect,MarketplaceArtwork}.png ${projectRoot}/`))
    console.log(chalk.gray(`      cp -R ${stagingRoot}/app/platform/android/res/. ${projectRoot}/app/platform/android/res/`))
    logger.bullet(`Cleanup staging: ${chalk.gray('rm -rf ' + stagingRoot)}`)
  } else if (projectType === 'classic') {
    logger.bullet(`Preview in ${chalk.yellow('Preview.app')}, then copy to project:`)
    console.log(chalk.gray(`      cp ${stagingRoot}/{DefaultIcon,DefaultIcon-ios,DefaultIcon-Dark,DefaultIcon-Tinted,iTunesConnect,MarketplaceArtwork}.png ${projectRoot}/`))
    console.log(chalk.gray(`      cp -R ${stagingRoot}/platform/android/res/. ${projectRoot}/platform/android/res/`))
    logger.bullet(`Cleanup staging: ${chalk.gray('rm -rf ' + stagingRoot)}`)
  } else {
    logger.bullet(`Review ${chalk.cyan(stagingRoot + '/')} and copy files to their final paths manually.`)
  }
  console.log()
  console.log(`Pass ${chalk.yellow('--notes')} to print tiapp.xml snippets + padding tuning guide.`)
  console.log()
}

function printFullNotes(opts) {
  const {
    projectType, projectRoot, stagingRoot,
    bgColor, padding, iosPadding, withSplash, withNotification, inPlace
  } = opts

  const code = (s) => chalk.gray(s)
  const flag = (s) => chalk.yellow(s)
  const num = (n) => chalk.cyan(n)

  logger.section('Notes on what was generated')
  logger.bullet(`Brand color ${chalk.cyan(bgColor)} was baked into Android adaptive background layer`)
  console.log('    and iOS/marketplace flattened masters (Apple rejects alpha).')
  logger.bullet(`Android padding:  ${chalk.cyan(padding + '%')}  (logo fills ${100 - 2 * padding}% of each mipmap canvas)`)
  logger.bullet(`iOS padding:      ${chalk.cyan(iosPadding + '%')}  (logo fills ${100 - 2 * iosPadding}% of DefaultIcon-ios and marketplace art)`)

  console.log()
  console.log('  If the logo looks cramped: re-run with higher padding')
  console.log(`      ${flag('--padding 25-30')}       (Android)`)
  console.log(`      ${flag('--ios-padding 10-14')}   (iOS)`)
  console.log()
  console.log('  If the logo looks too small: re-run with lower padding')
  console.log(`      ${flag('--padding 19')}          (Android spec floor)`)
  console.log(`      ${flag('--ios-padding 2-3')}     (matches first-party apps like Mail, Safari)`)

  logger.section('Configuration reminders')
  console.log('  The tool does NOT auto-edit tiapp.xml. Snippets below are optional —')
  console.log('  paste only what you need, after reviewing.')
  console.log()
  console.log(`  ${chalk.yellow('⚠')}  ${chalk.yellow('tiapp.xml <application> tag may be self-closing')}`)
  console.log('     If yours looks like:')
  console.log(code('         <application android:icon="@mipmap/ic_launcher" .../>'))
  console.log('     You must expand it BEFORE adding children:')
  console.log(code('         <application android:icon="@mipmap/ic_launcher" ...>'))
  console.log(code('         </application>'))

  console.log()
  console.log(`  ${num('1.')} ${chalk.cyan('iOS launch background')} — under ${flag('<ios>')} in tiapp.xml:`)
  console.log(code('      <ios>'))
  console.log(code('        <enable-launch-screen-storyboard>true</enable-launch-screen-storyboard>'))
  console.log(code(`        <default-background-color>${bgColor}</default-background-color>`))
  console.log(code('      </ios>'))

  console.log()
  console.log(`  ${num('2.')} ${chalk.cyan('Android launcher icon')} — under ${flag('<android><manifest><application>')}:`)
  console.log(code('      <application android:icon="@mipmap/ic_launcher"'))
  console.log(code('                   android:usesCleartextTraffic="false"/>'))

  if (withSplash) {
    console.log()
    console.log(`  ${num('3.')} ${chalk.cyan('Android 12+ splash screen')} — ${chalk.yellow('OPTIONAL, advanced')}`)
    console.log()
    console.log('     Titanium SDK 13.x shows a system splash automatically using your')
    console.log('     launcher icon. For most apps THE DEFAULT IS ENOUGH — do nothing.')
  }

  if (withNotification) {
    const colorsDir = projectType === 'classic'
      ? 'platform/android/res/values'
      : 'app/platform/android/res/values'

    console.log()
    console.log(`  ${num('4.')} ${chalk.cyan('FCM notification icon + tint')}`)
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
    console.log(`  ${num('3.')} Rebuild: ${code('ti clean && ti build -p android -T emulator')}`)
  } else {
    console.log(`  ${num('1.')} Preview the generated icons, then copy to project (see Summary).`)
    console.log(`  ${num('2.')} Cleanup staging: ${code('rm -rf ' + stagingRoot)}`)
    console.log(`  ${num('3.')} Rebuild: ${code('ti clean && ti build -p android -T emulator')}`)
  }
  console.log()
}
