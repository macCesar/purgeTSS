/**
 * Simple CLI Test - Debug version
 */

import { spawn } from 'child_process'

console.log('🧪 Testing single command with real-time output...\n')

const cmd = '../bin/purgetss'
const args = ['build']
const cwd = 'test-project'

console.log(`💻 Running: ${cmd} ${args.join(' ')}`)
console.log(`📁 Working directory: ${cwd}`)
console.log('⏳ Starting...\n')

const child = spawn(cmd, args, {
  cwd: cwd,
  stdio: ['pipe', 'pipe', 'pipe']
})

child.stdout.on('data', (data) => {
  process.stdout.write(data.toString())
})

child.stderr.on('data', (data) => {
  process.stderr.write(`⚠️  ${data.toString()}`)
})

child.on('close', (code) => {
  console.log(`\n✅ Command finished with exit code: ${code}`)
  process.exit(code)
})

child.on('error', (error) => {
  console.error(`❌ Error: ${error.message}`)
  process.exit(1)
})
