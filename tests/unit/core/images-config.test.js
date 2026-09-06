/**
 * Tests for the images: section validator:
 *   - unknown keys abort instead of being ignored
 *   - files[] entries are checked one by one
 *   - the block ensure-images-section.js writes passes its own validator
 *
 * The last check is the control: a whitelist that drifted away from the shipped
 * template would reject a config PurgeTSS itself generated.
 */

import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { assertKnownImagesKeys, IMAGES_KEYS, IMAGES_FILE_KEYS } from '../../../src/core/images/images-config.js'
import { IMAGES_BLOCK } from '../../../src/core/images/ensure-images-section.js'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

try {
  // ---- Valid shapes -------------------------------------------------------

  assert.doesNotThrow(() => assertKnownImagesKeys({}), 'an empty section is valid')
  assert.doesNotThrow(() => assertKnownImagesKeys({}, undefined), 'no config at all is valid')

  assert.doesNotThrow(() => assertKnownImagesKeys({
    quality: 100,
    format: 'webp',
    autoSync: true,
    confirmOverwrites: false,
    files: [
      { filename: 'images/logos/logo.svg', width: 256 },
      { filename: 'images/buttons/hero.svg', width: 512, height: 128 }
    ]
  }), 'every documented key is accepted')

  // ---- Unknown top-level keys --------------------------------------------

  assert.throws(() => assertKnownImagesKeys({ qualty: 95 }), /images\.qualty/, 'a typo in quality is caught')
  assert.throws(() => assertKnownImagesKeys({ width: 256 }), /images\.width/, 'width is not a section key — the source pixels decide it')
  assert.throws(() => assertKnownImagesKeys({ opacity: 40 }), /images\.opacity/)
  assert.throws(() => assertKnownImagesKeys({ padding: 15 }), /images\.padding/)
  assert.throws(() => assertKnownImagesKeys({ output: 'logos/loading' }), /images\.output/)
  assert.throws(() => assertKnownImagesKeys({ android: true }), /images\.android/, 'platforms come from tiapp.xml')
  assert.throws(() => assertKnownImagesKeys({ dryRun: true }), /images\.dryRun/)

  // ---- files[] ------------------------------------------------------------

  assert.throws(() => assertKnownImagesKeys({ files: {} }), /images\.files \(expected an array/)
  assert.throws(() => assertKnownImagesKeys({ files: ['images/logo.svg'] }), /images\.files\[0\] \(expected an object/)
  assert.throws(() => assertKnownImagesKeys({ files: [{ filename: 'images/a.svg', widht: 256 }] }), /images\.files\[0\]\.widht/)
  assert.throws(() => assertKnownImagesKeys({ files: [{ width: 256 }] }), /images\.files\[0\]\.filename \(required/, 'an entry with no filename matches nothing')
  assert.throws(
    () => assertKnownImagesKeys({ files: [{ filename: 'images/a.svg' }, { filename: 'images/b.svg', scale: 2 }] }),
    /images\.files\[1\]\.scale/,
    'the reported index points at the offending entry'
  )

  // ---- Error message ------------------------------------------------------

  assert.throws(() => assertKnownImagesKeys({ nonsense: 1 }), /Top-level keys: quality, format, autoSync, confirmOverwrites, files/, 'the error lists what is valid')
  assert.throws(() => assertKnownImagesKeys({ nonsense: 1 }), /Inside files\[\]: filename, width, height/)
  assert.throws(() => assertKnownImagesKeys({ nonsense: 1 }), /No images were generated/)

  {
    let message = ''
    try {
      assertKnownImagesKeys({ qualty: 95, formatt: 'webp' })
    } catch (error) {
      message = error.message
    }
    assert.ok(/images\.qualty/.test(message) && /images\.formatt/.test(message), 'every problem is reported at once, not one per run')
  }

  // ---- Control: both shipped copies validate against the whitelist ---------

  // The block lives in two places: ensure-images-section.js patches an existing
  // config, lib/templates/purgetss.config.js.cjs seeds a new one via `init`.
  // Updating one and forgetting the other is the failure this checks for.
  const initTemplate = fs.readFileSync(
    path.join(REPO_ROOT, 'lib', 'templates', 'purgetss.config.js.cjs'),
    'utf8'
  )
  const initBlockMatch = initTemplate.match(/(^ {2}\/\/ Sources in purgetss[\s\S]*?^ {2}images: \{[\s\S]*?^ {2}\},)/m)
  assert.ok(initBlockMatch, 'the init template still carries an images: block with its header comment')

  for (const [name, block] of [['ensure-images-section', IMAGES_BLOCK], ['init template', initBlockMatch[1]]]) {
    const body = block.replace(/,\s*$/, '')
    const section = new Function(`return { ${body} }`)().images

    assert.doesNotThrow(() => assertKnownImagesKeys(section), `${name}: the block passes validation`)
    assert.deepStrictEqual(Object.keys(section).sort(), [...IMAGES_KEYS].sort(), `${name}: block and whitelist declare the same keys`)
    assert.strictEqual(section.quality, 85, `${name}: quality default`)
    assert.strictEqual(section.format, null, `${name}: format default`)
    assert.strictEqual(section.autoSync, true, `${name}: autoSync default`)
    assert.strictEqual(section.confirmOverwrites, true, `${name}: confirmOverwrites default`)
    assert.deepStrictEqual(section.files, [], `${name}: files default`)

    assert.ok(/4x masters/.test(block), `${name}: documents the 4x master convention`)
    assert.ok(/256 \(mdpi\/@1x\)/.test(block), `${name}: with a worked example, which is what the width question needs`)
    assert.ok(/no width to configure/.test(block), `${name}: says outright there is no width key`)
    assert.ok(/PNG and GIF ignore it/.test(block), `${name}: quality states the formats it does not reach`)
  }

  assert.strictEqual(
    initBlockMatch[1].replace(/\s+/g, ' ').trim(),
    IMAGES_BLOCK.replace(/\s+/g, ' ').trim(),
    'both copies of the block are identical'
  )

  assert.ok(IMAGES_FILE_KEYS.includes('filename'), 'filename identifies an entry')

  console.log('All images config validation tests passed!')
} catch (error) {
  console.error('Images config validation test failed:', error.message)
  process.exit(1)
}
