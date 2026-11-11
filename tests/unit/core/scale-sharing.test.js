import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import { createScaleContext, genAndroidScales, genIphoneScales } from '../../../src/core/images/gen-scales.js'
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-scales-'))
const source = path.join(root, 'source.png')
await sharp({ create: { width: 128, height: 64, channels: 4, background: '#33669980' } }).png().toFile(source)
const original = sharp.prototype.metadata
let metadataCalls = 0
sharp.prototype.metadata = function(...args) { metadataCalls++; return original.apply(this, args) }
try {
  const context = createScaleContext()
  const android = await genAndroidScales(source, 'image.png', path.join(root, 'android'), { context, baseWidth: 16, padding: 10, opacity: 70 })
  const iphone = await genIphoneScales(source, 'image.png', path.join(root, 'iphone'), { context, baseWidth: 16, padding: 10, opacity: 70 })
  assert.equal(metadataCalls, 1, 'both platforms must share source metadata')
  for (const [a, i] of [[0, 0], [2, 1], [3, 2]]) assert.ok(fs.readFileSync(android[a]).equals(fs.readFileSync(iphone[i])))
  const metadata = await sharp(iphone[0]).metadata()
  assert.equal(metadata.width, 16)
  assert.equal(metadata.height, 8)
  assert.equal(metadata.hasAlpha, true)
  assert.equal(android.length, 5)
  assert.equal(iphone.length, 3)
  const toBuffer = sharp.prototype.toBuffer
  let renders = 0
  sharp.prototype.toBuffer = function(...args) {
    renders++
    return renders === 1 ? Promise.reject(new Error('Synthetic render failure')) : toBuffer.apply(this, args)
  }
  try {
    await assert.rejects(genAndroidScales(source, 'failure.png', path.join(root, 'failed'), { context: createScaleContext(2), baseWidth: 16 }), /Synthetic render failure/)
    assert.equal(renders, 2, 'a failed render must stop the queue from starting more work')
  } finally { sharp.prototype.toBuffer = toBuffer }
} finally {
  sharp.prototype.metadata = original
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('Shared image source and render contracts passed')
