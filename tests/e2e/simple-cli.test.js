// Simple CLI test to verify basic functionality
import { exec } from 'child_process'
import { promisify } from 'util'
import { createSandboxProject } from '../helpers/sandbox-project.js'

const execAsync = promisify(exec)
// Disposable copy — a purge run writes app.tss and the generated styles.
const sandbox = createSandboxProject('simple-cli')

console.log('🧪 Testing Basic CLI Functionality\n')

async function testBasicCLI() {
  try {
    console.log('     Testing purgetss from a sandboxed project copy...')

    // Test basic command execution from the project copy
    const { stdout, stderr } = await execAsync(sandbox.purgetssBin, {
      cwd: sandbox.projectPath,
      timeout: 30000 // 30 second timeout
    })

    console.log('     📄 Output:')
    if (stdout) {
      const indentedOutput = stdout.split('\n').map(line =>
        line.trim() ? `     ${line}` : line
      ).join('\n')
      console.log(indentedOutput)
    }
    if (stderr) console.log('     ⚠️  Stderr:', stderr)

    console.log('\n     ✅ Basic CLI test completed successfully')
    return true

  } catch (error) {
    console.error('     ❌ CLI test failed:', error.message)
    return false
  }
}

// Run the test
try {
  const success = await testBasicCLI()

  if (success) {
    console.log('\n     🎉 CLI functionality verified!')
  } else {
    console.log('\n     ⚠️ CLI test had issues')
  }
} catch (error) {
  console.error('     Test execution failed:', error)
} finally {
  sandbox.cleanup()
}
