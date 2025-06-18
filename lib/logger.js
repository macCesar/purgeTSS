import chalk from 'chalk'
import { colores } from '../src/shared/brand-colors.js'
const purgeLabel = colores.purgeLabel

export default {
  info: (...args) => console.log(purgeLabel, args.join(' ')),
  warn: (...args) => console.log(purgeLabel, chalk.yellow(args.join(' '))),
  error: (...args) => console.log(purgeLabel, chalk.red(args.join(' '))),
  file: (...args) => console.log(purgeLabel, chalk.yellow(args.join(' ')), 'file created!')
}
