/**
 * Project-aware brand behavior:
 *   - deployment-targets decide which platform pieces run by default
 *   - an explicit --only selection overrides deployment-target filtering
 *   - a first brand run creates config.cjs with the canonical defaults
 *   - a positional logo is adopted into purgetss/brand without overwriting
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import assert from 'assert'
import { createRequire } from 'module'
import sharp from 'sharp'

import { resolvePieces } from '../../../src/core/branding/brand-config.js'
import { selectPiecesForTargets } from '../../../src/core/branding/platform-selection.js'
import { readTiapp } from '../../../src/core/branding/tiapp-reader.js'
import { ensureBrandSection } from '../../../src/core/branding/ensure-brand-section.js'
import { adoptCliLogo } from '../../../src/core/branding/adopt-cli-logo.js'
import { genMarketplace } from '../../../src/core/branding/gen-marketplace.js'
import { genAndroidLegacy } from '../../../src/core/branding/gen-android-legacy.js'
import { genIos } from '../../../src/core/branding/gen-ios.js'
import { analyzeArtworkEdges, findVisibleFrameRisks } from '../../../src/core/branding/artwork-edges.js'

const require = createRequire(import.meta.url)

function projectWithTiapp(body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-project-'))
  const tiapp = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<ti:app xmlns:ti="http://ti.tidev.io">',
    body,
    '</ti:app>',
    ''
  ].join('\n')
  fs.writeFileSync(path.join(root, 'tiapp.xml'), tiapp, 'utf8')
  return root
}

function targetBlock(targets) {
  return [
    '  <deployment-targets>',
    ...Object.entries(targets).map(([device, enabled]) => `    <target device="${device}">${enabled}</target>`),
    '  </deployment-targets>'
  ].join('\n')
}

function resolvedPieces() {
  return resolvePieces({}, {}, '/tmp/brand-project/purgetss/brand', '/tmp/brand-project')
}

async function nonWhiteBounds(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let minX = info.width
  let minY = info.height
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const offset = (y * info.width + x) * info.channels
      const distanceFromWhite = Math.abs(255 - data[offset]) +
        Math.abs(255 - data[offset + 1]) +
        Math.abs(255 - data[offset + 2])
      if (data[offset + 3] <= 8 || distanceFromWhite <= 18) continue

      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }

  return { width: maxX - minX + 1, height: maxY - minY + 1 }
}

try {
  // ---- tiapp.xml deployment-target parsing ------------------------------

  {
    const root = projectWithTiapp(targetBlock({ android: false, ipad: false, iphone: true }))
    const info = readTiapp(path.join(root, 'tiapp.xml'))
    assert.deepStrictEqual(info.deploymentTargets, { ios: true, android: false })
    fs.rmSync(root, { recursive: true, force: true })
  }

  {
    const root = projectWithTiapp(targetBlock({ android: false, ipad: true, iphone: false }))
    const info = readTiapp(path.join(root, 'tiapp.xml'))
    assert.deepStrictEqual(info.deploymentTargets, { ios: true, android: false }, 'iPad alone still needs iOS assets')
    fs.rmSync(root, { recursive: true, force: true })
  }

  {
    const root = projectWithTiapp(targetBlock({ android: true, ipad: false, iphone: false }))
    const info = readTiapp(path.join(root, 'tiapp.xml'))
    assert.deepStrictEqual(info.deploymentTargets, { ios: false, android: true })
    fs.rmSync(root, { recursive: true, force: true })
  }

  {
    const missing = readTiapp('/tmp/pt-brand-missing-tiapp.xml')
    assert.deepStrictEqual(missing.deploymentTargets, { ios: true, android: true },
      'missing deployment metadata preserves the historical cross-platform behavior')
  }

  // ---- Piece filtering --------------------------------------------------

  {
    const { pieces, selection } = resolvedPieces()
    const filtered = selectPiecesForTargets(selection, pieces, { ios: true, android: false })
    assert.deepStrictEqual(filtered.selected, ['icon', 'dark', 'tinted', 'ios-splash', 'marketplace'])
    assert.ok(filtered.skipped.includes('adaptive'))
    assert.ok(filtered.skipped.includes('feature-graphic'))
  }

  {
    const { pieces, selection } = resolvedPieces()
    const filtered = selectPiecesForTargets(selection, pieces, { ios: false, android: true })
    assert.deepStrictEqual(filtered.selected, [
      'marketplace',
      'feature-graphic',
      'adaptive',
      'legacy-icon',
      'appicon',
      'android-splash'
    ])
    assert.ok(filtered.skipped.includes('icon'))
    assert.ok(filtered.skipped.includes('ios-splash'))
  }

  {
    const { pieces } = resolvedPieces()
    const explicit = ['adaptive', 'android-splash']
    const filtered = selectPiecesForTargets(explicit, pieces, { ios: true, android: false }, { explicit: true })
    assert.deepStrictEqual(filtered.selected, explicit, '--only deliberately overrides deployment-targets')
    assert.deepStrictEqual(filtered.skipped, [])
  }

  // ---- Platform-specific store artwork ---------------------------------

  {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-store-'))
    const source = path.join(root, 'logo.svg')
    fs.writeFileSync(source, [
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">',
      '  <rect width="64" height="64" fill="#123456"/>',
      '</svg>'
    ].join('\n'))

    const androidOnly = path.join(root, 'android')
    await genMarketplace(source, 4, androidOnly, { generateIos: false, generateAndroid: true })
    assert.ok(!fs.existsSync(path.join(androidOnly, 'iTunesConnect.png')))
    assert.ok(fs.existsSync(path.join(androidOnly, 'MarketplaceArtwork.png')))
    assert.strictEqual((await sharp(path.join(androidOnly, 'MarketplaceArtwork.png')).metadata()).hasAlpha, false,
      'Google Play artwork defaults to an opaque canvas')

    const iosOnly = path.join(root, 'ios')
    await genMarketplace(source, 4, iosOnly, { generateIos: true, generateAndroid: false })
    assert.ok(fs.existsSync(path.join(iosOnly, 'iTunesConnect.png')))
    assert.ok(!fs.existsSync(path.join(iosOnly, 'MarketplaceArtwork.png')))
    assert.strictEqual((await sharp(path.join(iosOnly, 'iTunesConnect.png')).metadata()).hasAlpha, false,
      'App Store artwork must not contain alpha')

    fs.rmSync(root, { recursive: true, force: true })
  }

  // ---- Configured padding reaches the rendered pixels -------------------

  {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-padding-'))
    const source = path.join(root, 'logo.svg')
    const resRoot = path.join(root, 'res')
    fs.writeFileSync(source, [
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">',
      '  <rect width="64" height="64" fill="#123456"/>',
      '</svg>'
    ].join('\n'))

    await genAndroidLegacy(source, '#FFFFFF', 10, resRoot)
    const xxxhdpi = path.join(resRoot, 'mipmap-xxxhdpi', 'ic_launcher.png')
    assert.deepStrictEqual(await nonWhiteBounds(xxxhdpi), { width: 153, height: 153 },
      'legacyIcon.padding is the actual per-side inset; 10% of a 192px canvas leaves a 153px logo box')

    fs.rmSync(root, { recursive: true, force: true })
  }

  {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-ios-padding-'))
    const source = path.join(root, 'logo.svg')
    fs.writeFileSync(source, [
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">',
      '  <rect width="64" height="64" fill="#123456"/>',
      '</svg>'
    ].join('\n'))

    // The icon piece documents one padding for both files. Passing 0% must
    // therefore make both universal outputs full-bleed; adaptive padding is a
    // separate Android piece and must not leak into DefaultIcon.png.
    const generated = await genIos(source, '#FFFFFF', 0, root)
    assert.deepStrictEqual(await nonWhiteBounds(generated.defaultIcon), { width: 1024, height: 1024 })
    assert.deepStrictEqual(await nonWhiteBounds(generated.defaultIconIos), { width: 1024, height: 1024 })
    assert.strictEqual((await sharp(generated.defaultIcon).metadata()).hasAlpha, false,
      'the universal fallback must be opaque')

    fs.rmSync(root, { recursive: true, force: true })
  }

  // ---- First-run config -------------------------------------------------

  {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-edges-'))
    const opaque = path.join(root, 'opaque.svg')
    const transparent = path.join(root, 'transparent.svg')
    fs.writeFileSync(opaque, [
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">',
      '  <rect width="64" height="64" fill="#020109"/>',
      '</svg>'
    ].join('\n'))
    fs.writeFileSync(transparent, [
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">',
      '  <circle cx="32" cy="32" r="20" fill="#020109"/>',
      '</svg>'
    ].join('\n'))

    const opaqueEdges = await analyzeArtworkEdges(opaque)
    assert.strictEqual(opaqueEdges.opaqueToEdges, true)
    assert.strictEqual(opaqueEdges.edgeColor, '#020109')

    const pieces = {
      icon: { padding: 4, background: '#FFFFFF', logo: null },
      adaptive: { padding: 18, background: '#020109', logo: null },
      'legacy-icon': { padding: 10, background: '#FFFFFF', logo: '/custom.svg' },
      'ios-splash': { padding: 26, background: '#FFFFFF', logo: null }
    }
    assert.deepStrictEqual(
      findVisibleFrameRisks(opaqueEdges, ['icon', 'adaptive', 'legacy-icon', 'ios-splash'], pieces),
      [{ name: 'icon', padding: 4, background: '#FFFFFF' }],
      'only contrasting, padded main-icon pieces should warn'
    )
    assert.deepStrictEqual(
      findVisibleFrameRisks(await analyzeArtworkEdges(transparent), ['icon'], pieces),
      [],
      'transparent logo artwork is the intended padded source and should stay quiet'
    )

    fs.rmSync(root, { recursive: true, force: true })
  }

  {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-config-'))
    assert.strictEqual(ensureBrandSection({ projectRoot: root, createConfig: true }), true)

    const configPath = path.join(root, 'purgetss', 'config.cjs')
    assert.ok(fs.existsSync(configPath), 'brand creates config.cjs when the project has none')
    assert.ok(fs.existsSync(path.join(root, 'purgetss', 'brand')), 'the source folder is created too')

    const config = require(configPath)
    assert.strictEqual(config.brand.icon.padding, '0%')
    assert.strictEqual(config.brand.adaptive.padding, '18%')
    assert.strictEqual(config.brand.iosSplash.padding, '26%')
    assert.strictEqual(config.brand.androidSplash.padding, '26%')

    fs.rmSync(root, { recursive: true, force: true })
  }

  // ---- Positional logo adoption ----------------------------------------

  {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-logo-'))
    const source = path.join(root, 'sample-icon.png')
    fs.writeFileSync(source, 'sample')

    const adopted = adoptCliLogo(source, root)
    const expected = path.join(root, 'purgetss', 'brand', 'logo.png')
    assert.strictEqual(adopted.logo, expected)
    assert.strictEqual(adopted.moved, true)
    assert.ok(!fs.existsSync(source), 'the positional source was moved')
    assert.strictEqual(fs.readFileSync(expected, 'utf8'), 'sample')

    const secondSource = path.join(root, 'another.png')
    fs.writeFileSync(secondSource, 'another')
    const preserved = adoptCliLogo(secondSource, root)
    assert.strictEqual(preserved.logo, secondSource, 'an existing canonical logo is never replaced')
    assert.strictEqual(preserved.moved, false)
    assert.strictEqual(fs.readFileSync(expected, 'utf8'), 'sample')
    assert.strictEqual(fs.readFileSync(secondSource, 'utf8'), 'another')

    fs.rmSync(root, { recursive: true, force: true })
  }

  console.log('All project-aware brand behavior tests passed!')
} catch (error) {
  console.error('Project-aware brand behavior test failed:', error.message)
  process.exit(1)
}
