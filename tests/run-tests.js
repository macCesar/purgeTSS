/**
 * PurgeTSS Test Runner
 * Organized test execution for different test types
 */

import fs from 'fs'
import { promisify } from 'util'
import { execFile } from 'child_process'
import path from 'path'

const execAsync = promisify(execFile)

// Handle EPIPE errors globally (when output is piped to head, etc.)
process.stdout.on('error', (err) => {
  if (err.code === 'EPIPE') {
    process.exit(0)
  }
})

process.stderr.on('error', (err) => {
  if (err.code === 'EPIPE') {
    process.exit(0)
  }
})

const TEST_CATEGORIES = {
  unit: {
    dir: 'tests/unit',
    name: 'Unit Tests',
    description: 'Fast isolated tests for individual components'
  },
  integration: {
    dir: 'tests/integration',
    name: 'Integration Tests',
    description: 'Tests for component interactions and workflows'
  },
  e2e: {
    dir: 'tests/e2e',
    name: 'End-to-End Tests',
    description: 'Full workflow tests with real projects'
  }
}

async function findTestFiles(dir) {
  try {
    const files = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    // Files to exclude from regular test runs
    const excludeFiles = [
      'installation-simulation.test.js',
      'global-installation-simulation.test.js'
    ]

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...await findTestFiles(fullPath))
      } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs') || entry.name.endsWith('.test.js')) {
        // Skip installation simulation tests from regular runs
        if (!excludeFiles.includes(entry.name)) {
          files.push(fullPath)
        }
      }
    }
    return files
  } catch (error) {
    throw new Error(`Cannot discover tests in ${dir}: ${error.message}`)
  }
}

async function runTestFile(filePath) {
  try {
    console.log('\n  ═════════════════════════════════════════════════════════════════')
    console.log(`  🧪 Running ${path.basename(filePath)}`)
    console.log('  ═════════════════════════════════════════════════════════════════')

    const { stdout, stderr } = await execAsync(process.execPath, [filePath])

    // Indent all output from the test file
    if (stdout) {
      const indentedOutput = stdout.split('\n').map(line =>
        line.trim() ? `     ${line}` : line
      ).join('\n')
      console.log(indentedOutput)
    }

    if (stderr) {
      const indentedError = stderr.split('\n').map(line =>
        line.trim() ? `     ⚠️  ${line}` : line
      ).join('\n')
      console.error(indentedError)
    }

    console.log('  ✅ Test file completed successfully')
    return { success: true, file: filePath }
  } catch (error) {
    console.error(`  ❌ Test file failed: ${error.message}`)
    return { success: false, file: filePath, error: error.message }
  }
}

async function runTestCategory(category) {
  const config = TEST_CATEGORIES[category]
  if (!config) {
    console.error(`❌ Unknown test category: ${category}`)
    return false
  }

  console.log('\n════════════════════════════════════════════════════════════════════')
  console.log(`🚀 ${config.name}`)
  console.log(`📋 ${config.description}`)
  console.log('════════════════════════════════════════════════════════════════════')

  const testFiles = await findTestFiles(config.dir)
  if (testFiles.length === 0) {
    console.log('  📭 No test files found')
    return true
  }

  const results = []
  for (const file of testFiles) {
    const result = await runTestFile(file)
    results.push(result)
  }

  const passed = results.filter(r => r.success).length
  const total = results.length

  console.log('\n' + '═'.repeat(68))
  console.log(`📊 ${config.name} Results: ${passed}/${total} passed`)
  console.log('═'.repeat(68))

  return passed === total
}

async function runAllTests() {
  console.log('🧪 PurgeTSS Test Suite\n')
  console.log('Running all test categories...\n')

  const categoryResults = []

  for (const category of Object.keys(TEST_CATEGORIES)) {
    const success = await runTestCategory(category)
    categoryResults.push({ category, success })
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 FINAL RESULTS')
  console.log('='.repeat(50))

  let allPassed = true
  for (const { category, success } of categoryResults) {
    const status = success ? '✅' : '❌'
    console.log(`${status} ${TEST_CATEGORIES[category].name}: ${success ? 'PASSED' : 'FAILED'}`)
    if (!success) allPassed = false
  }

  console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
  return allPassed
}

// CLI interface
const command = process.argv[2]

switch (command) {
  case 'unit':
  case 'integration':
  case 'e2e':
    process.exitCode = await runTestCategory(command).catch(error => { console.error(error); return false }) ? 0 : 1
    break
  case 'all':
  case undefined:
    process.exitCode = await runAllTests().catch(error => { console.error(error); return false }) ? 0 : 1
    break
  default:
    process.exitCode = 1
    console.log(`
🧪 PurgeTSS Test Runner

Usage:
  node tests/run-tests.js [category]

Categories:
  unit         Run unit tests only
  integration  Run integration tests only
  e2e          Run end-to-end tests only
  all          Run all tests (default)

Examples:
  node tests/run-tests.js unit
  node tests/run-tests.js all
`)
}
