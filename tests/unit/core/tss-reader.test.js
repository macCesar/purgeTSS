/**
 * Unit tests for src/core/svg/tss-reader.js
 *
 * parseTssMap() reads app.tss to recover width/height per class for the SVG
 * pipeline. It scans characters by hand (no JS parser), tracking string state
 * so that commas, colons and `//` inside string values don't get mistaken for
 * structure. Three separate scanners did that tracking, and none of them
 * honored backslash escapes — a single `\'` inside a value desynchronized the
 * scanner and silently dropped every property after it.
 */

process.stdout.on('error', err => { if (err.code === 'EPIPE') process.exit(0) })
process.stderr.on('error', err => { if (err.code === 'EPIPE') process.exit(0) })

console.log('🧪 Testing tss-reader.js (parseTssMap)...')

const { parseTssMap } = await import('../../../src/core/svg/tss-reader.js')

let passed = 0
let failed = 0
const failures = []

function test(name, fn) {
  try {
    fn()
    passed++
    console.log(`✅ ${name}`)
  } catch (e) {
    failed++
    failures.push({ name, error: e })
    console.log(`❌ ${name}`)
    console.log(`   ${e.message}`)
  }
}

function props(tss, className) {
  const map = parseTssMap(tss)
  const entry = map.get(className)
  if (!entry) throw new Error(`class ${className} not found in map`)
  return entry
}

// ── Baseline ──────────────────────────────────────────────────────────────
test('plain class: width and height are recovered', () => {
  const p = props('\'.hero\': { width: 320, height: 240 }', 'hero')
  if (p.width !== 320) throw new Error(`width should be 320, got ${p.width}`)
  if (p.height !== 240) throw new Error(`height should be 240, got ${p.height}`)
})

// ── Escapes: the dropped-property bug ─────────────────────────────────────
test('escaped apostrophe in a value: later properties survive', () => {
  const p = props('\'.card\': { title: \'it\\\'s here\', width: 200 }', 'card')
  if (p.width !== 200) {
    throw new Error(`width should be 200, got ${p.width} — escape desynchronized the scanner`)
  }
})

test('escaped apostrophe before height: height survives', () => {
  const p = props('\'.card\': { title: \'don\\\'t\', width: 100, height: 50 }', 'card')
  if (p.width !== 100) throw new Error(`width should be 100, got ${p.width}`)
  if (p.height !== 50) throw new Error(`height should be 50, got ${p.height}`)
})

test('escaped double quote in a value: later properties survive', () => {
  const p = props('\'.card\': { title: "say \\"hi\\"", width: 128 }', 'card')
  if (p.width !== 128) throw new Error(`width should be 128, got ${p.width}`)
})

test('escaped backslash at end of value does not swallow the delimiter', () => {
  const p = props('\'.card\': { title: \'back\\\\\', width: 64 }', 'card')
  if (p.width !== 64) throw new Error(`width should be 64, got ${p.width}`)
})

// ── Template literals ─────────────────────────────────────────────────────
test('backtick value: later properties survive', () => {
  const p = props('\'.card\': { title: `hi`, width: 400 }', 'card')
  if (p.width !== 400) throw new Error(`width should be 400, got ${p.width}`)
})

test('comma inside a backtick value is not a property separator', () => {
  const p = props('\'.card\': { title: `a, b`, width: 90 }', 'card')
  if (p.width !== 90) throw new Error(`width should be 90, got ${p.width}`)
})

// ── Comment stripping (must keep ignoring `//` inside strings) ─────────────
test('url inside a string is not treated as a comment', () => {
  const p = props('\'.card\': { title: \'http://x.com\', width: 100 }', 'card')
  if (p.width !== 100) throw new Error(`width should be 100, got ${p.width}`)
})

test('trailing comment is stripped', () => {
  const p = props('\'.card\': { width: 300 } // a trailing note', 'card')
  if (p.width !== 300) throw new Error(`width should be 300, got ${p.width}`)
})

test('trailing comment containing an apostrophe is stripped', () => {
  const p = props('\'.card\': { width: 300 } // it\'s a note', 'card')
  if (p.width !== 300) throw new Error(`width should be 300, got ${p.width}`)
})

// ── Structure: colons and commas inside values ────────────────────────────
test('colon inside a string value does not split the pair', () => {
  const p = props('\'.card\': { title: \'a: b\', width: 150 }', 'card')
  if (p.width !== 150) throw new Error(`width should be 150, got ${p.width}`)
})

test('nested object value does not break sibling properties', () => {
  const p = props('\'.card\': { font: { fontSize: 12 }, width: 175 }', 'card')
  if (p.width !== 175) throw new Error(`width should be 175, got ${p.width}`)
})

// ── Summary ───────────────────────────────────────────────────────────────
console.log('')
console.log(`  Passed: ${passed}`)
console.log(`  Failed: ${failed}`)
if (failed > 0) {
  for (const { name, error } of failures) {
    console.log(`  - ${name}: ${error.message}`)
  }
  process.exit(1)
}
