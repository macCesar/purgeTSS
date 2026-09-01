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
const autoPurgeMarker = '::PurgeTSS::'
const autoPurgeStartMessage = '::PurgeTSS:: Auto-Purging '
export const autoPurgeFailureHint = '::PurgeTSS:: Auto-Purge failed. Run `purgetss` from the project root to see the cause.'

const syncHookCommand = `\tlogger.warn('${autoPurgeStartMessage}' + event.dir.project); try { require('child_process').execSync('purgetss', { stdio: 'inherit' }); } catch (error) { logger.error('${autoPurgeFailureHint}'); throw error; }`
const asyncHookCommand = `\tlogger.warn('${autoPurgeStartMessage}' + event.dir.project); require('child_process').exec('purgetss', (error, stdout, stderr) => { if (stdout) process.stdout.write(stdout); if (stderr) process.stderr.write(stderr); if (error) logger.error('${autoPurgeFailureHint}'); });`

/**
 * Get the command inserted into Alloy's pre-compile hook.
 *
 * The synchronous hook inherits stdio so PurgeTSS diagnostics are visible in
 * the Titanium build log before Alloy reports the generic command failure.
 *
 * @param {string} method - Purge method from config.cjs
 * @returns {{ methodCommand: string }} Hook command
 */
export function getAutoPurgeCommands(method) {
  const useSync = method === 'sync' || method === ''

  return { methodCommand: useSync ? syncHookCommand : asyncHookCommand }
}

/**
 * Check whether an installed PurgeTSS hook needs its command refreshed.
 *
 * @param {string} content - alloy.jmk contents
 * @param {string} methodCommand - Current generated hook command
 * @returns {boolean} Whether an existing PurgeTSS hook is outdated
 */
export function autoPurgeHookNeedsUpdate(content, methodCommand) {
  const expectedCommand = methodCommand.trim()
  const hookLine = content.split(/\r?\n/).find(line => line.includes(autoPurgeMarker))

  return Boolean(hookLine && !hookLine.includes(expectedCommand))
}

/**
 * Check whether the PurgeTSS hook is commented out.
 *
 * @param {string} content - alloy.jmk contents
 * @returns {boolean} Whether the hook is disabled
 */
export function autoPurgeHookIsDisabled(content) {
  const hookLine = content.split(/\r?\n/).find(line => line.includes(autoPurgeMarker))
  return Boolean(hookLine && /^\s*\/\//.test(hookLine))
}

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
 * Replace an existing PurgeTSS hook while preserving its enabled state.
 *
 * @param {string} methodCommand - Current command to write into alloy.jmk
 */
export function updateHook(methodCommand) {
  const originalJMKFile = fs.readFileSync(projectsAlloyJMKFile, 'utf8')
  let updated = false

  const updatedJMKFile = originalJMKFile.split(/\r?\n/).map(line => {
    if (!line.includes(autoPurgeMarker)) return line

    updated = true
    return autoPurgeHookIsDisabled(line) ? `\t//${methodCommand}` : methodCommand
  })

  if (updated) {
    saveFile(projectsAlloyJMKFile, updatedJMKFile.join('\n'))
    logger.warn(chalk.green('Auto-Purging hook updated!'))
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
  update: updateHook,
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
  updateHook,
  deleteHook,
  enableHook,
  disableHook,
  createJMKFile,
  hookUtils
}
