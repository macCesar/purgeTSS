import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { InvocationContext } from '../../../src/core/analyzers/invocation-context.js'
import { processControllers, extractSvgRefsFromXml } from '../../../src/core/analyzers/class-extractor.js'
import { extractSvgRefsFromController } from '../../../src/core/analyzers/controller-svg-refs.js'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-context-'))
try {
  const file = path.join(root, 'source.xml')
  fs.writeFileSync(file, '<Alloy><ImageView id="myId" class="w-4" image="/images/x.svg" /></Alloy>')
  const context = new InvocationContext()
  const first = context.read(file)
  assert.equal(context.read(file), first)
  assert.equal(context.xml(first), context.xml(first))
  assert.deepEqual(extractSvgRefsFromXml(first, file, context), [{ src: '/images/x.svg', classes: ['w-4'] }])
  const js = '$.UI.create(\'ImageView\', { classes: \'p-4\', image: \'/images/x.svg\' })'
  assert.deepEqual(processControllers(js, context), ['p-4'])
  assert.deepEqual(extractSvgRefsFromController(js, context), [{ src: '/images/x.svg', classes: ['p-4'] }])
  assert.deepEqual(processControllers('function broken( { classes: [\'fallback\'] }', context), ['fallback'])
  assert.equal(context.counters.reads, 1)
  assert.equal(context.counters.xmlParses, 1)
  assert.equal(context.counters.jsParses, 2)
  fs.writeFileSync(file, '<Alloy/>')
  assert.equal(context.read(file), first)
  context.dispose()
  const next = new InvocationContext()
  assert.equal(next.read(file), '<Alloy/>')
  assert.throws(() => next.xml('<Alloy>'))
  next.dispose()
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('Invocation source sharing contracts passed')
