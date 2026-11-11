import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-runner-'))
const runner = path.resolve('tests/run-tests.js')
try {
  for (const category of ['unit', 'integration', 'e2e']) fs.mkdirSync(path.join(root, 'tests', category), { recursive: true })
  fs.writeFileSync(path.join(root, 'tests/unit/failure.test.js'), 'process.exitCode = 7\n')
  for (const category of ['unit', 'all']) {
    const result = spawnSync(process.execPath, [runner, category], { cwd: root, encoding: 'utf8' })
    assert.notEqual(result.status, 0, `${category} must propagate failed files`)
  }
  fs.writeFileSync(path.join(root, 'tests/unit/failure.test.js'), 'console.log("passed")\n')
  assert.equal(spawnSync(process.execPath, [runner, 'all'], { cwd: root }).status, 0)
  assert.notEqual(spawnSync(process.execPath, [runner, 'unknown'], { cwd: root }).status, 0)
  fs.rmSync(path.join(root, 'tests/unit'), { recursive: true })
  assert.notEqual(spawnSync(process.execPath, [runner, 'unit'], { cwd: root }).status, 0)
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('Runner exit contracts passed')
