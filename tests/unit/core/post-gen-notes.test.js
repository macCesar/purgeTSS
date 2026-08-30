/**
 * Tests for the post-generation branding notes: the full --notes output and
 * the compact summary, both derived from the pieces a run generated.
 */

import assert from 'assert'

import { printPostGenNotes } from '../../../src/core/branding/post-gen-notes.js'
import { listDefaultPieceNames, BRAND_PIECES } from '../../../src/core/branding/pieces.js'

// eslint-disable-next-line no-control-regex
const ANSI = /\x1B\[[0-9;]*m/g

function captureConsole(fn) {
  const lines = []
  const original = console.log
  console.log = (...args) => { lines.push(args.join(' ')) }
  try {
    fn()
  } finally {
    console.log = original
  }
  return lines.join('\n').replace(ANSI, '')
}

/** Minimal stand-in for what resolveBrandConfig() hands to the printer. */
function pieceMap(overrides = {}) {
  const pieces = {}
  for (const piece of BRAND_PIECES) {
    pieces[piece.name] = {
      name: piece.name,
      configKey: piece.configKey,
      generates: piece.generates,
      section: piece.section,
      padding: piece.defaultPadding,
      background: '#0B1326',
      ...(overrides[piece.name] ?? {})
    }
  }
  return pieces
}

function notesFor(overrides = {}) {
  return captureConsole(() => printPostGenNotes({
    fullNotes: true,
    projectType: 'alloy',
    projectRoot: '/tmp/example',
    stagingRoot: '/tmp/example-stage',
    bgColor: '#0B1326',
    pieces: pieceMap(),
    generatedPieces: listDefaultPieceNames(),
    inPlace: true,
    ...overrides
  }))
}

function summaryFor(overrides = {}) {
  return notesFor({ fullNotes: false, ...overrides })
}

try {
  const notes = notesFor()

  assert.match(notes, /<default-background-color>#0B1326<\/default-background-color>/)
  assert.match(notes, /app\/platform\/android\/res\/values\/splashscreen\.xml/)
  assert.match(notes, /<color name="splashscreen_background">#0B1326<\/color>/)
  assert.match(notes, /<style name="Theme\.SplashScreen" parent="@style\/Theme\.Titanium">/)
  assert.match(notes, /Theme\.Titanium is Titanium's launcher theme/)
  assert.match(notes, /Theme\.AppDerived keeps/)
  assert.match(notes, /<item name="android:windowSplashScreenBackground">@color\/splashscreen_background<\/item>/)
  assert.match(notes, /<item name="android:windowBackground">@color\/splashscreen_background<\/item>/)
  assert.match(notes, /<item name="android:colorBackground">@color\/splashscreen_background<\/item>/)
  assert.match(notes, /<activity android:name="\.YourAppActivity"/)
  assert.match(notes, /android:theme="@style\/Theme\.SplashScreen"/)
  assert.match(notes, /fixed, copy-ready resource name/)
  assert.match(notes, /edit only splashscreen_background above/)
  assert.match(notes, /three theme attributes are separate consumers of that one color/)
  assert.match(notes, /referenced by Titanium's base splash theme/)
  assert.match(notes, /keep the existing <application> theme/i)
  assert.match(notes, /Android resources cannot\s+be declared inside tiapp\.xml/)
  assert.match(notes, /solid windowBackground above takes precedence on Android <12/)
  assert.match(notes, /Padding is per piece and is never inherited/)
  assert.doesNotMatch(notes, /@style\/YourExistingTheme/)
  assert.doesNotMatch(notes, /windowSplashScreenAnimatedIcon/)
  assert.doesNotMatch(notes, /LaunchLogo\.png/)

  // Numbering walks with the blocks that actually print.
  assert.match(notes, /1\. .*iOS launch background/)
  assert.match(notes, /2\. .*Android launcher icon/)
  assert.match(notes, /3\. .*Android launch background/)
  assert.match(notes, /4\. .*Android <12 splash/)
  assert.doesNotMatch(notes, /5\. /)

  const withSplash = notesFor({ generatedPieces: [...listDefaultPieceNames(), 'splash-icon'] })
  assert.match(withSplash, /<item name="android:windowSplashScreenAnimatedIcon">@drawable\/splash_icon<\/item>/)
  assert.match(withSplash, /snippet above already points Android 12\+/)
  assert.match(withSplash, /masks that icon into a circle/)
  assert.match(withSplash, /4\. .*Android 12\+ splash artwork/)
  assert.match(withSplash, /5\. .*Android <12 splash/)

  const withEverything = notesFor({ generatedPieces: [...listDefaultPieceNames(), 'launch-logo', 'splash-icon', 'notification-icon'] })
  assert.match(withEverything, /2\. .*iOS launch screen artwork/)
  assert.match(withEverything, /app\/assets\/iphone\/LaunchLogo\.png/)
  assert.match(withEverything, /1024×1024 exactly/)
  assert.match(withEverything, /7\. .*FCM notification icon \+ tint/)
  assert.match(withEverything, /default_notification_icon/)

  const classicNotes = notesFor({ projectType: 'classic' })
  assert.match(classicNotes, /platform\/android\/res\/values\/splashscreen\.xml/)
  assert.match(classicNotes, /Resources\/android\/default\.png/)

  // Nothing about the Android <12 splash when that piece was filtered out.
  const iosOnly = notesFor({ generatedPieces: ['icon', 'dark', 'tinted', 'ios-splash'] })
  assert.doesNotMatch(iosOnly, /Android <12 splash/)

  // ---- Compact summary ----------------------------------------------------

  const summary = summaryFor({ inPlace: false })
  assert.match(summary, /cp \/tmp\/example-stage\/\{DefaultIcon,DefaultIcon-ios,DefaultIcon-Dark,DefaultIcon-Tinted,iTunesConnect,MarketplaceArtwork,MarketplaceArtworkFeature\}\.png/)
  assert.match(summary, /cp -R \/tmp\/example-stage\/app\/platform\/android\/res\/\./)
  assert.match(summary, /cp -R \/tmp\/example-stage\/app\/assets\/android\/\./)
  assert.match(summary, /cp -R \/tmp\/example-stage\/app\/assets\/iphone\/\./)
  assert.match(summary, /assets\/iphone\/Default\*\.png × 16/, 'the summary lists what each piece generated')

  const summaryIconOnly = summaryFor({ inPlace: false, generatedPieces: ['icon'] })
  assert.match(summaryIconOnly, /cp \/tmp\/example-stage\/\{DefaultIcon,DefaultIcon-ios\}\.png/)
  assert.doesNotMatch(summaryIconOnly, /assets\/iphone/, 'no iOS assets copy line when nothing landed there')
  assert.doesNotMatch(summaryIconOnly, /assets\/android/)

  const summaryClassic = summaryFor({ inPlace: false, projectType: 'classic' })
  assert.match(summaryClassic, /cp -R \/tmp\/example-stage\/Resources\/android\/\./)
  assert.match(summaryClassic, /cp -R \/tmp\/example-stage\/Resources\/iphone\/\./)

  const summaryIosOnly = summaryFor({
    inPlace: false,
    platformTargets: { ios: true, android: false },
    generatedPieces: ['icon', 'dark', 'tinted', 'ios-splash', 'marketplace']
  })
  assert.doesNotMatch(summaryIosOnly, /platform\/android\/res/)

  const nextIosOnly = summaryFor({
    platformTargets: { ios: true, android: false },
    generatedPieces: ['icon', 'dark', 'tinted', 'ios-splash', 'marketplace']
  })
  assert.match(nextIosOnly, /Rebuild iOS:/)
  assert.doesNotMatch(nextIosOnly, /Rebuild Android:/)

  const nextAndroidOnly = summaryFor({
    platformTargets: { ios: false, android: true },
    generatedPieces: ['marketplace', 'feature-graphic', 'adaptive', 'legacy-icon', 'appicon', 'android-splash']
  })
  assert.match(nextAndroidOnly, /Rebuild Android:/)
  assert.doesNotMatch(nextAndroidOnly, /Rebuild iOS:/)

  console.log('All post-generation branding note tests passed!')
} catch (error) {
  console.error('Post-generation branding note test failed:', error.message)
  process.exit(1)
}
