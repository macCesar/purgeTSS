import fs from 'node:fs'
import { performance } from 'node:perf_hooks'
import { AsyncLocalStorage } from 'node:async_hooks'

const profiles = new AsyncLocalStorage()

export function currentProfile() {
  return profiles.getStore()
}

export function withProfile(profile, action) {
  return profiles.run(profile, action)
}

export function createProfile(command) {
  const started = performance.now()
  const cpu = process.cpuUsage()
  return {
    schemaVersion: 1,
    command,
    status: 'completed',
    phases: [],
    counters: {},
    increment(name, count = 1) {
      this.counters[name] = (this.counters[name] || 0) + count
    },
    snapshot(exitCode = 0) {
      return {
        schemaVersion: this.schemaVersion,
        command: this.command,
        status: exitCode ? 'failed' : this.status,
        ...(this.skipReason ? { skipReason: this.skipReason } : {}),
        durationMs: performance.now() - started,
        cpu: process.cpuUsage(cpu),
        memory: { ...process.memoryUsage(), peakRssBytes: process.resourceUsage().maxRSS * 1024 },
        phases: this.phases,
        counters: this.counters
      }
    },
    write(file, exitCode) {
      try {
        fs.writeFileSync(file, JSON.stringify(this.snapshot(exitCode), null, 2) + '\n')
      } catch (error) {
        console.error(`::PurgeTSS:: Cannot write profile "${file}": ${error.message}`)
      }
    }
  }
}

export function beginPhase() {
  return { started: performance.now(), profile: currentProfile() }
}

export function endPhase(token, name) {
  const durationMs = performance.now() - token.started
  token.profile?.phases.push({ name, durationMs })
  return durationMs
}

// Instrument only an explicitly profiled CLI run. No source cache or process
// result is shared across invocations; callbacks retain their async context.
export function instrumentFileOperations(profile) {
  const originals = []
  for (const [target, methods] of [[fs, ['readFileSync', 'writeFileSync', 'copyFileSync', 'readFile', 'writeFile', 'copyFile']], [fs.promises, ['readFile', 'writeFile', 'copyFile']]]) {
    for (const method of methods) {
      const original = target[method]
      target[method] = function(...args) {
        if (currentProfile() === profile) {
          if (method.startsWith('read')) profile.increment('reads')
          else {
            profile.increment('writes')
            if (method.startsWith('copy')) profile.increment('copies')
          }
        }
        return original.apply(this, args)
      }
      originals.push(() => { target[method] = original })
    }
  }
  return () => originals.reverse().forEach(restore => restore())
}
