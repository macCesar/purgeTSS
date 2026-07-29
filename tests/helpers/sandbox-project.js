/**
 * Sandbox copy of `test-project/` for E2E tests.
 *
 * The E2E suites run the real CLI, which writes `utilities.tss`, `app.tss`,
 * `config.cjs`, `purgetss.ui.js` and image assets into whatever project it is
 * pointed at. Pointing them at the versioned `test-project/` meant every
 * `npm test` left the working tree dirty — and two suites go further and
 * `rm -f purgetss/config.cjs`, so the regenerated file came back as the bare
 * template (dropping `images.files` entries the SVG pipeline had synced).
 *
 * Each suite now copies the project into a tmpdir and runs there, so the
 * versioned baseline is only ever read. Mirrors what sync-images.test.js
 * already does for unit tests.
 *
 * @fileoverview Disposable project copy for E2E runs
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

/** Absolute path to the CLI entry point, valid from any cwd. */
export const purgetssBin = path.join(repoRoot, 'bin', 'purgetss')

/** Absolute path to the versioned baseline project (read-only). */
export const baselineProject = path.join(repoRoot, 'test-project')

/**
 * Copy `test-project/` into a fresh tmpdir.
 *
 * @param {string} label - Short suite name, used in the tmpdir prefix.
 * @returns {{ projectPath: string, purgetssBin: string, cleanup: () => void }}
 */
export function createSandboxProject(label = 'e2e') {
  if (!fs.existsSync(baselineProject)) {
    throw new Error(`Baseline project not found at: ${baselineProject}`)
  }

  const root = fs.mkdtempSync(path.join(os.tmpdir(), `purgetss-${label}-`))
  const projectPath = path.join(root, 'test-project')

  copyDir(baselineProject, projectPath)

  return {
    projectPath,
    purgetssBin,
    cleanup: () => fs.rmSync(root, { recursive: true, force: true })
  }
}

// Hand-rolled instead of fs.cpSync: that one stays flagged as experimental
// below Node 22.3, and the CLI supports older runtimes.
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue

    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)

    if (entry.isDirectory()) copyDir(from, to)
    else if (entry.isFile()) fs.copyFileSync(from, to)
  }
}
