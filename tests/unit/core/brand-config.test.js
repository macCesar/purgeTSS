/**
 * Tests for the brand command's piece resolution:
 *   - precedence CLI > config > convention > default
 *   - `background` cascades from brand.background, `padding` never does
 *   - unknown keys inside `brand:` abort instead of being ignored
 *   - --only parsing: pieces, groups, mixes, invalid names
 */

import assert from 'assert'
import path from 'path'

import { resolvePieces, assertKnownBrandKeys, parseCornerRadius } from '../../../src/core/branding/brand-config.js'
import { parseOnlySelection, listDefaultPieceNames } from '../../../src/core/branding/pieces.js'

const PROJECT_ROOT = '/tmp/brand-config-test'
const BRAND_DIR = path.join(PROJECT_ROOT, 'purgetss', 'brand')

function resolve(brandConfig = {}, cliOptions = {}) {
  return resolvePieces(brandConfig, cliOptions, BRAND_DIR, PROJECT_ROOT)
}

/** Mirrors the one line in resolveBrandConfig() that settles `optimize`. */
function resolveOptimize(brandConfig, cliOptions) {
  return Boolean(cliOptions.optimize ?? brandConfig.optimize ?? false)
}

try {
  // ---- Padding precedence -------------------------------------------------

  {
    const { pieces } = resolve()
    assert.strictEqual(pieces.adaptive.padding, 18, 'adaptive falls back to its built-in default')
    assert.strictEqual(pieces['legacy-icon'].padding, 10)
    assert.strictEqual(pieces.icon.padding, 0)
    assert.strictEqual(pieces.dark.padding, 0)
    assert.strictEqual(pieces.tinted.padding, 0)
    assert.strictEqual(pieces.marketplace.padding, 0)
    assert.strictEqual(pieces['feature-graphic'].padding, 12)
    assert.strictEqual(pieces['launch-logo'].padding, 12)
    assert.strictEqual(pieces.appicon.padding, 10)
  }

  {
    const { pieces } = resolve({ adaptive: { padding: '25%' } })
    assert.strictEqual(pieces.adaptive.padding, 25, 'config padding accepts the percentage form')
  }

  {
    const { pieces } = resolve({ adaptive: { padding: 25 } }, { androidAdaptivePadding: 30 })
    assert.strictEqual(pieces.adaptive.padding, 30, 'CLI beats config')
  }

  {
    const { pieces } = resolve({}, { padding: 22 })
    assert.strictEqual(pieces.adaptive.padding, 22, '--padding is the shortcut for both Android paddings')
    assert.strictEqual(pieces['legacy-icon'].padding, 22)
    assert.strictEqual(pieces.icon.padding, 0, '--padding does not reach the iOS pieces')
  }

  {
    const { pieces } = resolve({}, { padding: 22, androidAdaptivePadding: 30 })
    assert.strictEqual(pieces.adaptive.padding, 30, 'the specific flag wins over the shortcut')
  }

  {
    const { pieces } = resolve({ appicon: { padding: '16%' } })
    assert.strictEqual(pieces.appicon.padding, 16, 'appicon.padding is configurable')
  }

  {
    const { pieces } = resolve({ appicon: { padding: '16%' } }, { appiconPadding: 7 })
    assert.strictEqual(pieces.appicon.padding, 7, '--appicon-padding wins over config')
  }

  // ---- Splash corner-radius precedence ----------------------------------

  {
    const { pieces } = resolve()
    assert.strictEqual(pieces['ios-splash'].cornerRadius, 0)
    assert.strictEqual(pieces['android-splash'].cornerRadius, 0)
    assert.strictEqual(pieces['feature-graphic'].cornerRadius, 0)
    assert.strictEqual(pieces['launch-logo'].cornerRadius, 0)
    assert.strictEqual(pieces.icon.cornerRadius, null)
    assert.strictEqual(pieces.marketplace.cornerRadius, null)
    assert.strictEqual(pieces.adaptive.cornerRadius, null)
    assert.strictEqual(pieces.appicon.cornerRadius, null)
  }

  {
    const { pieces } = resolve({ artworkCornerRadius: '9%' })
    assert.strictEqual(pieces['ios-splash'].cornerRadius, 9, 'global artwork radius reaches iOS splash artwork')
    assert.strictEqual(pieces['android-splash'].cornerRadius, 9, 'global artwork radius reaches Android splash artwork')
    assert.strictEqual(pieces['feature-graphic'].cornerRadius, 9, 'global artwork radius reaches Feature Graphic artwork')
    assert.strictEqual(pieces['launch-logo'].cornerRadius, 9, 'global artwork radius reaches LaunchLogo artwork')
    for (const name of ['icon', 'dark', 'tinted', 'marketplace', 'adaptive', 'legacy-icon', 'appicon', 'splash-icon', 'notification-icon', 'nine-patch']) {
      assert.strictEqual(pieces[name].cornerRadius, null, `${name} must stay outside the non-icon artwork radius pipeline`)
    }
  }

  {
    const { pieces } = resolve({ artworkCornerRadius: '9%', splashCornerRadius: '12%' })
    assert.strictEqual(pieces['ios-splash'].cornerRadius, 12, 'global radius reaches iOS splash artwork')
    assert.strictEqual(pieces['android-splash'].cornerRadius, 12, 'global radius reaches Android splash artwork')
    assert.strictEqual(pieces['feature-graphic'].cornerRadius, 9, 'splash radius does not affect Feature Graphic artwork')
    assert.strictEqual(pieces['launch-logo'].cornerRadius, 9, 'splash radius does not affect LaunchLogo artwork')
  }

  {
    const config = {
      artworkCornerRadius: '8%',
      splashCornerRadius: '12%',
      iosSplash: { cornerRadius: '18%' },
      androidSplash: { cornerRadius: 20 },
      featureGraphic: { cornerRadius: '14%' },
      launchLogo: { cornerRadius: '16%' }
    }
    const { pieces } = resolve(config, {
      artworkCornerRadius: 21,
      splashCornerRadius: 24,
      iosSplashCornerRadius: 30,
      featureGraphicCornerRadius: 32
    })
    assert.strictEqual(pieces['ios-splash'].cornerRadius, 30, 'specific flag wins over shared flag and config')
    assert.strictEqual(pieces['android-splash'].cornerRadius, 24, 'shared flag wins over piece and global config')
    assert.strictEqual(pieces['feature-graphic'].cornerRadius, 32, 'specific Feature Graphic flag wins')
    assert.strictEqual(pieces['launch-logo'].cornerRadius, 21, 'shared artwork flag wins over piece config')
  }

  {
    const config = {
      artworkCornerRadius: '8%',
      splashCornerRadius: '12%',
      iosSplash: { cornerRadius: '18%' },
      androidSplash: { cornerRadius: 20 },
      featureGraphic: { cornerRadius: '14%' },
      launchLogo: { cornerRadius: '16%' }
    }
    const { pieces } = resolve(config)
    assert.strictEqual(pieces['ios-splash'].cornerRadius, 18, 'piece radius wins over global config')
    assert.strictEqual(pieces['android-splash'].cornerRadius, 20)
    assert.strictEqual(pieces['feature-graphic'].cornerRadius, 14)
    assert.strictEqual(pieces['launch-logo'].cornerRadius, 16)
  }

  assert.strictEqual(parseCornerRadius(0, 'radius'), 0)
  assert.strictEqual(parseCornerRadius(50, 'radius'), 50)
  assert.strictEqual(parseCornerRadius('22%', 'radius'), 22)
  assert.throws(() => parseCornerRadius(-1, 'radius'), /between 0 and 50/)
  assert.throws(() => parseCornerRadius(51, 'radius'), /between 0 and 50/)
  assert.throws(() => parseCornerRadius(2.5, 'radius'), /between 0 and 50/)
  assert.throws(() => parseCornerRadius('22', 'radius'), /between 0 and 50/)
  assert.throws(() => parseCornerRadius('round', 'radius'), /between 0 and 50/)

  // ---- padding is NOT inherited ------------------------------------------

  {
    // There is no global padding on purpose. Setting one piece must leave the
    // others on their own defaults — 18% keeps the adaptive foreground inside
    // the mask, and an inherited 8% would break it with no warning.
    const { pieces } = resolve({ icon: { padding: '8%' } })
    assert.strictEqual(pieces.icon.padding, 8)
    assert.strictEqual(pieces.adaptive.padding, 18)
    assert.strictEqual(pieces['legacy-icon'].padding, 10)
    assert.strictEqual(pieces.dark.padding, 0, 'padding does not spread across the iOS family from config')
  }

  // ---- background IS inherited -------------------------------------------

  {
    const { pieces, bgColor, bgColorExplicit } = resolve({ background: '#0B1326' })
    assert.strictEqual(bgColor, '#0B1326')
    assert.strictEqual(bgColorExplicit, true)
    assert.strictEqual(pieces.adaptive.background, '#0B1326', 'pieces inherit brand.background')
    assert.strictEqual(pieces['android-splash'].background, '#0B1326')
    assert.strictEqual(pieces.dark.background, null, 'dark stays transparent per Apple HIG')
  }

  {
    const { pieces } = resolve({ background: '#0B1326', featureGraphic: { background: '#FF0000' } })
    assert.strictEqual(pieces['feature-graphic'].background, '#FF0000', 'a piece can opt out of the inherited background')
    assert.strictEqual(pieces.adaptive.background, '#0B1326')
  }

  {
    const { pieces, bgColorExplicit } = resolve({})
    assert.strictEqual(bgColorExplicit, false, 'the built-in white is not an explicit choice')
    assert.strictEqual(pieces.marketplace.backgroundExplicit, false, 'piece resolution records that the built-in fallback was implicit')
  }

  {
    const { pieces } = resolve({}, { darkBgColor: '#1C1C1E' })
    assert.strictEqual(pieces.dark.background, '#1C1C1E', '--dark-bg-color opts into an opaque dark icon')
  }

  // ---- Activation ---------------------------------------------------------

  {
    const { selection } = resolve()
    assert.deepStrictEqual(selection, listDefaultPieceNames(), 'a bare run generates exactly the default pieces')
    assert.ok(!selection.includes('splash-icon'))
    assert.ok(!selection.includes('launch-logo'), 'launch-logo waits for its logo file')
  }

  {
    const { selection } = resolve({}, { splashIcon: true })
    assert.ok(selection.includes('splash-icon'), '--splash-icon turns the piece on')
  }

  {
    const { selection } = resolve({ splashIcon: { enabled: true } })
    assert.ok(selection.includes('splash-icon'), 'config can pre-enable an opt-in piece')
  }

  {
    const { selection } = resolve({}, { dark: false, tinted: false })
    assert.ok(!selection.includes('dark'))
    assert.ok(!selection.includes('tinted'))
    assert.ok(selection.includes('icon'))
  }

  {
    const { selection } = resolve({ dark: { enabled: false } })
    assert.ok(!selection.includes('dark'), 'config can turn a default piece off')
  }

  {
    const { selection, pieces } = resolve({}, { launchLogo: '/tmp/wordmark.svg' })
    assert.ok(selection.includes('launch-logo'), 'pointing at a source activates the convention piece')
    assert.strictEqual(pieces['launch-logo'].logo, '/tmp/wordmark.svg')
  }

  // ---- --only -------------------------------------------------------------

  {
    const { selection } = resolve({}, { only: 'icon' })
    assert.deepStrictEqual(selection, ['icon'])
  }

  {
    const { selection } = resolve({}, { only: 'ios' })
    assert.deepStrictEqual(selection, ['icon', 'dark', 'tinted', 'ios-splash'])
  }

  {
    const { selection } = resolve({}, { only: 'notification-icon' })
    assert.deepStrictEqual(selection, ['notification-icon'], '--only turns an opt-in piece on by itself')
  }

  {
    const { selection } = resolve({}, { only: 'android,marketplace' })
    assert.deepStrictEqual(selection, ['marketplace', 'adaptive', 'legacy-icon', 'appicon', 'android-splash'],
      'a mix of group and piece comes back in pipeline order')
  }

  {
    const { selection } = resolve({ dark: { enabled: false } }, { only: 'dark' })
    assert.deepStrictEqual(selection, ['dark'], '--only overrides a config opt-out')
  }

  assert.deepStrictEqual(parseOnlySelection(' IOS , store '), ['icon', 'dark', 'tinted', 'ios-splash', 'marketplace', 'feature-graphic'])
  assert.deepStrictEqual(parseOnlySelection('icon,icon'), ['icon'], 'duplicates collapse')

  assert.throws(() => parseOnlySelection('foo'), /Unknown --only value: "foo"/)
  assert.throws(() => parseOnlySelection('foo'), /Groups:/, 'the error lists the valid selectors')
  assert.throws(() => parseOnlySelection(''), /at least one piece or group/)

  // ---- optimize ------------------------------------------------------------

  {
    // Lossy, so it stays off until asked for — by config or by flag.
    assert.strictEqual(resolveOptimize({}, {}), false)
    assert.strictEqual(resolveOptimize({ optimize: true }, {}), true, 'config can turn it on')
    assert.strictEqual(resolveOptimize({}, { optimize: true }), true, '--optimize turns it on')
    assert.strictEqual(resolveOptimize({ optimize: true }, { optimize: false }), false, '--no-optimize wins over config')
    assert.strictEqual(resolveOptimize({ optimize: false }, { optimize: true }), true, '--optimize wins over config')
  }

  // ---- Unknown keys ------------------------------------------------------

  assert.doesNotThrow(() => assertKnownBrandKeys({}))
  assert.doesNotThrow(() => assertKnownBrandKeys({
    background: '#FFFFFF',
    artworkCornerRadius: '0%',
    splashCornerRadius: '0%',
    confirmOverwrites: true,
    optimize: true,
    logo: './a.svg',
    monochromeLogo: './b.svg',
    adaptive: { padding: '19%', logo: './c.svg', background: '#000000', enabled: true },
    featureGraphic: { padding: '12%', cornerRadius: '22%' },
    launchLogo: { padding: '12%', cornerRadius: 22 },
    iosSplash: { padding: '26%', cornerRadius: '22%' },
    androidSplash: { padding: '26%', cornerRadius: 22 }
  }))

  // Keys from an older structure never reach the validator — the config file is
  // rewritten first (see brand-config-migration.test.js). What lands here is a
  // typo, and ignoring it would render the icon set at the wrong size.
  assert.throws(() => assertKnownBrandKeys({ adaptive: { paddig: 19 } }), /brand\.adaptive\.paddig/, 'a typo inside a piece is caught')
  assert.throws(() => assertKnownBrandKeys({ appicon: { cornerRadius: '22%' } }), /only valid inside brand\.iosSplash, brand\.androidSplash, brand\.featureGraphic and brand\.launchLogo/)
  assert.throws(() => assertKnownBrandKeys({ marketplace: { cornerRadius: '22%' } }), /only valid inside brand\.iosSplash, brand\.androidSplash, brand\.featureGraphic and brand\.launchLogo/)
  assert.throws(() => assertKnownBrandKeys({ nonsense: 1 }), /brand\.nonsense/)
  assert.throws(() => assertKnownBrandKeys({ adaptive: 19 }), /expected an object/)
  assert.throws(() => assertKnownBrandKeys({ nonsense: 1 }), /Piece blocks:/, 'the error lists what is valid')
  assert.throws(() => assertKnownBrandKeys({ nonsense: 1 }), /Nothing was written/)

  console.log('All brand config resolution tests passed!')
} catch (error) {
  console.error('Brand config resolution test failed:', error.message)
  process.exit(1)
}
