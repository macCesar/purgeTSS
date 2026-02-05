/**
 * E2E Tests for PurgeTSS Con  console.log('     ┌──────────────────────────────────────────────────────╮')
  console.log(`     │ 🧪 Testing Configuration: ${configName.padEnd(23)} │`)
  console.log(`     │ 📋 ${testDescription.padEnd(38)} │`)
  console.log('     └──────────────────────────────────────────────────────┘\n')ration Options
 * Tests different configuration scenarios
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)

console.log('🔧 Testing PurgeTSS Configuration Options\n')

const PROJECT_PATH = 'test-project'
const CONFIG_JS_PATH = `${PROJECT_PATH}/purgetss/config.js`
const CONFIG_CJS_PATH = `${PROJECT_PATH}/purgetss/config.cjs`

async function createConfigFile(configOptions) {
  const configContent = `
module.exports = ${JSON.stringify(configOptions, null, 2)}
`

  // Ensure purgetss directory exists
  const purgetssDir = path.dirname(CONFIG_JS_PATH)
  if (!fs.existsSync(purgetssDir)) {
    fs.mkdirSync(purgetssDir, { recursive: true })
  }

  // Check if config.cjs already exists (after migration)
  const configPath = fs.existsSync(CONFIG_CJS_PATH) ? CONFIG_CJS_PATH : CONFIG_JS_PATH

  fs.writeFileSync(configPath, configContent)
  console.log(`     📝 Created config with options (${path.basename(configPath)}):`, configOptions)
}

async function testConfiguration(configName, configOptions, testDescription) {
  console.log('\n     ══════════════════════════════════════════════════════════════')
  console.log(`     🧪 Testing Configuration: ${configName}`)
  console.log(`     📋 ${testDescription}`)
  console.log('     ══════════════════════════════════════════════════════════════\n')

  try {
    // Create config file
    await createConfigFile(configOptions)

    // Run PurgeTSS
    const { stdout, stderr } = await execAsync('../bin/purgetss build', { cwd: PROJECT_PATH })

    console.log('     📄 Build Output:')
    if (stdout) {
      const indentedOutput = stdout.split('\n').map(line =>
        line.trim() ? `     ${line}` : line
      ).join('\n')
      console.log(indentedOutput)
    }
    if (stderr) {
      console.log('     ⚠️  Stderr:', stderr)
    }

    // Check if utilities.tss was created in the correct location
    const tailwindPath = `${PROJECT_PATH}/purgetss/styles/utilities.tss`
    if (fs.existsSync(tailwindPath)) {
      const content = fs.readFileSync(tailwindPath, 'utf8')
      const linesCount = content.split('\n').length
      console.log(`     ✅ Generated utilities.tss (${linesCount} lines)`)

      // Log first few lines for verification
      const firstLines = content.split('\n').slice(0, 3).join('\n')
      console.log('     📝 First lines preview:')
      const indentedPreview = firstLines.split('\n').map(line =>
        `     ${line}`
      ).join('\n')
      console.log(indentedPreview)

      console.log(`\n     ✅ Configuration ${configName} test passed\n`)
      return true
    } else {
      console.log('     ❌ utilities.tss not generated in purgetss/styles/')

      // Check if it was generated elsewhere
      const altPath = `${PROJECT_PATH}/app/assets/utilities.tss`
      if (fs.existsSync(altPath)) {
        console.log('     ⚠️  Found in app/assets/ instead')
      }
      return false
    }
  } catch (error) {
    console.error(`     ❌ Configuration ${configName} test failed:`, error.message)
    return false
  }
}

async function runConfigurationTests() {
  console.log('     🎯 Running configuration tests...\n')

  const tests = [
    {
      name: 'Default Config',
      options: {},
      description: 'Test with default configuration options'
    },
    {
      name: 'Custom Purge Paths',
      options: {
        content: ['app/**/*.{js,xml}', 'widgets/**/*.{js,xml}']
      },
      description: 'Test with custom content paths for purging'
    },
    {
      name: 'Font Processing Enabled',
      options: {
        fonts: {
          enabled: true,
          fontAwesome: true,
          materialIcons: true
        }
      },
      description: 'Test with font processing options'
    },
    {
      name: 'Custom Color Palette',
      options: {
        theme: {
          extend: {
            colors: {
              'custom-blue': '#3B82F6',
              'custom-red': '#EF4444'
            }
          }
        }
      },
      description: 'Test with custom color palette'
    },
    {
      name: 'Modules Mode',
      options: {
        modules: true,
        content: ['app/**/*.{js,xml}']
      },
      description: 'Test with modules mode enabled'
    },
    {
      name: 'Safelist Classes',
      options: {
        purge: {
          options: {
            safelist: ['text-red-500', 'bg-blue-600']
          }
        }
      },
      description: 'Test with safelist to preserve specific classes'
    }
  ]

  const results = []

  for (const test of tests) {
    const success = await testConfiguration(test.name, test.options, test.description)
    results.push({ ...test, success })

    // Clean up between tests
    try {
      await execAsync('rm -f app/assets/utilities.tss', { cwd: PROJECT_PATH })
    } catch (error) {
      // Ignore cleanup errors
    }

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Summary
  console.log('     ' + '='.repeat(58))
  console.log('     📊 CONFIGURATION TESTS SUMMARY')
  console.log('     ' + '='.repeat(58))

  const passed = results.filter(r => r.success).length
  const total = results.length

  results.forEach(({ name, success }) => {
    console.log(`     ${success ? '✅' : '❌'} ${name}`)
  })

  console.log(`\n     🎯 Results: ${passed}/${total} configuration tests passed`)

  if (passed === total) {
    console.log('     🎉 ALL CONFIGURATION TESTS PASSED!')
  } else {
    console.log('     ⚠️  Some configuration tests failed')
  }

  return passed === total
}

// Main execution
async function main() {
  if (!fs.existsSync(PROJECT_PATH)) {
    throw new Error(`Test project not found at: ${PROJECT_PATH}`)
  }
  console.log('     🔧 Setting up configuration test environment...\n')

  // Clean previous artifacts
  try {
    await execAsync('rm -rf app/assets/utilities.tss purgetss/config.js purgetss/config.cjs', { cwd: PROJECT_PATH })
    console.log('     🧹 Cleaned previous test artifacts\n')
  } catch (error) {
    // Ignore cleanup errors
  }

  const success = await runConfigurationTests()

  // Final cleanup
  try {
    await execAsync('rm -rf purgetss/config.js purgetss/config.cjs app/assets/utilities.tss', { cwd: PROJECT_PATH })
  } catch (error) {
    // Ignore cleanup errors
  }

  if (!success) {
    throw new Error('Some configuration tests failed')
  }

  return success
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { testConfiguration, runConfigurationTests }
