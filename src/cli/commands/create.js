/**
 * PurgeTSS v7.1 - Create Command
 *
 * CLI command for creating new Alloy projects with PurgeTSS.
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
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
import { start } from '../utils/cli-helpers.js'

/**
 * Create a new Titanium project with PurgeTSS
 * COPIED exactly from original createProject() function
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
    if (commandExistsSync('code')) {
      execSync(`cp -R ${path.resolve(projectRoot)}/dist/configs/vscode/ ${projectDirectory}/.vscode`)
    }
    execSync(`cp ${path.resolve(projectRoot)}/dist/configs/invisible/.editorconfig ${projectDirectory}`)

    logger.info(`Installing ${chalk.green('ESLint')}`)
    execSync(`cd ${projectDirectory} && npm i -D eslint eslint-config-axway eslint-plugin-alloy`)
    execSync(`cp ${path.resolve(projectRoot)}/dist/configs/invisible/.eslintrc.js ${projectDirectory}`)

    logger.info(`Installing ${chalk.green('Tailwind CSS')}`)
    execSync(`cd ${projectDirectory} && npm i -D tailwindcss && npx tailwindcss init`)

    logger.info('The dependencies and config files have been installed successfully!')
  }

  logger.info('The new project has been created successfully!')
}

/**
 * Create new Alloy project command
 * COPIED exactly from original create() function
 *
 * @param {Object} args - Command arguments
 * @param {Object} options - Command options
 * @returns {Promise<boolean>} Success status
 */
export function create(args, options) {
  start()

  return new Promise((resolve) => {
    exec('ti config app.idprefix && ti config app.workspace', (_error, stdout) => {
      const results = stdout.split('\n')
      const idPrefix = results[0]
      const workspace = results[1]

      if (idPrefix !== 'app.idprefix not found' && workspace !== '') {
        const projectID = `${idPrefix}.${args.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/ |-|_/).join('').toLowerCase()}`
        console.log('')

        if (fs.existsSync(`${workspace}/${args.name}`)) {
          if (options.force) {
            logger.info('Deleting existing project\'s folder')
            exec(`chown -R $USER "${workspace}/${args.name}" && rm -rf "${workspace}/${args.name}"`, error => {
              if (error) {
                logger.error(error)
                return resolve(false)
              }
              createProject(workspace, args.name, projectID, options)
              resolve(true)
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
                exec(`chown -R $USER "${workspace}/${args.name}" && rm -rf "${workspace}/${args.name}"`, error => {
                  if (error) {
                    logger.error(error)
                    return resolve(false)
                  }
                  createProject(workspace, args.name, projectID, options)
                  resolve(true)
                })
              } else {
                console.log('')
                logger.warn(chalk.yellow('Project creation has been canceled!'))
                resolve(false)
              }
            })
          }
        } else {
          createProject(workspace, args.name, projectID, options)
          resolve(true)
        }
      } else {
        console.log('')
        logger.error('::Can\'t create a Titanium project::')
        logger.info('You must have', chalk.green('`app.idprefix`'), 'and', chalk.green('`app.workspace`'), 'configured to create a project with', chalk.green('`Purge TSS`'))
        console.log('')
        logger.info('Please, set them like this:')
        logger.info(chalk.green('ti config app.idprefix'), chalk.yellow('\'com.your.reverse.domain\''))
        logger.info(chalk.green('ti config app.workspace'), chalk.yellow('\'path/to/your/workspace\''))
        resolve(false)
      }
    })
  })
}

/**
 * Export for CLI usage
 */
export default create
