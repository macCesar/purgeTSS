/**
 * E2E test: opacity modifier on semantic colors.
 *
 * Validates the auto-derivation flow end-to-end:
 *   1. `purgetss build` writes utilities.tss with the standard `bg-surface`
 *      class pointing at the semantic name `surfaceColor`.
 *   2. `purgetss build` also processes apply directives, deriving
 *      `surfaceColor_50` for the apply'd `bg-surface/50` reference.
 *   3. `purgetss` (purge) emits a `.bg-surface/65` class with the derived
 *      `surfaceColor_65` reference and writes that key into
 *      `semantic.colors.json`.
 *   4. Re-running both commands does not duplicate keys (idempotent).
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

process.stdout.on('error', err => { if (err.code === 'EPIPE') process.exit(0) })
process.stderr.on('error', err => { if (err.code === 'EPIPE') process.exit(0) })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PURGETSS_BIN = path.resolve(__dirname, '../../bin/purgetss')

console.log('🧪 E2E: opacity modifier on semantic colors')

let tmpDir = null
function setupFixture() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-e2e-semantic-'))

  fs.mkdirSync(path.join(tmpDir, 'app', 'views'), { recursive: true })
  fs.mkdirSync(path.join(tmpDir, 'app', 'styles'), { recursive: true })
  fs.mkdirSync(path.join(tmpDir, 'app', 'controllers'), { recursive: true })
  fs.mkdirSync(path.join(tmpDir, 'app', 'assets'), { recursive: true })
  fs.mkdirSync(path.join(tmpDir, 'purgetss'), { recursive: true })

  fs.writeFileSync(path.join(tmpDir, 'app', 'views', 'index.xml'),
    `<Alloy>
  <Window class="bg-surface/65">
    <Label class="text-on-surface">Hello</Label>
  </Window>
</Alloy>
`)

  fs.writeFileSync(path.join(tmpDir, 'app', 'controllers', 'index.js'), '$.index.open()\n')

  fs.writeFileSync(path.join(tmpDir, 'purgetss', 'config.cjs'),
    `module.exports = {
  purge: { mode: 'all', method: 'sync', options: { missing: false, widgets: false, safelist: [], plugins: [] } },
  theme: {
    extend: {
      colors: {
        surface: 'surfaceColor',
        'on-surface': 'textColor'
      },
      View: {
        apply: 'bg-surface/50'
      }
    }
  }
}
`)

  fs.writeFileSync(path.join(tmpDir, 'app', 'assets', 'semantic.colors.json'),
    JSON.stringify({
      surfaceColor: { light: '#F9FAFB', dark: '#0f172a' },
      textColor: { light: '#111827', dark: '#f1f5f9' }
    }, null, 2) + '\n')

  return tmpDir
}

function teardownFixture() {
  if (tmpDir && fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true })
  tmpDir = null
}

function runCli(args = []) {
  const result = spawnSync('node', [PURGETSS_BIN, ...args], { cwd: tmpDir, encoding: 'utf8' })
  if (result.status !== 0) {
    console.error('CLI stderr:', result.stderr)
    console.error('CLI stdout:', result.stdout)
    throw new Error(`purgetss ${args.join(' ')} exited with status ${result.status}`)
  }
  return result
}

let passed = 0
let failed = 0

function assert(cond, msg) {
  if (!cond) throw new Error(`assertion failed: ${msg}`)
}

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')) }

try {
  setupFixture()

  // ---- First run: build then purge ----
  runCli(['build'])
  runCli([])

  const utilitiesTss = fs.readFileSync(path.join(tmpDir, 'purgetss', 'styles', 'utilities.tss'), 'utf8')
  const appTss = fs.readFileSync(path.join(tmpDir, 'app', 'styles', 'app.tss'), 'utf8')
  const semantic = readJson(path.join(tmpDir, 'app', 'assets', 'semantic.colors.json'))

  assert(/'\.bg-surface':\s*\{\s*backgroundColor:\s*'surfaceColor'/.test(utilitiesTss),
    "utilities.tss has '.bg-surface': { backgroundColor: 'surfaceColor' }")
  passed++; console.log('   ✅ utilities.tss exposes the base semantic class')

  assert(/'\.bg-surface\/65':\s*\{\s*[^}]*backgroundColor:\s*'surfaceColor_65'/.test(appTss),
    "app.tss should contain '.bg-surface/65' mapped to 'surfaceColor_65'\n" + appTss)
  passed++; console.log('   ✅ app.tss has .bg-surface/65 → surfaceColor_65')

  assert(semantic.surfaceColor_65, 'semantic.colors.json has surfaceColor_65')
  assert(semantic.surfaceColor_65.light.color === '#F9FAFB', 'light hex preserved')
  assert(semantic.surfaceColor_65.light.alpha === '65', 'light alpha = "65"')
  assert(semantic.surfaceColor_65.dark.color === '#0f172a', 'dark hex preserved')
  assert(semantic.surfaceColor_65.dark.alpha === '65', 'dark alpha = "65"')
  passed++; console.log('   ✅ semantic.colors.json gets surfaceColor_65 with {color, alpha}')

  assert(semantic.surfaceColor_50, 'semantic.colors.json has surfaceColor_50 (from apply)')
  assert(semantic.surfaceColor_50.light.alpha === '50', 'apply-derived alpha = "50"')
  passed++; console.log('   ✅ apply directive triggers derivation (surfaceColor_50)')

  // ---- Second run: idempotence ----
  const semanticBefore = JSON.stringify(semantic, null, 2)
  runCli(['build'])
  runCli([])
  const semanticAfter = readJson(path.join(tmpDir, 'app', 'assets', 'semantic.colors.json'))
  const keysBefore = Object.keys(semantic).sort()
  const keysAfter = Object.keys(semanticAfter).sort()
  assert(keysBefore.length === keysAfter.length, 'rerun did not change key count')
  assert(JSON.stringify(keysBefore) === JSON.stringify(keysAfter), 'rerun preserved exact key set')
  passed++; console.log('   ✅ re-run is idempotent (no duplicates)')

  // Sanity: no superfluous mutations of the original entries
  assert(semanticAfter.surfaceColor.light === '#F9FAFB', 'original surfaceColor.light untouched')
  passed++; console.log('   ✅ original semantic entries untouched')

  // Suppress unused-var lint
  void semanticBefore
} catch (e) {
  failed++
  console.log(`   ❌ ${e.message}`)
} finally {
  teardownFixture()
}

console.log(`\nResults: ${passed} passed${failed ? `, ${failed} failed` : ''}`)
if (failed > 0) process.exit(1)
