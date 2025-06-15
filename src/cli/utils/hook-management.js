/**
 * PurgeTSS v7.1 - Hook Management Utilities
 *
 * Alloy.jmk hook management for auto-purging functionality.
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @fileoverview Alloy.jmk hook management utilities
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { projectsAlloyJMKFile, projectRoot } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'

// Source JMK template file
const srcJMKFile = path.resolve(projectRoot, './lib/templates/alloy.jmk')

/**
 * Save file utility (will be moved to shared later)
 * COPIED exactly from original
 */
function saveFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
}

/**
 * Add auto-purging hook to alloy.jmk
 * COPIED exactly from original addHook() function
 *
 * @param {string} methodCommand - Command to add to hook
 */
export function addHook(methodCommand) {
  logger.warn(chalk.green('Adding Auto-Purging hook!'))
  const originalJMKFile = fs.readFileSync(projectsAlloyJMKFile, 'utf8')

  if (originalJMKFile.includes('pre:compile')) {
    const updatedJMKFile = []

    originalJMKFile.split(/\r?\n/).forEach((line) => {
      if (line.includes('pre:compile')) {
        line += `\n${methodCommand}`
      }
      updatedJMKFile.push(line)
    })

    saveFile(projectsAlloyJMKFile, updatedJMKFile.join('\n'))
  } else {
    const alloyJMKTemplate = fs.readFileSync(srcJMKFile, 'utf8')

    const updatedJMKFile = []

    alloyJMKTemplate.split(/\r?\n/).forEach((line) => {
      if (line.includes('pre:compile')) {
        line += `\n${methodCommand}`
      }
      updatedJMKFile.push(line)
    })

    saveFile(projectsAlloyJMKFile, updatedJMKFile.join('\n'))
  }
}

/**
 * Delete auto-purging hook from alloy.jmk
 * COPIED exactly from original deleteHook() function
 */
export function deleteHook() {
  const updatedJMKFile = []
  const originalJMKFile = fs.readFileSync(projectsAlloyJMKFile, 'utf8')
  const purgeCmdPresent = (originalJMKFile.includes('::PurgeTSS::'))

  if (purgeCmdPresent) {
    originalJMKFile.split(/\r?\n/).forEach((line) => {
      if (!line.includes('::PurgeTSS::')) {
        updatedJMKFile.push(line)
      } else {
        logger.warn(chalk.red('Auto-Purging hook deleted!'))
      }
    })

    saveFile(projectsAlloyJMKFile, updatedJMKFile.join('\n'))
  }
}

/**
 * Enable auto-purging hook (uncomment)
 * COPIED exactly from original enableHook() function
 */
export function enableHook() {
  const updatedJMKFile = []

  const originalJMKFile = fs.readFileSync(projectsAlloyJMKFile, 'utf8')

  originalJMKFile.split(/\r?\n/).forEach((line) => {
    if (line.includes('::PurgeTSS::')) {
      logger.warn(chalk.green('Auto-Purging hook enabled!'))
      line = line.replace(/\/\/\t/g, '')
    }

    updatedJMKFile.push(line)
  })

  saveFile(projectsAlloyJMKFile, updatedJMKFile.join('\n'))
}

/**
 * Disable auto-purging hook (comment out)
 * COPIED exactly from original disableHook() function
 */
export function disableHook() {
  const updatedJMKFile = []
  const originalJMKFile = fs.readFileSync(projectsAlloyJMKFile, 'utf8')
  const purgeCmdPresent = (originalJMKFile.includes('::PurgeTSS::'))

  if (purgeCmdPresent) {
    originalJMKFile.split(/\r?\n/).forEach((line) => {
      if (!line.includes('::PurgeTSS::')) {
        updatedJMKFile.push(line)
      } else if (!line.includes('//')) {
        updatedJMKFile.push(`\t//${line}`)
        logger.warn(chalk.yellow('Auto-Purging hook disabled!'))
      } else {
        updatedJMKFile.push(line)
        logger.warn(chalk.red('Auto-Purging hook already disabled!'))
      }
    })

    saveFile(projectsAlloyJMKFile, updatedJMKFile.join('\n'))
  }
}

/**
 * Create new alloy.jmk file with hook
 * COPIED exactly from original createJMKFile() function
 *
 * @param {string} methodCommand - Command to add to new JMK file
 */
export function createJMKFile(methodCommand) {
  fs.copyFileSync(srcJMKFile, projectsAlloyJMKFile)
  logger.file('./app/alloy.jmk')
  addHook(methodCommand)
}

/**
 * Hook management utilities grouped for convenience
 */
export const hookUtils = {
  add: addHook,
  delete: deleteHook,
  enable: enableHook,
  disable: disableHook,
  create: createJMKFile
}

/**
 * Export for CLI usage
 */
export default {
  addHook,
  deleteHook,
  enableHook,
  disableHook,
  createJMKFile,
  hookUtils
}
