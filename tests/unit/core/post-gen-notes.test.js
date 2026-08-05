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
  assert.match(notes, /<item name="android:windowSplashScreenBackground">#0B1326<\/item>/)
  assert.match(notes, /<item name="android:windowBackground">#0B1326<\/item>/)
  assert.doesNotMatch(notes, /windowSplashScreenAnimatedIcon/)

  const splashNotes = fullNotes({ withSplash: true })
  assert.match(splashNotes, /windowSplashScreenAnimatedIcon/)

  console.log('All post-generation branding note tests passed!')
} catch (error) {
  console.error('Post-generation branding note test failed:', error.message)
  process.exit(1)
}
