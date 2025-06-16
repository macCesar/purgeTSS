import chalk from 'chalk'
import { exec } from 'child_process'

/**
 * Update PurgeTSS to the latest version using npm
 * @param {Object} options - Command options (unused)
 * @returns {void}
 */
export function update(options) {
  console.log(`${chalk.green('::Purge TSS::')} Updating ${chalk.green('Purge TSS')} to the latest version...`)

  exec('npm update -g purgetss', (error, stdout, stderr) => {
    if (error) {
      console.log(`${chalk.green('::Purge TSS::')} error: ${error.message}`)
      return
    }

    if (stderr) {
      console.log(`${chalk.green('::Purge TSS::')} stderr: ${stderr}`)
      return
    }

    console.log(`${chalk.green('::Purge TSS::')} Done!`)
  })
}

/**
 * Update PurgeTSS to the latest version using sudo npm
 * @param {Object} options - Command options (unused)
 * @returns {void}
 */
export function sudoUpdate(options) {
  console.log(`${chalk.green('::Purge TSS::')} Updating ${chalk.green('Purge TSS')} to the latest version using sudo...`)

  exec('sudo npm update -g purgetss', (error, stdout, stderr) => {
    if (error) {
      console.log(`${chalk.green('::Purge TSS::')} error: ${error.message}`)
      return
    }

    if (stderr) {
      console.log(`${chalk.green('::Purge TSS::')} stderr: ${stderr}`)
      return
    }

    console.log(`${chalk.green('::Purge TSS::')} Done!`)
  })
}
