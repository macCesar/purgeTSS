import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync, spawnSync } from 'node:child_process'
import { pathToFileURL, fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import sharp from 'sharp'
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-image-benchmark-'))
const output = path.resolve(process.argv[2])
const baseline = process.env.PURGETSS_BENCH_BASELINE || 'c5f735ad3387a028f8c21627eaf433085e9d283f'
const sources = {}
for (const file of execFileSync('git', ['diff', '--name-only', '--diff-filter=M', baseline], { cwd: repo, encoding: 'utf8' }).trim().split('\n')) {
  if (file.startsWith('src/')) sources[pathToFileURL(path.join(repo, file)).href] = execFileSync('git', ['show', `${baseline}:${file}`], { cwd: repo, encoding: 'utf8' })
}
fs.writeFileSync(path.join(temp, 'sources.json'), JSON.stringify(sources))
const env = { ...process.env, NO_UPDATE_NOTIFIER: '1', PURGETSS_IMAGE_FIXTURE: temp, PURGETSS_IMAGE_WIDTH: process.argv[3] || '128', PURGETSS_IMAGE_FORMATS: process.argv[4] || 'basic', PURGETSS_IMAGE_REPO: repo, PURGETSS_BENCH_ROOT: pathToFileURL(repo + '/').href, PURGETSS_BENCH_SOURCES: path.join(temp, 'sources.json'), PURGETSS_BENCH_METRICS: path.join(temp, 'metrics.json') }
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const samples = { baseline: [], serial: [], parallel: [] }
const first = {}
let reference
try {
  fs.writeFileSync(path.join(temp, 'input.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512"><defs><linearGradient id="g"><stop stop-color="#ff005580"/><stop offset="1" stop-color="#0033ff"/></linearGradient></defs><rect width="1024" height="512" fill="url(#g)"/><circle cx="400" cy="200" r="150" fill="#55ff7788"/></svg>')
  await sharp(path.join(temp, 'input.svg')).png().toFile(path.join(temp, 'input.png'))
  for (let round = -1; round < 5; round++) {
    for (const variant of round % 2 ? ['parallel', 'serial', 'baseline'] : ['baseline', 'serial', 'parallel']) {
      const result = spawnSync(process.execPath, ['--import', path.join(repo, 'tests/performance/source-loader.mjs'), path.join(repo, 'tests/performance/images-sample.mjs')], { env: { ...env, PURGETSS_BENCH_VARIANT: variant === 'baseline' ? 'baseline' : 'optimized', PURGETSS_IMAGE_CONCURRENCY: variant === 'parallel' ? '2' : '1' }, encoding: 'utf8' })
      if (result.status !== 0) throw new Error(result.stdout + result.stderr)
      const metrics = JSON.parse(fs.readFileSync(env.PURGETSS_BENCH_METRICS, 'utf8'))
      const hashes = {}
      for (const file of walk(path.join(temp, 'outputs'))) {
        const metadata = await sharp(file).metadata()
        hashes[path.relative(temp, file)] = { bytes: hash(fs.readFileSync(file)), pixels: hash(await sharp(file).raw().toBuffer()), width: metadata.width, height: metadata.height, alpha: metadata.hasAlpha }
      }
      if (!reference) reference = hashes
      if (JSON.stringify(reference) !== JSON.stringify(hashes)) throw new Error(`Image bytes or pixels differ: ${variant}`)
      if (round === -1) first[variant] = metrics
      else samples[variant].push(metrics)
    }
  }
  const median = values => values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
  const medians = Object.fromEntries(Object.entries(samples).map(([name, values]) => [name, { durationMs: median(values.map(v => v.durationMs)), peakRssBytes: median(values.map(v => v.peakRssBytes)) }]))
  const acceptedParallel = medians.parallel.durationMs < medians.serial.durationMs && Math.max(first.parallel.peakRssBytes, ...samples.parallel.map(v => v.peakRssBytes)) <= Math.max(first.baseline.peakRssBytes, ...samples.baseline.map(v => v.peakRssBytes)) * 1.2
  fs.writeFileSync(output, JSON.stringify({ baseline, first, samples, medians, outputs: reference, byteAndPixelEquivalent: true, filesCompared: Object.keys(reference).length, acceptedParallel }, null, 2) + '\n')
  console.log(JSON.stringify({ medians, acceptedParallel }))
} finally { fs.rmSync(temp, { recursive: true, force: true }) }
