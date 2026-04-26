/**
 * PurgeTSS - Brand Command
 *
 * Generates the complete Titanium branding set (icons + splash + marketplace)
 * from logos auto-discovered in `./purgetss/brand/`, with optional overrides
 * from `purgetss/config.cjs` (brand section) and CLI flags.
 *
 * Default behavior writes directly into the project (in-place) because
 * purgetss commands always operate on the current project. Use --output to
 * stage elsewhere, or --dry-run to preview without writing.
 *
 * @fileoverview Brand command entry point
 * @author César Estrada
 */

import path from 'path'
import chalk from 'chalk'
import { runBranding } from '../../core/branding/index.js'
import { logger } from '../../core/branding/branding-logger.js'
import { resolveBrandConfig } from '../../core/branding/brand-config.js'
import { ensureBrandSection } from '../../core/branding/ensure-brand-section.js'

export async function brand(cliLogo, options = {}) {
  if (options.debug) logger.setDebugMode(true)

  const projectRoot = options.project ? path.resolve(options.project) : process.cwd()

  // Backfill the `brand:` block into older config.cjs files. No-op when
  // config is missing or already has the section. Only runs against the
  // project cwd, not against --project overrides (keeping ops localized).
  if (!options.project) ensureBrandSection()

  const resolved = resolveBrandConfig(options, cliLogo, projectRoot)

  // Helpful error when no logo is found and we're not in cleanup-only mode.
  if (!resolved.logo && !resolved.cleanupLegacy) {
    printMissingLogoHelp(projectRoot)
    process.exit(1)
  }

  try {
    await runBranding({
      ...resolved,
      // Always in-place unless --output <dir> is given (which runBranding handles).
      inPlace: !resolved.output,
      yes: Boolean(options.yes)
    })
  } catch (err) {
    logger.error(err.message)
    if (options.debug) console.error(err.stack)
    process.exit(1)
  }
}

function printMissingLogoHelp(projectRoot) {
  const rel = (p) => path.relative(projectRoot, p) || '.'
  const brandDir = path.join(projectRoot, 'purgetss', 'brand')

  logger.error('No logo image found.')
  console.log()
  console.log(`  Expected ${chalk.cyan(rel(brandDir) + '/logo.svg')} or ${chalk.cyan(rel(brandDir) + '/logo.png')}.`)
  console.log(`  The ${chalk.cyan(rel(brandDir) + '/')} folder already exists — just drop your logo into it:`)
  console.log(`     ${chalk.cyan('cp your-logo.svg ' + rel(brandDir) + '/logo.svg')}`)
  console.log()
  console.log('  Alternatives:')
  console.log(`    ${chalk.gray('•')} Pass the logo explicitly:       ${chalk.cyan('purgetss brand path/to/logo.svg')}`)
  console.log(`    ${chalk.gray('•')} Point to it from config.cjs:    ${chalk.gray('brand: { logos: { primary: \'./docs/logo.svg\' } }')}`)
  console.log()
}
