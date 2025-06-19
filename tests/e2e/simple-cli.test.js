// Simple CLI test to verify basic functionality
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

console.log('🧪 Testing Basic CLI Functionality\n')

async function testBasicCLI() {
  try {
    console.log('Testing purgetss from test-project directory...')
    
    // Test basic command execution from test-project
    const { stdout, stderr } = await execAsync('../bin/purgetss', { 
      cwd: 'test-project',
      timeout: 30000 // 30 second timeout
    })
    
    console.log('📄 Output:')
    if (stdout) console.log(stdout)
    if (stderr) console.log('⚠️  Stderr:', stderr)
    
    console.log('✅ Basic CLI test completed successfully')
    return true
    
  } catch (error) {
    console.error('❌ CLI test failed:', error.message)
    return false
  }
}

// Run the test
testBasicCLI().then(success => {
  if (success) {
    console.log('\n🎉 CLI functionality verified!')
    return true
  } else {
    console.log('\n⚠️ CLI test had issues')
    return false
  }
}).catch(error => {
  console.error('Test execution failed:', error)
  return false
})
