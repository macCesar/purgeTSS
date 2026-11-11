// eslint-disable-next-line n/no-unsupported-features/node-builtins -- The opt-in benchmark exercises Node's loader API.
import { register, syncBuiltinESMExports } from 'node:module'
import fs from 'node:fs'
import { performance } from 'node:perf_hooks'

const started = performance.now()
const cpu = process.cpuUsage()
const counters = { reads: 0, writes: 0, xmlParses: 0, jsParses: 0 }
globalThis.__purgetssMeasure = (name, fn, ...args) => {
  counters[name]++
  return fn(...args)
}
for (const [method, counter] of [['readFileSync', 'reads'], ['writeFileSync', 'writes']]) {
  const original = fs[method]
  fs[method] = function(...args) {
    counters[counter]++
    return original.apply(this, args)
  }
}
syncBuiltinESMExports()
register('./source-transform.mjs', import.meta.url, { data: {
  baseline: process.env.PURGETSS_BENCH_VARIANT === 'baseline',
  sharpOverride: process.env.PURGETSS_BENCH_BASE_SHARP,
  sources: JSON.parse(fs.readFileSync(process.env.PURGETSS_BENCH_SOURCES, 'utf8')),
  root: process.env.PURGETSS_BENCH_ROOT
} })
process.once('exit', code => fs.writeFileSync(process.env.PURGETSS_BENCH_METRICS, JSON.stringify({
  durationMs: performance.now() - started,
  cpu: process.cpuUsage(cpu),
  peakRssBytes: process.resourceUsage().maxRSS * 1024,
  counters,
  code
})))
