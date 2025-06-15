/**
 * PurgeTSS v7.1 - Dependencies Command
 *
 * CLI command to install project dependencies and configuration files.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Dependencies installation command
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { execSync } from 'child_process'
import commandExistsSync from 'command-exists'
import { alloyProject } from '../../shared/utils.js'
import { projectRoot } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'

/**
 * Install project dependencies and configuration files
 * Maintains exact same logic as original dependencies() function
 *
 * @param {Object} options - Command options
 * @returns {boolean} Success status
 */
export function dependencies(options) {
  if (!alloyProject()) {
    return false
  }

  const cwd = process.cwd()

  // Add node_modules to .gitignore if not present
  if (fs.existsSync(`${cwd}/.gitignore`) && !fs.readFileSync(`${cwd}/.gitignore`).includes('/node_modules')) {
    execSync('echo "/node_modules" >>.gitignore')
  }

  // Create package.json if it doesn't exist
  if (!fs.existsSync(`${cwd}/package.json`)) {
    logger.info(`Creating a new ${chalk.yellow('package.json')} file`)
    execSync(`cd "${cwd}" && npm init -y`)
  }

  // Copy VS Code configuration if VS Code is available
  if (commandExistsSync('code')) {
    execSync(`cp -R ${path.resolve(projectRoot)}/dist/configs/vscode/ "${cwd}"/.vscode`)
  }

  // Copy .editorconfig
  execSync(`cp ${path.resolve(projectRoot)}/dist/configs/invisible/.editorconfig "${cwd}"`)

  // Install ESLint
  logger.info(`Installing ${chalk.green('ESLint')}`)
  execSync(`cd "${cwd}" && npm i -D eslint eslint-config-axway eslint-plugin-alloy`)
  execSync(`cp ${path.resolve(projectRoot)}/dist/configs/invisible/.eslintrc.js "${cwd}"`)

  // Install Tailwind CSS
  logger.info(`Installing ${chalk.green('Tailwind CSS')}`)
  execSync(`cd "${cwd}" && npm i -D tailwindcss && npx tailwindcss init`)

  logger.info('The dependencies and config files have been installed successfully!')

  return true
}

/**
 * Export for CLI usage
 */
export default dependencies
