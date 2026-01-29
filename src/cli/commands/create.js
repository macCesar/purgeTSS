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
  const deleteCommand = `chown -R $USER "${folderPath}" 2>/dev/null; rm -rf "${folderPath}"`

  exec(deleteCommand, (error) => {
    if (error) {
      // Retry once after a brief delay for stubborn node_modules
      setTimeout(() => {
        exec(`rm -rf "${folderPath}"`, (retryError) => {
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
  const projectName = `"${argsName}"`
  const projectDirectory = `${workspace}/${projectName}`

  logger.info('Creating a new Titanium project')
  execSync(`ti create -n ${projectName} -t app -p all --alloy --no-prompt --id ${projectID}`)
  execSync(`cd ${projectDirectory} && purgetss w && purgetss b`)

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
    execSync(`cd ${projectDirectory} && purgetss il -m -v=${options.vendor}`)
  }

  if (options.module) {
    logger.info(`Installing ${chalk.green('purgetss.ui')}`)
    execSync(`cd ${projectDirectory} && purgetss m`)
  }

  if (options.dependencies) {
    logger.info(`Creating a new ${chalk.yellow('package.json')} file`)
    execSync(`cd ${projectDirectory} && npm init -y`)
    execSync(`cd ${projectDirectory} && echo "/node_modules" >>.gitignore`)
    if (commandExistsSync.sync('code')) {
      execSync(`cp -R ${path.resolve(projectRoot)}/dist/configs/vscode/ ${projectDirectory}/.vscode`)
    }
    execSync(`cp ${path.resolve(projectRoot)}/dist/configs/invisible/.editorconfig ${projectDirectory}`)

    logger.info(`Installing ${chalk.green('ESLint')}`)
    execSync(`cd ${projectDirectory} && npm i -D eslint eslint-config-axway eslint-plugin-alloy --silent`)
    execSync(`cp ${path.resolve(projectRoot)}/dist/configs/invisible/.eslintrc.js ${projectDirectory}`)

    logger.info(`Installing ${chalk.green('Tailwind CSS')}`)
    execSync(`cd ${projectDirectory} && npm i -D tailwindcss@3 --silent && npx tailwindcss init`)
  }

  finish(`The ${chalk.yellow(`'${argsName}'`)} project was created successfully in`)

  // Auto-open editor like original v6
  if (commandExistsSync.sync('code')) {
    execSync(`cd ${projectDirectory} && code .`)
  } else if (commandExistsSync.sync('subl')) {
    execSync(`cd ${projectDirectory} && subl .`)
  } else {
    execSync(`cd ${projectDirectory} && open .`)
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
      logger.error('::Can\'t create a Titanium project::')
      logger.info('You must have', chalk.green('`app.idprefix`'), 'and', chalk.green('`app.workspace`'), 'configured to create a project with', chalk.green('`PurgeTSS`'))
      console.log('')
      logger.info('Please, set them like this:')
      logger.info(chalk.green('ti config app.idprefix'), chalk.yellow(`'com.your.reverse.domain'`))
      logger.info(chalk.green('ti config app.workspace'), chalk.yellow(`'path/to/your/workspace'`))
    }
  })
}

/**
 * Export for CLI usage
 */
export default create
