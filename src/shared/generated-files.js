import fs from 'node:fs'
import chalk from 'chalk'
import { logger } from './logger.js'

// app.tss deliberately does not use this: its mtime is the LiveView guard.
export function writeIfChanged(file, data, { label } = {}) {
  const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data)
  const exists = fs.existsSync(file)
  const changed = !exists || !fs.readFileSync(file).equals(bytes)
  if (changed) fs.writeFileSync(file, bytes)
  if (label) logger.info(chalk.yellow(label), changed ? (exists ? 'file updated!' : 'file created!') : 'unchanged (not written).')
  return changed
}
