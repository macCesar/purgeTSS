/**
 * Completions2 - ESM Migration v7
 * Migrated from v6 with identical functionality
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import _ from 'lodash'
import chalk from 'chalk'
let saveGlossary = false

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)
const cwd = process.cwd()
import { colores } from '../src/shared/brand-colors.js'
export { colores }
const purgeLabel = colores.purgeLabel

import * as helpers from '../src/shared/helpers.js'
import { getConfigFile } from '../src/shared/config-manager.js'
import { projectsConfigJS } from '../src/shared/constants.js'
const tiCompletionsFile = require('../lib/completions/titanium/completions-v3.json')

const logger = {
  info: (...args) => console.log(purgeLabel, args.join(' ')),
  warn: (...args) => console.log(purgeLabel, chalk.yellow(args.join(' '))),
  error: (...args) => console.log(purgeLabel, chalk.red(args.join(' '))),
  file: (...args) => console.log(purgeLabel, chalk.yellow(args.join(' ')), 'file created!')
}

let configFile = getConfigFile()
configFile.purge = configFile.purge ?? { mode: 'all' }
configFile.theme = configFile.theme ?? {}
configFile.theme.extend = configFile.theme.extend ?? {}

let configOptions = (configFile.purge && configFile.purge.options) ? configFile.purge.options : {}
if (configOptions) {
  configOptions.plugins = configOptions.plugins ?? []
  configOptions.safelist = configOptions.safelist ?? []
  configOptions.missing = configOptions.missing ?? true
  configOptions.widgets = configOptions.widgets ?? false
}

function autoBuildTailwindTSS(options = {}) {
  // Refresh config at the start of the function to ensure it's up-to-date
  configFile = getConfigFile()
  configFile.purge = configFile.purge ?? { mode: 'all' }
  configFile.theme = configFile.theme ?? {}
  configFile.theme.extend = configFile.theme.extend ?? {}

  configOptions = (configFile.purge && configFile.purge.options) ? configFile.purge.options : {}
  if (configOptions) {
    configOptions.plugins = configOptions.plugins ?? []
    configOptions.safelist = configOptions.safelist ?? []
    configOptions.missing = configOptions.missing ?? true
    configOptions.widgets = configOptions.widgets ?? false
  }

  saveGlossary = options.glossary ?? false
  let tailwindStyles = fs.readFileSync(path.resolve(__dirname, '../lib/templates/tailwind/template.tss'), 'utf8')
  tailwindStyles += fs.readFileSync(path.resolve(__dirname, '../lib/templates/tailwind/custom-template.tss'), 'utf8')
  tailwindStyles += (fs.existsSync(projectsConfigJS)) ? `// config.js file updated on: ${getFileUpdatedDate(projectsConfigJS)}\n` : '// default config.js file\n'

  const baseValues = combineDefaultThemeWithConfigFile()
  const completionsPropertiesWithBaseValues = setBaseValuesToProperties(getPropertiesFromTiCompletionsFile(), baseValues)

  const tiUIComponents = getTiUIComponents(baseValues)
  tailwindStyles += processTitaniumRules(tiUIComponents)
  tailwindStyles += processCustomClasses()
  tailwindStyles += processCompoundClasses(baseValues)
  tailwindStyles += processCompletionsClasses(completionsPropertiesWithBaseValues)

  tailwindStyles = helpers.compileApplyDirectives(tailwindStyles)

  if (fs.existsSync(projectsConfigJS)) {
    makeSureFolderExists(cwd + '/purgetss/styles/')
    saveFile(cwd + '/purgetss/styles/tailwind.tss', tailwindStyles)
    logger.file('./purgetss/styles/tailwind.tss')
  } else {
    saveFile(path.resolve(__dirname, '../dist/tailwind.tss'), tailwindStyles)
    logger.file('./dist/tailwind.tss')
  }
}
export { autoBuildTailwindTSS }

function processCustomClasses() {
  let tailwindStyles = ''

  if (Object.keys(configFile.theme).length) {
    _.each(configFile.theme, (value, key) => {
      if (key !== 'extend') {
        const theClasses = helpers.customRules(value, key)
        tailwindStyles += theClasses
      }
    })
  }

  if (tailwindStyles !== '') return `\n// Custom Classes\n${tailwindStyles}// End of Custom Classes\n`

  return ''
}

function processTitaniumRules(_propertiesOnly) {
  const currentLegacyOption = helpers.globalOptions.legacy
  helpers.globalOptions.legacy = true
  let customRules = '\n// Ti Elements'
  _.each(_propertiesOnly, (value, key) => {
    const property = `\n// Property: ${key}\n`
    const description = `// Description: ${value.description.replace(/\n/g, ' ')}\n`
    customRules += property + description + helpers.customRules(value.base, key, false)
  })

  helpers.globalOptions.legacy = currentLegacyOption

  if (customRules !== '\n// Ti Elements\n') return customRules

  return ''
}

function processCompletionsClasses(_completionsWithBaseValues) {
  let processedClasses = ''

  _.each(_completionsWithBaseValues, (data, key) => {
    const theClasses = generateCombinedClasses(key, data)
    if (theClasses) {
      generateGlossary(key, theClasses, data)
      processedClasses += theClasses
    }
  })

  return processedClasses
}

function generateGlossary(_key, _theClasses, _keyName = null) {
  let baseDestinationFolder = ''
  if (!fs.existsSync(projectsConfigJS)) baseDestinationFolder = path.resolve(__dirname, '../dist/glossary/')
  else if (saveGlossary) baseDestinationFolder = cwd + '/purgetss/glossary/'

  if (baseDestinationFolder !== '') {
    makeSureFolderExists(baseDestinationFolder)

    let destinationFolder = ''

    if (_keyName) {
      if (_key.includes('color') || _key.includes('Color') || _key.includes('colors') || _key === 'tint') {
        destinationFolder = baseDestinationFolder + '/colorProperties'
      } else if (Object.entries(_keyName.base).length) {
        destinationFolder = baseDestinationFolder + '/configurableProperties'
      } else if (_keyName.type === 'Boolean') {
        destinationFolder = baseDestinationFolder + '/booleanProperties'
      } else {
        destinationFolder = baseDestinationFolder + '/constantProperties'
      }
    } else {
      if (_key.includes('color') || _key.includes('Color') || _key.includes('colors')) {
        destinationFolder = baseDestinationFolder + '/colorProperties'
      } else {
        destinationFolder = baseDestinationFolder + '/compoundClasses'
      }
    }

    makeSureFolderExists(destinationFolder)
    saveFile(`${destinationFolder}/${_key}.md`, '```css' + _theClasses + '```\n')
  }

  return _theClasses
}

function setBaseValuesToProperties(_allProperties, _base) {
  let allKeys = ''
  _.each(_allProperties, (data, key) => {
    const activeKey = findBaseKey(key, data)
    allKeys += `${key}\n`
    _allProperties[key].base = combineKeys(configFile.theme, _base[key] ?? _base[activeKey], key)
  })

  return _allProperties
}

function getTiUIComponents(_base) {
  const propertiesOnly = {}
  _.each(tiCompletionsFile.types, (value, key) => {
    if (key.includes('Ti.UI.') || key.includes('Ti.Android.')) {
      const _key = key.replace('Ti.UI.', '').replace('Ti.Android.', '')
      const combinedKeys = combineKeys(configFile.theme, _base[_key], _key)
      if (combinedKeys) {
        delete configFile.theme[_key]
        if (!propertiesOnly[_key] && Object.keys(combinedKeys).length) {
          propertiesOnly[_key] = {
            base: combinedKeys,
            description: value.description
          }
        }
      }
    }
  })

  return propertiesOnly
}

function processCompoundClasses({ ..._base }) {
  let compoundClasses = ''
  const compoundTemplate = require('../lib/templates/tailwind/compoundTemplate.json')

  _.each(compoundTemplate, (value, key) => {
    compoundClasses += generateGlossary(key, helpers.processProperties(value.description, value.template, value.base ?? { default: _base[key] }))
  })

  // Fixed values
  compoundClasses += generateGlossary('anchorPoint', helpers.anchorPoint())
  compoundClasses += generateGlossary('autocapitalization-alternative', helpers.autocapitalization())
  compoundClasses += generateGlossary('backgroundGradient-linear', helpers.backgroundLinearGradient())
  compoundClasses += generateGlossary('backgroundGradient-radial', helpers.backgroundRadialGradient())
  compoundClasses += generateGlossary('clipMode', helpers.clipMode())
  compoundClasses += generateGlossary('constraint', helpers.constraint())
  compoundClasses += generateGlossary('content-height-and-width', helpers.contentHeightAndWidth())
  compoundClasses += generateGlossary('curve-alternative', helpers.curve())
  compoundClasses += generateGlossary('defaultItemTemplate', helpers.defaultItemTemplate())
  compoundClasses += generateGlossary('displayCaps', helpers.displayCaps())
  compoundClasses += generateGlossary('draggingType', helpers.draggingType())
  compoundClasses += generateGlossary('dropShadow', helpers.dropShadow())
  compoundClasses += generateGlossary('ellipsize-alternative', helpers.ellipsize())
  compoundClasses += generateGlossary('filterAttribute', helpers.filterAttribute())
  compoundClasses += generateGlossary('flip', helpers.flip())
  compoundClasses += generateGlossary('fontStyle', helpers.fontStyle())
  compoundClasses += generateGlossary('grid-cols-rows-span', helpers.gridColumnsRowsStartEnd())
  compoundClasses += generateGlossary('gridFlow', helpers.gridFlow())
  compoundClasses += generateGlossary('gridSystem', helpers.gridSystem())
  compoundClasses += generateGlossary('items', helpers.items())
  compoundClasses += generateGlossary('navigationMode', helpers.navigationMode())
  compoundClasses += generateGlossary('orientationModes', helpers.orientationModes())
  compoundClasses += generateGlossary('placement', helpers.placement())
  compoundClasses += generateGlossary('progressBarStyle', helpers.progressBarStyle())
  compoundClasses += generateGlossary('scrollType', helpers.scrollType())
  compoundClasses += generateGlossary('showScrollIndicators', helpers.scrollIndicators())
  compoundClasses += generateGlossary('statusBarStyle-alternative', helpers.statusBarStyle())
  compoundClasses += generateGlossary('theme', helpers.theme())
  compoundClasses += generateGlossary('tiMedia', helpers.tiMedia(false))
  compoundClasses += generateGlossary('titleAttributesShadow-alternative', helpers.titleAttributesShadow())
  compoundClasses += generateGlossary('toggle', helpers.toggle())
  compoundClasses += generateGlossary('touchEnabled-alternative', helpers.touchEnabled())
  compoundClasses += generateGlossary('viewShadowOffset', helpers.viewShadowV6())
  compoundClasses += generateGlossary('visible-alternative', helpers.visible())

  // ! Configurables
  compoundClasses += generateGlossary('borderRadius-alternative', helpers.borderRadius(_base.borderRadius))
  compoundClasses += generateGlossary('borderRadius-full', helpers.borderRadiusFull(_base.borderRadius))
  compoundClasses += generateGlossary('fontFamily', helpers.fontFamily(_base.fontFamily))
  compoundClasses += generateGlossary('fontSize', helpers.fontSize(_base.fontSize))
  compoundClasses += generateGlossary('fontWeight', helpers.fontWeight(_base.fontWeight))
  compoundClasses += generateGlossary('margin-alternative', helpers.gap(_base.margin))
  compoundClasses += generateGlossary('minimumFontSize', helpers.minimumFontSize(_base.fontSize))
  compoundClasses += generateGlossary('padding-alternative', helpers.padding(_base.padding))
  compoundClasses += generateGlossary('rotate-negative-values', helpers.negativeRotate(_base.rotate))
  compoundClasses += generateGlossary('zoom-in-out', helpers.zoomIn(_base.scale))
  compoundClasses += generateGlossary('widthHeight', helpers.widthHeight(_base.widthHeight))
  compoundClasses += generateGlossary('size', helpers.size(_base.size))

  // ! colors
  compoundClasses += generateGlossary('backgroundGradient', helpers.backgroundGradient(combineKeys(configFile.theme, _base.colors, 'backgroundGradient')))
  compoundClasses += generateGlossary('backgroundSelectedGradient', helpers.backgroundSelectedGradient(combineKeys(configFile.theme, _base.colors, 'backgroundSelectedGradient')))
  compoundClasses += generateGlossary('color-alternative', helpers.textColor(_base.textColor))
  compoundClasses += generateGlossary('hintTextColor', helpers.placeholder(combineKeys(configFile.theme, _base.colors, 'hintTextColor')))
  // compoundClasses += generateGlossary('tint', helpers.tint(combineKeys(configFile.theme, _base.colors, 'tint')))
  compoundClasses += generateGlossary('tintColor', helpers.tintColor(combineKeys(configFile.theme, _base.colors, 'tintColor')))
  compoundClasses += generateGlossary('titleAttributes-color', helpers.titleAttributesColor(combineKeys(configFile.theme, _base.colors, 'titleAttributesColor')))
  compoundClasses += generateGlossary('titleAttributes-shadow-color', helpers.titleAttributesShadowColor(combineKeys(configFile.theme, _base.colors, 'titleAttributesShadowColor')))

  return compoundClasses
}

function findBaseKey(_key, _data) {
  if (_key.includes('color') || _key.includes('Color') || _key === 'tint') {
    return 'colors'
  } else if (_key.includes('spacing') || _key.includes('Spacing')) {
    return 'spacing'
  } else if (_key === 'duration' || _key === 'timeout' || _key.includes('Timeout')) {
    return 'delay'
  } else if (_key === 'pagingControlAlpha') {
    return 'opacity'
  } else if (_key === 'lines' || _key === 'columnCount' || _key === 'rowCount' || _key === 'repeatCount' || _key === 'maxLines') {
    return 'count' // 1-12
  } else if (_key === 'activeTab' || _key === 'cacheSize') {
    return 'repeat' // 0-12
  } else if (((_key.includes('scale') || _key.includes('Scale')) && _data.type !== 'Boolean')) {
    return 'scale'
  } else if (_key === 'shadowRadius' || _key === 'separatorHeight' || _key.includes('RowHeight') || _key === 'rowHeight' || _key === 'elevation' || _key === 'maxElevation' || _key === 'indentionLevel' || _key === 'keyboardToolbarHeight' || _key === 'maximumLineHeight' || _key === 'yOffset' || _key === 'xOffset' || _key === 'pagingControlHeight' || _key === 'pageWidth' || _key === 'pageHeight' || _key === 'uprightWidth' || _key === 'uprightHeight' || _key === 'backgroundLeftCap' || _key === 'backgroundTopCap' || _key === 'contentWidth' || _key === 'contentHeight' || ((_key.includes('Padding') || _key.includes('padding') || _key === 'leftTrackLeftCap' || _key === 'leftTrackTopCap' || _key === 'rightTrackLeftCap' || _key === 'rightTrackTopCap') && _data.type !== 'Boolean')) {
    return 'noFractions'
  } else if (_key === 'top' || _key === 'bottom' || _key === 'left' || _key === 'right') {
    return 'margin'
  } else if ((_key.includes('height') || _key.includes('Height')) && _key !== 'platformHeight') {
    return 'height'
  } else if ((_key.includes('width') || _key.includes('Width')) && _key !== 'platformWidth') {
    return 'width'
  } else if (_key === 'shiftMode') {
    return 'shiftMode'
  }

  return _key
}

function combineDefaultThemeWithConfigFile() {
  const defaultColors = require('tailwindcss/colors')
  const defaultTheme = require('tailwindcss/defaultTheme')
  const defaultThemeWidth = defaultTheme.width({ theme: () => (defaultTheme.spacing) })
  const defaultThemeHeight = defaultTheme.height({ theme: () => (defaultTheme.spacing) })
  const defaultThemeSize = defaultTheme.size({ theme: () => (defaultTheme.spacing) })

  removeDeprecatedColors(defaultColors)

  const tiResets = { full: '100%' }
  const allWidthsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth }
  const allHeightsCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeHeight }
  const allSpacingCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeWidth, ...defaultThemeHeight }
  const allSizesCombined = (configFile.theme.spacing) ? { ...configFile.theme.spacing, ...tiResets } : { ...defaultThemeSize }

  const themeOrDefaultValues = {
    width: configFile.theme.width ?? allWidthsCombined,
    height: configFile.theme.height ?? allHeightsCombined,
    spacing: configFile.theme.spacing ?? allSpacingCombined,
    size: configFile.theme.spacing ?? allSizesCombined,
    fontSize: configFile.theme.spacing ?? defaultTheme.fontSize,
    minimumFontSize: configFile.theme.spacing ?? defaultTheme.minimumFontSize,
    colors: configFile.theme.colors ?? { transparent: 'transparent', ...defaultColors }
  }

  removeUnnecesaryValues(themeOrDefaultValues)
  fixDefaultScale(defaultTheme.scale)

  const base = {
    colors: {},
    spacing: {},
    size: {},
    width: {},
    height: {},
    widthHeight: {},
    boolean: { default: true, false: false },
    shiftMode: { none: 0, title: 1, icon: 2 },
    rotate: combineKeys(configFile.theme, { ...defaultTheme.rotate, ...{ 135: '135deg', 225: '225deg', 270: '270deg', 315: '315deg', 360: '360deg' } }, 'rotate'),
    zIndex: defaultTheme.zIndex,
    opacity: defaultTheme.opacity,
    fontWeight: defaultTheme.fontWeight,
    borderWidth: combineKeys(configFile.theme, { ...removePxFromDefaultTheme(defaultTheme.borderWidth), ...{ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 } }, 'borderWidth'),
    fontSize: { ...themeOrDefaultValues.fontSize, ...configFile.theme.extend.spacing, ...configFile.theme.extend.fontSize },
    minimumFontSize: { ...themeOrDefaultValues.minimumFontSize, ...configFile.theme.extend.spacing, ...configFile.theme.extend.minimumFontSize },
    verticalMargin: { top: '-0.5', bottom: '0.5', middle: '0' },
    horizontalMargin: { left: '-0.5', right: '0.5', center: '0' },
    scale: { ...{ 1: '0.01', 5: '0.05', 10: '0.10', 25: '0.25', 200: 2 }, ...defaultTheme.scale },
    moveByProperties: { default: true, false: false },
    moveByAnimate: { default: true, false: false },
    moveByAnimation: { default: true, false: false },
    repeat: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
    count: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12 },
    delay: { ...{ 0: '0ms', 25: '25ms', 50: '50ms', 250: '250ms', 350: '350ms', 400: '400ms', 450: '450ms', 600: '600ms', 800: '800ms', 900: '900ms', 2000: '2000ms', 3000: '3000ms', 4000: '4000ms', 5000: '5000ms' }, ...defaultTheme.transitionDelay }
  }

  _.merge(base.colors, themeOrDefaultValues.colors, configFile.theme.extend.colors)
  _.merge(base.size, themeOrDefaultValues.spacing, configFile.theme.extend.spacing)
  _.merge(base.spacing, themeOrDefaultValues.spacing, configFile.theme.extend.spacing)

  _.merge(base.width, themeOrDefaultValues.spacing, configFile.theme.extend.spacing, themeOrDefaultValues.width, configFile.theme.extend.width)
  _.merge(base.height, themeOrDefaultValues.spacing, configFile.theme.extend.spacing, themeOrDefaultValues.height, configFile.theme.extend.height)
  _.merge(base.widthHeight, base.width, base.height)

  fixPercentages(base.size)
  fixPercentages(base.width)
  fixPercentages(base.height)
  fixPercentages(base.spacing)
  // fixfontSize(base.fontSize);

  // ! Extras...
  base.transitionDuration = { ...base.delay, ...defaultTheme.transitionDuration }
  base.fontFamily = combineKeys(configFile.theme, {}, 'fontFamily')
  base.fontSize = combineKeys(configFile.theme, base.fontSize, 'fontSize')
  base.fontWeight = combineKeys(configFile.theme, defaultTheme.fontWeight, 'fontWeight')
  base.textColor = combineKeys(configFile.theme, base.colors, 'textColor')

  base.margin = combineKeys(configFile.theme, base.spacing, 'margin')
  base.padding = combineKeys(configFile.theme, helpers.removeFractions(base.spacing, ['full', 'auto', 'screen']), 'padding')
  base.countDownDuration = { ...base.delay, ...defaultTheme.transitionDuration }
  base.noFractions = helpers.removeFractions(base.spacing, ['full', 'auto', 'screen'])
  base.minimumFontSize = combineKeys(configFile.theme, base.fontSize, 'minimumFontSize')

  // combineKeys(configFile.theme, (configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, 'borderRadius');
  base.borderRadius = helpers.processBorderRadius(helpers.removeFractions((configFile.theme.spacing || configFile.theme.borderRadius) ? {} : { ...defaultTheme.borderRadius, ...base.spacing }, ['full', 'auto', 'screen']))

  _.each(base, (_value, key) => {
    delete configFile.theme[key]
  })

  base.margin.auto = 'null'
  delete base.margin.screen
  delete base.zIndex.auto

  // ! Process custom Window, View and ImageView
  base.Window = (configFile.theme.Window && configFile.theme.Window.apply)
    ? _.merge({ apply: configFile.theme.Window.apply }, configFile.theme.Window)
    : _.merge({ default: { backgroundColor: '#FFFFFF' } }, configFile.theme.Window)

  base.ImageView = (configFile.theme.ImageView && configFile.theme.ImageView.apply)
    ? _.merge({ apply: configFile.theme.ImageView.apply }, { ios: { hires: true } }, configFile.theme.ImageView)
    : _.merge({ ios: { hires: true } }, configFile.theme.ImageView)

  base.View = (configFile.theme.View && configFile.theme.View.apply)
    ? _.merge({ apply: configFile.theme.View.apply }, configFile.theme.View)
    : _.merge({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, configFile.theme.View)

  // !Delete plugins specified in the config file
  const deletePlugins = checkDeletePlugins()
  _.each(deletePlugins, value => {
    delete base[value]
    delete configFile.theme[value]
    delete configFile.theme.extend[value]
  })

  return base
}

function checkDeletePlugins() {
  const deletePlugins = configFile.plugins ?? configOptions.plugins
  return Array.isArray(deletePlugins) ? deletePlugins : Object.keys(deletePlugins).map(key => key)
}

// ! Helper Functions
function removeDeprecatedColors(theObject) {
  delete theObject.blueGray
  delete theObject.coolGray
  delete theObject.current
  delete theObject.inherit
  delete theObject.lightBlue
  delete theObject.trueGray
  delete theObject.warmGray
}

function removeUnnecesaryValues(theObject) {
  delete theObject.width.fit
  delete theObject.width.max
  delete theObject.width.min
  delete theObject.width.svw
  delete theObject.width.lvw
  delete theObject.width.dvw

  delete theObject.height.fit
  delete theObject.height.max
  delete theObject.height.min
  delete theObject.height.svh
  delete theObject.height.lvh
  delete theObject.height.dvh

  delete theObject.spacing.fit
  delete theObject.spacing.max
  delete theObject.spacing.min
  delete theObject.spacing.svw
  delete theObject.spacing.lvw
  delete theObject.spacing.dvw
  delete theObject.spacing.svh
  delete theObject.spacing.lvh
  delete theObject.spacing.dvh
}

function fixPercentages(theObject) {
  _.each(theObject, (value, key) => {
    if (value.toString().includes('.333333%')) theObject[key] = value.replace('.333333%', '.333334%')
  })
}

function removePxFromDefaultTheme(theObject) {
  _.each(theObject, (value, key) => {
    if (value.toString().includes('px')) theObject[key] = value.replace('px', '')
  })

  return theObject
}

function fixfontSize(theObject) {
  _.each(theObject, value => {
    if (value.length > 1) value.pop()
  })
}

function combineKeys(values, base, key) {
  return (values[key]) ? { ...values[key], ...values.extend[key] } : { ...base, ...values.extend[key] }
}

function getPropertiesFromTiCompletionsFile() {
  const propertiesOnly = {}

  const properties = [
    // ! Deprecated or Custom Process
    'handlePlatformUrl',
    'hidden',
    // 'selectionIndicator',
    'semanticColorType',
    'splitActionBar',
    'supported',
    'tabsTintColor',
    'tintColor',
    'unselectedItemTintColor',
    'wordWrap',

    // ! Readonly
    'activationState',
    'animating',
    'batteryState',
    'DIST_ADHOC',
    'DIST_STORE',
    'ENV_DEV',
    'ENV_DEVELOPMENT',
    'ENV_PROD',
    'ENV_PRODUCTION',
    'ENV_TEST',
    'externalPlaybackActive',
    'focused',
    'hasContentPending',
    'isActivated',
    'isAdvertisingTrackingEnabled',
    'isComplicationEnabled',
    'isPaired',
    'isReachable',
    'isSupported',
    'isWatchAppInstalled',
    'landscape',
    'muted',
    'orientation',
    'OS_ANDROID',
    'OS_IOS',
    'paused',
    'playing',
    'portrait',
    'safeAreaPadding',
    'specified',
    'waiting',

    // ! fs. properties
    'bigint',
    'executable',
    'force',
    'readonly',
    'recursive',
    'remoteBackup',
    'symbolicLink',
    'withFileTypes',
    'writable',
    'UIApplicationOpenURLOptionsOpenInPlaceKey',
    'UIApplicationOpenURLOptionUniversalLinksOnly',

    // ! Handled by PurgeTSS
    'fontFamily',
    'fontSize',
    'fontWeight',
    'minimumFontSize',
    'orientationModes',
    'size',
    'textColor'
  ]

  _.each(tiCompletionsFile.types, (value, key) => {
    _.each(value.properties, property => {
      if (validTypesOnly(property, key) && !properties.includes(property)) {
        if (!propertiesOnly[property]) {
          propertiesOnly[property] = tiCompletionsFile.properties[property]
          propertiesOnly[property].modules = []
        }
        propertiesOnly[property].modules.push(key)
      }
    })
  })

  return propertiesOnly
}

function getFileUpdatedDate(_path) {
  return fs.statSync(_path).mtime
}

function saveFile(file, data) {
  fs.writeFileSync(file, data, err => {
    throw err
  })
}

function validTypesOnly(property, key) {
  return key.includes('Ti.UI.') ||
    tiCompletionsFile.properties[property].type === 'Boolean' ||
    tiCompletionsFile.properties[property].type === 'Point' ||
    tiCompletionsFile.properties[property].type === 'Number' ||
    tiCompletionsFile.properties[property].type === 'Array' ||
    tiCompletionsFile.properties[property].type === 'String'
}

function fixDefaultScale(values) {
  _.each(values, (value, key) => {
    if (value.startsWith('.')) values[key] = '0' + value
  })

  return values
}

function processComments(key, data) {
  let myComments = ''

  myComments += `\n// Property: ${key}`

  if (data.description) myComments += `\n// Description: ${data.description.replace(/\n/g, ' ').replace(/<code>|<\/code>/g, '').replace(/<strong>|<\/strong>/g, '').replace(/<em>|<\/em>/g, '').replace(/<a[^>]*>|<\/a>/g, '')}`

  if (data.modules) myComments += `\n// Component(s): ${data.modules.join(', ')}\n`

  return myComments
}

function generateCombinedClasses(key, data) {
  let myClasses = ''
  const comments = processComments(key, data)

  if (Object.entries(data.base).length) {
    _.each(data.base, (value, _key) => {
      if (typeof value === 'object') {
        _.each(value, (_value, __key) => {
          myClasses += `'.${setModifier(removeUneededVariablesFromPropertyName(camelCaseToDash(key + '-' + _key + '-' + __key)))}': { ${key}: ${helpers.parseValue(_value)} }\n`
        })
      } else {
        myClasses += `'.${setModifier(removeUneededVariablesFromPropertyName(camelCaseToDash(key + '-' + _key)))}': { ${key}: ${helpers.parseValue(value)} }\n`
      }
    })
  } else {
    _.each(data.values, (_value, _key) => {
      if (!_value.includes('deprecated')) myClasses += formatClass(key, _value)
    })
  }

  if (myClasses !== '') return comments + myClasses

  return false
}

function saveAutoTSS(key, classes) {
  if (fs.existsSync(projectsConfigJS) && saveGlossary) {
    makeSureFolderExists(cwd + '/purgetss/experimental/tailwind-classes/')
    saveFile(cwd + `/purgetss/experimental/tailwind-classes/${key}.tss`, classes)
  }
}

function formatClass(key, value) {
  return `'.${formatClassName(key, value)}': { ${key}: ${value} }\n`
}

function formatClassName(property, value) {
  return setModifier(removeUneededVariablesFromPropertyName(camelCaseToDash(`${property}-${removeModuleName(value, property)}`)))
}

function removeUneededVariablesFromPropertyName(property) {
  return Array.from(new Set(property.split('-')))
    .join('-')
    // .replace('-ti-platform-android', '')
    // .replace('-android', '')

    .replace('-default', '')
    .replace('-input-buttonmode', '')
    .replace('-option-', '-')
    .replace('-ti-confidential-', '-')
    .replace('-ti-platform', '')
    .replace('-ti-', '-')
    .replace('-true', '')
    .replace('-user-notification', '')
    .replace('-user-setting', '')
    .replace('align-alignment-', '')
    .replace('autolink', '')
    .replace('background-', 'bg-')
    .replace('bg-repeat', 'background-repeat')
    .replace('border-width', 'border')
    .replace('color-', '')
    .replace('column-', 'col-')
    .replace('edges-edge', 'edges')
    .replace('flag-', '')
    .replace('height-', 'h-')
    .replace('input-borderstyle-', '')
    .replace('layout-', '')
    .replace('prevent-image', 'prevent-default-image')
    .replace('recurrencefrequency', 'recurrence')
    .replace('returnkey-', '')
    .replace('text-alignment-', 'text-')
    .replace('width-', 'w-')
    .replace('-bg-false', '-background-false') // special case for allowBackground: false
    .replace(/--/g, '-')
}

function setModifier(_modifier) {
  if (_modifier.includes('-i-os')) {
    // some classes ended up with '-i-os' in their names after processing, this is to clear it.
    _modifier = _modifier.replace('-i-os', '') + '[platform=ios]'
  } else if (_modifier.includes('-android')) {
    _modifier = _modifier.replace('-android', '') + '[platform=android]'
  } else if (_modifier.includes('-handheld-')) {
    _modifier = _modifier.replace('-handheld-', '-') + '[formFactor=handheld]'
  } else if (_modifier.includes('-tablet-')) {
    _modifier = _modifier.replace('-tablet-', '-') + '[formFactor=tablet]'
  } else if (_modifier.includes('[if=')) {
    let ifStatement = _modifier.match(/\[if=(.*?)\]/)
    if (ifStatement) {
      ifStatement = ifStatement[0]
      _modifier = _modifier.replace(/\[if=(.*?)\]-/, '')
      _modifier = _modifier + `${ifStatement}`
    }
  }

  return _modifier
}

function defaultModifier(modifier) {
  return modifier === '' || modifier === null || modifier === 'global' || modifier === 'default' || modifier === 'DEFAULT'
}

function notDefaultRules(rule) {
  return rule !== '' && rule !== null && rule !== 'global' && rule !== 'default' && rule !== 'DEFAULT' && rule !== 'ios' && rule !== 'android' && rule !== 'android' && rule !== 'handheld' && rule !== 'tablet' && !rule.startsWith('[if=')
}

function camelCaseToDash(str) {
  return (str.includes('[')) ? str : str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function removeModuleName(value, property) {
  return camelCaseToDash(value
    // .replace(/^Ti.UI.iOS./, '')
    .replace(/^Ti.UI.iPad./, '')
    .replace(/^Ti.App./, '')
    // .replace(/^Ti.Geolocation.Android./, '')g
    .replace(/^Ti.Geolocation./, '')
    // .replace(/^Ti.UI.Android./, '')
    .replace(/^Ti.UI./, '')
    .replace(/^Ti.Media.Sound./, '')
    .replace(/^Ti.Media./, '')
    .replace(/_/g, '-')
    .replace(/'/g, '')
    .replace(`${property}-`, '')
    .replace(/\./g, '-'))
}

function makeSureFolderExists(folder) {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder)
}
