/**
 * PurgeTSS - Branding Logger
 *
 * Chalk-based presentation helpers used exclusively by the branding pipeline.
 * Separate from the main PurgeTSS logger because the branding output style
 * (sections, bullets, property rows) is much richer than the one-line logging
 * used elsewhere in the tool.
 *
 * @fileoverview Logger helpers for the branding pipeline
 * @author César Estrada
 */

import chalk from 'chalk'

let debugMode = false

export const logger = {
  setDebugMode(enabled) { debugMode = enabled },

  info(message) { console.log(chalk.blue(message)) },

  section(name) {
    console.log()
    console.log(chalk.cyan(`▸ ${name}`))
  },

  bullet(message) { console.log(`  ${chalk.cyan('•')} ${message}`) },

  property(label, value) { console.log(`${chalk.blue(label)}${value}`) },

  success(message) { console.log(chalk.green(message)) },

  warning(message) { console.log(chalk.yellow(message)) },

  error(message) { console.error(chalk.red(message)) },

  debug(message) {
    if (debugMode) console.log(chalk.cyan(message))
  }
}
