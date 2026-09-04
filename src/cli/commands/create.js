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
import inquirer from 'inquirer'
import { exec, execFileSync } from 'child_process'
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
  // Use fs.rm instead of shelling out to `chown`/`rm`, avoiding command
  // injection via folderPath (which can contain user-supplied project names).
  fs.rm(folderPath, { recursive: true, force: true }, (error) => {
    if (error) {
      // Retry once after a brief delay for stubborn node_modules
      setTimeout(() => {
        fs.rm(folderPath, { recursive: true, force: true }, (retryError) => {
          if (retryError) {
            logger.error(`Failed to delete folder: ${retryError.message}`)
            return callback(retryError)
          }
          callback(null)
        })
      }, 1000) // 1 second delay
    } else {
      callback(null)
    }
  })
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
function createProject(workspace, argsName, projectID, options) {
  const projectDirectory = `${workspace}/${argsName}`

  logger.startSection()
  logger.info('Creating Titanium project', chalk.yellow(`'${argsName}'`), 'in', chalk.yellow(workspace))
  execFileSync('ti', ['create', '-n', argsName, '-t', 'app', '-p', 'all', '--alloy', '--no-prompt', '--id', projectID])
  execFileSync('purgetss', ['w'], { cwd: projectDirectory })
  execFileSync('purgetss', ['b'], { cwd: projectDirectory })

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
    execFileSync('purgetss', ['il', '-m', `-v=${options.vendor}`], { cwd: projectDirectory })
  }

  if (options.module) {
    logger.info(`Installing ${chalk.green('purgetss.ui')}`)
    execFileSync('purgetss', ['m'], { cwd: projectDirectory })
  }

  if (options.dependencies) {
    logger.info(`Creating a new ${chalk.yellow('package.json')} file`)
    execFileSync('npm', ['init', '-y'], { cwd: projectDirectory })
    fs.appendFileSync(`${projectDirectory}/.gitignore`, '/node_modules\n')
    if (commandExistsSync.sync('code')) {
      fs.cpSync(`${path.resolve(projectRoot)}/dist/configs/vscode`, `${projectDirectory}/.vscode`, { recursive: true })
    }
    fs.copyFileSync(`${path.resolve(projectRoot)}/dist/configs/invisible/.editorconfig`, `${projectDirectory}/.editorconfig`)

    logger.info(`Installing ${chalk.green('ESLint')}`)
    execFileSync('npm', ['i', '-D', 'eslint', 'eslint-config-axway', 'eslint-plugin-alloy', '--silent'], { cwd: projectDirectory })
    fs.copyFileSync(`${path.resolve(projectRoot)}/dist/configs/invisible/.eslintrc.js`, `${projectDirectory}/.eslintrc.js`)

    logger.info(`Installing ${chalk.green('Tailwind CSS')}`)
    execFileSync('npm', ['i', '-D', 'tailwindcss@3', '--silent'], { cwd: projectDirectory })
    execFileSync('npx', ['tailwindcss', 'init'], { cwd: projectDirectory })
  }

  finish(`The ${chalk.yellow(`'${argsName}'`)} project was created successfully in`)
  logger.endSection()

  // Auto-open editor like original v6
  if (commandExistsSync.sync('code')) {
    execFileSync('code', ['.'], { cwd: projectDirectory })
  } else if (commandExistsSync.sync('subl')) {
    execFileSync('subl', ['.'], { cwd: projectDirectory })
  } else {
    execFileSync('open', ['.'], { cwd: projectDirectory })
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
export function create(args, options) {
  start()

  exec('ti config app.idprefix && ti config app.workspace', (_error, stdout) => {
    const results = stdout.split('\n')
    const idPrefix = results[0]
    const workspace = results[1]

    if (idPrefix !== 'app.idprefix not found' && workspace !== '') {
      // Android App ID fix: remove numbers and special chars
      const projectID = `${idPrefix}.${args.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/ |-|_/).join('').toLowerCase().replace(/[^a-z]/g, '')}`
      console.log('')

      if (fs.existsSync(`${workspace}/${args.name}`)) {
        if (options.force) {
          logger.info('Deleting existing project\'s folder')
          robustDelete(`${workspace}/${args.name}`, error => {
            if (error) return logger.error(error)
            createProject(workspace, args.name, projectID, options)
          })
        } else {
          inquirer.prompt([{
            type: 'confirm',
            name: 'delete',
            message: `The folder '${args.name}' already exists. Do you want to delete it?`,
            default: false
          }]).then(answers => {
            if (answers.delete) {
              logger.info('Deleting existing project\'s folder')
              robustDelete(`${workspace}/${args.name}`, error => {
                if (error) return logger.error(error)
                createProject(workspace, args.name, projectID, options)
              })
            } else {
              console.log('')
              logger.warn(chalk.yellow('Project creation has been canceled!'))
            }
            return null
          }).catch(error => {
            logger.error(error)
          })
        }
      } else {
        createProject(workspace, args.name, projectID, options)
      }
    } else {
      console.log('')
      logger.block(
        chalk.red("Can't create a Titanium project"),
        `You must have ${chalk.green('`app.idprefix`')} and ${chalk.green('`app.workspace`')} configured to create a project with ${chalk.green('`PurgeTSS`')}`,
        '',
        'Please, set them like this:',
        `  ${chalk.green('ti config app.idprefix')} ${chalk.yellow(`'com.your.reverse.domain'`)}`,
        `  ${chalk.green('ti config app.workspace')} ${chalk.yellow(`'path/to/your/workspace'`)}`
      )
    }
  })
}

/**
 * Export for CLI usage
 */
export default create
