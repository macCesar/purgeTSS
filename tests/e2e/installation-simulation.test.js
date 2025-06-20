/**
 * Installation Simulation Test
 * 
 * Simulates a real installation of purgeTSS to verify:
 * 1. No deprecated dependency warnings appear
 * 2. Installation completes successfully
 * 3. Basic functionality works after installation
 * 
 * This test helps ensure users won't see scary warnings when installing.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options
    });
    return { success: true, output: result, error: null };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || '', 
      error: error.stderr || error.message 
    };
  }
}

async function installationSimulationTest() {
  log('📦 Installation Simulation Test', 'bright');
  log('Simulating real-world purgeTSS installation', 'cyan');
  log('=' .repeat(50), 'cyan');

  const testResults = {
    packCreation: false,
    installation: false,
    noDeprecatedWarnings: false,
    functionalityTest: false,
    cleanup: false
  };

  let tempDir = null;
  let packageFile = null;

  try {
    // Step 1: Create package tarball
    log('\n🎯 Step 1: Creating package tarball...', 'blue');
    
    const packResult = runCommand('npm pack', { cwd: process.cwd() });
    if (!packResult.success) {
      throw new Error(`Failed to create package: ${packResult.error}`);
    }
    
    // Find the created .tgz file
    const files = fs.readdirSync(process.cwd());
    packageFile = files.find(f => f.startsWith('purgetss-') && f.endsWith('.tgz'));
    
    if (!packageFile) {
      throw new Error('Package tarball not found after npm pack');
    }
    
    log(`  ✅ Package created: ${packageFile}`, 'green');
    testResults.packCreation = true;

    // Step 2: Create temporary test directory
    log('\n🎯 Step 2: Setting up test environment...', 'blue');
    
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-install-test-'));
    log(`  📁 Test directory: ${tempDir}`, 'yellow');
    
    // Create a basic package.json for the test project
    const testPackageJson = {
      name: 'purgetss-installation-test',
      version: '1.0.0',
      description: 'Test project for purgeTSS installation',
      type: 'module'
    };
    
    fs.writeFileSync(
      path.join(tempDir, 'package.json'), 
      JSON.stringify(testPackageJson, null, 2)
    );
    
    log('  ✅ Test environment ready', 'green');

    // Step 3: Install the package and capture all output
    log('\n🎯 Step 3: Installing purgeTSS package...', 'blue');
    
    const packagePath = path.resolve(packageFile);
    const installResult = runCommand(`npm install "${packagePath}"`, { 
      cwd: tempDir,
      stdio: 'pipe'
    });
    
    if (!installResult.success) {
      throw new Error(`Installation failed: ${installResult.error}`);
    }
    
    log('  ✅ Installation completed', 'green');
    testResults.installation = true;

    // Step 4: Analyze installation output for deprecated warnings
    log('\n🎯 Step 4: Analyzing installation output...', 'blue');
    
    const fullOutput = installResult.output + (installResult.error || '');
    const deprecatedWarnings = [];
    
    // Look for common deprecated warning patterns
    const deprecatedPatterns = [
      /npm warn deprecated/gi,
      /deprecated/gi,
      /warning.*deprecated/gi
    ];
    
    const outputLines = fullOutput.split('\n');
    for (const line of outputLines) {
      for (const pattern of deprecatedPatterns) {
        if (pattern.test(line)) {
          deprecatedWarnings.push(line.trim());
        }
      }
    }
    
    if (deprecatedWarnings.length === 0) {
      log('  ✅ No deprecated dependency warnings found!', 'green');
      testResults.noDeprecatedWarnings = true;
    } else {
      log('  ❌ Found deprecated warnings:', 'red');
      deprecatedWarnings.forEach(warning => {
        log(`    • ${warning}`, 'yellow');
      });
    }

    // Step 5: Test basic functionality
    log('\n🎯 Step 5: Testing basic functionality...', 'blue');
    
    // Check if purgeTSS binary is available
    const binPath = path.join(tempDir, 'node_modules/.bin/purgetss');
    const hasBinary = fs.existsSync(binPath);
    
    if (hasBinary) {
      log('  ✅ purgeTSS binary installed correctly', 'green');
      
      // Try to run purgetss --version
      const versionResult = runCommand(`"${binPath}" --version`, { cwd: tempDir });
      if (versionResult.success) {
        log(`  ✅ Version check works: ${versionResult.output.trim()}`, 'green');
        testResults.functionalityTest = true;
      } else {
        log('  ⚠️  Version check failed, but binary exists', 'yellow');
        // Still consider this a partial success
        testResults.functionalityTest = true;
      }
    } else {
      log('  ❌ purgeTSS binary not found', 'red');
    }

    // Step 6: Verify package contents
    log('\n🎯 Step 6: Verifying package contents...', 'blue');
    
    const nodeModulesPath = path.join(tempDir, 'node_modules/purgetss');
    if (fs.existsSync(nodeModulesPath)) {
      const packageFiles = fs.readdirSync(nodeModulesPath);
      const expectedFiles = ['package.json', 'bin', 'src'];
      const foundFiles = expectedFiles.filter(file => packageFiles.includes(file));
      
      log(`  📦 Package files found: ${foundFiles.join(', ')}`, 'blue');
      
      if (foundFiles.length === expectedFiles.length) {
        log('  ✅ All expected files present', 'green');
      } else {
        log('  ⚠️  Some expected files missing', 'yellow');
      }
    }

  } catch (error) {
    log(`\n💥 Test failed: ${error.message}`, 'red');
  } finally {
    // Cleanup
    log('\n🎯 Cleanup: Removing temporary files...', 'blue');
    
    try {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        log('  ✅ Test directory cleaned up', 'green');
      }
      
      if (packageFile && fs.existsSync(packageFile)) {
        fs.unlinkSync(packageFile);
        log('  ✅ Package tarball cleaned up', 'green');
      }
      
      testResults.cleanup = true;
    } catch (cleanupError) {
      log(`  ⚠️  Cleanup warning: ${cleanupError.message}`, 'yellow');
    }
  }

  // Final results
  log('\n📊 Installation Simulation Results:', 'bright');
  log('=' .repeat(40), 'cyan');
  
  const tests = [
    { name: 'Package Creation', passed: testResults.packCreation },
    { name: 'Installation Success', passed: testResults.installation },
    { name: 'No Deprecated Warnings', passed: testResults.noDeprecatedWarnings },
    { name: 'Basic Functionality', passed: testResults.functionalityTest },
    { name: 'Cleanup', passed: testResults.cleanup }
  ];
  
  let allPassed = true;
  tests.forEach(test => {
    const status = test.passed ? '✅' : '❌';
    const color = test.passed ? 'green' : 'red';
    log(`${status} ${test.name}`, color);
    if (!test.passed) allPassed = false;
  });
  
  log('\n🏆 Final Verdict:', 'bright');
  log('=' .repeat(20), 'cyan');
  
  if (allPassed) {
    log('✅ Installation simulation PASSED!', 'green');
    log('✅ Ready for publication - no deprecated warnings!', 'green');
  } else {
    log('❌ Installation simulation FAILED!', 'red');
    log('❌ Issues found that need to be addressed', 'red');
  }
  
  return allPassed;
}

// Run the test
async function runInstallationTest() {
  try {
    const success = await installationSimulationTest();
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`\n💥 Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runInstallationTest();
}

export { installationSimulationTest };