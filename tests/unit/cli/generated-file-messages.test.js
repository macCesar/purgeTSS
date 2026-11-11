import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-write-messages-'))
const bin = path.resolve('bin/purgetss')
const run = args => {
  const result = spawnSync(process.execPath, [bin, ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, NO_UPDATE_NOTIFIER: '1', FORCE_COLOR: '0' } })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return result.stdout
}
try {
  for (const dir of ['app/views', 'app/controllers', 'app/styles', 'purgetss/fonts']) fs.mkdirSync(path.join(root, dir), { recursive: true })
  fs.writeFileSync(path.join(root, 'app/views/index.xml'), '<Alloy><Window class="bg-red-500" /></Alloy>')
  const config = path.join(root, 'purgetss/config.cjs')
  fs.writeFileSync(config, 'module.exports = { theme: {} }')
  assert.match(run(['b']), /utilities\.tss file created!/)
  const utilities = path.join(root, 'purgetss/styles/utilities.tss')
  const definitions = path.join(root, 'purgetss/styles/definitions.css')
  const before = [utilities, definitions].map(file => fs.statSync(file).mtimeMs)
  const unchanged = run(['b'])
  assert.match(unchanged, /utilities\.tss unchanged \(not written\)/)
  assert.match(unchanged, /definitions\.css unchanged \(not written\)/)
  assert.doesNotMatch(unchanged, /file created!/)
  assert.deepEqual([utilities, definitions].map(file => fs.statSync(file).mtimeMs), before)
  fs.writeFileSync(config, 'module.exports = { theme: { extend: { colors: { test: "#123456" } } } }')
  assert.match(run(['b']), /utilities\.tss file updated!/)
  fs.unlinkSync(utilities)
  assert.match(run(['b']), /utilities\.tss file created!/)
  fs.writeFileSync(path.join(root, 'purgetss/fonts/test.css'), '@font-face { font-family: Test; src: url(test.ttf); } .ti-home:before { content: "\\e001"; } .ti-star:before { content: "\\e002"; }')
  assert.match(run(['bf', '-m']), /fonts\.tss file created!/)
  const fonts = path.join(root, 'purgetss/styles/fonts.tss')
  const fontMtime = fs.statSync(fonts).mtimeMs
  const repeatedFonts = run(['bf', '-m'])
  assert.match(repeatedFonts, /fonts\.tss unchanged \(not written\)/)
  assert.match(repeatedFonts, /purgetss\.fonts\.js unchanged \(not written\)/)
  assert.equal(fs.statSync(fonts).mtimeMs, fontMtime)
  fs.unlinkSync(path.join(root, 'purgetss/.cache/generator-signature.json'))
  const missing = run([])
  assert.match(missing, /Generator signature missing; rebuilding utilities\.tss/)
  assert.doesNotMatch(missing, /config\.js file changed/)
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('Generated-file messages match writes and signature initialization')
