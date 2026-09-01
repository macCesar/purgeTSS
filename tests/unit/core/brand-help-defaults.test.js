/**
 * Guards the padding defaults printed by `purgetss brand --help` against the
 * piece table that actually drives the pipeline.
 *
 * They were two hand-written copies of the same numbers until 7.13.2, and they
 * disagreed: 7.13.0 moved the adaptive default 19 → 18 and settled the splash
 * defaults at 26, but `bin/purgetss` kept advertising 19 and 20. Anyone reading
 * the help got the wrong number, and the CHANGELOG entry for that very release
 * carried the stale 20 as well.
 *
 * The help strings are interpolated from the table now, so this test is what
 * catches a regression if a literal is ever typed back in.
 */

import assert from 'assert'
import path from 'path'
import { execFileSync, spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

import { DEFAULT_ARTWORK_CORNER_RADIUS, getPieceByConfigKey } from '../../../src/core/branding/pieces.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BIN = path.resolve(__dirname, '../../../bin/purgetss')

// flag as printed by commander → the piece whose defaultPadding it sets
const FLAG_TO_PIECE = {
  '--android-adaptive-padding': 'adaptive',
  '--android-legacy-padding': 'legacyIcon',
  '--appicon-padding': 'appicon',
  '--ios-padding': 'icon',
  '--feature-graphic-padding': 'featureGraphic',
  '--launch-logo-padding': 'launchLogo',
  '--android-splash-padding': 'androidSplash',
  '--ios-splash-padding': 'iosSplash'
}

// The two shortcuts fan out to several pieces and carry no default of their own.
const SHORTCUTS = ['--padding', '--splash-padding']
const CORNER_RADIUS_FLAGS = [
  '--artwork-corner-radius',
  '--splash-corner-radius',
  '--ios-splash-corner-radius',
  '--android-splash-corner-radius',
  '--feature-graphic-corner-radius',
  '--launch-logo-corner-radius'
]

try {
  const help = execFileSync(process.execPath, [BIN, 'brand', '--help'], {
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' }
  })

  for (const [flag, configKey] of Object.entries(FLAG_TO_PIECE)) {
    const line = help.split('\n').find((l) => l.includes(`${flag} <n>`))
    assert.ok(line, `${flag} is missing from brand --help`)

    // Not anchored to an opening paren: descriptions may contain other text.
    const match = line.match(/default: (\d+)\)/)
    assert.ok(match, `${flag} does not state a default: ${line.trim()}`)

    const expected = getPieceByConfigKey(configKey).defaultPadding
    assert.strictEqual(Number(match[1]), expected, `${flag} says ${match[1]}, piece table says ${expected}`)
  }

  // A padding flag added later without a row above would slip through the loop.
  const advertised = help
    .split('\n')
    .filter((l) => /^\s+--[a-z-]+-padding <n>/.test(l))
    .map((l) => l.trim().split(/\s+/)[0])

  const covered = [...Object.keys(FLAG_TO_PIECE), ...SHORTCUTS]
  for (const flag of advertised) {
    assert.ok(covered.includes(flag), `${flag} is not covered by this test — add it to FLAG_TO_PIECE`)
  }

  for (const flag of CORNER_RADIUS_FLAGS) {
    const line = help.split('\n').find((l) => l.includes(`${flag} <n>`))
    assert.ok(line, `${flag} is missing from brand --help`)
    assert.match(line, new RegExp(`default: ${DEFAULT_ARTWORK_CORNER_RADIUS}\\)`), `${flag} must advertise the canonical default`)
  }

  const advertisedCornerRadius = help
    .split('\n')
    .filter((line) => /^\s+--[a-z-]+-corner-radius <n>/.test(line))
    .map((line) => line.trim().split(/\s+/)[0])
  assert.deepStrictEqual(advertisedCornerRadius.sort(), [...CORNER_RADIUS_FLAGS].sort(), 'every corner-radius flag is covered')

  for (const value of ['-1', '51', '2.5', 'round']) {
    const result = spawnSync(process.execPath, [BIN, 'brand', '--splash-corner-radius', value], {
      encoding: 'utf8',
      env: { ...process.env, NO_UPDATE_NOTIFIER: '1' }
    })
    assert.notStrictEqual(result.status, 0, `--splash-corner-radius ${value} must fail`)
    assert.match(`${result.stdout}${result.stderr}`, /must be an integer between 0 and 50/)
  }

  console.log(`All brand --help default tests passed! (${Object.keys(FLAG_TO_PIECE).length} padding flags + ${CORNER_RADIUS_FLAGS.length} radius flags checked)`)
} catch (error) {
  console.error('Brand --help default test failed:', error.message)
  process.exit(1)
}
