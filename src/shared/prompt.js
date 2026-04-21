/**
 * PurgeTSS - Interactive prompt helpers
 *
 * Small wrapper around Node's readline for yes/no confirmations on destructive
 * operations (in-place brand/images writes). Auto-skips when:
 *   - the caller sets `yes: true` (e.g. from --yes flag)
 *   - the PURGETSS_YES=1 environment variable is set
 *   - stdin is not a TTY (CI, hooks, piped input)
 *
 * Default answer is NO on empty input — requires explicit "y" / "yes" to proceed.
 *
 * @fileoverview TTY-aware confirmation prompts
 * @author César Estrada
 */

import readline from 'node:readline/promises'

/**
 * Ask the user for a yes/no confirmation.
 *
 * @param {string} message - Prompt text shown to the user. A trailing space is
 *   added automatically, so pass something like "Continue? [y/N]".
 * @param {Object} [opts]
 * @param {boolean} [opts.yes=false] - Skip prompt and answer yes (e.g. --yes flag).
 * @returns {Promise<boolean>} True when confirmed or skipped; false otherwise.
 */
export async function confirm(message, { yes = false } = {}) {
  if (yes) return true
  if (process.env.PURGETSS_YES === '1') return true
  if (!process.stdin.isTTY) return true

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  try {
    const answer = await rl.question(`${message} `)
    return /^y(es)?$/i.test(answer.trim())
  } finally {
    rl.close()
  }
}

/**
 * Three-way confirmation: yes / no / always. Same skip rules as confirm()
 * (--yes flag, PURGETSS_YES env, non-TTY all resolve to 'yes').
 *
 * @param {string} message - Prompt text (a trailing space is added).
 * @param {Object} [opts]
 * @param {boolean} [opts.yes=false] - Skip prompt, answer 'yes'.
 * @returns {Promise<'yes'|'no'|'always'>} The user's choice.
 */
export async function confirmWithAlways(message, { yes = false } = {}) {
  if (yes) return 'yes'
  if (process.env.PURGETSS_YES === '1') return 'yes'
  if (!process.stdin.isTTY) return 'yes'

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  try {
    const answer = (await rl.question(`${message} `)).trim().toLowerCase()
    if (answer === 'a' || answer === 'always') return 'always'
    if (answer === 'y' || answer === 'yes') return 'yes'
    return 'no'
  } finally {
    rl.close()
  }
}
