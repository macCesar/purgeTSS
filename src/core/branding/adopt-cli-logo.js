/**
 * Move a positional brand logo into the project's conventional source folder.
 */

import fs from 'fs'
import path from 'path'

const SUPPORTED_EXTENSIONS = new Set(['.png', '.svg'])

/**
 * @param {string} sourceLogo - Positional logo path, already resolved
 * @param {string} projectRoot
 * @param {{dryRun?: boolean}} [opts]
 * @returns {{logo: string, moved: boolean, wouldMove: boolean, from?: string, to?: string}}
 */
export function adoptCliLogo(sourceLogo, projectRoot, opts = {}) {
  const source = path.resolve(sourceLogo)
  const extension = path.extname(source).toLowerCase()

  if (!SUPPORTED_EXTENSIONS.has(extension) || !fs.existsSync(source)) {
    return { logo: source, moved: false, wouldMove: false }
  }

  const brandDir = path.join(projectRoot, 'purgetss', 'brand')
  const canonicalLogos = ['logo.svg', 'logo.png'].map((name) => path.join(brandDir, name))
  const destination = path.join(brandDir, `logo${extension}`)
  const existing = canonicalLogos.find((candidate) => fs.existsSync(candidate))

  if (existing || source === destination) {
    return { logo: source, moved: false, wouldMove: false }
  }

  if (opts.dryRun) {
    return { logo: source, moved: false, wouldMove: true, from: source, to: destination }
  }

  fs.mkdirSync(brandDir, { recursive: true })
  moveFile(source, destination)
  return { logo: destination, moved: true, wouldMove: false, from: source, to: destination }
}

function moveFile(source, destination) {
  try {
    fs.renameSync(source, destination)
  } catch (error) {
    if (error.code !== 'EXDEV') throw error
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
    fs.unlinkSync(source)
  }
}
