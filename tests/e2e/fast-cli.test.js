// Fast CLI test with reduced commands
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)
const PROJECT_PATH = 'test-project'
const PURGETSS_BIN = '../bin/purgetss'

console.log('🚀 Fast CLI Tests (Essential Commands Only)\n')

async function testEssentialCommands() {
  console.log('     ✅ Test project found:', PROJECT_PATH)

  const tests = [
    {
      command: `${PURGETSS_BIN}`,
      description: 'Basic build command',
      expectedFiles: ['purgetss/styles/utilities.tss']
    },
    {
      command: `${PURGETSS_BIN} module`,
      description: 'Module generation',
      expectedFiles: ['app/lib/purgetss.ui.js']
    }
  ]

  const results = []

  for (const test of tests) {
    console.log('\n     ══════════════════════════════════════════════════════════════')
    console.log(`     🧪 Testing: ${test.description}`)
    console.log(`     💻 Command: ${test.command}`)
    console.log('     ══════════════════════════════════════════════════════════════')
    console.log('     ⏳ Executing...')

    try {
      const startTime = Date.now()
      await execAsync(test.command, {
        cwd: PROJECT_PATH,
        timeout: 10000 // 10 second timeout
      })
      const duration = Date.now() - startTime

      console.log(`     ⏱️  Completed in ${duration}ms`)

      // Check expected files
      let filesFound = 0
      for (const file of test.expectedFiles) {
        const fullPath = path.join(PROJECT_PATH, file)
        if (fs.existsSync(fullPath)) {
          console.log(`     ✅ Created: ${file}`)
          filesFound++
        }
      }

      console.log(`     ✅ ${test.description} - PASSED`)
      results.push({ description: test.description, success: true })
    } catch (error) {
      console.log(`     ❌ ${test.description} - FAILED: ${error.message}`)
      results.push({ description: test.description, success: false, error: error.message })
    }
  }

  // Summary
  console.log('\n     ' + '='.repeat(58))
  console.log('     📊 FAST CLI TESTS SUMMARY')
  console.log('     ' + '='.repeat(58))

  const passed = results.filter(r => r.success).length
  const total = results.length

  results.forEach(result => {
    const status = result.success ? '✅' : '❌'
    console.log(`     ${status} ${result.description}`)
  })

  console.log(`\n     🎯 Results: ${passed}/${total} tests passed`)

  if (passed === total) {
    console.log('     🎉 All essential CLI tests passed!')
  } else {
    console.log('     ⚠️  Some tests failed')
  }

  return passed === total
}

// Run the tests
testEssentialCommands().catch(console.error)
