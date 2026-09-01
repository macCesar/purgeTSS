/**
 * Non-icon artwork corner-radius rendering:
 *   - 0% is a byte-preserving no-op at the shared mask boundary
 *   - 22% exposes the splash background at artwork corners
 *   - every legacy iOS and Android splash keeps its documented dimensions
 */

import assert from 'assert'
import fs from 'fs'
import os from 'os'
import path from 'path'
import sharp from 'sharp'

import { genIosSplashes, listIosSplashSizes } from '../../../src/core/branding/gen-ios-splashes.js'
import { genAndroidDefault } from '../../../src/core/branding/gen-android-default.js'
import { genAndroidSplashes, listSplashSizes } from '../../../src/core/branding/gen-android-splashes.js'
import { genFeatureGraphic } from '../../../src/core/branding/gen-feature-graphic.js'
import { genLaunchLogo } from '../../../src/core/branding/gen-launch-logo.js'
import { logoBox } from '../../../src/core/branding/splash-geometry.js'
import { roundArtworkCorners } from '../../../src/core/branding/round-artwork-corners.js'

const BACKGROUND = { r: 255, g: 0, b: 0, alpha: 255 }
const ARTWORK = { r: 0, g: 64, b: 255, alpha: 255 }

async function pixel(file, x, y) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const offset = (y * info.width + x) * info.channels
  return {
    r: data[offset],
    g: data[offset + 1],
    b: data[offset + 2],
    alpha: data[offset + 3]
  }
}

async function assertRoundedArtwork(file, width, height, padding) {
  const metadata = await sharp(file).metadata()
  assert.strictEqual(metadata.width, width)
  assert.strictEqual(metadata.height, height)

  const side = logoBox(width, height, padding)
  const left = Math.floor((width - side) / 2)
  const top = Math.floor((height - side) / 2)

  assert.deepStrictEqual(await pixel(file, left + 2, top + 2), BACKGROUND,
    `${path.basename(file)} must expose the splash background at the rounded artwork corner`)
  assert.deepStrictEqual(await pixel(file, Math.floor(width / 2), Math.floor(height / 2)), ARTWORK,
    `${path.basename(file)} must preserve the artwork center`)
}

try {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-corners-'))

  try {
    const solid = await sharp({
      create: { width: 120, height: 120, channels: 4, background: ARTWORK }
    }).png().toBuffer()

    assert.strictEqual(await roundArtworkCorners(solid, 0), solid,
      '0% returns the original buffer object without a Sharp re-encode')

    const rounded = await roundArtworkCorners(solid, 50)
    const roundedRaw = await sharp(rounded).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    assert.strictEqual(roundedRaw.info.width, 120)
    assert.strictEqual(roundedRaw.info.height, 120)
    assert.strictEqual(roundedRaw.data[3], 0, '50% turns square artwork into a circle')

    const wordmark = await sharp({
      create: { width: 240, height: 80, channels: 4, background: ARTWORK }
    }).png().toBuffer()
    const capsule = await roundArtworkCorners(wordmark, 50)
    const capsuleRaw = await sharp(capsule).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const capsuleRightCorner = (capsuleRaw.info.width - 1) * capsuleRaw.info.channels + 3
    assert.strictEqual(capsuleRaw.info.width, 240)
    assert.strictEqual(capsuleRaw.info.height, 80)
    assert.strictEqual(capsuleRaw.data[3], 0, '50% clears the top-left corner of rectangular artwork')
    assert.strictEqual(capsuleRaw.data[capsuleRightCorner], 0, '50% turns rectangular artwork into a capsule')

    const source = path.join(root, 'logo.png')
    fs.writeFileSync(source, solid)

    const featureLegacy = await genFeatureGraphic(source, 12, path.join(root, 'zero-default'), { bgColor: '#FF0000' })
    const featureZero = await genFeatureGraphic(source, 12, path.join(root, 'zero-explicit'), { bgColor: '#FF0000', cornerRadiusPct: 0 })
    assert.deepStrictEqual(fs.readFileSync(featureZero), fs.readFileSync(featureLegacy),
      '0% keeps the previous Feature Graphic bytes')

    const launchLegacy = await genLaunchLogo(source, 12, path.join(root, 'zero-default', 'ios'))
    const launchZero = await genLaunchLogo(source, 12, path.join(root, 'zero-explicit', 'ios'), { cornerRadiusPct: 0 })
    assert.deepStrictEqual(fs.readFileSync(launchZero), fs.readFileSync(launchLegacy),
      '0% keeps the previous LaunchLogo bytes')

    const iosFiles = await genIosSplashes(source, '#FF0000', path.join(root, 'ios'), 26, 22)
    const androidDefault = await genAndroidDefault(source, '#FF0000', path.join(root, 'android'), 26, 22)
    const androidFiles = await genAndroidSplashes(source, '#FF0000', path.join(root, 'android', 'images'), 26, 22)
    const featureGraphic = await genFeatureGraphic(source, 12, root, { bgColor: '#FF0000', cornerRadiusPct: 22 })
    const launchLogo = await genLaunchLogo(source, 12, path.join(root, 'ios'), { cornerRadiusPct: 22 })

    assert.strictEqual(iosFiles.length, 16)
    assert.strictEqual(androidFiles.length, 11)
    assert.strictEqual([androidDefault, ...androidFiles].length, 12)

    for (let index = 0; index < iosFiles.length; index++) {
      await assertRoundedArtwork(iosFiles[index], ...listIosSplashSizes()[index], 26)
    }

    await assertRoundedArtwork(androidDefault, 1440, 2560, 26)
    for (let index = 0; index < androidFiles.length; index++) {
      await assertRoundedArtwork(androidFiles[index], ...listSplashSizes()[index], 26)
    }

    assert.deepStrictEqual(await pixel(featureGraphic, 324, 62), BACKGROUND,
      'Feature Graphic must expose its background at the rounded artwork corner')
    assert.deepStrictEqual(await pixel(featureGraphic, 512, 250), ARTWORK,
      'Feature Graphic must preserve the artwork center')
    assert.strictEqual((await pixel(launchLogo, 125, 125)).alpha, 0,
      'LaunchLogo must keep transparency at the rounded artwork corner')
    assert.deepStrictEqual(await pixel(launchLogo, 512, 512), ARTWORK,
      'LaunchLogo must preserve the artwork center')
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }

  console.log('All artwork corner-radius rendering tests passed! (28 legacy splashes + Feature Graphic + LaunchLogo)')
} catch (error) {
  console.error('Artwork corner-radius rendering test failed:', error.message)
  process.exit(1)
}
