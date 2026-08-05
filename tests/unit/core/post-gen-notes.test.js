/**
 * Tests for the full post-generation branding notes.
 */

import assert from 'assert'

import { printPostGenNotes } from '../../../src/core/branding/post-gen-notes.js'

function captureConsole(fn) {
  const lines = []
  const original = console.log
  console.log = (...args) => { lines.push(args.join(' ')) }
  try {
    fn()
  } finally {
    console.log = original
  }
  return lines.join('\n')
}

function fullNotes(overrides = {}) {
  return captureConsole(() => printPostGenNotes({
    fullNotes: true,
    projectType: 'alloy',
    projectRoot: '/tmp/example',
    stagingRoot: '/tmp/example-stage',
    bgColor: '#0B1326',
    androidAdaptivePadding: 19,
    androidLegacyPadding: 10,
    iosPadding: 4,
    withSplash: false,
    withNotification: false,
    inPlace: true,
    ...overrides
  }))
}

try {
  const notes = fullNotes()

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
  assert.doesNotMatch(notes, /@style\/YourExistingTheme/)
  assert.doesNotMatch(notes, /windowSplashScreenAnimatedIcon/)

  const splashNotes = fullNotes({ withSplash: true })
  assert.match(splashNotes, /<item name="android:windowSplashScreenAnimatedIcon">@drawable\/splash_icon<\/item>/)
  assert.match(splashNotes, /snippet above already points Android 12\+/)

  const classicNotes = fullNotes({ projectType: 'classic' })
  assert.match(classicNotes, /platform\/android\/res\/values\/splashscreen\.xml/)
  assert.match(classicNotes, /Resources\/android\/default\.png/)

  console.log('All post-generation branding note tests passed!')
} catch (error) {
  console.error('Post-generation branding note test failed:', error.message)
  process.exit(1)
}
