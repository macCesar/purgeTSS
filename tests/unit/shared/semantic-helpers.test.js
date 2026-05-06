/**
 * Unit tests for src/shared/semantic-helpers.js
 *
 * Covers: empty/missing JSON, string-hex schema, {color, alpha} schema,
 * idempotence, conflict detection, mtime cache invalidation, and
 * registerSemanticName/isSemanticColorName tracking.
 */

import fs from 'fs'
import os from 'os'
import path from 'path'

process.stdout.on('error', err => { if (err.code === 'EPIPE') process.exit(0) })
process.stderr.on('error', err => { if (err.code === 'EPIPE') process.exit(0) })

console.log('🧪 Testing semantic-helpers (auto-derivation of alpha keys)...')

const originalCwd = process.cwd()
let tmpRoot = null

function setupAlloyFixture(initialJson) {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-semantic-'))
  fs.mkdirSync(path.join(tmpRoot, 'app', 'views'), { recursive: true })
  fs.mkdirSync(path.join(tmpRoot, 'app', 'assets'), { recursive: true })
  if (initialJson !== undefined) {
    fs.writeFileSync(
      path.join(tmpRoot, 'app', 'assets', 'semantic.colors.json'),
      JSON.stringify(initialJson, null, 2) + '\n'
    )
  }
  process.chdir(tmpRoot)
}

function teardownFixture() {
  process.chdir(originalCwd)
  if (tmpRoot && fs.existsSync(tmpRoot)) fs.rmSync(tmpRoot, { recursive: true, force: true })
  tmpRoot = null
}

async function freshImport() {
  // Force re-import to wipe module-level cache between tests.
  const url = new URL('../../../src/shared/semantic-helpers.js', import.meta.url)
  const mod = await import(`${url.href}?t=${Date.now()}-${Math.random()}`)
  mod._resetSemanticHelpersState()
  return mod
}

const tests = []
function test(name, fn) { tests.push({ name, fn }) }

test('loadSemanticColors returns {} when file is missing', async () => {
  setupAlloyFixture()
  const { loadSemanticColors } = await freshImport()
  const result = loadSemanticColors()
  if (Object.keys(result).length !== 0) throw new Error('expected empty object')
  teardownFixture()
})

test('loadSemanticColors parses string-hex schema', async () => {
  setupAlloyFixture({
    surfaceColor: { light: '#F9FAFB', dark: '#0f172a' }
  })
  const { loadSemanticColors } = await freshImport()
  const result = loadSemanticColors()
  if (result.surfaceColor.light !== '#F9FAFB') throw new Error('light hex mismatch')
  teardownFixture()
})

test('deriveAlphaKey returns null when base is missing', async () => {
  setupAlloyFixture({})
  const { deriveAlphaKey } = await freshImport()
  const key = deriveAlphaKey('surfaceColor', 65)
  if (key !== null) throw new Error('expected null for missing base')
  teardownFixture()
})

test('deriveAlphaKey creates new entry from string-hex base', async () => {
  setupAlloyFixture({
    surfaceColor: { light: '#F9FAFB', dark: '#0f172a' }
  })
  const { deriveAlphaKey, loadSemanticColors } = await freshImport()
  const key = deriveAlphaKey('surfaceColor', 65)
  if (key !== 'surfaceColor_65') throw new Error(`expected "surfaceColor_65", got "${key}"`)
  const cache = loadSemanticColors()
  const entry = cache.surfaceColor_65
  if (!entry) throw new Error('derived entry missing')
  if (entry.light.color !== '#F9FAFB' || entry.light.alpha !== '65') throw new Error('light shape wrong')
  if (entry.dark.color !== '#0f172a' || entry.dark.alpha !== '65') throw new Error('dark shape wrong')
  teardownFixture()
})

test('deriveAlphaKey handles {color, alpha} base by extracting color', async () => {
  setupAlloyFixture({
    overlayColor: {
      light: { color: '#000000', alpha: '50' },
      dark: { color: '#000000', alpha: '50' }
    }
  })
  const { deriveAlphaKey, loadSemanticColors } = await freshImport()
  const key = deriveAlphaKey('overlayColor', 80)
  if (key !== 'overlayColor_80') throw new Error('wrong derived key')
  const entry = loadSemanticColors().overlayColor_80
  if (entry.light.color !== '#000000' || entry.light.alpha !== '80') throw new Error('alpha override failed')
  teardownFixture()
})

test('deriveAlphaKey is idempotent on re-run with matching values', async () => {
  setupAlloyFixture({
    surfaceColor: { light: '#F9FAFB', dark: '#0f172a' }
  })
  const mod = await freshImport()
  const k1 = mod.deriveAlphaKey('surfaceColor', 65)
  const k2 = mod.deriveAlphaKey('surfaceColor', 65)
  if (k1 !== k2) throw new Error('idempotent calls produced different keys')
  const cache = mod.loadSemanticColors()
  if (Object.keys(cache).filter(k => k.startsWith('surfaceColor_65')).length !== 1) {
    throw new Error('idempotent call duplicated the entry')
  }
  teardownFixture()
})

test('deriveAlphaKey throws on conflict with manual edit', async () => {
  setupAlloyFixture({
    surfaceColor: { light: '#F9FAFB', dark: '#0f172a' },
    surfaceColor_65: {
      light: { color: '#000000', alpha: '65' },
      dark: { color: '#000000', alpha: '65' }
    }
  })
  const { deriveAlphaKey } = await freshImport()
  let threw = false
  try { deriveAlphaKey('surfaceColor', 65) } catch (e) {
    if (!/Conflict/.test(e.message)) throw new Error('error message missing "Conflict"')
    threw = true
  }
  if (!threw) throw new Error('expected throw on conflict')
  teardownFixture()
})

test('flushSemanticColors writes derived entries to disk', async () => {
  setupAlloyFixture({
    surfaceColor: { light: '#F9FAFB', dark: '#0f172a' }
  })
  const { deriveAlphaKey, flushSemanticColors } = await freshImport()
  deriveAlphaKey('surfaceColor', 65)
  flushSemanticColors()
  const onDisk = JSON.parse(fs.readFileSync(path.join(tmpRoot, 'app', 'assets', 'semantic.colors.json'), 'utf8'))
  if (!onDisk.surfaceColor_65) throw new Error('flush did not persist derived key')
  teardownFixture()
})

test('flushSemanticColors is no-op when nothing was derived', async () => {
  setupAlloyFixture({
    surfaceColor: { light: '#F9FAFB', dark: '#0f172a' }
  })
  const { flushSemanticColors } = await freshImport()
  const before = fs.statSync(path.join(tmpRoot, 'app', 'assets', 'semantic.colors.json')).mtimeMs
  flushSemanticColors()
  const after = fs.statSync(path.join(tmpRoot, 'app', 'assets', 'semantic.colors.json')).mtimeMs
  if (before !== after) throw new Error('flush rewrote file with no changes')
  teardownFixture()
})

test('cache invalidates on mtime change between loads', async () => {
  setupAlloyFixture({
    surfaceColor: { light: '#F9FAFB', dark: '#0f172a' }
  })
  const { loadSemanticColors } = await freshImport()
  const first = loadSemanticColors()
  if (first.amazon500) throw new Error('unexpected key in initial load')

  // Wait long enough that the new mtime is distinguishable, then rewrite.
  await new Promise(r => setTimeout(r, 20))
  const filePath = path.join(tmpRoot, 'app', 'assets', 'semantic.colors.json')
  fs.writeFileSync(filePath, JSON.stringify({
    surfaceColor: { light: '#F9FAFB', dark: '#0f172a' },
    amazon500: { light: '#ff0000', dark: '#ff0000' }
  }, null, 2) + '\n')

  const second = loadSemanticColors()
  if (!second.amazon500) throw new Error('cache did not invalidate on mtime change')
  teardownFixture()
})

test('registerSemanticName / isSemanticColorName track names', async () => {
  setupAlloyFixture({})
  const { registerSemanticName, isSemanticColorName } = await freshImport()
  registerSemanticName('surfaceColor')
  registerSemanticName('textColor')
  if (!isSemanticColorName('surfaceColor')) throw new Error('surfaceColor not tracked')
  if (!isSemanticColorName('textColor')) throw new Error('textColor not tracked')
  if (isSemanticColorName('unknownColor')) throw new Error('false positive for unknownColor')
  teardownFixture()
})

let passed = 0
let failed = 0
for (const t of tests) {
  try {
    await t.fn()
    passed += 1
    console.log(`   ✅ ${t.name}`)
  } catch (e) {
    failed += 1
    console.log(`   ❌ ${t.name} — ${e.message}`)
  } finally {
    if (process.cwd() !== originalCwd) {
      try { teardownFixture() } catch (_e) { /* fixture already torn down */ }
    }
  }
}

console.log(`\nResults: ${passed}/${tests.length} passed${failed ? `, ${failed} failed` : ''}`)
if (failed > 0) process.exit(1)
