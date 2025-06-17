/* eslint-disable camelcase */
/**
 * PurgeTSS v7.1.0 - Core Purger: Tailwind
 * Tailwind CSS purging engine - removes unused Tailwind classes
 *
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @since 7.1.0
 * @author César Estrada
 */

import fs from 'fs'
import _ from 'lodash'
import chalk from 'chalk'
import * as helpers from '../../shared/helpers.js'
import { logger } from '../../shared/logger.js'
import {
  // eslint-disable-next-line camelcase
  projectsTailwind_TSS,
  projectsConfigJS
} from '../../shared/constants.js'
import { getFileUpdatedDate } from '../../shared/utils.js'

// Import timing helpers
import { localStart, localFinish } from '../../cli/utils/cli-helpers.js'

// Import shared functions instead of redefining them
import { createDefinitionsFile } from '../../cli/commands/init.js'
import { checkIfColorModule } from '../../cli/commands/shades.js'
import { buildTailwindBasedOnConfigOptions } from '../../core/builders/tailwind-builder.js'

/**
 * Clean class name by removing platform and modifier prefixes
 * COPIED exactly from original cleanClassNameFn() function
 */
function cleanClassNameFn(className) {
  return className.replace('ios:', '').replace('android:', '').replace('handheld:', '').replace('tablet:', '').replace('children:', '').replace('child:', '').replace('open:', '').replace('close:', '').replace('complete:', '').replace('drag:', '').replace('drop:', '').replace('bounds:', '')
}

/**
 * Purge Tailwind classes - COPIED exactly from original purgeTailwind() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @returns {string} Purged Tailwind CSS classes as string
 */
export function purgeTailwind(uniqueClasses, debug = false) {
  if (debug) localStart()

  logger.info('Purging', chalk.yellow('Tailwind'), 'styles...')

  let purgedClasses = ''
  let tailwindClasses = fs.readFileSync(projectsTailwind_TSS, 'utf8').split(/\r?\n/)

  if (`// config.js file updated on: ${getFileUpdatedDate(projectsConfigJS)}` !== tailwindClasses[6]) {
    logger.info(chalk.yellow('config.js'), 'file changed!, rebuilding tailwind.tss...')
    checkIfColorModule()
    buildTailwindBasedOnConfigOptions()
    createDefinitionsFile()
    tailwindClasses = fs.readFileSync(projectsTailwind_TSS, 'utf8').split(/\r?\n/)
  }

  // let complexClasses = [];
  const cleanUniqueClasses = []
  const classesWithOpacityValues = []

  let arbitraryValues = '\n// Arbitrary Values\n'

  uniqueClasses.forEach((className, index) => {
    const cleanClassName = cleanClassNameFn(className)

    if (cleanClassName.indexOf(':') !== -1) {
      // complexClasses.push(cleanClassName);
    } else if (cleanClassName.includes('(')) {
      const line = helpers.formatArbitraryValues(cleanClassName, true)
      if (line) arbitraryValues += helpers.checkPlatformAndDevice(line, className)
    } else if (helpers.checkColorClasses(cleanClassName)) {
      const decimalValue = cleanClassName.split('/')[1]
      let transparency = Math.round(decimalValue * 255 / 100).toString(16)
      if (transparency.length === 1) transparency = '0' + transparency
      const classNameWithTransparency = uniqueClasses[index]
      const className = cleanClassName.substring(0, cleanClassName.lastIndexOf('/'))
      classesWithOpacityValues.push({ decimalValue, transparency, className, classNameWithTransparency })
    } else {
      cleanUniqueClasses.push(className)
    }
  })

  // TODO: Process complex Classes
  // complexClasses.forEach((className) => {
  // let classes = className.split(':');
  // let line = '';
  // classes.forEach((className) => {
  //  let classLine = tailwindClasses[22] + '\n';
  //  if (classLine) line += classLine;
  // });
  // if (line) purgedClasses += line;
  // });

  const deviceClasses = []
  const titaniumClasses = []
  const anArrayOfCustomClasses = []
  const anArrayOfDefaultClasses = []
  const anArrayOfAnimationClasses = []
  const endOfCustomClasses = tailwindClasses.indexOf('// End of Custom Classes')
  // let colorClasses = 0;
  // let restOfClasses = 0;
  tailwindClasses.forEach((tailwindClass, key) => {
    if (tailwindClass !== '' && !tailwindClass.includes('//')) {
      // if (tailwindClass.includes('color') || tailwindClass.includes('Color')) colorClasses++;
      // else restOfClasses++;

      const cleanTailwindClass = `${tailwindClass.split(':')[0].replace('.', '').replace(/'/g, '').replace(/ *\[[^\]]*]/, '').replace(/^#/, '')}`

      const classIndex = cleanUniqueClasses.indexOf(cleanTailwindClass)
      if (classIndex > -1) {
        if (cleanTailwindClass.charAt(0) === cleanTailwindClass.charAt(0).toUpperCase() && cleanTailwindClass.charAt(0) !== '-') {
          titaniumClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[classIndex]))
        } else if (tailwindClass.includes('animationProperties')) {
          anArrayOfAnimationClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[classIndex]))
        } else if (key > endOfCustomClasses) {
          anArrayOfDefaultClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[classIndex]))
        } else {
          anArrayOfCustomClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[classIndex]))
        }
      }

      if (cleanUniqueClasses.indexOf(`ios:${cleanTailwindClass}`) > -1) {
        deviceClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`ios:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`android:${cleanTailwindClass}`) > -1) {
        deviceClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`android:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`tablet:${cleanTailwindClass}`) > -1) {
        deviceClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`tablet:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`handheld:${cleanTailwindClass}`) > -1) {
        deviceClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`handheld:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`children:${cleanTailwindClass}`) > -1) {
        anArrayOfAnimationClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`children:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`child:${cleanTailwindClass}`) > -1) {
        anArrayOfAnimationClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`child:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`open:${cleanTailwindClass}`) > -1) {
        anArrayOfAnimationClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`open:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`close:${cleanTailwindClass}`) > -1) {
        anArrayOfAnimationClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`close:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`drag:${cleanTailwindClass}`) > -1) {
        anArrayOfAnimationClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`drag:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`drop:${cleanTailwindClass}`) > -1) {
        anArrayOfAnimationClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`drop:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`complete:${cleanTailwindClass}`) > -1) {
        anArrayOfAnimationClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`complete:${cleanTailwindClass}`)]))
      }

      if (cleanUniqueClasses.indexOf(`bounds:${cleanTailwindClass}`) > -1) {
        anArrayOfAnimationClasses.push(helpers.checkPlatformAndDevice(tailwindClass, cleanUniqueClasses[cleanUniqueClasses.indexOf(`bounds:${cleanTailwindClass}`)]))
      }
    }
  })
  // console.log('colorClasses', colorClasses);
  // console.log('restOfClasses', restOfClasses);
  // console.log('Total:', colorClasses + restOfClasses);

  purgedClasses += (titaniumClasses.length) ? '\n// Ti Elements\n' + titaniumClasses.sort().join('') : ''
  purgedClasses += (anArrayOfCustomClasses.length) ? '\n// Custom Styles\n' + anArrayOfCustomClasses.sort().join('') : ''
  purgedClasses += (anArrayOfDefaultClasses.length) ? '\n// Main Styles\n' + anArrayOfDefaultClasses.sort().join('') : ''
  purgedClasses += (deviceClasses.length) ? '\n// Platform and Device Modifiers\n' + deviceClasses.sort().join('') : ''
  purgedClasses += (anArrayOfAnimationClasses.length) ? '\n// Animation Module\n' + anArrayOfAnimationClasses.sort().join('') : ''

  // Color Opacity Modifiers
  if (classesWithOpacityValues.length > 0) {
    purgedClasses += '\n// Color Opacity Modifiers\n'
    classesWithOpacityValues.forEach(opacityValue => {
      const opacityIndex = _.findIndex(tailwindClasses, line => line.startsWith(`'.${opacityValue.className}'`))

      const classProperties = tailwindClasses[opacityIndex]
      if (opacityIndex > -1 && classProperties.includes('#')) {
        // ! TODO: Check if color value is a hex value!! (if not, they are using rbg, rgba or semantic colors)
        // ! In other words, we need to validate the color value, before we can alter its opacity.
        const defaultHexValue = (classProperties.includes('from')) ? classProperties.match(/#[0-9a-f]{6}/g)[1] : classProperties.match(/#[0-9a-f]{6}/i)[0]
        let classWithoutDecimalOpacity = `${classProperties.replace(new RegExp(defaultHexValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `#${opacityValue.transparency}${defaultHexValue.substring(1)}`)}`
        // Special case: #000000
        if (classProperties.includes('from') && defaultHexValue === '#000000') classWithoutDecimalOpacity = classWithoutDecimalOpacity.replace('00000000', '000000')

        let defaultTextValue = classProperties.match(/'[^']*'/i)[0]
        defaultTextValue = defaultTextValue.substring(1, defaultTextValue.length)
        const finalClassName = `${classWithoutDecimalOpacity.replace(defaultTextValue, `.${defaultTextValue.substring(1, defaultTextValue.length - 1)}/${opacityValue.decimalValue}'`)}`

        purgedClasses += switchPlatform(helpers.checkPlatformAndDevice(finalClassName, opacityValue.classNameWithTransparency))
      }
    })
  }

  // Add arbitrary values
  purgedClasses += (arbitraryValues !== '\n// Arbitrary Values\n') ? arbitraryValues : ''

  if (debug) localFinish('Purging ' + chalk.yellow('Tailwind') + ' styles...')

  return purgedClasses
}

/**
 * Switch platform specific styles - COPIED exactly from original switchPlatform() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} withPlatformDeviceStyle - Style with platform/device modifiers
 * @returns {string} Style with platform modifiers moved to correct position
 */
function switchPlatform(withPlatformDeviceStyle) {
  // !Move platform specific styles to the end of the class name
  if (withPlatformDeviceStyle.search(/\[platform=ios\]|\[platform=android\]/i) > -1) {
    return (withPlatformDeviceStyle.includes('[platform=ios]'))
      ? withPlatformDeviceStyle.replace('[platform=ios]', '').replace(/[^'.][^']+|1/, '$&[platform=ios]')
      : withPlatformDeviceStyle.replace('[platform=android]', '').replace(/[^'.][^']+|1/, '$&[platform=android]')
  }

  return withPlatformDeviceStyle
}

// End of purgeTailwind function
