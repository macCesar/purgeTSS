/**
 * Unit tests for src/core/svg/sync-images.js
 *
 * Regression coverage for the section-boundary detection bug: when
 * `images: { ... }` was written on a single line, the lazy-regex variant of
 * matchImagesSection() walked past the real closing `}` and treated the first
 * nested block's `}` as the section terminator, dropping `files: []` inside an
 * unrelated object (in one report, `theme.extend.colors.wheel`).
 *
 * These tests assert the upsert lands inside `images.files` regardless of how
 * the user formatted the `images` section.
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { createRequire } from 'module'

process.stdout.on('error', err => { if (err.code === 'EPIPE') process.exit(0) })
process.stderr.on('error', err => { if (err.code === 'EPIPE') process.exit(0) })

console.log('🧪 Testing sync-images.js (config.cjs upsert)...')

const require = createRequire(import.meta.url)
const originalCwd = process.cwd()

// projectsConfigJS in src/shared/constants.js is captured at module load time
// from process.cwd(). To keep that path stable across tests we set up a single
// tmpdir, chdir into it, and only rewrite config.cjs between tests.
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-sync-images-'))
fs.mkdirSync(path.join(tmpRoot, 'purgetss'), { recursive: true })
process.chdir(tmpRoot)

const configPath = path.join(tmpRoot, 'purgetss', 'config.cjs')

function writeConfig(body) {
  fs.writeFileSync(configPath, body)
}

function loadConfig() {
  const resolved = require.resolve(configPath)
  delete require.cache[resolved]
  return require(configPath)
}

// syncConfigImages is the public API; we exercise it directly.
const { syncConfigImages } = await import('../../../src/core/svg/sync-images.js')

let passed = 0
let failed = 0
const failures = []

async function test(name, fn) {
  try {
    await fn()
    passed++
    console.log(`✅ ${name}`)
  } catch (e) {
    failed++
    failures.push({ name, error: e })
    console.log(`❌ ${name}`)
    console.log(`   ${e.message}`)
  }
}

// ── Regression: one-liner `images:` section ───────────────────────────────
await test('one-liner images section: inserts files at correct level', async () => {
  writeConfig(`module.exports = {
  images: { quality: 85, format: null, confirmOverwrites: true },
  theme: {
    extend: {
      colors: {
        wheel: {
          color1: { shade500: '#ef4444' },
          color2: { shade500: '#f97316' }
        }
      }
    }
  }
}
`)
  const derived = new Map([['logos/logo.svg', { widthDp: 160, heightDp: null }]])
  const { stats } = syncConfigImages(derived)

  if (stats.inserted !== 1) throw new Error(`expected 1 inserted, got ${stats.inserted}`)

  const cfg = loadConfig()
  if (!cfg.images || !Array.isArray(cfg.images.files)) {
    throw new Error('cfg.images.files is missing — entry landed somewhere else')
  }
  if (cfg.images.files.length !== 1) {
    throw new Error(`expected 1 entry in images.files, got ${cfg.images.files.length}`)
  }
  if (cfg.images.files[0].filename !== 'images/logos/logo.svg') {
    throw new Error(`unexpected filename: ${cfg.images.files[0].filename}`)
  }
  if (cfg.images.files[0].width !== 160) {
    throw new Error(`unexpected width: ${cfg.images.files[0].width}`)
  }
  if (cfg.theme.extend.colors.wheel.files !== undefined) {
    throw new Error('files leaked into theme.extend.colors.wheel — regression of the original bug')
  }
})

// ── Control: multi-line `images:` section (must still work) ───────────────
await test('multi-line images section: inserts files at correct level', async () => {
  writeConfig(`module.exports = {
  images: {
    quality: 85,
    format: null,
    confirmOverwrites: true,
    autoSync: true,
    files: []
  },
  theme: { extend: {} }
}
`)
  const derived = new Map([['logos/logo.svg', { widthDp: 128, heightDp: null }]])
  const { stats } = syncConfigImages(derived)

  if (stats.inserted !== 1) throw new Error(`expected 1 inserted, got ${stats.inserted}`)

  const cfg = loadConfig()
  if (cfg.images.files.length !== 1) {
    throw new Error(`expected 1 entry, got ${cfg.images.files.length}`)
  }
  if (cfg.images.files[0].width !== 128) {
    throw new Error(`unexpected width: ${cfg.images.files[0].width}`)
  }
})

// ── Policy: autoSync ON mirrors the current run (no cross-run max) ────────
await test('existing entry: width is overwritten when derived is larger', async () => {
  writeConfig(`module.exports = {
  images: {
    quality: 85,
    files: [
      { filename: 'images/logos/logo.svg', width: 128 }
    ]
  }
}
`)
  const derived = new Map([['logos/logo.svg', { widthDp: 200, heightDp: null }]])
  const { stats } = syncConfigImages(derived)

  if (stats.updated !== 1) throw new Error(`expected 1 updated, got ${stats.updated}`)
  const cfg = loadConfig()
  if (cfg.images.files[0].width !== 200) {
    throw new Error(`width should be 200, got ${cfg.images.files[0].width}`)
  }
})

await test('existing entry: width is overwritten when derived is SMALLER (shrink)', async () => {
  // Regression: user shrinks class from h-52 (208) to h-16 (64). Old max()
  // policy would freeze the entry at 208; the new policy follows the cascade.
  writeConfig(`module.exports = {
  images: {
    files: [
      { filename: 'images/logos/logo.svg', width: 208 }
    ]
  }
}
`)
  const derived = new Map([['logos/logo.svg', { widthDp: 64, heightDp: null }]])
  const { stats } = syncConfigImages(derived)

  if (stats.updated !== 1) throw new Error(`expected 1 updated, got ${stats.updated}`)
  const cfg = loadConfig()
  if (cfg.images.files[0].width !== 64) {
    throw new Error(`width should shrink to 64, got ${cfg.images.files[0].width}`)
  }
})

await test('untouched run: config mtime is not bumped (no gratuitous write)', async () => {
  writeConfig(`module.exports = {
  images: {
    files: [
      { filename: 'images/logos/logo.svg', width: 200 }
    ]
  }
}
`)
  // Pin a known-old mtime so even nanosecond-precision filesystems detect a bump.
  const past = new Date(Date.now() - 60_000)
  fs.utimesSync(configPath, past, past)
  const before = fs.statSync(configPath).mtimeMs

  const derived = new Map([['logos/logo.svg', { widthDp: 200, heightDp: null }]])
  const { stats } = syncConfigImages(derived)

  if (stats.untouched !== 1) throw new Error(`expected 1 untouched, got ${JSON.stringify(stats)}`)
  const after = fs.statSync(configPath).mtimeMs
  if (after !== before) {
    throw new Error(`config mtime changed (${before} → ${after}); expected no write on untouched`)
  }
})

await test('autoSync OFF (write=false): config file is left untouched', async () => {
  const initial = `module.exports = {
  images: {
    files: [
      { filename: 'images/logos/logo.svg', width: 1024 }
    ]
  }
}
`
  writeConfig(initial)
  const derived = new Map([['logos/logo.svg', { widthDp: 128, heightDp: null }]])
  const { effective } = syncConfigImages(derived, { write: false })

  const actual = require('fs').readFileSync(configPath, 'utf8')
  if (actual !== initial) {
    throw new Error('config.cjs should not be modified when write=false')
  }
  // Effective map still reflects derived so the generator runs at the new size.
  if (effective.get('logos/logo.svg').widthDp !== 128) {
    throw new Error('effective.widthDp should reflect derived value, not config')
  }
})

// ── Auto-derived dimensions: heightDp/widthDp null ────────────────────────
await test('auto-height: no height written when heightDp is null on insert', async () => {
  writeConfig(`module.exports = {
  images: {
    files: []
  }
}
`)
  const derived = new Map([['logos/logo.svg', { widthDp: 160, heightDp: null }]])
  syncConfigImages(derived)

  const cfg = loadConfig()
  if (cfg.images.files[0].height !== undefined) {
    throw new Error(`height should be absent on insert when heightDp is null, got ${cfg.images.files[0].height}`)
  }
})

await test('auto-derived: existing dimension is dropped when cascade no longer pins it', async () => {
  // User removes h-* from the view. New policy: config follows the views,
  // so the height field disappears (rather than freezing the previous value).
  writeConfig(`module.exports = {
  images: {
    files: [
      { filename: 'images/logos/logo.svg', width: 128, height: 1024 }
    ]
  }
}
`)
  const derived = new Map([['logos/logo.svg', { widthDp: 200, heightDp: null }]])
  const { stats } = syncConfigImages(derived)

  if (stats.updated !== 1) throw new Error(`expected 1 updated, got ${stats.updated}`)
  const cfg = loadConfig()
  if (cfg.images.files[0].width !== 200) {
    throw new Error(`width should be 200, got ${cfg.images.files[0].width}`)
  }
  if (cfg.images.files[0].height !== undefined) {
    throw new Error(`height should be dropped (no h-* in cascade), got ${cfg.images.files[0].height}`)
  }
})

// ── Symmetric: height-only support (widthDp=null) ─────────────────────────
await test('height-only insert: only height written, no width field', async () => {
  writeConfig(`module.exports = {
  images: {
    files: []
  }
}
`)
  const derived = new Map([['logos/logo.svg', { widthDp: null, heightDp: 176 }]])
  syncConfigImages(derived)

  const cfg = loadConfig()
  if (cfg.images.files[0].height !== 176) {
    throw new Error(`height should be 176, got ${cfg.images.files[0].height}`)
  }
  if (cfg.images.files[0].width !== undefined) {
    throw new Error(`width should be absent for height-only insert, got ${cfg.images.files[0].width}`)
  }
})

await test('height-only update: drops stale width when cascade no longer pins it', async () => {
  // User changes class from `w-(1024)` to plain `h-50` (no w-*). New policy:
  // width disappears so generator derives it from viewBox.
  writeConfig(`module.exports = {
  images: {
    files: [
      { filename: 'images/logos/logo.svg', width: 1024 }
    ]
  }
}
`)
  const derived = new Map([['logos/logo.svg', { widthDp: null, heightDp: 200 }]])
  const { stats } = syncConfigImages(derived)

  if (stats.updated !== 1) throw new Error(`expected 1 updated, got ${stats.updated}`)
  const cfg = loadConfig()
  if (cfg.images.files[0].width !== undefined) {
    throw new Error(`width should be dropped (no w-* in cascade), got ${cfg.images.files[0].width}`)
  }
  if (cfg.images.files[0].height !== 200) {
    throw new Error(`height should be 200, got ${cfg.images.files[0].height}`)
  }
})

await test('numeric height: explicit h-* overwrites existing height', async () => {
  writeConfig(`module.exports = {
  images: {
    files: [
      { filename: 'images/logos/logo.svg', width: 128, height: 50 }
    ]
  }
}
`)
  const derived = new Map([['logos/logo.svg', { widthDp: 200, heightDp: 100 }]])
  const { stats } = syncConfigImages(derived)

  if (stats.updated !== 1) throw new Error(`expected 1 updated, got ${stats.updated}`)
  const cfg = loadConfig()
  if (cfg.images.files[0].width !== 200) throw new Error(`width should be 200`)
  if (cfg.images.files[0].height !== 100) {
    throw new Error(`height should be overwritten to 100, got ${cfg.images.files[0].height}`)
  }
})

// ── Cleanup ───────────────────────────────────────────────────────────────
process.chdir(originalCwd)
fs.rmSync(tmpRoot, { recursive: true, force: true })

console.log('')
console.log(`  Passed: ${passed}`)
console.log(`  Failed: ${failed}`)
if (failed > 0) {
  for (const { name, error } of failures) {
    console.log(`  - ${name}: ${error.stack || error.message}`)
  }
  process.exit(1)
}
