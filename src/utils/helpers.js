const fs = require('fs')
const cwd = process.cwd()
const chalk = require('chalk')
const colores = require('../../lib/colores').colores
const purgeLabel = colores.purgeLabel

const logger = {
  info: function(...args) {
    console.log(purgeLabel, args.join(' '))
  },
  warn: function(...args) {
    console.log(purgeLabel, chalk.yellow(args.join(' ')))
  },
  error: function(...args) {
    console.log(purgeLabel, chalk.red(args.join(' ')))
  },
  file: function(...args) {
    console.log(purgeLabel, chalk.yellow(args.join(' ')), 'file created!')
  }
}

// ! Check if running inside an Alloy Project
function alloyProject(silent = false) {
  if (!fs.existsSync(cwd + '/app/views')) {
    if (!silent) {
      logger.info(`Please make sure you are running ${chalk.green('purgetss')} within an Alloy Project.`)
      logger.info(`For more information, visit ${chalk.green('https://purgetss.com')}`)
    }

    return false
  }

  return true
}

module.exports = {
  fs,
  logger,
  alloyProject
}
