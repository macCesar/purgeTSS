const chalk = require('chalk')
const purgeLabel = require('./colores').colores.purgeLabel

module.exports = {
  info: (...args) => console.log(purgeLabel, args.join(' ')),
  warn: (...args) => console.log(purgeLabel, chalk.yellow(args.join(' '))),
  error: (...args) => console.log(purgeLabel, chalk.red(args.join(' '))),
  file: (...args) => console.log(purgeLabel, chalk.yellow(args.join(' ')), 'file created!')
}
