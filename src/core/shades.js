const chalk = require('chalk')
const { fs, logger, alloyProject } = require('../utils/helpers')
const { configFile, projectsLibFolder, projectsConfigJS } = require('../config/index')
// shades module
function shades(args, options) {
  const chroma = require('chroma-js')
  const referenceColorFamilies = require('./lib/color-shades/tailwindColors')
  const generateColorShades = require('./lib/color-shades/generateColorShades')

  const colorFamily = (options.random || !args.hexcode) ? generateColorShades(chroma.random(), referenceColorFamilies) : generateColorShades(args.hexcode, referenceColorFamilies)

  if (args.name) colorFamily.name = args.name
  else if (options.name) colorFamily.name = options.name

  colorFamily.name = colorFamily.name.replace(/'/g, '').replace(/\//g, '').replace(/\s+/g, ' ')

  const colorObject = createColorObject(colorFamily, colorFamily.hexcode, options)

  const silent = options.tailwind || options.json || options.log
  if (alloyProject(silent) && !silent) {
    if (options.override) {
      if (!configFile.theme.colors) configFile.theme.colors = {}
      configFile.theme.colors[colorObject.name] = colorObject.shades

      if (configFile.theme.extend.colors) {
        if (configFile.theme.extend.colors[colorObject.name]) delete configFile.theme.extend.colors[colorObject.name]
        if (Object.keys(configFile.theme.extend.colors).length === 0) delete configFile.theme.extend.colors
      }
    } else {
      if (!configFile.theme.extend.colors) configFile.theme.extend.colors = {}
      configFile.theme.extend.colors[colorObject.name] = colorObject.shades

      if (configFile.theme.colors) {
        if (configFile.theme.colors[colorObject.name]) delete configFile.theme.colors[colorObject.name]
        if (Object.keys(configFile.theme.colors).length === 0) delete configFile.theme.colors
      }
    }

    fs.writeFileSync(projectsConfigJS, 'module.exports = ' + cleanDoubleQuotes(configFile, options), 'utf8', err => { throw err })
    checkIfColorModule()
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`“${colorFamily.name}”`)} (${chalk.bgHex(colorFamily.hexcode)(colorFamily.hexcode)}) saved in`, chalk.yellow('config.js'))
  } else if (options.json) {
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`“${colorFamily.name}”`)} (${chalk.bgHex(colorFamily.hexcode)(colorFamily.hexcode)})\n${JSON.stringify(colorObject, null, 2)}`)
  } else {
    if (options.tailwind) delete colorObject.shades.default
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`“${colorFamily.name}”`)} (${chalk.bgHex(colorFamily.hexcode)(colorFamily.hexcode)})\n${cleanDoubleQuotes({ colors: { [colorObject.name]: colorObject.shades } }, options)}`)
  }
}

function createColorObject(family, hexcode, options) {
  const colors = {}
  const name = family.name.toLowerCase().split(' ').join('-')

  if (options.json) {
    const shades = {}
    colors.global = {}
    shades[name] = hexcode
    family.shades.forEach((shade) => {
      shades[`${name}-${shade.number}`] = shade.hexcode
    })
    colors.global.colors = (options.single) ? { [name]: hexcode } : shades
  } else if (options.single) {
    colors.name = name
    colors.shades = hexcode
  } else {
    const shades = { default: hexcode }
    family.shades.forEach((shade) => {
      shades[shade.number] = shade.hexcode
    })
    colors.name = name
    colors.shades = shades
  }

  return colors
}

function cleanDoubleQuotes(configFile, options) {
  // eslint-disable-next-line no-control-regex
  const regexUnicode = /[^\u0000-\u00FF]/g

  if (options.quotes) return JSON.stringify(configFile, null, 2).replace(regexUnicode, match => `\\u${match.charCodeAt(0).toString(16)}`)

  const util = require('util')
  const inspected = util.inspect(configFile, false, 10)

  if (inspected === 'undefined') return '{}'

  return inspected.replace(regexUnicode, match => `\\u${match.charCodeAt(0).toString(16)}`)
}

function checkIfColorModule() {
  if (fs.existsSync(`${projectsLibFolder}/purgetss.colors.js`)) colorModule()
}

module.exports = {
  shades
}
