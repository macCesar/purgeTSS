import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-profile-'))
const bin = path.resolve('bin/purgetss')
const profile = path.join(root, 'profile.json')
const run = args => spawnSync(process.execPath, [bin, ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, NO_UPDATE_NOTIFIER: '1' } })
try {
  for (const args of [['--profile', profile], ['b', '--profile', profile], ['--all', '--profile', profile]]) {
    fs.rmSync(profile, { force: true })
    const result = run(args)
    assert.equal(result.status, 1, result.stdout + result.stderr)
    const data = JSON.parse(fs.readFileSync(profile, 'utf8'))
    assert.equal(data.schemaVersion, 1)
    assert.equal(data.status, 'failed')
    assert.ok(data.durationMs >= 0)
    assert.ok(data.cpu.user >= 0)
    assert.ok(data.memory.peakRssBytes > 0)
    assert.ok(Array.isArray(data.phases))
    assert.equal(typeof data.counters, 'object')
  }
  const result = run(['shades', 'ff0000', '--log', '--profile', profile])
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(JSON.parse(fs.readFileSync(profile, 'utf8')).status, 'completed')
  const failedWrite = run(['shades', 'ff0000', '--log', '--profile', root])
  assert.equal(failedWrite.status, 0)
  assert.match(failedWrite.stderr, /profile/i)
  const first = path.join(root, 'first.json')
  const last = path.join(root, 'last.json')
  assert.equal(run(['shades', 'ff0000', '--log', '--profile', first, '--profile', last]).status, 0)
  assert.equal(fs.existsSync(first), false, 'repeated options use the last destination')
  assert.equal(fs.existsSync(last), true)
  const literal = path.join(root, 'literal.json')
  run(['shades', '--', '--profile=' + literal])
  assert.equal(fs.existsSync(literal), false, 'arguments after -- are not profile options')
  run(['--profile', '--debug'])
  assert.equal(fs.existsSync(path.join(root, '--debug')), false, 'missing profile values must not write to another flag')
  const originalFailure = run(['b', '--profile', root])
  assert.equal(originalFailure.status, 1)
  assert.match(originalFailure.stderr, /profile/i)
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('Profile CLI contracts passed')
