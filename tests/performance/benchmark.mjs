/** Direct-project differential benchmark. Never copies projects or changes sources. */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import { spawnSync, execFileSync } from 'node:child_process'
import { performance } from 'node:perf_hooks'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-benchmark-'))
const output = path.resolve(process.argv[2] || 'optimization-benchmark.json')
const projects = process.argv.slice(3)
const commandArgs = JSON.parse(process.env.PURGETSS_BENCH_COMMAND || '[]')
const baseline = process.env.PURGETSS_BENCH_BASELINE || 'c5f735ad3387a028f8c21627eaf433085e9d283f'
const sources = {}
for (const file of execFileSync('git', ['diff', '--name-only', '--diff-filter=M', baseline], { cwd: repo, encoding: 'utf8' }).trim().split('\n')) {
  if (!(file.startsWith('src/') || file.startsWith('lib/') || file === 'bin/purgetss')) continue
  sources[pathToFileURL(path.join(repo, file)).href] = execFileSync('git', ['show', `${baseline}:${file}`], { cwd: repo, encoding: 'utf8' })
}
const sourceFile = path.join(temp, 'sources.json')
fs.writeFileSync(sourceFile, JSON.stringify(sources))
const metricsFile = path.join(temp, 'metrics.json')
const loader = path.join(repo, 'tests/performance/source-loader.mjs')
const baseEnv = { ...process.env, NO_UPDATE_NOTIFIER: '1', FORCE_COLOR: '0', PURGETSS_BENCH_ROOT: pathToFileURL(repo + '/').href, PURGETSS_BENCH_SOURCES: sourceFile, PURGETSS_BENCH_METRICS: metricsFile }
const walk = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]) : []
const protectedFiles = project => [...new Set([
  ...walk(path.join(project, 'purgetss')),
  ...walk(path.join(project, 'app/styles')),
  ...walk(path.join(project, 'app/assets')),
  path.join(project, 'app/alloy.jmk')
])].filter(file => fs.existsSync(file))
const hash = data => crypto.createHash('sha256').update(data).digest('hex')
const snapshot = project => new Map(protectedFiles(project).map(file => {
  const stat = fs.statSync(file)
  return [file, { bytes: fs.readFileSync(file), atime: stat.atimeMs / 1000, mtime: stat.mtimeMs / 1000, mode: stat.mode }]
}))
const digest = project => Object.fromEntries(protectedFiles(project).filter(file => !file.endsWith('/purgetss/.cache/generator-signature.json')).map(file => [path.relative(project, file), hash(fs.readFileSync(file))]))
const directories = project => {
  const result = []
  const visit = dir => {
    if (!fs.existsSync(dir)) return
    result.push(dir)
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) if (entry.isDirectory()) visit(path.join(dir, entry.name))
  }
  for (const relative of ['purgetss', 'app/styles', 'app/assets']) visit(path.join(project, relative))
  return result
}
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
async function run(project, variant, args = commandArgs, expectGuard = false) {
  const app = path.join(project, 'app/styles/app.tss')
  if (!args.length && !expectGuard && fs.existsSync(app)) await setTimeout(Math.max(0, fs.statSync(app).mtimeMs + 2050 - Date.now()))
  const started = performance.now()
  const result = spawnSync(process.execPath, ['--import', loader, path.join(repo, 'bin/purgetss'), ...args], {
    cwd: project, env: { ...baseEnv, PURGETSS_BENCH_VARIANT: variant }, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024
  })
  const wallMs = performance.now() - started
  if (result.status !== 0) throw new Error(`${project} ${variant}: ${result.stdout}${result.stderr}`)
  if (!args.length && result.stdout.includes('less than 2 seconds') !== expectGuard) throw new Error('Unexpected LiveView guard state')
  return { wallMs, ...JSON.parse(fs.readFileSync(metricsFile, 'utf8')), hashes: digest(project) }
}
const results = { schemaVersion: 1, baseline: execFileSync('git', ['rev-parse', baseline], { cwd: repo, encoding: 'utf8' }).trim(), samplesPerVariant: 5, projects: [] }
try {
  const minimal = path.join(temp, 'minimal')
  fs.mkdirSync(path.join(minimal, 'app/views'), { recursive: true })
  fs.mkdirSync(path.join(minimal, 'app/controllers'), { recursive: true })
  fs.mkdirSync(path.join(minimal, 'app/styles'), { recursive: true })
  fs.writeFileSync(path.join(minimal, 'tiapp.xml'), '<ti:app xmlns:ti="http://ti.appcelerator.org"><id>test.benchmark</id><name>benchmark</name></ti:app>')
  fs.writeFileSync(path.join(minimal, 'app/views/index.xml'), '<Alloy><Window class="bg-red-500"><Label class="p-4 text-white" /></Window></Alloy>')
  await run(minimal, 'baseline', ['init'])
  if (process.env.PURGETSS_BENCH_STRESS) {
    const theme = { extend: {} }
    for (let i = 0; i < 200; i++) theme['card' + i] = { default: { apply: 'bg-red-500 p-4 text-white rounded fas fa-home' } }
    fs.writeFileSync(path.join(minimal, 'purgetss/config.cjs'), 'module.exports = ' + JSON.stringify({ theme }))
  }
  for (const project of [...projects, minimal]) {
    const before = snapshot(project)
    const originalDirs = new Set(directories(project))
    const gitBefore = spawnSync('git', ['status', '--porcelain'], { cwd: project, encoding: 'utf8' }).stdout
    let projectError
    try {
      const first = {}
      for (const variant of ['baseline', 'optimized']) first[variant] = await run(project, variant)
      if (JSON.stringify(first.baseline.hashes) !== JSON.stringify(first.optimized.hashes)) {
        const files = [...new Set([...Object.keys(first.baseline.hashes), ...Object.keys(first.optimized.hashes)])].filter(file => first.baseline.hashes[file] !== first.optimized.hashes[file])
        console.error('Initial differences:', files)
        for (const relative of files) {
          const old = before.get(path.join(project, relative))?.bytes.toString('utf8').split('\n') || []
          const now = fs.readFileSync(path.join(project, relative), 'utf8').split('\n')
          const index = now.findIndex((line, i) => line !== old[i])
          console.error(relative, 'first differing line', index + 1, 'old', old.slice(index, index + 3), 'new', now.slice(index, index + 3))
        }
        throw new Error('Initial output bytes differ')
      }
      const samples = { baseline: [], optimized: [] }
      let expected
      for (let round = 0; round < 5; round++) {
        for (const variant of round % 2 ? ['optimized', 'baseline'] : ['baseline', 'optimized']) {
          const sample = await run(project, variant)
          expected ??= sample.hashes
          if (JSON.stringify(sample.hashes) !== JSON.stringify(expected)) {
            const differences = [...new Set([...Object.keys(sample.hashes), ...Object.keys(expected)])].filter(file => sample.hashes[file] !== expected[file])
            throw new Error(`Output bytes differ: ${variant}: ${differences.join(', ')}`)
          }
          delete sample.hashes
          samples[variant].push(sample)
        }
      }
      const skipped = commandArgs.length ? undefined : await run(project, 'optimized', [], true)
      if (skipped) delete skipped.hashes
      const summary = { project: project === minimal ? 'minimal' : project, first: Object.fromEntries(Object.entries(first).map(([key, value]) => { delete value.hashes; return [key, value] })), samples, skipped, byteEquivalent: true, filesCompared: Object.keys(expected).length, medians: {} }
      for (const variant of ['baseline', 'optimized']) summary.medians[variant] = { wallMs: median(samples[variant].map(s => s.wallMs)), durationMs: median(samples[variant].map(s => s.durationMs)), peakRssBytes: median(samples[variant].map(s => s.peakRssBytes)) }
      results.projects.push(summary)
      console.log(JSON.stringify({ project: summary.project, medians: summary.medians, byteEquivalent: true }))
    } catch (error) {
      projectError = error
    } finally {
      for (const file of protectedFiles(project)) if (!before.has(file)) fs.unlinkSync(file)
      for (const [file, original] of before) {
        if (!fs.existsSync(file) || !fs.readFileSync(file).equals(original.bytes)) fs.writeFileSync(file, original.bytes, { mode: original.mode })
        fs.utimesSync(file, original.atime, original.mtime)
      }
      for (const dir of directories(project).reverse()) if (!originalDirs.has(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir)
      const gitAfter = spawnSync('git', ['status', '--porcelain'], { cwd: project, encoding: 'utf8' }).stdout
      if (gitAfter !== gitBefore) {
        const restorationError = new Error(`Project status changed after restoration: ${project}`)
        projectError = projectError ? new AggregateError([projectError, restorationError]) : restorationError
      }
    }
    if (projectError) throw projectError
    fs.writeFileSync(output, JSON.stringify(results, null, 2) + '\n')
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}
