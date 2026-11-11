import assert from 'node:assert/strict'
import { setTimeout } from 'node:timers/promises'
import { start, finish, localStart, localFinish } from '../../../src/cli/utils/cli-helpers.js'
import { createProfile, withProfile } from '../../../src/cli/utils/profile.js'
const profile = createProfile('timers')
await withProfile(profile, async() => {
  const outer = start()
  const local = localStart()
  await setTimeout(30)
  const inner = localStart()
  localFinish('inner', inner)
  localFinish('outer', local)
  finish('done', outer)
})
const phases = profile.snapshot().phases
assert.equal(phases.length, 3)
assert.ok(phases[1].durationMs >= 25)
assert.ok(phases[0].durationMs < phases[1].durationMs)
console.log('Independent timing contracts passed')
