import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const root = process.env.PURGETSS_IMAGE_FIXTURE
const scales = await import(pathToFileURL(path.join(process.env.PURGETSS_IMAGE_REPO, 'src/core/images/gen-scales.js')))
const context = scales.createScaleContext?.(Number(process.env.PURGETSS_IMAGE_CONCURRENCY || 1))
const cases = [['input.svg', null], ['input.png', 'png'], ['input.png', 'webp'], ['input.png', 'jpeg']]
if (process.env.PURGETSS_IMAGE_FORMATS === 'all') cases.push(['input.png', 'avif'], ['input.png', 'tiff'], ['input.png', 'gif'])
for (const [file, format] of cases) {
  const dest = path.join(root, 'outputs', format || 'svg')
  const opts = { context, format, baseWidth: Number(process.env.PURGETSS_IMAGE_WIDTH || 128), padding: 12, opacity: 75 }
  await scales.genAndroidScales(path.join(root, file), 'image' + path.extname(file), path.join(dest, 'android'), opts)
  await scales.genIphoneScales(path.join(root, file), 'image' + path.extname(file), path.join(dest, 'iphone'), opts)
  context?.renders.clear()
  context?.sources.clear()
}
fs.writeFileSync(path.join(root, 'done'), 'ok')
