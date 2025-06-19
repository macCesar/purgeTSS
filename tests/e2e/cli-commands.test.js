/**
 * E2E Tests f  console.log('     ┌──────────────────────────────────────────────────────╮')
  console.log(`     │ 🧪 Testing: ${description.padEnd(32)} │`)
  console.log(`     │ 💻 Command: ${command.padEnd(32)} │`)
  console.log('     └──────────────────────────────────────────────────────┘')urgeTSS CLI Commands
 * Tests real commands on actual Alloy projects with REAL-TIME OUTPUT
 */

import { spawn, exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)

console.log('🚀 Testing PurgeTSS CLI Commands on Alloy Project (Real-time)\n')

const PROJECT_PATH = 'test-project'
const PURGETSS_BIN = '../bin/purgetss'

async function testCommandRealTime(command, description, expectedFiles = []) {
  console.log('\n     ══════════════════════════════════════════════════════════════')
  console.log(`     🧪 Testing: ${description}`)
  console.log(`     💻 Command: ${command}`)
  console.log('     ══════════════════════════════════════════════════════════════')
  console.log('     ⏳ Executing...\n')

  return new Promise((resolve, reject) => {
    // Split command and args
    const parts = command.split(' ')
    const cmd = parts[0]
    const args = parts.slice(1)

    const child = spawn(cmd, args, {
      cwd: PROJECT_PATH,
      stdio: ['pipe', 'pipe', 'pipe']
    })

    // Show output in real-time with proper indentation
    child.stdout.on('data', (data) => {
      const output = data.toString()
      const indentedOutput = output.split('\n').map(line =>
        line.trim() ? `     ${line}` : line
      ).join('\n')
      process.stdout.write(indentedOutput)
    })

    child.stderr.on('data', (data) => {
      const output = data.toString()
      if (output.trim()) {
        console.log(`     ⚠️  ${output.trim()}`)
      }
    })

    child.on('close', (code) => {
      console.log('\n     📁 Checking created files:')

      // Check if expected files were created
      let filesCreated = 0
      for (const filePath of expectedFiles) {
        const fullPath = path.join(PROJECT_PATH, filePath)
        if (fs.existsSync(fullPath)) {
          console.log(`     ✅ Created: ${filePath}`)
          filesCreated++
        } else {
          console.log(`     ❌ Missing: ${filePath}`)
        }
      }

      if (expectedFiles.length > 0) {
        console.log(`\n     📊 Files: ${filesCreated}/${expectedFiles.length} created`)
      }

      const success = code === 0
      console.log(`     ${success ? '✅' : '❌'} Command ${success ? 'completed' : 'failed'} (exit code: ${code})`)
      console.log('     ' + '─'.repeat(58))

      if (success) {
        resolve(true)
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on('error', (error) => {
      console.error(`\n     ❌ Command failed: ${error.message}`)
      console.log('     ' + '─'.repeat(58))
      reject(error)
    })
  })
}

async function runAllCommandTests() {
  console.log('     🎯 Running SAFE CLI command tests (REAL-TIME)...\n')
  console.log('     ⚠️  NOTE: Excluded system-modifying commands (update, create, dependencies)\n')
  console.log('     ' + '='.repeat(58))

  const tests = [
    {
      command: `${PURGETSS_BIN}`,
      description: 'Basic purgetss command (build)',
      expectedFiles: [
        'purgetss/styles/tailwind.tss',
        'purgetss/styles/definitions.css'
      ]
    },
    {
      command: `${PURGETSS_BIN} build`,
      description: 'Explicit build command',
      expectedFiles: [
        'purgetss/styles/tailwind.tss',
        'purgetss/styles/definitions.css'
      ]
    },
    {
      command: `${PURGETSS_BIN} build-fonts`,
      description: 'Build with fonts processing',
      expectedFiles: ['purgetss/styles/fonts.tss']
    },
    {
      command: `${PURGETSS_BIN} init`,
      description: 'Initialize PurgeTSS in project',
      expectedFiles: [
        'purgetss/config.cjs',
        'purgetss/styles/tailwind.tss',
        'purgetss/styles/definitions.css'
      ]
    },
    {
      command: `${PURGETSS_BIN} module`,
      description: 'Build with modules',
      expectedFiles: ['app/lib/purgetss.ui.js']
    }
  ]

  const results = []

  for (const test of tests) {
    try {
      const success = await testCommandRealTime(test.command, test.description, test.expectedFiles)
      results.push({ ...test, success })
    } catch (error) {
      results.push({ ...test, success: false, error: error.message })
    }

    // Small delay between tests for readability
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Summary
  console.log('\n     ' + '='.repeat(58))
  console.log('     📊 CLI TESTS SUMMARY')
  console.log('     ' + '='.repeat(58))

  const passed = results.filter(r => r.success).length
  const total = results.length

  results.forEach(({ description, success, error }) => {
    console.log(`     ${success ? '✅' : '❌'} ${description}${error ? ` (${error})` : ''}`)
  })

  console.log(`\n     🎯 Results: ${passed}/${total} tests passed`)

  if (passed === total) {
    console.log('     🎉 ALL CLI TESTS PASSED!')
  } else {
    console.log('     ⚠️  Some CLI tests failed')
  }

  return passed === total
}

// Helper function to check if test project exists
function checkTestProject() {
  if (!fs.existsSync(PROJECT_PATH)) {
    throw new Error(`Test project not found at: ${PROJECT_PATH}. Please ensure the test-project directory exists with a valid Alloy project`)
  }

  if (!fs.existsSync(`${PROJECT_PATH}/tiapp.xml`)) {
    throw new Error(`Invalid Alloy project: tiapp.xml not found in ${PROJECT_PATH}`)
  }

  console.log(`     ✅ Test project found: ${PROJECT_PATH}`)
}

// Main execution
async function main() {
  checkTestProject()

  console.log('     🔧 Setting up test environment...\n')

  // Clean previous artifacts (preserve purgetss/fonts/ for build-fonts test)
  try {
    await execAsync('rm -f purgetss/styles/tailwind.tss purgetss/styles/fonts.tss purgetss/styles/definitions.css purgetss/config.cjs app/lib/purgetss.ui.js', { cwd: PROJECT_PATH })
    await execAsync('rm -f app/assets/fonts/*', { cwd: PROJECT_PATH })
    console.log('     🧹 Cleaned previous test artifacts (preserved purgetss/fonts/)\n')
  } catch (error) {
    // Ignore cleanup errors
  }

  const success = await runAllCommandTests()
  if (!success) {
    throw new Error('Some CLI tests failed')
  }
  return success
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { testCommandRealTime, runAllCommandTests }
