/**
 * PurgeTSS v7.1 - Create Command
 *
 * CLI command for creating new Alloy projects with PurgeTSS.
 * COPIED from src/index.js v6 original with Android App ID fix.
 *
 * @fileoverview Project creation command
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
// eslint-disable-next-line import/no-unresolved -- Node ESM resolves inquirer's package exports.
import inquirer from 'inquirer'
import { promisify } from 'node:util'
import { currentProfile } from '../utils/profile.js'
import { exec, execSync } from 'child_process'
import commandExistsSync from 'command-exists'
import { logger } from '../../shared/logger.js'
import { projectRoot } from '../../shared/constants.js'
import { start, finish } from '../utils/cli-helpers.js'

/**
 * Robust folder deletion with retry for node_modules issues
 * @param {string} folderPath - Path to folder to delete
 * @param {Function} callback - Callback function
 */
function robustDelete(folderPath, callback) {
  fs.rm(folderPath, { recursive: true, force: true, maxRetries: 1, retryDelay: 1000 }, callback)
}

/**
 * Create a new Titanium project with PurgeTSS
 * COPIED exactly from original v6 createProject() function
 * with Android App ID sanitization fix
 *
 * @param {string} workspace - Workspace path
 * @param {string} argsName - Project name
 * @param {string} projectID - Project ID
 * @param {Object} options - Creation options
 */
function createProject(workspace, argsName, projectID, options, timing) {
  const projectName = `"${argsName}"`
  const projectDirectory = path.join(workspace, argsName)

  logger.startSection()
  logger.info('Creating Titanium project', chalk.yellow(`'${argsName}'`), 'in', chalk.yellow(workspace))
  execSync(`ti create -n ${projectName} -t app -p all --alloy --no-prompt --id ${projectID}`)
  execSync('purgetss w && purgetss b', { cwd: projectDirectory })

  // Remove default index.tss file (not needed with PurgeTSS - app.tss is auto-generated)
  // Use argsName instead of projectName because projectName includes quotes for shell commands
  const indexTssPath = `${workspace}/${argsName}/app/styles/index.tss`

  if (fs.existsSync(indexTssPath)) {
    try {
      fs.unlinkSync(indexTssPath)
    } catch (error) {
      logger.error(`Failed to remove index.tss: ${error.message}`)
    }
  }

  // Copy PurgeTSS welcome screen (index.xml and index.js)
  const templatesDir = path.resolve(projectRoot, 'lib/templates/create')
  const viewsDir = `${workspace}/${argsName}/app/views`
  const controllersDir = `${workspace}/${argsName}/app/controllers`

  try {
    fs.copyFileSync(`${templatesDir}/index.xml`, `${viewsDir}/index.xml`)
    fs.copyFileSync(`${templatesDir}/index.js`, `${controllersDir}/index.js`)
    logger.info('PurgeTSS welcome screen installed')
  } catch (error) {
    logger.error(`Failed to copy PurgeTSS templates: ${error.message}`)
  }

  if (options.vendor) {
    logger.info('Installing Fonts')
    execSync(`purgetss il -m -v=${options.vendor}`, { cwd: projectDirectory })
  }

  if (options.module) {
    logger.info(`Installing ${chalk.green('purgetss.ui')}`)
    execSync('purgetss m', { cwd: projectDirectory })
  }

  if (options.dependencies) {
    logger.info(`Creating a new ${chalk.yellow('package.json')} file`)
    execSync('npm init -y', { cwd: projectDirectory })
    fs.appendFileSync(path.join(projectDirectory, '.gitignore'), '/node_modules\n')
    if (commandExistsSync.sync('code')) {
      // eslint-disable-next-line n/no-unsupported-features/node-builtins -- cpSync exists on Node 20; its stable label starts in 22.3.
      fs.cpSync(path.join(projectRoot, 'dist/configs/vscode'), path.join(projectDirectory, '.vscode'), { recursive: true })
    }
    fs.copyFileSync(path.join(projectRoot, 'dist/configs/invisible/.editorconfig'), path.join(projectDirectory, '.editorconfig'))

    logger.info(`Installing ${chalk.green('ESLint')}`)
    execSync('npm i -D eslint @eslint/js --silent', { cwd: projectDirectory })
    fs.copyFileSync(path.join(projectRoot, 'dist/configs/invisible/eslint.config.mjs'), path.join(projectDirectory, 'eslint.config.mjs'))

    logger.info(`Installing ${chalk.green('Tailwind CSS')}`)
    execSync('npm i -D tailwindcss@3 --silent && npx tailwindcss init', { cwd: projectDirectory })
  }

  finish(`The ${chalk.yellow(`'${argsName}'`)} project was created successfully in`, timing)
  logger.endSection()

  // Auto-open editor like original v6
  if (commandExistsSync.sync('code')) {
    execSync('code .', { cwd: projectDirectory })
  } else if (commandExistsSync.sync('subl')) {
    execSync('subl .', { cwd: projectDirectory })
  } else {
    execSync('open .', { cwd: projectDirectory })
  }
}

/**
 * Create new Alloy project command
 * COPIED exactly from original v6 create() function
 * with Android App ID sanitization fix
 *
 * @param {Object} args - Command arguments
 * @param {Object} options - Command options
 */
export async function create(args, options) {
  const timing = start()
  // ti config may exit nonzero with the existing 'not found' response.
  // Preserve the original validation message instead of surfacing an exec stack.
  const { stdout } = await promisify(exec)('ti config app.idprefix && ti config app.workspace').catch(error => ({ stdout: error.stdout || '' }))
  const results = stdout.split('\n')
  const idPrefix = results[0]
  const workspace = results[1]

  if (idPrefix !== 'app.idprefix not found' && workspace !== '') {
    const projectID = `${idPrefix}.${args.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/ |-|_/).join('').toLowerCase().replace(/[^a-z]/g, '')}`
    console.log('')
    const directory = path.join(workspace, args.name)
    if (fs.existsSync(directory)) {
      let confirmed = options.force
      if (!confirmed) {
        let answers
        try {
          answers = await inquirer.prompt([{
            type: 'confirm',
            name: 'delete',
            message: `The folder '${args.name}' already exists. Do you want to delete it?`,
            default: false
          }])
        } catch (error) {
          logger.error(error)
          return false
        }
        confirmed = answers.delete
      }
      if (!confirmed) {
        console.log('')
        logger.warn(chalk.yellow('Project creation has been canceled!'))
        const profile = currentProfile()
        if (profile) {
          profile.status = 'skipped'
          profile.skipReason = 'user-cancelled'
        }
        return true
      }
      logger.info('Deleting existing project\'s folder')
      try {
        await promisify(robustDelete)(directory)
      } catch (error) {
        logger.error(error)
        return false
      }
    }
    createProject(workspace, args.name, projectID, options, timing)
    return true
  }
  console.log('')
  logger.block(
    chalk.red('Can\'t create a Titanium project'),
    `You must have ${chalk.green('`app.idprefix`')} and ${chalk.green('`app.workspace`')} configured to create a project with ${chalk.green('`PurgeTSS`')}`,
    '',
    'Please, set them like this:',
    `  ${chalk.green('ti config app.idprefix')} ${chalk.yellow('\'com.your.reverse.domain\'')}`,
    `  ${chalk.green('ti config app.workspace')} ${chalk.yellow('\'path/to/your/workspace\'')}`
  )
  return false
}

/**
 * Export for CLI usage
 */
export default create
