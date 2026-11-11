import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { getConfigFile } from '../../shared/config-manager.js'
import { writeIfChanged } from '../../shared/generated-files.js'

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('../../../', import.meta.url))
const metadata = path.join(process.cwd(), 'purgetss/.cache/generator-signature.json')

function reliable(value, seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value) && !Object.is(value, -0)
  if (typeof value !== 'object' || seen.has(value)) return false
  if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) return false
  seen.add(value)
  const keys = Reflect.ownKeys(value).filter(key => !(Array.isArray(value) && key === 'length'))
  const valid = keys.every(key => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    return typeof key === 'string' && descriptor.enumerable && 'value' in descriptor && reliable(descriptor.value, seen)
  }) && (!Array.isArray(value) || Object.keys(value).length === value.length)
  seen.delete(value)
  return valid
}

function filesIn(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? filesIn(file) : [file]
  }).sort()
}

export function generatorSignature(config = getConfigFile()) {
  if (!reliable(config)) return null
  const hash = crypto.createHash('sha256').update(JSON.stringify(config))
  const sources = [
    ...filesIn(path.join(root, 'src/core/builders')),
    ...filesIn(path.join(root, 'src/shared/helpers')),
    ...filesIn(path.join(root, 'lib/templates/tailwind')),
    ...filesIn(path.join(root, 'lib/completions/titanium')),
    ...filesIn(path.join(process.cwd(), 'purgetss/styles')).filter(file => /(?:fonts|fontawesome)\.tss$/.test(file)),
    path.join(root, 'package.json'),
    ...(fs.existsSync(path.join(root, 'package-lock.json')) ? [path.join(root, 'package-lock.json')] : []),
    require.resolve('tailwindcss/package.json'),
    ...['config-manager', 'semantic-helpers', 'constants', 'helpers', 'utils', 'generated-files'].map(name => path.join(root, `src/shared/${name}.js`)),
    ...['fontawesome', 'materialicons', 'materialsymbols', 'framework7icons'].map(name => path.join(root, `dist/${name}.tss`))
  ]
  for (const file of sources) hash.update(file).update(fs.readFileSync(file))
  return hash.digest('hex')
}

export function generatorBuildReason() {
  const signature = generatorSignature()
  if (!signature) return 'Generator inputs cannot be signed reliably'
  try {
    const saved = JSON.parse(fs.readFileSync(metadata, 'utf8'))
    if (typeof saved.signature !== 'string') return 'Generator signature invalid'
    return saved.signature !== signature ? 'Generator inputs changed' : null
  } catch (error) {
    return error.code === 'ENOENT' ? 'Generator signature missing' : 'Generator signature unreadable'
  }
}

export function generatorNeedsBuild() {
  return generatorBuildReason() !== null
}

export function saveGeneratorSignature(signature) {
  if (!fs.existsSync(path.dirname(path.dirname(metadata)))) return
  fs.mkdirSync(path.dirname(metadata), { recursive: true })
  writeIfChanged(metadata, JSON.stringify({ schemaVersion: 1, signature }) + '\n')
}
