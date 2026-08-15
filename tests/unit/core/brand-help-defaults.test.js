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
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'

import { getPieceByConfigKey } from '../../../src/core/branding/pieces.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BIN = path.resolve(__dirname, '../../../bin/purgetss')

// flag as printed by commander → the piece whose defaultPadding it sets
const FLAG_TO_PIECE = {
  '--android-adaptive-padding': 'adaptive',
  '--android-legacy-padding': 'legacyIcon',
  '--ios-padding': 'icon',
  '--feature-graphic-padding': 'featureGraphic',
  '--launch-logo-padding': 'launchLogo',
  '--android-splash-padding': 'androidSplash',
  '--ios-splash-padding': 'iosSplash'
}

// The two shortcuts fan out to several pieces and carry no default of their own.
const SHORTCUTS = ['--padding', '--splash-padding']

try {
  const help = execFileSync(process.execPath, [BIN, 'brand', '--help'], {
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' }
  })

  for (const [flag, configKey] of Object.entries(FLAG_TO_PIECE)) {
    const line = help.split('\n').find((l) => l.includes(`${flag} <n>`))
    assert.ok(line, `${flag} is missing from brand --help`)

    // Not anchored to an opening paren: --ios-padding reads "(typical 2-6, default: 4)".
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

  console.log(`All brand --help default tests passed! (${Object.keys(FLAG_TO_PIECE).length} flags checked against the piece table)`)
} catch (error) {
  console.error('Brand --help default test failed:', error.message)
  process.exit(1)
}
