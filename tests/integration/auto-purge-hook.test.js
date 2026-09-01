import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { createSandboxProject } from '../helpers/sandbox-project.js'

const failureHint = '::PurgeTSS:: Auto-Purge failed. Run `purgetss` from the project root to see the cause.'

function runPurgeTSS(projectPath, purgetssBin) {
  const result = spawnSync(process.execPath, [purgetssBin, 'init'], {
    cwd: projectPath,
    encoding: 'utf8'
  })

  assert.strictEqual(result.status, 0, result.stderr || result.stdout)
}

function executeHookCommand(hookContents) {
  const command = hookContents
    .split(/\r?\n/)
    .find(line => line.includes('::PurgeTSS::'))

  assert.ok(command, 'Generated alloy.jmk should contain the PurgeTSS hook')

  const errors = []
  const logger = {
    warn: () => {},
    error: message => errors.push(message)
  }
  const childProcess = {
    execSync(command, options) {
      assert.strictEqual(command, 'purgetss')
      assert.deepStrictEqual(options, { stdio: 'inherit' })
      throw new Error('purgetss failed')
    }
  }

  assert.throws(
    () => Function('event', 'logger', 'require', command)({ dir: { project: '/tmp/example' } }, logger, () => childProcess),
    /purgetss failed/
  )
  assert.deepStrictEqual(errors, [failureHint])
}

function testActiveHookMigration() {
  const sandbox = createSandboxProject('auto-purge-hook-active')

  try {
    const hookPath = path.join(sandbox.projectPath, 'app', 'alloy.jmk')
    const legacyHook = fs.readFileSync(hookPath, 'utf8')
    assert.ok(legacyHook.includes('execSync(\'purgetss\', logger.warn('), 'Fixture should start with the legacy hook')

    runPurgeTSS(sandbox.projectPath, sandbox.purgetssBin)

    const updatedHook = fs.readFileSync(hookPath, 'utf8')
    assert.ok(updatedHook.includes('execSync(\'purgetss\', { stdio: \'inherit\' })'))
    assert.ok(updatedHook.includes(failureHint))
    assert.ok(!updatedHook.includes('execSync(\'purgetss\', logger.warn('))
    executeHookCommand(updatedHook)
  } finally {
    sandbox.cleanup()
  }
}

function testDisabledHookMigration() {
  const sandbox = createSandboxProject('auto-purge-hook-disabled')

  try {
    const hookPath = path.join(sandbox.projectPath, 'app', 'alloy.jmk')
    const disabledLegacyHook = fs.readFileSync(hookPath, 'utf8')
      .replace('\trequire(\'child_process\')', '\t//\trequire(\'child_process\')')
    fs.writeFileSync(hookPath, disabledLegacyHook)

    runPurgeTSS(sandbox.projectPath, sandbox.purgetssBin)

    const updatedHook = fs.readFileSync(hookPath, 'utf8')
    const hookLine = updatedHook.split(/\r?\n/).find(line => line.includes('::PurgeTSS::'))
    assert.ok(hookLine.startsWith('\t//'), 'Migration should keep a disabled hook disabled')
    assert.ok(hookLine.includes('execSync(\'purgetss\', { stdio: \'inherit\' })'))
  } finally {
    sandbox.cleanup()
  }
}

console.log('Testing Alloy auto-purge hook diagnostics...')
testActiveHookMigration()
testDisabledHookMigration()
console.log('All Alloy auto-purge hook diagnostic tests passed')
