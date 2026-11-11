import fs from 'node:fs'
import original from '../fixtures/color-shades/generateColorShades.js'
import { performance } from 'node:perf_hooks'
import generate from '../../lib/color-shades/generateColorShades.js'
import references from '../../lib/color-shades/tailwindColors.js'
const tables = { baseline: structuredClone(references), optimized: structuredClone(references) }
const implementations = { baseline: original, optimized: generate }
const inputs = ['#336699', '#fff', '#000000', '#ef4444', '#808080', '#17bf91']
const samples = { baseline: [], optimized: [] }
const first = {}
for (let round = -1; round < 5; round++) {
  for (const variant of round % 2 ? ['optimized', 'baseline'] : ['baseline', 'optimized']) {
    const cpu = process.cpuUsage()
    const start = performance.now()
    for (let i = 0; i < 100; i++) implementations[variant](inputs[i % inputs.length], tables[variant])
    const metrics = { durationMs: performance.now() - start, cpu: process.cpuUsage(cpu), rssBytes: process.memoryUsage().rss }
    if (round < 0) first[variant] = metrics
    else samples[variant].push(metrics)
  }
}
const median = values => values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
const medians = Object.fromEntries(Object.entries(samples).map(([name, values]) => [name, median(values.map(value => value.durationMs))]))
fs.writeFileSync(process.argv[2], JSON.stringify({ callsPerSample: 100, first, samples, medians }, null, 2) + '\n')
console.log(JSON.stringify(medians))
