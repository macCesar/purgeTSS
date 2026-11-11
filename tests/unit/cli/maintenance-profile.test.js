import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-maintenance-profile-'))
const bin = path.resolve('bin/purgetss')
try {
  for (const name of ['npm', 'sudo']) fs.writeFileSync(path.join(root, name), '#!/bin/sh\nsleep 0.05\nexit 7\n', { mode: 0o755 })
  fs.writeFileSync(path.join(root, 'ti'), '#!/bin/sh\nsleep 0.05\necho "app.idprefix not found"\nexit 1\n', { mode: 0o755 })
  for (const [alias, command] of [['u', 'update'], ['su', 'sudo-update'], ['c', 'create']]) {
    const profile = path.join(root, 'profile.json')
    const result = spawnSync(process.execPath, [bin, alias, ...(alias === 'c' ? ['Example'] : []), '--profile', profile], { cwd: root, encoding: 'utf8', env: { ...process.env, NO_UPDATE_NOTIFIER: '1', PATH: root + path.delimiter + process.env.PATH } })
    assert.equal(result.status, 0, 'retain the legacy exit status for controlled maintenance/create errors')
    const data = JSON.parse(fs.readFileSync(profile, 'utf8'))
    assert.equal(data.command, command)
    assert.equal(data.status, 'failed', `${command} must report its controlled failure`)
    assert.ok(data.phases.some(phase => phase.name === command && phase.durationMs >= 40), 'phase must include the asynchronous command')
  }
  const workspace = path.join(root, 'workspace')
  fs.mkdirSync(path.join(workspace, 'Existing'), { recursive: true })
  fs.writeFileSync(path.join(root, 'ti'), `#!/bin/sh\nif [ "$2" = "app.idprefix" ]; then echo com.example; else echo '${workspace}'; fi\n`, { mode: 0o755 })
  const loader = path.join(root, 'prompt-loader.mjs')
  const promptModule = 'data:text/javascript,' + encodeURIComponent('export default { prompt: async () => { throw new Error(\'Synthetic prompt failure\') } }')
  fs.writeFileSync(loader, `export async function resolve(name, context, next) { if (name === 'inquirer') return {url: ${JSON.stringify(promptModule)}, shortCircuit:true}; return next(name, context) }`)
  const preload = path.join(root, 'prompt-preload.mjs')
  fs.writeFileSync(preload, `import {register} from 'node:module'; register(${JSON.stringify(new URL('file://' + loader).href)})`)
  const profile = path.join(root, 'prompt-profile.json')
  const result = spawnSync(process.execPath, ['--import', preload, bin, 'c', 'Existing', '--profile', profile], { cwd: root, encoding: 'utf8', env: { ...process.env, NO_UPDATE_NOTIFIER: '1', PATH: root + path.delimiter + process.env.PATH } })
  assert.equal(result.status, 0, 'prompt rejections retain the handled creation error exit status')
  assert.equal(JSON.parse(fs.readFileSync(profile)).status, 'failed')
  assert.match(result.stdout, /Synthetic prompt failure/)
  assert.doesNotMatch(result.stderr, /at file:\/\//)
} finally { fs.rmSync(root, { recursive: true, force: true }) }
console.log('Maintenance and creation profile contracts passed')
