/**
 * Tests for CLI Commands - Simple Node.js tests
 */

console.log('🧪 Testing CLI Commands...')

async function testBuildCommand() {
  try {
    const { build, buildLegacy } = await import('../../../src/cli/commands/build.js')
    
    console.log('✅ Build Command test:')
    console.log('  build type:', typeof build)
    console.log('  buildLegacy type:', typeof buildLegacy)
    
    return true
  } catch (error) {
    console.error('❌ Error in build command test:', error.message)
    return false
  }
}

async function testPurgeCommand() {
  try {
    const { purgeClasses } = await import('../../../src/cli/commands/purge.js')
    
    console.log('✅ Purge Command test:')
    console.log('  purgeClasses type:', typeof purgeClasses)
    
    return true
  } catch (error) {
    console.error('❌ Error in purge command test:', error.message)
    return false
  }
}

async function testIconLibrary() {
  try {
    const { copyFonts, copyFont } = await import('../../../src/cli/commands/icon-library.js')
    
    console.log('✅ Icon Library test:')
    console.log('  copyFonts type:', typeof copyFonts)
    console.log('  copyFont type:', typeof copyFont)
    
    return true
  } catch (error) {
    console.error('❌ Error in icon library test:', error.message)
    return false
  }
}

async function testProjectDetection() {
  try {
    const { alloyProject, titaniumProject } = await import('../../../src/cli/utils/project-detection.js')
    
    console.log('✅ Project Detection test:')
    console.log('  alloyProject type:', typeof alloyProject)
    console.log('  titaniumProject type:', typeof titaniumProject)
    
    return true
  } catch (error) {
    console.error('❌ Error in project detection test:', error.message)
    return false
  }
}

async function testFileOperations() {
  try {
    const { makeSureFolderExists, getFiles } = await import('../../../src/cli/utils/file-operations.js')
    
    console.log('✅ File Operations test:')
    console.log('  makeSureFolderExists type:', typeof makeSureFolderExists)
    console.log('  getFiles type:', typeof getFiles)
    
    return true
  } catch (error) {
    console.error('❌ Error in file operations test:', error.message)
    return false
  }
}

async function testHookManagement() {
  try {
    const { disableHook, enableHook, addHook } = await import('../../../src/cli/utils/hook-management.js')
    
    console.log('✅ Hook Management test:')
    console.log('  disableHook type:', typeof disableHook)
    console.log('  enableHook type:', typeof enableHook)
    console.log('  addHook type:', typeof addHook)
    
    return true
  } catch (error) {
    console.error('❌ Error in hook management test:', error.message)
    return false
  }
}

async function testInitCommand() {
  try {
    const { init, createConfigFile, createDefinitionsFile } = await import('../../../src/cli/commands/init.js')
    
    console.log('✅ Init Command test:')
    console.log('  init type:', typeof init)
    console.log('  createConfigFile type:', typeof createConfigFile)
    console.log('  createDefinitionsFile type:', typeof createDefinitionsFile)
    
    return true
  } catch (error) {
    console.error('❌ Error in init command test:', error.message)
    return false
  }
}

async function testCreateCommand() {
  try {
    const { create, createProject } = await import('../../../src/cli/commands/create.js')
    
    console.log('✅ Create Command test:')
    console.log('  create type:', typeof create)
    console.log('  createProject type:', typeof createProject)
    
    return true
  } catch (error) {
    console.error('❌ Error in create command test:', error.message)
    return false
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting CLI Commands Tests...\n')
  
  const results = await Promise.all([
    testBuildCommand(),
    testPurgeCommand(),
    testIconLibrary(),
    testProjectDetection(),
    testFileOperations(),
    testHookManagement(),
    testInitCommand(),
    testCreateCommand()
  ])
  
  const passed = results.filter(r => r).length
  const total = results.length
  
  console.log(`\n📊 Test Results: ${passed}/${total} passed`)
  
  if (passed === total) {
    console.log('🎉 All tests passed!')
  } else {
    console.log('⚠️  Some tests failed!')
  }
}

runTests().catch(console.error)
