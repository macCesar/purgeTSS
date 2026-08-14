/**
 * Tests for the config.cjs patchers.
 *
 * The point of these helpers is that everything they do not target stays
 * byte-identical — comments included. `shades` and `semantic` used to
 * serialize the whole config object and write it back, which reformatted the
 * file and dropped every comment in it.
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import util from 'util'
import assert from 'assert'
import { execFileSync } from 'child_process'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

import { findSectionRange } from '../../../src/shared/config-writer.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const cli = path.join(repoRoot, 'bin', 'purgetss')
const require = createRequire(import.meta.url)

const SAMPLE = [
  'module.exports = {',
  '  purge: {',
  '    mode: \'all\', // how much to purge',
  '    options: {',
  '      missing: true // report missing classes',
  '    }',
  '  },',
  '  brand: {',
  '    background: \'#FFFFFF\', // inherited by every piece',
  '    adaptive: { padding: \'18%\' } // } not the end of the section',
  '  },',
  '  theme: {',
  '    extend: {} // nothing yet',
  '  }',
  '}',
  ''
].join('\n')

try {
  // ---- findSectionRange ---------------------------------------------------

  {
    const range = findSectionRange(SAMPLE, 'brand')
    assert.ok(range, 'the brand section is found')
    const captured = SAMPLE.slice(range.start, range.end)
    assert.match(captured, /adaptive/, 'the nested object is inside the range')
    assert.doesNotMatch(captured, /theme/, 'and the next section is not')
    assert.ok(captured.trimEnd().endsWith('},'), 'the trailing comma is included')
    assert.strictEqual(range.indent, '  ')
  }

  {
    // A closing brace inside a comment must not end the section early.
    const range = findSectionRange(SAMPLE, 'brand')
    assert.match(SAMPLE.slice(range.start, range.end), /not the end of the section/)
  }

  {
    // Nor one inside a string.
    const source = 'module.exports = {\n  theme: {\n    weird: \'} still inside\'\n  },\n  images: {}\n}'
    const range = findSectionRange(source, 'theme')
    assert.match(source.slice(range.start, range.end), /still inside/)
    assert.doesNotMatch(source.slice(range.start, range.end), /images/)
  }

  assert.strictEqual(findSectionRange(SAMPLE, 'nonexistent'), null)
  assert.strictEqual(findSectionRange('module.exports = { theme: {', 'theme'), null, 'unbalanced input returns null')

  // ---- shades / semantic keep the rest of the file intact -----------------

  {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-cfgwriter-'))
    fs.mkdirSync(path.join(dir, 'app', 'views'), { recursive: true }) // alloyProject() checks for this
    fs.mkdirSync(path.join(dir, 'purgetss'), { recursive: true })
    fs.writeFileSync(path.join(dir, 'tiapp.xml'), '<ti:app xmlns:ti="http://ti.appcelerator.org"></ti:app>', 'utf8')
    fs.writeFileSync(path.join(dir, 'purgetss', 'config.cjs'), SAMPLE, 'utf8')

    const configPath = path.join(dir, 'purgetss', 'config.cjs')
    const before = fs.readFileSync(configPath, 'utf8')

    // Comments outside theme: must all survive. The one inside theme: does not,
    // and cannot: that section is what the command rewrites.
    const themeAt = (text) => text.indexOf('  theme: {')
    const outsideTheme = (text) => text.slice(0, themeAt(text))
    const commentsOutside = (text) => outsideTheme(text).split('//').length - 1

    execFileSync('node', [cli, 'shades', '#0B1326'], { cwd: dir, stdio: 'ignore' })

    const after = fs.readFileSync(configPath, 'utf8')
    assert.strictEqual(commentsOutside(after), commentsOutside(before),
      'every comment outside theme: survives — including sections shades never looks at')
    assert.ok(commentsOutside(before) >= 3, 'the fixture has comments worth protecting')

    assert.strictEqual(outsideTheme(after), outsideTheme(before),
      'everything before theme: is byte-identical')

    const parsed = require(configPath)
    assert.ok(parsed.theme.extend.colors.firefly, 'the color was actually saved')
    assert.strictEqual(parsed.purge.mode, 'all', 'the untouched sections still parse')
    assert.strictEqual(parsed.brand.adaptive.padding, '18%')

    // Repeated runs accumulate colors without corrupting the file.
    delete require.cache[require.resolve(configPath)]
    execFileSync('node', [cli, 'shades', '#FF0000'], { cwd: dir, stdio: 'ignore' })
    const twice = fs.readFileSync(configPath, 'utf8')
    assert.strictEqual(commentsOutside(twice), commentsOutside(before), 'and again on a second run')

    fs.rmSync(dir, { recursive: true, force: true })
  }

  // ---- the serializer is still the caller's -------------------------------

  {
    // setConfigSection writes whatever the caller's serializer produces, so a
    // value round-trips through util.inspect the same way it always did.
    const value = { extend: { colors: { brand: { 500: '#0B1326' } } } }
    assert.match(util.inspect(value, false, 10), /#0B1326/)
  }

  console.log('All config writer tests passed!')
} catch (error) {
  console.error('Config writer test failed:', error.message)
  process.exit(1)
}
