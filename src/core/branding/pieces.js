/**
 * PurgeTSS - Brand pieces
 *
 * The single vocabulary the `brand` command speaks: one entry per piece of
 * artwork a Titanium project carries. Everything else — the `brand:` section of
 * config.cjs, the CLI flags, `--only`, the dry-run listing and the post-run
 * summary — is derived from this table, so a new piece is added in one place.
 *
 * The default set covers the complete Titanium branding surface, but each
 * piece declares which deployment target consumes it. The command can then
 * omit an entire disabled platform without coupling that decision to whether
 * the project uses Alloy or Classic.
 *
 * One name per thing, no aliases: the piece name drives the `--only` value, the
 * config key, the logo basename and every flag that touches it.
 *
 * Naming:
 *   name        kebab-case — what `--only` and the CLI flags use
 *   configKey   camelCase  — what the `brand:` section of config.cjs uses
 *   logoBase    basename inside purgetss/brand/ that overrides this piece's art
 *
 * Modes:
 *   default     generated on every run
 *   convention  generated only when its logo file exists (or via --only)
 *   opt-in      generated only when its flag / config `enabled` says so
 *
 * @fileoverview Canonical brand piece table
 * @author César Estrada
 */

/**
 * @typedef {Object} BrandPiece
 * @property {string} name - kebab-case id used by the CLI and --only
 * @property {string} configKey - camelCase key inside `brand:` in config.cjs
 * @property {string} logoBase - basename in purgetss/brand/ ('logo-dark')
 * @property {string[]} cliLogoOptions - Commander keys that override the art
 * @property {string[]} cliPaddingOptions - Commander keys that override padding
 * @property {string[]} cliBackgroundOptions - Commander keys that override the background
 * @property {string[]} cliEnableOptions - Commander keys that switch an opt-in piece on
 * @property {string[]} cliDisableOptions - Commander keys (--no-x) that switch a default piece off
 * @property {boolean} showsPadding - whether the generated config block spells its padding out
 * @property {boolean} showsBackground - whether the generated config block spells its background out
 * @property {number|null} defaultPadding - built-in padding %, or null when the piece has none
 * @property {boolean} inheritsBackground - whether brand.background applies
 * @property {string|null} defaultBackground - used when the piece does not inherit
 * @property {string[]} groups - --only group names this piece belongs to
 * @property {Array<'ios'|'android'>} platforms - deployment targets that use the piece
 * @property {'default'|'convention'|'opt-in'} mode
 * @property {string} generates - human-readable description of the output
 * @property {string} section - heading used while logging
 */

/** @type {BrandPiece[]} */
export const BRAND_PIECES = [
  {
    name: 'icon',
    configKey: 'icon',
    logoBase: 'logo-icon',
    cliLogoOptions: ['iconLogo'],
    cliPaddingOptions: ['iosPadding'],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: [],
    showsPadding: true,
    showsBackground: false,
    defaultPadding: 0,
    inheritsBackground: true,
    defaultBackground: null,
    groups: ['ios'],
    platforms: ['ios'],
    mode: 'default',
    generates: 'DefaultIcon.png + DefaultIcon-ios.png',
    section: 'iOS & marketplace'
  },
  {
    name: 'dark',
    configKey: 'dark',
    logoBase: 'logo-dark',
    cliLogoOptions: ['darkLogo'],
    cliPaddingOptions: ['iosPadding'],
    cliBackgroundOptions: ['darkBgColor'],
    cliEnableOptions: [],
    cliDisableOptions: ['dark'],
    showsPadding: false,
    showsBackground: true,
    defaultPadding: 0,
    inheritsBackground: false, // transparent per Apple HIG unless asked otherwise
    defaultBackground: null,
    groups: ['ios'],
    platforms: ['ios'],
    mode: 'default',
    generates: 'DefaultIcon-Dark.png',
    section: 'iOS & marketplace'
  },
  {
    name: 'tinted',
    configKey: 'tinted',
    logoBase: 'logo-tinted',
    cliLogoOptions: ['tintedLogo'],
    cliPaddingOptions: ['iosPadding'],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: ['tinted'],
    showsPadding: false,
    showsBackground: false,
    defaultPadding: 0,
    inheritsBackground: false, // always flattened on black per Apple HIG
    defaultBackground: null,
    groups: ['ios'],
    platforms: ['ios'],
    mode: 'default',
    generates: 'DefaultIcon-Tinted.png',
    section: 'iOS & marketplace'
  },
  {
    name: 'ios-splash',
    configKey: 'iosSplash',
    logoBase: 'logo-ios-splash',
    cliLogoOptions: ['iosSplashLogo'],
    cliPaddingOptions: ['iosSplashPadding', 'splashPadding'],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: [],
    showsPadding: true,
    showsBackground: false,
    defaultPadding: 26,
    inheritsBackground: true,
    defaultBackground: null,
    groups: ['ios'],
    platforms: ['ios'],
    mode: 'default',
    generates: 'assets/iphone/Default*.png × 16',
    section: 'iOS & marketplace'
  },
  {
    name: 'launch-logo',
    configKey: 'launchLogo',
    logoBase: 'logo-launch',
    cliLogoOptions: ['launchLogo'],
    cliPaddingOptions: ['launchLogoPadding'],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: [],
    showsPadding: true,
    showsBackground: false,
    defaultPadding: 12,
    inheritsBackground: false, // transparent: the storyboard paints the background
    defaultBackground: null,
    groups: [],
    platforms: ['ios'],
    mode: 'convention',
    generates: 'LaunchLogo.png (1024×1024)',
    section: 'iOS & marketplace'
  },
  {
    name: 'marketplace',
    configKey: 'marketplace',
    logoBase: 'logo-marketplace',
    cliLogoOptions: ['marketplaceLogo'],
    cliPaddingOptions: ['iosPadding'],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: [],
    showsPadding: false,
    showsBackground: false,
    defaultPadding: 0,
    inheritsBackground: true,
    defaultBackground: null,
    groups: ['store'],
    platforms: ['ios', 'android'],
    mode: 'default',
    generates: 'iTunesConnect.png + MarketplaceArtwork.png',
    section: 'iOS & marketplace'
  },
  {
    name: 'feature-graphic',
    configKey: 'featureGraphic',
    logoBase: 'logo-feature-graphic',
    cliLogoOptions: ['featureGraphicLogo'],
    cliPaddingOptions: ['featureGraphicPadding'],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: [],
    showsPadding: true,
    showsBackground: false,
    defaultPadding: 12,
    inheritsBackground: true,
    defaultBackground: null,
    groups: ['store'],
    platforms: ['android'],
    mode: 'default',
    generates: 'MarketplaceArtworkFeature.png (1024×500)',
    section: 'iOS & marketplace'
  },
  {
    name: 'adaptive',
    configKey: 'adaptive',
    logoBase: 'logo-adaptive',
    cliLogoOptions: ['adaptiveLogo'],
    cliPaddingOptions: ['androidAdaptivePadding', 'padding'],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: [],
    showsPadding: true,
    showsBackground: false,
    defaultPadding: 18,
    inheritsBackground: true,
    defaultBackground: null,
    groups: ['android'],
    platforms: ['android'],
    mode: 'default',
    generates: 'ic_launcher_{foreground,background,monochrome}.png × 5 + ic_launcher.xml',
    section: 'Android'
  },
  {
    name: 'legacy-icon',
    configKey: 'legacyIcon',
    logoBase: 'logo-legacy-icon',
    cliLogoOptions: ['legacyIconLogo'],
    cliPaddingOptions: ['androidLegacyPadding', 'padding'],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: [],
    showsPadding: true,
    showsBackground: false,
    defaultPadding: 10,
    inheritsBackground: true,
    defaultBackground: null,
    groups: ['android'],
    platforms: ['android'],
    mode: 'default',
    generates: 'ic_launcher.png × 5',
    section: 'Android'
  },
  {
    name: 'appicon',
    configKey: 'appicon',
    logoBase: 'logo-appicon',
    cliLogoOptions: ['appiconLogo'],
    cliPaddingOptions: [],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: [],
    showsPadding: false,
    showsBackground: false,
    defaultPadding: 10,
    inheritsBackground: true,
    defaultBackground: null,
    groups: ['android'],
    platforms: ['android'],
    mode: 'default',
    generates: 'appicon.png (128×128)',
    section: 'Android'
  },
  {
    name: 'android-splash',
    configKey: 'androidSplash',
    logoBase: 'logo-android-splash',
    cliLogoOptions: ['androidSplashLogo'],
    cliPaddingOptions: ['androidSplashPadding', 'splashPadding'],
    cliBackgroundOptions: [],
    cliEnableOptions: [],
    cliDisableOptions: [],
    showsPadding: true,
    showsBackground: false,
    defaultPadding: 26,
    inheritsBackground: true,
    defaultBackground: null,
    groups: ['android'],
    platforms: ['android'],
    mode: 'default',
    generates: 'assets/android/default.png + images/res-*/default.png × 11',
    section: 'Android'
  },
  {
    name: 'splash-icon',
    configKey: 'splashIcon',
    logoBase: 'logo-splash-icon',
    cliLogoOptions: ['splashIconLogo'],
    cliPaddingOptions: [],
    cliBackgroundOptions: [],
    cliEnableOptions: ['splashIcon'],
    cliDisableOptions: [],
    showsPadding: false,
    showsBackground: false,
    defaultPadding: null,
    inheritsBackground: true,
    defaultBackground: null,
    groups: [],
    platforms: ['android'],
    mode: 'opt-in',
    generates: 'drawable-*/splash_icon.png × 5',
    section: 'Android'
  },
  {
    name: 'notification-icon',
    configKey: 'notificationIcon',
    logoBase: 'logo-notification-icon',
    cliLogoOptions: ['notificationIconLogo'],
    cliPaddingOptions: [],
    cliBackgroundOptions: [],
    cliEnableOptions: ['notificationIcon'],
    cliDisableOptions: [],
    showsPadding: false,
    showsBackground: false,
    defaultPadding: null,
    inheritsBackground: false, // white + alpha, no background involved
    defaultBackground: null,
    groups: [],
    platforms: ['android'],
    mode: 'opt-in',
    generates: 'drawable-*/ic_stat_notify.png × 5',
    section: 'Android'
  },
  {
    name: 'nine-patch',
    configKey: 'ninePatch',
    logoBase: 'logo-nine-patch',
    cliLogoOptions: [],
    cliPaddingOptions: [],
    cliBackgroundOptions: [],
    cliEnableOptions: ['ninePatch'],
    cliDisableOptions: [],
    showsPadding: false,
    showsBackground: false,
    defaultPadding: null,
    inheritsBackground: true,
    defaultBackground: null,
    groups: [],
    platforms: ['android'],
    mode: 'opt-in',
    generates: 'background.9.png (not implemented yet)',
    section: 'Android'
  }
]

/**
 * Shortcuts accepted by --only. A group expands to its member pieces, in
 * pipeline order.
 */
export const BRAND_GROUPS = {
  ios: ['icon', 'dark', 'tinted', 'ios-splash'],
  store: ['marketplace', 'feature-graphic'],
  android: ['adaptive', 'legacy-icon', 'appicon', 'android-splash']
}

/** Keys allowed at the top level of `brand:`, outside the piece blocks. */
export const BRAND_TOP_LEVEL_KEYS = ['background', 'confirmOverwrites', 'optimize', 'logo', 'monochromeLogo']

/** Keys allowed inside a piece block. */
export const BRAND_PIECE_KEYS = ['logo', 'padding', 'background', 'enabled']

const BY_NAME = new Map(BRAND_PIECES.map((piece) => [piece.name, piece]))
const BY_CONFIG_KEY = new Map(BRAND_PIECES.map((piece) => [piece.configKey, piece]))

/** @returns {string[]} Every piece name, in pipeline order */
export function listPieceNames() {
  return BRAND_PIECES.map((piece) => piece.name)
}

/** @returns {string[]} The pieces generated when no --only filter is given */
export function listDefaultPieceNames() {
  return BRAND_PIECES.filter((piece) => piece.mode === 'default').map((piece) => piece.name)
}

/**
 * @param {string} name - kebab piece name
 * @returns {BrandPiece|undefined}
 */
export function getPiece(name) {
  return BY_NAME.get(name)
}

/**
 * @param {string} configKey - camelCase key used inside `brand:`
 * @returns {BrandPiece|undefined}
 */
export function getPieceByConfigKey(configKey) {
  return BY_CONFIG_KEY.get(configKey)
}

/**
 * Parse the value of --only into a list of piece names.
 *
 * Groups expand to their members, and the result keeps pipeline order
 * regardless of how it was typed. An unknown token throws — the caller aborts
 * before writing anything.
 *
 * @param {string} value - Raw --only value ('ios,notification-icon')
 * @returns {string[]} Piece names in pipeline order
 */
export function parseOnlySelection(value) {
  const tokens = String(value ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)

  if (tokens.length === 0) {
    throw new Error(`--only needs at least one piece or group.\n${describeValidSelectors()}`)
  }

  const selected = new Set()

  for (const token of tokens) {
    const group = BRAND_GROUPS[token]
    if (group) {
      for (const name of group) selected.add(name)
      continue
    }

    if (!BY_NAME.has(token)) {
      throw new Error(`Unknown --only value: "${token}".\n${describeValidSelectors()}`)
    }
    selected.add(token)
  }

  return listPieceNames().filter((name) => selected.has(name))
}

/**
 * @returns {string} Multi-line help listing every valid --only token
 */
export function describeValidSelectors() {
  const pieces = listPieceNames().join(', ')
  const groups = Object.entries(BRAND_GROUPS)
    .map(([name, members]) => `    ${name} = ${members.join(', ')}`)
    .join('\n')

  return `  Pieces: ${pieces}\n  Groups:\n${groups}`
}
